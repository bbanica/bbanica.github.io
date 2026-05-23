import { useRef, useEffect } from 'react';
import { VERTEX_SHADER } from '../shaders.js';

// Renders an animated WebGL gradient into its parent (which must be position:relative),
// plus the frosted-glass blur overlay that sits on top of it. Shared by the hero and footer.
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

    let W, H, t = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.floor(container.offsetWidth * dpr);
      H = Math.floor(container.offsetHeight * dpr);
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
    <>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', background: 'rgba(0,0,0,0.1)' }} />
    </>
  );
}
