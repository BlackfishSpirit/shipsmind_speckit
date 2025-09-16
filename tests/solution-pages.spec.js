const { test, expect } = require('@playwright/test');

test.describe('Solution Pages Design Review', () => {
  const solutionPages = [
    { path: '/solutions', name: 'Solutions Overview' },
    { path: '/solutions/retail', name: 'Retail Solutions' },
    { path: '/solutions/marketing', name: 'Marketing Solutions' },
    { path: '/solutions/accounting', name: 'Accounting Solutions' },
    { path: '/solutions/trades', name: 'Trades Solutions' }
  ];

  solutionPages.forEach(({ path, name }) => {
    test(`${name} should load and display correctly`, async ({ page }) => {
      await page.goto(path);

      // Take full page screenshot for design review
      await page.screenshot({
        path: `tests/screenshots/${name.toLowerCase().replace(' ', '-')}.png`,
        fullPage: true
      });

      // Basic structure checks
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main, div[class*="min-h-screen"]')).toBeVisible();

      // Check for no console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Wait for content to fully load
      await page.waitForLoadState('networkidle');

      expect(consoleErrors).toHaveLength(0);
    });

    test(`${name} should be responsive on mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(path);

      // Take mobile screenshot
      await page.screenshot({
        path: `tests/screenshots/${name.toLowerCase().replace(' ', '-')}-mobile.png`,
        fullPage: true
      });

      // Check that content doesn't overflow horizontally
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375);
    });

    test(`${name} should be accessible`, async ({ page }) => {
      await page.goto(path);

      // Check heading hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).toBeDefined();
      }

      // Check for interactive elements keyboard accessibility
      const buttons = page.locator('button, a[href]');
      const buttonCount = await buttons.count();

      if (buttonCount > 0) {
        // Focus first interactive element
        await buttons.first().focus();
        const focusedElement = await page.evaluate(() => document.activeElement.tagName);
        expect(['BUTTON', 'A'].includes(focusedElement)).toBeTruthy();
      }
    });
  });

  test('Solutions overview should link to detail pages', async ({ page }) => {
    await page.goto('/solutions');

    // Find all "Learn More" buttons
    const learnMoreButtons = page.locator('a:has-text("Learn More")');
    const buttonCount = await learnMoreButtons.count();

    expect(buttonCount).toBeGreaterThan(0);

    // Test first Learn More button
    if (buttonCount > 0) {
      const firstButton = learnMoreButtons.first();
      const href = await firstButton.getAttribute('href');

      expect(href).toMatch(/\/solutions\/(retail|marketing|accounting|trades)/);

      // Navigate and verify
      await firstButton.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl).toContain(href);
    }
  });

  test('Homepage Learn More buttons should work', async ({ page }) => {
    await page.goto('/');

    // Find Learn More buttons in the solutions section
    const solutionsSection = page.locator('#solutions, section:has-text("Industry-Specific")');
    const learnMoreButtons = solutionsSection.locator('a:has-text("Learn More")');
    const buttonCount = await learnMoreButtons.count();

    expect(buttonCount).toBeGreaterThan(0);

    // Test navigation to first solution detail page
    if (buttonCount > 0) {
      const firstButton = learnMoreButtons.first();
      const href = await firstButton.getAttribute('href');

      expect(href).toMatch(/\/solutions\/(retail|marketing|accounting|trades)/);

      await firstButton.click();
      await page.waitForLoadState('networkidle');

      // Should be on a solution detail page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/solutions/');

      // Should have detailed content
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('section')).toHaveCount.greaterThan(2);
    }
  });
});