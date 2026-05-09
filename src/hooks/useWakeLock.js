import { useCallback, useEffect, useRef } from 'react';

/**
 * Prevents the screen from dimming or locking while the app is active.
 * Uses the Screen Wake Lock API (supported on iOS Safari 16.4+ and Android Chrome).
 * Gracefully no-ops on unsupported browsers.
 *
 * @param {boolean} active - When true, acquires the wake lock. When false, releases it.
 */
export default function useWakeLock(active) {
  const wakeLockRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  const acquire = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    if (wakeLockRef.current) return; // already held

    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');

      wakeLockRef.current.addEventListener('release', () => {
        // The lock was released externally (e.g. user switched apps).
        // Clear the ref so we can re-acquire when the page becomes visible again.
        wakeLockRef.current = null;
      });
    } catch {
      // Silently ignore — wake lock may be denied or unavailable.
      wakeLockRef.current = null;
    }
  }, []);

  const release = useCallback(async () => {
    if (!wakeLockRef.current) return;

    try {
      await wakeLockRef.current.release();
    } catch {
      // Ignore release errors.
    }
    wakeLockRef.current = null;
  }, []);

  // Acquire or release when `active` changes.
  useEffect(() => {
    if (active) {
      acquire();
    } else {
      release();
    }

    return () => {
      // Release on unmount regardless.
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [active, acquire, release]);

  // Re-acquire when the page becomes visible again (wake lock is auto-released
  // when the browser tab is hidden or the user switches apps).
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && activeRef.current) {
        acquire();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [acquire]);
}
