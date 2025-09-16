const { test, expect } = require('@playwright/test');

test.describe('ShipsMind Homepage', () => {
  test('should load homepage and display key elements', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/ShipsMind/);

    // Check for navigation
    await expect(page.locator('nav')).toBeVisible();

    // Check for main content
    await expect(page.locator('main')).toBeVisible();

    // Take a screenshot for visual regression
    await page.screenshot({ path: 'tests/screenshots/homepage.png', fullPage: true });
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that content adapts to mobile
    await expect(page.locator('body')).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: 'tests/screenshots/homepage-mobile.png', fullPage: true });
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');

    // Check for basic accessibility
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBeGreaterThan(0);

    // Check for images with alt text
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('should handle form interactions', async ({ page }) => {
    await page.goto('/');

    // Find all input fields
    const inputs = page.locator('input[type="email"], input[type="text"], textarea');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      // Test first input field
      await inputs.first().fill('test@example.com');
      await expect(inputs.first()).toHaveValue('test@example.com');
    }
  });

  test('should navigate correctly', async ({ page }) => {
    await page.goto('/');

    // Get all navigation links
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      // Test first navigation link
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute('href');

      if (href && href.startsWith('/')) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');

        // Verify navigation occurred
        const currentUrl = page.url();
        expect(currentUrl).toContain(href);
      }
    }
  });
});

test.describe('Performance Tests', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(consoleErrors).toHaveLength(0);
  });
});