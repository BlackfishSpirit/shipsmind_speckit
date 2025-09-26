import { test, expect } from '@playwright/test';

test.describe('Session Management - E2E', () => {
  const TEST_USER = {
    email: 'test.user@example.com',
    password: 'TestPass123!',
  };

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/sign-in');
    await page.fill('[name="identifier"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show session timeout warning at 25 minutes', async ({ page }) => {
    // Mock the session to be close to expiring
    await page.addInitScript(() => {
      // Override session timeout for testing
      window.__TEST_SESSION_TIMEOUT = 5000; // 5 seconds for testing
      window.__TEST_WARNING_TIME = 2000; // 2 seconds before expiry
    });

    // Wait for warning to appear
    await expect(page.locator('[data-testid="session-warning"]')).toBeVisible({ timeout: 30000 });

    // Check warning content
    await expect(page.locator('text=session.*expiring')).toBeVisible();
    await expect(page.locator('text=minutes')).toBeVisible();
    await expect(page.locator('button:has-text("Extend Session")')).toBeVisible();
  });

  test('should auto-logout after session expires', async ({ page }) => {
    // Mock session to expire quickly
    await page.addInitScript(() => {
      window.__TEST_SESSION_TIMEOUT = 3000; // 3 seconds
    });

    // Wait for auto-logout
    await expect(page).toHaveURL(/.*sign-in/, { timeout: 10000 });

    // Should show session expired message
    await expect(page.locator('text=logged out.*inactivity')).toBeVisible();
  });

  test('should extend session on user activity', async ({ page }) => {
    // Mock session timeout
    await page.addInitScript(() => {
      window.__TEST_SESSION_TIMEOUT = 10000; // 10 seconds
      window.__TEST_WARNING_TIME = 5000; // 5 seconds warning
    });

    // Simulate user activity
    await page.mouse.move(100, 100);
    await page.keyboard.press('Space');
    await page.click('body');

    // Wait past original timeout
    await page.waitForTimeout(8000);

    // Should still be logged in due to activity
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should handle manual session extension', async ({ page }) => {
    // Mock session timeout
    await page.addInitScript(() => {
      window.__TEST_SESSION_TIMEOUT = 5000; // 5 seconds
      window.__TEST_WARNING_TIME = 2000; // 2 seconds warning
    });

    // Wait for warning
    await expect(page.locator('[data-testid="session-warning"]')).toBeVisible({ timeout: 10000 });

    // Click extend session
    await page.click('button:has-text("Extend Session")');

    // Warning should disappear
    await expect(page.locator('[data-testid="session-warning"]')).not.toBeVisible();

    // Should remain logged in
    await page.waitForTimeout(8000);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle multiple tab session management', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // Login in first tab
    await page1.goto('/sign-in');
    await page1.fill('[name="identifier"]', TEST_USER.email);
    await page1.fill('[name="password"]', TEST_USER.password);
    await page1.click('button[type="submit"]');
    await expect(page1).toHaveURL(/.*dashboard/);

    // Second tab should also be authenticated
    await page2.goto('/dashboard');
    await expect(page2.locator('[data-testid="user-menu"]')).toBeVisible();

    // Logout from first tab
    await page1.click('[data-testid="user-menu"]');
    await page1.click('text=Log out');

    // Second tab should also be logged out
    await page2.reload();
    await expect(page2).toHaveURL(/.*sign-in/);

    await context.close();
  });

  test('should persist session across browser refresh', async ({ page }) => {
    // Verify logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Refresh page
    await page.reload();

    // Should still be logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle session timeout during API calls', async ({ page }) => {
    // Mock API to return 401 (session expired)
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
        headers: { 'Content-Type': 'application/json' },
      });
    });

    // Try to perform an action that makes API call
    await page.click('[data-testid="refresh-data"]');

    // Should be redirected to login
    await expect(page).toHaveURL(/.*sign-in/, { timeout: 10000 });

    // Should show appropriate message
    await expect(page.locator('text=session.*expired')).toBeVisible();
  });

  test('should show countdown timer in session warning', async ({ page }) => {
    // Mock session timeout
    await page.addInitScript(() => {
      window.__TEST_SESSION_TIMEOUT = 6000; // 6 seconds
      window.__TEST_WARNING_TIME = 3000; // 3 seconds warning
    });

    // Wait for warning
    await expect(page.locator('[data-testid="session-warning"]')).toBeVisible({ timeout: 10000 });

    // Should show countdown
    const countdown = page.locator('[data-testid="session-countdown"]');
    await expect(countdown).toBeVisible();

    // Countdown should be decreasing
    const initialTime = await countdown.textContent();
    await page.waitForTimeout(1000);
    const laterTime = await countdown.textContent();

    expect(initialTime).not.toBe(laterTime);
  });

  test('should handle concurrent login sessions', async ({ browser }) => {
    // Create two different browser contexts (different users)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Login with same user in both contexts
    for (const page of [page1, page2]) {
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/.*dashboard/);
    }

    // Both sessions should work independently
    await expect(page1.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page2.locator('[data-testid="user-menu"]')).toBeVisible();

    await context1.close();
    await context2.close();
  });

  test('should maintain session state during navigation', async ({ page }) => {
    // Navigate through different pages
    const pages = ['/dashboard', '/dashboard/profile', '/dashboard/settings'];

    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      await expect(page).toHaveURL(new RegExp(pageUrl.replace('/', '\\/')));
    }
  });

  test('should handle browser close and reopen', async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'tests/fixtures/logged-in-state.json', // Pre-saved login state
    });

    const page = await context.newPage();
    await page.goto('/dashboard');

    // Should be logged in from saved state
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    await context.close();
  });

  test('should handle session expiry gracefully during form submission', async ({ page }) => {
    // Navigate to a form page
    await page.goto('/dashboard/profile');

    // Start filling a form
    await page.fill('[name="firstName"]', 'Updated Name');

    // Mock session expiry
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'Session expired' }),
        headers: { 'Content-Type': 'application/json' },
      });
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Should show session expired error
    await expect(page.locator('text=session.*expired')).toBeVisible();

    // Should offer to sign in again
    await expect(page.locator('button:has-text("Sign In Again")')).toBeVisible();
  });
});