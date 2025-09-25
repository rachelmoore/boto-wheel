import React, { useRef, useEffect, useState } from 'react';
import boto1 from '../assets/images/boto1.png';
import boto2 from '../assets/images/boto2.png';
import boto3 from '../assets/images/boto3.png';
import boto4 from '../assets/images/boto4.png';
import boto5 from '../assets/images/boto5.png';
import bototransparentbg from '../assets/images/bototransparentbg.png';

const botoImages = [boto1, boto2, boto3, boto4, boto5];

export default function MobileKaleidoscope() {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const materialRef = useRef(null);
    const scrollYRef = useRef(0);
    const initializedRef = useRef(false);

    const [selectedImage] = useState(() => {
        const randomIndex = Math.floor(Math.random() * botoImages.length);
        const selected = botoImages[randomIndex];
        console.log(`Randomly selected boto image: ${selected}`);
        return selected;
    });

    useEffect(() => {
        console.log('=== MobileKaleidoscope useEffect START ===');
        console.log('initializedRef.current:', initializedRef.current);
        console.log('Stack trace:', new Error().stack);
        
        // Use ref instead of global variable to prevent double execution
        if (initializedRef.current) {
            console.log('Mobile Kaleidoscope already initialized, skipping effect...');
            return;
        }
        initializedRef.current = true;
        console.log('Set initializedRef to true');

        const checkScripts = () => {
            if (typeof window.THREE === 'undefined') {
                console.log('THREE.js not loaded yet, waiting...');
                setTimeout(checkScripts, 100);
                return;
            }

            setTimeout(() => {
                try {
                    const canvas = canvasRef.current;
                    const imageElement = imageRef.current;
                    
                    if (!canvas || !imageElement) {
                        console.log('Canvas or image element not ready yet, skipping...');
                        return;
                    }

                    // Create scene
                    const scene = new window.THREE.Scene();
                    sceneRef.current = scene;

                    // Create camera
                    const camera = new window.THREE.PerspectiveCamera(75, 1, 0.1, 1000);
                    camera.position.z = 1;

                    // Create renderer
                    const renderer = new window.THREE.WebGLRenderer({ 
                        alpha: true,
                        antialias: true
                    });
                    
                    // Set the canvas element
                    canvas.appendChild(renderer.domElement);
                    
                    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
                    renderer.setPixelRatio(window.devicePixelRatio);
                    rendererRef.current = renderer;

                    // Create geometry
                    const geometry = new window.THREE.PlaneGeometry(2, 2);

                    // Create shader material
                    const material = new window.THREE.ShaderMaterial({
                        uniforms: {
                            u_time: { value: 0 },
                            u_resolution: { value: new window.THREE.Vector2(canvas.offsetWidth, canvas.offsetHeight) },
                            u_mouse: { value: new window.THREE.Vector2(0, 0) },
                            u_texture: { value: null }
                        },
                        vertexShader: `
                            varying vec2 vUv;
                            void main() {
                                vUv = uv;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            }
                        `,
                        fragmentShader: `
                            uniform float u_time;
                            uniform vec2 u_resolution;
                            uniform vec2 u_mouse;
                            uniform sampler2D u_texture;
                            varying vec2 vUv;

                            void main() {
                                vec2 uv = vUv;
                                vec2 center = vec2(0.5);
                                
                                // Create kaleidoscope effect
                                vec2 pos = uv - center;
                                float angle = atan(pos.y, pos.x);
                                float radius = length(pos);
                                
                                // Create segments (8 segments)
                                float segments = 8.0;
                                angle = mod(angle, 2.0 * 3.14159 / segments) * segments / (2.0 * 3.14159);
                                
                                // Apply rotation based on scroll
                                angle += u_mouse.x * 0.1;
                                
                                // Convert back to UV coordinates
                                vec2 newPos = vec2(cos(angle), sin(angle)) * radius;
                                vec2 newUv = newPos + center;
                                
                                // Sample texture
                                vec4 color = texture2D(u_texture, newUv);
                                
                                // Add some motion based on time and scroll
                                color.rgb += sin(u_time + u_mouse.y * 0.05) * 0.1;
                                
                                gl_FragColor = color;
                            }
                        `
                    });

                    materialRef.current = material;

                    // Create mesh
                    const mesh = new window.THREE.Mesh(geometry, material);
                    scene.add(mesh);

                    // Load texture
                    const textureLoader = new window.THREE.TextureLoader();
                    textureLoader.load(selectedImage, (texture) => {
                        material.uniforms.u_texture.value = texture;
                    });

                    // Animation loop
                    const animate = () => {
                        requestAnimationFrame(animate);
                        
                        // Update time uniform
                        material.uniforms.u_time.value = performance.now() * 0.001;
                        
                        // Update mouse uniform with scroll position
                        material.uniforms.u_mouse.value.set(scrollYRef.current * 0.01, scrollYRef.current * 0.005);
                        
                        renderer.render(scene, camera);
                    };

                    animate();

                    // Handle scroll events
                    const handleScroll = () => {
                        scrollYRef.current = window.scrollY;
                    };

                    window.addEventListener('scroll', handleScroll, { passive: true });

                    // Handle resize
                    const handleResize = () => {
                        const width = canvas.offsetWidth;
                        const height = canvas.offsetHeight;
                        
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        
                        renderer.setSize(width, height);
                        material.uniforms.u_resolution.value.set(width, height);
                    };

                    window.addEventListener('resize', handleResize);

                    // Cleanup function
                    const cleanup = () => {
                        window.removeEventListener('scroll', handleScroll);
                        window.removeEventListener('resize', handleResize);
                        if (renderer) {
                            // Remove the canvas element from the container
                            if (renderer.domElement && renderer.domElement.parentNode) {
                                renderer.domElement.parentNode.removeChild(renderer.domElement);
                            }
                            renderer.dispose();
                        }
                    };

                    // Store cleanup function
                    canvas.cleanup = cleanup;

                    console.log('Mobile Kaleidoscope initialized successfully');

                } catch (error) {
                    console.error('Error creating mobile kaleidoscope:', error);
                }
            }, 200);
        };

        checkScripts();
        
        return () => {
            console.log('=== MobileKaleidoscope useEffect CLEANUP ===');
            const canvas = canvasRef.current;
            if (canvas && canvas.cleanup) {
                canvas.cleanup();
            }
            // Don't reset the ref - let it stay true to prevent reinitialization
            console.log('Cleanup complete, keeping initializedRef as true');
        };
    }, [selectedImage]);

    return (
        <>
        <div 
            ref={canvasRef} 
            {...{ 'tlg-kaleidoscope-scale': '1' }}
            {...{ 'tlg-kaleidoscope-canvas': true }}
            {...{ 'tlg-kaleidoscope-motion': '1' }}
            {...{ 'tlg-kaleidoscope-segments': '8' }}
            {...{ 'tlg-kaleidoscope-mode': 'scroll' }}
            className="kaleidoscope_canvas" 
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                border: '2px solid #ccc'
            }}
        >
            <img 
                ref={imageRef} 
                src={selectedImage} 
                className="hide" 
                alt="tlg-kaleidoscope-image" 
                {...{ 'tlg-kaleidoscope-image': true }}
                style={{ display: 'none' }}
            />
            {/* Transparent boto overlay in the center */}
            <img 
                src={bototransparentbg} 
                alt="boto overlay" 
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '280px',
                    height: '280px',
                    zIndex: 10,
                    pointerEvents: 'none'
                }}
            />
        </div>
        </>
    )
}
