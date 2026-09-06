'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ── GLSL shaders (unchanged from ReactBits Magic Rings) ── */
const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uCoverageAlpha;
uniform vec2 uResolution;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn
    ? smoothstep(0.0, uFadeIn, t)
    : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;

  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;

  vec3 c = vec3(0.0);
  float coverage = 0.0;
  float rcf = max(float(uRingCount) - 1.0, 1.0);

  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    float ringAmount = ring(
      p,
      uBaseRadius + fi * uRadiusStep,
      pow(uRingGap, fi),
      i == 0 ? 0.0 : 2.95 * fi,
      px
    );
    c = mix(c, rc, vec3(ringAmount));
    coverage = max(coverage, ringAmount);
  }

  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;

  float intensity = max(c.r, max(c.g, c.b));
  vec3 emissiveColor = intensity > 0.0001 ? clamp(c / intensity, 0.0, 1.0) : vec3(0.0);
  vec3 outputColor = mix(emissiveColor, clamp(c, 0.0, 1.0), uCoverageAlpha);
  float outputAlpha = mix(intensity, coverage, uCoverageAlpha);

  gl_FragColor = vec4(outputColor, clamp(outputAlpha * uOpacity, 0.0, 1.0));
}
`;

export interface MagicRingsProps {
  color?: string;
  colorTwo?: string;
  speed?: number;
  ringCount?: number;
  attenuation?: number;
  lineThickness?: number;
  baseRadius?: number;
  radiusStep?: number;
  scaleRate?: number;
  opacity?: number;
  noiseAmount?: number;
  rotation?: number;
  ringGap?: number;
  fadeIn?: number;
  fadeOut?: number;
}

export default function MagicRings({
  color = '#9FC9BC',
  colorTwo = '#5A9080',
  speed = 0.5,
  ringCount = 5,
  attenuation = 15,
  lineThickness = 8,
  baseRadius = 0.15,
  radiusStep = 0.08,
  scaleRate = 0.5,
  opacity = 0.85,
  noiseAmount = 0,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
}: MagicRingsProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const propsRef = useRef({
    color, colorTwo, speed, ringCount, attenuation, lineThickness,
    baseRadius, radiusStep, scaleRate, opacity, noiseAmount,
    rotation, ringGap, fadeIn, fadeOut,
  });
  propsRef.current = {
    color, colorTwo, speed, ringCount, attenuation, lineThickness,
    baseRadius, radiusStep, scaleRate, opacity, noiseAmount,
    rotation, ringGap, fadeIn, fadeOut,
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, premultipliedAlpha: false, antialias: false });
    } catch {
      return;
    }

    if (!renderer.capabilities.isWebGL2) {
      renderer.dispose();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      display: 'block',
      border: 'none',
      outline: 'none',
      background: 'transparent',
    });
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    const uniforms: Record<string, THREE.IUniform> = {
      uTime:          { value: 0 },
      uAttenuation:   { value: 0 },
      uResolution:    { value: new THREE.Vector2() },
      uColor:         { value: new THREE.Color() },
      uColorTwo:      { value: new THREE.Color() },
      uLineThickness: { value: 0 },
      uBaseRadius:    { value: 0 },
      uRadiusStep:    { value: 0 },
      uScaleRate:     { value: 0 },
      uRingCount:     { value: 0 },
      uOpacity:       { value: 1 },
      uNoiseAmount:   { value: 0 },
      uRotation:      { value: 0 },
      uRingGap:       { value: 1.5 },
      uFadeIn:        { value: 0.7 },
      uFadeOut:       { value: 0.5 },
      uCoverageAlpha: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material));

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setSize(w, h);
      renderer.setPixelRatio(dpr);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let frameId = 0;
    let isVisible = false;
    let isPageVisible = !document.hidden;
    let elapsed = 0;
    let lastT = 0;

    const animate = (t: number) => {
      frameId = requestAnimationFrame(animate);
      const p = propsRef.current;
      const dt = lastT === 0 ? 0 : Math.min(t - lastT, 100);
      lastT = t;
      elapsed += dt * 0.001 * p.speed;

      uniforms.uTime.value = elapsed;
      uniforms.uAttenuation.value = p.attenuation;
      (uniforms.uColor.value as THREE.Color).set(p.color);
      (uniforms.uColorTwo.value as THREE.Color).set(p.colorTwo);
      uniforms.uLineThickness.value = p.lineThickness;
      uniforms.uBaseRadius.value = p.baseRadius;
      uniforms.uRadiusStep.value = p.radiusStep;
      uniforms.uScaleRate.value = p.scaleRate;
      uniforms.uRingCount.value = p.ringCount;
      uniforms.uOpacity.value = p.opacity;
      uniforms.uNoiseAmount.value = p.noiseAmount;
      uniforms.uRotation.value = (p.rotation * Math.PI) / 180;
      uniforms.uRingGap.value = p.ringGap;
      uniforms.uFadeIn.value = p.fadeIn;
      uniforms.uFadeOut.value = p.fadeOut;
      uniforms.uCoverageAlpha.value = 0;

      renderer.render(scene, camera);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && frameId === 0) {
        lastT = 0;
        frameId = requestAnimationFrame(animate);
      }
    };

    const tryStop = () => {
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 },
    );
    io.observe(mount);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVisibility);
    tryStart();

    return () => {
      tryStop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      ro.disconnect();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        width: '200%',
        height: '200%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        maskImage: 'radial-gradient(circle, black 50%, transparent 65%)',
        WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 65%)',
      }}
    />
  );
}
