import React, { useRef, useEffect, useState, Suspense } from "react";
import {
  Heading,
  Flex
} from '@chakra-ui/react';
import ProphecyGenerator from './ProphecyGenerator';
import { useScreenSize } from '../hooks/useScreenSize';
import OrinocoFlowMario64 from '../assets/audio/OrinocoFlowMario64.mp3';

// Dynamic imports to prevent both components from loading
const Kaleidoscope = React.lazy(() => import('./kaleidoscope'));
const MobileKaleidoscope = React.lazy(() => import('./MobileKaleidoscope'));

export default function Container() {
    const audioRef = useRef(null);
    const { isMobile, isTablet, isDesktop } = useScreenSize();
    
    // Debug: Check current flag states
    useEffect(() => {
        console.log('Container mounted - Current flags:', {
            kaleidoscopeInitialized: window.kaleidoscopeInitialized,
            mobileKaleidoscopeInitialized: window.mobileKaleidoscopeInitialized
        });
    }, []);
    
    // Debug logging
    console.log('Screen size detection:', { isMobile, isTablet, isDesktop });
    
    useEffect(() => {
        const handleUserInteraction = () => {
            if (audioRef.current) {
                audioRef.current.play().catch(error => {
                    console.log('Autoplay failed, user interaction required:', error);
                });
            }
        };

        // Try to play immediately
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.log('Initial autoplay blocked, waiting for user interaction');
                // Add event listeners for user interaction
                document.addEventListener('click', handleUserInteraction, { once: true });
                document.addEventListener('touchstart', handleUserInteraction, { once: true });
                document.addEventListener('keydown', handleUserInteraction, { once: true });
            });
        }

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, []);

    return (
        <Flex bg="pink.300" w="100vw" h="100%" direction="column">
            <Flex direction="column" alignItems="center" width="100%" pt={50} flex="1" justifyContent="center">
                <Heading fontFamily="Honk" fontSize="80px" pb={30}>Boto Wheel</Heading>
                        <div style={{ 
                            width: '80vh', 
                            height: '80vh', 
                            maxWidth: '80vw',
                            maxHeight: '80vw',
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <Suspense fallback={<div>Loading kaleidoscope...</div>}>
                                {isMobile || isTablet ? (
                                    <MobileKaleidoscope key="mobile" />
                                ) : (
                                    <Kaleidoscope key="desktop" />
                                )}
                            </Suspense>
                        </div>
            </Flex>
            <Flex justify="center" pb={10} flex="0 0 auto">
                <ProphecyGenerator />
            </Flex>
            <Flex justify="center" pb={20} flex="0 0 auto">
                <audio 
                    ref={audioRef}
                    src={OrinocoFlowMario64} 
                    autoPlay 
                    loop 
                    controls 
                    muted={false}
                    preload="auto"
                    onError={(e) => console.log('Audio autoplay blocked:', e)}
                    style={{
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                />
            </Flex>
        </Flex>
    )
}