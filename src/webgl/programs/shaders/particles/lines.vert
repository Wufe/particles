precision highp float;

#define BOUNDARY_MARGIN_PERCENTAGE 10.0

#pragma glslify: vecToAbs = require(../utils/positioning.glsl)
#pragma glslify: getParticleColor = require(../shared/particle-color.glsl)

attribute vec3 v_position;
attribute vec4 v_color;
attribute float f_distance;

uniform vec3 v_res;
uniform mat4 m_world;
uniform mat4 m_view;
uniform mat4 m_projection;
uniform float f_t;

varying vec4 frag_col;

void main() {
    float distanceCoefficient = clamp(1.0 - (f_distance / 300.0), .05, 1.0);
    float alpha = min(getParticleColor(v_color, v_position, v_res, BOUNDARY_MARGIN_PERCENTAGE).w, distanceCoefficient);
    frag_col = vec4(v_color.xyz * alpha, alpha);
    vec3 pos = vecToAbs(v_position, v_res);
    // if (pos.x > .9 || pos.x < -.9 || pos.y > .9 || pos.y < -.9 || pos.z > .9 || pos.z < -.9) {
    //     frag_col = vec4(1.0, 0.0, 0.0, 1.0);
    // }
    gl_Position = m_projection * m_view * m_world * vec4(pos, 1.0);
}