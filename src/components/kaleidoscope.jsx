import React, { useEffect, useRef, useState } from "react";
import {
  Heading,
  Image,
  Flex
} from '@chakra-ui/react';
import boto1 from '../assets/images/boto1.png';
import boto2 from '../assets/images/boto2.png';
import boto3 from '../assets/images/boto3.png';
import boto4 from '../assets/images/boto4.png';
import boto5 from '../assets/images/boto5.png';
import bototransparentbg from '../assets/images/bototransparentbg.png';
import OrinocoFlowMario64 from '../assets/audio/OrinocoFlowMario64.mp3';
import OrinocoFlowPrototypeRaptor from '../assets/audio/OrinocoFlowPrototypeRaptor.mp3';

// Array of all boto images for random selection
const botoImages = [boto1, boto2, boto3, boto4, boto5];

export default function Kaleidoscope() {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const audioRef = useRef(null);
    
    // Randomly select one of the boto images
    const [selectedImage] = useState(() => {
        const randomIndex = Math.floor(Math.random() * botoImages.length);
        const selected = botoImages[randomIndex];
        console.log(`Randomly selected boto image: ${selected}`);
        return selected;
    });

    useEffect(() => {
        // Check if already initialized to prevent duplicate execution
        if (window.kaleidoscopeInitialized) {
            console.log('Kaleidoscope already initialized globally, skipping effect...');
            return;
        }

        // Wait for scripts to load before setting attributes
        const checkScripts = () => {
            if (window.THREE) {
                console.log('THREE.js loaded');
                
                if (canvasRef.current && imageRef.current) {
                    // Set all attributes
                    canvasRef.current.setAttribute('tlg-kaleidoscope-canvas', '');
                    canvasRef.current.setAttribute('tlg-kaleidoscope-scale', '1');
                    canvasRef.current.setAttribute('tlg-kaleidoscope-motion', '1');
                    canvasRef.current.setAttribute('tlg-kaleidoscope-segments', '8');
                    canvasRef.current.setAttribute('tlg-kaleidoscope-mode', 'mouse');
                    
                    imageRef.current.setAttribute('tlg-kaleidoscope-image', '');
                    
                    console.log('Attributes set on canvas:', canvasRef.current.attributes);
                    console.log('Attributes set on image:', imageRef.current.attributes);
                    
                    // Manually trigger the kaleidoscope initialization
                    setTimeout(() => {
                        try {
                            // Create a new Sketch instance manually
                            // We'll recreate the Sketch class functionality here
                            const container = canvasRef.current;
                            const imageElement = imageRef.current;
                            
                            // Check if kaleidoscope is already initialized
                            if (window.kaleidoscopeInitialized) {
                                console.log('Kaleidoscope already initialized, skipping...');
                                return;
                            }
                            
                            console.log('Creating kaleidoscope manually...');
                            
                            // Mark as initialized immediately to prevent duplicate initialization
                            window.kaleidoscopeInitialized = true;
                            
                            // Create the scene
                            const scene = new THREE.Scene();
                            
                            // Get attributes
                            const scaleAttr = container.getAttribute('tlg-kaleidoscope-scale');
                            const scaleFactor = parseFloat(scaleAttr) || 1;
                            const motionAttr = container.getAttribute('tlg-kaleidoscope-motion');
                            const motionFactor = parseFloat(motionAttr) || 1;
                            const modeAttr = container.getAttribute('tlg-kaleidoscope-mode');
                            const mode = ['loop', 'static', 'mouse', 'scroll'].includes(modeAttr) ? modeAttr : 'static';
                            const segmentsAttr = container.getAttribute('tlg-kaleidoscope-segments');
                            const segments = parseInt(segmentsAttr) || 6;
                            
                            console.log('Kaleidoscope settings:', { scaleFactor, motionFactor, mode, segments });
                            
                            // Set up renderer
                            const width = container.offsetWidth;
                            const height = container.offsetHeight;
                            const renderer = new THREE.WebGLRenderer();
                            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                            renderer.setSize(width, height);
                            renderer.setClearColor(0xeeeeee, 1);
                            
                            container.appendChild(renderer.domElement);
                            
                            // Set up camera
                            const frustumSize = 1;
                            const camera = new THREE.OrthographicCamera(
                                frustumSize / -2,
                                frustumSize / 2,
                                frustumSize / 2,
                                frustumSize / -2,
                                -1000,
                                1000
                            );
                            camera.position.set(0, 0, 2);
                            
                            // Create texture from image
                            const texture = new THREE.TextureLoader().load(imageElement.src, () => {
                                console.log('Texture loaded successfully');
                                
                                // Create material with shader
                                const material = new THREE.ShaderMaterial({
                                    uniforms: {
                                        uTexture: { value: texture },
                                        resolution: { value: new THREE.Vector4(width, height, 1, 1) },
                                        uOpacity: { value: 1 },
                                        segments: { value: segments },
                                        uOffset: { value: new THREE.Vector2(0, 0) },
                                        uRotation: { value: 0 },
                                        uOffsetAmount: { value: motionFactor },
                                        uRotationAmount: { value: motionFactor },
                                        uScaleFactor: { value: scaleFactor },
                                        uImageAspect: { value: 1 }
                                    },
                                    vertexShader: `
                                        varying vec2 vUv;
                                        void main() {
                                            vUv = uv;
                                            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                                        }
                                    `,
                                    fragmentShader: `
                                        precision mediump float;
                                        uniform sampler2D uTexture;
                                        uniform vec4 resolution;
                                        uniform float uOpacity;
                                        varying vec2 vUv;
                                        const float PI = 3.14159265359;
                                        uniform float segments;
                                        uniform vec2 uOffset;
                                        uniform float uRotation;
                                        uniform float uOffsetAmount;
                                        uniform float uRotationAmount;
                                        uniform float uScaleFactor;
                                        uniform float uImageAspect;

                                        vec2 adjustUV(vec2 uv, vec2 offset, float rotation) {
                                            vec2 uvOffset = uv + offset * uOffsetAmount;
                                            float cosRot = cos(rotation * uRotationAmount);
                                            float sinRot = sin(rotation * uRotationAmount);
                                            mat2 rotMat = mat2(cosRot, -sinRot, sinRot, cosRot);
                                            return rotMat * (uvOffset - vec2(0.5)) + vec2(0.5);
                                        }

                                        void main() {
                                            vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
                                            vec2 uv = newUV * 2.0 - 1.0;
                                            float angle = atan(uv.y, uv.x);
                                            float radius = length(uv);
                                            float segment = PI * 2.0 / segments;
                                            angle = mod(angle, segment);
                                            angle = segment - abs(segment / 2.0 - angle);
                                            uv = radius * vec2(cos(angle), sin(angle));
                                            float scale = 1.0 / uScaleFactor;
                                            vec2 adjustedUV = adjustUV(uv * scale + scale, uOffset, uRotation);
                                            vec2 aspectCorrectedUV = vec2(adjustedUV.x, adjustedUV.y * uImageAspect);
                                            vec2 tileIndex = floor(aspectCorrectedUV);
                                            vec2 oddTile = mod(tileIndex, 2.0);
                                            vec2 mirroredUV = mix(fract(aspectCorrectedUV), 1.0 - fract(aspectCorrectedUV), oddTile);
                                            vec4 color = texture2D(uTexture, mirroredUV);
                                            color.a *= uOpacity;
                                            gl_FragColor = color;
                                        }
                                    `,
                                    transparent: true
                                });
                                
                                // Create geometry and mesh
                                const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
                                const plane = new THREE.Mesh(geometry, material);
                                scene.add(plane);
                                
                                // Mouse tracking
                                const mouse = { x: 0, y: 0 };
                                
                                if (mode === 'mouse') {
                                    container.addEventListener("mousemove", (e) => {
                                        const rect = container.getBoundingClientRect();
                                        mouse.x = (e.clientX - rect.left) / width;
                                        mouse.y = (e.clientY - rect.top) / height;
                                    });
                                }
                                
                                // Render loop
                                const render = (time = 0) => {
                                    if (mode === 'mouse') {
                                        const offsetX = (mouse.x - 0.5) * 2 * motionFactor;
                                        const offsetY = (mouse.y - 0.5) * 2 * motionFactor;
                                        material.uniforms.uOffset.value.set(offsetX, offsetY);
                                        const rotation = Math.PI * (mouse.y - 0.5) * 2 * motionFactor;
                                        material.uniforms.uRotation.value = rotation;
                                    }
                                    
                                    requestAnimationFrame(render);
                                    renderer.render(scene, camera);
                                };
                                
                                render();
                                console.log('Kaleidoscope initialized successfully!');
                            });
                            
                        } catch (error) {
                            console.error('Error creating kaleidoscope:', error);
                        }
                    }, 200);
                }
            } else {
                // Retry after a short delay if scripts aren't loaded yet
                setTimeout(checkScripts, 100);
            }
        };
        
        checkScripts();
    }, []);

    // Handle audio autoplay with user interaction
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
        <>
        <audio 
            ref={audioRef}
            src={OrinocoFlowMario64} 
            autoPlay 
            loop 
            controls 
            muted={false}
            preload="auto"
            onError={(e) => console.log('Audio autoplay blocked:', e)}
        />
        <div 
            ref={canvasRef} 
            {...{ 'tlg-kaleidoscope-scale': '1' }}
            {...{ 'tlg-kaleidoscope-canvas': true }}
            {...{ 'tlg-kaleidoscope-motion': '1' }}
            {...{ 'tlg-kaleidoscope-segments': '8' }}
            {...{ 'tlg-kaleidoscope-mode': 'mouse' }}
            className="kaleidoscope_canvas" 
            style={{
                position: 'relative',
                width: '80%',
                height: '80%',
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