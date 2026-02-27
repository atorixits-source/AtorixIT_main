import axios from './axios';
import { getCurrentUser } from './auth';

/**
 * Prevent duplicate logs (same page within 3s)
 */
let lastPage = null;
let lastTime = 0;

const DEDUP_TIME = 3000; // 3 seconds

/**
 * Map route → readable name
 */
function getPageName(path) {
  const map = {
    '/admin/dashboard': 'Dashboard',
    '/admin/hr-dashboard': 'HR Dashboard',
    '/admin/business-dashboard': 'Business Dashboard',
    '/admin/user-management': 'User Management',
    '/admin/lead-management': 'Lead Management',
    '/admin/analytics': 'Analytics',
    '/admin/admin-activity': 'Admin Activity',
    '/admin/audit-logs': 'Audit Logs',
    '/admin/role-permissions': 'Role Permissions',
    '/admin/settings': 'Settings',
    '/admin/login': 'Login',
  };

  return map[path] || path.split('/').pop();
}

/**
 * Detect section from route
 */
function getSection(path) {
  if (path.startsWith('/admin')) return 'Admin';
  if (path.startsWith('/blog')) return 'Blog';

  return 'General';
}

/**
 * Track admin page visit
 */
export async function trackPage(pathname, source = 'navigation') {
  if (!pathname) return;

  const now = Date.now();

  /**
   * Prevent spam logging
   */
  if (pathname === lastPage && now - lastTime < DEDUP_TIME) {
    return;
  }

  lastPage = pathname;
  lastTime = now;

  try {
    const user = getCurrentUser();

    const payload = {
      page: pathname,
      pageName: getPageName(pathname),
      section: getSection(pathname),

      // User info (if available)
      userId: user?._id || null,
      username: user?.username || user?.email || 'unknown',
      role: user?.role || 'unknown',

      source,
      clientTime: new Date().toISOString(),
    };

    await axios.post('/api/activity/page-visit', payload);

  } catch (err) {
    console.warn('⚠️ Page tracking failed:', err.message);
  }
}
