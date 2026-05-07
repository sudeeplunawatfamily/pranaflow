import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { phaseOrder } from '../utils/phaseConfig';

export default function useBreathingEngine(settings, callbacks = {}) {
  const { inhaleSeconds, holdSeconds, exhaleSeconds, rounds, boxBreathing } = settings;
  const callbacksRef = useRef(callbacks);
  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);
  const runTokenRef = useRef(0);
  const pauseResolversRef = useRef([]);

  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [currentCount, setCurrentCount] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const totalDurationSeconds = useMemo(
    () => {
      const cycleTime = inhaleSeconds + holdSeconds + exhaleSeconds;
      const extraBoxHold = boxBreathing ? 4 : 0;
      return rounds * (cycleTime + extraBoxHold);
    },
    [inhaleSeconds, holdSeconds, exhaleSeconds, rounds, boxBreathing]
  );

  const getPhaseDuration = useCallback(
    (phase) => {
      if (phase === 'inhale') return inhaleSeconds;
      if (phase === 'hold') return holdSeconds;
      return exhaleSeconds;
    },
    [inhaleSeconds, holdSeconds, exhaleSeconds]
  );

  const phaseDuration = getPhaseDuration(currentPhase);
  const phaseProgress = Math.min(currentCount / phaseDuration, 1);
  const totalProgress = totalDurationSeconds === 0 ? 0 : Math.min(elapsedSeconds / totalDurationSeconds, 1);

  const resolvePauseWaiters = useCallback(() => {
    pauseResolversRef.current.forEach((resolve) => resolve());
    pauseResolversRef.current = [];
  }, []);

  const reset = useCallback(() => {
    runTokenRef.current += 1;
    isRunningRef.current = false;
    isPausedRef.current = false;
    resolvePauseWaiters();
    setCurrentPhase('inhale');
    setCurrentCount(1);
    setCurrentRound(1);
    setElapsedSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [resolvePauseWaiters]);

  const end = useCallback(() => {
    runTokenRef.current += 1;
    isRunningRef.current = false;
    isPausedRef.current = false;
    resolvePauseWaiters();
    setIsRunning(false);
    setIsPaused(false);
  }, [resolvePauseWaiters]);

  const pause = useCallback(() => {
    if (!isRunningRef.current || isPausedRef.current) return;
    isPausedRef.current = true;
    setIsPaused(true);
    callbacksRef.current.onPause?.();
  }, []);

  const resume = useCallback(() => {
    if (!isRunningRef.current || !isPausedRef.current) return;
    isPausedRef.current = false;
    setIsPaused(false);
    resolvePauseWaiters();
    callbacksRef.current.onResume?.();
  }, [resolvePauseWaiters]);

  const waitWhilePaused = useCallback(async (token) => {
    while (isPausedRef.current && isRunningRef.current && runTokenRef.current === token) {
      await new Promise((resolve) => {
        pauseResolversRef.current.push(resolve);
      });
    }
  }, []);

  const waitOneSecond = useCallback(async (token) => {
    let remaining = 1000;

    while (remaining > 0 && isRunningRef.current && runTokenRef.current === token) {
      await waitWhilePaused(token);

      if (!isRunningRef.current || runTokenRef.current !== token) {
        return false;
      }

      const step = Math.min(remaining, 100);
      await new Promise((resolve) => setTimeout(resolve, step));

      if (!isPausedRef.current) {
        remaining -= step;
      }
    }

    return isRunningRef.current && runTokenRef.current === token;
  }, [waitWhilePaused]);

  const start = useCallback(() => {
    if (isRunningRef.current) return; // guard against double-start (e.g. StrictMode double-invoke)
    const token = runTokenRef.current + 1;
    runTokenRef.current = token;
    isRunningRef.current = true;
    isPausedRef.current = false;

    setCurrentPhase('inhale');
    setCurrentCount(1);
    setCurrentRound(1);
    setElapsedSeconds(0);
    setIsPaused(false);
    setIsRunning(true);

    (async () => {
      await callbacksRef.current.onBeforeSessionStart?.();

      if (!isRunningRef.current || runTokenRef.current !== token) return;

      for (let round = 1; round <= rounds; round += 1) {
        setCurrentRound(round);
        callbacksRef.current.onRoundChange?.(round);

        // Build phase cycle for this round
        const phases = [
          { phase: 'inhale', duration: inhaleSeconds },
          { phase: 'hold', duration: holdSeconds },
          { phase: 'exhale', duration: exhaleSeconds },
        ];

        // Add second hold if box breathing is enabled
        if (boxBreathing) {
          phases.push({ phase: 'hold', duration: 4 });
        }

        for (const { phase, duration } of phases) {
          setCurrentPhase(phase);
          setCurrentCount(1);
          callbacksRef.current.onPhaseChange?.(phase);

          await waitWhilePaused(token);
          if (!isRunningRef.current || runTokenRef.current !== token) return;

          await callbacksRef.current.onBeforePhaseStart?.(phase);

          await waitWhilePaused(token);
          if (!isRunningRef.current || runTokenRef.current !== token) return;

          for (let count = 1; count <= duration; count += 1) {
            setCurrentCount(count);
            callbacksRef.current.onCount?.(count, duration, phase);

            const shouldContinue = await waitOneSecond(token);
            if (!shouldContinue) return;

            setElapsedSeconds((prev) => Math.min(prev + 1, totalDurationSeconds));
          }
        }
      }

      if (!isRunningRef.current || runTokenRef.current !== token) return;

      isRunningRef.current = false;
      isPausedRef.current = false;
      setIsRunning(false);
      setIsPaused(false);
      setElapsedSeconds(totalDurationSeconds);
      callbacksRef.current.onComplete?.({
        durationSeconds: totalDurationSeconds,
        rounds,
      });
    })();
  }, [getPhaseDuration, rounds, totalDurationSeconds, waitOneSecond, waitWhilePaused, inhaleSeconds, holdSeconds, exhaleSeconds, boxBreathing]);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(
    () => () => {
      runTokenRef.current += 1;
      isRunningRef.current = false;
      isPausedRef.current = false;
      resolvePauseWaiters();
    },
    [resolvePauseWaiters]
  );

  return {
    currentPhase,
    currentCount,
    currentRound,
    isRunning,
    isPaused,
    elapsedSeconds,
    totalDurationSeconds,
    phaseDuration,
    phaseProgress,
    totalProgress,
    start,
    pause,
    resume,
    end,
    reset,
  };
}
