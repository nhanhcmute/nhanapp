import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Hook để kiểm tra responsive breakpoints
 * @returns {Object} - Object chứa các breakpoint flags
 */
export const useResponsive = () => {
  const theme = useTheme();
  
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  
  const isMobile = !isSm; // < 600px
  const isTablet = isSm && !isMd; // 600px - 899px
  const isDesktop = isMd; // >= 900px

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isXl ? 'xl' : isLg ? 'lg' : isMd ? 'md' : isSm ? 'sm' : 'xs',
  };
};

/**
 * Hook để lấy số cột responsive cho grid
 * @param {Object} columns - Object định nghĩa số cột cho mỗi breakpoint
 * @returns {number} - Số cột hiện tại
 * 
 * @example
 * const cols = useGridColumns({ xs: 1, sm: 2, md: 3, lg: 4 });
 */
export const useGridColumns = (columns = { xs: 1, sm: 2, md: 3, lg: 4 }) => {
  const responsive = useResponsive();
  
  if (responsive.isXl && columns.xl) return columns.xl;
  if (responsive.isLg && columns.lg) return columns.lg;
  if (responsive.isMd && columns.md) return columns.md;
  if (responsive.isSm && columns.sm) return columns.sm;
  return columns.xs || 1;
};

/**
 * Hook để kiểm tra kích thước màn hình
 * @returns {Object} - Object chứa width và height
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * Hook để kiểm tra orientation (portrait/landscape)
 * @returns {string} - 'portrait' hoặc 'landscape'
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    window.addEventListener('resize', updateOrientation);
    updateOrientation(); // Set initial orientation

    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  return orientation;
};

export default useResponsive;

