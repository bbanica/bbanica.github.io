import { useRef, useEffect } from 'react';
import { VERTEX_SHADER } from '../shaders.js';

// Renders an animated, pre-blurred WebGL gradient into its parent (which must be
// position:relative). The blur happens inside the fragment shader (see shaders.js),
// so there's no backdrop-filter layer to flicker. Shared by the hero and footer.

// Gaussian sigma of the blur, in CSS px (matches the old blur(40px) overlay).
const BLUR_PX = 40;
// The output is heavily blurred, so it can render well below CSS resolution and
// let the browser upscale — keeps the 48-tap blur cheap.
const RENDER_SCALE = 0.25;
export default function ShaderCanvas({ containerRef, fragmentShader, shaderKey = 0 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) return;

    const createShader = (src, type) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram();
    gl.attachShader(program, createShader(VERTEX_SHADER, gl.VERTEX_SHADER));
    gl.attachShader(program, createShader(fragmentShader, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'pos');
    const aspectLoc = gl.getUniformLocation(program, 'aspect');
    const timeLoc = gl.getUniformLocation(program, 'time');
    const blurLoc = gl.getUniformLocation(program, 'blur');

    let W, H, blurUv, t = 0;
    const resize = () => {
      W = Math.max(1, Math.floor(container.offsetWidth * RENDER_SCALE));
      H = Math.max(1, Math.floor(container.offsetHeight * RENDER_SCALE));
      // uv spans 2 units vertically across the container's CSS height.
      blurUv = (BLUR_PX * 2) / Math.max(1, container.offsetHeight);
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = container.offsetWidth + 'px';
      canvas.style.height = container.offsetHeight + 'px';
      gl.viewport(0, 0, W, H);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.016;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(aspectLoc, W / H);
      gl.uniform1f(timeLoc, t * 0.5);
      gl.uniform1f(blurLoc, blurUv);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [containerRef, fragmentShader, shaderKey]);

  return (
    // The filter does double duty. It's the 10% darkening the old overlay applied,
    // and — more importantly — any CSS filter forces the canvas through the normal
    // compositing path every frame. Without one, the browser may hand this opaque,
    // constantly-updating canvas straight to the display hardware on some frames,
    // and the nav's backdrop-filter (which can't read pixels from that path) blinks.
    <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, filter: 'brightness(0.9)' }} />
  );
}
