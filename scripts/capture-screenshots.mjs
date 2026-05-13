import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screenshotsDir = path.join(projectRoot, 'screenshots');
const host = process.env.SCREENSHOT_HOST ?? '127.0.0.1';
const port = process.env.SCREENSHOT_PORT ?? '4173';
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? `http://${host}:${port}`;

const seededSettings = {
  inhaleSeconds: 2,
  holdSeconds: 2,
  exhaleSeconds: 2,
  rounds: 1,
  voiceEnabled: false,
  soundEnabled: false,
  boxBreathing: false,
  holdEnabled: true,
  breathGuideMode: 'off',
};

const seededStorage = {
  pranaflow_theme: 'day',
  pranaflow_settings: seededSettings,
  pranaflow_sessions: [],
  pranaflow_saved_rhythm: null,
  pranaflow_memory: { lastRhythm: null },
};

function startDevServer() {
  const child = spawn(
    'npm',
    ['run', 'dev', '--', '--host', host, '--port', port],
    {
      cwd: projectRoot,
      stdio: 'pipe',
      shell: process.platform === 'win32',
    }
  );

  child.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  return child;
}

async function waitForServer(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for dev server at ${url}`);
}

async function capture(page, fileName, options = {}) {
  const filePath = path.join(screenshotsDir, fileName);

  const appShell = page.locator('main.w-full');
  if (await appShell.count()) {
    await appShell.first().screenshot({
      path: filePath,
      animations: 'disabled',
    });
  } else {
    // Fallback: capture the full document when the shell selector is unavailable.
    await page.screenshot({
      path: filePath,
      fullPage: options.fullPage ?? true,
      animations: 'disabled',
    });
  }

  console.log(`Saved ${path.relative(projectRoot, filePath)}`);
}

async function seedAppState(page) {
  await page.addInitScript((storage) => {
    for (const [key, value] of Object.entries(storage)) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, seededStorage);
}

async function waitForText(page, text, timeout = 20000) {
  await page.waitForTimeout(500); // Delay for page transitions and DOM updates
  try {
    await page.getByText(text, { exact: true }).waitFor({ timeout });
  } catch {
    // Text not found exactly, continue anyway
  }
}

async function waitForHeading(page, text, timeout = 20000) {
  await page.waitForTimeout(400);
  try {
    await page.locator(`h1, h2, h3, h4, h5, h6`).filter({ hasText: new RegExp(text, 'i') }).first().waitFor({ timeout });
  } catch {
    // Heading not found, continue
  }
}

async function main() {
  await rm(screenshotsDir, { recursive: true, force: true });
  await mkdir(screenshotsDir, { recursive: true });

  const server = startDevServer();
  let browser;

  const shutdown = async (exitCode = 0) => {
    if (browser) {
      await browser.close().catch(() => {});
    }

    if (server && !server.killed) {
      server.kill('SIGTERM');
    }

    process.exit(exitCode);
  };

  process.on('SIGINT', () => {
    void shutdown(130);
  });

  process.on('SIGTERM', () => {
    void shutdown(143);
  });

  try {
    await waitForServer(baseUrl);

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      colorScheme: 'light',
    });

    const page = await context.newPage();
    await seedAppState(page);
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    
    console.log('Page loaded, starting screenshot captures...');

    // === SCREEN 1: HOME ===
    await page.waitForTimeout(500);
    await capture(page, '01-home.png');
    console.log('✓ Captured home screen');

    // === SCREEN 2: SETUP (Design Your Flow - Step 0) ===
    try {
      const setupBtn = page.getByRole('button', { name: 'Create Your Breath Flow' });
      if ((await setupBtn.count()) > 0) {
        await setupBtn.click();
        await page.waitForTimeout(800);
        
        // Wait for Setup screen to load (should be on Step 0: Design Your Flow)
        await page.locator('h2').filter({ hasText: /Design Your Flow|Customize Each Phase/ }).first().waitFor({ timeout: 15000 });
        await page.waitForTimeout(300);
        await capture(page, '02-setup-step0.png');
        console.log('✓ Captured setup step 0 (Design Your Flow)');
      }
    } catch (e) {
      console.log('! Error capturing setup step 0:', e.message);
    }

    // === SCREEN 3: PRESETS ===
    try {
      // Look for back button more robustly
      const backButtons = page.locator('button[aria-label*="back"], button[aria-label*="Back"], button:has-text("Back")');
      if ((await backButtons.count()) > 0) {
        await backButtons.first().click();
        await page.waitForTimeout(900);
        console.log('✓ Clicked back button');
        
        // Should be back on home, now click Explore Presets
        const presetsBtn = page.getByRole('button', { name: 'Explore Presets' });
        if ((await presetsBtn.count()) > 0) {
          await presetsBtn.click();
          await page.waitForTimeout(800);
          
          // Wait for presets screen
          await page.locator('h1, h2, h3').filter({ hasText: /Preset|Breath|Calm|Focus/ }).first().waitFor({ timeout: 15000 });
          await page.waitForTimeout(300);
          await capture(page, '03-presets.png');
          console.log('✓ Captured presets screen');
        } else {
          console.log('! Could not find Explore Presets button');
        }
      } else {
        console.log('! Could not find back button');
      }
    } catch (e) {
      console.log('! Error navigating to presets:', e.message);
    }

    // === SETUP: Full flow through to session ===
    try {
      // Go back to home first
      const backButtons2 = page.locator('button[aria-label*="back"], button[aria-label*="Back"], button:has-text("Back")');
      if ((await backButtons2.count()) > 0) {
        await backButtons2.first().click();
        await page.waitForTimeout(900);
      }
      
      const setupBtn2 = page.getByRole('button', { name: 'Create Your Breath Flow' });
      if ((await setupBtn2.count()) > 0) {
        await setupBtn2.click();
        await page.waitForTimeout(800);
        
        // Wait for step 0
        await page.locator('h2').filter({ hasText: 'Design Your Flow' }).waitFor({ timeout: 15000 });
        await page.waitForTimeout(300);
        
        // Click Continue to Customize (Step 0 -> 1)
        const continueBtn = page.getByRole('button', { name: 'Continue to Customize' });
        if ((await continueBtn.count()) > 0) {
          await continueBtn.click();
          await page.waitForTimeout(900);
          
          // Wait for Step 1
          await page.locator('h2').filter({ hasText: 'Customize Each Phase' }).waitFor({ timeout: 15000 });
          await page.waitForTimeout(300);
          await capture(page, '04-setup-step1.png');
          console.log('✓ Captured setup step 1 (Customize Each Phase)');
          
          // Click Save & Continue (Step 1 -> 2)
          const saveBtn = page.getByRole('button', { name: 'Save & Continue' });
          if ((await saveBtn.count()) > 0) {
            await saveBtn.click();
            await page.waitForTimeout(900);
            
            // Wait for Step 2
            await page.locator('h2').filter({ hasText: 'Review Your Flow' }).waitFor({ timeout: 15000 });
            await page.waitForTimeout(300);
            await capture(page, '05-setup-step2.png');
            console.log('✓ Captured setup step 2 (Review Your Flow)');
            
            // Click Begin This Flow to start session
            const beginBtn = page.getByRole('button', { name: 'Begin This Flow' });
            if ((await beginBtn.count()) > 0) {
              await beginBtn.click();
              await page.waitForTimeout(1200);
              
              // === SESSION SCREENS ===
              // Try to capture intro screen
              try {
                const introHeading = page.locator('h1, h2').filter({ hasText: /Welcome|Intro|Ready/ }).first();
                await introHeading.waitFor({ timeout: 8000 });
                await page.waitForTimeout(300);
                await capture(page, '06-session-intro.png');
                console.log('✓ Captured session intro');
                
                // Skip intro if button exists
                const skipBtn = page.getByRole('button', { name: /Skip|Next/ });
                if ((await skipBtn.count()) > 0) {
                  await skipBtn.click();
                  await page.waitForTimeout(800);
                }
              } catch {
                console.log('! No intro screen found');
              }
              
              // Try to capture countdown screen
              try {
                const countdownText = page.locator('text=/Get ready|Prepare|Countdown/');
                await countdownText.first().waitFor({ timeout: 8000 });
                await page.waitForTimeout(300);
                await capture(page, '07-session-countdown.png');
                console.log('✓ Captured session countdown');
              } catch {
                console.log('! No countdown screen found');
              }
              
              // Capture active session
              try {
                const pauseBtn = page.locator('button').filter({ hasText: /Pause/ }).first();
                await pauseBtn.waitFor({ timeout: 12000 });
                await page.waitForTimeout(300);
                await capture(page, '08-session-active.png');
                console.log('✓ Captured active session');
              } catch {
                console.log('! No active session found');
              }
              
              // Try to capture completion screen (wait longer)
              try {
                const completeText = page.locator('h1, h2').filter({ hasText: /Complete|Done|Finished|Great job/ }).first();
                await completeText.waitFor({ timeout: 40000 });
                await page.waitForTimeout(500);
                await capture(page, '09-session-complete.png');
                console.log('✓ Captured session complete');
              } catch {
                console.log('! Session still running or no completion screen');
              }
            } else {
              console.log('! Could not find Begin This Flow button');
            }
          } else {
            console.log('! Could not find Save & Continue button');
          }
        } else {
          console.log('! Could not find Continue to Customize button');
        }
      } else {
        console.log('! Could not find Create Your Breath Flow button');
      }
    } catch (e) {
      console.log('! Error in setup flow:', e.message);
    }

    await context.close();
    await shutdown(0);
  } catch (error) {
    console.error('Screenshot capture error:', error);
    await shutdown(1);
  }
}

await main();