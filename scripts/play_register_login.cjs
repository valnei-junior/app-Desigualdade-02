const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

console.log('Playwright test starting...');

const runWithTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout: ${label}`)), ms)),
  ]);

(async () => {
  const logs = [];
  const errors = [];
  const pageErrors = [];
  const outputPath = path.join(__dirname, 'play_register_login.log.json');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  page.setDefaultNavigationTimeout(5000);

  page.on('console', (msg) => {
    logs.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
  });
  page.on('requestfailed', (req) => {
    errors.push({ url: req.url(), failure: req.failure() && req.failure().errorText });
  });

  try {
    const testRole = (process.env.TEST_ROLE || 'STUDENT').toUpperCase();

    await runWithTimeout(
      page.goto('http://localhost:5173/cadastro', { waitUntil: 'domcontentloaded' }),
      10000,
      'goto /cadastro'
    );

    // Select role when requested
    if (testRole === 'ADMIN') {
      const adminRadio = await page.$('#role-ADMIN');
      if (adminRadio) {
        await adminRadio.click();
      }
    }

    // Fill basic fields for a student
    const email = `pw-test-${Date.now()}@local.test`;
    const password = '123456';

    await page.fill('#name', 'Playwright Test');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);
    const ageInput = await page.$('#age');
    if (ageInput) {
      await page.fill('#age', '25');
    }

    // Select area
    const comboBoxes = await page.$$('[role="combobox"]');
    if (comboBoxes.length >= 1) {
      await comboBoxes[0].click();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }

    // Select education
    // second select on the page, find by placeholder
    if (comboBoxes.length >= 2) {
      await comboBoxes[1].click();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }

    // Check a job type
    const jobType = await page.$('#jobType-CLT');
    if (jobType) {
      await jobType.click();
    }

    // Submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Attempt login with the same credentials
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // wait briefly
    await page.waitForTimeout(1000);

    const output = {
      logs,
      pageErrors,
      requestFailures: errors,
      timestamp: new Date().toISOString(),
    };
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  } catch (e) {
    fs.writeFileSync(outputPath, JSON.stringify({ error: String(e) }, null, 2), 'utf-8');
    console.error('TEST ERROR', e);
  } finally {
    await browser.close();
    console.log('Playwright test finished.');
  }
})();
