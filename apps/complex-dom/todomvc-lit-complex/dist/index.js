function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var l=t.length-1;l>=0;l--)(o=t[l])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class n{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}}const r=t=>new n("string"==typeof t?t:t+"",void 0,s),l=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return r(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:d,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:g}=Object,f=globalThis,m=f.trustedTypes,$=m?m.emptyScript:"",b=f.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?$:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},_=(t,e)=>!d(t,e),x={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return s?.call(this)},set(e){const n=s?.call(this);o.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s,this[s]=o.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??_)(this[t],e))return;this.P(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t)!0!==i.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],i)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[y("elementProperties")]=new Map,A[y("finalized")]=new Map,b?.({ReactiveElement:A}),(f.reactiveElementVersions??=[]).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,E=w.trustedTypes,C=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",k=`lit$${(Math.random()+"").slice(9)}$`,T="?"+k,P=`<${T}>`,L=document,U=()=>L.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,D=t=>O(t)||"function"==typeof t?.[Symbol.iterator],H="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,z=/>/g,I=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,B=/"/g,F=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),K=new WeakMap,J=L.createTreeWalker(L,129);function Z(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const Q=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":"",r=M;for(let e=0;e<i;e++){const i=t[e];let l,a,d=-1,h=0;for(;h<i.length&&(r.lastIndex=h,a=r.exec(i),null!==a);)h=r.lastIndex,r===M?"!--"===a[1]?r=R:void 0!==a[1]?r=z:void 0!==a[2]?(F.test(a[2])&&(o=RegExp("</"+a[2],"g")),r=I):void 0!==a[3]&&(r=I):r===I?">"===a[0]?(r=o??M,d=-1):void 0===a[1]?d=-2:(d=r.lastIndex-a[2].length,l=a[1],r=void 0===a[3]?I:'"'===a[3]?B:j):r===B||r===j?r=I:r===R||r===z?r=M:(r=I,o=void 0);const c=r===I&&t[e+1].startsWith("/>")?" ":"";n+=r===M?i+P:d>=0?(s.push(l),i.slice(0,d)+S+i.slice(d)+k+c):i+k+(-2===d?e:c)}return[Z(t,n+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,l=this.parts,[a,d]=Q(t,e);if(this.el=G.createElement(a,i),J.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&l.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=d[n++],i=s.getAttribute(t).split(k),r=/([.?@])?(.*)/.exec(e);l.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?st:"@"===r[1]?ot:et}),s.removeAttribute(t)}else t.startsWith(k)&&(l.push({type:6,index:o}),s.removeAttribute(t));if(F.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),J.nextNode(),l.push({type:2,index:++o});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===T)l.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)l.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===V)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=N(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=X(t,o._$AS(t,e.values),o,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??L).importNode(e,!0);J.currentNode=s;let o=J.nextNode(),n=0,r=0,l=i[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new tt(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new nt(o,this,t)),this._$AV.push(e),l=i[++r]}n!==l?.index&&(o=J.nextNode(),n++)}return J.currentNode=L,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),N(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):D(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==q&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new G(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new tt(this.S(U()),this.S(U()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=X(this,t,e,0),n=!N(t)||t!==this._$AH&&t!==V,n&&(this._$AH=t);else{const s=t;let r,l;for(t=o[0],r=0;r<o.length-1;r++)l=X(this,s[i+r],e,r),l===V&&(l=this._$AH[r]),n||=!N(l)||l!==this._$AH[r],l===q?t=q:t!==q&&(t+=(l??"")+o[r+1]),this._$AH[r]=l}n&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class ot extends et{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??q)===V)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt={P:S,A:k,C:T,M:1,L:Q,R:Y,D,V:X,I:tt,H:et,N:st,U:ot,B:it,F:nt},lt=w.litHtmlPolyfillSupport;lt?.(G,tt),(w.litHtmlVersions??=[]).push("3.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class at extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new tt(e.insertBefore(U(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}at._$litElement$=!0,at.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:at});const dt=globalThis.litElementPolyfillSupport;dt?.({LitElement:at}),(globalThis.litElementVersions??=[]).push("4.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht=1,ct=2,pt=t=>(...e)=>({_$litDirective$:t,values:e});class ut{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=pt(class extends ut{constructor(t){if(super(t),t.type!==ht||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return V}}),ft=t=>(e,i)=>{void 0!==i?i.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,mt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:_},$t=(t=mt,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t)},init(e){return void 0!==e&&this.P(s,void 0,t),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function bt(t){return(e,i)=>"object"==typeof i?$t(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,s?{...t,wrapped:!0}:t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function yt(t){return bt({...t,state:!0,attribute:!1})}const vt=l`button{margin:0;padding:0;border:0;background:0 0;font-size:100%;vertical-align:baseline;font-family:inherit;font-weight:inherit;color:inherit;-webkit-appearance:none;-moz-appearance:none;appearance:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.toggle-all:focus+label,.toggle:focus+label,:focus{box-shadow:0 0 2px 2px #cf7d7d;outline:0}.edit,.new-todo{position:relative;margin:0;width:100%;font-size:24px;font-family:inherit;font-weight:inherit;line-height:1.4em;border:0;color:inherit;padding:6px;border:1px solid #999;box-shadow:inset 0 -1px 5px 0 rgba(0,0,0,.2);box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.new-todo{padding:16px 16px 16px 60px;border:none;background:rgba(0,0,0,.003);box-shadow:inset 0 -2px 1px rgba(0,0,0,.03)}@media screen and (-webkit-min-device-pixel-ratio:0){.toggle-all,li .toggle{background:0 0}li .toggle{height:40px}}@media (max-width:430px){.footer{height:50px}.filters{bottom:10px}}`;function _t(t=21){let e="",i=t;for(;i--;)e+="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"[64*Math.random()|0];return e}const xt=["all","active","completed"];class At extends EventTarget{#t=[];#e=this.#i();get all(){return this.#t}get active(){return this.#t.filter((t=>!t.completed))}get completed(){return this.#t.filter((t=>t.completed))}get allCompleted(){return this.#t.every((t=>t.completed))}connect(){window.addEventListener("hashchange",this.#s)}disconnect(){window.removeEventListener("hashchange",this.#s)}filtered(){switch(this.#e){case"active":return this.active;case"completed":return this.completed}return this.all}#o(){this.dispatchEvent(new Event("change"))}add(t){this.#t.push({text:t,completed:!1,id:_t()}),this.#o()}delete(t){const e=this.#t.findIndex((e=>e.id===t));this.#t.splice(e>>>0,1),this.#o()}update(t){const e=this.#t.find((e=>e.id===t.id));void 0!==e&&(Object.assign(e,t),this.#o())}toggle(t){const e=this.#t.find((e=>e.id===t));void 0!==e&&(e.completed=!e.completed,this.#o())}toggleAll(){const t=this.#t.every((t=>t.completed));this.#t=this.#t.map((e=>({...e,completed:!t}))),this.#o()}clearCompleted(){this.#t=this.active,this.#o()}get filter(){return this.#e}set filter(t){this.#e=t,this.#o()}#s=()=>{this.filter=this.#i()};#i(){let t=/#\/(.*)/.exec(window.location.hash)?.[1];return e=t,xt.includes(e)?t:"all";var e}}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:wt}=rt,Et=()=>document.createComment(""),Ct=(t,e,i)=>{const s=t._$AA.parentNode,o=void 0===e?t._$AB:e._$AA;if(void 0===i){const e=s.insertBefore(Et(),o),n=s.insertBefore(Et(),o);i=new wt(e,n,t,t.options)}else{const e=i._$AB.nextSibling,n=i._$AM,r=n!==t;if(r){let e;i._$AQ?.(t),i._$AM=t,void 0!==i._$AP&&(e=t._$AU)!==n._$AU&&i._$AP(e)}if(e!==o||r){let t=i._$AA;for(;t!==e;){const e=t.nextSibling;s.insertBefore(t,o),t=e}}}return i},St=(t,e,i=t)=>(t._$AI(e,i),t),kt={},Tt=t=>{t._$AP?.(!1,!0);let e=t._$AA;const i=t._$AB.nextSibling;for(;e!==i;){const t=e.nextSibling;e.remove(),e=t}},Pt=(t,e,i)=>{const s=new Map;for(let o=e;o<=i;o++)s.set(t[o],o);return s},Lt=pt(class extends ut{constructor(t){if(super(t),t.type!==ct)throw Error("repeat() can only be used in text expressions")}dt(t,e,i){let s;void 0===i?i=e:void 0!==e&&(s=e);const o=[],n=[];let r=0;for(const e of t)o[r]=s?s(e,r):r,n[r]=i(e,r),r++;return{values:n,keys:o}}render(t,e,i){return this.dt(t,e,i).values}update(t,[e,i,s]){const o=(t=>t._$AH)(t),{values:n,keys:r}=this.dt(e,i,s);if(!Array.isArray(o))return this.ut=r,n;const l=this.ut??=[],a=[];let d,h,c=0,p=o.length-1,u=0,g=n.length-1;for(;c<=p&&u<=g;)if(null===o[c])c++;else if(null===o[p])p--;else if(l[c]===r[u])a[u]=St(o[c],n[u]),c++,u++;else if(l[p]===r[g])a[g]=St(o[p],n[g]),p--,g--;else if(l[c]===r[g])a[g]=St(o[c],n[g]),Ct(t,a[g+1],o[c]),c++,g--;else if(l[p]===r[u])a[u]=St(o[p],n[u]),Ct(t,o[c],o[p]),p--,u++;else if(void 0===d&&(d=Pt(r,u,g),h=Pt(l,c,p)),d.has(l[c]))if(d.has(l[p])){const e=h.get(r[u]),i=void 0!==e?o[e]:null;if(null===i){const e=Ct(t,o[c]);St(e,n[u]),a[u]=e}else a[u]=St(i,n[u]),Ct(t,o[c],i),o[e]=null;u++}else Tt(o[p]),p--;else Tt(o[c]),c++;for(;u<=g;){const e=Ct(t,a[g+1]);St(e,n[u]),a[u++]=e}for(;c<=p;){const t=o[c++];null!==t&&Tt(t)}return this.ut=r,((t,e=kt)=>{t._$AH=e})(t,a),V}});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Ut extends Event{static{this.eventName="todo-add"}constructor(t){super(Ut.eventName,{bubbles:!0,composed:!0}),this.text=t}}class Nt extends Event{static{this.eventName="todo-delete"}constructor(t){super(Nt.eventName,{bubbles:!0,composed:!0}),this.id=t}}class Ot extends Event{static{this.eventName="todo-edit"}constructor(t){super(Ot.eventName,{bubbles:!0,composed:!0}),this.edit=t}}class Dt extends Event{static{this.eventName="todo-toggle-all"}constructor(){super(Dt.eventName,{bubbles:!0,composed:!0})}}class Ht extends Event{static{this.eventName="clear-completed"}constructor(){super(Ht.eventName,{bubbles:!0,composed:!0})}}let Mt=class extends at{constructor(){super(...arguments),this.todoId="",this.text="",this.completed=!1,this.isEditing=!1}static{this.styles=[vt,l`:host{display:block}li{position:relative;font-size:24px}.editing{border-bottom:none;padding:0}.editing .edit{display:block;width:calc(100% - 43px);padding:12px 16px;margin:0 0 0 43px}.editing .view{display:none}.toggle{text-align:center;width:40px;height:auto;position:absolute;top:0;bottom:0;margin:auto 0;border:none;-webkit-appearance:none;appearance:none}.toggle{opacity:0}.toggle+label{background-image:url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E);background-repeat:no-repeat;background-position:center left}.toggle:checked+label{background-image:url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E)}label{word-break:break-all;padding:15px 15px 15px 60px;display:block;line-height:1.2;transition:color .4s;font-weight:400;color:#484848}.completed label{color:#949494;text-decoration:line-through}.destroy{display:none;position:absolute;top:0;right:10px;bottom:0;width:40px;height:40px;margin:auto 0;font-size:30px;color:#949494;transition:color .2s ease-out}.destroy:focus,.destroy:hover{color:#c18585}.destroy:after{content:"×";display:block;height:100%;line-height:1.1}li:hover .destroy{display:block}.edit{display:none}:host(:last-child) .editing{margin-bottom:-1px}`,window.extraTodoItemCssToAdopt?l`${r(window.extraTodoItemCssToAdopt)}`:l``]}render(){const t={todo:!0,completed:this.completed??!1,editing:this.isEditing};return W`<li class="${gt(t)}"><div class="view"><input class="toggle" type="checkbox" .checked="${this.completed??!1}" @change="${this.#n}"> <label @dblclick="${this.#r}">${this.text}</label> <button @click="${this.#l}" class="destroy"></button></div><input class="edit" type="text" @change="${this.#a}" @keyup="${this.#d}" @blur="${this.#h}" .value="${this.text??""}"></li>`}#n(){this.dispatchEvent(new Ot({id:this.todoId,completed:!this.completed}))}#l(){this.dispatchEvent(new Nt(this.todoId))}#r(){this.isEditing=!0}#a(t){const e=t.target.value;this.dispatchEvent(new Ot({id:this.todoId,text:e})),this.isEditing=!1}#d(t){"escape"===t.key&&this.#h(t)}#h(t){t.target.value=this.text??""}};t([bt()],Mt.prototype,"todoId",void 0),t([bt()],Mt.prototype,"text",void 0),t([bt({type:Boolean})],Mt.prototype,"completed",void 0),t([yt()],Mt.prototype,"isEditing",void 0),Mt=t([ft("todo-item")],Mt);const Rt=t=>(e,i)=>{const s=Object.getOwnPropertyDescriptor(e,i),{get:o,set:n}=s,r={...s,set(e){const i=this.__updateOnEventListener??=()=>this.requestUpdate(),s=o.call(this);return s?.removeEventListener?.(t,i),e?.addEventListener?.(t,i),n.call(this,e)}};Object.defineProperty(e,i,r)};let zt=class extends at{static{this.styles=[vt,l`:host{display:block}:focus{box-shadow:none!important}.todo-list{margin:0;padding:0;list-style:none}.toggle-all{width:1px;height:1px;border:none;opacity:0;position:absolute;right:100%;bottom:100%}.toggle-all+label{display:flex;align-items:center;justify-content:center;width:45px;height:65px;font-size:0;position:absolute;top:-65px;left:0}.toggle-all+label:before{content:"❯";display:inline-block;font-size:22px;color:#949494;padding:10px 27px 10px 27px;transform:rotate(90deg)}.toggle-all:checked+label:before{color:#484848}todo-item{border-bottom:1px solid #ededed}todo-item:last-child{border-bottom:none}`,window.extraTodoListCssToAdopt?l`${r(window.extraTodoListCssToAdopt)}`:l``]}render(){return W`${(this.todoList?.all.length??0)>0?W`<input @change="${this.#c}" id="toggle-all" type="checkbox" class="toggle-all" .checked="${this.todoList?.allCompleted??!1}"> <label for="toggle-all">Mark all as complete</label>`:q}<ul class="todo-list">${Lt(this.todoList?.filtered()??[],(t=>t.id),((t,e)=>W`<todo-item data-priority="${4-e%5}" .todoId="${t.id}" .text="${t.text}" .completed="${t.completed}"></todo-item>`))}</ul>`}#c(){this.dispatchEvent(new Dt)}};t([Rt("change"),bt({attribute:!1})],zt.prototype,"todoList",void 0),zt=t([ft("todo-list")],zt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It=(t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;let jt=class extends at{static{this.styles=[vt,l`:host{display:block}input::-webkit-input-placeholder{font-style:italic;font-weight:400;color:rgba(0,0,0,.4)}input::-moz-placeholder{font-style:italic;font-weight:400;color:rgba(0,0,0,.4)}input::input-placeholder{font-style:italic;font-weight:400;color:rgba(0,0,0,.4)}`]}render(){return W`<input @change="${this.#p}" @keydown="${this.#u}" class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?">`}#p(){const{value:t}=this.newTodoInput;t.length>0&&this.dispatchEvent(new Ut(t)),this.newTodoInput.value=""}#u(t){"Enter"===t.key&&this.#p()}};t([Rt("change"),bt({attribute:!1})],jt.prototype,"todoList",void 0),t([function(t,e){return(i,s,o)=>{const n=e=>e.renderRoot?.querySelector(t)??null;if(e){const{get:t,set:e}="object"==typeof s?i:o??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return It(i,s,{get(){let i=t.call(this);return void 0===i&&(i=n(this),(null!==i||this.hasUpdated)&&e.call(this,i)),i}})}return It(i,s,{get(){return n(this)}})}}("input",!0)],jt.prototype,"newTodoInput",void 0),jt=t([ft("todo-form")],jt);let Bt=class extends at{static{this.styles=[vt,l`:host{display:block;padding:10px 15px;height:20px;text-align:center;font-size:15px;border-top:1px solid #e6e6e6}:host:before{content:"";position:absolute;right:0;bottom:0;left:0;height:50px;overflow:hidden;box-shadow:0 1px 1px rgba(0,0,0,.2),0 8px 0 -3px #f6f6f6,0 9px 1px -3px rgba(0,0,0,.2),0 16px 0 -6px #f6f6f6,0 17px 2px -6px rgba(0,0,0,.2)}.todo-count{float:left;text-align:left}.todo-count strong{font-weight:300}.filters{margin:0;padding:0;list-style:none;position:absolute;right:0;left:0}li{display:inline}li a{color:inherit;margin:3px;padding:3px 7px;text-decoration:none;border:1px solid transparent;border-radius:3px}a:hover{border-color:#db7676}a.selected{border-color:#ce4646}.clear-completed,:host .clear-completed:active{float:right;position:relative;line-height:19px;text-decoration:none;cursor:pointer}.clear-completed:hover{text-decoration:underline}`]}render(){if(void 0===this.todoList||0===this.todoList.all.length)return q;const t=Ft({text:"All",filter:"all",selectedFilter:this.todoList?.filter}),e=Ft({text:"Active",filter:"active",selectedFilter:this.todoList?.filter}),i=Ft({text:"Completed",filter:"completed",selectedFilter:this.todoList?.filter});return W`<span class="todo-count"><strong>${this.todoList?.active.length}</strong> items left</span><ul class="filters"><li>${t}</li><li>${e}</li><li>${i}</li></ul>${(this.todoList?.completed.length??0)>0?W`<button @click="${this.#g}" class="clear-completed">Clear Completed</button>`:q}`}#g(){this.dispatchEvent(new Ht)}};function Ft({text:t,filter:e,selectedFilter:i}){return W`<a class="${gt({selected:e===i})}" href="#/${e}">${t}</a>`}t([Rt("change"),bt({attribute:!1})],Bt.prototype,"todoList",void 0),Bt=t([ft("todo-footer")],Bt);let Wt=class extends at{static{this.styles=[vt,l`:host{display:block;background:#fff;margin:130px 0 40px 0;position:relative;box-shadow:0 2px 4px 0 rgba(0,0,0,.2),0 25px 50px 0 rgba(0,0,0,.1)}h1{position:absolute;top:-140px;width:100%;font-size:80px;font-weight:200;text-align:center;color:#b83f45;-webkit-text-rendering:optimizeLegibility;-moz-text-rendering:optimizeLegibility;text-rendering:optimizeLegibility}main{position:relative;z-index:2;border-top:1px solid #e6e6e6}.hidden{display:none}:focus{box-shadow:none!important}`]}constructor(){super(),this.todoList=new At,this.#f=t=>{this.todoList.add(t.text)},this.#m=t=>{this.todoList.delete(t.id)},this.#$=t=>{this.todoList.update(t.edit)},this.#b=t=>{this.todoList.toggleAll()},this.#y=t=>{this.todoList.clearCompleted()},this.addEventListener(Ut.eventName,this.#f),this.addEventListener(Nt.eventName,this.#m),this.addEventListener(Ot.eventName,this.#$),this.addEventListener(Dt.eventName,this.#b),this.addEventListener(Ht.eventName,this.#y)}connectedCallback(){super.connectedCallback(),this.todoList.connect()}disconnectedCallback(){super.disconnectedCallback(),this.todoList.disconnect()}render(){return W`<section><header class="header"><h1>todos</h1><todo-form .todoList="${this.todoList}"></todo-form></header><main class="main"><todo-list class="show-priority" .todoList="${this.todoList}"></todo-list></main><todo-footer class="${gt({hidden:0===this.todoList.all.length})}" .todoList="${this.todoList}"></todo-footer></section>`}#f;#m;#$;#b;#y};t([Rt("change"),yt()],Wt.prototype,"todoList",void 0),Wt=t([ft("todo-app")],Wt);export{Wt as TodoApp};
