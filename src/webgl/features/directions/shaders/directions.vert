precision highp float;

attribute vec3 v_pos;
attribute vec4 v_col;

uniform vec3 v_res;
uniform mat4 m_world;
uniform mat4 m_view;
uniform mat4 m_projection;
uniform float f_t;

varying vec4 frag_col;

void main() {
    frag_col = v_col;
    gl_Position = m_projection * m_view * m_world * vec4(v_pos, 1.0);
    gl_PointSize = 20.0;
}