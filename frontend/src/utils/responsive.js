/**
 * Responsive Utilities
 * Helper functions để xử lý responsive trong JavaScript
 */

/**
 * Breakpoint values (matches MUI default breakpoints)
 */
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

/**
 * Get current screen width
 * @returns {number} - Current window width
 */
export const getScreenWidth = () => {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth;
};

/**
 * Check if current screen matches breakpoint
 * @param {string} breakpoint - Breakpoint to check ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {string} direction - 'up' (>=) or 'down' (<=)
 * @returns {boolean}
 */
export const matchesBreakpoint = (breakpoint, direction = 'up') => {
  const width = getScreenWidth();
  const breakpointValue = breakpoints[breakpoint];

  if (!breakpointValue) return false;

  if (direction === 'up') {
    return width >= breakpointValue;
  } else {
    return width <= breakpointValue;
  }
};

/**
 * Get responsive value based on current screen size
 * @param {Object} values - Object với keys là breakpoints
 * @returns {any} - Value tương ứng với breakpoint hiện tại
 * 
 * @example
 * const padding = getResponsiveValue({
 *   xs: '16px',
 *   sm: '24px',
 *   md: '32px',
 *   lg: '48px'
 * });
 */
export const getResponsiveValue = (values) => {
  const width = getScreenWidth();

  if (width >= breakpoints.xl && values.xl !== undefined) return values.xl;
  if (width >= breakpoints.lg && values.lg !== undefined) return values.lg;
  if (width >= breakpoints.md && values.md !== undefined) return values.md;
  if (width >= breakpoints.sm && values.sm !== undefined) return values.sm;
  return values.xs;
};

/**
 * Get number of columns for grid based on screen size
 * @param {Object} columns - Object định nghĩa số cột cho mỗi breakpoint
 * @returns {number}
 * 
 * @example
 * const cols = getGridColumns({ xs: 1, sm: 2, md: 3, lg: 4 });
 */
export const getGridColumns = (columns = { xs: 1, sm: 2, md: 3, lg: 4 }) => {
  return getResponsiveValue(columns);
};

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  return getScreenWidth() < breakpoints.sm;
};

/**
 * Check if device is tablet
 * @returns {boolean}
 */
export const isTablet = () => {
  const width = getScreenWidth();
  return width >= breakpoints.sm && width < breakpoints.md;
};

/**
 * Check if device is desktop
 * @returns {boolean}
 */
export const isDesktop = () => {
  return getScreenWidth() >= breakpoints.md;
};

/**
 * Get responsive spacing
 * @param {Object} spacing - Spacing values for each breakpoint
 * @returns {string|number}
 * 
 * @example
 * const margin = getResponsiveSpacing({ xs: 2, sm: 3, md: 4 });
 */
export const getResponsiveSpacing = (spacing) => {
  return getResponsiveValue(spacing);
};

/**
 * Format số cho responsive display
 * @param {number} value - Giá trị cần format
 * @param {Object} options - Options cho mỗi breakpoint
 * @returns {string}
 */
export const formatResponsiveNumber = (value, options = {}) => {
  const width = getScreenWidth();
  
  let decimals = 0;
  if (width >= breakpoints.lg && options.lg) decimals = options.lg.decimals || 0;
  else if (width >= breakpoints.md && options.md) decimals = options.md.decimals || 0;
  else if (width >= breakpoints.sm && options.sm) decimals = options.sm.decimals || 0;
  else if (options.xs) decimals = options.xs.decimals || 0;

  return value.toFixed(decimals);
};

export default {
  breakpoints,
  getScreenWidth,
  matchesBreakpoint,
  getResponsiveValue,
  getGridColumns,
  isMobile,
  isTablet,
  isDesktop,
  getResponsiveSpacing,
  formatResponsiveNumber,
};

