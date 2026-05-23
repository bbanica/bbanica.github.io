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

export const HERO_FRAGMENT = `
  precision highp float;
  varying vec2 uv;
  uniform float time;

  void main() {
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

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const FOOTER_FRAGMENT = `
  precision highp float;
  varying vec2 uv;
  uniform float time;

  void main() {
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

    gl_FragColor = vec4(color, 1.0);
  }
`;
