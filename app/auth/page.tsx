"use client";
import React, { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';

// ────────────────────────────────────────────────────────────────────────────
// 1. CLICK SPARK COMPONENT
// ────────────────────────────────────────────────────────────────────────────

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  extraScale?: number;
  children?: React.ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);
    resizeCanvas();

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback((t: number) => {
    switch (easing) {
      case 'linear': return t;
      case 'ease-in': return t * t;
      case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default: return t * (2 - t);
    }
  }, [easing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark: Spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeFunc(progress);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
      x, y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }));
    sparksRef.current.push(...newSparks);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} onClick={handleClick}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
      {children}
    </div>
  );
};


// ────────────────────────────────────────────────────────────────────────────
// 2. FLOATING LINES (THREE.JS SHADER COMPONENT)
// ────────────────────────────────────────────────────────────────────────────

const vertexShader = `
precision highp float;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;
  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) return baseColor;
  vec3 gradientColor;
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);
    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];
    gradientColor = mix(c1, c2, f);
  }
  return gradientColor * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) baseUv += parallaxOffset;

  vec3 col = vec3(0.0);
  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi, baseUv, mouseUv, interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi, baseUv, mouseUv, interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi, baseUv, mouseUv, interactive
      ) * 0.1;
    }
  }

  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;
type WavePosition = { x: number; y: number; rotate: number; };

type FloatingLinesProps = {
  linesGradient?: string[];
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
};

function hexToVec3(hex: string): Vector3 {
  let value = hex.trim();
  if (value.startsWith('#')) value = value.slice(1);
  let r = 255, g = 255, b = 255;
  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }
  return new Vector3(r / 255, g / 255, b / 255);
}

const FloatingLines = ({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
}: FloatingLinesProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const currentMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef<number>(0);
  const currentInfluenceRef = useRef<number>(0);
  const targetParallaxRef = useRef<Vector2>(new Vector2(0, 0));
  const currentParallaxRef = useRef<Vector2>(new Vector2(0, 0));

  const getLineCount = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes(waveType)) return 0;
    return lineCount[enabledWaves.indexOf(waveType)] ?? 6;
  };

  const getLineDistance = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineDistance === 'number') return lineDistance;
    if (!enabledWaves.includes(waveType)) return 0.1;
    return lineDistance[enabledWaves.indexOf(waveType)] ?? 0.1;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },
      enableTop: { value: enabledWaves.includes('top') },
      enableMiddle: { value: enabledWaves.includes('middle') },
      enableBottom: { value: enabledWaves.includes('bottom') },
      topLineCount: { value: enabledWaves.includes('top') ? getLineCount('top') : 0 },
      middleLineCount: { value: enabledWaves.includes('middle') ? getLineCount('middle') : 0 },
      bottomLineCount: { value: enabledWaves.includes('bottom') ? getLineCount('bottom') : 0 },
      topLineDistance: { value: (enabledWaves.includes('top') ? getLineDistance('top') : 0.1) * 0.01 },
      middleLineDistance: { value: (enabledWaves.includes('middle') ? getLineDistance('middle') : 0.1) * 0.01 },
      bottomLineDistance: { value: (enabledWaves.includes('bottom') ? getLineDistance('bottom') : 0.1) * 0.01 },
      topWavePosition: { value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4) },
      middleWavePosition: { value: new Vector3(middleWavePosition?.x ?? 5.0, middleWavePosition?.y ?? 0.0, middleWavePosition?.rotate ?? 0.2) },
      bottomWavePosition: { value: new Vector3(bottomWavePosition?.x ?? 2.0, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4) },
      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },
      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },
      lineGradient: { value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)) },
      lineGradientCount: { value: 0 }
    };

    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;
      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
      });
    }

    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    const setSize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
    };
    setSize();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (active) setSize(); }) : null;
    if (ro) ro.observe(container);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dpr = renderer.getPixelRatio();
      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
      targetInfluenceRef.current = 1.0;
      if (parallax) {
        targetParallaxRef.current.set(((x - rect.width / 2) / rect.width) * parallaxStrength, (-(y - rect.height / 2) / rect.height) * parallaxStrength);
      }
    };

    const handlePointerLeave = () => { targetInfluenceRef.current = 0.0; };

    if (interactive) {
      renderer.domElement.addEventListener('pointermove', handlePointerMove);
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    }

    let raf = 0;
    const renderLoop = () => {
      if (!active) return;
      uniforms.iTime.value = clock.getElapsedTime();
      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        uniforms.iMouse.value.copy(currentMouseRef.current);
        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluenceRef.current;
      }
      if (parallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
        uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (interactive) {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove);
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement);
    };
  }, [linesGradient, enabledWaves, lineCount, lineDistance, topWavePosition, middleWavePosition, bottomWavePosition, animationSpeed, interactive, bendRadius, bendStrength, mouseDamping, parallax, parallaxStrength]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }} />;
};

// ────────────────────────────────────────────────────────────────────────────
// 3. BORDER GLOW & GLOBAL STYLES
// ────────────────────────────────────────────────────────────────────────────

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number): Record<string, string> {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: string[]): Record<string, string> {
  const vars: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x: number) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x: number) { return x * x * x; }

interface AnimateOpts {
  start?: number; end?: number; duration?: number; delay?: number;
  ease?: (t: number) => number; onUpdate: (v: number) => void; onEnd?: () => void;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }: AnimateOpts) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#060010',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const edge = getEdgeProximity(card, x, y);
    const angle = getCursorAngle(card, x, y);
    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, [getEdgeProximity, getCursorAngle]);

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);

    animateValue({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', `${v}`) });
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => card.style.setProperty('--edge-proximity', `${v}`),
      onEnd: () => card.classList.remove('sweep-active'),
    });
  }, [animated]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      } as React.CSSProperties}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
  
  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
    font-family: 'JetBrains Mono', monospace;
  }

  input, select, button, textarea { 
    font-family: 'JetBrains Mono', monospace; 
    outline: none; 
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .card-anim { animation: fadeUp 0.7s cubic-bezier(0.25, 1, 0.5, 1) both; }

  @keyframes floatBot {
    0%, 100% { transform: translateY(0px); filter: drop-shadow(0 24px 32px rgba(0,0,0,0.25)); }
    50% { transform: translateY(-16px); filter: drop-shadow(0 32px 40px rgba(0,0,0,0.12)); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); max-height: 0; }
    to { opacity: 1; transform: translateY(0); max-height: 200px; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* ── EXACT BORDER GLOW CSS STYLES ── */
  .border-glow-card {
    --edge-proximity: 0;
    --cursor-angle: 45deg;
    --edge-sensitivity: 30;
    --color-sensitivity: calc(var(--edge-sensitivity) + 20);
    --border-radius: 28px;
    --glow-padding: 40px;
    --cone-spread: 25;

    position: relative;
    border-radius: var(--border-radius);
    isolation: isolate;
    transform: translate3d(0, 0, 0.01px);
    display: grid;
    border: 1px solid rgb(255 255 255 / 15%);
    background: var(--card-bg, #060010);
    overflow: visible;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 1px 2px,
      rgba(0, 0, 0, 0.1) 0px 2px 4px,
      rgba(0, 0, 0, 0.1) 0px 4px 8px,
      rgba(0, 0, 0, 0.1) 0px 8px 16px,
      rgba(0, 0, 0, 0.1) 0px 16px 32px,
      rgba(0, 0, 0, 0.1) 0px 32px 64px;
  }

  .border-glow-card::before,
  .border-glow-card::after,
  .border-glow-card > .edge-light {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    transition: opacity 0.25s ease-out;
    z-index: -1;
  }

  .border-glow-card:not(:hover):not(.sweep-active)::before,
  .border-glow-card:not(:hover):not(.sweep-active)::after,
  .border-glow-card:not(:hover):not(.sweep-active) > .edge-light {
    opacity: 0;
    transition: opacity 0.75s ease-in-out;
  }

  .border-glow-card::before {
    border: 1px solid transparent;
    background:
      linear-gradient(var(--card-bg, #060010) 0 100%) padding-box,
      linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box,
      var(--gradient-one, radial-gradient(at 80% 55%, hsla(268, 100%, 76%, 1) 0px, transparent 50%)) border-box,
      var(--gradient-two, radial-gradient(at 69% 34%, hsla(349, 100%, 74%, 1) 0px, transparent 50%)) border-box,
      var(--gradient-three, radial-gradient(at 8% 6%, hsla(136, 100%, 78%, 1) 0px, transparent 50%)) border-box,
      var(--gradient-four, radial-gradient(at 41% 38%, hsla(192, 100%, 64%, 1) 0px, transparent 50%)) border-box,
      var(--gradient-five, radial-gradient(at 86% 85%, hsla(186, 100%, 74%, 1) 0px, transparent 50%)) border-box,
      var(--gradient-six, radial-gradient(at 82% 18%, hsla(52, 100%, 65%, 1) 0px, transparent 50%)) border-box,
      var(--gradient-seven, radial-gradient(at 51% 4%, hsla(12, 100%, 72%, 1) 0px, transparent 50%)) border-box,
      var(--gradient-base, linear-gradient(#c299ff 0 100%)) border-box;

    opacity: calc((var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));

    mask-image:
      conic-gradient(
        from var(--cursor-angle) at center,
        black calc(var(--cone-spread) * 1%),
        transparent calc((var(--cone-spread) + 15) * 1%),
        transparent calc((100 - var(--cone-spread) - 15) * 1%),
        black calc((100 - var(--cone-spread)) * 1%)
      );
  }

  .border-glow-card::after {
    border: 1px solid transparent;
    background:
      var(--gradient-one, radial-gradient(at 80% 55%, hsla(268, 100%, 76%, 1) 0px, transparent 50%)) padding-box,
      var(--gradient-two, radial-gradient(at 69% 34%, hsla(349, 100%, 74%, 1) 0px, transparent 50%)) padding-box,
      var(--gradient-three, radial-gradient(at 8% 6%, hsla(136, 100%, 78%, 1) 0px, transparent 50%)) padding-box,
      var(--gradient-four, radial-gradient(at 41% 38%, hsla(192, 100%, 64%, 1) 0px, transparent 50%)) padding-box,
      var(--gradient-five, radial-gradient(at 86% 85%, hsla(186, 100%, 74%, 1) 0px, transparent 50%)) padding-box,
      var(--gradient-six, radial-gradient(at 82% 18%, hsla(52, 100%, 65%, 1) 0px, transparent 50%)) padding-box,
      var(--gradient-seven, radial-gradient(at 51% 4%, hsla(12, 100%, 72%, 1) 0px, transparent 50%)) padding-box,
      var(--gradient-base, linear-gradient(#c299ff 0 100%)) padding-box;

    mask-image:
      linear-gradient(to bottom, black, black),
      radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
      radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
      radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
      radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
      radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
      conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);

    mask-composite: subtract, add, add, add, add, add;
    opacity: calc(var(--fill-opacity, 0.5) * (var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
    mix-blend-mode: soft-light;
  }

  .border-glow-card > .edge-light {
    inset: calc(var(--glow-padding) * -1);
    pointer-events: none;
    z-index: 1;

    mask-image:
      conic-gradient(
        from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%
      );

    opacity: calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity)));
    mix-blend-mode: plus-lighter;
  }

  .border-glow-card > .edge-light::before {
    content: "";
    position: absolute;
    inset: var(--glow-padding);
    border-radius: inherit;
    box-shadow:
      inset 0 0 0 1px var(--glow-color, hsl(40deg 80% 80% / 100%)),
      inset 0 0 1px 0 var(--glow-color-60, hsl(40deg 80% 80% / 60%)),
      inset 0 0 3px 0 var(--glow-color-50, hsl(40deg 80% 80% / 50%)),
      inset 0 0 6px 0 var(--glow-color-40, hsl(40deg 80% 80% / 40%)),
      inset 0 0 15px 0 var(--glow-color-30, hsl(40deg 80% 80% / 30%)),
      inset 0 0 25px 2px var(--glow-color-20, hsl(40deg 80% 80% / 20%)),
      inset 0 0 50px 2px var(--glow-color-10, hsl(40deg 80% 80% / 10%)),
      0 0 1px 0 var(--glow-color-60, hsl(40deg 80% 80% / 60%)),
      0 0 3px 0 var(--glow-color-50, hsl(40deg 80% 80% / 50%)),
      0 0 6px 0 var(--glow-color-40, hsl(40deg 80% 80% / 40%)),
      0 0 15px 0 var(--glow-color-30, hsl(40deg 80% 80% / 30%)),
      0 0 25px 2px var(--glow-color-20, hsl(40deg 80% 80% / 20%)),
      0 0 50px 2px var(--glow-color-10, hsl(40deg 80% 80% / 10%));
  }

  .border-glow-inner {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: auto;
    z-index: 1;
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border-radius: calc(var(--border-radius) - 1px);
  }

  /* Typing cursor */
  .typing-cursor::after {
    content: '|';
    animation: blink 1s step-end infinite;
    color: var(--neon-pink);
  }
  @keyframes blink { 50% { opacity: 0; } }

  /* Inputs & Buttons */
  .bubbly-input {
    width: 100%;
    padding: 14px 16px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 14px;
    border: 2px solid transparent;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    backdrop-filter: blur(8px);
  }
  .bubbly-input:focus {
    transform: translateY(-2px);
    border-color: var(--neon-purple);
    box-shadow: 0 4px 20px rgba(177, 133, 255, 0.15);
  }
  .bubbly-input::placeholder { opacity: 0.5; font-weight: 400; }

  .bubbly-btn {
    width: 100%;
    padding: 16px;
    font-size: 14px;
    font-weight: 700;
    color: white;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
    box-shadow: 0 8px 24px rgba(135, 186, 255, 0.35);
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    letter-spacing: -0.02em;
    position: relative;
    overflow: hidden;
  }
  .bubbly-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
    border-radius: inherit;
    pointer-events: none;
  }
  .bubbly-btn:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 12px 32px rgba(135, 186, 255, 0.5);
  }
  .bubbly-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
  .bubbly-btn:disabled { cursor: not-allowed; opacity: 0.85; }

  /* Select wrapper */
  .select-wrap { position: relative; }
  .select-wrap::after {
    content: ''; position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent;
    border-top: 6px solid currentColor; pointer-events: none; opacity: 0.5;
  }

  /* Password wrapper */
  .pw-wrap { position: relative; }
  .pw-toggle {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; font-size: 16px;
    opacity: 0.5; transition: opacity 0.2s; padding: 4px; line-height: 1;
  }
  .pw-toggle:hover { opacity: 0.9; }

  /* Loading spinner */
  .spinner {
    display: inline-block; width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    vertical-align: middle; margin-right: 8px;
  }

  /* Error / Success */
  .auth-error, .auth-success {
    border-radius: 12px; padding: 12px 16px; font-size: 12px; font-weight: 600;
    animation: fadeIn 0.3s ease; display: flex; alignItems: center; gap: 8px;
  }
  .auth-error { background: rgba(255, 107, 107, 0.12); border: 1px solid rgba(255, 107, 107, 0.3); color: #ff6b6b; }
  .auth-success { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #22c55e; }

  /* Tab toggle */
  .auth-tabs { display: flex; background: rgba(128, 128, 128, 0.1); border-radius: 14px; padding: 4px; margin-bottom: 28px; }
  .auth-tab {
    flex: 1; padding: 11px 0; font-size: 13px; font-weight: 700; border: none; background: none;
    cursor: pointer; border-radius: 11px; transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .auth-tab.active { box-shadow: 0 2px 12px rgba(0,0,0,0.1); }

  /* Divider */
  .auth-divider { display: flex; alignItems: center; gap: 12px; margin: 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.4; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: currentColor; opacity: 0.3; }

  /* Responsive & scrollbars */
  @media (max-width: 900px) {
    .auth-layout { flex-direction: column !important; }
    .auth-left-panel { min-height: 300px !important; border-radius: 0 0 32px 32px !important; flex: none !important; }
    .auth-right-panel { padding: 24px 16px !important; margin-top: 0 !important; }
    .auth-form-inner { padding: 28px 20px !important; }
  }
  .border-glow-inner::-webkit-scrollbar { width: 4px; }
  .border-glow-inner::-webkit-scrollbar-track { background: transparent; }
  .border-glow-inner::-webkit-scrollbar-thumb { background: rgba(177, 133, 255, 0.3); border-radius: 4px; }
`;

// ────────────────────────────────────────────────────────────────────────────
// 3. THEME SETTINGS & HELPERS
// ────────────────────────────────────────────────────────────────────────────

const LIGHT = {
  bg: "#f0f2f8",
  formBg: "rgba(255, 255, 255, 0.75)",
  text: "#1a202c",
  subtext: "#64748b",
  inputBg: "rgba(241, 245, 249, 0.9)",
  inputText: "#1e293b",
  neonPink: "#f472b6",
  neonBlue: "#60a5fa",
  neonPurple: "#a78bfa",
  glowAccent: "270 80 75", 
  glowMeshColors: ['#a78bfa', '#f472b6', '#60a5fa'],
  tabActiveBg: "rgba(255,255,255,0.95)",
  tabActiveText: "#1a202c",
  tabInactiveText: "#94a3b8",
  mapFilter: "hue-rotate(320deg) brightness(105%) contrast(110%) saturate(120%) opacity(0.9)",
  mapOverlay: "linear-gradient(135deg, rgba(240,242,248,0.8) 0%, rgba(240,242,248,0.2) 40%, rgba(240,242,248,0.4) 60%, rgba(240,242,248,0.9) 100%)",
};

const DARK = {
  bg: "#0a0b14",
  formBg: "rgba(15, 15, 30, 0.75)", 
  text: "#f1f5f9",
  subtext: "#94a3b8",
  inputBg: "rgba(30, 41, 59, 0.8)",
  inputText: "#f1f5f9",
  neonPink: "#f472b6",
  neonBlue: "#60a5fa",
  neonPurple: "#a78bfa",
  glowAccent: "270 90 70",
  glowMeshColors: ['#a78bfa', '#f472b6', '#60a5fa'],
  tabActiveBg: "rgba(30, 30, 60, 0.9)",
  tabActiveText: "#f1f5f9",
  tabInactiveText: "#64748b",
  mapFilter: "invert(90%) hue-rotate(210deg) brightness(80%) contrast(130%) saturate(150%) sepia(30%)",
  mapOverlay: "linear-gradient(135deg, rgba(10,11,20,0.8) 0%, rgba(10,11,20,0.2) 40%, rgba(10,11,20,0.4) 60%, rgba(10,11,20,0.9) 100%)",
};

const HOSTELS = { Male: ["N Block", "Paari", "Kaari", "Oori"], Female: ["M Block", "Meenakshi"] };

function FW({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>{children}</div>;
}

function Label({ children, color }: { children: React.ReactNode; color: string }) {
  return <label style={{ fontSize: 11, fontWeight: 700, color, paddingLeft: 6, transition: "color 0.3s", textTransform: "uppercase", letterSpacing: "0.08em" }}>{children}</label>;
}

function useTypewriter(text: string, speed = 100) {
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayText("");
    const timer = setInterval(() => {
      i++;
      setDisplayText(text.substring(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return displayText;
}

// ────────────────────────────────────────────────────────────────────────────
// 4. MAIN PAGE COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ regNo: "", name: "", email: "", password: "", gender: "", hostel: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpRegNo, setOtpRegNo] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const headingText = useTypewriter("Campus Delivery Bot", 80);
  const t = dark ? DARK : LIGHT;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setError(""); setSuccess("");
    setForm(p => ({ ...p, [k]: val, ...(k === "gender" ? { hostel: "" } : {}) }));
  };

  const switchTab = (toLogin: boolean) => {
    setIsLogin(toLogin); setError(""); setSuccess(""); setShowPw(false); setShowOtp(false); setOtp("");
    setForm({ regNo: "", name: "", email: "", password: "", gender: "", hostel: "", phone: "" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch("/api/auth/login", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ regno: form.regNo, password: form.password }),
        });
        const data = await res.json();
        if (!data.success) setError(data.message || "Login failed");
        else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/dashboard");
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ regno: form.regNo, name: form.name, email: form.email, password: form.password, phone: form.phone || undefined, hostel: form.hostel || undefined }),
        });
        const data = await res.json();
        if (!data.success) setError(data.message || "Registration failed");
        else {
          setOtpRegNo(form.regNo); setShowOtp(true); setResendCooldown(60);
          setSuccess(data.message || "OTP sent to your email!");
        }
      }
    } catch { setError("Network error. Please try again."); } 
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setError(""); setSuccess("");
    if (otp.length !== 6) { setError("Enter a valid 6-digit OTP"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno: otpRegNo, otp }),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || "Verification failed");
      else {
        setSuccess("Email verified! Redirecting to login...");
        setTimeout(() => { switchTab(true); setSuccess(""); }, 1500);
      }
    } catch { setError("Network error. Please try again."); } 
    finally { setLoading(false); }
  };

  const resendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno: otpRegNo }),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || "Failed to resend OTP");
      else { setResendCooldown(60); setSuccess("New OTP sent to your email!"); }
    } catch { setError("Network error. Please try again."); } 
    finally { setLoading(false); }
  };

  const hostels: string[] = HOSTELS[form.gender as keyof typeof HOSTELS] || [];

  return (
    <>
      <style>{css}</style>
      <ClickSpark sparkColor={t.neonPurple} sparkSize={12} sparkRadius={25} sparkCount={12} duration={600} extraScale={1.2}>
        <div 
          style={{ 
            minHeight: "100vh", 
            width: "100%",
            display: "flex", 
            position: "relative",
            backgroundColor: t.bg,
            transition: "background-color 0.5s ease",
            "--neon-pink": t.neonPink,
            "--neon-blue": t.neonBlue,
            "--neon-purple": t.neonPurple,
            overflow: "hidden"
          } as React.CSSProperties}
        >

          {/* ── INTERACTIVE SHADER BACKGROUND ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            /* Invert the background when in Light mode to convert the black base to white */
            filter: dark ? "none" : "invert(1) hue-rotate(180deg)",
            transition: "filter 0.5s ease"
          }}>
            <FloatingLines 
              linesGradient={[t.neonPurple, t.neonPink, t.neonBlue]}
              mixBlendMode={dark ? "screen" : "multiply"}
              animationSpeed={1.5}
            />
          </div>

          {/* ── SRM LOGO (Moved to Bottom Right) ── */}
          <img 
            src="/srm-logo.png" 
            alt="SRM Logo"
            style={{
              position: "absolute",
              bottom: "24px",
              right: "24px",
              height: "48px",
              objectFit: "contain",
              zIndex: 30,
              filter: dark ? "drop-shadow(0 0 16px rgba(167,139,250,0.3))" : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
              transition: "all 0.4s ease"
            }}
          />

          {/* Theme toggle */}
          <button 
            onClick={(e) => { e.stopPropagation(); setDark(d => !d); }} 
            aria-label="Toggle theme"
            style={{ 
              position: "absolute", top: 24, right: 24, zIndex: 30,
              padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer",
              background: dark ? "rgba(30,30,60,0.8)" : "rgba(255,255,255,0.85)", 
              color: t.text, fontWeight: 700, fontSize: "11px",
              boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.06)", 
              transition: "all 0.35s ease", backdropFilter: "blur(12px)",
              letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{dark ? "☀️" : "🌙"}</span>
            {dark ? "LIGHT" : "DARK"}
          </button>

          {/* ── MAIN CONTENT LAYER ── */}
          <div className="auth-layout" style={{ position: "relative", zIndex: 5, width: "100%", display: "flex", flexWrap: "wrap", pointerEvents: "none" }}>
            
            {/* ── LEFT PANEL (Beautified Dynamic Map & Bot) ── */}
            <div className="auth-left-panel" style={{
              flex: "1 1 50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "40px", position: "relative", overflow: "hidden", minHeight: "100vh",
              pointerEvents: "auto" // Re-enable pointer events for the map
            }}>
              
              {/* Working Embedded Google Map (SRM Kattankulathur Campus) */}
              <iframe 
                src="https://maps.google.com/maps?q=...&output=embed"
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, zIndex: 0,
                  filter: t.mapFilter, transition: "filter 0.5s ease"
                }}
                allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Vignette map edge fade */}
              <div style={{
                position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
                background: `radial-gradient(ellipse at center, transparent 30%, ${t.bg} 100%)`,
                transition: "background 0.5s ease"
              }}/>
              
              {/* Additional smooth directional overlay */}
              <div style={{
                position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
                background: t.mapOverlay, transition: "background 0.5s ease"
              }}/>

              {/* Bot and Typography */}
              <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img 
                  className="auth-bot-image"
                  src="/cdb.png" 
                  alt="Campus Delivery Bot"
                  style={{ width: "100%", maxWidth: "420px", animation: "floatBot 6s ease-in-out infinite" }}
                />
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <h1 
                    className="typing-cursor card-anim auth-heading"
                    style={{ 
                      fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, color: t.text,
                      letterSpacing: "-0.04em", textShadow: dark ? "0 4px 24px rgba(0,0,0,0.6)" : "0 4px 24px rgba(255,255,255,0.6)",
                      transition: "color 0.5s ease", lineHeight: 1.2,
                    }}
                  >
                    {headingText}
                  </h1>
                  <p className="card-anim" style={{ 
                    color: t.subtext, fontSize: "clamp(12px, 1.2vw, 14px)", fontWeight: 500, marginTop: 12,
                    transition: "color 0.5s", letterSpacing: "-0.01em", animationDelay: "0.2s"
                  }}>
                    Autonomous delivery across SRM campus
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL (Floating Glow Form) ── */}
            <div className="auth-right-panel" style={{ 
              flex: "1 1 50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", pointerEvents: "auto"
            }}>
              <BorderGlow 
                className="card-anim" backgroundColor={t.formBg} glowColor={t.glowAccent} colors={t.glowMeshColors}
                animated={true} borderRadius={24} glowRadius={40} coneSpread={25} fillOpacity={0.65}
              >
                <div className="auth-form-inner" style={{ padding: "36px 32px", width: "100%", maxWidth: "440px" }}>
                  
                  <div className="auth-tabs">
                    <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => switchTab(true)} style={{ color: isLogin ? t.tabActiveText : t.tabInactiveText, background: isLogin ? t.tabActiveBg : "transparent" }}>
                      Sign In
                    </button>
                    <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => switchTab(false)} style={{ color: !isLogin ? t.tabActiveText : t.tabInactiveText, background: !isLogin ? t.tabActiveBg : "transparent" }}>
                      Register
                    </button>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: t.text, marginBottom: 6, transition: "color 0.3s", letterSpacing: "-0.03em" }}>
                      {isLogin ? "Welcome Back 👋" : "Join the Fleet 🚀"}
                    </h2>
                    <p style={{ color: t.subtext, fontSize: 12, fontWeight: 500, transition: "color 0.3s", letterSpacing: "-0.01em" }}>
                      {isLogin ? "Sign in to track your deliveries." : "Register with your SRM credentials."}
                    </p>
                  </div>

                  {error && <div className="auth-error" style={{ marginBottom: 16 }}><span>⚠️</span> {error}</div>}

                  <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <FW><Label color={t.subtext}>Registration Number</Label><input className="bubbly-input" style={{ background: t.inputBg, color: t.inputText }} placeholder="RA2211003011234" value={form.regNo} onChange={set("regNo")} required /></FW>

                    {!isLogin && (
                      <>
                        <FW style={{ animation: "slideDown 0.35s ease both" }}><Label color={t.subtext}>Full Name</Label><input className="bubbly-input" style={{ background: t.inputBg, color: t.inputText }} placeholder="John Doe" value={form.name} onChange={set("name")} required /></FW>
                        <FW style={{ animation: "slideDown 0.35s ease both", animationDelay: "0.05s" }}><Label color={t.subtext}>SRM Email</Label><input className="bubbly-input" type="email" style={{ background: t.inputBg, color: t.inputText }} placeholder="mi7136@srmist.edu.in" value={form.email} onChange={set("email")} required /></FW>
                        <FW style={{ animation: "slideDown 0.35s ease both", animationDelay: "0.1s" }}><Label color={t.subtext}>Phone</Label><input className="bubbly-input" type="tel" style={{ background: t.inputBg, color: t.inputText }} placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} required /></FW>

                        <div style={{ display: "flex", gap: 10, animation: "slideDown 0.35s ease both", animationDelay: "0.15s" }}>
                          <div style={{ flex: 1 }}>
                            <FW><Label color={t.subtext}>Gender</Label>
                              <div className="select-wrap" style={{ color: t.inputText }}>
                                <select className="bubbly-input" style={{ background: t.inputBg, color: t.inputText, cursor: "pointer", appearance: "none", paddingRight: 36 }} value={form.gender} onChange={set("gender")} required>
                                  <option value="" disabled>Select</option><option value="Male">Male</option><option value="Female">Female</option>
                                </select>
                              </div>
                            </FW>
                          </div>
                          
                          {form.gender && (
                            <div style={{ flex: 1, animation: "slideDown 0.25s ease both" }}>
                              <FW><Label color={t.subtext}>Hostel</Label>
                                <div className="select-wrap" style={{ color: t.inputText }}>
                                  <select className="bubbly-input" style={{ background: t.inputBg, color: t.inputText, cursor: "pointer", appearance: "none", paddingRight: 36 }} value={form.hostel} onChange={set("hostel")} required>
                                    <option value="" disabled>Block</option>{hostels.map((h: string) => <option key={h} value={h}>{h}</option>)}
                                  </select>
                                </div>
                              </FW>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <FW>
                      <Label color={t.subtext}>Password</Label>
                      <div className="pw-wrap">
                        <input className="bubbly-input" type={showPw ? "text" : "password"} style={{ background: t.inputBg, color: t.inputText, paddingRight: 44 }} placeholder="••••••••" value={form.password} onChange={set("password")} required minLength={6} />
                        <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} style={{ color: t.subtext }}>{showPw ? "🙈" : "👁️"}</button>
                      </div>
                    </FW>

                    <button className="bubbly-btn" type="submit" disabled={loading || showOtp} style={{ marginTop: 6 }}>
                      {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><span className="spinner" />Processing...</span> : isLogin ? "Sign In →" : "Create Account →"}
                    </button>
                  </form>

                  {showOtp && (
                    <div style={{ marginTop: 20, padding: "20px", borderRadius: 16, background: dark ? "rgba(167,139,250,0.08)" : "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)", animation: "slideDown 0.35s ease both" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 4 }}>📧 Verify Your Email</div>
                      <p style={{ fontSize: 11, color: t.subtext, marginBottom: 14 }}>Enter the 6-digit OTP sent to your SRM email.</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input className="bubbly-input" style={{ background: t.inputBg, color: t.inputText, letterSpacing: "0.3em", textAlign: "center", fontWeight: 700, fontSize: 18 }} placeholder="000000" value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} maxLength={6} />
                      </div>
                      <button className="bubbly-btn" onClick={verifyOtp} disabled={loading || otp.length !== 6} style={{ marginTop: 12 }}>
                        {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><span className="spinner" />Verifying...</span> : "Verify OTP ✓"}
                      </button>
                      <div style={{ marginTop: 12, textAlign: "center", fontSize: 11, color: t.subtext }}>
                        Didn't receive it? <button onClick={resendOtp} disabled={resendCooldown > 0 || loading} style={{ background: "none", border: "none", cursor: resendCooldown > 0 ? "not-allowed" : "pointer", color: resendCooldown > 0 ? t.subtext : t.neonPurple, fontWeight: 700, fontSize: 11, textDecoration: "underline", textUnderlineOffset: "3px", opacity: resendCooldown > 0 ? 0.5 : 1 }}>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}</button>
                      </div>
                    </div>
                  )}

                  {success && <div className="auth-success" style={{ marginTop: 16 }}><span>✅</span> {success}</div>}

                  <div className="auth-divider" style={{ color: t.subtext, marginTop: 20, marginBottom: 16 }}>or</div>
                  <div style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: t.subtext }}>
                    {isLogin ? "New to the campus?" : "Already registered?"} <button onClick={() => switchTab(!isLogin)} style={{ background: "none", border: "none", cursor: "pointer", color: t.neonPurple, fontWeight: 800, fontSize: 12, textDecoration: "underline", textUnderlineOffset: "4px", transition: "color 0.2s, opacity 0.2s" }}>{isLogin ? "Register here" : "Sign in instead"}</button>
                  </div>

                </div>
              </BorderGlow>
            </div>
            
          </div>
        </div>
      </ClickSpark>
    </>
  );
}