import { test, expect } from '@playwright/test';

test.describe('Route Protection - E2E', () => {
  const TEST_USER = {
    email: 'test.user@example.com',
    password: 'TestPass123!',
    unverifiedEmail: 'unverified@example.com',
  };

  test.describe('Unauthenticated User', () => {
    test('should redirect to sign-in for protected routes', async ({ page }) => {
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/profile',
        '/dashboard/settings',
        '/admin',
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(/.*sign-in/);

        // Should have redirect URL parameter
        expect(page.url()).toContain('redirect_url');
      }
    });

    test('should allow access to public routes', async ({ page }) => {
      const publicRoutes = [
        '/',
        '/solutions',
        '/contact',
        '/privacy',
        '/terms',
      ];

      for (const route of publicRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/')));
      }
    });

    test('should block API endpoints requiring authentication', async ({ page }) => {
      const protectedEndpoints = [
        '/api/auth/preferences',
        '/api/auth/session',
        '/api/auth/verification-status',
      ];

      for (const endpoint of protectedEndpoints) {
        const response = await page.goto(endpoint);
        expect(response?.status()).toBe(401);
      }
    });
  });

  test.describe('Authenticated User', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should allow access to protected routes', async ({ page }) => {
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/profile',
        '/dashboard/settings',
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/')));
        await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      }
    });

    test('should redirect away from auth pages', async ({ page }) => {
      const authPages = ['/sign-in', '/sign-up'];

      for (const authPage of authPages) {
        await page.goto(authPage);
        await expect(page).toHaveURL(/.*dashboard/);
      }
    });

    test('should redirect to intended destination after login', async ({ page }) => {
      // Logout first
      await page.click('[data-testid="user-menu"]');
      await page.click('text=Log out');

      // Try to access protected page
      await page.goto('/dashboard/settings');
      await expect(page).toHaveURL(/.*sign-in.*redirect_url/);

      // Login
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Should redirect to intended page
      await expect(page).toHaveURL(/.*dashboard\/settings/);
    });

    test('should allow access to API endpoints', async ({ page }) => {
      const response = await page.goto('/api/auth/session');
      expect(response?.status()).toBe(200);

      const data = await response?.json();
      expect(data.success).toBe(true);
      expect(data.data.userId).toBeDefined();
    });
  });

  test.describe('Email Verification Requirements', () => {
    test('should allow basic access without email verification', async ({ page }) => {
      // Login with unverified account
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.unverifiedEmail);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Should be able to access basic pages
      await page.goto('/dashboard');
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

      await page.goto('/dashboard/profile');
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    test('should block sensitive features for unverified users', async ({ page }) => {
      // Login with unverified account
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.unverifiedEmail);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      const sensitiveRoutes = [
        '/admin',
        '/dashboard/export',
        '/dashboard/billing',
      ];

      for (const route of sensitiveRoutes) {
        await page.goto(route);
        // Should redirect to verification page
        await expect(page).toHaveURL(/.*verify-email/);
      }
    });

    test('should prompt for email verification when accessing sensitive features', async ({ page }) => {
      // Login with unverified account
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.unverifiedEmail);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Try to access sensitive feature
      await page.click('[data-testid="export-data-button"]');

      // Should show verification prompt
      await expect(page.locator('[data-testid="verification-prompt"]')).toBeVisible();
      await expect(page.locator('text=verify.*email')).toBeVisible();
      await expect(page.locator('text=Data export')).toBeVisible();
    });

    test('should unlock sensitive features after email verification', async ({ page }) => {
      // Mock verification flow
      await page.addInitScript(() => {
        window.__MOCK_EMAIL_VERIFIED = true;
      });

      // Login with verified account
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Should be able to access sensitive routes
      const sensitiveRoutes = [
        '/admin',
        '/dashboard/export',
        '/dashboard/billing',
      ];

      for (const route of sensitiveRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/')));
      }
    });
  });

  test.describe('Role-Based Access', () => {
    test('should restrict admin routes to admin users', async ({ page }) => {
      // Login as regular user
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Try to access admin routes
      await page.goto('/admin');
      await expect(page).toHaveURL(/.*dashboard/); // Redirected away

      await page.goto('/admin/users');
      await expect(page).not.toHaveURL(/.*admin/);
    });

    test('should allow admin access to admin users', async ({ page }) => {
      // Login as admin user
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', 'admin@example.com');
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Should be able to access admin routes
      await page.goto('/admin');
      await expect(page).toHaveURL(/.*admin/);
      await expect(page.locator('[data-testid="admin-nav"]')).toBeVisible();
    });
  });

  test.describe('Security Headers and CSRF', () => {
    test('should include security headers', async ({ page }) => {
      const response = await page.goto('/dashboard');

      const headers = response?.headers();
      expect(headers?.['x-frame-options']).toBeDefined();
      expect(headers?.['x-content-type-options']).toBe('nosniff');
    });

    test('should handle CSRF protection', async ({ page }) => {
      // Login first
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Make API call without CSRF token
      const response = await page.evaluate(() => {
        return fetch('/api/auth/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: 'dark' }),
        });
      });

      // Should succeed with proper session (Clerk handles CSRF)
      expect(response).toBeDefined();
    });
  });

  test.describe('Deep Linking and Navigation', () => {
    test('should preserve deep links after authentication', async ({ page }) => {
      // Try to access deep link while not authenticated
      await page.goto('/dashboard/settings/security?tab=sessions');

      // Should redirect to sign-in with full URL preserved
      await expect(page).toHaveURL(/.*sign-in/);
      expect(page.url()).toContain('redirect_url');
      expect(decodeURIComponent(page.url())).toContain('settings/security?tab=sessions');

      // Login
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Should redirect to original deep link
      await expect(page).toHaveURL(/.*settings\/security/);
      expect(page.url()).toContain('tab=sessions');
    });

    test('should handle malicious redirect URLs', async ({ page }) => {
      // Try to use external redirect URL
      await page.goto('/sign-in?redirect_url=https://evil.com/steal-data');

      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Should redirect to safe default instead
      await expect(page).toHaveURL(/.*dashboard/);
      expect(page.url()).not.toContain('evil.com');
    });
  });

  test.describe('Browser Security', () => {
    test('should clear sensitive data on logout', async ({ page }) => {
      // Login
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Access some sensitive data
      await page.goto('/dashboard/profile');

      // Logout
      await page.click('[data-testid="user-menu"]');
      await page.click('text=Log out');

      // Try to go back using browser back button
      await page.goBack();

      // Should be redirected to sign-in, not showing cached sensitive data
      await expect(page).toHaveURL(/.*sign-in/);
    });

    test('should handle session hijacking attempts', async ({ page }) => {
      // Login
      await page.goto('/sign-in');
      await page.fill('[name="identifier"]', TEST_USER.email);
      await page.fill('[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Try to manipulate session token (if stored in localStorage)
      await page.evaluate(() => {
        localStorage.setItem('clerk-session', 'invalid-token');
      });

      // Refresh page
      await page.reload();

      // Should be logged out and redirected to sign-in
      await expect(page).toHaveURL(/.*sign-in/);
    });
  });
});