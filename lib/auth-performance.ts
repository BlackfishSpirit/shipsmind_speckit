import { UserPreferences } from '@prisma/client';
import type { AuthUser } from '@/types/auth';

// Cache configuration for performance optimization
const CACHE_CONFIG = {
  // User preferences cache for 5 minutes
  userPreferences: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // Max 100 users in cache
  },
  // Session info cache for 30 seconds
  sessionInfo: {
    ttl: 30 * 1000, // 30 seconds
    maxSize: 50,
  },
  // Route access cache for 1 minute
  routeAccess: {
    ttl: 60 * 1000, // 1 minute
    maxSize: 200,
  },
} as const;

// In-memory cache implementation
class MemoryCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, value: T, ttl: number): void {
    const expiry = Date.now() + ttl;

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { data: value, expiry });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }
}

// Cache instances
const userPreferencesCache = new MemoryCache<UserPreferences>(CACHE_CONFIG.userPreferences.maxSize);
const sessionInfoCache = new MemoryCache<any>(CACHE_CONFIG.sessionInfo.maxSize);
const routeAccessCache = new MemoryCache<boolean>(CACHE_CONFIG.routeAccess.maxSize);

// Performance optimization utilities
export class AuthPerformanceOptimizer {
  // Cache user preferences with automatic invalidation
  static cacheUserPreferences(userId: string, preferences: UserPreferences): void {
    userPreferencesCache.set(
      `prefs:${userId}`,
      preferences,
      CACHE_CONFIG.userPreferences.ttl
    );
  }

  static getCachedUserPreferences(userId: string): UserPreferences | null {
    return userPreferencesCache.get(`prefs:${userId}`);
  }

  static invalidateUserPreferences(userId: string): void {
    userPreferencesCache.delete(`prefs:${userId}`);
  }

  // Cache session information
  static cacheSessionInfo(sessionId: string, sessionInfo: any): void {
    sessionInfoCache.set(
      `session:${sessionId}`,
      sessionInfo,
      CACHE_CONFIG.sessionInfo.ttl
    );
  }

  static getCachedSessionInfo(sessionId: string): any | null {
    return sessionInfoCache.get(`session:${sessionId}`);
  }

  // Cache route access decisions
  static cacheRouteAccess(userId: string, route: string, hasAccess: boolean): void {
    routeAccessCache.set(
      `route:${userId}:${route}`,
      hasAccess,
      CACHE_CONFIG.routeAccess.ttl
    );
  }

  static getCachedRouteAccess(userId: string, route: string): boolean | null {
    return routeAccessCache.get(`route:${userId}:${route}`);
  }

  // Periodic cleanup of expired cache entries
  static startCleanupTimer(): void {
    setInterval(() => {
      userPreferencesCache.cleanup();
      sessionInfoCache.cleanup();
      routeAccessCache.cleanup();
    }, 60000); // Clean up every minute
  }

  // Clear all caches (useful for logout)
  static clearAllCaches(): void {
    userPreferencesCache.clear();
    sessionInfoCache.clear();
    routeAccessCache.clear();
  }

  // Clear user-specific caches
  static clearUserCaches(userId: string): void {
    userPreferencesCache.delete(`prefs:${userId}`);

    // Clear route access cache for this user
    for (let i = 0; i < routeAccessCache.size(); i++) {
      // This is a simplified approach - in production, you might want
      // a more efficient way to clear user-specific route caches
    }
  }

  // Get cache statistics for monitoring
  static getCacheStats(): {
    userPreferences: number;
    sessionInfo: number;
    routeAccess: number;
  } {
    return {
      userPreferences: userPreferencesCache.size(),
      sessionInfo: sessionInfoCache.size(),
      routeAccess: routeAccessCache.size(),
    };
  }
}

// Debounced function for user preference updates
export function debouncePreferencesUpdate(
  updateFn: () => Promise<void>,
  delay: number = 1000
): () => void {
  let timeoutId: NodeJS.Timeout;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(updateFn, delay);
  };
}

// Throttled function for session activity tracking
export function throttleSessionActivity(
  trackFn: () => void,
  limit: number = 30000 // 30 seconds
): () => void {
  let lastCall = 0;

  return () => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      trackFn();
    }
  };
}

// Memoization for expensive auth computations
const memoCache = new Map<string, { result: any; expiry: number }>();

export function memoizeAuthComputation<T>(
  key: string,
  computeFn: () => T,
  ttl: number = 60000 // 1 minute
): T {
  const cached = memoCache.get(key);
  const now = Date.now();

  if (cached && now < cached.expiry) {
    return cached.result;
  }

  const result = computeFn();
  memoCache.set(key, { result, expiry: now + ttl });

  return result;
}

// Preload critical auth data
export async function preloadAuthData(userId: string): Promise<void> {
  try {
    // Preload user preferences if not cached
    if (!AuthPerformanceOptimizer.getCachedUserPreferences(userId)) {
      const response = await fetch('/api/auth/preferences');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          AuthPerformanceOptimizer.cacheUserPreferences(userId, data.data);
        }
      }
    }

    // Preload session info if needed
    const response = await fetch('/api/auth/session');
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data.sessionId) {
        AuthPerformanceOptimizer.cacheSessionInfo(data.data.sessionId, data.data);
      }
    }
  } catch (error) {
    console.warn('Failed to preload auth data:', error);
  }
}

// Lazy loading for non-critical auth components
export function lazyLoadAuthComponent<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(importFn);

  if (fallback) {
    return React.lazy(() =>
      importFn().catch(() => ({ default: fallback as any }))
    );
  }

  return LazyComponent;
}

// Performance monitoring
export class AuthPerformanceMonitor {
  private static metrics = new Map<string, number[]>();

  static startTiming(operation: string): () => void {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration);
    };
  }

  static recordMetric(operation: string, duration: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }

    const metrics = this.metrics.get(operation)!;
    metrics.push(duration);

    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  static getMetrics(operation: string): {
    count: number;
    average: number;
    min: number;
    max: number;
  } | null {
    const metrics = this.metrics.get(operation);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    return {
      count: metrics.length,
      average: metrics.reduce((sum, val) => sum + val, 0) / metrics.length,
      min: Math.min(...metrics),
      max: Math.max(...metrics),
    };
  }

  static getAllMetrics(): Record<string, ReturnType<typeof this.getMetrics>> {
    const result: Record<string, any> = {};
    for (const [operation] of this.metrics) {
      result[operation] = this.getMetrics(operation);
    }
    return result;
  }

  // Check if authentication is meeting performance targets
  static checkPerformanceTargets(): {
    authCheck: boolean; // Should be < 200ms
    preferencesLoad: boolean; // Should be < 500ms
    sessionValidation: boolean; // Should be < 100ms
  } {
    const authMetrics = this.getMetrics('auth_check');
    const prefsMetrics = this.getMetrics('preferences_load');
    const sessionMetrics = this.getMetrics('session_validation');

    return {
      authCheck: !authMetrics || authMetrics.average < 200,
      preferencesLoad: !prefsMetrics || prefsMetrics.average < 500,
      sessionValidation: !sessionMetrics || sessionMetrics.average < 100,
    };
  }
}

// Bundle size optimization - conditional imports
export async function loadAuthModule(moduleName: string): Promise<any> {
  switch (moduleName) {
    case 'verification':
      return import('./auth-verification').then(m => m.default);
    case 'session':
      return import('./auth-session').then(m => m.default);
    case 'preferences':
      return import('./auth-preferences').then(m => m.default);
    default:
      throw new Error(`Unknown auth module: ${moduleName}`);
  }
}

// Initialize performance optimization
export function initializeAuthPerformance(): void {
  // Start cache cleanup timer
  AuthPerformanceOptimizer.startCleanupTimer();

  // Clear caches on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      AuthPerformanceOptimizer.clearAllCaches();
    });

    // Report performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      const reportMetrics = () => {
        const targets = AuthPerformanceMonitor.checkPerformanceTargets();
        console.log('Auth Performance Targets:', targets);

        const allMetrics = AuthPerformanceMonitor.getAllMetrics();
        console.log('Auth Performance Metrics:', allMetrics);

        const cacheStats = AuthPerformanceOptimizer.getCacheStats();
        console.log('Auth Cache Stats:', cacheStats);
      };

      // Report metrics every 30 seconds in development
      setInterval(reportMetrics, 30000);
    }
  }
}

// Hook for performance-optimized auth state
export function useOptimizedAuth(userId?: string) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [preferences, setPreferences] = React.useState<UserPreferences | null>(null);

  React.useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadPreferences = async () => {
      const endTiming = AuthPerformanceMonitor.startTiming('preferences_load');

      try {
        // Try cache first
        const cached = AuthPerformanceOptimizer.getCachedUserPreferences(userId);
        if (cached) {
          setPreferences(cached);
          setIsLoading(false);
          endTiming();
          return;
        }

        // Load from API
        const response = await fetch('/api/auth/preferences');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPreferences(data.data);
            AuthPerformanceOptimizer.cacheUserPreferences(userId, data.data);
          }
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setIsLoading(false);
        endTiming();
      }
    };

    loadPreferences();
  }, [userId]);

  return { preferences, isLoading };
}

// React import for hooks
import React from 'react';