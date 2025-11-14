'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const pixelId1 = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    const pixelId2 = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_2;

    // Dynamically import ReactPixel only on client side
    import('react-facebook-pixel').then((module) => {
      const ReactPixel = module.default;

      // Initialize first Facebook Pixel
      if (pixelId1) {
        ReactPixel.init(pixelId1, undefined, {
          autoConfig: true,
          debug: process.env.NODE_ENV === 'development',
        });
      }

      // Initialize second Facebook Pixel
      if (pixelId2) {
        ReactPixel.init(pixelId2, undefined, {
          autoConfig: true,
          debug: process.env.NODE_ENV === 'development',
        });
      }

      // Track initial page view
      ReactPixel.pageView();
    });
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Track page views on route changes
    if (pathname) {
      import('react-facebook-pixel').then((module) => {
        const ReactPixel = module.default;
        ReactPixel.pageView();
      });
    }
  }, [pathname]);

  return null;
}
