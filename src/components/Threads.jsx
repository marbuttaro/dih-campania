import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Vec2, Vec3, Flowmap, Geometry } from 'ogl';

const Threads = ({
  color = [0.09, 0.22, 0.68],
  amplitude = 1.9,
  distance = 0.3,
  enableMouseInteraction = true,
}) => {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const flowmap = new Flowmap(gl, {
      falloff: distance,
      dissipation: 0.98,
      alpha: 0.5,
    });

    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const vertex = `
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      uniform sampler2D tWater;
      uniform vec3 uColor;
      uniform float uAmplitude;
      varying vec2 vUv;

      void main() {
        vec3 flow = texture2D(tWater, vUv).rgb;
        float noise = flow.r * uAmplitude;
        vec3 finalColor = uColor + noise * 0.1;
        gl_FragColor = vec4(finalColor, 0.8 + noise * 0.2);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        tWater: { value: flowmap.mask },
        uColor: { value: new Color(...color) },
        uAmplitude: { value: amplitude },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleMouseMove = (e) => {
      if (!enableMouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      flowmap.mouse.set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId;
    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    window.addEventListener('resize', resize);
    resize();

    const update = (t) => {
      animationId = requestAnimationFrame(update);
      flowmap.update();
      renderer.render({ scene: mesh });
    };
    animationId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      if (gl.canvas.parentElement) {
        container.removeChild(gl.canvas);
      }
    };
  }, [color, amplitude, distance, enableMouseInteraction]);

  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
};

export default Threads;
