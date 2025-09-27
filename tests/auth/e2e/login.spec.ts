import { test, expect } from '@playwright/test';

// Test configuration
const TEST_USER = {
  email: 'test.user@example.com',
  password: 'TestPass123!',
  invalidPassword: 'wrongpassword',
};

test.describe('User Login Flow - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the homepage
    await page.goto('/');
  });

  test('should complete login flow successfully', async ({ page }) => {
    // Navigate to sign-in page
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*sign-in/);

    // Verify sign-in form is visible
    await expect(page.locator('[data-testid="signin-form"]')).toBeVisible();

    // Fill login credentials
    await page.fill('[name="identifier"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);

    // Submit login form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Verify user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page.locator(`text=${TEST_USER.email}`)).toBeVisible();
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    // Try login with wrong password
    await page.fill('[name="identifier"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.invalidPassword);

    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=incorrect')).toBeVisible();

    // Should remain on sign-in page
    await expect(page).toHaveURL(/.*sign-in/);

    // Form should be cleared for security
    await expect(page.locator('[name="password"]')).toHaveValue('');
  });

  test('should handle account lockout after 5 failed attempts', async ({ page }) => {
    await page.goto('/sign-in');

    // Attempt 5 failed logins
    for (let i = 0; i < 5; i++) {
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', 'wrongpassword' + i);
      await page.click('button[type="submit"]');

      if (i < 4) {
        // First 4 attempts should show password error
        await expect(page.locator('text=incorrect')).toBeVisible();
      }
    }

    // 5th attempt should show account locked message
    await expect(page.locator('text=account.*locked')).toBeVisible();
    await expect(page.locator('text=30 minutes')).toBeVisible();

    // Login form should be disabled
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('should redirect to intended destination after login', async ({ page }) => {
    // Try to access protected page while not authenticated
    await page.goto('/dashboard/settings');

    // Should be redirected to sign-in with return URL
    await expect(page).toHaveURL(/.*sign-in.*redirect_url/);

    // Login
    await page.fill('[name="identifier"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Should be redirected to original destination
    await expect(page).toHaveURL(/.*dashboard\/settings/);
  });

  test('should handle email verification requirement during login', async ({ page }) => {
    await page.goto('/sign-in');

    // Login with unverified account
    await page.fill('[name="identifier"]', 'unverified@example.com');
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Should show verification requirement
    await expect(page.locator('text=verify.*email')).toBeVisible();
    await expect(page.locator('button:has-text("Send Verification")')).toBeVisible();

    // Test verification flow
    await page.click('button:has-text("Send Verification")');
    await expect(page.locator('text=verification.*sent')).toBeVisible();
  });

  test('should maintain session across page navigation', async ({ page }) => {
    // Login first
    await page.goto('/sign-in');
    await page.fill('[name="identifier"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to different pages
    await page.goto('/dashboard/profile');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    await page.goto('/dashboard/settings');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Navigate back to homepage
    await page.goto('/');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should redirect authenticated users away from login page', async ({ page }) => {
    // First login
    await page.goto('/sign-in');
    await page.fill('[name="identifier"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);

    // Try to access sign-in page again
    await page.goto('/sign-in');

    // Should be redirected away from sign-in
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle remember me functionality', async ({ page }) => {
    await page.goto('/sign-in');

    // Check remember me option
    const rememberCheckbox = page.locator('[name="rememberMe"]');
    if (await rememberCheckbox.isVisible()) {
      await rememberCheckbox.check();
      await expect(rememberCheckbox).toBeChecked();
    }

    // Login
    await page.fill('[name="identifier"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);

    // Close and reopen browser (simulate browser restart)
    await page.context().close();
    const newContext = await page.context().browser()?.newContext();
    const newPage = await newContext?.newPage();

    if (newPage) {
      await newPage.goto('/dashboard');
      // Should still be logged in if remember me was checked
      await expect(newPage.locator('[data-testid="user-menu"]')).toBeVisible();
    }
  });

  test('should clear error states on new login attempt', async ({ page }) => {
    await page.goto('/sign-in');

    // First failed attempt
    await page.fill('[name="identifier"]', TEST_USER.email);
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=incorrect')).toBeVisible();

    // Start new attempt - error should clear
    await page.fill('[name="identifier"]', TEST_USER.email);
    await expect(page.locator('text=incorrect')).not.toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/sign-in');

    // Tab through form
    await page.keyboard.press('Tab'); // Email field
    await page.keyboard.type(TEST_USER.email);

    await page.keyboard.press('Tab'); // Password field
    await page.keyboard.type(TEST_USER.password);

    await page.keyboard.press('Tab'); // Remember me (if exists)
    await page.keyboard.press('Tab'); // Submit button
    await page.keyboard.press('Enter');

    // Should submit form
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
  });

  test('should work on mobile devices', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile');

    await page.goto('/sign-in');

    // Verify mobile layout
    const form = page.locator('[data-testid="signin-form"]');
    await expect(form).toHaveCSS('width', /100%/);

    // Test touch interactions
    await page.tap('[name="identifier"]');
    await page.fill('[name="identifier"]', TEST_USER.email);

    await page.tap('[name="password"]');
    await page.fill('[name="password"]', TEST_USER.password);

    await page.tap('button[type="submit"]');

    // Should work on mobile
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test('should handle network connectivity issues', async ({ page }) => {
    await page.goto('/sign-in');

    // Fill form
    await page.fill('[name="identifier"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);

    // Simulate network failure
    await page.route('**/api/**', route => route.abort());

    await page.click('button[type="submit"]');

    // Should show network error
    await expect(page.locator('text=network.*error')).toBeVisible();

    // Should show retry option
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();

    // Restore network and retry
    await page.unroute('**/api/**');
    await page.click('button:has-text("Retry")');

    // Should succeed
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
  });

  test('should show password visibility toggle', async ({ page }) => {
    await page.goto('/sign-in');

    const passwordField = page.locator('[name="password"]');
    const toggleButton = page.locator('[data-testid="password-toggle"]');

    // Initially password should be hidden
    await expect(passwordField).toHaveAttribute('type', 'password');

    // Fill password
    await passwordField.fill(TEST_USER.password);

    // Click toggle to show password
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(passwordField).toHaveAttribute('type', 'text');

      // Click again to hide
      await toggleButton.click();
      await expect(passwordField).toHaveAttribute('type', 'password');
    }
  });
});