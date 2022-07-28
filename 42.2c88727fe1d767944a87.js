(window.webpackJsonp=window.webpackJsonp||[]).push([[42,127,128],{"0BfS":function(e,t,r){"use strict";r.d(t,"a",function(){return a});var i,n=r("OIYib"),o=r("UBvB");function a(e){e.fragment.include(o.a),e.fragment.uniforms.add("uShadowMapTex","sampler2D"),e.fragment.uniforms.add("uShadowMapNum","int"),e.fragment.uniforms.add("uShadowMapDistance","vec4"),e.fragment.uniforms.add("uShadowMapMatrix","mat4",4),e.fragment.uniforms.add("uDepthHalfPixelSz","float"),e.fragment.code.add(n.a`
    int chooseCascade(float _linearDepth, out mat4 mat) {
      vec4 distance = uShadowMapDistance;
      float depth = _linearDepth;

      //choose correct cascade
      int i = depth < distance[1] ? 0 : depth < distance[2] ? 1 : depth < distance[3] ? 2 : 3;

      mat = i == 0 ? uShadowMapMatrix[0] : i == 1 ? uShadowMapMatrix[1] : i == 2 ? uShadowMapMatrix[2] : uShadowMapMatrix[3];

      return i;
    }

    vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
      vec4 lv = mat * vec4(_vpos, 1.0);
      lv.xy /= lv.w;
      return 0.5 * lv.xyz + vec3(0.5);
    }

    vec2 cascadeCoordinates(int i, vec3 lvpos) {
      return vec2(float(i - 2 * (i / 2)) * 0.5, float(i / 2) * 0.5) + 0.5 * lvpos.xy;
    }

    float readShadowMapDepth(vec2 uv, sampler2D _depthTex) {
      return rgba2float(texture2D(_depthTex, uv));
    }

    float posIsInShadow(vec2 uv, vec3 lvpos, sampler2D _depthTex) {
      return readShadowMapDepth(uv, _depthTex) < lvpos.z ? 1.0 : 0.0;
    }

    float filterShadow(vec2 uv, vec3 lvpos, float halfPixelSize, sampler2D _depthTex) {
      float texSize = 0.5 / halfPixelSize;

      // filter, offset by half pixels
      vec2 st = fract((vec2(halfPixelSize) + uv) * texSize);

      float s00 = posIsInShadow(uv + vec2(-halfPixelSize, -halfPixelSize), lvpos, _depthTex);
      float s10 = posIsInShadow(uv + vec2(halfPixelSize, -halfPixelSize), lvpos, _depthTex);
      float s11 = posIsInShadow(uv + vec2(halfPixelSize, halfPixelSize), lvpos, _depthTex);
      float s01 = posIsInShadow(uv + vec2(-halfPixelSize, halfPixelSize), lvpos, _depthTex);

      return mix(mix(s00, s10, st.x), mix(s01, s11, st.x), st.y);
    }

    float readShadowMap(const in vec3 _vpos, float _linearDepth) {
      mat4 mat;
      int i = chooseCascade(_linearDepth, mat);

      if (i >= uShadowMapNum) { return 0.0; }

      vec3 lvpos = lightSpacePosition(_vpos, mat);

      // vertex completely outside? -> no shadow
      if (lvpos.z >= 1.0) { return 0.0; }
      if (lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) { return 0.0; }

      // calc coord in cascade texture
      vec2 uv = cascadeCoordinates(i, lvpos);

      return filterShadow(uv, lvpos, uDepthHalfPixelSz, uShadowMapTex);
    }
  `)}(i=a||(a={})).bindUniforms=function(e,t,r){t.shadowMappingEnabled&&(t.shadowMap.bind(e,r),t.shadowMap.bindView(e,t.origin))},i.bindViewCustomOrigin=function(e,t,r){t.shadowMappingEnabled&&t.shadowMap.bindView(e,r)},i.bindView=function(e,t){t.shadowMappingEnabled&&t.shadowMap.bindView(e,t.origin)}},"0Ect":function(e,t,r){"use strict";r.d(t,"a",function(){return o});var i=r("OIYib"),n=r("UBvB");function o(e){e.include(n.a),e.code.add(i.a`
    float linearDepthFromFloat(float depth, vec2 nearFar) {
      return -(depth * (nearFar[1] - nearFar[0]) + nearFar[0]);
    }

    float linearDepthFromTexture(sampler2D depthTex, vec2 uv, vec2 nearFar) {
      return linearDepthFromFloat(rgba2float(texture2D(depthTex, uv)), nearFar);
    }
  `)}},"0meK":function(e,t,r){"use strict";r("wSAH");var i=r("6S2I"),n=r("of9L"),o=r("kbDN");const a=i.a.getLogger("esri.views.webgl.FrameBufferObject");class s{constructor(e,t,r,i){if(this._context=e,this._glName=null,this._depthAttachment=null,this._stencilAttachment=null,this._colorAttachments=new Map,this._initialized=!1,this._desc={...t},e.instanceCounter.increment(4,this),r){let t;var a;if(Array.isArray(r))for(const i of r){const{attachmentPoint:r,texture:o}=i,a=o instanceof n.a?o:new n.a(e,o);t=a.descriptor,this._colorAttachments.set(r,a),this._validateColorAttachmentPoint(r),this._validateTextureDimensions(t,this._desc)}else r instanceof n.a?(t=r.descriptor,this._colorAttachments.set(36064,r)):(t=r,this._colorAttachments.set(36064,new n.a(e,r))),0!==(null==(a=this._desc)?void 0:a.colorTarget)&&console.error("Framebuffer is initialized with a texture however the descriptor indicates using a renderbuffer color attachment!"),this._validateTextureDimensions(t,this._desc)}if(i instanceof o.a){var c;const e=null!=(c=this._desc.depthStencilTarget)?c:3;2===e?this._stencilAttachment=i:1===e||3===e?this._depthAttachment=i:console.error('If a Renderbuffer is provided, "depthStencilTarget" must be one of STENCIL_RENDER_BUFFER, DEPTH_RENDER_BUFFER or DEPTH_STENCIL_RENDER_BUFFER'),s._validateBufferDimensions(i.descriptor,this._desc)}else if(i){let e;this._context.capabilities.depthTexture||console.error("Extension WEBGL_depth_texture isn't supported therefore it is no possible to set the depth/stencil texture as an attachment!"),i instanceof n.a?(this._depthStencilTexture=i,e=this._depthStencilTexture.descriptor):(e=i,this._depthStencilTexture=new n.a(this._context,e)),this._validateTextureDimensions(e,this._desc)}}dispose(){if(!this._desc)return;const e=this._context.getBoundFramebufferObject();this._disposeColorAttachments(),this._disposeDepthStencilAttachments(),this._glName&&(this._context.gl.deleteFramebuffer(this._glName),this._glName=null),this._context.bindFramebuffer(e),this._context.instanceCounter.decrement(4,this),this._desc=null}get glName(){return this._glName}get descriptor(){return this._desc}get colorTexture(){const e=this._colorAttachments.get(36064);return e&&e instanceof n.a?e:null}get colorAttachment(){return this._colorAttachments.get(36064)}get depthStencilAttachment(){return this._depthStencilTexture||this._depthAttachment||this._stencilAttachment}get depthStencilTexture(){return this._depthStencilTexture}get width(){return this._desc.width}get height(){return this._desc.height}getColorTexture(e){const t=this._colorAttachments.get(e);return t&&t instanceof n.a?t:null}attachColorTexture(e,t=36064){if(e){if(this._validateColorAttachmentPoint(t),this._validateTextureDimensions(e.descriptor,this._desc),this._disposeColorAttachments(),this._initialized){this._context.bindFramebuffer(this);const r=this._context.gl;r.framebufferTexture2D(r.FRAMEBUFFER,t,r.TEXTURE_2D,e.glName,0)}this._colorAttachments.set(t,e)}}detachColorTexture(e=36064){const t=this._colorAttachments.get(e);if(t instanceof n.a){const r=t;if(this._initialized){this._context.bindFramebuffer(this);const t=this._context.gl;t.framebufferTexture2D(t.FRAMEBUFFER,e,t.TEXTURE_2D,null,0)}return this._colorAttachments.delete(e),r}}attachDepthStencilTexture(e){if(!e)return;const t=e.descriptor;if(34041!==t.pixelFormat&&console.error("Depth/Stencil texture must have a pixel type of DEPTH_STENCIL!"),34042!==t.dataType&&console.error("Depth/Stencil texture must have data type of UNSIGNED_INT_24_8!"),this._context.capabilities.depthTexture||console.error("Extension WEBGL_depth_texture isn't supported therefore it is no possible to set the depth/stencil texture!"),this._validateTextureDimensions(t,this._desc),this._desc.depthStencilTarget&&4!==this._desc.depthStencilTarget&&(this._desc.depthStencilTarget=4),this._disposeDepthStencilAttachments(),this._initialized){this._context.bindFramebuffer(this);const t=this._context.gl;t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,e.glName,0)}this._depthStencilTexture=e}detachDepthStencilTexture(){const e=this._depthStencilTexture;if(e&&this._initialized){this._context.bindFramebuffer(this);const e=this._context.gl;this._context.gl.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,null,0)}return this._depthStencilTexture=null,e}attachDepthStencilBuffer(e){if(!e)return;const t=e.descriptor;if(34041!==t.internalFormat&&33189!==t.internalFormat&&console.error("Depth/Stencil buffer must have correct internalFormat"),s._validateBufferDimensions(t,this._desc),this._disposeDepthStencilAttachments(),this._desc.depthStencilTarget=34041===t.internalFormat?3:1,this._initialized){this._context.bindFramebuffer(this);const t=this._context.gl;t.framebufferRenderbuffer(t.FRAMEBUFFER,1===this._desc.depthStencilTarget?t.DEPTH_ATTACHMENT:t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,e.glName)}this._depthAttachment=e}detachDepthStencilBuffer(){const e=this._context.gl,t=this._depthAttachment;return t&&this._initialized&&(this._context.bindFramebuffer(this),e.framebufferRenderbuffer(e.FRAMEBUFFER,1===this._desc.depthStencilTarget?e.DEPTH_ATTACHMENT:e.DEPTH_STENCIL_ATTACHMENT,e.RENDERBUFFER,null)),this._depthAttachment=null,t}copyToTexture(e,t,r,i,n,o,a){(e<0||t<0||n<0||o<0)&&console.error("Offsets cannot be negative!"),(r<=0||i<=0)&&console.error("Copy width and height must be greater than zero!");const s=this._desc,c=a.descriptor;3553!==a.descriptor.target&&console.error("Texture target must be TEXTURE_2D!"),(e+r>s.width||t+i>s.height||n+r>c.width||o+i>c.height)&&console.error("Bad dimensions, the current input values will attempt to read or copy out of bounds!");const l=this._context;l.bindTexture(a,0),l.bindFramebuffer(this),l.gl.copyTexSubImage2D(3553,0,n,o,e,t,r,i)}readPixels(e,t,r,i,n,o,a){(r<=0||i<=0)&&console.error("Copy width and height must be greater than zero!"),a||console.error("Target memory is not initialized!"),this._context.bindFramebuffer(this),this._context.gl.readPixels(e,t,r,i,n,o,a)}resize(e,t){const r=this._desc;if(r.width!==e||r.height!==t){if(!this._initialized)return r.width=e,r.height=t,this._colorAttachments.forEach(r=>{r&&r.resize(e,t)}),void(this._depthStencilTexture&&this._depthStencilTexture.resize(e,t));r.width=e,r.height=t,this._colorAttachments.forEach(r=>{r&&r.resize(e,t)}),null!=this._depthStencilTexture?this._depthStencilTexture.resize(e,t):(this._depthAttachment||this._stencilAttachment)&&(this._depthAttachment&&this._depthAttachment.resize(e,t),this._stencilAttachment&&this._stencilAttachment.resize(e,t)),this._context.getBoundFramebufferObject()===this&&this._context.bindFramebuffer(null),this._initialized=!1}}initializeAndBind(){var e,t,r,i;const a=this._context.gl;if(this._initialized)return void a.bindFramebuffer(a.FRAMEBUFFER,this.glName);this._glName&&a.deleteFramebuffer(this._glName);const s=this._context,l=a.createFramebuffer(),u=this._desc,d=null!=(e=u.colorTarget)?e:1,h=null!=(t=u.width)?t:1,f=null!=(r=u.height)?r:1;if(a.bindFramebuffer(a.FRAMEBUFFER,l),0===this._colorAttachments.size)if(0===d)this._colorAttachments.set(36064,c(s,u));else{const e=new o.a(s,{internalFormat:32854,width:h,height:f});this._colorAttachments.set(36064,e)}this._colorAttachments.forEach((e,t)=>{e&&(e instanceof n.a?a.framebufferTexture2D(a.FRAMEBUFFER,t,a.TEXTURE_2D,e.glName,0):a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.RENDERBUFFER,e.glName))});const m=null!=(i=u.depthStencilTarget)?i:0;switch(m){case 1:case 3:this._depthAttachment||(this._depthAttachment=new o.a(s,{internalFormat:1===u.depthStencilTarget?33189:34041,width:h,height:f})),a.framebufferRenderbuffer(a.FRAMEBUFFER,1===m?a.DEPTH_ATTACHMENT:a.DEPTH_STENCIL_ATTACHMENT,a.RENDERBUFFER,this._depthAttachment.glName);break;case 2:this._stencilAttachment||(this._stencilAttachment=new o.a(s,{internalFormat:36168,width:h,height:f})),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.STENCIL_ATTACHMENT,a.RENDERBUFFER,this._stencilAttachment.glName);break;case 4:this._depthStencilTexture||(s.capabilities.depthTexture||console.error("Extension WEBGL_depth_texture isn't supported therefore it is no possible to set the depth/stencil texture as an attachment!"),this._depthStencilTexture=new n.a(s,{target:3553,pixelFormat:34041,dataType:34042,samplingMode:9728,wrapMode:33071,width:h,height:f})),a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,this._depthStencilTexture.glName,0)}this._glName=l,this._initialized=!0}_disposeColorAttachments(){this._colorAttachments.forEach((e,t)=>{if(e instanceof n.a){if(this._initialized){this._context.bindFramebuffer(this);const e=this._context.gl;e.framebufferTexture2D(e.FRAMEBUFFER,t,e.TEXTURE_2D,null,0)}e.dispose()}else if(e instanceof WebGLRenderbuffer){const r=this._context.gl;this._initialized&&(this._context.bindFramebuffer(this),r.framebufferRenderbuffer(r.FRAMEBUFFER,t,r.RENDERBUFFER,null)),this._context.gl.deleteRenderbuffer(e)}}),this._colorAttachments.clear()}_disposeDepthStencilAttachments(){const e=this._context.gl;this._depthAttachment&&(this._initialized&&(this._context.bindFramebuffer(this),e.framebufferRenderbuffer(e.FRAMEBUFFER,1===this._desc.depthStencilTarget?e.DEPTH_ATTACHMENT:e.DEPTH_STENCIL_ATTACHMENT,e.RENDERBUFFER,null)),this._depthAttachment.dispose(),this._depthAttachment=null),this._stencilAttachment&&(this._initialized&&(this._context.bindFramebuffer(this),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.STENCIL_ATTACHMENT,e.RENDERBUFFER,null)),this._stencilAttachment.dispose(),this._stencilAttachment=null),this._depthStencilTexture&&(this._initialized&&(this._context.bindFramebuffer(this),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,null,0)),this._depthStencilTexture.dispose(),this._depthStencilTexture=null)}static _validateBufferDimensions(e,t){console.assert(e.width>=0&&e.height>=0),void 0!==t.width&&t.width>=0&&void 0!==t.height&&t.height>=0?t.width===e.width&&t.height===e.height||console.error("Renderbuffer dimensions must match the framebuffer's!"):(t.width=e.width,t.height=e.height)}_validateTextureDimensions(e,t){console.assert(e.width>=0&&e.height>=0),3553!==e.target&&console.error("Texture type must be TEXTURE_2D!"),void 0!==t.width&&t.width>=0&&void 0!==t.height&&t.height>=0?t.width===e.width&&t.height===e.height||console.error("Color attachment texture must match the framebuffer's!"):(t.width=e.width,t.height=e.height)}_validateColorAttachmentPoint(e){if(-1===s._MAX_COLOR_ATTACHMENTS){const e=this._context.capabilities.drawBuffers;s._MAX_COLOR_ATTACHMENTS=e?this._context.gl.getParameter(e.MAX_COLOR_ATTACHMENTS):1}const t=e-36064;t+1>s._MAX_COLOR_ATTACHMENTS&&a.error("esri.FrameBufferObject",`illegal attachment point for color attachment: ${t+1}. Implementation supports up to ${s._MAX_COLOR_ATTACHMENTS} color attachments`)}}s._MAX_COLOR_ATTACHMENTS=-1;const c=(e,t)=>new n.a(e,{target:3553,pixelFormat:6408,dataType:5121,samplingMode:9728,wrapMode:33071,width:t.width,height:t.height});t.a=s},"0nJL":function(e,t,r){"use strict";r.d(t,"a",function(){return c});var i,n=r("srIe"),o=r("Cy1f"),a=r("5DEt"),s=r("OIYib");function c(e,t){if(t.slicePlaneEnabled){e.extensions.add("GL_OES_standard_derivatives"),t.sliceEnabledForVertexPrograms&&(e.vertex.uniforms.add("slicePlaneOrigin","vec3"),e.vertex.uniforms.add("slicePlaneBasis1","vec3"),e.vertex.uniforms.add("slicePlaneBasis2","vec3")),e.fragment.uniforms.add("slicePlaneOrigin","vec3"),e.fragment.uniforms.add("slicePlaneBasis1","vec3"),e.fragment.uniforms.add("slicePlaneBasis2","vec3");const r=s.a`
      struct SliceFactors {
        float front;
        float side0;
        float side1;
        float side2;
        float side3;
      };

      SliceFactors calculateSliceFactors(vec3 pos) {
        vec3 rel = pos - slicePlaneOrigin;

        vec3 slicePlaneNormal = -cross(slicePlaneBasis1, slicePlaneBasis2);
        float slicePlaneW = -dot(slicePlaneNormal, slicePlaneOrigin);

        float basis1Len2 = dot(slicePlaneBasis1, slicePlaneBasis1);
        float basis2Len2 = dot(slicePlaneBasis2, slicePlaneBasis2);

        float basis1Dot = dot(slicePlaneBasis1, rel);
        float basis2Dot = dot(slicePlaneBasis2, rel);

        return SliceFactors(
          dot(slicePlaneNormal, pos) + slicePlaneW,
          -basis1Dot - basis1Len2,
          basis1Dot - basis1Len2,
          -basis2Dot - basis2Len2,
          basis2Dot - basis2Len2
        );
      }

      bool sliceByFactors(SliceFactors factors) {
        return factors.front < 0.0
          && factors.side0 < 0.0
          && factors.side1 < 0.0
          && factors.side2 < 0.0
          && factors.side3 < 0.0;
      }

      bool sliceEnabled() {
        // a slicePlaneBasis1 vector of zero length is used to disable slicing in the shader during draped rendering.
        return dot(slicePlaneBasis1, slicePlaneBasis1) != 0.0;
      }

      bool sliceByPlane(vec3 pos) {
        return sliceEnabled() && sliceByFactors(calculateSliceFactors(pos));
      }

      #define rejectBySlice(_pos_) sliceByPlane(_pos_)
      #define discardBySlice(_pos_) { if (sliceByPlane(_pos_)) discard; }
    `,i=s.a`
      vec4 applySliceHighlight(vec4 color, vec3 pos) {
        SliceFactors factors = calculateSliceFactors(pos);

        if (sliceByFactors(factors)) {
          return color;
        }

        const float HIGHLIGHT_WIDTH = 1.0;
        const vec4 HIGHLIGHT_COLOR = vec4(0.0, 0.0, 0.0, 0.3);

        factors.front /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.front);
        factors.side0 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side0);
        factors.side1 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side1);
        factors.side2 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side2);
        factors.side3 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side3);

        float highlightFactor = (1.0 - step(0.5, factors.front))
          * (1.0 - step(0.5, factors.side0))
          * (1.0 - step(0.5, factors.side1))
          * (1.0 - step(0.5, factors.side2))
          * (1.0 - step(0.5, factors.side3));

        return mix(color, vec4(HIGHLIGHT_COLOR.rgb, color.a), highlightFactor * HIGHLIGHT_COLOR.a);
      }
    `,n=t.sliceHighlightDisabled?s.a`#define highlightSlice(_color_, _pos_) (_color_)`:s.a`
        ${i}
        #define highlightSlice(_color_, _pos_) (sliceEnabled() ? applySliceHighlight(_color_, _pos_) : (_color_))
      `;t.sliceEnabledForVertexPrograms&&e.vertex.code.add(r),e.fragment.code.add(r),e.fragment.code.add(n)}else{const r=s.a`
      #define rejectBySlice(_pos_) false
      #define discardBySlice(_pos_) {}
      #define highlightSlice(_color_, _pos_) (_color_)
    `;t.sliceEnabledForVertexPrograms&&e.vertex.code.add(r),e.fragment.code.add(r)}}(i=c||(c={})).bindUniformsWithOrigin=function(e,t,r){i.bindUniforms(e,t,r.slicePlane,r.origin)},i.bindUniforms=function(e,t,r,i){t.slicePlaneEnabled&&(Object(n.i)(r)?(i?(Object(a.g)(l,r.origin,i),e.setUniform3fv("slicePlaneOrigin",l)):e.setUniform3fv("slicePlaneOrigin",r.origin),e.setUniform3fv("slicePlaneBasis1",r.basis1),e.setUniform3fv("slicePlaneBasis2",r.basis2)):(e.setUniform3fv("slicePlaneBasis1",o.b),e.setUniform3fv("slicePlaneBasis2",o.b),e.setUniform3fv("slicePlaneOrigin",o.b)))};const l=Object(o.e)()},"1TnO":function(e,t,r){"use strict";r.d(t,"a",function(){return c});var i,n=r("Cy1f"),o=r("OIYib"),a=r("mmTy"),s=r("aiF/");function c(e,t){t.instanced&&t.instancedDoublePrecision&&(e.attributes.add("modelOriginHi","vec3"),e.attributes.add("modelOriginLo","vec3"),e.attributes.add("model","mat3"),e.attributes.add("modelNormal","mat3")),t.instancedDoublePrecision&&(e.vertex.include(s.a,t),e.vertex.uniforms.add("viewOriginHi","vec3"),e.vertex.uniforms.add("viewOriginLo","vec3"));const r=[o.a`
    vec3 calculateVPos() {
      ${t.instancedDoublePrecision?"return model * localPosition().xyz;":"return localPosition().xyz;"}
    }
    `,o.a`
    vec3 subtractOrigin(vec3 _pos) {
      ${t.instancedDoublePrecision?o.a`
          vec3 originDelta = dpAdd(viewOriginHi, viewOriginLo, -modelOriginHi, -modelOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `,o.a`
    vec3 dpNormal(vec4 _normal) {
      ${t.instancedDoublePrecision?"return normalize(modelNormal * _normal.xyz);":"return normalize(_normal.xyz);"}
    }
    `,o.a`
    vec3 dpNormalView(vec4 _normal) {
      ${t.instancedDoublePrecision?"return normalize((viewNormal * vec4(modelNormal * _normal.xyz, 1.0)).xyz);":"return normalize((viewNormal * _normal).xyz);"}
    }
    `,t.vertexTangets?o.a`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${t.instancedDoublePrecision?"return vec4(modelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}

    }
    `:o.a``];e.vertex.code.add(r[0]),e.vertex.code.add(r[1]),e.vertex.code.add(r[2]),2===t.output&&e.vertex.code.add(r[3]),e.vertex.code.add(r[4])}(i=c||(c={})).Uniforms=class{},i.bindCustomOrigin=function(e,t){Object(a.b)(t,l,u,3),e.setUniform3fv("viewOriginHi",l),e.setUniform3fv("viewOriginLo",u)};const l=Object(n.e)(),u=Object(n.e)()},"1W42":function(e,t,r){"use strict";r.d(t,"a",function(){return n}),r("wSAH");var i=r("OIYib");function n(e,t){i.a`
  /*
  *  ${t.name}
  *  ${0===t.output?"RenderOutput: Color":1===t.output?"RenderOutput: Depth":3===t.output?"RenderOutput: Shadow":2===t.output?"RenderOutput: Normal":4===t.output?"RenderOutput: Highlight":""}
  */
  `}},"368d":function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e,t){1===t.attributeTextureCoordinates&&(e.attributes.add("uv0","vec2"),e.varyings.add("vuv0","vec2"),e.vertex.code.add(i.a`
      void forwardTextureCoordinates() {
        vuv0 = uv0;
      }
    `)),2===t.attributeTextureCoordinates&&(e.attributes.add("uv0","vec2"),e.varyings.add("vuv0","vec2"),e.attributes.add("uvRegion","vec4"),e.varyings.add("vuvRegion","vec4"),e.vertex.code.add(i.a`
      void forwardTextureCoordinates() {
        vuv0 = uv0;
        vuvRegion = uvRegion;
      }
    `)),0===t.attributeTextureCoordinates&&e.vertex.code.add(i.a`
      void forwardTextureCoordinates() {}
    `)}},"69UF":function(e,t,r){"use strict";r.d(t,"a",function(){return a}),r.d(t,"b",function(){return n}),r.d(t,"c",function(){return o});var i=r("OIYib");const n=.1,o=.001;function a(e,t){const r=e.fragment;switch(t.alphaDiscardMode){case 0:r.code.add(i.a`
        #define discardOrAdjustAlpha(color) { if (color.a < ${i.a.float(o)}) { discard; } }
      `);break;case 1:r.code.add(i.a`
        void discardOrAdjustAlpha(inout vec4 color) {
          color.a = 1.0;
        }
      `);break;case 2:r.uniforms.add("textureAlphaCutoff","float"),r.code.add(i.a`
        #define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } else { color.a = 1.0; } }
      `);break;case 3:e.fragment.uniforms.add("textureAlphaCutoff","float"),e.fragment.code.add(i.a`
        #define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } }
      `)}}},"6kvK":function(e,t,r){"use strict";r.d(t,"a",function(){return u});var i=r("OIYib"),n=r("xRv2"),o=r("0BfS"),a=r("XV/G"),s=r("cIib");function c(e,t){const r=e.fragment,n=void 0!==t.lightingSphericalHarmonicsOrder?t.lightingSphericalHarmonicsOrder:2;0===n?(r.uniforms.add("lightingAmbientSH0","vec3"),r.code.add(i.a`
      vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
        vec3 ambientLight = 0.282095 * lightingAmbientSH0;
        return ambientLight * (1.0 - ambientOcclusion);
      }
    `)):1===n?(r.uniforms.add("lightingAmbientSH_R","vec4"),r.uniforms.add("lightingAmbientSH_G","vec4"),r.uniforms.add("lightingAmbientSH_B","vec4"),r.code.add(i.a`
      vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
        vec4 sh0 = vec4(
          0.282095,
          0.488603 * normal.x,
          0.488603 * normal.z,
          0.488603 * normal.y
        );
        vec3 ambientLight = vec3(
          dot(lightingAmbientSH_R, sh0),
          dot(lightingAmbientSH_G, sh0),
          dot(lightingAmbientSH_B, sh0)
        );
        return ambientLight * (1.0 - ambientOcclusion);
      }
    `)):2===n&&(r.uniforms.add("lightingAmbientSH0","vec3"),r.uniforms.add("lightingAmbientSH_R1","vec4"),r.uniforms.add("lightingAmbientSH_G1","vec4"),r.uniforms.add("lightingAmbientSH_B1","vec4"),r.uniforms.add("lightingAmbientSH_R2","vec4"),r.uniforms.add("lightingAmbientSH_G2","vec4"),r.uniforms.add("lightingAmbientSH_B2","vec4"),r.code.add(i.a`
      vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
        vec3 ambientLight = 0.282095 * lightingAmbientSH0;

        vec4 sh1 = vec4(
          0.488603 * normal.x,
          0.488603 * normal.z,
          0.488603 * normal.y,
          1.092548 * normal.x * normal.y
        );
        vec4 sh2 = vec4(
          1.092548 * normal.y * normal.z,
          0.315392 * (3.0 * normal.z * normal.z - 1.0),
          1.092548 * normal.x * normal.z,
          0.546274 * (normal.x * normal.x - normal.y * normal.y)
        );
        ambientLight += vec3(
          dot(lightingAmbientSH_R1, sh1),
          dot(lightingAmbientSH_G1, sh1),
          dot(lightingAmbientSH_B1, sh1)
        );
        ambientLight += vec3(
          dot(lightingAmbientSH_R2, sh2),
          dot(lightingAmbientSH_G2, sh2),
          dot(lightingAmbientSH_B2, sh2)
        );
        return ambientLight * (1.0 - ambientOcclusion);
      }
    `),1!==t.pbrMode&&2!==t.pbrMode||r.code.add(i.a`
        const vec3 skyTransmittance = vec3(0.9, 0.9, 1.0);

        vec3 calculateAmbientRadiance(float ambientOcclusion)
        {
          vec3 ambientLight = 1.2 * (0.282095 * lightingAmbientSH0) - 0.2;
          return ambientLight *= (1.0 - ambientOcclusion) * skyTransmittance;
        }
      `))}function l(e){const t=e.fragment;t.uniforms.add("lightingMainDirection","vec3"),t.uniforms.add("lightingMainIntensity","vec3"),t.uniforms.add("lightingFixedFactor","float"),t.code.add(i.a`
    vec3 evaluateMainLighting(vec3 normal_global, float shadowing) {
      float dotVal = clamp(-dot(normal_global, lightingMainDirection), 0.0, 1.0);

      // move lighting towards (1.0, 1.0, 1.0) if requested
      dotVal = mix(dotVal, 1.0, lightingFixedFactor);

      return lightingMainIntensity * ((1.0 - shadowing) * dotVal);
    }
  `)}function u(e,t){const r=e.fragment;e.include(l),e.include(s.a,t),0!==t.pbrMode&&e.include(a.a,t),e.include(c,t),t.receiveShadows&&e.include(o.a,t),r.uniforms.add("lightingGlobalFactor","float"),r.uniforms.add("ambientBoostFactor","float"),e.include(n.a),r.code.add(i.a`
    const float GAMMA_SRGB = 2.1;
    const float INV_GAMMA_SRGB = 0.4761904;
    ${0===t.pbrMode?"":"const vec3 GROUND_REFLECTANCE = vec3(0.2);"}
  `),t.useOldSceneLightInterface?r.code.add(i.a`
    vec3 evaluateSceneLightingExt(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight) {
      // evaluate the main light
      #if defined(TREE_RENDERING)
        // Special case for tree rendering:
        // We shift the Lambert lobe to the back, allowing it to reach part of the hemisphere
        // facing away from the light. The idea is to get an effect where light is transmitted
        // through the tree.
        float minDot = -0.5;
        float dotRange = 1.0 - minDot;
        float dotNormalization = 0.66; // guessed & hand tweaked value, for an exact value we could precompute an integral over the sphere

        float dotVal = dotNormalization * (clamp(-dot(normal, lightingMainDirection), 1.0 - dotRange, 1.0) - minDot) * (1.0 / dotRange);
      #else
        float dotVal = clamp(-dot(normal, lightingMainDirection), 0.0, 1.0);
      #endif

      // move lighting towards (1.0, 1.0, 1.0) if requested
      dotVal = mix(dotVal, 1.0, lightingFixedFactor);

      vec3 mainLight = (1.0 - shadow) * lightingMainIntensity * dotVal;
      vec3 ambientLight = calculateAmbientIrradiance(normal, ssao);

      // inverse gamma correction on the albedo color
      vec3 albedoGammaC = pow(albedo, vec3(GAMMA_SRGB));

      // physically correct BRDF normalizes by PI
      vec3 totalLight = mainLight + ambientLight + additionalLight;
      totalLight = min(totalLight, vec3(PI));
      vec3 outColor = vec3((albedoGammaC / PI) * (totalLight));

      // apply gamma correction to the computed color
      outColor = pow(outColor, vec3(INV_GAMMA_SRGB));

      return outColor;
    }
  `):(r.code.add(1===t.viewingMode?i.a`
      float _oldHeuristicLighting(vec3 vPosWorld) {
        vec3 shadingNormalWorld = normalize(vPosWorld);
        float vndl = -dot(shadingNormalWorld, lightingMainDirection);

        return smoothstep(0.0, 1.0, clamp(vndl * 2.5, 0.0, 1.0));
      }
    `:i.a`
      float _oldHeuristicLighting(vec3 vPosWorld) {
        float vndl = -dot(vec3(0.0, 0.0, 1.0), lightingMainDirection);
        return smoothstep(0.0, 1.0, clamp(vndl * 2.5, 0.0, 1.0));
      }
    `),r.code.add(i.a`
      vec3 evaluateAdditionalLighting(float ambientOcclusion, vec3 vPosWorld) {
        float additionalAmbientScale = _oldHeuristicLighting(vPosWorld);
        return (1.0 - ambientOcclusion) * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor * lightingMainIntensity;
      }
    `),0===t.pbrMode||4===t.pbrMode?r.code.add(i.a`
      vec3 evaluateSceneLighting(vec3 normalWorld, vec3 baseColor, float mainLightShadow, float ambientOcclusion, vec3 additionalLight)
      {
        vec3 mainLighting = evaluateMainLighting(normalWorld, mainLightShadow);
        vec3 ambientLighting = calculateAmbientIrradiance(normalWorld, ambientOcclusion);
        // inverse gamma correction on the base color
        vec3 baseColorLinear = pow(baseColor, vec3(GAMMA_SRGB));

        // physically correct BRDF normalizes by PI
        vec3 totalLight = mainLighting + ambientLighting + additionalLight;
        totalLight = min(totalLight, vec3(PI));
        vec3 outColor = vec3((baseColorLinear / PI) * totalLight);

        // apply gamma correction to the computed color
        outColor = pow(outColor, vec3(INV_GAMMA_SRGB));

        return outColor;
      }
      `):1!==t.pbrMode&&2!==t.pbrMode||(r.code.add(i.a`
      const float fillLightIntensity = 0.25;
      const float horizonLightDiffusion = 0.4;
      const float additionalAmbientIrradianceFactor = 0.02;

      vec3 evaluateSceneLightingPBR(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight, vec3 viewDir, vec3 normalGround, vec3 mrr, vec3 _emission, float additionalAmbientIrradiance)
      {
        // Calculate half vector between view and light direction
        vec3 viewDirection = -viewDir;
        vec3 mainLightDirection = -lightingMainDirection;
        vec3 h = normalize(viewDirection + mainLightDirection);

        PBRShadingInfo inputs;
        inputs.NdotL = clamp(dot(normal, mainLightDirection), 0.001, 1.0);
        inputs.NdotV = clamp(abs(dot(normal, viewDirection)), 0.001, 1.0);
        inputs.NdotH = clamp(dot(normal, h), 0.0, 1.0);
        inputs.VdotH = clamp(dot(viewDirection, h), 0.0, 1.0);
        inputs.NdotNG = clamp(dot(normal, normalGround), -1.0, 1.0);
        vec3 reflectedView = normalize(reflect(viewDirection, normal));
        inputs.RdotNG = clamp(dot(reflectedView, normalGround), -1.0, 1.0);

        inputs.albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
        inputs.ssao = ssao;

        inputs.metalness = mrr[0];
        inputs.roughness = clamp(mrr[1] * mrr[1], 0.001, 0.99);
      `),r.code.add(i.a`
        inputs.f0 = (0.16 * mrr[2] * mrr[2]) * (1.0 - inputs.metalness) + inputs.albedoLinear * inputs.metalness;
        inputs.f90 = vec3(clamp(dot(inputs.f0, vec3(50.0 * 0.33)), 0.0, 1.0)); // more accurate then using  f90 = 1.0
        inputs.diffuseColor = inputs.albedoLinear * (vec3(1.0) - inputs.f0) * (1.0 - inputs.metalness);
      `),r.code.add(i.a`
        vec3 ambientDir = vec3(5.0 * normalGround[1] - normalGround[0] * normalGround[2], - 5.0 * normalGround[0] - normalGround[2] * normalGround[1], normalGround[1] * normalGround[1] + normalGround[0] * normalGround[0]);
        ambientDir = ambientDir != vec3(0.0)? normalize(ambientDir) : normalize(vec3(5.0, -1.0, 0.0));

        inputs.NdotAmbDir = abs(dot(normal, ambientDir));

        // Calculate the irradiance components: sun, fill lights and the sky.
        vec3 mainLightIrradianceComponent  = inputs.NdotL * (1.0 - shadow) * lightingMainIntensity;
        vec3 fillLightsIrradianceComponent = inputs.NdotAmbDir * lightingMainIntensity * fillLightIntensity;
        // calculateAmbientIrradiance for localView and additionalLight for gloabalView
        vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(normal, ssao) + additionalLight;

        // Assemble the overall irradiance of the sky that illuminates the surface
        inputs.skyIrradianceToSurface    = ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
        // Assemble the overall irradiance of the ground that illuminates the surface. for this we use the simple model that changes only the sky irradiance by the groundReflectance
        inputs.groundIrradianceToSurface = GROUND_REFLECTANCE * ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
      `),r.code.add(i.a`
        vec3 horizonRingDir = inputs.RdotNG * normalGround - reflectedView;
        vec3 horizonRingH = normalize(viewDirection + horizonRingDir);
        inputs.NdotH_Horizon = dot(normal, horizonRingH);

        vec3 mainLightRadianceComponent  = normalDistribution(inputs.NdotH, inputs.roughness) * lightingMainIntensity * (1.0 - shadow);
        vec3 horizonLightRadianceComponent = normalDistribution(inputs.NdotH_Horizon, min(inputs.roughness + horizonLightDiffusion, 1.0)) * lightingMainIntensity * fillLightIntensity;
        vec3 ambientLightRadianceComponent = calculateAmbientRadiance(ssao) + additionalLight; // calculateAmbientRadiance for localView and additionalLight for gloabalView

        // Assemble the overall radiance of the sky that illuminates the surface
        inputs.skyRadianceToSurface    =  ambientLightRadianceComponent + mainLightRadianceComponent + horizonLightRadianceComponent;
        // Assemble the overall radiance of the ground that illuminates the surface. for this we use the simple model that changes only the sky radince by the groundReflectance
        inputs.groundRadianceToSurface = GROUND_REFLECTANCE * (ambientLightRadianceComponent + horizonLightRadianceComponent) + mainLightRadianceComponent;

        // Calculate average ambient radiance - this is used int the gamut mapping part to deduce the black level that is soft compressed
        inputs.averageAmbientRadiance = ambientLightIrradianceComponent[1] * (1.0 + GROUND_REFLECTANCE[1]);
        `),r.code.add(i.a`
        vec3 reflectedColorComponent = evaluateEnvironmentIllumination(inputs);
        vec3 additionalMaterialReflectanceComponent = inputs.albedoLinear * additionalAmbientIrradiance;
        vec3 emissionComponent = pow(_emission, vec3(GAMMA_SRGB));
        vec3 outColorLinear = reflectedColorComponent + additionalMaterialReflectanceComponent + emissionComponent;
        ${2===t.pbrMode?i.a`vec3 outColor = pow(max(vec3(0.0), outColorLinear - 0.005 * inputs.averageAmbientRadiance), vec3(INV_GAMMA_SRGB));`:i.a`vec3 outColor = pow(blackLevelSoftCompression(outColorLinear, inputs), vec3(INV_GAMMA_SRGB));`}
        return outColor;
      }
    `)))}},AxBq:function(e,t,r){"use strict";r.d(t,"a",function(){return I}),r.d(t,"b",function(){return E});var i=r("OIYib"),n=r("Tbkp"),o=r("aQrP"),a=r("0nJL"),s=r("0Ect"),c=r("viRi"),l=r("69UF"),u=r("F7CJ"),d=r("xtdb"),h=r("0BfS"),f=r("vXUg"),m=r("XV/G"),p=r("1TnO"),g=r("368d"),b=r("p9cc"),v=r("F8o4"),x=r("wzLF"),_=r("sJp1"),O=r("bLIi"),y=r("bVvB"),T=r("fRF2"),w=r("fiGu"),S=r("DXpj"),j=r("cIib"),M=r("6kvK"),A=r("qrV2"),C=r("1W42"),P=r("NiZE");function E(e){const t=new o.a,r=t.vertex.code,E=t.fragment.code;return t.include(C.a,{name:"Default Material Shader",output:e.output}),t.vertex.uniforms.add("proj","mat4").add("view","mat4").add("camPos","vec3").add("localOrigin","vec3"),t.include(_.a),t.varyings.add("vpos","vec3"),t.include(c.a,e),t.include(p.a,e),t.include(u.a,e),0!==e.output&&7!==e.output||(t.include(x.a,e),t.include(n.a,{linearDepth:!1}),0===e.normalType&&e.offsetBackfaces&&t.include(v.a),t.include(S.a,e),t.include(T.a,e),e.instancedColor&&t.attributes.add("instanceColor","vec4"),t.varyings.add("localvpos","vec3"),t.include(g.a,e),t.include(f.a,e),t.include(O.a,e),t.include(y.a,e),t.vertex.uniforms.add("externalColor","vec4"),t.varyings.add("vcolorExt","vec4"),e.multipassTerrainEnabled&&t.varyings.add("depth","float"),r.add(i.a`
      void main(void) {
        forwardNormalizedVertexColor();
        vcolorExt = externalColor;
        ${e.instancedColor?"vcolorExt *= instanceColor;":""}
        vcolorExt *= vvColor();
        vcolorExt *= getSymbolColor();
        forwardColorMixMode();

        if (vcolorExt.a < ${i.a.float(l.c)}) {
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        }
        else {
          vpos = calculateVPos();
          localvpos = vpos - view[3].xyz;
          vpos = subtractOrigin(vpos);
          ${0===e.normalType?i.a`
          vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`:""}
          vpos = addVerticalOffset(vpos, localOrigin);
          ${e.vertexTangets?"vTangent = dpTransformVertexTangent(tangent);":""}
          gl_Position = transformPosition(proj, view, vpos);
          ${0===e.normalType&&e.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, camPos);":""}
        }

        ${e.multipassTerrainEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
        forwardLinearDepth();
        forwardTextureCoordinates();
      }
    `)),7===e.output&&(t.include(a.a,e),t.include(l.a,e),e.multipassTerrainEnabled&&(t.fragment.include(s.a),t.include(d.b,e)),t.fragment.uniforms.add("camPos","vec3").add("localOrigin","vec3").add("opacity","float").add("layerOpacity","float"),e.hasColorTexture&&t.fragment.uniforms.add("tex","sampler2D"),t.fragment.include(P.a),E.add(i.a`
      void main() {
        discardBySlice(vpos);
        ${e.multipassTerrainEnabled?"terrainDepthTest(gl_FragCoord, depth);":""}
        ${e.hasColorTexture?i.a`
        vec4 texColor = texture2D(tex, vuv0);
        ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
        discardOrAdjustAlpha(texColor);`:i.a`vec4 texColor = vec4(1.0);`}
        ${e.attributeColor?i.a`
        float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:i.a`
        float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));
        `}
        gl_FragColor = vec4(opacity_);
      }
    `)),0===e.output&&(t.include(a.a,e),t.include(M.a,e),t.include(j.a,e),t.include(l.a,e),e.receiveShadows&&t.include(h.a,e),e.multipassTerrainEnabled&&(t.fragment.include(s.a),t.include(d.b,e)),t.fragment.uniforms.add("camPos","vec3").add("localOrigin","vec3").add("ambient","vec3").add("diffuse","vec3").add("opacity","float").add("layerOpacity","float"),e.hasColorTexture&&t.fragment.uniforms.add("tex","sampler2D"),t.include(b.a,e),t.include(m.a,e),t.fragment.include(P.a),t.include(A.a,e),E.add(i.a`
      void main() {
        discardBySlice(vpos);
        ${e.multipassTerrainEnabled?"terrainDepthTest(gl_FragCoord, depth);":""}
        ${e.hasColorTexture?i.a`
        vec4 texColor = texture2D(tex, vuv0);
        ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
        discardOrAdjustAlpha(texColor);`:i.a`vec4 texColor = vec4(1.0);`}
        shadingParams.viewDirection = normalize(vpos - camPos);
        ${3===e.normalType?i.a`
        vec3 normal = screenDerivativeNormal(localvpos);`:i.a`
        shadingParams.normalView = vNormalWorld;
        vec3 normal = shadingNormal(shadingParams);`}
        ${1===e.pbrMode?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        float additionalAmbientScale = _oldHeuristicLighting(vpos + localOrigin);
        vec3 additionalLight = ssao * lightingMainIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
        ${e.receiveShadows?"float shadow = readShadowMap(vpos, linearDepth);":1===e.viewingMode?"float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);":"float shadow = 0.0;"}
        vec3 matColor = max(ambient, diffuse);
        ${e.attributeColor?i.a`
        vec3 albedo_ = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
        float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:i.a`
        vec3 albedo_ = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
        float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));
        `}
        ${e.hasNormalTexture?i.a`
              mat3 tangentSpace = ${e.vertexTangets?"computeTangentSpace(normal);":"computeTangentSpace(normal, vpos, vuv0);"}
              vec3 shadedNormal = computeTextureNormal(tangentSpace, vuv0);`:"vec3 shadedNormal = normal;"}
        ${1===e.pbrMode||2===e.pbrMode?1===e.viewingMode?i.a`vec3 normalGround = normalize(vpos + localOrigin);`:i.a`vec3 normalGround = vec3(0.0, 0.0, 1.0);`:i.a``}
        ${1===e.pbrMode||2===e.pbrMode?i.a`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * lightingMainIntensity[2];
            vec3 shadedColor = evaluateSceneLightingPBR(shadedNormal, albedo_, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:"vec3 shadedColor = evaluateSceneLighting(shadedNormal, albedo_, shadow, 1.0 - ssao, additionalLight);"}
        gl_FragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${e.OITEnabled?"gl_FragColor = premultiplyAlpha(gl_FragColor);":""}
      }
    `)),t.include(w.a,e),t}var I=Object.freeze({__proto__:null,build:E})},D6bk:function(e,t,r){"use strict";var i=r("srIe"),n=r("hTmG");t.a=class{constructor(e,t,r,i,n){this._context=e,this._locations=t,this._layout=r,this._buffers=i,this._indexBuffer=n,this._glName=null,this._initialized=!1,e.instanceCounter.increment(2,this)}get glName(){return this._glName}get vertexBuffers(){return this._buffers}get indexBuffer(){return this._indexBuffer}get size(){return Object.keys(this._buffers).reduce((e,t)=>e+this._buffers[t].size,this._indexBuffer?this._indexBuffer.size:0)}get layout(){return this._layout}get locations(){return this._locations}dispose(e=!0){if(!this._context)return;const t=this._context.capabilities.vao;if(t&&this._glName&&(t.deleteVertexArray(this._glName),this._glName=null),this._context.getBoundVAO()===this&&this._context.bindVAO(null),e){for(const e in this._buffers)this._buffers[e].dispose(),delete this._buffers[e];this._indexBuffer=Object(i.e)(this._indexBuffer)}this._context.instanceCounter.decrement(2,this),this._context=null}initialize(){if(this._initialized)return;const e=this._context.capabilities.vao;if(e){const t=e.createVertexArray();e.bindVertexArray(t),this._bindLayout(),e.bindVertexArray(null),this._glName=t}this._initialized=!0}bind(){this.initialize();const e=this._context.capabilities.vao;e?e.bindVertexArray(this.glName):(this._context.bindVAO(null),this._bindLayout())}_bindLayout(){const e=this._buffers,t=!!this._context.capabilities.vao,r=this._layout,i=this._indexBuffer;e||console.error("Vertex buffer dictionary is empty!");const o=this._context.gl;for(const a in e){const t=e[a];t||console.error("Vertex buffer is uninitialized!");const i=r[a];i||console.error("Vertex element descriptor is empty!"),Object(n.a)(this._context,this._locations,t,i)}i&&(t?o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,i.glName):this._context.bindBuffer(i))}unbind(){this.initialize();const e=this._context.capabilities.vao;e?e.bindVertexArray(null):this._unbindLayout()}_unbindLayout(){const e=this._buffers,t=this._layout;e||console.error("Vertex buffer dictionary is empty!");for(const r in e){const i=e[r];i||console.error("Vertex buffer is uninitialized!");const o=t[r];Object(n.c)(this._context,this._locations,i,o)}this._indexBuffer&&this._context.unbindBuffer(this._indexBuffer.bufferType)}}},D8Ta:function(e,t,r){"use strict";function i(){return[0,0,0,0]}function n(e,t,r,i){return[e,t,r,i]}function o(e,t){return new Float64Array(e,t,4)}function a(){return n(1,1,1,1)}function s(){return n(1,0,0,0)}function c(){return n(0,1,0,0)}function l(){return n(0,0,1,0)}function u(){return n(0,0,0,1)}r.d(t,"a",function(){return i}),r.d(t,"b",function(){return n}),r.d(t,"c",function(){return o});const d=a(),h=s(),f=c(),m=l(),p=u();Object.freeze({__proto__:null,create:i,clone:function(e){return[e[0],e[1],e[2],e[3]]},fromValues:n,fromArray:function(e){const t=[0,0,0,0],r=Math.min(4,e.length);for(let i=0;i<r;++i)t[i]=e[i];return t},createView:o,zeros:function(){return[0,0,0,0]},ones:a,unitX:s,unitY:c,unitZ:l,unitW:u,ZEROS:[0,0,0,0],ONES:d,UNIT_X:h,UNIT_Y:f,UNIT_Z:m,UNIT_W:p})},DXpj:function(e,t,r){"use strict";r.d(t,"a",function(){return o});var i=r("OIYib"),n=r("fLTx");function o(e,t){const r=e.fragment;r.uniforms.add("normalTexture","sampler2D"),r.uniforms.add("normalTextureSize","vec2"),t.vertexTangets?(e.attributes.add("tangent","vec4"),e.varyings.add("vTangent","vec4"),r.code.add(2===t.doubleSidedMode?i.a`
      mat3 computeTangentSpace(vec3 normal) {
        float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
        vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
        vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
        return mat3(tangent, bitangent, normal);
      }
    `:i.a`
      mat3 computeTangentSpace(vec3 normal) {
        float tangentHeadedness = vTangent.w;
        vec3 tangent = normalize(vTangent.xyz);
        vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
        return mat3(tangent, bitangent, normal);
      }
    `)):(e.extensions.add("GL_OES_standard_derivatives"),r.code.add(i.a`
    mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {

      vec3 Q1 = dFdx(pos);
      vec3 Q2 = dFdy(pos);

      vec2 stx = dFdx(st);
      vec2 sty = dFdy(st);

      float det = stx.t * sty.s - sty.t * stx.s;

      vec3 T = stx.t * Q2 - sty.t * Q1; // compute tangent
      T = T - normal * dot(normal, T); // orthogonalize tangent
      T *= inversesqrt(max(dot(T,T), 1.e-10)); // "soft" normalize - goes to 0 when T goes to 0
      vec3 B = sign(det) * cross(normal, T); // assume normal is normalized, B has the same lenght as B
      return mat3(T, B, normal); // T and B go to 0 when the tangent space is not well defined by the uv coordinates
    }
  `)),0!==t.attributeTextureCoordinates&&(e.include(n.a,t),r.code.add(i.a`
    vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
      vtc.uv = uv;
      ${t.supportsTextureAtlas?"vtc.size = normalTextureSize;":""}
      vec3 rawNormal = textureLookup(normalTexture, vtc).rgb * 2.0 - 1.0;
      return tangentSpace * rawNormal;
    }
  `))}},EVMh:function(e,t,r){"use strict";r.d(t,"a",function(){return o}),r.d(t,"b",function(){return a}),r.d(t,"c",function(){return s}),r("OKTS"),r("Cy1f"),r("15Hh"),r("AvGH");var i=r("D8Ta");r("M0lq"),r("dXfX"),Object(i.a)();class n{constructor(e){this.message=e}toString(){return`AssertException: ${this.message}`}}function o(e,t){if(!e){t=t||"assert";const e=new Error(t);throw e.stack&&console.log(e.stack),new n(t)}}function a(e,t,r,i){e[12]=t,e[13]=r,e[14]=i}function s(e,t=0){let r=0;for(let i=0;i<4;i++)r+=e[t+i]*c[i];return r}const c=[1/256,1/65536,1/16777216,1/4294967296];s(new Uint8ClampedArray([255,255,255,255]))},F7CJ:function(e,t,r){"use strict";r.d(t,"a",function(){return a});var i=r("OIYib"),n=r("fFEv");function o(e){e.vertex.code.add(i.a`
    float screenSizePerspectiveMinSize(float size, vec4 factor) {
      float nonZeroSize = 1.0 - step(size, 0.0);

      return (
        factor.z * (
          1.0 +
          // Multiply by nzs ensures if size is 0, then we ignore proportionally scaled padding
          nonZeroSize *
          2.0 * factor.w / (
            size + (1.0 - nonZeroSize) // Adding 1 - nzs ensures we divide either by size, or by 1
          )
        )
      );
    }
  `),e.vertex.code.add(i.a`
    float screenSizePerspectiveViewAngleDependentFactor(float absCosAngle) {
      return absCosAngle * absCosAngle * absCosAngle;
    }
  `),e.vertex.code.add(i.a`
    vec4 screenSizePerspectiveScaleFactor(float absCosAngle, float distanceToCamera, vec4 params) {
      return vec4(
        min(params.x / (distanceToCamera - params.y), 1.0),
        screenSizePerspectiveViewAngleDependentFactor(absCosAngle),
        params.z,
        params.w
      );
    }
  `),e.vertex.code.add(i.a`
    float applyScreenSizePerspectiveScaleFactorFloat(float size, vec4 factor) {
      return max(mix(size * factor.x, size, factor.y), screenSizePerspectiveMinSize(size, factor));
    }
  `),e.vertex.code.add(i.a`
    float screenSizePerspectiveScaleFloat(float size, float absCosAngle, float distanceToCamera, vec4 params) {
      return applyScreenSizePerspectiveScaleFactorFloat(
        size,
        screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params)
      );
    }
  `),e.vertex.code.add(i.a`
    vec2 applyScreenSizePerspectiveScaleFactorVec2(vec2 size, vec4 factor) {
      return mix(size * clamp(factor.x, screenSizePerspectiveMinSize(size.y, factor) / size.y, 1.0), size, factor.y);
    }
  `),e.vertex.code.add(i.a`
    vec2 screenSizePerspectiveScaleVec2(vec2 size, float absCosAngle, float distanceToCamera, vec4 params) {
      return applyScreenSizePerspectiveScaleFactorVec2(size, screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params));
    }
  `)}function a(e,t){const r=e.vertex.code;t.verticalOffsetEnabled?(e.vertex.uniforms.add("verticalOffset","vec4"),t.screenSizePerspectiveEnabled&&(e.include(o),e.vertex.uniforms.add("screenSizePerspectiveAlignment","vec4")),r.add(i.a`
    vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
      float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
      ${1===t.viewingMode?i.a`vec3 worldNormal = normalize(worldPos + localOrigin);`:i.a`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
      ${t.screenSizePerspectiveEnabled?i.a`
          float cosAngle = dot(worldNormal, normalize(worldPos - camPos));
          float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:i.a`
          float verticalOffsetScreenHeight = verticalOffset.x;`}
      // Screen sized offset in world space, used for example for line callouts
      float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
      return worldNormal * worldOffset;
    }

    vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
      return worldPos + calculateVerticalOffset(worldPos, localOrigin);
    }
    `)):r.add(i.a`
    vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }
    `)}(o||(o={})).bindUniforms=function(e,t){if(t.screenSizePerspective){Object(n.a)(t.screenSizePerspective,e,"screenSizePerspective");const r=t.screenSizePerspectiveAlignment||t.screenSizePerspective;Object(n.a)(r,e,"screenSizePerspectiveAlignment")}},(a||(a={})).bindUniforms=function(e,t,r){if(!t.verticalOffset)return;const i=function(e,t,r,i=s){return i.screenLength=e.screenLength,i.perDistance=Math.tan(.5*t)/(.5*r),i.minWorldLength=e.minWorldLength,i.maxWorldLength=e.maxWorldLength,i}(t.verticalOffset,r.camera.fovY,r.camera.fullViewport[3]);e.setUniform4f("verticalOffset",i.screenLength*(r.camera.pixelRatio||1),i.perDistance,i.minWorldLength,i.maxWorldLength)};const s={screenLength:0,perDistance:0,minWorldLength:0,maxWorldLength:0}},F8o4:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e){e.vertex.code.add(i.a`
    vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
      vec3 camToVert = posWorld - camPosWorld;

      bool isBackface = dot(camToVert, normalWorld) > 0.0;
      if (isBackface) {
        posClip.z += 0.0000003 * posClip.w;
      }
      return posClip;
    }
  `)}},GJyJ:function(e,t,r){"use strict";function i(e,t,r=32774,i=[0,0,0,0]){return{srcRgb:e,srcAlpha:e,dstRgb:t,dstAlpha:t,opRgb:r,opAlpha:r,color:{r:i[0],g:i[1],b:i[2],a:i[3]}}}function n(e,t,r,i,n=32774,o=32774,a=[0,0,0,0]){return{srcRgb:e,srcAlpha:t,dstRgb:r,dstAlpha:i,opRgb:n,opAlpha:o,color:{r:a[0],g:a[1],b:a[2],a:a[3]}}}r.d(t,"a",function(){return R}),r.d(t,"b",function(){return a}),r.d(t,"c",function(){return o}),r.d(t,"d",function(){return p}),r.d(t,"e",function(){return n}),r.d(t,"f",function(){return i});const o={zNear:0,zFar:1},a={r:!0,g:!0,b:!0,a:!0};function s(e){return v.intern(e)}function c(e){return _.intern(e)}function l(e){return y.intern(e)}function u(e){return w.intern(e)}function d(e){return j.intern(e)}function h(e){return A.intern(e)}function f(e){return P.intern(e)}function m(e){return I.intern(e)}function p(e){return D.intern(e)}class g{constructor(e,t){this.makeKey=e,this.makeRef=t,this.interns=new Map}intern(e){if(!e)return null;const t=this.makeKey(e),r=this.interns;return r.has(t)||r.set(t,this.makeRef(e)),r.get(t)}}function b(e){return"["+e.join(",")+"]"}const v=new g(x,e=>({__tag:"Blending",...e}));function x(e){return e?b([e.srcRgb,e.srcAlpha,e.dstRgb,e.dstAlpha,e.opRgb,e.opAlpha,e.color.r,e.color.g,e.color.b,e.color.a]):null}const _=new g(O,e=>({__tag:"Culling",...e}));function O(e){return e?b([e.face,e.mode]):null}const y=new g(T,e=>({__tag:"PolygonOffset",...e}));function T(e){return e?b([e.factor,e.units]):null}const w=new g(S,e=>({__tag:"DepthTest",...e}));function S(e){return e?b([e.func]):null}const j=new g(M,e=>({__tag:"StencilTest",...e}));function M(e){return e?b([e.function.func,e.function.ref,e.function.mask,e.operation.fail,e.operation.zFail,e.operation.zPass]):null}const A=new g(C,e=>({__tag:"DepthWrite",...e}));function C(e){return e?b([e.zNear,e.zFar]):null}const P=new g(E,e=>({__tag:"ColorWrite",...e}));function E(e){return e?b([e.r,e.g,e.b,e.a]):null}const I=new g(F,e=>({__tag:"StencilWrite",...e}));function F(e){return e?b([e.mask]):null}const D=new g(function(e){return e?b([x(e.blending),O(e.culling),T(e.polygonOffset),S(e.depthTest),M(e.stencilTest),C(e.depthWrite),E(e.colorWrite),F(e.stencilWrite)]):null},e=>({blending:s(e.blending),culling:c(e.culling),polygonOffset:l(e.polygonOffset),depthTest:u(e.depthTest),stencilTest:d(e.stencilTest),depthWrite:h(e.depthWrite),colorWrite:f(e.colorWrite),stencilWrite:m(e.stencilWrite)}));class R{constructor(e){this._pipelineInvalid=!0,this._blendingInvalid=!0,this._cullingInvalid=!0,this._polygonOffsetInvalid=!0,this._depthTestInvalid=!0,this._stencilTestInvalid=!0,this._depthWriteInvalid=!0,this._colorWriteInvalid=!0,this._stencilWriteInvalid=!0,this._stateSetters=e}setPipeline(e){(this._pipelineInvalid||e!==this._pipeline)&&(this.setBlending(e.blending),this.setCulling(e.culling),this.setPolygonOffset(e.polygonOffset),this.setDepthTest(e.depthTest),this.setStencilTest(e.stencilTest),this.setDepthWrite(e.depthWrite),this.setColorWrite(e.colorWrite),this.setStencilWrite(e.stencilWrite),this._pipeline=e),this._pipelineInvalid=!1}invalidateBlending(){this._blendingInvalid=!0,this._pipelineInvalid=!0}invalidateCulling(){this._cullingInvalid=!0,this._pipelineInvalid=!0}invalidatePolygonOffset(){this._polygonOffsetInvalid=!0,this._pipelineInvalid=!0}invalidateDepthTest(){this._depthTestInvalid=!0,this._pipelineInvalid=!0}invalidateStencilTest(){this._stencilTestInvalid=!0,this._pipelineInvalid=!0}invalidateDepthWrite(){this._depthWriteInvalid=!0,this._pipelineInvalid=!0}invalidateColorWrite(){this._colorWriteInvalid=!0,this._pipelineInvalid=!0}invalidateStencilWrite(){this._stencilTestInvalid=!0,this._pipelineInvalid=!0}setBlending(e){this._blending=this.setSubState(e,this._blending,this._blendingInvalid,this._stateSetters.setBlending),this._blendingInvalid=!1}setCulling(e){this._culling=this.setSubState(e,this._culling,this._cullingInvalid,this._stateSetters.setCulling),this._cullingInvalid=!1}setPolygonOffset(e){this._polygonOffset=this.setSubState(e,this._polygonOffset,this._polygonOffsetInvalid,this._stateSetters.setPolygonOffset),this._polygonOffsetInvalid=!1}setDepthTest(e){this._depthTest=this.setSubState(e,this._depthTest,this._depthTestInvalid,this._stateSetters.setDepthTest),this._depthTestInvalid=!1}setStencilTest(e){this._stencilTest=this.setSubState(e,this._stencilTest,this._stencilTestInvalid,this._stateSetters.setStencilTest),this._stencilTestInvalid=!1}setDepthWrite(e){this._depthWrite=this.setSubState(e,this._depthWrite,this._depthWriteInvalid,this._stateSetters.setDepthWrite),this._depthWriteInvalid=!1}setColorWrite(e){this._colorWrite=this.setSubState(e,this._colorWrite,this._colorWriteInvalid,this._stateSetters.setColorWrite),this._colorWriteInvalid=!1}setStencilWrite(e){this._stencilWrite=this.setSubState(e,this._stencilWrite,this._stencilWriteInvalid,this._stateSetters.setStencilWrite),this._stencilTestInvalid=!1}setSubState(e,t,r,i){return(r||e!==t)&&(i(e),this._pipelineInvalid=!0),e}}},GVa1:function(e,t,r){"use strict";r.d(t,"a",function(){return n}),r("wSAH");var i=r("6S2I");function n(e){}r("zlDU"),i.a.getLogger("esri/views/webgl")},NiZE:function(e,t,r){"use strict";r.d(t,"a",function(){return o});var i=r("OIYib");function n(e){e.code.add(i.a`
    vec4 premultiplyAlpha(vec4 v) {
      return vec4(v.rgb * v.a, v.a);
    }

    // Note: the min in the last line has been added to fix an instability in chrome.
    // See https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/23911
    // With proper floating point handling, the value could never be >1.
    vec3 rgb2hsv(vec3 c) {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
      vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);

      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), min(d / (q.x + e), 1.0), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    float rgb2v(vec3 c) {
      return max(c.x, max(c.y, c.z));
    }
  `)}function o(e){e.include(n),e.code.add(i.a`
    vec3 mixExternalColor(vec3 internalColor, vec3 textureColor, vec3 externalColor, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      vec3 internalMixed = internalColor * textureColor;
      vec3 allMixed = internalMixed * externalColor;

      if (mode == ${i.a.int(1)}) {
        return allMixed;
      }
      else if (mode == ${i.a.int(2)}) {
        return internalMixed;
      }
      else if (mode == ${i.a.int(3)}) {
        return externalColor;
      }
      else {
        // tint (or something invalid)
        float vIn = rgb2v(internalMixed);
        vec3 hsvTint = rgb2hsv(externalColor);
        vec3 hsvOut = vec3(hsvTint.x, hsvTint.y, vIn * hsvTint.z);
        return hsv2rgb(hsvOut);
      }
    }

    float mixExternalOpacity(float internalOpacity, float textureOpacity, float externalOpacity, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      float internalMixed = internalOpacity * textureOpacity;
      float allMixed = internalMixed * externalOpacity;

      if (mode == ${i.a.int(2)}) {
        return internalMixed;
      }
      else if (mode == ${i.a.int(3)}) {
        return externalOpacity;
      }
      else {
        // multiply or tint (or something invalid)
        return allMixed;
      }
    }
  `)}},OIYib:function(e,t,r){"use strict";function i(e,...t){let r="";for(let i=0;i<t.length;i++)r+=e[i]+t[i];return r+=e[e.length-1],r}r.d(t,"a",function(){return i}),function(e){e.int=function(e){return Math.round(e).toString()},e.float=function(e){return e.toPrecision(8)}}(i||(i={}))},Tbkp:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e,t){e.vertex.code.add(t.linearDepth?i.a`
    vec4 transformPositionWithDepth(mat4 proj, mat4 view, vec3 pos, vec2 nearFar, out float depth) {
      vec4 eye = view * vec4(pos, 1.0);
      depth = (-eye.z - nearFar[0]) / (nearFar[1] - nearFar[0]) ;
      return proj * eye;
    }
    `:i.a`
    vec4 transformPosition(mat4 proj, mat4 view, vec3 pos) {
      // Make sure the order of operations is the same as in transformPositionWithDepth.
      return proj * (view * vec4(pos, 1.0));
    }
    `)}},UBvB:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e){e.code.add(i.a`
    // This is the maximum float value representable as 32bit fixed point,
    // it is rgba2float(vec4(1)) inlined.
    const float MAX_RGBA_FLOAT =
      255.0 / 256.0 +
      255.0 / 256.0 / 256.0 +
      255.0 / 256.0 / 256.0 / 256.0 +
      255.0 / 256.0 / 256.0 / 256.0 / 256.0;

    // Factors to convert to fixed point, i.e. factors (256^0, 256^1, 256^2, 256^3)
    const vec4 FIXED_POINT_FACTORS = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);

    vec4 float2rgba(const float value) {
      // Make sure value is in the domain we can represent
      float valueInValidDomain = clamp(value, 0.0, MAX_RGBA_FLOAT);

      // Decompose value in 32bit fixed point parts represented as
      // uint8 rgba components. Decomposition uses the fractional part after multiplying
      // by a power of 256 (this removes the bits that are represented in the previous
      // component) and then converts the fractional part to 8bits.
      vec4 fixedPointU8 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);

      // Convert uint8 values (from 0 to 255) to floating point representation for
      // the shader
      const float toU8AsFloat = 1.0 / 255.0;

      return fixedPointU8 * toU8AsFloat;
    }

    // Factors to convert rgba back to float
    const vec4 RGBA_2_FLOAT_FACTORS = vec4(
      255.0 / (256.0),
      255.0 / (256.0 * 256.0),
      255.0 / (256.0 * 256.0 * 256.0),
      255.0 / (256.0 * 256.0 * 256.0 * 256.0)
    );

    float rgba2float(vec4 rgba) {
      // Convert components from 0->1 back to 0->255 and then
      // add the components together with their corresponding
      // fixed point factors, i.e. (256^1, 256^2, 256^3, 256^4)
      return dot(rgba, RGBA_2_FLOAT_FACTORS);
    }
  `)}},VJrH:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("zlDU");class n{constructor(e,t,r=""){this.major=e,this.minor=t,this._context=r}lessThan(e,t){return this.major<e||e===this.major&&this.minor<t}since(e,t){return!this.lessThan(e,t)}validate(e){if(this.major!==e.major)throw new i.a((this._context&&this._context+":")+"unsupported-version",`Required major ${this._context&&this._context+" "}version is '${this.major}', but got '\${version.major}.\${version.minor}'`,{version:e})}clone(){return new n(this.major,this.minor,this._context)}static parse(e,t=""){const[r,o]=e.split("."),a=/^\s*\d+\s*$/;if(!r||!r.match||!r.match(a))throw new i.a((t&&t+":")+"invalid-version","Expected major version to be a number, but got '${version}'",{version:e});if(!o||!o.match||!o.match(a))throw new i.a((t&&t+":")+"invalid-version","Expected minor version to be a number, but got '${version}'",{version:e});const s=parseInt(r,10),c=parseInt(o,10);return new n(s,c,t)}}},X2wA:function(e,t,r){"use strict";function i(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function n(e,t,r){return e(r={path:t,exports:{},require:function(e,t){return o()}},r.exports),r.exports}function o(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}r.d(t,"a",function(){return o}),r.d(t,"b",function(){return n}),r.d(t,"c",function(){return i}),"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self},"XV/G":function(e,t,r){"use strict";r.d(t,"a",function(){return a});var i=r("OIYib"),n=r("xRv2");function o(e){const t=e.fragment.code;t.add(i.a`
    vec3 evaluateDiffuseIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float NdotNG)
    {
      return ((1.0 - NdotNG) * ambientGround + (1.0 + NdotNG) * ambientSky) * 0.5;
    }
    `),t.add(i.a`
    float integratedRadiance(float cosTheta2, float roughness)
    {
      return (cosTheta2 - 1.0) / (cosTheta2 * (1.0 - roughness * roughness) - 1.0);
    }
    `),t.add(i.a`
    vec3 evaluateSpecularIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float RdotNG, float roughness)
    {
      float cosTheta2 = 1.0 - RdotNG * RdotNG;
      float intRadTheta = integratedRadiance(cosTheta2, roughness);

      // Calculate the integrated directional radiance of the ground and the sky
      float ground = RdotNG < 0.0 ? 1.0 - intRadTheta : 1.0 + intRadTheta;
      float sky = 2.0 - ground;
      return (ground * ambientGround + sky * ambientSky) * 0.5;
    }
    `)}function a(e,t){const r=e.fragment.code;e.include(n.a),3===t.pbrMode||4===t.pbrMode?(r.add(i.a`
    struct PBRShadingWater
    {
        float NdotL;   // cos angle between normal and light direction
        float NdotV;   // cos angle between normal and view direction
        float NdotH;   // cos angle between normal and half vector
        float VdotH;   // cos angle between view direction and half vector
        float LdotH;   // cos angle between light direction and half vector
        float VdotN;   // cos angle between view direction and normal vector
    };

    float dtrExponent = ${t.useCustomDTRExponentForWater?"2.2":"2.0"};
    `),r.add(i.a`
    vec3 fresnelReflection(float angle, vec3 f0, float f90) {
      return f0 + (f90 - f0) * pow(1.0 - angle, 5.0);
    }
    `),r.add(i.a`
    float normalDistributionWater(float NdotH, float roughness)
    {
      float r2 = roughness * roughness;
      float NdotH2 = NdotH * NdotH;
      float denom = pow((NdotH2 * (r2 - 1.0) + 1.0), dtrExponent) * PI;
      return r2 / denom;
    }
    `),r.add(i.a`
    float geometricOcclusionKelemen(float LoH)
    {
        return 0.25 / (LoH * LoH);
    }
    `),r.add(i.a`
    vec3 brdfSpecularWater(in PBRShadingWater props, float roughness, vec3 F0, float F0Max)
    {
      vec3  F = fresnelReflection(props.VdotH, F0, F0Max);
      float dSun = normalDistributionWater(props.NdotH, roughness);
      float V = geometricOcclusionKelemen(props.LdotH);

      float diffusionSunHaze = mix(roughness + 0.045, roughness + 0.385, 1.0 - props.VdotH);
      float strengthSunHaze  = 1.2;
      float dSunHaze = normalDistributionWater(props.NdotH, diffusionSunHaze)*strengthSunHaze;

      return ((dSun + dSunHaze) * V) * F;
    }

    vec3 tonemapACES(const vec3 x) {
      return (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
    }
    `)):1!==t.pbrMode&&2!==t.pbrMode||(e.include(o),r.add(i.a`
    struct PBRShadingInfo
    {
        float NdotL;                  // cos angle between normal and light direction
        float NdotV;                  // cos angle between normal and view direction
        float NdotH;                  // cos angle between normal and half vector
        float VdotH;                  // cos angle between view direction and half vector
        float LdotH;                  // cos angle between view light direction and half vector
        float NdotNG;                 // cos angle between normal and normal of the ground
        float RdotNG;                 // cos angle between view direction reflected of the normal and normal of the ground
        float NdotAmbDir;             // cos angle between view direction and the fill light in ambient illumination
        float NdotH_Horizon;          // cos angle between normal and half vector defined with horizon illumination
        vec3 skyRadianceToSurface;         // integrated radiance of the sky based on the surface roughness (used for specular reflection)
        vec3 groundRadianceToSurface;      // integrated radiance of the ground based on the surface roughness (used for specular reflection)
        vec3 skyIrradianceToSurface;       // irradiance of the sky (used for diffuse reflection)
        vec3 groundIrradianceToSurface;    // irradiance of the ground (used for diffuse reflection)

        float averageAmbientRadiance;      // average ambient radiance used to deduce black level in gamut mapping
        float ssao;                   // ssao coefficient
        vec3 albedoLinear;            // linear color of the albedo
        vec3 f0;                      // fresnel value at normal incident light
        vec3 f90;                     // fresnel value at 90o of incident light

        vec3 diffuseColor;            // diffuse color of the material used in environment illumination
        float metalness;              // metalness of the material
        float roughness;              // roughness of the material
    };
    `),r.add(i.a`
    float normalDistribution(float NdotH, float roughness)
    {
        float a = NdotH * roughness;
        float b = roughness / (1.0 - NdotH * NdotH + a * a);
        return b * b * INV_PI;
    }
    `),r.add(i.a`
    const vec4 c0 = vec4(-1.0, -0.0275, -0.572,  0.022);
    const vec4 c1 = vec4( 1.0,  0.0425,  1.040, -0.040);
    const vec2 c2 = vec2(-1.04, 1.04);

    vec2 prefilteredDFGAnalytical(float roughness, float NdotV) {
        vec4 r = roughness * c0 + c1;
        float a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
        return c2 * a004 + r.zw;
    }
    `),r.add(i.a`
    vec3 evaluateEnvironmentIllumination(PBRShadingInfo inputs) {
      vec3 indirectDiffuse = evaluateDiffuseIlluminationHemisphere(inputs.groundIrradianceToSurface, inputs.skyIrradianceToSurface, inputs.NdotNG);
      vec3 indirectSpecular = evaluateSpecularIlluminationHemisphere(inputs.groundRadianceToSurface, inputs.skyRadianceToSurface, inputs.RdotNG, inputs.roughness);

      // From diffuse illumination calculate reflected color
      vec3 diffuseComponent = inputs.diffuseColor * indirectDiffuse * INV_PI;

      // From specular illumination calculate reflected color
      vec2 dfg = prefilteredDFGAnalytical(inputs.roughness, inputs.NdotV);
      vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
      vec3 specularComponent = specularColor * indirectSpecular;

      return (diffuseComponent + specularComponent);
    }
    `),r.add(i.a`
    float gamutMapChanel(float x, vec2 p){
      return (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
    }`),r.add(i.a`
    vec3 blackLevelSoftCompression(vec3 inColor, PBRShadingInfo inputs){
      vec3 outColor;
      vec2 p = vec2(0.02 * (inputs.averageAmbientRadiance), 0.0075 * (inputs.averageAmbientRadiance));
      outColor.x = gamutMapChanel(inColor.x, p) ;
      outColor.y = gamutMapChanel(inColor.y, p) ;
      outColor.z = gamutMapChanel(inColor.z, p) ;
      return outColor;
    }
    `))}},aQrP:function(e,t,r){"use strict";r.d(t,"a",function(){return o});const i=r("6S2I").a.getLogger("esri.views.3d.webgl-engine.core.shaderModules.shaderBuilder");class n{constructor(){this.includedModules=new Map}include(e,t){this.includedModules.has(e)?this.includedModules.get(e)!==t&&i.error("Trying to include shader module multiple times with different sets of options."):(this.includedModules.set(e,t),e(this.builder,t))}}class o extends n{constructor(){super(...arguments),this.vertex=new c,this.fragment=new c,this.attributes=new l,this.varyings=new u,this.extensions=new d,this.constants=new h}get builder(){return this}generateSource(e){const t=this.extensions.generateSource(e),r=this.attributes.generateSource(e),i=this.varyings.generateSource(),n="vertex"===e?this.vertex:this.fragment,o=n.uniforms.generateSource(),a=n.code.generateSource(),s="vertex"===e?m:f,c=this.constants.generateSource().concat(n.constants.generateSource());return`\n${t.join("\n")}\n\n${s}\n\n${c.join("\n")}\n\n${o.join("\n")}\n\n${r.join("\n")}\n\n${i.join("\n")}\n\n${a.join("\n")}`}}class a{constructor(){this._entries=new Array,this._set=new Set}add(e,t,r){const i=`${e}_${t}_${r}`;return this._set.has(i)||(this._entries.push([e,t,r]),this._set.add(i)),this}generateSource(){return this._entries.map(e=>{return`uniform ${e[1]} ${e[0]}${t=e[2],t?`[${t}]`:""};`;var t})}}class s{constructor(){this._entries=new Array}add(e){this._entries.push(e)}generateSource(){return this._entries}}class c extends n{constructor(){super(...arguments),this.uniforms=new a,this.code=new s,this.constants=new h}get builder(){return this}}class l{constructor(){this._entries=new Array}add(e,t){this._entries.push([e,t])}generateSource(e){return"fragment"===e?[]:this._entries.map(e=>`attribute ${e[1]} ${e[0]};`)}}class u{constructor(){this._entries=new Array}add(e,t){this._entries.push([e,t])}generateSource(){return this._entries.map(e=>`varying ${e[1]} ${e[0]};`)}}class d{constructor(){this._entries=new Set}add(e){this._entries.add(e)}generateSource(e){const t="vertex"===e?d.ALLOWLIST_VERTEX:d.ALLOWLIST_FRAGMENT;return Array.from(this._entries).filter(e=>t.includes(e)).map(e=>`#extension ${e} : enable`)}}d.ALLOWLIST_FRAGMENT=["GL_EXT_shader_texture_lod","GL_OES_standard_derivatives"],d.ALLOWLIST_VERTEX=[];class h{constructor(){this._entries=[]}add(e,t,r){let i="ERROR_CONSTRUCTOR_STRING";switch(t){case"float":i=h.numberToFloatStr(r);break;case"int":i=h.numberToIntStr(r);break;case"bool":i=r.toString();break;case"vec2":i=`vec2(${h.numberToFloatStr(r[0])},                            ${h.numberToFloatStr(r[1])})`;break;case"vec3":i=`vec3(${h.numberToFloatStr(r[0])},                            ${h.numberToFloatStr(r[1])},                            ${h.numberToFloatStr(r[2])})`;break;case"vec4":i=`vec4(${h.numberToFloatStr(r[0])},                            ${h.numberToFloatStr(r[1])},                            ${h.numberToFloatStr(r[2])},                            ${h.numberToFloatStr(r[3])})`;break;case"ivec2":i=`ivec2(${h.numberToIntStr(r[0])},                             ${h.numberToIntStr(r[1])})`;break;case"ivec3":i=`ivec3(${h.numberToIntStr(r[0])},                             ${h.numberToIntStr(r[1])},                             ${h.numberToIntStr(r[2])})`;break;case"ivec4":i=`ivec4(${h.numberToIntStr(r[0])},                             ${h.numberToIntStr(r[1])},                             ${h.numberToIntStr(r[2])},                             ${h.numberToIntStr(r[3])})`;break;case"bvec2":i=`bvec2(${r[0].toString()},                             ${r[1].toString()})`;break;case"bvec3":i=`bvec3(${r[0].toString()},                             ${r[1].toString()},                             ${r[2].toString()})`;break;case"bvec4":i=`bvec4(${r[0].toString()},                             ${r[1].toString()},                             ${r[2].toString()},                             ${r[3].toString()})`;break;case"mat2":case"mat3":case"mat4":i=`${t}(${Array.prototype.map.call(r,e=>h.numberToFloatStr(e)).join(", ")})`}return this._entries.push(`const ${t} ${e} = ${i};`),this}static numberToIntStr(e){return e.toFixed(0)}static numberToFloatStr(e){return Number.isInteger(e)?e.toFixed(1):e.toString()}generateSource(){return Array.from(this._entries)}}const f="#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n  precision highp sampler2D;\n#else\n  precision mediump float;\n  precision mediump sampler2D;\n#endif",m="precision highp float;\nprecision highp sampler2D;"},agdK:function(e,t,r){"use strict";r.d(t,"a",function(){return s});var i=r("D8Ta"),n=r("OIYib");const o=Object(i.b)(1,1,0,1),a=Object(i.b)(1,0,1,1);function s(e){e.fragment.uniforms.add("depthTex","sampler2D"),e.fragment.uniforms.add("highlightViewportPixelSz","vec4"),e.fragment.constants.add("occludedHighlightFlag","vec4",o).add("unoccludedHighlightFlag","vec4",a),e.fragment.code.add(n.a`
    void outputHighlight() {
      vec4 fragCoord = gl_FragCoord;

      float sceneDepth = texture2D(depthTex, (fragCoord.xy - highlightViewportPixelSz.xy) * highlightViewportPixelSz.zw).r;
      if (fragCoord.z > sceneDepth + 5e-7) {
        gl_FragColor = occludedHighlightFlag;
      }
      else {
        gl_FragColor = unoccludedHighlightFlag;
      }
    }
  `)}(s||(s={})).bindOutputHighlight=function(e,t,r){e.bindTexture(r.highlightDepthTexture,5),t.setUniform1i("depthTex",5),t.setUniform4f("highlightViewportPixelSz",0,0,r.inverseViewport[0],r.inverseViewport[1])}},"aiF/":function(e,t,r){"use strict";r.d(t,"a",function(){return b}),r.d(t,"b",function(){return v});var i=r("wSAH"),n=r("OIYib"),o=r("srIe"),a=(r("OKTS"),r("Cy1f")),s=r("jjdI"),c=r("EVMh"),l=r("fOQB"),u=r("D6bk"),d=r("mmTy"),h=r("0meK"),f=r("N3sV");class m{constructor(e){this.context=e,this.svgAlwaysPremultipliesAlpha=!1,this._doublePrecisionRequiresObfuscation=null,Object(f.a)(e).then(e=>{this.svgAlwaysPremultipliesAlpha=!e})}get doublePrecisionRequiresObfuscation(){if(Object(o.h)(this._doublePrecisionRequiresObfuscation)){const e=g(this.context,!1),t=g(this.context,!0);this._doublePrecisionRequiresObfuscation=0!==e&&(0===t||e/t>5)}return this._doublePrecisionRequiresObfuscation}}let p=null;function g(e,t){const r=new h.a(e,{colorTarget:0,depthStencilTarget:0},{target:3553,wrapMode:33071,pixelFormat:6408,dataType:5121,samplingMode:9728,width:1,height:1}),i=l.a.createVertex(e,35044,new Uint16Array([0,0,1,0,0,1,1,1])),n=new u.a(e,{a_pos:0},{geometry:[{name:"a_pos",count:2,type:5123,offset:0,stride:4,normalized:!1}]},{geometry:i}),o=Object(a.g)(5633261.287538229,2626832.878767164,1434988.0495278358),f=Object(a.g)(5633271.46742708,2626873.6381334523,1434963.231608387),m=function(r,i){const n=new s.a(e,`\n\n  precision highp float;\n\n  attribute vec2 a_pos;\n\n  uniform vec3 u_highA;\n  uniform vec3 u_lowA;\n  uniform vec3 u_highB;\n  uniform vec3 u_lowB;\n\n  varying vec4 v_color;\n\n  ${t?"#define DOUBLE_PRECISION_REQUIRES_OBFUSCATION":""}\n\n  #ifdef DOUBLE_PRECISION_REQUIRES_OBFUSCATION\n\n  vec3 dpPlusFrc(vec3 a, vec3 b) {\n    return mix(a, a + b, vec3(notEqual(b, vec3(0))));\n  }\n\n  vec3 dpMinusFrc(vec3 a, vec3 b) {\n    return mix(vec3(0), a - b, vec3(notEqual(a, b)));\n  }\n\n  vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {\n    vec3 t1 = dpPlusFrc(hiA, hiB);\n    vec3 e = dpMinusFrc(t1, hiA);\n    vec3 t2 = dpMinusFrc(hiB, e) + dpMinusFrc(hiA, dpMinusFrc(t1, e)) + loA + loB;\n    return t1 + t2;\n  }\n\n  #else\n\n  vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {\n    vec3 t1 = hiA + hiB;\n    vec3 e = t1 - hiA;\n    vec3 t2 = ((hiB - e) + (hiA - (t1 - e))) + loA + loB;\n    return t1 + t2;\n  }\n\n  #endif\n\n  const float MAX_RGBA_FLOAT =\n    255.0 / 256.0 +\n    255.0 / 256.0 / 256.0 +\n    255.0 / 256.0 / 256.0 / 256.0 +\n    255.0 / 256.0 / 256.0 / 256.0 / 256.0;\n\n  const vec4 FIXED_POINT_FACTORS = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);\n\n  vec4 float2rgba(const float value) {\n    // Make sure value is in the domain we can represent\n    float valueInValidDomain = clamp(value, 0.0, MAX_RGBA_FLOAT);\n\n    // Decompose value in 32bit fixed point parts represented as\n    // uint8 rgba components. Decomposition uses the fractional part after multiplying\n    // by a power of 256 (this removes the bits that are represented in the previous\n    // component) and then converts the fractional part to 8bits.\n    vec4 fixedPointU8 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);\n\n    // Convert uint8 values (from 0 to 255) to floating point representation for\n    // the shader\n    const float toU8AsFloat = 1.0 / 255.0;\n\n    return fixedPointU8 * toU8AsFloat;\n  }\n\n  void main() {\n    vec3 val = dpAdd(u_highA, u_lowA, -u_highB, -u_lowB);\n\n    v_color = float2rgba(val.z / 25.0);\n\n    gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0);\n  }\n  `,"\n  precision highp float;\n\n  varying vec4 v_color;\n\n  void main() {\n    gl_FragColor = v_color;\n  }\n  ",{a_pos:0}),o=new Float32Array(6);Object(d.a)(r,o,3);const a=new Float32Array(6);return Object(d.a)(i,a,3),e.bindProgram(n),n.setUniform3f("u_highA",o[0],o[2],o[4]),n.setUniform3f("u_lowA",o[1],o[3],o[5]),n.setUniform3f("u_highB",a[0],a[2],a[4]),n.setUniform3f("u_lowB",a[1],a[3],a[5]),n}(o,f),p=e.getBoundFramebufferObject(),{x:g,y:b,width:v,height:x}=e.getViewport();e.bindFramebuffer(r),e.setViewport(0,0,1,1),e.bindVAO(n),e.drawArrays(5,0,4);const _=new Uint8Array(4);r.readPixels(0,0,1,1,6408,5121,_),m.dispose(),n.dispose(!1),i.dispose(),r.dispose(),e.setViewport(g,b,v,x),e.bindFramebuffer(p);const O=(o[2]-f[2])/25,y=Object(c.c)(_);return Math.abs(O-y)}function b({code:e},t){e.add(t.doublePrecisionRequiresObfuscation?n.a`
      vec3 dpPlusFrc(vec3 a, vec3 b) {
        return mix(a, a + b, vec3(notEqual(b, vec3(0))));
      }

      vec3 dpMinusFrc(vec3 a, vec3 b) {
        return mix(vec3(0), a - b, vec3(notEqual(a, b)));
      }

      // based on https://www.thasler.com/blog/blog/glsl-part2-emu
      vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
        vec3 t1 = dpPlusFrc(hiA, hiB);
        vec3 e = dpMinusFrc(t1, hiA);
        vec3 t2 = dpMinusFrc(hiB, e) + dpMinusFrc(hiA, dpMinusFrc(t1, e)) + loA + loB;
        return t1 + t2;
      }
    `:n.a`
      vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
        vec3 t1 = hiA + hiB;
        vec3 e = t1 - hiA;
        vec3 t2 = ((hiB - e) + (hiA - (t1 - e))) + loA + loB;
        return t1 + t2;
      }
    `)}function v(e){return!!Object(i.a)("force-double-precision-obfuscation")||(t=e,(Object(o.h)(p)||p.context!==t)&&(p=new m(t)),p).doublePrecisionRequiresObfuscation;var t}},bLIi:function(e,t,r){"use strict";r.d(t,"a",function(){return o});var i=r("OIYib");function n(e){e.vertex.code.add(i.a`
    vec4 decodeSymbolColor(vec4 symbolColor, out int colorMixMode) {
      float symbolAlpha = 0.0;

      const float maxTint = 85.0;
      const float maxReplace = 170.0;
      const float scaleAlpha = 3.0;

      if (symbolColor.a > maxReplace) {
        colorMixMode = ${i.a.int(1)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxReplace);
      } else if (symbolColor.a > maxTint) {
        colorMixMode = ${i.a.int(3)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxTint);
      } else if (symbolColor.a > 0.0) {
        colorMixMode = ${i.a.int(4)};
        symbolAlpha = scaleAlpha * symbolColor.a;
      } else {
        colorMixMode = ${i.a.int(1)};
        symbolAlpha = 0.0;
      }

      return vec4(symbolColor.r, symbolColor.g, symbolColor.b, symbolAlpha);
    }
  `)}function o(e,t){t.symbolColor?(e.include(n),e.attributes.add("symbolColor","vec4"),e.varyings.add("colorMixMode","mediump float")):e.fragment.uniforms.add("colorMixMode","int"),e.vertex.code.add(t.symbolColor?i.a`
    int symbolColorMixMode;

    vec4 getSymbolColor() {
      return decodeSymbolColor(symbolColor, symbolColorMixMode) * 0.003921568627451;
    }

    void forwardColorMixMode() {
      colorMixMode = float(symbolColorMixMode) + 0.5;
    }
  `:i.a`
    vec4 getSymbolColor() { return vec4(1.0); }
    void forwardColorMixMode() {}
    `)}},bVvB:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e,t){t.attributeColor?(e.attributes.add("color","vec4"),e.varyings.add("vColor","vec4"),e.vertex.code.add(i.a`
      void forwardVertexColor() { vColor = color; }
    `),e.vertex.code.add(i.a`
      void forwardNormalizedVertexColor() { vColor = color * 0.003921568627451; }
    `)):e.vertex.code.add(i.a`
      void forwardVertexColor() {}
      void forwardNormalizedVertexColor() {}
    `)}},cIib:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e,t){const r=e.fragment;t.receiveAmbientOcclusion?(r.uniforms.add("ssaoTex","sampler2D"),r.uniforms.add("viewportPixelSz","vec4"),r.code.add(i.a`
      float evaluateAmbientOcclusion() {
        return 1.0 - texture2D(ssaoTex, (gl_FragCoord.xy - viewportPixelSz.xy) * viewportPixelSz.zw).a;
      }

      float evaluateAmbientOcclusionInverse() {
        float ssao = texture2D(ssaoTex, (gl_FragCoord.xy - viewportPixelSz.xy) * viewportPixelSz.zw).a;
        return viewportPixelSz.z < 0.0 ? 1.0 : ssao;
      }
    `)):r.code.add(i.a`
      float evaluateAmbientOcclusion() { return 0.0; } // no occlusion
      float evaluateAmbientOcclusionInverse() { return 1.0; }
    `)}},fFEv:function(e,t,r){"use strict";r.d(t,"a",function(){return O}),r.d(t,"b",function(){return S}),r.d(t,"c",function(){return y}),r.d(t,"d",function(){return h}),r.d(t,"e",function(){return T}),r.d(t,"f",function(){return _});var i=r("srIe"),n=r("OKTS"),o=r("Cy1f"),a=r("5DEt"),s=r("QmHG"),c=r("EVMh"),l=r("tiP8");Object(n.d)(10),Object(n.d)(12),Object(n.d)(70),Object(n.d)(40);const u={scale:0,factor:0,minPixelSize:0,paddingPixels:0},d=Object(s.b)();function h(e,t,r,i,n,o,a){const s=Object(l.b)(t),u=r.tolerance;if(!s)if(e.boundingInfo)Object(c.a)(0===e.primitiveType),m(e.boundingInfo,i,n,u,o,a);else{const t=e.indices.get("position"),r=e.vertexAttributes.get("position");g(i,n,0,t.length/3,t,r,void 0,o,a)}}const f=Object(o.e)();function m(e,t,r,n,o,c){if(Object(i.h)(e))return;const l=function(e,t,r){return Object(a.r)(r,1/(t[0]-e[0]),1/(t[1]-e[1]),1/(t[2]-e[2]))}(t,r,f);if(Object(s.l)(d,e.getBBMin()),Object(s.k)(d,e.getBBMax()),Object(i.i)(o)&&o.applyToAabb(d),function(e,t,r,i){return function(e,t,r,i,n){const o=(e[0]-i-t[0])*r[0],a=(e[3]+i-t[0])*r[0];let s=Math.min(o,a),c=Math.max(o,a);const l=(e[1]-i-t[1])*r[1],u=(e[4]+i-t[1])*r[1];if(c=Math.min(c,Math.max(l,u)),c<0)return!1;if(s=Math.max(s,Math.min(l,u)),s>c)return!1;const d=(e[2]-i-t[2])*r[2],h=(e[5]+i-t[2])*r[2];return c=Math.min(c,Math.max(d,h)),!(c<0)&&(s=Math.max(s,Math.min(d,h)),!(s>c)&&s<1/0)}(e,t,r,i)}(d,t,l,n)){const{primitiveIndices:i,indices:a,position:s}=e,l=i?i.length:a.length/3;if(l>j){const i=e.getChildren();if(void 0!==i){for(let e=0;e<8;++e)void 0!==i[e]&&m(i[e],t,r,n,o,c);return}}g(t,r,0,l,a,s,i,o,c)}}const p=Object(o.e)();function g(e,t,r,n,o,a,s,c,l){if(s)return function(e,t,r,n,o,a,s,c,l){const u=a.data,d=a.stride||a.size,h=e[0],f=e[1],m=e[2],g=t[0]-h,b=t[1]-f,v=t[2]-m;for(let _=r;_<n;++_){const e=s[_];let t=3*e,r=d*o[t++],n=u[r++],a=u[r++],O=u[r];r=d*o[t++];let y=u[r++],T=u[r++],w=u[r];r=d*o[t];let S=u[r++],j=u[r++],M=u[r];Object(i.i)(c)&&([n,a,O]=c.applyToVertex(n,a,O,_),[y,T,w]=c.applyToVertex(y,T,w,_),[S,j,M]=c.applyToVertex(S,j,M,_));const A=y-n,C=T-a,P=w-O,E=S-n,I=j-a,F=M-O,D=b*F-I*v,R=v*E-F*g,L=g*I-E*b,B=A*D+C*R+P*L;if(Math.abs(B)<=Number.EPSILON)continue;const N=h-n,z=f-a,U=m-O,V=N*D+z*R+U*L;if(B>0){if(V<0||V>B)continue}else if(V>0||V<B)continue;const H=z*P-C*U,k=U*A-P*N,G=N*C-A*z,W=g*H+b*k+v*G;if(B>0){if(W<0||V+W>B)continue}else if(W>0||V+W<B)continue;const q=(E*H+I*k+F*G)/B;q>=0&&l(q,x(A,C,P,E,I,F,p),e)}}(e,t,r,n,o,a,s,c,l);const u=a.data,d=a.stride||a.size,h=e[0],f=e[1],m=e[2],g=t[0]-h,b=t[1]-f,v=t[2]-m;for(let _=r,O=3*r;_<n;++_){let e=d*o[O++],t=u[e++],r=u[e++],n=u[e];e=d*o[O++];let a=u[e++],s=u[e++],y=u[e];e=d*o[O++];let T=u[e++],w=u[e++],S=u[e];Object(i.i)(c)&&([t,r,n]=c.applyToVertex(t,r,n,_),[a,s,y]=c.applyToVertex(a,s,y,_),[T,w,S]=c.applyToVertex(T,w,S,_));const j=a-t,M=s-r,A=y-n,C=T-t,P=w-r,E=S-n,I=b*E-P*v,F=v*C-E*g,D=g*P-C*b,R=j*I+M*F+A*D;if(Math.abs(R)<=Number.EPSILON)continue;const L=h-t,B=f-r,N=m-n,z=L*I+B*F+N*D;if(R>0){if(z<0||z>R)continue}else if(z>0||z<R)continue;const U=B*A-M*N,V=N*j-A*L,H=L*M-j*B,k=g*U+b*V+v*H;if(R>0){if(k<0||z+k>R)continue}else if(k>0||z+k<R)continue;const G=(C*U+P*V+E*H)/R;G>=0&&l(G,x(j,M,A,C,P,E,p),_)}}const b=Object(o.e)(),v=Object(o.e)();function x(e,t,r,i,n,o,s){return Object(a.r)(b,e,t,r),Object(a.r)(v,i,n,o),Object(a.d)(s,b,v),Object(a.o)(s,s),s}function _(e,t,r,i,o){let a=(r.screenLength||0)*e.pixelRatio;o&&(a=function(e,t,r,i){return function(e,t){return Math.max(Object(n.g)(e*t.scale,e,t.factor),function(e,t){return 0===e?t.minPixelSize:t.minPixelSize*(1+2*t.paddingPixels/e)}(e,t))}(e,function(e,t,r){const i=r.parameters,n=r.paddingPixelsOverride;return u.scale=Math.min(i.divisor/(t-i.offset),1),u.factor=function(e){return Math.abs(e*e*e)}(e),u.minPixelSize=i.minPixelSize,u.paddingPixels=n,u}(t,r,i))}(a,i,t,o));const s=a*Math.tan(.5*e.fovY)/(.5*e.fullHeight);return Object(n.e)(s*t,r.minWorldLength||0,null!=r.maxWorldLength?r.maxWorldLength:1/0)}function O(e,t,r){if(!e)return;const i=e.parameters;t.setUniform4f(r,i.divisor,i.offset,i.minPixelSize,e.paddingPixelsOverride)}function y(e,t){const r=t?y(t):{};for(const i in e){let t=e[i];t&&t.forEach&&(t=w(t)),null==t&&i in r||(r[i]=t)}return r}function T(e,t){let r=!1;for(const i in t){const n=t[i];void 0!==n&&(r=!0,e[i]=Array.isArray(n)?n.slice():n)}return r}function w(e){const t=[];return e.forEach(e=>t.push(e)),t}const S={multiply:1,ignore:2,replace:3,tint:4},j=1e3},fLTx:function(e,t,r){"use strict";r.d(t,"a",function(){return a});var i=r("OIYib"),n=r("368d");function o(e){e.extensions.add("GL_EXT_shader_texture_lod"),e.extensions.add("GL_OES_standard_derivatives"),e.fragment.code.add(i.a`
    #ifndef GL_EXT_shader_texture_lod
      float calcMipMapLevel(const vec2 ddx, const vec2 ddy) {
        float deltaMaxSqr = max(dot(ddx, ddx), dot(ddy, ddy));
        return max(0.0, 0.5 * log2(deltaMaxSqr));
      }
    #endif

    vec4 textureAtlasLookup(sampler2D texture, vec2 textureSize, vec2 textureCoordinates, vec4 atlasRegion) {
      //[umin, vmin, umax, vmax]
      vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
      vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;

      // calculate derivative of continuous texture coordinate
      // to avoid mipmapping artifacts caused by manual wrapping in shader
      // clamp the derivatives to avoid discoloring when zooming out.
      float maxdUV = 0.125; // Emprirically tuned compromise between discoloring and aliasing noise.
      vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
      vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;

      #ifdef GL_EXT_shader_texture_lod
        return texture2DGradEXT(texture, uvAtlas, dUVdx, dUVdy);
      #else
        // use bias to compensate for difference in automatic vs desired mipmap level
        vec2 dUVdxAuto = dFdx(uvAtlas);
        vec2 dUVdyAuto = dFdy(uvAtlas);
        float mipMapLevel = calcMipMapLevel(dUVdx * textureSize, dUVdy * textureSize);
        float autoMipMapLevel = calcMipMapLevel(dUVdxAuto * textureSize, dUVdyAuto * textureSize);

        return texture2D(texture, uvAtlas, mipMapLevel - autoMipMapLevel);
      #endif
    }
  `)}function a(e,t){e.include(n.a,t),e.fragment.code.add(i.a`
  struct TextureLookupParameter {
    vec2 uv;
    ${t.supportsTextureAtlas?"vec2 size;":""}
  } vtc;
  `),1===t.attributeTextureCoordinates&&e.fragment.code.add(i.a`
      vec4 textureLookup(sampler2D tex, TextureLookupParameter params) {
        return texture2D(tex, params.uv);
      }
    `),2===t.attributeTextureCoordinates&&(e.include(o),e.fragment.code.add(i.a`
    vec4 textureLookup(sampler2D tex, TextureLookupParameter params) {
        return textureAtlasLookup(tex, params.size, params.uv, vuvRegion);
      }
    `))}},fOQB:function(e,t,r){"use strict";var i=r("ohva"),n=r("GVa1");class o{constructor(e,t,r,i,o){this._context=e,this.bufferType=t,this.usage=r,this._glName=null,this._size=-1,this._indexType=void 0,e.instanceCounter.increment(1,this),this._glName=this._context.gl.createBuffer(),Object(n.a)(this._context.gl),i&&this.setData(i,o)}static createIndex(e,t,r,i){return new o(e,34963,t,r,i)}static createVertex(e,t,r){return new o(e,34962,t,r)}get glName(){return this._glName}get size(){return this._size}get indexType(){return this._indexType}get byteSize(){return 34962===this.bufferType?this._size:5125===this._indexType?4*this._size:2*this._size}dispose(){this._context&&(this._glName&&(this._context.gl.deleteBuffer(this._glName),this._glName=null),this._context.instanceCounter.decrement(1,this),this._context=null)}setData(e,t){if(!e)return;if("number"==typeof e){if(e<0&&console.error("Buffer size cannot be negative!"),34963===this.bufferType&&t)switch(this._indexType=t,this._size=e,t){case 5123:e*=2;break;case 5125:e*=4}}else{let t=e.byteLength;Object(i.i)(e)&&(t/=2,this._indexType=5123),Object(i.j)(e)&&(t/=4,this._indexType=5125),this._size=t}const r=this._context.getBoundVAO();this._context.bindVAO(null),this._context.bindBuffer(this),this._context.gl.bufferData(this.bufferType,e,this.usage),this._context.bindVAO(r)}setSubData(e,t=0,r=0,n=e.byteLength){if(!e)return;(t<0||t>=this._size)&&console.error("offset is out of range!");let o=t,a=r,s=n,c=e.byteLength;Object(i.i)(e)&&(c/=2,o*=2,a*=2,s*=2),Object(i.j)(e)&&(c/=4,o*=4,a*=4,s*=4),void 0===n&&(n=c-1),r>=n&&console.error("end must be bigger than start!"),t+r-n>this._size&&console.error("An attempt to write beyond the end of the buffer!");const l=this._context.getBoundVAO();this._context.bindVAO(null),this._context.bindBuffer(this);const u=this._context.gl,d=ArrayBuffer.isView(e)?e.buffer:e,h=0===a&&s===e.byteLength?d:d.slice(a,s);u.bufferSubData(this.bufferType,o,h),this._context.bindVAO(l)}}t.a=o},fRF2:function(e,t,r){"use strict";r.d(t,"a",function(){return h});var i,n=r("OIYib"),o=r("wzLF"),a=r("Cy1f"),s=r("2uVf"),c=r("r+FG"),l=r("aiF/"),u=r("sJp1");function d(e,t){e.include(u.a),e.vertex.include(l.a,t),e.varyings.add("vPositionWorldCameraRelative","vec3"),e.varyings.add("vPosition_view","vec3"),e.vertex.uniforms.add("uTransform_WorldFromModel_RS","mat3"),e.vertex.uniforms.add("uTransform_WorldFromModel_TH","vec3"),e.vertex.uniforms.add("uTransform_WorldFromModel_TL","vec3"),e.vertex.uniforms.add("uTransform_WorldFromView_TH","vec3"),e.vertex.uniforms.add("uTransform_WorldFromView_TL","vec3"),e.vertex.uniforms.add("uTransform_ViewFromCameraRelative_RS","mat3"),e.vertex.uniforms.add("uTransform_ProjFromView","mat4"),e.vertex.code.add(n.a`
    // compute position in world space orientation, but relative to the camera position
    vec3 positionWorldCameraRelative() {
      vec3 rotatedModelPosition = uTransform_WorldFromModel_RS * positionModel();

      vec3 transform_CameraRelativeFromModel = dpAdd(
        uTransform_WorldFromModel_TL,
        uTransform_WorldFromModel_TH,
        -uTransform_WorldFromView_TL,
        -uTransform_WorldFromView_TH
      );

      return transform_CameraRelativeFromModel + rotatedModelPosition;
    }

    // position in view space, that is relative to the camera position and orientation
    vec3 position_view() {
      return uTransform_ViewFromCameraRelative_RS * positionWorldCameraRelative();
    }

    // compute gl_Position and forward related varyings to fragment shader
    void forwardPosition() {
      vPositionWorldCameraRelative = positionWorldCameraRelative();
      vPosition_view = position_view();
      gl_Position = uTransform_ProjFromView * vec4(vPosition_view, 1.0);
    }

    vec3 positionWorld() {
      return uTransform_WorldFromView_TL + vPositionWorldCameraRelative;
    }
  `),e.fragment.uniforms.add("uTransform_WorldFromView_TL","vec3"),e.fragment.code.add(n.a`
    vec3 positionWorld() {
      return uTransform_WorldFromView_TL + vPositionWorldCameraRelative;
    }
  `)}function h(e,t){0===t.normalType||1===t.normalType?(e.include(o.a,t),e.varyings.add("vNormalWorld","vec3"),e.varyings.add("vNormalView","vec3"),e.vertex.uniforms.add("uTransformNormal_GlobalFromModel","mat3"),e.vertex.uniforms.add("uTransformNormal_ViewFromGlobal","mat3"),e.vertex.code.add(n.a`
      void forwardNormal() {
        vNormalWorld = uTransformNormal_GlobalFromModel * normalModel();
        vNormalView = uTransformNormal_ViewFromGlobal * vNormalWorld;
      }
    `)):2===t.normalType?(e.include(d,t),e.varyings.add("vNormalWorld","vec3"),e.vertex.code.add(n.a`
    void forwardNormal() {
      vNormalWorld = ${1===t.viewingMode?n.a`normalize(vPositionWorldCameraRelative);`:n.a`vec3(0.0, 0.0, 1.0);`}
    }
    `)):e.vertex.code.add(n.a`
      void forwardNormal() {}
    `)}(i=d||(d={})).ModelTransform=class{constructor(){this.worldFromModel_RS=Object(s.a)(),this.worldFromModel_TH=Object(a.e)(),this.worldFromModel_TL=Object(a.e)()}},i.ViewProjectionTransform=class{constructor(){this.worldFromView_TH=Object(a.e)(),this.worldFromView_TL=Object(a.e)(),this.viewFromCameraRelative_RS=Object(s.a)(),this.projFromView=Object(c.b)()}},i.bindModelTransform=function(e,t){e.setUniformMatrix3fv("uTransform_WorldFromModel_RS",t.worldFromModel_RS),e.setUniform3fv("uTransform_WorldFromModel_TH",t.worldFromModel_TH),e.setUniform3fv("uTransform_WorldFromModel_TL",t.worldFromModel_TL)},i.bindViewProjTransform=function(e,t){e.setUniform3fv("uTransform_WorldFromView_TH",t.worldFromView_TH),e.setUniform3fv("uTransform_WorldFromView_TL",t.worldFromView_TL),e.setUniformMatrix4fv("uTransform_ProjFromView",t.projFromView),e.setUniformMatrix3fv("uTransform_ViewFromCameraRelative_RS",t.viewFromCameraRelative_RS)},(h||(h={})).bindUniforms=function(e,t){e.setUniformMatrix4fv("viewNormal",t)}},fiGu:function(e,t,r){"use strict";r.d(t,"a",function(){return m});var i=r("OIYib"),n=r("Tbkp"),o=r("0nJL"),a=r("agdK"),s=r("viRi"),c=r("69UF"),l=r("UBvB");function u(e,t){e.fragment.include(l.a),3===t.output?(e.extensions.add("GL_OES_standard_derivatives"),e.fragment.code.add(i.a`
      float _calculateFragDepth(const in float depth) {
        // calc polygon offset
        const float SLOPE_SCALE = 2.0;
        const float BIAS = 2.0 * .000015259;    // 1 / (2^16 - 1)
        float m = max(abs(dFdx(depth)), abs(dFdy(depth)));
        float result = depth + SLOPE_SCALE * m + BIAS;
        return clamp(result, .0, .999999);
      }

      void outputDepth(float _linearDepth) {
        gl_FragColor = float2rgba(_calculateFragDepth(_linearDepth));
      }
    `)):1===t.output&&e.fragment.code.add(i.a`
      void outputDepth(float _linearDepth) {
        gl_FragColor = float2rgba(_linearDepth);
      }
    `)}var d=r("368d"),h=r("wzLF"),f=r("fRF2");function m(e,t){const r=e.vertex.code,l=e.fragment.code;1!==t.output&&3!==t.output||(e.include(n.a,{linearDepth:!0}),e.include(d.a,t),e.include(s.a,t),e.include(u,t),e.include(o.a,t),e.vertex.uniforms.add("cameraNearFar","vec2"),e.varyings.add("depth","float"),t.hasColorTexture&&e.fragment.uniforms.add("tex","sampler2D"),r.add(i.a`
      void main(void) {
        vpos = calculateVPos();
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPositionWithDepth(proj, view, vpos, cameraNearFar, depth);
        forwardTextureCoordinates();
      }
    `),e.include(c.a,t),l.add(i.a`
      void main(void) {
        discardBySlice(vpos);
        ${t.hasColorTexture?i.a`
        vec4 texColor = texture2D(tex, vuv0);
        discardOrAdjustAlpha(texColor);`:""}
        outputDepth(depth);
      }
    `)),2===t.output&&(e.include(n.a,{linearDepth:!1}),e.include(h.a,t),e.include(f.a,t),e.include(d.a,t),e.include(s.a,t),t.hasColorTexture&&e.fragment.uniforms.add("tex","sampler2D"),e.vertex.uniforms.add("viewNormal","mat4"),e.varyings.add("vPositionView","vec3"),r.add(i.a`
      void main(void) {
        vpos = calculateVPos();
        vpos = subtractOrigin(vpos);
        ${0===t.normalType?i.a`
        vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:""}
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();
      }
    `),e.include(o.a,t),e.include(c.a,t),l.add(i.a`
      void main() {
        discardBySlice(vpos);
        ${t.hasColorTexture?i.a`
        vec4 texColor = texture2D(tex, vuv0);
        discardOrAdjustAlpha(texColor);`:""}

        ${3===t.normalType?i.a`
            vec3 normal = screenDerivativeNormal(vPositionView);`:i.a`
            vec3 normal = normalize(vNormalWorld);
            if (gl_FrontFacing == false) normal = -normal;`}
        gl_FragColor = vec4(vec3(0.5) + 0.5 * normal, 1.0);
      }
    `)),4===t.output&&(e.include(n.a,{linearDepth:!1}),e.include(d.a,t),e.include(s.a,t),t.hasColorTexture&&e.fragment.uniforms.add("tex","sampler2D"),r.add(i.a`
      void main(void) {
        vpos = calculateVPos();
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();
      }
    `),e.include(o.a,t),e.include(c.a,t),e.include(a.a),l.add(i.a`
      void main() {
        discardBySlice(vpos);
        ${t.hasColorTexture?i.a`
        vec4 texColor = texture2D(tex, vuv0);
        discardOrAdjustAlpha(texColor);`:""}
        outputHighlight();
      }
    `))}},hTmG:function(e,t,r){"use strict";function i(e,t){return e.vertexBuffers[t].size/function(e){return e[0].stride}(e.layout[t])}function n(e,t,r,i,n){const o=e.gl,a=e.capabilities.instancing;e.bindBuffer(r);for(const s of i){const e=t[s.name],r=(n||(0+s.baseInstance?s.baseInstance:0))*s.stride;if(void 0===e&&console.error(`There is no location for vertex attribute '${s.name}' defined.`),s.baseInstance&&!s.divisor&&console.error(`Vertex attribute '${s.name}' uses baseInstanceOffset without divisor.`),s.count<=4)o.vertexAttribPointer(e,s.count,s.type,s.normalized,s.stride,s.offset+r),o.enableVertexAttribArray(e),s.divisor&&s.divisor>0&&a&&a.vertexAttribDivisor(e,s.divisor);else if(9===s.count)for(let t=0;t<3;t++)o.vertexAttribPointer(e+t,3,s.type,s.normalized,s.stride,s.offset+12*t+r),o.enableVertexAttribArray(e+t),s.divisor&&s.divisor>0&&a&&a.vertexAttribDivisor(e+t,s.divisor);else if(16===s.count)for(let t=0;t<4;t++)o.vertexAttribPointer(e+t,4,s.type,s.normalized,s.stride,s.offset+16*t+r),o.enableVertexAttribArray(e+t),s.divisor&&s.divisor>0&&a&&a.vertexAttribDivisor(e+t,s.divisor);else console.error("Unsupported vertex attribute element count: "+s.count)}}function o(e,t,r,i){const n=e.gl,o=e.capabilities.instancing;e.bindBuffer(r);for(const a of i){const e=t[a.name];if(a.count<=4)n.disableVertexAttribArray(e),a.divisor&&a.divisor>0&&o&&o.vertexAttribDivisor(e,0);else if(9===a.count)for(let t=0;t<3;t++)n.disableVertexAttribArray(e+t),a.divisor&&a.divisor>0&&o&&o.vertexAttribDivisor(e+t,0);else if(16===a.count)for(let t=0;t<4;t++)n.disableVertexAttribArray(e+t),a.divisor&&a.divisor>0&&o&&o.vertexAttribDivisor(e+t,0);else console.error("Unsupported vertex attribute element count: "+a.count)}e.unbindBuffer(34962)}function a(e){switch(e){case 6406:case 6409:case 36168:return 1;case 6410:case 32854:case 33325:case 32854:case 33189:return 2;case 6407:case 6402:return 3;case 6408:case 34041:case 33326:case 35898:case 33327:case 34041:return 4;case 33328:case 34842:return 8;case 34836:return 16;case 33776:case 33777:return.5;case 33778:case 33779:return 1;case 37488:case 37489:case 37492:case 37493:case 37494:case 37495:return.5;case 37490:case 37491:case 37496:case 37497:return 1}return 0}r.d(t,"a",function(){return n}),r.d(t,"b",function(){return a}),r.d(t,"c",function(){return o}),r.d(t,"d",function(){return i}),r("wSAH"),r("srIe")},jjdI:function(e,t,r){"use strict";r("wSAH");var i=r("srIe"),n=["layout","centroid","smooth","case","mat2x2","mat2x3","mat2x4","mat3x2","mat3x3","mat3x4","mat4x2","mat4x3","mat4x4","uint","uvec2","uvec3","uvec4","samplerCubeShadow","sampler2DArray","sampler2DArrayShadow","isampler2D","isampler3D","isamplerCube","isampler2DArray","usampler2D","usampler3D","usamplerCube","usampler2DArray","coherent","restrict","readonly","writeonly","resource","atomic_uint","noperspective","patch","sample","subroutine","common","partition","active","filter","image1D","image2D","image3D","imageCube","iimage1D","iimage2D","iimage3D","iimageCube","uimage1D","uimage2D","uimage3D","uimageCube","image1DArray","image2DArray","iimage1DArray","iimage2DArray","uimage1DArray","uimage2DArray","image1DShadow","image2DShadow","image1DArrayShadow","image2DArrayShadow","imageBuffer","iimageBuffer","uimageBuffer","sampler1DArray","sampler1DArrayShadow","isampler1D","isampler1DArray","usampler1D","usampler1DArray","isampler2DRect","usampler2DRect","samplerBuffer","isamplerBuffer","usamplerBuffer","sampler2DMS","isampler2DMS","usampler2DMS","sampler2DMSArray","isampler2DMSArray","usampler2DMSArray","trunc","round","roundEven","isnan","isinf","floatBitsToInt","floatBitsToUint","intBitsToFloat","uintBitsToFloat","packSnorm2x16","unpackSnorm2x16","packUnorm2x16","unpackUnorm2x16","packHalf2x16","unpackHalf2x16","outerProduct","transpose","determinant","inverse","texture","textureSize","textureProj","textureLod","textureOffset","texelFetch","texelFetchOffset","textureProjOffset","textureLodOffset","textureProjLod","textureProjLodOffset","textureGrad","textureGradOffset","textureProjGrad","textureProjGradOffset"],o=r("n4uK"),a=999,s=["block-comment","line-comment","preprocessor","operator","integer","float","ident","builtin","keyword","whitespace","eof","integer"];const c=["GL_OES_standard_derivatives","GL_EXT_frag_depth","GL_EXT_draw_buffers","GL_EXT_shader_texture_lod"];function l(e,t){for(let r=t-1;r>=0;r--){const t=e[r];if("whitespace"!==t.type&&"block-comment"!==t.type){if("keyword"!==t.type)break;if("attribute"===t.data||"in"===t.data)return!0}}return!1}function u(e,t,r,i){i=i||r;for(const n of e)if("ident"===n.type&&n.data===r)return i in t?t[i]++:t[i]=0,u(e,t,i+"_"+t[i],i);return r}function d(e,t,r="afterVersion"){function i(e,t){for(let r=t;r<e.length;r++){const t=e[r];if("operator"===t.type&&";"===t.data)return r}return null}const n={data:"\n",type:"whitespace"},o=t=>t<e.length&&/[^\r\n]$/.test(e[t].data);let a=function(e){let t=-1,n=0,o=-1;for(let a=0;a<e.length;a++){const s=e[a];if("preprocessor"===s.type&&(s.data.match(/\#(if|ifdef|ifndef)\s+.+/)?++n:s.data.match(/\#endif\s*.*/)&&--n),"afterVersion"!==r&&"afterPrecision"!==r||"preprocessor"===s.type&&/^#version/.test(s.data)&&(o=Math.max(o,a)),"afterPrecision"===r&&"keyword"===s.type&&"precision"===s.data){const t=i(e,a);if(null===t)throw new Error("precision statement not followed by any semicolons!");o=Math.max(o,t)}t<o&&0===n&&(t=a)}return t+1}(e);o(a-1)&&e.splice(a++,0,n);for(const s of t)e.splice(a++,0,s);o(a-1)&&o(a)&&e.splice(a,0,n)}function h(e,t,r,i="lowp"){d(e,[{type:"keyword",data:"out"},{type:"whitespace",data:" "},{type:"keyword",data:i},{type:"whitespace",data:" "},{type:"keyword",data:r},{type:"whitespace",data:" "},{type:"ident",data:t},{type:"operator",data:";"}],"afterPrecision")}function f(e,t,r,i,n="lowp"){d(e,[{type:"keyword",data:"layout"},{type:"operator",data:"("},{type:"keyword",data:"location"},{type:"whitespace",data:" "},{type:"operator",data:"="},{type:"whitespace",data:" "},{type:"integer",data:i.toString()},{type:"operator",data:")"},{type:"whitespace",data:" "},{type:"keyword",data:"out"},{type:"whitespace",data:" "},{type:"keyword",data:n},{type:"whitespace",data:" "},{type:"keyword",data:r},{type:"whitespace",data:" "},{type:"ident",data:t},{type:"operator",data:";"}],"afterPrecision")}function m(e,t){let r,i,n=-1;for(let o=t;o<e.length;o++){const t=e[o];if("operator"===t.type&&("["===t.data&&(r=o),"]"===t.data)){i=o;break}"integer"===t.type&&(n=parseInt(t.data,10))}return r&&i&&e.splice(r,i-r+1),n}class p{constructor(e,t,r,i,n={}){if(this._context=null,this._glName=null,this._locations={},this._initialized=!1,this._vShader=null,this._fShader=null,this._defines={},this._nameToUniformLocation={},this._nameToAttribLocation={},this._nameToUniform1={},this._nameToUniform1v={},this._nameToUniform2={},this._nameToUniform3={},this._nameToUniform4={},this._nameToUniformMatrix3={},this._nameToUniformMatrix4={},e||console.error("RenderingContext isn't initialized!"),0===t.length&&console.error("Shaders source should not be empty!"),e.instanceCounter.increment(3,this),this._context=e,this._vertexShaderSource=t,this._fragmentShaderSource=r,Array.isArray(n))for(const o of n)this._defines[o]="1";else this._defines=n;this._locations=i}get glName(){return this._glName}get locations(){return this._locations}getDefine(e){return this._defines[e]}dispose(){if(!this._context)return;const e=this._context.gl;this._vShader&&(e.deleteShader(this._vShader),this._vShader=null),this._fShader&&(e.deleteShader(this._fShader),this._fShader=null),this._glName&&(e.deleteProgram(this._glName),this._glName=null),this._context.instanceCounter.decrement(3,this),this._context=null}initialize(){if(this._initialized)return;this._vShader=this._loadShader(35633),this._fShader=this._loadShader(35632),this._vShader&&this._fShader||console.error("Error loading shaders!");const e=this._context.gl,t=e.createProgram();e.attachShader(t,this._vShader),e.attachShader(t,this._fShader);for(const r in this._locations)e.bindAttribLocation(t,this._locations[r],r);e.linkProgram(t),this._glName=t,this._initialized=!0}getUniformLocation(e){return this.initialize(),void 0===this._nameToUniformLocation[e]&&(this._nameToUniformLocation[e]=this._context.gl.getUniformLocation(this._glName,e)),this._nameToUniformLocation[e]}hasUniform(e){return null!==this.getUniformLocation(e)}getAttribLocation(e){return this.initialize(),void 0===this._nameToAttribLocation[e]&&(this._nameToAttribLocation[e]=this._context.gl.getAttribLocation(this._glName,e)),this._nameToAttribLocation[e]}setUniform1i(e,t){const r=this._nameToUniform1[e];void 0!==r&&t===r||(this._context.bindProgram(this),this._context.gl.uniform1i(this.getUniformLocation(e),t),this._nameToUniform1[e]=t)}setUniform1iv(e,t){const r=this._nameToUniform1v[e];g(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform1iv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform1v[e]=p._arrayCopy(t):p._arrayAssign(t,r))}setUniform2iv(e,t){const r=this._nameToUniform2[e];g(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform2iv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform2[e]=p._arrayCopy(t):p._arrayAssign(t,r))}setUniform3iv(e,t){const r=this._nameToUniform3[e];g(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform3iv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform3[e]=p._arrayCopy(t):p._arrayAssign(t,r))}setUniform4iv(e,t){const r=this._nameToUniform4[e];g(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform4iv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform4[e]=p._arrayCopy(t):p._arrayAssign(t,r))}setUniform1f(e,t){const r=this._nameToUniform1[e];void 0!==r&&t===r||(this._context.bindProgram(this),this._context.gl.uniform1f(this.getUniformLocation(e),t),this._nameToUniform1[e]=t)}setUniform1fv(e,t){const r=this._nameToUniform1v[e];g(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform1fv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform1v[e]=p._arrayCopy(t):p._arrayAssign(t,r))}setUniform2f(e,t,r){const i=this._nameToUniform2[e];void 0!==i&&t===i[0]&&r===i[1]||(this._context.bindProgram(this),this._context.gl.uniform2f(this.getUniformLocation(e),t,r),void 0===i?this._nameToUniform2[e]=[t,r]:(i[0]=t,i[1]=r))}setUniform2fv(e,t){const r=this._nameToUniform2[e];g(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform2fv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform2[e]=p._arrayCopy(t):p._arrayAssign(t,r))}setUniform3f(e,t,r,i){const n=this._nameToUniform3[e];void 0!==n&&t===n[0]&&r===n[1]&&i===n[2]||(this._context.bindProgram(this),this._context.gl.uniform3f(this.getUniformLocation(e),t,r,i),void 0===n?this._nameToUniform3[e]=[t,r,i]:(n[0]=t,n[1]=r,n[2]=i))}setUniform3fv(e,t){const r=this._nameToUniform3[e];g(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform3fv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform3[e]=p._arrayCopy(t):p._arrayAssign(t,r))}setUniform4f(e,t,r,i,n){const o=this._nameToUniform4[e];void 0!==o&&t===o[0]&&r===o[1]&&i===o[2]&&n===o[3]||(this._context.bindProgram(this),this._context.gl.uniform4f(this.getUniformLocation(e),t,r,i,n),void 0===o?this._nameToUniform4[e]=[t,r,i,n]:(o[0]=t,o[1]=r,o[2]=i,o[3]=n))}setUniform4fv(e,t){const r=this._nameToUniform4[e];g(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform4fv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform4[e]=p._arrayCopy(t):p._arrayAssign(t,r))}setUniformMatrix3fv(e,t,r=!1){const n=this._nameToUniformMatrix3[e];(function(e,t){return!!Object(i.h)(e)||(9!==e.length?g(e,t):9!==e.length||e[0]!==t[0]||e[1]!==t[1]||e[2]!==t[2]||e[3]!==t[3]||e[4]!==t[4]||e[5]!==t[5]||e[6]!==t[6]||e[7]!==t[7]||e[8]!==t[8])})(n,t)&&(this._context.bindProgram(this),this._context.gl.uniformMatrix3fv(this.getUniformLocation(e),r,t),void 0===n?this._nameToUniformMatrix3[e]=p._arrayCopy(t):p._arrayAssign(t,n))}setUniformMatrix4fv(e,t,r=!1){const n=this._nameToUniformMatrix4[e];(function(e,t){return!!Object(i.h)(e)||(16!==e.length?g(e,t):16!==e.length||e[0]!==t[0]||e[1]!==t[1]||e[2]!==t[2]||e[3]!==t[3]||e[4]!==t[4]||e[5]!==t[5]||e[6]!==t[6]||e[7]!==t[7]||e[8]!==t[8]||e[9]!==t[9]||e[10]!==t[10]||e[11]!==t[11]||e[12]!==t[12]||e[13]!==t[13]||e[14]!==t[14]||e[15]!==t[15])})(n,t)&&(this._context.bindProgram(this),this._context.gl.uniformMatrix4fv(this.getUniformLocation(e),r,t),void 0===n?this._nameToUniformMatrix4[e]=p._arrayCopy(t):p._arrayAssign(t,n))}assertCompatibleVertexAttributeLocations(e){const t=e.locations===this.locations;return t||console.error("VertexAttributeLocations are incompatible"),t}static _padToThree(e){let t=e.toString();return e<1e3&&(t=("  "+e).slice(-3)),t}_addLineNumbers(e){let t=2;return e.replace(/\n/g,()=>"\n"+p._padToThree(t++)+":")}_loadShader(e){const t=35633===e;let r=t?this._vertexShaderSource:this._fragmentShaderSource,i="";for(const n in this._defines)i+=`#define ${n} ${this._defines[n]}\n`;r=i+r,"webgl2"===this._context.contextVersion&&(r=function(e,t){const r=function(e){return function(e){var t=function(){var e,t,r,i=0,n=0,c=a,l=[],u=[],d=1,h=0,f=0,m=!1,p=!1,g="";return function(e){return u=[],null!==e?v(e.replace?e.replace(/\r\n/g,"\n"):e):(l.length&&b(l.join("")),c=10,b("(eof)"),u)};function b(e){e.length&&u.push({type:s[c],data:e,position:f,line:d,column:h})}function v(o){var s;for(i=0,r=(g+=o).length;e=g[i],i<r;){switch(s=i,c){case 0:i="/"===e&&"*"===t?(l.push(e),b(l.join("")),c=a,i+1):(l.push(e),t=e,i+1);break;case 1:case 2:i="\r"!==e&&"\n"!==e||"\\"===t?(l.push(e),t=e,i+1):(b(l.join("")),c=a,i);break;case 3:i=x();break;case 4:i="."===e||/[eE]/.test(e)?(l.push(e),c=5,t=e,i+1):"x"===e&&1===l.length&&"0"===l[0]?(c=11,l.push(e),t=e,i+1):/[^\d]/.test(e)?(b(l.join("")),c=a,i):(l.push(e),t=e,i+1);break;case 11:i=/[^a-fA-F0-9]/.test(e)?(b(l.join("")),c=a,i):(l.push(e),t=e,i+1);break;case 5:"f"===e&&(l.push(e),t=e,i+=1),i=/[eE]/.test(e)||"-"===e&&/[eE]/.test(t)?(l.push(e),t=e,i+1):/[^\d]/.test(e)?(b(l.join("")),c=a,i):(l.push(e),t=e,i+1);break;case 9999:i=O();break;case 9:i=/[^\s]/g.test(e)?(b(l.join("")),c=a,i):(l.push(e),t=e,i+1);break;case a:l=l.length?[]:l,i="/"===t&&"*"===e?(f=n+i-1,c=0,t=e,i+1):"/"===t&&"/"===e?(f=n+i-1,c=1,t=e,i+1):"#"===e?(c=2,f=n+i,i):/\s/.test(e)?(c=9,f=n+i,i):(m=/\d/.test(e),p=/[^\w_]/.test(e),f=n+i,c=m?4:p?3:9999,i)}if(s!==i)switch(g[s]){case"\n":h=0,++d;break;default:++h}}return n+=i,g=g.slice(i),u}function x(){if("."===t&&/\d/.test(e))return c=5,i;if("/"===t&&"*"===e)return c=0,i;if("/"===t&&"/"===e)return c=1,i;if("."===e&&l.length){for(;_(l););return c=5,i}if(";"===e||")"===e||"("===e){if(l.length)for(;_(l););return b(e),c=a,i+1}var r=2===l.length&&"="!==e;if(/[\w_\d\s]/.test(e)||r){for(;_(l););return c=a,i}return l.push(e),t=e,i+1}function _(e){for(var t,r,i=0;;){if(t=o.c.indexOf(e.slice(0,e.length+i).join("")),r=o.c[t],-1===t){if(i--+e.length>0)continue;r=e.slice(0,1).join("")}return b(r),f+=r.length,(l=l.slice(r.length)).length}}function O(){if(/[^\d\w_]/.test(e)){var r=l.join("");return c=o.b.indexOf(r)>-1?8:o.a.indexOf(r)>-1?7:6,b(l.join("")),c=a,i}return l.push(e),t=e,i+1}}(),r=[];return(r=r.concat(t(e))).concat(t(null))}(e)}(e);if("300 es"===function(e,t="100",r="300 es"){const i=/^\s*\#version\s+([0-9]+(\s+[a-zA-Z]+)?)\s*/;for(const n of e)if("preprocessor"===n.type){const e=i.exec(n.data);if(e){const i=e[1].replace(/\s\s+/g," ");if(i===r)return i;if(i===t)return n.data="#version "+r,t;throw new Error("unknown glsl version: "+i)}}return e.splice(0,0,{type:"preprocessor",data:"#version "+r},{type:"whitespace",data:"\n"}),null}(r,"100","300 es"))throw new Error("shader is already glsl 300 es");let i=null,d=null;const p={},g={};for(let o=0;o<r.length;++o){const e=r[o];switch(e.type){case"keyword":"vertex"===t&&"attribute"===e.data?e.data="in":"varying"===e.data&&(e.data="vertex"===t?"out":"in");break;case"builtin":if(/^texture(2D|Cube)(Proj)?(Lod|Grad)?(EXT)?$/.test(e.data.trim())&&(e.data=e.data.replace(/(2D|Cube|EXT)/g,"")),"fragment"===t&&"gl_FragColor"===e.data&&(i||(i=u(r,p,"fragColor"),h(r,i,"vec4")),e.data=i),"fragment"===t&&"gl_FragData"===e.data){const t=m(r,o+1),i=u(r,p,"fragData");f(r,i,"vec4",t,"mediump"),e.data=i}else"fragment"===t&&"gl_FragDepthEXT"===e.data&&(d||(d=u(r,p,"gl_FragDepth")),e.data=d);break;case"ident":if(n.indexOf(e.data)>=0){if("vertex"===t&&l(r,o))throw new Error("attribute in vertex shader uses a name that is a reserved word in glsl 300 es");e.data in g||(g[e.data]=u(r,p,e.data)),e.data=g[e.data]}}}for(let n=r.length-1;n>=0;--n){const e=r[n];if("preprocessor"===e.type){const t=e.data.match(/\#extension\s+(.*)\:/);if(t&&t[1]&&c.indexOf(t[1].trim())>=0){const e=r[n+1];r.splice(n,e&&"whitespace"===e.type?2:1)}const i=e.data.match(/\#ifdef\s+(.*)/);i&&i[1]&&c.indexOf(i[1].trim())>=0&&(e.data="#if 1");const o=e.data.match(/\#ifndef\s+(.*)/);o&&o[1]&&c.indexOf(o[1].trim())>=0&&(e.data="#if 0")}}return r.map(e=>"eof"!==e.type?e.data:"").join("")}(r,t?"vertex":"fragment"));const d=this._context.gl,p=d.createShader(e);return d.shaderSource(p,r),d.compileShader(p),p}static _arrayCopy(e){const t=[];for(let r=0;r<e.length;++r)t.push(e[r]);return t}static _arrayAssign(e,t){for(let r=0;r<e.length;++r)t[r]=e[r]}}function g(e,t){if(Object(i.h)(e)||e.length!==t.length)return!0;for(let r=0;r<e.length;++r)if(e[r]!==t[r])return!0;return!1}t.a=p},kbDN:function(e,t,r){"use strict";t.a=class{constructor(e,t){this._context=e,this._desc=t,this._context.instanceCounter.increment(5,this);const r=this._context.gl;this.glName=r.createRenderbuffer(),this._context.bindRenderbuffer(this),r.renderbufferStorage(r.RENDERBUFFER,t.internalFormat,t.width,t.height)}get descriptor(){return this._desc}resize(e,t){const r=this._desc;if(r.width===e&&r.height===t)return;r.width=e,r.height=t;const i=this._context.gl;this._context.bindRenderbuffer(this),i.renderbufferStorage(i.RENDERBUFFER,r.internalFormat,r.width,r.height)}dispose(){this._context&&(this._context.gl.deleteRenderbuffer(this.glName),this._context.instanceCounter.decrement(5,this),this._context=null)}}},lKY1:function(e,t,r){"use strict";r.r(t),r.d(t,"fetch",function(){return eo}),r.d(t,"gltfToEngineResources",function(){return io}),r.d(t,"parseUrl",function(){return ro});var i=r("HaE+"),n=r("srIe"),o=r("Cy1f"),a=r("5DEt"),s=r("15Hh"),c=r("SbiP"),l=r("2uVf"),u=r("r+FG"),d=r("HJJS"),h=r("VeZB"),f=r("6S2I");const m=f.a.getLogger("esri.views.3d.support.buffer.math");function p(e,t,r){if(e.count!==t.count)return void m.error("source and destination buffers need to have the same number of elements");const i=e.count,n=r[0],o=r[1],a=r[2],s=r[4],c=r[5],l=r[6],u=r[8],d=r[9],h=r[10],f=r[12],p=r[13],g=r[14],b=e.typedBuffer,v=e.typedBufferStride,x=t.typedBuffer,_=t.typedBufferStride;for(let m=0;m<i;m++){const e=m*v,t=m*_,r=x[t],i=x[t+1],O=x[t+2];b[e]=n*r+s*i+u*O+f,b[e+1]=o*r+c*i+d*O+p,b[e+2]=a*r+l*i+h*O+g}}function g(e,t,r){if(e.count!==t.count)return void m.error("source and destination buffers need to have the same number of elements");const i=e.count,n=r[0],o=r[1],a=r[2],s=r[3],c=r[4],l=r[5],u=r[6],d=r[7],h=r[8],f=e.typedBuffer,p=e.typedBufferStride,g=t.typedBuffer,b=t.typedBufferStride;for(let m=0;m<i;m++){const e=m*p,t=m*b,r=g[t],i=g[t+1],v=g[t+2];f[e]=n*r+s*i+u*v,f[e+1]=o*r+c*i+d*v,f[e+2]=a*r+l*i+h*v}}function b(e,t,r){const i=Math.min(e.count,t.count),n=e.typedBuffer,o=e.typedBufferStride,a=t.typedBuffer,s=t.typedBufferStride;for(let c=0;c<i;c++){const e=c*o,t=c*s;n[e]=r*a[t],n[e+1]=r*a[t+1],n[e+2]=r*a[t+2]}}Object.freeze({__proto__:null,transformMat4:p,transformMat3:g,scale:b,shiftRight:function(e,t,r){const i=Math.min(e.count,t.count),n=e.typedBuffer,o=e.typedBufferStride,a=t.typedBuffer,s=t.typedBufferStride;for(let c=0;c<i;c++){const e=c*o,t=c*s;n[e]=a[t]>>r,n[e+1]=a[t+1]>>r,n[e+2]=a[t+2]>>r}}});var v=r("QmHG"),x=r("EVMh"),_=r("ikTR");class O{constructor(e,t,r,i){this.primitiveIndices=e,this._numIndexPerPrimitive=t,this.indices=r,this.position=i,this.center=Object(o.e)(),Object(x.a)(e.length>=1),Object(x.a)(r.length%this._numIndexPerPrimitive==0),Object(x.a)(r.length>=e.length*this._numIndexPerPrimitive),Object(x.a)(3===i.size||4===i.size);const{data:n,size:s}=i,c=e.length;let l=s*r[this._numIndexPerPrimitive*e[0]];y.clear(),y.push(l),this.bbMin=Object(o.g)(n[l],n[l+1],n[l+2]),this.bbMax=Object(o.d)(this.bbMin);for(let o=0;o<c;++o){const t=this._numIndexPerPrimitive*e[o];for(let e=0;e<this._numIndexPerPrimitive;++e){l=s*r[t+e],y.push(l);let i=n[l];this.bbMin[0]=Math.min(i,this.bbMin[0]),this.bbMax[0]=Math.max(i,this.bbMax[0]),i=n[l+1],this.bbMin[1]=Math.min(i,this.bbMin[1]),this.bbMax[1]=Math.max(i,this.bbMax[1]),i=n[l+2],this.bbMin[2]=Math.min(i,this.bbMin[2]),this.bbMax[2]=Math.max(i,this.bbMax[2])}}Object(a.f)(this.center,this.bbMin,this.bbMax,.5),this.radius=.5*Math.max(Math.max(this.bbMax[0]-this.bbMin[0],this.bbMax[1]-this.bbMin[1]),this.bbMax[2]-this.bbMin[2]);let u=this.radius*this.radius;for(let o=0;o<y.length;++o){l=y.getItemAt(o);const e=n[l]-this.center[0],t=n[l+1]-this.center[1],r=n[l+2]-this.center[2],i=e*e+t*t+r*r;if(i<=u)continue;const a=Math.sqrt(i),s=.5*(a-this.radius);this.radius=this.radius+s,u=this.radius*this.radius;const c=s/a;this.center[0]+=e*c,this.center[1]+=t*c,this.center[2]+=r*c}y.clear()}getCenter(){return this.center}getBSRadius(){return this.radius}getBBMin(){return this.bbMin}getBBMax(){return this.bbMax}getChildren(){if(this._children)return this._children;if(Object(a.i)(this.bbMin,this.bbMax)>1){const e=Object(a.f)(Object(o.e)(),this.bbMin,this.bbMax,.5),t=this.primitiveIndices.length,r=new Uint8Array(t),i=new Array(8);for(let o=0;o<8;++o)i[o]=0;const{data:n,size:s}=this.position;for(let o=0;o<t;++o){let t=0;const a=this._numIndexPerPrimitive*this.primitiveIndices[o];let c=s*this.indices[a],l=n[c],u=n[c+1],d=n[c+2];for(let e=1;e<this._numIndexPerPrimitive;++e){c=s*this.indices[a+e];const t=n[c],r=n[c+1],i=n[c+2];t<l&&(l=t),r<u&&(u=r),i<d&&(d=i)}l<e[0]&&(t|=1),u<e[1]&&(t|=2),d<e[2]&&(t|=4),r[o]=t,++i[t]}let c=0;for(let o=0;o<8;++o)i[o]>0&&++c;if(c<2)return;const l=new Array(8);for(let o=0;o<8;++o)l[o]=i[o]>0?new Uint32Array(i[o]):void 0;for(let o=0;o<8;++o)i[o]=0;for(let o=0;o<t;++o){const e=r[o];l[e][i[e]++]=this.primitiveIndices[o]}this._children=new Array(8);for(let o=0;o<8;++o)void 0!==l[o]&&(this._children[o]=new O(l[o],this._numIndexPerPrimitive,this.indices,this.position))}return this._children}static prune(){y.prune()}}const y=new _.a({deallocator:null});var T=r("8uAX");class w{constructor(){this.id=Object(T.a)()}unload(){}}var S=r("KrcW");class j{constructor(e){this.allocator=e,this.items=[],this.itemsPtr=0,this.tickHandle=S.a.before(()=>this.reset()),this.grow()}destroy(){this.tickHandle&&(this.tickHandle.remove(),this.tickHandle=Object(n.m)(this.tickHandle)),this.items=Object(n.m)(this.items)}get(){return 0===this.itemsPtr&&Object(S.a)(()=>{}),this.itemsPtr===this.items.length&&this.grow(),this.items[this.itemsPtr++]}reset(){const e=Math.min(3*Math.max(8,this.itemsPtr),this.itemsPtr+3*M);this.items.length=Math.min(e,this.items.length),this.itemsPtr=0}grow(){for(let e=0;e<Math.max(8,Math.min(this.items.length,M));e++)this.items.push(this.allocator())}}const M=1024;var A=r("M0lq"),C=r("sTkM"),P=r("AvGH"),E=r("D8Ta");class I{constructor(e,t,r){this.itemByteSize=e,this.itemCreate=t,this.buffers=[],this.items=[],this.itemsPerBuffer=0,this.itemsPtr=0,this.itemsPerBuffer=Math.ceil(r/this.itemByteSize),this.tickHandle=S.a.before(()=>this.reset())}destroy(){this.tickHandle&&(this.tickHandle.remove(),this.tickHandle=Object(n.m)(this.tickHandle)),this.itemsPtr=0,this.items=Object(n.m)(this.items),this.buffers=Object(n.m)(this.buffers)}get(){0===this.itemsPtr&&Object(S.a)(()=>{});const e=Math.floor(this.itemsPtr/this.itemsPerBuffer);for(;this.buffers.length<=e;){const e=new ArrayBuffer(this.itemsPerBuffer*this.itemByteSize);for(let t=0;t<this.itemsPerBuffer;++t)this.items.push(this.itemCreate(e,t*this.itemByteSize));this.buffers.push(e)}return this.items[this.itemsPtr++]}reset(){const e=2*(Math.floor(this.itemsPtr/this.itemsPerBuffer)+1);for(;this.buffers.length>e;)this.buffers.pop(),this.items.length=this.buffers.length*this.itemsPerBuffer;this.itemsPtr=0}static createVec2f64(e=F){return new I(16,P.b,e)}static createVec3f64(e=F){return new I(24,o.c,e)}static createVec4f64(e=F){return new I(32,E.c,e)}static createMat3f64(e=F){return new I(72,l.b,e)}static createMat4f64(e=F){return new I(128,u.d,e)}static createQuatf64(e=F){return new I(32,C.b,e)}get test(){return{size:this.buffers.length*this.itemsPerBuffer*this.itemByteSize}}}const F=4096,D=(I.createVec2f64(),I.createVec3f64()),R=I.createVec4f64(),L=(I.createMat3f64(),I.createMat4f64());I.createQuatf64();var B=r("OKTS");function N(e){return e?{origin:Object(o.d)(e.origin),vector:Object(o.d)(e.vector)}:{origin:Object(o.e)(),vector:Object(o.e)()}}function z(e,t){const r=W.get();return r.origin=e,r.vector=t,r}function U(e,t,r=N()){return Object(a.h)(r.origin,e),Object(a.h)(r.vector,t),r}function V(e,t){const r=Object(a.g)(D.get(),t,e.origin),i=Object(a.e)(e.vector,r),n=Object(a.e)(e.vector,e.vector),o=Object(B.c)(i/n,0,1),s=Object(a.g)(D.get(),Object(a.b)(D.get(),e.vector,o),r);return Object(a.e)(s,s)}function H(e,t,r,i,n){const{vector:o,origin:s}=e,c=Object(a.g)(D.get(),t,s),l=Object(a.e)(o,c)/Object(a.p)(o);return Object(a.b)(n,o,Object(B.c)(l,r,i)),Object(a.c)(n,n,e.origin)}function k(e,t,r,i){const n=1e-6,o=e.origin,s=Object(a.c)(D.get(),o,e.vector),c=t.origin,l=Object(a.c)(D.get(),c,t.vector),u=D.get(),d=D.get();if(u[0]=o[0]-c[0],u[1]=o[1]-c[1],u[2]=o[2]-c[2],d[0]=l[0]-c[0],d[1]=l[1]-c[1],d[2]=l[2]-c[2],Math.abs(d[0])<n&&Math.abs(d[1])<n&&Math.abs(d[2])<n)return!1;const h=D.get();if(h[0]=s[0]-o[0],h[1]=s[1]-o[1],h[2]=s[2]-o[2],Math.abs(h[0])<n&&Math.abs(h[1])<n&&Math.abs(h[2])<n)return!1;const f=u[0]*d[0]+u[1]*d[1]+u[2]*d[2],m=d[0]*h[0]+d[1]*h[1]+d[2]*h[2],p=u[0]*h[0]+u[1]*h[1]+u[2]*h[2],g=d[0]*d[0]+d[1]*d[1]+d[2]*d[2],b=(h[0]*h[0]+h[1]*h[1]+h[2]*h[2])*g-m*m;if(Math.abs(b)<n)return!1;let v=(f*m-p*g)/b,x=(f+m*v)/g;r&&(v=Object(B.c)(v,0,1),x=Object(B.c)(x,0,1));const _=D.get(),O=D.get();return _[0]=o[0]+v*h[0],_[1]=o[1]+v*h[1],_[2]=o[2]+v*h[2],O[0]=c[0]+x*d[0],O[1]=c[1]+x*d[1],O[2]=c[2]+x*d[2],i.tA=v,i.tB=x,i.pA=_,i.pB=O,i.distance2=Object(a.i)(_,O),!0}const G={tA:0,tB:0,pA:Object(o.e)(),pB:Object(o.e)(),distance2:0},W=new j(()=>({origin:null,vector:null}));function q(e){return e?{p0:Object(o.d)(e.p0),p1:Object(o.d)(e.p1),p2:Object(o.d)(e.p2)}:{p0:Object(o.e)(),p1:Object(o.e)(),p2:Object(o.e)()}}function $(e,t,r,i=q()){return Object(a.h)(i.p0,e),Object(a.h)(i.p1,t),Object(a.h)(i.p2,r),i}function X(e,t,r){const i=Object(A.i)(e,t),n=Object(A.i)(t,r),o=Object(A.i)(r,e),a=(i+n+o)/2,s=a*(a-i)*(a-n)*(a-o);return s<=0?0:Math.sqrt(s)}function Y(e,t,r){return Object(a.g)(Q,t,e),Object(a.g)(Z,r,e),Object(a.m)(Object(a.d)(Q,Q,Z))/2}Object.freeze({__proto__:null,create:N,wrap:z,copy:function(e,t=N()){return U(e.origin,e.vector,t)},fromValues:U,fromPoints:function(e,t,r=N()){return Object(a.h)(r.origin,e),Object(a.g)(r.vector,t,e),r},distance2:V,distance:function(e,t){return Math.sqrt(V(e,t))},projectPoint:function(e,t,r){return H(e,t,0,1,r)},pointAt:function(e,t,r){return Object(a.c)(r,e.origin,Object(a.b)(r,e.vector,t))},projectPointClamp:H,closestRayDistance2:function(e,t){if(k(e,z(t.origin,t.direction),!1,G)){const{tA:t,pB:r,distance2:i}=G;if(t>=0&&t<=1)return i;if(t<0)return Object(a.i)(e.origin,r);if(t>1)return Object(a.i)(Object(a.c)(D.get(),e.origin,e.vector),r)}return null},closestLineSegmentPoint:function(e,t,r){return!!k(e,t,!0,G)&&(Object(a.h)(r,G.pA),!0)},closestLineSegmentDistance2:function(e,t){return k(e,t,!0,G)?G.distance2:null}});const K=new j(N),J=new j(()=>({p0:null,p1:null,p2:null})),Q=Object(o.e)(),Z=Object(o.e)();Object.freeze({__proto__:null,create:q,wrap:function(e,t,r){const i=J.get();return i.p0=e,i.p1=t,i.p2=r,i},copy:function(e,t=q()){return $(e.p0,e.p1,e.p2,t)},fromValues:$,distance2:function(e,t){const r=e.p0,i=e.p1,n=e.p2,o=Object(a.g)(D.get(),i,r),s=Object(a.g)(D.get(),n,i),c=Object(a.g)(D.get(),r,n),l=Object(a.g)(D.get(),t,r),u=Object(a.g)(D.get(),t,i),d=Object(a.g)(D.get(),t,n),h=Object(a.d)(o,o,c),f=Object(a.e)(Object(a.d)(D.get(),o,h),l),m=Object(a.e)(Object(a.d)(D.get(),s,h),u),p=Object(a.e)(Object(a.d)(D.get(),c,h),d);if(f>0&&m>0&&p>0){const e=Object(a.e)(h,l);return e*e/Object(a.e)(h,h)}const g=V(U(r,o,K.get()),t),b=V(U(i,s,K.get()),t),v=V(U(n,c,K.get()),t);return Math.min(g,b,v)},intersectRay:function(e,t,r){const i=1e-5,{direction:n,origin:o}=t,{p0:s,p1:c,p2:l}=e,u=c[0]-s[0],d=c[1]-s[1],h=c[2]-s[2],f=l[0]-s[0],m=l[1]-s[1],p=l[2]-s[2],g=n[1]*p-m*n[2],b=n[2]*f-p*n[0],v=n[0]*m-f*n[1],x=u*g+d*b+h*v;if(x>-i&&x<i)return!1;const _=1/x,O=o[0]-s[0],y=o[1]-s[1],T=o[2]-s[2],w=_*(O*g+y*b+T*v);if(w<0||w>1)return!1;const S=y*h-d*T,j=T*u-h*O,M=O*d-u*y,A=_*(n[0]*S+n[1]*j+n[2]*M);return!(A<0||w+A>1||(r&&(Object(a.b)(r,n,_*(f*S+m*j+p*M)),Object(a.c)(r,o,r)),0))},areaPoints2d:X,area2d:function(e){return X(e.p0,e.p1,e.p2)},areaPoints3d:Y});let ee=(()=>{const e=new Uint32Array(131072);for(let t=0;t<e.length;++t)e[t]=t;return e})();const te=new Uint16Array([0]),re=(()=>{const e=new Uint16Array(65536);for(let t=0;t<e.length;++t)e[t]=t;return e})();function ie(e){if(1===e)return te;if(e<re.length)return new Uint16Array(re.buffer,0,e);if(e>ee.length){const t=Math.max(2*ee.length,e);ee=new Uint32Array(t);for(let e=0;e<ee.length;e++)ee[e]=e}return new Uint32Array(ee.buffer,0,e)}const ne=Object(o.e)(),oe=Object(o.e)(),ae=Object(o.e)(),se=Object(o.e)();class ce extends w{constructor(e,t=[],r=0,i=-1){super(),this._primitiveType=r,this.edgeIndicesLength=i,this.type=2,this._vertexAttributes=new Map,this._indices=new Map,this._boundingInfo=null;for(const[n,o]of e)o&&this._vertexAttributes.set(n,{...o});if(null==t||0===t.length){const e=function(e){const t=e.values().next().value;return null==t?0:t.data.length/t.size}(this._vertexAttributes),t=ie(e);this.edgeIndicesLength=this.edgeIndicesLength<0?e:this.edgeIndicesLength;for(const r of this._vertexAttributes.keys())this._indices.set(r,t)}else for(const[n,o]of t)o&&(this._indices.set(n,le(o)),"position"===n&&(this.edgeIndicesLength=this.edgeIndicesLength<0?this._indices.get(n).length:this.edgeIndicesLength))}get vertexAttributes(){return this._vertexAttributes}getMutableAttribute(e){const t=this._vertexAttributes.get(e);return t&&!t.exclusive&&(t.data=Array.from(t.data),t.exclusive=!0),t}get indices(){return this._indices}get indexCount(){const e=this._indices.values().next().value;return e?e.length:0}get primitiveType(){return this._primitiveType}get faceCount(){return this.indexCount/3}get boundingInfo(){return Object(n.h)(this._boundingInfo)&&(this._boundingInfo=this._calculateBoundingInfo()),this._boundingInfo}computeAttachmentOrigin(e){return 0===this.primitiveType?this.computeAttachmentOriginTriangles(e):this.computeAttachmentOriginPoints(e)}computeAttachmentOriginTriangles(e){const t=this.indices.get("position");return function(e,t,r){if(!e)return!1;const{size:i,data:n}=e;Object(a.r)(r,0,0,0),Object(a.r)(se,0,0,0);let o=0,s=0;for(let c=0;c<t.length-2;c+=3){const e=t[c+0]*i,l=t[c+1]*i,u=t[c+2]*i;Object(a.r)(ne,n[e+0],n[e+1],n[e+2]),Object(a.r)(oe,n[l+0],n[l+1],n[l+2]),Object(a.r)(ae,n[u+0],n[u+1],n[u+2]);const d=Y(ne,oe,ae);d?(Object(a.c)(ne,ne,oe),Object(a.c)(ne,ne,ae),Object(a.b)(ne,ne,1/3*d),Object(a.c)(r,r,ne),o+=d):(Object(a.c)(se,se,ne),Object(a.c)(se,se,oe),Object(a.c)(se,se,ae),s+=3)}return!(0===s&&0===o||(0!==o?(Object(a.b)(r,r,1/o),0):0===s||(Object(a.b)(r,se,1/s),0)))}(this.vertexAttributes.get("position"),t,e)}computeAttachmentOriginPoints(e){const t=this.indices.get("position");return function(e,t,r){if(!e||!t)return!1;const{size:i,data:n}=e;Object(a.r)(r,0,0,0);let o=-1,s=0;for(let a=0;a<t.length;a++){const e=t[a]*i;o!==e&&(r[0]+=n[e+0],r[1]+=n[e+1],r[2]+=n[e+2],s++),o=e}return s>1&&Object(a.b)(r,r,1/s),s>0}(this.vertexAttributes.get("position"),t,e)}invalidateBoundingInfo(){this._boundingInfo=null}_calculateBoundingInfo(){const e=this.indices.get("position");if(0===e.length)return null;const t=0===this.primitiveType?3:1;Object(x.a)(e.length%t==0,"Indexing error: "+e.length+" not divisible by "+t);const r=ie(e.length/t),i=this.vertexAttributes.get("position");return new O(r,t,e,i)}}function le(e){if(e.BYTES_PER_ELEMENT===Uint16Array.BYTES_PER_ELEMENT)return e;for(const t of e)if(t>=65536)return e;return new Uint16Array(e)}var ue=r("/ADo"),de=r("dXfX"),he=r("BPBZ"),fe=r("R/jG"),me=(r("wSAH"),r("aAs6"));function pe(e,t){return Object(a.e)(e,t)/Object(a.m)(e)}function ge(e,t){const r=Object(a.e)(e,t)/(Object(a.m)(e)*Object(a.m)(t));return-Object(B.a)(r)}const be=Object(o.e)(),ve=Object(o.e)();Object.freeze({__proto__:null,projectPoint:function(e,t,r){const i=Object(a.e)(e,t)/Object(a.e)(e,e);return Object(a.b)(r,e,i)},projectPointSignedLength:pe,angle:ge,angleAroundAxis:function(e,t,r){Object(a.o)(be,e),Object(a.o)(ve,t);const i=Object(a.e)(be,ve),n=Object(B.a)(i),o=Object(a.d)(be,be,ve);return Object(a.e)(o,r)<0?2*Math.PI-n:n}});var xe=r("qRWG");function _e(e){return e?{origin:Object(o.d)(e.origin),direction:Object(o.d)(e.direction)}:{origin:Object(o.e)(),direction:Object(o.e)()}}function Oe(e,t=_e()){return ye(e.origin,e.direction,t)}function ye(e,t,r=_e()){return Object(a.h)(r.origin,e),Object(a.h)(r.direction,t),r}function Te(e,t,r=_e()){const i=Object(xe.a)(Object(A.c)(D.get(),t));if(i[2]=0,!e.unprojectFromRenderScreen(i,r.origin))return null;const o=Object(xe.a)(Object(A.c)(D.get(),t));o[2]=1;const s=e.unprojectFromRenderScreen(o,D.get());return Object(n.h)(s)?null:(Object(a.g)(r.direction,s,r.origin),r)}function we(e,t,r=_e()){return Se(e,e.screenToRender(t,Object(xe.a)(D.get())),r)}function Se(e,t,r=_e()){Object(a.h)(r.origin,e.eye);const i=Object(a.r)(D.get(),t[0],t[1],1),o=e.unprojectFromRenderScreen(i,D.get());return Object(n.h)(o)?null:(Object(a.g)(r.direction,o,r.origin),r)}function je(e,t){const r=Object(a.d)(D.get(),Object(a.o)(D.get(),e.direction),Object(a.g)(D.get(),t,e.origin));return Object(a.e)(r,r)}function Me(e,t,r){const i=Object(a.e)(e.direction,Object(a.g)(r,t,e.origin));return Object(a.c)(r,e.origin,Object(a.b)(r,e.direction,i)),r}function Ae(){return{origin:null,direction:null}}const Ce=new j(Ae);Object.freeze({__proto__:null,create:_e,wrap:function(e,t){const r=Ce.get();return r.origin=e,r.direction=t,r},copy:Oe,fromPoints:function(e,t,r=_e()){return Object(a.h)(r.origin,e),Object(a.g)(r.direction,t,e),r},fromValues:ye,fromScreen:function(e,t,r=_e()){return Te(e,e.screenToRender(t,Object(xe.a)(D.get())),r)},fromRender:Te,fromScreenAtEye:we,fromRenderAtEye:Se,distance2:je,distance:function(e,t){return Math.sqrt(je(e,t))},closestPoint:Me,createWrapper:Ae});const Pe=f.a.getLogger("esri.views.3d.support.geometryUtils.sphere");function Ee(){return Object(E.a)()}function Ie(e,t=Ee()){return Object(de.c)(t,e)}function Fe(e){return Array.isArray(e)?e[3]:e}function De(e){return Array.isArray(e)?e:ke}function Re(e,t,r){if(Object(n.h)(t))return!1;const i=Object(a.g)(D.get(),t.origin,De(e)),o=Object(a.e)(t.direction,t.direction),s=2*Object(a.e)(t.direction,i),c=s*s-4*o*(Object(a.e)(i,i)-e[3]*e[3]);if(c<0)return!1;const l=Math.sqrt(c);let u=(-s-l)/(2*o);const d=(-s+l)/(2*o);return(u<0||d<u&&d>0)&&(u=d),!(u<0||(r&&Object(a.c)(r,t.origin,Object(a.b)(D.get(),t.direction,u)),0))}function Le(e,t,r){const i=D.get(),n=L.get();Object(a.d)(i,t.origin,t.direction);const o=Fe(e);Object(a.d)(r,i,t.origin),Object(a.b)(r,r,1/Object(a.m)(r)*o);const c=Ne(e,t.origin),l=ge(t.origin,r);return Object(s.e)(n),Object(s.h)(n,n,l+c,i),Object(a.j)(r,r,n),r}function Be(e,t,r){const i=Object(a.g)(D.get(),t,De(e)),n=Object(a.b)(D.get(),i,e[3]/Object(a.m)(i));return Object(a.c)(r,n,De(e))}function Ne(e,t){const r=Object(a.g)(D.get(),t,De(e)),i=Object(a.m)(r),n=Fe(e),o=n+Math.abs(n-i);return Object(B.a)(n/o)}const ze=Object(o.e)();function Ue(e,t,r,i){const n=Object(a.g)(ze,t,De(e));switch(r){case 0:{const e=Object(me.a)(n,ze)[2];return Object(a.r)(i,-Math.sin(e),Math.cos(e),0)}case 1:{const e=Object(me.a)(n,ze),t=e[1],r=e[2],o=Math.sin(t);return Object(a.r)(i,-o*Math.cos(r),-o*Math.sin(r),Math.cos(t))}case 2:return Object(a.o)(i,n);default:return}}function Ve(e,t){const r=Object(a.g)(Ge,t,De(e));return Object(a.m)(r)-e[3]}const He=_e(),ke=Object(o.e)(),Ge=Object(o.e)();function We(e=vt){return[e[0],e[1],e[2],e[3]]}function qe(e,t,r,i){return Xe(e,t,r,i,R.get())}function $e(e,t=We()){return Xe(e[0],e[1],e[2],e[3],t)}function Xe(e,t,r,i,n=We()){return n[0]=e,n[1]=t,n[2]=r,n[3]=i,n}function Ye(e,t,r=We()){Object(a.h)(r,t);const i=Object(a.e)(t,t);return Math.abs(i-1)>1e-5&&i>1e-12&&Object(a.b)(r,r,1/Math.sqrt(i)),nt(r,e,r),r}function Ke(e,t,r,i=We()){return ot(Object(a.g)(D.get(),e,t),Object(a.g)(D.get(),r,t),e,i)}function Je(e,t,r,i,n){if(e.count<3)return!1;e.getVec(r,Ze);let o=i,s=!1;for(;o<e.count-1&&!s;)e.getVec(o,et),o++,s=!Object(a.n)(Ze,et);if(!s)return!1;for(o=Math.max(o,n),s=!1;o<e.count&&!s;)e.getVec(o,tt),o++,Object(a.g)(rt,Ze,et),Object(a.o)(rt,rt),Object(a.g)(it,et,tt),Object(a.o)(it,it),s=!Object(a.n)(Ze,tt)&&!Object(a.n)(et,tt)&&Math.abs(Object(a.e)(rt,it))<Qe;return s?(Ke(Ze,et,tt,t),!0):(0!==r||1!==i||2!==n)&&Je(e,t,0,1,2)}Object.freeze(ke),Object.freeze({__proto__:null,create:Ee,copy:Ie,fromCenterAndRadius:function(e,t){return Object(E.b)(e[0],e[1],e[2],t)},wrap:function(e){return e},clear:function(e){e[0]=e[1]=e[2]=e[3]=0},fromRadius:function(e){return e},getRadius:Fe,getCenter:De,fromValues:function(e,t,r,i){return Object(E.b)(e,t,r,i)},elevate:function(e,t,r){return e!==r&&Object(a.h)(r,e),r[3]=e[3]+t,r},setExtent:function(e,t,r){return Pe.error("sphere.setExtent is not yet supported"),e===r?r:Ie(e,r)},intersectRay:Re,intersectScreen:function(e,t,r,i){return Re(e,we(t,r,He),i)},intersectsRay:function(e,t){return Re(e,t,null)},intersectRayClosestSilhouette:function(e,t,r){if(Re(e,t,r))return r;const i=Le(e,t,D.get());return Object(a.c)(r,t.origin,Object(a.b)(D.get(),t.direction,Object(a.l)(t.origin,i)/Object(a.m)(t.direction))),r},closestPointOnSilhouette:Le,closestPoint:function(e,t,r){return Re(e,t,r)?r:(Me(t,De(e),r),Be(e,r,r))},projectPoint:Be,distanceToSilhouette:function(e,t){const r=Object(a.g)(D.get(),t,De(e)),i=Object(a.p)(r);return Math.sqrt(Math.abs(i-e[3]*e[3]))},angleToSilhouette:Ne,axisAt:Ue,altitudeAt:Ve,setAltitudeAt:function(e,t,r,i){const n=Ve(e,t),o=Ue(e,t,2,Ge),s=Object(a.b)(Ge,o,r-n);return Object(a.c)(i,t,s),i}});const Qe=.99619469809,Ze=Object(o.e)(),et=Object(o.e)(),tt=Object(o.e)(),rt=Object(o.e)(),it=Object(o.e)();function nt(e,t,r){return e!==r&&$e(e,r),r[3]=-Object(a.e)(r,t),r}function ot(e,t,r,i=We()){return Ye(r,Object(a.d)(D.get(),t,e),i)}function at(e,t,r){return!!Object(n.i)(t)&&bt(e,t.origin,t.direction,!0,!1,r)}function st(e,t,r){return bt(e,t.origin,t.vector,!1,!1,r)}function ct(e,t,r){return bt(e,t.origin,t.vector,!1,!0,r)}function lt(e,t){return gt(e,De(t))-t[3]>=0}function ut(e,t){return gt(e,t)>=0}function dt(e,t){return e[0]*(e[0]>0?t[0]:t[3])+e[1]*(e[1]>0?t[1]:t[4])+e[2]*(e[2]>0?t[2]:t[5])+e[3]>=0}function ht(e,t){const r=Object(a.e)(e,t.ray.direction),i=-gt(e,t.ray.origin);if(i<0&&r>=0)return!1;if(r>-1e-6&&r<1e-6)return i>0;if((i<0||r<0)&&!(i<0&&r<0))return!0;const n=i/r;return r>0?n<t.c1&&(t.c1=n):n>t.c0&&(t.c0=n),t.c0<=t.c1}function ft(e,t){const r=Object(a.e)(e,t.ray.direction),i=-gt(e,t.ray.origin);if(r>-1e-6&&r<1e-6)return i>0;const n=i/r;return r>0?n<t.c1&&(t.c1=n):n>t.c0&&(t.c0=n),t.c0<=t.c1}function mt(e,t,r){const i=Object(a.b)(D.get(),e,-e[3]),n=pt(e,Object(a.g)(D.get(),t,i),D.get());return Object(a.c)(r,n,i),r}function pt(e,t,r){const i=Object(a.b)(D.get(),e,Object(a.e)(e,t));return Object(a.g)(r,t,i),r}function gt(e,t){return Object(a.e)(e,t)+e[3]}function bt(e,t,r,i,n,o){const s=Object(a.e)(e,r);if(0===s)return!1;let c=-(Object(a.e)(e,t)+e[3])/s;return n&&(c=i?Math.max(0,c):Object(B.c)(c,0,1)),!(c<0||!i&&c>1||(Object(a.c)(o,t,Object(a.b)(o,r,c)),0))}const vt=[0,0,1,0];Object.freeze({__proto__:null,create:We,wrap:qe,copy:$e,fromValues:Xe,fromNormalAndOffset:function(e,t,r=We()){return Object(a.h)(r,e),r[3]=t,r},fromPositionAndNormal:Ye,fromPoints:Ke,fromManyPoints:function(e,t){return Je(e,t,0,1,2)},fromManyPointsSampleAt:Je,setOffsetFromPoint:nt,negate:function(e,t){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t},fromVectorsAndPoint:ot,intersectRay:at,intersectLineSegment:st,intersectLineSegmentClamp:ct,isSphereFullyInside:lt,isSphereFullyOutside:function(e,t){return gt(e,De(t))+t[3]<0},isPointInside:ut,isPointOutside:function(e,t){return gt(e,t)<0},isAABBFullyInside:dt,clip:ht,clipInfinite:ft,projectPoint:mt,projectVector:pt,distance:function(e,t){return Math.abs(gt(e,t))},signedDistance:gt,normal:function(e){return e},UP:vt});const xt=f.a.getLogger("esri.views.3d.support.geometryUtils.boundedPlane");function _t(e=Nt){return{plane:We(e.plane),origin:Object(o.d)(e.origin),basis1:Object(o.d)(e.basis1),basis2:Object(o.d)(e.basis2)}}function Ot(e,t=_t()){return yt(e.origin,e.basis1,e.basis2,t)}function yt(e,t,r,i=_t()){return Object(a.h)(i.origin,e),Object(a.h)(i.basis1,t),Object(a.h)(i.basis2,r),Tt(i),function(e,t){Math.abs(Object(a.e)(e.basis1,e.basis2)/(Object(a.m)(e.basis1)*Object(a.m)(e.basis2)))>1e-6&&xt.warn(t,"Provided basis vectors are not perpendicular"),Math.abs(Object(a.e)(e.basis1,Ft(e)))>1e-6&&xt.warn(t,"Basis vectors and plane normal are not perpendicular"),Math.abs(-Object(a.e)(Ft(e),e.origin)-e.plane[3])>1e-6&&xt.warn(t,"Plane offset is not consistent with plane origin")}(i,"fromValues()"),i}function Tt(e){ot(e.basis2,e.basis1,e.origin,e.plane)}function wt(e,t,r){e!==r&&Ot(e,r);const i=Object(a.b)(D.get(),Ft(e),t);return Object(a.c)(r.origin,r.origin,i),r.plane[3]-=t,r}function St(e,t=_t()){const r=(e[2]-e[0])/2,i=(e[3]-e[1])/2;return Object(a.r)(t.origin,e[0]+r,e[1]+i,0),Object(a.r)(t.basis1,r,0,0),Object(a.r)(t.basis2,0,i,0),Xe(0,0,1,0,t.plane),t}function jt(e,t,r){return!!at(e.plane,t,r)&&Dt(e,r)}function Mt(e,t,r){const i=zt.get();Bt(e,t,i,zt.get());let n=Number.POSITIVE_INFINITY;for(const o of kt){const s=Lt(e,o,Ut.get()),c=D.get();if(st(i,s,c)){const e=Object(me.c)(D.get(),t.origin,c),i=Math.abs(Object(B.a)(Object(a.e)(t.direction,e)));i<n&&(n=i,Object(a.h)(r,c))}}return n===Number.POSITIVE_INFINITY?At(e,t,r):r}function At(e,t,r){if(jt(e,t,r))return r;const i=zt.get(),n=zt.get();Bt(e,t,i,n);let o=Number.POSITIVE_INFINITY;for(const s of kt){const c=Lt(e,s,Ut.get()),l=D.get();if(ct(i,c,l)){const e=je(t,l);if(!ut(n,l))continue;e<o&&(o=e,Object(a.h)(r,l))}}return Et(e,t.origin)<o&&Ct(e,t.origin,r),r}function Ct(e,t,r){const i=mt(e.plane,t,D.get()),n=H(Rt(e,e.basis1),i,-1,1,D.get()),o=H(Rt(e,e.basis2),i,-1,1,D.get());return Object(a.g)(r,Object(a.c)(D.get(),n,o),e.origin),r}function Pt(e,t,r){const{origin:i,basis1:n,basis2:o}=e,s=Object(a.g)(D.get(),t,i),c=pe(n,s),l=pe(o,s),u=pe(Ft(e),s);return Object(a.r)(r,c,l,u)}function Et(e,t){const r=Pt(e,t,D.get()),{basis1:i,basis2:n}=e,o=Object(a.m)(i),s=Object(a.m)(n),c=Math.max(Math.abs(r[0])-o,0),l=Math.max(Math.abs(r[1])-s,0),u=r[2];return c*c+l*l+u*u}function It(e,t){const r=-e.plane[3];return pe(Ft(e),t)-r}function Ft(e){return e.plane}function Dt(e,t){const r=Object(a.g)(D.get(),t,e.origin),i=Object(a.p)(e.basis1),n=Object(a.p)(e.basis2),o=Object(a.e)(e.basis1,r),s=Object(a.e)(e.basis2,r);return-o-i<0&&o-i<0&&-s-n<0&&s-n<0}function Rt(e,t){const r=Ut.get();return Object(a.h)(r.origin,e.origin),Object(a.h)(r.vector,t),r}function Lt(e,t,r){const{basis1:i,basis2:n,origin:o}=e,s=Object(a.b)(D.get(),i,t.origin[0]),c=Object(a.b)(D.get(),n,t.origin[1]);Object(a.c)(r.origin,s,c),Object(a.c)(r.origin,r.origin,o);const l=Object(a.b)(D.get(),i,t.direction[0]),u=Object(a.b)(D.get(),n,t.direction[1]);return Object(a.b)(r.vector,Object(a.c)(l,l,u),2),r}function Bt(e,t,r,i){const n=Ft(e);ot(n,t.direction,t.origin,r),ot(r,n,t.origin,i)}const Nt={plane:We(),origin:Object(o.g)(0,0,0),basis1:Object(o.g)(1,0,0),basis2:Object(o.g)(0,1,0)},zt=new j(We),Ut=new j(N),Vt=Object(o.e)(),Ht=new j(()=>({origin:null,basis1:null,basis2:null,plane:null})),kt=[{origin:[-1,-1],direction:[1,0]},{origin:[1,-1],direction:[0,1]},{origin:[1,1],direction:[-1,0]},{origin:[-1,1],direction:[0,-1]}],Gt=Object(u.b)(),Wt=Object(u.b)();function qt(e=Xt){return[e[0],e[1],e[2],e[3]]}function $t(e,t,r,i,n=qt()){return n[0]=e,n[1]=t,n[2]=r,n[3]=i,n}Object.freeze({__proto__:null,BoundedPlaneClass:class{constructor(){this.plane=We(),this.origin=Object(o.e)(),this.basis1=Object(o.e)(),this.basis2=Object(o.e)()}},create:_t,wrap:function(e,t,r){const i=Ht.get();return i.origin=e,i.basis1=t,i.basis2=r,i.plane=qe(0,0,0,0),Tt(i),i},copy:Ot,copyWithoutVerify:function(e,t){Object(a.h)(t.origin,e.origin),Object(a.h)(t.basis1,e.basis1),Object(a.h)(t.basis2,e.basis2),$e(e.plane,t.plane)},fromValues:yt,updateUnboundedPlane:Tt,elevate:wt,setExtent:function(e,t,r){return St(t,r),wt(r,It(e,e.origin),r),r},fromAABoundingRect:St,intersectRay:jt,intersectRayClosestSilhouette:function(e,t,r){if(jt(e,t,r))return r;const i=Mt(e,t,D.get());return Object(a.c)(r,t.origin,Object(a.b)(D.get(),t.direction,Object(a.l)(t.origin,i)/Object(a.m)(t.direction))),r},closestPointOnSilhouette:Mt,closestPoint:At,projectPoint:Ct,projectPointLocal:Pt,distance2:Et,distance:function(e,t){return Math.sqrt(Et(e,t))},distanceToSilhouette:function(e,t){let r=Number.NEGATIVE_INFINITY;for(const i of kt){const n=V(Lt(e,i,Ut.get()),t);n>r&&(r=n)}return Math.sqrt(r)},extrusionContainsPoint:function(e,t){return ut(e.plane,t)&&Dt(e,t)},axisAt:function(e,t,r,i){return function(e,t,r){switch(t){case 0:Object(a.h)(r,e.basis1),Object(a.o)(r,r);break;case 1:Object(a.h)(r,e.basis2),Object(a.o)(r,r);break;case 2:Object(a.h)(r,Ft(e))}return r}(e,r,i)},altitudeAt:It,setAltitudeAt:function(e,t,r,i){const n=It(e,t),o=Object(a.b)(Vt,Ft(e),r-n);return Object(a.c)(i,t,o),i},equals:function(e,t){return Object(a.n)(e.basis1,t.basis1)&&Object(a.n)(e.basis2,t.basis2)&&Object(a.n)(e.origin,t.origin)},transform:function(e,t,r){return e!==r&&Ot(e,r),Object(s.a)(Gt,t),Object(s.b)(Gt,Gt),Object(a.j)(r.basis1,e.basis1,Gt),Object(a.j)(r.basis2,e.basis2,Gt),Object(a.j)(r.plane,e.plane,Gt),Object(a.j)(r.origin,e.origin,t),nt(r.plane,r.origin,r.plane),r},rotate:function(e,t,r,i){return e!==i&&Ot(e,i),Object(s.h)(Wt,Object(s.e)(Wt),t,r),Object(a.j)(i.basis1,e.basis1,Wt),Object(a.j)(i.basis2,e.basis2,Wt),Tt(i),i},normal:Ft,UP:Nt});const Xt=[0,0,1,0];function Yt(e){return e?{ray:_e(e.ray),c0:e.c0,c1:e.c1}:{ray:_e(),c0:0,c1:Number.MAX_VALUE}}function Kt(e,t,r,i=Yt()){return Oe(e,i.ray),i.c0=t,i.c1=r,i}function Jt(e,t=Yt()){return Oe(e,t.ray),t.c0=0,t.c1=Number.MAX_VALUE,t}function Qt(e,t,r=Yt()){const i=Object(a.m)(e.vector);return ye(e.origin,t,r.ray),r.c0=0,r.c1=i,r}function Zt(e,t,r){return Object(a.c)(r,e.ray.origin,Object(a.b)(r,e.ray.direction,t))}Object.freeze({__proto__:null,create:qt,wrap:function(e,t,r,i){return $t(e,t,r,i,R.get())},wrapAxisAngle:function(e,t){return $t(e[0],e[1],e[2],t,R.get())},copy:function(e,t=qt()){return $t(e[0],e[1],e[2],e[3],t)},fromValues:$t,fromAxisAndAngle:function(e,t,r=qt()){return Object(a.h)(r,e),r[3]=t,r},fromPoints:function(e,t,r=qt()){return Object(a.d)(r,e,t),Object(a.o)(r,r),r[3]=ge(e,t),r},axis:function(e){return e},UP:Xt});const er=new j(()=>({c0:0,c1:0,ray:null}));function tr(e){return e?[We(e[0]),We(e[1]),We(e[2]),We(e[3]),We(e[4]),We(e[5])]:[We(),We(),We(),We(),We(),We()]}function rr(){return[Object(o.e)(),Object(o.e)(),Object(o.e)(),Object(o.e)(),Object(o.e)(),Object(o.e)(),Object(o.e)(),Object(o.e)()]}function ir(e,t){Ke(t[4],t[0],t[3],e[0]),Ke(t[1],t[5],t[6],e[1]),Ke(t[4],t[5],t[1],e[2]),Ke(t[3],t[2],t[6],e[3]),Ke(t[0],t[1],t[2],e[4]),Ke(t[5],t[4],t[7],e[5])}function nr(e,t){for(let r=0;r<6;r++)if(!ht(e[r],t))return!1;return!0}Object.freeze({__proto__:null,create:Yt,wrap:function(e,t,r){const i=er.get();return i.ray=e,i.c0=t,i.c1=r,i},copy:function(e,t=Yt()){return Kt(e.ray,e.c0,e.c1,t)},fromValues:Kt,fromRay:Jt,fromLineSegment:function(e,t=Yt()){return Qt(e,Object(a.o)(D.get(),e.vector),t)},fromLineSegmentAndDirection:Qt,getStart:function(e,t){return Zt(e,e.c0,t)},getEnd:function(e,t){return Zt(e,e.c1,t)},getAt:Zt});const or=[Object(E.b)(-1,-1,-1,1),Object(E.b)(1,-1,-1,1),Object(E.b)(1,1,-1,1),Object(E.b)(-1,1,-1,1),Object(E.b)(-1,-1,1,1),Object(E.b)(1,-1,1,1),Object(E.b)(1,1,1,1),Object(E.b)(-1,1,1,1)],ar=new j(Yt),sr=rr();Object.freeze({__proto__:null,create:tr,createPoints:rr,copy:function(e,t=tr()){for(let r=0;r<6;r++)$e(e[r],t[r])},fromMatrix:function(e,t,r,i=sr){const n=Object(s.g)(L.get(),t,e);Object(s.a)(n,n);for(let o=0;o<8;++o){const e=Object(de.l)(R.get(),or[o],n);Object(a.r)(i[o],e[0]/e[3],e[1]/e[3],e[2]/e[3])}ir(r,i)},computePlanes:ir,intersectsSphere:function(e,t){for(let r=0;r<6;r++)if(lt(e[r],t))return!1;return!0},intersectsRay:function(e,t){return nr(e,Jt(t,ar.get()))},intersectClipRay:function(e,t){for(let r=0;r<6;r++)if(!ft(e[r],t))return!1;return!0},intersectsLineSegment:function(e,t,r){return nr(e,Qt(t,r,ar.get()))},intersectsPoint:function(e,t){for(let r=0;r<6;r++)if(gt(e[r],t)>0)return!1;return!0},intersectsAABB:function(e,t){for(let r=0;r<6;r++)if(dt(e[r],t))return!1;return!0},planePointIndices:{bottom:[5,1,0,4],near:[0,1,2,3],far:[5,4,7,6],right:[1,5,6,2],left:[4,0,3,7],top:[7,3,2,6]}});var cr=r("7Nfj");class lr{constructor(){this._disposed=!1}get disposed(){return this._disposed}get shaderTransformation(){return this._shaderTransformation}acquire(e,t,r,i,n,o){this.id=Object(T.a)(),this.geometry=e,this.material=t,this.transformation=r,this.instanceParameters=i,this.origin=n,this._shaderTransformation=o,this._disposed=!1}release(){this._disposed=!1}dispose(){this._disposed=!0}getStaticTransformation(){return this.transformation}getShaderTransformation(){return Object(n.i)(this._shaderTransformation)?this._shaderTransformation(this.transformation):this.transformation}computeAttachmentOrigin(e){return!!(this.material.computeAttachmentOrigin?this.material.computeAttachmentOrigin(this.geometry,e):this.geometry.computeAttachmentOrigin(e))&&(Object(a.j)(e,e,this.getStaticTransformation()),!0)}}lr.pool=new cr.a(lr),r("tiP8");const ur=new class{constructor(e=0){this.offset=e,this.sphere=Ee(),this.tmpVertex=Object(o.e)()}applyToVertex(e,t,r){const i=this.objectTransform.transform;let n=i[0]*e+i[4]*t+i[8]*r+i[12],o=i[1]*e+i[5]*t+i[9]*r+i[13],a=i[2]*e+i[6]*t+i[10]*r+i[14];const s=this.offset/Math.sqrt(n*n+o*o+a*a);n+=n*s,o+=o*s,a+=a*s;const c=this.objectTransform.inverse;return this.tmpVertex[0]=c[0]*n+c[4]*o+c[8]*a+c[12],this.tmpVertex[1]=c[1]*n+c[5]*o+c[9]*a+c[13],this.tmpVertex[2]=c[2]*n+c[6]*o+c[10]*a+c[14],this.tmpVertex}applyToMinMax(e,t){const r=this.offset/Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);e[0]+=e[0]*r,e[1]+=e[1]*r,e[2]+=e[2]*r;const i=this.offset/Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);t[0]+=t[0]*i,t[1]+=t[1]*i,t[2]+=t[2]*i}applyToAabb(e){const t=this.offset/Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);e[0]+=e[0]*t,e[1]+=e[1]*t,e[2]+=e[2]*t;const r=this.offset/Math.sqrt(e[3]*e[3]+e[4]*e[4]+e[5]*e[5]);return e[3]+=e[3]*r,e[4]+=e[4]*r,e[5]+=e[5]*r,e}applyToBoundingSphere(e){const t=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]),r=this.offset/t;return this.sphere[0]=e[0]+e[0]*r,this.sphere[1]=e[1]+e[1]*r,this.sphere[2]=e[2]+e[2]*r,this.sphere[3]=e[3]+e[3]*this.offset/t,this.sphere}};new class{constructor(e=0){this.offset=e,this.componentLocalOriginLength=0,this.tmpVertex=Object(o.e)(),this.mbs=Object(E.a)(),this.obb={center:Object(o.e)(),halfSize:Object(fe.a)(),quaternion:null}}set localOrigin(e){this.componentLocalOriginLength=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2])}applyToVertex(e,t,r){const i=e,n=t,o=r+this.componentLocalOriginLength,a=this.offset/Math.sqrt(i*i+n*n+o*o);return this.tmpVertex[0]=e+i*a,this.tmpVertex[1]=t+n*a,this.tmpVertex[2]=r+o*a,this.tmpVertex}applyToAabb(e){const t=e[0],r=e[1],i=e[2]+this.componentLocalOriginLength,n=e[3],o=e[4],a=e[5]+this.componentLocalOriginLength,s=this.offset/Math.sqrt(t*t+r*r+i*i);e[0]+=t*s,e[1]+=r*s,e[2]+=i*s;const c=this.offset/Math.sqrt(n*n+o*o+a*a);return e[3]+=n*c,e[4]+=o*c,e[5]+=a*c,e}applyToMbs(e){const t=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]),r=this.offset/t;return this.mbs[0]=e[0]+e[0]*r,this.mbs[1]=e[1]+e[1]*r,this.mbs[2]=e[2]+e[2]*r,this.mbs[3]=e[3]+e[3]*this.offset/t,this.mbs}applyToObb(e){const t=e.center,r=this.offset/Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);this.obb.center[0]=t[0]+t[0]*r,this.obb.center[1]=t[1]+t[1]*r,this.obb.center[2]=t[2]+t[2]*r,Object(a.q)(this.obb.halfSize,e.halfSize,e.quaternion),Object(a.c)(this.obb.halfSize,this.obb.halfSize,e.center);const i=this.offset/Math.sqrt(this.obb.halfSize[0]*this.obb.halfSize[0]+this.obb.halfSize[1]*this.obb.halfSize[1]+this.obb.halfSize[2]*this.obb.halfSize[2]);return this.obb.halfSize[0]+=this.obb.halfSize[0]*i,this.obb.halfSize[1]+=this.obb.halfSize[1]*i,this.obb.halfSize[2]+=this.obb.halfSize[2]*i,Object(a.g)(this.obb.halfSize,this.obb.halfSize,e.center),Object(he.a)(dr,e.quaternion),Object(a.q)(this.obb.halfSize,this.obb.halfSize,dr),this.obb.halfSize[0]*=this.obb.halfSize[0]<0?-1:1,this.obb.halfSize[1]*=this.obb.halfSize[1]<0?-1:1,this.obb.halfSize[2]*=this.obb.halfSize[2]<0?-1:1,this.obb.quaternion=e.quaternion,this.obb}},new class{constructor(e=0){this.offset=e,this.tmpVertex=Object(o.e)()}applyToVertex(e,t,r){const i=e+this.localOrigin[0],n=t+this.localOrigin[1],o=r+this.localOrigin[2],a=this.offset/Math.sqrt(i*i+n*n+o*o);return this.tmpVertex[0]=e+i*a,this.tmpVertex[1]=t+n*a,this.tmpVertex[2]=r+o*a,this.tmpVertex}applyToAabb(e){const t=e[0]+this.localOrigin[0],r=e[1]+this.localOrigin[1],i=e[2]+this.localOrigin[2],n=e[3]+this.localOrigin[0],o=e[4]+this.localOrigin[1],a=e[5]+this.localOrigin[2],s=this.offset/Math.sqrt(t*t+r*r+i*i);e[0]+=t*s,e[1]+=r*s,e[2]+=i*s;const c=this.offset/Math.sqrt(n*n+o*o+a*a);return e[3]+=n*c,e[4]+=o*c,e[5]+=a*c,e}},Object(o.e)(),Object(o.e)(),Object(E.a)();const dr=Object(C.a)(),hr=e=>class extends e{constructor(){super(...arguments),this._isDisposed=!1}dispose(){for(const t of null!=(e=this._managedDisposables)?e:[]){var e;const r=this[t];this[t]=null,r&&"function"==typeof r.dispose&&r.dispose()}this._isDisposed=!0}get isDisposed(){return this._isDisposed}};class fr extends(hr(class{})){}var mr=class extends fr{constructor(e){super(),this.material=e.material,this.techniqueRep=e.techniqueRep,this.output=e.output}getTechnique(){return this.technique}getPipelineState(e,t){return this.getTechnique().pipeline}ensureResources(e){return 2}ensureParameters(e){}},pr=class extends mr{constructor(e){super(e),this._textureIDs=new Set,this._textureRepository=e.textureRep,this._textureId=e.textureId,this._initTransparent=!!e.initTextureTransparent,this._texture=this._acquireIfNotUndefined(this._textureId),this._textureNormal=this._acquireIfNotUndefined(e.normalTextureId),this._textureEmissive=this._acquireIfNotUndefined(e.emissiveTextureId),this._textureOcclusion=this._acquireIfNotUndefined(e.occlusionTextureId),this._textureMetallicRoughness=this._acquireIfNotUndefined(e.metallicRoughnessTextureId)}dispose(){this._textureIDs.forEach(e=>this._textureRepository.release(e)),this._textureIDs.clear()}updateTexture(e){e!==this._textureId&&(this._releaseIfNotUndefined(this._textureId),this._textureId=e,this._texture=this._acquireIfNotUndefined(this._textureId))}bindTexture(e,t){Object(n.i)(this._texture)&&(t.setUniform1i("tex",0),e.bindTexture(this._texture.glTexture,0)),Object(n.i)(this._textureNormal)&&(t.setUniform1i("normalTexture",1),e.bindTexture(this._textureNormal.glTexture,1)),Object(n.i)(this._textureEmissive)&&(t.setUniform1i("texEmission",2),e.bindTexture(this._textureEmissive.glTexture,2)),Object(n.i)(this._textureOcclusion)&&(t.setUniform1i("texOcclusion",3),e.bindTexture(this._textureOcclusion.glTexture,3)),Object(n.i)(this._textureMetallicRoughness)&&(t.setUniform1i("texMetallicRoughness",4),e.bindTexture(this._textureMetallicRoughness.glTexture,4))}bindTextureScale(e,t){const r=Object(n.i)(this._texture)&&this._texture.glTexture;r&&r.descriptor.textureCoordinateScaleFactor?t.setUniform2fv("textureCoordinateScaleFactor",r.descriptor.textureCoordinateScaleFactor):t.setUniform2f("textureCoordinateScaleFactor",1,1)}_acquireIfNotUndefined(e){if(!Object(n.h)(e))return this._textureIDs.add(e),this._textureRepository.acquire(e,this._initTransparent)}_releaseIfNotUndefined(e){Object(n.h)(e)||(this._textureIDs.delete(e),this._textureRepository.release(e))}},gr=r("fFEv");const br={position:0,normal:1,uv0:2,color:3,size:4,tangent:4,auxpos1:5,symbolColor:5,auxpos2:6,featureAttribute:6,instanceFeatureAttribute:6,instanceColor:7,model:8,modelNormal:12,modelOriginHi:11,modelOriginLo:15};class vr extends w{constructor(e,t){super(),this.type=3,this.supportsEdges=!1,this._visible=!0,this._renderPriority=0,this._insertOrder=0,this._vertexAttributeLocations=br,this._params=Object(gr.c)(e,t),this.validateParameterValues(this._params)}dispose(){}get params(){return this._params}update(e){return!1}setParameterValues(e){Object(gr.e)(this._params,e)&&(this.validateParameterValues(this._params),this.parametersChanged())}validateParameterValues(e){}get visible(){return this._visible}set visible(e){e!==this._visible&&(this._visible=e,this.parametersChanged())}isVisibleInPass(e){return!0}get renderOccluded(){return this.params.renderOccluded}get renderPriority(){return this._renderPriority}set renderPriority(e){e!==this._renderPriority&&(this._renderPriority=e,this.parametersChanged())}get insertOrder(){return this._insertOrder}set insertOrder(e){e!==this._insertOrder&&(this._insertOrder=e,this.parametersChanged())}get vertexAttributeLocations(){return this._vertexAttributeLocations}isVisible(){return this._visible}parametersChanged(){Object(n.i)(this.materialRepository)&&this.materialRepository.materialChanged(this)}}function xr(e,t,r,i){const n=r.typedBuffer,o=r.typedBufferStride,a=e.length;i*=o;for(let s=0;s<a;++s){const r=2*e[s];n[i]=t[r],n[i+1]=t[r+1],i+=o}}function _r(e,t,r,i,n){const o=r.typedBuffer,a=r.typedBufferStride,s=e.length;if(i*=a,null==n||1===n)for(let c=0;c<s;++c){const r=3*e[c];o[i]=t[r],o[i+1]=t[r+1],o[i+2]=t[r+2],i+=a}else for(let c=0;c<s;++c){const r=3*e[c];for(let e=0;e<n;++e)o[i]=t[r],o[i+1]=t[r+1],o[i+2]=t[r+2],i+=a}}function Or(e,t,r,i,n=1){const o=r.typedBuffer,a=r.typedBufferStride,s=e.length;if(i*=a,1===n)for(let c=0;c<s;++c){const r=4*e[c];o[i]=t[r],o[i+1]=t[r+1],o[i+2]=t[r+2],o[i+3]=t[r+3],i+=a}else for(let c=0;c<s;++c){const r=4*e[c];for(let e=0;e<n;++e)o[i]=t[r],o[i+1]=t[r+1],o[i+2]=t[r+2],o[i+3]=t[r+3],i+=a}}function yr(e,t,r,i,n,o=1){if(r){const a=i.typedBuffer,s=i.typedBufferStride,c=e.length,l=r[0],u=r[1],d=r[2],h=r[4],f=r[5],m=r[6],p=r[8],g=r[9],b=r[10],v=r[12],x=r[13],_=r[14];if(n*=s,1===o)for(let r=0;r<c;++r){const i=3*e[r],o=t[i],c=t[i+1],O=t[i+2];a[n]=l*o+h*c+p*O+v,a[n+1]=u*o+f*c+g*O+x,a[n+2]=d*o+m*c+b*O+_,n+=s}else for(let r=0;r<c;++r){const i=3*e[r],c=t[i],O=t[i+1],y=t[i+2],T=l*c+h*O+p*y+v,w=u*c+f*O+g*y+x,S=d*c+m*O+b*y+_;for(let e=0;e<o;++e)a[n]=T,a[n+1]=w,a[n+2]=S,n+=s}}else _r(e,t,i,n,o)}function Tr(e,t,r,i,n,o){if(r){const a=i.typedBuffer,s=i.typedBufferStride,c=e.length,l=r[0],u=r[1],d=r[2],h=r[4],f=r[5],m=r[6],p=r[8],g=r[9],b=r[10],v=Math.abs(1-l*l+h*h+p*p)>1e-5||Math.abs(1-u*u+f*f+g*g)>1e-5||Math.abs(1-d*d+m*m+b*b)>1e-5,x=1e-6,_=1-x;if(n*=s,1===o)for(let r=0;r<c;++r){const i=3*e[r],o=t[i],c=t[i+1],O=t[i+2];let y=l*o+h*c+p*O,T=u*o+f*c+g*O,w=d*o+m*c+b*O;if(v){const e=y*y+T*T+w*w;if(e<_&&e>x){const t=Math.sqrt(e);y/=t,T/=t,w/=t}}a[n+0]=y,a[n+1]=T,a[n+2]=w,n+=s}else for(let r=0;r<c;++r){const i=3*e[r],c=t[i],O=t[i+1],y=t[i+2];let T=l*c+h*O+p*y,w=u*c+f*O+g*y,S=d*c+m*O+b*y;if(v){const e=T*T+w*w+S*S;if(e<_&&e>x){const t=Math.sqrt(e);T/=t,w/=t,S/=t}}for(let e=0;e<o;++e)a[n+0]=T,a[n+1]=w,a[n+2]=S,n+=s}}else _r(e,t,i,n,o)}function wr(e,t,r,i,n,o=1){const a=i.typedBuffer,s=i.typedBufferStride,c=e.length;if(n*=s,1===o){if(4===r)for(let l=0;l<c;++l){const r=4*e[l];a[n]=t[r],a[n+1]=t[r+1],a[n+2]=t[r+2],a[n+3]=t[r+3],n+=s}else if(3===r)for(let l=0;l<c;++l){const r=3*e[l];a[n]=t[r],a[n+1]=t[r+1],a[n+2]=t[r+2],a[n+3]=255,n+=s}}else if(4===r)for(let l=0;l<c;++l){const r=4*e[l];for(let e=0;e<o;++e)a[n]=t[r],a[n+1]=t[r+1],a[n+2]=t[r+2],a[n+3]=t[r+3],n+=s}else if(3===r)for(let l=0;l<c;++l){const r=3*e[l];for(let e=0;e<o;++e)a[n]=t[r],a[n+1]=t[r+1],a[n+2]=t[r+2],a[n+3]=255,n+=s}}var Sr=r("69UF"),jr=r("GJyJ");const Mr=Object(jr.e)(770,1,771,771),Ar=Object(jr.f)(1,1),Cr=Object(jr.f)(0,771),Pr={factor:-1,units:-2};function Er(e){return e?Pr:null}function Ir(e){return 3===e||2===e?513:515}var Fr=r("pO5D");class Dr{constructor(e,t){this._module=e,this._loadModule=t}get(){return this._module}reload(){var e=this;return Object(i.a)(function*(){return e._module=yield e._loadModule(),e._module})()}}function Rr(e={}){return(t,r)=>{var i,n;t._parameterNames=null!=(i=t._parameterNames)?i:[],t._parameterNames.push(r);const o=t._parameterNames.length-1,a=e.count||2,s=Math.ceil(Object(B.h)(a)),c=null!=(n=t._parameterBits)?n:[0];let l=0;for(;c[l]+s>16;)l++,l>=c.length&&c.push(0);t._parameterBits=c;const u=c[l],d=(1<<s)-1<<u;c[l]+=s,Object.defineProperty(t,r,{get(){return this[o]},set(e){if(this[o]!==e&&(this[o]=e,this._keyDirty=!0,this._parameterBits[l]=this._parameterBits[l]&~d|+e<<u&d,"number"!=typeof e&&"boolean"!=typeof e))throw"Configuration value for "+r+" must be boolean or number, got "+typeof e}})}}var Lr,Br=r("jjdI"),Nr=r("lwwL");!function(e){function t(e,t,r){Object(s.j)(zr,r,t),e.setUniform3fv("localOrigin",t),e.setUniformMatrix4fv("view",zr)}e.bindCamPosition=function(e,t,r){e.setUniform3f("camPos",r[3]-t[0],r[7]-t[1],r[11]-t[2])},e.bindProjectionMatrix=function(e,t){e.setUniformMatrix4fv("proj",t)},e.bindNearFar=function(e,t){e.setUniform2fv("nearFar",t)},e.bindViewCustomOrigin=t,e.bindView=function(e,r){t(e,r.origin,r.camera.viewMatrix)},e.bindViewport=function(e,t){e.setUniform4fv("viewport",t.camera.fullViewport)}}(Lr||(Lr={}));const zr=Object(Nr.a)();var Ur=r("0nJL"),Vr=r("agdK"),Hr=r("viRi"),kr=r("F7CJ"),Gr=r("xtdb");const Wr={mask:255},qr={function:{func:519,ref:2,mask:2},operation:{fail:7680,zFail:7680,zPass:0}},$r={function:{func:519,ref:2,mask:2},operation:{fail:7680,zFail:7680,zPass:7681}};var Xr=r("0BfS"),Yr=r("aiF/"),Kr=r("1TnO"),Jr=r("p9cc"),Qr=r("AxBq");class Zr extends class{constructor(e,t){t&&(this._config=t.snapshot()),this._program=this.initializeProgram(e),e.commonUniformStore&&(this._commonUniformStore=e.commonUniformStore,this._commonUniformStore.subscribeProgram(this._program)),this._pipeline=this.initializePipeline(e)}dispose(){this._program&&(this._commonUniformStore&&this._commonUniformStore.unsubscribeProgram(this._program),this._program.dispose(),this._program=null)}reload(e){this._program&&(this._commonUniformStore&&this._commonUniformStore.unsubscribeProgram(this._program),this._program.dispose()),this._program=this.initializeProgram(e),this._commonUniformStore&&this._commonUniformStore.subscribeProgram(this._program)}get program(){return this._program}get pipeline(){return this._pipeline}get key(){return this._config.key}get configuration(){return this._config}bindPass(e,t,r){}bindMaterial(e,t,r){}bindDraw(e,t,r){}bindPipelineState(e){e.setPipelineState(this.pipeline)}ensureAttributeLocations(e){this.program.assertCompatibleVertexAttributeLocations(e)}get primitiveType(){return 4}}{initializeProgram(e){const t=Zr.shader.get(),r=this.configuration,i=t.build({OITEnabled:0===r.transparencyPassType,output:r.output,viewingMode:e.viewingMode,receiveShadows:r.receiveShadows,slicePlaneEnabled:r.slicePlaneEnabled,sliceHighlightDisabled:r.sliceHighlightDisabled,sliceEnabledForVertexPrograms:!1,symbolColor:r.symbolColors,vvSize:r.vvSize,vvColor:r.vvColor,vvInstancingEnabled:!0,instanced:r.instanced,instancedColor:r.instancedColor,instancedDoublePrecision:r.instancedDoublePrecision,useOldSceneLightInterface:!1,pbrMode:r.usePBR?r.isSchematic?2:1:0,hasMetalnessAndRoughnessTexture:r.hasMetalnessAndRoughnessTexture,hasEmissionTexture:r.hasEmissionTexture,hasOcclusionTexture:r.hasOcclusionTexture,hasNormalTexture:r.hasNormalTexture,hasColorTexture:r.hasColorTexture,receiveAmbientOcclusion:r.receiveAmbientOcclusion,useCustomDTRExponentForWater:!1,normalType:r.normalsTypeDerivate?3:0,doubleSidedMode:r.doubleSidedMode,vertexTangets:r.vertexTangents,attributeTextureCoordinates:r.hasMetalnessAndRoughnessTexture||r.hasEmissionTexture||r.hasOcclusionTexture||r.hasNormalTexture||r.hasColorTexture?1:0,textureAlphaPremultiplied:r.textureAlphaPremultiplied,attributeColor:r.vertexColors,screenSizePerspectiveEnabled:r.screenSizePerspective,verticalOffsetEnabled:r.verticalOffset,offsetBackfaces:r.offsetBackfaces,doublePrecisionRequiresObfuscation:Object(Yr.b)(e.rctx),alphaDiscardMode:r.alphaDiscardMode,supportsTextureAtlas:!1,multipassTerrainEnabled:r.multipassTerrainEnabled,cullAboveGround:r.cullAboveGround});return new Br.a(e.rctx,i.generateSource("vertex"),i.generateSource("fragment"),br)}bindPass(e,t,r){Lr.bindProjectionMatrix(this.program,r.camera.projectionMatrix);const i=this.configuration.output;(1===this.configuration.output||r.multipassTerrainEnabled||3===i)&&this.program.setUniform2fv("cameraNearFar",r.camera.nearFar),r.multipassTerrainEnabled&&(this.program.setUniform2fv("inverseViewport",r.inverseViewport),Object(Gr.a)(this.program,e,r)),7===i&&(this.program.setUniform1f("opacity",t.opacity),this.program.setUniform1f("layerOpacity",t.layerOpacity),this.program.setUniform4fv("externalColor",t.externalColor),this.program.setUniform1i("colorMixMode",gr.b[t.colorMixMode])),0===i?(r.lighting.setUniforms(this.program,!1),this.program.setUniform3fv("ambient",t.ambient),this.program.setUniform3fv("diffuse",t.diffuse),this.program.setUniform4fv("externalColor",t.externalColor),this.program.setUniform1i("colorMixMode",gr.b[t.colorMixMode]),this.program.setUniform1f("opacity",t.opacity),this.program.setUniform1f("layerOpacity",t.layerOpacity),this.configuration.usePBR&&Jr.a.bindUniforms(this.program,t,this.configuration.isSchematic)):4===i&&Vr.a.bindOutputHighlight(e,this.program,r),Hr.a.bindUniformsForSymbols(this.program,t),kr.a.bindUniforms(this.program,t,r),Object(gr.a)(t.screenSizePerspective,this.program,"screenSizePerspectiveAlignment"),2!==t.textureAlphaMode&&3!==t.textureAlphaMode||this.program.setUniform1f("textureAlphaCutoff",t.textureAlphaCutoff)}bindDraw(e){const t=this.configuration.instancedDoublePrecision?Object(o.g)(e.camera.viewInverseTransposeMatrix[3],e.camera.viewInverseTransposeMatrix[7],e.camera.viewInverseTransposeMatrix[11]):e.origin;Lr.bindViewCustomOrigin(this.program,t,e.camera.viewMatrix),(0===this.configuration.output||7===this.configuration.output||1===this.configuration.output&&this.configuration.screenSizePerspective||2===this.configuration.output&&this.configuration.screenSizePerspective||4===this.configuration.output&&this.configuration.screenSizePerspective)&&Lr.bindCamPosition(this.program,t,e.camera.viewInverseTransposeMatrix),2===this.configuration.output&&this.program.setUniformMatrix4fv("viewNormal",e.camera.viewInverseTransposeMatrix),this.configuration.instancedDoublePrecision&&Kr.a.bindCustomOrigin(this.program,t),Ur.a.bindUniforms(this.program,this.configuration,e.slicePlane,t),0===this.configuration.output&&Xr.a.bindViewCustomOrigin(this.program,e,t)}setPipeline(e,t){const r=this.configuration,i=3===e,n=2===e;return Object(jr.d)({blending:0!==r.output&&7!==r.output||!r.transparent?null:i?Mr:(o=e,2===o?null:1===o?Cr:Ar),culling:ei(r),depthTest:{func:Ir(e)},depthWrite:i||n?r.writeDepth&&jr.c:null,colorWrite:jr.b,stencilWrite:r.sceneHasOcludees?Wr:null,stencilTest:r.sceneHasOcludees?t?$r:qr:null,polygonOffset:i||n?null:Er(r.enableOffset)});var o}initializePipeline(){return this._occludeePipelineState=this.setPipeline(this.configuration.transparencyPassType,!0),this.setPipeline(this.configuration.transparencyPassType,!1)}getPipelineState(e){return e?this._occludeePipelineState:this.pipeline}}Zr.shader=new Dr(Qr.a,()=>r.e(172).then(r.bind(null,"SjXz")));const ei=e=>function(e){return e.cullFace?0!==e.cullFace:!e.slicePlaneEnabled&&!e.transparent&&!e.doubleSidedMode}(e)&&{face:1===e.cullFace?1028:1029,mode:2305};class ti extends class{constructor(){this._key="",this._keyDirty=!1,this._parameterBits=this._parameterBits.map(()=>0)}get key(){return this._keyDirty&&(this._keyDirty=!1,this._key=String.fromCharCode.apply(String,this._parameterBits)),this._key}snapshot(){const e=this._parameterNames,t={key:this.key};for(const r of e)t[r]=this[r];return t}}{constructor(){super(...arguments),this.output=0,this.alphaDiscardMode=1,this.doubleSidedMode=0,this.isSchematic=!1,this.vertexColors=!1,this.offsetBackfaces=!1,this.symbolColors=!1,this.vvSize=!1,this.vvColor=!1,this.verticalOffset=!1,this.receiveShadows=!1,this.slicePlaneEnabled=!1,this.sliceHighlightDisabled=!1,this.receiveAmbientOcclusion=!1,this.screenSizePerspective=!1,this.textureAlphaPremultiplied=!1,this.hasColorTexture=!1,this.usePBR=!1,this.hasMetalnessAndRoughnessTexture=!1,this.hasEmissionTexture=!1,this.hasOcclusionTexture=!1,this.hasNormalTexture=!1,this.instanced=!1,this.instancedColor=!1,this.instancedDoublePrecision=!1,this.vertexTangents=!1,this.normalsTypeDerivate=!1,this.writeDepth=!0,this.sceneHasOcludees=!1,this.transparent=!1,this.enableOffset=!0,this.cullFace=0,this.transparencyPassType=3,this.multipassTerrainEnabled=!1,this.cullAboveGround=!0}}Object(Fr.a)([Rr({count:8})],ti.prototype,"output",void 0),Object(Fr.a)([Rr({count:4})],ti.prototype,"alphaDiscardMode",void 0),Object(Fr.a)([Rr({count:3})],ti.prototype,"doubleSidedMode",void 0),Object(Fr.a)([Rr()],ti.prototype,"isSchematic",void 0),Object(Fr.a)([Rr()],ti.prototype,"vertexColors",void 0),Object(Fr.a)([Rr()],ti.prototype,"offsetBackfaces",void 0),Object(Fr.a)([Rr()],ti.prototype,"symbolColors",void 0),Object(Fr.a)([Rr()],ti.prototype,"vvSize",void 0),Object(Fr.a)([Rr()],ti.prototype,"vvColor",void 0),Object(Fr.a)([Rr()],ti.prototype,"verticalOffset",void 0),Object(Fr.a)([Rr()],ti.prototype,"receiveShadows",void 0),Object(Fr.a)([Rr()],ti.prototype,"slicePlaneEnabled",void 0),Object(Fr.a)([Rr()],ti.prototype,"sliceHighlightDisabled",void 0),Object(Fr.a)([Rr()],ti.prototype,"receiveAmbientOcclusion",void 0),Object(Fr.a)([Rr()],ti.prototype,"screenSizePerspective",void 0),Object(Fr.a)([Rr()],ti.prototype,"textureAlphaPremultiplied",void 0),Object(Fr.a)([Rr()],ti.prototype,"hasColorTexture",void 0),Object(Fr.a)([Rr()],ti.prototype,"usePBR",void 0),Object(Fr.a)([Rr()],ti.prototype,"hasMetalnessAndRoughnessTexture",void 0),Object(Fr.a)([Rr()],ti.prototype,"hasEmissionTexture",void 0),Object(Fr.a)([Rr()],ti.prototype,"hasOcclusionTexture",void 0),Object(Fr.a)([Rr()],ti.prototype,"hasNormalTexture",void 0),Object(Fr.a)([Rr()],ti.prototype,"instanced",void 0),Object(Fr.a)([Rr()],ti.prototype,"instancedColor",void 0),Object(Fr.a)([Rr()],ti.prototype,"instancedDoublePrecision",void 0),Object(Fr.a)([Rr()],ti.prototype,"vertexTangents",void 0),Object(Fr.a)([Rr()],ti.prototype,"normalsTypeDerivate",void 0),Object(Fr.a)([Rr()],ti.prototype,"writeDepth",void 0),Object(Fr.a)([Rr()],ti.prototype,"sceneHasOcludees",void 0),Object(Fr.a)([Rr()],ti.prototype,"transparent",void 0),Object(Fr.a)([Rr()],ti.prototype,"enableOffset",void 0),Object(Fr.a)([Rr({count:3})],ti.prototype,"cullFace",void 0),Object(Fr.a)([Rr({count:4})],ti.prototype,"transparencyPassType",void 0),Object(Fr.a)([Rr()],ti.prototype,"multipassTerrainEnabled",void 0),Object(Fr.a)([Rr()],ti.prototype,"cullAboveGround",void 0);var ri=r("sKsC");class ii extends Zr{initializeProgram(e){const t=ii.shader.get(),r=this.configuration,i=t.build({OITEnabled:0===r.transparencyPassType,output:r.output,viewingMode:e.viewingMode,receiveShadows:r.receiveShadows,slicePlaneEnabled:r.slicePlaneEnabled,sliceHighlightDisabled:r.sliceHighlightDisabled,sliceEnabledForVertexPrograms:!1,symbolColor:r.symbolColors,vvSize:r.vvSize,vvColor:r.vvColor,vvInstancingEnabled:!0,instanced:r.instanced,instancedColor:r.instancedColor,instancedDoublePrecision:r.instancedDoublePrecision,useOldSceneLightInterface:!1,pbrMode:r.usePBR?1:0,hasMetalnessAndRoughnessTexture:!1,hasEmissionTexture:!1,hasOcclusionTexture:!1,hasNormalTexture:!1,hasColorTexture:r.hasColorTexture,receiveAmbientOcclusion:r.receiveAmbientOcclusion,useCustomDTRExponentForWater:!1,normalType:0,doubleSidedMode:2,vertexTangets:!1,attributeTextureCoordinates:r.hasColorTexture?1:0,textureAlphaPremultiplied:r.textureAlphaPremultiplied,attributeColor:r.vertexColors,screenSizePerspectiveEnabled:r.screenSizePerspective,verticalOffsetEnabled:r.verticalOffset,offsetBackfaces:r.offsetBackfaces,doublePrecisionRequiresObfuscation:Object(Yr.b)(e.rctx),alphaDiscardMode:r.alphaDiscardMode,supportsTextureAtlas:!1,multipassTerrainEnabled:r.multipassTerrainEnabled,cullAboveGround:r.cullAboveGround});return new Br.a(e.rctx,i.generateSource("vertex"),i.generateSource("fragment"),br)}}ii.shader=new Dr(ri.a,()=>r.e(170).then(r.bind(null,"FmK6")));class ni extends vr{constructor(e){super(e,ai),this.supportsEdges=!0,this.techniqueConfig=new ti,this.vertexBufferLayout=ni.getVertexBufferLayout(this.params),this.instanceBufferLayout=e.instanced?ni.getInstanceBufferLayout(this.params):null}isVisibleInPass(e){return 4!==e&&6!==e&&7!==e||this.params.castShadows}isVisible(){const e=this.params;if(!super.isVisible()||0===e.layerOpacity)return!1;const t=e.instanced,r=e.vertexColors,i=e.symbolColors,n=!!t&&t.indexOf("color")>-1,o=e.vvColorEnabled,a="replace"===e.colorMixMode,s=e.opacity>0,c=e.externalColor&&e.externalColor[3]>0;return r&&(n||o||i)?!!a||s:r?a?c:s:n||o||i?!!a||s:a?c:s}getTechniqueConfig(e,t){return this.techniqueConfig.output=e,this.techniqueConfig.hasNormalTexture=!!this.params.normalTextureId,this.techniqueConfig.hasColorTexture=!!this.params.textureId,this.techniqueConfig.vertexTangents=this.params.vertexTangents,this.techniqueConfig.instanced=!!this.params.instanced,this.techniqueConfig.instancedDoublePrecision=this.params.instancedDoublePrecision,this.techniqueConfig.vvSize=this.params.vvSizeEnabled,this.techniqueConfig.verticalOffset=null!==this.params.verticalOffset,this.techniqueConfig.screenSizePerspective=null!==this.params.screenSizePerspective,this.techniqueConfig.slicePlaneEnabled=this.params.slicePlaneEnabled,this.techniqueConfig.sliceHighlightDisabled=this.params.sliceHighlightDisabled,this.techniqueConfig.alphaDiscardMode=this.params.textureAlphaMode,this.techniqueConfig.normalsTypeDerivate="screenDerivative"===this.params.normals,this.techniqueConfig.transparent=this.params.transparent,this.techniqueConfig.writeDepth=this.params.writeDepth,this.techniqueConfig.sceneHasOcludees=this.params.sceneHasOcludees,this.techniqueConfig.cullFace=null!=this.params.cullFace?this.params.cullFace:0,this.techniqueConfig.multipassTerrainEnabled=!!t&&t.multipassTerrainEnabled,this.techniqueConfig.cullAboveGround=!t||t.cullAboveGround,0!==e&&7!==e||(this.techniqueConfig.vertexColors=this.params.vertexColors,this.techniqueConfig.symbolColors=this.params.symbolColors,this.techniqueConfig.doubleSidedMode=this.params.treeRendering?2:this.params.doubleSided&&"normal"===this.params.doubleSidedType?1:this.params.doubleSided&&"winding-order"===this.params.doubleSidedType?2:0,this.techniqueConfig.instancedColor=!!this.params.instanced&&this.params.instanced.indexOf("color")>-1,this.techniqueConfig.receiveShadows=this.params.receiveShadows&&this.params.shadowMappingEnabled,this.techniqueConfig.receiveAmbientOcclusion=!(!t||!t.ssaoEnabled)&&this.params.receiveSSAO,this.techniqueConfig.vvColor=this.params.vvColorEnabled,this.techniqueConfig.textureAlphaPremultiplied=!!this.params.textureAlphaPremultiplied,this.techniqueConfig.usePBR=this.params.usePBR,this.techniqueConfig.hasMetalnessAndRoughnessTexture=!!this.params.metallicRoughnessTextureId,this.techniqueConfig.hasEmissionTexture=!!this.params.emissiveTextureId,this.techniqueConfig.hasOcclusionTexture=!!this.params.occlusionTextureId,this.techniqueConfig.offsetBackfaces=!(!this.params.transparent||!this.params.offsetTransparentBackfaces),this.techniqueConfig.isSchematic=this.params.usePBR&&this.params.isSchematic,this.techniqueConfig.transparencyPassType=t?t.transparencyPassType:3,this.techniqueConfig.enableOffset=!t||t.camera.relativeElevation<5e5),this.techniqueConfig}intersect(e,t,r,i,o,s,c){if(null!==this.params.verticalOffset){const e=i.camera;Object(a.r)(fi,r[12],r[13],r[14]);let t=null;switch(i.viewingMode){case 1:t=Object(a.o)(di,fi);break;case 2:t=Object(a.h)(di,ui)}let n=0;if(null!==this.params.verticalOffset){const r=Object(a.g)(mi,fi,e.eye),i=Object(a.m)(r),o=Object(a.b)(r,r,1/i);let s=null;this.params.screenSizePerspective&&(s=Object(a.e)(t,o)),n+=Object(gr.f)(e,i,this.params.verticalOffset,s,this.params.screenSizePerspective)}Object(a.b)(t,t,n),Object(a.s)(hi,t,i.transform.inverseRotation),o=Object(a.g)(ci,o,hi),s=Object(a.g)(li,s,hi)}Object(gr.d)(e,t,i,o,s,function(e){return Object(n.i)(e)?(ur.offset=e,ur):null}(i.verticalOffset),c)}getGLMaterial(e){if(0===e.output||7===e.output||1===e.output||2===e.output||3===e.output||4===e.output)return new oi(e)}createBufferWriter(){return new si(this.vertexBufferLayout,this.instanceBufferLayout)}static getVertexBufferLayout(e){const t=e.textureId||e.normalTextureId||e.metallicRoughnessTextureId||e.emissiveTextureId||e.occlusionTextureId,r=Object(ue.a)().vec3f("position").vec3f("normal");return e.vertexTangents&&r.vec4f("tangent"),t&&r.vec2f("uv0"),e.vertexColors&&r.vec4u8("color"),e.symbolColors&&r.vec4u8("symbolColor"),r}static getInstanceBufferLayout(e){let t=Object(ue.a)();return t=e.instancedDoublePrecision?t.vec3f("modelOriginHi").vec3f("modelOriginLo").mat3f("model").mat3f("modelNormal"):t.mat4f("model").mat4f("modelNormal"),e.instanced&&e.instanced.indexOf("color")>-1&&(t=t.vec4f("instanceColor")),e.instanced&&e.instanced.indexOf("featureAttribute")>-1&&(t=t.vec4f("instanceFeatureAttribute")),t}}class oi extends pr{constructor(e){const t=e.material;super({...e,...t.params}),this.updateParameters()}updateParameters(e){const t=this.material.params;this.updateTexture(t.textureId),this.technique=this.techniqueRep.acquireAndReleaseExisting(t.treeRendering?ii:Zr,this.material.getTechniqueConfig(this.output,e),this.technique)}selectPipelines(){}_updateShadowState(e){e.shadowMappingEnabled!==this.material.params.shadowMappingEnabled&&this.material.setParameterValues({shadowMappingEnabled:e.shadowMappingEnabled})}_updateOccludeeState(e){e.hasOccludees!==this.material.params.sceneHasOcludees&&this.material.setParameterValues({sceneHasOcludees:e.hasOccludees})}ensureParameters(e){0!==this.output&&7!==this.output||(this._updateShadowState(e),this._updateOccludeeState(e)),this.updateParameters(e)}bind(e,t){e.bindProgram(this.technique.program),this.technique.bindPass(e,this.material.params,t),this.bindTexture(e,this.technique.program)}beginSlot(e){return e===(this.material.params.transparent?this.material.params.writeDepth?5:8:3)}getPipelineState(e,t){return this.technique.getPipelineState(t)}}const ai={textureId:void 0,initTextureTransparent:!1,isSchematic:!1,usePBR:!1,normalTextureId:void 0,vertexTangents:!1,occlusionTextureId:void 0,emissiveTextureId:void 0,metallicRoughnessTextureId:void 0,emissiveFactor:[0,0,0],mrrFactors:[0,1,.5],ambient:[.2,.2,.2],diffuse:[.8,.8,.8],externalColor:[1,1,1,1],colorMixMode:"multiply",opacity:1,layerOpacity:1,vertexColors:!1,symbolColors:!1,doubleSided:!1,doubleSidedType:"normal",cullFace:void 0,instanced:void 0,instancedDoublePrecision:!1,normals:"default",receiveSSAO:!0,receiveShadows:!0,castShadows:!0,shadowMappingEnabled:!1,verticalOffset:null,screenSizePerspective:null,slicePlaneEnabled:!1,sliceHighlightDisabled:!1,offsetTransparentBackfaces:!1,vvSizeEnabled:!1,vvSizeMinSize:[1,1,1],vvSizeMaxSize:[100,100,100],vvSizeOffset:[0,0,0],vvSizeFactor:[1,1,1],vvSizeValue:[1,1,1],vvColorEnabled:!1,vvColorValues:[0,0,0,0,0,0,0,0],vvColorColors:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],vvSymbolAnchor:[0,0,0],vvSymbolRotationMatrix:Object(l.a)(),transparent:!1,writeDepth:!0,textureAlphaMode:0,textureAlphaCutoff:Sr.b,textureAlphaPremultiplied:!1,sceneHasOcludees:!1,renderOccluded:1};class si{constructor(e,t){this.vertexBufferLayout=e,this.instanceBufferLayout=t}allocate(e){return this.vertexBufferLayout.createBuffer(e)}elementCount(e){return e.indices.get("position").length}write(e,t,r,i){!function(e,t,r,i,n,o){for(const a of t.fieldNames){const t=e.vertexAttributes.get(a),s=e.indices.get(a);if(t&&s)switch(a){case"position":{Object(x.a)(3===t.size);const e=n.getField(a,h.u);e&&yr(s,t.data,r,e,o);break}case"normal":{Object(x.a)(3===t.size);const e=n.getField(a,h.u);e&&Tr(s,t.data,i,e,o,1);break}case"uv0":{Object(x.a)(2===t.size);const e=n.getField(a,h.m);e&&xr(s,t.data,e,o);break}case"color":{Object(x.a)(3===t.size||4===t.size);const e=n.getField(a,h.J);e&&wr(s,t.data,t.size,e,o);break}case"symbolColor":{Object(x.a)(3===t.size||4===t.size);const e=n.getField(a,h.J);e&&wr(s,t.data,t.size,e,o);break}case"tangent":{Object(x.a)(4===t.size);const e=n.getField(a,h.C);e&&Or(s,t.data,e,o);break}}}}(t,this.vertexBufferLayout,e.transformation,e.invTranspTransformation,r,i)}}const ci=Object(o.e)(),li=Object(o.e)(),ui=Object(o.g)(0,0,1),di=Object(o.e)(),hi=Object(o.e)(),fi=Object(o.e)(),mi=Object(o.e)();var pi=r("bJda"),gi=r("ohva"),bi=r("zlDU"),vi=r("4EHJ"),xi=r("9MzC"),_i=r("zm0L"),Oi=r("Ioo4"),yi=r("LbAs"),Ti=r("xRQN"),wi=r("of9L"),Si=r("hTmG"),ji=r("fOQB"),Mi=r("D6bk");const Ai=[{name:"position",count:2,type:5126,offset:0,stride:8,normalized:!1}],Ci=[{name:"position",count:2,type:5126,offset:0,stride:16,normalized:!1},{name:"uv0",count:2,type:5126,offset:8,stride:16,normalized:!1}];var Pi=r("0meK"),Ei=r("ss0y");function Ii(){if(Object(n.h)(Fi)){const e=e=>Object(Ei.a)(`esri/libs/basisu/${e}`);Fi=Promise.all([r.e(0),r.e(129)]).then(r.bind(null,"pY8p")).then(function(e){return e.b}).then(({default:t})=>t({locateFile:e}).then(e=>(e.initializeBasis(),delete e.then,e)))}return Fi}let Fi,Di=null,Ri=null;function Li(){return Bi.apply(this,arguments)}function Bi(){return(Bi=Object(i.a)(function*(){return Object(n.h)(Ri)&&(Ri=Ii(),Di=yield Ri),Ri})).apply(this,arguments)}function Ni(){return(Ni=Object(i.a)(function*(e,t,r){Object(n.h)(Di)&&(Di=yield Li());const i=new Di.BasisFile(new Uint8Array(r));if(i.getNumImages()<1)return null;const o=i.getNumLevels(0),a=i.getHasAlpha(),s=i.getImageWidth(0,0),c=i.getImageHeight(0,0),{compressedTextureETC:l,compressedTextureS3TC:u}=e.capabilities,[d,h]=l?a?[1,37496]:[0,37492]:u?a?[3,33779]:[2,33776]:[13,6408];i.startTranscoding();const f=[];for(let n=0;n<o;n++)f.push(new Uint8Array(i.getImageTranscodedSizeInBytes(0,n,d))),i.transcodeImage(f[n],0,n,d,0,0);i.close(),i.delete();const m={...t,samplingMode:o>1?9987:9729,hasMipmap:o>1,internalFormat:h,width:s,height:c};return new wi.a(e,m,{type:"compressed",levels:f})})).apply(this,arguments)}const zi=f.a.getLogger("esri.views.3d.webgl-engine.lib.DDSUtil");function Ui(e){return e.charCodeAt(0)+(e.charCodeAt(1)<<8)+(e.charCodeAt(2)<<16)+(e.charCodeAt(3)<<24)}const Vi=Ui("DXT1"),Hi=Ui("DXT3"),ki=Ui("DXT5");class Gi extends w{constructor(e,t){super(),this.data=e,this.type=4,this.glTexture=null,this.powerOfTwoStretchInfo=null,this.loadingPromise=null,this.loadingController=null,this.events=new _i.a,this.params=t||{},this.params.mipmap=!1!==this.params.mipmap,this.params.noUnpackFlip=this.params.noUnpackFlip||!1,this.params.preMultiplyAlpha=this.params.preMultiplyAlpha||!1,this.params.wrap=this.params.wrap||{s:10497,t:10497},this.params.powerOfTwoResizeMode=this.params.powerOfTwoResizeMode||1,this.estimatedTexMemRequired=Gi.estimateTexMemRequired(this.data,this.params),this.startPreload()}startPreload(){const e=this.data;Object(n.h)(e)||(e instanceof HTMLVideoElement?this.startPreloadVideoElement(e):e instanceof HTMLImageElement&&this.startPreloadImageElement(e))}startPreloadVideoElement(e){Object(vi.t)(e.src)||"auto"===e.preload&&e.crossOrigin||(e.preload="auto",e.crossOrigin="anonymous",e.src=e.src)}startPreloadImageElement(e){Object(vi.u)(e.src)||Object(vi.t)(e.src)||e.crossOrigin||(e.crossOrigin="anonymous",e.src=e.src)}static getDataDimensions(e){return e instanceof HTMLVideoElement?{width:e.videoWidth,height:e.videoHeight}:e}static estimateTexMemRequired(e,t){if(Object(n.h)(e))return 0;if(Object(gi.c)(e)||Object(gi.k)(e))return t.encoding===Gi.BASIS_ENCODING?function(e){if(Object(n.h)(Di))return e.byteLength;const t=new Di.BasisFile(new Uint8Array(e));if(t.getNumImages()<1)return 0;const r=t.getNumLevels(0),i=t.getHasAlpha(),o=t.getImageWidth(0,0),a=t.getImageHeight(0,0);t.close(),t.delete();const s=Object(Si.b)(i?37496:37492);return Math.ceil(o*a*s*((4**r-1)/(3*4**(r-1))))}(e):e.byteLength;const{width:r,height:i}=e instanceof Image||e instanceof ImageData||e instanceof HTMLCanvasElement||e instanceof HTMLVideoElement?Gi.getDataDimensions(e):t;return(t.mipmap?4/3:1)*r*i*(t.components||4)||0}dispose(){this.data=void 0}get width(){return this.params.width}get height(){return this.params.height}createDescriptor(e){return{target:3553,pixelFormat:6408,dataType:5121,wrapMode:this.params.wrap,flipped:!this.params.noUnpackFlip,samplingMode:this.params.mipmap?9987:9729,hasMipmap:this.params.mipmap,preMultiplyAlpha:this.params.preMultiplyAlpha,maxAnisotropy:this.params.mipmap&&!this.params.disableAnisotropy?e.parameters.maxMaxAnisotropy:void 0}}load(e,t){if(Object(n.i)(this.glTexture))return this.glTexture;if(Object(n.i)(this.loadingPromise))return this.loadingPromise;const r=this.data;return Object(n.h)(r)?(this.glTexture=new wi.a(e,this.createDescriptor(e),null),e.bindTexture(this.glTexture,0),this.glTexture):"string"==typeof r?this.loadFromURL(e,t,r):r instanceof Image?this.loadFromImageElement(e,t,r):r instanceof HTMLVideoElement?this.loadFromVideoElement(e,t,r):r instanceof ImageData||r instanceof HTMLCanvasElement?this.loadFromImage(e,r,t):(Object(gi.c)(r)||Object(gi.k)(r))&&this.params.encoding===Gi.DDS_ENCODING?this.loadFromDDSData(e,r):(Object(gi.c)(r)||Object(gi.k)(r))&&this.params.encoding===Gi.BASIS_ENCODING?this.loadFromBasis(e,r):Object(gi.k)(r)?this.loadFromPixelData(e,r):Object(gi.c)(r)?this.loadFromPixelData(e,new Uint8Array(r)):null}get requiresFrameUpdates(){return this.data instanceof HTMLVideoElement}frameUpdate(e,t,r){if(!(this.data instanceof HTMLVideoElement)||Object(n.h)(this.glTexture))return r;if(this.data.readyState<2||r===this.data.currentTime)return r;if(Object(n.i)(this.powerOfTwoStretchInfo)){const{framebuffer:r,vao:i,sourceTexture:n}=this.powerOfTwoStretchInfo;n.setData(this.data),this.drawStretchedTexture(e,t,r,i,n,this.glTexture)}else{const{width:e,height:t}=this.data,{width:r,height:i}=this.glTexture.descriptor;e!==r||t!==i?this.glTexture.updateData(0,0,0,Math.min(e,r),Math.min(t,i),this.data):this.glTexture.setData(this.data)}return this.glTexture.descriptor.hasMipmap&&this.glTexture.generateMipmap(),this.data.currentTime}loadFromDDSData(e,t){return this.glTexture=function(e,t,r,i){const{textureData:n,internalFormat:o,width:a,height:s}=function(e,t){const r=new Int32Array(e,0,31);if(542327876!==r[0])return zi.error("Invalid magic number in DDS header"),null;if(!(4&r[20]))return zi.error("Unsupported format, must contain a FourCC code"),null;const i=r[21];let n,o;switch(i){case Vi:n=8,o=33776;break;case Hi:n=16,o=33778;break;case ki:n=16,o=33779;break;default:return zi.error("Unsupported FourCC code:",function(e){return String.fromCharCode(255&e,e>>8&255,e>>16&255,e>>24&255)}(i)),null}let a=1,s=r[4],c=r[3];0==(3&s)&&0==(3&c)||(zi.warn("Rounding up compressed texture size to nearest multiple of 4."),s=s+3&-4,c=c+3&-4);const l=s,u=c;let d,h;131072&r[2]&&!1!==t&&(a=Math.max(1,r[7])),1===a||Object(B.f)(s)&&Object(B.f)(c)||(zi.warn("Ignoring mipmaps of non power of two sized compressed texture."),a=1);let f=r[1]+4;const m=[];for(let p=0;p<a;++p)h=(s+3>>2)*(c+3>>2)*n,d=new Uint8Array(e,f,h),m.push(d),f+=h,s=Math.max(1,s>>1),c=Math.max(1,c>>1);return{textureData:{type:"compressed",levels:m},internalFormat:o,width:l,height:u}}(r,i);t.samplingMode=n.levels.length>1?9987:9729,t.hasMipmap=n.levels.length>1,t.internalFormat=o,t.width=a,t.height=s;const c=new wi.a(e,t,n);return e.bindTexture(c,0),c}(e,this.createDescriptor(e),t,this.params.mipmap),e.bindTexture(this.glTexture,0),this.glTexture}loadFromBasis(e,t){return this.loadAsync(()=>function(e,t,r){return Ni.apply(this,arguments)}(e,this.createDescriptor(e),t).then(e=>(this.glTexture=e,e)))}loadFromPixelData(e,t){Object(x.a)(this.params.width>0&&this.params.height>0);const r=this.createDescriptor(e);return r.pixelFormat=1===this.params.components?6409:3===this.params.components?6407:6408,r.width=this.params.width,r.height=this.params.height,this.glTexture=new wi.a(e,r,t),e.bindTexture(this.glTexture,0),this.glTexture}loadAsync(e){var t=this;return Object(i.a)(function*(){const r=Object(xi.d)();t.loadingController=r;const i=e(r.signal);t.loadingPromise=i;const n=()=>{t.loadingController===r&&(t.loadingController=null),t.loadingPromise===i&&(t.loadingPromise=null)};return i.then(n,n),i})()}loadFromURL(e,t,r){var n=this;return this.loadAsync(function(){var o=Object(i.a)(function*(i){const o=yield Object(yi.a)(r,{signal:i});return n.loadFromImage(e,o,t)});return function(e){return o.apply(this,arguments)}}())}loadFromImageElement(e,t,r){var n=this;return r.complete?this.loadFromImage(e,r,t):this.loadAsync(function(){var o=Object(i.a)(function*(i){const o=yield Object(Oi.a)(r,r.src,!1,i);return n.loadFromImage(e,o,t)});return function(e){return o.apply(this,arguments)}}())}loadFromVideoElement(e,t,r){return r.readyState>=2?this.loadFromImage(e,r,t):this.loadFromVideoElementAsync(e,t,r)}loadFromVideoElementAsync(e,t,r){return this.loadAsync(i=>new Promise((o,a)=>{const s=()=>{r.removeEventListener("loadeddata",c),r.removeEventListener("error",l),Object(n.i)(u)&&u.remove()},c=()=>{r.readyState>=2&&(s(),o(this.loadFromImage(e,r,t)))},l=e=>{s(),a(e||new bi.a("Failed to load video"))};r.addEventListener("loadeddata",c),r.addEventListener("error",l);const u=Object(xi.p)(i,()=>l(Object(xi.e)()))}))}loadFromImage(e,t,r){const i=Gi.getDataDimensions(t);this.params.width=i.width,this.params.height=i.height;const n=this.createDescriptor(e);return n.pixelFormat=3===this.params.components?6407:6408,!this.requiresPowerOfTwo(e,n)||Object(B.f)(i.width)&&Object(B.f)(i.height)?(n.width=i.width,n.height=i.height,this.glTexture=new wi.a(e,n,t),e.bindTexture(this.glTexture,0),this.glTexture):(this.glTexture=this.makePowerOfTwoTexture(e,t,i,n,r),e.bindTexture(this.glTexture,0),this.glTexture)}requiresPowerOfTwo(e,t){const r=33071,i="number"==typeof t.wrapMode?t.wrapMode===r:t.wrapMode.s===r&&t.wrapMode.t===r;return!Object(Ti.a)(e.gl)&&(t.hasMipmap||!i)}makePowerOfTwoTexture(e,t,r,i,n){const{width:o,height:a}=r,s=Object(B.i)(o),c=Object(B.i)(a);let l;switch(i.width=s,i.height=c,this.params.powerOfTwoResizeMode){case 2:i.textureCoordinateScaleFactor=[o/s,a/c],l=new wi.a(e,i),l.updateData(0,0,0,o,a,t);break;case 1:case null:case void 0:l=this.stretchToPowerOfTwo(e,t,i,n);break;default:Object(pi.a)(this.params.powerOfTwoResizeMode)}return i.hasMipmap&&l.generateMipmap(),l}stretchToPowerOfTwo(e,t,r,i){const n=new wi.a(e,r),o=new Pi.a(e,{colorTarget:0,depthStencilTarget:0},n),a=new wi.a(e,{target:3553,pixelFormat:r.pixelFormat,dataType:5121,wrapMode:33071,samplingMode:9729,flipped:!!r.flipped,maxAnisotropy:8,preMultiplyAlpha:r.preMultiplyAlpha},t),s=function(e,t=Ai,r=br,i=-1,n=1){let o=null;switch(t){case Ci:o=new Float32Array([i,i,0,0,n,i,1,0,i,n,0,1,n,n,1,1]);break;case Ai:default:o=new Float32Array([i,i,n,i,i,n,n,n])}return new Mi.a(e,r,{geometry:t},{geometry:ji.a.createVertex(e,35044,o)})}(e);return this.drawStretchedTexture(e,i,o,s,a,n),this.requiresFrameUpdates?this.powerOfTwoStretchInfo={vao:s,sourceTexture:a,framebuffer:o}:(s.dispose(!0),a.dispose(),o.detachColorTexture(),e.bindFramebuffer(null),o.dispose()),n}drawStretchedTexture(e,t,r,i,n,o){e.bindFramebuffer(r);const a=e.getViewport();e.setViewport(0,0,o.descriptor.width,o.descriptor.height);const s=t.program;e.bindProgram(s),s.setUniform4f("color",1,1,1,1),s.setUniform1i("tex",0),e.bindTexture(n,0),e.bindVAO(i),e.setPipelineState(t.pipeline),e.drawArrays(5,0,Object(Si.d)(i,"geometry")),e.bindFramebuffer(null),e.setViewport(a.x,a.y,a.width,a.height)}unload(){if(Object(n.i)(this.powerOfTwoStretchInfo)){const{framebuffer:e,vao:t,sourceTexture:r}=this.powerOfTwoStretchInfo;t.dispose(!0),r.dispose(),e.dispose(),this.glTexture=null,this.powerOfTwoStretchInfo=null}if(Object(n.i)(this.glTexture)&&(this.glTexture.dispose(),this.glTexture=null),Object(n.i)(this.loadingController)){const e=this.loadingController;this.loadingController=null,this.loadingPromise=null,e.abort()}this.events.emit("unloaded")}}Gi.DDS_ENCODING="image/vnd-ms.dds",Gi.BASIS_ENCODING="image/x.basis";var Wi=r("Lqtk"),qi=r("eSsm");class $i{constructor(e){this.streamDataRequester=e}loadJSON(e,t){var r=this;return Object(i.a)(function*(){return r.load("json",e,t)})()}loadBinary(e,t){var r=this;return Object(i.a)(function*(){return Object(vi.u)(e)?(Object(xi.u)(t),Object(vi.j)(e)):r.load("binary",e,t)})()}loadImage(e,t){var r=this;return Object(i.a)(function*(){return r.load("image",e,t)})()}load(e,t,r){var o=this;return Object(i.a)(function*(){if(Object(n.h)(o.streamDataRequester))return(yield Object(Wi.default)(t,{responseType:Xi[e]})).data;const i=yield Object(qi.c)(o.streamDataRequester.request(t,e,r));if(!0===i.ok)return i.value;throw Object(xi.t)(i.error),new bi.a("",`Request for resource failed: ${i.error}`)})()}}const Xi={image:"image",binary:"array-buffer",json:"json"};var Yi=r("grla");function Ki(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let u=0;u<s;++u)i[c]=o[l],i[c+1]=o[l+1],c+=n,l+=a}function Ji(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;if(Object(Yi.b)(t.elementType)){const e=Object(Yi.d)(t.elementType);if(Object(Yi.c)(t.elementType))for(let t=0;t<s;++t)i[c]=Math.max(o[l]/e,-1),i[c+1]=Math.max(o[l+1]/e,-1),c+=n,l+=a;else for(let t=0;t<s;++t)i[c]=o[l]/e,i[c+1]=o[l+1]/e,c+=n,l+=a}else Ki(e,t,r);return e}function Qi(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let u=0;u<s;++u)i[c]=o[l],i[c+1]=o[l+1],i[c+2]=o[l+2],c+=n,l+=a}function Zi(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let u=0;u<s;++u)i[c]=o[l],i[c+1]=o[l+1],i[c+2]=o[l+2],i[c+3]=o[l+3],c+=n,l+=a}function en(e,t,r,i,n,o){const a=e.typedBuffer,s=e.typedBufferStride,c=o?o.count:e.count;let l=(o&&o.dstIndex?o.dstIndex:0)*s;for(let u=0;u<c;++u)a[l]=t,a[l+1]=r,a[l+2]=i,a[l+3]=n,l+=s}function tn(e,t){const r=e.count;t||(t=new e.TypedArrayConstructor(r));for(let i=0;i<r;i++)t[i]=e.get(i);return t}function rn(e,t){return new e(new ArrayBuffer(t*e.ElementCount*Object(Yi.a)(e.ElementType)))}Object.freeze({__proto__:null,copy:Ki,normalizeIntegerBuffer:Ji}),Object.freeze({__proto__:null,copy:Qi}),Object.freeze({__proto__:null,copy:Zi,fill:en}),Object.freeze({__proto__:null,copy:function(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let u=0;u<s;++u){for(let e=0;e<9;++e)i[c+e]=o[l+e];c+=n,l+=a}}}),Object.freeze({__proto__:null,copy:function(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let u=0;u<s;++u){for(let e=0;e<16;++e)i[c+e]=o[l+e];c+=n,l+=a}}}),Object.freeze({__proto__:null,copy:function(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let u=0;u<s;++u)i[c]=o[l],c+=n,l+=a},makeDense:tn});const nn=f.a.getLogger("esri.views.3d.glTF");var on=r("VJrH");class an{constructor(e){this.data=e,this.offset4=0,this.dataUint32=new Uint32Array(this.data,0,Math.floor(this.data.byteLength/4))}readUint32(){const e=this.offset4;return this.offset4+=1,this.dataUint32[e]}readUint8Array(e){const t=4*this.offset4;return this.offset4+=e/4,new Uint8Array(this.data,t,e)}remainingBytes(){return this.data.byteLength-4*this.offset4}}const sn={baseColorFactor:[1,1,1,1],metallicFactor:1,roughnessFactor:1},cn={pbrMetallicRoughness:sn,emissiveFactor:[0,0,0],alphaMode:"OPAQUE",alphaCutoff:.5,doubleSided:!1},ln={ESRI_externalColorMixMode:"tint"},un=(e={})=>{const t={...sn,...e.pbrMetallicRoughness},r=function(e){switch(e.ESRI_externalColorMixMode){case"multiply":case"tint":case"ignore":case"replace":break;default:Object(pi.a)(e.ESRI_externalColorMixMode),e.ESRI_externalColorMixMode="tint"}return e}({...ln,...e.extras});return{...cn,...e,pbrMetallicRoughness:t,extras:r}},dn={magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497},hn=1179937895;class fn{constructor(e,t,r,i,n){this.context=e,this.errorContext=t,this.uri=r,this.json=i,this.glbBuffer=n,this.bufferCache=new Map,this.textureCache=new Map,this.materialCache=new Map,this.nodeParentMap=new Map,this.nodeTransformCache=new Map,this.baseUri=function(e){let t,r;return e.replace(/^(.*\/)?([^/]*)$/,(e,i,n)=>(t=i||"",r=n||"","")),{dirPart:t,filePart:r}}(this.uri).dirPart,this.checkVersionSupported(),this.checkRequiredExtensionsSupported(),t.errorUnsupportedIf(null==i.scenes,"Scenes must be defined."),t.errorUnsupportedIf(null==i.meshes,"Meshes must be defined"),t.errorUnsupportedIf(null==i.nodes,"Nodes must be defined."),this.computeNodeParents()}static load(e,t,r,n){var o=this;return Object(i.a)(function*(){if(Object(vi.u)(r)){const i=Object(vi.i)(r);if("model/gltf-binary"!==i.mediaType)try{const n=JSON.parse(i.isBase64?atob(i.data):i.data);return new fn(e,t,r,n)}catch{}const n=Object(vi.j)(r);if(fn.isGLBData(n))return o.fromGLBData(e,t,r,n)}if(r.endsWith(".gltf")){const i=yield e.loadJSON(r,n);return new fn(e,t,r,i)}const i=yield e.loadBinary(r,n);if(fn.isGLBData(i))return o.fromGLBData(e,t,r,i);const a=yield e.loadJSON(r,n);return new fn(e,t,r,a)})()}static isGLBData(e){const t=new an(e);return t.remainingBytes()>=4&&t.readUint32()===hn}static fromGLBData(e,t,r,n){return Object(i.a)(function*(){const i=yield fn.parseGLBData(t,n);return new fn(e,t,r,i.json,i.binaryData)})()}static parseGLBData(e,t){return Object(i.a)(function*(){const r=new an(t);e.assert(r.remainingBytes()>=12,"GLB binary data is insufficiently large.");const i=r.readUint32(),n=r.readUint32(),o=r.readUint32();e.assert(i===hn,"Magic first 4 bytes do not fit to expected GLB value."),e.assert(t.byteLength>=o,"GLB binary data is smaller than header specifies."),e.errorUnsupportedIf(2!==n,"An unsupported GLB container version was detected. Only version 2 is supported.");let a,s,c=0;for(;r.remainingBytes()>=8;){const t=r.readUint32(),i=r.readUint32();0===c?(e.assert(1313821514===i,"First GLB chunk must be JSON."),e.assert(t>=0,"No JSON data found."),a=yield xn(r.readUint8Array(t))):1===c?(e.errorUnsupportedIf(5130562!==i,"Second GLB chunk expected to be BIN."),s=r.readUint8Array(t)):e.warnUnsupported("More than 2 GLB chunks detected. Skipping."),c+=1}return a||e.error("No GLB JSON chunk detected."),{json:a,binaryData:s}})()}getBuffer(e,t){var r=this;return Object(i.a)(function*(){const i=r.json.buffers[e],n=r.errorContext;if(null==i.uri)return n.assert(null!=r.glbBuffer,"GLB buffer not present"),r.glbBuffer;let o=r.bufferCache.get(e);if(!o){const a=yield r.context.loadBinary(r.resolveUri(i.uri),t);o=new Uint8Array(a),r.bufferCache.set(e,o),n.assert(o.byteLength===i.byteLength,"Buffer byte lengths should match.")}return o})()}getAccessor(e,t){var r=this;return Object(i.a)(function*(){const i=r.json.accessors[e],n=r.errorContext;n.errorUnsupportedIf(null==i.bufferView,"Some accessor does not specify a bufferView."),n.errorUnsupportedIf(i.type in["MAT2","MAT3","MAT4"],`AttributeType ${i.type} is not supported`);const o=r.json.bufferViews[i.bufferView],a=yield r.getBuffer(o.buffer,t),s=bn[i.type],c=vn[i.componentType],l=s*c,u=o.byteStride||l;return{raw:a.buffer,byteStride:u,byteOffset:a.byteOffset+(o.byteOffset||0)+(i.byteOffset||0),entryCount:i.count,isDenselyPacked:u===l,componentCount:s,componentByteSize:c,componentType:i.componentType,min:i.min,max:i.max,normalized:!!i.normalized}})()}getIndexData(e,t){var r=this;return Object(i.a)(function*(){if(null==e.indices)return null;const i=yield r.getAccessor(e.indices,t);if(i.isDenselyPacked)switch(i.componentType){case 5121:return new Uint8Array(i.raw,i.byteOffset,i.entryCount);case 5123:return new Uint16Array(i.raw,i.byteOffset,i.entryCount);case 5125:return new Uint32Array(i.raw,i.byteOffset,i.entryCount)}else switch(i.componentType){case 5121:return tn(r.wrapAccessor(h.l,i));case 5123:return tn(r.wrapAccessor(h.j,i));case 5125:return tn(r.wrapAccessor(h.k,i))}})()}getPositionData(e,t){var r=this;return Object(i.a)(function*(){const i=r.errorContext;i.errorUnsupportedIf(null==e.attributes.POSITION,"No POSITION vertex data found.");const n=yield r.getAccessor(e.attributes.POSITION,t);return i.errorUnsupportedIf(5126!==n.componentType,"Expected type FLOAT for POSITION vertex attribute, but found "+yn[n.componentType]),i.errorUnsupportedIf(3!==n.componentCount,"POSITION vertex attribute must have 3 components, but found "+n.componentCount.toFixed()),r.wrapAccessor(h.u,n)})()}getNormalData(e,t){var r=this;return Object(i.a)(function*(){const i=r.errorContext;i.assert(null!=e.attributes.NORMAL,"No NORMAL vertex data found.");const n=yield r.getAccessor(e.attributes.NORMAL,t);return i.errorUnsupportedIf(5126!==n.componentType,"Expected type FLOAT for NORMAL vertex attribute, but found "+yn[n.componentType]),i.errorUnsupportedIf(3!==n.componentCount,"NORMAL vertex attribute must have 3 components, but found "+n.componentCount.toFixed()),r.wrapAccessor(h.u,n)})()}getTangentData(e,t){var r=this;return Object(i.a)(function*(){const i=r.errorContext;i.assert(null!=e.attributes.TANGENT,"No TANGENT vertex data found.");const n=yield r.getAccessor(e.attributes.TANGENT,t);return i.errorUnsupportedIf(5126!==n.componentType,"Expected type FLOAT for TANGENT vertex attribute, but found "+yn[n.componentType]),i.errorUnsupportedIf(4!==n.componentCount,"TANGENT vertex attribute must have 4 components, but found "+n.componentCount.toFixed()),new h.C(n.raw,n.byteOffset,n.byteStride,n.byteOffset+n.byteStride*n.entryCount)})()}getTextureCoordinates(e,t){var r=this;return Object(i.a)(function*(){const i=r.errorContext;i.assert(null!=e.attributes.TEXCOORD_0,"No TEXCOORD_0 vertex data found.");const n=yield r.getAccessor(e.attributes.TEXCOORD_0,t);return i.errorUnsupportedIf(2!==n.componentCount,"TEXCOORD_0 vertex attribute must have 2 components, but found "+n.componentCount.toFixed()),5126===n.componentType?r.wrapAccessor(h.m,n):(i.errorUnsupportedIf(!n.normalized,"Integer component types are only supported for a normalized accessor for TEXCOORD_0."),function(e){switch(e.componentType){case 5120:return new h.q(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5121:return new h.t(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5122:return new h.o(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5123:return new h.r(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5125:return new h.s(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5126:return new h.m(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);default:return void Object(pi.a)(e.componentType)}}(n))})()}getVertexColors(e,t){var r=this;return Object(i.a)(function*(){const i=r.errorContext;i.assert(null!=e.attributes.COLOR_0,"No COLOR_0 vertex data found.");const n=yield r.getAccessor(e.attributes.COLOR_0,t);if(i.errorUnsupportedIf(4!==n.componentCount&&3!==n.componentCount,"COLOR_0 attribute must have 3 or 4 components, but found "+n.componentCount.toFixed()),4===n.componentCount){if(5126===n.componentType)return r.wrapAccessor(h.C,n);if(5121===n.componentType)return r.wrapAccessor(h.J,n);if(5123===n.componentType)return r.wrapAccessor(h.H,n)}else if(3===n.componentCount){if(5126===n.componentType)return r.wrapAccessor(h.u,n);if(5121===n.componentType)return r.wrapAccessor(h.B,n);if(5123===n.componentType)return r.wrapAccessor(h.z,n)}i.errorUnsupported("Unsupported component type for COLOR_0 attribute: "+yn[n.componentType])})()}hasPositions(e){return void 0!==e.attributes.POSITION}hasNormals(e){return void 0!==e.attributes.NORMAL}hasVertexColors(e){return void 0!==e.attributes.COLOR_0}hasTextureCoordinates(e){return void 0!==e.attributes.TEXCOORD_0}hasTangents(e){return void 0!==e.attributes.TANGENT}getMaterial(e,t,r){var n=this;return Object(i.a)(function*(){const i=n.errorContext;let o=n.materialCache.get(e.material);if(!o){const a=null!=e.material?un(n.json.materials[e.material]):un(),s=a.pbrMetallicRoughness,c=n.hasVertexColors(e);let l,u,d,h,f;s.baseColorTexture&&(i.errorUnsupportedIf(0!==(s.baseColorTexture.texCoord||0),"Only TEXCOORD with index 0 is supported."),l=yield n.getTexture(s.baseColorTexture.index,t)),a.normalTexture&&(0!==(a.normalTexture.texCoord||0)?i.warnUnsupported("Only TEXCOORD with index 0 is supported for the normal map texture."):u=yield n.getTexture(a.normalTexture.index,t)),a.occlusionTexture&&r&&(0!==(a.occlusionTexture.texCoord||0)?i.warnUnsupported("Only TEXCOORD with index 0 is supported for the occlusion texture."):d=yield n.getTexture(a.occlusionTexture.index,t)),a.emissiveTexture&&r&&(0!==(a.emissiveTexture.texCoord||0)?i.warnUnsupported("Only TEXCOORD with index 0 is supported for the emissive texture."):h=yield n.getTexture(a.emissiveTexture.index,t)),s.metallicRoughnessTexture&&r&&(0!==(s.metallicRoughnessTexture.texCoord||0)?i.warnUnsupported("Only TEXCOORD with index 0 is supported for the metallicRoughness texture."):f=yield n.getTexture(s.metallicRoughnessTexture.index,t)),o={alphaMode:a.alphaMode,alphaCutoff:a.alphaCutoff,color:s.baseColorFactor,doubleSided:!!a.doubleSided,colorTexture:l,normalTexture:u,name:a.name,id:null!=e.material?e.material:-1,occlusionTexture:d,emissiveTexture:h,emissiveFactor:a.emissiveFactor,metallicFactor:s.metallicFactor,roughnessFactor:s.roughnessFactor,metallicRoughnessTexture:f,vertexColors:c,ESRI_externalColorMixMode:a.extras.ESRI_externalColorMixMode}}return o})()}getTexture(e,t){var r=this;return Object(i.a)(function*(){const i=r.errorContext,n=r.json.textures[e],o=(e=>({...dn,...e}))(null!=n.sampler?r.json.samplers[n.sampler]:{});i.errorUnsupportedIf(null==n.source,"Source is expected to be defined for a texture.");const a=r.json.images[n.source];let s=r.textureCache.get(e);if(!s){let n;if(a.uri)n=yield r.context.loadImage(r.resolveUri(a.uri),t);else{i.errorUnsupportedIf(null==a.bufferView,"Image bufferView must be defined."),i.errorUnsupportedIf(null==a.mimeType,"Image mimeType must be defined.");const e=r.json.bufferViews[a.bufferView],o=yield r.getBuffer(e.buffer,t);i.errorUnsupportedIf(null!=e.byteStride,"byteStride not supported for image buffer"),n=yield function(e,t){return On.apply(this,arguments)}(new Uint8Array(o.buffer,o.byteOffset+(e.byteOffset||0),e.byteLength),a.mimeType)}s={data:n,wrapS:o.wrapS,wrapT:o.wrapT,minFilter:o.minFilter,name:a.name,id:e},r.textureCache.set(e,s)}return s})()}getNodeTransform(e){if(void 0===e)return pn;let t=this.nodeTransformCache.get(e);if(!t){const r=this.getNodeTransform(this.getNodeParent(e)),i=this.json.nodes[e];i.matrix?t=Object(s.g)(Object(u.b)(),r,i.matrix):i.translation||i.rotation||i.scale?(t=Object(u.c)(r),i.translation&&Object(s.j)(t,t,i.translation),i.rotation&&(gn[3]=Object(he.b)(gn,i.rotation),Object(s.h)(t,t,gn[3],gn)),i.scale&&Object(s.i)(t,t,i.scale)):t=r,this.nodeTransformCache.set(e,t)}return t}wrapAccessor(e,t){return new e(t.raw,t.byteOffset,t.byteStride,t.byteOffset+t.byteStride*(t.entryCount-1)+t.componentByteSize*t.componentCount)}resolveUri(e){return Object(vi.z)(e,this.baseUri)}getNodeParent(e){return this.nodeParentMap.get(e)}checkVersionSupported(){const e=on.a.parse(this.json.asset.version,"glTF");mn.validate(e)}checkRequiredExtensionsSupported(){const e=this.json;e.extensionsRequired&&0!==e.extensionsRequired.length&&this.errorContext.errorUnsupported("gltf loader was not able to load unsupported feature. Required extensions: "+e.extensionsRequired.join(", "))}computeNodeParents(){this.json.nodes.forEach((e,t)=>{e.children&&e.children.forEach(e=>{this.nodeParentMap.set(e,t)})})}}const mn=new on.a(2,0,"glTF"),pn=Object(s.f)(Object(u.b)(),Math.PI/2),gn=Object(C.a)(),bn={SCALAR:1,VEC2:2,VEC3:3,VEC4:4},vn={5120:1,5121:1,5122:2,5123:2,5126:4,5125:4};function xn(e){return _n.apply(this,arguments)}function _n(){return(_n=Object(i.a)(function*(e){return new Promise((t,r)=>{const i=new Blob([e]),n=new FileReader;n.onload=()=>{t(JSON.parse(n.result))},n.onerror=e=>{r(e)},n.readAsText(i)})})).apply(this,arguments)}function On(){return(On=Object(i.a)(function*(e,t){return new Promise((r,i)=>{const n=new Blob([e],{type:t}),o=URL.createObjectURL(n),a=new Image;a.addEventListener("load",()=>{URL.revokeObjectURL(o),"decode"in a?a.decode().then(()=>r(a),()=>r(a)):r(a)}),a.addEventListener("error",e=>{URL.revokeObjectURL(o),i(e)}),a.src=o})})).apply(this,arguments)}const yn={5120:"BYTE",5121:"UNSIGNED_BYTE",5122:"SHORT",5123:"UNSIGNED_SHORT",5125:"UNSIGNED_INT",5126:"FLOAT"};let Tn=0;function wn(e,t){return Sn.apply(this,arguments)}function Sn(){return(Sn=Object(i.a)(function*(e,t,r={},o=!0){const a=yield fn.load(e,Fn,t,r),s="gltf_"+Tn++,c={lods:[],materials:new Map,textures:new Map,meta:Mn(a)},l=!(!a.json.asset.extras||"symbolResource"!==a.json.asset.extras.ESRI_type);return yield An(a,function(){var e=Object(i.a)(function*(e,t,i,l){const d=void 0!==e.mode?e.mode:4,h=jn(d);if(Object(n.h)(h))return void Fn.warnUnsupported("Unsupported primitive mode ("+Rn[d]+"). Skipping primitive.");if(!a.hasPositions(e))return void Fn.warn("Skipping primitive without POSITION vertex attribute.");const f=yield a.getMaterial(e,r,o),m={transform:Object(u.c)(t),attributes:{position:yield a.getPositionData(e,r),normal:null,texCoord0:null,color:null,tangent:null},indices:yield a.getIndexData(e,r),primitiveType:h,material:En(c,f,s)};a.hasNormals(e)&&(m.attributes.normal=yield a.getNormalData(e,r)),a.hasTangents(e)&&(m.attributes.tangent=yield a.getTangentData(e,r)),a.hasTextureCoordinates(e)&&(m.attributes.texCoord0=yield a.getTextureCoordinates(e,r)),a.hasVertexColors(e)&&(m.attributes.color=yield a.getVertexColors(e,r));let p=null;Object(n.i)(c.meta)&&Object(n.i)(c.meta.ESRI_lod)&&"screenSpaceRadius"===c.meta.ESRI_lod.metric&&(p=c.meta.ESRI_lod.thresholds[i]),c.lods[i]=c.lods[i]||{parts:[],name:l,lodThreshold:p},c.lods[i].parts.push(m)});return function(t,r,i,n){return e.apply(this,arguments)}}()),{model:c,meta:{isEsriSymbolResource:l,uri:a.uri},customMeta:{}}})).apply(this,arguments)}function jn(e){switch(e){case 4:case 5:case 6:return e;default:return null}}function Mn(e){let t=null;return e.json.nodes.forEach(e=>{const r=e.extras;Object(n.i)(r)&&(r.ESRI_proxyEllipsoid||r.ESRI_lod)&&(t=r)}),t}function An(e,t){return Cn.apply(this,arguments)}function Cn(){return(Cn=Object(i.a)(function*(e,t){const r=e.json,n=r.scenes[r.scene||0].nodes,o=n.length>1;for(const i of n){const e=r.nodes[i],t=[a(i,0)];Pn(e)&&!o&&t.push(...e.extensions.MSFT_lod.ids.map((e,t)=>a(e,t+1))),yield Promise.all(t)}function a(e,t){return s.apply(this,arguments)}function s(){return(s=Object(i.a)(function*(i,n){const o=r.nodes[i],s=e.getNodeTransform(i);if(Fn.warnUnsupportedIf(null!=o.weights,"Morph targets are not supported."),null!=o.mesh){const e=r.meshes[o.mesh];for(const r of e.primitives)yield t(r,s,n,e.name)}for(const e of o.children||[])yield a(e,n)})).apply(this,arguments)}})).apply(this,arguments)}function Pn(e){return e.extensions&&e.extensions.MSFT_lod&&Array.isArray(e.extensions.MSFT_lod.ids)}function En(e,t,r){const i=t=>{const i=`${r}_tex_${t&&t.id}${t&&t.name?"_"+t.name:""}`;if(t&&!e.textures.has(i)){const r=function(e,t={}){return{data:e,parameters:{wrap:{s:10497,t:10497,...t.wrap},noUnpackFlip:!0,mipmap:!1,...t}}}(t.data,{wrap:{s:In(t.wrapS),t:In(t.wrapT)},mipmap:Dn.some(e=>e===t.minFilter),noUnpackFlip:!0});e.textures.set(i,r)}return i},n=`${r}_mat_${t.id}_${t.name}`;if(!e.materials.has(n)){const r=function(e={}){return{color:[1,1,1],opacity:1,alphaMode:"OPAQUE",alphaCutoff:.5,doubleSided:!1,castShadows:!0,receiveShadows:!0,receiveAmbientOcclustion:!0,textureColor:null,textureNormal:null,textureOcclusion:null,textureEmissive:null,textureMetallicRoughness:null,emissiveFactor:[0,0,0],metallicFactor:1,roughnessFactor:1,colorMixMode:"multiply",...e}}({color:[t.color[0],t.color[1],t.color[2]],opacity:t.color[3],alphaMode:t.alphaMode,alphaCutoff:t.alphaCutoff,doubleSided:t.doubleSided,colorMixMode:t.ESRI_externalColorMixMode,textureColor:t.colorTexture?i(t.colorTexture):void 0,textureNormal:t.normalTexture?i(t.normalTexture):void 0,textureOcclusion:t.occlusionTexture?i(t.occlusionTexture):void 0,textureEmissive:t.emissiveTexture?i(t.emissiveTexture):void 0,textureMetallicRoughness:t.metallicRoughnessTexture?i(t.metallicRoughnessTexture):void 0,emissiveFactor:[t.emissiveFactor[0],t.emissiveFactor[1],t.emissiveFactor[2]],metallicFactor:t.metallicFactor,roughnessFactor:t.roughnessFactor});e.materials.set(n,r)}return n}function In(e){if(33071===e||33648===e||10497===e)return e;Fn.error(`Unexpected TextureSampler WrapMode: ${e}`)}const Fn=new class{error(e){throw new bi.a("gltf-loader-error",e)}errorUnsupported(e){throw new bi.a("gltf-loader-unsupported-feature",e)}errorUnsupportedIf(e,t){e&&this.errorUnsupported(t)}assert(e,t){e||this.error(t)}warn(e){nn.warn(e)}warnUnsupported(e){this.warn("[Unsupported Feature] "+e)}warnUnsupportedIf(e,t){e&&this.warnUnsupported(t)}},Dn=[9987,9985],Rn=["POINTS","LINES","LINE_LOOP","LINE_STRIP","TRIANGLES","TRIANGLE_STRIP","TRIANGLE_FAN"],Ln=f.a.getLogger("esri.views.3d.layers.graphics.objectResourceUtils");function Bn(e,t){return Nn.apply(this,arguments)}function Nn(){return(Nn=Object(i.a)(function*(e,t){const r=yield zn(e,t);return{resource:r,textures:yield $n(r.textureDefinitions,t)}})).apply(this,arguments)}function zn(e,t){return Un.apply(this,arguments)}function Un(){return(Un=Object(i.a)(function*(e,t){const r=Object(n.i)(t)&&t.streamDataRequester;if(r)return Vn(e,r,t);const i=yield Object(qi.c)(Object(Wi.default)(e,Object(n.o)(t)));if(!0===i.ok)return i.value.data;Object(xi.t)(i.error),kn(i.error)})).apply(this,arguments)}function Vn(e,t,r){return Hn.apply(this,arguments)}function Hn(){return(Hn=Object(i.a)(function*(e,t,r){const i=yield Object(qi.c)(t.request(e,"json",r));if(!0===i.ok)return i.value;Object(xi.t)(i.error),kn(i.error.details.url)})).apply(this,arguments)}function kn(e){throw new bi.a("",`Request for object resource failed: ${e}`)}function Gn(e){const t=e.params,r=t.topology;let i=!0;switch(t.vertexAttributes||(Ln.warn("Geometry must specify vertex attributes"),i=!1),t.topology){case"PerAttributeArray":break;case"Indexed":case null:case void 0:{const e=t.faces;if(e){if(t.vertexAttributes)for(const r in t.vertexAttributes){const t=e[r];t&&t.values?(null!=t.valueType&&"UInt32"!==t.valueType&&(Ln.warn(`Unsupported indexed geometry indices type '${t.valueType}', only UInt32 is currently supported`),i=!1),null!=t.valuesPerElement&&1!==t.valuesPerElement&&(Ln.warn(`Unsupported indexed geometry values per element '${t.valuesPerElement}', only 1 is currently supported`),i=!1)):(Ln.warn(`Indexed geometry does not specify face indices for '${r}' attribute`),i=!1)}}else Ln.warn("Indexed geometries must specify faces"),i=!1;break}default:Ln.warn(`Unsupported topology '${r}'`),i=!1}e.params.material||(Ln.warn("Geometry requires material"),i=!1);const n=e.params.vertexAttributes;for(const o in n)n[o].values||(Ln.warn("Geometries with externally defined attributes are not yet supported"),i=!1);return i}function Wn(e,t){const r=[],i=[],a=[],s=[],c=e.resource,l=on.a.parse(c.version||"1.0","wosr");Jn.validate(l);const u=c.model.name,d=c.model.geometries,h=c.materialDefinitions,f=e.textures;let m=0;const p=new Map;for(let g=0;g<d.length;g++){const e=d[g];if(!Gn(e))continue;const c=Kn(e),l=e.params.vertexAttributes,u=[];for(const t in l){const e=l[t];u.push([t,{data:e.values,size:e.valuesPerElement,exclusive:!0}])}const b=[];if("PerAttributeArray"!==e.params.topology){const t=e.params.faces;for(const e in t)b.push([e,new Uint32Array(t[e].values)])}const v=f&&f[c.texture];if(v&&!p.has(c.texture)){const{image:e,params:t}=v,r=new Gi(e,t);s.push(r),p.set(c.texture,r)}const x=p.get(c.texture),_=x?x.id:void 0;let O=a[c.material]?a[c.material][c.texture]:null;if(!O){const e=h[c.material.substring(c.material.lastIndexOf("/")+1)].params;1===e.transparency&&(e.transparency=0);const r=v&&v.alphaChannelUsage,i=e.transparency>0||"transparency"===r||"maskAndTransparency"===r,s={ambient:Object(o.f)(e.diffuse),diffuse:Object(o.f)(e.diffuse),opacity:1-(e.transparency||0),transparent:i,textureAlphaMode:v?Yn(v.alphaChannelUsage):void 0,textureAlphaCutoff:.33,textureId:_,initTextureTransparent:!0,doubleSided:!0,cullFace:0,colorMixMode:e.externalColorMixMode||"tint",textureAlphaPremultiplied:!0};Object(n.i)(t)&&t.materialParamsMixin&&Object.assign(s,t.materialParamsMixin),O=new ni(s),a[c.material]||(a[c.material]={}),a[c.material][c.texture]=O}i.push(O);const y=new ce(u,b);m+=b.position?b.position.length:0,r.push(y)}return{name:u,stageResources:{textures:s,materials:i,geometries:r},pivotOffset:c.model.pivotOffset,boundingBox:qn(r),numberOfVertices:m,lodThreshold:null}}function qn(e){const t=Object(v.c)();return e.forEach(e=>{const r=e.boundingInfo;Object(n.i)(r)&&(Object(v.g)(t,r.getBBMin()),Object(v.g)(t,r.getBBMax()))}),t}function $n(e,t){return Xn.apply(this,arguments)}function Xn(){return(Xn=Object(i.a)(function*(e,t){const r=[];for(const a in e){const i=e[a],o=i.images[0].data;if(!o){Ln.warn("Externally referenced texture data is not yet supported");continue}const s=i.encoding+";base64,"+o,c="/textureDefinitions/"+a,l={noUnpackFlip:!0,wrap:{s:10497,t:10497},preMultiplyAlpha:!0},u=Object(n.i)(t)&&t.disableTextures?Promise.resolve(null):Object(yi.a)(s,t);r.push(u.then(e=>({refId:c,image:e,params:l,alphaChannelUsage:"rgba"===i.channels?i.alphaChannelUsage||"transparency":"none"})))}const i=yield Promise.all(r),o={};for(const n of i)o[n.refId]=n;return o})).apply(this,arguments)}function Yn(e){switch(e){case"mask":return 2;case"maskAndTransparency":return 3;case"none":return 1;case"transparency":default:return 0}}function Kn(e){const t=e.params;return{id:1,material:t.material,texture:t.texture,region:t.texture}}const Jn=new on.a(1,2,"wosr");function Qn(e,t,r){if(e.count!==t.count)return void m.error("source and destination buffers need to have the same number of elements");const i=e.count,n=r[0],o=r[1],a=r[2],s=r[3],c=r[4],l=r[5],u=r[6],d=r[7],h=r[8],f=e.typedBuffer,p=e.typedBufferStride,g=t.typedBuffer,b=t.typedBufferStride;for(let m=0;m<i;m++){const e=m*p,t=m*b,r=g[t],i=g[t+1],v=g[t+2],x=g[t+3];f[e]=n*r+s*i+u*v,f[e+1]=o*r+c*i+d*v,f[e+2]=a*r+l*i+h*v,f[e+3]=x}}function Zn(e,t,r){const i=Math.min(e.count,t.count),n=e.typedBuffer,o=e.typedBufferStride,a=t.typedBuffer,s=t.typedBufferStride;for(let c=0;c<i;c++){const e=c*o,t=c*s;n[e]=r*a[t],n[e+1]=r*a[t+1],n[e+2]=r*a[t+2],n[e+3]=r*a[t+3]}}function eo(e,t){return to.apply(this,arguments)}function to(){return(to=Object(i.a)(function*(e,t){const r=ro(Object(c.a)(e));if("wosr"===r.fileType){const e=yield t.cache?t.cache.loadWOSR(r.url,t):Bn(r.url,t),i=Wn(e,t);return{lods:[i],referenceBoundingBox:i.boundingBox,isEsriSymbolResource:!1,isWosr:!0,remove:e.remove}}const i=yield t.cache?t.cache.loadGLTF(r.url,t,t.usePBR):wn(new $i(t.streamDataRequester),r.url,t,t.usePBR),o=Object(n.g)(i.model.meta,"ESRI_proxyEllipsoid");i.meta.isEsriSymbolResource&&Object(n.i)(o)&&-1!==i.meta.uri.indexOf("/RealisticTrees/")&&oo(i,o);const a=i.meta.isEsriSymbolResource?{usePBR:t.usePBR,isSchematic:!1,treeRendering:i.customMeta.esriTreeRendering,mrrFactors:[0,1,.2]}:{usePBR:t.usePBR,isSchematic:!1,mrrFactors:[0,1,.5]},s={...t.materialParamsMixin,treeRendering:i.customMeta.esriTreeRendering};if(null!=r.specifiedLodIndex){const e=io(i,a,s,r.specifiedLodIndex);let t=e[0].boundingBox;return 0!==r.specifiedLodIndex&&(t=io(i,a,s,0)[0].boundingBox),{lods:e,referenceBoundingBox:t,isEsriSymbolResource:i.meta.isEsriSymbolResource,isWosr:!1,remove:i.remove}}const l=io(i,a,s);return{lods:l,referenceBoundingBox:l[0].boundingBox,isEsriSymbolResource:i.meta.isEsriSymbolResource,isWosr:!1,remove:i.remove}})).apply(this,arguments)}function ro(e){const t=e.match(/(.*\.(gltf|glb))(\?lod=([0-9]+))?$/);return t?{fileType:"gltf",url:t[1],specifiedLodIndex:null!=t[4]?Number(t[4]):null}:e.match(/(.*\.(json|json\.gz))$/)?{fileType:"wosr",url:e,specifiedLodIndex:null}:{fileType:"unknown",url:e,specifiedLodIndex:null}}function io(e,t,r,i){const o=e.model,a=Object(l.a)(),s=new Array,c=new Map,u=new Map;return o.lods.forEach((e,l)=>{if(void 0!==i&&l!==i)return;const f={name:e.name,stageResources:{textures:new Array,materials:new Array,geometries:new Array},lodThreshold:Object(n.i)(e.lodThreshold)?e.lodThreshold:null,pivotOffset:[0,0,0],numberOfVertices:0,boundingBox:Object(v.c)()};s.push(f),e.parts.forEach(e=>{const i=e.material+(e.attributes.normal?"_normal":"")+(e.attributes.color?"_color":"")+(e.attributes.texCoord0?"_texCoord0":"")+(e.attributes.tangent?"_tangent":""),s=o.materials.get(e.material),l=Object(n.i)(e.attributes.texCoord0),m=Object(n.i)(e.attributes.normal);if(!c.has(i)){if(l){if(Object(n.i)(s.textureColor)&&!u.has(s.textureColor)){const e=o.textures.get(s.textureColor),t={...e.parameters,preMultiplyAlpha:!0};u.set(s.textureColor,new Gi(e.data,t))}if(Object(n.i)(s.textureNormal)&&!u.has(s.textureNormal)){const e=o.textures.get(s.textureNormal),t={...e.parameters,preMultiplyAlpha:!0};u.set(s.textureNormal,new Gi(e.data,t))}if(Object(n.i)(s.textureOcclusion)&&!u.has(s.textureOcclusion)){const e=o.textures.get(s.textureOcclusion),t={...e.parameters,preMultiplyAlpha:!0};u.set(s.textureOcclusion,new Gi(e.data,t))}if(Object(n.i)(s.textureEmissive)&&!u.has(s.textureEmissive)){const e=o.textures.get(s.textureEmissive),t={...e.parameters,preMultiplyAlpha:!0};u.set(s.textureEmissive,new Gi(e.data,t))}if(Object(n.i)(s.textureMetallicRoughness)&&!u.has(s.textureMetallicRoughness)){const e=o.textures.get(s.textureMetallicRoughness),t={...e.parameters,preMultiplyAlpha:!0};u.set(s.textureMetallicRoughness,new Gi(e.data,t))}}const a=s.color[0]**.47619047619047616,d=s.color[1]**.47619047619047616,h=s.color[2]**.47619047619047616,f=s.emissiveFactor[0]**.47619047619047616,p=s.emissiveFactor[1]**.47619047619047616,g=s.emissiveFactor[2]**.47619047619047616;c.set(i,new ni({...t,transparent:"BLEND"===s.alphaMode,textureAlphaMode:no(s.alphaMode),textureAlphaCutoff:s.alphaCutoff,diffuse:[a,d,h],ambient:[a,d,h],opacity:s.opacity,doubleSided:s.doubleSided,doubleSidedType:"winding-order",cullFace:s.doubleSided?0:2,vertexColors:!!e.attributes.color,vertexTangents:!!e.attributes.tangent,normals:m?"default":"screenDerivative",castShadows:!0,receiveSSAO:!0,textureId:Object(n.i)(s.textureColor)&&l?u.get(s.textureColor).id:void 0,colorMixMode:s.colorMixMode,normalTextureId:Object(n.i)(s.textureNormal)&&l?u.get(s.textureNormal).id:void 0,textureAlphaPremultiplied:!0,occlusionTextureId:Object(n.i)(s.textureOcclusion)&&l?u.get(s.textureOcclusion).id:void 0,emissiveTextureId:Object(n.i)(s.textureEmissive)&&l?u.get(s.textureEmissive).id:void 0,metallicRoughnessTextureId:Object(n.i)(s.textureMetallicRoughness)&&l?u.get(s.textureMetallicRoughness).id:void 0,emissiveFactor:[f,p,g],mrrFactors:[s.metallicFactor,s.roughnessFactor,t.mrrFactors[2]],isSchematic:!1,...r}))}const x=function(e,t){switch(t){case 4:return function(e){return"number"==typeof e?ie(e):Object(gi.i)(e)||Object(gi.k)(e)?new Uint32Array(e):e}(e);case 5:return function(e){const t="number"==typeof e?e:e.length;if(t<3)return new Uint16Array(0);const r=t-2,i=r<=65536?new Uint16Array(3*r):new Uint32Array(3*r);if("number"==typeof e){let e=0;for(let t=0;t<r;t+=1)t%2==0?(i[e++]=t,i[e++]=t+1,i[e++]=t+2):(i[e++]=t+1,i[e++]=t,i[e++]=t+2)}else{let t=0;for(let n=0;n<r;n+=1)if(n%2==0){const r=e[n+1],o=e[n+2];i[t++]=e[n],i[t++]=r,i[t++]=o}else{const r=e[n],o=e[n+2];i[t++]=e[n+1],i[t++]=r,i[t++]=o}}return i}(e);case 6:return function(e){const t="number"==typeof e?e:e.length;if(t<3)return new Uint16Array(0);const r=t-2,i=r<=65536?new Uint16Array(3*r):new Uint32Array(3*r);if("number"==typeof e){let e=0;for(let t=0;t<r;++t)i[e++]=0,i[e++]=t+1,i[e++]=t+2;return i}{const t=e[0];let n=e[1],o=0;for(let a=0;a<r;++a){const r=e[a+2];i[o++]=t,i[o++]=n,i[o++]=r,n=r}return i}}(e)}}(e.indices||e.attributes.position.count,e.primitiveType),_=e.attributes.position.count,O=rn(h.u,_);p(O,e.attributes.position,e.transform);const y=[["position",{data:O.typedBuffer,size:O.elementCount,exclusive:!0}]],T=[["position",x]];if(Object(n.i)(e.attributes.normal)){const t=rn(h.u,_);Object(d.g)(a,e.transform),g(t,e.attributes.normal,a),y.push(["normal",{data:t.typedBuffer,size:t.elementCount,exclusive:!0}]),T.push(["normal",x])}if(Object(n.i)(e.attributes.tangent)){const t=rn(h.C,_);Object(d.g)(a,e.transform),Qn(t,e.attributes.tangent,a),y.push(["tangent",{data:t.typedBuffer,size:t.elementCount,exclusive:!0}]),T.push(["tangent",x])}if(Object(n.i)(e.attributes.texCoord0)){const t=rn(h.m,_);Ji(t,e.attributes.texCoord0),y.push(["uv0",{data:t.typedBuffer,size:t.elementCount,exclusive:!0}]),T.push(["uv0",x])}if(Object(n.i)(e.attributes.color)){const t=rn(h.J,_);if(4===e.attributes.color.elementCount)e.attributes.color instanceof h.C?Zn(t,e.attributes.color,255):e.attributes.color instanceof h.J?Zi(t,e.attributes.color):e.attributes.color instanceof h.H&&Zn(t,e.attributes.color,1/256);else{en(t,255,255,255,255);const r=new h.B(t.buffer,0,4);e.attributes.color instanceof h.u?b(r,e.attributes.color,255):e.attributes.color instanceof h.B?Qi(r,e.attributes.color):e.attributes.color instanceof h.z&&b(r,e.attributes.color,1/256)}y.push(["color",{data:t.typedBuffer,size:t.elementCount,exclusive:!0}]),T.push(["color",x])}const w=new ce(y,T);f.stageResources.geometries.push(w),f.stageResources.materials.push(c.get(i)),l&&(Object(n.i)(s.textureColor)&&f.stageResources.textures.push(u.get(s.textureColor)),Object(n.i)(s.textureNormal)&&f.stageResources.textures.push(u.get(s.textureNormal)),Object(n.i)(s.textureOcclusion)&&f.stageResources.textures.push(u.get(s.textureOcclusion)),Object(n.i)(s.textureEmissive)&&f.stageResources.textures.push(u.get(s.textureEmissive)),Object(n.i)(s.textureMetallicRoughness)&&f.stageResources.textures.push(u.get(s.textureMetallicRoughness))),f.numberOfVertices+=_;const S=w.boundingInfo;Object(n.i)(S)&&(Object(v.g)(f.boundingBox,S.getBBMin()),Object(v.g)(f.boundingBox,S.getBBMax()))})}),s}function no(e){switch(e){case"BLEND":return 0;case"MASK":return 2;case"OPAQUE":return 1;default:return 0}}function oo(e,t){for(let r=0;r<e.model.lods.length;++r){const i=e.model.lods[r];e.customMeta.esriTreeRendering=!0;for(const c of i.parts){const i=c.attributes.normal;if(Object(n.h)(i))return;const l=c.attributes.position,d=l.count,f=Object(o.e)(),m=Object(o.e)(),p=Object(o.e)(),g=rn(h.J,d),b=rn(h.u,d),v=Object(s.a)(Object(u.b)(),c.transform);for(let n=0;n<d;n++){l.getVec(n,m),i.getVec(n,f),Object(a.j)(m,m,c.transform),Object(a.g)(p,m,t.center),Object(a.a)(p,p,t.radius);const o=p[2],s=Object(a.m)(p),u=Math.min(.45+.55*s*s,1);Object(a.a)(p,p,t.radius),Object(a.j)(p,p,v),Object(a.o)(p,p),r+1!==e.model.lods.length&&e.model.lods.length>1&&Object(a.f)(p,p,f,o>-1?.2:Math.min(-4*o-3.8,1)),b.setVec(n,p),g.set(n,0,255*u),g.set(n,1,255*u),g.set(n,2,255*u),g.set(n,3,255)}c.attributes.normal=b,c.attributes.color=g}}}Object.freeze({__proto__:null,transformMat4:function(e,t,r){if(e.count!==t.count)return void m.error("source and destination buffers need to have the same number of elements");const i=e.count,n=r[0],o=r[1],a=r[2],s=r[3],c=r[4],l=r[5],u=r[6],d=r[7],h=r[8],f=r[9],p=r[10],g=r[11],b=r[12],v=r[13],x=r[14],_=r[15],O=e.typedBuffer,y=e.typedBufferStride,T=t.typedBuffer,w=t.typedBufferStride;for(let m=0;m<i;m++){const e=m*y,t=m*w,r=T[t],i=T[t+1],S=T[t+2],j=T[t+3];O[e]=n*r+c*i+h*S+b*j,O[e+1]=o*r+l*i+f*S+v*j,O[e+2]=a*r+u*i+p*S+x*j,O[e+3]=s*r+d*i+g*S+_*j}},transformMat3:Qn,scale:Zn,shiftRight:function(e,t,r){const i=Math.min(e.count,t.count),n=e.typedBuffer,o=e.typedBufferStride,a=t.typedBuffer,s=t.typedBufferStride;for(let c=0;c<i;c++){const e=c*o,t=c*s;n[e]=a[t]>>r,n[e+1]=a[t+1]>>r,n[e+2]=a[t+2]>>r,n[e+3]=a[t+3]>>r}}})},lwwL:function(e,t,r){"use strict";function i(){const e=new Float32Array(16);return e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}r.d(t,"a",function(){return i});const n=i();Object.freeze({__proto__:null,create:i,clone:function(e){const t=new Float32Array(16);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},fromValues:function(e,t,r,i,n,o,a,s,c,l,u,d,h,f,m,p){const g=new Float32Array(16);return g[0]=e,g[1]=t,g[2]=r,g[3]=i,g[4]=n,g[5]=o,g[6]=a,g[7]=s,g[8]=c,g[9]=l,g[10]=u,g[11]=d,g[12]=h,g[13]=f,g[14]=m,g[15]=p,g},createView:function(e,t){return new Float32Array(e,t,16)},IDENTITY:n})},mmTy:function(e,t,r){"use strict";function i(e,t,r){for(let i=0;i<r;++i)t[2*i]=e[i],t[2*i+1]=e[i]-t[2*i]}function n(e,t,r,n){for(let s=0;s<n;++s)o[0]=e[s],i(o,a,1),t[s]=a[0],r[s]=a[1]}r.d(t,"a",function(){return i}),r.d(t,"b",function(){return n});const o=new Float64Array(1),a=new Float32Array(2)},n4uK:function(e,t,r){"use strict";r.d(t,"a",function(){return a}),r.d(t,"b",function(){return n}),r.d(t,"c",function(){return o});var i=r("X2wA"),n=Object(i.b)(function(e){var t;void 0!==(t=["precision","highp","mediump","lowp","attribute","const","uniform","varying","break","continue","do","for","while","if","else","in","out","inout","float","int","void","bool","true","false","discard","return","mat2","mat3","mat4","vec2","vec3","vec4","ivec2","ivec3","ivec4","bvec2","bvec3","bvec4","sampler1D","sampler2D","sampler3D","samplerCube","sampler1DShadow","sampler2DShadow","struct","asm","class","union","enum","typedef","template","this","packed","goto","switch","default","inline","noinline","volatile","public","static","extern","external","interface","long","short","double","half","fixed","unsigned","input","output","hvec2","hvec3","hvec4","dvec2","dvec3","dvec4","fvec2","fvec3","fvec4","sampler2DRect","sampler3DRect","sampler2DRectShadow","sizeof","cast","namespace","using"])&&(e.exports=t)}),o=Object(i.b)(function(e){var t;void 0!==(t=["<<=",">>=","++","--","<<",">>","<=",">=","==","!=","&&","||","+=","-=","*=","/=","%=","&=","^^","^=","|=","(",")","[","]",".","!","~","*","/","%","+","-","<",">","&","^","|","?",":","=",",",";","{","}"])&&(e.exports=t)}),a=Object(i.b)(function(e){var t;void 0!==(t=["abs","acos","all","any","asin","atan","ceil","clamp","cos","cross","dFdx","dFdy","degrees","distance","dot","equal","exp","exp2","faceforward","floor","fract","gl_BackColor","gl_BackLightModelProduct","gl_BackLightProduct","gl_BackMaterial","gl_BackSecondaryColor","gl_ClipPlane","gl_ClipVertex","gl_Color","gl_DepthRange","gl_DepthRangeParameters","gl_EyePlaneQ","gl_EyePlaneR","gl_EyePlaneS","gl_EyePlaneT","gl_Fog","gl_FogCoord","gl_FogFragCoord","gl_FogParameters","gl_FragColor","gl_FragCoord","gl_FragData","gl_FragDepth","gl_FragDepthEXT","gl_FrontColor","gl_FrontFacing","gl_FrontLightModelProduct","gl_FrontLightProduct","gl_FrontMaterial","gl_FrontSecondaryColor","gl_LightModel","gl_LightModelParameters","gl_LightModelProducts","gl_LightProducts","gl_LightSource","gl_LightSourceParameters","gl_MaterialParameters","gl_MaxClipPlanes","gl_MaxCombinedTextureImageUnits","gl_MaxDrawBuffers","gl_MaxFragmentUniformComponents","gl_MaxLights","gl_MaxTextureCoords","gl_MaxTextureImageUnits","gl_MaxTextureUnits","gl_MaxVaryingFloats","gl_MaxVertexAttribs","gl_MaxVertexTextureImageUnits","gl_MaxVertexUniformComponents","gl_ModelViewMatrix","gl_ModelViewMatrixInverse","gl_ModelViewMatrixInverseTranspose","gl_ModelViewMatrixTranspose","gl_ModelViewProjectionMatrix","gl_ModelViewProjectionMatrixInverse","gl_ModelViewProjectionMatrixInverseTranspose","gl_ModelViewProjectionMatrixTranspose","gl_MultiTexCoord0","gl_MultiTexCoord1","gl_MultiTexCoord2","gl_MultiTexCoord3","gl_MultiTexCoord4","gl_MultiTexCoord5","gl_MultiTexCoord6","gl_MultiTexCoord7","gl_Normal","gl_NormalMatrix","gl_NormalScale","gl_ObjectPlaneQ","gl_ObjectPlaneR","gl_ObjectPlaneS","gl_ObjectPlaneT","gl_Point","gl_PointCoord","gl_PointParameters","gl_PointSize","gl_Position","gl_ProjectionMatrix","gl_ProjectionMatrixInverse","gl_ProjectionMatrixInverseTranspose","gl_ProjectionMatrixTranspose","gl_SecondaryColor","gl_TexCoord","gl_TextureEnvColor","gl_TextureMatrix","gl_TextureMatrixInverse","gl_TextureMatrixInverseTranspose","gl_TextureMatrixTranspose","gl_Vertex","greaterThan","greaterThanEqual","inversesqrt","length","lessThan","lessThanEqual","log","log2","matrixCompMult","max","min","mix","mod","normalize","not","notEqual","pow","radians","reflect","refract","sign","sin","smoothstep","sqrt","step","tan","texture2D","texture2DLod","texture2DProj","texture2DProjLod","textureCube","textureCubeLod","texture2DLodEXT","texture2DProjLodEXT","textureCubeLodEXT","texture2DGradEXT","texture2DProjGradEXT","textureCubeGradEXT"])&&(e.exports=t)})},of9L:function(e,t,r){"use strict";var i=r("srIe"),n=r("OKTS"),o=r("xRQN");class a{constructor(e,t,r=null){this._context=null,this._glName=null,this._descriptor=void 0,this._samplingModeDirty=!1,this._wrapModeDirty=!1,e.instanceCounter.increment(0,this),this._context=e,this._descriptor={target:3553,samplingMode:9729,wrapMode:10497,flipped:!1,hasMipmap:!1,isOpaque:!1,unpackAlignment:4,preMultiplyAlpha:!1,...t},this.setData(r)}get glName(){return this._glName}get descriptor(){return this._descriptor}dispose(){if(this._context&&this._context.gl){if(this._glName){const e=this._context.gl;this._context.unbindTextureAllUnits(this),e.deleteTexture(this._glName),this._glName=null}this._context.instanceCounter.decrement(0,this),this._context=null}}release(){this.dispose()}resize(e,t){const r=this._descriptor;r.width===e&&r.height===t||(r.width=e,r.height=t,this.setData(null))}setData(e){if(!this._context||!this._context.gl)return;const t=this._context.gl;this._glName||(this._glName=t.createTexture()),void 0===e&&(e=null),null===e&&(this._descriptor.width=this._descriptor.width||4,this._descriptor.height=this._descriptor.height||4);const r=this._context.getBoundTexture(0);this._context.bindTexture(this,0);const n=this._descriptor;a._validateTexture(this._context,n),t.pixelStorei(t.UNPACK_ALIGNMENT,n.unpackAlignment),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,n.flipped?1:0),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.preMultiplyAlpha?1:0);const o=n.pixelFormat;let s=n.internalFormat?n.internalFormat:o;if(e instanceof ImageData||e instanceof HTMLImageElement||e instanceof HTMLCanvasElement||e instanceof HTMLVideoElement){let r=e.width,i=e.height;e instanceof HTMLVideoElement&&(r=e.videoWidth,i=e.videoHeight),n.width&&n.height&&console.assert(r===n.width&&i===n.height),t.texImage2D(t.TEXTURE_2D,0,s,o,n.dataType,e),n.hasMipmap&&this.generateMipmap(),void 0===n.width&&(n.width=r),void 0===n.height&&(n.height=i)}else{null!=n.width&&null!=n.height||console.error("Width and height must be specified!"),t.DEPTH24_STENCIL8&&s===t.DEPTH_STENCIL&&(s=t.DEPTH24_STENCIL8);let r=n.width,a=n.height;if(function(e){return Object(i.i)(e)&&"type"in e&&"compressed"===e.type}(e)){const i=Math.round(Math.log(Math.max(r,a))/Math.LN2)+1;n.hasMipmap=n.hasMipmap&&i===e.levels.length;for(let o=0;;++o){const i=e.levels[Math.min(o,e.levels.length-1)];if(t.compressedTexImage2D(t.TEXTURE_2D,o,s,r,a,0,i),1===r&&1===a||!n.hasMipmap)break;r=Math.max(1,r>>1),a=Math.max(1,a>>1)}}else if(Object(i.i)(e))t.texImage2D(t.TEXTURE_2D,0,s,r,a,0,o,n.dataType,e),n.hasMipmap&&this.generateMipmap();else for(let e=0;t.texImage2D(t.TEXTURE_2D,e,s,r,a,0,o,n.dataType,null),(1!==r||1!==a)&&n.hasMipmap;++e)r=Math.max(1,r>>1),a=Math.max(1,a>>1)}a._applySamplingMode(t,this._descriptor),a._applyWrapMode(t,this._descriptor),a._applyAnisotropicFilteringParameters(this._context,this._descriptor),r&&this._context.bindTexture(r,0)}updateData(e,t,r,i,n,o){o||console.error("An attempt to use uninitialized data!"),this._glName||console.error("An attempt to update uninitialized texture!");const a=this._context.gl,s=this._descriptor,c=this._context.getBoundTexture(0);this._context.bindTexture(this,0),(t<0||r<0||i>s.width||n>s.height||t+i>s.width||r+n>s.height)&&console.error("An attempt to update out of bounds of the texture!"),a.pixelStorei(a.UNPACK_ALIGNMENT,s.unpackAlignment),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,s.flipped?1:0),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,s.preMultiplyAlpha?1:0),o instanceof ImageData||o instanceof HTMLImageElement||o instanceof HTMLCanvasElement||o instanceof HTMLVideoElement?a.texSubImage2D(a.TEXTURE_2D,e,t,r,s.pixelFormat,s.dataType,o):a.texSubImage2D(a.TEXTURE_2D,e,t,r,i,n,s.pixelFormat,s.dataType,o),this._context.bindTexture(c,0)}generateMipmap(){const e=this._descriptor;e.hasMipmap||(e.hasMipmap=!0,this._samplingModeDirty=!0,a._validateTexture(this._context,e)),9729===e.samplingMode?(this._samplingModeDirty=!0,e.samplingMode=9985):9728===e.samplingMode&&(this._samplingModeDirty=!0,e.samplingMode=9984);const t=this._context.getBoundTexture(0);this._context.bindTexture(this,0);const r=this._context.gl;r.generateMipmap(r.TEXTURE_2D),this._context.bindTexture(t,0)}setSamplingMode(e){e!==this._descriptor.samplingMode&&(this._descriptor.samplingMode=e,a._validateTexture(this._context,this._descriptor),this._samplingModeDirty=!0)}setWrapMode(e){e!==this._descriptor.wrapMode&&(this._descriptor.wrapMode=e,a._validateTexture(this._context,this._descriptor),this._wrapModeDirty=!0)}applyChanges(){const e=this._context.gl,t=this._descriptor;this._samplingModeDirty&&(a._applySamplingMode(e,t),this._samplingModeDirty=!1),this._wrapModeDirty&&(a._applyWrapMode(e,t),this._wrapModeDirty=!1)}static _validateTexture(e,t){(t.width<0||t.height<0)&&console.error("Negative dimension parameters are not allowed!");const r=Object(n.f)(t.width)&&Object(n.f)(t.height);Object(o.a)(e.gl)||r||("number"==typeof t.wrapMode?33071!==t.wrapMode&&console.error("Non-power-of-two textures must have a wrap mode of CLAMP_TO_EDGE!"):33071===t.wrapMode.s&&33071===t.wrapMode.t||console.error("Non-power-of-two textures must have a wrap mode of CLAMP_TO_EDGE!"),t.hasMipmap&&console.error("Mipmapping requires power-of-two textures!"))}static _applySamplingMode(e,t){let r=t.samplingMode,i=t.samplingMode;9985===r||9987===r?(r=9729,t.hasMipmap||(i=9729)):9984!==r&&9986!==r||(r=9728,t.hasMipmap||(i=9728)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,i)}static _applyWrapMode(e,t){"number"==typeof t.wrapMode?(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,t.wrapMode),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,t.wrapMode)):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,t.wrapMode.s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,t.wrapMode.t))}static _applyAnisotropicFilteringParameters(e,t){if(null==t.maxAnisotropy)return;const r=e.capabilities.textureFilterAnisotropic;if(!r)return;const i=e.gl;i.texParameterf(i.TEXTURE_2D,r.TEXTURE_MAX_ANISOTROPY,t.maxAnisotropy)}}t.a=a},p9cc:function(e,t,r){"use strict";r.d(t,"a",function(){return a});var i=r("OIYib"),n=r("R/jG"),o=r("fLTx");function a(e,t){const r=e.fragment,n=t.hasMetalnessAndRoughnessTexture||t.hasEmissionTexture||t.hasOcclusionTexture;1===t.pbrMode&&n&&e.include(o.a,t),2!==t.pbrMode?(0===t.pbrMode&&r.code.add(i.a`
      float getBakedOcclusion() { return 1.0; }
  `),1===t.pbrMode&&(r.uniforms.add("emissionFactor","vec3"),r.uniforms.add("mrrFactors","vec3"),r.code.add(i.a`
      vec3 mrr;
      vec3 emission;
      float occlusion;
    `),t.hasMetalnessAndRoughnessTexture&&(r.uniforms.add("texMetallicRoughness","sampler2D"),t.supportsTextureAtlas&&r.uniforms.add("texMetallicRoughnessSize","vec2"),r.code.add(i.a`
      void applyMetallnessAndRoughness(TextureLookupParameter params) {
        vec3 metallicRoughness = textureLookup(texMetallicRoughness, params).rgb;

        mrr[0] *= metallicRoughness.b;
        mrr[1] *= metallicRoughness.g;
      }`)),t.hasEmissionTexture&&(r.uniforms.add("texEmission","sampler2D"),t.supportsTextureAtlas&&r.uniforms.add("texEmissionSize","vec2"),r.code.add(i.a`
      void applyEmission(TextureLookupParameter params) {
        emission *= textureLookup(texEmission, params).rgb;
      }`)),t.hasOcclusionTexture?(r.uniforms.add("texOcclusion","sampler2D"),t.supportsTextureAtlas&&r.uniforms.add("texOcclusionSize","vec2"),r.code.add(i.a`
      void applyOcclusion(TextureLookupParameter params) {
        occlusion *= textureLookup(texOcclusion, params).r;
      }

      float getBakedOcclusion() {
        return occlusion;
      }
      `)):r.code.add(i.a`
      float getBakedOcclusion() { return 1.0; }
      `),r.code.add(i.a`
    void applyPBRFactors() {
      mrr = mrrFactors;
      emission = emissionFactor;
      occlusion = 1.0;
      ${n?"vtc.uv = vuv0;":""}
      ${t.hasMetalnessAndRoughnessTexture?t.supportsTextureAtlas?"vtc.size = texMetallicRoughnessSize; applyMetallnessAndRoughness(vtc);":"applyMetallnessAndRoughness(vtc);":""}
      ${t.hasEmissionTexture?t.supportsTextureAtlas?"vtc.size = texEmissionSize; applyEmission(vtc);":"applyEmission(vtc);":""}
      ${t.hasOcclusionTexture?t.supportsTextureAtlas?"vtc.size = texOcclusionSize; applyOcclusion(vtc);":"applyOcclusion(vtc);":""}
    }
  `))):r.code.add(i.a`
      const vec3 mrr = vec3(0.0, 0.6, 0.2);
      const vec3 emission = vec3(0.0);
      float occlusion = 1.0;

      void applyPBRFactors() {}

      float getBakedOcclusion() { return 1.0; }
    `)}Object(n.b)(0,.6,.2),(a||(a={})).bindUniforms=function(e,t,r=!1){r||(e.setUniform3fv("mrrFactors",t.mrrFactors),e.setUniform3fv("emissionFactor",t.emissiveFactor))}},qrV2:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e,t){const r=e.fragment;r.code.add(i.a`
    struct ShadingNormalParameters {
      vec3 normalView;
      vec3 viewDirection;
    } shadingParams;
    `),r.code.add(1===t.doubleSidedMode?i.a`
      vec3 shadingNormal(ShadingNormalParameters params) {
        return dot(params.normalView, params.viewDirection) > 0.0 ? normalize(-params.normalView) : normalize(params.normalView);
      }
    `:2===t.doubleSidedMode?i.a`
      vec3 shadingNormal(ShadingNormalParameters params) {
        return gl_FrontFacing ? normalize(params.normalView) : normalize(-params.normalView);
      }
    `:i.a`
      vec3 shadingNormal(ShadingNormalParameters params) {
        return normalize(params.normalView);
      }
    `)}},"r+FG":function(e,t,r){"use strict";function i(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}function n(e){return[e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[10],e[11],e[12],e[13],e[14],e[15]]}function o(e,t){return new Float64Array(e,t,16)}r.d(t,"a",function(){return a}),r.d(t,"b",function(){return i}),r.d(t,"c",function(){return n}),r.d(t,"d",function(){return o});const a=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];Object.freeze({__proto__:null,create:i,clone:n,fromValues:function(e,t,r,i,n,o,a,s,c,l,u,d,h,f,m,p){return[e,t,r,i,n,o,a,s,c,l,u,d,h,f,m,p]},createView:o,IDENTITY:a})},sJp1:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e){e.attributes.add("position","vec3"),e.vertex.code.add(i.a`
    vec3 positionModel() { return position; }
  `)}},sKsC:function(e,t,r){"use strict";r.d(t,"a",function(){return A}),r.d(t,"b",function(){return M});var i=r("OIYib"),n=r("Tbkp"),o=r("aQrP"),a=r("0nJL"),s=r("0Ect"),c=r("viRi"),l=r("69UF"),u=r("F7CJ"),d=r("xtdb"),h=r("0BfS"),f=r("vXUg"),m=r("XV/G"),p=r("1TnO"),g=r("368d"),b=r("p9cc"),v=r("F8o4"),x=r("wzLF"),_=r("sJp1"),O=r("bLIi"),y=r("bVvB"),T=r("fiGu"),w=r("cIib"),S=r("6kvK"),j=r("NiZE");function M(e){const t=new o.a,r=t.vertex.code,M=t.fragment.code;return t.vertex.uniforms.add("proj","mat4").add("view","mat4").add("camPos","vec3").add("localOrigin","vec3"),t.include(_.a),t.varyings.add("vpos","vec3"),t.include(c.a,e),t.include(p.a,e),t.include(u.a,e),0!==e.output&&7!==e.output||(t.include(x.a,e),t.include(n.a,{linearDepth:!1}),e.offsetBackfaces&&t.include(v.a),e.instancedColor&&t.attributes.add("instanceColor","vec4"),t.varyings.add("vNormalWorld","vec3"),t.varyings.add("localvpos","vec3"),e.multipassTerrainEnabled&&t.varyings.add("depth","float"),t.include(g.a,e),t.include(f.a,e),t.include(O.a,e),t.include(y.a,e),t.vertex.uniforms.add("externalColor","vec4"),t.varyings.add("vcolorExt","vec4"),r.add(i.a`
        void main(void) {
          forwardNormalizedVertexColor();
          vcolorExt = externalColor;
          ${e.instancedColor?"vcolorExt *= instanceColor;":""}
          vcolorExt *= vvColor();
          vcolorExt *= getSymbolColor();
          forwardColorMixMode();

          if (vcolorExt.a < ${i.a.float(l.c)}) {
            gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          }
          else {
            vpos = calculateVPos();
            localvpos = vpos - view[3].xyz;
            vpos = subtractOrigin(vpos);
            vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, vpos);
            ${e.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, camPos);":""}
          }
          ${e.multipassTerrainEnabled?i.a`depth = (view * vec4(vpos, 1.0)).z;`:""}
          forwardLinearDepth();
          forwardTextureCoordinates();
        }
      `)),7===e.output&&(t.include(a.a,e),t.include(l.a,e),e.multipassTerrainEnabled&&(t.fragment.include(s.a),t.include(d.b,e)),t.fragment.uniforms.add("camPos","vec3").add("localOrigin","vec3").add("opacity","float").add("layerOpacity","float"),t.fragment.uniforms.add("view","mat4"),e.hasColorTexture&&t.fragment.uniforms.add("tex","sampler2D"),t.fragment.include(j.a),M.add(i.a`
      void main() {
        discardBySlice(vpos);
        ${e.multipassTerrainEnabled?i.a`terrainDepthTest(gl_FragCoord, depth);`:""}
        ${e.hasColorTexture?i.a`
        vec4 texColor = texture2D(tex, vuv0);
        ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
        discardOrAdjustAlpha(texColor);`:i.a`vec4 texColor = vec4(1.0);`}
        ${e.attributeColor?i.a`
        float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:i.a`
        float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));
        `}

        gl_FragColor = vec4(opacity_);
      }
    `)),0===e.output&&(t.include(a.a,e),t.include(S.a,e),t.include(w.a,e),t.include(l.a,e),e.receiveShadows&&t.include(h.a,e),e.multipassTerrainEnabled&&(t.fragment.include(s.a),t.include(d.b,e)),t.fragment.uniforms.add("camPos","vec3").add("localOrigin","vec3").add("ambient","vec3").add("diffuse","vec3").add("opacity","float").add("layerOpacity","float"),t.fragment.uniforms.add("view","mat4"),e.hasColorTexture&&t.fragment.uniforms.add("tex","sampler2D"),t.include(b.a,e),t.include(m.a,e),t.fragment.include(j.a),M.add(i.a`
      void main() {
        discardBySlice(vpos);
        ${e.multipassTerrainEnabled?i.a`terrainDepthTest(gl_FragCoord, depth);`:""}
        ${e.hasColorTexture?i.a`
        vec4 texColor = texture2D(tex, vuv0);
        ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
        discardOrAdjustAlpha(texColor);`:i.a`vec4 texColor = vec4(1.0);`}
        vec3 viewDirection = normalize(vpos - camPos);
        ${1===e.pbrMode?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        float additionalAmbientScale = _oldHeuristicLighting(vpos + localOrigin);
        vec3 additionalLight = ssao * lightingMainIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
        ${e.receiveShadows?"float shadow = readShadowMap(vpos, linearDepth);":1===e.viewingMode?"float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);":"float shadow = 0.0;"}
        vec3 matColor = max(ambient, diffuse);
        ${e.attributeColor?i.a`
        vec3 albedo_ = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
        float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:i.a`
        vec3 albedo_ = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
        float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));
        `}
        ${i.a`
        vec3 shadedNormal = normalize(vNormalWorld);
        albedo_ *= 1.2;
        vec3 viewForward = - vec3(view[0][2], view[1][2], view[2][2]);
        float alignmentLightView = clamp(dot(-viewForward, lightingMainDirection), 0.0, 1.0);
        float transmittance = 1.0 - clamp(dot(-viewForward, shadedNormal), 0.0, 1.0);
        float treeRadialFalloff = vColor.r;
        float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
        additionalLight += backLightFactor * lightingMainIntensity;`}
        ${1===e.pbrMode||2===e.pbrMode?1===e.viewingMode?i.a`vec3 normalGround = normalize(vpos + localOrigin);`:i.a`vec3 normalGround = vec3(0.0, 0.0, 1.0);`:i.a``}
        ${1===e.pbrMode||2===e.pbrMode?i.a`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * lightingMainIntensity[2];
            vec3 shadedColor = evaluateSceneLightingPBR(shadedNormal, albedo_, shadow, 1.0 - ssao, additionalLight, viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:"vec3 shadedColor = evaluateSceneLighting(shadedNormal, albedo_, shadow, 1.0 - ssao, additionalLight);"}
        gl_FragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${e.OITEnabled?"gl_FragColor = premultiplyAlpha(gl_FragColor);":""}
      }
    `)),t.include(T.a,e),t}var A=Object.freeze({__proto__:null,build:M})},tiP8:function(e,t,r){"use strict";r.d(t,"a",function(){return o}),r.d(t,"b",function(){return s}),r.d(t,"c",function(){return a});var i=r("srIe"),n=(r("15Hh"),r("r+FG"));function o(e,t){return Object(i.h)(e)&&(e=[]),e.push(t),e}function a(e,t){if(Object(i.h)(e))return e;const r=e.filter(e=>e!==t);return 0===r.length?null:r}function s(e){return!!Object(i.i)(e)&&!e.visible}r("EVMh"),r("mmTy"),new Float64Array(3),new Float32Array(6),Object(n.b)()},vXUg:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e,t){0===t.output&&t.receiveShadows?(e.varyings.add("linearDepth","float"),e.vertex.code.add(i.a`
      void forwardLinearDepth() { linearDepth = gl_Position.w; }
    `)):1===t.output||3===t.output?(e.varyings.add("linearDepth","float"),e.vertex.uniforms.add("cameraNearFar","vec2"),e.vertex.code.add(i.a`
      void forwardLinearDepth() {
        linearDepth = (-position_view().z - cameraNearFar[0]) / (cameraNearFar[1] - cameraNearFar[0]);
      }
    `)):e.vertex.code.add(i.a`
      void forwardLinearDepth() {}
    `)}},viRi:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e,t){t.vvInstancingEnabled&&(t.vvSize||t.vvColor)&&e.attributes.add("instanceFeatureAttribute","vec4"),t.vvSize?(e.vertex.uniforms.add("vvSizeMinSize","vec3"),e.vertex.uniforms.add("vvSizeMaxSize","vec3"),e.vertex.uniforms.add("vvSizeOffset","vec3"),e.vertex.uniforms.add("vvSizeFactor","vec3"),e.vertex.uniforms.add("vvSymbolRotationMatrix","mat3"),e.vertex.uniforms.add("vvSymbolAnchor","vec3"),e.vertex.code.add(i.a`
      vec3 vvScale(vec4 _featureAttribute) {
        return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
      }

      vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
        return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
      }
    `),e.vertex.code.add(i.a`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 vvScale = clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize + eps, vvSizeMaxSize);
        return vec4(vvSymbolRotationMatrix * _normal / vvScale, 1.0);
      }

      ${t.vvInstancingEnabled?i.a`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(position, instanceFeatureAttribute);
      }`:""}
    `)):e.vertex.code.add(i.a`
      vec4 localPosition() { return vec4(position, 1.0); }

      vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }
    `),t.vvColor?(e.vertex.constants.add("vvColorNumber","int",8),e.vertex.code.add(i.a`
      uniform float vvColorValues[vvColorNumber];
      uniform vec4 vvColorColors[vvColorNumber];

      vec4 vvGetColor(vec4 featureAttribute, float values[vvColorNumber], vec4 colors[vvColorNumber]) {
        float value = featureAttribute.y;
        if (value <= values[0]) {
          return colors[0];
        }

        for (int i = 1; i < vvColorNumber; ++i) {
          if (values[i] >= value) {
            float f = (value - values[i-1]) / (values[i] - values[i-1]);
            return mix(colors[i-1], colors[i], f);
          }
        }
        return colors[vvColorNumber - 1];
      }

      ${t.vvInstancingEnabled?i.a`
      vec4 vvColor() {
        return vvGetColor(instanceFeatureAttribute, vvColorValues, vvColorColors);
      }`:""}
    `)):e.vertex.code.add(i.a`
      vec4 vvColor() { return vec4(1.0); }
    `)}!function(e){function t(e,t){t.vvSizeEnabled&&(e.setUniform3fv("vvSizeMinSize",t.vvSizeMinSize),e.setUniform3fv("vvSizeMaxSize",t.vvSizeMaxSize),e.setUniform3fv("vvSizeOffset",t.vvSizeOffset),e.setUniform3fv("vvSizeFactor",t.vvSizeFactor)),t.vvColorEnabled&&(e.setUniform1fv("vvColorValues",t.vvColorValues),e.setUniform4fv("vvColorColors",t.vvColorColors))}e.bindUniforms=t,e.bindUniformsWithOpacity=function(e,r){t(e,r),r.vvOpacityEnabled&&(e.setUniform1fv("vvOpacityValues",r.vvOpacityValues),e.setUniform1fv("vvOpacityOpacities",r.vvOpacityOpacities))},e.bindUniformsForSymbols=function(e,r){t(e,r),r.vvSizeEnabled&&(e.setUniform3fv("vvSymbolAnchor",r.vvSymbolAnchor),e.setUniformMatrix3fv("vvSymbolRotationMatrix",r.vvSymbolRotationMatrix))}}(n||(n={}))},wzLF:function(e,t,r){"use strict";r.d(t,"a",function(){return o});var i=r("OIYib");function n(e){const t=i.a`
    vec3 decodeNormal(vec2 f) {
      float z = 1.0 - abs(f.x) - abs(f.y);
      return vec3(f + sign(f) * min(z, 0.0), z);
    }
  `;e.fragment.code.add(t),e.vertex.code.add(t)}function o(e,t){0===t.normalType&&(e.attributes.add("normal","vec3"),e.vertex.code.add(i.a`
      vec3 normalModel() {
        return normal;
      }
    `)),1===t.normalType&&(e.include(n),e.attributes.add("normalCompressed","vec2"),e.vertex.code.add(i.a`
      vec3 normalModel() {
        return decodeNormal(normalCompressed);
      }
    `)),3===t.normalType&&(e.extensions.add("GL_OES_standard_derivatives"),e.fragment.code.add(i.a`
      vec3 screenDerivativeNormal(vec3 positionView) {
        return normalize(cross(dFdx(positionView), dFdy(positionView)));
      }
    `))}},xRQN:function(e,t,r){"use strict";t.a=function(e){return window.WebGL2RenderingContext&&e instanceof window.WebGL2RenderingContext}},xRv2:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var i=r("OIYib");function n(e){e.vertex.code.add(i.a`
    const float PI = 3.141592653589793;
  `),e.fragment.code.add(i.a`
    const float PI = 3.141592653589793;
    const float LIGHT_NORMALIZATION = 1.0 / PI;
    const float INV_PI = 0.3183098861837907;
    const float HALF_PI = 1.570796326794897;
    `)}},xtdb:function(e,t,r){"use strict";r.d(t,"a",function(){return o}),r.d(t,"b",function(){return n});var i=r("OIYib");function n(e,t){e.fragment.uniforms.add("terrainDepthTexture","sampler2D"),e.fragment.uniforms.add("cameraNearFar","vec2"),e.fragment.uniforms.add("inverseViewport","vec2"),e.fragment.code.add(i.a`
    //Compare the linearized depths of the fragment and the terrain. If fragment is on the wrong side of the terrain, discard it.
    void terrainDepthTest(vec4 fragCoord, float fragmentDepth){

      float terrainDepth = linearDepthFromTexture(terrainDepthTexture, fragCoord.xy * inverseViewport, cameraNearFar);
      if(fragmentDepth ${t.cullAboveGround?">":"<="} terrainDepth){
        discard;
      }
    }
  `)}function o(e,t,r){r.multipassTerrainEnabled&&r.terrainLinearDepthTexture&&(e.setUniform1i("terrainDepthTexture",10),t.bindTexture(r.terrainLinearDepthTexture,10))}}}]);