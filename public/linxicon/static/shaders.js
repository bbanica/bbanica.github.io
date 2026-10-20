export const VERTEX_SHADER = `
  attribute vec2 pos;
  varying vec2 uv;
  uniform float aspect;
  void main() {
    uv = pos;
    uv.x *= aspect;
    gl_Position = vec4(pos, 0.0, 1.0);
  }
`;

const HERO_SHADE = `
  vec3 shade(vec2 uv) {
    vec3 C_BLUE = vec3(0.02, 0.4, 1.0);
    vec3 C_CYAN = vec3(0.0, 0.4, 0.44);
    vec3 C_PURPLE = vec3(0.44, 0.0, 0.4);
    vec3 C_DEEP = vec3(0.02, 0.08, 0.2);

    vec3 color = C_CYAN;
    float T = time;
    float T1 = T * 0.1;
    vec2 p = uv;

    p += vec2(sin(T * 0.2) * p.x, cos(T * 0.1) * p.y);
    p -= vec2(sin(T * 0.2) * p.y, cos(T * 0.1) * p.x);
    p.y += sin(p.x + T1 * 0.2 + 0.333 * sin(p.x * 2.0 + T * 0.5 - uv.y));

    float power = mod(p.y, 0.618);
    float f1 = sin(p.x * 0.62 + 1.1 * p.y + T * 0.5);

    power = smoothstep(0.0, 1.62, power);
    color = mix(mix(C_BLUE, C_PURPLE * power, f1), color, power);

    float shadow = sin(p.x * 0.3 + p.y * 0.5 + T * 0.2);
    color = mix(color, C_DEEP, shadow * 0.3 + 0.15);

    float accent = sin(p.x * 1.5 - p.y * 0.8 + T * 0.3);
    color = mix(color, C_CYAN * 1.2, accent * 0.15 + 0.05);

    return color;
  }
`;

const FOOTER_SHADE = `
  vec3 shade(vec2 uv) {
    vec3 C_BLUE = vec3(0.02, 0.4, 1.0);
    vec3 C_CYAN = vec3(0.0, 0.4, 0.44);
    vec3 C_PURPLE = vec3(0.44, 0.0, 0.4);
    vec3 C_DEEP = vec3(0.02, 0.08, 0.2);

    vec3 color = C_CYAN;
    float T = time;
    float T1 = T * 0.1;
    vec2 p = uv;

    p += vec2(sin(T * 0.15) * p.x, cos(T * 0.08) * p.y);
    p -= vec2(sin(T * 0.15) * p.y, cos(T * 0.08) * p.x);
    p.y += sin(p.x + T1 * 0.15 + 0.333 * sin(p.x * 1.5 + T * 0.4 - uv.y));

    float power = mod(p.y, 0.618);
    float f1 = sin(p.x * 0.62 + 1.1 * p.y + T * 0.4);

    power = smoothstep(0.0, 1.62, power);
    color = mix(mix(C_BLUE, C_PURPLE * power, f1), color, power);

    float shadow = sin(p.x * 0.3 + p.y * 0.5 + T * 0.15);
    color = mix(color, C_DEEP, shadow * 0.3 + 0.15);

    return color;
  }
`;

// The blur is baked into the shader rather than layered on with a CSS
// backdrop-filter — that overlay flickered and popped in/out as the browser
// re-composited it. Each pixel averages a Gaussian-weighted golden-angle spiral
// of samples, rotated per pixel (interleaved gradient noise) so sharp edges in
// the pattern don't ghost into visible stripes; `blur` is the Gaussian sigma in
// uv units (set from CSS px in ShaderCanvas). The old overlay's 10% darkening now
// lives on the canvas as a CSS filter (see ShaderCanvas for why).
const blurred = (shadeSrc) => `
  precision highp float;
  varying vec2 uv;
  uniform float time;
  uniform float blur;
  ${shadeSrc}
  void main() {
    const int N = 48;
    float spin = 6.2831853 * fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    vec3 sum = vec3(0.0);
    float wsum = 0.0;
    for (int i = 0; i < N; i++) {
      float fi = float(i) + 0.5;
      float r = sqrt(fi / float(N)) * 2.5;
      float a = fi * 2.39996323 + spin;
      float w = exp(-0.5 * r * r);
      sum += shade(uv + vec2(cos(a), sin(a)) * r * blur) * w;
      wsum += w;
    }
    gl_FragColor = vec4(sum / wsum, 1.0);
  }
`;

export const HERO_FRAGMENT = blurred(HERO_SHADE);
export const FOOTER_FRAGMENT = blurred(FOOTER_SHADE);
