import { useEffect, useRef } from 'react';
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

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;

  vec3 col = vec3(0.0);

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = vec3(0.22, 0.51, 0.96);

      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      float c = cos(angle);
      float s = sin(angle);
      vec2 ruv = vec2(
        baseUv.x * c - baseUv.y * s,
        baseUv.x * s + baseUv.y * c
      );
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        vec2(0.0),
        false
      ) * 0.5;
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

type FloatingLinesProps = {
  linesGradient?: string[];
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  animationSpeed?: number;
  interactive?: boolean;
  parallax?: boolean;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
};

export default function FloatingLines({
  linesGradient,
  enabledWaves = ['middle'],
  lineCount = [5],
  lineDistance = [0.3],
  animationSpeed = 0.4,
  interactive = false,
  parallax = false,
  mixBlendMode = 'normal'
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const middleLineCount = enabledWaves.includes('middle') ? (typeof lineCount === 'number' ? lineCount : lineCount[0] ?? 5) : 0;
  const middleLineDistance = enabledWaves.includes('middle') ? (typeof lineDistance === 'number' ? lineDistance * 0.01 : (lineDistance[0] ?? 0.3) * 0.01) : 0.01;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;

    const scene = new Scene();

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },

      enableTop: { value: false },
      enableMiddle: { value: true },
      enableBottom: { value: false },

      topLineCount: { value: 0 },
      middleLineCount: { value: middleLineCount },
      bottomLineCount: { value: 0 },

      topLineDistance: { value: 0.01 },
      middleLineDistance: { value: middleLineDistance },
      bottomLineDistance: { value: 0.01 },

      topWavePosition: { value: new Vector3(0, 0, 0) },
      middleWavePosition: { value: new Vector3(5.0, 0.0, 0.2) },
      bottomWavePosition: { value: new Vector3(0, 0, 0) },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: false },
      bendRadius: { value: 3.0 },
      bendStrength: { value: 0 },
      bendInfluence: { value: 0 },

      parallax: { value: false },
      parallaxStrength: { value: 0 },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: { value: Array.from({ length: 8 }, () => new Vector3(0.22, 0.51, 0.96)) },
      lineGradientCount: { value: 0 }
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    const setSize = () => {
      if (!active) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      renderer.setSize(width, height, false);

      const canvasWidth = renderer.domElement.width;
      const canvasHeight = renderer.domElement.height;
      uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1);
    };

    setSize();

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => { if (active) setSize(); })
      : null;

    if (ro) ro.observe(container);

    let raf = 0;
    const renderLoop = () => {
      if (!active) return;
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [middleLineCount, middleLineDistance, animationSpeed]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ mixBlendMode }}
    />
  );
}
