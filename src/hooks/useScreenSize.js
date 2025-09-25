import { useState, useEffect } from 'react';

export function useScreenSize() {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
        isMobile: false,
        isTablet: false,
        isDesktop: false
    });

    useEffect(() => {
        const updateScreenSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            setScreenSize({
                width,
                height,
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isDesktop: width >= 1024
            });
        };

        // Initial check
        updateScreenSize();

        // Add event listener
        window.addEventListener('resize', updateScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    return screenSize;
}
