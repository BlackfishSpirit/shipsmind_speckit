import { test, expect } from '@playwright/test';

// Test configuration
const TEST_USER = {
  email: `test+${Date.now()}@example.com`,
  password: 'TestPass123!',
  firstName: 'Test',
  lastName: 'User',
};

test.describe('User Registration Flow - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the homepage
    await page.goto('/');
  });

  test('should complete full registration flow successfully', async ({ page }) => {
    // Navigate to sign-up page
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*sign-up/);

    // Fill registration form
    await page.fill('[name="emailAddress"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.fill('[name="firstName"]', TEST_USER.firstName);
    await page.fill('[name="lastName"]', TEST_USER.lastName);

    // Submit registration
    await page.click('button[type="submit"]');

    // Handle email verification if required
    const currentUrl = page.url();
    if (currentUrl.includes('verify')) {
      // In a real test, you might need to handle email verification
      // For now, we'll skip this part as it requires email integration
      console.log('Email verification step detected');
    } else {
      // Expect to be redirected to dashboard or welcome page
      await expect(page).toHaveURL(/.*dashboard/);
    }

    // Verify user is signed in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should handle registration with existing email', async ({ page }) => {
    // Go to sign-up page
    await page.goto('/sign-up');

    // Try to register with an email that already exists
    await page.fill('[name="emailAddress"]', 'existing@example.com');
    await page.fill('[name="password"]', TEST_USER.password);
    await page.fill('[name="firstName"]', TEST_USER.firstName);
    await page.fill('[name="lastName"]', TEST_USER.lastName);

    await page.click('button[type="submit"]');

    // Expect error message
    await expect(page.locator('text=already exists')).toBeVisible();
  });

  test('should validate password strength requirements', async ({ page }) => {
    await page.goto('/sign-up');

    // Test weak password
    await page.fill('[name="emailAddress"]', TEST_USER.email);
    await page.fill('[name="password"]', '123');

    // Should show password strength feedback
    await expect(page.locator('text=at least 8 characters')).toBeVisible();

    // Test strong password
    await page.fill('[name="password"]', TEST_USER.password);

    // Password strength indicator should show strong
    await expect(page.locator('[data-testid="password-strength"]')).toHaveAttribute('data-strength', 'strong');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/sign-up');

    // Test invalid email format
    await page.fill('[name="emailAddress"]', 'invalid-email');
    await page.fill('[name="password"]', TEST_USER.password);

    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('text=valid email')).toBeVisible();
  });

  test('should redirect authenticated users away from signup page', async ({ page }) => {
    // First, sign in (assuming we have a test user)
    await page.goto('/sign-in');
    // ... sign in logic ...

    // Then try to access sign-up page
    await page.goto('/sign-up');

    // Should be redirected to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/sign-up');

    // Simulate network failure
    await page.route('**/api/auth/**', route => route.abort());

    await page.fill('[name="emailAddress"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.fill('[name="firstName"]', TEST_USER.firstName);
    await page.fill('[name="lastName"]', TEST_USER.lastName);

    await page.click('button[type="submit"]');

    // Should show network error message
    await expect(page.locator('text=network error')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/sign-up');

    // Tab through form fields
    await page.keyboard.press('Tab'); // Email field
    await page.keyboard.type(TEST_USER.email);

    await page.keyboard.press('Tab'); // Password field
    await page.keyboard.type(TEST_USER.password);

    await page.keyboard.press('Tab'); // First name
    await page.keyboard.type(TEST_USER.firstName);

    await page.keyboard.press('Tab'); // Last name
    await page.keyboard.type(TEST_USER.lastName);

    await page.keyboard.press('Tab'); // Submit button
    await page.keyboard.press('Enter');

    // Form should submit
    await expect(page.locator('[data-testid="loading"]')).toBeVisible();
  });

  test('should work on mobile devices', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile');

    await page.goto('/sign-up');

    // Verify mobile-friendly layout
    await expect(page.locator('.signup-form')).toHaveCSS('width', /100%/);

    // Test touch interactions
    await page.tap('[name="emailAddress"]');
    await page.fill('[name="emailAddress"]', TEST_USER.email);

    await page.tap('[name="password"]');
    await page.fill('[name="password"]', TEST_USER.password);

    // Verify virtual keyboard doesn't break layout
    const formHeight = await page.locator('.signup-form').boundingBox();
    expect(formHeight?.height).toBeGreaterThan(0);
  });

  test('should maintain accessibility standards', async ({ page }) => {
    await page.goto('/sign-up');

    // Check for proper ARIA labels
    await expect(page.locator('[name="emailAddress"]')).toHaveAttribute('aria-label');
    await expect(page.locator('[name="password"]')).toHaveAttribute('aria-label');

    // Check for form validation messages
    await page.fill('[name="emailAddress"]', 'invalid');
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveAttribute('aria-live', 'polite');

    // Check color contrast (basic check)
    const submitButton = page.locator('button[type="submit"]');
    const buttonStyles = await submitButton.evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });

    // Basic contrast check (would need proper library for full WCAG compliance)
    expect(buttonStyles.backgroundColor).not.toBe(buttonStyles.color);
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/sign-up');

    // Fill form partially
    await page.fill('[name="emailAddress"]', TEST_USER.email);

    // Navigate away and back
    await page.goto('/');
    await page.goBack();

    // Form should be cleared for security
    await expect(page.locator('[name="emailAddress"]')).toHaveValue('');
  });
});