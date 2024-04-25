var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
/*!
 * @kurkle/color v0.3.2
 * https://github.com/kurkle/color#readme
 * (c) 2023 Jukka Kurkela
 * Released under the MIT License
 */
function round(v) {
  return v + 0.5 | 0;
}
const lim = (v, l, h) => Math.max(Math.min(v, h), l);
function p2b(v) {
  return lim(round(v * 2.55), 0, 255);
}
function n2b(v) {
  return lim(round(v * 255), 0, 255);
}
function b2n(v) {
  return lim(round(v / 2.55) / 100, 0, 1);
}
function n2p(v) {
  return lim(round(v * 100), 0, 100);
}
const map$1 = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 };
const hex = [..."0123456789ABCDEF"];
const h1 = (b) => hex[b & 15];
const h2 = (b) => hex[(b & 240) >> 4] + hex[b & 15];
const eq = (b) => (b & 240) >> 4 === (b & 15);
const isShort = (v) => eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
function hexParse(str) {
  var len = str.length;
  var ret;
  if (str[0] === "#") {
    if (len === 4 || len === 5) {
      ret = {
        r: 255 & map$1[str[1]] * 17,
        g: 255 & map$1[str[2]] * 17,
        b: 255 & map$1[str[3]] * 17,
        a: len === 5 ? map$1[str[4]] * 17 : 255
      };
    } else if (len === 7 || len === 9) {
      ret = {
        r: map$1[str[1]] << 4 | map$1[str[2]],
        g: map$1[str[3]] << 4 | map$1[str[4]],
        b: map$1[str[5]] << 4 | map$1[str[6]],
        a: len === 9 ? map$1[str[7]] << 4 | map$1[str[8]] : 255
      };
    }
  }
  return ret;
}
const alpha = (a, f) => a < 255 ? f(a) : "";
function hexString(v) {
  var f = isShort(v) ? h1 : h2;
  return v ? "#" + f(v.r) + f(v.g) + f(v.b) + alpha(v.a, f) : void 0;
}
const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function hsl2rgbn(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)];
}
function hsv2rgbn(h, s, v) {
  const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
}
function hwb2rgbn(h, w, b) {
  const rgb = hsl2rgbn(h, 1, 0.5);
  let i;
  if (w + b > 1) {
    i = 1 / (w + b);
    w *= i;
    b *= i;
  }
  for (i = 0; i < 3; i++) {
    rgb[i] *= 1 - w - b;
    rgb[i] += w;
  }
  return rgb;
}
function hueValue(r, g, b, d, max) {
  if (r === max) {
    return (g - b) / d + (g < b ? 6 : 0);
  }
  if (g === max) {
    return (b - r) / d + 2;
  }
  return (r - g) / d + 4;
}
function rgb2hsl(v) {
  const range = 255;
  const r = v.r / range;
  const g = v.g / range;
  const b = v.b / range;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h, s, d;
  if (max !== min) {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = hueValue(r, g, b, d, max);
    h = h * 60 + 0.5;
  }
  return [h | 0, s || 0, l];
}
function calln(f, a, b, c) {
  return (Array.isArray(a) ? f(a[0], a[1], a[2]) : f(a, b, c)).map(n2b);
}
function hsl2rgb(h, s, l) {
  return calln(hsl2rgbn, h, s, l);
}
function hwb2rgb(h, w, b) {
  return calln(hwb2rgbn, h, w, b);
}
function hsv2rgb(h, s, v) {
  return calln(hsv2rgbn, h, s, v);
}
function hue(h) {
  return (h % 360 + 360) % 360;
}
function hueParse(str) {
  const m = HUE_RE.exec(str);
  let a = 255;
  let v;
  if (!m) {
    return;
  }
  if (m[5] !== v) {
    a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
  }
  const h = hue(+m[2]);
  const p1 = +m[3] / 100;
  const p2 = +m[4] / 100;
  if (m[1] === "hwb") {
    v = hwb2rgb(h, p1, p2);
  } else if (m[1] === "hsv") {
    v = hsv2rgb(h, p1, p2);
  } else {
    v = hsl2rgb(h, p1, p2);
  }
  return {
    r: v[0],
    g: v[1],
    b: v[2],
    a
  };
}
function rotate(v, deg) {
  var h = rgb2hsl(v);
  h[0] = hue(h[0] + deg);
  h = hsl2rgb(h);
  v.r = h[0];
  v.g = h[1];
  v.b = h[2];
}
function hslString(v) {
  if (!v) {
    return;
  }
  const a = rgb2hsl(v);
  const h = a[0];
  const s = n2p(a[1]);
  const l = n2p(a[2]);
  return v.a < 255 ? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})` : `hsl(${h}, ${s}%, ${l}%)`;
}
const map$2 = {
  x: "dark",
  Z: "light",
  Y: "re",
  X: "blu",
  W: "gr",
  V: "medium",
  U: "slate",
  A: "ee",
  T: "ol",
  S: "or",
  B: "ra",
  C: "lateg",
  D: "ights",
  R: "in",
  Q: "turquois",
  E: "hi",
  P: "ro",
  O: "al",
  N: "le",
  M: "de",
  L: "yello",
  F: "en",
  K: "ch",
  G: "arks",
  H: "ea",
  I: "ightg",
  J: "wh"
};
const names$1 = {
  OiceXe: "f0f8ff",
  antiquewEte: "faebd7",
  aqua: "ffff",
  aquamarRe: "7fffd4",
  azuY: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "0",
  blanKedOmond: "ffebcd",
  Xe: "ff",
  XeviTet: "8a2be2",
  bPwn: "a52a2a",
  burlywood: "deb887",
  caMtXe: "5f9ea0",
  KartYuse: "7fff00",
  KocTate: "d2691e",
  cSO: "ff7f50",
  cSnflowerXe: "6495ed",
  cSnsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "ffff",
  xXe: "8b",
  xcyan: "8b8b",
  xgTMnPd: "b8860b",
  xWay: "a9a9a9",
  xgYF: "6400",
  xgYy: "a9a9a9",
  xkhaki: "bdb76b",
  xmagFta: "8b008b",
  xTivegYF: "556b2f",
  xSange: "ff8c00",
  xScEd: "9932cc",
  xYd: "8b0000",
  xsOmon: "e9967a",
  xsHgYF: "8fbc8f",
  xUXe: "483d8b",
  xUWay: "2f4f4f",
  xUgYy: "2f4f4f",
  xQe: "ced1",
  xviTet: "9400d3",
  dAppRk: "ff1493",
  dApskyXe: "bfff",
  dimWay: "696969",
  dimgYy: "696969",
  dodgerXe: "1e90ff",
  fiYbrick: "b22222",
  flSOwEte: "fffaf0",
  foYstWAn: "228b22",
  fuKsia: "ff00ff",
  gaRsbSo: "dcdcdc",
  ghostwEte: "f8f8ff",
  gTd: "ffd700",
  gTMnPd: "daa520",
  Way: "808080",
  gYF: "8000",
  gYFLw: "adff2f",
  gYy: "808080",
  honeyMw: "f0fff0",
  hotpRk: "ff69b4",
  RdianYd: "cd5c5c",
  Rdigo: "4b0082",
  ivSy: "fffff0",
  khaki: "f0e68c",
  lavFMr: "e6e6fa",
  lavFMrXsh: "fff0f5",
  lawngYF: "7cfc00",
  NmoncEffon: "fffacd",
  ZXe: "add8e6",
  ZcSO: "f08080",
  Zcyan: "e0ffff",
  ZgTMnPdLw: "fafad2",
  ZWay: "d3d3d3",
  ZgYF: "90ee90",
  ZgYy: "d3d3d3",
  ZpRk: "ffb6c1",
  ZsOmon: "ffa07a",
  ZsHgYF: "20b2aa",
  ZskyXe: "87cefa",
  ZUWay: "778899",
  ZUgYy: "778899",
  ZstAlXe: "b0c4de",
  ZLw: "ffffe0",
  lime: "ff00",
  limegYF: "32cd32",
  lRF: "faf0e6",
  magFta: "ff00ff",
  maPon: "800000",
  VaquamarRe: "66cdaa",
  VXe: "cd",
  VScEd: "ba55d3",
  VpurpN: "9370db",
  VsHgYF: "3cb371",
  VUXe: "7b68ee",
  VsprRggYF: "fa9a",
  VQe: "48d1cc",
  VviTetYd: "c71585",
  midnightXe: "191970",
  mRtcYam: "f5fffa",
  mistyPse: "ffe4e1",
  moccasR: "ffe4b5",
  navajowEte: "ffdead",
  navy: "80",
  Tdlace: "fdf5e6",
  Tive: "808000",
  TivedBb: "6b8e23",
  Sange: "ffa500",
  SangeYd: "ff4500",
  ScEd: "da70d6",
  pOegTMnPd: "eee8aa",
  pOegYF: "98fb98",
  pOeQe: "afeeee",
  pOeviTetYd: "db7093",
  papayawEp: "ffefd5",
  pHKpuff: "ffdab9",
  peru: "cd853f",
  pRk: "ffc0cb",
  plum: "dda0dd",
  powMrXe: "b0e0e6",
  purpN: "800080",
  YbeccapurpN: "663399",
  Yd: "ff0000",
  Psybrown: "bc8f8f",
  PyOXe: "4169e1",
  saddNbPwn: "8b4513",
  sOmon: "fa8072",
  sandybPwn: "f4a460",
  sHgYF: "2e8b57",
  sHshell: "fff5ee",
  siFna: "a0522d",
  silver: "c0c0c0",
  skyXe: "87ceeb",
  UXe: "6a5acd",
  UWay: "708090",
  UgYy: "708090",
  snow: "fffafa",
  sprRggYF: "ff7f",
  stAlXe: "4682b4",
  tan: "d2b48c",
  teO: "8080",
  tEstN: "d8bfd8",
  tomato: "ff6347",
  Qe: "40e0d0",
  viTet: "ee82ee",
  JHt: "f5deb3",
  wEte: "ffffff",
  wEtesmoke: "f5f5f5",
  Lw: "ffff00",
  LwgYF: "9acd32"
};
function unpack() {
  const unpacked = {};
  const keys = Object.keys(names$1);
  const tkeys = Object.keys(map$2);
  let i, j, k, ok, nk;
  for (i = 0; i < keys.length; i++) {
    ok = nk = keys[i];
    for (j = 0; j < tkeys.length; j++) {
      k = tkeys[j];
      nk = nk.replace(k, map$2[k]);
    }
    k = parseInt(names$1[ok], 16);
    unpacked[nk] = [k >> 16 & 255, k >> 8 & 255, k & 255];
  }
  return unpacked;
}
let names;
function nameParse(str) {
  if (!names) {
    names = unpack();
    names.transparent = [0, 0, 0, 0];
  }
  const a = names[str.toLowerCase()];
  return a && {
    r: a[0],
    g: a[1],
    b: a[2],
    a: a.length === 4 ? a[3] : 255
  };
}
const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function rgbParse(str) {
  const m = RGB_RE.exec(str);
  let a = 255;
  let r, g, b;
  if (!m) {
    return;
  }
  if (m[7] !== r) {
    const v = +m[7];
    a = m[8] ? p2b(v) : lim(v * 255, 0, 255);
  }
  r = +m[1];
  g = +m[3];
  b = +m[5];
  r = 255 & (m[2] ? p2b(r) : lim(r, 0, 255));
  g = 255 & (m[4] ? p2b(g) : lim(g, 0, 255));
  b = 255 & (m[6] ? p2b(b) : lim(b, 0, 255));
  return {
    r,
    g,
    b,
    a
  };
}
function rgbString(v) {
  return v && (v.a < 255 ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})` : `rgb(${v.r}, ${v.g}, ${v.b})`);
}
const to = (v) => v <= 31308e-7 ? v * 12.92 : Math.pow(v, 1 / 2.4) * 1.055 - 0.055;
const from = (v) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
function interpolate$1(rgb1, rgb2, t) {
  const r = from(b2n(rgb1.r));
  const g = from(b2n(rgb1.g));
  const b = from(b2n(rgb1.b));
  return {
    r: n2b(to(r + t * (from(b2n(rgb2.r)) - r))),
    g: n2b(to(g + t * (from(b2n(rgb2.g)) - g))),
    b: n2b(to(b + t * (from(b2n(rgb2.b)) - b))),
    a: rgb1.a + t * (rgb2.a - rgb1.a)
  };
}
function modHSL(v, i, ratio) {
  if (v) {
    let tmp = rgb2hsl(v);
    tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
    tmp = hsl2rgb(tmp);
    v.r = tmp[0];
    v.g = tmp[1];
    v.b = tmp[2];
  }
}
function clone$1(v, proto) {
  return v ? Object.assign(proto || {}, v) : v;
}
function fromObject(input) {
  var v = { r: 0, g: 0, b: 0, a: 255 };
  if (Array.isArray(input)) {
    if (input.length >= 3) {
      v = { r: input[0], g: input[1], b: input[2], a: 255 };
      if (input.length > 3) {
        v.a = n2b(input[3]);
      }
    }
  } else {
    v = clone$1(input, { r: 0, g: 0, b: 0, a: 1 });
    v.a = n2b(v.a);
  }
  return v;
}
function functionParse(str) {
  if (str.charAt(0) === "r") {
    return rgbParse(str);
  }
  return hueParse(str);
}
class Color {
  constructor(input) {
    if (input instanceof Color) {
      return input;
    }
    const type = typeof input;
    let v;
    if (type === "object") {
      v = fromObject(input);
    } else if (type === "string") {
      v = hexParse(input) || nameParse(input) || functionParse(input);
    }
    this._rgb = v;
    this._valid = !!v;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var v = clone$1(this._rgb);
    if (v) {
      v.a = b2n(v.a);
    }
    return v;
  }
  set rgb(obj) {
    this._rgb = fromObject(obj);
  }
  rgbString() {
    return this._valid ? rgbString(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? hexString(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? hslString(this._rgb) : void 0;
  }
  mix(color2, weight) {
    if (color2) {
      const c1 = this.rgb;
      const c2 = color2.rgb;
      let w2;
      const p = weight === w2 ? 0.5 : weight;
      const w = 2 * p - 1;
      const a = c1.a - c2.a;
      const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
      w2 = 1 - w1;
      c1.r = 255 & w1 * c1.r + w2 * c2.r + 0.5;
      c1.g = 255 & w1 * c1.g + w2 * c2.g + 0.5;
      c1.b = 255 & w1 * c1.b + w2 * c2.b + 0.5;
      c1.a = p * c1.a + (1 - p) * c2.a;
      this.rgb = c1;
    }
    return this;
  }
  interpolate(color2, t) {
    if (color2) {
      this._rgb = interpolate$1(this._rgb, color2._rgb, t);
    }
    return this;
  }
  clone() {
    return new Color(this.rgb);
  }
  alpha(a) {
    this._rgb.a = n2b(a);
    return this;
  }
  clearer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 - ratio;
    return this;
  }
  greyscale() {
    const rgb = this._rgb;
    const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
    rgb.r = rgb.g = rgb.b = val;
    return this;
  }
  opaquer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 + ratio;
    return this;
  }
  negate() {
    const v = this._rgb;
    v.r = 255 - v.r;
    v.g = 255 - v.g;
    v.b = 255 - v.b;
    return this;
  }
  lighten(ratio) {
    modHSL(this._rgb, 2, ratio);
    return this;
  }
  darken(ratio) {
    modHSL(this._rgb, 2, -ratio);
    return this;
  }
  saturate(ratio) {
    modHSL(this._rgb, 1, ratio);
    return this;
  }
  desaturate(ratio) {
    modHSL(this._rgb, 1, -ratio);
    return this;
  }
  rotate(deg) {
    rotate(this._rgb, deg);
    return this;
  }
}
/*!
 * Chart.js v4.4.2
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */
function noop() {
}
const uid = (() => {
  let id = 0;
  return () => id++;
})();
function isNullOrUndef(value) {
  return value === null || typeof value === "undefined";
}
function isArray(value) {
  if (Array.isArray && Array.isArray(value)) {
    return true;
  }
  const type = Object.prototype.toString.call(value);
  if (type.slice(0, 7) === "[object" && type.slice(-6) === "Array]") {
    return true;
  }
  return false;
}
function isObject(value) {
  return value !== null && Object.prototype.toString.call(value) === "[object Object]";
}
function isNumberFinite(value) {
  return (typeof value === "number" || value instanceof Number) && isFinite(+value);
}
function finiteOrDefault(value, defaultValue) {
  return isNumberFinite(value) ? value : defaultValue;
}
function valueOrDefault(value, defaultValue) {
  return typeof value === "undefined" ? defaultValue : value;
}
const toPercentage = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 : +value / dimension;
const toDimension = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 * dimension : +value;
function callback(fn, args, thisArg) {
  if (fn && typeof fn.call === "function") {
    return fn.apply(thisArg, args);
  }
}
function each(loopable, fn, thisArg, reverse) {
  let i, len, keys;
  if (isArray(loopable)) {
    len = loopable.length;
    if (reverse) {
      for (i = len - 1; i >= 0; i--) {
        fn.call(thisArg, loopable[i], i);
      }
    } else {
      for (i = 0; i < len; i++) {
        fn.call(thisArg, loopable[i], i);
      }
    }
  } else if (isObject(loopable)) {
    keys = Object.keys(loopable);
    len = keys.length;
    for (i = 0; i < len; i++) {
      fn.call(thisArg, loopable[keys[i]], keys[i]);
    }
  }
}
function _elementsEqual(a0, a1) {
  let i, ilen, v0, v1;
  if (!a0 || !a1 || a0.length !== a1.length) {
    return false;
  }
  for (i = 0, ilen = a0.length; i < ilen; ++i) {
    v0 = a0[i];
    v1 = a1[i];
    if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
      return false;
    }
  }
  return true;
}
function clone(source) {
  if (isArray(source)) {
    return source.map(clone);
  }
  if (isObject(source)) {
    const target = /* @__PURE__ */ Object.create(null);
    const keys = Object.keys(source);
    const klen = keys.length;
    let k = 0;
    for (; k < klen; ++k) {
      target[keys[k]] = clone(source[keys[k]]);
    }
    return target;
  }
  return source;
}
function isValidKey(key) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(key) === -1;
}
function _merger(key, target, source, options) {
  if (!isValidKey(key)) {
    return;
  }
  const tval = target[key];
  const sval = source[key];
  if (isObject(tval) && isObject(sval)) {
    merge(tval, sval, options);
  } else {
    target[key] = clone(sval);
  }
}
function merge(target, source, options) {
  const sources = isArray(source) ? source : [
    source
  ];
  const ilen = sources.length;
  if (!isObject(target)) {
    return target;
  }
  options = options || {};
  const merger = options.merger || _merger;
  let current;
  for (let i = 0; i < ilen; ++i) {
    current = sources[i];
    if (!isObject(current)) {
      continue;
    }
    const keys = Object.keys(current);
    for (let k = 0, klen = keys.length; k < klen; ++k) {
      merger(keys[k], target, current, options);
    }
  }
  return target;
}
function mergeIf(target, source) {
  return merge(target, source, {
    merger: _mergerIf
  });
}
function _mergerIf(key, target, source) {
  if (!isValidKey(key)) {
    return;
  }
  const tval = target[key];
  const sval = source[key];
  if (isObject(tval) && isObject(sval)) {
    mergeIf(tval, sval);
  } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = clone(sval);
  }
}
const keyResolvers = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (v) => v,
  // default resolvers
  x: (o) => o.x,
  y: (o) => o.y
};
function _splitKey(key) {
  const parts = key.split(".");
  const keys = [];
  let tmp = "";
  for (const part of parts) {
    tmp += part;
    if (tmp.endsWith("\\")) {
      tmp = tmp.slice(0, -1) + ".";
    } else {
      keys.push(tmp);
      tmp = "";
    }
  }
  return keys;
}
function _getKeyResolver(key) {
  const keys = _splitKey(key);
  return (obj) => {
    for (const k of keys) {
      if (k === "") {
        break;
      }
      obj = obj && obj[k];
    }
    return obj;
  };
}
function resolveObjectKey(obj, key) {
  const resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
  return resolver(obj);
}
function _capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const defined = (value) => typeof value !== "undefined";
const isFunction = (value) => typeof value === "function";
const setsEqual = (a, b) => {
  if (a.size !== b.size) {
    return false;
  }
  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }
  return true;
};
function _isClickEvent(e) {
  return e.type === "mouseup" || e.type === "click" || e.type === "contextmenu";
}
const PI = Math.PI;
const TAU = 2 * PI;
const PITAU = TAU + PI;
const INFINITY = Number.POSITIVE_INFINITY;
const RAD_PER_DEG = PI / 180;
const HALF_PI = PI / 2;
const QUARTER_PI = PI / 4;
const TWO_THIRDS_PI = PI * 2 / 3;
const log10 = Math.log10;
const sign = Math.sign;
function almostEquals(x, y, epsilon) {
  return Math.abs(x - y) < epsilon;
}
function niceNum(range) {
  const roundedRange = Math.round(range);
  range = almostEquals(range, roundedRange, range / 1e3) ? roundedRange : range;
  const niceRange = Math.pow(10, Math.floor(log10(range)));
  const fraction = range / niceRange;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * niceRange;
}
function _factorize(value) {
  const result = [];
  const sqrt = Math.sqrt(value);
  let i;
  for (i = 1; i < sqrt; i++) {
    if (value % i === 0) {
      result.push(i);
      result.push(value / i);
    }
  }
  if (sqrt === (sqrt | 0)) {
    result.push(sqrt);
  }
  result.sort((a, b) => a - b).pop();
  return result;
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function almostWhole(x, epsilon) {
  const rounded = Math.round(x);
  return rounded - epsilon <= x && rounded + epsilon >= x;
}
function _setMinAndMaxByKey(array, target, property) {
  let i, ilen, value;
  for (i = 0, ilen = array.length; i < ilen; i++) {
    value = array[i][property];
    if (!isNaN(value)) {
      target.min = Math.min(target.min, value);
      target.max = Math.max(target.max, value);
    }
  }
}
function toRadians(degrees) {
  return degrees * (PI / 180);
}
function toDegrees(radians) {
  return radians * (180 / PI);
}
function _decimalPlaces(x) {
  if (!isNumberFinite(x)) {
    return;
  }
  let e = 1;
  let p = 0;
  while (Math.round(x * e) / e !== x) {
    e *= 10;
    p++;
  }
  return p;
}
function getAngleFromPoint(centrePoint, anglePoint) {
  const distanceFromXCenter = anglePoint.x - centrePoint.x;
  const distanceFromYCenter = anglePoint.y - centrePoint.y;
  const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
  let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
  if (angle < -0.5 * PI) {
    angle += TAU;
  }
  return {
    angle,
    distance: radialDistanceFromCenter
  };
}
function distanceBetweenPoints(pt1, pt2) {
  return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}
function _angleDiff(a, b) {
  return (a - b + PITAU) % TAU - PI;
}
function _normalizeAngle(a) {
  return (a % TAU + TAU) % TAU;
}
function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
  const a = _normalizeAngle(angle);
  const s = _normalizeAngle(start);
  const e = _normalizeAngle(end);
  const angleToStart = _normalizeAngle(s - a);
  const angleToEnd = _normalizeAngle(e - a);
  const startToAngle = _normalizeAngle(a - s);
  const endToAngle = _normalizeAngle(a - e);
  return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
}
function _limitValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function _int16Range(value) {
  return _limitValue(value, -32768, 32767);
}
function _isBetween(value, start, end, epsilon = 1e-6) {
  return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
}
function _lookup(table, value, cmp) {
  cmp = cmp || ((index2) => table[index2] < value);
  let hi = table.length - 1;
  let lo = 0;
  let mid;
  while (hi - lo > 1) {
    mid = lo + hi >> 1;
    if (cmp(mid)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return {
    lo,
    hi
  };
}
const _lookupByKey = (table, key, value, last) => _lookup(table, value, last ? (index2) => {
  const ti = table[index2][key];
  return ti < value || ti === value && table[index2 + 1][key] === value;
} : (index2) => table[index2][key] < value);
const _rlookupByKey = (table, key, value) => _lookup(table, value, (index2) => table[index2][key] >= value);
function _filterBetween(values, min, max) {
  let start = 0;
  let end = values.length;
  while (start < end && values[start] < min) {
    start++;
  }
  while (end > start && values[end - 1] > max) {
    end--;
  }
  return start > 0 || end < values.length ? values.slice(start, end) : values;
}
const arrayEvents = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function listenArrayEvents(array, listener) {
  if (array._chartjs) {
    array._chartjs.listeners.push(listener);
    return;
  }
  Object.defineProperty(array, "_chartjs", {
    configurable: true,
    enumerable: false,
    value: {
      listeners: [
        listener
      ]
    }
  });
  arrayEvents.forEach((key) => {
    const method = "_onData" + _capitalize(key);
    const base = array[key];
    Object.defineProperty(array, key, {
      configurable: true,
      enumerable: false,
      value(...args) {
        const res = base.apply(this, args);
        array._chartjs.listeners.forEach((object) => {
          if (typeof object[method] === "function") {
            object[method](...args);
          }
        });
        return res;
      }
    });
  });
}
function unlistenArrayEvents(array, listener) {
  const stub = array._chartjs;
  if (!stub) {
    return;
  }
  const listeners = stub.listeners;
  const index2 = listeners.indexOf(listener);
  if (index2 !== -1) {
    listeners.splice(index2, 1);
  }
  if (listeners.length > 0) {
    return;
  }
  arrayEvents.forEach((key) => {
    delete array[key];
  });
  delete array._chartjs;
}
function _arrayUnique(items) {
  const set2 = new Set(items);
  if (set2.size === items.length) {
    return items;
  }
  return Array.from(set2);
}
const requestAnimFrame = function() {
  if (typeof window === "undefined") {
    return function(callback2) {
      return callback2();
    };
  }
  return window.requestAnimationFrame;
}();
function throttled(fn, thisArg) {
  let argsToUse = [];
  let ticking = false;
  return function(...args) {
    argsToUse = args;
    if (!ticking) {
      ticking = true;
      requestAnimFrame.call(window, () => {
        ticking = false;
        fn.apply(thisArg, argsToUse);
      });
    }
  };
}
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    if (delay) {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay, args);
    } else {
      fn.apply(this, args);
    }
    return delay;
  };
}
const _toLeftRightCenter = (align) => align === "start" ? "left" : align === "end" ? "right" : "center";
const _alignStartEnd = (align, start, end) => align === "start" ? start : align === "end" ? end : (start + end) / 2;
const _textX = (align, left, right, rtl) => {
  const check = rtl ? "left" : "right";
  return align === check ? right : align === "center" ? (left + right) / 2 : left;
};
function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
  const pointCount = points.length;
  let start = 0;
  let count = pointCount;
  if (meta._sorted) {
    const { iScale, _parsed } = meta;
    const axis = iScale.axis;
    const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
    if (minDefined) {
      start = _limitValue(Math.min(
        // @ts-expect-error Need to type _parsed
        _lookupByKey(_parsed, axis, min).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo
      ), 0, pointCount - 1);
    }
    if (maxDefined) {
      count = _limitValue(Math.max(
        // @ts-expect-error Need to type _parsed
        _lookupByKey(_parsed, iScale.axis, max, true).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max), true).hi + 1
      ), start, pointCount) - start;
    } else {
      count = pointCount - start;
    }
  }
  return {
    start,
    count
  };
}
function _scaleRangesChanged(meta) {
  const { xScale, yScale, _scaleRanges } = meta;
  const newRanges = {
    xmin: xScale.min,
    xmax: xScale.max,
    ymin: yScale.min,
    ymax: yScale.max
  };
  if (!_scaleRanges) {
    meta._scaleRanges = newRanges;
    return true;
  }
  const changed = _scaleRanges.xmin !== xScale.min || _scaleRanges.xmax !== xScale.max || _scaleRanges.ymin !== yScale.min || _scaleRanges.ymax !== yScale.max;
  Object.assign(_scaleRanges, newRanges);
  return changed;
}
const atEdge = (t) => t === 0 || t === 1;
const elasticIn = (t, s, p) => -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
const elasticOut = (t, s, p) => Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
const effects = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => -t * (t - 2),
  easeInOutQuad: (t) => (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => (t -= 1) * t * t + 1,
  easeInOutCubic: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => -((t -= 1) * t * t * t - 1),
  easeInOutQuart: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => (t -= 1) * t * t * t * t + 1,
  easeInOutQuint: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
  easeInSine: (t) => -Math.cos(t * HALF_PI) + 1,
  easeOutSine: (t) => Math.sin(t * HALF_PI),
  easeInOutSine: (t) => -0.5 * (Math.cos(PI * t) - 1),
  easeInExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: (t) => t === 1 ? 1 : -Math.pow(2, -10 * t) + 1,
  easeInOutExpo: (t) => atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
  easeInCirc: (t) => t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
  easeOutCirc: (t) => Math.sqrt(1 - (t -= 1) * t),
  easeInOutCirc: (t) => (t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
  easeInElastic: (t) => atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
  easeOutElastic: (t) => atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
  easeInOutElastic(t) {
    const s = 0.1125;
    const p = 0.45;
    return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(t * 2, s, p) : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
  },
  easeInBack(t) {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },
  easeOutBack(t) {
    const s = 1.70158;
    return (t -= 1) * t * ((s + 1) * t + s) + 1;
  },
  easeInOutBack(t) {
    let s = 1.70158;
    if ((t /= 0.5) < 1) {
      return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
    }
    return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
  },
  easeInBounce: (t) => 1 - effects.easeOutBounce(1 - t),
  easeOutBounce(t) {
    const m = 7.5625;
    const d = 2.75;
    if (t < 1 / d) {
      return m * t * t;
    }
    if (t < 2 / d) {
      return m * (t -= 1.5 / d) * t + 0.75;
    }
    if (t < 2.5 / d) {
      return m * (t -= 2.25 / d) * t + 0.9375;
    }
    return m * (t -= 2.625 / d) * t + 0.984375;
  },
  easeInOutBounce: (t) => t < 0.5 ? effects.easeInBounce(t * 2) * 0.5 : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5
};
function isPatternOrGradient(value) {
  if (value && typeof value === "object") {
    const type = value.toString();
    return type === "[object CanvasPattern]" || type === "[object CanvasGradient]";
  }
  return false;
}
function color(value) {
  return isPatternOrGradient(value) ? value : new Color(value);
}
function getHoverColor(value) {
  return isPatternOrGradient(value) ? value : new Color(value).saturate(0.5).darken(0.1).hexString();
}
const numbers = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
];
const colors = [
  "color",
  "borderColor",
  "backgroundColor"
];
function applyAnimationsDefaults(defaults2) {
  defaults2.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0
  });
  defaults2.describe("animation", {
    _fallback: false,
    _indexable: false,
    _scriptable: (name) => name !== "onProgress" && name !== "onComplete" && name !== "fn"
  });
  defaults2.set("animations", {
    colors: {
      type: "color",
      properties: colors
    },
    numbers: {
      type: "number",
      properties: numbers
    }
  });
  defaults2.describe("animations", {
    _fallback: "animation"
  });
  defaults2.set("transitions", {
    active: {
      animation: {
        duration: 400
      }
    },
    resize: {
      animation: {
        duration: 0
      }
    },
    show: {
      animations: {
        colors: {
          from: "transparent"
        },
        visible: {
          type: "boolean",
          duration: 0
        }
      }
    },
    hide: {
      animations: {
        colors: {
          to: "transparent"
        },
        visible: {
          type: "boolean",
          easing: "linear",
          fn: (v) => v | 0
        }
      }
    }
  });
}
function applyLayoutsDefaults(defaults2) {
  defaults2.set("layout", {
    autoPadding: true,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
}
const intlCache = /* @__PURE__ */ new Map();
function getNumberFormat(locale, options) {
  options = options || {};
  const cacheKey = locale + JSON.stringify(options);
  let formatter = intlCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    intlCache.set(cacheKey, formatter);
  }
  return formatter;
}
function formatNumber(num, locale, options) {
  return getNumberFormat(locale, options).format(num);
}
const formatters = {
  values(value) {
    return isArray(value) ? value : "" + value;
  },
  numeric(tickValue, index2, ticks) {
    if (tickValue === 0) {
      return "0";
    }
    const locale = this.chart.options.locale;
    let notation;
    let delta = tickValue;
    if (ticks.length > 1) {
      const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
      if (maxTick < 1e-4 || maxTick > 1e15) {
        notation = "scientific";
      }
      delta = calculateDelta(tickValue, ticks);
    }
    const logDelta = log10(Math.abs(delta));
    const numDecimal = isNaN(logDelta) ? 1 : Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
    const options = {
      notation,
      minimumFractionDigits: numDecimal,
      maximumFractionDigits: numDecimal
    };
    Object.assign(options, this.options.ticks.format);
    return formatNumber(tickValue, locale, options);
  },
  logarithmic(tickValue, index2, ticks) {
    if (tickValue === 0) {
      return "0";
    }
    const remain = ticks[index2].significand || tickValue / Math.pow(10, Math.floor(log10(tickValue)));
    if ([
      1,
      2,
      3,
      5,
      10,
      15
    ].includes(remain) || index2 > 0.8 * ticks.length) {
      return formatters.numeric.call(this, tickValue, index2, ticks);
    }
    return "";
  }
};
function calculateDelta(tickValue, ticks) {
  let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
  if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
    delta = tickValue - Math.floor(tickValue);
  }
  return delta;
}
var Ticks = {
  formatters
};
function applyScaleDefaults(defaults2) {
  defaults2.set("scale", {
    display: true,
    offset: false,
    reverse: false,
    beginAtZero: false,
    bounds: "ticks",
    clip: true,
    grace: 0,
    grid: {
      display: true,
      lineWidth: 1,
      drawOnChartArea: true,
      drawTicks: true,
      tickLength: 8,
      tickWidth: (_ctx, options) => options.lineWidth,
      tickColor: (_ctx, options) => options.color,
      offset: false
    },
    border: {
      display: true,
      dash: [],
      dashOffset: 0,
      width: 1
    },
    title: {
      display: false,
      text: "",
      padding: {
        top: 4,
        bottom: 4
      }
    },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: false,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: true,
      autoSkip: true,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: Ticks.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: false,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2
    }
  });
  defaults2.route("scale.ticks", "color", "", "color");
  defaults2.route("scale.grid", "color", "", "borderColor");
  defaults2.route("scale.border", "color", "", "borderColor");
  defaults2.route("scale.title", "color", "", "color");
  defaults2.describe("scale", {
    _fallback: false,
    _scriptable: (name) => !name.startsWith("before") && !name.startsWith("after") && name !== "callback" && name !== "parser",
    _indexable: (name) => name !== "borderDash" && name !== "tickBorderDash" && name !== "dash"
  });
  defaults2.describe("scales", {
    _fallback: "scale"
  });
  defaults2.describe("scale.ticks", {
    _scriptable: (name) => name !== "backdropPadding" && name !== "callback",
    _indexable: (name) => name !== "backdropPadding"
  });
}
const overrides = /* @__PURE__ */ Object.create(null);
const descriptors = /* @__PURE__ */ Object.create(null);
function getScope$1(node, key) {
  if (!key) {
    return node;
  }
  const keys = key.split(".");
  for (let i = 0, n = keys.length; i < n; ++i) {
    const k = keys[i];
    node = node[k] || (node[k] = /* @__PURE__ */ Object.create(null));
  }
  return node;
}
function set(root, scope, values) {
  if (typeof scope === "string") {
    return merge(getScope$1(root, scope), values);
  }
  return merge(getScope$1(root, ""), scope);
}
class Defaults {
  constructor(_descriptors2, _appliers) {
    this.animation = void 0;
    this.backgroundColor = "rgba(0,0,0,0.1)";
    this.borderColor = "rgba(0,0,0,0.1)";
    this.color = "#666";
    this.datasets = {};
    this.devicePixelRatio = (context) => context.chart.platform.getDevicePixelRatio();
    this.elements = {};
    this.events = [
      "mousemove",
      "mouseout",
      "click",
      "touchstart",
      "touchmove"
    ];
    this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: "normal",
      lineHeight: 1.2,
      weight: null
    };
    this.hover = {};
    this.hoverBackgroundColor = (ctx, options) => getHoverColor(options.backgroundColor);
    this.hoverBorderColor = (ctx, options) => getHoverColor(options.borderColor);
    this.hoverColor = (ctx, options) => getHoverColor(options.color);
    this.indexAxis = "x";
    this.interaction = {
      mode: "nearest",
      intersect: true,
      includeInvisible: false
    };
    this.maintainAspectRatio = true;
    this.onHover = null;
    this.onClick = null;
    this.parsing = true;
    this.plugins = {};
    this.responsive = true;
    this.scale = void 0;
    this.scales = {};
    this.showLine = true;
    this.drawActiveElementsOnTop = true;
    this.describe(_descriptors2);
    this.apply(_appliers);
  }
  set(scope, values) {
    return set(this, scope, values);
  }
  get(scope) {
    return getScope$1(this, scope);
  }
  describe(scope, values) {
    return set(descriptors, scope, values);
  }
  override(scope, values) {
    return set(overrides, scope, values);
  }
  route(scope, name, targetScope, targetName) {
    const scopeObject = getScope$1(this, scope);
    const targetScopeObject = getScope$1(this, targetScope);
    const privateName = "_" + name;
    Object.defineProperties(scopeObject, {
      [privateName]: {
        value: scopeObject[name],
        writable: true
      },
      [name]: {
        enumerable: true,
        get() {
          const local = this[privateName];
          const target = targetScopeObject[targetName];
          if (isObject(local)) {
            return Object.assign({}, target, local);
          }
          return valueOrDefault(local, target);
        },
        set(value) {
          this[privateName] = value;
        }
      }
    });
  }
  apply(appliers) {
    appliers.forEach((apply) => apply(this));
  }
}
var defaults = /* @__PURE__ */ new Defaults({
  _scriptable: (name) => !name.startsWith("on"),
  _indexable: (name) => name !== "events",
  hover: {
    _fallback: "interaction"
  },
  interaction: {
    _scriptable: false,
    _indexable: false
  }
}, [
  applyAnimationsDefaults,
  applyLayoutsDefaults,
  applyScaleDefaults
]);
function toFontString(font) {
  if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
    return null;
  }
  return (font.style ? font.style + " " : "") + (font.weight ? font.weight + " " : "") + font.size + "px " + font.family;
}
function _measureText(ctx, data, gc, longest, string) {
  let textWidth = data[string];
  if (!textWidth) {
    textWidth = data[string] = ctx.measureText(string).width;
    gc.push(string);
  }
  if (textWidth > longest) {
    longest = textWidth;
  }
  return longest;
}
function _longestText(ctx, font, arrayOfThings, cache) {
  cache = cache || {};
  let data = cache.data = cache.data || {};
  let gc = cache.garbageCollect = cache.garbageCollect || [];
  if (cache.font !== font) {
    data = cache.data = {};
    gc = cache.garbageCollect = [];
    cache.font = font;
  }
  ctx.save();
  ctx.font = font;
  let longest = 0;
  const ilen = arrayOfThings.length;
  let i, j, jlen, thing, nestedThing;
  for (i = 0; i < ilen; i++) {
    thing = arrayOfThings[i];
    if (thing !== void 0 && thing !== null && !isArray(thing)) {
      longest = _measureText(ctx, data, gc, longest, thing);
    } else if (isArray(thing)) {
      for (j = 0, jlen = thing.length; j < jlen; j++) {
        nestedThing = thing[j];
        if (nestedThing !== void 0 && nestedThing !== null && !isArray(nestedThing)) {
          longest = _measureText(ctx, data, gc, longest, nestedThing);
        }
      }
    }
  }
  ctx.restore();
  const gcLen = gc.length / 2;
  if (gcLen > arrayOfThings.length) {
    for (i = 0; i < gcLen; i++) {
      delete data[gc[i]];
    }
    gc.splice(0, gcLen);
  }
  return longest;
}
function _alignPixel(chart, pixel, width) {
  const devicePixelRatio = chart.currentDevicePixelRatio;
  const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
  return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
}
function clearCanvas(canvas, ctx) {
  ctx = ctx || canvas.getContext("2d");
  ctx.save();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
function drawPoint(ctx, options, x, y) {
  drawPointLegend(ctx, options, x, y, null);
}
function drawPointLegend(ctx, options, x, y, w) {
  let type, xOffset, yOffset, size, cornerRadius, width, xOffsetW, yOffsetW;
  const style = options.pointStyle;
  const rotation = options.rotation;
  const radius = options.radius;
  let rad = (rotation || 0) * RAD_PER_DEG;
  if (style && typeof style === "object") {
    type = style.toString();
    if (type === "[object HTMLImageElement]" || type === "[object HTMLCanvasElement]") {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
      ctx.restore();
      return;
    }
  }
  if (isNaN(radius) || radius <= 0) {
    return;
  }
  ctx.beginPath();
  switch (style) {
    default:
      if (w) {
        ctx.ellipse(x, y, w / 2, radius, 0, 0, TAU);
      } else {
        ctx.arc(x, y, radius, 0, TAU);
      }
      ctx.closePath();
      break;
    case "triangle":
      width = w ? w / 2 : radius;
      ctx.moveTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
      ctx.closePath();
      break;
    case "rectRounded":
      cornerRadius = radius * 0.516;
      size = radius - cornerRadius;
      xOffset = Math.cos(rad + QUARTER_PI) * size;
      xOffsetW = Math.cos(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
      yOffset = Math.sin(rad + QUARTER_PI) * size;
      yOffsetW = Math.sin(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
      ctx.arc(x - xOffsetW, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
      ctx.arc(x + yOffsetW, y - xOffset, cornerRadius, rad - HALF_PI, rad);
      ctx.arc(x + xOffsetW, y + yOffset, cornerRadius, rad, rad + HALF_PI);
      ctx.arc(x - yOffsetW, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
      ctx.closePath();
      break;
    case "rect":
      if (!rotation) {
        size = Math.SQRT1_2 * radius;
        width = w ? w / 2 : size;
        ctx.rect(x - width, y - size, 2 * width, 2 * size);
        break;
      }
      rad += QUARTER_PI;
    case "rectRot":
      xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
      ctx.moveTo(x - xOffsetW, y - yOffset);
      ctx.lineTo(x + yOffsetW, y - xOffset);
      ctx.lineTo(x + xOffsetW, y + yOffset);
      ctx.lineTo(x - yOffsetW, y + xOffset);
      ctx.closePath();
      break;
    case "crossRot":
      rad += QUARTER_PI;
    case "cross":
      xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
      ctx.moveTo(x - xOffsetW, y - yOffset);
      ctx.lineTo(x + xOffsetW, y + yOffset);
      ctx.moveTo(x + yOffsetW, y - xOffset);
      ctx.lineTo(x - yOffsetW, y + xOffset);
      break;
    case "star":
      xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
      ctx.moveTo(x - xOffsetW, y - yOffset);
      ctx.lineTo(x + xOffsetW, y + yOffset);
      ctx.moveTo(x + yOffsetW, y - xOffset);
      ctx.lineTo(x - yOffsetW, y + xOffset);
      rad += QUARTER_PI;
      xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
      ctx.moveTo(x - xOffsetW, y - yOffset);
      ctx.lineTo(x + xOffsetW, y + yOffset);
      ctx.moveTo(x + yOffsetW, y - xOffset);
      ctx.lineTo(x - yOffsetW, y + xOffset);
      break;
    case "line":
      xOffset = w ? w / 2 : Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      break;
    case "dash":
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(rad) * (w ? w / 2 : radius), y + Math.sin(rad) * radius);
      break;
    case false:
      ctx.closePath();
      break;
  }
  ctx.fill();
  if (options.borderWidth > 0) {
    ctx.stroke();
  }
}
function _isPointInArea(point, area, margin) {
  margin = margin || 0.5;
  return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
}
function clipArea(ctx, area) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  ctx.clip();
}
function unclipArea(ctx) {
  ctx.restore();
}
function _steppedLineTo(ctx, previous, target, flip, mode) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }
  if (mode === "middle") {
    const midpoint = (previous.x + target.x) / 2;
    ctx.lineTo(midpoint, previous.y);
    ctx.lineTo(midpoint, target.y);
  } else if (mode === "after" !== !!flip) {
    ctx.lineTo(previous.x, target.y);
  } else {
    ctx.lineTo(target.x, previous.y);
  }
  ctx.lineTo(target.x, target.y);
}
function _bezierCurveTo(ctx, previous, target, flip) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }
  ctx.bezierCurveTo(flip ? previous.cp1x : previous.cp2x, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2x : target.cp1x, flip ? target.cp2y : target.cp1y, target.x, target.y);
}
function setRenderOpts(ctx, opts) {
  if (opts.translation) {
    ctx.translate(opts.translation[0], opts.translation[1]);
  }
  if (!isNullOrUndef(opts.rotation)) {
    ctx.rotate(opts.rotation);
  }
  if (opts.color) {
    ctx.fillStyle = opts.color;
  }
  if (opts.textAlign) {
    ctx.textAlign = opts.textAlign;
  }
  if (opts.textBaseline) {
    ctx.textBaseline = opts.textBaseline;
  }
}
function decorateText(ctx, x, y, line, opts) {
  if (opts.strikethrough || opts.underline) {
    const metrics = ctx.measureText(line);
    const left = x - metrics.actualBoundingBoxLeft;
    const right = x + metrics.actualBoundingBoxRight;
    const top = y - metrics.actualBoundingBoxAscent;
    const bottom = y + metrics.actualBoundingBoxDescent;
    const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.lineWidth = opts.decorationWidth || 2;
    ctx.moveTo(left, yDecoration);
    ctx.lineTo(right, yDecoration);
    ctx.stroke();
  }
}
function drawBackdrop(ctx, opts) {
  const oldColor = ctx.fillStyle;
  ctx.fillStyle = opts.color;
  ctx.fillRect(opts.left, opts.top, opts.width, opts.height);
  ctx.fillStyle = oldColor;
}
function renderText(ctx, text, x, y, font, opts = {}) {
  const lines = isArray(text) ? text : [
    text
  ];
  const stroke = opts.strokeWidth > 0 && opts.strokeColor !== "";
  let i, line;
  ctx.save();
  ctx.font = font.string;
  setRenderOpts(ctx, opts);
  for (i = 0; i < lines.length; ++i) {
    line = lines[i];
    if (opts.backdrop) {
      drawBackdrop(ctx, opts.backdrop);
    }
    if (stroke) {
      if (opts.strokeColor) {
        ctx.strokeStyle = opts.strokeColor;
      }
      if (!isNullOrUndef(opts.strokeWidth)) {
        ctx.lineWidth = opts.strokeWidth;
      }
      ctx.strokeText(line, x, y, opts.maxWidth);
    }
    ctx.fillText(line, x, y, opts.maxWidth);
    decorateText(ctx, x, y, line, opts);
    y += Number(font.lineHeight);
  }
  ctx.restore();
}
function addRoundedRectPath(ctx, rect) {
  const { x, y, w, h, radius } = rect;
  ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, 1.5 * PI, PI, true);
  ctx.lineTo(x, y + h - radius.bottomLeft);
  ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
  ctx.lineTo(x + w - radius.bottomRight, y + h);
  ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
  ctx.lineTo(x + w, y + radius.topRight);
  ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
  ctx.lineTo(x + radius.topLeft, y);
}
const LINE_HEIGHT = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/;
const FONT_STYLE = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function toLineHeight(value, size) {
  const matches = ("" + value).match(LINE_HEIGHT);
  if (!matches || matches[1] === "normal") {
    return size * 1.2;
  }
  value = +matches[2];
  switch (matches[3]) {
    case "px":
      return value;
    case "%":
      value /= 100;
      break;
  }
  return size * value;
}
const numberOrZero = (v) => +v || 0;
function _readValueToProps(value, props) {
  const ret = {};
  const objProps = isObject(props);
  const keys = objProps ? Object.keys(props) : props;
  const read = isObject(value) ? objProps ? (prop) => valueOrDefault(value[prop], value[props[prop]]) : (prop) => value[prop] : () => value;
  for (const prop of keys) {
    ret[prop] = numberOrZero(read(prop));
  }
  return ret;
}
function toTRBL(value) {
  return _readValueToProps(value, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function toTRBLCorners(value) {
  return _readValueToProps(value, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function toPadding(value) {
  const obj = toTRBL(value);
  obj.width = obj.left + obj.right;
  obj.height = obj.top + obj.bottom;
  return obj;
}
function toFont(options, fallback) {
  options = options || {};
  fallback = fallback || defaults.font;
  let size = valueOrDefault(options.size, fallback.size);
  if (typeof size === "string") {
    size = parseInt(size, 10);
  }
  let style = valueOrDefault(options.style, fallback.style);
  if (style && !("" + style).match(FONT_STYLE)) {
    console.warn('Invalid font style specified: "' + style + '"');
    style = void 0;
  }
  const font = {
    family: valueOrDefault(options.family, fallback.family),
    lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
    size,
    style,
    weight: valueOrDefault(options.weight, fallback.weight),
    string: ""
  };
  font.string = toFontString(font);
  return font;
}
function resolve(inputs, context, index2, info) {
  let cacheable = true;
  let i, ilen, value;
  for (i = 0, ilen = inputs.length; i < ilen; ++i) {
    value = inputs[i];
    if (value === void 0) {
      continue;
    }
    if (context !== void 0 && typeof value === "function") {
      value = value(context);
      cacheable = false;
    }
    if (index2 !== void 0 && isArray(value)) {
      value = value[index2 % value.length];
      cacheable = false;
    }
    if (value !== void 0) {
      if (info && !cacheable) {
        info.cacheable = false;
      }
      return value;
    }
  }
}
function _addGrace(minmax, grace, beginAtZero) {
  const { min, max } = minmax;
  const change = toDimension(grace, (max - min) / 2);
  const keepZero = (value, add) => beginAtZero && value === 0 ? 0 : value + add;
  return {
    min: keepZero(min, -Math.abs(change)),
    max: keepZero(max, change)
  };
}
function createContext(parentContext, context) {
  return Object.assign(Object.create(parentContext), context);
}
function _createResolver(scopes, prefixes = [
  ""
], rootScopes, fallback, getTarget = () => scopes[0]) {
  const finalRootScopes = rootScopes || scopes;
  if (typeof fallback === "undefined") {
    fallback = _resolve("_fallback", scopes);
  }
  const cache = {
    [Symbol.toStringTag]: "Object",
    _cacheable: true,
    _scopes: scopes,
    _rootScopes: finalRootScopes,
    _fallback: fallback,
    _getTarget: getTarget,
    override: (scope) => _createResolver([
      scope,
      ...scopes
    ], prefixes, finalRootScopes, fallback)
  };
  return new Proxy(cache, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(target, prop) {
      delete target[prop];
      delete target._keys;
      delete scopes[0][prop];
      return true;
    },
    /**
    * A trap for getting property values.
    */
    get(target, prop) {
      return _cached(target, prop, () => _resolveWithPrefixes(prop, prefixes, scopes, target));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(scopes[0]);
    },
    /**
    * A trap for the in operator.
    */
    has(target, prop) {
      return getKeysFromAllScopes(target).includes(prop);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(target) {
      return getKeysFromAllScopes(target);
    },
    /**
    * A trap for setting property values.
    */
    set(target, prop, value) {
      const storage = target._storage || (target._storage = getTarget());
      target[prop] = storage[prop] = value;
      delete target._keys;
      return true;
    }
  });
}
function _attachContext(proxy, context, subProxy, descriptorDefaults) {
  const cache = {
    _cacheable: false,
    _proxy: proxy,
    _context: context,
    _subProxy: subProxy,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: _descriptors(proxy, descriptorDefaults),
    setContext: (ctx) => _attachContext(proxy, ctx, subProxy, descriptorDefaults),
    override: (scope) => _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
  };
  return new Proxy(cache, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(target, prop) {
      delete target[prop];
      delete proxy[prop];
      return true;
    },
    /**
    * A trap for getting property values.
    */
    get(target, prop, receiver) {
      return _cached(target, prop, () => _resolveWithContext(target, prop, receiver));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(target, prop) {
      return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? {
        enumerable: true,
        configurable: true
      } : void 0 : Reflect.getOwnPropertyDescriptor(proxy, prop);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(proxy);
    },
    /**
    * A trap for the in operator.
    */
    has(target, prop) {
      return Reflect.has(proxy, prop);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys() {
      return Reflect.ownKeys(proxy);
    },
    /**
    * A trap for setting property values.
    */
    set(target, prop, value) {
      proxy[prop] = value;
      delete target[prop];
      return true;
    }
  });
}
function _descriptors(proxy, defaults2 = {
  scriptable: true,
  indexable: true
}) {
  const { _scriptable = defaults2.scriptable, _indexable = defaults2.indexable, _allKeys = defaults2.allKeys } = proxy;
  return {
    allKeys: _allKeys,
    scriptable: _scriptable,
    indexable: _indexable,
    isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
    isIndexable: isFunction(_indexable) ? _indexable : () => _indexable
  };
}
const readKey = (prefix, name) => prefix ? prefix + _capitalize(name) : name;
const needsSubResolver = (prop, value) => isObject(value) && prop !== "adapters" && (Object.getPrototypeOf(value) === null || value.constructor === Object);
function _cached(target, prop, resolve2) {
  if (Object.prototype.hasOwnProperty.call(target, prop)) {
    return target[prop];
  }
  const value = resolve2();
  target[prop] = value;
  return value;
}
function _resolveWithContext(target, prop, receiver) {
  const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
  let value = _proxy[prop];
  if (isFunction(value) && descriptors2.isScriptable(prop)) {
    value = _resolveScriptable(prop, value, target, receiver);
  }
  if (isArray(value) && value.length) {
    value = _resolveArray(prop, value, target, descriptors2.isIndexable);
  }
  if (needsSubResolver(prop, value)) {
    value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors2);
  }
  return value;
}
function _resolveScriptable(prop, getValue, target, receiver) {
  const { _proxy, _context, _subProxy, _stack } = target;
  if (_stack.has(prop)) {
    throw new Error("Recursion detected: " + Array.from(_stack).join("->") + "->" + prop);
  }
  _stack.add(prop);
  let value = getValue(_context, _subProxy || receiver);
  _stack.delete(prop);
  if (needsSubResolver(prop, value)) {
    value = createSubResolver(_proxy._scopes, _proxy, prop, value);
  }
  return value;
}
function _resolveArray(prop, value, target, isIndexable) {
  const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
  if (typeof _context.index !== "undefined" && isIndexable(prop)) {
    return value[_context.index % value.length];
  } else if (isObject(value[0])) {
    const arr = value;
    const scopes = _proxy._scopes.filter((s) => s !== arr);
    value = [];
    for (const item of arr) {
      const resolver = createSubResolver(scopes, _proxy, prop, item);
      value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors2));
    }
  }
  return value;
}
function resolveFallback(fallback, prop, value) {
  return isFunction(fallback) ? fallback(prop, value) : fallback;
}
const getScope = (key, parent) => key === true ? parent : typeof key === "string" ? resolveObjectKey(parent, key) : void 0;
function addScopes(set2, parentScopes, key, parentFallback, value) {
  for (const parent of parentScopes) {
    const scope = getScope(key, parent);
    if (scope) {
      set2.add(scope);
      const fallback = resolveFallback(scope._fallback, key, value);
      if (typeof fallback !== "undefined" && fallback !== key && fallback !== parentFallback) {
        return fallback;
      }
    } else if (scope === false && typeof parentFallback !== "undefined" && key !== parentFallback) {
      return null;
    }
  }
  return false;
}
function createSubResolver(parentScopes, resolver, prop, value) {
  const rootScopes = resolver._rootScopes;
  const fallback = resolveFallback(resolver._fallback, prop, value);
  const allScopes = [
    ...parentScopes,
    ...rootScopes
  ];
  const set2 = /* @__PURE__ */ new Set();
  set2.add(value);
  let key = addScopesFromKey(set2, allScopes, prop, fallback || prop, value);
  if (key === null) {
    return false;
  }
  if (typeof fallback !== "undefined" && fallback !== prop) {
    key = addScopesFromKey(set2, allScopes, fallback, key, value);
    if (key === null) {
      return false;
    }
  }
  return _createResolver(Array.from(set2), [
    ""
  ], rootScopes, fallback, () => subGetTarget(resolver, prop, value));
}
function addScopesFromKey(set2, allScopes, key, fallback, item) {
  while (key) {
    key = addScopes(set2, allScopes, key, fallback, item);
  }
  return key;
}
function subGetTarget(resolver, prop, value) {
  const parent = resolver._getTarget();
  if (!(prop in parent)) {
    parent[prop] = {};
  }
  const target = parent[prop];
  if (isArray(target) && isObject(value)) {
    return value;
  }
  return target || {};
}
function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
  let value;
  for (const prefix of prefixes) {
    value = _resolve(readKey(prefix, prop), scopes);
    if (typeof value !== "undefined") {
      return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
    }
  }
}
function _resolve(key, scopes) {
  for (const scope of scopes) {
    if (!scope) {
      continue;
    }
    const value = scope[key];
    if (typeof value !== "undefined") {
      return value;
    }
  }
}
function getKeysFromAllScopes(target) {
  let keys = target._keys;
  if (!keys) {
    keys = target._keys = resolveKeysFromAllScopes(target._scopes);
  }
  return keys;
}
function resolveKeysFromAllScopes(scopes) {
  const set2 = /* @__PURE__ */ new Set();
  for (const scope of scopes) {
    for (const key of Object.keys(scope).filter((k) => !k.startsWith("_"))) {
      set2.add(key);
    }
  }
  return Array.from(set2);
}
function _parseObjectDataRadialScale(meta, data, start, count) {
  const { iScale } = meta;
  const { key = "r" } = this._parsing;
  const parsed = new Array(count);
  let i, ilen, index2, item;
  for (i = 0, ilen = count; i < ilen; ++i) {
    index2 = i + start;
    item = data[index2];
    parsed[i] = {
      r: iScale.parse(resolveObjectKey(item, key), index2)
    };
  }
  return parsed;
}
const EPSILON = Number.EPSILON || 1e-14;
const getPoint = (points, i) => i < points.length && !points[i].skip && points[i];
const getValueAxis = (indexAxis) => indexAxis === "x" ? "y" : "x";
function splineCurve(firstPoint, middlePoint, afterPoint, t) {
  const previous = firstPoint.skip ? middlePoint : firstPoint;
  const current = middlePoint;
  const next = afterPoint.skip ? middlePoint : afterPoint;
  const d01 = distanceBetweenPoints(current, previous);
  const d12 = distanceBetweenPoints(next, current);
  let s01 = d01 / (d01 + d12);
  let s12 = d12 / (d01 + d12);
  s01 = isNaN(s01) ? 0 : s01;
  s12 = isNaN(s12) ? 0 : s12;
  const fa = t * s01;
  const fb = t * s12;
  return {
    previous: {
      x: current.x - fa * (next.x - previous.x),
      y: current.y - fa * (next.y - previous.y)
    },
    next: {
      x: current.x + fb * (next.x - previous.x),
      y: current.y + fb * (next.y - previous.y)
    }
  };
}
function monotoneAdjust(points, deltaK, mK) {
  const pointsLen = points.length;
  let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (let i = 0; i < pointsLen - 1; ++i) {
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);
    if (!pointCurrent || !pointAfter) {
      continue;
    }
    if (almostEquals(deltaK[i], 0, EPSILON)) {
      mK[i] = mK[i + 1] = 0;
      continue;
    }
    alphaK = mK[i] / deltaK[i];
    betaK = mK[i + 1] / deltaK[i];
    squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
    if (squaredMagnitude <= 9) {
      continue;
    }
    tauK = 3 / Math.sqrt(squaredMagnitude);
    mK[i] = alphaK * tauK * deltaK[i];
    mK[i + 1] = betaK * tauK * deltaK[i];
  }
}
function monotoneCompute(points, mK, indexAxis = "x") {
  const valueAxis = getValueAxis(indexAxis);
  const pointsLen = points.length;
  let delta, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (let i = 0; i < pointsLen; ++i) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);
    if (!pointCurrent) {
      continue;
    }
    const iPixel = pointCurrent[indexAxis];
    const vPixel = pointCurrent[valueAxis];
    if (pointBefore) {
      delta = (iPixel - pointBefore[indexAxis]) / 3;
      pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
      pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i];
    }
    if (pointAfter) {
      delta = (pointAfter[indexAxis] - iPixel) / 3;
      pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
      pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i];
    }
  }
}
function splineCurveMonotone(points, indexAxis = "x") {
  const valueAxis = getValueAxis(indexAxis);
  const pointsLen = points.length;
  const deltaK = Array(pointsLen).fill(0);
  const mK = Array(pointsLen);
  let i, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (i = 0; i < pointsLen; ++i) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);
    if (!pointCurrent) {
      continue;
    }
    if (pointAfter) {
      const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
      deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
    }
    mK[i] = !pointBefore ? deltaK[i] : !pointAfter ? deltaK[i - 1] : sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2;
  }
  monotoneAdjust(points, deltaK, mK);
  monotoneCompute(points, mK, indexAxis);
}
function capControlPoint(pt, min, max) {
  return Math.max(Math.min(pt, max), min);
}
function capBezierPoints(points, area) {
  let i, ilen, point, inArea, inAreaPrev;
  let inAreaNext = _isPointInArea(points[0], area);
  for (i = 0, ilen = points.length; i < ilen; ++i) {
    inAreaPrev = inArea;
    inArea = inAreaNext;
    inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
    if (!inArea) {
      continue;
    }
    point = points[i];
    if (inAreaPrev) {
      point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
      point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
    }
    if (inAreaNext) {
      point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
      point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
    }
  }
}
function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
  let i, ilen, point, controlPoints;
  if (options.spanGaps) {
    points = points.filter((pt) => !pt.skip);
  }
  if (options.cubicInterpolationMode === "monotone") {
    splineCurveMonotone(points, indexAxis);
  } else {
    let prev = loop ? points[points.length - 1] : points[0];
    for (i = 0, ilen = points.length; i < ilen; ++i) {
      point = points[i];
      controlPoints = splineCurve(prev, point, points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
      point.cp1x = controlPoints.previous.x;
      point.cp1y = controlPoints.previous.y;
      point.cp2x = controlPoints.next.x;
      point.cp2y = controlPoints.next.y;
      prev = point;
    }
  }
  if (options.capBezierPoints) {
    capBezierPoints(points, area);
  }
}
function _isDomSupported() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function _getParentNode(domNode) {
  let parent = domNode.parentNode;
  if (parent && parent.toString() === "[object ShadowRoot]") {
    parent = parent.host;
  }
  return parent;
}
function parseMaxStyle(styleValue, node, parentProperty) {
  let valueInPixels;
  if (typeof styleValue === "string") {
    valueInPixels = parseInt(styleValue, 10);
    if (styleValue.indexOf("%") !== -1) {
      valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
    }
  } else {
    valueInPixels = styleValue;
  }
  return valueInPixels;
}
const getComputedStyle = (element) => element.ownerDocument.defaultView.getComputedStyle(element, null);
function getStyle(el, property) {
  return getComputedStyle(el).getPropertyValue(property);
}
const positions = [
  "top",
  "right",
  "bottom",
  "left"
];
function getPositionedStyle(styles, style, suffix) {
  const result = {};
  suffix = suffix ? "-" + suffix : "";
  for (let i = 0; i < 4; i++) {
    const pos = positions[i];
    result[pos] = parseFloat(styles[style + "-" + pos + suffix]) || 0;
  }
  result.width = result.left + result.right;
  result.height = result.top + result.bottom;
  return result;
}
const useOffsetPos = (x, y, target) => (x > 0 || y > 0) && (!target || !target.shadowRoot);
function getCanvasPosition(e, canvas) {
  const touches = e.touches;
  const source = touches && touches.length ? touches[0] : e;
  const { offsetX, offsetY } = source;
  let box = false;
  let x, y;
  if (useOffsetPos(offsetX, offsetY, e.target)) {
    x = offsetX;
    y = offsetY;
  } else {
    const rect = canvas.getBoundingClientRect();
    x = source.clientX - rect.left;
    y = source.clientY - rect.top;
    box = true;
  }
  return {
    x,
    y,
    box
  };
}
function getRelativePosition(event, chart) {
  if ("native" in event) {
    return event;
  }
  const { canvas, currentDevicePixelRatio } = chart;
  const style = getComputedStyle(canvas);
  const borderBox = style.boxSizing === "border-box";
  const paddings = getPositionedStyle(style, "padding");
  const borders = getPositionedStyle(style, "border", "width");
  const { x, y, box } = getCanvasPosition(event, canvas);
  const xOffset = paddings.left + (box && borders.left);
  const yOffset = paddings.top + (box && borders.top);
  let { width, height } = chart;
  if (borderBox) {
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }
  return {
    x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
    y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
  };
}
function getContainerSize(canvas, width, height) {
  let maxWidth, maxHeight;
  if (width === void 0 || height === void 0) {
    const container = _getParentNode(canvas);
    if (!container) {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    } else {
      const rect = container.getBoundingClientRect();
      const containerStyle = getComputedStyle(container);
      const containerBorder = getPositionedStyle(containerStyle, "border", "width");
      const containerPadding = getPositionedStyle(containerStyle, "padding");
      width = rect.width - containerPadding.width - containerBorder.width;
      height = rect.height - containerPadding.height - containerBorder.height;
      maxWidth = parseMaxStyle(containerStyle.maxWidth, container, "clientWidth");
      maxHeight = parseMaxStyle(containerStyle.maxHeight, container, "clientHeight");
    }
  }
  return {
    width,
    height,
    maxWidth: maxWidth || INFINITY,
    maxHeight: maxHeight || INFINITY
  };
}
const round1 = (v) => Math.round(v * 10) / 10;
function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
  const style = getComputedStyle(canvas);
  const margins = getPositionedStyle(style, "margin");
  const maxWidth = parseMaxStyle(style.maxWidth, canvas, "clientWidth") || INFINITY;
  const maxHeight = parseMaxStyle(style.maxHeight, canvas, "clientHeight") || INFINITY;
  const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
  let { width, height } = containerSize;
  if (style.boxSizing === "content-box") {
    const borders = getPositionedStyle(style, "border", "width");
    const paddings = getPositionedStyle(style, "padding");
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }
  width = Math.max(0, width - margins.width);
  height = Math.max(0, aspectRatio ? width / aspectRatio : height - margins.height);
  width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
  height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
  if (width && !height) {
    height = round1(width / 2);
  }
  const maintainHeight = bbWidth !== void 0 || bbHeight !== void 0;
  if (maintainHeight && aspectRatio && containerSize.height && height > containerSize.height) {
    height = containerSize.height;
    width = round1(Math.floor(height * aspectRatio));
  }
  return {
    width,
    height
  };
}
function retinaScale(chart, forceRatio, forceStyle) {
  const pixelRatio = forceRatio || 1;
  const deviceHeight = Math.floor(chart.height * pixelRatio);
  const deviceWidth = Math.floor(chart.width * pixelRatio);
  chart.height = Math.floor(chart.height);
  chart.width = Math.floor(chart.width);
  const canvas = chart.canvas;
  if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
    canvas.style.height = `${chart.height}px`;
    canvas.style.width = `${chart.width}px`;
  }
  if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
    chart.currentDevicePixelRatio = pixelRatio;
    canvas.height = deviceHeight;
    canvas.width = deviceWidth;
    chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    return true;
  }
  return false;
}
const supportsEventListenerOptions = function() {
  let passiveSupported = false;
  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    if (_isDomSupported()) {
      window.addEventListener("test", null, options);
      window.removeEventListener("test", null, options);
    }
  } catch (e) {
  }
  return passiveSupported;
}();
function readUsedSize(element, property) {
  const value = getStyle(element, property);
  const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
  return matches ? +matches[1] : void 0;
}
function _pointInLine(p1, p2, t, mode) {
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y)
  };
}
function _steppedInterpolation(p1, p2, t, mode) {
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: mode === "middle" ? t < 0.5 ? p1.y : p2.y : mode === "after" ? t < 1 ? p1.y : p2.y : t > 0 ? p2.y : p1.y
  };
}
function _bezierInterpolation(p1, p2, t, mode) {
  const cp1 = {
    x: p1.cp2x,
    y: p1.cp2y
  };
  const cp2 = {
    x: p2.cp1x,
    y: p2.cp1y
  };
  const a = _pointInLine(p1, cp1, t);
  const b = _pointInLine(cp1, cp2, t);
  const c = _pointInLine(cp2, p2, t);
  const d = _pointInLine(a, b, t);
  const e = _pointInLine(b, c, t);
  return _pointInLine(d, e, t);
}
const getRightToLeftAdapter = function(rectX, width) {
  return {
    x(x) {
      return rectX + rectX + width - x;
    },
    setWidth(w) {
      width = w;
    },
    textAlign(align) {
      if (align === "center") {
        return align;
      }
      return align === "right" ? "left" : "right";
    },
    xPlus(x, value) {
      return x - value;
    },
    leftForLtr(x, itemWidth) {
      return x - itemWidth;
    }
  };
};
const getLeftToRightAdapter = function() {
  return {
    x(x) {
      return x;
    },
    setWidth(w) {
    },
    textAlign(align) {
      return align;
    },
    xPlus(x, value) {
      return x + value;
    },
    leftForLtr(x, _itemWidth) {
      return x;
    }
  };
};
function getRtlAdapter(rtl, rectX, width) {
  return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
}
function overrideTextDirection(ctx, direction) {
  let style, original;
  if (direction === "ltr" || direction === "rtl") {
    style = ctx.canvas.style;
    original = [
      style.getPropertyValue("direction"),
      style.getPropertyPriority("direction")
    ];
    style.setProperty("direction", direction, "important");
    ctx.prevTextDirection = original;
  }
}
function restoreTextDirection(ctx, original) {
  if (original !== void 0) {
    delete ctx.prevTextDirection;
    ctx.canvas.style.setProperty("direction", original[0], original[1]);
  }
}
function propertyFn(property) {
  if (property === "angle") {
    return {
      between: _angleBetween,
      compare: _angleDiff,
      normalize: _normalizeAngle
    };
  }
  return {
    between: _isBetween,
    compare: (a, b) => a - b,
    normalize: (x) => x
  };
}
function normalizeSegment({ start, end, count, loop, style }) {
  return {
    start: start % count,
    end: end % count,
    loop: loop && (end - start + 1) % count === 0,
    style
  };
}
function getSegment(segment, points, bounds) {
  const { property, start: startBound, end: endBound } = bounds;
  const { between, normalize } = propertyFn(property);
  const count = points.length;
  let { start, end, loop } = segment;
  let i, ilen;
  if (loop) {
    start += count;
    end += count;
    for (i = 0, ilen = count; i < ilen; ++i) {
      if (!between(normalize(points[start % count][property]), startBound, endBound)) {
        break;
      }
      start--;
      end--;
    }
    start %= count;
    end %= count;
  }
  if (end < start) {
    end += count;
  }
  return {
    start,
    end,
    loop,
    style: segment.style
  };
}
function _boundSegment(segment, points, bounds) {
  if (!bounds) {
    return [
      segment
    ];
  }
  const { property, start: startBound, end: endBound } = bounds;
  const count = points.length;
  const { compare, between, normalize } = propertyFn(property);
  const { start, end, loop, style } = getSegment(segment, points, bounds);
  const result = [];
  let inside = false;
  let subStart = null;
  let value, point, prevValue;
  const startIsBefore = () => between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
  const endIsBefore = () => compare(endBound, value) === 0 || between(endBound, prevValue, value);
  const shouldStart = () => inside || startIsBefore();
  const shouldStop = () => !inside || endIsBefore();
  for (let i = start, prev = start; i <= end; ++i) {
    point = points[i % count];
    if (point.skip) {
      continue;
    }
    value = normalize(point[property]);
    if (value === prevValue) {
      continue;
    }
    inside = between(value, startBound, endBound);
    if (subStart === null && shouldStart()) {
      subStart = compare(value, startBound) === 0 ? i : prev;
    }
    if (subStart !== null && shouldStop()) {
      result.push(normalizeSegment({
        start: subStart,
        end: i,
        loop,
        count,
        style
      }));
      subStart = null;
    }
    prev = i;
    prevValue = value;
  }
  if (subStart !== null) {
    result.push(normalizeSegment({
      start: subStart,
      end,
      loop,
      count,
      style
    }));
  }
  return result;
}
function _boundSegments(line, bounds) {
  const result = [];
  const segments = line.segments;
  for (let i = 0; i < segments.length; i++) {
    const sub = _boundSegment(segments[i], line.points, bounds);
    if (sub.length) {
      result.push(...sub);
    }
  }
  return result;
}
function findStartAndEnd(points, count, loop, spanGaps) {
  let start = 0;
  let end = count - 1;
  if (loop && !spanGaps) {
    while (start < count && !points[start].skip) {
      start++;
    }
  }
  while (start < count && points[start].skip) {
    start++;
  }
  start %= count;
  if (loop) {
    end += start;
  }
  while (end > start && points[end % count].skip) {
    end--;
  }
  end %= count;
  return {
    start,
    end
  };
}
function solidSegments(points, start, max, loop) {
  const count = points.length;
  const result = [];
  let last = start;
  let prev = points[start];
  let end;
  for (end = start + 1; end <= max; ++end) {
    const cur = points[end % count];
    if (cur.skip || cur.stop) {
      if (!prev.skip) {
        loop = false;
        result.push({
          start: start % count,
          end: (end - 1) % count,
          loop
        });
        start = last = cur.stop ? end : null;
      }
    } else {
      last = end;
      if (prev.skip) {
        start = end;
      }
    }
    prev = cur;
  }
  if (last !== null) {
    result.push({
      start: start % count,
      end: last % count,
      loop
    });
  }
  return result;
}
function _computeSegments(line, segmentOptions) {
  const points = line.points;
  const spanGaps = line.options.spanGaps;
  const count = points.length;
  if (!count) {
    return [];
  }
  const loop = !!line._loop;
  const { start, end } = findStartAndEnd(points, count, loop, spanGaps);
  if (spanGaps === true) {
    return splitByStyles(line, [
      {
        start,
        end,
        loop
      }
    ], points, segmentOptions);
  }
  const max = end < start ? end + count : end;
  const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
  return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
}
function splitByStyles(line, segments, points, segmentOptions) {
  if (!segmentOptions || !segmentOptions.setContext || !points) {
    return segments;
  }
  return doSplitByStyles(line, segments, points, segmentOptions);
}
function doSplitByStyles(line, segments, points, segmentOptions) {
  const chartContext = line._chart.getContext();
  const baseStyle = readStyle(line.options);
  const { _datasetIndex: datasetIndex, options: { spanGaps } } = line;
  const count = points.length;
  const result = [];
  let prevStyle = baseStyle;
  let start = segments[0].start;
  let i = start;
  function addStyle(s, e, l, st) {
    const dir = spanGaps ? -1 : 1;
    if (s === e) {
      return;
    }
    s += count;
    while (points[s % count].skip) {
      s -= dir;
    }
    while (points[e % count].skip) {
      e += dir;
    }
    if (s % count !== e % count) {
      result.push({
        start: s % count,
        end: e % count,
        loop: l,
        style: st
      });
      prevStyle = st;
      start = e % count;
    }
  }
  for (const segment of segments) {
    start = spanGaps ? start : segment.start;
    let prev = points[start % count];
    let style;
    for (i = start + 1; i <= segment.end; i++) {
      const pt = points[i % count];
      style = readStyle(segmentOptions.setContext(createContext(chartContext, {
        type: "segment",
        p0: prev,
        p1: pt,
        p0DataIndex: (i - 1) % count,
        p1DataIndex: i % count,
        datasetIndex
      })));
      if (styleChanged(style, prevStyle)) {
        addStyle(start, i - 1, segment.loop, prevStyle);
      }
      prev = pt;
      prevStyle = style;
    }
    if (start < i - 1) {
      addStyle(start, i - 1, segment.loop, prevStyle);
    }
  }
  return result;
}
function readStyle(options) {
  return {
    backgroundColor: options.backgroundColor,
    borderCapStyle: options.borderCapStyle,
    borderDash: options.borderDash,
    borderDashOffset: options.borderDashOffset,
    borderJoinStyle: options.borderJoinStyle,
    borderWidth: options.borderWidth,
    borderColor: options.borderColor
  };
}
function styleChanged(style, prevStyle) {
  if (!prevStyle) {
    return false;
  }
  const cache = [];
  const replacer = function(key, value) {
    if (!isPatternOrGradient(value)) {
      return value;
    }
    if (!cache.includes(value)) {
      cache.push(value);
    }
    return cache.indexOf(value);
  };
  return JSON.stringify(style, replacer) !== JSON.stringify(prevStyle, replacer);
}
/*!
 * Chart.js v4.4.2
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */
class Animator {
  constructor() {
    this._request = null;
    this._charts = /* @__PURE__ */ new Map();
    this._running = false;
    this._lastDate = void 0;
  }
  _notify(chart, anims, date, type) {
    const callbacks = anims.listeners[type];
    const numSteps = anims.duration;
    callbacks.forEach((fn) => fn({
      chart,
      initial: anims.initial,
      numSteps,
      currentStep: Math.min(date - anims.start, numSteps)
    }));
  }
  _refresh() {
    if (this._request) {
      return;
    }
    this._running = true;
    this._request = requestAnimFrame.call(window, () => {
      this._update();
      this._request = null;
      if (this._running) {
        this._refresh();
      }
    });
  }
  _update(date = Date.now()) {
    let remaining = 0;
    this._charts.forEach((anims, chart) => {
      if (!anims.running || !anims.items.length) {
        return;
      }
      const items = anims.items;
      let i = items.length - 1;
      let draw2 = false;
      let item;
      for (; i >= 0; --i) {
        item = items[i];
        if (item._active) {
          if (item._total > anims.duration) {
            anims.duration = item._total;
          }
          item.tick(date);
          draw2 = true;
        } else {
          items[i] = items[items.length - 1];
          items.pop();
        }
      }
      if (draw2) {
        chart.draw();
        this._notify(chart, anims, date, "progress");
      }
      if (!items.length) {
        anims.running = false;
        this._notify(chart, anims, date, "complete");
        anims.initial = false;
      }
      remaining += items.length;
    });
    this._lastDate = date;
    if (remaining === 0) {
      this._running = false;
    }
  }
  _getAnims(chart) {
    const charts = this._charts;
    let anims = charts.get(chart);
    if (!anims) {
      anims = {
        running: false,
        initial: true,
        items: [],
        listeners: {
          complete: [],
          progress: []
        }
      };
      charts.set(chart, anims);
    }
    return anims;
  }
  listen(chart, event, cb) {
    this._getAnims(chart).listeners[event].push(cb);
  }
  add(chart, items) {
    if (!items || !items.length) {
      return;
    }
    this._getAnims(chart).items.push(...items);
  }
  has(chart) {
    return this._getAnims(chart).items.length > 0;
  }
  start(chart) {
    const anims = this._charts.get(chart);
    if (!anims) {
      return;
    }
    anims.running = true;
    anims.start = Date.now();
    anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);
    this._refresh();
  }
  running(chart) {
    if (!this._running) {
      return false;
    }
    const anims = this._charts.get(chart);
    if (!anims || !anims.running || !anims.items.length) {
      return false;
    }
    return true;
  }
  stop(chart) {
    const anims = this._charts.get(chart);
    if (!anims || !anims.items.length) {
      return;
    }
    const items = anims.items;
    let i = items.length - 1;
    for (; i >= 0; --i) {
      items[i].cancel();
    }
    anims.items = [];
    this._notify(chart, anims, Date.now(), "complete");
  }
  remove(chart) {
    return this._charts.delete(chart);
  }
}
var animator = /* @__PURE__ */ new Animator();
const transparent = "transparent";
const interpolators = {
  boolean(from2, to2, factor) {
    return factor > 0.5 ? to2 : from2;
  },
  color(from2, to2, factor) {
    const c0 = color(from2 || transparent);
    const c1 = c0.valid && color(to2 || transparent);
    return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to2;
  },
  number(from2, to2, factor) {
    return from2 + (to2 - from2) * factor;
  }
};
class Animation {
  constructor(cfg, target, prop, to2) {
    const currentValue = target[prop];
    to2 = resolve([
      cfg.to,
      to2,
      currentValue,
      cfg.from
    ]);
    const from2 = resolve([
      cfg.from,
      currentValue,
      to2
    ]);
    this._active = true;
    this._fn = cfg.fn || interpolators[cfg.type || typeof from2];
    this._easing = effects[cfg.easing] || effects.linear;
    this._start = Math.floor(Date.now() + (cfg.delay || 0));
    this._duration = this._total = Math.floor(cfg.duration);
    this._loop = !!cfg.loop;
    this._target = target;
    this._prop = prop;
    this._from = from2;
    this._to = to2;
    this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(cfg, to2, date) {
    if (this._active) {
      this._notify(false);
      const currentValue = this._target[this._prop];
      const elapsed = date - this._start;
      const remain = this._duration - elapsed;
      this._start = date;
      this._duration = Math.floor(Math.max(remain, cfg.duration));
      this._total += elapsed;
      this._loop = !!cfg.loop;
      this._to = resolve([
        cfg.to,
        to2,
        currentValue,
        cfg.from
      ]);
      this._from = resolve([
        cfg.from,
        currentValue,
        to2
      ]);
    }
  }
  cancel() {
    if (this._active) {
      this.tick(Date.now());
      this._active = false;
      this._notify(false);
    }
  }
  tick(date) {
    const elapsed = date - this._start;
    const duration = this._duration;
    const prop = this._prop;
    const from2 = this._from;
    const loop = this._loop;
    const to2 = this._to;
    let factor;
    this._active = from2 !== to2 && (loop || elapsed < duration);
    if (!this._active) {
      this._target[prop] = to2;
      this._notify(true);
      return;
    }
    if (elapsed < 0) {
      this._target[prop] = from2;
      return;
    }
    factor = elapsed / duration % 2;
    factor = loop && factor > 1 ? 2 - factor : factor;
    factor = this._easing(Math.min(1, Math.max(0, factor)));
    this._target[prop] = this._fn(from2, to2, factor);
  }
  wait() {
    const promises = this._promises || (this._promises = []);
    return new Promise((res, rej) => {
      promises.push({
        res,
        rej
      });
    });
  }
  _notify(resolved) {
    const method = resolved ? "res" : "rej";
    const promises = this._promises || [];
    for (let i = 0; i < promises.length; i++) {
      promises[i][method]();
    }
  }
}
class Animations {
  constructor(chart, config) {
    this._chart = chart;
    this._properties = /* @__PURE__ */ new Map();
    this.configure(config);
  }
  configure(config) {
    if (!isObject(config)) {
      return;
    }
    const animationOptions = Object.keys(defaults.animation);
    const animatedProps = this._properties;
    Object.getOwnPropertyNames(config).forEach((key) => {
      const cfg = config[key];
      if (!isObject(cfg)) {
        return;
      }
      const resolved = {};
      for (const option of animationOptions) {
        resolved[option] = cfg[option];
      }
      (isArray(cfg.properties) && cfg.properties || [
        key
      ]).forEach((prop) => {
        if (prop === key || !animatedProps.has(prop)) {
          animatedProps.set(prop, resolved);
        }
      });
    });
  }
  _animateOptions(target, values) {
    const newOptions = values.options;
    const options = resolveTargetOptions(target, newOptions);
    if (!options) {
      return [];
    }
    const animations = this._createAnimations(options, newOptions);
    if (newOptions.$shared) {
      awaitAll(target.options.$animations, newOptions).then(() => {
        target.options = newOptions;
      }, () => {
      });
    }
    return animations;
  }
  _createAnimations(target, values) {
    const animatedProps = this._properties;
    const animations = [];
    const running = target.$animations || (target.$animations = {});
    const props = Object.keys(values);
    const date = Date.now();
    let i;
    for (i = props.length - 1; i >= 0; --i) {
      const prop = props[i];
      if (prop.charAt(0) === "$") {
        continue;
      }
      if (prop === "options") {
        animations.push(...this._animateOptions(target, values));
        continue;
      }
      const value = values[prop];
      let animation = running[prop];
      const cfg = animatedProps.get(prop);
      if (animation) {
        if (cfg && animation.active()) {
          animation.update(cfg, value, date);
          continue;
        } else {
          animation.cancel();
        }
      }
      if (!cfg || !cfg.duration) {
        target[prop] = value;
        continue;
      }
      running[prop] = animation = new Animation(cfg, target, prop, value);
      animations.push(animation);
    }
    return animations;
  }
  update(target, values) {
    if (this._properties.size === 0) {
      Object.assign(target, values);
      return;
    }
    const animations = this._createAnimations(target, values);
    if (animations.length) {
      animator.add(this._chart, animations);
      return true;
    }
  }
}
function awaitAll(animations, properties) {
  const running = [];
  const keys = Object.keys(properties);
  for (let i = 0; i < keys.length; i++) {
    const anim = animations[keys[i]];
    if (anim && anim.active()) {
      running.push(anim.wait());
    }
  }
  return Promise.all(running);
}
function resolveTargetOptions(target, newOptions) {
  if (!newOptions) {
    return;
  }
  let options = target.options;
  if (!options) {
    target.options = newOptions;
    return;
  }
  if (options.$shared) {
    target.options = options = Object.assign({}, options, {
      $shared: false,
      $animations: {}
    });
  }
  return options;
}
function scaleClip(scale, allowedOverflow) {
  const opts = scale && scale.options || {};
  const reverse = opts.reverse;
  const min = opts.min === void 0 ? allowedOverflow : 0;
  const max = opts.max === void 0 ? allowedOverflow : 0;
  return {
    start: reverse ? max : min,
    end: reverse ? min : max
  };
}
function defaultClip(xScale, yScale, allowedOverflow) {
  if (allowedOverflow === false) {
    return false;
  }
  const x = scaleClip(xScale, allowedOverflow);
  const y = scaleClip(yScale, allowedOverflow);
  return {
    top: y.end,
    right: x.end,
    bottom: y.start,
    left: x.start
  };
}
function toClip(value) {
  let t, r, b, l;
  if (isObject(value)) {
    t = value.top;
    r = value.right;
    b = value.bottom;
    l = value.left;
  } else {
    t = r = b = l = value;
  }
  return {
    top: t,
    right: r,
    bottom: b,
    left: l,
    disabled: value === false
  };
}
function getSortedDatasetIndices(chart, filterVisible) {
  const keys = [];
  const metasets = chart._getSortedDatasetMetas(filterVisible);
  let i, ilen;
  for (i = 0, ilen = metasets.length; i < ilen; ++i) {
    keys.push(metasets[i].index);
  }
  return keys;
}
function applyStack(stack, value, dsIndex, options = {}) {
  const keys = stack.keys;
  const singleMode = options.mode === "single";
  let i, ilen, datasetIndex, otherValue;
  if (value === null) {
    return;
  }
  for (i = 0, ilen = keys.length; i < ilen; ++i) {
    datasetIndex = +keys[i];
    if (datasetIndex === dsIndex) {
      if (options.all) {
        continue;
      }
      break;
    }
    otherValue = stack.values[datasetIndex];
    if (isNumberFinite(otherValue) && (singleMode || value === 0 || sign(value) === sign(otherValue))) {
      value += otherValue;
    }
  }
  return value;
}
function convertObjectDataToArray(data) {
  const keys = Object.keys(data);
  const adata = new Array(keys.length);
  let i, ilen, key;
  for (i = 0, ilen = keys.length; i < ilen; ++i) {
    key = keys[i];
    adata[i] = {
      x: key,
      y: data[key]
    };
  }
  return adata;
}
function isStacked(scale, meta) {
  const stacked = scale && scale.options.stacked;
  return stacked || stacked === void 0 && meta.stack !== void 0;
}
function getStackKey(indexScale, valueScale, meta) {
  return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
}
function getUserBounds(scale) {
  const { min, max, minDefined, maxDefined } = scale.getUserBounds();
  return {
    min: minDefined ? min : Number.NEGATIVE_INFINITY,
    max: maxDefined ? max : Number.POSITIVE_INFINITY
  };
}
function getOrCreateStack(stacks, stackKey, indexValue) {
  const subStack = stacks[stackKey] || (stacks[stackKey] = {});
  return subStack[indexValue] || (subStack[indexValue] = {});
}
function getLastIndexInStack(stack, vScale, positive, type) {
  for (const meta of vScale.getMatchingVisibleMetas(type).reverse()) {
    const value = stack[meta.index];
    if (positive && value > 0 || !positive && value < 0) {
      return meta.index;
    }
  }
  return null;
}
function updateStacks(controller, parsed) {
  const { chart, _cachedMeta: meta } = controller;
  const stacks = chart._stacks || (chart._stacks = {});
  const { iScale, vScale, index: datasetIndex } = meta;
  const iAxis = iScale.axis;
  const vAxis = vScale.axis;
  const key = getStackKey(iScale, vScale, meta);
  const ilen = parsed.length;
  let stack;
  for (let i = 0; i < ilen; ++i) {
    const item = parsed[i];
    const { [iAxis]: index2, [vAxis]: value } = item;
    const itemStacks = item._stacks || (item._stacks = {});
    stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index2);
    stack[datasetIndex] = value;
    stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
    stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
    const visualValues = stack._visualValues || (stack._visualValues = {});
    visualValues[datasetIndex] = value;
  }
}
function getFirstScaleId(chart, axis) {
  const scales2 = chart.scales;
  return Object.keys(scales2).filter((key) => scales2[key].axis === axis).shift();
}
function createDatasetContext(parent, index2) {
  return createContext(parent, {
    active: false,
    dataset: void 0,
    datasetIndex: index2,
    index: index2,
    mode: "default",
    type: "dataset"
  });
}
function createDataContext(parent, index2, element) {
  return createContext(parent, {
    active: false,
    dataIndex: index2,
    parsed: void 0,
    raw: void 0,
    element,
    index: index2,
    mode: "default",
    type: "data"
  });
}
function clearStacks(meta, items) {
  const datasetIndex = meta.controller.index;
  const axis = meta.vScale && meta.vScale.axis;
  if (!axis) {
    return;
  }
  items = items || meta._parsed;
  for (const parsed of items) {
    const stacks = parsed._stacks;
    if (!stacks || stacks[axis] === void 0 || stacks[axis][datasetIndex] === void 0) {
      return;
    }
    delete stacks[axis][datasetIndex];
    if (stacks[axis]._visualValues !== void 0 && stacks[axis]._visualValues[datasetIndex] !== void 0) {
      delete stacks[axis]._visualValues[datasetIndex];
    }
  }
}
const isDirectUpdateMode = (mode) => mode === "reset" || mode === "none";
const cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);
const createStack = (canStack, meta, chart) => canStack && !meta.hidden && meta._stacked && {
  keys: getSortedDatasetIndices(chart, true),
  values: null
};
class DatasetController {
  constructor(chart, datasetIndex) {
    this.chart = chart;
    this._ctx = chart.ctx;
    this.index = datasetIndex;
    this._cachedDataOpts = {};
    this._cachedMeta = this.getMeta();
    this._type = this._cachedMeta.type;
    this.options = void 0;
    this._parsing = false;
    this._data = void 0;
    this._objectData = void 0;
    this._sharedOptions = void 0;
    this._drawStart = void 0;
    this._drawCount = void 0;
    this.enableOptionSharing = false;
    this.supportsDecimation = false;
    this.$context = void 0;
    this._syncList = [];
    this.datasetElementType = new.target.datasetElementType;
    this.dataElementType = new.target.dataElementType;
    this.initialize();
  }
  initialize() {
    const meta = this._cachedMeta;
    this.configure();
    this.linkScales();
    meta._stacked = isStacked(meta.vScale, meta);
    this.addElements();
    if (this.options.fill && !this.chart.isPluginEnabled("filler")) {
      console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
    }
  }
  updateIndex(datasetIndex) {
    if (this.index !== datasetIndex) {
      clearStacks(this._cachedMeta);
    }
    this.index = datasetIndex;
  }
  linkScales() {
    const chart = this.chart;
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    const chooseId = (axis, x, y, r) => axis === "x" ? x : axis === "r" ? r : y;
    const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, "x"));
    const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, "y"));
    const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, "r"));
    const indexAxis = meta.indexAxis;
    const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
    const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
    meta.xScale = this.getScaleForId(xid);
    meta.yScale = this.getScaleForId(yid);
    meta.rScale = this.getScaleForId(rid);
    meta.iScale = this.getScaleForId(iid);
    meta.vScale = this.getScaleForId(vid);
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(scaleID) {
    return this.chart.scales[scaleID];
  }
  _getOtherScale(scale) {
    const meta = this._cachedMeta;
    return scale === meta.iScale ? meta.vScale : meta.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const meta = this._cachedMeta;
    if (this._data) {
      unlistenArrayEvents(this._data, this);
    }
    if (meta._stacked) {
      clearStacks(meta);
    }
  }
  _dataCheck() {
    const dataset = this.getDataset();
    const data = dataset.data || (dataset.data = []);
    const _data = this._data;
    if (isObject(data)) {
      this._data = convertObjectDataToArray(data);
    } else if (_data !== data) {
      if (_data) {
        unlistenArrayEvents(_data, this);
        const meta = this._cachedMeta;
        clearStacks(meta);
        meta._parsed = [];
      }
      if (data && Object.isExtensible(data)) {
        listenArrayEvents(data, this);
      }
      this._syncList = [];
      this._data = data;
    }
  }
  addElements() {
    const meta = this._cachedMeta;
    this._dataCheck();
    if (this.datasetElementType) {
      meta.dataset = new this.datasetElementType();
    }
  }
  buildOrUpdateElements(resetNewElements) {
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    let stackChanged = false;
    this._dataCheck();
    const oldStacked = meta._stacked;
    meta._stacked = isStacked(meta.vScale, meta);
    if (meta.stack !== dataset.stack) {
      stackChanged = true;
      clearStacks(meta);
      meta.stack = dataset.stack;
    }
    this._resyncElements(resetNewElements);
    if (stackChanged || oldStacked !== meta._stacked) {
      updateStacks(this, meta._parsed);
    }
  }
  configure() {
    const config = this.chart.config;
    const scopeKeys = config.datasetScopeKeys(this._type);
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
    this.options = config.createResolver(scopes, this.getContext());
    this._parsing = this.options.parsing;
    this._cachedDataOpts = {};
  }
  parse(start, count) {
    const { _cachedMeta: meta, _data: data } = this;
    const { iScale, _stacked } = meta;
    const iAxis = iScale.axis;
    let sorted = start === 0 && count === data.length ? true : meta._sorted;
    let prev = start > 0 && meta._parsed[start - 1];
    let i, cur, parsed;
    if (this._parsing === false) {
      meta._parsed = data;
      meta._sorted = true;
      parsed = data;
    } else {
      if (isArray(data[start])) {
        parsed = this.parseArrayData(meta, data, start, count);
      } else if (isObject(data[start])) {
        parsed = this.parseObjectData(meta, data, start, count);
      } else {
        parsed = this.parsePrimitiveData(meta, data, start, count);
      }
      const isNotInOrderComparedToPrev = () => cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
      for (i = 0; i < count; ++i) {
        meta._parsed[i + start] = cur = parsed[i];
        if (sorted) {
          if (isNotInOrderComparedToPrev()) {
            sorted = false;
          }
          prev = cur;
        }
      }
      meta._sorted = sorted;
    }
    if (_stacked) {
      updateStacks(this, parsed);
    }
  }
  parsePrimitiveData(meta, data, start, count) {
    const { iScale, vScale } = meta;
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const labels = iScale.getLabels();
    const singleScale = iScale === vScale;
    const parsed = new Array(count);
    let i, ilen, index2;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index2 = i + start;
      parsed[i] = {
        [iAxis]: singleScale || iScale.parse(labels[index2], index2),
        [vAxis]: vScale.parse(data[index2], index2)
      };
    }
    return parsed;
  }
  parseArrayData(meta, data, start, count) {
    const { xScale, yScale } = meta;
    const parsed = new Array(count);
    let i, ilen, index2, item;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index2 = i + start;
      item = data[index2];
      parsed[i] = {
        x: xScale.parse(item[0], index2),
        y: yScale.parse(item[1], index2)
      };
    }
    return parsed;
  }
  parseObjectData(meta, data, start, count) {
    const { xScale, yScale } = meta;
    const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
    const parsed = new Array(count);
    let i, ilen, index2, item;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index2 = i + start;
      item = data[index2];
      parsed[i] = {
        x: xScale.parse(resolveObjectKey(item, xAxisKey), index2),
        y: yScale.parse(resolveObjectKey(item, yAxisKey), index2)
      };
    }
    return parsed;
  }
  getParsed(index2) {
    return this._cachedMeta._parsed[index2];
  }
  getDataElement(index2) {
    return this._cachedMeta.data[index2];
  }
  applyStack(scale, parsed, mode) {
    const chart = this.chart;
    const meta = this._cachedMeta;
    const value = parsed[scale.axis];
    const stack = {
      keys: getSortedDatasetIndices(chart, true),
      values: parsed._stacks[scale.axis]._visualValues
    };
    return applyStack(stack, value, meta.index, {
      mode
    });
  }
  updateRangeFromParsed(range, scale, parsed, stack) {
    const parsedValue = parsed[scale.axis];
    let value = parsedValue === null ? NaN : parsedValue;
    const values = stack && parsed._stacks[scale.axis];
    if (stack && values) {
      stack.values = values;
      value = applyStack(stack, parsedValue, this._cachedMeta.index);
    }
    range.min = Math.min(range.min, value);
    range.max = Math.max(range.max, value);
  }
  getMinMax(scale, canStack) {
    const meta = this._cachedMeta;
    const _parsed = meta._parsed;
    const sorted = meta._sorted && scale === meta.iScale;
    const ilen = _parsed.length;
    const otherScale = this._getOtherScale(scale);
    const stack = createStack(canStack, meta, this.chart);
    const range = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    };
    const { min: otherMin, max: otherMax } = getUserBounds(otherScale);
    let i, parsed;
    function _skip() {
      parsed = _parsed[i];
      const otherValue = parsed[otherScale.axis];
      return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
    }
    for (i = 0; i < ilen; ++i) {
      if (_skip()) {
        continue;
      }
      this.updateRangeFromParsed(range, scale, parsed, stack);
      if (sorted) {
        break;
      }
    }
    if (sorted) {
      for (i = ilen - 1; i >= 0; --i) {
        if (_skip()) {
          continue;
        }
        this.updateRangeFromParsed(range, scale, parsed, stack);
        break;
      }
    }
    return range;
  }
  getAllParsedValues(scale) {
    const parsed = this._cachedMeta._parsed;
    const values = [];
    let i, ilen, value;
    for (i = 0, ilen = parsed.length; i < ilen; ++i) {
      value = parsed[i][scale.axis];
      if (isNumberFinite(value)) {
        values.push(value);
      }
    }
    return values;
  }
  getMaxOverflow() {
    return false;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const parsed = this.getParsed(index2);
    return {
      label: iScale ? "" + iScale.getLabelForValue(parsed[iScale.axis]) : "",
      value: vScale ? "" + vScale.getLabelForValue(parsed[vScale.axis]) : ""
    };
  }
  _update(mode) {
    const meta = this._cachedMeta;
    this.update(mode || "default");
    meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
  }
  update(mode) {
  }
  draw() {
    const ctx = this._ctx;
    const chart = this.chart;
    const meta = this._cachedMeta;
    const elements2 = meta.data || [];
    const area = chart.chartArea;
    const active = [];
    const start = this._drawStart || 0;
    const count = this._drawCount || elements2.length - start;
    const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
    let i;
    if (meta.dataset) {
      meta.dataset.draw(ctx, area, start, count);
    }
    for (i = start; i < start + count; ++i) {
      const element = elements2[i];
      if (element.hidden) {
        continue;
      }
      if (element.active && drawActiveElementsOnTop) {
        active.push(element);
      } else {
        element.draw(ctx, area);
      }
    }
    for (i = 0; i < active.length; ++i) {
      active[i].draw(ctx, area);
    }
  }
  getStyle(index2, active) {
    const mode = active ? "active" : "default";
    return index2 === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index2 || 0, mode);
  }
  getContext(index2, active, mode) {
    const dataset = this.getDataset();
    let context;
    if (index2 >= 0 && index2 < this._cachedMeta.data.length) {
      const element = this._cachedMeta.data[index2];
      context = element.$context || (element.$context = createDataContext(this.getContext(), index2, element));
      context.parsed = this.getParsed(index2);
      context.raw = dataset.data[index2];
      context.index = context.dataIndex = index2;
    } else {
      context = this.$context || (this.$context = createDatasetContext(this.chart.getContext(), this.index));
      context.dataset = dataset;
      context.index = context.datasetIndex = this.index;
    }
    context.active = !!active;
    context.mode = mode;
    return context;
  }
  resolveDatasetElementOptions(mode) {
    return this._resolveElementOptions(this.datasetElementType.id, mode);
  }
  resolveDataElementOptions(index2, mode) {
    return this._resolveElementOptions(this.dataElementType.id, mode, index2);
  }
  _resolveElementOptions(elementType, mode = "default", index2) {
    const active = mode === "active";
    const cache = this._cachedDataOpts;
    const cacheKey = elementType + "-" + mode;
    const cached = cache[cacheKey];
    const sharing = this.enableOptionSharing && defined(index2);
    if (cached) {
      return cloneIfNotShared(cached, sharing);
    }
    const config = this.chart.config;
    const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
    const prefixes = active ? [
      `${elementType}Hover`,
      "hover",
      elementType,
      ""
    ] : [
      elementType,
      ""
    ];
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
    const names2 = Object.keys(defaults.elements[elementType]);
    const context = () => this.getContext(index2, active, mode);
    const values = config.resolveNamedOptions(scopes, names2, context, prefixes);
    if (values.$shared) {
      values.$shared = sharing;
      cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
    }
    return values;
  }
  _resolveAnimations(index2, transition, active) {
    const chart = this.chart;
    const cache = this._cachedDataOpts;
    const cacheKey = `animation-${transition}`;
    const cached = cache[cacheKey];
    if (cached) {
      return cached;
    }
    let options;
    if (chart.options.animation !== false) {
      const config = this.chart.config;
      const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
      const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
      options = config.createResolver(scopes, this.getContext(index2, active, transition));
    }
    const animations = new Animations(chart, options && options.animations);
    if (options && options._cacheable) {
      cache[cacheKey] = Object.freeze(animations);
    }
    return animations;
  }
  getSharedOptions(options) {
    if (!options.$shared) {
      return;
    }
    return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
  }
  includeOptions(mode, sharedOptions) {
    return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
  }
  _getSharedOptions(start, mode) {
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const previouslySharedOptions = this._sharedOptions;
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
    return {
      sharedOptions,
      includeOptions
    };
  }
  updateElement(element, index2, properties, mode) {
    if (isDirectUpdateMode(mode)) {
      Object.assign(element, properties);
    } else {
      this._resolveAnimations(index2, mode).update(element, properties);
    }
  }
  updateSharedOptions(sharedOptions, mode, newOptions) {
    if (sharedOptions && !isDirectUpdateMode(mode)) {
      this._resolveAnimations(void 0, mode).update(sharedOptions, newOptions);
    }
  }
  _setStyle(element, index2, mode, active) {
    element.active = active;
    const options = this.getStyle(index2, active);
    this._resolveAnimations(index2, mode, active).update(element, {
      options: !active && this.getSharedOptions(options) || options
    });
  }
  removeHoverStyle(element, datasetIndex, index2) {
    this._setStyle(element, index2, "active", false);
  }
  setHoverStyle(element, datasetIndex, index2) {
    this._setStyle(element, index2, "active", true);
  }
  _removeDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;
    if (element) {
      this._setStyle(element, void 0, "active", false);
    }
  }
  _setDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;
    if (element) {
      this._setStyle(element, void 0, "active", true);
    }
  }
  _resyncElements(resetNewElements) {
    const data = this._data;
    const elements2 = this._cachedMeta.data;
    for (const [method, arg1, arg2] of this._syncList) {
      this[method](arg1, arg2);
    }
    this._syncList = [];
    const numMeta = elements2.length;
    const numData = data.length;
    const count = Math.min(numData, numMeta);
    if (count) {
      this.parse(0, count);
    }
    if (numData > numMeta) {
      this._insertElements(numMeta, numData - numMeta, resetNewElements);
    } else if (numData < numMeta) {
      this._removeElements(numData, numMeta - numData);
    }
  }
  _insertElements(start, count, resetNewElements = true) {
    const meta = this._cachedMeta;
    const data = meta.data;
    const end = start + count;
    let i;
    const move = (arr) => {
      arr.length += count;
      for (i = arr.length - 1; i >= end; i--) {
        arr[i] = arr[i - count];
      }
    };
    move(data);
    for (i = start; i < end; ++i) {
      data[i] = new this.dataElementType();
    }
    if (this._parsing) {
      move(meta._parsed);
    }
    this.parse(start, count);
    if (resetNewElements) {
      this.updateElements(data, start, count, "reset");
    }
  }
  updateElements(element, start, count, mode) {
  }
  _removeElements(start, count) {
    const meta = this._cachedMeta;
    if (this._parsing) {
      const removed = meta._parsed.splice(start, count);
      if (meta._stacked) {
        clearStacks(meta, removed);
      }
    }
    meta.data.splice(start, count);
  }
  _sync(args) {
    if (this._parsing) {
      this._syncList.push(args);
    } else {
      const [method, arg1, arg2] = args;
      this[method](arg1, arg2);
    }
    this.chart._dataChanges.push([
      this.index,
      ...args
    ]);
  }
  _onDataPush() {
    const count = arguments.length;
    this._sync([
      "_insertElements",
      this.getDataset().data.length - count,
      count
    ]);
  }
  _onDataPop() {
    this._sync([
      "_removeElements",
      this._cachedMeta.data.length - 1,
      1
    ]);
  }
  _onDataShift() {
    this._sync([
      "_removeElements",
      0,
      1
    ]);
  }
  _onDataSplice(start, count) {
    if (count) {
      this._sync([
        "_removeElements",
        start,
        count
      ]);
    }
    const newCount = arguments.length - 2;
    if (newCount) {
      this._sync([
        "_insertElements",
        start,
        newCount
      ]);
    }
  }
  _onDataUnshift() {
    this._sync([
      "_insertElements",
      0,
      arguments.length
    ]);
  }
}
__publicField(DatasetController, "defaults", {});
__publicField(DatasetController, "datasetElementType", null);
__publicField(DatasetController, "dataElementType", null);
function getAllScaleValues(scale, type) {
  if (!scale._cache.$bar) {
    const visibleMetas = scale.getMatchingVisibleMetas(type);
    let values = [];
    for (let i = 0, ilen = visibleMetas.length; i < ilen; i++) {
      values = values.concat(visibleMetas[i].controller.getAllParsedValues(scale));
    }
    scale._cache.$bar = _arrayUnique(values.sort((a, b) => a - b));
  }
  return scale._cache.$bar;
}
function computeMinSampleSize(meta) {
  const scale = meta.iScale;
  const values = getAllScaleValues(scale, meta.type);
  let min = scale._length;
  let i, ilen, curr, prev;
  const updateMinAndPrev = () => {
    if (curr === 32767 || curr === -32768) {
      return;
    }
    if (defined(prev)) {
      min = Math.min(min, Math.abs(curr - prev) || min);
    }
    prev = curr;
  };
  for (i = 0, ilen = values.length; i < ilen; ++i) {
    curr = scale.getPixelForValue(values[i]);
    updateMinAndPrev();
  }
  prev = void 0;
  for (i = 0, ilen = scale.ticks.length; i < ilen; ++i) {
    curr = scale.getPixelForTick(i);
    updateMinAndPrev();
  }
  return min;
}
function computeFitCategoryTraits(index2, ruler, options, stackCount) {
  const thickness = options.barThickness;
  let size, ratio;
  if (isNullOrUndef(thickness)) {
    size = ruler.min * options.categoryPercentage;
    ratio = options.barPercentage;
  } else {
    size = thickness * stackCount;
    ratio = 1;
  }
  return {
    chunk: size / stackCount,
    ratio,
    start: ruler.pixels[index2] - size / 2
  };
}
function computeFlexCategoryTraits(index2, ruler, options, stackCount) {
  const pixels = ruler.pixels;
  const curr = pixels[index2];
  let prev = index2 > 0 ? pixels[index2 - 1] : null;
  let next = index2 < pixels.length - 1 ? pixels[index2 + 1] : null;
  const percent = options.categoryPercentage;
  if (prev === null) {
    prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
  }
  if (next === null) {
    next = curr + curr - prev;
  }
  const start = curr - (curr - Math.min(prev, next)) / 2 * percent;
  const size = Math.abs(next - prev) / 2 * percent;
  return {
    chunk: size / stackCount,
    ratio: options.barPercentage,
    start
  };
}
function parseFloatBar(entry, item, vScale, i) {
  const startValue = vScale.parse(entry[0], i);
  const endValue = vScale.parse(entry[1], i);
  const min = Math.min(startValue, endValue);
  const max = Math.max(startValue, endValue);
  let barStart = min;
  let barEnd = max;
  if (Math.abs(min) > Math.abs(max)) {
    barStart = max;
    barEnd = min;
  }
  item[vScale.axis] = barEnd;
  item._custom = {
    barStart,
    barEnd,
    start: startValue,
    end: endValue,
    min,
    max
  };
}
function parseValue(entry, item, vScale, i) {
  if (isArray(entry)) {
    parseFloatBar(entry, item, vScale, i);
  } else {
    item[vScale.axis] = vScale.parse(entry, i);
  }
  return item;
}
function parseArrayOrPrimitive(meta, data, start, count) {
  const iScale = meta.iScale;
  const vScale = meta.vScale;
  const labels = iScale.getLabels();
  const singleScale = iScale === vScale;
  const parsed = [];
  let i, ilen, item, entry;
  for (i = start, ilen = start + count; i < ilen; ++i) {
    entry = data[i];
    item = {};
    item[iScale.axis] = singleScale || iScale.parse(labels[i], i);
    parsed.push(parseValue(entry, item, vScale, i));
  }
  return parsed;
}
function isFloatBar(custom) {
  return custom && custom.barStart !== void 0 && custom.barEnd !== void 0;
}
function barSign(size, vScale, actualBase) {
  if (size !== 0) {
    return sign(size);
  }
  return (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
}
function borderProps(properties) {
  let reverse, start, end, top, bottom;
  if (properties.horizontal) {
    reverse = properties.base > properties.x;
    start = "left";
    end = "right";
  } else {
    reverse = properties.base < properties.y;
    start = "bottom";
    end = "top";
  }
  if (reverse) {
    top = "end";
    bottom = "start";
  } else {
    top = "start";
    bottom = "end";
  }
  return {
    start,
    end,
    reverse,
    top,
    bottom
  };
}
function setBorderSkipped(properties, options, stack, index2) {
  let edge = options.borderSkipped;
  const res = {};
  if (!edge) {
    properties.borderSkipped = res;
    return;
  }
  if (edge === true) {
    properties.borderSkipped = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
    return;
  }
  const { start, end, reverse, top, bottom } = borderProps(properties);
  if (edge === "middle" && stack) {
    properties.enableBorderRadius = true;
    if ((stack._top || 0) === index2) {
      edge = top;
    } else if ((stack._bottom || 0) === index2) {
      edge = bottom;
    } else {
      res[parseEdge(bottom, start, end, reverse)] = true;
      edge = top;
    }
  }
  res[parseEdge(edge, start, end, reverse)] = true;
  properties.borderSkipped = res;
}
function parseEdge(edge, a, b, reverse) {
  if (reverse) {
    edge = swap(edge, a, b);
    edge = startEnd(edge, b, a);
  } else {
    edge = startEnd(edge, a, b);
  }
  return edge;
}
function swap(orig, v1, v2) {
  return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}
function startEnd(v, start, end) {
  return v === "start" ? start : v === "end" ? end : v;
}
function setInflateAmount(properties, { inflateAmount }, ratio) {
  properties.inflateAmount = inflateAmount === "auto" ? ratio === 1 ? 0.33 : 0 : inflateAmount;
}
class BarController extends DatasetController {
  parsePrimitiveData(meta, data, start, count) {
    return parseArrayOrPrimitive(meta, data, start, count);
  }
  parseArrayData(meta, data, start, count) {
    return parseArrayOrPrimitive(meta, data, start, count);
  }
  parseObjectData(meta, data, start, count) {
    const { iScale, vScale } = meta;
    const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
    const iAxisKey = iScale.axis === "x" ? xAxisKey : yAxisKey;
    const vAxisKey = vScale.axis === "x" ? xAxisKey : yAxisKey;
    const parsed = [];
    let i, ilen, item, obj;
    for (i = start, ilen = start + count; i < ilen; ++i) {
      obj = data[i];
      item = {};
      item[iScale.axis] = iScale.parse(resolveObjectKey(obj, iAxisKey), i);
      parsed.push(parseValue(resolveObjectKey(obj, vAxisKey), item, vScale, i));
    }
    return parsed;
  }
  updateRangeFromParsed(range, scale, parsed, stack) {
    super.updateRangeFromParsed(range, scale, parsed, stack);
    const custom = parsed._custom;
    if (custom && scale === this._cachedMeta.vScale) {
      range.min = Math.min(range.min, custom.min);
      range.max = Math.max(range.max, custom.max);
    }
  }
  getMaxOverflow() {
    return 0;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const { iScale, vScale } = meta;
    const parsed = this.getParsed(index2);
    const custom = parsed._custom;
    const value = isFloatBar(custom) ? "[" + custom.start + ", " + custom.end + "]" : "" + vScale.getLabelForValue(parsed[vScale.axis]);
    return {
      label: "" + iScale.getLabelForValue(parsed[iScale.axis]),
      value
    };
  }
  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
    const meta = this._cachedMeta;
    meta.stack = this.getDataset().stack;
  }
  update(mode) {
    const meta = this._cachedMeta;
    this.updateElements(meta.data, 0, meta.data.length, mode);
  }
  updateElements(bars, start, count, mode) {
    const reset2 = mode === "reset";
    const { index: index2, _cachedMeta: { vScale } } = this;
    const base = vScale.getBasePixel();
    const horizontal = vScale.isHorizontal();
    const ruler = this._getRuler();
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    for (let i = start; i < start + count; i++) {
      const parsed = this.getParsed(i);
      const vpixels = reset2 || isNullOrUndef(parsed[vScale.axis]) ? {
        base,
        head: base
      } : this._calculateBarValuePixels(i);
      const ipixels = this._calculateBarIndexPixels(i, ruler);
      const stack = (parsed._stacks || {})[vScale.axis];
      const properties = {
        horizontal,
        base: vpixels.base,
        enableBorderRadius: !stack || isFloatBar(parsed._custom) || index2 === stack._top || index2 === stack._bottom,
        x: horizontal ? vpixels.head : ipixels.center,
        y: horizontal ? ipixels.center : vpixels.head,
        height: horizontal ? ipixels.size : Math.abs(vpixels.size),
        width: horizontal ? Math.abs(vpixels.size) : ipixels.size
      };
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i, bars[i].active ? "active" : mode);
      }
      const options = properties.options || bars[i].options;
      setBorderSkipped(properties, options, stack, index2);
      setInflateAmount(properties, options, ruler.ratio);
      this.updateElement(bars[i], i, properties, mode);
    }
  }
  _getStacks(last, dataIndex) {
    const { iScale } = this._cachedMeta;
    const metasets = iScale.getMatchingVisibleMetas(this._type).filter((meta) => meta.controller.options.grouped);
    const stacked = iScale.options.stacked;
    const stacks = [];
    const skipNull = (meta) => {
      const parsed = meta.controller.getParsed(dataIndex);
      const val = parsed && parsed[meta.vScale.axis];
      if (isNullOrUndef(val) || isNaN(val)) {
        return true;
      }
    };
    for (const meta of metasets) {
      if (dataIndex !== void 0 && skipNull(meta)) {
        continue;
      }
      if (stacked === false || stacks.indexOf(meta.stack) === -1 || stacked === void 0 && meta.stack === void 0) {
        stacks.push(meta.stack);
      }
      if (meta.index === last) {
        break;
      }
    }
    if (!stacks.length) {
      stacks.push(void 0);
    }
    return stacks;
  }
  _getStackCount(index2) {
    return this._getStacks(void 0, index2).length;
  }
  _getStackIndex(datasetIndex, name, dataIndex) {
    const stacks = this._getStacks(datasetIndex, dataIndex);
    const index2 = name !== void 0 ? stacks.indexOf(name) : -1;
    return index2 === -1 ? stacks.length - 1 : index2;
  }
  _getRuler() {
    const opts = this.options;
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const pixels = [];
    let i, ilen;
    for (i = 0, ilen = meta.data.length; i < ilen; ++i) {
      pixels.push(iScale.getPixelForValue(this.getParsed(i)[iScale.axis], i));
    }
    const barThickness = opts.barThickness;
    const min = barThickness || computeMinSampleSize(meta);
    return {
      min,
      pixels,
      start: iScale._startPixel,
      end: iScale._endPixel,
      stackCount: this._getStackCount(),
      scale: iScale,
      grouped: opts.grouped,
      ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
    };
  }
  _calculateBarValuePixels(index2) {
    const { _cachedMeta: { vScale, _stacked, index: datasetIndex }, options: { base: baseValue, minBarLength } } = this;
    const actualBase = baseValue || 0;
    const parsed = this.getParsed(index2);
    const custom = parsed._custom;
    const floating = isFloatBar(custom);
    let value = parsed[vScale.axis];
    let start = 0;
    let length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
    let head, size;
    if (length !== value) {
      start = length - value;
      length = value;
    }
    if (floating) {
      value = custom.barStart;
      length = custom.barEnd - custom.barStart;
      if (value !== 0 && sign(value) !== sign(custom.barEnd)) {
        start = 0;
      }
      start += value;
    }
    const startValue = !isNullOrUndef(baseValue) && !floating ? baseValue : start;
    let base = vScale.getPixelForValue(startValue);
    if (this.chart.getDataVisibility(index2)) {
      head = vScale.getPixelForValue(start + length);
    } else {
      head = base;
    }
    size = head - base;
    if (Math.abs(size) < minBarLength) {
      size = barSign(size, vScale, actualBase) * minBarLength;
      if (value === actualBase) {
        base -= size / 2;
      }
      const startPixel = vScale.getPixelForDecimal(0);
      const endPixel = vScale.getPixelForDecimal(1);
      const min = Math.min(startPixel, endPixel);
      const max = Math.max(startPixel, endPixel);
      base = Math.max(Math.min(base, max), min);
      head = base + size;
      if (_stacked && !floating) {
        parsed._stacks[vScale.axis]._visualValues[datasetIndex] = vScale.getValueForPixel(head) - vScale.getValueForPixel(base);
      }
    }
    if (base === vScale.getPixelForValue(actualBase)) {
      const halfGrid = sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
      base += halfGrid;
      size -= halfGrid;
    }
    return {
      size,
      base,
      head,
      center: head + size / 2
    };
  }
  _calculateBarIndexPixels(index2, ruler) {
    const scale = ruler.scale;
    const options = this.options;
    const skipNull = options.skipNull;
    const maxBarThickness = valueOrDefault(options.maxBarThickness, Infinity);
    let center, size;
    if (ruler.grouped) {
      const stackCount = skipNull ? this._getStackCount(index2) : ruler.stackCount;
      const range = options.barThickness === "flex" ? computeFlexCategoryTraits(index2, ruler, options, stackCount) : computeFitCategoryTraits(index2, ruler, options, stackCount);
      const stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index2 : void 0);
      center = range.start + range.chunk * stackIndex + range.chunk / 2;
      size = Math.min(maxBarThickness, range.chunk * range.ratio);
    } else {
      center = scale.getPixelForValue(this.getParsed(index2)[scale.axis], index2);
      size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
    }
    return {
      base: center - size / 2,
      head: center + size / 2,
      center,
      size
    };
  }
  draw() {
    const meta = this._cachedMeta;
    const vScale = meta.vScale;
    const rects = meta.data;
    const ilen = rects.length;
    let i = 0;
    for (; i < ilen; ++i) {
      if (this.getParsed(i)[vScale.axis] !== null) {
        rects[i].draw(this._ctx);
      }
    }
  }
}
__publicField(BarController, "id", "bar");
__publicField(BarController, "defaults", {
  datasetElementType: false,
  dataElementType: "bar",
  categoryPercentage: 0.8,
  barPercentage: 0.9,
  grouped: true,
  animations: {
    numbers: {
      type: "number",
      properties: [
        "x",
        "y",
        "base",
        "width",
        "height"
      ]
    }
  }
});
__publicField(BarController, "overrides", {
  scales: {
    _index_: {
      type: "category",
      offset: true,
      grid: {
        offset: true
      }
    },
    _value_: {
      type: "linear",
      beginAtZero: true
    }
  }
});
class BubbleController extends DatasetController {
  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
  }
  parsePrimitiveData(meta, data, start, count) {
    const parsed = super.parsePrimitiveData(meta, data, start, count);
    for (let i = 0; i < parsed.length; i++) {
      parsed[i]._custom = this.resolveDataElementOptions(i + start).radius;
    }
    return parsed;
  }
  parseArrayData(meta, data, start, count) {
    const parsed = super.parseArrayData(meta, data, start, count);
    for (let i = 0; i < parsed.length; i++) {
      const item = data[start + i];
      parsed[i]._custom = valueOrDefault(item[2], this.resolveDataElementOptions(i + start).radius);
    }
    return parsed;
  }
  parseObjectData(meta, data, start, count) {
    const parsed = super.parseObjectData(meta, data, start, count);
    for (let i = 0; i < parsed.length; i++) {
      const item = data[start + i];
      parsed[i]._custom = valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i + start).radius);
    }
    return parsed;
  }
  getMaxOverflow() {
    const data = this._cachedMeta.data;
    let max = 0;
    for (let i = data.length - 1; i >= 0; --i) {
      max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
    }
    return max > 0 && max;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const labels = this.chart.data.labels || [];
    const { xScale, yScale } = meta;
    const parsed = this.getParsed(index2);
    const x = xScale.getLabelForValue(parsed.x);
    const y = yScale.getLabelForValue(parsed.y);
    const r = parsed._custom;
    return {
      label: labels[index2] || "",
      value: "(" + x + ", " + y + (r ? ", " + r : "") + ")"
    };
  }
  update(mode) {
    const points = this._cachedMeta.data;
    this.updateElements(points, 0, points.length, mode);
  }
  updateElements(points, start, count, mode) {
    const reset2 = mode === "reset";
    const { iScale, vScale } = this._cachedMeta;
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    for (let i = start; i < start + count; i++) {
      const point = points[i];
      const parsed = !reset2 && this.getParsed(i);
      const properties = {};
      const iPixel = properties[iAxis] = reset2 ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]);
      const vPixel = properties[vAxis] = reset2 ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
      properties.skip = isNaN(iPixel) || isNaN(vPixel);
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? "active" : mode);
        if (reset2) {
          properties.options.radius = 0;
        }
      }
      this.updateElement(point, i, properties, mode);
    }
  }
  resolveDataElementOptions(index2, mode) {
    const parsed = this.getParsed(index2);
    let values = super.resolveDataElementOptions(index2, mode);
    if (values.$shared) {
      values = Object.assign({}, values, {
        $shared: false
      });
    }
    const radius = values.radius;
    if (mode !== "active") {
      values.radius = 0;
    }
    values.radius += valueOrDefault(parsed && parsed._custom, radius);
    return values;
  }
}
__publicField(BubbleController, "id", "bubble");
__publicField(BubbleController, "defaults", {
  datasetElementType: false,
  dataElementType: "point",
  animations: {
    numbers: {
      type: "number",
      properties: [
        "x",
        "y",
        "borderWidth",
        "radius"
      ]
    }
  }
});
__publicField(BubbleController, "overrides", {
  scales: {
    x: {
      type: "linear"
    },
    y: {
      type: "linear"
    }
  }
});
function getRatioAndOffset(rotation, circumference, cutout) {
  let ratioX = 1;
  let ratioY = 1;
  let offsetX = 0;
  let offsetY = 0;
  if (circumference < TAU) {
    const startAngle = rotation;
    const endAngle = startAngle + circumference;
    const startX = Math.cos(startAngle);
    const startY = Math.sin(startAngle);
    const endX = Math.cos(endAngle);
    const endY = Math.sin(endAngle);
    const calcMax = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a, a * cutout, b, b * cutout);
    const calcMin = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a, a * cutout, b, b * cutout);
    const maxX = calcMax(0, startX, endX);
    const maxY = calcMax(HALF_PI, startY, endY);
    const minX = calcMin(PI, startX, endX);
    const minY = calcMin(PI + HALF_PI, startY, endY);
    ratioX = (maxX - minX) / 2;
    ratioY = (maxY - minY) / 2;
    offsetX = -(maxX + minX) / 2;
    offsetY = -(maxY + minY) / 2;
  }
  return {
    ratioX,
    ratioY,
    offsetX,
    offsetY
  };
}
class DoughnutController extends DatasetController {
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.enableOptionSharing = true;
    this.innerRadius = void 0;
    this.outerRadius = void 0;
    this.offsetX = void 0;
    this.offsetY = void 0;
  }
  linkScales() {
  }
  parse(start, count) {
    const data = this.getDataset().data;
    const meta = this._cachedMeta;
    if (this._parsing === false) {
      meta._parsed = data;
    } else {
      let getter = (i2) => +data[i2];
      if (isObject(data[start])) {
        const { key = "value" } = this._parsing;
        getter = (i2) => +resolveObjectKey(data[i2], key);
      }
      let i, ilen;
      for (i = start, ilen = start + count; i < ilen; ++i) {
        meta._parsed[i] = getter(i);
      }
    }
  }
  _getRotation() {
    return toRadians(this.options.rotation - 90);
  }
  _getCircumference() {
    return toRadians(this.options.circumference);
  }
  _getRotationExtents() {
    let min = TAU;
    let max = -TAU;
    for (let i = 0; i < this.chart.data.datasets.length; ++i) {
      if (this.chart.isDatasetVisible(i) && this.chart.getDatasetMeta(i).type === this._type) {
        const controller = this.chart.getDatasetMeta(i).controller;
        const rotation = controller._getRotation();
        const circumference = controller._getCircumference();
        min = Math.min(min, rotation);
        max = Math.max(max, rotation + circumference);
      }
    }
    return {
      rotation: min,
      circumference: max - min
    };
  }
  update(mode) {
    const chart = this.chart;
    const { chartArea } = chart;
    const meta = this._cachedMeta;
    const arcs = meta.data;
    const spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing;
    const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
    const cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
    const chartWeight = this._getRingWeight(this.index);
    const { circumference, rotation } = this._getRotationExtents();
    const { ratioX, ratioY, offsetX, offsetY } = getRatioAndOffset(rotation, circumference, cutout);
    const maxWidth = (chartArea.width - spacing) / ratioX;
    const maxHeight = (chartArea.height - spacing) / ratioY;
    const maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
    const outerRadius = toDimension(this.options.radius, maxRadius);
    const innerRadius = Math.max(outerRadius * cutout, 0);
    const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
    this.offsetX = offsetX * outerRadius;
    this.offsetY = offsetY * outerRadius;
    meta.total = this.calculateTotal();
    this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
    this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
    this.updateElements(arcs, 0, arcs.length, mode);
  }
  _circumference(i, reset2) {
    const opts = this.options;
    const meta = this._cachedMeta;
    const circumference = this._getCircumference();
    if (reset2 && opts.animation.animateRotate || !this.chart.getDataVisibility(i) || meta._parsed[i] === null || meta.data[i].hidden) {
      return 0;
    }
    return this.calculateCircumference(meta._parsed[i] * circumference / TAU);
  }
  updateElements(arcs, start, count, mode) {
    const reset2 = mode === "reset";
    const chart = this.chart;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const animationOpts = opts.animation;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const animateScale = reset2 && animationOpts.animateScale;
    const innerRadius = animateScale ? 0 : this.innerRadius;
    const outerRadius = animateScale ? 0 : this.outerRadius;
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    let startAngle = this._getRotation();
    let i;
    for (i = 0; i < start; ++i) {
      startAngle += this._circumference(i, reset2);
    }
    for (i = start; i < start + count; ++i) {
      const circumference = this._circumference(i, reset2);
      const arc = arcs[i];
      const properties = {
        x: centerX + this.offsetX,
        y: centerY + this.offsetY,
        startAngle,
        endAngle: startAngle + circumference,
        circumference,
        outerRadius,
        innerRadius
      };
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? "active" : mode);
      }
      startAngle += circumference;
      this.updateElement(arc, i, properties, mode);
    }
  }
  calculateTotal() {
    const meta = this._cachedMeta;
    const metaData = meta.data;
    let total = 0;
    let i;
    for (i = 0; i < metaData.length; i++) {
      const value = meta._parsed[i];
      if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i) && !metaData[i].hidden) {
        total += Math.abs(value);
      }
    }
    return total;
  }
  calculateCircumference(value) {
    const total = this._cachedMeta.total;
    if (total > 0 && !isNaN(value)) {
      return TAU * (Math.abs(value) / total);
    }
    return 0;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const chart = this.chart;
    const labels = chart.data.labels || [];
    const value = formatNumber(meta._parsed[index2], chart.options.locale);
    return {
      label: labels[index2] || "",
      value
    };
  }
  getMaxBorderWidth(arcs) {
    let max = 0;
    const chart = this.chart;
    let i, ilen, meta, controller, options;
    if (!arcs) {
      for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
        if (chart.isDatasetVisible(i)) {
          meta = chart.getDatasetMeta(i);
          arcs = meta.data;
          controller = meta.controller;
          break;
        }
      }
    }
    if (!arcs) {
      return 0;
    }
    for (i = 0, ilen = arcs.length; i < ilen; ++i) {
      options = controller.resolveDataElementOptions(i);
      if (options.borderAlign !== "inner") {
        max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
      }
    }
    return max;
  }
  getMaxOffset(arcs) {
    let max = 0;
    for (let i = 0, ilen = arcs.length; i < ilen; ++i) {
      const options = this.resolveDataElementOptions(i);
      max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
    }
    return max;
  }
  _getRingWeightOffset(datasetIndex) {
    let ringWeightOffset = 0;
    for (let i = 0; i < datasetIndex; ++i) {
      if (this.chart.isDatasetVisible(i)) {
        ringWeightOffset += this._getRingWeight(i);
      }
    }
    return ringWeightOffset;
  }
  _getRingWeight(datasetIndex) {
    return Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
  }
  _getVisibleDatasetWeightTotal() {
    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
  }
}
__publicField(DoughnutController, "id", "doughnut");
__publicField(DoughnutController, "defaults", {
  datasetElementType: false,
  dataElementType: "arc",
  animation: {
    animateRotate: true,
    animateScale: false
  },
  animations: {
    numbers: {
      type: "number",
      properties: [
        "circumference",
        "endAngle",
        "innerRadius",
        "outerRadius",
        "startAngle",
        "x",
        "y",
        "offset",
        "borderWidth",
        "spacing"
      ]
    }
  },
  cutout: "50%",
  rotation: 0,
  circumference: 360,
  radius: "100%",
  spacing: 0,
  indexAxis: "r"
});
__publicField(DoughnutController, "descriptors", {
  _scriptable: (name) => name !== "spacing",
  _indexable: (name) => name !== "spacing" && !name.startsWith("borderDash") && !name.startsWith("hoverBorderDash")
});
__publicField(DoughnutController, "overrides", {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            const { labels: { pointStyle, color: color2 } } = chart.legend.options;
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              return {
                text: label,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                fontColor: color2,
                lineWidth: style.borderWidth,
                pointStyle,
                hidden: !chart.getDataVisibility(i),
                index: i
              };
            });
          }
          return [];
        }
      },
      onClick(e, legendItem, legend) {
        legend.chart.toggleDataVisibility(legendItem.index);
        legend.chart.update();
      }
    }
  }
});
class LineController extends DatasetController {
  initialize() {
    this.enableOptionSharing = true;
    this.supportsDecimation = true;
    super.initialize();
  }
  update(mode) {
    const meta = this._cachedMeta;
    const { dataset: line, data: points = [], _dataset } = meta;
    const animationsDisabled = this.chart._animationsDisabled;
    let { start, count } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
    this._drawStart = start;
    this._drawCount = count;
    if (_scaleRangesChanged(meta)) {
      start = 0;
      count = points.length;
    }
    line._chart = this.chart;
    line._datasetIndex = this.index;
    line._decimated = !!_dataset._decimated;
    line.points = points;
    const options = this.resolveDatasetElementOptions(mode);
    if (!this.options.showLine) {
      options.borderWidth = 0;
    }
    options.segment = this.options.segment;
    this.updateElement(line, void 0, {
      animated: !animationsDisabled,
      options
    }, mode);
    this.updateElements(points, start, count, mode);
  }
  updateElements(points, start, count, mode) {
    const reset2 = mode === "reset";
    const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const { spanGaps, segment } = this.options;
    const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
    const directUpdate = this.chart._animationsDisabled || reset2 || mode === "none";
    const end = start + count;
    const pointsCount = points.length;
    let prevParsed = start > 0 && this.getParsed(start - 1);
    for (let i = 0; i < pointsCount; ++i) {
      const point = points[i];
      const properties = directUpdate ? point : {};
      if (i < start || i >= end) {
        properties.skip = true;
        continue;
      }
      const parsed = this.getParsed(i);
      const nullData = isNullOrUndef(parsed[vAxis]);
      const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
      const vPixel = properties[vAxis] = reset2 || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
      properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
      properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
      if (segment) {
        properties.parsed = parsed;
        properties.raw = _dataset.data[i];
      }
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? "active" : mode);
      }
      if (!directUpdate) {
        this.updateElement(point, i, properties, mode);
      }
      prevParsed = parsed;
    }
  }
  getMaxOverflow() {
    const meta = this._cachedMeta;
    const dataset = meta.dataset;
    const border = dataset.options && dataset.options.borderWidth || 0;
    const data = meta.data || [];
    if (!data.length) {
      return border;
    }
    const firstPoint = data[0].size(this.resolveDataElementOptions(0));
    const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
    return Math.max(border, firstPoint, lastPoint) / 2;
  }
  draw() {
    const meta = this._cachedMeta;
    meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
    super.draw();
  }
}
__publicField(LineController, "id", "line");
__publicField(LineController, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  showLine: true,
  spanGaps: false
});
__publicField(LineController, "overrides", {
  scales: {
    _index_: {
      type: "category"
    },
    _value_: {
      type: "linear"
    }
  }
});
class PolarAreaController extends DatasetController {
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.innerRadius = void 0;
    this.outerRadius = void 0;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const chart = this.chart;
    const labels = chart.data.labels || [];
    const value = formatNumber(meta._parsed[index2].r, chart.options.locale);
    return {
      label: labels[index2] || "",
      value
    };
  }
  parseObjectData(meta, data, start, count) {
    return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
  }
  update(mode) {
    const arcs = this._cachedMeta.data;
    this._updateRadius();
    this.updateElements(arcs, 0, arcs.length, mode);
  }
  getMinMax() {
    const meta = this._cachedMeta;
    const range = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    };
    meta.data.forEach((element, index2) => {
      const parsed = this.getParsed(index2).r;
      if (!isNaN(parsed) && this.chart.getDataVisibility(index2)) {
        if (parsed < range.min) {
          range.min = parsed;
        }
        if (parsed > range.max) {
          range.max = parsed;
        }
      }
    });
    return range;
  }
  _updateRadius() {
    const chart = this.chart;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    const outerRadius = Math.max(minSize / 2, 0);
    const innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
    const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
    this.outerRadius = outerRadius - radiusLength * this.index;
    this.innerRadius = this.outerRadius - radiusLength;
  }
  updateElements(arcs, start, count, mode) {
    const reset2 = mode === "reset";
    const chart = this.chart;
    const opts = chart.options;
    const animationOpts = opts.animation;
    const scale = this._cachedMeta.rScale;
    const centerX = scale.xCenter;
    const centerY = scale.yCenter;
    const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI;
    let angle = datasetStartAngle;
    let i;
    const defaultAngle = 360 / this.countVisibleElements();
    for (i = 0; i < start; ++i) {
      angle += this._computeAngle(i, mode, defaultAngle);
    }
    for (i = start; i < start + count; i++) {
      const arc = arcs[i];
      let startAngle = angle;
      let endAngle = angle + this._computeAngle(i, mode, defaultAngle);
      let outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(this.getParsed(i).r) : 0;
      angle = endAngle;
      if (reset2) {
        if (animationOpts.animateScale) {
          outerRadius = 0;
        }
        if (animationOpts.animateRotate) {
          startAngle = endAngle = datasetStartAngle;
        }
      }
      const properties = {
        x: centerX,
        y: centerY,
        innerRadius: 0,
        outerRadius,
        startAngle,
        endAngle,
        options: this.resolveDataElementOptions(i, arc.active ? "active" : mode)
      };
      this.updateElement(arc, i, properties, mode);
    }
  }
  countVisibleElements() {
    const meta = this._cachedMeta;
    let count = 0;
    meta.data.forEach((element, index2) => {
      if (!isNaN(this.getParsed(index2).r) && this.chart.getDataVisibility(index2)) {
        count++;
      }
    });
    return count;
  }
  _computeAngle(index2, mode, defaultAngle) {
    return this.chart.getDataVisibility(index2) ? toRadians(this.resolveDataElementOptions(index2, mode).angle || defaultAngle) : 0;
  }
}
__publicField(PolarAreaController, "id", "polarArea");
__publicField(PolarAreaController, "defaults", {
  dataElementType: "arc",
  animation: {
    animateRotate: true,
    animateScale: true
  },
  animations: {
    numbers: {
      type: "number",
      properties: [
        "x",
        "y",
        "startAngle",
        "endAngle",
        "innerRadius",
        "outerRadius"
      ]
    }
  },
  indexAxis: "r",
  startAngle: 0
});
__publicField(PolarAreaController, "overrides", {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            const { labels: { pointStyle, color: color2 } } = chart.legend.options;
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              return {
                text: label,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                fontColor: color2,
                lineWidth: style.borderWidth,
                pointStyle,
                hidden: !chart.getDataVisibility(i),
                index: i
              };
            });
          }
          return [];
        }
      },
      onClick(e, legendItem, legend) {
        legend.chart.toggleDataVisibility(legendItem.index);
        legend.chart.update();
      }
    }
  },
  scales: {
    r: {
      type: "radialLinear",
      angleLines: {
        display: false
      },
      beginAtZero: true,
      grid: {
        circular: true
      },
      pointLabels: {
        display: false
      },
      startAngle: 0
    }
  }
});
class PieController extends DoughnutController {
}
__publicField(PieController, "id", "pie");
__publicField(PieController, "defaults", {
  cutout: 0,
  rotation: 0,
  circumference: 360,
  radius: "100%"
});
class RadarController extends DatasetController {
  getLabelAndValue(index2) {
    const vScale = this._cachedMeta.vScale;
    const parsed = this.getParsed(index2);
    return {
      label: vScale.getLabels()[index2],
      value: "" + vScale.getLabelForValue(parsed[vScale.axis])
    };
  }
  parseObjectData(meta, data, start, count) {
    return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
  }
  update(mode) {
    const meta = this._cachedMeta;
    const line = meta.dataset;
    const points = meta.data || [];
    const labels = meta.iScale.getLabels();
    line.points = points;
    if (mode !== "resize") {
      const options = this.resolveDatasetElementOptions(mode);
      if (!this.options.showLine) {
        options.borderWidth = 0;
      }
      const properties = {
        _loop: true,
        _fullLoop: labels.length === points.length,
        options
      };
      this.updateElement(line, void 0, properties, mode);
    }
    this.updateElements(points, 0, points.length, mode);
  }
  updateElements(points, start, count, mode) {
    const scale = this._cachedMeta.rScale;
    const reset2 = mode === "reset";
    for (let i = start; i < start + count; i++) {
      const point = points[i];
      const options = this.resolveDataElementOptions(i, point.active ? "active" : mode);
      const pointPosition = scale.getPointPositionForValue(i, this.getParsed(i).r);
      const x = reset2 ? scale.xCenter : pointPosition.x;
      const y = reset2 ? scale.yCenter : pointPosition.y;
      const properties = {
        x,
        y,
        angle: pointPosition.angle,
        skip: isNaN(x) || isNaN(y),
        options
      };
      this.updateElement(point, i, properties, mode);
    }
  }
}
__publicField(RadarController, "id", "radar");
__publicField(RadarController, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  indexAxis: "r",
  showLine: true,
  elements: {
    line: {
      fill: "start"
    }
  }
});
__publicField(RadarController, "overrides", {
  aspectRatio: 1,
  scales: {
    r: {
      type: "radialLinear"
    }
  }
});
class ScatterController extends DatasetController {
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const labels = this.chart.data.labels || [];
    const { xScale, yScale } = meta;
    const parsed = this.getParsed(index2);
    const x = xScale.getLabelForValue(parsed.x);
    const y = yScale.getLabelForValue(parsed.y);
    return {
      label: labels[index2] || "",
      value: "(" + x + ", " + y + ")"
    };
  }
  update(mode) {
    const meta = this._cachedMeta;
    const { data: points = [] } = meta;
    const animationsDisabled = this.chart._animationsDisabled;
    let { start, count } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
    this._drawStart = start;
    this._drawCount = count;
    if (_scaleRangesChanged(meta)) {
      start = 0;
      count = points.length;
    }
    if (this.options.showLine) {
      if (!this.datasetElementType) {
        this.addElements();
      }
      const { dataset: line, _dataset } = meta;
      line._chart = this.chart;
      line._datasetIndex = this.index;
      line._decimated = !!_dataset._decimated;
      line.points = points;
      const options = this.resolveDatasetElementOptions(mode);
      options.segment = this.options.segment;
      this.updateElement(line, void 0, {
        animated: !animationsDisabled,
        options
      }, mode);
    } else if (this.datasetElementType) {
      delete meta.dataset;
      this.datasetElementType = false;
    }
    this.updateElements(points, start, count, mode);
  }
  addElements() {
    const { showLine } = this.options;
    if (!this.datasetElementType && showLine) {
      this.datasetElementType = this.chart.registry.getElement("line");
    }
    super.addElements();
  }
  updateElements(points, start, count, mode) {
    const reset2 = mode === "reset";
    const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions);
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const { spanGaps, segment } = this.options;
    const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
    const directUpdate = this.chart._animationsDisabled || reset2 || mode === "none";
    let prevParsed = start > 0 && this.getParsed(start - 1);
    for (let i = start; i < start + count; ++i) {
      const point = points[i];
      const parsed = this.getParsed(i);
      const properties = directUpdate ? point : {};
      const nullData = isNullOrUndef(parsed[vAxis]);
      const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
      const vPixel = properties[vAxis] = reset2 || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
      properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
      properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
      if (segment) {
        properties.parsed = parsed;
        properties.raw = _dataset.data[i];
      }
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? "active" : mode);
      }
      if (!directUpdate) {
        this.updateElement(point, i, properties, mode);
      }
      prevParsed = parsed;
    }
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
  }
  getMaxOverflow() {
    const meta = this._cachedMeta;
    const data = meta.data || [];
    if (!this.options.showLine) {
      let max = 0;
      for (let i = data.length - 1; i >= 0; --i) {
        max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
      }
      return max > 0 && max;
    }
    const dataset = meta.dataset;
    const border = dataset.options && dataset.options.borderWidth || 0;
    if (!data.length) {
      return border;
    }
    const firstPoint = data[0].size(this.resolveDataElementOptions(0));
    const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
    return Math.max(border, firstPoint, lastPoint) / 2;
  }
}
__publicField(ScatterController, "id", "scatter");
__publicField(ScatterController, "defaults", {
  datasetElementType: false,
  dataElementType: "point",
  showLine: false,
  fill: false
});
__publicField(ScatterController, "overrides", {
  interaction: {
    mode: "point"
  },
  scales: {
    x: {
      type: "linear"
    },
    y: {
      type: "linear"
    }
  }
});
var controllers = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController
});
function abstract() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
class DateAdapterBase {
  constructor(options) {
    __publicField(this, "options");
    this.options = options || {};
  }
  /**
  * Override default date adapter methods.
  * Accepts type parameter to define options type.
  * @example
  * Chart._adapters._date.override<{myAdapterOption: string}>({
  *   init() {
  *     console.log(this.options.myAdapterOption);
  *   }
  * })
  */
  static override(members) {
    Object.assign(DateAdapterBase.prototype, members);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {
  }
  formats() {
    return abstract();
  }
  parse() {
    return abstract();
  }
  format() {
    return abstract();
  }
  add() {
    return abstract();
  }
  diff() {
    return abstract();
  }
  startOf() {
    return abstract();
  }
  endOf() {
    return abstract();
  }
}
var adapters = {
  _date: DateAdapterBase
};
function binarySearch(metaset, axis, value, intersect) {
  const { controller, data, _sorted } = metaset;
  const iScale = controller._cachedMeta.iScale;
  if (iScale && axis === iScale.axis && axis !== "r" && _sorted && data.length) {
    const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
    if (!intersect) {
      return lookupMethod(data, axis, value);
    } else if (controller._sharedOptions) {
      const el = data[0];
      const range = typeof el.getRange === "function" && el.getRange(axis);
      if (range) {
        const start = lookupMethod(data, axis, value - range);
        const end = lookupMethod(data, axis, value + range);
        return {
          lo: start.lo,
          hi: end.hi
        };
      }
    }
  }
  return {
    lo: 0,
    hi: data.length - 1
  };
}
function evaluateInteractionItems(chart, axis, position, handler, intersect) {
  const metasets = chart.getSortedVisibleDatasetMetas();
  const value = position[axis];
  for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
    const { index: index2, data } = metasets[i];
    const { lo, hi } = binarySearch(metasets[i], axis, value, intersect);
    for (let j = lo; j <= hi; ++j) {
      const element = data[j];
      if (!element.skip) {
        handler(element, index2, j);
      }
    }
  }
}
function getDistanceMetricForAxis(axis) {
  const useX = axis.indexOf("x") !== -1;
  const useY = axis.indexOf("y") !== -1;
  return function(pt1, pt2) {
    const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
    const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  };
}
function getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) {
  const items = [];
  if (!includeInvisible && !chart.isPointInArea(position)) {
    return items;
  }
  const evaluationFunc = function(element, datasetIndex, index2) {
    if (!includeInvisible && !_isPointInArea(element, chart.chartArea, 0)) {
      return;
    }
    if (element.inRange(position.x, position.y, useFinalPosition)) {
      items.push({
        element,
        datasetIndex,
        index: index2
      });
    }
  };
  evaluateInteractionItems(chart, axis, position, evaluationFunc, true);
  return items;
}
function getNearestRadialItems(chart, position, axis, useFinalPosition) {
  let items = [];
  function evaluationFunc(element, datasetIndex, index2) {
    const { startAngle, endAngle } = element.getProps([
      "startAngle",
      "endAngle"
    ], useFinalPosition);
    const { angle } = getAngleFromPoint(element, {
      x: position.x,
      y: position.y
    });
    if (_angleBetween(angle, startAngle, endAngle)) {
      items.push({
        element,
        datasetIndex,
        index: index2
      });
    }
  }
  evaluateInteractionItems(chart, axis, position, evaluationFunc);
  return items;
}
function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
  let items = [];
  const distanceMetric = getDistanceMetricForAxis(axis);
  let minDistance = Number.POSITIVE_INFINITY;
  function evaluationFunc(element, datasetIndex, index2) {
    const inRange2 = element.inRange(position.x, position.y, useFinalPosition);
    if (intersect && !inRange2) {
      return;
    }
    const center = element.getCenterPoint(useFinalPosition);
    const pointInArea = !!includeInvisible || chart.isPointInArea(center);
    if (!pointInArea && !inRange2) {
      return;
    }
    const distance = distanceMetric(position, center);
    if (distance < minDistance) {
      items = [
        {
          element,
          datasetIndex,
          index: index2
        }
      ];
      minDistance = distance;
    } else if (distance === minDistance) {
      items.push({
        element,
        datasetIndex,
        index: index2
      });
    }
  }
  evaluateInteractionItems(chart, axis, position, evaluationFunc);
  return items;
}
function getNearestItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
  if (!includeInvisible && !chart.isPointInArea(position)) {
    return [];
  }
  return axis === "r" && !intersect ? getNearestRadialItems(chart, position, axis, useFinalPosition) : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible);
}
function getAxisItems(chart, position, axis, intersect, useFinalPosition) {
  const items = [];
  const rangeMethod = axis === "x" ? "inXRange" : "inYRange";
  let intersectsItem = false;
  evaluateInteractionItems(chart, axis, position, (element, datasetIndex, index2) => {
    if (element[rangeMethod](position[axis], useFinalPosition)) {
      items.push({
        element,
        datasetIndex,
        index: index2
      });
      intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition);
    }
  });
  if (intersect && !intersectsItem) {
    return [];
  }
  return items;
}
var Interaction = {
  evaluateInteractionItems,
  modes: {
    index(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || "x";
      const includeInvisible = options.includeInvisible || false;
      const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
      const elements2 = [];
      if (!items.length) {
        return [];
      }
      chart.getSortedVisibleDatasetMetas().forEach((meta) => {
        const index2 = items[0].index;
        const element = meta.data[index2];
        if (element && !element.skip) {
          elements2.push({
            element,
            datasetIndex: meta.index,
            index: index2
          });
        }
      });
      return elements2;
    },
    dataset(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || "xy";
      const includeInvisible = options.includeInvisible || false;
      let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
      if (items.length > 0) {
        const datasetIndex = items[0].datasetIndex;
        const data = chart.getDatasetMeta(datasetIndex).data;
        items = [];
        for (let i = 0; i < data.length; ++i) {
          items.push({
            element: data[i],
            datasetIndex,
            index: i
          });
        }
      }
      return items;
    },
    point(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || "xy";
      const includeInvisible = options.includeInvisible || false;
      return getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
    },
    nearest(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || "xy";
      const includeInvisible = options.includeInvisible || false;
      return getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
    },
    x(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      return getAxisItems(chart, position, "x", options.intersect, useFinalPosition);
    },
    y(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      return getAxisItems(chart, position, "y", options.intersect, useFinalPosition);
    }
  }
};
const STATIC_POSITIONS = [
  "left",
  "top",
  "right",
  "bottom"
];
function filterByPosition(array, position) {
  return array.filter((v) => v.pos === position);
}
function filterDynamicPositionByAxis(array, axis) {
  return array.filter((v) => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
}
function sortByWeight(array, reverse) {
  return array.sort((a, b) => {
    const v0 = reverse ? b : a;
    const v1 = reverse ? a : b;
    return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
  });
}
function wrapBoxes(boxes) {
  const layoutBoxes = [];
  let i, ilen, box, pos, stack, stackWeight;
  for (i = 0, ilen = (boxes || []).length; i < ilen; ++i) {
    box = boxes[i];
    ({ position: pos, options: { stack, stackWeight = 1 } } = box);
    layoutBoxes.push({
      index: i,
      box,
      pos,
      horizontal: box.isHorizontal(),
      weight: box.weight,
      stack: stack && pos + stack,
      stackWeight
    });
  }
  return layoutBoxes;
}
function buildStacks(layouts2) {
  const stacks = {};
  for (const wrap of layouts2) {
    const { stack, pos, stackWeight } = wrap;
    if (!stack || !STATIC_POSITIONS.includes(pos)) {
      continue;
    }
    const _stack = stacks[stack] || (stacks[stack] = {
      count: 0,
      placed: 0,
      weight: 0,
      size: 0
    });
    _stack.count++;
    _stack.weight += stackWeight;
  }
  return stacks;
}
function setLayoutDims(layouts2, params) {
  const stacks = buildStacks(layouts2);
  const { vBoxMaxWidth, hBoxMaxHeight } = params;
  let i, ilen, layout;
  for (i = 0, ilen = layouts2.length; i < ilen; ++i) {
    layout = layouts2[i];
    const { fullSize } = layout.box;
    const stack = stacks[layout.stack];
    const factor = stack && layout.stackWeight / stack.weight;
    if (layout.horizontal) {
      layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
      layout.height = hBoxMaxHeight;
    } else {
      layout.width = vBoxMaxWidth;
      layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
    }
  }
  return stacks;
}
function buildLayoutBoxes(boxes) {
  const layoutBoxes = wrapBoxes(boxes);
  const fullSize = sortByWeight(layoutBoxes.filter((wrap) => wrap.box.fullSize), true);
  const left = sortByWeight(filterByPosition(layoutBoxes, "left"), true);
  const right = sortByWeight(filterByPosition(layoutBoxes, "right"));
  const top = sortByWeight(filterByPosition(layoutBoxes, "top"), true);
  const bottom = sortByWeight(filterByPosition(layoutBoxes, "bottom"));
  const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, "x");
  const centerVertical = filterDynamicPositionByAxis(layoutBoxes, "y");
  return {
    fullSize,
    leftAndTop: left.concat(top),
    rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
    chartArea: filterByPosition(layoutBoxes, "chartArea"),
    vertical: left.concat(right).concat(centerVertical),
    horizontal: top.concat(bottom).concat(centerHorizontal)
  };
}
function getCombinedMax(maxPadding, chartArea, a, b) {
  return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
}
function updateMaxPadding(maxPadding, boxPadding) {
  maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
  maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
  maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
  maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
}
function updateDims(chartArea, params, layout, stacks) {
  const { pos, box } = layout;
  const maxPadding = chartArea.maxPadding;
  if (!isObject(pos)) {
    if (layout.size) {
      chartArea[pos] -= layout.size;
    }
    const stack = stacks[layout.stack] || {
      size: 0,
      count: 1
    };
    stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
    layout.size = stack.size / stack.count;
    chartArea[pos] += layout.size;
  }
  if (box.getPadding) {
    updateMaxPadding(maxPadding, box.getPadding());
  }
  const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, "left", "right"));
  const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, "top", "bottom"));
  const widthChanged = newWidth !== chartArea.w;
  const heightChanged = newHeight !== chartArea.h;
  chartArea.w = newWidth;
  chartArea.h = newHeight;
  return layout.horizontal ? {
    same: widthChanged,
    other: heightChanged
  } : {
    same: heightChanged,
    other: widthChanged
  };
}
function handleMaxPadding(chartArea) {
  const maxPadding = chartArea.maxPadding;
  function updatePos(pos) {
    const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
    chartArea[pos] += change;
    return change;
  }
  chartArea.y += updatePos("top");
  chartArea.x += updatePos("left");
  updatePos("right");
  updatePos("bottom");
}
function getMargins(horizontal, chartArea) {
  const maxPadding = chartArea.maxPadding;
  function marginForPositions(positions2) {
    const margin = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    positions2.forEach((pos) => {
      margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
    });
    return margin;
  }
  return horizontal ? marginForPositions([
    "left",
    "right"
  ]) : marginForPositions([
    "top",
    "bottom"
  ]);
}
function fitBoxes(boxes, chartArea, params, stacks) {
  const refitBoxes = [];
  let i, ilen, layout, box, refit, changed;
  for (i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
    layout = boxes[i];
    box = layout.box;
    box.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
    const { same, other } = updateDims(chartArea, params, layout, stacks);
    refit |= same && refitBoxes.length;
    changed = changed || other;
    if (!box.fullSize) {
      refitBoxes.push(layout);
    }
  }
  return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
}
function setBoxDims(box, left, top, width, height) {
  box.top = top;
  box.left = left;
  box.right = left + width;
  box.bottom = top + height;
  box.width = width;
  box.height = height;
}
function placeBoxes(boxes, chartArea, params, stacks) {
  const userPadding = params.padding;
  let { x, y } = chartArea;
  for (const layout of boxes) {
    const box = layout.box;
    const stack = stacks[layout.stack] || {
      count: 1,
      placed: 0,
      weight: 1
    };
    const weight = layout.stackWeight / stack.weight || 1;
    if (layout.horizontal) {
      const width = chartArea.w * weight;
      const height = stack.size || box.height;
      if (defined(stack.start)) {
        y = stack.start;
      }
      if (box.fullSize) {
        setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
      } else {
        setBoxDims(box, chartArea.left + stack.placed, y, width, height);
      }
      stack.start = y;
      stack.placed += width;
      y = box.bottom;
    } else {
      const height = chartArea.h * weight;
      const width = stack.size || box.width;
      if (defined(stack.start)) {
        x = stack.start;
      }
      if (box.fullSize) {
        setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
      } else {
        setBoxDims(box, x, chartArea.top + stack.placed, width, height);
      }
      stack.start = x;
      stack.placed += height;
      x = box.right;
    }
  }
  chartArea.x = x;
  chartArea.y = y;
}
var layouts = {
  addBox(chart, item) {
    if (!chart.boxes) {
      chart.boxes = [];
    }
    item.fullSize = item.fullSize || false;
    item.position = item.position || "top";
    item.weight = item.weight || 0;
    item._layers = item._layers || function() {
      return [
        {
          z: 0,
          draw(chartArea) {
            item.draw(chartArea);
          }
        }
      ];
    };
    chart.boxes.push(item);
  },
  removeBox(chart, layoutItem) {
    const index2 = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
    if (index2 !== -1) {
      chart.boxes.splice(index2, 1);
    }
  },
  configure(chart, item, options) {
    item.fullSize = options.fullSize;
    item.position = options.position;
    item.weight = options.weight;
  },
  update(chart, width, height, minPadding) {
    if (!chart) {
      return;
    }
    const padding = toPadding(chart.options.layout.padding);
    const availableWidth = Math.max(width - padding.width, 0);
    const availableHeight = Math.max(height - padding.height, 0);
    const boxes = buildLayoutBoxes(chart.boxes);
    const verticalBoxes = boxes.vertical;
    const horizontalBoxes = boxes.horizontal;
    each(chart.boxes, (box) => {
      if (typeof box.beforeLayout === "function") {
        box.beforeLayout();
      }
    });
    const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) => wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
    const params = Object.freeze({
      outerWidth: width,
      outerHeight: height,
      padding,
      availableWidth,
      availableHeight,
      vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
      hBoxMaxHeight: availableHeight / 2
    });
    const maxPadding = Object.assign({}, padding);
    updateMaxPadding(maxPadding, toPadding(minPadding));
    const chartArea = Object.assign({
      maxPadding,
      w: availableWidth,
      h: availableHeight,
      x: padding.left,
      y: padding.top
    }, padding);
    const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
    fitBoxes(boxes.fullSize, chartArea, params, stacks);
    fitBoxes(verticalBoxes, chartArea, params, stacks);
    if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
      fitBoxes(verticalBoxes, chartArea, params, stacks);
    }
    handleMaxPadding(chartArea);
    placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
    chartArea.x += chartArea.w;
    chartArea.y += chartArea.h;
    placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
    chart.chartArea = {
      left: chartArea.left,
      top: chartArea.top,
      right: chartArea.left + chartArea.w,
      bottom: chartArea.top + chartArea.h,
      height: chartArea.h,
      width: chartArea.w
    };
    each(boxes.chartArea, (layout) => {
      const box = layout.box;
      Object.assign(box, chart.chartArea);
      box.update(chartArea.w, chartArea.h, {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      });
    });
  }
};
class BasePlatform {
  acquireContext(canvas, aspectRatio) {
  }
  releaseContext(context) {
    return false;
  }
  addEventListener(chart, type, listener) {
  }
  removeEventListener(chart, type, listener) {
  }
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(element, width, height, aspectRatio) {
    width = Math.max(0, width || element.width);
    height = height || element.height;
    return {
      width,
      height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
    };
  }
  isAttached(canvas) {
    return true;
  }
  updateConfig(config) {
  }
}
class BasicPlatform extends BasePlatform {
  acquireContext(item) {
    return item && item.getContext && item.getContext("2d") || null;
  }
  updateConfig(config) {
    config.options.animation = false;
  }
}
const EXPANDO_KEY = "$chartjs";
const EVENT_TYPES = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
};
const isNullOrEmpty = (value) => value === null || value === "";
function initCanvas(canvas, aspectRatio) {
  const style = canvas.style;
  const renderHeight = canvas.getAttribute("height");
  const renderWidth = canvas.getAttribute("width");
  canvas[EXPANDO_KEY] = {
    initial: {
      height: renderHeight,
      width: renderWidth,
      style: {
        display: style.display,
        height: style.height,
        width: style.width
      }
    }
  };
  style.display = style.display || "block";
  style.boxSizing = style.boxSizing || "border-box";
  if (isNullOrEmpty(renderWidth)) {
    const displayWidth = readUsedSize(canvas, "width");
    if (displayWidth !== void 0) {
      canvas.width = displayWidth;
    }
  }
  if (isNullOrEmpty(renderHeight)) {
    if (canvas.style.height === "") {
      canvas.height = canvas.width / (aspectRatio || 2);
    } else {
      const displayHeight = readUsedSize(canvas, "height");
      if (displayHeight !== void 0) {
        canvas.height = displayHeight;
      }
    }
  }
  return canvas;
}
const eventListenerOptions = supportsEventListenerOptions ? {
  passive: true
} : false;
function addListener(node, type, listener) {
  if (node) {
    node.addEventListener(type, listener, eventListenerOptions);
  }
}
function removeListener(chart, type, listener) {
  if (chart && chart.canvas) {
    chart.canvas.removeEventListener(type, listener, eventListenerOptions);
  }
}
function fromNativeEvent(event, chart) {
  const type = EVENT_TYPES[event.type] || event.type;
  const { x, y } = getRelativePosition(event, chart);
  return {
    type,
    chart,
    native: event,
    x: x !== void 0 ? x : null,
    y: y !== void 0 ? y : null
  };
}
function nodeListContains(nodeList, canvas) {
  for (const node of nodeList) {
    if (node === canvas || node.contains(canvas)) {
      return true;
    }
  }
}
function createAttachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const observer = new MutationObserver((entries) => {
    let trigger = false;
    for (const entry of entries) {
      trigger = trigger || nodeListContains(entry.addedNodes, canvas);
      trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
    }
    if (trigger) {
      listener();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  return observer;
}
function createDetachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const observer = new MutationObserver((entries) => {
    let trigger = false;
    for (const entry of entries) {
      trigger = trigger || nodeListContains(entry.removedNodes, canvas);
      trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
    }
    if (trigger) {
      listener();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  return observer;
}
const drpListeningCharts = /* @__PURE__ */ new Map();
let oldDevicePixelRatio = 0;
function onWindowResize() {
  const dpr = window.devicePixelRatio;
  if (dpr === oldDevicePixelRatio) {
    return;
  }
  oldDevicePixelRatio = dpr;
  drpListeningCharts.forEach((resize, chart) => {
    if (chart.currentDevicePixelRatio !== dpr) {
      resize();
    }
  });
}
function listenDevicePixelRatioChanges(chart, resize) {
  if (!drpListeningCharts.size) {
    window.addEventListener("resize", onWindowResize);
  }
  drpListeningCharts.set(chart, resize);
}
function unlistenDevicePixelRatioChanges(chart) {
  drpListeningCharts.delete(chart);
  if (!drpListeningCharts.size) {
    window.removeEventListener("resize", onWindowResize);
  }
}
function createResizeObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const container = canvas && _getParentNode(canvas);
  if (!container) {
    return;
  }
  const resize = throttled((width, height) => {
    const w = container.clientWidth;
    listener(width, height);
    if (w < container.clientWidth) {
      listener();
    }
  }, window);
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    const width = entry.contentRect.width;
    const height = entry.contentRect.height;
    if (width === 0 && height === 0) {
      return;
    }
    resize(width, height);
  });
  observer.observe(container);
  listenDevicePixelRatioChanges(chart, resize);
  return observer;
}
function releaseObserver(chart, type, observer) {
  if (observer) {
    observer.disconnect();
  }
  if (type === "resize") {
    unlistenDevicePixelRatioChanges(chart);
  }
}
function createProxyAndListen(chart, type, listener) {
  const canvas = chart.canvas;
  const proxy = throttled((event) => {
    if (chart.ctx !== null) {
      listener(fromNativeEvent(event, chart));
    }
  }, chart);
  addListener(canvas, type, proxy);
  return proxy;
}
class DomPlatform extends BasePlatform {
  acquireContext(canvas, aspectRatio) {
    const context = canvas && canvas.getContext && canvas.getContext("2d");
    if (context && context.canvas === canvas) {
      initCanvas(canvas, aspectRatio);
      return context;
    }
    return null;
  }
  releaseContext(context) {
    const canvas = context.canvas;
    if (!canvas[EXPANDO_KEY]) {
      return false;
    }
    const initial = canvas[EXPANDO_KEY].initial;
    [
      "height",
      "width"
    ].forEach((prop) => {
      const value = initial[prop];
      if (isNullOrUndef(value)) {
        canvas.removeAttribute(prop);
      } else {
        canvas.setAttribute(prop, value);
      }
    });
    const style = initial.style || {};
    Object.keys(style).forEach((key) => {
      canvas.style[key] = style[key];
    });
    canvas.width = canvas.width;
    delete canvas[EXPANDO_KEY];
    return true;
  }
  addEventListener(chart, type, listener) {
    this.removeEventListener(chart, type);
    const proxies = chart.$proxies || (chart.$proxies = {});
    const handlers = {
      attach: createAttachObserver,
      detach: createDetachObserver,
      resize: createResizeObserver
    };
    const handler = handlers[type] || createProxyAndListen;
    proxies[type] = handler(chart, type, listener);
  }
  removeEventListener(chart, type) {
    const proxies = chart.$proxies || (chart.$proxies = {});
    const proxy = proxies[type];
    if (!proxy) {
      return;
    }
    const handlers = {
      attach: releaseObserver,
      detach: releaseObserver,
      resize: releaseObserver
    };
    const handler = handlers[type] || removeListener;
    handler(chart, type, proxy);
    proxies[type] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(canvas, width, height, aspectRatio) {
    return getMaximumSize(canvas, width, height, aspectRatio);
  }
  isAttached(canvas) {
    const container = _getParentNode(canvas);
    return !!(container && container.isConnected);
  }
}
function _detectPlatform(canvas) {
  if (!_isDomSupported() || typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
    return BasicPlatform;
  }
  return DomPlatform;
}
class Element {
  constructor() {
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "active", false);
    __publicField(this, "options");
    __publicField(this, "$animations");
  }
  tooltipPosition(useFinalPosition) {
    const { x, y } = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    return {
      x,
      y
    };
  }
  hasValue() {
    return isNumber(this.x) && isNumber(this.y);
  }
  getProps(props, final) {
    const anims = this.$animations;
    if (!final || !anims) {
      return this;
    }
    const ret = {};
    props.forEach((prop) => {
      ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
    });
    return ret;
  }
}
__publicField(Element, "defaults", {});
__publicField(Element, "defaultRoutes");
function autoSkip(scale, ticks) {
  const tickOpts = scale.options.ticks;
  const determinedMaxTicks = determineMaxTicks(scale);
  const ticksLimit = Math.min(tickOpts.maxTicksLimit || determinedMaxTicks, determinedMaxTicks);
  const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
  const numMajorIndices = majorIndices.length;
  const first = majorIndices[0];
  const last = majorIndices[numMajorIndices - 1];
  const newTicks = [];
  if (numMajorIndices > ticksLimit) {
    skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
    return newTicks;
  }
  const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
  if (numMajorIndices > 0) {
    let i, ilen;
    const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
    skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
    for (i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
      skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
    }
    skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
    return newTicks;
  }
  skip(ticks, newTicks, spacing);
  return newTicks;
}
function determineMaxTicks(scale) {
  const offset = scale.options.offset;
  const tickLength = scale._tickSize();
  const maxScale = scale._length / tickLength + (offset ? 0 : 1);
  const maxChart = scale._maxLength / tickLength;
  return Math.floor(Math.min(maxScale, maxChart));
}
function calculateSpacing(majorIndices, ticks, ticksLimit) {
  const evenMajorSpacing = getEvenSpacing(majorIndices);
  const spacing = ticks.length / ticksLimit;
  if (!evenMajorSpacing) {
    return Math.max(spacing, 1);
  }
  const factors = _factorize(evenMajorSpacing);
  for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
    const factor = factors[i];
    if (factor > spacing) {
      return factor;
    }
  }
  return Math.max(spacing, 1);
}
function getMajorIndices(ticks) {
  const result = [];
  let i, ilen;
  for (i = 0, ilen = ticks.length; i < ilen; i++) {
    if (ticks[i].major) {
      result.push(i);
    }
  }
  return result;
}
function skipMajors(ticks, newTicks, majorIndices, spacing) {
  let count = 0;
  let next = majorIndices[0];
  let i;
  spacing = Math.ceil(spacing);
  for (i = 0; i < ticks.length; i++) {
    if (i === next) {
      newTicks.push(ticks[i]);
      count++;
      next = majorIndices[count * spacing];
    }
  }
}
function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
  const start = valueOrDefault(majorStart, 0);
  const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
  let count = 0;
  let length, i, next;
  spacing = Math.ceil(spacing);
  if (majorEnd) {
    length = majorEnd - majorStart;
    spacing = length / Math.floor(length / spacing);
  }
  next = start;
  while (next < 0) {
    count++;
    next = Math.round(start + count * spacing);
  }
  for (i = Math.max(start, 0); i < end; i++) {
    if (i === next) {
      newTicks.push(ticks[i]);
      count++;
      next = Math.round(start + count * spacing);
    }
  }
}
function getEvenSpacing(arr) {
  const len = arr.length;
  let i, diff;
  if (len < 2) {
    return false;
  }
  for (diff = arr[0], i = 1; i < len; ++i) {
    if (arr[i] - arr[i - 1] !== diff) {
      return false;
    }
  }
  return diff;
}
const reverseAlign = (align) => align === "left" ? "right" : align === "right" ? "left" : align;
const offsetFromEdge = (scale, edge, offset) => edge === "top" || edge === "left" ? scale[edge] + offset : scale[edge] - offset;
const getTicksLimit = (ticksLength, maxTicksLimit) => Math.min(maxTicksLimit || ticksLength, ticksLength);
function sample(arr, numItems) {
  const result = [];
  const increment = arr.length / numItems;
  const len = arr.length;
  let i = 0;
  for (; i < len; i += increment) {
    result.push(arr[Math.floor(i)]);
  }
  return result;
}
function getPixelForGridLine(scale, index2, offsetGridLines) {
  const length = scale.ticks.length;
  const validIndex2 = Math.min(index2, length - 1);
  const start = scale._startPixel;
  const end = scale._endPixel;
  const epsilon = 1e-6;
  let lineValue = scale.getPixelForTick(validIndex2);
  let offset;
  if (offsetGridLines) {
    if (length === 1) {
      offset = Math.max(lineValue - start, end - lineValue);
    } else if (index2 === 0) {
      offset = (scale.getPixelForTick(1) - lineValue) / 2;
    } else {
      offset = (lineValue - scale.getPixelForTick(validIndex2 - 1)) / 2;
    }
    lineValue += validIndex2 < index2 ? offset : -offset;
    if (lineValue < start - epsilon || lineValue > end + epsilon) {
      return;
    }
  }
  return lineValue;
}
function garbageCollect(caches, length) {
  each(caches, (cache) => {
    const gc = cache.gc;
    const gcLen = gc.length / 2;
    let i;
    if (gcLen > length) {
      for (i = 0; i < gcLen; ++i) {
        delete cache.data[gc[i]];
      }
      gc.splice(0, gcLen);
    }
  });
}
function getTickMarkLength(options) {
  return options.drawTicks ? options.tickLength : 0;
}
function getTitleHeight(options, fallback) {
  if (!options.display) {
    return 0;
  }
  const font = toFont(options.font, fallback);
  const padding = toPadding(options.padding);
  const lines = isArray(options.text) ? options.text.length : 1;
  return lines * font.lineHeight + padding.height;
}
function createScaleContext(parent, scale) {
  return createContext(parent, {
    scale,
    type: "scale"
  });
}
function createTickContext(parent, index2, tick) {
  return createContext(parent, {
    tick,
    index: index2,
    type: "tick"
  });
}
function titleAlign(align, position, reverse) {
  let ret = _toLeftRightCenter(align);
  if (reverse && position !== "right" || !reverse && position === "right") {
    ret = reverseAlign(ret);
  }
  return ret;
}
function titleArgs(scale, offset, position, align) {
  const { top, left, bottom, right, chart } = scale;
  const { chartArea, scales: scales2 } = chart;
  let rotation = 0;
  let maxWidth, titleX, titleY;
  const height = bottom - top;
  const width = right - left;
  if (scale.isHorizontal()) {
    titleX = _alignStartEnd(align, left, right);
    if (isObject(position)) {
      const positionAxisID = Object.keys(position)[0];
      const value = position[positionAxisID];
      titleY = scales2[positionAxisID].getPixelForValue(value) + height - offset;
    } else if (position === "center") {
      titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
    } else {
      titleY = offsetFromEdge(scale, position, offset);
    }
    maxWidth = right - left;
  } else {
    if (isObject(position)) {
      const positionAxisID = Object.keys(position)[0];
      const value = position[positionAxisID];
      titleX = scales2[positionAxisID].getPixelForValue(value) - width + offset;
    } else if (position === "center") {
      titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
    } else {
      titleX = offsetFromEdge(scale, position, offset);
    }
    titleY = _alignStartEnd(align, bottom, top);
    rotation = position === "left" ? -HALF_PI : HALF_PI;
  }
  return {
    titleX,
    titleY,
    maxWidth,
    rotation
  };
}
class Scale extends Element {
  constructor(cfg) {
    super();
    this.id = cfg.id;
    this.type = cfg.type;
    this.options = void 0;
    this.ctx = cfg.ctx;
    this.chart = cfg.chart;
    this.top = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.right = void 0;
    this.width = void 0;
    this.height = void 0;
    this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
    this.maxWidth = void 0;
    this.maxHeight = void 0;
    this.paddingTop = void 0;
    this.paddingBottom = void 0;
    this.paddingLeft = void 0;
    this.paddingRight = void 0;
    this.axis = void 0;
    this.labelRotation = void 0;
    this.min = void 0;
    this.max = void 0;
    this._range = void 0;
    this.ticks = [];
    this._gridLineItems = null;
    this._labelItems = null;
    this._labelSizes = null;
    this._length = 0;
    this._maxLength = 0;
    this._longestTextCache = {};
    this._startPixel = void 0;
    this._endPixel = void 0;
    this._reversePixels = false;
    this._userMax = void 0;
    this._userMin = void 0;
    this._suggestedMax = void 0;
    this._suggestedMin = void 0;
    this._ticksLength = 0;
    this._borderValue = 0;
    this._cache = {};
    this._dataLimitsCached = false;
    this.$context = void 0;
  }
  init(options) {
    this.options = options.setContext(this.getContext());
    this.axis = options.axis;
    this._userMin = this.parse(options.min);
    this._userMax = this.parse(options.max);
    this._suggestedMin = this.parse(options.suggestedMin);
    this._suggestedMax = this.parse(options.suggestedMax);
  }
  parse(raw, index2) {
    return raw;
  }
  getUserBounds() {
    let { _userMin, _userMax, _suggestedMin, _suggestedMax } = this;
    _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
    _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
    _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
    _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
    return {
      min: finiteOrDefault(_userMin, _suggestedMin),
      max: finiteOrDefault(_userMax, _suggestedMax),
      minDefined: isNumberFinite(_userMin),
      maxDefined: isNumberFinite(_userMax)
    };
  }
  getMinMax(canStack) {
    let { min, max, minDefined, maxDefined } = this.getUserBounds();
    let range;
    if (minDefined && maxDefined) {
      return {
        min,
        max
      };
    }
    const metas = this.getMatchingVisibleMetas();
    for (let i = 0, ilen = metas.length; i < ilen; ++i) {
      range = metas[i].controller.getMinMax(this, canStack);
      if (!minDefined) {
        min = Math.min(min, range.min);
      }
      if (!maxDefined) {
        max = Math.max(max, range.max);
      }
    }
    min = maxDefined && min > max ? max : min;
    max = minDefined && min > max ? min : max;
    return {
      min: finiteOrDefault(min, finiteOrDefault(max, min)),
      max: finiteOrDefault(max, finiteOrDefault(min, max))
    };
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const data = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
  }
  getLabelItems(chartArea = this.chart.chartArea) {
    const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
    return items;
  }
  beforeLayout() {
    this._cache = {};
    this._dataLimitsCached = false;
  }
  beforeUpdate() {
    callback(this.options.beforeUpdate, [
      this
    ]);
  }
  update(maxWidth, maxHeight, margins) {
    const { beginAtZero, grace, ticks: tickOpts } = this.options;
    const sampleSize = tickOpts.sampleSize;
    this.beforeUpdate();
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this._margins = margins = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, margins);
    this.ticks = null;
    this._labelSizes = null;
    this._gridLineItems = null;
    this._labelItems = null;
    this.beforeSetDimensions();
    this.setDimensions();
    this.afterSetDimensions();
    this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
    if (!this._dataLimitsCached) {
      this.beforeDataLimits();
      this.determineDataLimits();
      this.afterDataLimits();
      this._range = _addGrace(this, grace, beginAtZero);
      this._dataLimitsCached = true;
    }
    this.beforeBuildTicks();
    this.ticks = this.buildTicks() || [];
    this.afterBuildTicks();
    const samplingEnabled = sampleSize < this.ticks.length;
    this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
    this.configure();
    this.beforeCalculateLabelRotation();
    this.calculateLabelRotation();
    this.afterCalculateLabelRotation();
    if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === "auto")) {
      this.ticks = autoSkip(this, this.ticks);
      this._labelSizes = null;
      this.afterAutoSkip();
    }
    if (samplingEnabled) {
      this._convertTicksToLabels(this.ticks);
    }
    this.beforeFit();
    this.fit();
    this.afterFit();
    this.afterUpdate();
  }
  configure() {
    let reversePixels = this.options.reverse;
    let startPixel, endPixel;
    if (this.isHorizontal()) {
      startPixel = this.left;
      endPixel = this.right;
    } else {
      startPixel = this.top;
      endPixel = this.bottom;
      reversePixels = !reversePixels;
    }
    this._startPixel = startPixel;
    this._endPixel = endPixel;
    this._reversePixels = reversePixels;
    this._length = endPixel - startPixel;
    this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    callback(this.options.afterUpdate, [
      this
    ]);
  }
  beforeSetDimensions() {
    callback(this.options.beforeSetDimensions, [
      this
    ]);
  }
  setDimensions() {
    if (this.isHorizontal()) {
      this.width = this.maxWidth;
      this.left = 0;
      this.right = this.width;
    } else {
      this.height = this.maxHeight;
      this.top = 0;
      this.bottom = this.height;
    }
    this.paddingLeft = 0;
    this.paddingTop = 0;
    this.paddingRight = 0;
    this.paddingBottom = 0;
  }
  afterSetDimensions() {
    callback(this.options.afterSetDimensions, [
      this
    ]);
  }
  _callHooks(name) {
    this.chart.notifyPlugins(name, this.getContext());
    callback(this.options[name], [
      this
    ]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {
  }
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    callback(this.options.beforeTickToLabelConversion, [
      this
    ]);
  }
  generateTickLabels(ticks) {
    const tickOpts = this.options.ticks;
    let i, ilen, tick;
    for (i = 0, ilen = ticks.length; i < ilen; i++) {
      tick = ticks[i];
      tick.label = callback(tickOpts.callback, [
        tick.value,
        i,
        ticks
      ], this);
    }
  }
  afterTickToLabelConversion() {
    callback(this.options.afterTickToLabelConversion, [
      this
    ]);
  }
  beforeCalculateLabelRotation() {
    callback(this.options.beforeCalculateLabelRotation, [
      this
    ]);
  }
  calculateLabelRotation() {
    const options = this.options;
    const tickOpts = options.ticks;
    const numTicks = getTicksLimit(this.ticks.length, options.ticks.maxTicksLimit);
    const minRotation = tickOpts.minRotation || 0;
    const maxRotation = tickOpts.maxRotation;
    let labelRotation = minRotation;
    let tickWidth, maxHeight, maxLabelDiagonal;
    if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
      this.labelRotation = minRotation;
      return;
    }
    const labelSizes = this._getLabelSizes();
    const maxLabelWidth = labelSizes.widest.width;
    const maxLabelHeight = labelSizes.highest.height;
    const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
    tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
    if (maxLabelWidth + 6 > tickWidth) {
      tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
      maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
      maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
      labelRotation = toDegrees(Math.min(Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))));
      labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
    }
    this.labelRotation = labelRotation;
  }
  afterCalculateLabelRotation() {
    callback(this.options.afterCalculateLabelRotation, [
      this
    ]);
  }
  afterAutoSkip() {
  }
  beforeFit() {
    callback(this.options.beforeFit, [
      this
    ]);
  }
  fit() {
    const minSize = {
      width: 0,
      height: 0
    };
    const { chart, options: { ticks: tickOpts, title: titleOpts, grid: gridOpts } } = this;
    const display = this._isVisible();
    const isHorizontal = this.isHorizontal();
    if (display) {
      const titleHeight = getTitleHeight(titleOpts, chart.options.font);
      if (isHorizontal) {
        minSize.width = this.maxWidth;
        minSize.height = getTickMarkLength(gridOpts) + titleHeight;
      } else {
        minSize.height = this.maxHeight;
        minSize.width = getTickMarkLength(gridOpts) + titleHeight;
      }
      if (tickOpts.display && this.ticks.length) {
        const { first, last, widest, highest } = this._getLabelSizes();
        const tickPadding = tickOpts.padding * 2;
        const angleRadians = toRadians(this.labelRotation);
        const cos = Math.cos(angleRadians);
        const sin = Math.sin(angleRadians);
        if (isHorizontal) {
          const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
          minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
        } else {
          const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
          minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
        }
        this._calculatePadding(first, last, sin, cos);
      }
    }
    this._handleMargins();
    if (isHorizontal) {
      this.width = this._length = chart.width - this._margins.left - this._margins.right;
      this.height = minSize.height;
    } else {
      this.width = minSize.width;
      this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
    }
  }
  _calculatePadding(first, last, sin, cos) {
    const { ticks: { align, padding }, position } = this.options;
    const isRotated = this.labelRotation !== 0;
    const labelsBelowTicks = position !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const offsetLeft = this.getPixelForTick(0) - this.left;
      const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
      let paddingLeft = 0;
      let paddingRight = 0;
      if (isRotated) {
        if (labelsBelowTicks) {
          paddingLeft = cos * first.width;
          paddingRight = sin * last.height;
        } else {
          paddingLeft = sin * first.height;
          paddingRight = cos * last.width;
        }
      } else if (align === "start") {
        paddingRight = last.width;
      } else if (align === "end") {
        paddingLeft = first.width;
      } else if (align !== "inner") {
        paddingLeft = first.width / 2;
        paddingRight = last.width / 2;
      }
      this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
      this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
    } else {
      let paddingTop = last.height / 2;
      let paddingBottom = first.height / 2;
      if (align === "start") {
        paddingTop = 0;
        paddingBottom = first.height;
      } else if (align === "end") {
        paddingTop = last.height;
        paddingBottom = 0;
      }
      this.paddingTop = paddingTop + padding;
      this.paddingBottom = paddingBottom + padding;
    }
  }
  _handleMargins() {
    if (this._margins) {
      this._margins.left = Math.max(this.paddingLeft, this._margins.left);
      this._margins.top = Math.max(this.paddingTop, this._margins.top);
      this._margins.right = Math.max(this.paddingRight, this._margins.right);
      this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
    }
  }
  afterFit() {
    callback(this.options.afterFit, [
      this
    ]);
  }
  isHorizontal() {
    const { axis, position } = this.options;
    return position === "top" || position === "bottom" || axis === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(ticks) {
    this.beforeTickToLabelConversion();
    this.generateTickLabels(ticks);
    let i, ilen;
    for (i = 0, ilen = ticks.length; i < ilen; i++) {
      if (isNullOrUndef(ticks[i].label)) {
        ticks.splice(i, 1);
        ilen--;
        i--;
      }
    }
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let labelSizes = this._labelSizes;
    if (!labelSizes) {
      const sampleSize = this.options.ticks.sampleSize;
      let ticks = this.ticks;
      if (sampleSize < ticks.length) {
        ticks = sample(ticks, sampleSize);
      }
      this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length, this.options.ticks.maxTicksLimit);
    }
    return labelSizes;
  }
  _computeLabelSizes(ticks, length, maxTicksLimit) {
    const { ctx, _longestTextCache: caches } = this;
    const widths = [];
    const heights = [];
    const increment = Math.floor(length / getTicksLimit(length, maxTicksLimit));
    let widestLabelSize = 0;
    let highestLabelSize = 0;
    let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
    for (i = 0; i < length; i += increment) {
      label = ticks[i].label;
      tickFont = this._resolveTickFontOptions(i);
      ctx.font = fontString = tickFont.string;
      cache = caches[fontString] = caches[fontString] || {
        data: {},
        gc: []
      };
      lineHeight = tickFont.lineHeight;
      width = height = 0;
      if (!isNullOrUndef(label) && !isArray(label)) {
        width = _measureText(ctx, cache.data, cache.gc, width, label);
        height = lineHeight;
      } else if (isArray(label)) {
        for (j = 0, jlen = label.length; j < jlen; ++j) {
          nestedLabel = label[j];
          if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
            width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
            height += lineHeight;
          }
        }
      }
      widths.push(width);
      heights.push(height);
      widestLabelSize = Math.max(width, widestLabelSize);
      highestLabelSize = Math.max(height, highestLabelSize);
    }
    garbageCollect(caches, length);
    const widest = widths.indexOf(widestLabelSize);
    const highest = heights.indexOf(highestLabelSize);
    const valueAt = (idx) => ({
      width: widths[idx] || 0,
      height: heights[idx] || 0
    });
    return {
      first: valueAt(0),
      last: valueAt(length - 1),
      widest: valueAt(widest),
      highest: valueAt(highest),
      widths,
      heights
    };
  }
  getLabelForValue(value) {
    return value;
  }
  getPixelForValue(value, index2) {
    return NaN;
  }
  getValueForPixel(pixel) {
  }
  getPixelForTick(index2) {
    const ticks = this.ticks;
    if (index2 < 0 || index2 > ticks.length - 1) {
      return null;
    }
    return this.getPixelForValue(ticks[index2].value);
  }
  getPixelForDecimal(decimal) {
    if (this._reversePixels) {
      decimal = 1 - decimal;
    }
    const pixel = this._startPixel + decimal * this._length;
    return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
  }
  getDecimalForPixel(pixel) {
    const decimal = (pixel - this._startPixel) / this._length;
    return this._reversePixels ? 1 - decimal : decimal;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min, max } = this;
    return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
  }
  getContext(index2) {
    const ticks = this.ticks || [];
    if (index2 >= 0 && index2 < ticks.length) {
      const tick = ticks[index2];
      return tick.$context || (tick.$context = createTickContext(this.getContext(), index2, tick));
    }
    return this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
  }
  _tickSize() {
    const optionTicks = this.options.ticks;
    const rot = toRadians(this.labelRotation);
    const cos = Math.abs(Math.cos(rot));
    const sin = Math.abs(Math.sin(rot));
    const labelSizes = this._getLabelSizes();
    const padding = optionTicks.autoSkipPadding || 0;
    const w = labelSizes ? labelSizes.widest.width + padding : 0;
    const h = labelSizes ? labelSizes.highest.height + padding : 0;
    return this.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
  }
  _isVisible() {
    const display = this.options.display;
    if (display !== "auto") {
      return !!display;
    }
    return this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(chartArea) {
    const axis = this.axis;
    const chart = this.chart;
    const options = this.options;
    const { grid, position, border } = options;
    const offset = grid.offset;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const ticksLength = ticks.length + (offset ? 1 : 0);
    const tl = getTickMarkLength(grid);
    const items = [];
    const borderOpts = border.setContext(this.getContext());
    const axisWidth = borderOpts.display ? borderOpts.width : 0;
    const axisHalfWidth = axisWidth / 2;
    const alignBorderValue = function(pixel) {
      return _alignPixel(chart, pixel, axisWidth);
    };
    let borderValue, i, lineValue, alignedLineValue;
    let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
    if (position === "top") {
      borderValue = alignBorderValue(this.bottom);
      ty1 = this.bottom - tl;
      ty2 = borderValue - axisHalfWidth;
      y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
      y2 = chartArea.bottom;
    } else if (position === "bottom") {
      borderValue = alignBorderValue(this.top);
      y1 = chartArea.top;
      y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
      ty1 = borderValue + axisHalfWidth;
      ty2 = this.top + tl;
    } else if (position === "left") {
      borderValue = alignBorderValue(this.right);
      tx1 = this.right - tl;
      tx2 = borderValue - axisHalfWidth;
      x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
      x2 = chartArea.right;
    } else if (position === "right") {
      borderValue = alignBorderValue(this.left);
      x1 = chartArea.left;
      x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
      tx1 = borderValue + axisHalfWidth;
      tx2 = this.left + tl;
    } else if (axis === "x") {
      if (position === "center") {
        borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
      }
      y1 = chartArea.top;
      y2 = chartArea.bottom;
      ty1 = borderValue + axisHalfWidth;
      ty2 = ty1 + tl;
    } else if (axis === "y") {
      if (position === "center") {
        borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
      }
      tx1 = borderValue - axisHalfWidth;
      tx2 = tx1 - tl;
      x1 = chartArea.left;
      x2 = chartArea.right;
    }
    const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
    const step = Math.max(1, Math.ceil(ticksLength / limit));
    for (i = 0; i < ticksLength; i += step) {
      const context = this.getContext(i);
      const optsAtIndex = grid.setContext(context);
      const optsAtIndexBorder = border.setContext(context);
      const lineWidth = optsAtIndex.lineWidth;
      const lineColor = optsAtIndex.color;
      const borderDash = optsAtIndexBorder.dash || [];
      const borderDashOffset = optsAtIndexBorder.dashOffset;
      const tickWidth = optsAtIndex.tickWidth;
      const tickColor = optsAtIndex.tickColor;
      const tickBorderDash = optsAtIndex.tickBorderDash || [];
      const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
      lineValue = getPixelForGridLine(this, i, offset);
      if (lineValue === void 0) {
        continue;
      }
      alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
      if (isHorizontal) {
        tx1 = tx2 = x1 = x2 = alignedLineValue;
      } else {
        ty1 = ty2 = y1 = y2 = alignedLineValue;
      }
      items.push({
        tx1,
        ty1,
        tx2,
        ty2,
        x1,
        y1,
        x2,
        y2,
        width: lineWidth,
        color: lineColor,
        borderDash,
        borderDashOffset,
        tickWidth,
        tickColor,
        tickBorderDash,
        tickBorderDashOffset
      });
    }
    this._ticksLength = ticksLength;
    this._borderValue = borderValue;
    return items;
  }
  _computeLabelItems(chartArea) {
    const axis = this.axis;
    const options = this.options;
    const { position, ticks: optionTicks } = options;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const { align, crossAlign, padding, mirror } = optionTicks;
    const tl = getTickMarkLength(options.grid);
    const tickAndPadding = tl + padding;
    const hTickAndPadding = mirror ? -padding : tickAndPadding;
    const rotation = -toRadians(this.labelRotation);
    const items = [];
    let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
    let textBaseline = "middle";
    if (position === "top") {
      y = this.bottom - hTickAndPadding;
      textAlign = this._getXAxisLabelAlignment();
    } else if (position === "bottom") {
      y = this.top + hTickAndPadding;
      textAlign = this._getXAxisLabelAlignment();
    } else if (position === "left") {
      const ret = this._getYAxisLabelAlignment(tl);
      textAlign = ret.textAlign;
      x = ret.x;
    } else if (position === "right") {
      const ret = this._getYAxisLabelAlignment(tl);
      textAlign = ret.textAlign;
      x = ret.x;
    } else if (axis === "x") {
      if (position === "center") {
        y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
      }
      textAlign = this._getXAxisLabelAlignment();
    } else if (axis === "y") {
      if (position === "center") {
        x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        x = this.chart.scales[positionAxisID].getPixelForValue(value);
      }
      textAlign = this._getYAxisLabelAlignment(tl).textAlign;
    }
    if (axis === "y") {
      if (align === "start") {
        textBaseline = "top";
      } else if (align === "end") {
        textBaseline = "bottom";
      }
    }
    const labelSizes = this._getLabelSizes();
    for (i = 0, ilen = ticks.length; i < ilen; ++i) {
      tick = ticks[i];
      label = tick.label;
      const optsAtIndex = optionTicks.setContext(this.getContext(i));
      pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
      font = this._resolveTickFontOptions(i);
      lineHeight = font.lineHeight;
      lineCount = isArray(label) ? label.length : 1;
      const halfCount = lineCount / 2;
      const color2 = optsAtIndex.color;
      const strokeColor = optsAtIndex.textStrokeColor;
      const strokeWidth = optsAtIndex.textStrokeWidth;
      let tickTextAlign = textAlign;
      if (isHorizontal) {
        x = pixel;
        if (textAlign === "inner") {
          if (i === ilen - 1) {
            tickTextAlign = !this.options.reverse ? "right" : "left";
          } else if (i === 0) {
            tickTextAlign = !this.options.reverse ? "left" : "right";
          } else {
            tickTextAlign = "center";
          }
        }
        if (position === "top") {
          if (crossAlign === "near" || rotation !== 0) {
            textOffset = -lineCount * lineHeight + lineHeight / 2;
          } else if (crossAlign === "center") {
            textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
          } else {
            textOffset = -labelSizes.highest.height + lineHeight / 2;
          }
        } else {
          if (crossAlign === "near" || rotation !== 0) {
            textOffset = lineHeight / 2;
          } else if (crossAlign === "center") {
            textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
          } else {
            textOffset = labelSizes.highest.height - lineCount * lineHeight;
          }
        }
        if (mirror) {
          textOffset *= -1;
        }
        if (rotation !== 0 && !optsAtIndex.showLabelBackdrop) {
          x += lineHeight / 2 * Math.sin(rotation);
        }
      } else {
        y = pixel;
        textOffset = (1 - lineCount) * lineHeight / 2;
      }
      let backdrop;
      if (optsAtIndex.showLabelBackdrop) {
        const labelPadding = toPadding(optsAtIndex.backdropPadding);
        const height = labelSizes.heights[i];
        const width = labelSizes.widths[i];
        let top = textOffset - labelPadding.top;
        let left = 0 - labelPadding.left;
        switch (textBaseline) {
          case "middle":
            top -= height / 2;
            break;
          case "bottom":
            top -= height;
            break;
        }
        switch (textAlign) {
          case "center":
            left -= width / 2;
            break;
          case "right":
            left -= width;
            break;
          case "inner":
            if (i === ilen - 1) {
              left -= width;
            } else if (i > 0) {
              left -= width / 2;
            }
            break;
        }
        backdrop = {
          left,
          top,
          width: width + labelPadding.width,
          height: height + labelPadding.height,
          color: optsAtIndex.backdropColor
        };
      }
      items.push({
        label,
        font,
        textOffset,
        options: {
          rotation,
          color: color2,
          strokeColor,
          strokeWidth,
          textAlign: tickTextAlign,
          textBaseline,
          translation: [
            x,
            y
          ],
          backdrop
        }
      });
    }
    return items;
  }
  _getXAxisLabelAlignment() {
    const { position, ticks } = this.options;
    const rotation = -toRadians(this.labelRotation);
    if (rotation) {
      return position === "top" ? "left" : "right";
    }
    let align = "center";
    if (ticks.align === "start") {
      align = "left";
    } else if (ticks.align === "end") {
      align = "right";
    } else if (ticks.align === "inner") {
      align = "inner";
    }
    return align;
  }
  _getYAxisLabelAlignment(tl) {
    const { position, ticks: { crossAlign, mirror, padding } } = this.options;
    const labelSizes = this._getLabelSizes();
    const tickAndPadding = tl + padding;
    const widest = labelSizes.widest.width;
    let textAlign;
    let x;
    if (position === "left") {
      if (mirror) {
        x = this.right + padding;
        if (crossAlign === "near") {
          textAlign = "left";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x += widest / 2;
        } else {
          textAlign = "right";
          x += widest;
        }
      } else {
        x = this.right - tickAndPadding;
        if (crossAlign === "near") {
          textAlign = "right";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x -= widest / 2;
        } else {
          textAlign = "left";
          x = this.left;
        }
      }
    } else if (position === "right") {
      if (mirror) {
        x = this.left + padding;
        if (crossAlign === "near") {
          textAlign = "right";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x -= widest / 2;
        } else {
          textAlign = "left";
          x -= widest;
        }
      } else {
        x = this.left + tickAndPadding;
        if (crossAlign === "near") {
          textAlign = "left";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x += widest / 2;
        } else {
          textAlign = "right";
          x = this.right;
        }
      }
    } else {
      textAlign = "right";
    }
    return {
      textAlign,
      x
    };
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror) {
      return;
    }
    const chart = this.chart;
    const position = this.options.position;
    if (position === "left" || position === "right") {
      return {
        top: 0,
        left: this.left,
        bottom: chart.height,
        right: this.right
      };
    }
    if (position === "top" || position === "bottom") {
      return {
        top: this.top,
        left: 0,
        bottom: this.bottom,
        right: chart.width
      };
    }
  }
  drawBackground() {
    const { ctx, options: { backgroundColor }, left, top, width, height } = this;
    if (backgroundColor) {
      ctx.save();
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(left, top, width, height);
      ctx.restore();
    }
  }
  getLineWidthForValue(value) {
    const grid = this.options.grid;
    if (!this._isVisible() || !grid.display) {
      return 0;
    }
    const ticks = this.ticks;
    const index2 = ticks.findIndex((t) => t.value === value);
    if (index2 >= 0) {
      const opts = grid.setContext(this.getContext(index2));
      return opts.lineWidth;
    }
    return 0;
  }
  drawGrid(chartArea) {
    const grid = this.options.grid;
    const ctx = this.ctx;
    const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
    let i, ilen;
    const drawLine = (p1, p2, style) => {
      if (!style.width || !style.color) {
        return;
      }
      ctx.save();
      ctx.lineWidth = style.width;
      ctx.strokeStyle = style.color;
      ctx.setLineDash(style.borderDash || []);
      ctx.lineDashOffset = style.borderDashOffset;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.restore();
    };
    if (grid.display) {
      for (i = 0, ilen = items.length; i < ilen; ++i) {
        const item = items[i];
        if (grid.drawOnChartArea) {
          drawLine({
            x: item.x1,
            y: item.y1
          }, {
            x: item.x2,
            y: item.y2
          }, item);
        }
        if (grid.drawTicks) {
          drawLine({
            x: item.tx1,
            y: item.ty1
          }, {
            x: item.tx2,
            y: item.ty2
          }, {
            color: item.tickColor,
            width: item.tickWidth,
            borderDash: item.tickBorderDash,
            borderDashOffset: item.tickBorderDashOffset
          });
        }
      }
    }
  }
  drawBorder() {
    const { chart, ctx, options: { border, grid } } = this;
    const borderOpts = border.setContext(this.getContext());
    const axisWidth = border.display ? borderOpts.width : 0;
    if (!axisWidth) {
      return;
    }
    const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
    const borderValue = this._borderValue;
    let x1, x2, y1, y2;
    if (this.isHorizontal()) {
      x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
      x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
      y1 = y2 = borderValue;
    } else {
      y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
      y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
      x1 = x2 = borderValue;
    }
    ctx.save();
    ctx.lineWidth = borderOpts.width;
    ctx.strokeStyle = borderOpts.color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
  drawLabels(chartArea) {
    const optionTicks = this.options.ticks;
    if (!optionTicks.display) {
      return;
    }
    const ctx = this.ctx;
    const area = this._computeLabelArea();
    if (area) {
      clipArea(ctx, area);
    }
    const items = this.getLabelItems(chartArea);
    for (const item of items) {
      const renderTextOptions = item.options;
      const tickFont = item.font;
      const label = item.label;
      const y = item.textOffset;
      renderText(ctx, label, 0, y, tickFont, renderTextOptions);
    }
    if (area) {
      unclipArea(ctx);
    }
  }
  drawTitle() {
    const { ctx, options: { position, title, reverse } } = this;
    if (!title.display) {
      return;
    }
    const font = toFont(title.font);
    const padding = toPadding(title.padding);
    const align = title.align;
    let offset = font.lineHeight / 2;
    if (position === "bottom" || position === "center" || isObject(position)) {
      offset += padding.bottom;
      if (isArray(title.text)) {
        offset += font.lineHeight * (title.text.length - 1);
      }
    } else {
      offset += padding.top;
    }
    const { titleX, titleY, maxWidth, rotation } = titleArgs(this, offset, position, align);
    renderText(ctx, title.text, 0, 0, font, {
      color: title.color,
      maxWidth,
      rotation,
      textAlign: titleAlign(align, position, reverse),
      textBaseline: "middle",
      translation: [
        titleX,
        titleY
      ]
    });
  }
  draw(chartArea) {
    if (!this._isVisible()) {
      return;
    }
    this.drawBackground();
    this.drawGrid(chartArea);
    this.drawBorder();
    this.drawTitle();
    this.drawLabels(chartArea);
  }
  _layers() {
    const opts = this.options;
    const tz = opts.ticks && opts.ticks.z || 0;
    const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
    const bz = valueOrDefault(opts.border && opts.border.z, 0);
    if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
      return [
        {
          z: tz,
          draw: (chartArea) => {
            this.draw(chartArea);
          }
        }
      ];
    }
    return [
      {
        z: gz,
        draw: (chartArea) => {
          this.drawBackground();
          this.drawGrid(chartArea);
          this.drawTitle();
        }
      },
      {
        z: bz,
        draw: () => {
          this.drawBorder();
        }
      },
      {
        z: tz,
        draw: (chartArea) => {
          this.drawLabels(chartArea);
        }
      }
    ];
  }
  getMatchingVisibleMetas(type) {
    const metas = this.chart.getSortedVisibleDatasetMetas();
    const axisID = this.axis + "AxisID";
    const result = [];
    let i, ilen;
    for (i = 0, ilen = metas.length; i < ilen; ++i) {
      const meta = metas[i];
      if (meta[axisID] === this.id && (!type || meta.type === type)) {
        result.push(meta);
      }
    }
    return result;
  }
  _resolveTickFontOptions(index2) {
    const opts = this.options.ticks.setContext(this.getContext(index2));
    return toFont(opts.font);
  }
  _maxDigits() {
    const fontSize = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / fontSize;
  }
}
class TypedRegistry {
  constructor(type, scope, override) {
    this.type = type;
    this.scope = scope;
    this.override = override;
    this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(type) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
  }
  register(item) {
    const proto = Object.getPrototypeOf(item);
    let parentScope;
    if (isIChartComponent(proto)) {
      parentScope = this.register(proto);
    }
    const items = this.items;
    const id = item.id;
    const scope = this.scope + "." + id;
    if (!id) {
      throw new Error("class does not have id: " + item);
    }
    if (id in items) {
      return scope;
    }
    items[id] = item;
    registerDefaults(item, scope, parentScope);
    if (this.override) {
      defaults.override(item.id, item.overrides);
    }
    return scope;
  }
  get(id) {
    return this.items[id];
  }
  unregister(item) {
    const items = this.items;
    const id = item.id;
    const scope = this.scope;
    if (id in items) {
      delete items[id];
    }
    if (scope && id in defaults[scope]) {
      delete defaults[scope][id];
      if (this.override) {
        delete overrides[id];
      }
    }
  }
}
function registerDefaults(item, scope, parentScope) {
  const itemDefaults = merge(/* @__PURE__ */ Object.create(null), [
    parentScope ? defaults.get(parentScope) : {},
    defaults.get(scope),
    item.defaults
  ]);
  defaults.set(scope, itemDefaults);
  if (item.defaultRoutes) {
    routeDefaults(scope, item.defaultRoutes);
  }
  if (item.descriptors) {
    defaults.describe(scope, item.descriptors);
  }
}
function routeDefaults(scope, routes) {
  Object.keys(routes).forEach((property) => {
    const propertyParts = property.split(".");
    const sourceName = propertyParts.pop();
    const sourceScope = [
      scope
    ].concat(propertyParts).join(".");
    const parts = routes[property].split(".");
    const targetName = parts.pop();
    const targetScope = parts.join(".");
    defaults.route(sourceScope, sourceName, targetScope, targetName);
  });
}
function isIChartComponent(proto) {
  return "id" in proto && "defaults" in proto;
}
class Registry {
  constructor() {
    this.controllers = new TypedRegistry(DatasetController, "datasets", true);
    this.elements = new TypedRegistry(Element, "elements");
    this.plugins = new TypedRegistry(Object, "plugins");
    this.scales = new TypedRegistry(Scale, "scales");
    this._typedRegistries = [
      this.controllers,
      this.scales,
      this.elements
    ];
  }
  add(...args) {
    this._each("register", args);
  }
  remove(...args) {
    this._each("unregister", args);
  }
  addControllers(...args) {
    this._each("register", args, this.controllers);
  }
  addElements(...args) {
    this._each("register", args, this.elements);
  }
  addPlugins(...args) {
    this._each("register", args, this.plugins);
  }
  addScales(...args) {
    this._each("register", args, this.scales);
  }
  getController(id) {
    return this._get(id, this.controllers, "controller");
  }
  getElement(id) {
    return this._get(id, this.elements, "element");
  }
  getPlugin(id) {
    return this._get(id, this.plugins, "plugin");
  }
  getScale(id) {
    return this._get(id, this.scales, "scale");
  }
  removeControllers(...args) {
    this._each("unregister", args, this.controllers);
  }
  removeElements(...args) {
    this._each("unregister", args, this.elements);
  }
  removePlugins(...args) {
    this._each("unregister", args, this.plugins);
  }
  removeScales(...args) {
    this._each("unregister", args, this.scales);
  }
  _each(method, args, typedRegistry) {
    [
      ...args
    ].forEach((arg) => {
      const reg = typedRegistry || this._getRegistryForType(arg);
      if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
        this._exec(method, reg, arg);
      } else {
        each(arg, (item) => {
          const itemReg = typedRegistry || this._getRegistryForType(item);
          this._exec(method, itemReg, item);
        });
      }
    });
  }
  _exec(method, registry2, component) {
    const camelMethod = _capitalize(method);
    callback(component["before" + camelMethod], [], component);
    registry2[method](component);
    callback(component["after" + camelMethod], [], component);
  }
  _getRegistryForType(type) {
    for (let i = 0; i < this._typedRegistries.length; i++) {
      const reg = this._typedRegistries[i];
      if (reg.isForType(type)) {
        return reg;
      }
    }
    return this.plugins;
  }
  _get(id, typedRegistry, type) {
    const item = typedRegistry.get(id);
    if (item === void 0) {
      throw new Error('"' + id + '" is not a registered ' + type + ".");
    }
    return item;
  }
}
var registry = /* @__PURE__ */ new Registry();
class PluginService {
  constructor() {
    this._init = [];
  }
  notify(chart, hook, args, filter) {
    if (hook === "beforeInit") {
      this._init = this._createDescriptors(chart, true);
      this._notify(this._init, chart, "install");
    }
    const descriptors2 = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
    const result = this._notify(descriptors2, chart, hook, args);
    if (hook === "afterDestroy") {
      this._notify(descriptors2, chart, "stop");
      this._notify(this._init, chart, "uninstall");
    }
    return result;
  }
  _notify(descriptors2, chart, hook, args) {
    args = args || {};
    for (const descriptor of descriptors2) {
      const plugin = descriptor.plugin;
      const method = plugin[hook];
      const params = [
        chart,
        args,
        descriptor.options
      ];
      if (callback(method, params, plugin) === false && args.cancelable) {
        return false;
      }
    }
    return true;
  }
  invalidate() {
    if (!isNullOrUndef(this._cache)) {
      this._oldCache = this._cache;
      this._cache = void 0;
    }
  }
  _descriptors(chart) {
    if (this._cache) {
      return this._cache;
    }
    const descriptors2 = this._cache = this._createDescriptors(chart);
    this._notifyStateChanges(chart);
    return descriptors2;
  }
  _createDescriptors(chart, all) {
    const config = chart && chart.config;
    const options = valueOrDefault(config.options && config.options.plugins, {});
    const plugins2 = allPlugins(config);
    return options === false && !all ? [] : createDescriptors(chart, plugins2, options, all);
  }
  _notifyStateChanges(chart) {
    const previousDescriptors = this._oldCache || [];
    const descriptors2 = this._cache;
    const diff = (a, b) => a.filter((x) => !b.some((y) => x.plugin.id === y.plugin.id));
    this._notify(diff(previousDescriptors, descriptors2), chart, "stop");
    this._notify(diff(descriptors2, previousDescriptors), chart, "start");
  }
}
function allPlugins(config) {
  const localIds = {};
  const plugins2 = [];
  const keys = Object.keys(registry.plugins.items);
  for (let i = 0; i < keys.length; i++) {
    plugins2.push(registry.getPlugin(keys[i]));
  }
  const local = config.plugins || [];
  for (let i = 0; i < local.length; i++) {
    const plugin = local[i];
    if (plugins2.indexOf(plugin) === -1) {
      plugins2.push(plugin);
      localIds[plugin.id] = true;
    }
  }
  return {
    plugins: plugins2,
    localIds
  };
}
function getOpts(options, all) {
  if (!all && options === false) {
    return null;
  }
  if (options === true) {
    return {};
  }
  return options;
}
function createDescriptors(chart, { plugins: plugins2, localIds }, options, all) {
  const result = [];
  const context = chart.getContext();
  for (const plugin of plugins2) {
    const id = plugin.id;
    const opts = getOpts(options[id], all);
    if (opts === null) {
      continue;
    }
    result.push({
      plugin,
      options: pluginOpts(chart.config, {
        plugin,
        local: localIds[id]
      }, opts, context)
    });
  }
  return result;
}
function pluginOpts(config, { plugin, local }, opts, context) {
  const keys = config.pluginScopeKeys(plugin);
  const scopes = config.getOptionScopes(opts, keys);
  if (local && plugin.defaults) {
    scopes.push(plugin.defaults);
  }
  return config.createResolver(scopes, context, [
    ""
  ], {
    scriptable: false,
    indexable: false,
    allKeys: true
  });
}
function getIndexAxis(type, options) {
  const datasetDefaults = defaults.datasets[type] || {};
  const datasetOptions = (options.datasets || {})[type] || {};
  return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || "x";
}
function getAxisFromDefaultScaleID(id, indexAxis) {
  let axis = id;
  if (id === "_index_") {
    axis = indexAxis;
  } else if (id === "_value_") {
    axis = indexAxis === "x" ? "y" : "x";
  }
  return axis;
}
function getDefaultScaleIDFromAxis(axis, indexAxis) {
  return axis === indexAxis ? "_index_" : "_value_";
}
function idMatchesAxis(id) {
  if (id === "x" || id === "y" || id === "r") {
    return id;
  }
}
function axisFromPosition(position) {
  if (position === "top" || position === "bottom") {
    return "x";
  }
  if (position === "left" || position === "right") {
    return "y";
  }
}
function determineAxis(id, ...scaleOptions) {
  if (idMatchesAxis(id)) {
    return id;
  }
  for (const opts of scaleOptions) {
    const axis = opts.axis || axisFromPosition(opts.position) || id.length > 1 && idMatchesAxis(id[0].toLowerCase());
    if (axis) {
      return axis;
    }
  }
  throw new Error(`Cannot determine type of '${id}' axis. Please provide 'axis' or 'position' option.`);
}
function getAxisFromDataset(id, axis, dataset) {
  if (dataset[axis + "AxisID"] === id) {
    return {
      axis
    };
  }
}
function retrieveAxisFromDatasets(id, config) {
  if (config.data && config.data.datasets) {
    const boundDs = config.data.datasets.filter((d) => d.xAxisID === id || d.yAxisID === id);
    if (boundDs.length) {
      return getAxisFromDataset(id, "x", boundDs[0]) || getAxisFromDataset(id, "y", boundDs[0]);
    }
  }
  return {};
}
function mergeScaleConfig(config, options) {
  const chartDefaults = overrides[config.type] || {
    scales: {}
  };
  const configScales = options.scales || {};
  const chartIndexAxis = getIndexAxis(config.type, options);
  const scales2 = /* @__PURE__ */ Object.create(null);
  Object.keys(configScales).forEach((id) => {
    const scaleConf = configScales[id];
    if (!isObject(scaleConf)) {
      return console.error(`Invalid scale configuration for scale: ${id}`);
    }
    if (scaleConf._proxy) {
      return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
    }
    const axis = determineAxis(id, scaleConf, retrieveAxisFromDatasets(id, config), defaults.scales[scaleConf.type]);
    const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
    const defaultScaleOptions = chartDefaults.scales || {};
    scales2[id] = mergeIf(/* @__PURE__ */ Object.create(null), [
      {
        axis
      },
      scaleConf,
      defaultScaleOptions[axis],
      defaultScaleOptions[defaultId]
    ]);
  });
  config.data.datasets.forEach((dataset) => {
    const type = dataset.type || config.type;
    const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
    const datasetDefaults = overrides[type] || {};
    const defaultScaleOptions = datasetDefaults.scales || {};
    Object.keys(defaultScaleOptions).forEach((defaultID) => {
      const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
      const id = dataset[axis + "AxisID"] || axis;
      scales2[id] = scales2[id] || /* @__PURE__ */ Object.create(null);
      mergeIf(scales2[id], [
        {
          axis
        },
        configScales[id],
        defaultScaleOptions[defaultID]
      ]);
    });
  });
  Object.keys(scales2).forEach((key) => {
    const scale = scales2[key];
    mergeIf(scale, [
      defaults.scales[scale.type],
      defaults.scale
    ]);
  });
  return scales2;
}
function initOptions(config) {
  const options = config.options || (config.options = {});
  options.plugins = valueOrDefault(options.plugins, {});
  options.scales = mergeScaleConfig(config, options);
}
function initData(data) {
  data = data || {};
  data.datasets = data.datasets || [];
  data.labels = data.labels || [];
  return data;
}
function initConfig(config) {
  config = config || {};
  config.data = initData(config.data);
  initOptions(config);
  return config;
}
const keyCache = /* @__PURE__ */ new Map();
const keysCached = /* @__PURE__ */ new Set();
function cachedKeys(cacheKey, generate) {
  let keys = keyCache.get(cacheKey);
  if (!keys) {
    keys = generate();
    keyCache.set(cacheKey, keys);
    keysCached.add(keys);
  }
  return keys;
}
const addIfFound = (set2, obj, key) => {
  const opts = resolveObjectKey(obj, key);
  if (opts !== void 0) {
    set2.add(opts);
  }
};
class Config {
  constructor(config) {
    this._config = initConfig(config);
    this._scopeCache = /* @__PURE__ */ new Map();
    this._resolverCache = /* @__PURE__ */ new Map();
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(type) {
    this._config.type = type;
  }
  get data() {
    return this._config.data;
  }
  set data(data) {
    this._config.data = initData(data);
  }
  get options() {
    return this._config.options;
  }
  set options(options) {
    this._config.options = options;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const config = this._config;
    this.clearCache();
    initOptions(config);
  }
  clearCache() {
    this._scopeCache.clear();
    this._resolverCache.clear();
  }
  datasetScopeKeys(datasetType) {
    return cachedKeys(datasetType, () => [
      [
        `datasets.${datasetType}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(datasetType, transition) {
    return cachedKeys(`${datasetType}.transition.${transition}`, () => [
      [
        `datasets.${datasetType}.transitions.${transition}`,
        `transitions.${transition}`
      ],
      [
        `datasets.${datasetType}`,
        ""
      ]
    ]);
  }
  datasetElementScopeKeys(datasetType, elementType) {
    return cachedKeys(`${datasetType}-${elementType}`, () => [
      [
        `datasets.${datasetType}.elements.${elementType}`,
        `datasets.${datasetType}`,
        `elements.${elementType}`,
        ""
      ]
    ]);
  }
  pluginScopeKeys(plugin) {
    const id = plugin.id;
    const type = this.type;
    return cachedKeys(`${type}-plugin-${id}`, () => [
      [
        `plugins.${id}`,
        ...plugin.additionalOptionScopes || []
      ]
    ]);
  }
  _cachedScopes(mainScope, resetCache) {
    const _scopeCache = this._scopeCache;
    let cache = _scopeCache.get(mainScope);
    if (!cache || resetCache) {
      cache = /* @__PURE__ */ new Map();
      _scopeCache.set(mainScope, cache);
    }
    return cache;
  }
  getOptionScopes(mainScope, keyLists, resetCache) {
    const { options, type } = this;
    const cache = this._cachedScopes(mainScope, resetCache);
    const cached = cache.get(keyLists);
    if (cached) {
      return cached;
    }
    const scopes = /* @__PURE__ */ new Set();
    keyLists.forEach((keys) => {
      if (mainScope) {
        scopes.add(mainScope);
        keys.forEach((key) => addIfFound(scopes, mainScope, key));
      }
      keys.forEach((key) => addIfFound(scopes, options, key));
      keys.forEach((key) => addIfFound(scopes, overrides[type] || {}, key));
      keys.forEach((key) => addIfFound(scopes, defaults, key));
      keys.forEach((key) => addIfFound(scopes, descriptors, key));
    });
    const array = Array.from(scopes);
    if (array.length === 0) {
      array.push(/* @__PURE__ */ Object.create(null));
    }
    if (keysCached.has(keyLists)) {
      cache.set(keyLists, array);
    }
    return array;
  }
  chartOptionScopes() {
    const { options, type } = this;
    return [
      options,
      overrides[type] || {},
      defaults.datasets[type] || {},
      {
        type
      },
      defaults,
      descriptors
    ];
  }
  resolveNamedOptions(scopes, names2, context, prefixes = [
    ""
  ]) {
    const result = {
      $shared: true
    };
    const { resolver, subPrefixes } = getResolver(this._resolverCache, scopes, prefixes);
    let options = resolver;
    if (needContext(resolver, names2)) {
      result.$shared = false;
      context = isFunction(context) ? context() : context;
      const subResolver = this.createResolver(scopes, context, subPrefixes);
      options = _attachContext(resolver, context, subResolver);
    }
    for (const prop of names2) {
      result[prop] = options[prop];
    }
    return result;
  }
  createResolver(scopes, context, prefixes = [
    ""
  ], descriptorDefaults) {
    const { resolver } = getResolver(this._resolverCache, scopes, prefixes);
    return isObject(context) ? _attachContext(resolver, context, void 0, descriptorDefaults) : resolver;
  }
}
function getResolver(resolverCache, scopes, prefixes) {
  let cache = resolverCache.get(scopes);
  if (!cache) {
    cache = /* @__PURE__ */ new Map();
    resolverCache.set(scopes, cache);
  }
  const cacheKey = prefixes.join();
  let cached = cache.get(cacheKey);
  if (!cached) {
    const resolver = _createResolver(scopes, prefixes);
    cached = {
      resolver,
      subPrefixes: prefixes.filter((p) => !p.toLowerCase().includes("hover"))
    };
    cache.set(cacheKey, cached);
  }
  return cached;
}
const hasFunction = (value) => isObject(value) && Object.getOwnPropertyNames(value).some((key) => isFunction(value[key]));
function needContext(proxy, names2) {
  const { isScriptable, isIndexable } = _descriptors(proxy);
  for (const prop of names2) {
    const scriptable = isScriptable(prop);
    const indexable = isIndexable(prop);
    const value = (indexable || scriptable) && proxy[prop];
    if (scriptable && (isFunction(value) || hasFunction(value)) || indexable && isArray(value)) {
      return true;
    }
  }
  return false;
}
var version = "4.4.2";
const KNOWN_POSITIONS = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function positionIsHorizontal(position, axis) {
  return position === "top" || position === "bottom" || KNOWN_POSITIONS.indexOf(position) === -1 && axis === "x";
}
function compare2Level(l1, l2) {
  return function(a, b) {
    return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
  };
}
function onAnimationsComplete(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  chart.notifyPlugins("afterRender");
  callback(animationOptions && animationOptions.onComplete, [
    context
  ], chart);
}
function onAnimationProgress(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  callback(animationOptions && animationOptions.onProgress, [
    context
  ], chart);
}
function getCanvas(item) {
  if (_isDomSupported() && typeof item === "string") {
    item = document.getElementById(item);
  } else if (item && item.length) {
    item = item[0];
  }
  if (item && item.canvas) {
    item = item.canvas;
  }
  return item;
}
const instances = {};
const getChart = (key) => {
  const canvas = getCanvas(key);
  return Object.values(instances).filter((c) => c.canvas === canvas).pop();
};
function moveNumericKeys(obj, start, move) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    const intKey = +key;
    if (intKey >= start) {
      const value = obj[key];
      delete obj[key];
      if (move > 0 || intKey > start) {
        obj[intKey + move] = value;
      }
    }
  }
}
function determineLastEvent(e, lastEvent, inChartArea, isClick) {
  if (!inChartArea || e.type === "mouseout") {
    return null;
  }
  if (isClick) {
    return lastEvent;
  }
  return e;
}
function getSizeForArea(scale, chartArea, field) {
  return scale.options.clip ? scale[field] : chartArea[field];
}
function getDatasetArea(meta, chartArea) {
  const { xScale, yScale } = meta;
  if (xScale && yScale) {
    return {
      left: getSizeForArea(xScale, chartArea, "left"),
      right: getSizeForArea(xScale, chartArea, "right"),
      top: getSizeForArea(yScale, chartArea, "top"),
      bottom: getSizeForArea(yScale, chartArea, "bottom")
    };
  }
  return chartArea;
}
class Chart {
  static register(...items) {
    registry.add(...items);
    invalidatePlugins();
  }
  static unregister(...items) {
    registry.remove(...items);
    invalidatePlugins();
  }
  constructor(item, userConfig) {
    const config = this.config = new Config(userConfig);
    const initialCanvas = getCanvas(item);
    const existingChart = getChart(initialCanvas);
    if (existingChart) {
      throw new Error("Canvas is already in use. Chart with ID '" + existingChart.id + "' must be destroyed before the canvas with ID '" + existingChart.canvas.id + "' can be reused.");
    }
    const options = config.createResolver(config.chartOptionScopes(), this.getContext());
    this.platform = new (config.platform || _detectPlatform(initialCanvas))();
    this.platform.updateConfig(config);
    const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
    const canvas = context && context.canvas;
    const height = canvas && canvas.height;
    const width = canvas && canvas.width;
    this.id = uid();
    this.ctx = context;
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this._options = options;
    this._aspectRatio = this.aspectRatio;
    this._layers = [];
    this._metasets = [];
    this._stacks = void 0;
    this.boxes = [];
    this.currentDevicePixelRatio = void 0;
    this.chartArea = void 0;
    this._active = [];
    this._lastEvent = void 0;
    this._listeners = {};
    this._responsiveListeners = void 0;
    this._sortedMetasets = [];
    this.scales = {};
    this._plugins = new PluginService();
    this.$proxies = {};
    this._hiddenIndices = {};
    this.attached = false;
    this._animationsDisabled = void 0;
    this.$context = void 0;
    this._doResize = debounce((mode) => this.update(mode), options.resizeDelay || 0);
    this._dataChanges = [];
    instances[this.id] = this;
    if (!context || !canvas) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    animator.listen(this, "complete", onAnimationsComplete);
    animator.listen(this, "progress", onAnimationProgress);
    this._initialize();
    if (this.attached) {
      this.update();
    }
  }
  get aspectRatio() {
    const { options: { aspectRatio, maintainAspectRatio }, width, height, _aspectRatio } = this;
    if (!isNullOrUndef(aspectRatio)) {
      return aspectRatio;
    }
    if (maintainAspectRatio && _aspectRatio) {
      return _aspectRatio;
    }
    return height ? width / height : null;
  }
  get data() {
    return this.config.data;
  }
  set data(data) {
    this.config.data = data;
  }
  get options() {
    return this._options;
  }
  set options(options) {
    this.config.options = options;
  }
  get registry() {
    return registry;
  }
  _initialize() {
    this.notifyPlugins("beforeInit");
    if (this.options.responsive) {
      this.resize();
    } else {
      retinaScale(this, this.options.devicePixelRatio);
    }
    this.bindEvents();
    this.notifyPlugins("afterInit");
    return this;
  }
  clear() {
    clearCanvas(this.canvas, this.ctx);
    return this;
  }
  stop() {
    animator.stop(this);
    return this;
  }
  resize(width, height) {
    if (!animator.running(this)) {
      this._resize(width, height);
    } else {
      this._resizeBeforeDraw = {
        width,
        height
      };
    }
  }
  _resize(width, height) {
    const options = this.options;
    const canvas = this.canvas;
    const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
    const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
    const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
    const mode = this.width ? "resize" : "attach";
    this.width = newSize.width;
    this.height = newSize.height;
    this._aspectRatio = this.aspectRatio;
    if (!retinaScale(this, newRatio, true)) {
      return;
    }
    this.notifyPlugins("resize", {
      size: newSize
    });
    callback(options.onResize, [
      this,
      newSize
    ], this);
    if (this.attached) {
      if (this._doResize(mode)) {
        this.render();
      }
    }
  }
  ensureScalesHaveIDs() {
    const options = this.options;
    const scalesOptions = options.scales || {};
    each(scalesOptions, (axisOptions, axisID) => {
      axisOptions.id = axisID;
    });
  }
  buildOrUpdateScales() {
    const options = this.options;
    const scaleOpts = options.scales;
    const scales2 = this.scales;
    const updated = Object.keys(scales2).reduce((obj, id) => {
      obj[id] = false;
      return obj;
    }, {});
    let items = [];
    if (scaleOpts) {
      items = items.concat(Object.keys(scaleOpts).map((id) => {
        const scaleOptions = scaleOpts[id];
        const axis = determineAxis(id, scaleOptions);
        const isRadial = axis === "r";
        const isHorizontal = axis === "x";
        return {
          options: scaleOptions,
          dposition: isRadial ? "chartArea" : isHorizontal ? "bottom" : "left",
          dtype: isRadial ? "radialLinear" : isHorizontal ? "category" : "linear"
        };
      }));
    }
    each(items, (item) => {
      const scaleOptions = item.options;
      const id = scaleOptions.id;
      const axis = determineAxis(id, scaleOptions);
      const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
      if (scaleOptions.position === void 0 || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
        scaleOptions.position = item.dposition;
      }
      updated[id] = true;
      let scale = null;
      if (id in scales2 && scales2[id].type === scaleType) {
        scale = scales2[id];
      } else {
        const scaleClass = registry.getScale(scaleType);
        scale = new scaleClass({
          id,
          type: scaleType,
          ctx: this.ctx,
          chart: this
        });
        scales2[scale.id] = scale;
      }
      scale.init(scaleOptions, options);
    });
    each(updated, (hasUpdated, id) => {
      if (!hasUpdated) {
        delete scales2[id];
      }
    });
    each(scales2, (scale) => {
      layouts.configure(this, scale, scale.options);
      layouts.addBox(this, scale);
    });
  }
  _updateMetasets() {
    const metasets = this._metasets;
    const numData = this.data.datasets.length;
    const numMeta = metasets.length;
    metasets.sort((a, b) => a.index - b.index);
    if (numMeta > numData) {
      for (let i = numData; i < numMeta; ++i) {
        this._destroyDatasetMeta(i);
      }
      metasets.splice(numData, numMeta - numData);
    }
    this._sortedMetasets = metasets.slice(0).sort(compare2Level("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const { _metasets: metasets, data: { datasets } } = this;
    if (metasets.length > datasets.length) {
      delete this._stacks;
    }
    metasets.forEach((meta, index2) => {
      if (datasets.filter((x) => x === meta._dataset).length === 0) {
        this._destroyDatasetMeta(index2);
      }
    });
  }
  buildOrUpdateControllers() {
    const newControllers = [];
    const datasets = this.data.datasets;
    let i, ilen;
    this._removeUnreferencedMetasets();
    for (i = 0, ilen = datasets.length; i < ilen; i++) {
      const dataset = datasets[i];
      let meta = this.getDatasetMeta(i);
      const type = dataset.type || this.config.type;
      if (meta.type && meta.type !== type) {
        this._destroyDatasetMeta(i);
        meta = this.getDatasetMeta(i);
      }
      meta.type = type;
      meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
      meta.order = dataset.order || 0;
      meta.index = i;
      meta.label = "" + dataset.label;
      meta.visible = this.isDatasetVisible(i);
      if (meta.controller) {
        meta.controller.updateIndex(i);
        meta.controller.linkScales();
      } else {
        const ControllerClass = registry.getController(type);
        const { datasetElementType, dataElementType } = defaults.datasets[type];
        Object.assign(ControllerClass, {
          dataElementType: registry.getElement(dataElementType),
          datasetElementType: datasetElementType && registry.getElement(datasetElementType)
        });
        meta.controller = new ControllerClass(this, i);
        newControllers.push(meta.controller);
      }
    }
    this._updateMetasets();
    return newControllers;
  }
  _resetElements() {
    each(this.data.datasets, (dataset, datasetIndex) => {
      this.getDatasetMeta(datasetIndex).controller.reset();
    }, this);
  }
  reset() {
    this._resetElements();
    this.notifyPlugins("reset");
  }
  update(mode) {
    const config = this.config;
    config.update();
    const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
    const animsDisabled = this._animationsDisabled = !options.animation;
    this._updateScales();
    this._checkEventBindings();
    this._updateHiddenIndices();
    this._plugins.invalidate();
    if (this.notifyPlugins("beforeUpdate", {
      mode,
      cancelable: true
    }) === false) {
      return;
    }
    const newControllers = this.buildOrUpdateControllers();
    this.notifyPlugins("beforeElementsUpdate");
    let minPadding = 0;
    for (let i = 0, ilen = this.data.datasets.length; i < ilen; i++) {
      const { controller } = this.getDatasetMeta(i);
      const reset2 = !animsDisabled && newControllers.indexOf(controller) === -1;
      controller.buildOrUpdateElements(reset2);
      minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
    }
    minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
    this._updateLayout(minPadding);
    if (!animsDisabled) {
      each(newControllers, (controller) => {
        controller.reset();
      });
    }
    this._updateDatasets(mode);
    this.notifyPlugins("afterUpdate", {
      mode
    });
    this._layers.sort(compare2Level("z", "_idx"));
    const { _active, _lastEvent } = this;
    if (_lastEvent) {
      this._eventHandler(_lastEvent, true);
    } else if (_active.length) {
      this._updateHoverStyles(_active, _active, true);
    }
    this.render();
  }
  _updateScales() {
    each(this.scales, (scale) => {
      layouts.removeBox(this, scale);
    });
    this.ensureScalesHaveIDs();
    this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const options = this.options;
    const existingEvents = new Set(Object.keys(this._listeners));
    const newEvents = new Set(options.events);
    if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
      this.unbindEvents();
      this.bindEvents();
    }
  }
  _updateHiddenIndices() {
    const { _hiddenIndices } = this;
    const changes = this._getUniformDataChanges() || [];
    for (const { method, start, count } of changes) {
      const move = method === "_removeElements" ? -count : count;
      moveNumericKeys(_hiddenIndices, start, move);
    }
  }
  _getUniformDataChanges() {
    const _dataChanges = this._dataChanges;
    if (!_dataChanges || !_dataChanges.length) {
      return;
    }
    this._dataChanges = [];
    const datasetCount = this.data.datasets.length;
    const makeSet = (idx) => new Set(_dataChanges.filter((c) => c[0] === idx).map((c, i) => i + "," + c.splice(1).join(",")));
    const changeSet = makeSet(0);
    for (let i = 1; i < datasetCount; i++) {
      if (!setsEqual(changeSet, makeSet(i))) {
        return;
      }
    }
    return Array.from(changeSet).map((c) => c.split(",")).map((a) => ({
      method: a[1],
      start: +a[2],
      count: +a[3]
    }));
  }
  _updateLayout(minPadding) {
    if (this.notifyPlugins("beforeLayout", {
      cancelable: true
    }) === false) {
      return;
    }
    layouts.update(this, this.width, this.height, minPadding);
    const area = this.chartArea;
    const noArea = area.width <= 0 || area.height <= 0;
    this._layers = [];
    each(this.boxes, (box) => {
      if (noArea && box.position === "chartArea") {
        return;
      }
      if (box.configure) {
        box.configure();
      }
      this._layers.push(...box._layers());
    }, this);
    this._layers.forEach((item, index2) => {
      item._idx = index2;
    });
    this.notifyPlugins("afterLayout");
  }
  _updateDatasets(mode) {
    if (this.notifyPlugins("beforeDatasetsUpdate", {
      mode,
      cancelable: true
    }) === false) {
      return;
    }
    for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
      this.getDatasetMeta(i).controller.configure();
    }
    for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
      this._updateDataset(i, isFunction(mode) ? mode({
        datasetIndex: i
      }) : mode);
    }
    this.notifyPlugins("afterDatasetsUpdate", {
      mode
    });
  }
  _updateDataset(index2, mode) {
    const meta = this.getDatasetMeta(index2);
    const args = {
      meta,
      index: index2,
      mode,
      cancelable: true
    };
    if (this.notifyPlugins("beforeDatasetUpdate", args) === false) {
      return;
    }
    meta.controller._update(mode);
    args.cancelable = false;
    this.notifyPlugins("afterDatasetUpdate", args);
  }
  render() {
    if (this.notifyPlugins("beforeRender", {
      cancelable: true
    }) === false) {
      return;
    }
    if (animator.has(this)) {
      if (this.attached && !animator.running(this)) {
        animator.start(this);
      }
    } else {
      this.draw();
      onAnimationsComplete({
        chart: this
      });
    }
  }
  draw() {
    let i;
    if (this._resizeBeforeDraw) {
      const { width, height } = this._resizeBeforeDraw;
      this._resize(width, height);
      this._resizeBeforeDraw = null;
    }
    this.clear();
    if (this.width <= 0 || this.height <= 0) {
      return;
    }
    if (this.notifyPlugins("beforeDraw", {
      cancelable: true
    }) === false) {
      return;
    }
    const layers = this._layers;
    for (i = 0; i < layers.length && layers[i].z <= 0; ++i) {
      layers[i].draw(this.chartArea);
    }
    this._drawDatasets();
    for (; i < layers.length; ++i) {
      layers[i].draw(this.chartArea);
    }
    this.notifyPlugins("afterDraw");
  }
  _getSortedDatasetMetas(filterVisible) {
    const metasets = this._sortedMetasets;
    const result = [];
    let i, ilen;
    for (i = 0, ilen = metasets.length; i < ilen; ++i) {
      const meta = metasets[i];
      if (!filterVisible || meta.visible) {
        result.push(meta);
      }
    }
    return result;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(true);
  }
  _drawDatasets() {
    if (this.notifyPlugins("beforeDatasetsDraw", {
      cancelable: true
    }) === false) {
      return;
    }
    const metasets = this.getSortedVisibleDatasetMetas();
    for (let i = metasets.length - 1; i >= 0; --i) {
      this._drawDataset(metasets[i]);
    }
    this.notifyPlugins("afterDatasetsDraw");
  }
  _drawDataset(meta) {
    const ctx = this.ctx;
    const clip = meta._clip;
    const useClip = !clip.disabled;
    const area = getDatasetArea(meta, this.chartArea);
    const args = {
      meta,
      index: meta.index,
      cancelable: true
    };
    if (this.notifyPlugins("beforeDatasetDraw", args) === false) {
      return;
    }
    if (useClip) {
      clipArea(ctx, {
        left: clip.left === false ? 0 : area.left - clip.left,
        right: clip.right === false ? this.width : area.right + clip.right,
        top: clip.top === false ? 0 : area.top - clip.top,
        bottom: clip.bottom === false ? this.height : area.bottom + clip.bottom
      });
    }
    meta.controller.draw();
    if (useClip) {
      unclipArea(ctx);
    }
    args.cancelable = false;
    this.notifyPlugins("afterDatasetDraw", args);
  }
  isPointInArea(point) {
    return _isPointInArea(point, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(e, mode, options, useFinalPosition) {
    const method = Interaction.modes[mode];
    if (typeof method === "function") {
      return method(this, e, options, useFinalPosition);
    }
    return [];
  }
  getDatasetMeta(datasetIndex) {
    const dataset = this.data.datasets[datasetIndex];
    const metasets = this._metasets;
    let meta = metasets.filter((x) => x && x._dataset === dataset).pop();
    if (!meta) {
      meta = {
        type: null,
        data: [],
        dataset: null,
        controller: null,
        hidden: null,
        xAxisID: null,
        yAxisID: null,
        order: dataset && dataset.order || 0,
        index: datasetIndex,
        _dataset: dataset,
        _parsed: [],
        _sorted: false
      };
      metasets.push(meta);
    }
    return meta;
  }
  getContext() {
    return this.$context || (this.$context = createContext(null, {
      chart: this,
      type: "chart"
    }));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(datasetIndex) {
    const dataset = this.data.datasets[datasetIndex];
    if (!dataset) {
      return false;
    }
    const meta = this.getDatasetMeta(datasetIndex);
    return typeof meta.hidden === "boolean" ? !meta.hidden : !dataset.hidden;
  }
  setDatasetVisibility(datasetIndex, visible) {
    const meta = this.getDatasetMeta(datasetIndex);
    meta.hidden = !visible;
  }
  toggleDataVisibility(index2) {
    this._hiddenIndices[index2] = !this._hiddenIndices[index2];
  }
  getDataVisibility(index2) {
    return !this._hiddenIndices[index2];
  }
  _updateVisibility(datasetIndex, dataIndex, visible) {
    const mode = visible ? "show" : "hide";
    const meta = this.getDatasetMeta(datasetIndex);
    const anims = meta.controller._resolveAnimations(void 0, mode);
    if (defined(dataIndex)) {
      meta.data[dataIndex].hidden = !visible;
      this.update();
    } else {
      this.setDatasetVisibility(datasetIndex, visible);
      anims.update(meta, {
        visible
      });
      this.update((ctx) => ctx.datasetIndex === datasetIndex ? mode : void 0);
    }
  }
  hide(datasetIndex, dataIndex) {
    this._updateVisibility(datasetIndex, dataIndex, false);
  }
  show(datasetIndex, dataIndex) {
    this._updateVisibility(datasetIndex, dataIndex, true);
  }
  _destroyDatasetMeta(datasetIndex) {
    const meta = this._metasets[datasetIndex];
    if (meta && meta.controller) {
      meta.controller._destroy();
    }
    delete this._metasets[datasetIndex];
  }
  _stop() {
    let i, ilen;
    this.stop();
    animator.remove(this);
    for (i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
      this._destroyDatasetMeta(i);
    }
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas, ctx } = this;
    this._stop();
    this.config.clearCache();
    if (canvas) {
      this.unbindEvents();
      clearCanvas(canvas, ctx);
      this.platform.releaseContext(ctx);
      this.canvas = null;
      this.ctx = null;
    }
    delete instances[this.id];
    this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...args) {
    return this.canvas.toDataURL(...args);
  }
  bindEvents() {
    this.bindUserEvents();
    if (this.options.responsive) {
      this.bindResponsiveEvents();
    } else {
      this.attached = true;
    }
  }
  bindUserEvents() {
    const listeners = this._listeners;
    const platform = this.platform;
    const _add = (type, listener2) => {
      platform.addEventListener(this, type, listener2);
      listeners[type] = listener2;
    };
    const listener = (e, x, y) => {
      e.offsetX = x;
      e.offsetY = y;
      this._eventHandler(e);
    };
    each(this.options.events, (type) => _add(type, listener));
  }
  bindResponsiveEvents() {
    if (!this._responsiveListeners) {
      this._responsiveListeners = {};
    }
    const listeners = this._responsiveListeners;
    const platform = this.platform;
    const _add = (type, listener2) => {
      platform.addEventListener(this, type, listener2);
      listeners[type] = listener2;
    };
    const _remove = (type, listener2) => {
      if (listeners[type]) {
        platform.removeEventListener(this, type, listener2);
        delete listeners[type];
      }
    };
    const listener = (width, height) => {
      if (this.canvas) {
        this.resize(width, height);
      }
    };
    let detached;
    const attached = () => {
      _remove("attach", attached);
      this.attached = true;
      this.resize();
      _add("resize", listener);
      _add("detach", detached);
    };
    detached = () => {
      this.attached = false;
      _remove("resize", listener);
      this._stop();
      this._resize(0, 0);
      _add("attach", attached);
    };
    if (platform.isAttached(this.canvas)) {
      attached();
    } else {
      detached();
    }
  }
  unbindEvents() {
    each(this._listeners, (listener, type) => {
      this.platform.removeEventListener(this, type, listener);
    });
    this._listeners = {};
    each(this._responsiveListeners, (listener, type) => {
      this.platform.removeEventListener(this, type, listener);
    });
    this._responsiveListeners = void 0;
  }
  updateHoverStyle(items, mode, enabled) {
    const prefix = enabled ? "set" : "remove";
    let meta, item, i, ilen;
    if (mode === "dataset") {
      meta = this.getDatasetMeta(items[0].datasetIndex);
      meta.controller["_" + prefix + "DatasetHoverStyle"]();
    }
    for (i = 0, ilen = items.length; i < ilen; ++i) {
      item = items[i];
      const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
      if (controller) {
        controller[prefix + "HoverStyle"](item.element, item.datasetIndex, item.index);
      }
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(activeElements) {
    const lastActive = this._active || [];
    const active = activeElements.map(({ datasetIndex, index: index2 }) => {
      const meta = this.getDatasetMeta(datasetIndex);
      if (!meta) {
        throw new Error("No dataset found at index " + datasetIndex);
      }
      return {
        datasetIndex,
        element: meta.data[index2],
        index: index2
      };
    });
    const changed = !_elementsEqual(active, lastActive);
    if (changed) {
      this._active = active;
      this._lastEvent = null;
      this._updateHoverStyles(active, lastActive);
    }
  }
  notifyPlugins(hook, args, filter) {
    return this._plugins.notify(this, hook, args, filter);
  }
  isPluginEnabled(pluginId) {
    return this._plugins._cache.filter((p) => p.plugin.id === pluginId).length === 1;
  }
  _updateHoverStyles(active, lastActive, replay) {
    const hoverOptions = this.options.hover;
    const diff = (a, b) => a.filter((x) => !b.some((y) => x.datasetIndex === y.datasetIndex && x.index === y.index));
    const deactivated = diff(lastActive, active);
    const activated = replay ? active : diff(active, lastActive);
    if (deactivated.length) {
      this.updateHoverStyle(deactivated, hoverOptions.mode, false);
    }
    if (activated.length && hoverOptions.mode) {
      this.updateHoverStyle(activated, hoverOptions.mode, true);
    }
  }
  _eventHandler(e, replay) {
    const args = {
      event: e,
      replay,
      cancelable: true,
      inChartArea: this.isPointInArea(e)
    };
    const eventFilter = (plugin) => (plugin.options.events || this.options.events).includes(e.native.type);
    if (this.notifyPlugins("beforeEvent", args, eventFilter) === false) {
      return;
    }
    const changed = this._handleEvent(e, replay, args.inChartArea);
    args.cancelable = false;
    this.notifyPlugins("afterEvent", args, eventFilter);
    if (changed || args.changed) {
      this.render();
    }
    return this;
  }
  _handleEvent(e, replay, inChartArea) {
    const { _active: lastActive = [], options } = this;
    const useFinalPosition = replay;
    const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
    const isClick = _isClickEvent(e);
    const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
    if (inChartArea) {
      this._lastEvent = null;
      callback(options.onHover, [
        e,
        active,
        this
      ], this);
      if (isClick) {
        callback(options.onClick, [
          e,
          active,
          this
        ], this);
      }
    }
    const changed = !_elementsEqual(active, lastActive);
    if (changed || replay) {
      this._active = active;
      this._updateHoverStyles(active, lastActive, replay);
    }
    this._lastEvent = lastEvent;
    return changed;
  }
  _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
    if (e.type === "mouseout") {
      return [];
    }
    if (!inChartArea) {
      return lastActive;
    }
    const hoverOptions = this.options.hover;
    return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
  }
}
__publicField(Chart, "defaults", defaults);
__publicField(Chart, "instances", instances);
__publicField(Chart, "overrides", overrides);
__publicField(Chart, "registry", registry);
__publicField(Chart, "version", version);
__publicField(Chart, "getChart", getChart);
function invalidatePlugins() {
  return each(Chart.instances, (chart) => chart._plugins.invalidate());
}
function clipArc(ctx, element, endAngle) {
  const { startAngle, pixelMargin, x, y, outerRadius, innerRadius } = element;
  let angleMargin = pixelMargin / outerRadius;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
  if (innerRadius > pixelMargin) {
    angleMargin = pixelMargin / innerRadius;
    ctx.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
  } else {
    ctx.arc(x, y, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
  }
  ctx.closePath();
  ctx.clip();
}
function toRadiusCorners(value) {
  return _readValueToProps(value, [
    "outerStart",
    "outerEnd",
    "innerStart",
    "innerEnd"
  ]);
}
function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
  const o = toRadiusCorners(arc.options.borderRadius);
  const halfThickness = (outerRadius - innerRadius) / 2;
  const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
  const computeOuterLimit = (val) => {
    const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
    return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
  };
  return {
    outerStart: computeOuterLimit(o.outerStart),
    outerEnd: computeOuterLimit(o.outerEnd),
    innerStart: _limitValue(o.innerStart, 0, innerLimit),
    innerEnd: _limitValue(o.innerEnd, 0, innerLimit)
  };
}
function rThetaToXY(r, theta, x, y) {
  return {
    x: x + r * Math.cos(theta),
    y: y + r * Math.sin(theta)
  };
}
function pathArc(ctx, element, offset, spacing, end, circular) {
  const { x, y, startAngle: start, pixelMargin, innerRadius: innerR } = element;
  const outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
  const innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
  let spacingOffset = 0;
  const alpha2 = end - start;
  if (spacing) {
    const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
    const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
    const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
    const adjustedAngle = avNogSpacingRadius !== 0 ? alpha2 * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha2;
    spacingOffset = (alpha2 - adjustedAngle) / 2;
  }
  const beta = Math.max(1e-3, alpha2 * outerRadius - offset / PI) / outerRadius;
  const angleOffset = (alpha2 - beta) / 2;
  const startAngle = start + angleOffset + spacingOffset;
  const endAngle = end - angleOffset - spacingOffset;
  const { outerStart, outerEnd, innerStart, innerEnd } = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
  const outerStartAdjustedRadius = outerRadius - outerStart;
  const outerEndAdjustedRadius = outerRadius - outerEnd;
  const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
  const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
  const innerStartAdjustedRadius = innerRadius + innerStart;
  const innerEndAdjustedRadius = innerRadius + innerEnd;
  const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
  const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
  ctx.beginPath();
  if (circular) {
    const outerMidAdjustedAngle = (outerStartAdjustedAngle + outerEndAdjustedAngle) / 2;
    ctx.arc(x, y, outerRadius, outerStartAdjustedAngle, outerMidAdjustedAngle);
    ctx.arc(x, y, outerRadius, outerMidAdjustedAngle, outerEndAdjustedAngle);
    if (outerEnd > 0) {
      const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
      ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
    }
    const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
    ctx.lineTo(p4.x, p4.y);
    if (innerEnd > 0) {
      const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
      ctx.arc(pCenter.x, pCenter.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
    }
    const innerMidAdjustedAngle = (endAngle - innerEnd / innerRadius + (startAngle + innerStart / innerRadius)) / 2;
    ctx.arc(x, y, innerRadius, endAngle - innerEnd / innerRadius, innerMidAdjustedAngle, true);
    ctx.arc(x, y, innerRadius, innerMidAdjustedAngle, startAngle + innerStart / innerRadius, true);
    if (innerStart > 0) {
      const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
      ctx.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
    }
    const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
    ctx.lineTo(p8.x, p8.y);
    if (outerStart > 0) {
      const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
      ctx.arc(pCenter.x, pCenter.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
    }
  } else {
    ctx.moveTo(x, y);
    const outerStartX = Math.cos(outerStartAdjustedAngle) * outerRadius + x;
    const outerStartY = Math.sin(outerStartAdjustedAngle) * outerRadius + y;
    ctx.lineTo(outerStartX, outerStartY);
    const outerEndX = Math.cos(outerEndAdjustedAngle) * outerRadius + x;
    const outerEndY = Math.sin(outerEndAdjustedAngle) * outerRadius + y;
    ctx.lineTo(outerEndX, outerEndY);
  }
  ctx.closePath();
}
function drawArc(ctx, element, offset, spacing, circular) {
  const { fullCircles, startAngle, circumference } = element;
  let endAngle = element.endAngle;
  if (fullCircles) {
    pathArc(ctx, element, offset, spacing, endAngle, circular);
    for (let i = 0; i < fullCircles; ++i) {
      ctx.fill();
    }
    if (!isNaN(circumference)) {
      endAngle = startAngle + (circumference % TAU || TAU);
    }
  }
  pathArc(ctx, element, offset, spacing, endAngle, circular);
  ctx.fill();
  return endAngle;
}
function drawBorder(ctx, element, offset, spacing, circular) {
  const { fullCircles, startAngle, circumference, options } = element;
  const { borderWidth, borderJoinStyle, borderDash, borderDashOffset } = options;
  const inner = options.borderAlign === "inner";
  if (!borderWidth) {
    return;
  }
  ctx.setLineDash(borderDash || []);
  ctx.lineDashOffset = borderDashOffset;
  if (inner) {
    ctx.lineWidth = borderWidth * 2;
    ctx.lineJoin = borderJoinStyle || "round";
  } else {
    ctx.lineWidth = borderWidth;
    ctx.lineJoin = borderJoinStyle || "bevel";
  }
  let endAngle = element.endAngle;
  if (fullCircles) {
    pathArc(ctx, element, offset, spacing, endAngle, circular);
    for (let i = 0; i < fullCircles; ++i) {
      ctx.stroke();
    }
    if (!isNaN(circumference)) {
      endAngle = startAngle + (circumference % TAU || TAU);
    }
  }
  if (inner) {
    clipArc(ctx, element, endAngle);
  }
  if (!fullCircles) {
    pathArc(ctx, element, offset, spacing, endAngle, circular);
    ctx.stroke();
  }
}
class ArcElement extends Element {
  constructor(cfg) {
    super();
    __publicField(this, "circumference");
    __publicField(this, "endAngle");
    __publicField(this, "fullCircles");
    __publicField(this, "innerRadius");
    __publicField(this, "outerRadius");
    __publicField(this, "pixelMargin");
    __publicField(this, "startAngle");
    this.options = void 0;
    this.circumference = void 0;
    this.startAngle = void 0;
    this.endAngle = void 0;
    this.innerRadius = void 0;
    this.outerRadius = void 0;
    this.pixelMargin = 0;
    this.fullCircles = 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  inRange(chartX, chartY, useFinalPosition) {
    const point = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    const { angle, distance } = getAngleFromPoint(point, {
      x: chartX,
      y: chartY
    });
    const { startAngle, endAngle, innerRadius, outerRadius, circumference } = this.getProps([
      "startAngle",
      "endAngle",
      "innerRadius",
      "outerRadius",
      "circumference"
    ], useFinalPosition);
    const rAdjust = (this.options.spacing + this.options.borderWidth) / 2;
    const _circumference = valueOrDefault(circumference, endAngle - startAngle);
    const betweenAngles = _circumference >= TAU || _angleBetween(angle, startAngle, endAngle);
    const withinRadius = _isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
    return betweenAngles && withinRadius;
  }
  getCenterPoint(useFinalPosition) {
    const { x, y, startAngle, endAngle, innerRadius, outerRadius } = this.getProps([
      "x",
      "y",
      "startAngle",
      "endAngle",
      "innerRadius",
      "outerRadius"
    ], useFinalPosition);
    const { offset, spacing } = this.options;
    const halfAngle = (startAngle + endAngle) / 2;
    const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
    return {
      x: x + Math.cos(halfAngle) * halfRadius,
      y: y + Math.sin(halfAngle) * halfRadius
    };
  }
  tooltipPosition(useFinalPosition) {
    return this.getCenterPoint(useFinalPosition);
  }
  draw(ctx) {
    const { options, circumference } = this;
    const offset = (options.offset || 0) / 4;
    const spacing = (options.spacing || 0) / 2;
    const circular = options.circular;
    this.pixelMargin = options.borderAlign === "inner" ? 0.33 : 0;
    this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
    if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
      return;
    }
    ctx.save();
    const halfAngle = (this.startAngle + this.endAngle) / 2;
    ctx.translate(Math.cos(halfAngle) * offset, Math.sin(halfAngle) * offset);
    const fix = 1 - Math.sin(Math.min(PI, circumference || 0));
    const radiusOffset = offset * fix;
    ctx.fillStyle = options.backgroundColor;
    ctx.strokeStyle = options.borderColor;
    drawArc(ctx, this, radiusOffset, spacing, circular);
    drawBorder(ctx, this, radiusOffset, spacing, circular);
    ctx.restore();
  }
}
__publicField(ArcElement, "id", "arc");
__publicField(ArcElement, "defaults", {
  borderAlign: "center",
  borderColor: "#fff",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: void 0,
  borderRadius: 0,
  borderWidth: 2,
  offset: 0,
  spacing: 0,
  angle: void 0,
  circular: true
});
__publicField(ArcElement, "defaultRoutes", {
  backgroundColor: "backgroundColor"
});
__publicField(ArcElement, "descriptors", {
  _scriptable: true,
  _indexable: (name) => name !== "borderDash"
});
function setStyle(ctx, options, style = options) {
  ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
  ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
  ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
  ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
  ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
  ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
}
function lineTo(ctx, previous, target) {
  ctx.lineTo(target.x, target.y);
}
function getLineMethod(options) {
  if (options.stepped) {
    return _steppedLineTo;
  }
  if (options.tension || options.cubicInterpolationMode === "monotone") {
    return _bezierCurveTo;
  }
  return lineTo;
}
function pathVars(points, segment, params = {}) {
  const count = points.length;
  const { start: paramsStart = 0, end: paramsEnd = count - 1 } = params;
  const { start: segmentStart, end: segmentEnd } = segment;
  const start = Math.max(paramsStart, segmentStart);
  const end = Math.min(paramsEnd, segmentEnd);
  const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
  return {
    count,
    start,
    loop: segment.loop,
    ilen: end < start && !outside ? count + end - start : end - start
  };
}
function pathSegment(ctx, line, segment, params) {
  const { points, options } = line;
  const { count, start, loop, ilen } = pathVars(points, segment, params);
  const lineMethod = getLineMethod(options);
  let { move = true, reverse } = params || {};
  let i, point, prev;
  for (i = 0; i <= ilen; ++i) {
    point = points[(start + (reverse ? ilen - i : i)) % count];
    if (point.skip) {
      continue;
    } else if (move) {
      ctx.moveTo(point.x, point.y);
      move = false;
    } else {
      lineMethod(ctx, prev, point, reverse, options.stepped);
    }
    prev = point;
  }
  if (loop) {
    point = points[(start + (reverse ? ilen : 0)) % count];
    lineMethod(ctx, prev, point, reverse, options.stepped);
  }
  return !!loop;
}
function fastPathSegment(ctx, line, segment, params) {
  const points = line.points;
  const { count, start, ilen } = pathVars(points, segment, params);
  const { move = true, reverse } = params || {};
  let avgX = 0;
  let countX = 0;
  let i, point, prevX, minY, maxY, lastY;
  const pointIndex = (index2) => (start + (reverse ? ilen - index2 : index2)) % count;
  const drawX = () => {
    if (minY !== maxY) {
      ctx.lineTo(avgX, maxY);
      ctx.lineTo(avgX, minY);
      ctx.lineTo(avgX, lastY);
    }
  };
  if (move) {
    point = points[pointIndex(0)];
    ctx.moveTo(point.x, point.y);
  }
  for (i = 0; i <= ilen; ++i) {
    point = points[pointIndex(i)];
    if (point.skip) {
      continue;
    }
    const x = point.x;
    const y = point.y;
    const truncX = x | 0;
    if (truncX === prevX) {
      if (y < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
      avgX = (countX * avgX + x) / ++countX;
    } else {
      drawX();
      ctx.lineTo(x, y);
      prevX = truncX;
      countX = 0;
      minY = maxY = y;
    }
    lastY = y;
  }
  drawX();
}
function _getSegmentMethod(line) {
  const opts = line.options;
  const borderDash = opts.borderDash && opts.borderDash.length;
  const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== "monotone" && !opts.stepped && !borderDash;
  return useFastPath ? fastPathSegment : pathSegment;
}
function _getInterpolationMethod(options) {
  if (options.stepped) {
    return _steppedInterpolation;
  }
  if (options.tension || options.cubicInterpolationMode === "monotone") {
    return _bezierInterpolation;
  }
  return _pointInLine;
}
function strokePathWithCache(ctx, line, start, count) {
  let path = line._path;
  if (!path) {
    path = line._path = new Path2D();
    if (line.path(path, start, count)) {
      path.closePath();
    }
  }
  setStyle(ctx, line.options);
  ctx.stroke(path);
}
function strokePathDirect(ctx, line, start, count) {
  const { segments, options } = line;
  const segmentMethod = _getSegmentMethod(line);
  for (const segment of segments) {
    setStyle(ctx, options, segment.style);
    ctx.beginPath();
    if (segmentMethod(ctx, line, segment, {
      start,
      end: start + count - 1
    })) {
      ctx.closePath();
    }
    ctx.stroke();
  }
}
const usePath2D = typeof Path2D === "function";
function draw(ctx, line, start, count) {
  if (usePath2D && !line.options.segment) {
    strokePathWithCache(ctx, line, start, count);
  } else {
    strokePathDirect(ctx, line, start, count);
  }
}
class LineElement extends Element {
  constructor(cfg) {
    super();
    this.animated = true;
    this.options = void 0;
    this._chart = void 0;
    this._loop = void 0;
    this._fullLoop = void 0;
    this._path = void 0;
    this._points = void 0;
    this._segments = void 0;
    this._decimated = false;
    this._pointsUpdated = false;
    this._datasetIndex = void 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  updateControlPoints(chartArea, indexAxis) {
    const options = this.options;
    if ((options.tension || options.cubicInterpolationMode === "monotone") && !options.stepped && !this._pointsUpdated) {
      const loop = options.spanGaps ? this._loop : this._fullLoop;
      _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
      this._pointsUpdated = true;
    }
  }
  set points(points) {
    this._points = points;
    delete this._segments;
    delete this._path;
    this._pointsUpdated = false;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = _computeSegments(this, this.options.segment));
  }
  first() {
    const segments = this.segments;
    const points = this.points;
    return segments.length && points[segments[0].start];
  }
  last() {
    const segments = this.segments;
    const points = this.points;
    const count = segments.length;
    return count && points[segments[count - 1].end];
  }
  interpolate(point, property) {
    const options = this.options;
    const value = point[property];
    const points = this.points;
    const segments = _boundSegments(this, {
      property,
      start: value,
      end: value
    });
    if (!segments.length) {
      return;
    }
    const result = [];
    const _interpolate = _getInterpolationMethod(options);
    let i, ilen;
    for (i = 0, ilen = segments.length; i < ilen; ++i) {
      const { start, end } = segments[i];
      const p1 = points[start];
      const p2 = points[end];
      if (p1 === p2) {
        result.push(p1);
        continue;
      }
      const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
      const interpolated = _interpolate(p1, p2, t, options.stepped);
      interpolated[property] = point[property];
      result.push(interpolated);
    }
    return result.length === 1 ? result[0] : result;
  }
  pathSegment(ctx, segment, params) {
    const segmentMethod = _getSegmentMethod(this);
    return segmentMethod(ctx, this, segment, params);
  }
  path(ctx, start, count) {
    const segments = this.segments;
    const segmentMethod = _getSegmentMethod(this);
    let loop = this._loop;
    start = start || 0;
    count = count || this.points.length - start;
    for (const segment of segments) {
      loop &= segmentMethod(ctx, this, segment, {
        start,
        end: start + count - 1
      });
    }
    return !!loop;
  }
  draw(ctx, chartArea, start, count) {
    const options = this.options || {};
    const points = this.points || [];
    if (points.length && options.borderWidth) {
      ctx.save();
      draw(ctx, this, start, count);
      ctx.restore();
    }
    if (this.animated) {
      this._pointsUpdated = false;
      this._path = void 0;
    }
  }
}
__publicField(LineElement, "id", "line");
__publicField(LineElement, "defaults", {
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderWidth: 3,
  capBezierPoints: true,
  cubicInterpolationMode: "default",
  fill: false,
  spanGaps: false,
  stepped: false,
  tension: 0
});
__publicField(LineElement, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
__publicField(LineElement, "descriptors", {
  _scriptable: true,
  _indexable: (name) => name !== "borderDash" && name !== "fill"
});
function inRange$1(el, pos, axis, useFinalPosition) {
  const options = el.options;
  const { [axis]: value } = el.getProps([
    axis
  ], useFinalPosition);
  return Math.abs(pos - value) < options.radius + options.hitRadius;
}
class PointElement extends Element {
  constructor(cfg) {
    super();
    __publicField(this, "parsed");
    __publicField(this, "skip");
    __publicField(this, "stop");
    this.options = void 0;
    this.parsed = void 0;
    this.skip = void 0;
    this.stop = void 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  inRange(mouseX, mouseY, useFinalPosition) {
    const options = this.options;
    const { x, y } = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
  }
  inXRange(mouseX, useFinalPosition) {
    return inRange$1(this, mouseX, "x", useFinalPosition);
  }
  inYRange(mouseY, useFinalPosition) {
    return inRange$1(this, mouseY, "y", useFinalPosition);
  }
  getCenterPoint(useFinalPosition) {
    const { x, y } = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    return {
      x,
      y
    };
  }
  size(options) {
    options = options || this.options || {};
    let radius = options.radius || 0;
    radius = Math.max(radius, radius && options.hoverRadius || 0);
    const borderWidth = radius && options.borderWidth || 0;
    return (radius + borderWidth) * 2;
  }
  draw(ctx, area) {
    const options = this.options;
    if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
      return;
    }
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.fillStyle = options.backgroundColor;
    drawPoint(ctx, options, this.x, this.y);
  }
  getRange() {
    const options = this.options || {};
    return options.radius + options.hitRadius;
  }
}
__publicField(PointElement, "id", "point");
/**
* @type {any}
*/
__publicField(PointElement, "defaults", {
  borderWidth: 1,
  hitRadius: 1,
  hoverBorderWidth: 1,
  hoverRadius: 4,
  pointStyle: "circle",
  radius: 3,
  rotation: 0
});
/**
* @type {any}
*/
__publicField(PointElement, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
function getBarBounds(bar, useFinalPosition) {
  const { x, y, base, width, height } = bar.getProps([
    "x",
    "y",
    "base",
    "width",
    "height"
  ], useFinalPosition);
  let left, right, top, bottom, half;
  if (bar.horizontal) {
    half = height / 2;
    left = Math.min(x, base);
    right = Math.max(x, base);
    top = y - half;
    bottom = y + half;
  } else {
    half = width / 2;
    left = x - half;
    right = x + half;
    top = Math.min(y, base);
    bottom = Math.max(y, base);
  }
  return {
    left,
    top,
    right,
    bottom
  };
}
function skipOrLimit(skip2, value, min, max) {
  return skip2 ? 0 : _limitValue(value, min, max);
}
function parseBorderWidth(bar, maxW, maxH) {
  const value = bar.options.borderWidth;
  const skip2 = bar.borderSkipped;
  const o = toTRBL(value);
  return {
    t: skipOrLimit(skip2.top, o.top, 0, maxH),
    r: skipOrLimit(skip2.right, o.right, 0, maxW),
    b: skipOrLimit(skip2.bottom, o.bottom, 0, maxH),
    l: skipOrLimit(skip2.left, o.left, 0, maxW)
  };
}
function parseBorderRadius(bar, maxW, maxH) {
  const { enableBorderRadius } = bar.getProps([
    "enableBorderRadius"
  ]);
  const value = bar.options.borderRadius;
  const o = toTRBLCorners(value);
  const maxR = Math.min(maxW, maxH);
  const skip2 = bar.borderSkipped;
  const enableBorder = enableBorderRadius || isObject(value);
  return {
    topLeft: skipOrLimit(!enableBorder || skip2.top || skip2.left, o.topLeft, 0, maxR),
    topRight: skipOrLimit(!enableBorder || skip2.top || skip2.right, o.topRight, 0, maxR),
    bottomLeft: skipOrLimit(!enableBorder || skip2.bottom || skip2.left, o.bottomLeft, 0, maxR),
    bottomRight: skipOrLimit(!enableBorder || skip2.bottom || skip2.right, o.bottomRight, 0, maxR)
  };
}
function boundingRects(bar) {
  const bounds = getBarBounds(bar);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const border = parseBorderWidth(bar, width / 2, height / 2);
  const radius = parseBorderRadius(bar, width / 2, height / 2);
  return {
    outer: {
      x: bounds.left,
      y: bounds.top,
      w: width,
      h: height,
      radius
    },
    inner: {
      x: bounds.left + border.l,
      y: bounds.top + border.t,
      w: width - border.l - border.r,
      h: height - border.t - border.b,
      radius: {
        topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
        topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
        bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
        bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r))
      }
    }
  };
}
function inRange(bar, x, y, useFinalPosition) {
  const skipX = x === null;
  const skipY = y === null;
  const skipBoth = skipX && skipY;
  const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
  return bounds && (skipX || _isBetween(x, bounds.left, bounds.right)) && (skipY || _isBetween(y, bounds.top, bounds.bottom));
}
function hasRadius(radius) {
  return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
}
function addNormalRectPath(ctx, rect) {
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
}
function inflateRect(rect, amount, refRect = {}) {
  const x = rect.x !== refRect.x ? -amount : 0;
  const y = rect.y !== refRect.y ? -amount : 0;
  const w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x;
  const h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
  return {
    x: rect.x + x,
    y: rect.y + y,
    w: rect.w + w,
    h: rect.h + h,
    radius: rect.radius
  };
}
class BarElement extends Element {
  constructor(cfg) {
    super();
    this.options = void 0;
    this.horizontal = void 0;
    this.base = void 0;
    this.width = void 0;
    this.height = void 0;
    this.inflateAmount = void 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  draw(ctx) {
    const { inflateAmount, options: { borderColor, backgroundColor } } = this;
    const { inner, outer } = boundingRects(this);
    const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
    ctx.save();
    if (outer.w !== inner.w || outer.h !== inner.h) {
      ctx.beginPath();
      addRectPath(ctx, inflateRect(outer, inflateAmount, inner));
      ctx.clip();
      addRectPath(ctx, inflateRect(inner, -inflateAmount, outer));
      ctx.fillStyle = borderColor;
      ctx.fill("evenodd");
    }
    ctx.beginPath();
    addRectPath(ctx, inflateRect(inner, inflateAmount));
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.restore();
  }
  inRange(mouseX, mouseY, useFinalPosition) {
    return inRange(this, mouseX, mouseY, useFinalPosition);
  }
  inXRange(mouseX, useFinalPosition) {
    return inRange(this, mouseX, null, useFinalPosition);
  }
  inYRange(mouseY, useFinalPosition) {
    return inRange(this, null, mouseY, useFinalPosition);
  }
  getCenterPoint(useFinalPosition) {
    const { x, y, base, horizontal } = this.getProps([
      "x",
      "y",
      "base",
      "horizontal"
    ], useFinalPosition);
    return {
      x: horizontal ? (x + base) / 2 : x,
      y: horizontal ? y : (y + base) / 2
    };
  }
  getRange(axis) {
    return axis === "x" ? this.width / 2 : this.height / 2;
  }
}
__publicField(BarElement, "id", "bar");
__publicField(BarElement, "defaults", {
  borderSkipped: "start",
  borderWidth: 0,
  borderRadius: 0,
  inflateAmount: "auto",
  pointStyle: void 0
});
__publicField(BarElement, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
var elements = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ArcElement,
  BarElement,
  LineElement,
  PointElement
});
const BORDER_COLORS = [
  "rgb(54, 162, 235)",
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)"
  // grey
];
const BACKGROUND_COLORS = /* @__PURE__ */ BORDER_COLORS.map((color2) => color2.replace("rgb(", "rgba(").replace(")", ", 0.5)"));
function getBorderColor(i) {
  return BORDER_COLORS[i % BORDER_COLORS.length];
}
function getBackgroundColor(i) {
  return BACKGROUND_COLORS[i % BACKGROUND_COLORS.length];
}
function colorizeDefaultDataset(dataset, i) {
  dataset.borderColor = getBorderColor(i);
  dataset.backgroundColor = getBackgroundColor(i);
  return ++i;
}
function colorizeDoughnutDataset(dataset, i) {
  dataset.backgroundColor = dataset.data.map(() => getBorderColor(i++));
  return i;
}
function colorizePolarAreaDataset(dataset, i) {
  dataset.backgroundColor = dataset.data.map(() => getBackgroundColor(i++));
  return i;
}
function getColorizer(chart) {
  let i = 0;
  return (dataset, datasetIndex) => {
    const controller = chart.getDatasetMeta(datasetIndex).controller;
    if (controller instanceof DoughnutController) {
      i = colorizeDoughnutDataset(dataset, i);
    } else if (controller instanceof PolarAreaController) {
      i = colorizePolarAreaDataset(dataset, i);
    } else if (controller) {
      i = colorizeDefaultDataset(dataset, i);
    }
  };
}
function containsColorsDefinitions(descriptors2) {
  let k;
  for (k in descriptors2) {
    if (descriptors2[k].borderColor || descriptors2[k].backgroundColor) {
      return true;
    }
  }
  return false;
}
function containsColorsDefinition(descriptor) {
  return descriptor && (descriptor.borderColor || descriptor.backgroundColor);
}
var plugin_colors = {
  id: "colors",
  defaults: {
    enabled: true,
    forceOverride: false
  },
  beforeLayout(chart, _args, options) {
    if (!options.enabled) {
      return;
    }
    const { data: { datasets }, options: chartOptions } = chart.config;
    const { elements: elements2 } = chartOptions;
    if (!options.forceOverride && (containsColorsDefinitions(datasets) || containsColorsDefinition(chartOptions) || elements2 && containsColorsDefinitions(elements2))) {
      return;
    }
    const colorizer = getColorizer(chart);
    datasets.forEach(colorizer);
  }
};
function lttbDecimation(data, start, count, availableWidth, options) {
  const samples = options.samples || availableWidth;
  if (samples >= count) {
    return data.slice(start, start + count);
  }
  const decimated = [];
  const bucketWidth = (count - 2) / (samples - 2);
  let sampledIndex = 0;
  const endIndex = start + count - 1;
  let a = start;
  let i, maxAreaPoint, maxArea, area, nextA;
  decimated[sampledIndex++] = data[a];
  for (i = 0; i < samples - 2; i++) {
    let avgX = 0;
    let avgY = 0;
    let j;
    const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start;
    const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start;
    const avgRangeLength = avgRangeEnd - avgRangeStart;
    for (j = avgRangeStart; j < avgRangeEnd; j++) {
      avgX += data[j].x;
      avgY += data[j].y;
    }
    avgX /= avgRangeLength;
    avgY /= avgRangeLength;
    const rangeOffs = Math.floor(i * bucketWidth) + 1 + start;
    const rangeTo = Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start;
    const { x: pointAx, y: pointAy } = data[a];
    maxArea = area = -1;
    for (j = rangeOffs; j < rangeTo; j++) {
      area = 0.5 * Math.abs((pointAx - avgX) * (data[j].y - pointAy) - (pointAx - data[j].x) * (avgY - pointAy));
      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = data[j];
        nextA = j;
      }
    }
    decimated[sampledIndex++] = maxAreaPoint;
    a = nextA;
  }
  decimated[sampledIndex++] = data[endIndex];
  return decimated;
}
function minMaxDecimation(data, start, count, availableWidth) {
  let avgX = 0;
  let countX = 0;
  let i, point, x, y, prevX, minIndex, maxIndex, startIndex, minY, maxY;
  const decimated = [];
  const endIndex = start + count - 1;
  const xMin = data[start].x;
  const xMax = data[endIndex].x;
  const dx = xMax - xMin;
  for (i = start; i < start + count; ++i) {
    point = data[i];
    x = (point.x - xMin) / dx * availableWidth;
    y = point.y;
    const truncX = x | 0;
    if (truncX === prevX) {
      if (y < minY) {
        minY = y;
        minIndex = i;
      } else if (y > maxY) {
        maxY = y;
        maxIndex = i;
      }
      avgX = (countX * avgX + point.x) / ++countX;
    } else {
      const lastIndex = i - 1;
      if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
        const intermediateIndex1 = Math.min(minIndex, maxIndex);
        const intermediateIndex2 = Math.max(minIndex, maxIndex);
        if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
          decimated.push({
            ...data[intermediateIndex1],
            x: avgX
          });
        }
        if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
          decimated.push({
            ...data[intermediateIndex2],
            x: avgX
          });
        }
      }
      if (i > 0 && lastIndex !== startIndex) {
        decimated.push(data[lastIndex]);
      }
      decimated.push(point);
      prevX = truncX;
      countX = 0;
      minY = maxY = y;
      minIndex = maxIndex = startIndex = i;
    }
  }
  return decimated;
}
function cleanDecimatedDataset(dataset) {
  if (dataset._decimated) {
    const data = dataset._data;
    delete dataset._decimated;
    delete dataset._data;
    Object.defineProperty(dataset, "data", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: data
    });
  }
}
function cleanDecimatedData(chart) {
  chart.data.datasets.forEach((dataset) => {
    cleanDecimatedDataset(dataset);
  });
}
function getStartAndCountOfVisiblePointsSimplified(meta, points) {
  const pointCount = points.length;
  let start = 0;
  let count;
  const { iScale } = meta;
  const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
  if (minDefined) {
    start = _limitValue(_lookupByKey(points, iScale.axis, min).lo, 0, pointCount - 1);
  }
  if (maxDefined) {
    count = _limitValue(_lookupByKey(points, iScale.axis, max).hi + 1, start, pointCount) - start;
  } else {
    count = pointCount - start;
  }
  return {
    start,
    count
  };
}
var plugin_decimation = {
  id: "decimation",
  defaults: {
    algorithm: "min-max",
    enabled: false
  },
  beforeElementsUpdate: (chart, args, options) => {
    if (!options.enabled) {
      cleanDecimatedData(chart);
      return;
    }
    const availableWidth = chart.width;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const { _data, indexAxis } = dataset;
      const meta = chart.getDatasetMeta(datasetIndex);
      const data = _data || dataset.data;
      if (resolve([
        indexAxis,
        chart.options.indexAxis
      ]) === "y") {
        return;
      }
      if (!meta.controller.supportsDecimation) {
        return;
      }
      const xAxis = chart.scales[meta.xAxisID];
      if (xAxis.type !== "linear" && xAxis.type !== "time") {
        return;
      }
      if (chart.options.parsing) {
        return;
      }
      let { start, count } = getStartAndCountOfVisiblePointsSimplified(meta, data);
      const threshold = options.threshold || 4 * availableWidth;
      if (count <= threshold) {
        cleanDecimatedDataset(dataset);
        return;
      }
      if (isNullOrUndef(_data)) {
        dataset._data = data;
        delete dataset.data;
        Object.defineProperty(dataset, "data", {
          configurable: true,
          enumerable: true,
          get: function() {
            return this._decimated;
          },
          set: function(d) {
            this._data = d;
          }
        });
      }
      let decimated;
      switch (options.algorithm) {
        case "lttb":
          decimated = lttbDecimation(data, start, count, availableWidth, options);
          break;
        case "min-max":
          decimated = minMaxDecimation(data, start, count, availableWidth);
          break;
        default:
          throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
      }
      dataset._decimated = decimated;
    });
  },
  destroy(chart) {
    cleanDecimatedData(chart);
  }
};
function _segments(line, target, property) {
  const segments = line.segments;
  const points = line.points;
  const tpoints = target.points;
  const parts = [];
  for (const segment of segments) {
    let { start, end } = segment;
    end = _findSegmentEnd(start, end, points);
    const bounds = _getBounds(property, points[start], points[end], segment.loop);
    if (!target.segments) {
      parts.push({
        source: segment,
        target: bounds,
        start: points[start],
        end: points[end]
      });
      continue;
    }
    const targetSegments = _boundSegments(target, bounds);
    for (const tgt of targetSegments) {
      const subBounds = _getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
      const fillSources = _boundSegment(segment, points, subBounds);
      for (const fillSource of fillSources) {
        parts.push({
          source: fillSource,
          target: tgt,
          start: {
            [property]: _getEdge(bounds, subBounds, "start", Math.max)
          },
          end: {
            [property]: _getEdge(bounds, subBounds, "end", Math.min)
          }
        });
      }
    }
  }
  return parts;
}
function _getBounds(property, first, last, loop) {
  if (loop) {
    return;
  }
  let start = first[property];
  let end = last[property];
  if (property === "angle") {
    start = _normalizeAngle(start);
    end = _normalizeAngle(end);
  }
  return {
    property,
    start,
    end
  };
}
function _pointsFromSegments(boundary, line) {
  const { x = null, y = null } = boundary || {};
  const linePoints = line.points;
  const points = [];
  line.segments.forEach(({ start, end }) => {
    end = _findSegmentEnd(start, end, linePoints);
    const first = linePoints[start];
    const last = linePoints[end];
    if (y !== null) {
      points.push({
        x: first.x,
        y
      });
      points.push({
        x: last.x,
        y
      });
    } else if (x !== null) {
      points.push({
        x,
        y: first.y
      });
      points.push({
        x,
        y: last.y
      });
    }
  });
  return points;
}
function _findSegmentEnd(start, end, points) {
  for (; end > start; end--) {
    const point = points[end];
    if (!isNaN(point.x) && !isNaN(point.y)) {
      break;
    }
  }
  return end;
}
function _getEdge(a, b, prop, fn) {
  if (a && b) {
    return fn(a[prop], b[prop]);
  }
  return a ? a[prop] : b ? b[prop] : 0;
}
function _createBoundaryLine(boundary, line) {
  let points = [];
  let _loop = false;
  if (isArray(boundary)) {
    _loop = true;
    points = boundary;
  } else {
    points = _pointsFromSegments(boundary, line);
  }
  return points.length ? new LineElement({
    points,
    options: {
      tension: 0
    },
    _loop,
    _fullLoop: _loop
  }) : null;
}
function _shouldApplyFill(source) {
  return source && source.fill !== false;
}
function _resolveTarget(sources, index2, propagate) {
  const source = sources[index2];
  let fill2 = source.fill;
  const visited = [
    index2
  ];
  let target;
  if (!propagate) {
    return fill2;
  }
  while (fill2 !== false && visited.indexOf(fill2) === -1) {
    if (!isNumberFinite(fill2)) {
      return fill2;
    }
    target = sources[fill2];
    if (!target) {
      return false;
    }
    if (target.visible) {
      return fill2;
    }
    visited.push(fill2);
    fill2 = target.fill;
  }
  return false;
}
function _decodeFill(line, index2, count) {
  const fill2 = parseFillOption(line);
  if (isObject(fill2)) {
    return isNaN(fill2.value) ? false : fill2;
  }
  let target = parseFloat(fill2);
  if (isNumberFinite(target) && Math.floor(target) === target) {
    return decodeTargetIndex(fill2[0], index2, target, count);
  }
  return [
    "origin",
    "start",
    "end",
    "stack",
    "shape"
  ].indexOf(fill2) >= 0 && fill2;
}
function decodeTargetIndex(firstCh, index2, target, count) {
  if (firstCh === "-" || firstCh === "+") {
    target = index2 + target;
  }
  if (target === index2 || target < 0 || target >= count) {
    return false;
  }
  return target;
}
function _getTargetPixel(fill2, scale) {
  let pixel = null;
  if (fill2 === "start") {
    pixel = scale.bottom;
  } else if (fill2 === "end") {
    pixel = scale.top;
  } else if (isObject(fill2)) {
    pixel = scale.getPixelForValue(fill2.value);
  } else if (scale.getBasePixel) {
    pixel = scale.getBasePixel();
  }
  return pixel;
}
function _getTargetValue(fill2, scale, startValue) {
  let value;
  if (fill2 === "start") {
    value = startValue;
  } else if (fill2 === "end") {
    value = scale.options.reverse ? scale.min : scale.max;
  } else if (isObject(fill2)) {
    value = fill2.value;
  } else {
    value = scale.getBaseValue();
  }
  return value;
}
function parseFillOption(line) {
  const options = line.options;
  const fillOption = options.fill;
  let fill2 = valueOrDefault(fillOption && fillOption.target, fillOption);
  if (fill2 === void 0) {
    fill2 = !!options.backgroundColor;
  }
  if (fill2 === false || fill2 === null) {
    return false;
  }
  if (fill2 === true) {
    return "origin";
  }
  return fill2;
}
function _buildStackLine(source) {
  const { scale, index: index2, line } = source;
  const points = [];
  const segments = line.segments;
  const sourcePoints = line.points;
  const linesBelow = getLinesBelow(scale, index2);
  linesBelow.push(_createBoundaryLine({
    x: null,
    y: scale.bottom
  }, line));
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    for (let j = segment.start; j <= segment.end; j++) {
      addPointsBelow(points, sourcePoints[j], linesBelow);
    }
  }
  return new LineElement({
    points,
    options: {}
  });
}
function getLinesBelow(scale, index2) {
  const below = [];
  const metas = scale.getMatchingVisibleMetas("line");
  for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    if (meta.index === index2) {
      break;
    }
    if (!meta.hidden) {
      below.unshift(meta.dataset);
    }
  }
  return below;
}
function addPointsBelow(points, sourcePoint, linesBelow) {
  const postponed = [];
  for (let j = 0; j < linesBelow.length; j++) {
    const line = linesBelow[j];
    const { first, last, point } = findPoint(line, sourcePoint, "x");
    if (!point || first && last) {
      continue;
    }
    if (first) {
      postponed.unshift(point);
    } else {
      points.push(point);
      if (!last) {
        break;
      }
    }
  }
  points.push(...postponed);
}
function findPoint(line, sourcePoint, property) {
  const point = line.interpolate(sourcePoint, property);
  if (!point) {
    return {};
  }
  const pointValue = point[property];
  const segments = line.segments;
  const linePoints = line.points;
  let first = false;
  let last = false;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const firstValue = linePoints[segment.start][property];
    const lastValue = linePoints[segment.end][property];
    if (_isBetween(pointValue, firstValue, lastValue)) {
      first = pointValue === firstValue;
      last = pointValue === lastValue;
      break;
    }
  }
  return {
    first,
    last,
    point
  };
}
class simpleArc {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.radius = opts.radius;
  }
  pathSegment(ctx, bounds, opts) {
    const { x, y, radius } = this;
    bounds = bounds || {
      start: 0,
      end: TAU
    };
    ctx.arc(x, y, radius, bounds.end, bounds.start, true);
    return !opts.bounds;
  }
  interpolate(point) {
    const { x, y, radius } = this;
    const angle = point.angle;
    return {
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
      angle
    };
  }
}
function _getTarget(source) {
  const { chart, fill: fill2, line } = source;
  if (isNumberFinite(fill2)) {
    return getLineByIndex(chart, fill2);
  }
  if (fill2 === "stack") {
    return _buildStackLine(source);
  }
  if (fill2 === "shape") {
    return true;
  }
  const boundary = computeBoundary(source);
  if (boundary instanceof simpleArc) {
    return boundary;
  }
  return _createBoundaryLine(boundary, line);
}
function getLineByIndex(chart, index2) {
  const meta = chart.getDatasetMeta(index2);
  const visible = meta && chart.isDatasetVisible(index2);
  return visible ? meta.dataset : null;
}
function computeBoundary(source) {
  const scale = source.scale || {};
  if (scale.getPointPositionForValue) {
    return computeCircularBoundary(source);
  }
  return computeLinearBoundary(source);
}
function computeLinearBoundary(source) {
  const { scale = {}, fill: fill2 } = source;
  const pixel = _getTargetPixel(fill2, scale);
  if (isNumberFinite(pixel)) {
    const horizontal = scale.isHorizontal();
    return {
      x: horizontal ? pixel : null,
      y: horizontal ? null : pixel
    };
  }
  return null;
}
function computeCircularBoundary(source) {
  const { scale, fill: fill2 } = source;
  const options = scale.options;
  const length = scale.getLabels().length;
  const start = options.reverse ? scale.max : scale.min;
  const value = _getTargetValue(fill2, scale, start);
  const target = [];
  if (options.grid.circular) {
    const center = scale.getPointPositionForValue(0, start);
    return new simpleArc({
      x: center.x,
      y: center.y,
      radius: scale.getDistanceFromCenterForValue(value)
    });
  }
  for (let i = 0; i < length; ++i) {
    target.push(scale.getPointPositionForValue(i, value));
  }
  return target;
}
function _drawfill(ctx, source, area) {
  const target = _getTarget(source);
  const { line, scale, axis } = source;
  const lineOpts = line.options;
  const fillOption = lineOpts.fill;
  const color2 = lineOpts.backgroundColor;
  const { above = color2, below = color2 } = fillOption || {};
  if (target && line.points.length) {
    clipArea(ctx, area);
    doFill(ctx, {
      line,
      target,
      above,
      below,
      area,
      scale,
      axis
    });
    unclipArea(ctx);
  }
}
function doFill(ctx, cfg) {
  const { line, target, above, below, area, scale } = cfg;
  const property = line._loop ? "angle" : cfg.axis;
  ctx.save();
  if (property === "x" && below !== above) {
    clipVertical(ctx, target, area.top);
    fill(ctx, {
      line,
      target,
      color: above,
      scale,
      property
    });
    ctx.restore();
    ctx.save();
    clipVertical(ctx, target, area.bottom);
  }
  fill(ctx, {
    line,
    target,
    color: below,
    scale,
    property
  });
  ctx.restore();
}
function clipVertical(ctx, target, clipY) {
  const { segments, points } = target;
  let first = true;
  let lineLoop = false;
  ctx.beginPath();
  for (const segment of segments) {
    const { start, end } = segment;
    const firstPoint = points[start];
    const lastPoint = points[_findSegmentEnd(start, end, points)];
    if (first) {
      ctx.moveTo(firstPoint.x, firstPoint.y);
      first = false;
    } else {
      ctx.lineTo(firstPoint.x, clipY);
      ctx.lineTo(firstPoint.x, firstPoint.y);
    }
    lineLoop = !!target.pathSegment(ctx, segment, {
      move: lineLoop
    });
    if (lineLoop) {
      ctx.closePath();
    } else {
      ctx.lineTo(lastPoint.x, clipY);
    }
  }
  ctx.lineTo(target.first().x, clipY);
  ctx.closePath();
  ctx.clip();
}
function fill(ctx, cfg) {
  const { line, target, property, color: color2, scale } = cfg;
  const segments = _segments(line, target, property);
  for (const { source: src, target: tgt, start, end } of segments) {
    const { style: { backgroundColor = color2 } = {} } = src;
    const notShape = target !== true;
    ctx.save();
    ctx.fillStyle = backgroundColor;
    clipBounds(ctx, scale, notShape && _getBounds(property, start, end));
    ctx.beginPath();
    const lineLoop = !!line.pathSegment(ctx, src);
    let loop;
    if (notShape) {
      if (lineLoop) {
        ctx.closePath();
      } else {
        interpolatedLineTo(ctx, target, end, property);
      }
      const targetLoop = !!target.pathSegment(ctx, tgt, {
        move: lineLoop,
        reverse: true
      });
      loop = lineLoop && targetLoop;
      if (!loop) {
        interpolatedLineTo(ctx, target, start, property);
      }
    }
    ctx.closePath();
    ctx.fill(loop ? "evenodd" : "nonzero");
    ctx.restore();
  }
}
function clipBounds(ctx, scale, bounds) {
  const { top, bottom } = scale.chart.chartArea;
  const { property, start, end } = bounds || {};
  if (property === "x") {
    ctx.beginPath();
    ctx.rect(start, top, end - start, bottom - top);
    ctx.clip();
  }
}
function interpolatedLineTo(ctx, target, point, property) {
  const interpolatedPoint = target.interpolate(point, property);
  if (interpolatedPoint) {
    ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
  }
}
var index = {
  id: "filler",
  afterDatasetsUpdate(chart, _args, options) {
    const count = (chart.data.datasets || []).length;
    const sources = [];
    let meta, i, line, source;
    for (i = 0; i < count; ++i) {
      meta = chart.getDatasetMeta(i);
      line = meta.dataset;
      source = null;
      if (line && line.options && line instanceof LineElement) {
        source = {
          visible: chart.isDatasetVisible(i),
          index: i,
          fill: _decodeFill(line, i, count),
          chart,
          axis: meta.controller.options.indexAxis,
          scale: meta.vScale,
          line
        };
      }
      meta.$filler = source;
      sources.push(source);
    }
    for (i = 0; i < count; ++i) {
      source = sources[i];
      if (!source || source.fill === false) {
        continue;
      }
      source.fill = _resolveTarget(sources, i, options.propagate);
    }
  },
  beforeDraw(chart, _args, options) {
    const draw2 = options.drawTime === "beforeDraw";
    const metasets = chart.getSortedVisibleDatasetMetas();
    const area = chart.chartArea;
    for (let i = metasets.length - 1; i >= 0; --i) {
      const source = metasets[i].$filler;
      if (!source) {
        continue;
      }
      source.line.updateControlPoints(area, source.axis);
      if (draw2 && source.fill) {
        _drawfill(chart.ctx, source, area);
      }
    }
  },
  beforeDatasetsDraw(chart, _args, options) {
    if (options.drawTime !== "beforeDatasetsDraw") {
      return;
    }
    const metasets = chart.getSortedVisibleDatasetMetas();
    for (let i = metasets.length - 1; i >= 0; --i) {
      const source = metasets[i].$filler;
      if (_shouldApplyFill(source)) {
        _drawfill(chart.ctx, source, chart.chartArea);
      }
    }
  },
  beforeDatasetDraw(chart, args, options) {
    const source = args.meta.$filler;
    if (!_shouldApplyFill(source) || options.drawTime !== "beforeDatasetDraw") {
      return;
    }
    _drawfill(chart.ctx, source, chart.chartArea);
  },
  defaults: {
    propagate: true,
    drawTime: "beforeDatasetDraw"
  }
};
const getBoxSize = (labelOpts, fontSize) => {
  let { boxHeight = fontSize, boxWidth = fontSize } = labelOpts;
  if (labelOpts.usePointStyle) {
    boxHeight = Math.min(boxHeight, fontSize);
    boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize);
  }
  return {
    boxWidth,
    boxHeight,
    itemHeight: Math.max(fontSize, boxHeight)
  };
};
const itemsEqual = (a, b) => a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
class Legend extends Element {
  constructor(config) {
    super();
    this._added = false;
    this.legendHitBoxes = [];
    this._hoveredItem = null;
    this.doughnutMode = false;
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this.legendItems = void 0;
    this.columnSizes = void 0;
    this.lineWidths = void 0;
    this.maxHeight = void 0;
    this.maxWidth = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.right = void 0;
    this.height = void 0;
    this.width = void 0;
    this._margins = void 0;
    this.position = void 0;
    this.weight = void 0;
    this.fullSize = void 0;
  }
  update(maxWidth, maxHeight, margins) {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this._margins = margins;
    this.setDimensions();
    this.buildLabels();
    this.fit();
  }
  setDimensions() {
    if (this.isHorizontal()) {
      this.width = this.maxWidth;
      this.left = this._margins.left;
      this.right = this.width;
    } else {
      this.height = this.maxHeight;
      this.top = this._margins.top;
      this.bottom = this.height;
    }
  }
  buildLabels() {
    const labelOpts = this.options.labels || {};
    let legendItems = callback(labelOpts.generateLabels, [
      this.chart
    ], this) || [];
    if (labelOpts.filter) {
      legendItems = legendItems.filter((item) => labelOpts.filter(item, this.chart.data));
    }
    if (labelOpts.sort) {
      legendItems = legendItems.sort((a, b) => labelOpts.sort(a, b, this.chart.data));
    }
    if (this.options.reverse) {
      legendItems.reverse();
    }
    this.legendItems = legendItems;
  }
  fit() {
    const { options, ctx } = this;
    if (!options.display) {
      this.width = this.height = 0;
      return;
    }
    const labelOpts = options.labels;
    const labelFont = toFont(labelOpts.font);
    const fontSize = labelFont.size;
    const titleHeight = this._computeTitleHeight();
    const { boxWidth, itemHeight } = getBoxSize(labelOpts, fontSize);
    let width, height;
    ctx.font = labelFont.string;
    if (this.isHorizontal()) {
      width = this.maxWidth;
      height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
    } else {
      height = this.maxHeight;
      width = this._fitCols(titleHeight, labelFont, boxWidth, itemHeight) + 10;
    }
    this.width = Math.min(width, options.maxWidth || this.maxWidth);
    this.height = Math.min(height, options.maxHeight || this.maxHeight);
  }
  _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
    const { ctx, maxWidth, options: { labels: { padding } } } = this;
    const hitboxes = this.legendHitBoxes = [];
    const lineWidths = this.lineWidths = [
      0
    ];
    const lineHeight = itemHeight + padding;
    let totalHeight = titleHeight;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    let row = -1;
    let top = -lineHeight;
    this.legendItems.forEach((legendItem, i) => {
      const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
      if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
        totalHeight += lineHeight;
        lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
        top += lineHeight;
        row++;
      }
      hitboxes[i] = {
        left: 0,
        top,
        row,
        width: itemWidth,
        height: itemHeight
      };
      lineWidths[lineWidths.length - 1] += itemWidth + padding;
    });
    return totalHeight;
  }
  _fitCols(titleHeight, labelFont, boxWidth, _itemHeight) {
    const { ctx, maxHeight, options: { labels: { padding } } } = this;
    const hitboxes = this.legendHitBoxes = [];
    const columnSizes = this.columnSizes = [];
    const heightLimit = maxHeight - titleHeight;
    let totalWidth = padding;
    let currentColWidth = 0;
    let currentColHeight = 0;
    let left = 0;
    let col = 0;
    this.legendItems.forEach((legendItem, i) => {
      const { itemWidth, itemHeight } = calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight);
      if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
        totalWidth += currentColWidth + padding;
        columnSizes.push({
          width: currentColWidth,
          height: currentColHeight
        });
        left += currentColWidth + padding;
        col++;
        currentColWidth = currentColHeight = 0;
      }
      hitboxes[i] = {
        left,
        top: currentColHeight,
        col,
        width: itemWidth,
        height: itemHeight
      };
      currentColWidth = Math.max(currentColWidth, itemWidth);
      currentColHeight += itemHeight + padding;
    });
    totalWidth += currentColWidth;
    columnSizes.push({
      width: currentColWidth,
      height: currentColHeight
    });
    return totalWidth;
  }
  adjustHitBoxes() {
    if (!this.options.display) {
      return;
    }
    const titleHeight = this._computeTitleHeight();
    const { legendHitBoxes: hitboxes, options: { align, labels: { padding }, rtl } } = this;
    const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
    if (this.isHorizontal()) {
      let row = 0;
      let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
      for (const hitbox of hitboxes) {
        if (row !== hitbox.row) {
          row = hitbox.row;
          left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
        }
        hitbox.top += this.top + titleHeight + padding;
        hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
        left += hitbox.width + padding;
      }
    } else {
      let col = 0;
      let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
      for (const hitbox of hitboxes) {
        if (hitbox.col !== col) {
          col = hitbox.col;
          top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
        }
        hitbox.top = top;
        hitbox.left += this.left + padding;
        hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
        top += hitbox.height + padding;
      }
    }
  }
  isHorizontal() {
    return this.options.position === "top" || this.options.position === "bottom";
  }
  draw() {
    if (this.options.display) {
      const ctx = this.ctx;
      clipArea(ctx, this);
      this._draw();
      unclipArea(ctx);
    }
  }
  _draw() {
    const { options: opts, columnSizes, lineWidths, ctx } = this;
    const { align, labels: labelOpts } = opts;
    const defaultColor = defaults.color;
    const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
    const labelFont = toFont(labelOpts.font);
    const { padding } = labelOpts;
    const fontSize = labelFont.size;
    const halfFontSize = fontSize / 2;
    let cursor;
    this.drawTitle();
    ctx.textAlign = rtlHelper.textAlign("left");
    ctx.textBaseline = "middle";
    ctx.lineWidth = 0.5;
    ctx.font = labelFont.string;
    const { boxWidth, boxHeight, itemHeight } = getBoxSize(labelOpts, fontSize);
    const drawLegendBox = function(x, y, legendItem) {
      if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
        return;
      }
      ctx.save();
      const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
      ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
      ctx.lineCap = valueOrDefault(legendItem.lineCap, "butt");
      ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
      ctx.lineJoin = valueOrDefault(legendItem.lineJoin, "miter");
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
      ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
      if (labelOpts.usePointStyle) {
        const drawOptions = {
          radius: boxHeight * Math.SQRT2 / 2,
          pointStyle: legendItem.pointStyle,
          rotation: legendItem.rotation,
          borderWidth: lineWidth
        };
        const centerX = rtlHelper.xPlus(x, boxWidth / 2);
        const centerY = y + halfFontSize;
        drawPointLegend(ctx, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && boxWidth);
      } else {
        const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
        const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
        const borderRadius = toTRBLCorners(legendItem.borderRadius);
        ctx.beginPath();
        if (Object.values(borderRadius).some((v) => v !== 0)) {
          addRoundedRectPath(ctx, {
            x: xBoxLeft,
            y: yBoxTop,
            w: boxWidth,
            h: boxHeight,
            radius: borderRadius
          });
        } else {
          ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
        }
        ctx.fill();
        if (lineWidth !== 0) {
          ctx.stroke();
        }
      }
      ctx.restore();
    };
    const fillText = function(x, y, legendItem) {
      renderText(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
        strikethrough: legendItem.hidden,
        textAlign: rtlHelper.textAlign(legendItem.textAlign)
      });
    };
    const isHorizontal = this.isHorizontal();
    const titleHeight = this._computeTitleHeight();
    if (isHorizontal) {
      cursor = {
        x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
        y: this.top + padding + titleHeight,
        line: 0
      };
    } else {
      cursor = {
        x: this.left + padding,
        y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
        line: 0
      };
    }
    overrideTextDirection(this.ctx, opts.textDirection);
    const lineHeight = itemHeight + padding;
    this.legendItems.forEach((legendItem, i) => {
      ctx.strokeStyle = legendItem.fontColor;
      ctx.fillStyle = legendItem.fontColor;
      const textWidth = ctx.measureText(legendItem.text).width;
      const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
      const width = boxWidth + halfFontSize + textWidth;
      let x = cursor.x;
      let y = cursor.y;
      rtlHelper.setWidth(this.width);
      if (isHorizontal) {
        if (i > 0 && x + width + padding > this.right) {
          y = cursor.y += lineHeight;
          cursor.line++;
          x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
        }
      } else if (i > 0 && y + lineHeight > this.bottom) {
        x = cursor.x = x + columnSizes[cursor.line].width + padding;
        cursor.line++;
        y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
      }
      const realX = rtlHelper.x(x);
      drawLegendBox(realX, y, legendItem);
      x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
      fillText(rtlHelper.x(x), y, legendItem);
      if (isHorizontal) {
        cursor.x += width + padding;
      } else if (typeof legendItem.text !== "string") {
        const fontLineHeight = labelFont.lineHeight;
        cursor.y += calculateLegendItemHeight(legendItem, fontLineHeight) + padding;
      } else {
        cursor.y += lineHeight;
      }
    });
    restoreTextDirection(this.ctx, opts.textDirection);
  }
  drawTitle() {
    const opts = this.options;
    const titleOpts = opts.title;
    const titleFont = toFont(titleOpts.font);
    const titlePadding = toPadding(titleOpts.padding);
    if (!titleOpts.display) {
      return;
    }
    const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
    const ctx = this.ctx;
    const position = titleOpts.position;
    const halfFontSize = titleFont.size / 2;
    const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
    let y;
    let left = this.left;
    let maxWidth = this.width;
    if (this.isHorizontal()) {
      maxWidth = Math.max(...this.lineWidths);
      y = this.top + topPaddingPlusHalfFontSize;
      left = _alignStartEnd(opts.align, left, this.right - maxWidth);
    } else {
      const maxHeight = this.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
      y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
    }
    const x = _alignStartEnd(position, left, left + maxWidth);
    ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
    ctx.textBaseline = "middle";
    ctx.strokeStyle = titleOpts.color;
    ctx.fillStyle = titleOpts.color;
    ctx.font = titleFont.string;
    renderText(ctx, titleOpts.text, x, y, titleFont);
  }
  _computeTitleHeight() {
    const titleOpts = this.options.title;
    const titleFont = toFont(titleOpts.font);
    const titlePadding = toPadding(titleOpts.padding);
    return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
  }
  _getLegendItemAt(x, y) {
    let i, hitBox, lh;
    if (_isBetween(x, this.left, this.right) && _isBetween(y, this.top, this.bottom)) {
      lh = this.legendHitBoxes;
      for (i = 0; i < lh.length; ++i) {
        hitBox = lh[i];
        if (_isBetween(x, hitBox.left, hitBox.left + hitBox.width) && _isBetween(y, hitBox.top, hitBox.top + hitBox.height)) {
          return this.legendItems[i];
        }
      }
    }
    return null;
  }
  handleEvent(e) {
    const opts = this.options;
    if (!isListened(e.type, opts)) {
      return;
    }
    const hoveredItem = this._getLegendItemAt(e.x, e.y);
    if (e.type === "mousemove" || e.type === "mouseout") {
      const previous = this._hoveredItem;
      const sameItem = itemsEqual(previous, hoveredItem);
      if (previous && !sameItem) {
        callback(opts.onLeave, [
          e,
          previous,
          this
        ], this);
      }
      this._hoveredItem = hoveredItem;
      if (hoveredItem && !sameItem) {
        callback(opts.onHover, [
          e,
          hoveredItem,
          this
        ], this);
      }
    } else if (hoveredItem) {
      callback(opts.onClick, [
        e,
        hoveredItem,
        this
      ], this);
    }
  }
}
function calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight) {
  const itemWidth = calculateItemWidth(legendItem, boxWidth, labelFont, ctx);
  const itemHeight = calculateItemHeight(_itemHeight, legendItem, labelFont.lineHeight);
  return {
    itemWidth,
    itemHeight
  };
}
function calculateItemWidth(legendItem, boxWidth, labelFont, ctx) {
  let legendItemText = legendItem.text;
  if (legendItemText && typeof legendItemText !== "string") {
    legendItemText = legendItemText.reduce((a, b) => a.length > b.length ? a : b);
  }
  return boxWidth + labelFont.size / 2 + ctx.measureText(legendItemText).width;
}
function calculateItemHeight(_itemHeight, legendItem, fontLineHeight) {
  let itemHeight = _itemHeight;
  if (typeof legendItem.text !== "string") {
    itemHeight = calculateLegendItemHeight(legendItem, fontLineHeight);
  }
  return itemHeight;
}
function calculateLegendItemHeight(legendItem, fontLineHeight) {
  const labelHeight = legendItem.text ? legendItem.text.length : 0;
  return fontLineHeight * labelHeight;
}
function isListened(type, opts) {
  if ((type === "mousemove" || type === "mouseout") && (opts.onHover || opts.onLeave)) {
    return true;
  }
  if (opts.onClick && (type === "click" || type === "mouseup")) {
    return true;
  }
  return false;
}
var plugin_legend = {
  id: "legend",
  _element: Legend,
  start(chart, _args, options) {
    const legend = chart.legend = new Legend({
      ctx: chart.ctx,
      options,
      chart
    });
    layouts.configure(chart, legend, options);
    layouts.addBox(chart, legend);
  },
  stop(chart) {
    layouts.removeBox(chart, chart.legend);
    delete chart.legend;
  },
  beforeUpdate(chart, _args, options) {
    const legend = chart.legend;
    layouts.configure(chart, legend, options);
    legend.options = options;
  },
  afterUpdate(chart) {
    const legend = chart.legend;
    legend.buildLabels();
    legend.adjustHitBoxes();
  },
  afterEvent(chart, args) {
    if (!args.replay) {
      chart.legend.handleEvent(args.event);
    }
  },
  defaults: {
    display: true,
    position: "top",
    align: "center",
    fullSize: true,
    reverse: false,
    weight: 1e3,
    onClick(e, legendItem, legend) {
      const index2 = legendItem.datasetIndex;
      const ci = legend.chart;
      if (ci.isDatasetVisible(index2)) {
        ci.hide(index2);
        legendItem.hidden = true;
      } else {
        ci.show(index2);
        legendItem.hidden = false;
      }
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (ctx) => ctx.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(chart) {
        const datasets = chart.data.datasets;
        const { labels: { usePointStyle, pointStyle, textAlign, color: color2, useBorderRadius, borderRadius } } = chart.legend.options;
        return chart._getSortedDatasetMetas().map((meta) => {
          const style = meta.controller.getStyle(usePointStyle ? 0 : void 0);
          const borderWidth = toPadding(style.borderWidth);
          return {
            text: datasets[meta.index].label,
            fillStyle: style.backgroundColor,
            fontColor: color2,
            hidden: !meta.visible,
            lineCap: style.borderCapStyle,
            lineDash: style.borderDash,
            lineDashOffset: style.borderDashOffset,
            lineJoin: style.borderJoinStyle,
            lineWidth: (borderWidth.width + borderWidth.height) / 4,
            strokeStyle: style.borderColor,
            pointStyle: pointStyle || style.pointStyle,
            rotation: style.rotation,
            textAlign: textAlign || style.textAlign,
            borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
            datasetIndex: meta.index
          };
        }, this);
      }
    },
    title: {
      color: (ctx) => ctx.chart.options.color,
      display: false,
      position: "center",
      text: ""
    }
  },
  descriptors: {
    _scriptable: (name) => !name.startsWith("on"),
    labels: {
      _scriptable: (name) => ![
        "generateLabels",
        "filter",
        "sort"
      ].includes(name)
    }
  }
};
class Title extends Element {
  constructor(config) {
    super();
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this._padding = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.right = void 0;
    this.width = void 0;
    this.height = void 0;
    this.position = void 0;
    this.weight = void 0;
    this.fullSize = void 0;
  }
  update(maxWidth, maxHeight) {
    const opts = this.options;
    this.left = 0;
    this.top = 0;
    if (!opts.display) {
      this.width = this.height = this.right = this.bottom = 0;
      return;
    }
    this.width = this.right = maxWidth;
    this.height = this.bottom = maxHeight;
    const lineCount = isArray(opts.text) ? opts.text.length : 1;
    this._padding = toPadding(opts.padding);
    const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
    if (this.isHorizontal()) {
      this.height = textSize;
    } else {
      this.width = textSize;
    }
  }
  isHorizontal() {
    const pos = this.options.position;
    return pos === "top" || pos === "bottom";
  }
  _drawArgs(offset) {
    const { top, left, bottom, right, options } = this;
    const align = options.align;
    let rotation = 0;
    let maxWidth, titleX, titleY;
    if (this.isHorizontal()) {
      titleX = _alignStartEnd(align, left, right);
      titleY = top + offset;
      maxWidth = right - left;
    } else {
      if (options.position === "left") {
        titleX = left + offset;
        titleY = _alignStartEnd(align, bottom, top);
        rotation = PI * -0.5;
      } else {
        titleX = right - offset;
        titleY = _alignStartEnd(align, top, bottom);
        rotation = PI * 0.5;
      }
      maxWidth = bottom - top;
    }
    return {
      titleX,
      titleY,
      maxWidth,
      rotation
    };
  }
  draw() {
    const ctx = this.ctx;
    const opts = this.options;
    if (!opts.display) {
      return;
    }
    const fontOpts = toFont(opts.font);
    const lineHeight = fontOpts.lineHeight;
    const offset = lineHeight / 2 + this._padding.top;
    const { titleX, titleY, maxWidth, rotation } = this._drawArgs(offset);
    renderText(ctx, opts.text, 0, 0, fontOpts, {
      color: opts.color,
      maxWidth,
      rotation,
      textAlign: _toLeftRightCenter(opts.align),
      textBaseline: "middle",
      translation: [
        titleX,
        titleY
      ]
    });
  }
}
function createTitle(chart, titleOpts) {
  const title = new Title({
    ctx: chart.ctx,
    options: titleOpts,
    chart
  });
  layouts.configure(chart, title, titleOpts);
  layouts.addBox(chart, title);
  chart.titleBlock = title;
}
var plugin_title = {
  id: "title",
  _element: Title,
  start(chart, _args, options) {
    createTitle(chart, options);
  },
  stop(chart) {
    const titleBlock = chart.titleBlock;
    layouts.removeBox(chart, titleBlock);
    delete chart.titleBlock;
  },
  beforeUpdate(chart, _args, options) {
    const title = chart.titleBlock;
    layouts.configure(chart, title, options);
    title.options = options;
  },
  defaults: {
    align: "center",
    display: false,
    font: {
      weight: "bold"
    },
    fullSize: true,
    padding: 10,
    position: "top",
    text: "",
    weight: 2e3
  },
  defaultRoutes: {
    color: "color"
  },
  descriptors: {
    _scriptable: true,
    _indexable: false
  }
};
const map = /* @__PURE__ */ new WeakMap();
var plugin_subtitle = {
  id: "subtitle",
  start(chart, _args, options) {
    const title = new Title({
      ctx: chart.ctx,
      options,
      chart
    });
    layouts.configure(chart, title, options);
    layouts.addBox(chart, title);
    map.set(chart, title);
  },
  stop(chart) {
    layouts.removeBox(chart, map.get(chart));
    map.delete(chart);
  },
  beforeUpdate(chart, _args, options) {
    const title = map.get(chart);
    layouts.configure(chart, title, options);
    title.options = options;
  },
  defaults: {
    align: "center",
    display: false,
    font: {
      weight: "normal"
    },
    fullSize: true,
    padding: 0,
    position: "top",
    text: "",
    weight: 1500
  },
  defaultRoutes: {
    color: "color"
  },
  descriptors: {
    _scriptable: true,
    _indexable: false
  }
};
const positioners = {
  average(items) {
    if (!items.length) {
      return false;
    }
    let i, len;
    let xSet = /* @__PURE__ */ new Set();
    let y = 0;
    let count = 0;
    for (i = 0, len = items.length; i < len; ++i) {
      const el = items[i].element;
      if (el && el.hasValue()) {
        const pos = el.tooltipPosition();
        xSet.add(pos.x);
        y += pos.y;
        ++count;
      }
    }
    const xAverage = [
      ...xSet
    ].reduce((a, b) => a + b) / xSet.size;
    return {
      x: xAverage,
      y: y / count
    };
  },
  nearest(items, eventPosition) {
    if (!items.length) {
      return false;
    }
    let x = eventPosition.x;
    let y = eventPosition.y;
    let minDistance = Number.POSITIVE_INFINITY;
    let i, len, nearestElement;
    for (i = 0, len = items.length; i < len; ++i) {
      const el = items[i].element;
      if (el && el.hasValue()) {
        const center = el.getCenterPoint();
        const d = distanceBetweenPoints(eventPosition, center);
        if (d < minDistance) {
          minDistance = d;
          nearestElement = el;
        }
      }
    }
    if (nearestElement) {
      const tp = nearestElement.tooltipPosition();
      x = tp.x;
      y = tp.y;
    }
    return {
      x,
      y
    };
  }
};
function pushOrConcat(base, toPush) {
  if (toPush) {
    if (isArray(toPush)) {
      Array.prototype.push.apply(base, toPush);
    } else {
      base.push(toPush);
    }
  }
  return base;
}
function splitNewlines(str) {
  if ((typeof str === "string" || str instanceof String) && str.indexOf("\n") > -1) {
    return str.split("\n");
  }
  return str;
}
function createTooltipItem(chart, item) {
  const { element, datasetIndex, index: index2 } = item;
  const controller = chart.getDatasetMeta(datasetIndex).controller;
  const { label, value } = controller.getLabelAndValue(index2);
  return {
    chart,
    label,
    parsed: controller.getParsed(index2),
    raw: chart.data.datasets[datasetIndex].data[index2],
    formattedValue: value,
    dataset: controller.getDataset(),
    dataIndex: index2,
    datasetIndex,
    element
  };
}
function getTooltipSize(tooltip, options) {
  const ctx = tooltip.chart.ctx;
  const { body, footer, title } = tooltip;
  const { boxWidth, boxHeight } = options;
  const bodyFont = toFont(options.bodyFont);
  const titleFont = toFont(options.titleFont);
  const footerFont = toFont(options.footerFont);
  const titleLineCount = title.length;
  const footerLineCount = footer.length;
  const bodyLineItemCount = body.length;
  const padding = toPadding(options.padding);
  let height = padding.height;
  let width = 0;
  let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
  combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
  if (titleLineCount) {
    height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
  }
  if (combinedBodyLength) {
    const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
    height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
  }
  if (footerLineCount) {
    height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
  }
  let widthPadding = 0;
  const maxLineWidth = function(line) {
    width = Math.max(width, ctx.measureText(line).width + widthPadding);
  };
  ctx.save();
  ctx.font = titleFont.string;
  each(tooltip.title, maxLineWidth);
  ctx.font = bodyFont.string;
  each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
  widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0;
  each(body, (bodyItem) => {
    each(bodyItem.before, maxLineWidth);
    each(bodyItem.lines, maxLineWidth);
    each(bodyItem.after, maxLineWidth);
  });
  widthPadding = 0;
  ctx.font = footerFont.string;
  each(tooltip.footer, maxLineWidth);
  ctx.restore();
  width += padding.width;
  return {
    width,
    height
  };
}
function determineYAlign(chart, size) {
  const { y, height } = size;
  if (y < height / 2) {
    return "top";
  } else if (y > chart.height - height / 2) {
    return "bottom";
  }
  return "center";
}
function doesNotFitWithAlign(xAlign, chart, options, size) {
  const { x, width } = size;
  const caret = options.caretSize + options.caretPadding;
  if (xAlign === "left" && x + width + caret > chart.width) {
    return true;
  }
  if (xAlign === "right" && x - width - caret < 0) {
    return true;
  }
}
function determineXAlign(chart, options, size, yAlign) {
  const { x, width } = size;
  const { width: chartWidth, chartArea: { left, right } } = chart;
  let xAlign = "center";
  if (yAlign === "center") {
    xAlign = x <= (left + right) / 2 ? "left" : "right";
  } else if (x <= width / 2) {
    xAlign = "left";
  } else if (x >= chartWidth - width / 2) {
    xAlign = "right";
  }
  if (doesNotFitWithAlign(xAlign, chart, options, size)) {
    xAlign = "center";
  }
  return xAlign;
}
function determineAlignment(chart, options, size) {
  const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
  return {
    xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
    yAlign
  };
}
function alignX(size, xAlign) {
  let { x, width } = size;
  if (xAlign === "right") {
    x -= width;
  } else if (xAlign === "center") {
    x -= width / 2;
  }
  return x;
}
function alignY(size, yAlign, paddingAndSize) {
  let { y, height } = size;
  if (yAlign === "top") {
    y += paddingAndSize;
  } else if (yAlign === "bottom") {
    y -= height + paddingAndSize;
  } else {
    y -= height / 2;
  }
  return y;
}
function getBackgroundPoint(options, size, alignment, chart) {
  const { caretSize, caretPadding, cornerRadius } = options;
  const { xAlign, yAlign } = alignment;
  const paddingAndSize = caretSize + caretPadding;
  const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
  let x = alignX(size, xAlign);
  const y = alignY(size, yAlign, paddingAndSize);
  if (yAlign === "center") {
    if (xAlign === "left") {
      x += paddingAndSize;
    } else if (xAlign === "right") {
      x -= paddingAndSize;
    }
  } else if (xAlign === "left") {
    x -= Math.max(topLeft, bottomLeft) + caretSize;
  } else if (xAlign === "right") {
    x += Math.max(topRight, bottomRight) + caretSize;
  }
  return {
    x: _limitValue(x, 0, chart.width - size.width),
    y: _limitValue(y, 0, chart.height - size.height)
  };
}
function getAlignedX(tooltip, align, options) {
  const padding = toPadding(options.padding);
  return align === "center" ? tooltip.x + tooltip.width / 2 : align === "right" ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
}
function getBeforeAfterBodyLines(callback2) {
  return pushOrConcat([], splitNewlines(callback2));
}
function createTooltipContext(parent, tooltip, tooltipItems) {
  return createContext(parent, {
    tooltip,
    tooltipItems,
    type: "tooltip"
  });
}
function overrideCallbacks(callbacks, context) {
  const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
  return override ? callbacks.override(override) : callbacks;
}
const defaultCallbacks = {
  beforeTitle: noop,
  title(tooltipItems) {
    if (tooltipItems.length > 0) {
      const item = tooltipItems[0];
      const labels = item.chart.data.labels;
      const labelCount = labels ? labels.length : 0;
      if (this && this.options && this.options.mode === "dataset") {
        return item.dataset.label || "";
      } else if (item.label) {
        return item.label;
      } else if (labelCount > 0 && item.dataIndex < labelCount) {
        return labels[item.dataIndex];
      }
    }
    return "";
  },
  afterTitle: noop,
  beforeBody: noop,
  beforeLabel: noop,
  label(tooltipItem) {
    if (this && this.options && this.options.mode === "dataset") {
      return tooltipItem.label + ": " + tooltipItem.formattedValue || tooltipItem.formattedValue;
    }
    let label = tooltipItem.dataset.label || "";
    if (label) {
      label += ": ";
    }
    const value = tooltipItem.formattedValue;
    if (!isNullOrUndef(value)) {
      label += value;
    }
    return label;
  },
  labelColor(tooltipItem) {
    const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
    const options = meta.controller.getStyle(tooltipItem.dataIndex);
    return {
      borderColor: options.borderColor,
      backgroundColor: options.backgroundColor,
      borderWidth: options.borderWidth,
      borderDash: options.borderDash,
      borderDashOffset: options.borderDashOffset,
      borderRadius: 0
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(tooltipItem) {
    const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
    const options = meta.controller.getStyle(tooltipItem.dataIndex);
    return {
      pointStyle: options.pointStyle,
      rotation: options.rotation
    };
  },
  afterLabel: noop,
  afterBody: noop,
  beforeFooter: noop,
  footer: noop,
  afterFooter: noop
};
function invokeCallbackWithFallback(callbacks, name, ctx, arg) {
  const result = callbacks[name].call(ctx, arg);
  if (typeof result === "undefined") {
    return defaultCallbacks[name].call(ctx, arg);
  }
  return result;
}
class Tooltip extends Element {
  constructor(config) {
    super();
    this.opacity = 0;
    this._active = [];
    this._eventPosition = void 0;
    this._size = void 0;
    this._cachedAnimations = void 0;
    this._tooltipItems = [];
    this.$animations = void 0;
    this.$context = void 0;
    this.chart = config.chart;
    this.options = config.options;
    this.dataPoints = void 0;
    this.title = void 0;
    this.beforeBody = void 0;
    this.body = void 0;
    this.afterBody = void 0;
    this.footer = void 0;
    this.xAlign = void 0;
    this.yAlign = void 0;
    this.x = void 0;
    this.y = void 0;
    this.height = void 0;
    this.width = void 0;
    this.caretX = void 0;
    this.caretY = void 0;
    this.labelColors = void 0;
    this.labelPointStyles = void 0;
    this.labelTextColors = void 0;
  }
  initialize(options) {
    this.options = options;
    this._cachedAnimations = void 0;
    this.$context = void 0;
  }
  _resolveAnimations() {
    const cached = this._cachedAnimations;
    if (cached) {
      return cached;
    }
    const chart = this.chart;
    const options = this.options.setContext(this.getContext());
    const opts = options.enabled && chart.options.animation && options.animations;
    const animations = new Animations(this.chart, opts);
    if (opts._cacheable) {
      this._cachedAnimations = Object.freeze(animations);
    }
    return animations;
  }
  getContext() {
    return this.$context || (this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(context, options) {
    const { callbacks } = options;
    const beforeTitle = invokeCallbackWithFallback(callbacks, "beforeTitle", this, context);
    const title = invokeCallbackWithFallback(callbacks, "title", this, context);
    const afterTitle = invokeCallbackWithFallback(callbacks, "afterTitle", this, context);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeTitle));
    lines = pushOrConcat(lines, splitNewlines(title));
    lines = pushOrConcat(lines, splitNewlines(afterTitle));
    return lines;
  }
  getBeforeBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, "beforeBody", this, tooltipItems));
  }
  getBody(tooltipItems, options) {
    const { callbacks } = options;
    const bodyItems = [];
    each(tooltipItems, (context) => {
      const bodyItem = {
        before: [],
        lines: [],
        after: []
      };
      const scoped = overrideCallbacks(callbacks, context);
      pushOrConcat(bodyItem.before, splitNewlines(invokeCallbackWithFallback(scoped, "beforeLabel", this, context)));
      pushOrConcat(bodyItem.lines, invokeCallbackWithFallback(scoped, "label", this, context));
      pushOrConcat(bodyItem.after, splitNewlines(invokeCallbackWithFallback(scoped, "afterLabel", this, context)));
      bodyItems.push(bodyItem);
    });
    return bodyItems;
  }
  getAfterBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, "afterBody", this, tooltipItems));
  }
  getFooter(tooltipItems, options) {
    const { callbacks } = options;
    const beforeFooter = invokeCallbackWithFallback(callbacks, "beforeFooter", this, tooltipItems);
    const footer = invokeCallbackWithFallback(callbacks, "footer", this, tooltipItems);
    const afterFooter = invokeCallbackWithFallback(callbacks, "afterFooter", this, tooltipItems);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeFooter));
    lines = pushOrConcat(lines, splitNewlines(footer));
    lines = pushOrConcat(lines, splitNewlines(afterFooter));
    return lines;
  }
  _createItems(options) {
    const active = this._active;
    const data = this.chart.data;
    const labelColors = [];
    const labelPointStyles = [];
    const labelTextColors = [];
    let tooltipItems = [];
    let i, len;
    for (i = 0, len = active.length; i < len; ++i) {
      tooltipItems.push(createTooltipItem(this.chart, active[i]));
    }
    if (options.filter) {
      tooltipItems = tooltipItems.filter((element, index2, array) => options.filter(element, index2, array, data));
    }
    if (options.itemSort) {
      tooltipItems = tooltipItems.sort((a, b) => options.itemSort(a, b, data));
    }
    each(tooltipItems, (context) => {
      const scoped = overrideCallbacks(options.callbacks, context);
      labelColors.push(invokeCallbackWithFallback(scoped, "labelColor", this, context));
      labelPointStyles.push(invokeCallbackWithFallback(scoped, "labelPointStyle", this, context));
      labelTextColors.push(invokeCallbackWithFallback(scoped, "labelTextColor", this, context));
    });
    this.labelColors = labelColors;
    this.labelPointStyles = labelPointStyles;
    this.labelTextColors = labelTextColors;
    this.dataPoints = tooltipItems;
    return tooltipItems;
  }
  update(changed, replay) {
    const options = this.options.setContext(this.getContext());
    const active = this._active;
    let properties;
    let tooltipItems = [];
    if (!active.length) {
      if (this.opacity !== 0) {
        properties = {
          opacity: 0
        };
      }
    } else {
      const position = positioners[options.position].call(this, active, this._eventPosition);
      tooltipItems = this._createItems(options);
      this.title = this.getTitle(tooltipItems, options);
      this.beforeBody = this.getBeforeBody(tooltipItems, options);
      this.body = this.getBody(tooltipItems, options);
      this.afterBody = this.getAfterBody(tooltipItems, options);
      this.footer = this.getFooter(tooltipItems, options);
      const size = this._size = getTooltipSize(this, options);
      const positionAndSize = Object.assign({}, position, size);
      const alignment = determineAlignment(this.chart, options, positionAndSize);
      const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
      this.xAlign = alignment.xAlign;
      this.yAlign = alignment.yAlign;
      properties = {
        opacity: 1,
        x: backgroundPoint.x,
        y: backgroundPoint.y,
        width: size.width,
        height: size.height,
        caretX: position.x,
        caretY: position.y
      };
    }
    this._tooltipItems = tooltipItems;
    this.$context = void 0;
    if (properties) {
      this._resolveAnimations().update(this, properties);
    }
    if (changed && options.external) {
      options.external.call(this, {
        chart: this.chart,
        tooltip: this,
        replay
      });
    }
  }
  drawCaret(tooltipPoint, ctx, size, options) {
    const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
    ctx.lineTo(caretPosition.x1, caretPosition.y1);
    ctx.lineTo(caretPosition.x2, caretPosition.y2);
    ctx.lineTo(caretPosition.x3, caretPosition.y3);
  }
  getCaretPosition(tooltipPoint, size, options) {
    const { xAlign, yAlign } = this;
    const { caretSize, cornerRadius } = options;
    const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
    const { x: ptX, y: ptY } = tooltipPoint;
    const { width, height } = size;
    let x1, x2, x3, y1, y2, y3;
    if (yAlign === "center") {
      y2 = ptY + height / 2;
      if (xAlign === "left") {
        x1 = ptX;
        x2 = x1 - caretSize;
        y1 = y2 + caretSize;
        y3 = y2 - caretSize;
      } else {
        x1 = ptX + width;
        x2 = x1 + caretSize;
        y1 = y2 - caretSize;
        y3 = y2 + caretSize;
      }
      x3 = x1;
    } else {
      if (xAlign === "left") {
        x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize;
      } else if (xAlign === "right") {
        x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
      } else {
        x2 = this.caretX;
      }
      if (yAlign === "top") {
        y1 = ptY;
        y2 = y1 - caretSize;
        x1 = x2 - caretSize;
        x3 = x2 + caretSize;
      } else {
        y1 = ptY + height;
        y2 = y1 + caretSize;
        x1 = x2 + caretSize;
        x3 = x2 - caretSize;
      }
      y3 = y1;
    }
    return {
      x1,
      x2,
      x3,
      y1,
      y2,
      y3
    };
  }
  drawTitle(pt, ctx, options) {
    const title = this.title;
    const length = title.length;
    let titleFont, titleSpacing, i;
    if (length) {
      const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
      pt.x = getAlignedX(this, options.titleAlign, options);
      ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
      ctx.textBaseline = "middle";
      titleFont = toFont(options.titleFont);
      titleSpacing = options.titleSpacing;
      ctx.fillStyle = options.titleColor;
      ctx.font = titleFont.string;
      for (i = 0; i < length; ++i) {
        ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
        pt.y += titleFont.lineHeight + titleSpacing;
        if (i + 1 === length) {
          pt.y += options.titleMarginBottom - titleSpacing;
        }
      }
    }
  }
  _drawColorBox(ctx, pt, i, rtlHelper, options) {
    const labelColor = this.labelColors[i];
    const labelPointStyle = this.labelPointStyles[i];
    const { boxHeight, boxWidth } = options;
    const bodyFont = toFont(options.bodyFont);
    const colorX = getAlignedX(this, "left", options);
    const rtlColorX = rtlHelper.x(colorX);
    const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
    const colorY = pt.y + yOffSet;
    if (options.usePointStyle) {
      const drawOptions = {
        radius: Math.min(boxWidth, boxHeight) / 2,
        pointStyle: labelPointStyle.pointStyle,
        rotation: labelPointStyle.rotation,
        borderWidth: 1
      };
      const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
      const centerY = colorY + boxHeight / 2;
      ctx.strokeStyle = options.multiKeyBackground;
      ctx.fillStyle = options.multiKeyBackground;
      drawPoint(ctx, drawOptions, centerX, centerY);
      ctx.strokeStyle = labelColor.borderColor;
      ctx.fillStyle = labelColor.backgroundColor;
      drawPoint(ctx, drawOptions, centerX, centerY);
    } else {
      ctx.lineWidth = isObject(labelColor.borderWidth) ? Math.max(...Object.values(labelColor.borderWidth)) : labelColor.borderWidth || 1;
      ctx.strokeStyle = labelColor.borderColor;
      ctx.setLineDash(labelColor.borderDash || []);
      ctx.lineDashOffset = labelColor.borderDashOffset || 0;
      const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth);
      const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - 2);
      const borderRadius = toTRBLCorners(labelColor.borderRadius);
      if (Object.values(borderRadius).some((v) => v !== 0)) {
        ctx.beginPath();
        ctx.fillStyle = options.multiKeyBackground;
        addRoundedRectPath(ctx, {
          x: outerX,
          y: colorY,
          w: boxWidth,
          h: boxHeight,
          radius: borderRadius
        });
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = labelColor.backgroundColor;
        ctx.beginPath();
        addRoundedRectPath(ctx, {
          x: innerX,
          y: colorY + 1,
          w: boxWidth - 2,
          h: boxHeight - 2,
          radius: borderRadius
        });
        ctx.fill();
      } else {
        ctx.fillStyle = options.multiKeyBackground;
        ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
        ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
        ctx.fillStyle = labelColor.backgroundColor;
        ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
      }
    }
    ctx.fillStyle = this.labelTextColors[i];
  }
  drawBody(pt, ctx, options) {
    const { body } = this;
    const { bodySpacing, bodyAlign, displayColors, boxHeight, boxWidth, boxPadding } = options;
    const bodyFont = toFont(options.bodyFont);
    let bodyLineHeight = bodyFont.lineHeight;
    let xLinePadding = 0;
    const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
    const fillLineOfText = function(line) {
      ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
      pt.y += bodyLineHeight + bodySpacing;
    };
    const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
    let bodyItem, textColor, lines, i, j, ilen, jlen;
    ctx.textAlign = bodyAlign;
    ctx.textBaseline = "middle";
    ctx.font = bodyFont.string;
    pt.x = getAlignedX(this, bodyAlignForCalculation, options);
    ctx.fillStyle = options.bodyColor;
    each(this.beforeBody, fillLineOfText);
    xLinePadding = displayColors && bodyAlignForCalculation !== "right" ? bodyAlign === "center" ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0;
    for (i = 0, ilen = body.length; i < ilen; ++i) {
      bodyItem = body[i];
      textColor = this.labelTextColors[i];
      ctx.fillStyle = textColor;
      each(bodyItem.before, fillLineOfText);
      lines = bodyItem.lines;
      if (displayColors && lines.length) {
        this._drawColorBox(ctx, pt, i, rtlHelper, options);
        bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
      }
      for (j = 0, jlen = lines.length; j < jlen; ++j) {
        fillLineOfText(lines[j]);
        bodyLineHeight = bodyFont.lineHeight;
      }
      each(bodyItem.after, fillLineOfText);
    }
    xLinePadding = 0;
    bodyLineHeight = bodyFont.lineHeight;
    each(this.afterBody, fillLineOfText);
    pt.y -= bodySpacing;
  }
  drawFooter(pt, ctx, options) {
    const footer = this.footer;
    const length = footer.length;
    let footerFont, i;
    if (length) {
      const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
      pt.x = getAlignedX(this, options.footerAlign, options);
      pt.y += options.footerMarginTop;
      ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
      ctx.textBaseline = "middle";
      footerFont = toFont(options.footerFont);
      ctx.fillStyle = options.footerColor;
      ctx.font = footerFont.string;
      for (i = 0; i < length; ++i) {
        ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
        pt.y += footerFont.lineHeight + options.footerSpacing;
      }
    }
  }
  drawBackground(pt, ctx, tooltipSize, options) {
    const { xAlign, yAlign } = this;
    const { x, y } = pt;
    const { width, height } = tooltipSize;
    const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(options.cornerRadius);
    ctx.fillStyle = options.backgroundColor;
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.beginPath();
    ctx.moveTo(x + topLeft, y);
    if (yAlign === "top") {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x + width - topRight, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
    if (yAlign === "center" && xAlign === "right") {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x + width, y + height - bottomRight);
    ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
    if (yAlign === "bottom") {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x + bottomLeft, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
    if (yAlign === "center" && xAlign === "left") {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x, y + topLeft);
    ctx.quadraticCurveTo(x, y, x + topLeft, y);
    ctx.closePath();
    ctx.fill();
    if (options.borderWidth > 0) {
      ctx.stroke();
    }
  }
  _updateAnimationTarget(options) {
    const chart = this.chart;
    const anims = this.$animations;
    const animX = anims && anims.x;
    const animY = anims && anims.y;
    if (animX || animY) {
      const position = positioners[options.position].call(this, this._active, this._eventPosition);
      if (!position) {
        return;
      }
      const size = this._size = getTooltipSize(this, options);
      const positionAndSize = Object.assign({}, position, this._size);
      const alignment = determineAlignment(chart, options, positionAndSize);
      const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
      if (animX._to !== point.x || animY._to !== point.y) {
        this.xAlign = alignment.xAlign;
        this.yAlign = alignment.yAlign;
        this.width = size.width;
        this.height = size.height;
        this.caretX = position.x;
        this.caretY = position.y;
        this._resolveAnimations().update(this, point);
      }
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(ctx) {
    const options = this.options.setContext(this.getContext());
    let opacity = this.opacity;
    if (!opacity) {
      return;
    }
    this._updateAnimationTarget(options);
    const tooltipSize = {
      width: this.width,
      height: this.height
    };
    const pt = {
      x: this.x,
      y: this.y
    };
    opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
    const padding = toPadding(options.padding);
    const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    if (options.enabled && hasTooltipContent) {
      ctx.save();
      ctx.globalAlpha = opacity;
      this.drawBackground(pt, ctx, tooltipSize, options);
      overrideTextDirection(ctx, options.textDirection);
      pt.y += padding.top;
      this.drawTitle(pt, ctx, options);
      this.drawBody(pt, ctx, options);
      this.drawFooter(pt, ctx, options);
      restoreTextDirection(ctx, options.textDirection);
      ctx.restore();
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(activeElements, eventPosition) {
    const lastActive = this._active;
    const active = activeElements.map(({ datasetIndex, index: index2 }) => {
      const meta = this.chart.getDatasetMeta(datasetIndex);
      if (!meta) {
        throw new Error("Cannot find a dataset at index " + datasetIndex);
      }
      return {
        datasetIndex,
        element: meta.data[index2],
        index: index2
      };
    });
    const changed = !_elementsEqual(lastActive, active);
    const positionChanged = this._positionChanged(active, eventPosition);
    if (changed || positionChanged) {
      this._active = active;
      this._eventPosition = eventPosition;
      this._ignoreReplayEvents = true;
      this.update(true);
    }
  }
  handleEvent(e, replay, inChartArea = true) {
    if (replay && this._ignoreReplayEvents) {
      return false;
    }
    this._ignoreReplayEvents = false;
    const options = this.options;
    const lastActive = this._active || [];
    const active = this._getActiveElements(e, lastActive, replay, inChartArea);
    const positionChanged = this._positionChanged(active, e);
    const changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
    if (changed) {
      this._active = active;
      if (options.enabled || options.external) {
        this._eventPosition = {
          x: e.x,
          y: e.y
        };
        this.update(true, replay);
      }
    }
    return changed;
  }
  _getActiveElements(e, lastActive, replay, inChartArea) {
    const options = this.options;
    if (e.type === "mouseout") {
      return [];
    }
    if (!inChartArea) {
      return lastActive.filter((i) => this.chart.data.datasets[i.datasetIndex] && this.chart.getDatasetMeta(i.datasetIndex).controller.getParsed(i.index) !== void 0);
    }
    const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
    if (options.reverse) {
      active.reverse();
    }
    return active;
  }
  _positionChanged(active, e) {
    const { caretX, caretY, options } = this;
    const position = positioners[options.position].call(this, active, e);
    return position !== false && (caretX !== position.x || caretY !== position.y);
  }
}
__publicField(Tooltip, "positioners", positioners);
var plugin_tooltip = {
  id: "tooltip",
  _element: Tooltip,
  positioners,
  afterInit(chart, _args, options) {
    if (options) {
      chart.tooltip = new Tooltip({
        chart,
        options
      });
    }
  },
  beforeUpdate(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },
  reset(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },
  afterDraw(chart) {
    const tooltip = chart.tooltip;
    if (tooltip && tooltip._willRender()) {
      const args = {
        tooltip
      };
      if (chart.notifyPlugins("beforeTooltipDraw", {
        ...args,
        cancelable: true
      }) === false) {
        return;
      }
      tooltip.draw(chart.ctx);
      chart.notifyPlugins("afterTooltipDraw", args);
    }
  },
  afterEvent(chart, args) {
    if (chart.tooltip) {
      const useFinalPosition = args.replay;
      if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
        args.changed = true;
      }
    }
  },
  defaults: {
    enabled: true,
    external: null,
    position: "average",
    backgroundColor: "rgba(0,0,0,0.8)",
    titleColor: "#fff",
    titleFont: {
      weight: "bold"
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: "left",
    bodyColor: "#fff",
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: "left",
    footerColor: "#fff",
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: "bold"
    },
    footerAlign: "left",
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (ctx, opts) => opts.bodyFont.size,
    boxWidth: (ctx, opts) => opts.bodyFont.size,
    multiKeyBackground: "#fff",
    displayColors: true,
    boxPadding: 0,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: "easeOutQuart"
    },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "width",
          "height",
          "caretX",
          "caretY"
        ]
      },
      opacity: {
        easing: "linear",
        duration: 200
      }
    },
    callbacks: defaultCallbacks
  },
  defaultRoutes: {
    bodyFont: "font",
    footerFont: "font",
    titleFont: "font"
  },
  descriptors: {
    _scriptable: (name) => name !== "filter" && name !== "itemSort" && name !== "external",
    _indexable: false,
    callbacks: {
      _scriptable: false,
      _indexable: false
    },
    animation: {
      _fallback: false
    },
    animations: {
      _fallback: "animation"
    }
  },
  additionalOptionScopes: [
    "interaction"
  ]
};
var plugins = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Colors: plugin_colors,
  Decimation: plugin_decimation,
  Filler: index,
  Legend: plugin_legend,
  SubTitle: plugin_subtitle,
  Title: plugin_title,
  Tooltip: plugin_tooltip
});
const addIfString = (labels, raw, index2, addedLabels) => {
  if (typeof raw === "string") {
    index2 = labels.push(raw) - 1;
    addedLabels.unshift({
      index: index2,
      label: raw
    });
  } else if (isNaN(raw)) {
    index2 = null;
  }
  return index2;
};
function findOrAddLabel(labels, raw, index2, addedLabels) {
  const first = labels.indexOf(raw);
  if (first === -1) {
    return addIfString(labels, raw, index2, addedLabels);
  }
  const last = labels.lastIndexOf(raw);
  return first !== last ? index2 : first;
}
const validIndex = (index2, max) => index2 === null ? null : _limitValue(Math.round(index2), 0, max);
function _getLabelForValue(value) {
  const labels = this.getLabels();
  if (value >= 0 && value < labels.length) {
    return labels[value];
  }
  return value;
}
class CategoryScale extends Scale {
  constructor(cfg) {
    super(cfg);
    this._startValue = void 0;
    this._valueRange = 0;
    this._addedLabels = [];
  }
  init(scaleOptions) {
    const added = this._addedLabels;
    if (added.length) {
      const labels = this.getLabels();
      for (const { index: index2, label } of added) {
        if (labels[index2] === label) {
          labels.splice(index2, 1);
        }
      }
      this._addedLabels = [];
    }
    super.init(scaleOptions);
  }
  parse(raw, index2) {
    if (isNullOrUndef(raw)) {
      return null;
    }
    const labels = this.getLabels();
    index2 = isFinite(index2) && labels[index2] === raw ? index2 : findOrAddLabel(labels, raw, valueOrDefault(index2, raw), this._addedLabels);
    return validIndex(index2, labels.length - 1);
  }
  determineDataLimits() {
    const { minDefined, maxDefined } = this.getUserBounds();
    let { min, max } = this.getMinMax(true);
    if (this.options.bounds === "ticks") {
      if (!minDefined) {
        min = 0;
      }
      if (!maxDefined) {
        max = this.getLabels().length - 1;
      }
    }
    this.min = min;
    this.max = max;
  }
  buildTicks() {
    const min = this.min;
    const max = this.max;
    const offset = this.options.offset;
    const ticks = [];
    let labels = this.getLabels();
    labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
    this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
    this._startValue = this.min - (offset ? 0.5 : 0);
    for (let value = min; value <= max; value++) {
      ticks.push({
        value
      });
    }
    return ticks;
  }
  getLabelForValue(value) {
    return _getLabelForValue.call(this, value);
  }
  configure() {
    super.configure();
    if (!this.isHorizontal()) {
      this._reversePixels = !this._reversePixels;
    }
  }
  getPixelForValue(value) {
    if (typeof value !== "number") {
      value = this.parse(value);
    }
    return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
  }
  getPixelForTick(index2) {
    const ticks = this.ticks;
    if (index2 < 0 || index2 > ticks.length - 1) {
      return null;
    }
    return this.getPixelForValue(ticks[index2].value);
  }
  getValueForPixel(pixel) {
    return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
}
__publicField(CategoryScale, "id", "category");
__publicField(CategoryScale, "defaults", {
  ticks: {
    callback: _getLabelForValue
  }
});
function generateTicks$1(generationOptions, dataRange) {
  const ticks = [];
  const MIN_SPACING = 1e-14;
  const { bounds, step, min, max, precision, count, maxTicks, maxDigits, includeBounds } = generationOptions;
  const unit = step || 1;
  const maxSpaces = maxTicks - 1;
  const { min: rmin, max: rmax } = dataRange;
  const minDefined = !isNullOrUndef(min);
  const maxDefined = !isNullOrUndef(max);
  const countDefined = !isNullOrUndef(count);
  const minSpacing = (rmax - rmin) / (maxDigits + 1);
  let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
  let factor, niceMin, niceMax, numSpaces;
  if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
    return [
      {
        value: rmin
      },
      {
        value: rmax
      }
    ];
  }
  numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
  if (numSpaces > maxSpaces) {
    spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
  }
  if (!isNullOrUndef(precision)) {
    factor = Math.pow(10, precision);
    spacing = Math.ceil(spacing * factor) / factor;
  }
  if (bounds === "ticks") {
    niceMin = Math.floor(rmin / spacing) * spacing;
    niceMax = Math.ceil(rmax / spacing) * spacing;
  } else {
    niceMin = rmin;
    niceMax = rmax;
  }
  if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1e3)) {
    numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
    spacing = (max - min) / numSpaces;
    niceMin = min;
    niceMax = max;
  } else if (countDefined) {
    niceMin = minDefined ? min : niceMin;
    niceMax = maxDefined ? max : niceMax;
    numSpaces = count - 1;
    spacing = (niceMax - niceMin) / numSpaces;
  } else {
    numSpaces = (niceMax - niceMin) / spacing;
    if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1e3)) {
      numSpaces = Math.round(numSpaces);
    } else {
      numSpaces = Math.ceil(numSpaces);
    }
  }
  const decimalPlaces = Math.max(_decimalPlaces(spacing), _decimalPlaces(niceMin));
  factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
  niceMin = Math.round(niceMin * factor) / factor;
  niceMax = Math.round(niceMax * factor) / factor;
  let j = 0;
  if (minDefined) {
    if (includeBounds && niceMin !== min) {
      ticks.push({
        value: min
      });
      if (niceMin < min) {
        j++;
      }
      if (almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
        j++;
      }
    } else if (niceMin < min) {
      j++;
    }
  }
  for (; j < numSpaces; ++j) {
    const tickValue = Math.round((niceMin + j * spacing) * factor) / factor;
    if (maxDefined && tickValue > max) {
      break;
    }
    ticks.push({
      value: tickValue
    });
  }
  if (maxDefined && includeBounds && niceMax !== max) {
    if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
      ticks[ticks.length - 1].value = max;
    } else {
      ticks.push({
        value: max
      });
    }
  } else if (!maxDefined || niceMax === max) {
    ticks.push({
      value: niceMax
    });
  }
  return ticks;
}
function relativeLabelSize(value, minSpacing, { horizontal, minRotation }) {
  const rad = toRadians(minRotation);
  const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 1e-3;
  const length = 0.75 * minSpacing * ("" + value).length;
  return Math.min(minSpacing / ratio, length);
}
class LinearScaleBase extends Scale {
  constructor(cfg) {
    super(cfg);
    this.start = void 0;
    this.end = void 0;
    this._startValue = void 0;
    this._endValue = void 0;
    this._valueRange = 0;
  }
  parse(raw, index2) {
    if (isNullOrUndef(raw)) {
      return null;
    }
    if ((typeof raw === "number" || raw instanceof Number) && !isFinite(+raw)) {
      return null;
    }
    return +raw;
  }
  handleTickRangeOptions() {
    const { beginAtZero } = this.options;
    const { minDefined, maxDefined } = this.getUserBounds();
    let { min, max } = this;
    const setMin = (v) => min = minDefined ? min : v;
    const setMax = (v) => max = maxDefined ? max : v;
    if (beginAtZero) {
      const minSign = sign(min);
      const maxSign = sign(max);
      if (minSign < 0 && maxSign < 0) {
        setMax(0);
      } else if (minSign > 0 && maxSign > 0) {
        setMin(0);
      }
    }
    if (min === max) {
      let offset = max === 0 ? 1 : Math.abs(max * 0.05);
      setMax(max + offset);
      if (!beginAtZero) {
        setMin(min - offset);
      }
    }
    this.min = min;
    this.max = max;
  }
  getTickLimit() {
    const tickOpts = this.options.ticks;
    let { maxTicksLimit, stepSize } = tickOpts;
    let maxTicks;
    if (stepSize) {
      maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
      if (maxTicks > 1e3) {
        console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
        maxTicks = 1e3;
      }
    } else {
      maxTicks = this.computeTickLimit();
      maxTicksLimit = maxTicksLimit || 11;
    }
    if (maxTicksLimit) {
      maxTicks = Math.min(maxTicksLimit, maxTicks);
    }
    return maxTicks;
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const opts = this.options;
    const tickOpts = opts.ticks;
    let maxTicks = this.getTickLimit();
    maxTicks = Math.max(2, maxTicks);
    const numericGeneratorOptions = {
      maxTicks,
      bounds: opts.bounds,
      min: opts.min,
      max: opts.max,
      precision: tickOpts.precision,
      step: tickOpts.stepSize,
      count: tickOpts.count,
      maxDigits: this._maxDigits(),
      horizontal: this.isHorizontal(),
      minRotation: tickOpts.minRotation || 0,
      includeBounds: tickOpts.includeBounds !== false
    };
    const dataRange = this._range || this;
    const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
    if (opts.bounds === "ticks") {
      _setMinAndMaxByKey(ticks, this, "value");
    }
    if (opts.reverse) {
      ticks.reverse();
      this.start = this.max;
      this.end = this.min;
    } else {
      this.start = this.min;
      this.end = this.max;
    }
    return ticks;
  }
  configure() {
    const ticks = this.ticks;
    let start = this.min;
    let end = this.max;
    super.configure();
    if (this.options.offset && ticks.length) {
      const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
      start -= offset;
      end += offset;
    }
    this._startValue = start;
    this._endValue = end;
    this._valueRange = end - start;
  }
  getLabelForValue(value) {
    return formatNumber(value, this.chart.options.locale, this.options.ticks.format);
  }
}
class LinearScale extends LinearScaleBase {
  determineDataLimits() {
    const { min, max } = this.getMinMax(true);
    this.min = isNumberFinite(min) ? min : 0;
    this.max = isNumberFinite(max) ? max : 1;
    this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const horizontal = this.isHorizontal();
    const length = horizontal ? this.width : this.height;
    const minRotation = toRadians(this.options.ticks.minRotation);
    const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 1e-3;
    const tickFont = this._resolveTickFontOptions(0);
    return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
  }
  getPixelForValue(value) {
    return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
  }
  getValueForPixel(pixel) {
    return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
  }
}
__publicField(LinearScale, "id", "linear");
__publicField(LinearScale, "defaults", {
  ticks: {
    callback: Ticks.formatters.numeric
  }
});
const log10Floor = (v) => Math.floor(log10(v));
const changeExponent = (v, m) => Math.pow(10, log10Floor(v) + m);
function isMajor(tickVal) {
  const remain = tickVal / Math.pow(10, log10Floor(tickVal));
  return remain === 1;
}
function steps(min, max, rangeExp) {
  const rangeStep = Math.pow(10, rangeExp);
  const start = Math.floor(min / rangeStep);
  const end = Math.ceil(max / rangeStep);
  return end - start;
}
function startExp(min, max) {
  const range = max - min;
  let rangeExp = log10Floor(range);
  while (steps(min, max, rangeExp) > 10) {
    rangeExp++;
  }
  while (steps(min, max, rangeExp) < 10) {
    rangeExp--;
  }
  return Math.min(rangeExp, log10Floor(min));
}
function generateTicks(generationOptions, { min, max }) {
  min = finiteOrDefault(generationOptions.min, min);
  const ticks = [];
  const minExp = log10Floor(min);
  let exp = startExp(min, max);
  let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
  const stepSize = Math.pow(10, exp);
  const base = minExp > exp ? Math.pow(10, minExp) : 0;
  const start = Math.round((min - base) * precision) / precision;
  const offset = Math.floor((min - base) / stepSize / 10) * stepSize * 10;
  let significand = Math.floor((start - offset) / Math.pow(10, exp));
  let value = finiteOrDefault(generationOptions.min, Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision);
  while (value < max) {
    ticks.push({
      value,
      major: isMajor(value),
      significand
    });
    if (significand >= 10) {
      significand = significand < 15 ? 15 : 20;
    } else {
      significand++;
    }
    if (significand >= 20) {
      exp++;
      significand = 2;
      precision = exp >= 0 ? 1 : precision;
    }
    value = Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision;
  }
  const lastTick = finiteOrDefault(generationOptions.max, value);
  ticks.push({
    value: lastTick,
    major: isMajor(lastTick),
    significand
  });
  return ticks;
}
class LogarithmicScale extends Scale {
  constructor(cfg) {
    super(cfg);
    this.start = void 0;
    this.end = void 0;
    this._startValue = void 0;
    this._valueRange = 0;
  }
  parse(raw, index2) {
    const value = LinearScaleBase.prototype.parse.apply(this, [
      raw,
      index2
    ]);
    if (value === 0) {
      this._zero = true;
      return void 0;
    }
    return isNumberFinite(value) && value > 0 ? value : null;
  }
  determineDataLimits() {
    const { min, max } = this.getMinMax(true);
    this.min = isNumberFinite(min) ? Math.max(0, min) : null;
    this.max = isNumberFinite(max) ? Math.max(0, max) : null;
    if (this.options.beginAtZero) {
      this._zero = true;
    }
    if (this._zero && this.min !== this._suggestedMin && !isNumberFinite(this._userMin)) {
      this.min = min === changeExponent(this.min, 0) ? changeExponent(this.min, -1) : changeExponent(this.min, 0);
    }
    this.handleTickRangeOptions();
  }
  handleTickRangeOptions() {
    const { minDefined, maxDefined } = this.getUserBounds();
    let min = this.min;
    let max = this.max;
    const setMin = (v) => min = minDefined ? min : v;
    const setMax = (v) => max = maxDefined ? max : v;
    if (min === max) {
      if (min <= 0) {
        setMin(1);
        setMax(10);
      } else {
        setMin(changeExponent(min, -1));
        setMax(changeExponent(max, 1));
      }
    }
    if (min <= 0) {
      setMin(changeExponent(max, -1));
    }
    if (max <= 0) {
      setMax(changeExponent(min, 1));
    }
    this.min = min;
    this.max = max;
  }
  buildTicks() {
    const opts = this.options;
    const generationOptions = {
      min: this._userMin,
      max: this._userMax
    };
    const ticks = generateTicks(generationOptions, this);
    if (opts.bounds === "ticks") {
      _setMinAndMaxByKey(ticks, this, "value");
    }
    if (opts.reverse) {
      ticks.reverse();
      this.start = this.max;
      this.end = this.min;
    } else {
      this.start = this.min;
      this.end = this.max;
    }
    return ticks;
  }
  getLabelForValue(value) {
    return value === void 0 ? "0" : formatNumber(value, this.chart.options.locale, this.options.ticks.format);
  }
  configure() {
    const start = this.min;
    super.configure();
    this._startValue = log10(start);
    this._valueRange = log10(this.max) - log10(start);
  }
  getPixelForValue(value) {
    if (value === void 0 || value === 0) {
      value = this.min;
    }
    if (value === null || isNaN(value)) {
      return NaN;
    }
    return this.getPixelForDecimal(value === this.min ? 0 : (log10(value) - this._startValue) / this._valueRange);
  }
  getValueForPixel(pixel) {
    const decimal = this.getDecimalForPixel(pixel);
    return Math.pow(10, this._startValue + decimal * this._valueRange);
  }
}
__publicField(LogarithmicScale, "id", "logarithmic");
__publicField(LogarithmicScale, "defaults", {
  ticks: {
    callback: Ticks.formatters.logarithmic,
    major: {
      enabled: true
    }
  }
});
function getTickBackdropHeight(opts) {
  const tickOpts = opts.ticks;
  if (tickOpts.display && opts.display) {
    const padding = toPadding(tickOpts.backdropPadding);
    return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
  }
  return 0;
}
function measureLabelSize(ctx, font, label) {
  label = isArray(label) ? label : [
    label
  ];
  return {
    w: _longestText(ctx, font.string, label),
    h: label.length * font.lineHeight
  };
}
function determineLimits(angle, pos, size, min, max) {
  if (angle === min || angle === max) {
    return {
      start: pos - size / 2,
      end: pos + size / 2
    };
  } else if (angle < min || angle > max) {
    return {
      start: pos - size,
      end: pos
    };
  }
  return {
    start: pos,
    end: pos + size
  };
}
function fitWithPointLabels(scale) {
  const orig = {
    l: scale.left + scale._padding.left,
    r: scale.right - scale._padding.right,
    t: scale.top + scale._padding.top,
    b: scale.bottom - scale._padding.bottom
  };
  const limits = Object.assign({}, orig);
  const labelSizes = [];
  const padding = [];
  const valueCount = scale._pointLabels.length;
  const pointLabelOpts = scale.options.pointLabels;
  const additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0;
  for (let i = 0; i < valueCount; i++) {
    const opts = pointLabelOpts.setContext(scale.getPointLabelContext(i));
    padding[i] = opts.padding;
    const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i], additionalAngle);
    const plFont = toFont(opts.font);
    const textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i]);
    labelSizes[i] = textSize;
    const angleRadians = _normalizeAngle(scale.getIndexAngle(i) + additionalAngle);
    const angle = Math.round(toDegrees(angleRadians));
    const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
    const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
    updateLimits(limits, orig, angleRadians, hLimits, vLimits);
  }
  scale.setCenterPoint(orig.l - limits.l, limits.r - orig.r, orig.t - limits.t, limits.b - orig.b);
  scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
}
function updateLimits(limits, orig, angle, hLimits, vLimits) {
  const sin = Math.abs(Math.sin(angle));
  const cos = Math.abs(Math.cos(angle));
  let x = 0;
  let y = 0;
  if (hLimits.start < orig.l) {
    x = (orig.l - hLimits.start) / sin;
    limits.l = Math.min(limits.l, orig.l - x);
  } else if (hLimits.end > orig.r) {
    x = (hLimits.end - orig.r) / sin;
    limits.r = Math.max(limits.r, orig.r + x);
  }
  if (vLimits.start < orig.t) {
    y = (orig.t - vLimits.start) / cos;
    limits.t = Math.min(limits.t, orig.t - y);
  } else if (vLimits.end > orig.b) {
    y = (vLimits.end - orig.b) / cos;
    limits.b = Math.max(limits.b, orig.b + y);
  }
}
function createPointLabelItem(scale, index2, itemOpts) {
  const outerDistance = scale.drawingArea;
  const { extra, additionalAngle, padding, size } = itemOpts;
  const pointLabelPosition = scale.getPointPosition(index2, outerDistance + extra + padding, additionalAngle);
  const angle = Math.round(toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)));
  const y = yForAngle(pointLabelPosition.y, size.h, angle);
  const textAlign = getTextAlignForAngle(angle);
  const left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
  return {
    visible: true,
    x: pointLabelPosition.x,
    y,
    textAlign,
    left,
    top: y,
    right: left + size.w,
    bottom: y + size.h
  };
}
function isNotOverlapped(item, area) {
  if (!area) {
    return true;
  }
  const { left, top, right, bottom } = item;
  const apexesInArea = _isPointInArea({
    x: left,
    y: top
  }, area) || _isPointInArea({
    x: left,
    y: bottom
  }, area) || _isPointInArea({
    x: right,
    y: top
  }, area) || _isPointInArea({
    x: right,
    y: bottom
  }, area);
  return !apexesInArea;
}
function buildPointLabelItems(scale, labelSizes, padding) {
  const items = [];
  const valueCount = scale._pointLabels.length;
  const opts = scale.options;
  const { centerPointLabels, display } = opts.pointLabels;
  const itemOpts = {
    extra: getTickBackdropHeight(opts) / 2,
    additionalAngle: centerPointLabels ? PI / valueCount : 0
  };
  let area;
  for (let i = 0; i < valueCount; i++) {
    itemOpts.padding = padding[i];
    itemOpts.size = labelSizes[i];
    const item = createPointLabelItem(scale, i, itemOpts);
    items.push(item);
    if (display === "auto") {
      item.visible = isNotOverlapped(item, area);
      if (item.visible) {
        area = item;
      }
    }
  }
  return items;
}
function getTextAlignForAngle(angle) {
  if (angle === 0 || angle === 180) {
    return "center";
  } else if (angle < 180) {
    return "left";
  }
  return "right";
}
function leftForTextAlign(x, w, align) {
  if (align === "right") {
    x -= w;
  } else if (align === "center") {
    x -= w / 2;
  }
  return x;
}
function yForAngle(y, h, angle) {
  if (angle === 90 || angle === 270) {
    y -= h / 2;
  } else if (angle > 270 || angle < 90) {
    y -= h;
  }
  return y;
}
function drawPointLabelBox(ctx, opts, item) {
  const { left, top, right, bottom } = item;
  const { backdropColor } = opts;
  if (!isNullOrUndef(backdropColor)) {
    const borderRadius = toTRBLCorners(opts.borderRadius);
    const padding = toPadding(opts.backdropPadding);
    ctx.fillStyle = backdropColor;
    const backdropLeft = left - padding.left;
    const backdropTop = top - padding.top;
    const backdropWidth = right - left + padding.width;
    const backdropHeight = bottom - top + padding.height;
    if (Object.values(borderRadius).some((v) => v !== 0)) {
      ctx.beginPath();
      addRoundedRectPath(ctx, {
        x: backdropLeft,
        y: backdropTop,
        w: backdropWidth,
        h: backdropHeight,
        radius: borderRadius
      });
      ctx.fill();
    } else {
      ctx.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
    }
  }
}
function drawPointLabels(scale, labelCount) {
  const { ctx, options: { pointLabels } } = scale;
  for (let i = labelCount - 1; i >= 0; i--) {
    const item = scale._pointLabelItems[i];
    if (!item.visible) {
      continue;
    }
    const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i));
    drawPointLabelBox(ctx, optsAtIndex, item);
    const plFont = toFont(optsAtIndex.font);
    const { x, y, textAlign } = item;
    renderText(ctx, scale._pointLabels[i], x, y + plFont.lineHeight / 2, plFont, {
      color: optsAtIndex.color,
      textAlign,
      textBaseline: "middle"
    });
  }
}
function pathRadiusLine(scale, radius, circular, labelCount) {
  const { ctx } = scale;
  if (circular) {
    ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
  } else {
    let pointPosition = scale.getPointPosition(0, radius);
    ctx.moveTo(pointPosition.x, pointPosition.y);
    for (let i = 1; i < labelCount; i++) {
      pointPosition = scale.getPointPosition(i, radius);
      ctx.lineTo(pointPosition.x, pointPosition.y);
    }
  }
}
function drawRadiusLine(scale, gridLineOpts, radius, labelCount, borderOpts) {
  const ctx = scale.ctx;
  const circular = gridLineOpts.circular;
  const { color: color2, lineWidth } = gridLineOpts;
  if (!circular && !labelCount || !color2 || !lineWidth || radius < 0) {
    return;
  }
  ctx.save();
  ctx.strokeStyle = color2;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(borderOpts.dash);
  ctx.lineDashOffset = borderOpts.dashOffset;
  ctx.beginPath();
  pathRadiusLine(scale, radius, circular, labelCount);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
function createPointLabelContext(parent, index2, label) {
  return createContext(parent, {
    label,
    index: index2,
    type: "pointLabel"
  });
}
class RadialLinearScale extends LinearScaleBase {
  constructor(cfg) {
    super(cfg);
    this.xCenter = void 0;
    this.yCenter = void 0;
    this.drawingArea = void 0;
    this._pointLabels = [];
    this._pointLabelItems = [];
  }
  setDimensions() {
    const padding = this._padding = toPadding(getTickBackdropHeight(this.options) / 2);
    const w = this.width = this.maxWidth - padding.width;
    const h = this.height = this.maxHeight - padding.height;
    this.xCenter = Math.floor(this.left + w / 2 + padding.left);
    this.yCenter = Math.floor(this.top + h / 2 + padding.top);
    this.drawingArea = Math.floor(Math.min(w, h) / 2);
  }
  determineDataLimits() {
    const { min, max } = this.getMinMax(false);
    this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
    this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
    this.handleTickRangeOptions();
  }
  computeTickLimit() {
    return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
  }
  generateTickLabels(ticks) {
    LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
    this._pointLabels = this.getLabels().map((value, index2) => {
      const label = callback(this.options.pointLabels.callback, [
        value,
        index2
      ], this);
      return label || label === 0 ? label : "";
    }).filter((v, i) => this.chart.getDataVisibility(i));
  }
  fit() {
    const opts = this.options;
    if (opts.display && opts.pointLabels.display) {
      fitWithPointLabels(this);
    } else {
      this.setCenterPoint(0, 0, 0, 0);
    }
  }
  setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
    this.xCenter += Math.floor((leftMovement - rightMovement) / 2);
    this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
    this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
  }
  getIndexAngle(index2) {
    const angleMultiplier = TAU / (this._pointLabels.length || 1);
    const startAngle = this.options.startAngle || 0;
    return _normalizeAngle(index2 * angleMultiplier + toRadians(startAngle));
  }
  getDistanceFromCenterForValue(value) {
    if (isNullOrUndef(value)) {
      return NaN;
    }
    const scalingFactor = this.drawingArea / (this.max - this.min);
    if (this.options.reverse) {
      return (this.max - value) * scalingFactor;
    }
    return (value - this.min) * scalingFactor;
  }
  getValueForDistanceFromCenter(distance) {
    if (isNullOrUndef(distance)) {
      return NaN;
    }
    const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
    return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
  }
  getPointLabelContext(index2) {
    const pointLabels = this._pointLabels || [];
    if (index2 >= 0 && index2 < pointLabels.length) {
      const pointLabel = pointLabels[index2];
      return createPointLabelContext(this.getContext(), index2, pointLabel);
    }
  }
  getPointPosition(index2, distanceFromCenter, additionalAngle = 0) {
    const angle = this.getIndexAngle(index2) - HALF_PI + additionalAngle;
    return {
      x: Math.cos(angle) * distanceFromCenter + this.xCenter,
      y: Math.sin(angle) * distanceFromCenter + this.yCenter,
      angle
    };
  }
  getPointPositionForValue(index2, value) {
    return this.getPointPosition(index2, this.getDistanceFromCenterForValue(value));
  }
  getBasePosition(index2) {
    return this.getPointPositionForValue(index2 || 0, this.getBaseValue());
  }
  getPointLabelPosition(index2) {
    const { left, top, right, bottom } = this._pointLabelItems[index2];
    return {
      left,
      top,
      right,
      bottom
    };
  }
  drawBackground() {
    const { backgroundColor, grid: { circular } } = this.options;
    if (backgroundColor) {
      const ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
      ctx.closePath();
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      ctx.restore();
    }
  }
  drawGrid() {
    const ctx = this.ctx;
    const opts = this.options;
    const { angleLines, grid, border } = opts;
    const labelCount = this._pointLabels.length;
    let i, offset, position;
    if (opts.pointLabels.display) {
      drawPointLabels(this, labelCount);
    }
    if (grid.display) {
      this.ticks.forEach((tick, index2) => {
        if (index2 !== 0 || index2 === 0 && this.min < 0) {
          offset = this.getDistanceFromCenterForValue(tick.value);
          const context = this.getContext(index2);
          const optsAtIndex = grid.setContext(context);
          const optsAtIndexBorder = border.setContext(context);
          drawRadiusLine(this, optsAtIndex, offset, labelCount, optsAtIndexBorder);
        }
      });
    }
    if (angleLines.display) {
      ctx.save();
      for (i = labelCount - 1; i >= 0; i--) {
        const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i));
        const { color: color2, lineWidth } = optsAtIndex;
        if (!lineWidth || !color2) {
          continue;
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color2;
        ctx.setLineDash(optsAtIndex.borderDash);
        ctx.lineDashOffset = optsAtIndex.borderDashOffset;
        offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.max);
        position = this.getPointPosition(i, offset);
        ctx.beginPath();
        ctx.moveTo(this.xCenter, this.yCenter);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  drawBorder() {
  }
  drawLabels() {
    const ctx = this.ctx;
    const opts = this.options;
    const tickOpts = opts.ticks;
    if (!tickOpts.display) {
      return;
    }
    const startAngle = this.getIndexAngle(0);
    let offset, width;
    ctx.save();
    ctx.translate(this.xCenter, this.yCenter);
    ctx.rotate(startAngle);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    this.ticks.forEach((tick, index2) => {
      if (index2 === 0 && this.min >= 0 && !opts.reverse) {
        return;
      }
      const optsAtIndex = tickOpts.setContext(this.getContext(index2));
      const tickFont = toFont(optsAtIndex.font);
      offset = this.getDistanceFromCenterForValue(this.ticks[index2].value);
      if (optsAtIndex.showLabelBackdrop) {
        ctx.font = tickFont.string;
        width = ctx.measureText(tick.label).width;
        ctx.fillStyle = optsAtIndex.backdropColor;
        const padding = toPadding(optsAtIndex.backdropPadding);
        ctx.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
      }
      renderText(ctx, tick.label, 0, -offset, tickFont, {
        color: optsAtIndex.color,
        strokeColor: optsAtIndex.textStrokeColor,
        strokeWidth: optsAtIndex.textStrokeWidth
      });
    });
    ctx.restore();
  }
  drawTitle() {
  }
}
__publicField(RadialLinearScale, "id", "radialLinear");
__publicField(RadialLinearScale, "defaults", {
  display: true,
  animate: true,
  position: "chartArea",
  angleLines: {
    display: true,
    lineWidth: 1,
    borderDash: [],
    borderDashOffset: 0
  },
  grid: {
    circular: false
  },
  startAngle: 0,
  ticks: {
    showLabelBackdrop: true,
    callback: Ticks.formatters.numeric
  },
  pointLabels: {
    backdropColor: void 0,
    backdropPadding: 2,
    display: true,
    font: {
      size: 10
    },
    callback(label) {
      return label;
    },
    padding: 5,
    centerPointLabels: false
  }
});
__publicField(RadialLinearScale, "defaultRoutes", {
  "angleLines.color": "borderColor",
  "pointLabels.color": "color",
  "ticks.color": "color"
});
__publicField(RadialLinearScale, "descriptors", {
  angleLines: {
    _fallback: "grid"
  }
});
const INTERVALS = {
  millisecond: {
    common: true,
    size: 1,
    steps: 1e3
  },
  second: {
    common: true,
    size: 1e3,
    steps: 60
  },
  minute: {
    common: true,
    size: 6e4,
    steps: 60
  },
  hour: {
    common: true,
    size: 36e5,
    steps: 24
  },
  day: {
    common: true,
    size: 864e5,
    steps: 30
  },
  week: {
    common: false,
    size: 6048e5,
    steps: 4
  },
  month: {
    common: true,
    size: 2628e6,
    steps: 12
  },
  quarter: {
    common: false,
    size: 7884e6,
    steps: 4
  },
  year: {
    common: true,
    size: 3154e7
  }
};
const UNITS = /* @__PURE__ */ Object.keys(INTERVALS);
function sorter(a, b) {
  return a - b;
}
function parse(scale, input) {
  if (isNullOrUndef(input)) {
    return null;
  }
  const adapter = scale._adapter;
  const { parser, round: round2, isoWeekday } = scale._parseOpts;
  let value = input;
  if (typeof parser === "function") {
    value = parser(value);
  }
  if (!isNumberFinite(value)) {
    value = typeof parser === "string" ? adapter.parse(value, parser) : adapter.parse(value);
  }
  if (value === null) {
    return null;
  }
  if (round2) {
    value = round2 === "week" && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, "isoWeek", isoWeekday) : adapter.startOf(value, round2);
  }
  return +value;
}
function determineUnitForAutoTicks(minUnit, min, max, capacity) {
  const ilen = UNITS.length;
  for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
    const interval = INTERVALS[UNITS[i]];
    const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
    if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
      return UNITS[i];
    }
  }
  return UNITS[ilen - 1];
}
function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
  for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
    const unit = UNITS[i];
    if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
      return unit;
    }
  }
  return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
}
function determineMajorUnit(unit) {
  for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
    if (INTERVALS[UNITS[i]].common) {
      return UNITS[i];
    }
  }
}
function addTick(ticks, time, timestamps) {
  if (!timestamps) {
    ticks[time] = true;
  } else if (timestamps.length) {
    const { lo, hi } = _lookup(timestamps, time);
    const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
    ticks[timestamp] = true;
  }
}
function setMajorTicks(scale, ticks, map2, majorUnit) {
  const adapter = scale._adapter;
  const first = +adapter.startOf(ticks[0].value, majorUnit);
  const last = ticks[ticks.length - 1].value;
  let major, index2;
  for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
    index2 = map2[major];
    if (index2 >= 0) {
      ticks[index2].major = true;
    }
  }
  return ticks;
}
function ticksFromTimestamps(scale, values, majorUnit) {
  const ticks = [];
  const map2 = {};
  const ilen = values.length;
  let i, value;
  for (i = 0; i < ilen; ++i) {
    value = values[i];
    map2[value] = i;
    ticks.push({
      value,
      major: false
    });
  }
  return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map2, majorUnit);
}
class TimeScale extends Scale {
  constructor(props) {
    super(props);
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
    this._unit = "day";
    this._majorUnit = void 0;
    this._offsets = {};
    this._normalized = false;
    this._parseOpts = void 0;
  }
  init(scaleOpts, opts = {}) {
    const time = scaleOpts.time || (scaleOpts.time = {});
    const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
    adapter.init(opts);
    mergeIf(time.displayFormats, adapter.formats());
    this._parseOpts = {
      parser: time.parser,
      round: time.round,
      isoWeekday: time.isoWeekday
    };
    super.init(scaleOpts);
    this._normalized = opts.normalized;
  }
  parse(raw, index2) {
    if (raw === void 0) {
      return null;
    }
    return parse(this, raw);
  }
  beforeLayout() {
    super.beforeLayout();
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }
  determineDataLimits() {
    const options = this.options;
    const adapter = this._adapter;
    const unit = options.time.unit || "day";
    let { min, max, minDefined, maxDefined } = this.getUserBounds();
    function _applyBounds(bounds) {
      if (!minDefined && !isNaN(bounds.min)) {
        min = Math.min(min, bounds.min);
      }
      if (!maxDefined && !isNaN(bounds.max)) {
        max = Math.max(max, bounds.max);
      }
    }
    if (!minDefined || !maxDefined) {
      _applyBounds(this._getLabelBounds());
      if (options.bounds !== "ticks" || options.ticks.source !== "labels") {
        _applyBounds(this.getMinMax(false));
      }
    }
    min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
    max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
    this.min = Math.min(min, max - 1);
    this.max = Math.max(min + 1, max);
  }
  _getLabelBounds() {
    const arr = this.getLabelTimestamps();
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    if (arr.length) {
      min = arr[0];
      max = arr[arr.length - 1];
    }
    return {
      min,
      max
    };
  }
  buildTicks() {
    const options = this.options;
    const timeOpts = options.time;
    const tickOpts = options.ticks;
    const timestamps = tickOpts.source === "labels" ? this.getLabelTimestamps() : this._generate();
    if (options.bounds === "ticks" && timestamps.length) {
      this.min = this._userMin || timestamps[0];
      this.max = this._userMax || timestamps[timestamps.length - 1];
    }
    const min = this.min;
    const max = this.max;
    const ticks = _filterBetween(timestamps, min, max);
    this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
    this._majorUnit = !tickOpts.major.enabled || this._unit === "year" ? void 0 : determineMajorUnit(this._unit);
    this.initOffsets(timestamps);
    if (options.reverse) {
      ticks.reverse();
    }
    return ticksFromTimestamps(this, ticks, this._majorUnit);
  }
  afterAutoSkip() {
    if (this.options.offsetAfterAutoskip) {
      this.initOffsets(this.ticks.map((tick) => +tick.value));
    }
  }
  initOffsets(timestamps = []) {
    let start = 0;
    let end = 0;
    let first, last;
    if (this.options.offset && timestamps.length) {
      first = this.getDecimalForValue(timestamps[0]);
      if (timestamps.length === 1) {
        start = 1 - first;
      } else {
        start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
      }
      last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
      if (timestamps.length === 1) {
        end = last;
      } else {
        end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
      }
    }
    const limit = timestamps.length < 3 ? 0.5 : 0.25;
    start = _limitValue(start, 0, limit);
    end = _limitValue(end, 0, limit);
    this._offsets = {
      start,
      end,
      factor: 1 / (start + 1 + end)
    };
  }
  _generate() {
    const adapter = this._adapter;
    const min = this.min;
    const max = this.max;
    const options = this.options;
    const timeOpts = options.time;
    const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
    const stepSize = valueOrDefault(options.ticks.stepSize, 1);
    const weekday = minor === "week" ? timeOpts.isoWeekday : false;
    const hasWeekday = isNumber(weekday) || weekday === true;
    const ticks = {};
    let first = min;
    let time, count;
    if (hasWeekday) {
      first = +adapter.startOf(first, "isoWeek", weekday);
    }
    first = +adapter.startOf(first, hasWeekday ? "day" : minor);
    if (adapter.diff(max, min, minor) > 1e5 * stepSize) {
      throw new Error(min + " and " + max + " are too far apart with stepSize of " + stepSize + " " + minor);
    }
    const timestamps = options.ticks.source === "data" && this.getDataTimestamps();
    for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
      addTick(ticks, time, timestamps);
    }
    if (time === max || options.bounds === "ticks" || count === 1) {
      addTick(ticks, time, timestamps);
    }
    return Object.keys(ticks).sort(sorter).map((x) => +x);
  }
  getLabelForValue(value) {
    const adapter = this._adapter;
    const timeOpts = this.options.time;
    if (timeOpts.tooltipFormat) {
      return adapter.format(value, timeOpts.tooltipFormat);
    }
    return adapter.format(value, timeOpts.displayFormats.datetime);
  }
  format(value, format) {
    const options = this.options;
    const formats = options.time.displayFormats;
    const unit = this._unit;
    const fmt = format || formats[unit];
    return this._adapter.format(value, fmt);
  }
  _tickFormatFunction(time, index2, ticks, format) {
    const options = this.options;
    const formatter = options.ticks.callback;
    if (formatter) {
      return callback(formatter, [
        time,
        index2,
        ticks
      ], this);
    }
    const formats = options.time.displayFormats;
    const unit = this._unit;
    const majorUnit = this._majorUnit;
    const minorFormat = unit && formats[unit];
    const majorFormat = majorUnit && formats[majorUnit];
    const tick = ticks[index2];
    const major = majorUnit && majorFormat && tick && tick.major;
    return this._adapter.format(time, format || (major ? majorFormat : minorFormat));
  }
  generateTickLabels(ticks) {
    let i, ilen, tick;
    for (i = 0, ilen = ticks.length; i < ilen; ++i) {
      tick = ticks[i];
      tick.label = this._tickFormatFunction(tick.value, i, ticks);
    }
  }
  getDecimalForValue(value) {
    return value === null ? NaN : (value - this.min) / (this.max - this.min);
  }
  getPixelForValue(value) {
    const offsets = this._offsets;
    const pos = this.getDecimalForValue(value);
    return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
  }
  getValueForPixel(pixel) {
    const offsets = this._offsets;
    const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return this.min + pos * (this.max - this.min);
  }
  _getLabelSize(label) {
    const ticksOpts = this.options.ticks;
    const tickLabelWidth = this.ctx.measureText(label).width;
    const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
    const cosRotation = Math.cos(angle);
    const sinRotation = Math.sin(angle);
    const tickFontSize = this._resolveTickFontOptions(0).size;
    return {
      w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
      h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
    };
  }
  _getLabelCapacity(exampleTime) {
    const timeOpts = this.options.time;
    const displayFormats = timeOpts.displayFormats;
    const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
    const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [
      exampleTime
    ], this._majorUnit), format);
    const size = this._getLabelSize(exampleLabel);
    const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
    return capacity > 0 ? capacity : 1;
  }
  getDataTimestamps() {
    let timestamps = this._cache.data || [];
    let i, ilen;
    if (timestamps.length) {
      return timestamps;
    }
    const metas = this.getMatchingVisibleMetas();
    if (this._normalized && metas.length) {
      return this._cache.data = metas[0].controller.getAllParsedValues(this);
    }
    for (i = 0, ilen = metas.length; i < ilen; ++i) {
      timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
    }
    return this._cache.data = this.normalize(timestamps);
  }
  getLabelTimestamps() {
    const timestamps = this._cache.labels || [];
    let i, ilen;
    if (timestamps.length) {
      return timestamps;
    }
    const labels = this.getLabels();
    for (i = 0, ilen = labels.length; i < ilen; ++i) {
      timestamps.push(parse(this, labels[i]));
    }
    return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
  }
  normalize(values) {
    return _arrayUnique(values.sort(sorter));
  }
}
__publicField(TimeScale, "id", "time");
__publicField(TimeScale, "defaults", {
  bounds: "data",
  adapters: {},
  time: {
    parser: false,
    unit: false,
    round: false,
    isoWeekday: false,
    minUnit: "millisecond",
    displayFormats: {}
  },
  ticks: {
    source: "auto",
    callback: false,
    major: {
      enabled: false
    }
  }
});
function interpolate(table, val, reverse) {
  let lo = 0;
  let hi = table.length - 1;
  let prevSource, nextSource, prevTarget, nextTarget;
  if (reverse) {
    if (val >= table[lo].pos && val <= table[hi].pos) {
      ({ lo, hi } = _lookupByKey(table, "pos", val));
    }
    ({ pos: prevSource, time: prevTarget } = table[lo]);
    ({ pos: nextSource, time: nextTarget } = table[hi]);
  } else {
    if (val >= table[lo].time && val <= table[hi].time) {
      ({ lo, hi } = _lookupByKey(table, "time", val));
    }
    ({ time: prevSource, pos: prevTarget } = table[lo]);
    ({ time: nextSource, pos: nextTarget } = table[hi]);
  }
  const span = nextSource - prevSource;
  return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
}
class TimeSeriesScale extends TimeScale {
  constructor(props) {
    super(props);
    this._table = [];
    this._minPos = void 0;
    this._tableRange = void 0;
  }
  initOffsets() {
    const timestamps = this._getTimestampsForTable();
    const table = this._table = this.buildLookupTable(timestamps);
    this._minPos = interpolate(table, this.min);
    this._tableRange = interpolate(table, this.max) - this._minPos;
    super.initOffsets(timestamps);
  }
  buildLookupTable(timestamps) {
    const { min, max } = this;
    const items = [];
    const table = [];
    let i, ilen, prev, curr, next;
    for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
      curr = timestamps[i];
      if (curr >= min && curr <= max) {
        items.push(curr);
      }
    }
    if (items.length < 2) {
      return [
        {
          time: min,
          pos: 0
        },
        {
          time: max,
          pos: 1
        }
      ];
    }
    for (i = 0, ilen = items.length; i < ilen; ++i) {
      next = items[i + 1];
      prev = items[i - 1];
      curr = items[i];
      if (Math.round((next + prev) / 2) !== curr) {
        table.push({
          time: curr,
          pos: i / (ilen - 1)
        });
      }
    }
    return table;
  }
  _generate() {
    const min = this.min;
    const max = this.max;
    let timestamps = super.getDataTimestamps();
    if (!timestamps.includes(min) || !timestamps.length) {
      timestamps.splice(0, 0, min);
    }
    if (!timestamps.includes(max) || timestamps.length === 1) {
      timestamps.push(max);
    }
    return timestamps.sort((a, b) => a - b);
  }
  _getTimestampsForTable() {
    let timestamps = this._cache.all || [];
    if (timestamps.length) {
      return timestamps;
    }
    const data = this.getDataTimestamps();
    const label = this.getLabelTimestamps();
    if (data.length && label.length) {
      timestamps = this.normalize(data.concat(label));
    } else {
      timestamps = data.length ? data : label;
    }
    timestamps = this._cache.all = timestamps;
    return timestamps;
  }
  getDecimalForValue(value) {
    return (interpolate(this._table, value) - this._minPos) / this._tableRange;
  }
  getValueForPixel(pixel) {
    const offsets = this._offsets;
    const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return interpolate(this._table, decimal * this._tableRange + this._minPos, true);
  }
}
__publicField(TimeSeriesScale, "id", "timeseries");
__publicField(TimeSeriesScale, "defaults", TimeScale.defaults);
var scales = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale
});
const registerables = [
  controllers,
  elements,
  plugins,
  scales
];
Chart.register(...registerables);
var EOL = {}, EOF = {}, QUOTE = 34, NEWLINE = 10, RETURN = 13;
function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function(name, i) {
    return JSON.stringify(name) + ": d[" + i + '] || ""';
  }).join(",") + "}");
}
function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function(row, i) {
    return f(object(row), i, columns);
  };
}
function inferColumns(rows) {
  var columnSet = /* @__PURE__ */ Object.create(null), columns = [];
  rows.forEach(function(row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });
  return columns;
}
function pad(value, width) {
  var s = value + "", length = s.length;
  return length < width ? new Array(width - length + 1).join(0) + s : s;
}
function formatYear(year) {
  return year < 0 ? "-" + pad(-year, 6) : year > 9999 ? "+" + pad(year, 6) : pad(year, 4);
}
function formatDate(date) {
  var hours = date.getUTCHours(), minutes = date.getUTCMinutes(), seconds = date.getUTCSeconds(), milliseconds = date.getUTCMilliseconds();
  return isNaN(date) ? "Invalid Date" : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2) + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z" : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z" : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z" : "");
}
function dsv(delimiter) {
  var reFormat = new RegExp('["' + delimiter + "\n\r]"), DELIMITER = delimiter.charCodeAt(0);
  function parse2(text, f) {
    var convert, columns, rows = parseRows(text, function(row, i) {
      if (convert)
        return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }
  function parseRows(text, f) {
    var rows = [], N = text.length, I = 0, n = 0, t, eof = N <= 0, eol = false;
    if (text.charCodeAt(N - 1) === NEWLINE)
      --N;
    if (text.charCodeAt(N - 1) === RETURN)
      --N;
    function token() {
      if (eof)
        return EOF;
      if (eol)
        return eol = false, EOL;
      var i, j = I, c;
      if (text.charCodeAt(j) === QUOTE) {
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE)
          ;
        if ((i = I) >= N)
          eof = true;
        else if ((c = text.charCodeAt(I++)) === NEWLINE)
          eol = true;
        else if (c === RETURN) {
          eol = true;
          if (text.charCodeAt(I) === NEWLINE)
            ++I;
        }
        return text.slice(j + 1, i - 1).replace(/""/g, '"');
      }
      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE)
          eol = true;
        else if (c === RETURN) {
          eol = true;
          if (text.charCodeAt(I) === NEWLINE)
            ++I;
        } else if (c !== DELIMITER)
          continue;
        return text.slice(j, i);
      }
      return eof = true, text.slice(j, N);
    }
    while ((t = token()) !== EOF) {
      var row = [];
      while (t !== EOL && t !== EOF)
        row.push(t), t = token();
      if (f && (row = f(row, n++)) == null)
        continue;
      rows.push(row);
    }
    return rows;
  }
  function preformatBody(rows, columns) {
    return rows.map(function(row) {
      return columns.map(function(column) {
        return formatValue(row[column]);
      }).join(delimiter);
    });
  }
  function format(rows, columns) {
    if (columns == null)
      columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
  }
  function formatBody(rows, columns) {
    if (columns == null)
      columns = inferColumns(rows);
    return preformatBody(rows, columns).join("\n");
  }
  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }
  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }
  function formatValue(value) {
    return value == null ? "" : value instanceof Date ? formatDate(value) : reFormat.test(value += "") ? '"' + value.replace(/"/g, '""') + '"' : value;
  }
  return {
    parse: parse2,
    parseRows,
    format,
    formatBody,
    formatRows,
    formatRow,
    formatValue
  };
}
var csv = dsv(",");
var csvParse = csv.parse;
const airportsString = `iata,name,city,state,country,latitude,longitude
00M,Thigpen,Bay Springs,MS,USA,31.95376472,-89.23450472
00R,Livingston Municipal,Livingston,TX,USA,30.68586111,-95.01792778
00V,Meadow Lake,Colorado Springs,CO,USA,38.94574889,-104.5698933
01G,Perry-Warsaw,Perry,NY,USA,42.74134667,-78.05208056
01J,Hilliard Airpark,Hilliard,FL,USA,30.6880125,-81.90594389
01M,Tishomingo County,Belmont,MS,USA,34.49166667,-88.20111111
02A,Gragg-Wade,Clanton,AL,USA,32.85048667,-86.61145333
02C,Capitol,Brookfield,WI,USA,43.08751,-88.17786917
02G,Columbiana County,East Liverpool,OH,USA,40.67331278,-80.64140639
03D,Memphis Memorial,Memphis,MO,USA,40.44725889,-92.22696056
04M,Calhoun County,Pittsboro,MS,USA,33.93011222,-89.34285194
04Y,Hawley Municipal,Hawley,MN,USA,46.88384889,-96.35089861
05C,Griffith-Merrillville,Griffith,IN,USA,41.51961917,-87.40109333
05F,Gatesville - City/County,Gatesville,TX,USA,31.42127556,-97.79696778
05U,Eureka,Eureka,NV,USA,39.60416667,-116.0050597
06A,Moton  Municipal,Tuskegee,AL,USA,32.46047167,-85.68003611
06C,Schaumburg,Chicago/Schaumburg,IL,USA,41.98934083,-88.10124278
06D,Rolla Municipal,Rolla,ND,USA,48.88434111,-99.62087694
06M,Eupora Municipal,Eupora,MS,USA,33.53456583,-89.31256917
06N,Randall,Middletown,NY,USA,41.43156583,-74.39191722
06U,Jackpot/Hayden,Jackpot,NV,USA,41.97602222,-114.6580911
07C,Dekalb County,Auburn,IN,USA,41.30716667,-85.06433333
07F,Gladewater Municipal,Gladewater,TX,USA,32.52883861,-94.97174556
07G,Fitch H Beach,Charlotte,MI,USA,42.57450861,-84.81143139
07K,Central City Municipal,Central City,NE,USA,41.11668056,-98.05033639
08A,Wetumpka Municipal,Wetumpka,AL,USA,32.52943944,-86.32822139
08D,Stanley Municipal,Stanley,ND,USA,48.30079861,-102.4063514
08K,Harvard State,Harvard,NE,USA,40.65138528,-98.07978667
08M,Carthage-Leake County,Carthage,MS,USA,32.76124611,-89.53007139
09A,Butler-Choctaw County,Butler,AL,USA,32.11931306,-88.1274625
09J,Jekyll Island,Jekyll Island,GA,USA,31.07447222,-81.42777778
09K,Sargent Municipal,Sargent,NE,USA,41.63695083,-99.34038139
09M,Charleston Municipal,Charleston,MS,USA,33.99150222,-90.078145
09W,South Capitol Street,Washington,DC,USA,38.86872333,-77.00747583
0A3,Smithville Municipal,Smithville,TN,USA,35.98531194,-85.80931806
0A8,Bibb County,Centreville,AL,USA,32.93679056,-87.08888306
0A9,Elizabethton Municipal,Elizabethton,TN,USA,36.37094306,-82.17374111
0AK,Pilot Station,Pilot Station,AK,USA,61.93396417,-162.8929358
0B1,Col. Dyke,Bethel,ME,USA,44.42506444,-70.80784778
0B4,Hartington Municipal,Hartington,NE,USA,42.60355556,-97.25263889
0B5,Turners Falls,Montague,MA,USA,42.59136361,-72.52275472
0B7,Warren-Sugar Bush,Warren,VT,USA,44.11672722,-72.82705806
0B8,Elizabeth,Fishers Island,NY,USA,41.25130806,-72.03161139
0C0,Dacy,Chicago/Harvard,IL,USA,42.40418556,-88.63343222
0C4,Pender Municipal,Pender,NE,USA,42.11388722,-96.72892556
0D1,South Haven Municipal,South Haven,MI,USA,42.35083333,-86.25613889
0D8,Gettysburg Municipal,Gettysburg,SD,USA,44.98730556,-99.9535
0E0,Moriarty,Moriarty,NM,USA,34.98560639,-106.0094661
0E8,Crownpoint,Crownpoint,NM,USA,35.71765889,-108.2015961
0F2,Bowie Municipal,Bowie,TX,USA,33.60166667,-97.77556
0F4,Loup City Municipal,Loup City,NE,USA,41.29028694,-98.99064278
0F7,Fountainhead Lodge Airpark,Eufaula,OK,USA,35.38898833,-95.60165111
0F8,William R Pogue Municipal,Sand Springs,OK,USA,36.17528,-96.15181028
0F9,Tishomingo Airpark,Tishomingo,OK,USA,34.19592833,-96.67555694
0G0,North Buffalo Suburban,Lockport,NY,USA,43.10318389,-78.70334583
0G3,Tecumseh Municipal,Tecumseh,NE,USA,40.39944417,-96.17139694
0G6,Williams County,Bryan,OH,USA,41.46736111,-84.50655556
0G7,Finger Lakes Regional,Seneca Falls,NY,USA,42.88062278,-76.78162028
0H1,Trego Wakeeney,Wakeeney,KS,USA,39.0044525,-99.89289917
0I8,Cynthiana-Harrison County,Cynthiana,KY,USA,38.36674167,-84.28410056
0J0,Abbeville Municipal,Abbeville,AL,USA,31.60016778,-85.23882222
0J4,Florala Municipal,Florala,AL,USA,31.04247361,-86.31156111
0J6,Headland Municipal,Headland,AL,USA,31.364895,-85.30965556
0K7,Humboldt Municipal,Humboldt,IA,USA,42.7360825,-94.24524167
0L5,Goldfield,Goldfield,NV,USA,37.71798833,-117.2384119
0L7,Jean,Jean,NV,USA,35.76827222,-115.3296378
0L9,Echo Bay,Overton,NV,USA,36.31108972,-114.4638672
0M0,Dumas Municipal,Dumas,AR,USA,33.8845475,-91.53429111
0M1,Scott,Parsons,TN,USA,35.63778,-88.127995
0M4,Benton County,Camden,TN,USA,36.01122694,-88.12328833
0M5,Humphreys County,Waverly,TN,USA,36.11659972,-87.73815889
0M6,Panola County,Batesville,MS,USA,34.36677444,-89.90008917
0M8,Byerley,Lake Providence,LA,USA,32.82587917,-91.187665
0O3,Calaveras Co-Maury Rasmussen,San Andreas,CA,USA,38.14611639,-120.6481733
0O4,Corning Municipal,Corning,CA,USA,39.94376806,-122.1713781
0O5,University,Davis,CA,USA,38.53146222,-121.7864906
0Q5,Shelter Cove,Shelter Cove,CA,USA,40.02764333,-124.0733639
0Q6,Shingletown,Shingletown,CA,USA,40.52210111,-121.8177683
0R0,Columbia-Marion County,Columbia,MS,USA,31.29700806,-89.81282944
0R1,Atmore Municipal,Atmore,AL,USA,31.01621528,-87.44675972
0R3,Abbeville Chris Crusta Memorial,Abbeville,LA,USA,29.97576083,-92.08415167
0R4,Concordia Parish,Vidalia,LA,USA,31.56683278,-91.50011889
0R5,David G Joyce,Winnfield,LA,USA,31.96366222,-92.66026056
0R7,Red River,Coushatta,LA,USA,31.99071694,-93.30739306
0S7,Dorothy Scott,Oroville,WA,USA,48.958965,-119.4119622
0S9,Jefferson County International,Port Townsend,WA,USA,48.04981361,-122.8012792
0V2,Harriet Alexander,Salida,CO,USA,38.53916389,-106.0458483
0V3,Pioneer Village,Minden,NE,USA,40.5149125,-98.94565083
0V4,Brookneal/Campbell County,Brookneal,VA,USA,37.14172222,-79.01638889
0V6,Mission Sioux,Mission,SD,USA,43.30694778,-100.6281936
0V7,Kayenta,Kayenta,AZ,USA,36.70972139,-110.2367978
10C,Galt,Chicago/Greenwood/Wonderlake,IL,USA,42.40266472,-88.37588917
10D,Winsted Municipal,Winsted,MN,USA,44.94996278,-94.0669175
10G,Holmes County,Millersburg,OH,USA,40.53716667,-81.95436111
10N,Wallkill,Wallkill,NY,USA,41.62787111,-74.13375583
10U,Owyhee,Owyhee,NV,USA,41.95323306,-116.1876014
11A,Clayton Municipal,Clayton,AL,USA,31.88329917,-85.48491361
11D,Clarion Cty,Clarion,PA,USA,41.22581222,-79.44098972
11IS,Schaumburg Heliport,Chicago/Schaumburg,IL,USA,42.04808278,-88.05257194
11J,Early County,Blakely,GA,USA,31.39698611,-84.89525694
11R,Brenham Municipal,Brenham,TX,USA,30.219,-96.37427778
12C,Rochelle Municipal,Rochelle,IL,USA,41.89300139,-89.07829
12D,Tower Municipal,Tower,MN,USA,47.81833333,-92.29166667
12J,Brewton Municipal,Brewton,AL,USA,31.05126306,-87.06796833
12K,Superior Municipal,Superior,NE,USA,40.04636111,-98.06011111
12Y,Le Sueur Municipal,Le Sueur,MN,USA,44.43746472,-93.91274083
13C,Lakeview,Lakeview,MI,USA,43.45213722,-85.26480333
13K,Eureka Municipal,Eureka,KS,USA,37.8515825,-96.29169806
13N,Trinca,Andover,NJ,USA,40.96676444,-74.78016556
14J,Carl Folsom,Elba,AL,USA,31.40988861,-86.08883583
14M,Hollandale Municipal,Hollandale,MS,USA,33.18262167,-90.83065444
14Y,Todd Field,Long Prairie,MN,USA,45.89857556,-94.87391
15F,Haskell Municipal,Haskell,TX,USA,33.19155556,-99.71793056
15J,Cook County,Adel,GA,USA,31.13780556,-83.45308333
15M,Luka,Luka,MS,USA,34.7723125,-88.16587444
15Z,McCarthy 2,McCarthy,AK,USA,61.43706083,-142.9037372
16A,Nunapitchuk,Nunapitchuk,AK,USA,60.90582833,-162.4391158
16G,Seneca County,Tiffin,OH,USA,41.09405556,-83.2125
16J,Dawson Municipal,Dawson,GA,USA,31.74328472,-84.419285
16S,Myrtle Creek Municipal,Myrtle Creek,OR,USA,42.99845056,-123.3095092
17G,Port Bucyrus-Crawford County,Bucyrus,OH,USA,40.78141667,-82.97469444
17J,Donalsonville Municipal,Donalsonville,GA,USA,31.00694444,-84.87761111
17K,Boise City,Boise City,OK,USA,36.77430028,-102.5104364
17M,Magee Municipal,Magee,MS,USA,31.86127139,-89.80285361
17N,Cross Keys,Cross Keys,NJ,USA,39.70547583,-75.03300306
17Z,Manokotak,Manokotak,AK,USA,58.98896583,-159.0499739
18A,Franklin County,Canon,GA,USA,34.34010472,-83.13348333
18I,McCreary County,Pine Knot,KY,USA,36.69591306,-84.39160389
19A,Jackson County,Jefferson,GA,USA,34.17402472,-83.56066528
19M,C A Moore,Lexington,MS,USA,33.12546111,-90.02555694
19N,Camden,Berlin,NJ,USA,39.77842056,-74.94780389
19P,Port Protection SPB,Port Protection,AK,USA,56.32880417,-133.6100844
1A3,Martin Campbell,Copperhill,TN,USA,35.01619111,-84.34631083
1A5,Macon County,Franklin,NC,USA,35.222595,-83.41904389
1A6,Middlesboro-Bell County,Middlesboro,KY,USA,36.6106375,-83.73741611
1A7,Jackson County,Gainesboro,TN,USA,36.39728139,-85.64164278
1A9,Autauga County,Prattville,AL,USA,32.438775,-86.51044778
1B0,Dexter Regional,Dexter,ME,USA,45.00839444,-69.23976722
1B1,Columbia Cty,Hudson,NY,USA,42.29130028,-73.71031944
1B3,Fair Haven,Fair Haven,VT,USA,43.61534389,-73.27455556
1B9,Mansfield Municipal,Mansfield,MA,USA,42.00013306,-71.19677139
1C5,Clow,Chicago/Plainfield,IL,USA,41.69597444,-88.12923056
1D1,Milbank Municipal,Milbank,SD,USA,45.23053806,-96.56596556
1D2,Canton -Plymouth -  Mettetal,Plymouth,MI,USA,42.35003667,-83.45826833
1D3,Platte Municipal,Platte,SD,USA,43.40332833,-98.82952972
1D6,Hector Municipal,Hector,MN,USA,44.73107278,-94.71471333
1D7,Webster Municipal,Webster,SD,USA,45.29329111,-97.51369889
1D8,Redfield Municipal,Redfield,SD,USA,44.86247611,-98.52953972
1F0,Downtown Ardmore,Ardmore,OK,USA,34.14698917,-97.12265194
1F1,Lake Murray State Park,Overbrook,OK,USA,34.07509694,-97.10667917
1F4,Madill Municipal,Madill,OK,USA,34.14040194,-96.81203222
1F9,Bridgeport Municipal,Bridgeport,TX,USA,33.17533333,-97.82838889
1G0,Wood County,Bowling Green,OH,USA,41.391,-83.63013889
1G3,Kent State University,Kent,OH,USA,41.15186167,-81.41658306
1G4,Grand Canyon West,Peach Springs,AZ,USA,35.99221,-113.8166164
1G5,Freedom,Medina,OH,USA,41.13144444,-81.76491667
1G6,Michael,Cicero,NY,USA,43.18166667,-76.12777778
1H0,Creve Coeur,St Louis,MO,USA,38.72752,-90.50830417
1H2,Effingham County Memorial,Effingham,IL,USA,39.07045083,-88.53351972
1H3,Linn State Tech. College,Linn,MO,USA,38.47149444,-91.81531667
1H8,Casey Municipal,Casey,IL,USA,39.30250917,-88.00406194
1I5,Freehold,Freehold,NY,USA,42.36425,-74.06596806
1I9,Delphi Municipal,Delphi,IN,USA,40.54281417,-86.68167194
1J0,Tri-County,Bonifay,FL,USA,30.84577778,-85.60138889
1K2,Lindsay Municipal,Lindsay,OK,USA,34.85007333,-97.58642028
1K4,David J. Perry,Goldsby,OK,USA,35.1550675,-97.47039389
1K5,Waynoka Municipal,Waynoka,OK,USA,36.56670028,-98.85231333
1K9,Satanta Municipal,Satanta,KS,USA,37.45419111,-100.9921119
1L0,St. John the Baptist Parish,Reserve,LA,USA,30.08720833,-90.58266528
1L1,Lincoln Co,Panaca,NV,USA,37.78746444,-114.4216567
1L7,Escalante Municipal,Escalante,UT,USA,37.74532639,-111.5701653
1L9,Parowan,Parowan,UT,USA,37.85969694,-112.816055
1M1,North Little Rock Municipal,No Lit Rock,AR,USA,34.83398056,-92.25792778
1M2,Belzoni Municipal,Belzoni,MS,USA,33.14518056,-90.51528472
1M4,Posey,Haleyville,AL,USA,34.28034806,-87.60044139
1M5,Portland Municipal,Portland,TN,USA,36.59287528,-86.47691028
1M7,Fulton,Fulton,KY,USA,36.52589417,-88.91561611
1MO,Mountain Grove Memorial,Mountain Grove,MO,USA,37.12071889,-92.311245
1N2,Spadaro,East Moriches,NY,USA,40.82787639,-72.74871083
1N4,Woodbine Muni,Woodbine,NJ,USA,39.21915,-74.794765
1N7,Blairstown,Blairstown,NJ,USA,40.97114556,-74.99747556
1N9,Allentown Queen City Muni,Allentown,PA,USA,40.57027778,-75.48830556
1ND3,Hamry,Kindred,ND,USA,46.6485775,-97.00564306
1O1,Grandfield Municipal,Grandfield,OK,USA,34.23758944,-98.74200917
1O2,Lampson,Lakeport,CA,USA,38.99017472,-122.8997175
1O3,Lodi,Lodi,CA,USA,38.20241667,-121.2684167
1O4,Thomas Municipal,Thomas,OK,USA,35.73338222,-98.73063833
1O6,Dunsmuir Municipal-Mott,Dunsmuir,CA,USA,41.26320889,-122.2719528
1R1,Jena,Jena,LA,USA,31.671005,-92.15846722
1R7,Brookhaven-Lincoln County,Brookhaven,MS,USA,31.6058475,-90.40931583
1R8,Bay Minette Municipal,Bay Minette,AL,USA,30.87046278,-87.81738167
1S0,Pierce County,Puyallup,WA,USA,47.10391667,-122.2871944
1S3,Tillitt,Forsyth,MT,USA,46.27110639,-106.6239206
1S5,Sunnyside Municipal,Sunnyside,WA,USA,46.32763139,-119.9705964
1S6,Priest River Muni,Priest River,ID,USA,48.19018611,-116.9093644
1U7,Bear Lake County,Paris,ID,USA,42.24714972,-111.33826
1V0,Navajo State Park,Navajo Dam,NM,USA,36.80833833,-107.6514444
1V2,Grant County,Hyannis,NE,USA,42.00942944,-101.7693439
1V5,Boulder Muni,Boulder,CO,USA,40.03942972,-105.2258217
1V6,Fremont County,Canon City,CO,USA,38.42838111,-105.1054994
1V9,Blake,Delta,CO,USA,38.78539722,-108.0636611
20A,Robbins,Oneonta,AL,USA,33.97231972,-86.37942722
20M,Macon Municipal,Macon,MS,USA,33.13345889,-88.53559806
20N,Kingston-Ulster,Kingston,NY,USA,41.9852525,-73.96409722
20U,Beach,Beach,ND,USA,46.92362444,-103.9785389
20V,McElroy Airfield,Kremmling,CO,USA,40.05367972,-106.3689467
21D,Lake Elmo,St Paul,MN,USA,44.99748861,-92.85568111
21F,Jacksboro Municipal,Jacksboro,TX,USA,33.228725,-98.14671083
22B,Mountain Meadow Airstrip,Burlington,CT,USA,41.77287528,-73.01121667
22I,Vinton County,McArthur,OH,USA,39.328125,-82.44182167
22M,Pontotoc County,Pontotoc,MS,USA,34.27593833,-89.03839694
22N,Carbon Cty-Jake Arner Memorial,Lehighton,PA,USA,40.80950889,-75.76149639
23J,Herlong,Jacksonville,FL,USA,30.27778889,-81.80594722
23M,Clarke County,Quitman,MS,USA,32.08487111,-88.73893389
23N,Bayport Aerodrome,Bayport,NY,USA,40.75843139,-73.05372083
23R,Devine Municipal,Devine,TX,USA,29.1384075,-98.94189028
24A,Jackson County,Sylva,NC,USA,35.3168625,-83.20936806
24J,Suwannee County,Live Oak,FL,USA,30.30105583,-83.02318778
24N,Jicarilla Apache Nation,Dulce,NM,USA,36.828535,-106.8841914
25J,Cuthbert-Randolph,Cuthbert,GA,USA,31.70016583,-84.82492194
25M,Ripley,Ripley,MS,USA,34.72226778,-89.01504944
25R,International,Edinburg,TX,USA,26.44201083,-98.12945306
26A,Ashland/Lineville,Ashland/Lineville,AL,USA,33.28761417,-85.80412861
26N,Ocean City Muni cipal,Ocean City,NJ,USA,39.26347222,-74.60747222
26R,Jackson County,Edna/Ganado,TX,USA,29.00101,-96.58194667
26U,McDermitt State,McDermitt,OR,USA,42.00211083,-117.7231972
27A,Elbert County-Patz,Elberton,GA,USA,34.09519722,-82.81586417
27D,Myers,Canby,MN,USA,44.72801889,-96.26309972
27J,Newberry Municipal,Newberry,SC,USA,34.30927778,-81.63972222
27K,Georgetown-Scott County,Georgetown,KY,USA,38.23442528,-84.43468667
28J,Kay Larkin,Palatka,FL,USA,29.65863889,-81.68855556
29D,Grove City,Grove City,PA,USA,41.14597611,-80.16592194
29G,Portage County,Ravenna,OH,USA,41.210195,-81.25163083
29S,Gardiner,Gardiner,MT,USA,45.04993556,-110.7466008
2A0,Mark Anton,Dayton,TN,USA,35.48624611,-84.93109722
2A1,Jamestown Municipal,Jamestown,TN,USA,36.34970833,-84.94664472
2A3,Larsen Bay,Larsen Bay,AK,USA,57.53510667,-153.9784169
2A9,Kotlik,Kotlik,AK,USA,63.03116111,-163.5299278
2AK,Lime Village,Lime Village,AK,USA,61.35848528,-155.4403508
2B3,Parlin,Newport,NH,USA,43.38812944,-72.18925417
2B7,Pittsfield Municipal,Pittsfield,ME,USA,44.76852778,-69.37441667
2B9,Post Mills,Post Mills,VT,USA,43.884235,-72.25370333
2D1,Barber,Alliance,OH,USA,40.97089139,-81.09981889
2D5,Oakes Municipal,Oakes,ND,USA,46.17301972,-98.07987556
2F5,Lamesa Municipal,Lamesa,TX,USA,32.75627778,-101.9194722
2F6,Skiatook Municipal,Skiatook,OK,USA,36.357035,-96.01138556
2F7,Commerce Municipal,Commerce,TX,USA,33.29288889,-95.89641806
2F8,Morehouse Memorial,Bastrop,LA,USA,32.75607944,-91.88057194
2G2,Jefferson County Airpark,Steubenville,OH,USA,40.35944306,-80.70007806
2G3,Connellsville,Connellsville,PA,USA,39.95893667,-79.65713306
2G4,Garrett County,Oakland,MD,USA,39.58027778,-79.33941667
2G9,Somerset County,Somerset,PA,USA,40.03911111,-79.01455556
2H0,Shelby County,Shelbyville,IL,USA,39.41042861,-88.8454325
2H2,Aurora Memorial Municipal,Aurora,MO,USA,36.96230778,-93.69531111
2I0,Madisonville Municipal,Madisonville,KY,USA,37.35502778,-87.39963889
2I5,Chanute,Rantoul,IL,USA,40.29355556,-88.14236111
2IS,Airglades,Clewiston,FL,USA,26.74200972,-81.04978917
2J2,Liberty County,Hinesville,GA,USA,31.78461111,-81.64116667
2J3,Louisville Municipal,Louisville,GA,USA,32.98654083,-82.38568139
2J5,Millen,Millen,GA,USA,32.89376972,-81.96511583
2J9,Quincy Municipal,Quincy,FL,USA,30.59786111,-84.55741667
2K3,Stanton County Municipal,Johnson,KS,USA,37.58271111,-101.73281
2K4,Scott,Mangum,OK,USA,34.89172583,-99.52675667
2K5,Telida,Telida,AK,USA,63.39387278,-153.2689733
2M0,Princeton-Caldwell County,Princeton,KY,USA,37.11560444,-87.85556944
2M2,Lawrenceburg Municipal,Lawrenceburg,TN,USA,35.2343025,-87.25793222
2M3,Sallisaw Municipal,Sallisaw,OK,USA,35.43816667,-94.80277778
2M4,G. V. Montgomery,Forest,MS,USA,32.35347778,-89.48867944
2M8,Charles W. Baker,Millington,TN,USA,35.27897583,-89.93147611
2O1,Gansner,Quincy,CA,USA,39.94378056,-120.9468983
2O3,Angwin-Parrett,Angwin,CA,USA,38.57851778,-122.4352572
2O6,Chowchilla,Chowchilla,CA,USA,37.11244417,-120.2468406
2O7,Independence,Independence,CA,USA,36.81382111,-118.2050956
2O8,Hinton Municipal,Hinton,OK,USA,35.50592472,-98.34236111
2P2,Washington Island,Washington Island,WI,USA,45.38620833,-86.92448056
2Q3,Yolo Co-Davis/Woodland/Winters,Davis/Woodland/Winters,CA,USA,38.5790725,-121.8566322
2R0,Waynesboro Municipal,Waynesboro,MS,USA,31.64599472,-88.63475667
2R4,Peter Prince,Milton,FL,USA,30.63762083,-86.99365278
2R5,St Elmo,St Elmo,AL,USA,30.50190833,-88.27511667
2R9,Karnes County,Kenedy,TX,USA,28.8250075,-97.86558333
2S1,Vashon Municipal,Vashon,WA,USA,47.45815333,-122.4773506
2S6,Sportsman Airpark,Newberg,OR,USA,45.29567333,-122.9553783
2S7,Chiloquin State,Chiloquin,OR,USA,42.58319167,-121.8761261
2S8,Wilbur,Wilbur,WA,USA,47.75320639,-118.7438936
2T1,Muleshoe Municipal,Muleshoe,TX,USA,34.18513639,-102.6410981
2V1,Stevens,Pagosa Springs,CO,USA,37.277505,-107.0558742
2V2,Vance Brand,Longmont,CO,USA,40.16367139,-105.1630369
2V5,Wray Municipal,Wray,CO,USA,40.10032333,-102.24096
2V6,Yuma Municipal,Yuma,CO,USA,40.10415306,-102.7129869
2W5,Maryland,Indian Head,MD,USA,38.60053667,-77.07296917
2W6,Captain Walter Francis Duke Regional,Leonardtown,MD,USA,38.31536111,-76.55011111
2Y3,Yakutat SPB,Yakutat,AK,USA,59.5624775,-139.7410994
2Y4,Rockwell City Municipal,Rockwell City,IA,USA,42.38748056,-94.61803333
31F,Gaines County,Seminole,TX,USA,32.67535389,-102.652685
32M,Norfolk,Norfolk,MA,USA,42.12787528,-71.37033556
32S,Stevensville,Stevensville,MT,USA,46.52511111,-114.0528056
33J,Geneva Municipal,Geneva,AL,USA,31.05527778,-85.88033333
33M,Water Valley,Water Valley,MS,USA,34.16677639,-89.68619722
33N,Delaware Airpark,Dover,DE,USA,39.21837556,-75.59642667
33S,Pru,Ritzville,WA,USA,47.12487194,-118.3927539
34A,Laurens County,Laurens,SC,USA,34.50705556,-81.94719444
35A,"Union County, Troy Shelton",Union,SC,USA,34.68680111,-81.64121167
35D,Padgham,Allegan,MI,USA,42.53098278,-85.82513556
35S,Wasco State,Wasco,OR,USA,45.58944444,-120.6741667
36K,Lakin,Lakin,KS,USA,37.96946389,-101.2554472
36S,Happy Camp,Happy Camp,CA,USA,41.79067944,-123.3889444
36U,Heber City Municipal/Russ McDonald,Heber,UT,USA,40.48180556,-111.4288056
37T,Calico Rock-Izard County,Calico Rock,AR,USA,36.16565278,-92.14523611
37W,Harnett County,Erwin,NC,USA,35.37880028,-78.73362917
38A,Shaktoolik,Shaktoolik,AK,USA,64.36263194,-161.2025369
38S,Deer Lodge-City-County,Deer Lodge,MT,USA,46.38881583,-112.7669842
38U,Wayne Wonderland,Loa,UT,USA,38.36247972,-111.5960164
39N,Princeton,Princeton,NJ,USA,40.39834833,-74.65760361
3A0,Grove Hill Municipal,Grove Hill,AL,USA,31.68932389,-87.7613875
3A1,Folsom,Cullman,AL,USA,34.26870833,-86.85833611
3A2,New Tazewell Municipal,Tazewell,TN,USA,36.41008417,-83.55546167
3A3,Anson County,Wadesboro,NC,USA,35.02397611,-80.08127333
3AU,Augusta Municipal,Augusta,KS,USA,37.67162778,-97.07787222
3B0,Southbridge Municipal,Southbridge,MA,USA,42.10092806,-72.03840833
3B1,Greenville Municipal,Greenville,ME,USA,45.46302778,-69.55161111
3B2,Marshfield,Marshfield,MA,USA,42.09824111,-70.67212083
3B9,Chester,Chester,CT,USA,41.38390472,-72.50589444
3BS,Jack Barstow,Midland,MI,USA,43.66291528,-84.261325
3CK,Lake In The Hills,Lake In The Hills,IL,USA,42.20680306,-88.32304028
3CM,James Clements Municipal,Bay City,MI,USA,43.54691667,-83.89550222
3CU,Cable Union,Cable,WI,USA,46.19424889,-91.24640972
3D2,Ephraim/Gibraltar,Ephraim,WI,USA,45.13535778,-87.18586556
3D4,Frankfort Dow Memorial,Frankfort,MI,USA,44.62506389,-86.20061944
3F3,De Soto Parish,Mansfield,LA,USA,32.07345972,-93.76551889
3F4,Vivian,Vivian,LA,USA,32.86133333,-94.01015361
3F7,Jones Memorial,Bristow,OK,USA,35.80685278,-96.42185556
3FM,Fremont Municipal,Fremont,MI,USA,43.43890528,-85.99478
3FU,Faulkton Municipal,Faulkton,SD,USA,45.03191861,-99.11566417
3G3,Wadsworth Municipal,Wadsworth,OH,USA,41.00158222,-81.75513111
3G4,Ashland County,Ashland,OH,USA,40.90297222,-82.25563889
3G7,Williamson/Sodus,Williamson,NY,USA,43.23472222,-77.12097222
3GM,Grand Haven Memorial Airpark,Grand Haven,MI,USA,43.03404639,-86.1981625
3I2,Mason County,Point Pleasant,WV,USA,38.91463889,-82.09858333
3I7,Phillipsburg,Phillipsburg,OH,USA,39.91344194,-84.40030889
3J1,Ridgeland,Ridgeland,SC,USA,32.49268694,-80.99233028
3J7,Greene County Airpark,Greensboro,GA,USA,33.59766667,-83.139
3JC,Freeman,Junction City,KS,USA,39.04327556,-96.84328694
3K3,Syracuse-Hamilton County Municipal,Syracuse,KS,USA,37.99167972,-101.7462822
3K6,St Louis-Metro East,Troy/Marine/St. Louis,IL,USA,38.73290861,-89.80656722
3K7,Mark Hoard Memorial,Leoti,KS,USA,38.45696333,-101.3532161
3LC,Logan County,Lincoln,IL,USA,40.15847222,-89.33497222
3LF,Litchfield Municipal,Litchfield,IL,USA,39.16635306,-89.67489694
3M7,Lafayette Municipal,Lafayette,TN,USA,36.518375,-86.05828083
3M8,North Pickens,Reform,AL,USA,33.38900611,-88.00557806
3M9,Warren Municipal,Warren,AR,USA,33.56044333,-92.08538861
3MY,Mt. Hawley Auxiliary,Peoria,IL,USA,40.79525917,-89.6134025
3N6,Old Bridge,Old Bridge,NJ,USA,40.32988667,-74.34678694
3N8,Mahnomen County,Mahnomen,MN,USA,47.25996056,-95.92809778
3ND0,Northwood Municipal,Northwood,ND,USA,47.72423333,-97.59042222
3O1,Gustine,Gustine,CA,USA,37.26271722,-120.9632586
3O3,Municipal,Purcell,OK,USA,34.97979444,-97.38586167
3O4,Sayre Municipal,Sayre,OK,USA,35.16755222,-99.65787361
3O5,Walters Municipal,Walters,OK,USA,34.37258444,-98.40588583
3O7,Hollister Municipal,Hollister,CA,USA,36.89334528,-121.4102706
3O9,Grand Lake Regional,Afton,OK,USA,36.5775775,-94.86190028
3R0,Beeville Municipal,Beeville,TX,USA,28.36455528,-97.79208194
3R1,Bay City Municipal,Bay City,TX,USA,28.973255,-95.86345528
3R2,Le Gros Memorial,Crowley,LA,USA,30.16173611,-92.48396111
3R4,Hart,Many,LA,USA,31.54489667,-93.48645306
3R7,Jennings,Jennings,LA,USA,30.24269333,-92.67344778
3S4,Illinois Valley,Illinois Valley (Cave Junction),OR,USA,42.10372417,-123.6822911
3S8,Grants Pass,Grants Pass,OR,USA,42.51011722,-123.3879894
3S9,Condon State-Pauling,Condon,OR,USA,45.24651889,-120.1664233
3SG,Harry W Browne,Saginaw - H.Browne,MI,USA,43.43341028,-83.86245833
3SQ,St Charles,St Charles,MO,USA,38.84866139,-90.50011833
3T3,Boyceville Municipal,Boyceville,WI,USA,45.042185,-92.0293475
3T5,Fayette Regional Air Center,La Grange,TX,USA,29.90930556,-96.9505
3TR,Jerry Tyler Memorial,Niles,MI,USA,41.83590806,-86.22517611
3U3,Bowman,Anaconda,MT,USA,46.15313278,-112.86784
3U7,Benchmark,Benchmark,MT,USA,47.48133194,-112.8697678
3U8,Big Sandy,Big Sandy,MT,USA,48.16247972,-110.1132631
3V4,Fort Morgan Municipal,Fort Morgan,CO,USA,40.33423194,-103.8039508
3WO,Shawano Municipal,Shawano,WI,USA,44.78777778,-88.56152444
3Y2,George L Scott Municipal,West Union,IA,USA,42.98508917,-91.79060417
3Y3,Winterset Madison County,Winterset,IA,USA,41.36276778,-94.02106194
3Z9,Haines SPB,Haines,AK,USA,59.23495111,-135.4407181
40J,Perry-Foley,Perry,FL,USA,30.06927778,-83.58058333
40N,Chester Cty-G O Carlson,Coatesville,PA,USA,39.97897222,-75.86547222
40U,Manila,Manila,UT,USA,40.98607,-109.6784811
41U,Manti-Ephraim,Manti,UT,USA,39.32912833,-111.6146397
42A,Melbourne Municipal,Melbourne,AR,USA,36.07079222,-91.82914667
42C,White Cloud,White Cloud,MI,USA,43.55974139,-85.77421944
42J,Keystone Airpark,Keystone Heights,FL,USA,29.84475,-82.04752778
42S,Poplar,Poplar,MT,USA,48.11595861,-105.1821928
43A,Montgomery County,Star,NC,USA,35.38819528,-79.79281667
44B,Dover/Foxcroft,Dover-Foxcroft,ME,USA,45.18338806,-69.2328225
44N,Sky Acres,Millbrook,NY,USA,41.70742861,-73.73802889
45J,Rockingham-Hamlet,Rockingham,NC,USA,34.89107083,-79.75905806
45OH,North Bass Island,North Bass Island,OH,USA,41.71932528,-82.82196917
45R,Kountz - Hawthorne,Kountze/Silsbee,TX,USA,30.33633806,-94.25754361
46A,Blairsville,Blairsville,GA,USA,34.85508722,-83.996855
46D,Carrington Municipal,Carrington,ND,USA,47.45111111,-99.15111111
46N,Sky Park,Red Hook,NY,USA,41.98458333,-73.83596556
47A,Cherokee County,Canton,GA,USA,34.31058333,-84.42391667
47J,Cheraw Municipal,Cheraw,SC,USA,34.71258333,-79.95794444
47N,Central Jersey Regional,Manville,NJ,USA,40.52438417,-74.59839194
47V,Curtis Municipal,Curtis,NE,USA,40.63750778,-100.4712539
48A,Cochran,Cochran,GA,USA,32.39936111,-83.27591667
48D,Clare Municipal,Clare,MI,USA,43.83111111,-84.74133333
48I,Braxton County,Sutton,WV,USA,38.68704444,-80.65176083
48K,Ness City Municipal,Ness City,KS,USA,38.47110278,-99.90806667
48S,Harlem,Harlem,MT,USA,48.56666472,-108.7729339
48V,Tri-County,Erie,CO,USA,40.010225,-105.047975
49A,Gilmer County,Ellijay,GA,USA,34.62786417,-84.52492889
49T,Downtown Heliport,Dallas,TX,USA,32.77333333,-96.80027778
49X,Chemehuevi Valley,Chemehuevi Valley,CA,USA,34.52751083,-114.4310697
49Y,Fillmore County,Preston,MN,USA,43.67676,-92.17973444
4A2,Atmautluak,Atmautluak,AK,USA,60.86674556,-162.2731389
4A4,Cornelius-Moore,Cedartown,GA,USA,34.01869444,-85.14647222
4A5,Marshall-Searcy County,Marshall,AR,USA,35.89893667,-92.65588611
4A6,Scottsboro Municipal,Scottsboro,AL,USA,34.68897278,-86.0058125
4A7,Clayton County,Hampton,GA,USA,33.38911111,-84.33236111
4A9,Isbell,Fort Payne,AL,USA,34.4728925,-85.72221722
4B0,South Albany,South Bethlehem,NY,USA,42.56072611,-73.83395639
4B1,Duanesburg,Duanesburg,NY,USA,42.75840889,-74.13290472
4B6,Ticonderoga Muni,Ticonderoga,NY,USA,43.87700278,-73.41317639
4B7,Schroon Lake,Schroon Lake,NY,USA,43.86256083,-73.74262972
4B8,Robertson,Plainville,CT,USA,41.69037667,-72.8648225
4B9,Simsbury Tri-Town,Simsbury,CT,USA,41.91676389,-72.77731778
4C8,Albia Municipal,Albia,IA,USA,40.99445361,-92.76297194
4D0,Abrams Municipal,Grandledge,MI,USA,42.77420167,-84.73309806
4D9,Alma Municipal,Alma,NE,USA,40.11389972,-99.34565306
4F2,Panola County-Sharpe,Carthage,TX,USA,32.17608333,-94.29880556
4F4,Gilmer-Upshur County,Gilmer,TX,USA,32.699,-94.94886111
4G1,Greenville Muni,Greenville,PA,USA,41.44683167,-80.39126167
4G2,Hamburg Inc.,Hamburg,NY,USA,42.7008925,-78.91475694
4G5,Monroe County,Woodsfield,OH,USA,39.77904472,-81.10277222
4G6,Hornell Muni,Hornell,NY,USA,42.38214444,-77.6821125
4G7,Fairmont Muni,Fairmont,WV,USA,39.44816667,-80.16702778
4I0,Mingo County,Williamson,WV,USA,37.68760139,-82.26097306
4I3,Knox County,Mount Vernon,OH,USA,40.32872222,-82.52377778
4I7,Putnam County,Greencastle,IN,USA,39.63359556,-86.8138325
4I9,Morrow County,Mt. Gilead,OH,USA,40.52452778,-82.85005556
4J1,Brantley County,Nahunta,GA,USA,31.21272417,-81.90539083
4J2,Berrien County,Nashville,GA,USA,31.21255556,-83.22627778
4J5,Quitman-Brooks County,Quitman,GA,USA,30.80575139,-83.58654889
4J6,St Marys,St Marys,GA,USA,30.75468028,-81.55731917
4K0,Pedro Bay,Pedro Bay,AK,USA,59.78960972,-154.1238331
4K5,Ouzinkie,Ouzinkie,AK,USA,57.92287611,-152.5005111
4K6,Bloomfield Municipal,Bloomfield,IA,USA,40.73210556,-92.42826889
4KA,Tununak,Tununak,AK,USA,60.57559667,-165.2731272
4M1,Carroll County,Berryville,AR,USA,36.38340333,-93.61685667
4M3,Carlisle Municipal,Carlisle,AR,USA,34.80823,-91.71205083
4M4,Clinton Municipal,Clinton,AR,USA,35.59785528,-92.45182472
4M7,Russellville-Logan County,Russellville,KY,USA,36.79991667,-86.81016667
4M8,Clarendon Municipal,Clarendon,AR,USA,34.64870694,-91.39457111
4M9,Corning Municipal,Corning,AR,USA,36.40423139,-90.64792639
4N1,Greenwood Lake,West Milford,NJ,USA,41.12854806,-74.34584611
4O3,Blackwell-Tonkawa Municipal,Blackwell-Tonkawa,OK,USA,36.74511583,-97.34959972
4O4,McCurtain County Regional,Idabel,OK,USA,33.909325,-94.85835278
4O5,Cherokee Municipal,Cherokee,OK,USA,36.78336306,-98.35035083
4PH,Polacca,Polacca,AZ,USA,35.79167222,-110.4234653
4R1,I H Bass Jr Memorial,Lumberton,MS,USA,31.01546028,-89.48256556
4R3,Jackson Municipal,Jackson,AL,USA,31.47210861,-87.89472083
4R4,Fairhope Municipal,Fairhope,AL,USA,30.4621125,-87.87801972
4R5,Madeline Island,La Pointe,WI,USA,46.78865556,-90.75866944
4R7,Eunice,Eunice,LA,USA,30.46628389,-92.42379917
4R9,Dauphin Island,Dauphin Island,AL,USA,30.26048083,-88.12749972
4S1,Gold Beach Muni,Gold Beach,OR,USA,42.41344444,-124.4242742
4S2,Hood River,Hood River,OR,USA,45.67261833,-121.5364625
4S3,Joseph State,Joseph,OR,USA,45.35709583,-117.2532244
4S9,Portland-Mulino,Mulino (Portland),OR,USA,45.21632417,-122.5900839
4SD,Reno/Stead,Reno,NV,USA,39.66738111,-119.8754169
4T6,Mid-Way,Midlothian-Waxahachie,TX,USA,32.45609722,-96.91240972
4U3,Liberty County,Chester,MT,USA,48.51072222,-110.9908639
4U6,Circle Town County,Circle,MT,USA,47.41861972,-105.5619431
4V0,Rangely,Rangely,CO,USA,40.09469917,-108.7612172
4V1,Johnson,Walsenburg,CO,USA,37.69640056,-104.7838747
4V9,Antelope County,Neligh,NE,USA,42.11222889,-98.0386775
4W1,Elizabethtown Municipal,Elizabethtown,NC,USA,34.60183722,-78.57973306
4Z4,Holy Cross,Holy Cross,AK,USA,62.18829583,-159.7749503
4Z7,Hyder SPB,Hyder,AK,USA,55.90331972,-130.0067031
50I,Kentland Municipal,Kentland,IN,USA,40.75873222,-87.42821917
50J,Berkeley County,Moncks Corner,SC,USA,33.18605556,-80.03563889
50K,Pawnee City Municipal,Pawnee City,NE,USA,40.11611111,-96.19445278
50R,Lockhart Municipal,Lockhart,TX,USA,29.85033333,-97.67241667
51D,Edgeley Municipal,Edgeley,ND,USA,46.34858333,-98.73555556
51Z,Minto (New),Minto,AK,USA,65.14370889,-149.3699647
52A,Madison Municipal,Madison,GA,USA,33.61212528,-83.46044333
52E,Timberon,Timberon,NM,USA,32.63388889,-105.6863889
52J,Lee County,Bishopville,SC,USA,34.24459889,-80.23729333
53A,"Dr. C.P. Savage, Sr.",Montezuma,GA,USA,32.302,-84.00747222
53K,Osage City Municipal,Osage City,KS,USA,38.63334222,-95.80859806
54J,Defuniak Springs,Defuniak Springs,FL,USA,30.7313,-86.15160833
55D,Grayling Army Airfield,Grayling,MI,USA,44.68032028,-84.72886278
55J,Fernandina Beach Municipal,Fernandina Beach,FL,USA,30.61170083,-81.462345
55S,Packwood,Packwood,WA,USA,46.60400083,-121.6778664
56D,Wyandot County,Upper Sandusky,OH,USA,40.88336139,-83.3145325
56M,Warsaw Municipal,Warsaw,MO,USA,38.34688889,-93.345425
56S,Seaside Municipal,Seaside,OR,USA,46.01649694,-123.9054167
57B,Islesboro,Islesboro,ME,USA,44.30285556,-68.91058722
57C,East Troy Municipal,East Troy,WI,USA,42.79711111,-88.3725
59B,Newton,Jackman,ME,USA,45.63199111,-70.24728944
5A4,Okolona Mun.-Richard M. Stovall,Okolona,MS,USA,34.01580528,-88.72618944
5A6,Winona-Montgomery County,Winona,MS,USA,33.46540139,-89.72924806
5A8,Aleknagik,Aleknagik,AK,USA,59.28256167,-158.6176725
5A9,Roosevelt Memorial,Warm Springs,GA,USA,32.93346222,-84.68881639
5B2,Saratoga Cty,Saratoga Springs,NY,USA,43.05126111,-73.86119444
5B3,Danielson,Danielson,CT,USA,41.81974056,-71.90096306
5B7,Rensselaer Air Park,Troy,NY,USA,42.69091194,-73.57956
5CD,Chandalar Shelf,Chandalar Camp,AK,USA,68.06543944,-149.5797392
5D3,Owosso Community,Owosso,MI,USA,42.99297222,-84.1389125
5F1,Post-Garza County Municipal,Post,TX,USA,33.20370556,-101.340415
5F4,Homer Municipal,Homer,LA,USA,32.78850806,-93.00366083
5G0,Leroy,Le Roy,NY,USA,42.98136667,-77.93751389
5G7,Bluffton,Bluffton,OH,USA,40.88544444,-83.86863889
5G8,Pittsburgh Boquet Airpark,Jeanette,PA,USA,40.37645722,-79.60837583
5G9,Toledo Suburban,Lambertville,MI,USA,41.7358775,-83.65541056
5HO,Hope,Hope,AK,USA,60.90415028,-149.6238389
5I4,Sheridan,Sheridan,IN,USA,40.17792583,-86.21729889
5J0,John Day State,John Day,OR,USA,44.40416667,-118.9625
5J9,Twin City,Loris,SC,USA,34.08848361,-78.86462028
5K2,Tribune Municipal,Tribune,KS,USA,38.45418222,-101.7462828
5M0,Rountree,Hartselle,AL,USA,34.40823444,-86.93295056
5M1,De Witt Municipal,De Witt,AR,USA,34.2626,-91.30984194
5M4,Fordyce Municipal,Fordyce,AR,USA,33.84593722,-92.36542861
5M9,Marion-Crittenden County,Marion,KY,USA,37.33616222,-88.11113611
5N8,Casselton Regional,Casselton,ND,USA,46.85469528,-97.20870028
5ND6,Hillsboro Municipal,Hillsboro,ND,USA,47.35940778,-97.06041639
5NI,Nikolai,Nikolai,AK,USA,63.0174475,-154.3639608
5NK,Naknek,Naknek,AK,USA,58.73288056,-157.0199197
5NN,Nondalton,Nondalton,AK,USA,59.97904306,-154.8396944
5R3,Rusty Allen,Lago Vista,TX,USA,30.498585,-97.96947222
5R4,Foley Municipal,Foley,AL,USA,30.42769722,-87.70082
5R5,Wharton Municipal,Wharton,TX,USA,29.25427778,-96.15438889
5R8,De Quincy Industrial Airpark,De Quincy,LA,USA,30.44117222,-93.47349722
5S8,St. Michael,St. Michael,AK,USA,63.49005056,-162.1103692
5T5,Hillsboro Municipal,Hillsboro,TX,USA,32.08348611,-97.09722722
5T6,Dona Ana County  At Santa Teresa,Santa Teresa,NM,USA,31.88098556,-106.7048131
5T9,Maverick County Meml Intl,Eagle Pass,TX,USA,28.85719361,-100.5122997
5TE,Tetlin,Tetlin,AK,USA,63.13382361,-142.5219339
5U3,Ennis - Big Sky,Ennis,MT,USA,45.27175833,-111.6486389
5U8,Geraldine,Geraldine,MT,USA,47.59664,-110.2660367
5V5,Shiprock Airstrip,Shiprock,NM,USA,36.6977775,-108.7011986
5V8,Kadoka Municipal,Kadoka,SD,USA,43.83332611,-101.4970881
5W8,Siler City Municipal,Siler City,NC,USA,35.7029175,-79.50529972
5Z1,Juneau Harbor,Juneau,AK,USA,58.29888889,-134.4077778
5Z5,Kantishna,Kantishna,AK,USA,63.54171472,-150.9939547
60F,Seymour Municipal,Seymour,TX,USA,33.64870417,-99.26063056
60J,Ocean Isle,Ocean Isle Beach,NC,USA,33.90850556,-78.43667222
61A,Camden Municipal,Camden,AL,USA,31.97987056,-87.33888056
61B,Boulder City Municipal,Boulder City,NV,USA,35.94748028,-114.8610967
61C,Fort Atkinson Municipal,Fort Atkinson,WI,USA,42.96320278,-88.81762806
61J,Portland Downtown Heliport,Portland,OR,USA,45.52527778,-122.6709289
61S,Cottage Grove State,Cottage Grove,OR,USA,43.79984528,-123.0289678
62D,Warren,Warren,OH,USA,41.26672278,-80.92897778
62H,Giddings-Lee County,Giddings,TX,USA,30.16927167,-96.98001083
62S,Christmas Valley,Christmas Valley,OR,USA,43.23653139,-120.6660967
63A,Lloyd R. Roundtree Seaplane Facility,Petersburg,AK,USA,56.81131972,-132.9600567
63C,Adams County Legion,Adams/Friendship,WI,USA,43.96117222,-89.78804889
63S,Colville Municipal,Colville,WA,USA,48.54156944,-117.8844247
65J,Wrens Memorial,Wrens,GA,USA,33.222645,-82.38373611
65S,Boundary County,Bonners Ferry,ID,USA,48.72632639,-116.2954761
66D,Sturgis Municipal,Sturgis,SD,USA,44.41761111,-103.3747778
67L,Mesquite,Mesquite,NV,USA,36.83497556,-114.0552453
68A,Wrangell SPB,Wrangell,AK,USA,56.466325,-132.3800181
68S,Davenport,Davenport,WA,USA,47.65404528,-118.1677519
6A1,Butler Municipal,Butler,GA,USA,32.56736694,-84.25074833
6A2,Griffin-Spaulding County,Griffin,GA,USA,33.22697222,-84.27494444
6A3,Andrews-Murphy,Andrews,NC,USA,35.19453167,-83.86490194
6A4,Johnson County,Mountain City,TN,USA,36.41789833,-81.82511528
6A8,Allakaket,Allakaket,AK,USA,66.55194444,-152.6222222
6B0,Middlebury State,Middlebury,VT,USA,43.98478278,-73.09594889
6B4,Frankfort-Highland,Utica/Frankfort,NY,USA,43.02090306,-75.17043861
6B6,Minute Man Airfield,Stow,MA,USA,42.46045361,-71.51791444
6B8,Caledonia County State,Lyndonville,VT,USA,44.56911417,-72.01797889
6B9,Skaneateles Aero Drome,Skaneateles,NY,USA,42.91395583,-76.44076889
6D6,Greenville Municipal,Greenville,MI,USA,43.14228139,-85.25380722
6D8,Barnes County Municipal,Valley City,ND,USA,46.94100778,-98.01762611
6F1,Talihina Municipal,Talihina,OK,USA,34.70777139,-95.07378583
6G1,Titusville,Titusville,PA,USA,41.60880861,-79.74133111
6G5,Barnesville - Bradfield,Barnesville,OH,USA,40.00243139,-81.19183
6I2,Lebanon-Springfield,Springfield,KY,USA,37.63355556,-85.24216667
6J0,Corporate,Pelion,SC,USA,33.79463889,-81.24586111
6J2,St George,St George,SC,USA,33.1955,-80.50847222
6J4,Saluda County,Saluda,SC,USA,33.92680111,-81.79455306
6K3,Creighton Municipal,Creighton,NE,USA,42.47083694,-97.88367778
6K4,Fairview Municipal,Fairview,OK,USA,36.29014667,-98.47582833
6K8,Tok Junction,Tok,AK,USA,63.32881806,-142.9536194
6L4,Logan County,Logan,WV,USA,37.85567778,-81.91589722
6M2,Horseshoe Bend,Horseshoe Bend,AR,USA,36.21673389,-91.75014556
6M6,Lewis County Regional,Monticello,MO,USA,40.12916667,-91.67833333
6M7,Lee County-Marianna,Marianna,AR,USA,34.78027778,-90.81055556
6M8,Marked Tree Municipal,Marked Tree,AR,USA,35.53341472,-90.40149028
6N5,E 34th St Heliport,New York,NY,USA,40.74260167,-73.97208306
6N7,New York Skyports Inc. SPB,New York,NY,USA,40.73399083,-73.97291639
6N8,Thomas County,Thedford,NE,USA,41.96217028,-100.5690139
6R3,Cleveland Municipal,Cleveland,TX,USA,30.35643,-95.00801472
6R7,Old Harbor (New),Old Harbor,AK,USA,57.21810306,-153.2697494
6R9,Llano Municipal,Llano,TX,USA,30.78450278,-98.66025083
6S0,Big Timber,Big Timber,MT,USA,45.80638889,-109.9811111
6S2,Florence Muni,Florence,OR,USA,43.97901,-124.1095631
6S3,Columbus,Columbus,MT,USA,45.6291075,-109.2507167
6S5,Ravalli County,Hamilton,MT,USA,46.25149444,-114.1255403
6S8,Laurel Municipal,Laurel,MT,USA,45.70308833,-108.7610886
6V0,Edgemont Municipal,Edgemont,SD,USA,43.29525056,-103.8435325
6V3,Tazewell County,Richlands,VA,USA,37.06374667,-81.79826944
6V4,Wall Municipal,Wall,SD,USA,43.99498861,-102.2504367
6V6,Hopkins,Nucla,CO,USA,38.23879833,-108.5632597
70J,Cairo-Grady County,Cairo,GA,USA,30.88797667,-84.15473528
71J,Blackwell,Ozark,AL,USA,31.43113889,-85.61922222
72S,Rosalia Municipal,Rosalia,WA,USA,47.23683778,-117.4210244
73C,Lancaster,Lancaster,WI,USA,42.78054722,-90.68096028
73J,Beaufort County,Beaufort,SC,USA,32.4121375,-80.63455083
74D,Marshall Cty,Moundsville,WV,USA,39.88083333,-80.73577778
74S,Anacortes,Anacortes,WA,USA,48.4989925,-122.6623956
74V,Roosevelt Municipal,Roosevelt,UT,USA,40.27829167,-110.0512619
75J,Turner County,Ashburn,GA,USA,31.68545833,-83.63211194
76G,Marine City,Marine City,MI,USA,42.72086583,-82.59574694
77G,Marlette Township,Marlette,MI,USA,43.31183,-83.09091444
77S,Hobby,Creswell,OR,USA,43.93206889,-123.0067483
78D,Caro Municipal,Caro,MI,USA,43.45908333,-83.44522222
79D,Philippi-Barbour County Regional,Philippi,WV,USA,39.16620778,-80.06258056
79J,Andalusia,Andalusia,AL,USA,31.30875278,-86.39376083
79S,Fort Benton,Fort Benton,MT,USA,47.84583333,-110.6336111
7A0,Greensboro Municipal,Greensboro,AL,USA,32.68147222,-87.66208333
7A2,Demopolis Municipal,Demopolis,AL,USA,32.46381944,-87.95406389
7A3,Lanett Municipal,Lanett,AL,USA,32.81204611,-85.22958111
7A5,Roanoke Municipal,Roanoke,AL,USA,33.12928722,-85.366615
7A8,Avery County/Morrison,Spruce Pine,NC,USA,35.94457028,-81.99566944
7B2,La Fleur,Northampton,MA,USA,42.32816806,-72.61151667
7D2,Troy-Oakland,Troy,MI,USA,42.54294389,-83.17790861
7F3,Caddo Mills Municipal,Caddo Mills,TX,USA,33.03622222,-96.24313889
7F6,Clarksville-Red River County,Clarksville,TX,USA,33.59316472,-95.06355528
7F7,Clifton Municipal,Clifton,TX,USA,31.81682333,-97.56696361
7F9,Comanche County-City,Comanche,TX,USA,31.91681306,-98.600325
7G0,Ledgedale Airpark,Brockport,NY,USA,43.18118194,-77.91362333
7G8,Geauga County,Middlefield,OH,USA,41.44960972,-81.06292972
7I7,Bellefontaine Municipal,Bellefontaine,OH,USA,40.41208333,-83.73686111
7K0,Pike County-Hatcher,Pikeville,KY,USA,37.56173889,-82.56660694
7K2,Skagway SPB,Skagway,AK,USA,59.44689528,-135.3226633
7K4,Ohio County,Hartford,KY,USA,37.45832417,-86.84995194
7K8,Martin,South Sioux City,NE,USA,42.45416111,-96.47253111
7KA,Tatitlek,Tatitlek,AK,USA,60.86890528,-146.6864653
7M1,McGehee Municipal,McGehee,AR,USA,33.62022111,-91.36484056
7M3,Bearce,Mount Ida,AR,USA,34.52926056,-93.52713472
7M4,Osceola Municipal,Osceola,AR,USA,35.69114639,-90.01012028
7M5,Ozark-Franklin County,Ozark,AR,USA,35.51069583,-93.8393075
7M7,Piggott Municipal,Piggott,AR,USA,36.37820556,-90.16624167
7N0,New Orleans Downtown Heliport,New Orleans,LA,USA,29.95194444,-90.08166667
7N1,Corning-Painted Post,Corning,NY,USA,42.17590722,-77.11219278
7N7,Spitfire Aerodrome,Pedrictown,NJ,USA,39.73556333,-75.39772111
7S0,Ronan,Ronan,MT,USA,47.57076861,-114.0967783
7S1,Twin Bridges,Twin Bridges,MT,USA,45.53325917,-112.3091656
7S5,Independence State,Independence,OR,USA,44.86676444,-123.1982475
7S6,White Sulphur Springs,White Sulphur Springs,MT,USA,46.50410722,-110.9132667
7S7,Valier,Valier,MT,USA,48.29997583,-112.2508711
7V1,Buena Vista Muni,Buena Vista,CO,USA,38.81416194,-106.1206939
7V7,Red Cloud Municipal,Red Cloud,NE,USA,40.08473556,-98.54061694
7W6,Hyde County,Englehard,NC,USA,35.5623925,-75.95518417
80F,Antlers Municipal,Antlers,OK,USA,34.19260083,-95.64985889
81B,Oxford County Regional,Norway,ME,USA,44.15742611,-70.48129583
82C,Mauston-New Lisbon Union,New Lisbon,WI,USA,43.83872167,-90.13768389
82V,Pine Bluffs Municipal,Pine Bluffs,WY,USA,41.15331528,-104.1302292
83D,Mackinac County,St Ignace,MI,USA,45.89029056,-84.73755083
84D,Cheyenne Eagle Butte,Eagle Butte,SD,USA,44.984375,-101.2510417
84K,Meyers Chuck SPB,Meyers Chuck,AK,USA,55.73963611,-132.2550183
84R,Smithville Municipal,Smithville,TX,USA,30.03048028,-97.16687194
85V,Ganado,Ganado,AZ,USA,35.70140278,-109.5103814
86F,Carnegie Municipal,Carnegie,OK,USA,35.12061417,-98.5806175
87I,Yazoo County,Yazoo City,MS,USA,32.883215,-90.4636475
87Y,Blackhawk Airfield,Madison,WI,USA,43.10491444,-89.18553833
88C,Palmyra Municipal,Palmyra,WI,USA,42.88355556,-88.59743056
88J,Allendale County,Allendale,SC,USA,32.99512944,-81.27024583
88M,Eureka,Eureka,MT,USA,48.96885444,-115.0704464
89D,Kelleys Island Land,Kelleys Island,OH,USA,41.60282583,-82.684625
8A0,Albertville Municipal,Albertville,AL,USA,34.22910972,-86.25575806
8A1,Guntersville Municipal,Guntersville,AL,USA,34.39944167,-86.27016111
8A3,Livingston Municipal,Livingston,TN,USA,36.41217389,-85.31154861
8B0,Rangeley Municipal,Rangeley,ME,USA,44.991895,-70.66462472
8D1,New Holstein Municipal,New Holstein,WI,USA,43.94424111,-88.1134775
8D3,Sisseton Municipal,Sisseton,SD,USA,45.67079278,-96.99619167
8D4,Sparta,Sparta,MI,USA,43.12860833,-85.67689778
8D7,Clark County,Clark,SD,USA,44.89570278,-97.71191361
8D9,Howard Municipal,Howard,SD,USA,44.02914056,-97.53784778
8F7,Decatur Municipal,Decatur,TX,USA,33.25463889,-97.58055556
8G2,Lawrence,Corry,PA,USA,41.90755611,-79.64105083
8G6,Harrison County,Cadiz,OH,USA,40.23820667,-81.01256917
8G7,Zelienople,Zelienople,PA,USA,40.80161944,-80.16072889
8K8,Cimarron Municipal,Cimarron,KS,USA,37.83057667,-100.3504222
8K9,Murphys Pullout SPB,Ketchikan,AK,USA,55.38965028,-131.7380742
8M1,Booneville-Baldwyn,Booneville,MS,USA,34.58981806,-88.64699861
8S1,Polson,Polson,MT,USA,47.69543861,-114.1851178
8S2,Cashmere-Dryden,Cashmere,WA,USA,47.51484611,-120.4848025
8S5,East Cooper,Mt Pleasant,SC,USA,32.89783333,-79.78286111
8U6,Terry,Terry,MT,USA,46.77917333,-105.3047083
8U8,Townsend,Townsend,MT,USA,46.33111111,-111.4813889
8V2,Stuart-Atkinson Municipal,Atkinson,NE,USA,42.56250167,-99.03787611
8Y2,Buffalo Municipal,Buffalo,MN,USA,45.15904694,-93.84330361
91C,Sauk - Prairie,Prairie Du Sac,WI,USA,43.2969325,-89.75595639
91F,Arrowhead,Canadian,OK,USA,35.15426444,-95.62026389
93B,Stonington,Stonington,ME,USA,44.17508056,-68.67863722
93C,Richland,Richland Center,WI,USA,43.28333333,-90.29827778
93F,Mignon Laird Municipal,Cheyenne,OK,USA,35.60393694,-99.70343889
93Y,David City Municipal,David City,NE,USA,41.23334583,-97.11698111
94K,Cassville Municipal,Cassville,MO,USA,36.69741667,-93.90052778
95F,Cleveland Municipal,Cleveland,OK,USA,36.28340306,-96.46418833
96D,Walhalla Municipal,Walhalla,ND,USA,48.94057222,-97.902775
96Z,North Whale SPB,North Whale Pass,AK,USA,56.11631056,-133.1217153
97M,Ekalaka,Ekalaka,MT,USA,45.87791444,-104.5375072
98D,Onida Municipal,Onida,SD,USA,44.70414917,-100.1087353
99N,Bamburg County,Bamburg,SC,USA,33.30515528,-81.10898917
99Y,Greeley Municipal,Greeley,NE,USA,41.55834528,-98.54618528
9A1,Covington Municipal,Covington,GA,USA,33.6324825,-83.84955806
9A3,Chuathbaluk,Chuathbaluk,AK,USA,61.58317306,-159.2359667
9A4,Lawrence County,Courtland,AL,USA,34.65938889,-87.34883333
9A5,Barwick-LaFayette,LaFayette,GA,USA,34.68896917,-85.29023333
9A6,Chester Municipal,Chester,SC,USA,34.78933333,-81.19577778
9A8,Ugashik,Ugashik,AK,USA,57.5278675,-157.3993056
9C8,Evart Municipal,Evart,MI,USA,43.8958525,-85.27920861
9D0,Highmore Municipal,Highmore,SD,USA,44.54165056,-99.44622306
9D1,Gregory Municipal,Gregory,SD,USA,43.22174722,-99.4033
9D2,Harding County,Buffalo,SD,USA,45.58055222,-103.5296356
9D7,Cando Municipal,Cando,ND,USA,48.4841675,-99.23680389
9D9,Hastings Municipal,Hastings,MI,USA,42.66361778,-85.34625944
9G0,Buffalo Airfield,Buffalo,NY,USA,42.86200306,-78.71658528
9G1,West Penn,Tarentum,PA,USA,40.60423333,-79.82060611
9G3,Akron,Akron,NY,USA,43.02108667,-78.48296778
9G5,Royalton,Gasport,NY,USA,43.18200222,-78.55780528
9G8,Ebensburg,Ebensburg,PA,USA,40.46121083,-78.77524389
9I0,Havana Regional,Havana,IL,USA,40.221155,-90.02289361
9I3,West Liberty,West Liberty,KY,USA,37.91453139,-83.25212111
9K2,Kokhanok,Kokhanok,AK,USA,59.43264556,-154.8027058
9K4,Skyhaven,Warrensburg,MO,USA,38.7842425,-93.80285417
9K7,Ellsworth Municipal,Ellsworth,KS,USA,38.74750889,-98.23061222
9K8,Kingman Municipal,Kingman,KS,USA,37.66660278,-98.12264722
9M4,Ackerman-Choctaw County,Ackerman,MS,USA,33.3034575,-89.22840028
9M6,Kelly,Oak Grove,LA,USA,32.84921361,-91.40390611
9M8,Sheridan-Grant County Regional,Sheridan,AR,USA,34.32842917,-92.35098583
9S2,Scobey,Scobey,MT,USA,48.80772722,-105.43947
9S4,Mineral County,Superior,MT,USA,47.16825944,-114.8537411
9S5,Three Forks,Three Forks,MT,USA,45.87852778,-111.5691389
9S7,Winifred,Winifred,MT,USA,47.55164778,-109.3776792
9S9,Lexington,Lexington,OR,USA,45.45263139,-119.6886361
9U0,Turner,Turner,MT,USA,48.85417361,-108.4090214
9U3,Austin,Austin,NV,USA,39.46798056,-117.1953703
9U4,Dixon,Dixon,WY,USA,41.03829806,-107.4972869
9V5,Modisett,Rushville,NE,USA,42.73748639,-102.4448947
9V6,Martin Municipal,Martin,SD,USA,43.16564083,-101.7126953
9V9,Chamberlain Municipal,Chamberlain,SD,USA,43.76612222,-99.32134
9W7,Currituck County,Currituck,NC,USA,36.39893194,-76.01631111
A04,Centre Municipal,Centre,AL,USA,34.15987361,-85.63512944
A14,Portage Creek,Portage Creek,AK,USA,58.906485,-157.7141078
A29,Sitka SPB,Sitka,AK,USA,57.05213778,-135.3462086
A30,Scott Valley,Fort Jones,CA,USA,41.55819444,-122.8553103
A32,Butte Valley,Dorris,CA,USA,41.88709222,-121.9755614
A61,Tuntutuliak,Tuntutuliak,AK,USA,60.33534556,-162.6670094
A63,Twin Hills,Twin Hills,AK,USA,59.07562167,-160.2730436
A79,Chignik Lake,Chignik Lake,AK,USA,56.25504722,-158.7753614
A85,Kwigillingok,Kwigillingok,AK,USA,59.87644778,-163.1675583
AAF,Apalachicola Municipal,Apalachicola,FL,USA,29.72754583,-85.02744778
AAO,Colonel James Jabara,Wichita,KS,USA,37.74755556,-97.22113889
AAS,Taylor County,Cambellsville,KY,USA,37.35827778,-85.30941667
AAT,Alturas Municipal,Alturas,CA,USA,41.483,-120.5653611
ABE,Lehigh Valley International,Allentown,PA,USA,40.65236278,-75.44040167
ABI,Abilene Regional,Abilene,TX,USA,32.41132,-99.68189722
ABO,Antonio (Nery) Juarbe Pol,Arecibo,PR,USA,18.45111111,-66.67555556
ABQ,Albuquerque International,Albuquerque,NM,USA,35.04022222,-106.6091944
ABR,Aberdeen Regional,Aberdeen,SD,USA,45.44905556,-98.42183333
ABY,Southwest Georgia Regional,Albany,GA,USA,31.535515,-84.19447333
ACB,Antrim County,Bellaire,MI,USA,44.98857611,-85.198355
ACJ,Souther,Americus,GA,USA,32.11079917,-84.18884806
ACK,Nantucket Memorial,Nantucket,MA,USA,41.25305194,-70.06018139
ACQ,Waseca Municipal,Waseca,MN,USA,44.07346389,-93.55294361
ACT,Waco Regional,Waco,TX,USA,31.61128833,-97.23051917
ACV,Arcata,Arcata/Eureka,CA,USA,40.97811528,-124.1086189
ACY,Atlantic City International,Atlantic City,NJ,USA,39.45758333,-74.57716667
ACZ,Henderson,Wallace,NC,USA,34.71789028,-78.00362444
ADC,Wadena Municipal,Wadena,MN,USA,46.45026972,-95.21095472
ADG,Lenawee County,Adrian,MI,USA,41.86943667,-84.07480528
ADH,Ada Municipal,Ada,OK,USA,34.80434056,-96.6712775
ADK,Adak,Adak,AK,USA,51.87796389,-176.6460306
ADM,Ardmore Municipal,Ardmore,OK,USA,34.30320667,-97.01952167
ADQ,Kodiak,Kodiak,AK,USA,57.74996778,-152.4938553
ADS,Addison,Dallas/Addison,TX,USA,32.96855944,-96.83644778
ADT,Atwood-Rawlins County City-County,Atwood,KS,USA,39.84013889,-101.0420278
ADU,Audubon Municipal,Audubon,IA,USA,41.70137556,-94.92054167
AEG,Double Eagle II,Albuquerque,NM,USA,35.14515278,-106.7951617
AEL,Albert Lea Municipal,Albert Lea,MN,USA,43.68151278,-93.36723778
AEX,Alexandria International,Alexandria,LA,USA,31.32737167,-92.54855611
AFE,Kake,Kake,AK,USA,56.96048139,-133.9082694
AFJ,Washington County,Washington,PA,USA,40.13648833,-80.29020083
AFK,Nebraska City Municipal,Nebraska City,NE,USA,40.60688889,-95.86569444
AFM,Ambler,Ambler,AK,USA,67.10610472,-157.8536203
AFN,Jaffrey Municipal Silver Ranch,Jaffrey,NH,USA,42.80513417,-72.00302194
AFO,Afton Municipal,Afton,WY,USA,42.71124583,-110.9421639
AFW,Fort Worth Alliance,Fort Worth,TX,USA,32.98763889,-97.31880556
AGC,Allegheny Cty,Pittsburgh,PA,USA,40.35440139,-79.93016889
AGN,Angoon SPB,Angoon,AK,USA,57.50355528,-134.5850939
AGO,Magnolia Municipal,Magnolia,AR,USA,33.22802111,-93.21696861
AGS,Bush,Augusta,GA,USA,33.369955,-81.96449611
AGZ,Wagner Municipal,Wagner,SD,USA,43.06332694,-98.29618972
AHH,Amery Municipal,Amery,WI,USA,45.28114833,-92.37539222
AHN,Athens Municipal,Athens,GA,USA,33.94859528,-83.32634694
AHP,Port Alexander SPB,Port Alexander,AK,USA,56.24684222,-134.6481539
AHQ,Wahoo Municipal,Wahoo,NE,USA,41.24133333,-96.59402778
AIA,Alliance Municipal,Alliance,NE,USA,42.05325,-102.8037222
AID,Anderson Municipal,Anderson,IN,USA,40.10862139,-85.61299472
AIG,Langlade County,Antigo,WI,USA,45.15419444,-89.11072222
AIK,Aiken Municipal,Aiken,SC,USA,33.64955556,-81.68447222
AIO,Atlantic Municipal,Atlantic,IA,USA,41.40726722,-95.04690639
AIT,Aitkin Municipal,Aitkin,MN,USA,46.5484225,-93.6768
AIV,George Downer,Aliceville,AL,USA,33.10706889,-88.19725167
AIY,Atlantic City Municipal,Atlantic City,NJ,USA,39.36002778,-74.45608333
AIZ,Lee C Fine Memorial,Kaiser/Lake Ozark,MO,USA,38.096035,-92.5494875
AJC,Chignik (Anchorage Bay),Chignik,AK,USA,56.3114625,-158.3732369
AJG,Mt Carmel Municipal,Mt Carmel,IL,USA,38.60654722,-87.72669417
AJO,Corona Municipal,Corona,CA,USA,33.89765389,-117.60244
AJR,Habersham County,Cornelia,GA,USA,34.50081944,-83.55487
AK5,Perryville,Perryville,AK,USA,55.90806056,-159.1585781
AKA,Atka,Atka,AK,USA,52.22034833,-174.2063503
AKH,Gastonia Municipal,Gastonia,NC,USA,35.20265944,-81.1498675
AKI,Akiak,Akiak,AK,USA,60.90481194,-161.2270189
AKK,Akhiok,Akhiok,AK,USA,56.93869083,-154.1825556
AKN,King Salmon,King Salmon,AK,USA,58.67680167,-156.6492175
AKO,Akron-Washington Co,Akron,CO,USA,40.17563333,-103.2220278
AKP,Anaktuvuk Pass,Anaktuvuk Pass,AK,USA,68.1343225,-151.74168
AKR,Akron Fulton Intl.,Akron,OH,USA,41.0375,-81.46693944
AKW,Klawock,Klawock,AK,USA,55.57923333,-133.0759972
AL08,Vaiden,Marion,AL,USA,32.51235611,-87.38555472
ALB,Albany Cty,Albany,NY,USA,42.74811944,-73.80297861
ALI,Alice International,Alice,TX,USA,27.74088889,-98.02694444
ALM,Alamogordo-White Sands Regional,Alamogordo,NM,USA,32.83994444,-105.9905833
ALN,St. Louis Regional,Alton/St. Louis,IL,USA,38.89029083,-90.04604306
ALO,Waterloo Municipal,Waterloo,IA,USA,42.55708139,-92.40034361
ALS,San Luis Valley Regional/Bergman,Alamosa,CO,USA,37.43491667,-105.8665556
ALW,Walla Walla Regional,Walla Walla,WA,USA,46.09456167,-118.2880367
ALX,Thomas C Russell,Alexander City,AL,USA,32.91475167,-85.96295611
AMA,Amarillo International,Amarillo,TX,USA,35.2193725,-101.7059272
AMG,Bacon County,Alma,GA,USA,31.53605556,-82.50655556
AMN,Gratiot Community,Alma,MI,USA,43.3221425,-84.68794917
AMT,Alexander Salamon,West Union,OH,USA,38.85148778,-83.56627778
AMW,Ames Municipal,Ames,IA,USA,41.99206972,-93.62180139
ANB,Anniston Metropolitan,Anniston,AL,USA,33.58816667,-85.85811111
ANC,Ted Stevens Anchorage International,Anchorage,AK,USA,61.17432028,-149.9961856
AND,Anderson County,Anderson,SC,USA,34.49494444,-82.70902778
ANE,Anoka County,Minneapolis,MN,USA,45.145,-93.21138889
ANI,Aniak,Aniak,AK,USA,61.58159694,-159.5430428
ANQ,Steuben County-Tri State,Angola,IN,USA,41.63969833,-85.08349333
ANV,Anvik,Anvik,AK,USA,62.64858333,-160.1898889
ANW,Ainsworth Municipal,Ainsworth,NE,USA,42.57922222,-99.99297222
ANY,Anthony Municipal,Anthony,KS,USA,37.15852194,-98.07964667
AOC,Arco-Butte County,Arco,ID,USA,43.60343056,-113.3340972
AOH,Allen County,Lima,OH,USA,40.70694444,-84.02666667
AOO,Altoona-Blair Cty,Altoona,PA,USA,40.29637222,-78.32002306
APA,Centennial,Denver,CO,USA,39.57012833,-104.8492942
APC,Napa County,Napa,CA,USA,38.21319444,-122.2806944
APF,Naples Municipal,Naples,FL,USA,26.15247222,-81.77544444
APN,Alpena County Regional,Alpena,MI,USA,45.0780675,-83.56028583
APT,Marion County-Brown,Jasper,TN,USA,35.06067778,-85.58531667
APV,Apple Valley,Apple Valley,CA,USA,34.57528944,-117.1861792
AQC,Klawock SPB,Klawock,AK,USA,55.5546575,-133.1016928
AQH,Kwinhagak,Quinhagak,AK,USA,59.75700722,-161.8794789
AQT,Nuiqsut,Nuiqsut,AK,USA,70.20995278,-151.0055611
AQW,Harriman And West,North Adams,MA,USA,42.69591417,-73.17038306
AQY,Girdwood,Girdwood,AK,USA,60.96609583,-149.1257892
ARA,Acadiana Regional,New Iberia,LA,USA,30.03775833,-91.88389611
ARB,Ann Arbor Municipal,Ann Arbor,MI,USA,42.22298361,-83.74560722
ARC,Arctic Village,Arctic Village,AK,USA,68.11608083,-145.5761114
ARG,Walnut Ridge Regional,Walnut Ridge,AR,USA,36.12534667,-90.92461944
ARR,Aurora Municipal,Chicago/Aurora,IL,USA,41.77192944,-88.47565917
ART,Watertown Intl,Watertown,NY,USA,43.99192222,-76.02173861
ARV,Lakeland,Minocqua-Woodruff,WI,USA,45.92792556,-89.73094278
ASD,Slidell,Slidell,LA,USA,30.345055,-89.82078833
ASE,Aspen-Pitkin Co/Sardy,Aspen,CO,USA,39.22316,-106.868845
ASG,Springdale Municipal,Springdale,AR,USA,36.17641056,-94.11925833
ASH,Boire,Nashua,NH,USA,42.78176306,-71.51477944
ASJ,Tri-County,Ahoskie,NC,USA,36.29752583,-77.17085556
ASL,Marshall - Harrison County,Marshall,TX,USA,32.5205,-94.30777778
ASN,Talladega Municipal,Talladega,AL,USA,33.56991111,-86.05085833
AST,Astoria Regional,Astoria,OR,USA,46.15797222,-123.8786944
ASW,Warsaw Municipal,Warsaw,IN,USA,41.2747,-85.84005556
ASX,John F Kennedy Memorial,Ashland,WI,USA,46.54852806,-90.91896639
ATA,Hall-Miller Municipal,Atlanta,TX,USA,33.101805,-94.19532694
ATK,Atqasuk,Atqasuk,AK,USA,70.46727611,-157.4357361
ATL,William B Hartsfield-Atlanta Intl,Atlanta,GA,USA,33.64044444,-84.42694444
ATS,Artesia Municipal,Artesia,NM,USA,32.85252806,-104.4676864
ATW,Outagamie County Regional,Appleton,WI,USA,44.25740806,-88.51947556
ATY,Watertown Municipal,Watertown,SD,USA,44.91398056,-97.15471944
AUG,Augusta State,Augusta,ME,USA,44.32064972,-69.79731806
AUH,Aurora Municipal,Aurora,NE,USA,40.89413889,-97.99455556
AUK,Alakanuk,Alakanuk,AK,USA,62.68004417,-164.6599253
AUM,Austin Municipal,Austin,MN,USA,43.66499083,-92.933385
AUN,Auburn Municipal,Auburn,CA,USA,38.95476944,-121.0820806
AUO,Auburn-Opelik,Auburn,AL,USA,32.61635417,-85.43355944
AUS,Austin-Bergstrom International,Austin,TX,USA,30.19453278,-97.66987194
AUW,Wausau Municipal,Wausau,WI,USA,44.92847222,-89.62661111
AVC,Mecklenburg-Brunswick Regional,South Hill,VA,USA,36.68827778,-78.05447222
AVK,Alva Regional,Alva,OK,USA,36.77317,-98.66994611
AVL,Asheville Regional,Asheville,NC,USA,35.43619444,-82.54180556
AVO,Avon Park Municipal,Avon Park,FL,USA,27.591145,-81.52785333
AVP,Wilkes-Barre/Scranton Intl,Wilkes-Barre/Scranton,PA,USA,41.33814944,-75.7242675
AVQ,Marana Northwest Regional,Marana,AZ,USA,32.40939028,-111.2185086
AVX,Catalina,Avalon,CA,USA,33.40494444,-118.4158611
AWG,Washington Municipal,Washington,IA,USA,41.27610083,-91.67344389
AWI,Wainwright,Wainwright,AK,USA,70.638,-159.99475
AWM,West Memphis Municipal,West Memphis,AR,USA,35.13505861,-90.23444639
AWO,Arlington Municipal,Arlington,WA,USA,48.16074833,-122.1590208
AXA,Algona Municipal,Algona,IA,USA,43.07791056,-94.27199278
AXN,Chandler,Alexandria,MN,USA,45.86629833,-95.39466806
AXS,Altus Municipal,Altus,OK,USA,34.69878194,-99.3381
AXV,Neil Armstrong,Wapakoneta,OH,USA,40.49338889,-84.29894444
AXX,Angel Fire,Angel Fire,NM,USA,36.42240972,-105.2892967
AYS,Waycross-Ware County,Waycross,GA,USA,31.24905556,-82.39530556
AZC,Colorado City Municipal,Colorado City,AZ,USA,36.95994444,-113.0138889
AZE,Hazelhurst,Hazelhurst,GA,USA,31.88465639,-82.64738778
AZO,Kalamazoo County,Kalamazoo,MI,USA,42.234875,-85.5520575
B01,Granville,Granville,NY,USA,43.42507111,-73.26205306
B08,Silver Springs,Silver Springs,NV,USA,39.40324917,-119.2518292
B16,Whitford,Weedsport,NY,USA,43.08027611,-76.53837556
B19,Biddeford Municipal,Biddeford,ME,USA,43.46411111,-70.47238889
B21,Sugarloaf Regional,Carrabasset,ME,USA,45.08616639,-70.21617778
BAF,Barnes Municipal,Westfield,MA,USA,42.15773111,-72.71562028
BAK,Columbus Municipal,Columbus,IN,USA,39.26191861,-85.89634556
BAM,Battle Mountain,Battle Mountain,NV,USA,40.59904583,-116.8743358
BAX,Huron County Memorial,Bad Axe,MI,USA,43.78091667,-82.98566667
BAZ,New Braunfels Municipal,New Braunfels,TX,USA,29.7045,-98.04222222
BBB,Benson Municipal,Benson,MN,USA,45.3319325,-95.650565
BBD,Curtis,Brady,TX,USA,31.17816667,-99.32463889
BBP,Marlboro County,Bennettsville,SC,USA,34.62170861,-79.73435944
BBW,Broken Bow Municipal,Broken Bow,NE,USA,41.43645056,-99.64216861
BCB,Virginia Tech,Blacksburg,VA,USA,37.20782361,-80.40832778
BCE,Bryce Canyon,Bryce Canyon,UT,USA,37.70637111,-112.1454725
BCK,Black River Falls Area,Black River Falls,WI,USA,44.25073861,-90.85528028
BCT,Boca Raton,Boca Raton,FL,USA,26.37848667,-80.10769667
BCV,Birchwood,Birchwood,AK,USA,61.41612444,-149.50888
BDE,Baudette International,Baudette,MN,USA,48.72741667,-94.61030556
BDG,Blanding Muni,Blanding,UT,USA,37.58303472,-109.4832889
BDL,Bradley International,Windsor Locks,CT,USA,41.93887417,-72.68322833
BDQ,Morrilton Municipal,Morrilton,AR,USA,35.13619528,-92.71349722
BDR,Igor I Sikorsky Memorial,Bridgeport,CT,USA,41.16348417,-73.12617861
BDX,Broadus,Broadus,MT,USA,45.433325,-105.4172133
BED,Laurence G Hanscom,Bedford,MA,USA,42.46995306,-71.28903
BEH,Southwest Michigan Regional,Benton Harbor,MI,USA,42.12858333,-86.4285
BET,Bethel,Bethel,AK,USA,60.77977639,-161.8379975
BFD,Bradford Reg,Bradford,PA,USA,41.80306778,-78.64012083
BFF,Scotts Bluff County,Scottsbluff,NE,USA,41.87402778,-103.5956389
BFI,Boeing Field/King County Intl,Seattle,WA,USA,47.52998917,-122.3019561
BFK,Buffalo Municipal,Buffalo,OK,USA,36.86330139,-99.61873056
BFL,Meadows,Bakersfield,CA,USA,35.43359806,-119.0567681
BFM,Mobile Downtown,Mobile,AL,USA,30.62646944,-88.06799861
BFR,Virgil I Grissom Municipal,Bedford,IN,USA,38.84003306,-86.44536361
BFW,Silver Bay Municipal,Silver Bay,MN,USA,47.24902778,-91.41558333
BGD,Hutchinson County,Borger,TX,USA,35.70004194,-101.3940536
BGE,Decatur County Industrial Airpark,Bainbridge,GA,USA,30.97152778,-84.63744444
BGF,Winchester Municipal,Winchester,TN,USA,35.17753417,-86.06616722
BGM,Binghamton Regional,Binghamton,NY,USA,42.20848278,-75.97961361
BGQ,Big Lake Strip Nr 2,Big Lake,AK,USA,61.53556806,-149.8138975
BGR,Bangor International,Bangor,ME,USA,44.80744444,-68.82813889
BHB,Hancock Co-Bar Harbor,Bar Harbor,ME,USA,44.44969444,-68.3615
BHC,Baxley Municipal,Baxley,GA,USA,31.71383333,-82.39377778
BHK,Baker Muni,Baker City,MT,USA,46.34763639,-104.2594475
BHM,Birmingham International,Birmingham,AL,USA,33.56294306,-86.75354972
BID,Block Island State,Block Island,RI,USA,41.16811889,-71.57784167
BIE,Beatrice Municipal,Beatrice,NE,USA,40.30127778,-96.75411111
BIG,Allen AAF,Delta Junction,AK,USA,63.99454722,-145.7216417
BIH,Bishop,Bishop,CA,USA,37.37309556,-118.3636089
BIL,Billings Logan Intl,Billings,MT,USA,45.8076625,-108.5428611
BIS,Bismarck Municipal,Bismarck,ND,USA,46.77411111,-100.7467222
BIV,Tulip City,Holland,MI,USA,42.74316667,-86.10502778
BJC,Jeffco,Denver,CO,USA,39.90878667,-105.1172158
BJI,Bemidji-Beltrami County,Bemidji,MN,USA,47.50942417,-94.93372333
BJJ,Wayne County,Wooster,OH,USA,40.87480556,-81.88825
BKD,Breckenridge Stephens County,Breckenridge,TX,USA,32.71904694,-98.89099972
BKE,Baker City Municipal,Baker City,OR,USA,44.83733333,-117.8090833
BKL,Burke Lakefront,Cleveland,OH,USA,41.5175,-81.68333333
BKV,Hernando County,Brooksville,FL,USA,28.47359722,-82.45542139
BKW,Raleigh Cty Memorial,Beckley,WV,USA,37.78732833,-81.12416417
BKX,Brookings Municipal,Brookings,SD,USA,44.30483333,-96.81694444
BLF,Mercer Cty,Bluefield,WV,USA,37.29579944,-81.20769056
BLH,Blythe,Blythe,CA,USA,33.61916278,-114.7168764
BLI,Bellingham Intl,Bellingham,WA,USA,48.79275,-122.5375278
BLM,Allaire Arpt,Belmar/Farmingdale,NJ,USA,40.18691806,-74.12488694
BLV,Scott AFB/MidAmerica,Belleville/St. Louis,IL,USA,38.54517861,-89.83518444
BMC,Brigham City,Brigham City,UT,USA,41.55239139,-112.0622625
BMG,Monroe County,Bloomington,IN,USA,39.14602139,-86.61668278
BMI,Central Illinois Regional,Bloomington,IL,USA,40.47798556,-88.91595278
BML,Berlin Municipal,Berlin,NH,USA,44.57537278,-71.17593167
BMQ,Burnet Muni-Kate Craddock,Burnet,TX,USA,30.73894444,-98.23858333
BMT,Beaumont Municipal,Beaumont,TX,USA,30.07044111,-94.21553806
BNA,Nashville International,Nashville,TN,USA,36.12447667,-86.67818222
BNF,Baranof Warm Springs SPB,Baranof Warm Springs,AK,USA,57.08882583,-134.8331414
BNG,Banning Municipal,Banning,CA,USA,33.92307111,-116.8505756
BNL,Barnwell County,Barnwell,SC,USA,33.25777778,-81.38833333
BNO,Burns Muni,Burns,OR,USA,43.59212778,-118.9549789
BNW,Boone Municipal,Boone,IA,USA,42.04956944,-93.84757222
BOI,Boise Air Terminal,Boise,ID,USA,43.56444444,-116.2227778
BOK,Brookings,Brookings,OR,USA,42.07455556,-124.2900939
BOS,Gen Edw L Logan Intl,Boston,MA,USA,42.3643475,-71.00517917
BOW,Bartow Municipal,Bartow,FL,USA,27.9433575,-81.78344167
BPI,Big Piney-Marbleton,Big Piney,WY,USA,42.58506972,-110.1111531
BPK,Baxter County Regional,Mountain Home,AR,USA,36.36894194,-92.47052806
BPT,Southeast Texas Regional,Beaumont/Port Arthur,TX,USA,29.95083333,-94.02069444
BQK,Glynco Jetport,Brunswick,GA,USA,31.25902778,-81.46630556
BQN,Rafael Hernandez,Aguadilla,PR,USA,18.49486111,-67.12944444
BRD,Brainerd-Crow Wing County Regional,Brainerd,MN,USA,46.39785806,-94.1372275
BRL,Burlington Municipal,Burlington,IA,USA,40.783225,-91.12550556
BRO,Brownsville/S.Padre Island International,Brownsville,TX,USA,25.90683333,-97.42586111
BRW,Wiley Post Will Rogers Memorial,Barrow,AK,USA,71.2854475,-156.7660019
BRY,Samuels,Bardstown,KY,USA,37.81432167,-85.49963806
BST,Belfast Municipal,Belfast,ME,USA,44.40966667,-69.01225
BTI,Barter Island,Kaktovik,AK,USA,70.13390278,-143.5770444
BTL,W K Kellogg Regional,Battle Creek,MI,USA,42.30727806,-85.25147972
BTM,Bert Mooney,Butte,MT,USA,45.95479528,-112.49746
BTN,Britton Municipal,Britton,SD,USA,45.81522222,-97.74313889
BTP,Butler Cty,Butler,PA,USA,40.77692611,-79.94972417
BTR,"Baton Rouge Metropolitan, Ryan",Baton Rouge,LA,USA,30.53316083,-91.14963444
BTT,Bettles,Bettles,AK,USA,66.91528667,-151.5280556
BTV,Burlington International,Burlington,VT,USA,44.47300361,-73.1503125
BTY,Beatty,Beatty,NV,USA,36.86105722,-116.7870036
BUB,Cram,Burwell,NE,USA,41.77669444,-99.14975
BUF,Buffalo Niagara Intl,Buffalo,NY,USA,42.94052472,-78.73216667
BUM,Butler Memorial,Butler,MO,USA,38.28977028,-94.34012694
BUR,Burbank-Glendale-Pasadena,Burbank,CA,USA,34.20061917,-118.3584969
BUY,Burlington Municipal,Burlington,NC,USA,36.04854333,-79.47488694
BVI,Beaver County,Beaver Falls,PA,USA,40.77248083,-80.39142556
BVK,Buckland,Buckland,AK,USA,65.98228611,-161.1519778
BVN,Albion Municipal,Albion,NE,USA,41.72857778,-98.05575972
BVO,Bartlesville Municipal,Bartlesville,OK,USA,36.76247611,-96.01115167
BVS,Skagit Regional/Bay View,Burlington/Mount Vernon,WA,USA,48.47088889,-122.4208611
BVX,Batesville Regional,Batesville,AR,USA,35.726105,-91.64736083
BVY,Beverly Municipal,Beverly,MA,USA,42.58417111,-70.91651833
BWC,Brawley Municipal,Brawley,CA,USA,32.9931,-115.5169325
BWD,Brownwood Municipal,Brownwood,TX,USA,31.79362222,-98.95649528
BWG,Bowling Green-Warren County,Bowling Green,KY,USA,36.96451667,-86.41967917
BWI,Baltimore-Washington International,Baltimore,MD,USA,39.17540167,-76.66819833
BWP,Harry Stern,Wahpeton,ND,USA,46.24640083,-96.6056825
BXA,George R Carr Memorial,Bogalusa,LA,USA,30.81368639,-89.86496444
BXG,Burke County,Waynesboro,GA,USA,33.04093056,-82.00397917
BXK,Buckeye Municipal,Buckeye,AZ,USA,33.42088556,-112.6863
BYA,Boundary,Boundary,AK,USA,64.07830278,-141.113375
BYG,Johnson County,Buffalo,WY,USA,44.38108528,-106.7217897
BYI,Burley Municipal,Burley,ID,USA,42.54260361,-113.7715442
BZN,Gallatin,Bozeman,MT,USA,45.77690139,-111.1530072
C00,Mercer County,Aledo,IL,USA,41.248645,-90.73708361
C05,Chenega Bay,Chenega,AK,USA,60.07730556,-147.9918889
C09,Morris Municipal,Morris,IL,USA,41.42541667,-88.41869444
C15,Pekin Municipal,Pekin,IL,USA,40.48820611,-89.67591083
C17,Marion,Marion,IA,USA,42.03111083,-91.52934222
C18,Frankfort,Chicago/Frankfort,IL,USA,41.4775,-87.84047222
C25,Waverly Municipal,Waverly,IA,USA,42.7419525,-92.50793528
C29,Morey,Middleton,WI,USA,43.11424444,-89.53073222
C34,Gibson City Municipal,Gibson City,IL,USA,40.48578389,-88.2672725
C35,Reedsburg Municipal,Reedsburg,WI,USA,43.52589944,-89.98322194
C47,Portage Municipal,Portage,WI,USA,43.5600925,-89.48309278
C52,Burlington Municipal,Burlington,WI,USA,42.69056389,-88.30464
C56,Sanger,Chicago/Monee,IL,USA,41.37756167,-87.68137528
C62,Kendallville Municipal,Kendallville,IN,USA,41.47271639,-85.26080833
C65,Plymouth Municipal,Plymouth,IN,USA,41.36513333,-86.30050417
C66,Monmouth Municipal,Monmouth,IL,USA,40.92970444,-90.63110722
C71,Crosby Municipal,Crosby,MS,USA,31.29600472,-91.05288167
C73,Dixon Muni-Charles R Walgreen,Dixon,IL,USA,41.83369889,-89.44621333
C75,Marshall County,Lacon,IL,USA,41.01928583,-89.38642222
C77,Poplar Grove,Poplar Grove,IL,USA,42.32268639,-88.83651833
C80,New Coalinga Municipal,Coalinga,CA,USA,36.16313889,-120.2938139
C81,Campbell,Chicago/Round Lake Park,IL,USA,42.32461111,-88.07408806
C83,Byron,Byron,CA,USA,37.8284525,-121.6258219
C91,Dowagiac Municipal,Dowagiac,MI,USA,41.99293417,-86.1280125
CAD,Wexford County,Cadillac,MI,USA,44.27531333,-85.41892694
CAE,Columbia Metropolitan,Columbia,SC,USA,33.93884,-81.11953944
CAG,Craig-Moffat,Craig,CO,USA,40.49522139,-107.5216467
CAK,Akron-Canton Regional,Akron,OH,USA,40.91631194,-81.44246556
CAO,Clayton Municipal Airpark,Clayton,NM,USA,36.44585972,-103.1546583
CAR,Caribou Municipal,Caribou,ME,USA,46.8715,-68.01791667
CAV,Clarion Municipal,Clarion,IA,USA,42.74194389,-93.75890944
CBE,Cumberland Regional,Cumberland,MD,USA,39.61541667,-78.76086361
CBF,Council Bluffs Municipal,Council Bluffs,IA,USA,41.25947222,-95.75997222
CBG,Cambridge Municipal,Cambridge,MN,USA,45.55854639,-93.26464361
CBK,Shaltz,Colby,KS,USA,39.42753083,-101.0465719
CCB,Cable,Upland,CA,USA,34.11154056,-117.6875897
CCO,Newnan-Coweta County,Newnan,GA,USA,33.31208333,-84.77027778
CCR,Buchanan,Concord,CA,USA,37.98965639,-122.0568972
CCY,Charles City Municipal,Charles City,IA,USA,43.07260861,-92.61077833
CDB,Cold Bay,Cold Bay,AK,USA,55.20559972,-162.7242628
CDC,Cedar City Muni,Cedar City,UT,USA,37.70097028,-113.098575
CDH,Harrell,Camden,AR,USA,33.62279917,-92.76339528
CDI,Cambridge Municipal,Cambridge,OH,USA,39.97504417,-81.57759528
CDK,George T Lewis,Cedar Key,FL,USA,29.137745,-83.04984361
CDN,Woodward,Camden,SC,USA,34.28358333,-80.56486111
CDR,Chadron Municipal,Chadron,NE,USA,42.83755556,-103.0954167
CDV,Merle K (Mudhole) Smith,Cordova,AK,USA,60.49183389,-145.4776503
CDW,Essex Cty Arpt,Caldwell,NJ,USA,40.87522278,-74.28135667
CEC,Jack McNamara,Crescent City,CA,USA,41.78015722,-124.2365333
CEF,Westover AFB,Chicopee,MA,USA,42.19826389,-72.53425833
CEK,Crete Municipal,Crete,NE,USA,40.61791667,-96.92488889
CEM,Central,Central,AK,USA,65.57380667,-144.7832908
CEU,Oconee County Regional,Clemson,SC,USA,34.67205556,-82.88644444
CEV,Mettel,Connersville,IN,USA,39.69803139,-85.13124528
CEW,Bob Sikes,Crestview,FL,USA,30.77883333,-86.52211111
CEY,Kyle-Oakley,Murray,KY,USA,36.66458333,-88.37277722
CEZ,Cortez Muni,Cortez,CO,USA,37.30299778,-108.6280658
CFD,Coulter,Bryan,TX,USA,30.71569444,-96.33136111
CFJ,Crawfordsville Municipal,Crawfordsville,IN,USA,39.97562861,-86.91986361
CFK,Chefornak,Chefornak,AK,USA,60.14922556,-164.2856325
CFT,Greenlee County,Clifton-Morenci,AZ,USA,32.95284306,-109.2103453
CFV,Coffeyville Municipal,Coffeyville,KS,USA,37.0940475,-95.57189417
CGA,Craig SPB,Craig,AK,USA,55.47883139,-133.1478011
CGC,Crystal River,Crystal River,FL,USA,28.86727778,-82.57130556
CGE,Cambridge-Dorchester,Cambridge,MD,USA,38.53930556,-76.03036111
CGF,Cuyahoga County,Cleveland,OH,USA,41.56512389,-81.48635389
CGI,Cape Girardeau Municipal,Cape Girardeau,MO,USA,37.22531694,-89.57075167
CGS,College Park,College Park,MD,USA,38.98058333,-76.92230556
CGX,Chicago Meigs,Chicago,IL,USA,41.85884389,-87.60791167
CGZ,Casa Grande Municipal,Casa Grande,AZ,USA,32.95488889,-111.7668333
CHA,Lovell,Chattanooga,TN,USA,35.03526833,-85.20378778
CHD,Chandler Municipal,Chandler,AZ,USA,33.26908333,-111.8111389
CHK,Chickasha Municipal,Chickasha,OK,USA,35.09614694,-97.96618361
CHO,Charlottesville-Albermarle,Charlottesville,VA,USA,38.13863889,-78.45286111
CHP,Circle Hot Springs,Circle Hot Springs,AK,USA,65.48547222,-144.6107836
CHS,Charleston AFB/International,Charleston,SC,USA,32.89864639,-80.04050583
CHT,Chillicothe Municipal,Chillicothe,MO,USA,39.78215278,-93.49568056
CHU,Houston County,Caledonia,MN,USA,43.59635861,-91.50394639
CIC,Chico Municipal,Chico,CA,USA,39.79538278,-121.8584231
CID,Eastern Iowa,Cedar Rapids,IA,USA,41.88458833,-91.71087222
CII,Choteau,Choteau,MT,USA,47.82528056,-112.1662136
CIK,Chalkyitsik,Chalkyitsik,AK,USA,66.64969083,-143.7359492
CIN,Arthur N Neu,Carroll,IA,USA,42.04619444,-94.789
CIR,Cairo,Cairo,IL,USA,37.06447222,-89.21961111
CIU,Chippewa County International,Sault Ste. Marie,MI,USA,46.25075194,-84.47238528
CJR,Culpeper Regional,Culpeper,VA,USA,38.5267075,-77.85885528
CJX,Crooked Creek,Crooked Creek,AK,USA,61.86902194,-158.1371178
CKB,Benedum,Clarksburg,WV,USA,39.29663889,-80.22808333
CKC,Grand Marais/Cook County,Grand Marais,MN,USA,47.83830556,-90.38313889
CKF,Crisp County - Cordele,Cordele,GA,USA,31.98883333,-83.77391667
CKI,Williamsburg County,Kingstree,SC,USA,33.71722222,-79.85697222
CKM,Fletcher,Clarksdale,MS,USA,34.29971,-90.51231611
CKN,Crookston Muni Kirkwood,Crookston,MN,USA,47.84169417,-96.62162028
CKP,Cherokee Municipal,Cherokee,IA,USA,42.73147222,-95.55613889
CKU,Cordova Muni,Cordova,AK,USA,60.54390333,-145.7267042
CKV,Outlaw,Clarksville,TN,USA,36.62188083,-87.41495361
CKX,Chicken,Chicken,AK,USA,64.07133833,-141.9522792
CLD,MC Clellan-Palomar Airport,NA,NA,USA,33.127231,-117.278727
CLE,Cleveland-Hopkins Intl,Cleveland,OH,USA,41.41089417,-81.84939667
CLI,Clintonville Municipal,Clintonville,WI,USA,44.61381306,-88.73126667
CLK,Clinton Municipal,Clinton,OK,USA,35.53832778,-98.932695
CLL,Easterwood,College Station,TX,USA,30.58858944,-96.36382417
CLM,William R Fairchild Intl,Port Angeles,WA,USA,48.12019444,-123.4996944
CLP,Clarks Point,Clarks Point,AK,USA,58.84230472,-158.5452331
CLS,Chehalis-Centralia,Chehalis,WA,USA,46.67649194,-122.9792967
CLT,Charlotte/Douglas International,Charlotte,NC,USA,35.21401111,-80.94312583
CLW,Clearwater Air Park,Clearwater,FL,USA,27.97668639,-82.75874028
CMA,Camarillo,Camarillo,CA,USA,34.21375472,-119.0943264
CMH,Port Columbus Intl,Columbus,OH,USA,39.99798528,-82.89188278
CMI,University of Illinois-Willard,Champaign/Urbana,IL,USA,40.03925,-88.27805556
CMX,Houghton County Memorial,Hancock,MI,USA,47.16841722,-88.48906083
CMY,Sparta/Fort McCoy,Sparta,WI,USA,43.95834806,-90.7378975
CNC,Chariton Municipal,Chariton,IA,USA,41.01962389,-93.35968028
CNH,Claremont Municipal,Claremont,NH,USA,43.37043194,-72.36867667
CNK,Blosser Municipal,Concordia,KS,USA,39.54925139,-97.65231667
CNM,Cavern City Air Terminal,Carlsbad,NM,USA,32.33747222,-104.2632778
CNO,Chino,Chino,CA,USA,33.97469444,-117.6366111
CNP,Billy G Ray,Chappell,NE,USA,41.07747222,-102.4640556
CNU,Chanute Martin Johnson,Chanute,KS,USA,37.66879722,-95.48506444
CNW,TSTC-Waco,Waco,TX,USA,31.63783139,-97.07413889
CNY,Canyonlands,Moab,UT,USA,38.75495611,-109.7548439
COD,Yellowstone Regional,Cody,WY,USA,44.52019417,-109.0237961
COE,Coeur D'Alene Air Terminal,Coeur D'Alene,ID,USA,47.77429167,-116.8196231
COI,Merritt Island,Merritt Island,FL,USA,28.34158944,-80.6854975
COM,Coleman Municipal,Coleman,TX,USA,31.84113889,-99.40361111
CON,Concord Municipal,Concord,NH,USA,43.20273278,-71.50228556
COQ,Cloquet-Carlton County,Cloquet,MN,USA,46.70016833,-92.50552861
COS,City of Colorado Springs Muni,Colorado Springs,CO,USA,38.80580556,-104.70025
COT,Cotulla-Lasalle County,Cotulla,TX,USA,28.45825583,-99.22016389
COU,Columbia Regional,Columbia,MO,USA,38.81809306,-92.21962917
CPC,Columbus County Municipal,Whiteville,NC,USA,34.27287278,-78.71499278
CPK,Chesapeake Municipal,Norfolk,VA,USA,36.66561833,-76.32066389
CPM,Compton/Woodley,Compton,CA,USA,33.89001611,-118.2436831
CPR,Natrona County Intl,Casper,WY,USA,42.90835556,-106.4644661
CPS,St. Louis Downtown,Cahokia/St. Louis,IL,USA,38.57072444,-90.15622111
CPX,Benjamin Rivera Noriega,Isla De Culebra,PR,USA,18.31328917,-65.30432444
CQA,Lakefield,Celina,OH,USA,40.48408333,-84.56011111
CQB,Chandler Municipal,Chandler,OK,USA,35.72381556,-96.82027306
CQX,Chatham Municipal,Chatham,MA,USA,41.68840028,-69.98952417
CRC,Circle City,Circle,AK,USA,65.83049389,-144.0758128
CRE,Grand Strand,North Myrtle Beach,SC,USA,33.81175,-78.72394444
CRG,Craig Municipal,Jacksonville,FL,USA,30.33633333,-81.51444444
CRO,Corcoran,Corcoran,CA,USA,36.10245111,-119.5948469
CRP,Corpus Christi International,Corpus Christi,TX,USA,27.77036083,-97.50121528
CRQ,McClellan-Palomar,Carlsbad,CA,USA,33.12822222,-117.2802222
CRS,C Davis Campbell -Corsicana Muni,Corsicana,TX,USA,32.02748861,-96.39803611
CRT,Crossett Municipal,Crossett,AR,USA,33.17833278,-91.88018806
CRW,Yeager,Charleston,WV,USA,38.37315083,-81.59318972
CRX,Roscoe Turner,Corinth,MS,USA,34.91496778,-88.60348361
CSB,Cambridge Municipal,Cambridge,NE,USA,40.30658333,-100.1620833
CSG,Columbus Metropolitan,Columbus,GA,USA,32.51633333,-84.93886111
CSM,Clinton-Sherman,Clinton,OK,USA,35.33983917,-99.20049944
CSQ,Creston Municipal,Creston,IA,USA,41.02146139,-94.36331917
CSV,Crossville Memorial,Crossville,TN,USA,35.95129194,-85.08497806
CTB,Cut Bank Muni,Cut Bank,MT,USA,48.60835444,-112.3761464
CTJ,West Georgia Regional,Carrollton,GA,USA,33.63102778,-85.15202778
CTK,Ingersoll,Canton,IL,USA,40.56909444,-90.07484
CTY,Cross City,Cross City,FL,USA,29.63552778,-83.10475
CTZ,Sampson County,Clinton,NC,USA,34.97561194,-78.36461528
CUB,Columbia Owens Downtown,Columbia,SC,USA,33.97047222,-80.99525
CUH,Cushing Municipal,Cushing,OK,USA,35.949925,-96.77305278
CUL,Carmi Municipal,Carmi,IL,USA,38.08947917,-88.12306111
CUT,Custer County,Custer,SD,USA,43.73331611,-103.6176947
CVG,Cincinnati Northern Kentucky Intl,Covington,KY,USA,39.04614278,-84.6621725
CVK,Sharp County Regional,Ash Flat,AR,USA,36.26487139,-91.56264111
CVN,Clovis Municipal,Clovis,NM,USA,34.42513889,-103.0792778
CVO,Corvallis Muni,Corvallis,OR,USA,44.49719361,-123.2898297
CVX,Charlevoix Municipal,Charlevoix,MI,USA,45.30477778,-85.27477778
CWA,Central Wisconsin,Mosinee,WI,USA,44.77761917,-89.66677944
CWF,Chennault International,Lake Charles,LA,USA,30.21059167,-93.14318944
CWI,Clinton Municipal,Clinton,IA,USA,41.8311125,-90.32913056
CWV,Claxton-Evans County,Claxton,GA,USA,32.19505556,-81.86955556
CXC,Chitina,Chitina,AK,USA,61.58285917,-144.4270969
CXE,Chase City Municipal,Chase City,VA,USA,36.78833556,-78.50155361
CXF,Coldfoot,Coldfoot,AK,USA,67.25163417,-150.2065672
CXL,Calexico International,Calexico,CA,USA,32.66950333,-115.5133281
CXO,Montgomery County,Conroe,TX,USA,30.35183333,-95.4144675
CXP,Carson,Carson City,NV,USA,39.19222972,-119.7343611
CXU,Camilla-Mitchell County,Camilla,GA,USA,31.21291667,-84.23680556
CXY,Capital City,Harrisburg,PA,USA,40.21713889,-76.85147222
CYO,Pickaway County Memorial,Circleville,OH,USA,39.51600611,-82.98215361
CYS,Cheyenne,Cheyenne,WY,USA,41.1557225,-104.8118381
CYW,Clay Center Municipal,Clay Center,KS,USA,39.38713889,-97.15721417
CZD,Cozad Municipal,Cozad,NE,USA,40.86911111,-100.0042222
CZG,Tri-Cities,Endicott,NY,USA,42.07853583,-76.09633306
CZL,Tom B David,Calhoun,GA,USA,34.45678278,-84.93949944
CZN,Chisana,Chisana,AK,USA,62.07118972,-142.0483742
CZT,Dimmit County,Carrizo Springs,TX,USA,28.52225111,-99.82363444
D04,Bowman Municipal,Bowman,ND,USA,46.18699111,-103.4280806
D05,Garrison Municipal,Garrison,ND,USA,47.65594444,-101.4372222
D07,Faith Municipal,Faith,SD,USA,45.03609417,-102.0198803
D09,Bottineau Municipal,Bottineau,ND,USA,48.83039167,-100.4171361
D19,Quentin Aanenson,Luverne,MN,USA,43.62080278,-96.21864028
D22,Angola,Angola,NY,USA,42.66010111,-78.99115556
D25,Manitowish Waters,Manitowish Waters,WI,USA,46.12197222,-89.88233333
D38,Canandaiga,Canandaiga,NY,USA,42.90718611,-77.32162639
D42,Springfield Municipal,Springfield,MN,USA,44.23107,-94.99893444
D50,Crosby Municipal,Crosby,ND,USA,48.92851556,-103.2972514
D55,Robertson,Langdon,ND,USA,48.75301778,-98.39333694
D57,Glen Ullin Municipal,Glen Ullin,ND,USA,46.81278306,-101.8601556
D60,Tioga Municipal,Tioga,ND,USA,48.3805325,-102.8979853
D73,Monroe-Walton County,Monroe,GA,USA,33.78149889,-83.69355389
D77,Lancaster,Lancaster,NY,USA,42.92228111,-78.61224889
D87,Harbor Springs,Harbor Springs,MI,USA,45.42556528,-84.91338389
D95,Dupont-Lapeer,Lapeer,MI,USA,43.06703333,-83.27244444
D98,Romeo,Romeo,MI,USA,42.79699083,-82.97526583
DAB,Daytona Beach International,Daytona Beach,FL,USA,29.17991667,-81.05805556
DAG,Barstow-Daggett,Daggett,CA,USA,34.85371333,-116.7866875
DAL,Dallas Love,Dallas,TX,USA,32.84711389,-96.85177222
DAN,Danville Regional,Danville,VA,USA,36.57286111,-79.33611111
DAW,Skyhaven,Rochester,NH,USA,43.28406194,-70.92925472
DAY,James M Cox Dayton Intl,Dayton,OH,USA,39.90237583,-84.219375
DBN,"W. H. ""Bud"" Barron",Dublin,GA,USA,32.56445806,-82.98525556
DBQ,Dubuque Municipal,Dubuque,IA,USA,42.40295944,-90.70916722
DCA,Ronald Reagan Washington National,Arlington,VA,USA,38.85208333,-77.03772222
DCK,Dahl Creek,Dahl Creek,AK,USA,66.94333806,-156.9046739
DCU,Pryor  Regional,Decatur,AL,USA,34.65264667,-86.94536778
DCY,Daviess County,Washington,IN,USA,38.70042333,-87.12973222
DDC,Dodge City Regional,Dodge City,KS,USA,37.76312194,-99.96542389
DDH,William H. Morse State,Bennington,VT,USA,42.8913325,-73.2464075
DEC,Decatur,Decatur,IL,USA,39.8345625,-88.86568917
DED,Deland Municipal-Taylor,Deland,FL,USA,29.06698056,-81.28394167
DEE,Deering,Deering,AK,USA,66.06820583,-162.7666028
DEH,Decorah Municipal,Decorah,IA,USA,43.27550139,-91.73937389
DEN,Denver Intl,Denver,CO,USA,39.85840806,-104.6670019
DEQ,J Lynn Helms Sevier County,De Queen,AR,USA,34.04699556,-94.39936556
DET,Detroit City,Detroit,MI,USA,42.40919444,-83.00986111
DEW,Deer Park,Deer Park,WA,USA,47.96663889,-117.4266667
DFI,Defiance Memorial,Defiance,OH,USA,41.3375,-84.42880556
DFW,Dallas-Fort Worth International,Dallas-Fort Worth,TX,USA,32.89595056,-97.0372
DGW,Converse County,Douglas,WY,USA,42.79725,-105.3857361
DHN,Dothan,Dothan,AL,USA,31.32133917,-85.44962889
DHT,Dalhart Municipal,Dalhart,TX,USA,36.022585,-102.5472775
DIK,Dickinson Municipal,Dickinson,ND,USA,46.79738889,-102.8019528
DKB,Dekalb-Taylor Municipal,Dekalb,IL,USA,41.93188111,-88.70829861
DKK,Dunkirk Municipal,Dunkirk,NY,USA,42.49333528,-79.27204167
DKX,Knoxville Downtown Island,Knoxville,TN,USA,35.96383361,-83.87365389
DLG,Dillingham,Dillingham,AK,USA,59.0454125,-158.5033389
DLH,Duluth International,Duluth,MN,USA,46.84209028,-92.19364861
DLL,Baraboo - Wisconsin Dells,Baraboo,WI,USA,43.52195389,-89.77090222
DLN,Dillon,Dillon,MT,USA,45.25536056,-112.5525067
DLO,Delano Municipal,Delano,CA,USA,35.74558056,-119.2365039
DLS,Columbia Gorge Regional,The Dalles,OR,USA,45.61854556,-121.1673439
DLZ,Delaware Municipal,Delaware,OH,USA,40.27970139,-83.11480167
DM2,Diomede Heliport,Diomede,AK,USA,65.75861111,-168.9530556
DMN,Deming Municipal,Deming,NM,USA,32.26230917,-107.7206397
DMO,Sedalia Memorial,Sedalia,MO,USA,38.70688889,-93.17611111
DMW,Carroll County,Westminster,MD,USA,39.60827778,-77.00766667
DNL,Daniel,Augusta,GA,USA,33.46663667,-82.03933917
DNN,Dalton Municipal,Dalton,GA,USA,34.72174833,-84.86910806
DNS,Denison Municipal,Denison,IA,USA,41.9864325,-95.38072083
DNV,Vermilion County,Danville,IL,USA,40.19946861,-87.59553528
DOV,Dover Air Force Base,Dover,DE,USA,39.1301125,-75.46631028
DPA,Du Page,Chicago/West Chicago,IL,USA,41.90688333,-88.24841722
DPL,P B Raiford,Kenansville,NC,USA,35.00006444,-77.981695
DQH,Douglas Municipal,Douglas,GA,USA,31.47780833,-82.85961556
DRI,Beauregard Parish,De Ridder,LA,USA,30.83152778,-93.33963889
DRO,Durango-La Plata County,Durango,CO,USA,37.15151667,-107.7537692
DRT,Del Rio International,Del Rio,TX,USA,29.37181222,-100.9232339
DSM,Des Moines International,Des Moines,IA,USA,41.53493306,-93.66068222
DSV,Dansville Muni,Dansville,NY,USA,42.57089972,-77.71305083
DTA,Delta Municipal,Delta,UT,USA,39.38328861,-112.5096683
DTL,Detroit Lakes -Wething,Detroit Lakes,MN,USA,46.82520861,-95.8856875
DTN,Shreveport Downtown,Shreveport,LA,USA,32.54021889,-93.7450225
DTO,Denton Municipal,Denton,TX,USA,33.20072167,-97.19797722
DTS,Destin-Ft. Walton Beach,Destin,FL,USA,30.40006111,-86.47147722
DTW,Detroit Metropolitan-Wayne County,Detroit,MI,USA,42.21205889,-83.34883583
DUA,Eaker,Durant,OK,USA,33.942265,-96.39451806
DUC,Halliburton,Duncan,OK,USA,34.470875,-97.95986111
DUG,Bisbee Douglas International,Douglas Bisbee,AZ,USA,31.46902778,-109.6036667
DUJ,Du Bois-Jefferson Cty,Du Bois,PA,USA,41.17826611,-78.89869778
DUT,Unalaska,Unalaska,AK,USA,53.90013889,-166.5435
DUX,Moore County,Dumas,TX,USA,35.85792833,-102.0130978
DUY,Kongiganak,Kongiganak,AK,USA,59.95950583,-162.8817231
DVK,Stuart Powell,Danville,KY,USA,37.57791667,-84.76969444
DVL,Devils Lake Municipal-Knoke,Devils Lake,ND,USA,48.11424528,-98.90877833
DVN,Davenport Municipal,Davenport,IA,USA,41.6102775,-90.58832528
DVO,Gnoss,Novato,CA,USA,38.14351944,-122.5572167
DVT,Phoenix-Deer Valley,Phoenix,AZ,USA,33.68831667,-112.0825614
DWH,David Wayne Hooks Memorial,Houston,TX,USA,30.06186111,-95.55277778
DWU,Ashland-Boyd County,Ashland,KY,USA,38.5545,-82.738
DXE,Dexter Municipal,Dexter,MO,USA,36.77747,-89.94117333
DXR,Danbury Municipal,Danbury,CT,USA,41.37153528,-73.48219056
DXX,Madison-Lac Qui Parle County,Madison,MN,USA,44.98624,-96.17773611
DYB,Summerville,Summerville,SC,USA,33.06344444,-80.27933333
DYL,Doylestown,Doylestown,PA,USA,40.33305028,-75.12233833
DYR,Dyersburg Municipal,Dyersburg,TN,USA,35.99850694,-89.40608333
DYT,Sky Harbor,Duluth,MN,USA,46.72186083,-92.04343889
E01,Monahans-Roy Hurd Memorial,Monahans,TX,USA,31.58246583,-102.9090428
E04,Eunice,Eunice,NM,USA,32.45679139,-103.2404708
E05,Hatch Muni,Hatch,NM,USA,32.66106083,-107.1979339
E06,Lea County-Zip Franklin Memorial,Lovington,NM,USA,32.95394444,-103.4087778
E07,Lea County/Tatum,Tatum,NM,USA,33.26122278,-103.2768939
E11,Andrews County,Andrews,TX,USA,32.33111111,-102.5295278
E15,Graham Municipal,Graham,TX,USA,33.11022222,-98.55527861
E19,Gruver Municipal,Gruver,TX,USA,36.23372611,-101.4321894
E24,Whiteriver,Whiteriver,AZ,USA,33.81255056,-109.9867658
E25,Wickenburg Municipal,Wickenburg,AZ,USA,33.96891833,-112.7985128
E26,Lea County,Jal,NM,USA,32.13107833,-103.1548506
E35,Fabens,Fabens,TX,USA,31.51567306,-106.1471978
E38,Alpine-Casparis Municipal,Alpine,TX,USA,30.38422222,-103.6835833
E42,Spearman Municipal,Spearman,TX,USA,36.221,-101.1945
E51,Bagdad,Bagdad,AZ,USA,34.59585278,-113.170195
E52,Oldham County,Vega,TX,USA,35.23199833,-102.3990931
E60,Eloy Municipal,Eloy,AZ,USA,32.80700583,-111.58679
E63,Gila Bend Municipal,Gila Bend,AZ,USA,32.95810083,-112.6782181
E80,Alexander Municipal,Belen,NM,USA,34.64519778,-106.8336958
E89,Conchas State Park,Conchas Dam,NM,USA,35.36671583,-104.1880314
E91,Chinle Municipal,Chinle,AZ,USA,36.11088056,-109.5754222
E94,Glenwood-Catron County,Glenwood,NM,USA,33.35283972,-108.8672858
E95,Benson Municipal,Benson,AZ,USA,31.99972222,-110.3572222
EAA,Eagle,Eagle,AK,USA,64.77639306,-141.1509206
EAN,Phifer Airfield,Wheatland,WY,USA,42.05552528,-104.9327492
EAR,Kearney Municipal,Kearney,NE,USA,40.72702778,-99.00677778
EAT,Pangborn Memorial,Wenatchee,WA,USA,47.39886111,-120.2068333
EAU,Chippewa Valley Regional,Eau Claire,WI,USA,44.86525722,-91.48507194
EBS,Webster City Municipal,Webster City,IA,USA,42.43663889,-93.86886111
ECG,Elizabeth City CG Air Station/Municipal,Elizabeth City,NC,USA,36.26057417,-76.17459778
ECS,Mondell,Newcastle,WY,USA,43.88545056,-104.3179178
EDE,Edenton Municipal,Edenton,NC,USA,36.027735,-76.56709333
EDN,Enterprise Municipal,Enterprise,AL,USA,31.29972222,-85.89986111
EED,Needles,Needles,CA,USA,34.76619444,-114.6232931
EEK,Eek,Eek,AK,USA,60.21590417,-162.0056092
EEN,Dillant-Hopkins,Keene,NH,USA,42.89839944,-72.27078111
EEO,Meeker,Meeker,CO,USA,40.04886222,-107.8859067
EET,Shelby County,Alabaster,AL,USA,33.17781083,-86.78323722
EFC,Belle Fourche Municipal,Belle Fourche,SD,USA,44.7342075,-103.8619925
EFD,Ellington,Houston,TX,USA,29.60733333,-95.15875
EFK,Newport State,Newport,VT,USA,44.88879722,-72.22915833
EFT,Monroe Municipal,Monroe,WI,USA,42.61493972,-89.59075583
EFW,Jefferson Municipal,Jefferson,IA,USA,42.01016667,-94.34258333
EGE,Eagle County Regional,Eagle,CO,USA,39.64256778,-106.9176953
EGQ,Emmetsburg Municipal,Emmetsburg,IA,USA,43.10202056,-94.704675
EGT,Wellington Municipal,Wellington,KS,USA,37.32441028,-97.38732333
EGV,Eagle River Union,Eagle River,WI,USA,45.93179639,-89.26906778
EHA,Elkhart-Morton County,Elkhart,KS,USA,37.00188194,-101.8821258
EHO,Shelby Municipal,Shelby,NC,USA,35.25555556,-81.60099722
EHR,Henderson City-County,Henderson,KY,USA,37.8078425,-87.68569
EII,Egegik,Egegik,AK,USA,58.18837472,-157.3809872
EIW,County Memorial,New Madrid,MO,USA,36.53531083,-89.59971722
EKA,Murray,Eureka,CA,USA,40.80338889,-124.1127917
EKM,Elkhart Municipal,Elkhart,IN,USA,41.71935833,-86.00168361
EKN,Elkins-Randolph Co-Jennings Randolph,Elkins,WV,USA,38.88944444,-79.85713889
EKO,Elko Regional,Elko,NV,USA,40.82492611,-115.7916964
EKQ,Wayne County,Monticello,KY,USA,36.85527778,-84.85613889
EKX,Elizabethtown,Elizabethtown,KY,USA,37.68694444,-85.92377778
EKY,Bessemer Municipal,Bessemer,AL,USA,33.31288444,-86.92591889
ELA,Eagle Lake Municipal,Eagle Lake,TX,USA,29.60301389,-96.32248444
ELD,South Arkansas Regional At Goodwin,El Dorado,AR,USA,33.2208625,-92.81325167
ELI,Elim,Elim,AK,USA,64.61400972,-162.2700681
ELK,Elk City Municipal,Elk City,OK,USA,35.42941083,-99.39425917
ELM,Elmira/Corning Regional,Elmira,NY,USA,42.15991361,-76.89144333
ELN,Bowers,Ellensburg,WA,USA,47.03302778,-120.5306944
ELO,Ely Municipal,Ely,MN,USA,47.82454639,-91.83073056
ELP,El Paso International,El Paso,TX,USA,31.80666667,-106.3778056
ELV,Elfin Cove SPB,Elfin Cove,AK,USA,58.19518417,-136.3473928
ELY,Ely Arpt (Yelland),Ely,NV,USA,39.29969444,-114.8418889
ELZ,Wellsville Muni Tarantine,Wellsville,NY,USA,42.10951194,-77.99194806
EMM,Kemmerer Municipal,Kemmerer,WY,USA,41.82494611,-110.5590586
EMP,Emporia Municipal,Emporia,KS,USA,38.33211111,-96.19116667
EMT,El Monte,El Monte,CA,USA,34.08600889,-118.0348453
EMV,Emporia-Greensville Regional,Emporia,VA,USA,36.68691667,-77.48280556
ENA,Kenai Municipal,Kenai,AK,USA,60.572,-151.2475278
ENL,Centralia Municipal,Centralia,IL,USA,38.51479889,-89.09217944
ENM,Emmonak,Emmonak,AK,USA,62.78518639,-164.4910461
ENN,Nenana Municipal,Nenana,AK,USA,64.54898167,-149.0735053
ENV,Wendover,Wendover,UT,USA,40.71869528,-114.03089
ENW,Kenosha Regional,Kenosha,WI,USA,42.5957075,-87.92780333
EOK,Keokuk Municipal,Keokuk,IA,USA,40.45990778,-91.42850111
EOS,Neosho Memorial,Neosho,MO,USA,36.81080556,-94.39169444
EPH,Ephrata Muni,Ephrata,WA,USA,47.30758333,-119.5158889
EPM,Eastport Municipal,Eastport,ME,USA,44.91011111,-67.01269444
EQA,Captain Jack Thomas,El Dorado,KS,USA,37.77410833,-96.81762778
EQY,Monroe,Monroe,NC,USA,35.01884306,-80.62023444
ERI,Erie Intl,Erie,PA,USA,42.08202139,-80.17621556
ERV,Kerrville Muni/Louis Schreiner,Kerrville,TX,USA,29.976735,-99.08567972
ERY,Luce County Hale,Newberry,MI,USA,46.31118694,-85.45731639
ESC,Delta County,Escanaba,MI,USA,45.72266972,-87.09373139
ESF,Esler Regional,Alexandria,LA,USA,31.3949025,-92.29577194
ESN,Easton /Newnam,Easton,MD,USA,38.80416667,-76.069
EST,Estherville Municipal,Estherville,IA,USA,43.40744444,-94.74641667
ETB,West Bend Municipal,West Bend,WI,USA,43.42219444,-88.12792667
ETC,Edgecombe County,Tarboro,NC,USA,35.93710083,-77.54663833
ETH,Wheaton Municipal,Wheaton,MN,USA,45.78046056,-96.54353972
ETN,Eastland Municipal,Eastland,TX,USA,32.41349167,-98.80975667
EUF,Weedon,Eufaula,AL,USA,31.95131917,-85.128925
EUG,Mahlon Sweet,Eugene,OR,USA,44.12326,-123.2186856
EUL,Caldwell Industrial,Caldwell (Boise),ID,USA,43.64186111,-116.6357778
EVB,New Smyrna Beach Municipal,New Smyrna Beach,FL,USA,29.05580556,-80.94836111
EVM,Eveleth-Virginia Muni,Eveleth,MN,USA,47.42507778,-92.49846944
EVU,Maryville Memorial,Maryville,MO,USA,40.35260167,-94.91552722
EVV,Evansville Regional,Evansville,IN,USA,38.03799139,-87.53062667
EVW,Evanston-Uinta County Burns,Evanston,WY,USA,41.27494528,-111.0321286
EVY,Summit Airpark,Middletown,DE,USA,39.52038889,-75.72044444
EWB,New Bedford Municipal,New Bedford,MA,USA,41.67614167,-70.95694167
EWK,Newton-City-County,Newton,KS,USA,38.05710528,-97.27522861
EWN,Craven County Regional,New Bern,NC,USA,35.07297222,-77.04294444
EWR,Newark Intl,Newark,NJ,USA,40.69249722,-74.16866056
EWU,Newtok,Newtok,AK,USA,60.93865417,-164.6412147
EXI,Excursion Inlet SPB,Excursion Inlet,AK,USA,58.42049861,-135.4490328
EXX,Davidson County,Lexington,NC,USA,35.78114028,-80.30378194
EYE,Eagle Creek Airpark,Indianapolis,IN,USA,39.83070944,-86.29438056
EYW,Key West International,Key West,FL,USA,24.55611111,-81.75955556
EZI,Kewanee Municipal,Kewanee,IL,USA,41.20520361,-89.96386
EZM,Eastman-Dodge County,Eastman,GA,USA,32.21425,-83.12802778
EZZ,Cameron Memorial,Cameron,MO,USA,39.72755972,-94.276375
F00,Jones,Bonham,TX,USA,33.61172222,-96.17938889
F01,Quanah Municipal,Quanah,TX,USA,34.27708306,-99.75926861
F05,Vernon - Wilbarger County,Vernon,TX,USA,34.22566806,-99.28375
F06,Marian Airpark,Wellington,TX,USA,34.84561083,-100.1959481
F08,Eufaula Municipal,Eufaula,OK,USA,35.29593194,-95.62526417
F10,Henryetta Municipal,Henryetta,OK,USA,35.40687972,-96.01583278
F12,Rusk County,Henderson,TX,USA,32.14172222,-94.85172222
F17,Center Municipal,Center,TX,USA,31.83158333,-94.15641667
F18,Cleburne Municipal,Cleburne,TX,USA,32.35376389,-97.43375
F21,Memphis Municipal,Memphis,TX,USA,34.73958944,-100.5297008
F22,Perry Municipal,Perry,OK,USA,36.38559583,-97.27721083
F24,Minden-Webster,Minden,LA,USA,32.64601,-93.29808556
F28,El Reno Municipal,El Reno,OK,USA,35.47163639,-98.00599444
F29,Clarence E. Page Municipal,Oklahoma City,OK,USA,35.4880825,-97.82354556
F30,Sulphur Municipal,Sulphur,OK,USA,34.52453278,-96.98973944
F31,Lake Texoma State Park,Kingston,OK,USA,33.99287639,-96.64249722
F32,Healdton Municipal,Healdton,OK,USA,34.24925806,-97.47391306
F36,Cordell Municipal,Cordell,OK,USA,35.30421917,-98.96702167
F37,Wauchula Municipal,Wauchula,FL,USA,27.51364889,-81.88063917
F39,Grayson County,Sherman/Denison,TX,USA,33.71411111,-96.67366667
F41,Ennis Municipal,Ennis,TX,USA,32.32969444,-96.66388889
F44,Athens Jones Municipal,Athens,TX,USA,32.16384778,-95.82835306
F45,North Palm Beach County General Aviation,West Palm Beach,FL,USA,26.84537306,-80.22148111
F46,Rockwall Municipal,Rockwall,TX,USA,32.93059444,-96.43548556
F49,Slaton Municipal,Slaton,TX,USA,33.48481,-101.6607158
F51,Winnsboro Municipal,Winnsboro,TX,USA,32.93884556,-95.27886083
F53,Franklin County,Mount Vernon,TX,USA,33.21530583,-95.2374925
F55,Granbury Municipal,Granbury,TX,USA,32.44441583,-97.8169475
F56,Arledge,Stamford,TX,USA,32.91019472,-99.73422972
F70,French Valley,Murieta/Temecula,CA,USA,33.57605556,-117.1279722
F80,Atoka Municipal,Atoka,OK,USA,34.39833889,-96.14805972
F81,Okemah Flying,Okemah,OK,USA,35.42925306,-96.28778361
F84,Stigler Municipal,Stigler,OK,USA,35.28910556,-95.09389722
F85,Morton-Cochran County,Morton,TX,USA,33.72926389,-102.7338183
F87,Farmerville,Farmerville,LA,USA,32.72495583,-92.33716583
F88,Jonesboro,Jonesboro,LA,USA,32.20199028,-92.73293028
F89,Winnsboro Municipal,Winnsboro,LA,USA,32.15431917,-91.70012472
F91,Thomas P Stafford,Weatherford,OK,USA,35.54482944,-98.66849028
F99,Holdenville Municipal,Holdenville,OK,USA,35.085875,-96.41666667
FAI,Fairbanks International,Fairbanks,AK,USA,64.8136775,-147.8596694
FAM,Farmington Regional,Farmington,MO,USA,37.76107917,-90.42859722
FAQ,Fitiuta,Fitiuta Village,AS,USA,14.21577583,-169.4239058
FAR,Hector International,Fargo,ND,USA,46.91934889,-96.81498889
FAT,Fresno Yosemite International,Fresno,CA,USA,36.77619444,-119.7181389
FAY,Fayetteville Municipal,Fayetteville,NC,USA,34.99147222,-78.88
FBL,Faribault Municipal,Faribault,MN,USA,44.32468556,-93.31082889
FBR,Fort Bridger,Fort Bridger,WY,USA,41.39193583,-110.4067961
FBY,Fairbury Municipal,Fairbury,NE,USA,40.18297222,-97.16927778
FCA,Glacier Park Intl,Kalispell,MT,USA,48.31140472,-114.2550694
FCH,Fresno-Chandler Downtown,Fresno,CA,USA,36.732365,-119.8198961
FCI,Chesterfield County,Richmond,VA,USA,37.4065375,-77.52498667
FCM,Flying Cloud,Minneapolis,MN,USA,44.82724111,-93.45714639
FCY,Forrest City Municipal,Forrest City,AR,USA,34.94199806,-90.77496611
FDK,Frederick Municipal,Frederick,MD,USA,39.41758333,-77.37430556
FDR,Frederick Municipal,Frederick,OK,USA,34.35219472,-98.98460222
FDW,Fairfield County,Winnsboro,SC,USA,34.31547222,-81.10880556
FDY,Findlay,Findlay,OH,USA,41.01352778,-83.66869444
FEP,Albertus,Freeport,IL,USA,42.24626722,-89.58223944
FET,Fremont Municipal,Fremont,NE,USA,41.44913889,-96.52019444
FFA,First Flight,Kill Devil Hills,NC,USA,36.01822278,-75.67128694
FFC,Peachtree City - Falcon,Atlanta,GA,USA,33.35725,-84.57183333
FFL,Fairfield Municipal,Fairfield,IA,USA,41.05332417,-91.97892333
FFM,Fergus Falls Muni-Einar Mickelson,Fergus Falls,MN,USA,46.28439389,-96.15668556
FFT,Capital City,Frankfort,KY,USA,38.18248861,-84.90470083
FFZ,Falcon,Mesa,AZ,USA,33.46083333,-111.7283333
FGX,Fleming-Mason,Flemingsburg,KY,USA,38.54180556,-83.74338889
FHR,Friday Harbor,Friday Harbor,WA,USA,48.52197222,-123.0243611
FHU,Libby AAF-Sierra Vista Municipal,Fort Huachuca-Sierra Vista,AZ,USA,31.58847222,-110.3443889
FIG,Clearfield-Lawrence,Clearfield,PA,USA,41.04861306,-78.41310306
FIT,Fitchburg Municipal,Fitchburg,MA,USA,42.55412194,-71.75895639
FKL,Chess-Lamberton,Franklin,PA,USA,41.37787361,-79.86036167
FKN,Franklin Municipal-John Beverly Rose,Franklin,VA,USA,36.69817806,-76.90312694
FKR,Frankfort Municipal,Frankfort,IN,USA,40.27343083,-86.56217028
FLD,Fond Du Lac County,Fond Du Lac,WI,USA,43.77117417,-88.48842917
FLG,Flagstaff Pulliam,Flagstaff,AZ,USA,35.13845472,-111.6712183
FLL,Fort Lauderdale-Hollywood Int'l,Ft. Lauderdale,FL,USA,26.07258333,-80.15275
FLO,Florence Regional,Florence,SC,USA,34.18536111,-79.72388889
FLP,Marion County Regional,Flippin,AR,USA,36.29087528,-92.59023417
FLT,Flat,Flat,AK,USA,62.45264889,-157.98907
FLX,Fallon Municipal,Fallon,NV,USA,39.499545,-118.7490197
FME,Tipton,Odenton,MD,USA,39.08538667,-76.75941444
FMN,Four Corners Regional,Farmington,NM,USA,36.74125,-108.2299444
FMY,Page,Ft. Myers,FL,USA,26.58661111,-81.86325
FMZ,Fairmont State,Fairmont,NE,USA,40.58569444,-97.57305556
FNB,Brenner,Falls City,NE,USA,40.07878611,-95.59199167
FNL,Fort Collins-Loveland,Fort Collins/Loveland,CO,USA,40.45182722,-105.0113356
FNR,Funter Bay SPB,Funter Bay,AK,USA,58.25438583,-134.8979067
FNT,Bishop,Flint,MI,USA,42.96550333,-83.74345639
FOA,Flora,Flora,IL,USA,38.66494528,-88.45299556
FOD,Fort Dodge Municipal,Fort Dodge,IA,USA,42.55145611,-94.19255111
FOE,Forbes,Topeka,KS,USA,38.95095194,-95.66361444
FOK,Francis Gabreski,Westhampton Beach,NY,USA,40.84365472,-72.63178917
FOT,Rohnerville,Fortuna,CA,USA,40.55393583,-124.1326589
FPR,St. Lucie County International,Ft. Pierce,FL,USA,27.49505556,-80.36827778
FQD,Rutherford County-Marchman,Rutherfordton,NC,USA,35.42822222,-81.93507778
FRG,Republic,Farmingdale,NY,USA,40.72878111,-73.41340722
FRH,French Lick Municipal,French Lick,IN,USA,38.50622139,-86.63693528
FRM,Fairmont Municipal,Fairmont,MN,USA,43.64394111,-94.41561556
FRR,Front Royal-Warren County,Front Royal,VA,USA,38.9175325,-78.25351472
FSD,Joe Foss,Sioux Falls,SD,USA,43.58135111,-96.74170028
FSE,Fosston Municipal,Fosston,MN,USA,47.59282028,-95.77349889
FSK,Fort Scott Municipal,Fort Scott,KS,USA,37.79843056,-94.76938111
FSM,Fort Smith Regional,Fort Smith,AR,USA,35.33659028,-94.36744111
FSO,Franklin County State,Highgate,VT,USA,44.94028083,-73.09746
FST,Fort Stockton - Pecos County,Fort Stockton,TX,USA,30.91566667,-102.9161389
FSU,Fort Sumner Municipal,Fort Sumner,NM,USA,34.48339944,-104.2171967
FSW,Fort Madison Municipal,Fort Madison,IA,USA,40.6592625,-91.3268175
FTG,Front Range,Denver,CO,USA,39.78525,-104.5431389
FTT,Elton Hensley Memorial,Fulton,MO,USA,38.83987472,-92.00421056
FTW,Fort Worth Meacham International,Fort Worth,TX,USA,32.81977778,-97.36244444
FTY,Fulton County - Brown,Atlanta,GA,USA,33.77913889,-84.52136111
FUL,Fullerton Municipal,Fullerton,CA,USA,33.87201417,-117.9797842
FVE,Northern Aroostook Regional,Frenchville,ME,USA,47.28550417,-68.31275
FVX,Farmville Municipal,Farmville,VA,USA,37.35752861,-78.43779806
FWA,Fort Wayne International,Fort Wayne,IN,USA,40.97846583,-85.19514639
FWC,Fairfield Municipal,Fairfield,IL,USA,38.37863306,-88.41265222
FWN,Sussex,Sussex,NJ,USA,41.20020667,-74.62305056
FWS,Spinks,Fort Worth,TX,USA,32.56522778,-97.30807778
FXE,Fort Lauderdale Executive,Ft. Lauderdale,FL,USA,26.19728,-80.17070833
FXY,Forest City Municipal,Forest City,IA,USA,43.23473417,-93.6241025
FYE,Fayette County,Somerville,TN,USA,35.20592,-89.39441667
FYM,Fayetteville Municipal,Fayetteville,TN,USA,35.05836278,-86.56441139
FYU,Fort Yukon,Fort Yukon,AK,USA,66.57149028,-145.2504169
FYV,Fayetteville Municipal,Fayetteville,AR,USA,36.00509472,-94.17005694
FZG,Fitzgerald Municipal,Fitzgerald,GA,USA,31.68368667,-83.27046056
FZI,Fostoria Metropolitan,Fostoria,OH,USA,41.19083111,-83.39453639
FZY,Oswego Cty,Fulton,NY,USA,43.35077528,-76.38805361
GAB,Gabbs,Gabbs,NV,USA,38.92409111,-117.9590072
GAD,Gadsden Municipal,Gadsden,AL,USA,33.97262528,-86.08900139
GAF,Grafton Municipal,Grafton,ND,USA,48.40469444,-97.37094444
GAG,Gage,Gage,OK,USA,36.29553889,-99.77642361
GAI,Montgomery Co Airpark,Gaithersburg,MD,USA,39.16833611,-77.166
GAL,Edward G. Pitka Sr.,Galena,AK,USA,64.73617806,-156.9374164
GAM,Gambell,Gambell,AK,USA,63.76676556,-171.7328236
GAS,Gallia - Meigs Regional,Gallipolis,OH,USA,38.83410833,-82.16342306
GBD,Great Bend Municipal,Great Bend,KS,USA,38.34441861,-98.85917028
GBG,Galesburg Municipal,Galesburg,IL,USA,40.93800194,-90.43112556
GBH,Galbraith Lake,Galbraith Lake,AK,USA,68.47906306,-149.4900214
GBR,Great Barrington,Great Barrington,MA,USA,42.18421417,-73.40324056
GCC,Gillette-Campbell County,Gillette,WY,USA,44.34889806,-105.5393614
GCK,Garden City Regional,Garden City,KS,USA,37.92751556,-100.7244147
GCM,Claremore Regional,Claremore,OK,USA,36.29441667,-95.47966667
GCN,Grand Canyon National Park,Grand Canyon,AZ,USA,35.95235389,-112.1469647
GCT,Guthrie County Regional,Guthrie Center,IA,USA,41.68776417,-94.43524611
GCY,Greeneville Municipal,Greeneville,TN,USA,36.19299083,-82.81507028
GDM,Gardner Municipal,Gardner,MA,USA,42.54986639,-72.01602194
GDV,Dawson Community,Glendive,MT,USA,47.13871861,-104.8071994
GDW,Gladwin,Gladwin,MI,USA,43.97063278,-84.47503861
GDY,Grundy Municipal,Grundy,VA,USA,37.23240111,-82.12499083
GED,Sussex Cty Arpt,Georgetown,DE,USA,38.68919444,-75.35888889
GEG,Spokane Intl,Spokane,WA,USA,47.61985556,-117.5338425
GEO,Brown County,Georgetown,OH,USA,38.88195778,-83.88273278
GEU,Glendale Municipal,Glendale,AZ,USA,33.52726278,-112.2951564
GEY,South Big Horn County,Greybull,WY,USA,44.51644444,-108.0831944
GEZ,Shelbyville Municipal,Shelbyville,IN,USA,39.58316583,-85.80481
GFK,Grand Forks International,Grand Forks,ND,USA,47.949255,-97.17611111
GFL,Floyd D. Bennett,Glens Falls,NY,USA,43.34121,-73.6103075
GFZ,Greenfield Municipal,Greenfield,IA,USA,41.32702778,-94.44572222
GGE,Georgetown County,Georgetown,SC,USA,33.31169444,-79.31958333
GGF,Grant Municipal,Grant,NE,USA,40.86952778,-101.7328611
GGG,Gregg County,Longview,TX,USA,32.38486111,-94.71171
GGI,Grinnell Municipal,Grinnell,IA,USA,41.70916083,-92.73491278
GGP,Logansport Municipal,Logansport,IN,USA,40.71126139,-86.37449917
GGW,Wokal Field/Glasgow Intl,Glasgow,MT,USA,48.21246417,-106.6148231
GHM,Centerville Municipal,Centerville,TN,USA,35.83742722,-87.445375
GHW,Glenwood Municipal,Glenwood,MN,USA,45.64389167,-95.32043056
GIF,Winter Havens Gilbert,Winter Haven,FL,USA,28.06291667,-81.75330556
GJT,Walker,Grand Junction,CO,USA,39.1224125,-108.5267347
GKJ,Port Meadville,Meadville,PA,USA,41.62652667,-80.2147275
GKN,Gulkana,Gulkana,AK,USA,62.15488889,-145.4566389
GKT,Gatlinburg-Pigeon Forge,Sevierville,TN,USA,35.85775889,-83.52870472
GKY,Arlington Municipal,Arlington,TX,USA,32.66241528,-97.09391139
GLD,Renner Field/Goodland Municipal,Goodland,KS,USA,39.37062194,-101.6989919
GLE,Gainesville Municipal,Gainesville,TX,USA,33.65136111,-97.19702778
GLH,Mid Delta Regional,Greenville,MS,USA,33.48288111,-90.98561389
GLR,Otsego County,Gaylord,MI,USA,45.01354806,-84.70318944
GLS,Galveston-Scholes,Galveston,TX,USA,29.26532333,-94.86040667
GLW,Glasgow Municipal,Glasgow,KY,USA,37.03205556,-85.95261111
GLY,Clinton Memorial,Clinton,MO,USA,38.35657306,-93.68417694
GMJ,Grove Municipal,Grove,OK,USA,36.60527056,-94.73856667
GMU,Greenville Downtown,Greenville,SC,USA,34.84794444,-82.35
GNB,Granby-Grand County,Granby,CO,USA,40.08970806,-105.9172367
GNF,Grenada Municipal,Grenada,MS,USA,33.83253,-89.79822806
GNG,Gooding Municipal,Gooding,ID,USA,42.91716639,-114.7651575
GNT,Grants-Milan Municipal,Grants,NM,USA,35.16531472,-107.9006142
GNU,Goodnews,Goodnews,AK,USA,59.11727556,-161.5813967
GNV,Gainesville Regional,Gainesville,FL,USA,29.69005556,-82.27177778
GOK,Guthrie Municipal,Guthrie,OK,USA,35.84980556,-97.41560833
GON,Groton-New London,Groton,CT,USA,41.33005778,-72.04513556
GPH,Clay County Regional,Mosby,MO,USA,39.33046528,-94.30997361
GPM,Grand Prairie Municipal,Grand Prairie,TX,USA,32.69858333,-97.04652778
GPT,Gulfport-Biloxi Regional,Gulfport-Biloxi,MS,USA,30.40728028,-89.07009278
GPZ,Grand Rapids-Itasca County,Grand Rapids,MN,USA,47.21110333,-93.50984472
GQQ,Galion Municipal,Galion,OH,USA,40.75338889,-82.72380556
GRB,Austin Straubel International,Green Bay,WI,USA,44.48507333,-88.12959
GRD,Greenwood County,Greenwood,SC,USA,34.24872222,-82.15908333
GRE,Greenville,Greenville,IL,USA,38.83615778,-89.37841111
GRI,Central Nebraska Regional,Grand Island,NE,USA,40.96747222,-98.30861111
GRK,Robert Gray AAF,Killeen,TX,USA,31.06489778,-97.82779778
GRN,Gordon Municipal,Gordon,NE,USA,42.80597222,-102.17525
GRO,Rota International,Rota Island,CQ,USA,14.1743075,-145.2425353
GRR,Kent County International,Grand Rapids,MI,USA,42.88081972,-85.52276778
GSH,Goshen Municipal,Goshen,IN,USA,41.52716028,-85.79210278
GSN,Saipan International,Obyan,CQ,USA,15.11900139,-145.7293561
GSO,Piedmont Triad International,Greensboro,NC,USA,36.09774694,-79.9372975
GSP,Greenville-Spartanburg,Greer,SC,USA,34.89566722,-82.21885833
GST,Gustavus,Gustavus,AK,USA,58.42438139,-135.7073814
GTF,Great Falls Intl,Great Falls,MT,USA,47.48200194,-111.3706853
GTR,Golden Triangle Regional,Columbus-Starkville-West Point,MS,USA,33.45033444,-88.59136861
GTU,Georgetown Municipal,Georgetown,TX,USA,30.67880889,-97.67938389
GUC,Gunnison County,Gunnison,CO,USA,38.53396333,-106.9331817
GUM,Guam International,Agana,GU,USA,13.48345,-144.7959825
GUP,Gallup Municipal,Gallup,NM,USA,35.51105833,-108.7893094
GUY,Guymon Municipal,Guymon,OK,USA,36.68507194,-101.5077817
GVL,Lee Gilmer Memorial,Gainesville,GA,USA,34.27290389,-83.82681333
GVQ,Genesee Cty,Batavia,NY,USA,43.03172639,-78.16759972
GVT,Majors,Greenville,TX,USA,33.06783889,-96.0653325
GWO,Greenwood-Leflore,Greenwood,MS,USA,33.49432667,-90.084705
GWR,Gwinner-Roger Melroe,Gwinner,ND,USA,46.21872222,-97.64325
GWW,Goldsboro-Wayne Municipal,Goldsboro,NC,USA,35.46055444,-77.96493306
GXY,Greeley-Weld County,Greeley,CO,USA,40.43561833,-104.6321156
GYH,Donaldson Center,Greenville,SC,USA,34.75831917,-82.376415
GYR,Phoenix Goodyear,Goodyear,AZ,USA,33.42281972,-112.3759919
GYY,Gary/Chicago,Gary,IN,USA,41.61627306,-87.41278806
GZH,Middleton,Evergreen,AL,USA,31.41580111,-87.04404333
GZS,Abernathy,Pulaski,TN,USA,35.15371972,-87.05681444
H04,Vinita Municipal,Vinita,OK,USA,36.63301806,-95.15136111
H05,Wilburton Municipal,Wilburton,OK,USA,34.91954278,-95.39469722
H19,Bowling Green Municipal,Bowling Green,MO,USA,39.36993361,-91.21925556
H21,Camdenton Memorial,Camdenton,MO,USA,37.97468528,-92.69161528
H30,Hamilton Municipal,Hamilton,NY,USA,42.84381889,-75.56140194
H35,Clarksville Municipal,Clarksville,AR,USA,35.47069417,-93.427155
H41,Memorial,Mexico,MO,USA,39.15751389,-91.81826667
H45,Seminole Municipal,Seminole,OK,USA,35.27467806,-96.67516194
H66,Nowata Municipal,Nowata,OK,USA,36.72092222,-95.62525583
H71,Mid-America Industrial,Pryor,OK,USA,36.22539389,-95.33006333
H79,Eldon Model Airpark,Eldon,MO,USA,38.36062611,-92.57157139
H88,Municipal,Fredericktown,MO,USA,37.605825,-90.28731389
H92,Hominy,Hominy,OK,USA,36.43340222,-96.38362861
H96,Benton Municipal,Benton,IL,USA,38.00675111,-88.93441528
H97,Pawnee Municipal,Pawnee,OK,USA,36.38338556,-96.8103125
HAB,Marion County,Hamilton,AL,USA,34.11757222,-87.99819583
HAE,Hannibal Municipal,Hannibal,MO,USA,39.72448944,-91.44367944
HAF,Half Moon Bay,Half Moon Bay,CA,USA,37.51382944,-122.5010892
HAI,Three Rivers Municipal,Three Rivers,MI,USA,41.95975,-85.59338889
HAO,Hamilton-Fairfield,Hamilton,OH,USA,39.36448861,-84.52457722
HAY,Haycock,Haycock,AK,USA,65.20098944,-161.1567792
HBC,Mohall Municipal,Mohall,ND,USA,48.76838333,-101.5369953
HBG,Bobby L. Chain Municipal,Hattiesburg,MS,USA,31.26506556,-89.2530325
HBR,Hobart Municipal,Hobart,OK,USA,34.9913075,-99.0513525
HBV,Jim Hogg County,Hebbronville,TX,USA,27.34955556,-98.73697222
HBZ,Heber Springs Municipal,Heber Springs,AR,USA,35.51169389,-92.01300944
HCD,Hutchinson Municipal,Hutchinson,MN,USA,44.85890667,-94.38178917
HCO,Hallock Municipal,Hallock,MN,USA,48.75273139,-96.94300306
HDC,Hammond Municipal,Hammond,LA,USA,30.52096889,-90.41762056
HDE,Brewster,Holdredge,NE,USA,40.45269444,-99.33733333
HDH,Dillingham Airfield,Mokuleia,HI,USA,21.57947361,-158.1972814
HDI,Hardwick,Cleveland,TN,USA,35.22007306,-84.83244333
HDN,Yampa Valley,Hayden,CO,USA,40.48118028,-107.2176597
HDO,Hondo Municipal,Hondo,TX,USA,29.35952778,-99.17666667
HEE,Thompson-Robbins,Helena-West Helena,AR,USA,34.57648972,-90.67588639
HEF,Manassas Reg./Harry P Davis,Manassas,VA,USA,38.72141667,-77.51544444
HEI,Hettinger Municipal,Hettinger,ND,USA,46.01494444,-102.6559722
HEQ,Holyoke,Holyoke,CO,USA,40.56943056,-102.2726875
HEZ,Natchez-Adams County,Natchez,MS,USA,31.61366111,-91.29733639
HFD,Hartford Brainard,Hartford,CT,USA,41.73626861,-72.65021389
HFY,Greenwood Municipal,Indianapolis/Greenwood,IN,USA,39.62841667,-86.08788889
HGR,Hagerstown Regional-Richard Henson,Hagerstown,MD,USA,39.70794444,-77.7295
HHF,Hemphill County,Canadian,TX,USA,35.89530778,-100.4036397
HHG,Huntington Municipal,Huntington,IN,USA,40.85299,-85.45941917
HHH,Hilton Head,NA,NA,USA,32.224384,-80.697629
HHR,Jack Northrop Field/Hawthorne Municipal,Hawthorne,CA,USA,33.92283972,-118.3351872
HHW,Stan Stamper Municipal,Hugo,OK,USA,34.03482556,-95.54190611
HI01,Princeville,Hanalei,HI,USA,22.20919,-159.4455339
HIB,Chisholm-Hibbing,Hibbing,MN,USA,47.38659917,-92.83899333
HIE,Mt Washington Regional,Whitefield,NH,USA,44.36761639,-71.54447111
HIG,Higginsville Industrial Municipal,Higginsville,MO,USA,39.07334639,-93.67716083
HII,Lake Havasu City,Lake Havasu City,AZ,USA,34.56816056,-114.3561783
HIO,Portland-Hillsboro,Hillsboro (Portland),OR,USA,45.54039389,-122.9498258
HJH,Hebron Municipal,Hebron,NE,USA,40.15225,-97.58697222
HJO,Hanford Municipal,Hanford,CA,USA,36.31852194,-119.6288675
HKA,Blytheville Municipal,Blytheville,AR,USA,35.94040667,-89.83080583
HKS,Hawkins,Jackson,MS,USA,32.3347725,-90.22253167
HKY,Hickory Municipal,Hickory,NC,USA,35.74114639,-81.38954889
HLC,Hill City Municipal,Hill City,KS,USA,39.37883611,-99.83149444
HLG,Wheeling-Ohio Cty,Wheeling,WV,USA,40.175,-80.64627778
HLN,Helena Regional,Helena,MT,USA,46.60681806,-111.9827503
HLX,Twin County,Galax,VA,USA,36.76611472,-80.82356556
HMT,Hemet-Ryan,Hemet,CA,USA,33.73398167,-117.0225258
HMZ,Bedford County,Bedford,PA,USA,40.08536861,-78.51221778
HNB,Huntingburg,Huntingburg,IN,USA,38.24902583,-86.95371833
HNH,Hoonah,Hoonah,AK,USA,58.09609139,-135.4096975
HNL,Honolulu International,Honolulu,HI,USA,21.31869111,-157.9224072
HNM,Hana,Hana,HI,USA,20.79563722,-156.0144378
HNR,Harlan Municipal,Harlan,IA,USA,41.58438889,-95.33963889
HNS,Haines,Haines,AK,USA,59.24522806,-135.5221086
HNZ,Henderson-Oxford,Oxford,NC,USA,36.36156111,-78.52916639
HOB,Lea County Regional,Hobbs,NM,USA,32.68752778,-103.2170278
HOC,Highland County,Hillsboro,OH,USA,39.18875944,-83.53880694
HOE,Homerville,Homerville,GA,USA,31.05591667,-82.77413889
HOM,Homer,Homer,AK,USA,59.64555556,-151.4765833
HON,Huron Regional,Huron,SD,USA,44.38520056,-98.2285425
HOT,Memorial,Hot Springs,AR,USA,34.47803389,-93.09620833
HOU,William P Hobby,Houston,TX,USA,29.64541861,-95.27888889
HPB,Hooper Bay,Hooper Bay,AK,USA,61.52418306,-166.1467797
HPN,Westchester Cty,White Plains,NY,USA,41.06695778,-73.70757444
HPT,Hampton Municipal,Hampton,IA,USA,42.72372361,-93.22634056
HQG,Hugoton Municipal,Hugoton,KS,USA,37.16308056,-101.3705267
HQM,Bowerman,Hoquiam,WA,USA,46.97120167,-123.9365581
HQU,Thomson-McDuffie County,Thomson,GA,USA,33.52972639,-82.51678556
HQZ,Mesquite Metro,Mesquite,TX,USA,32.74696278,-96.53041722
HRI,Hermiston Muni,Hermiston,OR,USA,45.82822222,-119.2591667
HRL,Valley International,Harlingen,TX,USA,26.22850611,-97.65439389
HRO,Boone County,Harrison,AR,USA,36.26152056,-93.15472889
HRR,Healy River,Healy,AK,USA,63.86620806,-148.9689842
HRU,Herington Municipal,Herington,KS,USA,38.68322389,-96.80800639
HRX,Hereford Municipal,Hereford,TX,USA,34.85761639,-102.3272017
HSA,Stennis International,Bay St Louis,MS,USA,30.36780778,-89.45461083
HSB,Harrisburg-Raleigh,Harrisburg,IL,USA,37.8115,-88.54913889
HSE,Billy Mitchell,Hatteras,NC,USA,35.2327875,-75.617795
HSI,Hastings Municipal,Hastings,NE,USA,40.60525,-98.42788889
HSL,Huslia,Huslia,AK,USA,65.70055556,-156.3875
HSP,Ingalls,Hot Springs,VA,USA,37.95144444,-79.83389444
HSR,Hot Springs Municipal,Hot Springs,SD,USA,43.36824528,-103.3881378
HSV,Huntsville International,Huntsville,AL,USA,34.6404475,-86.77310944
HTH,Hawthorne Municipal,Hawthorne,NV,USA,38.54436583,-118.6343003
HTL,Roscommon County,Houghton Lake,MI,USA,44.35980556,-84.67111111
HTO,East Hampton,East Hampton,NY,USA,40.95957778,-72.25185056
HTS,Tri-State/Walker-Long,Huntington,WV,USA,38.36666667,-82.55802778
HTW,"Lawrence County Airpark,Inc",Chesapeake,OH,USA,38.41924861,-82.4943225
HUF,Terre Haute International-Hulman,Terre Haute,IN,USA,39.45146361,-87.30756111
HUL,Houlton International,Houlton,ME,USA,46.12308333,-67.79205556
HUM,Houma-Terrebonne,Houma,LA,USA,29.5665,-90.66041667
HUS,Hughes,Hughes,AK,USA,66.04112167,-154.2631903
HUT,Hutchinson Municipal,Hutchinson,KS,USA,38.06548306,-97.86063361
HVC,Hopkinsville-Christian County,Hopkinsville,KY,USA,36.85658333,-87.45725
HVE,Hanksville,Hanksville,UT,USA,38.41803722,-110.7040378
HVN,Tweed-New Haven,New Haven,CT,USA,41.26389889,-72.8871
HVR,Havre City-County,Havre,MT,USA,48.542985,-109.7623419
HVS,Hartsville Municipal,Hartsville,SC,USA,34.40308333,-80.11922222
HWD,Hayward Executive,Hayward,CA,USA,37.65926528,-122.1224083
HWI,Hawk Inlet SPB,Hawk Inlet,AK,USA,58.12744139,-134.7559531
HWO,North Perry,Hollywood,FL,USA,26.00142417,-80.24052056
HWQ,Wheatland County  At Harlowton,Harlowton,MT,USA,46.4541225,-109.8549061
HWV,Brookhaven,Shirley,NY,USA,40.81676528,-72.86204722
HXD,Hilton Head,Hilton Head Island,SC,USA,32.22436111,-80.69747222
HXF,Hartford Municipal,Hartford,WI,USA,43.34927806,-88.39112528
HYA,Barnstable Mun Boardman/Polando,Hyannis,MA,USA,41.66933639,-70.28035583
HYG,Hydaburg SPB,Hydaburg,AK,USA,55.20631611,-132.8283131
HYI,San Marcos Municipal,San Marcos,TX,USA,29.89361111,-97.86469444
HYL,Hollis SPB,Hollis,AK,USA,55.48158833,-132.6460942
HYR,Sawyer County,Hayward,WI,USA,46.02585722,-91.44424278
HYS,Hays Municipal,Hays,KS,USA,38.84494167,-99.27403361
HYW,Conway-Horry County,Conway,SC,USA,33.8285,-79.12216667
HZD,Carroll County,Huntingdon,TN,USA,36.08930722,-88.46329778
HZE,Mercer County Regional,Hazen,ND,USA,47.28986111,-101.5809444
HZL,Hazleton Muni,Hazleton,PA,USA,40.98677778,-75.99488889
HZR,False River Air Park,New Roads,LA,USA,30.71832333,-91.47866972
HZY,Ashtabula County,Ashtabula,OH,USA,41.77797528,-80.69551333
I05,Sturgis Municipal,Sturgis,KY,USA,37.54083333,-87.95183333
I12,Sidney Municipal,Sidney,OH,USA,40.24127944,-84.15101167
I16,Kee,Pineville,WV,USA,37.60044444,-81.55927778
I18,Jackson County,Ravenswood,WV,USA,38.92977778,-81.81947222
I19,Greene County,Dayton,OH,USA,39.69172639,-83.99023806
I22,Randolph County,Winchester,IN,USA,40.16885083,-84.92585333
I23,Fayette County,Washington Court House,OH,USA,39.57040167,-83.42052444
I25,Welch Muni,Welch,WV,USA,37.41678056,-81.52899417
I32,Morehead-Rowan County,Morehead,KY,USA,38.13341472,-83.53796528
I34,Greensburg-Decatur County,Greensburg,IN,USA,39.32691111,-85.52252694
I35,Tucker-Guthrie Memorial,Harlan,KY,USA,36.85981028,-83.36101639
I39,Madison County,Richmond,KY,USA,37.63152778,-84.33244444
I40,Richard Downing,Coshocton,OH,USA,40.30918056,-81.85338194
I42,Paoli Municipal,Paoli,IN,USA,38.58338806,-86.46248778
I43,James A Rhodes,Jackson,OH,USA,38.98135194,-82.57785667
I50,Stanton,Stanton,KY,USA,37.85008167,-83.84575194
I57,Pike County,Waverly,OH,USA,39.16693333,-82.928175
I63,Mt. Sterling Municipal,Mt. Sterling,IL,USA,39.9875,-90.80416667
I66,Clinton,Wilmington,OH,USA,39.50286111,-83.86305556
I67,Cincinnati West,Harrison,OH,USA,39.25894444,-84.77430556
I68,Lebanon-Warren County,Lebanon,OH,USA,39.46217306,-84.25184722
I69,Clermont County,Batavia,OH,USA,39.07839722,-84.21020722
I74,Grimes,Urbana,OH,USA,40.12928306,-83.7548775
I75,Osceola Municipal,Osceola,IA,USA,41.05221889,-93.68966222
I76,Peru Municipal,Peru,IN,USA,40.78631889,-86.14638306
I78,Union County,Marysville,OH,USA,40.22469444,-83.35161111
I83,Salem Municipal,Salem,IN,USA,38.60200167,-86.13997889
I86,Perry County,New Lexington,OH,USA,39.69159667,-82.19778583
I88,Pontiac Municipal,Pontiac,IL,USA,40.92372222,-88.6255
I93,Breckinridge County,Hardinsburg,KY,USA,37.78505944,-86.44192194
I95,Hardin County,Kenton,OH,USA,40.61072,-83.64359694
IAD,Washington Dulles International,Chantilly,VA,USA,38.94453194,-77.45580972
IAG,Niagara Falls Intl,Niagara Falls,NY,USA,43.10725861,-78.94538139
IAH,George Bush Intercontinental,Houston,TX,USA,29.98047222,-95.33972222
IAN,Bob Baker Memorial,Kiana,AK,USA,66.97937611,-160.4358597
IBM,Robert E. Arraj,Kimball,NE,USA,41.18805556,-103.6773889
ICL,Schenck,Clarinda,IA,USA,40.72178361,-95.02642667
ICT,Wichita Mid-Continent,Wichita,KS,USA,37.64995889,-97.43304583
IDA,Idaho Falls Regional,Idaho Falls,ID,USA,43.51455556,-112.0701667
IDI,Indiana Cty/Jimmy Stewart,Indiana,PA,USA,40.63222222,-79.10552778
IDL,Indianola Municipal,Indianola,MS,USA,33.48574611,-90.67887611
IDP,Independence Municipal,Independence,KS,USA,37.15837222,-95.77838333
IEM,Whittier,Whittier,AK,USA,60.7772125,-148.7215775
IEN,Pine Ridge,Pine Ridge,SD,USA,43.02257694,-102.5110728
IER,Natchitoches Municipal,Natchitoches,LA,USA,31.73572,-93.09913639
IFA,Iowa Falls Municipal,Iowa Falls,IA,USA,42.47078639,-93.26995361
IFP,Laughlin/Bullhead International,Bullhead City,AZ,USA,35.15738889,-114.5595278
IGG,Igiugig,Igiugig,AK,USA,59.32373528,-155.9032733
IGM,Kingman,Kingman,AZ,USA,35.25947222,-113.9380556
IGQ,Lansing Municipal,Chicago/Lansing,IL,USA,41.53988889,-87.53216667
IGT,Nightmute,Nightmute,AK,USA,60.47032722,-164.6856414
IIB,Independence Municipal,Independence,IA,USA,42.45359833,-91.94761833
IIK,Kipnuk,Kipnuk,AK,USA,59.93295111,-164.0305131
IIY,Washington-Wilkes County,Washington,GA,USA,33.77987528,-82.81661639
IJD,Windham,Willimantic,CT,USA,41.74404028,-72.18023583
IJX,Jacksonville Municipal,Jacksonville,IL,USA,39.77429694,-90.23856583
IKK,Greater Kankakee,Kankakee,IL,USA,41.07140417,-87.84626861
IKV,Ankeny Regional,Ankeny,IA,USA,41.69128556,-93.56630333
ILE,Killeen Municipal,Killeen,TX,USA,31.08583333,-97.6865
ILG,New Castle County,Wilmington,DE,USA,39.67872222,-75.60652778
ILI,Iliamna,Iliamna,AK,USA,59.75380028,-154.9109597
ILM,Wilmington International,Wilmington,NC,USA,34.27061111,-77.90255556
IML,Imperial Municipal,Imperial,NE,USA,40.50930556,-101.6205278
IMM,Immokalee,Immokalee,FL,USA,26.43316667,-81.40102778
IMS,Madison Municipal,Madison,IN,USA,38.75888889,-85.46552778
IMT,Ford,Iron Mountain/Kingsford,MI,USA,45.81835417,-88.1145425
IN03,Indianapolis Downtown,Indianapolis,IN,USA,39.76587639,-86.148875
IND,Indianapolis International,Indianapolis,IN,USA,39.71732917,-86.29438417
INK,Winkler County,Wink,TX,USA,31.77962833,-103.2013619
INL,Falls International,International Falls,MN,USA,48.56618722,-93.40306667
INT,Smith Reynolds,Winston-Salem,NC,USA,36.13372222,-80.222
INW,Winslow-Lindbergh Regional,Winslow,AZ,USA,35.02191667,-110.7225278
IOB,Mt Sterling-Montgomery County,Mount Sterling,KY,USA,38.05813889,-83.97958333
IOW,Iowa City Municipal,Iowa City,IA,USA,41.63924389,-91.54650333
IPJ,Lincoln County,Lincolnton,NC,USA,35.48332889,-81.16125833
IPL,Imperial County,Imperial,CA,USA,32.83422028,-115.5787456
IPT,Williamsport-Lycoming Cty,Williamsport,PA,USA,41.24183583,-76.92109556
IRK,Kirksville Regional,Kirksville,MO,USA,40.09364444,-92.54496917
IRS,Kirsch Municipal,Sturgis,MI,USA,41.8128725,-85.43906111
ISM,Kissimmee Municipal,Orlando,FL,USA,28.28980556,-81.43708333
ISN,Sloulin Field International,Williston,ND,USA,48.17793861,-103.6423467
ISO,Kinston Regional Jetport At Stallin,Kinston,NC,USA,35.32807944,-77.61552611
ISP,Long Island - MacArthur,Islip,NY,USA,40.7952425,-73.10021194
ISQ,Schoolcraft County,Manistique,MI,USA,45.97464056,-86.17183056
ISW,Alexander,Wisconsin Rapids,WI,USA,44.36033833,-89.83897056
ISZ,Cincinnati-Blue Ash,Cincinnati,OH,USA,39.24669444,-84.38897222
ITH,Tompkins Cty,Ithaca,NY,USA,42.49102778,-76.45844444
ITO,Hilo International,Hilo,HI,USA,19.72026306,-155.0484703
ITR,Kit Carson County,Burlington,CO,USA,39.2425,-102.2853889
IWA,Williams Gateway,Phoenix,AZ,USA,33.30783333,-111.6554722
IWD,Gogebic County,Ironwood,MI,USA,46.52747472,-90.13139667
IWH,Wabash Municipal,Wabash,IN,USA,40.76195972,-85.79873417
IWI,Wiscasset,Wiscasset,ME,USA,43.96141667,-69.71255556
IWK,Wales,Wales,AK,USA,65.62394028,-168.0991719
IWS,West Houston,Houston,TX,USA,29.81819444,-95.67261111
IXD,New Century Aircenter,Olathe,KS,USA,38.83090472,-94.89030333
IYK,Inyokern,Inyokern,CA,USA,35.65884306,-117.8295122
IYS,Wasilla,Wasilla,AK,USA,61.57196083,-149.5405556
IZA,Santa Ynez,Santa Ynez,CA,USA,34.60682028,-120.0755617
IZG,Eastern Slopes Regional,Fryeburg,ME,USA,43.99114472,-70.94787444
JAC,Jackson Hole,Jackson,WY,USA,43.60732417,-110.7377389
JAN,Jackson International,Jackson,MS,USA,32.31116667,-90.07588889
JAS,Jasper County -Bell,Jasper,TX,USA,30.89058333,-94.03483333
JAU,Campbell County,Jacksboro,TN,USA,36.33457556,-84.16234472
JAX,Jacksonville International,Jacksonville,FL,USA,30.49405556,-81.68786111
JBR,Jonesboro Municipal,Jonesboro,AR,USA,35.83186111,-90.64616667
JCT,Kimble County,Junction,TX,USA,30.51126,-99.76345528
JDN,Jordan,Jordan,MT,USA,47.33333417,-106.9339564
JEF,Jefferson City Memorial,Jefferson City,MO,USA,38.59117917,-92.15614389
JER,Jerome County,Jerome,ID,USA,42.72663639,-114.4571506
JES,Jesup-Wayne County,Jesup,GA,USA,31.55408333,-81.88344444
JFK,John F Kennedy Intl,New York,NY,USA,40.63975111,-73.77892556
JFX,Walker County,Jasper,AL,USA,33.90199528,-87.31416639
JHM,Kapalua,Lahaina,HI,USA,20.96293639,-156.6730317
JHW,Chautauqua Cty,Jamestown,NY,USA,42.15336861,-79.258035
JKA,Jack Edwards,Gulf Shores,AL,USA,30.28951667,-87.67371472
JKJ,Moorhead Municipal,Moorhead,MN,USA,46.83919194,-96.66313028
JKL,Julian Carroll,Jackson,KY,USA,37.59386111,-83.31725
JLN,Joplin Regional,Joplin,MO,USA,37.15181361,-94.49826833
JMR,Mora Municipal,Mora,MN,USA,45.88609722,-93.27177833
JMS,Jamestown Municipal,Jamestown,ND,USA,46.92971944,-98.67819528
JNU,Juneau International,Juneau,AK,USA,58.35496194,-134.5762764
JNX,Johnston County,Smithfield,NC,USA,35.54094139,-78.39032944
JOT,Joliet Park District,Chicago/Joliet,IL,USA,41.51805833,-88.17525583
JQF,Concord Regional,Concord,NC,USA,35.38520694,-80.70971389
JRA,Port Authority-W 30th St Midtown Heliport,New York,NY,USA,40.75454583,-74.00708389
JRB,Downtown Manhattan/Wall St. Heliport,New York,NY,USA,40.70121361,-74.00902833
JRF,Kalaeloa (John Rodgers),Kapolei,HI,USA,21.30735389,-158.0703017
JSO,Jacksonville-Cherokee County,Jacksonville,TX,USA,31.86933667,-95.21739028
JST,Johnstown-Cambria Cty,Johnstown,PA,USA,40.31611111,-78.83394444
JVL,Rock County,Janesville,WI,USA,42.61958222,-89.04034028
JVY,Clark County,Jeffersonville,IN,USA,38.36562278,-85.73829639
JWG,Watonga,Watonga,OK,USA,35.86469444,-98.42075
JWN,John C. Tune,Nashville,TN,USA,36.18236194,-86.88672278
JXN,Jackson County Reynolds,Jackson,MI,USA,42.25978556,-84.45940361
JYG,St James Municipal,St James,MN,USA,43.98631833,-94.55793722
JYL,Plantation Airpark,Sylvania,GA,USA,32.64544861,-81.59649722
JYM,Hillsdale Municipal,Hillsdale,MI,USA,41.92126083,-84.5857625
JYO,Leesburg Executive,Leesburg,VA,USA,39.07797222,-77.5575
JYR,Municipal,York,NE,USA,40.89675,-97.62277778
JZI,Charleston Executive,Charleston,SC,USA,32.70086111,-80.00291667
JZP,Pickens County,Jasper,GA,USA,34.45147972,-84.45659278
JZZ,Koliganek,Koliganek,AK,USA,59.72664194,-157.2594722
K01,Farington,Auburn,NE,USA,40.38750167,-95.78916167
K02,Perryville Municipal,Perryville,MO,USA,37.86866667,-89.86213889
K06,Greater Beardstown,Beardstown,IL,USA,39.97338139,-90.40373556
K09,Piseco Muni,Piseco,NY,USA,43.45340222,-74.51765083
K15,Linn Creek-Grand Glaize Memorial,Osage Beach,MO,USA,38.11045,-92.68054583
K20,Wendell H. Ford,Hazard,KY,USA,37.38783833,-83.26205889
K22,Big Sandy Regional,Prestonburg,KY,USA,37.75102778,-82.63669444
K24,Russell County,Jamestown,KY,USA,37.00888889,-85.10277778
K29,Council,Council,AK,USA,64.89788278,-163.7034472
K33,Salem Memorial,Salem,MO,USA,37.61523333,-91.60444167
K34,Municipal,Gardner,KS,USA,38.80708333,-94.95602778
K39,St Clair Memorial,St Clair,MO,USA,38.37594333,-90.97073944
K46,Blair Municipal,Blair,NE,USA,41.41805139,-96.1136275
K54,Teller,Teller,AK,USA,65.24089806,-166.3360067
K57,Gould Peterson Municipal,Tarkio,MO,USA,40.44583139,-95.36275806
K59,Amelia Earhart,Atchison,KS,USA,39.57052472,-95.18033139
K61,Moritz Memorial,Beloit,KS,USA,39.47115222,-98.12878389
K62,Falmouth Pendleton County,Falmouth,KY,USA,38.70423611,-84.39160417
K67,Oswego Municipal,Oswego,KS,USA,37.15978667,-95.04246222
K68,Garnett Municipal,Garnett,KS,USA,38.27918833,-95.21691833
K78,Abilene Municipal,Abilene.,KS,USA,38.90405583,-97.23585389
K81,Miami County,Paola,KS,USA,38.53751389,-94.92524194
K82,Smith Center Municipal,Smith Center,KS,USA,39.76112278,-98.79343639
K83,Sabetha Municipal,Sabetha,KS,USA,39.90416667,-95.7794325
K88,Allen County,Iola,KS,USA,37.87008333,-95.38638889
K89,Macon-Fower Memorial,Macon,MO,USA,39.72870694,-92.464455
K96,Tuscola,Tuscola,IL,USA,39.78086528,-88.30616
KAE,Kake SPB,Kake,AK,USA,56.97299639,-133.9456147
KAL,Kaltag,Kaltag,AK,USA,64.32571917,-158.7441475
KCC,Coffman Cove SPB,Coffman Cove,AK,USA,56.00324444,-132.8419689
KCL,Chignik Lagoon,Chignik Flats,AK,USA,56.31116306,-158.5359264
KEB,English Bay,English Bay,AK,USA,59.35214833,-151.9251558
KEK,Ekwok,Ekwok,AK,USA,59.35399444,-157.4744092
KFP,False Pass,False Pass,AK,USA,54.84744583,-163.4103222
KGX,Grayling,Grayling,AK,USA,62.89456056,-160.0649042
KIB,Ivanof Bay SPB,Ivanof Bay,AK,USA,55.89753333,-159.4886689
KIC,Mesa Del Rey,King City,CA,USA,36.22802139,-121.1218614
KKA,Koyuk,Koyuk,AK,USA,64.93404056,-161.158145
KKB,Kitoi Bay SPB,Kitoi Bay,AK,USA,58.19094611,-152.3704875
KLG,Kalskag,Kalskag,AK,USA,61.53627389,-160.3413306
KLL,Levelock,Levelock,AK,USA,59.11816472,-156.8652169
KLS,Kelso-Longview,Kelso,WA,USA,46.118,-122.8983889
KNB,Kanab Muni,Kanab,UT,USA,37.01110583,-112.5311936
KNW,Stuyahok,New Stuyahok,AK,USA,59.44955333,-157.3271908
KOA,Kona International At Keahole,Kailua/Kona,HI,USA,19.73876583,-156.0456314
KPB,Point Baker SPB,Point Baker,AK,USA,56.35185972,-133.6225864
KPH,Pauloff Harbor SPB,Pauloff Harbor,AK,USA,54.45912028,-162.6936406
KQA,Akutan SPB,Akutan,AK,USA,54.13246694,-165.7853111
KSM,St. Mary's,St. Mary's,AK,USA,62.06048639,-163.3021108
KTB,Thorne Bay,Thorne Bay,AK,USA,55.68796194,-132.5366758
KTN,Ketchikan International,Ketchikan,AK,USA,55.35556861,-131.71374
KTS,Brevig Mission,Brevig Mission,AK,USA,65.33136111,-166.4631667
KVC,King Cove,King Cove,AK,USA,55.1163475,-162.2662272
KVL,Kivalina,Kivalina,AK,USA,67.73125333,-164.5518019
KWT,Kwethluk,Kwethluk,AK,USA,60.80425194,-161.44535
KXA,Kasaan SPB,Kasaan,AK,USA,55.53741389,-132.3975144
KYK,Karluk,Karluk,AK,USA,57.56706389,-154.4503714
KYU,Koyukuk,Koyukuk,AK,USA,64.87714278,-157.7158358
L04,Holtville,Holtville,CA,USA,32.84032361,-115.2674806
L05,Kern Valley,Kernville,CA,USA,35.72828472,-118.4198069
L06,Furnace Creek,Death Valley National Park,CA,USA,36.46383694,-116.8814425
L08,Borrego Valley,Borrego Springs,CA,USA,33.25902778,-116.3209722
L12,Redlands Municipal,Redlands,CA,USA,34.08526167,-117.1463789
L15,Henderson,Las Vegas,NV,USA,35.97636444,-115.1327708
L17,Taft-Kern County,Taft,CA,USA,35.14107806,-119.4412294
L18,Fallbrook Community Airpark,Fallbrook,CA,USA,33.35419806,-117.2508686
L19,Wasco-Kern County,Wasco,CA,USA,35.61967889,-119.3537242
L26,Hesperia,Hesperia,CA,USA,34.37722333,-117.3158783
L31,Greater St. Tammany Parish,Covington,LA,USA,30.44505417,-89.98887889
L35,Big Bear City,Big Bear,CA,USA,34.26361944,-116.854475
L38,Louisiana Regional,Gonzales,LA,USA,30.17135306,-90.94039583
L39,Leesville,Leesville,LA,USA,31.16819444,-93.34245833
L42,Allen Parish,Oakdale,LA,USA,30.75016667,-92.68847222
L45,Bakersfield Municipal,Bakersfield,CA,USA,35.32483333,-118.9958333
L49,South Lafourche,Galliano,LA,USA,29.44482222,-90.26111667
L52,Oceano County,Oceano,CA,USA,35.10136472,-120.6221153
L67,Rialto Municipal,Rialto,CA,USA,34.12934361,-117.4016303
L70,Agua Dulce Airpark,Agua Dulce,CA,USA,34.50415889,-118.3128561
L71,California City Municipal,California City,CA,USA,35.15125306,-118.0166667
L72,Trona,Trona,CA,USA,35.81245333,-117.3272783
L75,Southland,Sulphur,LA,USA,30.13138889,-93.37611111
L83,Thibodaux Municipal,Thibodaux,LA,USA,29.74779194,-90.83289889
L84,Lost Hills-Kern County,Lost Hills,CA,USA,35.62357083,-119.6862383
L92,Alamo Landing,Alamo,NV,USA,37.36246083,-115.1944622
LAA,Lamar Muni,Lamar,CO,USA,38.06969444,-102.6885
LAF,Purdue University,Lafayette,IN,USA,40.41231694,-86.93689889
LAL,Lakeland Linder Regional,Lakeland,FL,USA,27.98891667,-82.01855556
LAM,Los Alamos,Los Alamos,NM,USA,35.87980194,-106.2694153
LAN,Capital City,Lansing,MI,USA,42.7787,-84.58735806
LAR,Laramie Regional,Laramie,WY,USA,41.31205,-105.6749864
LAS,McCarran International,Las Vegas,NV,USA,36.08036111,-115.1523333
LAW,Lawton-Ft Sill Regional,Lawton,OK,USA,34.56771444,-98.41663667
LAX,Los Angeles International,Los Angeles,CA,USA,33.94253611,-118.4080744
LBB,Lubbock International,Lubbock,TX,USA,33.66363889,-101.8227778
LBE,Arnold Palmer Regional,Latrobe,PA,USA,40.27594,-79.40479722
LBF,North Platte Regional,North Platte,NE,USA,41.12621194,-100.6836542
LBL,Liberal Municipal,Liberal,KS,USA,37.04420944,-100.9598611
LBO,Floyd W Jones Lebanon,Lebanon,MO,USA,37.64718056,-92.65375778
LBT,Lumberton Municipal,Lumberton,NC,USA,34.60991667,-79.05944444
LBX,Brazoria County,Angleton,TX,USA,29.10863889,-95.46208056
LCG,Wayne Municipal,Wayne,NE,USA,42.24188889,-96.98141667
LCH,Lake Charles Regional,Lake Charles,LA,USA,30.1260975,-93.22340361
LCI,Laconia Municipal,Laconia,NH,USA,43.57272806,-71.41890028
LCK,Rickenbacker International,Columbus,OH,USA,39.81375917,-82.92786472
LCQ,Lake City Municipal,Lake City,FL,USA,30.18205556,-82.57686111
LDJ,Linden,Linden,NJ,USA,40.61744722,-74.24459417
LDM,Mason County,Ludington,MI,USA,43.96253278,-86.40791528
LEB,Lebanon Municipal,Lebanon,NH,USA,43.62637222,-72.30426722
LEE,Leesburg Regional,Leesburg,FL,USA,28.82274417,-81.80900722
LEM,Lemmon Municipal,Lemmon,SD,USA,45.91869722,-102.1061778
LEW,Auburn-Lewiston Municipal,Auburn-Lewiston,ME,USA,44.04847278,-70.2835075
LEX,Blue Grass,Lexington,KY,USA,38.03697222,-84.60538889
LFK,Lufkin-Angelina County,Lufkin,TX,USA,31.23401389,-94.75
LFT,Lafayette Regional,Lafayette,LA,USA,30.20527972,-91.987655
LGA,LaGuardia,New York,NY,USA,40.77724306,-73.87260917
LGB,Long Beach (Daugherty),Long Beach,CA,USA,33.81772222,-118.1516111
LGC,LaGrange-Callaway,Lagrange,GA,USA,33.00884694,-85.07260556
LGD,La Grande/Union County,La Grande,OR,USA,45.29020944,-118.0071108
LGU,Logan-Cache,Logan,UT,USA,41.78773083,-111.8526822
LHD,Lake Hood SPB,Anchorage,AK,USA,61.18000361,-149.9719322
LHM,Lincoln Regional,Lincoln,CA,USA,38.90916111,-121.3513361
LHQ,Fairfield County,Lancaster,OH,USA,39.75564722,-82.65711
LHV,Wm T Piper Memorial,Lock Haven,PA,USA,41.13618028,-77.42053556
LHX,La Junta Muni,La Junta,CO,USA,38.05134111,-103.5106908
LHZ,Franklin County,Louisburg,NC,USA,36.02334528,-78.33027139
LIC,Limon Municipal,Limon,CO,USA,39.272765,-103.6663392
LIH,Lihue,Lihue,HI,USA,21.97598306,-159.3389581
LIT,Adams,Little Rock,AR,USA,34.72939611,-92.22424556
LJF,Litchfield Municipal,Litchfield,MN,USA,45.09712889,-94.50726833
LKP,Lake Placid,Lake Placid,NY,USA,44.26447361,-73.96186639
LKR,Lancaster County,Lancaster,SC,USA,34.72291667,-80.85458333
LKU,Louisa County / Freeman,Louisa,VA,USA,38.00983333,-77.97013889
LKV,Lake County,Lakeview,OR,USA,42.16111111,-120.3990703
LLJ,Challis,Challis,ID,USA,44.52297806,-114.2175642
LLQ,Monticello Municipal,Monticello,AR,USA,33.6385525,-91.75101833
LLU,Lamar Municipal,Lamar,MO,USA,37.4894925,-94.31150444
LMS,Louisville-Winston County,Louisville,MS,USA,33.14620944,-89.06247917
LMT,Klamath Falls International,Klamath Falls,OR,USA,42.15614361,-121.7332081
LNA,Palm Beach County Park,Lantana,FL,USA,26.593,-80.08505556
LNC,Lancaster,Lancaster,TX,USA,32.57919111,-96.71905111
LND,Hunt,Lander,WY,USA,42.81523611,-108.7298392
LNK,Lincoln Municipal,Lincoln,NE,USA,40.85097222,-96.75925
LNL,Kings Land O' Lakes,Land O' Lakes,WI,USA,46.15387722,-89.21194417
LNN,Lost Nation,Willoughby,OH,USA,41.68391667,-81.39030556
LNP,Lonesome Pine,Wise,VA,USA,36.98743194,-82.53017361
LNS,Lancaster,Lancaster,PA,USA,40.12171528,-76.29609778
LNY,Lanai,Lanai City,HI,USA,20.78561111,-156.9514181
LOL,Derby,Lovelock,NV,USA,40.066405,-118.5651664
LOT,Lewis University,Chicago/Romeoville,IL,USA,41.60844444,-88.09094444
LOU,Bowman,Louisville,KY,USA,38.228,-85.66372222
LOZ,London-Corbin  Magee,London,KY,USA,37.08727778,-84.07677778
LPC,Lompoc,Lompoc,CA,USA,34.66561028,-120.4667883
LPR,Lorain Co Regional,Lorain/Elyria,OH,USA,41.34427778,-82.17763889
LQK,Pickens County,Pickens,SC,USA,34.80997222,-82.70288889
LQR,Larned-Pawnee County,Larned,KS,USA,38.20809667,-99.08607306
LRD,Laredo International,Laredo,TX,USA,27.54373861,-99.46154361
LRG,Lincoln Regional,Lincoln,ME,USA,45.36216083,-68.53474694
LRJ,Le Mars Municipal,Le Mars,IA,USA,42.77801778,-96.19368944
LRU,Las Cruces International,Las Cruces,NM,USA,32.28941667,-106.9219722
LSB,Lordsburg Municipal,Lordsburg,NM,USA,32.33278083,-108.6909742
LSE,La Crosse Municipal,La Crosse,WI,USA,43.87937972,-91.25653778
LSK,Lusk Muni,Lusk,WY,USA,42.75380806,-104.4045536
LSN,Los Banos Municipal,Los Banos,CA,USA,37.06290556,-120.8692511
LUG,Ellington,Lewisburg,TN,USA,35.506975,-86.80388611
LUK,Cincinnati Muni-Lunken,Cincinnati,OH,USA,39.10334417,-84.41861417
LUL,Hesler-Noble,Laurel,MS,USA,31.67255139,-89.17222417
LUP,Kalaupapa,Kalaupapa,HI,USA,21.21104028,-156.9735972
LVJ,Clover,Houston,TX,USA,29.52130556,-95.24216667
LVK,Livermore Municipal,Livermore,CA,USA,37.69339944,-121.8203519
LVM,Mission,Livingston,MT,USA,45.69938889,-110.4483056
LVN,Airlake,Minneapolis,MN,USA,44.62785361,-93.22810806
LVS,Las Vegas Municipal,Las Vegas,NM,USA,35.65422222,-105.1423889
LWB,Greenbrier Valley,Lewisburg,WV,USA,37.85830556,-80.39947222
LWC,Lawrence Municipal,Lawrence,KS,USA,39.01115222,-95.21657694
LWD,Lamoni Municipal,Lamoni,IA,USA,40.63333306,-93.90217028
LWL,Wells Municipal/Harriet,Wells,NV,USA,41.11853306,-114.9222661
LWM,Lawrence Municipal,Lawrence,MA,USA,42.71720944,-71.12343
LWS,Lewiston-Nez Perce County,Lewiston,ID,USA,46.37449806,-117.0153944
LWT,Lewistown Muni,Lewistown,MT,USA,47.04913944,-109.4666006
LWV,Lawrenceville-Vincennes Municipal,Lawrenceville,IL,USA,38.76429639,-87.60549556
LXL,Little Falls - Morrison County,Little Falls,MN,USA,45.94943778,-94.34708472
LXN,Lexington (Jim Kelly),Lexington,NE,USA,40.791,-99.77727778
LXT,Lee's Summit Municipal,Lee's Summit,MO,USA,38.95975,-94.37158333
LXV,Lake County,Leadville,CO,USA,39.2202675,-106.3166906
LXY,Mexia-Limestone County,Mexia,TX,USA,31.63983472,-96.51472222
LYH,Lynchburg Municipal-Preston Glenn,Lynchburg,VA,USA,37.32668528,-79.20043056
LYO,Lyons-Rice County Municipal,Lyons,KS,USA,38.34261472,-98.22709639
LZU,Gwinnett County,Lawrenceville,GA,USA,33.97807611,-83.96237722
M01,General Dewitt Spain,Memphis,TN,USA,35.20069278,-90.05397694
M02,Dickson Municipal,Dickson,TN,USA,36.12931722,-87.43007056
M03,Dennis F Cantrell,Conway,AR,USA,35.08080778,-92.42496167
M04,Covington Municipal,Covington,TN,USA,35.583365,-89.58722167
M05,Caruthersville Memorial,Caruthersville,MO,USA,36.17506917,-89.67508
M08,William L. Whitehurst,Bolivar,TN,USA,35.21445944,-89.04336222
M09,Piedmont Municipal,Piedmont,MO,USA,37.12671694,-90.7128975
M11,Copiah County,Crystal Springs,MS,USA,31.90293639,-90.36870222
M13,Poplarville-Pearl River County,Poplarville,MS,USA,30.78602056,-89.50450694
M15,Perry County,Linden,TN,USA,35.59590306,-87.87669361
M16,John Bell Williams,Raymond,MS,USA,32.30334111,-90.40848333
M17,Bolivar Municipal,Bolivar,MO,USA,37.59693194,-93.34765
M18,Hope Municipal,Hope,AR,USA,33.72008889,-93.65884556
M19,Newport Municipal,Newport,AR,USA,35.63771778,-91.17637556
M21,Muhlenberg County,Greenville,KY,USA,37.22561111,-87.15752778
M22,Russellville Municipal,Russellville,AL,USA,34.44953972,-87.71030833
M23,James H. Easom,Newton,MS,USA,32.31181111,-89.13589194
M24,Dean Griffin Memorial,Wiggins,MS,USA,30.84324389,-89.15977333
M25,Mayfield-Graves County,Mayfield,KY,USA,36.76911111,-88.58472222
M27,Waldron Municipal,Waldron,AR,USA,34.87509944,-94.10993056
M29,Hassel,Clifton,TN,USA,35.38507528,-87.96752833
M30,Metropolis Municipal,Metropolis,IL,USA,37.18588722,-88.75061
M32,Lake Village Municipal,Lake Village,AR,USA,33.3459775,-91.31569833
M33,Sumner County Regional,Gallatin,TN,USA,36.37684472,-86.40875861
M34,Kentucky Dam State Park,Gilbertsville,KY,USA,37.00950028,-88.29586639
M36,Frank Federer Memorial,Brinkley,AR,USA,34.88000194,-91.1764375
M37,Ruleville-Drew,Drew,MS,USA,33.77639167,-90.52500833
M39,Mena Intermountain Municipal,Mena,AR,USA,34.54539444,-94.20265278
M40,Monroe County,Aberdeen-Amory,MS,USA,33.87374861,-88.48967833
M41,Holly Springs-Marshall County,Holly Springs,MS,USA,34.80434611,-89.5211075
M43,Prentiss-Jefferson Davis County,Prentiss,MS,USA,31.59544583,-89.90619056
M44,Houston Municipal,Houston,MS,USA,33.89177944,-89.02367194
M46,Colstrip,Colstrip,MT,USA,45.85285,-106.7092722
M48,Houston Memorial,Houston,MO,USA,37.33009167,-91.97316944
M52,Franklin-Wilkins,Lexington,TN,USA,35.65131944,-88.37893444
M53,Humboldt Municipal,Humboldt,TN,USA,35.80218,-88.87494944
M54,Lebanon Municipal,Lebanon,TN,USA,36.19041667,-86.31569444
M58,Monett Municipal,Monett,MO,USA,36.90621528,-94.01275833
M59,Richton-Perry County,Richton,MS,USA,31.31739944,-88.93504778
M60,Woodruff County,Augusta,AR,USA,35.27175278,-91.27040417
M65,Wynne Municipal,Wynne,AR,USA,35.23160167,-90.76155111
M70,Pocahontas Municipal,Pocahontas,AR,USA,36.24551111,-90.95520444
M72,New Albany-Union County,New Albany,MS,USA,34.54722222,-89.02416667
M73,Almyra Municipal,Almyra,AR,USA,34.41232833,-91.46634722
M75,Malta,Malta,MT,USA,48.36694167,-107.9193444
M76,Picayune Municipal,Picayune,MS,USA,30.48748472,-89.65119306
M77,Howard County,Nashville,AR,USA,33.99673833,-93.83813583
M78,Malvern Municipal,Malvern,AR,USA,34.33331583,-92.76149944
M79,John H Hooks Jr Memorial,Rayville,LA,USA,32.48633611,-91.77087528
M82,Madison County Executive,Huntsville,AL,USA,34.85645028,-86.55621472
M83,McCharen,West Point,MS,USA,33.58403556,-88.66668694
M89,Dexter B. Florence Memorial,Arkadelphia,AR,USA,34.09984639,-93.06611694
M91,Springfield-Robertson County,Springfield,TN,USA,36.53726194,-86.92068917
M95,Richard Arthur,Fayette,AL,USA,33.71221972,-87.81504639
M97,Tunica Municipal,Tunica,MS,USA,34.69232306,-90.35065389
M99,Saline County/Watts,Benton,AR,USA,34.55656472,-92.60693972
MAC,Herbert Smart Downtown,Macon,GA,USA,32.82213889,-83.56202778
MAE,Madera Municipal,Madera,CA,USA,36.9857175,-120.1119844
MAF,Midland International,Midland,TX,USA,31.94252778,-102.2019139
MAI,Marianna Municipal,Marianna,FL,USA,30.83780556,-85.18188889
MAL,Malone-Dufort,Malone,NY,USA,44.85365722,-74.32894972
MAO,Marion County,Marion,SC,USA,34.18116667,-79.33472222
MAW,Malden Municipal,Malden,MO,USA,36.60055694,-89.99220278
MAZ,Eugenio Maria De Hostos,Mayaguez,PR,USA,18.25569444,-67.14847222
MBG,Mobridge Municipal,Mobridge,SD,USA,45.54650361,-100.4079192
MBL,Manistee County Blacker,Manistee,MI,USA,44.27319722,-86.2490025
MBO,Bruce Campbell,Madison,MS,USA,32.43866444,-90.10309222
MBS,Mbs International,Saginaw,MI,USA,43.53291472,-84.07964722
MBT,Murfreesboro Municipal,Murfreesboro,TN,USA,35.87748444,-86.37753222
MBY,Omar N Bradley,Moberly,MO,USA,39.46392583,-92.42759778
MCB,McComb-Pike County,McComb,MS,USA,31.17845444,-90.47187528
MCD,Mackinac Island,Mackinac Island,MI,USA,45.86493444,-84.63734444
MCE,Merced Municipal/MacReady,Merced,CA,USA,37.28472861,-120.5138858
MCG,McGrath,McGrath,AK,USA,62.95287361,-155.6057625
MCI,Kansas City International,Kansas City,MO,USA,39.29760528,-94.71390556
MCK,McCook Municipal,McCook,NE,USA,40.20638889,-100.5918056
MCN,Middle Georgia Regional,Macon,GA,USA,32.69284944,-83.64921083
MCO,Orlando International,Orlando,FL,USA,28.42888889,-81.31602778
MCW,Mason City Municipal,Mason City,IA,USA,43.1577925,-93.33126056
MCX,White County,Monticello,IN,USA,40.70881639,-86.76676139
MCZ,Martin County,Williamston,NC,USA,35.86219306,-77.17820278
MDD,Midland Airpark,Midland,TX,USA,32.03652444,-102.1010278
MDF,Mooreland Municipal,Mooreland,OK,USA,36.48475778,-99.19415778
MDH,Southern Illinois,Carbondale,IL,USA,37.77809583,-89.25203111
MDR,Medfra,Medfra,AK,USA,63.10577694,-154.7189806
MDS,Madison Municipal,Madison,SD,USA,44.01597222,-97.08593333
MDT,Harrisburg Intl,Harrisburg,PA,USA,40.19349528,-76.76340361
MDW,Chicago Midway,Chicago,IL,USA,41.7859825,-87.75242444
MDZ,Taylor County,Medford,WI,USA,45.10097556,-90.30341
MEB,Laurinburg-Maxton,Maxton,NC,USA,34.79193917,-79.36584778
MEI,Key,Meridian,MS,USA,32.33313333,-88.75120556
MEJ,Meade Municipal,Meade,KS,USA,37.27938889,-100.3563056
MEM,Memphis International,Memphis,TN,USA,35.04241667,-89.97666667
MER,Castle,Atwater,CA,USA,37.38048056,-120.5681889
MEV,Minden-Tahoe,Minden,NV,USA,39.00030889,-119.7508064
MEY,Mapleton Municipal,Mapleton,IA,USA,42.178295,-95.79364528
MFD,Mansfield Lahm Municipal,Mansfield,OH,USA,40.82141667,-82.51663889
MFE,McAllen Miller International,McAllen,TX,USA,26.17583333,-98.23861111
MFI,Marshfield Municipal,Marshfield,WI,USA,44.63687972,-90.18932667
MFR,Rogue Valley International,Medford,OR,USA,42.37422778,-122.8734978
MFV,Accomack County,Melfa,VA,USA,37.64688889,-75.76105556
MGC,Michigan City Municipal,Michigan City,IN,USA,41.70331694,-86.82124167
MGJ,Orange Cty,Montgomery,NY,USA,41.50998278,-74.26465056
MGM,Montgomery Regional Apt,Montgomery,AL,USA,32.30064417,-86.39397611
MGR,Moultrie Municipal,Moultrie,GA,USA,31.08490917,-83.80325528
MGW,Morgantown Muni-Walter L. Bill Hart Fld.,Morgantown,WV,USA,39.6429075,-79.91631417
MGY,Dayton Wright Brothers,Dayton,OH,USA,39.58897222,-84.22486111
MHE,Mitchell Municipal,Mitchell,SD,USA,43.77483333,-98.03861111
MHK,Manhattan Regional,Manhattan,KS,USA,39.14096722,-96.67083278
MHL,Marshall Memorial Municipal,Marshall,MO,USA,39.09575472,-93.20287889
MHM,Minchumina,Minchumina,AK,USA,63.880565,-152.3006756
MHP,Metter Municipal,Metter,GA,USA,32.37388889,-82.07919444
MHR,Sacramento Mather,Sacramento,CA,USA,38.55389694,-121.2975908
MHT,Manchester,Manchester,NH,USA,42.93451639,-71.43705583
MHV,Mojave,Mojave,CA,USA,35.05936472,-118.1518561
MIA,Miami International,Miami,FL,USA,25.79325,-80.29055556
MIB,Minot AFB,NA,NA,USA,48.415769,-101.358039
MIC,Crystal,Minneapolis,MN,USA,45.06198611,-93.3539375
MIE,Delaware County,Muncie,IN,USA,40.24234806,-85.39586
MIO,Miami Municipal,Miami,OK,USA,36.90922083,-94.88750028
MIT,Shafter-Minter,Shafter,CA,USA,35.50592944,-119.1915236
MIV,Millville Muni,Millville,NJ,USA,39.36780556,-75.07222222
MIW,Marshalltown Municipal,Marshalltown,IA,USA,42.11272639,-92.91778778
MJQ,Jackson Municipal,Jackson,MN,USA,43.65004111,-94.98654611
MJX,Robert J. Miller Airpark,Toms River,NJ,USA,39.92749806,-74.29237917
MKA,Miller Municipal,Miller,SD,USA,44.52524444,-98.95811444
MKC,Downtown,Kansas City,MO,USA,39.12324111,-94.592735
MKE,General Mitchell International,Milwaukee,WI,USA,42.94722222,-87.89658333
MKG,Muskegon County,Muskegon,MI,USA,43.16948806,-86.23822306
MKJ,Mountain Empire,Marion,VA,USA,36.8948525,-81.349955
MKK,Molokai,Kaunakakai,HI,USA,21.15288583,-157.0962561
MKL,McKellar-Sipes Regional,Jackson,TN,USA,35.59987944,-88.91561611
MKO,Davis,Muskogee,OK,USA,35.65773028,-95.36164889
MKT,Mankato Regional,Mankato,MN,USA,44.22164528,-93.91874333
MKV,Marksville Municipal,Marksville,LA,USA,31.09466,-92.06906861
MKY,Marco Island,Marco Island,FL,USA,25.99502778,-81.67252778
MLB,Melbourne International,Melbourne,FL,USA,28.10275,-80.64580556
MLC,McAlester Regional,McAlester,OK,USA,34.88240194,-95.78346278
MLE,Millard,Omaha,NE,USA,41.196,-96.11227778
MLF,Milford Municipal,Milford,UT,USA,38.4266325,-113.0124564
MLI,Quad City,Moline,IL,USA,41.44852639,-90.50753917
MLJ,Baldwin County,Milledgeville,GA,USA,33.15419444,-83.24061111
MLL,Marshall,Marshall,AK,USA,61.8659225,-162.0690456
MLS,Frank Wiley,Miles City,MT,USA,46.42795972,-105.8862397
MLT,Millinocket Municipal,Millinocket,ME,USA,45.64783611,-68.68556194
MLU,Monroe Regional,Monroe,LA,USA,32.51086556,-92.03768778
MLY,Manley Hot Springs,Manley Hot Springs,AK,USA,64.99756472,-150.6441297
MMH,Mammoth Yosemite,Mammoth Lakes,CA,USA,37.62404861,-118.8377722
MMI,McMinn County,Athens,TN,USA,35.39730333,-84.56256861
MMK,Meriden-Markham Municipal,Meriden,CT,USA,41.50871472,-72.82947833
MML,Marshall Muni - Ryan,Marshall,MN,USA,44.45006611,-95.82234028
MMU,Morristown Municipal,Morristown,NJ,USA,40.79935,-74.41487472
MMV,McMinnville Muni,McMinnville,OR,USA,45.19444444,-123.1359444
MNF,Mountain View,Mountain View,MO,USA,36.99282694,-91.71445611
MNI,Clarendon County,Manning,SC,USA,33.58711111,-80.20866667
MNM,Menominee-Marinette Twin County,Menominee,MI,USA,45.12665028,-87.63844056
MNN,Marion Municipal,Marion,OH,USA,40.61625,-83.06347222
MNV,Monroe County,Madisonville,TN,USA,35.54537222,-84.380235
MNZ,Hamilton Municipal,Hamilton,TX,USA,31.66592639,-98.1486375
MO6,Washington Memorial,Washington,MO,USA,38.59163472,-90.99761444
MO85,Lawrence Smith Memorial,Harrisonville,MO,USA,38.61102222,-94.34213056
MOB,Mobile Regional,Mobile,AL,USA,30.69141667,-88.24283333
MOD,Modesto City-County-Harry Sham,Modesto,CA,USA,37.62581722,-120.9544214
MOP,Mount Pleasant Municipal,Mount Pleasant,MI,USA,43.62166833,-84.737485
MOR,Moore-Murrell,Morristown,TN,USA,36.17939639,-83.37544944
MOT,Minot International,Minot,ND,USA,48.25937778,-101.2803339
MOU,Mountain Village,Mountain Village,AK,USA,62.09536222,-163.6820594
MOX,Morris Municipal,Morris,MN,USA,45.56651667,-95.96763611
MPE,Philadelphia Municipal,Philadelphia,MS,USA,32.7995775,-89.12589472
MPJ,Petit Jean Park,Morrilton,AR,USA,35.13886306,-92.90919694
MPO,Pocono Mountains Muni,Mount Pocono,PA,USA,41.1374775,-75.37887833
MPR,McPherson,McPherson,KS,USA,38.35243722,-97.69133028
MPV,Edward F Knapp State,Barre-Montpelier,VT,USA,44.203505,-72.56232944
MPZ,Mount Pleasant Municipal,Mount Pleasant,IA,USA,40.94661389,-91.511075
MQB,Macomb Municipal,Macomb,IL,USA,40.52034556,-90.65246389
MQI,Dare County Regional,Manteo,NC,USA,35.91898806,-75.69553944
MQJ,Mount Comfort,Indianapolis,IN,USA,39.84348556,-85.89706389
MQT,Marquette County Airport,NA,NA,USA,46.353639,-87.395361
MQW,Telfair-Wheeler,McRae,GA,USA,32.09577778,-82.88002778
MQY,Smyrna,Smyrna,TN,USA,36.00897944,-86.52007667
MRB,Eastern Wv Reg/Shephard,Martinsburg,WV,USA,39.40193278,-77.98458139
MRC,Maury County,Columbia-Mt Pleasant,TN,USA,35.55413889,-87.17891667
MRF,Marfa Municipal,Marfa,TX,USA,30.37147222,-104.0166944
MRH,Michael J. Smith,Beaufort,NC,USA,34.73355028,-76.66059611
MRI,Merrill,Anchorage,AK,USA,61.21437861,-149.8461614
MRJ,Iowa County,Mineral Point,WI,USA,42.88532917,-90.23198583
MRN,Morganton-Lenoir,Morganton,NC,USA,35.82149222,-81.61073639
MRY,Monterey Peninsula,Monterey,CA,USA,36.5869825,-121.8429478
MSA,Mount Pleasant Municipal,Mount Pleasant,TX,USA,33.12936111,-94.97563889
MSL,Northwest Alabama Regional,Muscle Shoals,AL,USA,34.74532028,-87.61023222
MSN,Dane County Regional,Madison,WI,USA,43.13985778,-89.33751361
MSO,Missoula International,Missoula,MT,USA,46.91630556,-114.0905556
MSP,Minneapolis-St Paul Intl,Minneapolis,MN,USA,44.88054694,-93.2169225
MSS,Massena Int'l-Richards,Massena,NY,USA,44.93582722,-74.84554583
MSV,Sullivan Cty Intl,Monticello,NY,USA,41.70164917,-74.79501389
MSY,New Orleans International,New Orleans,LA,USA,29.99338889,-90.25802778
MTH,Florida Keys Marathon,Marathon,FL,USA,24.72614083,-81.05137806
MTJ,Montrose Regional,Montrose,CO,USA,38.50886722,-107.8938333
MTM,Metlakatla SPB,Metlakatla,AK,USA,55.13104528,-131.5780675
MTN,Martin State,Baltimore,MD,USA,39.32566333,-76.41376556
MTO,Coles County Memorial,Mattoon-Charleston,IL,USA,39.47793722,-88.27923833
MTP,Montauk,Montauk,NY,USA,41.07694333,-71.92039972
MTV,Blue Ridge,Martinsville,VA,USA,36.63074861,-80.01834917
MTW,Manitowoc County,Manitowoc,WI,USA,44.1287725,-87.68058472
MUE,Waimea-Kohala,Kamuela,HI,USA,20.00132694,-155.6681072
MUT,Muscatine Municipal,Muscatine,IA,USA,41.36786333,-91.14821639
MVC,Monroe County,Monroeville,AL,USA,31.45805306,-87.35104028
MVE,Montevideo-Chippewa County,Montevideo,MN,USA,44.96905556,-95.71025
MVI,Monte Vista Muni,Monte Vista,CO,USA,37.52855833,-106.0460533
MVL,Morrisville-Stowe State,Morrisville,VT,USA,44.53460806,-72.61400444
MVM,Machias Valley,Machias,ME,USA,44.70311111,-67.47861111
MVN,Mt Vernon-Outland,Mt. Vernon,IL,USA,38.32335444,-88.85847917
MVY,Marthas Vineyard,Marthas Vineyard,MA,USA,41.39302583,-70.6143325
MWA,Williamson County,Marion,IL,USA,37.75313528,-89.01159694
MWC,Lawrence J Timmerman,Milwaukee,WI,USA,43.11092694,-88.03442194
MWH,Grant County,Moses Lake,WA,USA,47.20770806,-119.3201897
MWK,Mount Airy-Surry County,Mount Airy,NC,USA,36.459735,-80.55295722
MWL,Mineral Wells Municipal,Mineral Wells,TX,USA,32.78160556,-98.060175
MWM,Windom Municipal,Windom,MN,USA,43.91340167,-95.10940833
MWO,Hook Field Municipal,Middletown,OH,USA,39.53102778,-84.39527778
MXA,Manila Municipal,Manila,AR,USA,35.89444444,-90.15456944
MXO,Monticello Municipal,Monticello,IA,USA,42.22611111,-91.16708333
MYF,Montgomery,San Diego,CA,USA,32.81573306,-117.1395664
MYK,May Creek,May Creek,AK,USA,61.33567417,-142.686775
MYL,McCall,McCall,ID,USA,44.88879556,-116.1017497
MYR,Myrtle Beach International,Myrtle Beach,SC,USA,33.67975,-78.92833333
MYU,Mekoryuk,Mekoryuk,AK,USA,60.37142,-166.2706083
MYV,Yuba County,Marysville,CA,USA,39.09777278,-121.569825
MYZ,Marysville Municipal,Marysville,KS,USA,39.85416833,-96.63021389
MZJ,Pinal Airpark,Marana,AZ,USA,32.50984389,-111.3253339
MZZ,Marion Municipal,Marion,IN,USA,40.49037278,-85.67914389
N00,Maben,Lexington,NY,USA,42.27230778,-74.39403667
N03,Cortland Cty-Chase,Cortland,NY,USA,42.59264528,-76.2148825
N04,Griswold,Madison,CT,USA,41.27118222,-72.54972972
N07,Lincoln Park,Lincoln Park,NJ,USA,40.94752444,-74.31450139
N10,Perkiomen Valley,Collegeville,PA,USA,40.20404833,-75.43026306
N12,Lakewood,Lakewood,NJ,USA,40.0667825,-74.17764167
N13,Bloomsburg Muni,Bloomsburg,PA,USA,40.99778111,-76.43605583
N14,Flying W,Lumbrerton,NJ,USA,39.93427778,-74.80725
N23,Sidney Muni,Sidney,NY,USA,42.30258,-75.41595639
N24,Questa Municipal Nr 2,Questa,NM,USA,36.80030556,-105.5975
N25,Westport,"Westport, NY",NY,USA,44.15838611,-73.43290444
N27,Bradford County,Towanda,PA,USA,41.74324028,-76.44457083
N29,Magdalena,Magdalena,NM,USA,34.09450778,-107.2978142
N30,Cherry Ridge,Honesdale,PA,USA,41.51533861,-75.25148139
N35,Punxsutawney Muni,Punxsutawney,PA,USA,40.96667472,-78.93000528
N37,Monticello,Monticello,NY,USA,41.62249167,-74.70141111
N38,Grand Canyon State,Wellsboro,PA,USA,41.72790028,-77.39651139
N40,Sky Manor,Pittstown,NJ,USA,40.56626889,-74.97864139
N47,Pottstown Muni,Pottstown,PA,USA,40.26040083,-75.67085306
N51,Solberg-Hunterdon,Readington,NJ,USA,40.58286278,-74.73656222
N53,Stroudsburg-Pocono,East Stroudsburg,PA,USA,41.03587167,-75.16067889
N57,New Garden Flying,Toughkenamon,PA,USA,39.83052639,-75.76974472
N66,Oneonta Muni,Oneonta,NY,USA,42.52476694,-75.06446167
N67,Wings,Ambler,PA,USA,40.13647333,-75.26702972
N68,Chambersburg Muni,Chambersburg,PA,USA,39.97295167,-77.64326778
N69,Stormville,Stormville,NY,USA,41.57698222,-73.73235278
N72,Warwick Muni,Warwick,NY,USA,41.28759361,-74.28709472
N73,Red Lion,Vincentown,NJ,USA,39.90415167,-74.74954917
N79,Northumberland Cty,Shamokin,PA,USA,40.83692306,-76.55245611
N81,Hammonton Muni,Hammonton,NJ,USA,39.66746889,-74.75773444
N82,Wurtsboro-Sullivan Cty,Wurtsboro,NY,USA,41.59720444,-74.45840722
N85,Alexandria,Pittstown,NJ,USA,40.58757389,-75.01942056
N87,Trenton-Robbinsville,Robbinsville,NJ,USA,40.21394333,-74.60179472
N89,Joseph Y. Resnick,Ellenville,NY,USA,41.72787111,-74.37737583
N93,New Golovin,Golovin,AK,USA,64.55305556,-163.0088889
N99,Brandywine,West Chester,PA,USA,39.99472222,-75.58333333
NC14,Rockingham County NC Shiloh,Reidsville,NC,USA,36.43722083,-79.85101
NC67,Ashe County,West Jefferson,NC,USA,36.43243111,-81.41968472
ND06,Cavalier Municipal,Cavalier,ND,USA,48.78388139,-97.62981028
ND12,Ellendale Municipal,Ellendale,ND,USA,46.01247194,-98.51287889
ND17,Harvey Municipal,Harvey,ND,USA,47.79123306,-99.93174222
ND26,Kenmare Municipal,Kenmare,ND,USA,48.66758278,-102.0475944
ND28,Lakota Municipal,Lakota,ND,USA,48.0313875,-98.32788111
ND29,La Moure Rott Municipal,La Moure (New Site),ND,USA,46.34663556,-98.28371
ND33,Linton Municipal,Linton,ND,USA,46.21830472,-100.2450028
ND44,Mott Municipal,Mott,ND,USA,46.359725,-102.3229389
ND66,Washburn Municipal,Washburn,ND,USA,47.35305,-101.0273681
NEW,Lakefront,New Orleans,LA,USA,30.04242056,-90.02825694
NH12,Plymouth Municipal,Plymouth,NH,USA,43.77923806,-71.75369056
NK03,Kamp,Durhamville,NY,USA,43.13472111,-75.64890417
NQA,Millington Municipal,Millington,TN,USA,35.35666667,-89.87027778
NRN,Norton Municipal,Norton,KS,USA,39.84914444,-99.89320583
NUL,Nulato,Nulato,AK,USA,64.72981944,-158.0731889
NVD,Nevada Municipal,Nevada,MO,USA,37.85206528,-94.30486472
NY0,Fulton Cty,Johnstown,NY,USA,42.99821222,-74.32955111
O02,Nervino,Beckwourth,CA,USA,39.82073556,-120.3543767
O05,Rogers,Chester,CA,USA,40.28235278,-121.2411683
O08,Colusa County,Colusa,CA,USA,39.17903,-121.9933611
O09,Round Valley,Covelo,CA,USA,39.79015444,-123.2664025
O11,Cherokee Nation,Stilwell,OK,USA,35.75703083,-94.64994417
O15,Turlock Municipal,Turlock,CA,USA,37.48743556,-120.6968669
O16,Garberville,Garberville,CA,USA,40.08597806,-123.8136397
O17,Nevada County  Air Park,Grass Valley,CA,USA,39.22402778,-121.0030833
O19,Kneeland,Eureka,CA,USA,40.7193,-123.9275531
O21,Hoopa,Hoopa,CA,USA,41.04290778,-123.6683894
O22,Columbia,Columbia,CA,USA,38.03042306,-120.4145556
O24,Lee Vining,Lee Vining,CA,USA,37.95825861,-119.1065375
O26,Lone Pine,Lone Pine,CA,USA,36.58826667,-118.0520314
O27,Oakdale,Oakdale,CA,USA,37.75634472,-120.8002089
O28,Ells Field-Willits Municipal,Willits,CA,USA,39.45129778,-123.3722844
O31,Healdsburg Municipal,Healdsburg,CA,USA,38.65352083,-122.8994397
O32,Reedley Municipal,Reedley,CA,USA,36.66633917,-119.4498483
O35,Hollis Municipal,Hollis,OK,USA,34.70839417,-99.90871194
O37,Haigh,Orland,CA,USA,39.72124194,-122.1466508
O41,Watts-Woodland,Woodland,CA,USA,38.67387639,-121.8720772
O42,Woodlake,Woodlake,CA,USA,36.39883833,-119.1073289
O43,Yerington Municipal,Yerington,NV,USA,39.00408444,-119.1579303
O45,Hooker Municipal,Hooker,OK,USA,36.85708306,-101.2270903
O46,Weed,Weed,CA,USA,41.47487,-122.4530739
O47,Prague Municipal,Prague,OK,USA,35.48201417,-96.71862944
O48,Little River,Little River,CA,USA,39.26203778,-123.7537347
O52,Sutter County,Yuba City,CA,USA,39.12655889,-121.6091328
O53,Medford Municipal,Medford,OK,USA,36.79058417,-97.74899722
O54,Lonnie Pool /Weaverville,Weaverville,CA,USA,40.7457,-122.92197
O57,Bryant,Bridgeport,CA,USA,38.26241917,-119.2257094
O59,Cedarville,Cedarville,CA,USA,41.55267139,-120.1663339
O60,Cloverdale Municipal,Cloverdale,CA,USA,38.7743525,-122.9922217
O61,Cameron Airpark,Cameron Park,CA,USA,38.68407028,-120.9871642
O65,Okeene Municipal,Okeene,OK,USA,36.11253667,-98.3086825
O68,Mariposa-Yosemite,Mariposa,CA,USA,37.51077,-120.0418439
O69,Petaluma Municipal,Petaluma,CA,USA,38.2578325,-122.6055406
O70,Westover Field Amador County,Jackson,CA,USA,38.37680111,-120.7939075
O81,Tulelake Municipal,Tulelake,CA,USA,41.88738,-121.3594331
O85,Benton,Redding,CA,USA,40.57487278,-122.4080642
O86,Trinity Center,Trinity Center,CA,USA,40.98320111,-122.6941889
O88,Rio Vista Municipal,Rio Vista,CA,USA,38.1935,-121.7023889
O89,Fall River Mills,Fall River Mills,CA,USA,41.01877417,-121.4333136
OAJ,Albert J Ellis,Jacksonville,NC,USA,34.82916444,-77.61213778
OAK,Metropolitan Oakland International,Oakland,CA,USA,37.72129083,-122.2207167
OAR,Marina Municipal,Marina,CA,USA,36.68190278,-121.7624492
OBE,Okeechobee County,Okeechobee,FL,USA,27.26282306,-80.84978306
OBU,Kobuk,Kobuk,AK,USA,66.90917056,-156.8610575
OCF,Ocala Regional/Jim Taylor,Ocala,FL,USA,29.17261111,-82.22416667
OCH,Nacogdoches-A.L. Mangham Jr. Regional,Nacogdoches,TX,USA,31.57802778,-94.70954167
OCQ,Oconto Municipal,Oconto,WI,USA,44.8735825,-87.9090525
OCW,Warren,Washington,NC,USA,35.57046806,-77.04981306
ODO,Odessa-Schlemeyer,Odessa,TX,USA,31.92056722,-102.3870892
ODX,Evelyn Sharp,Ord,NE,USA,41.62425,-98.95236111
OEB,Branch County Memorial,Coldwater,MI,USA,41.93344861,-85.052585
OEL,Oakley Municipal,Oakley,KS,USA,39.10994444,-100.8164444
OEO,L. O. Simenstad Municipal,Osceola,WI,USA,45.30858944,-92.69008056
OFK,Karl Stefan Memorial,Norfolk,NE,USA,41.98546389,-97.43511111
OFP,Hanover County Municipal,Richmond,VA,USA,37.7080325,-77.43601028
OGA,Searle,Ogallala,NE,USA,41.11961111,-101.7689444
OGB,Orangeburg Municipal,Orangeburg,SC,USA,33.46094444,-80.85891667
OGD,Ogden-Hinckley,Ogden,UT,USA,41.19594417,-112.012175
OGG,Kahului,Kahului,HI,USA,20.89864972,-156.4304578
OGM,Ontonagon County,Ontonagon,MI,USA,46.84547028,-89.36708806
OGS,Ogdensburg Intl,Ogdensburg,NY,USA,44.68185361,-75.46549917
OH17,Henry County,Napoleon,OH,USA,41.37427778,-84.06791667
OH21,Huron County,Norwalk,OH,USA,41.24476583,-82.55122722
OH30,Put In Bay,Put In Bay,OH,USA,41.63674333,-82.82833333
OIC,Lt Warren Eaton,Norwich,NY,USA,42.56655417,-75.52411167
OIN,Oberlin Municipal,Oberlin,KS,USA,39.83378278,-100.5394236
OJC,Johnson County Executive,Olathe,KS,USA,38.84760194,-94.73758583
OKB,Oceanside Municipal,Oceanside,CA,USA,33.21797639,-117.3515075
OKC,Will Rogers World,Oklahoma City,OK,USA,35.39308833,-97.60073389
OKK,Kokomo Municipal,Kokomo,IN,USA,40.5281775,-86.05899
OKM,Okmulgee Municipal,Okmulgee,OK,USA,35.66813889,-95.94869444
OKS,Garden County,Oshkosh,NE,USA,41.40097222,-102.3550278
OKV,Winchester Regional,Winchester,VA,USA,39.14352139,-78.14444444
OKZ,Kaolin,Sandersville,GA,USA,32.96672222,-82.83816667
OLD,Dewitt Field-Old Town Municipal,Old Town,ME,USA,44.9525,-68.67433333
OLE,Olean Muni,Olean,NY,USA,42.24006611,-78.371685
OLF,L M Clayton,Wolf Point,MT,USA,48.09451778,-105.5750536
OLM,Olympia,Olympia,WA,USA,46.9705,-122.9022083
OLS,Nogales International,Nogales,AZ,USA,31.41772222,-110.8478889
OLU,Columbus Municipal,Columbus,NE,USA,41.448,-97.34263889
OLV,Olive Branch,Olive Branch,MS,USA,34.97875,-89.78683333
OLY,Olney-Noble,Olney-Noble,IL,USA,38.72182722,-88.17643278
OLZ,Oelwein Municipal,Oelwein,IA,USA,42.68084472,-91.97447833
OMA,Eppley Airfield,Omaha,NE,USA,41.30251861,-95.89417306
OME,Nome,Nome,AK,USA,64.51220222,-165.4452458
OMH,Orange County,Orange,VA,USA,38.24721639,-78.04561028
OMK,Omak,Omak,WA,USA,48.46440222,-119.5180503
OMN,Ormond Beach Municipal,Ormond Beach,FL,USA,29.30113889,-81.11380556
ONA,Winona Muni-Max Conrad,Winona,MN,USA,44.07721306,-91.70831694
ONL,O Neill Municipal,O Neill,NE,USA,42.46988889,-98.68805556
ONM,Socorro Municipal,Socorro,NM,USA,34.02247222,-106.9031389
ONO,Ontario Muni,Ontario,OR,USA,44.02052417,-117.013635
ONP,Newport Muni,Newport,OR,USA,44.58036111,-124.0579167
ONT,Ontario International,Ontario,CA,USA,34.056,-117.6011944
ONY,Olney Municipal,Olney,TX,USA,33.35088056,-98.81916667
ONZ,Grosse Ile Municipal,Detroit - Grosse Ile,MI,USA,42.09860472,-83.16105861
OOA,Oskaloosa Municipal,Oskaloosa,IA,USA,41.22614944,-92.49388278
OOH,Hoonah SPB,Hoonah,AK,USA,58.11215944,-135.451805
OOK,Toksook Bay,Toksook Bay,AK,USA,60.53337639,-165.1139636
OPF,Opa-Locka,Miami,FL,USA,25.907,-80.27838889
OPL,St Landry Parish - Ahart,Opelousas,LA,USA,30.55840556,-92.099375
OPN,Thomaston-Upton County,Thomaston,GA,USA,32.95458861,-84.26315222
OQU,Quonset State,North Kingstown,RI,USA,41.5971525,-71.41215333
OQW,Maquoketa Municipal,Maquoketa,IA,USA,42.050075,-90.73880472
OR33,Boardman,Boardman,OR,USA,45.814825,-119.8205006
ORB,Orr Regional,Orr,MN,USA,48.01592194,-92.85605139
ORC,Orange City Municipal,Orange City,IA,USA,42.99026444,-96.06279667
ORD,Chicago O'Hare International,Chicago,IL,USA,41.979595,-87.90446417
ORE,Orange Municipal,Orange,MA,USA,42.57011889,-72.28860667
ORF,Norfolk International,Norfolk,VA,USA,36.89461111,-76.20122222
ORG,Orange County,Orange,TX,USA,30.06916667,-93.80091667
ORH,Worcester Regional,Worcester,MA,USA,42.26733944,-71.87570944
ORI,Port Lions,Port Lions,AK,USA,57.8853775,-152.8461011
ORL,Executive,Orlando,FL,USA,28.54547222,-81.33294444
ORS,Orcas Island,Eastsound,WA,USA,48.70816,-122.9137961
ORT,Northway,Northway,AK,USA,62.96133361,-141.9291369
ORV,Robert(Bob) Curtis Memorial,Noorvik,AK,USA,66.82852667,-161.0277908
OSC,Oscoda - Wurtsmith,Oscoda,MI,USA,44.45260972,-83.38036389
OSH,Wittman Regional,Oshkosh,WI,USA,43.98436639,-88.55705944
OSU,Ohio State University,Columbus,OH,USA,40.07977778,-83.07302778
OSX,Kosciusko-Attala County,Kosciusko,MS,USA,33.09025889,-89.54201722
OTG,Worthington Municipal,Worthington,MN,USA,43.65506611,-95.57920917
OTH,North Bend Muni,North Bend,OR,USA,43.41713889,-124.2460278
OTM,Ottumwa Industrial,Ottumwa,IA,USA,41.10659611,-92.44793972
OTZ,Ralph Wien Memorial,Kotzebue,AK,USA,66.88467694,-162.5985497
OUN,University of Oklahoma Westheimer,Norman,OK,USA,35.24556444,-97.47212861
OVE,Oroville Municipal,Oroville,CA,USA,39.48775,-121.622
OVO,North Vernon,North Vernon,IN,USA,39.04563667,-85.60533
OVS,Boscobel,Boscobel,WI,USA,43.16063056,-90.67421833
OWA,Owatonna Degner Regional,Owatonna,MN,USA,44.12339722,-93.26061667
OWB,Owensboro-Daviess County,Owensboro,KY,USA,37.74011111,-87.16683333
OWD,Norwood Memorial,Norwood,MA,USA,42.19079694,-71.17310389
OWI,Ottawa Municipal,Ottawa,KS,USA,38.53866667,-95.25297222
OWK,Central Maine,Norridgewock,ME,USA,44.7155,-69.86647222
OWX,Putnam County,Ottawa,OH,USA,41.0355825,-83.98202444
OXB,Ocean City,Ocean City,MD,USA,38.31044444,-75.12397222
OXC,Waterbury-Oxford,Oxford,CT,USA,41.47855556,-73.13525
OXD,Miami University,Oxford,OH,USA,39.50203917,-84.7841425
OXI,Starke County,Knox,IN,USA,41.3301875,-86.66473194
OXR,Oxnard,Oxnard,CA,USA,34.20080083,-119.2072164
OXV,Knoxville Municipal,Knoxville,IA,USA,41.29888556,-93.11381556
OYM,St Marys Muni,St Marys,PA,USA,41.41247778,-78.50263139
OZA,Ozona Municipal,Ozona,TX,USA,30.73528028,-101.2029719
OZW,Livingston County,Howell,MI,USA,42.62950694,-83.98417361
P01,Ajo Municipal,Ajo,AZ,USA,32.45005694,-112.8673778
P04,Bisbee Municipal,Bisbee,AZ,USA,31.36399028,-109.8831286
P08,Coolidge Municipal,Coolidge,AZ,USA,32.93594444,-111.4265278
P13,San Carlos Apache,Globe,AZ,USA,33.35314722,-110.6673611
P14,Holbrook Municipal,Holbrook,AZ,USA,34.93891389,-110.1395656
P20,Avi Suquilla,Parker,AZ,USA,34.15063889,-114.2712222
P32,H.A. Clark Memorial,Williams,AZ,USA,35.30223222,-112.1940575
P33,Cochise County,Willcox,AZ,USA,32.24540278,-109.8946319
P45,Mount Pleasant-Scottdale,Mount Pleasant,PA,USA,40.10840556,-79.54142694
P52,Cottonwood,Cottonwood,AZ,USA,34.73002111,-112.0351569
P53,Rostraver,Monongahela,PA,USA,40.20972222,-79.83144444
PAE,Snohomish County,Everett,WA,USA,47.90762861,-122.2815892
PAH,Barkley Regional,Paducah,KY,USA,37.06083333,-88.77375
PAK,Port Allen,Hanapepe,HI,USA,21.89686833,-159.6033217
PAN,Payson,Payson,AZ,USA,34.25683639,-111.3392558
PAO,Palo Alto Arpt of Santa Clara Co,Palo Alto,CA,USA,37.46111944,-122.1150444
PAQ,Palmer Municipal,Palmer,AK,USA,61.59474194,-149.0888242
PBF,Grider,Pine Bluff,AR,USA,34.17498722,-91.93472028
PBH,Price County,Phillips,WI,USA,45.70895028,-90.40248472
PBI,Palm Beach International,West Palm Beach,FL,USA,26.68316194,-80.09559417
PBV,St. George,St. George,AK,USA,56.57735278,-169.6637361
PCK,Porcupine Creek,Porcupine Creek,AK,USA,67.23789833,-150.2860608
PCM,Plant City Municipal,Plant City,FL,USA,28.00021667,-82.16424167
PCW,Carl R. Keller,Port Clinton,OH,USA,41.51627778,-82.86869444
PCZ,Waupaca Municipal,Waupaca,WI,USA,44.33368778,-89.01549861
PDC,Prairie Du Chien Municipal,Prairie Du Chien,WI,USA,43.01928889,-91.12374722
PDK,Dekalb-Peachtree,Atlanta,GA,USA,33.87560444,-84.30196778
PDT,Eastern Oregon Regional At Pendleton,Pendleton,OR,USA,45.69505556,-118.8414444
PDX,Portland Intl,Portland,OR,USA,45.58872222,-122.5975
PEA,Pella Municipal,Pella,IA,USA,41.40006667,-92.94588333
PEC,Pelican SPB,Pelican,AK,USA,57.95517222,-136.2362733
PEO,Penn Yan,Penn Yan,NY,USA,42.63813556,-77.05306083
PEQ,Pecos Municipal,Pecos City,TX,USA,31.3823575,-103.5107017
PEZ,Pleasanton Municipal,Pleasanton,TX,USA,28.95419444,-98.51998917
PFN,Panama City-Bay County International,Panama City,FL,USA,30.21208333,-85.68280556
PGA,Page Municipal,Page,AZ,USA,36.92611111,-111.4483611
PGD,Charlotte County,Punta Gorda,FL,USA,26.92019444,-81.99052778
PGM,Port Graham,Port Graham,AK,USA,59.34825944,-151.8315389
PGR,Kirk,Paragould,AR,USA,36.06352944,-90.50986028
PGV,Pitt-Greenville,Greenville,NC,USA,35.63523944,-77.38532028
PHD,Harry Clever,New Philadelphia,OH,USA,40.47091667,-81.41975
PHF,Newport News/Williamsburg International,Newport News,VA,USA,37.13189556,-76.4929875
PHG,Phillipsburg Municipal,Phillipsburg,KS,USA,39.73530556,-99.31741667
PHH,Andrews Municipal,Andrews,SC,USA,33.45169472,-79.52620111
PHK,Palm Beach County Glades,Pahokee,FL,USA,26.78503861,-80.69335528
PHL,Philadelphia Intl,Philadelphia,PA,USA,39.87195278,-75.24114083
PHN,St Clair County International,Port Huron,MI,USA,42.91095778,-82.52886139
PHO,Point Hope,Point Hope,AK,USA,68.34877417,-166.7993086
PHP,Philip,Philip,SD,USA,44.04862722,-101.5990603
PHT,Henry County,Paris,TN,USA,36.33822472,-88.38287861
PHX,Phoenix Sky Harbor International,Phoenix,AZ,USA,33.43416667,-112.0080556
PIA,Greater Peoria Regional,Peoria,IL,USA,40.66424333,-89.69330556
PIB,Hattiesburg-Laurel Regional,Hattiesburg-Laurel,MS,USA,31.46714944,-89.33705778
PIE,St. Petersburg-Clearwater International,St. Petersburg,FL,USA,27.91076333,-82.68743944
PIH,Pocatello Regional,Pocatello,ID,USA,42.91130556,-112.5958611
PIL,Port Isabel-Cameron County,Port Isabel,TX,USA,26.16621,-97.34588611
PIM,Callaway Gardens-Harris County,Pine Mountain,GA,USA,32.84069444,-84.88244444
PIR,Pierre Regional,Pierre,SD,USA,44.38267694,-100.285965
PIT,Pittsburgh International,Pittsburgh,PA,USA,40.49146583,-80.23287083
PIZ,Point Lay Dew Station,Point Lay,AK,USA,69.732875,-163.0053417
PJY,Pinckneyville-Duquoin,Pinckneyville-Duquoin,IL,USA,37.97788417,-89.36044889
PKA,Napaskiak,Napaskiak,AK,USA,60.70369056,-161.7767367
PKB,Wood Cty/Gill Robb Wilson,Parkersburg,WV,USA,39.34510333,-81.43920194
PKD,Park Rapids Municipal,Park Rapids,MN,USA,46.90062583,-95.07313278
PKF,Park Falls Municipal,Park Falls,WI,USA,45.95502361,-90.42441806
PLB,Clinton Cty,Plattsburgh,NY,USA,44.68751861,-73.52452306
PLD,Portland Municipal,Portland,IN,USA,40.45076167,-84.99007917
PLN,Pellston Regional  of Emmet County,Pellston,MI,USA,45.5709275,-84.796715
PLR,St Clair County,Pell City,AL,USA,33.55883333,-86.24905556
PMB,Pembina Municipal,Pembina,ND,USA,48.9425,-97.24083333
PMD,Palmdale Production Flight,Palmdale,CA,USA,34.62938889,-118.0845528
PMH,Greater Portsmouth Regional,Portsmouth,OH,USA,38.84047,-82.84731361
PMP,Pompano Beach Airpark,Pompano Beach,FL,USA,26.24713889,-80.11105556
PMV,Plattsmouth Municipal,Plattsmouth,NE,USA,40.95025,-95.91788889
PMX,Metropolitan,Palmer,MA,USA,42.22328722,-72.31138694
PMZ,Plymouth Municipal,Plymouth,NC,USA,35.80843944,-76.75927694
PNA,Ralph Wenz,Pinedale,WY,USA,42.79549917,-109.8070944
PNC,Ponca City Municipal,Ponca City,OK,USA,36.73058417,-97.09976833
PNE,Northeast Philadelphia,Philadelphia,PA,USA,40.08194417,-75.01058667
PNM,Princeton Municipal,Princeton,MN,USA,45.55986778,-93.60821611
PNN,Princeton Municipal,Princeton,ME,USA,45.20066667,-67.56438889
PNP,Pilot Point,Pilot Point,AK,USA,57.58038056,-157.5674444
PNS,Pensacola Regional,Pensacola,FL,USA,30.47330556,-87.18744444
POC,Brackett,La Verne,CA,USA,34.09164833,-117.7817803
POF,Poplar Bluff Municipal,Poplar Bluff,MO,USA,36.77394444,-90.32484722
POH,Pocahontas Municipal,Pocahontas,IA,USA,42.74280556,-94.64730556
POU,Dutchess Cty,Poughkeepsie,NY,USA,41.62661111,-73.88411111
POY,Powell Muni,Powell,WY,USA,44.86797222,-108.793
PPA,Perry Lefors,Pampa,TX,USA,35.61298806,-100.9962608
PPC,Prospect Creek,Prospect Creek,AK,USA,66.81288139,-150.6437925
PPF,Tri City,Parsons,KS,USA,37.33125778,-95.50900667
PPG,Pago Pago International,Pago Pago,AS,USA,14.33102278,-170.7105258
PPO,La Porte Municipal,La Porte,IN,USA,41.57276194,-86.73413139
PPQ,Pittsfield Penstone Municipal,Pittsfield,IL,USA,39.63885556,-90.77843111
PQI,Northern Maine Regional,Presque Isle,ME,USA,46.68896,-68.04479972
PQL,Trent Lott International,Pascagoula,MS,USA,30.46278111,-88.52922778
PQN,Pipestone Municipal,Pipestone,MN,USA,43.98330333,-96.30031083
PR03,Fajardo Harbor Seaplane Base,Fajardo,PR,USA,18.339675,-65.62460583
PRB,Paso Robles Municipal,Paso Robles,CA,USA,35.67288611,-120.6270558
PRC,Ernest A. Love,Prescott,AZ,USA,34.65447222,-112.4195833
PRG,Edgar County,Paris,IL,USA,39.70015944,-87.66961861
PRN,Greenville Municipal,Greenville,AL,USA,31.84540222,-86.61044583
PRO,Perry Municipal,Perry,IA,USA,41.82801306,-94.15990361
PRX,Cox,Paris,TX,USA,33.63660667,-95.45073194
PSB,Mid-State,Philipsburg,PA,USA,40.88439139,-78.08734167
PSC,Tri-Cities,Pasco,WA,USA,46.26468028,-119.1190292
PSE,Mercedita,Ponce,PR,USA,18.00830278,-66.56301194
PSF,Pittsfield Municipal,Pittsfield,MA,USA,42.42684667,-73.29292806
PSG,James C. Johnson Petersburg,Petersburg,AK,USA,56.80165194,-132.9452781
PSK,New River Valley,Dublin,VA,USA,37.13734528,-80.67848167
PSM,Pease International Tradeport,Portsmouth,NH,USA,43.07795889,-70.82327333
PSN,Palestine Municipal,Palestine,TX,USA,31.77969444,-95.70630556
PSP,Palm Springs International,Palm Springs,CA,USA,33.82921556,-116.5062531
PSX,Palacios Municipal,Palacios,TX,USA,28.72751778,-96.2509675
PTB,Dinwiddie County,Petersburg,VA,USA,37.18375833,-77.50738889
PTD,Potsdam Muni-Damon,Potsdam,NY,USA,44.67666917,-74.94844639
PTH,Port Heiden,Port Heiden,AK,USA,56.95943333,-158.6318208
PTK,Oakland-Pontiac,Pontiac,MI,USA,42.66520389,-83.41870917
PTN,Harry P. Williams Memorial,Patterson,LA,USA,29.71081917,-91.33971778
PTS,Atkinson Municipal,Pittsburg,KS,USA,37.44855556,-94.73133333
PTT,Pratt Industrial,Pratt,KS,USA,37.7000175,-98.7462025
PTU,Platinum,Platinum,AK,USA,59.01135611,-161.8196661
PTV,Porterville Municipal,Porterville,CA,USA,36.02960778,-119.0627311
PTW,Pottstown Limerick,Pottstown,PA,USA,40.23957167,-75.55662528
PUB,Pueblo Memorial,Pueblo,CO,USA,38.28908722,-104.4965722
PUC,Carbon County,Price,UT,USA,39.61391556,-110.7514183
PUW,Pullman/Moscow Regional,"Pullman/Moscow,ID",WA,USA,46.74386111,-117.1095833
PVB,Platteville Municipal,Platteville,WI,USA,42.68935583,-90.44439278
PVC,Provincetown Municipal,Provincetown,MA,USA,42.07199833,-70.22137667
PVD,Theodore F Green State,Providence,RI,USA,41.72399917,-71.42822111
PVF,Placerville,Placerville,CA,USA,38.72421806,-120.753325
PVG,Hampton Roads Executive,Portsmouth,VA,USA,36.78014889,-76.44883472
PVJ,Pauls Valley Municipal,Pauls Valley,OK,USA,34.71105361,-97.22321694
PVU,Provo Muni,Provo,UT,USA,40.21919444,-111.7233611
PVW,Hale County,Plainview,TX,USA,34.16814722,-101.7173361
PWA,Wiley Post,Oklahoma City,OK,USA,35.53455,-97.64721556
PWC,Pine River Regional,Pine River,MN,USA,46.7247875,-94.3817
PWD,Sher-Wood,Plentywood,MT,USA,48.79030583,-104.533845
PWG,McGregor Exectuive,Waco,TX,USA,31.48491667,-97.31652778
PWK,Palwaukee,Chicago/Wheeling/Prospect Heights,IL,USA,42.11418083,-87.90148083
PWM,Portland International Jetport,Portland,ME,USA,43.64616667,-70.30875
PWT,Bremerton National,Bremerton,WA,USA,47.49275361,-122.7624286
PXE,Perry-Houston Couty,Perry,GA,USA,32.51058333,-83.76733333
PYG,Pageland,Pageland,SC,USA,34.74213889,-80.34519444
PYM,Plymouth Municipal,Plymouth,MA,USA,41.90902444,-70.72878778
PYX,Perryton Ochiltree County,Perryton,TX,USA,36.41200333,-100.7517883
PZQ,Presque Isle County,Rogers City,MI,USA,45.40709667,-83.81288556
Q00,Littlefield Municipal,Littlefield,TX,USA,33.92395306,-102.3866831
Q06,City of Tulia/Swisher County Municipal,Tulia,TX,USA,34.56682472,-101.7814611
Q14,San Juan Pueblo,Espanola,NM,USA,36.02502306,-106.0464114
Q16,Reserve,Reserve,NM,USA,33.70005472,-108.8506214
Q17,Boonville,Boonville,CA,USA,39.0126775,-123.3827864
Q21,Brownsville,Brownsville,CA,USA,39.45544417,-121.2913511
Q24,Levelland Municipal,Levelland,TX,USA,33.54980833,-102.3727333
Q25,Dinsmore,Dinsmore,CA,USA,40.49291944,-123.5997589
Q26,Terry County,Brownfield,TX,USA,33.173675,-102.1926208
Q31,Sequoia,Visalia,CA,USA,36.44856139,-119.3190056
Q34,Portales Municipal,Portales,NM,USA,34.14547222,-103.4103333
Q35,Springerville Babbitt,Springerville,AZ,USA,34.1286575,-109.3114756
Q37,Carrizozo Municipal,Carrizozo,NM,USA,33.64886139,-105.895685
Q41,Floydada Municipal,Floydada,TX,USA,34.00230056,-101.330435
Q42,Springer Municipal,Springer,NM,USA,36.32697806,-104.6197117
Q44,Beaver Municipal,Beaver,OK,USA,36.79891472,-100.5298708
Q49,Firebaugh,Firebaugh,CA,USA,36.85998861,-120.4644675
Q53,Franklin,Franklin,CA,USA,38.30491306,-121.4296736
Q55,Dimmitt Municipal,Dimmitt,TX,USA,34.56673556,-102.3226947
Q58,Santa Rosa Municipal,Santa Rosa,NM,USA,34.93442472,-104.643065
Q61,Georgetown,Georgetown,CA,USA,38.92111389,-120.8647944
Q68,Pine Mountain Lake,Groveland,CA,USA,37.86166667,-120.1778889
Q72,Hayfork,Hayfork,CA,USA,40.54708833,-123.1816953
Q84,Mendota,Mendota,CA,USA,36.75800528,-120.3712794
Q88,Paradise Skypark,Paradise,CA,USA,39.70960639,-121.6163617
Q94,Rio Linda,Rio Linda,CA,USA,38.67601389,-121.4455092
Q95,Ruth,Ruth,CA,USA,40.21125917,-123.2975231
Q99,South County  of Santa Clara Co,San Martin,CA,USA,37.08158611,-121.5968056
RAC,John H Batten,Racine,WI,USA,42.76119139,-87.81389806
RAL,Riverside Municipal,Riverside,CA,USA,33.95187528,-117.4451017
RAP,Rapid City Regional,Rapid City,SD,USA,44.04532139,-103.0573708
RBD,Redbird,Dallas,TX,USA,32.68086111,-96.86819444
RBE,Bassett Municipal,Bassett,NE,USA,42.56966667,-99.56836111
RBG,Roseburg Regional,Roseburg,OR,USA,43.23878306,-123.3558617
RBL,Red Bluff Municipal,Red Bluff,CA,USA,40.15065667,-122.2522903
RBW,Walterboro Municipal,Walterboro,SC,USA,32.92052778,-80.64125
RBY,Ruby,Ruby,AK,USA,64.72721556,-155.4698886
RCA,Ellsworth AFB,NA,NA,USA,44.145094,-103.103567
RCR,Fulton County,Rochester,IN,USA,41.06554833,-86.18170444
RCX,Rusk County,Ladysmith,WI,USA,45.49825694,-91.00186361
RDD,Redding Municipal,Redding,CA,USA,40.50898361,-122.2934019
RDG,"Reading Muni,Gen Carl A Spaatz",Reading,PA,USA,40.3785,-75.96525
RDK,Red Oak Municipal,Red Oak,IA,USA,41.01052778,-95.25986111
RDM,Roberts,Redmond,OR,USA,44.25406722,-121.1499633
RDR,Grand Forks AFB,NA,NA,USA,47.961167,-97.401167
RDU,Raleigh-Durham International,Raleigh,NC,USA,35.87763889,-78.78747222
RDV,Red Devil,Red Devil,AK,USA,61.78764333,-157.3479344
RED,Red Lodge,Red Lodge,MT,USA,45.18744472,-109.2673778
RFD,Greater Rockford,Rockford,IL,USA,42.19536389,-89.09721111
RFG,Refugio-Rooke,Refugio,TX,USA,28.29361694,-97.32304833
RGK,Red Wing Municipal,Red Wing,MN,USA,44.58935611,-92.48496889
RHI,Rhinelander-Oneida County,Rhinelander,WI,USA,45.63119306,-89.46745361
RHV,Reid-Hillview of Santa Clara Co,San Jose,CA,USA,37.33287306,-121.8197947
RIC,Richmond International,Richmond,VA,USA,37.50516667,-77.31966667
RID,Richmond Municipal,Richmond,IN,USA,39.75721528,-84.84282
RIF,Richfield Muni,Richfield,UT,USA,38.73643611,-112.0989444
RIL,Garfield County Regional,Rifle,CO,USA,39.526315,-107.7269403
RIU,Rancho Murieta,Rancho Murieta,CA,USA,38.4887975,-121.1024447
RIV,March,Riverside,CA,USA,33.88057333,-117.2594836
RIW,Riverton Regional,Riverton,WY,USA,43.064235,-108.4598411
RKD,Knox County Regional,Rockland,ME,USA,44.06008333,-69.09925
RKP,Aransas County,Rockport,TX,USA,28.08677778,-97.04461111
RKR,Robert S Kerr,Poteau,OK,USA,35.02162639,-94.6212525
RKS,Rock Springs-Sweetwater County,Rock Springs,WY,USA,41.5942175,-109.0651928
RKW,Rockwood Municipal,Rockwood,TN,USA,35.922295,-84.68966278
RLD,Richland,Richland,WA,USA,46.305635,-119.3041853
RME,Griffis Airpark,Rome,NY,USA,43.23379861,-75.40703333
RMG,Richard B Russell,Rome,GA,USA,34.35060111,-85.15801389
RMP,Rampart,Rampart,AK,USA,65.50786222,-150.1428047
RMY,Brooks,Marshall,MI,USA,42.25118111,-84.9554525
RNC,Warren County Memorial,McMinnville,TN,USA,35.69870944,-85.84381722
RNH,New Richmond Municipal,New Richmond,WI,USA,45.14831139,-92.53806139
RNM,Ramona,Ramona,CA,USA,33.038905,-116.9136392
RNO,Reno/Tahoe International,Reno,NV,USA,39.49857611,-119.7680647
RNT,Renton Municipal,Renton,WA,USA,47.49313889,-122.21575
RNV,Cleveland Municipal,Cleveland,MS,USA,33.76114056,-90.75787528
ROA,Roanoke Regional/ Woodrum,Roanoke,VA,USA,37.32546833,-79.97542833
ROC,Greater Rochester Int'l,Rochester,NY,USA,43.11886611,-77.67238389
ROG,Rogers Municipal-Carter,Rogers,AR,USA,36.37229667,-94.10686972
ROP,Prachinburi,NA,NA,Thailand,14.078333,101.378334
ROR,Babelthoup/Koror,NA,NA,Palau,7.367222,134.544167
ROS,Rush City Regional,Rush City,MN,USA,45.69801389,-92.95298972
ROW,Roswell Industrial Air Center,Roswell,NM,USA,33.30155556,-104.5305556
ROX,Roseau Municipal,Roseau,MN,USA,48.85603806,-95.69703861
RPB,Belleville Municipal,Belleville,KS,USA,39.81790861,-97.659625
RPD,Rice Lake Regional-Carl's,Rice Lake,WI,USA,45.41809056,-91.77365194
RPX,Roundup,Roundup,MT,USA,46.47357528,-108.5576333
RQB,Roben-Hood,Big Rapids,MI,USA,43.72263278,-85.50407333
RQE,Window Rock,Window Rock,AZ,USA,35.65205556,-109.0673889
RRL,Merrill Municipal,Merrill,WI,USA,45.19927083,-89.71143389
RRT,Warroad Intl Swede Carlson,Warroad,MN,USA,48.94138889,-95.34838889
RSH,Russian Mission,Russian Mission,AK,USA,61.77967583,-161.3194772
RSL,Russell Municipal,Russell,KS,USA,38.87212222,-98.81177611
RSN,Ruston Regional,Ruston,LA,USA,32.51444444,-92.58833333
RST,Rochester International,Rochester,MN,USA,43.90882639,-92.49798722
RSV,Robinson Municipal,Robinson,IL,USA,39.01604222,-87.649775
RSW,Southwest Florida International,Ft. Myers,FL,USA,26.53616667,-81.75516667
RTN,Raton Municipal/Crews,Raton,NM,USA,36.74152778,-104.5021833
RUE,Russellville Municipal,Russellville,AR,USA,35.25914667,-93.09326611
RUG,Rugby Municipal,Rugby,ND,USA,48.39035917,-100.0242739
RUQ,Rowan County,Salisbury,NC,USA,35.64588583,-80.52029306
RUT,Rutland State,Rutland,VT,USA,43.52990694,-72.949615
RVJ,Reidsville,Reidsville,GA,USA,32.05897222,-82.15172222
RVL,Mifflin Cty,Reedsville,PA,USA,40.67737417,-77.62682833
RVN,Hawkins County,Rogersville,TN,USA,36.45757917,-82.88503722
RVS,"Richard Lloyd Jones, Jr.",Tulsa,OK,USA,36.0396275,-95.984635
RWF,Redwood Falls Muni,Redwood Falls,MN,USA,44.54720389,-95.082255
RWI,Rocky Mount Wilson,Rocky Mount,NC,USA,35.85498861,-77.89295611
RWL,Rawlins Muni,Rawlins,WY,USA,41.8055975,-107.19994
RWN,Arens,Winamac,IN,USA,41.09226306,-86.61287111
RXE,Rexburg-Madison County,Rexburg,ID,USA,43.83391139,-111.805105
RYN,Ryan,Tucson,AZ,USA,32.14308333,-111.1728611
RYV,Watertown Municipal,Watertown,WI,USA,43.16963222,-88.72321222
RYY,Cobb County-McCollum,Marietta,GA,USA,34.01315611,-84.59854472
RZL,Jasper County,Rensselaer,IN,USA,40.94789861,-87.18257944
RZN,Burnett County,Siren,WI,USA,45.8227275,-92.37250083
RZT,Ross County,Chillicothe,OH,USA,39.44136778,-83.02251556
RZZ,Halifax County,Roanoke Rapids,NC,USA,36.43945583,-77.70934139
S01,Conrad,Conrad,MT,USA,48.16863889,-111.9764722
S03,Ashland Muni-Sumner Parker,Ashland,OR,USA,42.19028361,-122.6606283
S05,Bandon State,Bandon,OR,USA,43.08733083,-124.4095578
S07,Bend Muni,Bend,OR,USA,44.09483333,-121.2006389
S10,Chelan Muni,Chelan,WA,USA,47.86597139,-119.9427053
S12,Albany Municipal,Albany,OR,USA,44.63781639,-123.0594486
S18,Forks,Forks,WA,USA,47.94146583,-124.3929867
S21,Sunriver,Sunriver,OR,USA,43.87633333,-121.4530556
S23,Ione Municipal,Ione,WA,USA,48.70727528,-117.4126036
S24,Sandusky Co,Fremont,OH,USA,41.29570556,-83.03723056
S25,Watford City Municipal,Watford City,ND,USA,47.79569972,-103.2536992
S27,Kalispell City,Kalispell,MT,USA,48.17856944,-114.3037408
S28,International Peace Garden,Dunseith,ND,USA,48.99778194,-100.0434589
S30,Lebanon State,Lebanon,OR,USA,44.529845,-122.9295336
S31,Lopez Island,Lopez,WA,USA,48.48259944,-122.9368444
S32,Cooperstown Municipal,Cooperstown,ND,USA,47.42277361,-98.10587139
S33,City-County,Madras,OR,USA,44.66623139,-121.1631
S34,Plains,Plains,MT,USA,47.47243611,-114.900135
S39,Prineville,Prineville,OR,USA,44.28699389,-120.9038328
S40,Prosser,Prosser,WA,USA,46.212355,-119.7928122
S43,Harvey,Snohomish,WA,USA,47.90815306,-122.1054072
S45,Siletz Bay State,Siletz Bay (Gleneden Beach),OR,USA,44.87761139,-124.0284472
S47,Tillamook,Tillamook,OR,USA,45.41824194,-123.8143839
S50,Auburn Municipal,Auburn,WA,USA,47.32815583,-122.2265092
S52,Methow Valley State,Winthrop,WA,USA,48.42070056,-120.1470264
S59,Libby,Libby,MT,USA,48.28384528,-115.4902453
S60,Kenmore Air Harbor Inc,Kenmore,WA,USA,47.75482,-122.2592931
S64,Stanford,Stanford,MT,USA,47.14718944,-110.2299289
S66,Homedale Municipal,Homedale,ID,USA,43.61488056,-116.9215372
S67,Nampa Muni,Nampa,ID,USA,43.58133333,-116.5230556
S68,Orofino Municipal,Orofino,ID,USA,46.49129139,-116.2768061
S69,Lincoln,Lincoln,MT,USA,46.97494083,-112.6447606
S70,Othello Muni,Othello,WA,USA,46.79486278,-119.0802875
S71,Edgar G Obie,Chinook,MT,USA,48.59194444,-109.2488889
S72,St Maries Municipal,St Maries,ID,USA,47.32768722,-116.5773906
S73,Kamiah Municipal,Kamiah,ID,USA,46.21934028,-116.0134736
S80,Idaho County,Grangeville,ID,USA,45.94255806,-116.1234158
S83,Shoshone County,Kellogg,ID,USA,47.54769889,-116.1885008
S85,Big Sky,Culbertson,MT,USA,48.15333333,-104.5038889
S87,Weiser Municipal,Weiser,ID,USA,44.20683056,-116.9623869
S89,Craigmont Municipal,Craigmont,ID,USA,46.24710917,-116.4801447
S93,Cle Elum Municipal,Cle Elum,WA,USA,47.18317583,-120.884525
S94,Whitman County Memorial,Colfax,WA,USA,46.8584975,-117.4137964
S97,Anderson,Brewster,WA,USA,48.10486806,-119.7206128
SAA,Shively,Saratoga,WY,USA,41.44485944,-106.8235264
SAC,Sacramento Executive,Sacramento,CA,USA,38.51252389,-121.4934689
SAD,Safford Regional,Safford,AZ,USA,32.85331278,-109.6349708
SAF,Santa Fe Municipal,Santa Fe,NM,USA,35.61677778,-106.0881389
SAN,San Diego International-Lindbergh,San Diego,CA,USA,32.73355611,-117.1896567
SAR,Sparta Community-Hunter,Sparta,IL,USA,38.14893833,-89.69870972
SAT,San Antonio International,San Antonio,TX,USA,29.53369444,-98.46977778
SAV,Savannah International,Savannah,GA,USA,32.12758333,-81.20213889
SAW,Sawyer,Gwinn,MI,USA,46.35361111,-87.39583222
SAZ,Staples Municipal,Staples,MN,USA,46.38087944,-94.80660167
SBA,Santa Barbara Municipal,Santa Barbara,CA,USA,34.42621194,-119.8403733
SBD,San Bernardino International,San Bernardino,CA,USA,34.09535361,-117.2348742
SBM,Sheboygan County Memorial,Sheboygan,WI,USA,43.76949444,-87.85158944
SBN,South Bend Regional,South Bend,IN,USA,41.70895361,-86.31847417
SBO,Emanuel County,Swainsboro,GA,USA,32.60825,-82.36869444
SBP,San Luis Obispo Co-McChesney,San Luis Obispo,CA,USA,35.23705806,-120.6423931
SBS,Steamboat Springs,Steamboat Springs,CO,USA,40.51625944,-106.8663006
SBU,Blue Earth Municipal,Blue Earth,MN,USA,43.59534389,-94.09284833
SBX,Shelby,Shelby,MT,USA,48.54125278,-111.8720722
SBY,Salisbury-Ocean City: Wicomico Regional,Salisbury,MD,USA,38.34052611,-75.51028806
SCB,Scribner State,Scribner,NE,USA,41.61033333,-96.62986111
SCC,Deadhorse,Deadhorse,AK,USA,70.19475583,-148.4651608
SCD,Merkel Field Sylacauga Municipal,Sylacauga,AL,USA,33.17183583,-86.30553778
SCE,University Park,NA,NA,USA,40.851206,-77.846302
SCH,Schenectady Cty,Schenectady,NY,USA,42.85245556,-73.9288675
SCK,Stockton Metro,Stockton,CA,USA,37.89426694,-121.2386203
SCM,Scammon Bay,Scammon Bay,AK,USA,61.84454111,-165.5737492
SCX,Scott Municipal,Oneida,TN,USA,36.45569444,-84.58575
SD07,Bison Municipal,Bison,SD,USA,45.51859778,-102.4671042
SD10,Canton Municipal,Canton,SD,USA,43.30888889,-96.571
SD12,Wilder,De Smet,SD,USA,44.43080278,-97.56118861
SD16,Eureka Municipal,Eureka,SD,USA,45.79998111,-99.6420625
SD18,Flandreau Municipal,Flandreau,SD,USA,44.00386056,-96.59310139
SD22,Hoven Municipal,Hoven,SD,USA,45.25755861,-99.79783944
SD28,McLaughlin Municipal,McLaughlin,SD,USA,45.79680833,-100.7842503
SD32,Murdo Municipal,Murdo,SD,USA,43.85165639,-100.7120811
SD33,Parkston Municipal,Parkston,SD,USA,43.37915361,-97.97118278
SD34,Presho Municipal,Presho,SD,USA,43.90637833,-100.0370669
SDA,Shenandoah Municipal,Shenandoah,IA,USA,40.75148167,-95.41347222
SDF,Louisville International-Standiford,Louisville,KY,USA,38.17438889,-85.736
SDL,Scottsdale,Scottsdale,AZ,USA,33.622875,-111.9105333
SDM,Brown  Municipal,San Diego,CA,USA,32.57230556,-116.98025
SDP,Sand Point Municipal,Sand Point,AK,USA,55.31502778,-160.5176944
SDY,Sidney-Richland Municipal,Sidney,MT,USA,47.70685778,-104.1925544
SEA,Seattle-Tacoma Intl,Seattle,WA,USA,47.44898194,-122.3093131
SEE,Gillespie,San Diego (El Cajon),CA,USA,32.82623111,-116.9724497
SEF,Sebring  And Industrial Park,Sebring,FL,USA,27.45640278,-81.3424
SEG,Penn Valley,Selinsgrove,PA,USA,40.82052917,-76.86377611
SEM,Craig,Selma,AL,USA,32.34394667,-86.98780333
SEP,Clark Field Municipal,Stephenville,TX,USA,32.21532333,-98.17766722
SER,Freeman Municipal,Seymour,IN,USA,38.92355361,-85.90736556
SET,St Charles County Smart,St Charles,MO,USA,38.92969444,-90.42996111
SEZ,Sedona,Sedona,AZ,USA,34.84862889,-111.7884614
SFB,Orlando Sanford,Orlando,FL,USA,28.77764,-81.23748944
SFD,Bob Wiley,Winner,SD,USA,43.39058278,-99.84256194
SFF,Felts,Spokane,WA,USA,47.68281806,-117.3225583
SFM,Sanford Regional,Sanford,ME,USA,43.39386111,-70.70800028
SFO,San Francisco International,San Francisco,CA,USA,37.61900194,-122.3748433
SFQ,Suffolk Municipal,Suffolk,VA,USA,36.68235361,-76.60187333
SFY,Tri-Township,Savanna,IL,USA,42.04581972,-90.10760056
SFZ,North Central State,Pawtucket,RI,USA,41.92076333,-71.49138139
SGF,Springfield-Branson Regional,Springfield,MO,USA,37.24432611,-93.38685806
SGH,Springfield-Beckley Municipal,Springfield,OH,USA,39.84028194,-83.84015056
SGJ,St. Augustine,St. Augustine,FL,USA,29.95925,-81.33975
SGR,Sugar Land Municipal/Hull,Houston,TX,USA,29.62225306,-95.65652889
SGS,South St.Paul Municipal,South St Paul,MN,USA,44.85713278,-93.03285389
SGT,Stuttgart Municipal,Stuttgart,AR,USA,34.60054,-91.57457417
SGU,St George Muni,St George,UT,USA,37.09058333,-113.5930556
SGY,Skagway,Skagway,AK,USA,59.46006194,-135.3156636
SHD,Shenandoah Valley Regional,Staunton/Harrisonburg,VA,USA,38.26384333,-78.89643806
SHG,Shungnak,Shungnak,AK,USA,66.88916556,-157.1505119
SHH,Shishmaref,Shishmaref,AK,USA,66.24956861,-166.0895589
SHL,Sheldon Municipal,Sheldon,IA,USA,43.20839361,-95.83343306
SHN,Sanderson,Shelton,WA,USA,47.23355556,-123.1475556
SHR,Sheridan County,Sheridan,WY,USA,44.76919556,-106.9802794
SHV,Shreveport Regional,Shreveport,LA,USA,32.4466275,-93.82559833
SHX,Shageluk,Shageluk,AK,USA,62.69511944,-159.5690614
SIG,Fernando Luis Ribas Dominicci,San Juan,PR,USA,18.45675,-66.09883333
SIK,Sikeston Memorial Municipal,Sikeston,MO,USA,36.89888889,-89.56175
SIT,Sitka,Sitka,AK,USA,57.04713806,-135.3615983
SIV,Sullivan County,Sullivan,IN,USA,39.1147125,-87.44832917
SIY,Siskiyou County,Montague,CA,USA,41.78144167,-122.4681094
SJC,San Jose International,San Jose,CA,USA,37.36186194,-121.9290089
SJN,St Johns Industrial Air Park,St Johns,AZ,USA,34.51855556,-109.37875
SJT,San Angelo Regional /Mathis,San Angelo,TX,USA,31.35775,-100.4963056
SJU,Luis Munoz Marin International,San Juan,PR,USA,18.43941667,-66.00183333
SJX,Beaver Island,St James,MI,USA,45.69227778,-85.56630556
SKA,Fairchild AFB,NA,NA,USA,47.615058,-117.655803
SKI,Sac City Municipal,Sac City,IA,USA,42.37908333,-94.97958333
SKW,Skwentna,Skwentna,AK,USA,61.965295,-151.1913661
SKX,Taos Municipal,Taos,NM,USA,36.45819,-105.6724289
SLB,Storm Lake Municipal,Storm Lake,IA,USA,42.59719444,-95.24066667
SLC,Salt Lake City Intl,Salt Lake City,UT,USA,40.78838778,-111.9777731
SLE,McNary Fld,Salem,OR,USA,44.90952778,-123.0025
SLG,Smith,Siloam Springs,AR,USA,36.19060778,-94.49088306
SLK,Adirondack,Saranac Lake,NY,USA,44.38531,-74.20618472
SLN,Salina Municipal,Salina,KS,USA,38.7914825,-97.65060333
SLO,Salem-Leckrone,Salem,IL,USA,38.64287222,-88.96418528
SLQ,Sleetmute,Sleetmute,AK,USA,61.70931139,-157.1557008
SLR,Sulphur Springs Municipal,Sulphur Springs,TX,USA,33.15983333,-95.62113889
SMD,Smith,Fort Wayne,IN,USA,41.14335389,-85.15277694
SME,Somerset-Pulaski County,Somerset,KY,USA,37.05419722,-84.61494139
SMF,Sacramento International,Sacramento,CA,USA,38.69542167,-121.5907669
SMN,Lemhi County,Salmon,ID,USA,45.12047778,-113.8820103
SMO,Santa Monica Municipal,Santa Monica,CA,USA,34.01582194,-118.4512961
SMQ,Somerset,Somerville,NJ,USA,40.62599083,-74.67024333
SMS,Sumter Municipal,Sumter,SC,USA,33.99569444,-80.3615
SMX,Santa Maria Pub/Capt G Allan Hancock,Santa Maria,CA,USA,34.89924833,-120.4575825
SNA,John Wayne /Orange Co,Santa Ana,CA,USA,33.67565861,-117.8682225
SNH,Savannah Hardin County,Savannah,TN,USA,35.17036,-88.21587
SNK,Winston,Snyder,TX,USA,32.69338667,-100.9504525
SNL,Shawnee Municipal,Shawnee,OK,USA,35.35730333,-96.94282833
SNP,St. Paul,St. Paul,AK,USA,57.16733333,-170.2204444
SNS,Salinas Municipal,Salinas,CA,USA,36.66279222,-121.6063603
SNY,Sidney Municipal,Sidney,NE,USA,41.10133333,-102.9852778
SOP,Moore County,Pinehurst/Southern Pines,NC,USA,35.23735278,-79.39116944
SOV,Seldovia,Seldovia,AK,USA,59.44243917,-151.7040503
SOW,Show Low Municipal,Show Low,AZ,USA,34.26527194,-110.0054075
SPA,Spartanburg Downtown Memorial,Spartanburg,SC,USA,34.91572222,-81.9565
SPB,Scappoose Industrial Airpark,Scappoose,OR,USA,45.77250444,-122.8623611
SPF,Black Hills-Clyde Ice,Spearfish,SD,USA,44.48022222,-103.7768889
SPG,Albert Whitted Municipal,St. Petersburg,FL,USA,27.76511111,-82.62697222
SPH,Springhill,Springhill,LA,USA,32.98316472,-93.41081028
SPI,Capital,Springfield,IL,USA,39.84395194,-89.67761861
SPN,Tinian International Airport,NA,NA,N Mariana Islands,14.996111,145.621384
SPS,Sheppard AFB/Wichita Falls Municipal,Wichita Falls,TX,USA,33.98879611,-98.49189333
SPW,Spencer Municipal,Spencer,IA,USA,43.16552778,-95.20280556
SPX,Houston-Gulf,Houston,TX,USA,29.50836111,-95.05133333
SQI,Whiteside Co,Sterling Rockfalls,IL,USA,41.74284139,-89.67629028
SQL,San Carlos,San Carlos,CA,USA,37.511855,-122.2495236
SRB,Upper Cumberland Regional,Sparta,TN,USA,36.05593278,-85.5307475
SRC,Searcy Municipal,Searcy,AR,USA,35.21194639,-91.737165
SRQ,Sarasota Bradenton International,Sarasota,FL,USA,27.39533333,-82.55411111
SRR,Sierra Blanca Regional,Ruidoso,NM,USA,33.46285,-105.5347508
SRV,Stony River 2,Stony River,AK,USA,61.789875,-156.5881861
SSF,Stinson Municipal,San Antonio,TX,USA,29.3370075,-98.47114056
SSI,Malcolm McKinnon,Brunswick,GA,USA,31.1515925,-81.39134667
SSQ,Shell Lake Municipal,Shell Lake,WI,USA,45.73138139,-91.92066194
STC,St Cloud Regional,St Cloud,MN,USA,45.54532417,-94.05833667
STE,Stevens Point Municipal,Stevens Point,WI,USA,44.54513556,-89.53028444
STF,George M Bryan,Starkville,MS,USA,33.43381667,-88.84863806
STJ,Rosecrans Memorial,St Joseph,MO,USA,39.77194444,-94.90970556
STK,Crosson,Sterling,CO,USA,40.6152625,-103.2646556
STL,Lambert-St Louis International,St Louis,MO,USA,38.74768694,-90.35998972
STP,St Paul Downtown Holman,St Paul,MN,USA,44.9344725,-93.05999861
STS,Sonoma Co,Santa Rosa,CA,USA,38.50897694,-122.8128803
STT,Cyril E. King,Charlotte Amalie,VI,USA,18.33730556,-64.97336111
STX,Henry E. Rohlsen,Christiansted,VI,USA,17.70188889,-64.79855556
SUA,Witham,Stuart,FL,USA,27.18169444,-80.22108333
SUD,Stroud Municipal,Stroud,OK,USA,35.78756833,-96.65862861
SUE,Door County Cherryland,Sturgeon Bay,WI,USA,44.84366222,-87.42154111
SUN,Friedman Memorial,Hailey,ID,USA,43.50484139,-114.2965903
SUS,Spirit of St Louis,St Louis,MO,USA,38.66187028,-90.65123
SUT,Brunswick County,Southport,NC,USA,33.92925694,-78.07499167
SUW,Richard I Bong,Superior,WI,USA,46.6897175,-92.094655
SUX,Sioux Gateway,Sioux City,IA,USA,42.40260333,-96.38436694
SVA,Savoonga,Savoonga,AK,USA,63.68639444,-170.4926361
SVC,Grant County,Silver City,NM,USA,32.63654694,-108.1563853
SVE,Susanville Municipal,Susanville,CA,USA,40.37684111,-120.5730033
SVH,Statesville Municipal,Statesville,NC,USA,35.76526389,-80.95673611
SVS,Stevens Village,Stevens Village,AK,USA,66.00900528,-149.0959153
SWD,Seward,Seward,AK,USA,60.12693833,-149.4188122
SWF,Stewart,Newburgh,NY,USA,41.50409361,-74.10483833
SWO,Stillwater Regional,Stillwater,OK,USA,36.16025194,-97.08577028
SWT,Seward Municipal,Seward,NE,USA,40.86525806,-97.10931306
SWW,Avenger,Sweetwater,TX,USA,32.46736806,-100.4665508
SXL,Summersville,Summersville,WV,USA,38.23163889,-80.87080556
SXP,Sheldon Point,Sheldon Point,AK,USA,62.52055556,-164.8477778
SXQ,Soldotna,Soldotna,AK,USA,60.47613889,-151.0324444
SYF,Cheyenne County Municipal,St Francis,KS,USA,39.76104833,-101.7958414
SYI,Bomar Field-Shelbyville Municipal,Shelbyville,TN,USA,35.56009889,-86.44249333
SYR,Syracuse-Hancock Intl,Syracuse,NY,USA,43.11118694,-76.10631056
SYV,Sylvester,Sylvester,GA,USA,31.55851111,-83.89573389
SZP,Santa Paula,Santa Paula,CA,USA,34.34722167,-119.061215
SZT,Sandpoint,Sandpoint,ID,USA,48.29965139,-116.5597681
SZY,Robert Sibley,Selmer,TN,USA,35.20295,-88.49836139
T00,Chambers County,Anahauac,TX,USA,29.77,-94.66361194
T03,Tuba City,Tuba City,AZ,USA,36.09276972,-111.3826419
T08,Tomahawk Regional,Tomahawk,WI,USA,45.46913889,-89.80569444
T18,Brooks County,Falfurrias,TX,USA,27.20683333,-98.12117083
T28,Lampasas Municipal,Lampasas,TX,USA,31.10672694,-98.19600194
T35,Cameron Municipal Airpark,Cameron,TX,USA,30.87935556,-96.97109694
T36,Paul Pittman Memorial,Tylertown,MS,USA,31.14601111,-90.168145
T41,La Porte Municipal,La Porte,TX,USA,29.66925,-95.06419444
T44,Trident Basin,Kodiak,AK,USA,57.78083333,-152.3913889
T47,Kickapoo Downtown Airpark,Wichita Falls,TX,USA,33.86122222,-98.4904425
T49,Big Spring McMahon-Wrinkle,Big Spring,TX,USA,32.21261111,-101.5216389
T53,Robstown-Nueces County,Robstown,TX,USA,27.77854306,-97.69052389
T56,Crockett-Houston County,Crockett,TX,USA,31.30696111,-95.40383056
T57,Garland Heliport,Garland,TX,USA,32.887625,-96.6836075
T60,Stonewall County,Aspermont,TX,USA,33.17231861,-100.1976044
T65,Mid Valley,Weslaco,TX,USA,26.17763889,-97.97305556
T69,Sinton-San Patricio County,Sinton,TX,USA,28.03925,-97.54244444
T71,Cuero Municipal,Cuero,TX,USA,29.08358806,-97.26693417
T72,Hearne Municipal,Hearne,TX,USA,30.87182917,-96.62222639
T74,Taylor Municipal,Taylor,TX,USA,30.57194444,-97.44316667
T78,Liberty Municipal,Liberty,TX,USA,30.07780556,-94.69855556
T80,Kleberg County,Kingsville,TX,USA,27.55086111,-98.03091833
T82,Gillespie County,Fredericksburg,TX,USA,30.24369444,-98.90952778
T89,Castroville Municipal,Castroville,TX,USA,29.34192083,-98.85090056
T90,Chambers County,Winnie/Stowell,TX,USA,29.80411,-94.43102306
T97,Calhoun County,Port Lavaca,TX,USA,28.65405111,-96.6813125
TAD,Perry Stokes,Trinidad,CO,USA,37.25937778,-104.340675
TAL,Ralph M Calhoun Memorial,Tanana,AK,USA,65.17439528,-152.1093886
TAN,Taunton Municipal,Taunton,MA,USA,41.87460139,-71.01687583
TAZ,Taylorville Municipal,Taylorville,IL,USA,39.53418583,-89.32781222
TBN,Forney AAF,Fort Leonard Wood,MO,USA,37.74163111,-92.14073611
TBR,Statesboro Municipal,Statesboro,GA,USA,32.48316667,-81.73727778
TCC,Tucumcari Municipal,Tucumcari,NM,USA,35.18277806,-103.6031853
TCL,Tuscaloosa Municipal,Tuscaloosa,AL,USA,33.2206275,-87.61140139
TCS,Truth Or Consequences Municipal,Truth Or Consequences,NM,USA,33.23694444,-107.27175
TCT,Takotna,Takotna,AK,USA,62.99270417,-156.0681903
TCY,Tracy Municipal,Tracy,CA,USA,37.68910778,-121.4418172
TDF,Person County,Roxboro,NC,USA,36.28489194,-78.98422694
TDO,Toledo-Winlock Ed Carlson Memorial,Toledo,WA,USA,46.47709083,-122.80686
TDZ,Toledo Metcalf,Toledo,OH,USA,41.56487194,-83.48226139
TEB,Teterboro,Teterboro,NJ,USA,40.85010139,-74.06083611
TEL,Perry County Municipal,Tell City,IN,USA,38.01769694,-86.69093
TEW,Mason Jewett,Mason,MI,USA,42.56576833,-84.42321861
TEX,Telluride Regional,Telluride,CO,USA,37.95375861,-107.90848
TGC,Gibson County,Trenton,TN,USA,35.93245472,-88.84894028
TGI,Tangier Island,Tangier,VA,USA,37.82513889,-75.99777778
THA,Tullahoma Regional,Tullahoma,TN,USA,35.38015694,-86.24602333
THM,Thompson Falls,Thompson Falls,MT,USA,47.57493556,-115.2843164
THP,Hot Springs County-Thermopolis Municipal,Thermopolis,WY,USA,43.65828917,-108.2131542
THV,York,York,PA,USA,39.916995,-76.87302611
TIW,Tacoma Narrows,Tacoma,WA,USA,47.26793111,-122.5780997
TIX,Space Cost Regional,Titusville,FL,USA,28.51479944,-80.7992275
TKA,Talkeetna,Talkeetna,AK,USA,62.3205,-150.0936944
TKE,Tenakee SPB,Tenakee Springs,AK,USA,57.77965833,-135.2184439
TKI,McKinney Municipal,McKinney,TX,USA,33.17794778,-96.5905275
TKX,Kennett Memorial,Kennett,MO,USA,36.23087083,-90.03466806
TLH,Tallahassee Regional,Tallahassee,FL,USA,30.39652778,-84.35033333
TLR,Mefford,Tulare,CA,USA,36.15630556,-119.3261667
TLT,Tuluksak,Tuluksak,AK,USA,61.09676222,-160.9684167
TMA,Henry Tift Myers,Tifton,GA,USA,31.42879528,-83.48787167
TMB,Kendall-Tamiami Executive,Miami,FL,USA,25.64788889,-80.43277778
TNI,West Tinian,Peipeinimaru,CQ,USA,14.99685028,-145.6180383
TNP,Twentynine Palms,Twentynine Palms,CA,USA,34.13208528,-115.9458319
TNT,Dade Collier T And T,Miami,FL,USA,25.86180556,-80.897
TNU,Newton Municipal,Newton,IA,USA,41.67442972,-93.02172917
TOA,Zamperini,Torrance,CA,USA,33.8033775,-118.3396
TOB,Dodge Center,Dodge Center,MN,USA,44.018,-92.8315
TOC,"Toccoa, R G Le Tourneau",Toccoa,GA,USA,34.59376444,-83.2958
TOG,Togiak Village,Togiak,AK,USA,59.05284222,-160.3969339
TOI,Troy Municipal,Troy,AL,USA,31.86041667,-86.01213889
TOL,Toledo Express,Toledo,OH,USA,41.58680556,-83.80783333
TOP,Philip Billard Municipal,Topeka,KS,USA,39.0686575,-95.62248361
TOR,Torrington Muni,Torrington,WY,USA,42.0645475,-104.1526986
TPA,Tampa International,Tampa,FL,USA,27.97547222,-82.53325
TPF,Peter O. Knight,Tampa,FL,USA,27.91557833,-82.44926083
TPH,Tonopah,Tonopah,NV,USA,38.06020222,-117.0871536
TPL,Draughon-Miller Central Texas Regional,Temple,TX,USA,31.1525,-97.40777778
TPO,Port Alsworth,Port Alsworth,AK,USA,60.20433333,-154.3188728
TQE,Municipal,Tekamah,NE,USA,41.76352778,-96.17794444
TQH,Tahlequah Municipal,Tahlequah,OK,USA,35.92891667,-95.00452778
TQK,Scott City Municipal,Scott City,KS,USA,38.47427778,-100.8849444
TRI,Tri-Cities Regional,Bristol,TN,USA,36.47521417,-82.40742056
TRK,Truckee-Tahoe,Truckee,CA,USA,39.32004222,-120.1395628
TRL,Terrell Municipal,Terrell,TX,USA,32.71004667,-96.26742306
TRM,Desert Resorts Regional,Palm Springs,CA,USA,33.62789944,-116.1601194
TRX,Trenton Municipal,Trenton,MO,USA,40.08351333,-93.59063472
TSO,Carroll County-Tolson,Carrollton,OH,USA,40.56186833,-81.07748611
TSP,Tehachapi Municipal,Tehachapi,CA,USA,35.13497222,-118.43925
TT01,Pagan Airstrip,Shomu-Shon,CQ,USA,18.12444444,-145.7686111
TTA,Sanford-Lee County Regional,Sanford,NC,USA,35.58247222,-79.10136111
TTD,Portland-Troutdale,Portland,OR,USA,45.54936889,-122.4012519
TTF,Monroe Custer,Monroe,MI,USA,41.93990639,-83.43468306
TTN,Trenton-Mercer County,Trenton,NJ,USA,40.27669111,-74.81346833
TUL,Tulsa International,Tulsa,OK,USA,36.19837222,-95.88824167
TUP,Tupelo Municipal,Tupelo,MS,USA,34.26810833,-88.769895
TUS,Tucson International,Tucson,AZ,USA,32.11608333,-110.9410278
TVB,Cabool Memorial,Cabool,MO,USA,37.13244083,-92.08396167
TVC,Cherry Capital,Traverse City,MI,USA,44.74144472,-85.582235
TVF,Thief River Falls Regional,Thief River Falls,MN,USA,48.06550028,-96.18336083
TVI,Thomasville Municipal,Thomasville,GA,USA,30.90155194,-83.88133556
TVK,Centerville Municipal,Centerville,IA,USA,40.68390306,-92.90103333
TVL,Lake Tahoe,South Lake Tahoe,CA,USA,38.89388167,-119.9953347
TVR,Vicksburg Tallulah Regional,Tallulah,LA,USA,32.35160639,-91.02768917
TVY,Tooele Valley,Tooele,UT,USA,40.6122725,-112.3507719
TWF,Joslin Field - Magic Valley,Twin Falls,ID,USA,42.48180389,-114.4877356
TWM,Richard B. Helgeson,Two Harbors,MN,USA,47.049225,-91.74514167
TXK,Texarkana Regional-Webb,Texarkana,AR,USA,33.45370806,-93.99102
TYL,Taylor,Taylor,AZ,USA,34.45283333,-110.1148056
TYQ,Indianapolis Terry,Indianapolis,IN,USA,40.03064972,-86.2514375
TYR,Tyler Pounds,Tyler,TX,USA,32.35413889,-95.40238611
TYS,McGhee-Tyson,Knoxville,TN,USA,35.81248722,-83.99285583
TZR,Bolton,Columbus,OH,USA,39.90081778,-83.13719361
TZT,Belle Plaine Municipal,Belle Plaine,IA,USA,41.87877778,-92.28456944
TZV,Tompkinsville-Monroe County,Tompkinsville,KY,USA,36.72978,-85.65191556
U02,McCarley,Blackfoot,ID,USA,43.20925,-112.3495861
U03,Buhl Municipal,Buhl,ID,USA,42.59157139,-114.7967178
U05,Riddick,Philipsburg,MT,USA,46.31936972,-113.3050642
U08,Perkins,Overton,NV,USA,36.56803,-114.4433133
U10,Preston,Preston,ID,USA,42.10690806,-111.9125389
U14,Nephi Municipal,Nephi,UT,USA,39.73884333,-111.8716011
U25,Dubois Municipal,Dubois,WY,USA,43.54834722,-109.6902611
U30,Temple Bar,Temple Bar,AZ,USA,36.02054056,-114.3352461
U34,Green River Muni,Green River,UT,USA,38.96136167,-110.2273619
U36,Aberdeen Municipal,Aberdeen,ID,USA,42.92102222,-112.8811053
U42,Salt Lake City Municipal 2,Salt Lake City,UT,USA,40.61954,-111.9928858
U43,Monticello,Monticello,UT,USA,37.937215,-109.3465053
U52,Beaver Municipal,Beaver,UT,USA,38.23071,-112.6753497
U55,Panguitch Municipal,Panguitch,UT,USA,37.84523333,-112.3918731
U59,Driggs-Reed Memorial,Driggs,ID,USA,43.74193056,-111.0978608
U68,North Big Horn County,Cowley/Lovell/Byron,WY,USA,44.91167028,-108.4455092
U69,Duchesne Municipal,Duchesne,UT,USA,40.19190167,-110.3809886
U70,Cascade,Cascade,ID,USA,44.4937825,-116.0162422
U76,Mountain Home Municipal,Mountain Home,ID,USA,43.13125278,-115.7295944
U77,Spanish Fork-Springville,Spanish Fork,UT,USA,40.14162139,-111.6613125
U82,Council Municipal,Council,ID,USA,44.7498875,-116.4468092
U96,Cal Black Memorial,Halls Crossing,UT,USA,37.44221444,-110.5695836
UAO,Aurora State,Aurora,OR,USA,45.24713889,-122.7700556
UBE,Cumberland Municipal,Cumberland,WI,USA,45.50597028,-91.98108694
UBS,Columbus-Lowndes County,Columbus,MS,USA,33.46539667,-88.38031639
UBX,Cuba Municipal,Cuba,MO,USA,38.06877667,-91.42885694
UCA,Oneida Cty,Utica,NY,USA,43.14511944,-75.38385889
UCP,New Castle Muni,New Castle,PA,USA,41.02533778,-80.41337194
UCY,Everett-Stewart,Union City,TN,USA,36.38025,-88.98547778
UDD,Bermuda Dunes,Palm Springs,CA,USA,33.7484375,-116.2748133
UDG,Darlington County,Darlington,SC,USA,34.44919444,-79.89036111
UES,Waukesha County,Waukesha,WI,USA,43.04102778,-88.23705556
UGN,Waukegan Regional,Chicago/Waukegan,IL,USA,42.42216,-87.86790694
UIL,Quillayute,Forks,WA,USA,47.93714444,-124.5612497
UIN,Quincy Municipal-Baldwin,Quincy,IL,USA,39.94262417,-91.19445611
UIZ,Berz-Macomb,Utica,MI,USA,42.66389361,-82.96542583
UKF,Wilkes County,North Wilkesboro,NC,USA,36.22284028,-81.0983375
UKI,Ukiah Municipal,Ukiah,CA,USA,39.12595722,-123.200855
UKL,Coffey County,Burlington,KS,USA,38.30248472,-95.7249575
UKT,Quakertown,Quakertown,PA,USA,40.43521194,-75.38192861
ULM,New Ulm Municipal,New Ulm,MN,USA,44.31957306,-94.50230778
ULS,Ulysses,Ulysses,KS,USA,37.60375278,-101.3733889
UMP,Indianapolis Metropolitan,Indianapolis,IN,USA,39.9352025,-86.04495333
UNI,Ohio University,Athens/Albany,OH,USA,39.21096222,-82.23142583
UNK,Unalakleet,Unalakleet,AK,USA,63.88835917,-160.7989517
UNO,West Plains Municipal,West Plains,MO,USA,36.87813889,-91.90269444
UNU,Dodge County,Juneau,WI,USA,43.42658333,-88.70322222
UNV,University Park,State College,PA,USA,40.84927778,-77.84869444
UOS,Franklin County,Sewanee,TN,USA,35.20397028,-85.89858889
UOX,University-Oxford,Oxford,MS,USA,34.38431528,-89.53530972
UPP,Upolu,Hawi,HI,USA,20.26525583,-155.8599875
USE,Fulton County,Wauseon,OH,USA,41.61033333,-84.12552778
UTS,Huntsville Municipal,Huntsville,TX,USA,30.74688667,-95.58716667
UUO,Willow,Willow,AK,USA,61.75441667,-150.0516639
UUU,Newport State,Newport,RI,USA,41.53243972,-71.28154389
UUV,Sullivan Regional,Sullivan,MO,USA,38.23343056,-91.16433333
UVA,Garner,Uvalde,TX,USA,29.21135028,-99.74358306
UWL,New Castle-Henry Co,New Castle,IN,USA,39.87585167,-85.32646806
UYF,Madison County,London,OH,USA,39.93272694,-83.46200361
UZA,Rock Hill Municipal/Bryant,Rock Hill,SC,USA,34.98783333,-81.05716667
VAK,Chevak,Chevak,AK,USA,61.53363583,-165.5837322
VAY,South Jersey Reg,Mount Holly,NJ,USA,39.94289056,-74.84571944
VBT,Bentonville Municipal,Bentonville,AR,USA,36.34571528,-94.219345
VCB,Nut Tree,Vacaville,CA,USA,38.37675167,-121.962455
VCT,Victoria Regional,Victoria,TX,USA,28.85255556,-96.91848722
VCV,Southern California Logistic,Victorville,CA,USA,34.593225,-117.3794667
VDI,Vidalia Municipal,Vidalia,GA,USA,32.19255556,-82.37194444
VDZ,Valdez,Valdez,AK,USA,61.13395028,-146.24836
VEE,Venetie,Venetie,AK,USA,67.02269444,-146.4137753
VEL,Vernal,Vernal,UT,USA,40.44090167,-109.5099203
VER,Jesse Viertel Memorial,Boonville,MO,USA,38.94577556,-92.68277139
VES,Darke County,Versailles,OH,USA,40.20441667,-84.53191667
VGT,North Las Vegas,Las Vegas,NV,USA,36.21166667,-115.19575
VHN,Culberson County,Van Horn,TX,USA,31.05784417,-104.7838056
VIH,Rolla National,Rolla/Vichy,MO,USA,38.12743222,-91.7695225
VIQ,Neillsville Municipal,Neillsville,WI,USA,44.55812861,-90.51224694
VIS,Visalia Municipal,Visalia,CA,USA,36.31866667,-119.3928889
VJI,Virginia Highlands,Abingdon,VA,USA,36.68711028,-82.03333583
VLA,Vandalia Municipal,Vandalia,IL,USA,38.99130556,-89.16622222
VLD,Valdosta Regional,Valdosta,GA,USA,30.7825,-83.27672222
VMR,Harold Davidson,Vermillion,SD,USA,42.76528917,-96.93425472
VNC,Venice Municipal,Venice,FL,USA,27.07161111,-82.44033333
VNW,Van Wert County,Van Wert,OH,USA,40.86472222,-84.60944444
VNY,Van Nuys,Van Nuys,CA,USA,34.20980972,-118.4899733
VPC,Cartersville,Cartersville,GA,USA,34.12313889,-84.84869444
VPS,Eglin Air Force Base,Valparaiso,FL,USA,30.48325,-86.5254
VPZ,Porter County Municipal,Valparaiso,IN,USA,41.45396667,-87.00707139
VQQ,Cecil,Jacksonville,FL,USA,30.21867306,-81.87666444
VQS,Antonio Rivera Rodriguez,Isla De Vieques,PR,USA,18.13551806,-65.49182583
VRB,Vero Beach Municipal,Vero Beach,FL,USA,27.65555556,-80.41794444
VSF,Springfield State/Hartness,Springfield,VT,USA,43.34362889,-72.5173125
VTA,Newark-Heath,Newark,OH,USA,40.024675,-82.46182194
VTI,Vinton Veterans Memorial Airpark,Vinton,IA,USA,42.21862611,-92.02592806
VTN,Miller,Valentine,NE,USA,42.85767194,-100.547355
VUJ,Stanly County,Albemarle,NC,USA,35.41669472,-80.15079556
VUO,Pearson Airpark,Vancouver,WA,USA,45.6204525,-122.6564883
VVV,Ortonville Municipal,Ortonville,MN,USA,45.30566472,-96.42442278
VYS,Illinois Valley Regional,Peru/Lasalle,IL,USA,41.35186806,-89.15308417
W04,Ocean Shores Municipal,Ocean Shores,WA,USA,47.00369806,-124.143785
W05,Gettysburg  & Travel Center,Gettysburg,PA,USA,39.84092833,-77.27415139
W11,Menomonie Municipal - Score,Menomonie,WI,USA,44.89234639,-91.86777944
W22,Upshur County Regional,Buckhannon,WV,USA,39.00035833,-80.27392778
W29,Bay Bridge Industrial,Stevensville,MD,USA,38.97638889,-76.32963889
W31,Lunenburg County,Kenbridge,VA,USA,36.96015,-78.18499861
W33,Friday Harbor,Friday Harbor,WA,USA,48.53732194,-123.0096236
W40,Mt Olive Municipal,Mt Olive,NC,USA,35.22224722,-78.03779444
W41,Crisfield Municipal,Crisfield,MD,USA,38.01679028,-75.82882056
W44,Asheboro Municipal,Asheboro,NC,USA,35.6538825,-79.8950425
W45,Luray Caverns,Luray,VA,USA,38.66705556,-78.50058333
W66,Warrenton-Fauquier,Warrenton,VA,USA,38.58704667,-77.71138389
W78,William M Tuck,South Boston,VA,USA,36.710045,-78.84802028
W95,Ocracoke Island,Ocracoke,NC,USA,35.10117083,-75.96595278
W96,New Kent County,Quinton,VA,USA,37.50320139,-77.12552694
W97,Middle Peninsula Regional,West Point,VA,USA,37.52122778,-76.7646825
W99,Grant County,Petersburg,WV,USA,38.99419444,-79.14438889
WA10,Grove,Camas/Washougal,WA,USA,45.62777778,-122.4041667
WA21,Grand Coulee Dam,Electric City,WA,USA,47.92348361,-119.0805789
WA31,Whidbey Air Park,Langley,WA,USA,48.01814917,-122.4384789
WA43,Odessa Municipal,Odessa,WA,USA,47.3582025,-118.6733264
WAY,Greene Cty,Waynesburg,PA,USA,39.900075,-80.13311667
WBB,Stebbins,Stebbins,AK,USA,63.51591972,-162.2827394
WBQ,Beaver,Beaver,AK,USA,66.36155056,-147.4012186
WBW,Wilkes-Barre Wyoming Valley,Wilkes-Barre,PA,USA,41.29717222,-75.85120556
WCR,Chandalar Lake,Chandalar Lake,AK,USA,67.50451667,-148.4832222
WDG,Enid Woodring Municipal,Enid,OK,USA,36.37920333,-97.79111222
WDR,Winder,Winder,GA,USA,33.98227778,-83.66808333
WHP,Whiteman,Los Angeles,CA,USA,34.25932528,-118.4134331
WJF,General Wm. J. Fox Airfield,Lancaster,CA,USA,34.74095944,-118.2189489
WLD,Strother,Winfield/Arkansas City,KS,USA,37.16861556,-97.03752194
WLK,Selawik,Selawik,AK,USA,66.60002778,-159.9861944
WLW,Willows-Glenn County,Willows,CA,USA,39.51635389,-122.2175106
WMC,Winnemucca Municipal,Winnemucca,NV,USA,40.89661111,-117.8058889
WMO,White Mountain,White Mountain,AK,USA,64.68919444,-163.4125556
WNA,Napakiak,Napakiak,AK,USA,60.69118917,-161.9695161
WRG,Wrangell,Wrangell,AK,USA,56.48432583,-132.3698242
WRL,Worland Muni,Worland,WY,USA,43.96571306,-107.9508308
WSM,Wiseman,Wiseman,AK,USA,67.40457333,-150.1227417
WSN,South Naknek 2,South Naknek,AK,USA,58.70343611,-157.0082511
WST,Westerly State,Westerly,RI,USA,41.34961694,-71.80337778
WTK,Noatak,Noatak,AK,USA,67.56208333,-162.9752778
WVI,Watsonville Municipal,Watsonville,CA,USA,36.93573,-121.7896178
WVL,Waterville-Robert Lafleur,Waterville,ME,USA,44.53325,-69.67552778
WWD,Cape May Cty,Wildwood,NJ,USA,39.00850694,-74.90827389
WWR,West Woodward,Woodward,OK,USA,36.4367025,-99.5209975
WYS,Yellowstone,West Yellowstone,MT,USA,44.68839917,-111.1176375
X01,Everglades,Everglades,FL,USA,25.84871167,-81.39007944
X06,Arcadia Municipal,Arcadia,FL,USA,27.19199444,-81.83730472
X07,Lake Wales Municipal,Lake Wales,FL,USA,27.89380556,-81.62038889
X10,Belle Glade Municipal,Belle Glade,FL,USA,26.70089833,-80.66227972
X14,Labelle Municipal,Labelle,FL,USA,26.74423278,-81.43257556
X16,Vandenberg,Tampa,FL,USA,28.01398389,-82.34527917
X21,Arthur Dunn Airpark,Titusville,FL,USA,28.62234556,-80.835695
X23,Umatilla Municipal,Umatilla,FL,USA,28.922765,-81.65174111
X26,Sebastian Municipal,Sebastian,FL,USA,27.81280389,-80.49560833
X35,Dunnellon/Marion Co.,Dunellon,FL,USA,29.06177778,-82.37658333
X40,Inverness,Inverness,FL,USA,28.80859639,-82.31648167
X44,Watson Island Base,Miami,FL,USA,25.77833333,-80.17027778
X46,Opa-Locka West,Miami,FL,USA,25.94898194,-80.42338694
X47,Flagler County,Bunnell,FL,USA,29.46738889,-81.20633333
X51,Homestead General Aviation,Homestead,FL,USA,25.49872139,-80.55422528
X59,Valkaria,Valkaria,FL,USA,27.96196472,-80.55977556
X60,Williston Municipal,Williston,FL,USA,29.35422,-82.47288194
X63,Humacao,Humacao,PR,USA,18.13801667,-65.8007175
X66,Charlotte Amalie Harbor Seaplane Base,Charlotte Amalie,VI,USA,18.33856722,-64.94070111
X67,Christiansted Harbor Seaplane Base,Christiansted,VI,USA,17.74719528,-64.70486444
X95,Diego Jimenez Torres,Fajardo,PR,USA,18.30800972,-65.66182806
X96,Cruz Bay Harbor Seaplane Base,Cruz Bay,VI,USA,18.33689833,-64.79958306
XNA,Northwest Arkansas Regional,Fayetteville/Springdale/Rogers,AR,USA,36.28186944,-94.30681111
XVG,Longville Municipal,Longville,MN,USA,46.99016361,-94.20400222
Y03,Springfield Municipal,Springfield,SD,USA,42.87999833,-97.90117972
Y14,Marv Skie-Lincoln County,Tea,SD,USA,43.45747694,-96.80199528
Y15,Cheboygan City-County,Cheboygan,MI,USA,45.65371028,-84.51927306
Y19,Mandan Municipal,Mandan,ND,USA,46.76823667,-100.8943433
Y27,Standing Rock,Fort Yates,ND,USA,46.06638556,-100.6348492
Y31,West Branch Community,West Branch,MI,USA,44.244825,-84.17980472
Y37,Park River Municipal,Park River,ND,USA,48.39443778,-97.78147889
Y47,New Hudson,New Hudson,MI,USA,42.50311694,-83.62371667
Y50,Wautoma Municipal,Wautoma,WI,USA,44.04162556,-89.30448694
Y51,Viroqua Municipal,Viroqua,WI,USA,43.57913917,-90.90096333
Y55,Crandon Municipal,Crandon,WI,USA,45.51662972,-88.93344694
Y63,Elbow Lake Municipal,Elbow Lake,MN,USA,45.98607111,-95.99199861
Y66,Drummond Island,Drummond Island,MI,USA,46.00931139,-83.74393417
Y68,Tracy Municipal,Tracy,MN,USA,44.24995694,-95.60445389
Y70,Ionia County,Ionia,MI,USA,42.93769972,-85.06066722
Y74,Hankins,Parshall,ND,USA,47.93640083,-102.1421142
Y83,Sandusky City,Sandusky,MI,USA,43.45418694,-82.84938028
Y93,Atlanta Municipal,Atlanta,MI,USA,45.00000833,-84.13333667
YAK,Yakutat,Yakutat,AK,USA,59.50336056,-139.6602261
YAP,Yap International,NA,NA,Federated States of Micronesia,9.5167,138.1
YIP,Willow Run,Detroit,MI,USA,42.2379275,-83.53040889
YKM,Yakima Air Terminal,Yakima,WA,USA,46.56816972,-120.5440594
YKN,Chan Gurney Municipal,Yankton,SD,USA,42.91669444,-97.38594444
YNG,Youngstown-Warren Regional,Youngstown,OH,USA,41.26073556,-80.67909667
YUM,Yuma MCAS-Yuma International,Yuma,AZ,USA,32.65658333,-114.6059722
Z08,Ofu,Ofu Village,AS,USA,14.18435056,-169.6700236
Z09,Kasigluk,Kasigluk,AK,USA,60.87202194,-162.5248094
Z13,Akiachak,Akiachak,AK,USA,60.90453167,-161.42091
Z17,Ophir,Ophir,AK,USA,63.1460375,-156.529865
Z40,Goose Bay,Goose Bay,AK,USA,61.39445139,-149.8455556
Z55,Lake Louise,Lake Louise,AK,USA,62.29368944,-146.5794219
Z73,Nelson Lagoon,Nelson Lagoon,AK,USA,56.00753611,-161.1603672
Z84,Clear,Clear A.F.B.,AK,USA,64.30120361,-149.1201436
Z91,Birch Creek,Birch Creek,AK,USA,66.27399583,-145.8240381
Z95,Cibecue,Cibecue,AZ,USA,34.00333333,-110.4441667
ZEF,Elkin Municipal,Elkin,NC,USA,36.28002361,-80.78606861
ZER,Schuylkill Cty/Joe Zerbey,Pottsville,PA,USA,40.70644889,-76.37314667
ZPH,Zephyrhills Municipal,Zephyrhills,FL,USA,28.22806472,-82.15591639
ZUN,Black Rock,Zuni,NM,USA,35.08322694,-108.7917769
ZZV,Zanesville Municipal,Zanesville,OH,USA,39.94445833,-81.89210528
`;
const flightsString = "origin,destination,count\nABE,ATL,853\nABE,BHM,1\nABE,CLE,805\nABE,CLT,465\nABE,CVG,247\nABE,DTW,997\nABE,JFK,3\nABE,LGA,9\nABE,ORD,1425\nABE,PHL,2\nABI,DFW,2660\nABQ,AMA,368\nABQ,ATL,1067\nABQ,AUS,433\nABQ,BWI,546\nABQ,CLE,12\nABQ,CVG,260\nABQ,DAL,3078\nABQ,DEN,4318\nABQ,DFW,2888\nABQ,ELP,799\nABQ,EWR,167\nABQ,HOU,1011\nABQ,IAD,365\nABQ,IAH,2261\nABQ,LAS,2402\nABQ,LAX,2395\nABQ,LBB,366\nABQ,MAF,367\nABQ,MCI,670\nABQ,MCO,730\nABQ,MDW,730\nABQ,MSP,677\nABQ,OAK,1016\nABQ,OKC,229\nABQ,ONT,446\nABQ,ORD,751\nABQ,PDX,366\nABQ,PHX,5265\nABQ,SAN,1034\nABQ,SAT,424\nABQ,SEA,721\nABQ,SFO,530\nABQ,SLC,2307\nABQ,SMF,466\nABQ,STL,366\nABQ,TPA,366\nABQ,TUL,230\nABQ,TUS,719\nABY,ATL,1095\nACK,EWR,234\nACK,JFK,223\nACT,DFW,1993\nACV,CEC,362\nACV,MRY,2\nACV,SFO,2343\nACV,SJC,1\nACV,SLC,388\nACV,SMF,618\nACY,ATL,113\nACY,JFK,1\nACY,LGA,2\nADK,ANC,102\nADQ,ANC,706\nAEX,ATL,983\nAEX,DFW,1005\nAEX,IAH,342\nAGS,ATL,2380\nAGS,CLT,16\nAGS,LGA,7\nAKN,ANC,78\nAKN,DLG,38\nALB,ATL,1154\nALB,BOS,1\nALB,BWI,2297\nALB,CLE,1113\nALB,CLT,956\nALB,CVG,914\nALB,DCA,327\nALB,DTW,1013\nALB,EWR,611\nALB,FLL,60\nALB,JFK,367\nALB,LAS,366\nALB,MCO,1037\nALB,MDW,730\nALB,MSP,57\nALB,ORD,1630\nALB,PHL,449\nALB,SBN,1\nALB,TPA,391\nALO,MSP,323\nAMA,ABQ,366\nAMA,DAL,2669\nAMA,DEN,729\nAMA,DFW,2556\nAMA,IAH,809\nAMA,LAS,366\nAMA,TUL,1\nANC,ADK,102\nANC,ADQ,706\nANC,AKN,116\nANC,ATL,115\nANC,BET,1035\nANC,CDV,362\nANC,CVG,90\nANC,DEN,451\nANC,DFW,153\nANC,DLG,78\nANC,DTW,96\nANC,FAI,3217\nANC,HNL,236\nANC,IAH,207\nANC,JNU,1163\nANC,LAS,237\nANC,LAX,238\nANC,MSP,826\nANC,OGG,27\nANC,OME,365\nANC,ORD,561\nANC,OTZ,725\nANC,PDX,576\nANC,PHX,366\nANC,SCC,363\nANC,SEA,6257\nANC,SFO,181\nANC,SLC,478\nASE,ATL,16\nASE,DEN,3992\nASE,GJT,1\nASE,LAX,334\nASE,MSN,1\nASE,ORD,332\nASE,PHX,109\nASE,RFD,1\nASE,SFO,62\nASE,SLC,459\nATL,ABE,852\nATL,ABQ,1064\nATL,ABY,1095\nATL,ACY,113\nATL,AEX,982\nATL,AGS,2381\nATL,ALB,1153\nATL,ANC,115\nATL,ASE,16\nATL,ATW,742\nATL,AUS,2255\nATL,AVL,1936\nATL,AVP,584\nATL,BDL,2140\nATL,BGR,270\nATL,BHM,2871\nATL,BMI,2509\nATL,BNA,3096\nATL,BOI,41\nATL,BOS,5990\nATL,BQK,924\nATL,BTR,2665\nATL,BTV,500\nATL,BUF,3578\nATL,BWI,5978\nATL,BZN,60\nATL,CAE,2494\nATL,CAK,3902\nATL,CHA,2082\nATL,CHO,786\nATL,CHS,4492\nATL,CID,357\nATL,CLE,2865\nATL,CLT,6720\nATL,CMH,1796\nATL,COS,589\nATL,CRP,5\nATL,CRW,1430\nATL,CSG,1481\nATL,CVG,2810\nATL,DAB,2413\nATL,DAY,4372\nATL,DCA,7289\nATL,DEN,5726\nATL,DFW,9847\nATL,DHN,1397\nATL,DSM,1114\nATL,DTW,5612\nATL,EGE,110\nATL,ELP,575\nATL,EVV,1150\nATL,EWN,791\nATL,EWR,8028\nATL,EYW,974\nATL,FAY,2173\nATL,FCA,25\nATL,FLL,7665\nATL,FLO,614\nATL,FNT,3132\nATL,FSD,135\nATL,FSM,632\nATL,FWA,1028\nATL,GNV,2064\nATL,GPT,3441\nATL,GRB,93\nATL,GRK,642\nATL,GRR,1352\nATL,GSO,2866\nATL,GSP,2450\nATL,GTR,964\nATL,GUC,2\nATL,HDN,107\nATL,HHH,836\nATL,HNL,637\nATL,HOU,3593\nATL,HPN,2155\nATL,HSV,2627\nATL,IAD,5309\nATL,IAH,5268\nATL,ICT,3146\nATL,ILM,1996\nATL,IND,3517\nATL,ISP,214\nATL,JAC,118\nATL,JAN,2694\nATL,JAX,5656\nATL,JFK,1915\nATL,LAS,4766\nATL,LAW,544\nATL,LAX,5406\nATL,LEX,2213\nATL,LFT,995\nATL,LGA,10506\nATL,LIT,2527\nATL,LWB,185\nATL,LYH,625\nATL,MCI,4140\nATL,MCN,652\nATL,MCO,9613\nATL,MDT,1789\nATL,MDW,3256\nATL,MEI,674\nATL,MEM,4866\nATL,MFE,9\nATL,MGM,2513\nATL,MHT,695\nATL,MIA,6628\nATL,MKE,3610\nATL,MLB,2000\nATL,MLI,2590\nATL,MLU,983\nATL,MOB,2224\nATL,MSN,384\nATL,MSP,5368\nATL,MSY,4695\nATL,MTJ,37\nATL,MYR,1853\nATL,OAJ,1178\nATL,OAK,90\nATL,OKC,1883\nATL,OMA,1730\nATL,ONT,796\nATL,ORD,7677\nATL,ORF,2784\nATL,PBI,4263\nATL,PDX,1095\nATL,PFN,2548\nATL,PHF,4158\nATL,PHL,6915\nATL,PHX,4603\nATL,PIA,622\nATL,PIT,4555\nATL,PNS,4429\nATL,PVD,1389\nATL,PWM,904\nATL,RDU,5411\nATL,RIC,4532\nATL,RNO,167\nATL,ROA,1732\nATL,ROC,2489\nATL,RSW,4193\nATL,SAN,2857\nATL,SAT,3239\nATL,SAV,3892\nATL,SBN,1038\nATL,SCE,121\nATL,SDF,2754\nATL,SEA,2574\nATL,SFO,3462\nATL,SGF,1171\nATL,SHV,1816\nATL,SJC,640\nATL,SJU,1874\nATL,SLC,2860\nATL,SMF,682\nATL,SNA,1461\nATL,SRQ,3326\nATL,STL,3958\nATL,STT,451\nATL,STX,67\nATL,SWF,1617\nATL,SYR,1419\nATL,TLH,2484\nATL,TOL,119\nATL,TPA,7311\nATL,TRI,1809\nATL,TUL,1981\nATL,TUP,9\nATL,TUS,668\nATL,TYS,2428\nATL,VLD,938\nATL,VPS,3046\nATL,XNA,1769\nATW,ATL,743\nATW,CHS,1\nATW,CVG,697\nATW,DSM,1\nATW,DTW,1020\nATW,MKE,1032\nATW,MSP,90\nATW,ORD,2288\nATW,XNA,1\nAUS,ABQ,435\nAUS,ATL,2252\nAUS,BNA,792\nAUS,BOS,368\nAUS,BWI,730\nAUS,CLE,380\nAUS,CLT,659\nAUS,CVG,653\nAUS,DAL,5573\nAUS,DEN,2673\nAUS,DFW,5506\nAUS,DSM,1\nAUS,DTW,1\nAUS,ELP,1349\nAUS,EWR,949\nAUS,FLL,481\nAUS,HOU,2319\nAUS,HRL,367\nAUS,IAD,670\nAUS,IAH,3691\nAUS,IND,218\nAUS,JAX,226\nAUS,JFK,1358\nAUS,LAS,1231\nAUS,LAX,1733\nAUS,LBB,692\nAUS,LGB,245\nAUS,MAF,470\nAUS,MCI,459\nAUS,MCO,632\nAUS,MDW,712\nAUS,MEM,834\nAUS,MSP,55\nAUS,MSY,444\nAUS,OAK,236\nAUS,OKC,88\nAUS,ONT,305\nAUS,ORD,2514\nAUS,ORF,1\nAUS,PHL,290\nAUS,PHX,2783\nAUS,RDU,231\nAUS,SAN,719\nAUS,SEA,149\nAUS,SFO,610\nAUS,SJC,968\nAUS,SLC,548\nAUS,SNA,245\nAUS,STL,95\nAUS,TPA,367\nAUS,TUL,88\nAUS,TUS,228\nAVL,ATL,1936\nAVL,CVG,167\nAVL,DTW,768\nAVL,EWR,658\nAVL,IAH,459\nAVL,MCO,47\nAVL,MSP,364\nAVP,ATL,586\nAVP,CVG,356\nAVP,DTW,722\nAVP,HPN,1\nAVP,JFK,2\nAVP,LGA,3\nAVP,ORD,716\nAZO,CVG,148\nAZO,DTW,1177\nAZO,FAR,1\nAZO,MSP,245\nAZO,ORD,2352\nAZO,XNA,1\nBDL,ATL,2141\nBDL,BNA,366\nBDL,BWI,2880\nBDL,CLE,544\nBDL,CLT,1834\nBDL,CVG,1187\nBDL,DCA,1182\nBDL,DEN,214\nBDL,DFW,1065\nBDL,DTW,1516\nBDL,EWR,766\nBDL,FLL,546\nBDL,GRB,1\nBDL,IAD,1397\nBDL,IAH,120\nBDL,IND,585\nBDL,JFK,602\nBDL,LAS,366\nBDL,LAX,132\nBDL,MCO,1755\nBDL,MDW,1028\nBDL,MEM,48\nBDL,MIA,366\nBDL,MKE,536\nBDL,MSP,986\nBDL,ORD,3131\nBDL,PBI,373\nBDL,PHL,521\nBDL,PHX,335\nBDL,RDU,1150\nBDL,RSW,134\nBDL,SJU,366\nBDL,TPA,1276\nBET,ANC,1035\nBFL,DEN,533\nBFL,FAT,1\nBFL,LAS,102\nBFL,LAX,906\nBFL,PHX,1194\nBFL,SAN,225\nBFL,SFO,943\nBFL,SLC,371\nBFL,SMF,227\nBGM,DTW,728\nBGR,ATL,270\nBGR,BOS,793\nBGR,BTV,1\nBGR,CVG,129\nBGR,DTW,801\nBGR,EWR,536\nBGR,JFK,338\nBGR,MSP,11\nBHM,ATL,2876\nBHM,AUS,1\nBHM,BNA,696\nBHM,BWI,1038\nBHM,CLE,264\nBHM,CLT,786\nBHM,CVG,598\nBHM,DAL,1074\nBHM,DEN,666\nBHM,DFW,1287\nBHM,DTW,892\nBHM,EWR,668\nBHM,HOU,723\nBHM,HSV,1\nBHM,IAD,245\nBHM,IAH,2345\nBHM,JAX,366\nBHM,JFK,1\nBHM,LAS,366\nBHM,LGA,840\nBHM,MCO,1196\nBHM,MDW,709\nBHM,MEM,886\nBHM,MKE,1\nBHM,MSY,1008\nBHM,ORD,1497\nBHM,PHX,366\nBHM,RDU,159\nBHM,SDF,679\nBHM,SLC,8\nBHM,STL,366\nBHM,TPA,1071\nBIL,DEN,1628\nBIL,GTF,1\nBIL,MSP,820\nBIL,ORD,103\nBIL,PIH,3\nBIL,SLC,1950\nBIS,DEN,1239\nBIS,MSP,1052\nBIS,RAP,2\nBJI,MSP,74\nBLI,SLC,120\nBMI,ATL,2511\nBMI,DFW,60\nBMI,LAS,50\nBMI,MCO,173\nBMI,ORD,2007\nBNA,ATL,3097\nBNA,AUS,795\nBNA,BDL,365\nBNA,BHM,688\nBNA,BOS,78\nBNA,BWI,2502\nBNA,CID,1\nBNA,CLE,1147\nBNA,CLT,2127\nBNA,CMH,677\nBNA,COS,1\nBNA,CVG,769\nBNA,DCA,1403\nBNA,DEN,2529\nBNA,DFW,2859\nBNA,DTW,2708\nBNA,EWR,1836\nBNA,FLL,738\nBNA,FSD,2\nBNA,HOU,1504\nBNA,IAD,418\nBNA,IAH,2522\nBNA,JAX,1382\nBNA,JFK,523\nBNA,LAS,1202\nBNA,LAX,1400\nBNA,LGA,1216\nBNA,MCI,1302\nBNA,MCO,1798\nBNA,MDW,2993\nBNA,MEM,1020\nBNA,MIA,731\nBNA,MKE,772\nBNA,MSP,785\nBNA,MSY,1012\nBNA,OAK,363\nBNA,ONT,365\nBNA,ORD,3725\nBNA,ORF,236\nBNA,PHL,980\nBNA,PHX,1124\nBNA,PVD,366\nBNA,RDU,1623\nBNA,SAN,721\nBNA,SAT,677\nBNA,SEA,364\nBNA,SLC,115\nBNA,STL,258\nBNA,TPA,1720\nBOI,ATL,41\nBOI,ATW,1\nBOI,DEN,2064\nBOI,GEG,1042\nBOI,GJT,1\nBOI,LAS,756\nBOI,LAX,1001\nBOI,MSP,807\nBOI,OAK,666\nBOI,ONT,471\nBOI,ORD,787\nBOI,PDX,1027\nBOI,PHX,679\nBOI,PIT,1\nBOI,RNO,1029\nBOI,SAN,475\nBOI,SEA,1080\nBOI,SFO,1754\nBOI,SLC,3342\nBOS,ACK,1\nBOS,ATL,5982\nBOS,AUS,368\nBOS,BGR,794\nBOS,BNA,2\nBOS,BTV,1\nBOS,BUF,729\nBOS,BWI,4797\nBOS,CAK,467\nBOS,CHS,156\nBOS,CLE,1362\nBOS,CLT,3533\nBOS,CMH,916\nBOS,CVG,1937\nBOS,DCA,8899\nBOS,DEN,2077\nBOS,DFW,3036\nBOS,DTW,2306\nBOS,EWR,3883\nBOS,FLL,2476\nBOS,GGG,1\nBOS,GSO,141\nBOS,IAD,4184\nBOS,IAH,1800\nBOS,IND,950\nBOS,JAX,647\nBOS,JFK,7372\nBOS,LAS,1383\nBOS,LAX,2234\nBOS,LGA,12029\nBOS,LGB,788\nBOS,MCO,3474\nBOS,MDW,344\nBOS,MEM,200\nBOS,MIA,2196\nBOS,MKE,209\nBOS,MSP,1635\nBOS,MSY,254\nBOS,MYR,45\nBOS,OAK,516\nBOS,ORD,7085\nBOS,ORF,243\nBOS,PBI,1743\nBOS,PDX,366\nBOS,PHF,715\nBOS,PHL,6375\nBOS,PHX,1069\nBOS,PIT,591\nBOS,RDU,3777\nBOS,RIC,689\nBOS,RSW,1716\nBOS,SAN,608\nBOS,SAV,89\nBOS,SDF,80\nBOS,SEA,979\nBOS,SFO,2668\nBOS,SJC,256\nBOS,SJU,1274\nBOS,SLC,707\nBOS,SRQ,23\nBOS,STL,865\nBOS,STT,88\nBOS,TPA,1785\nBPT,IAH,276\nBQK,ATL,925\nBQN,EWR,366\nBQN,JFK,661\nBQN,MCO,492\nBRO,IAH,1464\nBRW,ANC,364\nBRW,FAI,364\nBTM,SLC,708\nBTR,ATL,2663\nBTR,CVG,2\nBTR,DCA,129\nBTR,DEN,1\nBTR,DFW,2922\nBTR,IAH,2009\nBTR,MEM,999\nBTR,MSY,1\nBTR,ORD,215\nBTV,ATL,500\nBTV,BWI,538\nBTV,CLE,614\nBTV,CVG,153\nBTV,DTW,826\nBTV,EWR,879\nBTV,IAD,129\nBTV,IND,1\nBTV,JFK,2207\nBTV,MCO,346\nBTV,MSP,75\nBTV,ORD,737\nBUF,ATL,3575\nBUF,BOS,728\nBUF,BWI,2439\nBUF,CLE,633\nBUF,CLT,1435\nBUF,CVG,160\nBUF,DCA,312\nBUF,DFW,93\nBUF,DTW,1510\nBUF,EWR,1469\nBUF,FLL,672\nBUF,IAD,16\nBUF,JFK,3679\nBUF,LAS,589\nBUF,MCO,1876\nBUF,MDW,1276\nBUF,MSP,227\nBUF,ORD,3437\nBUF,PHL,685\nBUF,PHX,365\nBUF,RSW,376\nBUF,TPA,729\nBUR,DEN,944\nBUR,DFW,1376\nBUR,IAD,163\nBUR,JFK,1366\nBUR,LAS,5162\nBUR,OAK,5423\nBUR,PDX,60\nBUR,PHX,4751\nBUR,PMD,1\nBUR,PSP,1\nBUR,RNO,1\nBUR,SEA,1390\nBUR,SFO,2258\nBUR,SJC,3377\nBUR,SLC,1673\nBUR,SMF,3458\nBUR,TUS,1\nBWI,ABQ,549\nBWI,ALB,2296\nBWI,ATL,5972\nBWI,AUS,728\nBWI,BDL,2863\nBWI,BHM,1037\nBWI,BNA,2492\nBWI,BOS,4795\nBWI,BTV,539\nBWI,BUF,2437\nBWI,CLE,2543\nBWI,CLT,3652\nBWI,CMH,1683\nBWI,CVG,1228\nBWI,DAB,32\nBWI,DAY,982\nBWI,DEN,2664\nBWI,DFW,2311\nBWI,DTW,3105\nBWI,EWR,507\nBWI,FLL,2710\nBWI,GRR,1\nBWI,HOU,1262\nBWI,IAH,1728\nBWI,IND,1016\nBWI,ISP,2427\nBWI,JAN,664\nBWI,JAX,1058\nBWI,JFK,1134\nBWI,LAS,1626\nBWI,LAX,898\nBWI,LGA,7\nBWI,LIT,366\nBWI,MCI,1025\nBWI,MCO,4926\nBWI,MDW,2809\nBWI,MEM,827\nBWI,MHT,3633\nBWI,MIA,929\nBWI,MKE,1290\nBWI,MSP,974\nBWI,MSY,392\nBWI,OKC,366\nBWI,ORD,3545\nBWI,ORF,1683\nBWI,PBI,1351\nBWI,PHL,692\nBWI,PHX,2098\nBWI,PIT,1064\nBWI,PVD,3988\nBWI,PWM,995\nBWI,RDU,2082\nBWI,ROC,863\nBWI,RSW,1336\nBWI,SAN,721\nBWI,SAT,729\nBWI,SAV,1\nBWI,SDF,1474\nBWI,SEA,242\nBWI,SFO,366\nBWI,SJU,319\nBWI,SLC,727\nBWI,SRQ,245\nBWI,STL,1682\nBWI,TPA,3388\nBZN,ATL,60\nBZN,BTM,1\nBZN,DEN,1293\nBZN,DTW,19\nBZN,IDA,1\nBZN,LAX,13\nBZN,MSP,878\nBZN,ORD,337\nBZN,SFO,28\nBZN,SLC,2029\nCAE,ATL,2508\nCAE,CVG,927\nCAE,DFW,1157\nCAE,DTW,713\nCAE,EWR,684\nCAE,IAD,1386\nCAE,IAH,164\nCAE,LGA,609\nCAE,MEM,706\nCAE,ORD,1696\nCAK,ATL,3905\nCAK,BOS,467\nCAK,CVG,40\nCAK,DEN,779\nCAK,DTW,1044\nCAK,FLL,8\nCAK,LAS,42\nCAK,LGA,793\nCAK,MCO,371\nCAK,ORD,1049\nCAK,RSW,137\nCAK,TPA,359\nCDC,LAX,1\nCDC,SGU,1\nCDC,SLC,666\nCDV,ANC,363\nCDV,YAK,362\nCEC,ACV,360\nCEC,SFO,703\nCHA,ATL,2086\nCHA,CVG,132\nCHA,DFW,426\nCHA,DTW,72\nCHA,IAH,459\nCHA,MEM,630\nCHA,ORD,766\nCHO,ATL,786\nCHO,CVG,36\nCHO,DCA,1\nCHS,ATL,4494\nCHS,BOS,156\nCHS,CLE,150\nCHS,CLT,1121\nCHS,CVG,786\nCHS,DFW,1155\nCHS,DTW,756\nCHS,EWR,1284\nCHS,IAD,712\nCHS,IAH,73\nCHS,JAX,2\nCHS,LGA,1413\nCHS,MEM,714\nCHS,MSP,27\nCHS,ORD,1337\nCHS,SAV,1\nCIC,FAT,1\nCIC,MRY,1\nCIC,SFO,1390\nCID,ATL,357\nCID,CVG,874\nCID,DEN,798\nCID,DFW,1897\nCID,DSM,1\nCID,DTW,946\nCID,LGA,156\nCID,MKE,1\nCID,MSP,416\nCID,ORD,3931\nCLD,LAX,2259\nCLD,PHX,44\nCLE,ABE,805\nCLE,ABQ,12\nCLE,ALB,1106\nCLE,ATL,3115\nCLE,AUS,380\nCLE,BDL,516\nCLE,BHM,264\nCLE,BNA,1128\nCLE,BOS,1354\nCLE,BTV,613\nCLE,BUF,620\nCLE,BWI,2562\nCLE,CHS,150\nCLE,CLT,1981\nCLE,CMH,17\nCLE,CVG,493\nCLE,DAB,12\nCLE,DAY,869\nCLE,DCA,934\nCLE,DEN,976\nCLE,DFW,1656\nCLE,DSM,139\nCLE,DTW,1359\nCLE,EWR,2105\nCLE,FLL,618\nCLE,GRR,1136\nCLE,GSO,148\nCLE,GSP,510\nCLE,IAD,1433\nCLE,IAH,2151\nCLE,IND,142\nCLE,JAX,143\nCLE,JFK,1392\nCLE,LAS,1656\nCLE,LAX,1050\nCLE,LEX,15\nCLE,LGA,2936\nCLE,MCI,1230\nCLE,MCO,1915\nCLE,MDT,58\nCLE,MDW,2561\nCLE,MEM,1211\nCLE,MHT,1235\nCLE,MIA,399\nCLE,MKE,2226\nCLE,MSN,317\nCLE,MSP,1693\nCLE,MSY,54\nCLE,OKC,32\nCLE,OMA,430\nCLE,ORD,4569\nCLE,ORF,2\nCLE,PBI,383\nCLE,PHL,674\nCLE,PHX,1110\nCLE,PVD,360\nCLE,PWM,306\nCLE,RDU,319\nCLE,RIC,905\nCLE,ROC,928\nCLE,RSW,595\nCLE,SAN,85\nCLE,SAT,232\nCLE,SAV,321\nCLE,SDF,679\nCLE,SEA,231\nCLE,SFO,466\nCLE,SJU,43\nCLE,SLC,346\nCLE,SRQ,118\nCLE,STL,1191\nCLE,SYR,696\nCLE,TPA,874\nCLE,TUL,10\nCLE,TYS,495\nCLL,DFW,1105\nCLL,IAH,262\nCLT,ABE,465\nCLT,AGS,17\nCLT,ALB,978\nCLT,ATL,6722\nCLT,ATW,1\nCLT,AUS,660\nCLT,BDL,1834\nCLT,BHM,787\nCLT,BNA,2126\nCLT,BOS,3551\nCLT,BUF,1434\nCLT,BWI,3684\nCLT,CHS,1122\nCLT,CLE,1971\nCLT,CMH,125\nCLT,CVG,877\nCLT,DAB,23\nCLT,DCA,2988\nCLT,DEN,1925\nCLT,DFW,3796\nCLT,DTW,2701\nCLT,EGE,13\nCLT,EWR,5953\nCLT,FAY,95\nCLT,FLL,3295\nCLT,GRR,1\nCLT,GSO,985\nCLT,HSV,13\nCLT,IAD,3126\nCLT,IAH,3711\nCLT,ILM,1257\nCLT,IND,1230\nCLT,JAX,2524\nCLT,JFK,1866\nCLT,LAS,1734\nCLT,LAX,1458\nCLT,LGA,5339\nCLT,LIT,39\nCLT,MCI,1183\nCLT,MCO,3277\nCLT,MDT,1144\nCLT,MDW,13\nCLT,MEM,2578\nCLT,MHT,705\nCLT,MIA,2970\nCLT,MKE,243\nCLT,MSP,1816\nCLT,MSY,1466\nCLT,MYR,2217\nCLT,OAJ,6\nCLT,ORD,5639\nCLT,ORF,1543\nCLT,PBI,1873\nCLT,PDX,136\nCLT,PHL,3525\nCLT,PHX,2186\nCLT,PIT,2349\nCLT,PNS,371\nCLT,PVD,1439\nCLT,PWM,276\nCLT,RDU,2340\nCLT,RIC,1801\nCLT,ROC,412\nCLT,RSW,1765\nCLT,SAN,704\nCLT,SAT,661\nCLT,SAV,1432\nCLT,SDF,796\nCLT,SEA,481\nCLT,SFO,1427\nCLT,SJU,796\nCLT,SLC,212\nCLT,SMF,76\nCLT,SRQ,207\nCLT,STL,1094\nCLT,STT,418\nCLT,STX,20\nCLT,SYR,747\nCLT,TLH,240\nCLT,TPA,2811\nCLT,TRI,16\nCLT,TUS,208\nCMH,ATL,1808\nCMH,BNA,685\nCMH,BOS,661\nCMH,BWI,1681\nCMH,CLE,24\nCMH,CLT,125\nCMH,CVG,1185\nCMH,DCA,77\nCMH,DEN,385\nCMH,DFW,1694\nCMH,DTW,1909\nCMH,EWR,1646\nCMH,GRB,1\nCMH,GRR,1\nCMH,IAH,841\nCMH,ICT,1\nCMH,JFK,515\nCMH,LAS,1341\nCMH,LAX,48\nCMH,LGA,2355\nCMH,MCI,164\nCMH,MCO,1074\nCMH,MDW,2643\nCMH,MEM,1057\nCMH,MIA,469\nCMH,MKE,1054\nCMH,MSP,1076\nCMH,OMA,1\nCMH,ORD,4959\nCMH,PBI,5\nCMH,PHL,996\nCMH,PHX,1096\nCMH,RDU,500\nCMH,RSW,137\nCMH,SLC,291\nCMH,STL,679\nCMH,SYR,1\nCMH,TPA,972\nCMI,ABI,1\nCMI,DFW,366\nCMI,ORD,2406\nCMI,SPI,1\nCMX,MSP,318\nCOD,DEN,481\nCOD,SLC,707\nCOS,ABQ,1\nCOS,ATL,591\nCOS,CLE,1\nCOS,CVG,104\nCOS,DEN,4193\nCOS,DFW,2036\nCOS,FAT,1\nCOS,IAH,1725\nCOS,LAN,1\nCOS,LAS,98\nCOS,LAX,997\nCOS,MCI,179\nCOS,MEM,117\nCOS,MKE,1\nCOS,MSP,450\nCOS,ONT,460\nCOS,ORD,1519\nCOS,PHX,1393\nCOS,SAN,472\nCOS,SFO,364\nCOS,SLC,1074\nCOS,SMF,424\nCPR,DEN,1536\nCPR,MSP,32\nCPR,ORD,134\nCPR,PIH,1\nCPR,SLC,1006\nCRP,ATL,6\nCRP,DFW,2510\nCRP,HOU,1933\nCRP,IAH,821\nCRW,ATL,1430\nCRW,BNA,1\nCRW,CVG,391\nCRW,DTW,208\nCRW,IAH,674\nCRW,LEX,1\nCRW,ORD,709\nCSG,ATL,1481\nCVG,ABE,248\nCVG,ABQ,260\nCVG,ALB,912\nCVG,ANC,90\nCVG,ATL,2758\nCVG,ATW,697\nCVG,AUS,653\nCVG,AVL,167\nCVG,AVP,357\nCVG,AZO,149\nCVG,BDL,1157\nCVG,BGR,127\nCVG,BHM,852\nCVG,BNA,902\nCVG,BOS,1859\nCVG,BTR,2\nCVG,BTV,152\nCVG,BUF,160\nCVG,BWI,1235\nCVG,CAE,942\nCVG,CAK,39\nCVG,CHA,132\nCVG,CHO,35\nCVG,CHS,786\nCVG,CID,873\nCVG,CLE,493\nCVG,CLT,926\nCVG,CMH,795\nCVG,COS,104\nCVG,CRW,391\nCVG,DAB,6\nCVG,DAY,746\nCVG,DCA,2015\nCVG,DEN,1384\nCVG,DFW,3244\nCVG,DSM,983\nCVG,DTW,3023\nCVG,EGE,30\nCVG,EVV,135\nCVG,EWR,3094\nCVG,FLL,683\nCVG,FSD,555\nCVG,GRB,447\nCVG,GRR,1386\nCVG,GSO,1057\nCVG,GSP,456\nCVG,HPN,126\nCVG,HSV,800\nCVG,HTS,159\nCVG,IAD,783\nCVG,IAH,2048\nCVG,ILM,140\nCVG,IND,491\nCVG,JAC,13\nCVG,JAN,120\nCVG,JAX,1125\nCVG,JFK,1532\nCVG,LAN,485\nCVG,LAS,921\nCVG,LAX,1143\nCVG,LEX,1525\nCVG,LGA,3645\nCVG,LIT,49\nCVG,MCI,1491\nCVG,MCO,1305\nCVG,MDT,1007\nCVG,MEM,1226\nCVG,MHT,776\nCVG,MIA,1045\nCVG,MKE,839\nCVG,MSN,259\nCVG,MSP,1745\nCVG,MSY,195\nCVG,MYR,13\nCVG,OKC,769\nCVG,OMA,1003\nCVG,ORD,6014\nCVG,ORF,450\nCVG,PBI,389\nCVG,PDX,318\nCVG,PFN,36\nCVG,PHL,1671\nCVG,PHX,468\nCVG,PIT,1292\nCVG,PVD,958\nCVG,PWM,555\nCVG,RDU,1087\nCVG,RIC,786\nCVG,ROA,1\nCVG,ROC,730\nCVG,RSW,539\nCVG,SAN,571\nCVG,SAT,882\nCVG,SAV,732\nCVG,SBN,12\nCVG,SCE,23\nCVG,SDF,635\nCVG,SEA,790\nCVG,SFO,777\nCVG,SGF,245\nCVG,SLC,1627\nCVG,SNA,285\nCVG,SRQ,444\nCVG,STL,345\nCVG,SYR,831\nCVG,TOL,20\nCVG,TPA,1099\nCVG,TRI,247\nCVG,TUL,882\nCVG,TVC,129\nCVG,TYS,916\nCVG,VPS,103\nCVG,XNA,101\nCWA,DTW,549\nCWA,MKE,285\nCWA,MLI,1\nCWA,MSP,13\nCWA,ORD,1715\nDAB,ATL,2412\nDAB,BWI,32\nDAB,CLE,12\nDAB,CLT,23\nDAB,CVG,6\nDAB,EWR,311\nDAB,JAX,1\nDAB,LGA,159\nDAB,MCO,1\nDAL,ABQ,3106\nDAL,AMA,2665\nDAL,AUS,5583\nDAL,BHM,1051\nDAL,ELP,2282\nDAL,HOU,9790\nDAL,HRL,33\nDAL,IAH,3730\nDAL,LBB,2680\nDAL,LIT,2330\nDAL,MAF,1997\nDAL,MCI,3922\nDAL,MSY,2096\nDAL,OKC,1686\nDAL,ORD,1005\nDAL,SAT,4973\nDAL,STL,2722\nDAL,TUL,2277\nDAY,ATL,4369\nDAY,BWI,980\nDAY,CLE,862\nDAY,CVG,755\nDAY,DEN,838\nDAY,DFW,1037\nDAY,DTW,1322\nDAY,EWR,948\nDAY,IAD,53\nDAY,IAH,864\nDAY,LAS,43\nDAY,MCO,416\nDAY,MKE,609\nDAY,MSP,692\nDAY,ORD,1799\nDAY,TPA,204\nDBQ,ORD,1349\nDCA,ALB,304\nDCA,ATL,7296\nDCA,BDL,1183\nDCA,BNA,1401\nDCA,BOS,8929\nDCA,BTR,129\nDCA,BUF,632\nDCA,CLE,935\nDCA,CLT,3001\nDCA,CMH,77\nDCA,CVG,1841\nDCA,DEN,1429\nDCA,DFW,3965\nDCA,DSM,272\nDCA,DTW,2982\nDCA,EWR,2289\nDCA,FLL,1361\nDCA,GRR,307\nDCA,HSV,561\nDCA,IAH,2919\nDCA,IND,968\nDCA,JAN,304\nDCA,JAX,888\nDCA,JFK,3017\nDCA,LAS,365\nDCA,LAX,366\nDCA,LEX,311\nDCA,LGA,11102\nDCA,MCO,1845\nDCA,MEM,1043\nDCA,MHT,306\nDCA,MIA,2987\nDCA,MKE,122\nDCA,MSN,287\nDCA,MSP,2199\nDCA,MSY,408\nDCA,ORD,7427\nDCA,PBI,909\nDCA,PHL,5\nDCA,PHX,1081\nDCA,PIT,322\nDCA,PLN,1\nDCA,PVD,671\nDCA,RDU,2732\nDCA,RSW,706\nDCA,SEA,727\nDCA,SLC,365\nDCA,SRQ,12\nDCA,STL,1296\nDCA,SYR,313\nDCA,TPA,1554\nDCA,XNA,210\nDEN,ABQ,4309\nDEN,AMA,731\nDEN,ANC,451\nDEN,ASE,3979\nDEN,ATL,5903\nDEN,AUS,2719\nDEN,BDL,213\nDEN,BFL,533\nDEN,BHM,651\nDEN,BIL,1631\nDEN,BIS,1240\nDEN,BNA,2556\nDEN,BOI,2069\nDEN,BOS,2234\nDEN,BTR,1\nDEN,BUR,1238\nDEN,BWI,2655\nDEN,BZN,1286\nDEN,CAK,780\nDEN,CID,572\nDEN,CLE,969\nDEN,CLT,1925\nDEN,CMH,685\nDEN,COD,481\nDEN,COS,4188\nDEN,CPR,1533\nDEN,CRW,1\nDEN,CVG,1384\nDEN,CYS,1\nDEN,DAY,850\nDEN,DCA,1428\nDEN,DFW,8268\nDEN,DRO,2473\nDEN,DSM,1404\nDEN,DTW,2913\nDEN,EGE,1673\nDEN,ELP,1060\nDEN,EUG,726\nDEN,EWR,2189\nDEN,FAR,1246\nDEN,FAT,1266\nDEN,FCA,668\nDEN,FLL,908\nDEN,FSD,1474\nDEN,GCC,695\nDEN,GEG,1440\nDEN,GJT,2469\nDEN,GRB,2\nDEN,GRR,343\nDEN,GTF,868\nDEN,GUC,832\nDEN,HDN,1310\nDEN,HLN,414\nDEN,HNL,367\nDEN,HOU,1056\nDEN,HSV,654\nDEN,IAD,2943\nDEN,IAH,4788\nDEN,ICT,1583\nDEN,IDA,979\nDEN,IND,2083\nDEN,JAC,1340\nDEN,JAX,118\nDEN,JFK,1084\nDEN,KOA,45\nDEN,LAS,8147\nDEN,LAX,8811\nDEN,LGA,3051\nDEN,LIH,45\nDEN,LIT,121\nDEN,LNK,1200\nDEN,MBS,1\nDEN,MCI,5111\nDEN,MCO,3015\nDEN,MDW,4338\nDEN,MEM,1730\nDEN,MFR,365\nDEN,MIA,810\nDEN,MKE,1587\nDEN,MLI,723\nDEN,MRY,363\nDEN,MSN,1003\nDEN,MSO,1108\nDEN,MSP,5011\nDEN,MSY,1174\nDEN,MTJ,1592\nDEN,OAK,3100\nDEN,OGG,163\nDEN,OKC,2636\nDEN,OMA,3169\nDEN,ONT,1544\nDEN,ORD,6051\nDEN,PBI,94\nDEN,PDX,4563\nDEN,PHL,2975\nDEN,PHX,8391\nDEN,PIA,363\nDEN,PIH,1\nDEN,PIT,804\nDEN,PSC,939\nDEN,PSP,997\nDEN,RAP,2308\nDEN,RDM,12\nDEN,RDU,470\nDEN,RFD,289\nDEN,RKS,545\nDEN,RNO,1350\nDEN,ROC,1\nDEN,RSW,221\nDEN,SAN,5358\nDEN,SAT,2651\nDEN,SBA,841\nDEN,SDF,384\nDEN,SEA,6414\nDEN,SFO,5604\nDEN,SGF,953\nDEN,SJC,3684\nDEN,SLC,8905\nDEN,SMF,3331\nDEN,SNA,3340\nDEN,STL,2126\nDEN,TPA,1682\nDEN,TUL,1628\nDEN,TUS,2089\nDEN,TVC,88\nDEN,TYS,510\nDEN,XNA,686\nDFW,ABI,2660\nDFW,ABQ,2888\nDFW,ACT,1994\nDFW,AEX,1003\nDFW,AMA,2551\nDFW,ANC,153\nDFW,ATL,9849\nDFW,AUS,5508\nDFW,BDL,1065\nDFW,BHM,1287\nDFW,BMI,60\nDFW,BNA,2861\nDFW,BOS,3036\nDFW,BTR,2919\nDFW,BUF,93\nDFW,BUR,1375\nDFW,BWI,2309\nDFW,CAE,1157\nDFW,CHA,426\nDFW,CHS,1154\nDFW,CID,1897\nDFW,CLE,1665\nDFW,CLL,1104\nDFW,CLT,3797\nDFW,CMH,1694\nDFW,CMI,366\nDFW,COS,2034\nDFW,CRP,2509\nDFW,CVG,3244\nDFW,DAY,1038\nDFW,DCA,3965\nDFW,DEN,8193\nDFW,DSM,2134\nDFW,DTW,2792\nDFW,EGE,457\nDFW,ELP,2900\nDFW,EVV,365\nDFW,EWR,3728\nDFW,FAT,730\nDFW,FLL,2296\nDFW,FNT,245\nDFW,FSM,1825\nDFW,FWA,713\nDFW,GGG,971\nDFW,GJT,600\nDFW,GPT,1155\nDFW,GRK,2562\nDFW,GRR,793\nDFW,GSO,1037\nDFW,GSP,1435\nDFW,GUC,109\nDFW,HDN,126\nDFW,HNL,732\nDFW,HOU,2425\nDFW,HSV,1714\nDFW,IAD,2010\nDFW,IAH,5526\nDFW,ICT,1792\nDFW,IND,2086\nDFW,JAC,213\nDFW,JAN,2604\nDFW,JAX,1366\nDFW,JFK,833\nDFW,LAS,4956\nDFW,LAW,1822\nDFW,LAX,6571\nDFW,LBB,3012\nDFW,LEX,908\nDFW,LFT,1181\nDFW,LGA,5365\nDFW,LIT,3245\nDFW,LRD,1400\nDFW,MAF,1777\nDFW,MCI,2878\nDFW,MCO,4114\nDFW,MDT,272\nDFW,MEM,2501\nDFW,MFE,1439\nDFW,MIA,3350\nDFW,MKE,745\nDFW,MLI,588\nDFW,MLU,964\nDFW,MOB,1398\nDFW,MSN,946\nDFW,MSP,2810\nDFW,MSY,2501\nDFW,MTJ,231\nDFW,OAK,724\nDFW,OGG,366\nDFW,OKC,2846\nDFW,OMA,1747\nDFW,ONT,1741\nDFW,ORD,8165\nDFW,ORF,1035\nDFW,PBI,853\nDFW,PDX,1578\nDFW,PHL,3483\nDFW,PHX,5388\nDFW,PIA,635\nDFW,PIT,2140\nDFW,PNS,2020\nDFW,PSP,1095\nDFW,RDU,2347\nDFW,RIC,1041\nDFW,RNO,1093\nDFW,ROC,176\nDFW,ROW,961\nDFW,RSW,918\nDFW,SAN,3526\nDFW,SAT,5414\nDFW,SAV,795\nDFW,SBA,365\nDFW,SDF,1386\nDFW,SEA,3915\nDFW,SFO,3486\nDFW,SGF,3231\nDFW,SHV,3579\nDFW,SJC,2250\nDFW,SJT,1315\nDFW,SJU,985\nDFW,SLC,3143\nDFW,SMF,1346\nDFW,SNA,3669\nDFW,SPS,1831\nDFW,STL,3598\nDFW,SYR,178\nDFW,TPA,2803\nDFW,TUL,3256\nDFW,TUS,2677\nDFW,TXK,1247\nDFW,TYR,1585\nDFW,TYS,1505\nDFW,VPS,1962\nDFW,XNA,2780\nDHN,ATL,1397\nDLG,ANC,116\nDLH,DTW,721\nDLH,MSP,1292\nDRO,ABQ,1\nDRO,DEN,2475\nDRO,PHX,812\nDRO,SLC,386\nDSM,ATL,1115\nDSM,CLE,139\nDSM,CVG,982\nDSM,CWA,1\nDSM,DCA,272\nDSM,DEN,1704\nDSM,DFW,2137\nDSM,DTW,956\nDSM,GJT,2\nDSM,IAH,688\nDSM,LAX,175\nDSM,LGA,707\nDSM,LNK,1\nDSM,MEM,751\nDSM,MKE,722\nDSM,MSP,1012\nDSM,ORD,4525\nDSM,ORF,1\nDSM,PHX,749\nDSM,RFD,1\nDSM,SLC,3\nDTW,ABE,997\nDTW,ALB,1013\nDTW,ANC,96\nDTW,ATL,5612\nDTW,ATW,1021\nDTW,AVL,768\nDTW,AVP,722\nDTW,AZO,1176\nDTW,BDL,1565\nDTW,BGM,728\nDTW,BGR,801\nDTW,BHM,887\nDTW,BNA,2712\nDTW,BOS,2377\nDTW,BTV,826\nDTW,BUF,1508\nDTW,BWI,3101\nDTW,BZN,19\nDTW,CAE,713\nDTW,CAK,1044\nDTW,CHA,73\nDTW,CHS,761\nDTW,CID,948\nDTW,CLE,1182\nDTW,CLT,2703\nDTW,CMH,1894\nDTW,CRW,208\nDTW,CVG,3099\nDTW,CWA,549\nDTW,DAY,1322\nDTW,DCA,2986\nDTW,DEN,2919\nDTW,DFW,2799\nDTW,DLH,722\nDTW,DSM,977\nDTW,ELM,1336\nDTW,ERI,1398\nDTW,EVV,1342\nDTW,EWR,4374\nDTW,FLL,1321\nDTW,FNT,1519\nDTW,FWA,1202\nDTW,GRB,1245\nDTW,GRR,2527\nDTW,GSO,1245\nDTW,GSP,1239\nDTW,HPN,666\nDTW,HSV,698\nDTW,IAD,1708\nDTW,IAH,2740\nDTW,ICT,242\nDTW,IND,2605\nDTW,ITH,133\nDTW,JAN,682\nDTW,JAX,507\nDTW,JFK,1754\nDTW,LAN,1642\nDTW,LAS,2038\nDTW,LAX,1608\nDTW,LEX,1658\nDTW,LGA,4594\nDTW,LIT,362\nDTW,LNK,320\nDTW,MBS,1468\nDTW,MCI,1438\nDTW,MCO,3481\nDTW,MDT,543\nDTW,MDW,3179\nDTW,MEM,2562\nDTW,MHT,844\nDTW,MIA,1227\nDTW,MKE,1742\nDTW,MLI,745\nDTW,MSN,1603\nDTW,MSP,4947\nDTW,MSY,68\nDTW,MYR,287\nDTW,OKC,622\nDTW,OMA,1324\nDTW,ORD,7553\nDTW,ORF,968\nDTW,PBI,472\nDTW,PDX,250\nDTW,PHL,2791\nDTW,PHX,2928\nDTW,PIA,701\nDTW,PIT,1558\nDTW,PLN,263\nDTW,PVD,1105\nDTW,PWM,66\nDTW,RDU,1368\nDTW,RIC,700\nDTW,ROA,748\nDTW,ROC,864\nDTW,RST,105\nDTW,RSW,1144\nDTW,SAN,583\nDTW,SAT,597\nDTW,SAV,508\nDTW,SBN,1638\nDTW,SCE,500\nDTW,SDF,1082\nDTW,SEA,1172\nDTW,SFO,1235\nDTW,SGF,363\nDTW,SHV,360\nDTW,SJU,155\nDTW,SLC,572\nDTW,SRQ,219\nDTW,STL,2516\nDTW,STT,16\nDTW,SWF,724\nDTW,SYR,1015\nDTW,TPA,1452\nDTW,TUL,726\nDTW,TVC,1209\nDTW,TYS,1788\nDTW,XNA,362\nEGE,ATL,109\nEGE,CLT,13\nEGE,CVG,30\nEGE,DEN,1674\nEGE,DFW,457\nEGE,EWR,207\nEGE,IAH,124\nEGE,JFK,13\nEGE,LAX,111\nEGE,LGA,16\nEGE,MIA,43\nEGE,MSP,112\nEGE,ORD,197\nEKO,SLC,1577\nEKO,TWF,3\nELM,DTW,1336\nELP,ABQ,792\nELP,ATL,575\nELP,AUS,1344\nELP,DAL,2290\nELP,DEN,1060\nELP,DFW,2901\nELP,HOU,1033\nELP,IAH,1136\nELP,LAS,1056\nELP,LAX,1075\nELP,LBB,362\nELP,ONT,381\nELP,ORD,670\nELP,PHX,4136\nELP,SAN,366\nELP,SAT,1344\nELP,SLC,121\nELP,TUS,89\nERI,DTW,1398\nERI,PIT,1\nEUG,DEN,726\nEUG,FAT,1\nEUG,LAS,162\nEUG,LAX,305\nEUG,MFR,1\nEUG,PDX,1551\nEUG,PHX,372\nEUG,RDM,1\nEUG,SFO,1919\nEUG,SLC,711\nEVV,ATL,1151\nEVV,CVG,136\nEVV,DFW,366\nEVV,DTW,1342\nEVV,MEM,904\nEVV,ORD,1944\nEVV,STL,1\nEWN,ATL,791\nEWR,ABQ,166\nEWR,ACK,234\nEWR,ALB,619\nEWR,ATL,8060\nEWR,AUS,939\nEWR,AVL,658\nEWR,BDL,793\nEWR,BGR,536\nEWR,BHM,681\nEWR,BNA,1812\nEWR,BOS,3870\nEWR,BQN,366\nEWR,BTV,879\nEWR,BUF,1481\nEWR,BWI,508\nEWR,CAE,684\nEWR,CHS,1285\nEWR,CLE,2103\nEWR,CLT,5945\nEWR,CMH,1653\nEWR,CVG,3095\nEWR,DAB,311\nEWR,DAY,946\nEWR,DCA,2269\nEWR,DEN,2209\nEWR,DFW,3729\nEWR,DTW,4419\nEWR,EGE,207\nEWR,FLL,4432\nEWR,GRB,1\nEWR,GRR,593\nEWR,GSO,1092\nEWR,GSP,1036\nEWR,HDN,15\nEWR,HNL,362\nEWR,IAD,1789\nEWR,IAH,3989\nEWR,IND,1722\nEWR,JAN,121\nEWR,JAX,1596\nEWR,LAS,2350\nEWR,LAX,3239\nEWR,LEX,389\nEWR,LGA,1\nEWR,LIT,323\nEWR,MCI,1798\nEWR,MCO,4978\nEWR,MDW,279\nEWR,MEM,1192\nEWR,MHT,1331\nEWR,MIA,2873\nEWR,MKE,2523\nEWR,MSN,313\nEWR,MSP,3103\nEWR,MSY,1139\nEWR,MTJ,21\nEWR,MYR,234\nEWR,OKC,360\nEWR,OMA,1079\nEWR,ORD,7505\nEWR,ORF,379\nEWR,PBI,2769\nEWR,PDX,687\nEWR,PHL,19\nEWR,PHX,2601\nEWR,PIT,677\nEWR,PSE,16\nEWR,PVD,1101\nEWR,PWM,740\nEWR,RDU,2391\nEWR,RIC,1576\nEWR,ROC,925\nEWR,RSW,1873\nEWR,SAN,1179\nEWR,SAT,949\nEWR,SAV,1127\nEWR,SDF,1052\nEWR,SEA,2030\nEWR,SFO,2777\nEWR,SJC,200\nEWR,SJU,1580\nEWR,SLC,812\nEWR,SNA,908\nEWR,SRQ,399\nEWR,STL,1707\nEWR,STT,232\nEWR,SYR,993\nEWR,TPA,2838\nEWR,TUL,343\nEWR,TUS,186\nEWR,TYS,660\nEWR,XNA,545\nEYW,ATL,974\nEYW,MCO,35\nFAI,ANC,2853\nFAI,BRW,364\nFAI,MSP,205\nFAI,SCC,364\nFAI,SEA,956\nFAI,SLC,80\nFAR,DEN,1263\nFAR,LAN,1\nFAR,MCI,1\nFAR,MSP,1743\nFAR,ORD,1327\nFAR,SLC,95\nFAR,STL,1\nFAT,DEN,1265\nFAT,DFW,730\nFAT,LAS,2092\nFAT,LAX,4022\nFAT,LGB,435\nFAT,MRY,2\nFAT,OGD,1\nFAT,ONT,239\nFAT,PHX,1625\nFAT,SAN,581\nFAT,SBA,2\nFAT,SFO,2438\nFAT,SLC,845\nFAT,TWF,1\nFAY,ATL,2172\nFAY,CLT,95\nFCA,ATL,25\nFCA,DEN,668\nFCA,IDA,2\nFCA,MSP,210\nFCA,ORD,104\nFCA,SFO,12\nFCA,SLC,1741\nFLG,PHX,1871\nFLL,ALB,60\nFLL,ATL,7666\nFLL,AUS,481\nFLL,BDL,545\nFLL,BNA,740\nFLL,BOS,2473\nFLL,BUF,672\nFLL,BWI,2704\nFLL,CAK,8\nFLL,CLE,618\nFLL,CLT,2947\nFLL,CVG,687\nFLL,DCA,1339\nFLL,DEN,903\nFLL,DFW,2298\nFLL,DTW,1320\nFLL,EWR,4431\nFLL,GPT,366\nFLL,HOU,722\nFLL,HPN,1022\nFLL,IAD,1176\nFLL,IAH,1933\nFLL,IND,578\nFLL,ISP,1092\nFLL,JAX,1812\nFLL,JFK,4699\nFLL,LAS,677\nFLL,LAX,372\nFLL,LGA,3149\nFLL,LGB,332\nFLL,MCI,60\nFLL,MCO,2095\nFLL,MDW,1622\nFLL,MEM,480\nFLL,MHT,245\nFLL,MIA,1\nFLL,MKE,43\nFLL,MSP,475\nFLL,MSY,593\nFLL,OAK,13\nFLL,ORD,1581\nFLL,PHF,309\nFLL,PHL,2977\nFLL,PHX,622\nFLL,PIT,872\nFLL,PNS,145\nFLL,PSE,44\nFLL,PVD,424\nFLL,RDU,695\nFLL,RIC,366\nFLL,ROC,114\nFLL,SJU,765\nFLL,SLC,242\nFLL,STL,470\nFLL,SWF,476\nFLL,SYR,328\nFLL,TLH,262\nFLL,TPA,3036\nFLO,ATL,615\nFNT,ATL,3133\nFNT,DFW,246\nFNT,DTW,1522\nFNT,LAS,90\nFNT,LGA,393\nFNT,MCO,455\nFNT,MKE,838\nFNT,MKG,105\nFNT,MSP,354\nFNT,ORD,1264\nFNT,RSW,149\nFNT,TPA,200\nFSD,ATL,135\nFSD,CVG,555\nFSD,DEN,1429\nFSD,GRB,1\nFSD,MSN,1\nFSD,MSP,1927\nFSD,ORD,1770\nFSD,PIA,1\nFSD,SDF,1\nFSD,SLC,8\nFSM,ATL,633\nFSM,DFW,1826\nFSM,MEM,478\nFWA,ATL,1029\nFWA,DFW,713\nFWA,DTW,1202\nFWA,MSP,241\nFWA,ORD,2958\nFWA,TVC,1\nGCC,DEN,695\nGCC,RKS,59\nGCC,SLC,292\nGEG,BLI,1\nGEG,BOI,1016\nGEG,DEN,1436\nGEG,LAS,753\nGEG,LAX,431\nGEG,LGB,1\nGEG,MSP,826\nGEG,OAK,719\nGEG,ONT,440\nGEG,ORD,328\nGEG,PDX,1314\nGEG,PHX,777\nGEG,RDM,1\nGEG,RNO,213\nGEG,SAN,454\nGEG,SEA,4372\nGEG,SLC,1951\nGEG,SMF,375\nGEG,TUS,152\nGFK,MSP,1371\nGGG,DFW,978\nGJT,ASE,2\nGJT,DEN,2463\nGJT,DFW,599\nGJT,HDN,1\nGJT,LAX,4\nGJT,ORD,6\nGJT,PHX,1037\nGJT,SLC,1040\nGNV,ATL,2064\nGPT,ATL,3441\nGPT,DFW,1157\nGPT,FLL,366\nGPT,IAH,1908\nGPT,MEM,1088\nGPT,ORD,215\nGPT,TPA,366\nGRB,ATL,93\nGRB,CVG,447\nGRB,DEN,1\nGRB,DSM,1\nGRB,DTW,1224\nGRB,GTF,1\nGRB,MKE,774\nGRB,MQT,323\nGRB,MSP,1431\nGRB,ORD,3634\nGRB,SDF,1\nGRK,ATL,643\nGRK,DFW,2565\nGRK,IAH,525\nGRR,ATL,1351\nGRR,CLE,1147\nGRR,CVG,1387\nGRR,DCA,307\nGRR,DEN,346\nGRR,DFW,795\nGRR,DTW,2655\nGRR,EWR,582\nGRR,IAH,714\nGRR,LGA,363\nGRR,MCO,128\nGRR,MEM,362\nGRR,MKE,1244\nGRR,MKG,23\nGRR,MSP,1516\nGRR,ORD,3696\nGSO,ATL,2848\nGSO,BOS,132\nGSO,CLE,148\nGSO,CLT,987\nGSO,CVG,1097\nGSO,DFW,1037\nGSO,DTW,1245\nGSO,EWR,1093\nGSO,IAD,208\nGSO,IAH,1035\nGSO,JAX,1\nGSO,LGA,905\nGSO,MCO,19\nGSO,MEM,1043\nGSO,MIA,520\nGSO,MSP,365\nGSO,ORD,870\nGSO,ORF,2\nGSO,RDU,3\nGSP,ATL,2450\nGSP,CLE,510\nGSP,CLT,1\nGSP,CVG,456\nGSP,DFW,1436\nGSP,DTW,1238\nGSP,EWR,1040\nGSP,IAD,828\nGSP,IAH,950\nGSP,LGA,609\nGSP,MCO,90\nGSP,MEM,1089\nGSP,ORD,1159\nGST,JNU,85\nGTF,BZN,1\nGTF,DEN,869\nGTF,MSP,196\nGTF,ORD,23\nGTF,SLC,1051\nGTR,ATL,964\nGUC,ATL,2\nGUC,DEN,831\nGUC,DFW,111\nGUC,ORD,2\nGUC,SLC,13\nHDN,ATL,107\nHDN,DEN,1314\nHDN,DFW,127\nHDN,EWR,15\nHDN,IAH,112\nHDN,JFK,13\nHDN,LGA,15\nHDN,MSP,112\nHDN,ORD,205\nHDN,SLC,378\nHHH,ATL,836\nHLN,DEN,412\nHLN,MSP,365\nHLN,SLC,1209\nHNL,ANC,236\nHNL,ATL,637\nHNL,DEN,366\nHNL,DFW,732\nHNL,EWR,362\nHNL,IAH,702\nHNL,ITO,7685\nHNL,KOA,8745\nHNL,LAS,732\nHNL,LAX,4963\nHNL,LIH,10769\nHNL,MSP,366\nHNL,OAK,121\nHNL,OGG,12014\nHNL,ORD,641\nHNL,PDX,732\nHNL,PHX,914\nHNL,SAN,393\nHNL,SEA,1643\nHNL,SFO,2359\nHNL,SJC,366\nHNL,SLC,366\nHNL,SMF,366\nHNL,SNA,66\nHOU,ABQ,1023\nHOU,ATL,3595\nHOU,AUS,2310\nHOU,BHM,736\nHOU,BNA,1500\nHOU,BTR,1\nHOU,BWI,1262\nHOU,CRP,1932\nHOU,DAL,9766\nHOU,DEN,1063\nHOU,DFW,2425\nHOU,ELP,1032\nHOU,FLL,723\nHOU,HRL,2967\nHOU,JAN,1341\nHOU,JAX,366\nHOU,JFK,944\nHOU,LAS,1460\nHOU,LAX,1416\nHOU,LIT,365\nHOU,MAF,676\nHOU,MCO,1753\nHOU,MDW,2054\nHOU,MSY,3726\nHOU,OAK,713\nHOU,OKC,1366\nHOU,PHL,659\nHOU,PHX,1722\nHOU,SAN,421\nHOU,SAT,2572\nHOU,STL,1348\nHOU,TPA,1396\nHOU,TUL,1300\nHPN,ATL,2158\nHPN,CVG,126\nHPN,DTW,666\nHPN,EWR,1\nHPN,FLL,1021\nHPN,JFK,2\nHPN,MCO,1485\nHPN,ORD,3626\nHPN,PBI,1048\nHPN,PIA,1\nHPN,PIT,1\nHPN,RSW,520\nHPN,TPA,60\nHRL,AUS,366\nHRL,DAL,33\nHRL,HOU,2949\nHRL,IAH,398\nHRL,SAT,675\nHSV,ATL,2622\nHSV,BHM,4\nHSV,CLT,13\nHSV,CVG,787\nHSV,DCA,577\nHSV,DEN,653\nHSV,DFW,1717\nHSV,DTW,702\nHSV,IAD,726\nHSV,IAH,1043\nHSV,LGA,72\nHSV,MCO,248\nHSV,MEM,1079\nHSV,ORD,547\nHSV,TUS,1\nHTS,CVG,158\nIAD,ABQ,365\nIAD,ATL,5362\nIAD,AUS,631\nIAD,BDL,1192\nIAD,BHM,245\nIAD,BNA,233\nIAD,BOS,3846\nIAD,BTV,129\nIAD,BUF,16\nIAD,BUR,163\nIAD,CAE,1709\nIAD,CHS,710\nIAD,CLE,1435\nIAD,CLT,2762\nIAD,CVG,783\nIAD,DAY,52\nIAD,DCA,1\nIAD,DEN,2984\nIAD,DFW,2009\nIAD,DTW,1684\nIAD,EWR,1790\nIAD,FLL,1174\nIAD,GSO,207\nIAD,GSP,682\nIAD,HSV,725\nIAD,IAH,1389\nIAD,JAX,751\nIAD,JFK,2297\nIAD,LAS,1623\nIAD,LAX,4092\nIAD,LGA,1105\nIAD,LGB,756\nIAD,MCI,313\nIAD,MCO,4244\nIAD,MDT,984\nIAD,MDW,2075\nIAD,MHT,585\nIAD,MIA,575\nIAD,MSP,712\nIAD,MSY,413\nIAD,MYR,533\nIAD,OAK,841\nIAD,OKC,319\nIAD,ORD,2948\nIAD,ORF,956\nIAD,PBI,14\nIAD,PDX,367\nIAD,PHL,607\nIAD,PHX,731\nIAD,PIT,740\nIAD,PVD,511\nIAD,PWM,380\nIAD,RDU,1679\nIAD,ROA,682\nIAD,ROC,492\nIAD,RSW,14\nIAD,SAN,1331\nIAD,SAT,111\nIAD,SAV,1008\nIAD,SEA,1098\nIAD,SFO,3139\nIAD,SJC,245\nIAD,SJU,707\nIAD,SLC,524\nIAD,SMF,365\nIAD,SPI,141\nIAD,STT,137\nIAD,SYR,653\nIAD,TPA,1746\nIAD,TUS,112\nIAD,TYS,97\nIAH,ABQ,2261\nIAH,AEX,342\nIAH,AGS,1\nIAH,AMA,807\nIAH,ANC,206\nIAH,ATL,4989\nIAH,AUS,3704\nIAH,AVL,458\nIAH,BDL,120\nIAH,BHM,2333\nIAH,BNA,2547\nIAH,BOS,1822\nIAH,BPT,275\nIAH,BRO,1465\nIAH,BTR,2009\nIAH,BWI,1728\nIAH,CAE,165\nIAH,CHA,458\nIAH,CHS,73\nIAH,CLE,2147\nIAH,CLL,261\nIAH,CLT,3709\nIAH,CMH,839\nIAH,COS,1725\nIAH,CRP,823\nIAH,CRW,674\nIAH,CVG,2045\nIAH,DAL,3730\nIAH,DAY,859\nIAH,DCA,2941\nIAH,DEN,4584\nIAH,DFW,5539\nIAH,DSM,688\nIAH,DTW,2742\nIAH,EGE,124\nIAH,ELP,1136\nIAH,EWR,3970\nIAH,FLL,1933\nIAH,GPT,1908\nIAH,GRK,525\nIAH,GRR,714\nIAH,GSO,1036\nIAH,GSP,954\nIAH,HDN,112\nIAH,HNL,702\nIAH,HOU,2\nIAH,HRL,398\nIAH,HSV,1043\nIAH,IAD,1422\nIAH,ICT,1594\nIAH,IND,1763\nIAH,JAN,1720\nIAH,JAX,1529\nIAH,JFK,969\nIAH,LAS,2682\nIAH,LAX,3867\nIAH,LBB,769\nIAH,LCH,999\nIAH,LEX,646\nIAH,LFT,2703\nIAH,LGA,3399\nIAH,LIT,1111\nIAH,LRD,716\nIAH,MAF,1187\nIAH,MCI,2516\nIAH,MCO,2494\nIAH,MEM,3046\nIAH,MFE,2665\nIAH,MGM,246\nIAH,MIA,2735\nIAH,MKE,1673\nIAH,MLU,580\nIAH,MOB,1420\nIAH,MSP,2466\nIAH,MSY,4248\nIAH,MTJ,261\nIAH,OAK,722\nIAH,OKC,2625\nIAH,OMA,2098\nIAH,ONT,1093\nIAH,ORD,5651\nIAH,ORF,970\nIAH,PBI,1389\nIAH,PDX,1271\nIAH,PHL,1732\nIAH,PHX,4176\nIAH,PIT,1713\nIAH,PNS,635\nIAH,PSP,216\nIAH,RDU,1987\nIAH,RIC,970\nIAH,RNO,428\nIAH,RSW,1064\nIAH,SAN,2392\nIAH,SAT,3760\nIAH,SAV,948\nIAH,SDF,396\nIAH,SEA,2393\nIAH,SFO,2655\nIAH,SHV,1017\nIAH,SJC,995\nIAH,SJU,732\nIAH,SLC,2696\nIAH,SMF,1085\nIAH,SNA,1873\nIAH,SRQ,70\nIAH,STL,736\nIAH,TLH,481\nIAH,TPA,1963\nIAH,TUL,2310\nIAH,TUS,1670\nIAH,TYS,1353\nIAH,VPS,420\nIAH,XNA,1435\nICT,ATL,3146\nICT,CID,1\nICT,COS,1\nICT,DEN,1578\nICT,DFW,1794\nICT,DTW,241\nICT,IAH,1594\nICT,LAX,184\nICT,MCI,1\nICT,MEM,1092\nICT,MSP,714\nICT,MSY,1\nICT,OKC,2\nICT,ORD,3005\nICT,PHX,692\nICT,PIA,1\nICT,SGF,1\nICT,SLC,1\nICT,STL,1\nIDA,DEN,980\nIDA,MSP,336\nIDA,SLC,1787\nILM,ATL,1991\nILM,CLT,1259\nILM,CVG,146\nILM,RDU,1\nIND,ATL,3515\nIND,AUS,218\nIND,BDL,587\nIND,BOS,950\nIND,BWI,1003\nIND,CLE,635\nIND,CLT,1587\nIND,CVG,507\nIND,DCA,968\nIND,DEN,2089\nIND,DFW,2087\nIND,DTW,2558\nIND,EWR,1717\nIND,FLL,578\nIND,IAH,1275\nIND,JAX,366\nIND,JFK,117\nIND,LAS,1675\nIND,LAX,548\nIND,LGA,1331\nIND,MCI,1069\nIND,MCO,2298\nIND,MDW,1333\nIND,MEM,1066\nIND,MIA,213\nIND,MKE,738\nIND,MSP,1700\nIND,MSY,10\nIND,ORD,4102\nIND,PHL,495\nIND,PHX,1457\nIND,PIT,1\nIND,RDU,673\nIND,RSW,1057\nIND,SAT,236\nIND,SEA,75\nIND,SFO,173\nIND,SRQ,155\nIND,TPA,1587\nIND,XNA,1\nINL,MSP,72\nIPL,LAX,646\nIPL,YUM,343\nISP,ATL,215\nISP,BWI,2438\nISP,FLL,1087\nISP,LAS,366\nISP,MCO,2105\nISP,MDW,1427\nISP,PBI,1090\nISP,RSW,375\nISP,TPA,1080\nITH,DTW,132\nITO,HNL,7386\nITO,KOA,299\nITO,OGG,366\nIYK,BFL,1\nIYK,LAX,956\nIYK,PSP,1\nJAC,ATL,118\nJAC,CVG,13\nJAC,DEN,1443\nJAC,DFW,214\nJAC,IDA,1\nJAC,LAX,15\nJAC,MSP,117\nJAC,ORD,360\nJAC,SLC,1485\nJAN,ATL,2704\nJAN,BWI,666\nJAN,CVG,121\nJAN,DCA,293\nJAN,DFW,2605\nJAN,DTW,689\nJAN,EWR,121\nJAN,HOU,1345\nJAN,IAH,1721\nJAN,MCO,381\nJAN,MDW,677\nJAN,MEM,1075\nJAN,ORD,211\nJAX,ATL,5656\nJAX,AUS,229\nJAX,BHM,366\nJAX,BNA,1373\nJAX,BOS,652\nJAX,BWI,1066\nJAX,CLE,144\nJAX,CLT,2520\nJAX,CVG,1110\nJAX,DCA,896\nJAX,DEN,118\nJAX,DFW,1366\nJAX,DTW,508\nJAX,EWR,1581\nJAX,FLL,1809\nJAX,HOU,366\nJAX,IAD,743\nJAX,IAH,1541\nJAX,IND,366\nJAX,JFK,1068\nJAX,LAS,236\nJAX,LAX,3\nJAX,LGA,1294\nJAX,MCI,226\nJAX,MEM,871\nJAX,MIA,218\nJAX,MSP,200\nJAX,MSY,470\nJAX,ORD,1704\nJAX,ORF,712\nJAX,PHL,1657\nJAX,PIR,2\nJAX,RDU,596\nJAX,TPA,1017\nJAX,TYS,1\nJFK,ACK,234\nJFK,ALB,364\nJFK,ATL,2279\nJFK,AUS,1356\nJFK,BDL,631\nJFK,BGR,338\nJFK,BNA,463\nJFK,BOS,7513\nJFK,BQN,661\nJFK,BTV,2207\nJFK,BUF,3674\nJFK,BUR,1366\nJFK,BWI,1123\nJFK,CHS,1\nJFK,CLE,1392\nJFK,CLT,1833\nJFK,CMH,571\nJFK,CVG,1346\nJFK,DCA,2941\nJFK,DEN,1082\nJFK,DFW,834\nJFK,DTW,1848\nJFK,EGE,14\nJFK,FLL,4696\nJFK,HDN,13\nJFK,HOU,943\nJFK,HPN,1\nJFK,IAD,2299\nJFK,IAH,972\nJFK,IND,125\nJFK,JAX,1067\nJFK,LAS,4471\nJFK,LAX,8078\nJFK,LGA,2\nJFK,LGB,1541\nJFK,MCO,5373\nJFK,MIA,2737\nJFK,MSP,1441\nJFK,MSY,1070\nJFK,OAK,1177\nJFK,ONT,247\nJFK,ORD,3672\nJFK,ORF,277\nJFK,PBI,2534\nJFK,PDX,680\nJFK,PHL,587\nJFK,PHX,2254\nJFK,PIT,2244\nJFK,PSE,346\nJFK,PVD,603\nJFK,PWM,1824\nJFK,RDU,4149\nJFK,RIC,1694\nJFK,ROC,2425\nJFK,RSW,1893\nJFK,SAN,1630\nJFK,SEA,1855\nJFK,SFO,6591\nJFK,SJC,480\nJFK,SJU,3565\nJFK,SLC,1795\nJFK,SMF,341\nJFK,SRQ,534\nJFK,STL,795\nJFK,STT,366\nJFK,SYR,1824\nJFK,TPA,3390\nJFK,TUS,132\nJNU,ANC,1163\nJNU,GST,85\nJNU,KTN,364\nJNU,PSG,363\nJNU,SEA,1209\nJNU,SIT,863\nJNU,YAK,363\nKOA,DEN,45\nKOA,HNL,9038\nKOA,LAX,1040\nKOA,LIH,55\nKOA,OAK,4\nKOA,OGG,793\nKOA,ORD,221\nKOA,PHX,330\nKOA,SAN,23\nKOA,SEA,411\nKOA,SFO,713\nKOA,SNA,37\nKTN,JNU,362\nKTN,SEA,1289\nKTN,SIT,365\nKTN,WRG,364\nLAN,CVG,486\nLAN,DTW,1641\nLAN,MSP,157\nLAN,ORD,1409\nLAS,ABQ,2408\nLAS,ALB,366\nLAS,AMA,367\nLAS,ANC,238\nLAS,ATL,4761\nLAS,AUS,1232\nLAS,BDL,366\nLAS,BFL,102\nLAS,BHM,366\nLAS,BMI,51\nLAS,BNA,1201\nLAS,BOI,755\nLAS,BOS,1383\nLAS,BUF,588\nLAS,BUR,5154\nLAS,BWI,1628\nLAS,CAK,43\nLAS,CLE,1667\nLAS,CLT,1730\nLAS,CMH,1351\nLAS,COS,98\nLAS,CVG,920\nLAS,DAY,42\nLAS,DCA,366\nLAS,DEN,8165\nLAS,DFW,4959\nLAS,DTW,2036\nLAS,ELP,1042\nLAS,EUG,162\nLAS,EWR,2341\nLAS,FAT,2101\nLAS,FLL,677\nLAS,FNT,91\nLAS,GEG,753\nLAS,HNL,732\nLAS,HOU,1461\nLAS,IAD,1625\nLAS,IAH,2678\nLAS,IND,1674\nLAS,ISP,366\nLAS,JAX,236\nLAS,JFK,4481\nLAS,LAX,11729\nLAS,LBB,366\nLAS,LGB,854\nLAS,LIT,382\nLAS,MAF,366\nLAS,MCI,1913\nLAS,MCO,1076\nLAS,MDW,3836\nLAS,MEM,373\nLAS,MFR,139\nLAS,MHT,365\nLAS,MIA,787\nLAS,MKE,530\nLAS,MLI,50\nLAS,MRY,14\nLAS,MSP,2464\nLAS,MSY,726\nLAS,OAK,4693\nLAS,OKC,471\nLAS,OMA,1088\nLAS,ONT,3501\nLAS,ORD,5235\nLAS,ORF,365\nLAS,PBI,62\nLAS,PDX,3568\nLAS,PHL,2829\nLAS,PHX,10626\nLAS,PIT,1411\nLAS,PSP,1280\nLAS,PVD,365\nLAS,RDU,724\nLAS,RNO,4492\nLAS,ROC,83\nLAS,SAN,5895\nLAS,SAT,1573\nLAS,SBA,305\nLAS,SBP,128\nLAS,SDF,366\nLAS,SEA,5065\nLAS,SFO,6994\nLAS,SJC,4148\nLAS,SLC,5378\nLAS,SMF,4054\nLAS,SNA,4115\nLAS,STL,1647\nLAS,TPA,1175\nLAS,TUL,390\nLAS,TUS,2018\nLAS,YUM,99\nLAW,ATL,543\nLAW,DFW,1826\nLAX,ABQ,2415\nLAX,ANC,239\nLAX,ASE,324\nLAX,ATL,5402\nLAX,AUS,1732\nLAX,BDL,132\nLAX,BFL,902\nLAX,BNA,1418\nLAX,BOI,985\nLAX,BOS,2441\nLAX,BWI,897\nLAX,BZN,13\nLAX,CLD,2258\nLAX,CLE,1053\nLAX,CLT,1460\nLAX,CMH,49\nLAX,COS,994\nLAX,CVG,1144\nLAX,DCA,366\nLAX,DEN,8894\nLAX,DFW,6571\nLAX,DSM,177\nLAX,DTW,1972\nLAX,EGE,107\nLAX,ELP,1076\nLAX,EUG,305\nLAX,EWR,3249\nLAX,FAT,4045\nLAX,FLL,373\nLAX,GEG,428\nLAX,GJT,8\nLAX,HNL,4964\nLAX,HOU,1426\nLAX,IAD,3836\nLAX,IAH,3849\nLAX,ICT,186\nLAX,IND,548\nLAX,IPL,660\nLAX,IYK,954\nLAX,JAC,15\nLAX,JAX,2\nLAX,JFK,8058\nLAX,KOA,1038\nLAX,LAS,11773\nLAX,LIH,1067\nLAX,MCI,1338\nLAX,MCO,1725\nLAX,MDW,2388\nLAX,MEM,729\nLAX,MFR,1\nLAX,MIA,2495\nLAX,MKE,355\nLAX,MOD,659\nLAX,MRY,2763\nLAX,MSP,2392\nLAX,MSY,930\nLAX,MTJ,18\nLAX,OAK,7583\nLAX,OGG,2054\nLAX,OKC,501\nLAX,ONT,24\nLAX,ORD,7333\nLAX,OXR,1291\nLAX,PDX,3503\nLAX,PHL,2246\nLAX,PHX,9897\nLAX,PIT,373\nLAX,PSP,2596\nLAX,RDU,8\nLAX,RNO,1898\nLAX,RSW,1\nLAX,SAN,11257\nLAX,SAT,1781\nLAX,SBA,4554\nLAX,SBP,2684\nLAX,SEA,6876\nLAX,SFO,13390\nLAX,SGU,722\nLAX,SJC,8908\nLAX,SJU,144\nLAX,SLC,5178\nLAX,SMF,5692\nLAX,SMX,1679\nLAX,SNA,32\nLAX,STL,1686\nLAX,TPA,516\nLAX,TUL,73\nLAX,TUS,4141\nLAX,XNA,359\nLAX,YUM,1030\nLBB,ABQ,366\nLBB,AUS,690\nLBB,DAL,2679\nLBB,DFW,3015\nLBB,ELP,364\nLBB,IAH,769\nLBB,LAS,366\nLCH,IAH,1000\nLEX,ATL,2217\nLEX,CLE,14\nLEX,COS,1\nLEX,CVG,1539\nLEX,DAY,1\nLEX,DCA,304\nLEX,DFW,907\nLEX,DTW,1656\nLEX,EWR,390\nLEX,IAH,646\nLEX,LGA,411\nLEX,MCO,39\nLEX,MEM,252\nLEX,ORD,1967\nLFT,ATL,995\nLFT,DFW,1182\nLFT,IAH,2702\nLGA,AGS,7\nLGA,ATL,10507\nLGA,BHM,591\nLGA,BNA,1217\nLGA,BOS,12035\nLGA,CAE,609\nLGA,CAK,793\nLGA,CHS,1414\nLGA,CID,156\nLGA,CLE,2920\nLGA,CLT,4958\nLGA,CMH,2350\nLGA,CVG,3635\nLGA,DAB,159\nLGA,DCA,11063\nLGA,DEN,2970\nLGA,DFW,5372\nLGA,DSM,705\nLGA,DTW,4601\nLGA,EGE,16\nLGA,FLL,3152\nLGA,FNT,392\nLGA,GRR,363\nLGA,GSO,927\nLGA,GSP,609\nLGA,HDN,15\nLGA,HSV,69\nLGA,IAD,1103\nLGA,IAH,3418\nLGA,IND,1331\nLGA,JAX,1285\nLGA,LEX,415\nLGA,MCO,3158\nLGA,MEM,1605\nLGA,MIA,3586\nLGA,MKE,592\nLGA,MLB,2\nLGA,MSN,620\nLGA,MSP,2719\nLGA,MSY,512\nLGA,MYR,123\nLGA,ORD,10862\nLGA,PBI,1934\nLGA,PHF,770\nLGA,PHL,1\nLGA,PIT,1297\nLGA,RDU,4423\nLGA,RIC,1336\nLGA,RSW,238\nLGA,SAV,995\nLGA,SDF,571\nLGA,SLC,24\nLGA,SRQ,74\nLGA,STL,1604\nLGA,STT,9\nLGA,TPA,1464\nLGA,TVC,50\nLGA,TYS,642\nLGA,VPS,2\nLGA,XNA,765\nLGB,AUS,245\nLGB,BOS,789\nLGB,FAT,431\nLGB,FLL,332\nLGB,GEG,1\nLGB,IAD,756\nLGB,JFK,1544\nLGB,LAS,853\nLGB,MRY,436\nLGB,OAK,1631\nLGB,ONT,1\nLGB,ORD,600\nLGB,PDX,142\nLGB,PHX,1623\nLGB,RNO,459\nLGB,SEA,1499\nLGB,SFO,210\nLGB,SJC,661\nLGB,SLC,2500\nLGB,SMF,729\nLGB,TWF,1\nLIH,DEN,45\nLIH,HNL,10407\nLIH,KOA,54\nLIH,LAX,1069\nLIH,OGG,426\nLIH,PHX,280\nLIH,SAN,31\nLIH,SEA,366\nLIH,SFO,483\nLIH,SNA,23\nLIT,ATL,2526\nLIT,BWI,366\nLIT,CLT,39\nLIT,CVG,49\nLIT,DAL,2327\nLIT,DEN,118\nLIT,DFW,3245\nLIT,DTW,361\nLIT,EWR,331\nLIT,HOU,365\nLIT,IAH,1103\nLIT,LAS,382\nLIT,MCO,1\nLIT,MDW,383\nLIT,MEM,887\nLIT,MSP,157\nLIT,ORD,1806\nLIT,PHX,235\nLIT,SAT,1\nLIT,SLC,18\nLIT,STL,669\nLMT,MFR,1\nLMT,PDX,162\nLMT,SFO,348\nLNK,ABE,1\nLNK,CRW,1\nLNK,DEN,1204\nLNK,DTW,320\nLNK,LAN,1\nLNK,MSP,106\nLNK,ORD,1403\nLNK,PIA,1\nLRD,DFW,1401\nLRD,IAH,714\nLSE,MSP,434\nLSE,ORD,1571\nLWB,ATL,185\nLWS,BOI,1\nLWS,IDA,1\nLWS,SLC,650\nLYH,ATL,625\nMAF,ABQ,366\nMAF,AUS,471\nMAF,DAL,1995\nMAF,DFW,1778\nMAF,HOU,676\nMAF,IAH,1187\nMAF,LAS,366\nMBS,DTW,1460\nMBS,MSP,117\nMBS,ORD,1341\nMCI,ABQ,670\nMCI,ATL,4140\nMCI,AUS,459\nMCI,BNA,1317\nMCI,BWI,1025\nMCI,CLE,1219\nMCI,CLT,1182\nMCI,CMH,164\nMCI,COS,178\nMCI,CVG,1491\nMCI,DAL,3943\nMCI,DEN,5256\nMCI,DFW,2877\nMCI,DTW,1252\nMCI,EWR,1799\nMCI,FLL,60\nMCI,IAD,227\nMCI,IAH,2527\nMCI,ICT,1\nMCI,IND,1074\nMCI,JAX,229\nMCI,LAS,1926\nMCI,LAX,1331\nMCI,LNK,1\nMCI,MCO,1349\nMCI,MDW,3850\nMCI,MEM,1005\nMCI,MGM,1\nMCI,MIA,65\nMCI,MKE,3\nMCI,MSN,250\nMCI,MSP,2136\nMCI,MSY,462\nMCI,OAK,686\nMCI,OKC,1128\nMCI,OMA,3\nMCI,ONT,301\nMCI,ORD,3837\nMCI,PDX,366\nMCI,PHX,2165\nMCI,PIT,266\nMCI,RDU,652\nMCI,RSW,5\nMCI,SAN,689\nMCI,SAT,577\nMCI,SEA,365\nMCI,SLC,1054\nMCI,SMF,306\nMCI,STL,1763\nMCI,TPA,695\nMCI,TUL,810\nMCI,TUS,233\nMCN,ATL,652\nMCO,ABQ,726\nMCO,ALB,1040\nMCO,ATL,9611\nMCO,AUS,632\nMCO,AVL,47\nMCO,BDL,1758\nMCO,BHM,1214\nMCO,BMI,173\nMCO,BNA,1782\nMCO,BOS,3478\nMCO,BQN,492\nMCO,BTV,346\nMCO,BUF,1877\nMCO,BWI,4926\nMCO,CAK,371\nMCO,CLE,1909\nMCO,CLT,3276\nMCO,CMH,1165\nMCO,CVG,1304\nMCO,DAY,416\nMCO,DCA,1845\nMCO,DEN,2997\nMCO,DFW,4114\nMCO,DTW,3477\nMCO,EWR,4977\nMCO,EYW,35\nMCO,FLL,2074\nMCO,FNT,455\nMCO,GRR,128\nMCO,GSO,11\nMCO,GSP,90\nMCO,HOU,1758\nMCO,HPN,1484\nMCO,HSV,248\nMCO,IAD,4094\nMCO,IAH,2499\nMCO,IND,2306\nMCO,ISP,2110\nMCO,JAN,381\nMCO,JAX,2\nMCO,JFK,5371\nMCO,LAS,1077\nMCO,LAX,1725\nMCO,LEX,39\nMCO,LGA,3156\nMCO,LIT,1\nMCO,MCI,1349\nMCO,MDT,42\nMCO,MDW,3565\nMCO,MEM,1434\nMCO,MHT,1606\nMCO,MIA,2195\nMCO,MKE,831\nMCO,MLI,172\nMCO,MSP,1929\nMCO,MSY,1568\nMCO,OKC,9\nMCO,OMA,9\nMCO,ORD,3978\nMCO,ORF,755\nMCO,PBI,1\nMCO,PDX,237\nMCO,PFN,195\nMCO,PHF,362\nMCO,PHL,7034\nMCO,PHX,1038\nMCO,PIT,2465\nMCO,PNS,365\nMCO,PSE,347\nMCO,PVD,2149\nMCO,PWM,460\nMCO,RDU,1655\nMCO,RIC,517\nMCO,ROC,701\nMCO,RSW,1414\nMCO,SAN,13\nMCO,SAT,744\nMCO,SDF,533\nMCO,SEA,731\nMCO,SFO,366\nMCO,SJU,2420\nMCO,SLC,685\nMCO,STL,2422\nMCO,SWF,834\nMCO,SYR,390\nMCO,TLH,219\nMCO,TPA,1\nMCO,TUL,9\nMCO,TYS,126\nMDT,ATL,1789\nMDT,AVP,1\nMDT,BWI,1\nMDT,CLE,58\nMDT,CLT,1144\nMDT,CVG,1008\nMDT,DCA,1\nMDT,DFW,274\nMDT,DTW,542\nMDT,IAD,937\nMDT,LGA,2\nMDT,MCO,42\nMDT,MSP,197\nMDT,ORD,1598\nMDW,ABQ,730\nMDW,ALB,729\nMDW,ATL,3257\nMDW,AUS,713\nMDW,BDL,1052\nMDW,BHM,726\nMDW,BNA,3016\nMDW,BOS,345\nMDW,BUF,1278\nMDW,BWI,2776\nMDW,CLE,2556\nMDW,CLT,13\nMDW,CMH,2644\nMDW,DEN,4325\nMDW,DTW,3070\nMDW,EWR,278\nMDW,FLL,1621\nMDW,HOU,2052\nMDW,IAD,2065\nMDW,IND,1314\nMDW,ISP,1422\nMDW,JAN,682\nMDW,LAS,3832\nMDW,LAX,2390\nMDW,LIT,383\nMDW,MCI,3885\nMDW,MCO,3568\nMDW,MHT,1649\nMDW,MIA,133\nMDW,MSP,1476\nMDW,MSY,391\nMDW,OAK,1719\nMDW,OMA,2047\nMDW,ORF,731\nMDW,PDX,891\nMDW,PHL,2664\nMDW,PHX,2800\nMDW,PIT,2037\nMDW,PVD,1380\nMDW,RDU,1353\nMDW,RNO,365\nMDW,RSW,1095\nMDW,SAN,1708\nMDW,SAT,700\nMDW,SDF,1690\nMDW,SEA,1331\nMDW,SFO,1083\nMDW,SJC,658\nMDW,SLC,1003\nMDW,SMF,686\nMDW,SRQ,565\nMDW,STL,3784\nMDW,TPA,2231\nMDW,TUS,727\nMEI,ATL,674\nMEM,ATL,4870\nMEM,AUS,835\nMEM,BDL,49\nMEM,BHM,891\nMEM,BNA,1024\nMEM,BOS,199\nMEM,BTR,998\nMEM,BWI,783\nMEM,CAE,706\nMEM,CHA,629\nMEM,CHS,709\nMEM,CLE,1205\nMEM,CLT,2576\nMEM,CMH,1072\nMEM,COS,117\nMEM,CVG,1225\nMEM,DCA,1043\nMEM,DEN,1731\nMEM,DFW,2458\nMEM,DSM,813\nMEM,DTW,2205\nMEM,EVV,904\nMEM,EWR,1170\nMEM,FLL,479\nMEM,FSM,479\nMEM,GPT,1088\nMEM,GRR,362\nMEM,GSO,1043\nMEM,GSP,1088\nMEM,HSV,1083\nMEM,IAH,3079\nMEM,ICT,1093\nMEM,IND,1058\nMEM,JAN,1082\nMEM,JAX,871\nMEM,LAS,372\nMEM,LAX,1095\nMEM,LEX,252\nMEM,LGA,1608\nMEM,LIT,886\nMEM,MCI,981\nMEM,MCO,1432\nMEM,MGM,1091\nMEM,MIA,785\nMEM,MKE,744\nMEM,MLI,668\nMEM,MOB,1094\nMEM,MSN,359\nMEM,MSP,2845\nMEM,MSY,1004\nMEM,OKC,940\nMEM,OMA,749\nMEM,ORD,3769\nMEM,ORF,241\nMEM,PFN,1095\nMEM,PHL,1039\nMEM,PHX,817\nMEM,PIT,1002\nMEM,PNS,1097\nMEM,RDU,1062\nMEM,RIC,292\nMEM,RSW,58\nMEM,SAN,109\nMEM,SAT,831\nMEM,SAV,765\nMEM,SDF,786\nMEM,SEA,349\nMEM,SFO,208\nMEM,SGF,1080\nMEM,SHV,1094\nMEM,SJU,26\nMEM,STL,1049\nMEM,TLH,1094\nMEM,TPA,861\nMEM,TRI,44\nMEM,TUL,1094\nMEM,TYS,1096\nMEM,VPS,1045\nMEM,XNA,1041\nMFE,ATL,10\nMFE,DFW,1441\nMFE,IAH,2665\nMFR,DEN,365\nMFR,LAS,139\nMFR,MOD,1\nMFR,OTH,1\nMFR,PDX,1543\nMFR,PHX,304\nMFR,RDD,1\nMFR,RDM,1\nMFR,SBA,1\nMFR,SFO,2571\nMFR,SLC,724\nMFR,TWF,1\nMGM,ATL,2514\nMGM,IAH,246\nMGM,MEM,1091\nMHT,ATL,696\nMHT,BOS,4\nMHT,BWI,3628\nMHT,CLE,1212\nMHT,CLT,723\nMHT,CVG,777\nMHT,DCA,288\nMHT,DTW,846\nMHT,EWR,1353\nMHT,FLL,246\nMHT,IAD,584\nMHT,LAS,366\nMHT,MCO,1605\nMHT,MDW,1643\nMHT,ORD,1145\nMHT,PHL,2365\nMHT,PHX,365\nMHT,TPA,742\nMIA,ATL,6623\nMIA,BDL,366\nMIA,BNA,731\nMIA,BOS,2193\nMIA,BWI,929\nMIA,CLE,399\nMIA,CLT,2970\nMIA,CMH,470\nMIA,CVG,1045\nMIA,DCA,2982\nMIA,DEN,809\nMIA,DFW,3346\nMIA,DTW,1228\nMIA,EGE,43\nMIA,EWR,2873\nMIA,FLL,1\nMIA,GSO,519\nMIA,IAD,574\nMIA,IAH,2734\nMIA,IND,211\nMIA,JAX,217\nMIA,JFK,2743\nMIA,LAS,787\nMIA,LAX,2494\nMIA,LGA,3587\nMIA,MCI,65\nMIA,MCO,2195\nMIA,MDW,133\nMIA,MEM,785\nMIA,MSP,907\nMIA,MSY,1098\nMIA,ORD,3343\nMIA,ORF,152\nMIA,PHL,2203\nMIA,PHX,366\nMIA,PIT,174\nMIA,RDU,1098\nMIA,RIC,151\nMIA,SDF,365\nMIA,SEA,366\nMIA,SFO,1097\nMIA,SJU,2559\nMIA,STL,732\nMIA,STT,732\nMIA,STX,349\nMIA,TLH,832\nMIA,TPA,1829\nMIA,XNA,154\nMKE,ABE,1\nMKE,ATL,3606\nMKE,ATW,1030\nMKE,AVP,1\nMKE,BDL,539\nMKE,BHM,1\nMKE,BNA,771\nMKE,BOS,208\nMKE,BWI,1293\nMKE,CLE,2226\nMKE,CLT,245\nMKE,CMH,1054\nMKE,CVG,840\nMKE,CWA,285\nMKE,DAY,608\nMKE,DCA,122\nMKE,DEN,1449\nMKE,DFW,747\nMKE,DSM,723\nMKE,DTW,1905\nMKE,EWR,2524\nMKE,FAR,1\nMKE,FLL,43\nMKE,FNT,839\nMKE,GRB,774\nMKE,GRR,1244\nMKE,IAH,1671\nMKE,IND,738\nMKE,LAS,531\nMKE,LAX,355\nMKE,LGA,590\nMKE,MCI,2\nMKE,MCO,830\nMKE,MEM,734\nMKE,MKG,264\nMKE,MQT,357\nMKE,MSN,1294\nMKE,MSP,3464\nMKE,OMA,703\nMKE,ORD,3541\nMKE,PHL,775\nMKE,PHX,867\nMKE,PIT,1082\nMKE,RDU,490\nMKE,RSW,226\nMKE,SAN,106\nMKE,SDF,258\nMKE,SEA,122\nMKE,SFO,115\nMKE,SLC,6\nMKE,STL,320\nMKE,TPA,178\nMKE,TUS,2\nMKG,FNT,109\nMKG,GRR,24\nMKG,MKE,263\nMLB,ATL,2000\nMLB,LGA,2\nMLI,ATL,2592\nMLI,DEN,719\nMLI,DFW,587\nMLI,DTW,755\nMLI,LAS,51\nMLI,MCO,172\nMLI,MEM,669\nMLI,MSP,442\nMLI,ORD,2580\nMLU,ATL,983\nMLU,DFW,966\nMLU,IAH,581\nMOB,ATL,2225\nMOB,DFW,1399\nMOB,IAH,1420\nMOB,MEM,1094\nMOB,ORD,210\nMOD,BFL,1\nMOD,LAX,679\nMOD,ONT,1\nMOD,RNO,1\nMOD,SFO,1643\nMOT,MSP,1085\nMQT,GRB,322\nMQT,MKE,356\nMQT,ORD,313\nMRY,DEN,365\nMRY,LAS,14\nMRY,LAX,2758\nMRY,LGB,435\nMRY,ONT,246\nMRY,PHX,910\nMRY,SAN,445\nMRY,SFO,2428\nMRY,SLC,6\nMSN,ATL,384\nMSN,ATW,1\nMSN,CLE,317\nMSN,CVG,259\nMSN,DCA,287\nMSN,DEN,943\nMSN,DFW,947\nMSN,DSM,1\nMSN,DTW,1603\nMSN,EWR,313\nMSN,LGA,622\nMSN,MCI,249\nMSN,MEM,359\nMSN,MKE,1293\nMSN,MSP,1439\nMSN,ORD,4943\nMSN,RFD,1\nMSO,DEN,1107\nMSO,MSP,189\nMSO,ORD,105\nMSO,PIH,2\nMSO,SFO,12\nMSO,SLC,1841\nMSP,ABQ,677\nMSP,ALB,57\nMSP,ALO,323\nMSP,ANC,826\nMSP,ATL,5369\nMSP,ATW,89\nMSP,AUS,54\nMSP,AVL,364\nMSP,AZO,246\nMSP,BDL,933\nMSP,BGR,11\nMSP,BIL,820\nMSP,BIS,1052\nMSP,BJI,74\nMSP,BNA,781\nMSP,BOI,807\nMSP,BOS,1563\nMSP,BTV,75\nMSP,BUF,229\nMSP,BWI,1017\nMSP,BZN,878\nMSP,CHS,27\nMSP,CID,412\nMSP,CLE,1876\nMSP,CLT,1814\nMSP,CMH,1076\nMSP,CMX,318\nMSP,COS,449\nMSP,CPR,31\nMSP,CVG,1760\nMSP,CWA,13\nMSP,DAY,692\nMSP,DCA,2194\nMSP,DEN,5374\nMSP,DFW,2851\nMSP,DLH,1290\nMSP,DSM,929\nMSP,DTW,5459\nMSP,EGE,112\nMSP,EWR,3144\nMSP,FAI,205\nMSP,FAR,1744\nMSP,FCA,209\nMSP,FLL,475\nMSP,FNT,355\nMSP,FSD,1925\nMSP,FWA,242\nMSP,GEG,826\nMSP,GFK,1371\nMSP,GRB,1408\nMSP,GRR,1645\nMSP,GSO,365\nMSP,GTF,195\nMSP,HDN,112\nMSP,HLN,365\nMSP,HNL,366\nMSP,IAD,710\nMSP,IAH,2451\nMSP,ICT,714\nMSP,IDA,336\nMSP,IND,1661\nMSP,INL,72\nMSP,JAC,117\nMSP,JAX,201\nMSP,JFK,1441\nMSP,LAN,157\nMSP,LAS,2461\nMSP,LAX,2389\nMSP,LGA,2723\nMSP,LIT,157\nMSP,LNK,106\nMSP,LSE,433\nMSP,MBS,109\nMSP,MCI,1976\nMSP,MCO,1931\nMSP,MDT,197\nMSP,MDW,1367\nMSP,MEM,2551\nMSP,MIA,908\nMSP,MKE,3619\nMSP,MLI,450\nMSP,MOT,1085\nMSP,MSN,1438\nMSP,MSO,189\nMSP,MYR,27\nMSP,OKC,542\nMSP,OMA,1177\nMSP,ORD,9356\nMSP,ORF,122\nMSP,PDX,1501\nMSP,PHL,1709\nMSP,PHX,3515\nMSP,PIR,3\nMSP,PIT,1006\nMSP,PSP,214\nMSP,PVD,6\nMSP,PWM,42\nMSP,RAP,877\nMSP,RDU,726\nMSP,RHI,221\nMSP,RIC,339\nMSP,ROC,134\nMSP,RST,881\nMSP,RSW,647\nMSP,SAN,1330\nMSP,SAT,190\nMSP,SAV,27\nMSP,SBN,365\nMSP,SDF,707\nMSP,SEA,2475\nMSP,SFO,1909\nMSP,SGF,359\nMSP,SJC,693\nMSP,SJU,26\nMSP,SLC,2197\nMSP,SMF,809\nMSP,SNA,1037\nMSP,SPI,1\nMSP,STL,1626\nMSP,SUX,121\nMSP,TPA,1005\nMSP,TUL,717\nMSP,TUS,439\nMSP,TVC,346\nMSP,TYS,365\nMSP,XNA,677\nMSY,ATL,4695\nMSY,AUS,443\nMSY,BHM,1012\nMSY,BNA,1010\nMSY,BOS,254\nMSY,BWI,391\nMSY,CLE,54\nMSY,CLT,1504\nMSY,CMH,1\nMSY,CVG,193\nMSY,DAL,2079\nMSY,DCA,430\nMSY,DEN,1176\nMSY,DFW,2501\nMSY,DTW,53\nMSY,EWR,1129\nMSY,FLL,594\nMSY,HOU,3737\nMSY,IAD,457\nMSY,IAH,4257\nMSY,IND,10\nMSY,JAX,472\nMSY,JFK,1070\nMSY,LAS,727\nMSY,LAX,928\nMSY,LGA,511\nMSY,MCI,461\nMSY,MCO,1566\nMSY,MDW,390\nMSY,MEM,1003\nMSY,MIA,1097\nMSY,MSP,16\nMSY,OKC,1\nMSY,ORD,1458\nMSY,PHL,1046\nMSY,PHX,365\nMSY,RDU,472\nMSY,SAT,432\nMSY,SLC,329\nMSY,TPA,1097\nMSY,TWF,1\nMTJ,ATL,37\nMTJ,DEN,1591\nMTJ,DFW,232\nMTJ,EWR,21\nMTJ,IAH,261\nMTJ,LAX,18\nMTJ,ORD,30\nMTJ,SLC,229\nMYR,ATL,1854\nMYR,BOS,45\nMYR,CLT,2216\nMYR,CVG,13\nMYR,DTW,287\nMYR,EWR,234\nMYR,IAD,533\nMYR,ILM,1\nMYR,LGA,124\nMYR,MSP,27\nMYR,PHL,1\nOAJ,ATL,1178\nOAJ,CLT,6\nOAK,ABQ,1004\nOAK,ATL,88\nOAK,AUS,236\nOAK,BNA,363\nOAK,BOI,667\nOAK,BOS,518\nOAK,BUR,5420\nOAK,DEN,3101\nOAK,DFW,725\nOAK,FLL,13\nOAK,GEG,726\nOAK,HNL,121\nOAK,HOU,711\nOAK,IAD,841\nOAK,IAH,721\nOAK,JFK,1177\nOAK,KOA,4\nOAK,LAS,4642\nOAK,LAX,7578\nOAK,LGB,1632\nOAK,MCI,684\nOAK,MDW,1720\nOAK,OGG,60\nOAK,ONT,3701\nOAK,ORD,59\nOAK,PDX,2482\nOAK,PHX,4213\nOAK,RNO,1331\nOAK,SAN,5851\nOAK,SEA,5047\nOAK,SLC,3146\nOAK,SMF,1\nOAK,SNA,3645\nOAK,TUS,307\nOGG,ANC,27\nOGG,DEN,163\nOGG,DFW,366\nOGG,HNL,12383\nOGG,ITO,366\nOGG,KOA,1379\nOGG,LAX,2058\nOGG,LIH,60\nOGG,OAK,60\nOGG,PDX,366\nOGG,PHX,586\nOGG,SAN,280\nOGG,SEA,533\nOGG,SFO,932\nOGG,SLC,261\nOGG,SMF,60\nOGG,SNA,60\nOKC,ABQ,231\nOKC,ATL,1884\nOKC,AUS,87\nOKC,BMI,1\nOKC,BWI,366\nOKC,CLE,21\nOKC,CVG,769\nOKC,DAL,1687\nOKC,DEN,2848\nOKC,DFW,2845\nOKC,DTW,604\nOKC,EWR,361\nOKC,HOU,1353\nOKC,IAD,5\nOKC,IAH,2635\nOKC,LAS,471\nOKC,LAX,500\nOKC,MCI,1144\nOKC,MCO,9\nOKC,MEM,883\nOKC,MSP,617\nOKC,ONT,231\nOKC,ORD,2038\nOKC,PHX,1513\nOKC,SAN,302\nOKC,SAT,89\nOKC,SLC,743\nOKC,SMF,226\nOKC,STL,688\nOKC,TUL,1\nOMA,ABQ,1\nOMA,ATL,1731\nOMA,ATW,1\nOMA,BHM,1\nOMA,CLE,428\nOMA,COS,1\nOMA,CVG,1002\nOMA,DEN,3231\nOMA,DFW,1748\nOMA,DSM,1\nOMA,DTW,1324\nOMA,EWR,1080\nOMA,GRB,1\nOMA,IAH,2099\nOMA,LAS,1083\nOMA,LNK,1\nOMA,MCO,9\nOMA,MDW,2045\nOMA,MEM,763\nOMA,MKE,701\nOMA,MSP,1163\nOMA,ONT,304\nOMA,ORD,4045\nOMA,PHX,2067\nOMA,SAN,314\nOMA,SLC,609\nOMA,STL,1033\nOMA,TUS,221\nOME,ANC,729\nOME,OTZ,361\nONT,ABQ,443\nONT,ATL,797\nONT,AUS,304\nONT,BNA,365\nONT,BOI,471\nONT,COS,458\nONT,DEN,1544\nONT,DFW,1742\nONT,ELP,382\nONT,FAT,238\nONT,GEG,440\nONT,GJT,1\nONT,IAH,1093\nONT,JFK,248\nONT,LAS,3494\nONT,LAX,24\nONT,MCI,302\nONT,MRY,246\nONT,OAK,3697\nONT,OKC,231\nONT,OMA,303\nONT,PDX,60\nONT,PHX,5628\nONT,RNO,273\nONT,SAN,2\nONT,SAT,439\nONT,SEA,1343\nONT,SFO,1599\nONT,SJC,2742\nONT,SLC,1658\nONT,SMF,3803\nONT,TUL,228\nONT,TUS,474\nORD,ABE,1426\nORD,ABQ,754\nORD,ALB,1632\nORD,ANC,561\nORD,ASE,310\nORD,ATL,7449\nORD,ATW,2288\nORD,AUS,2515\nORD,AVP,718\nORD,AZO,2350\nORD,BDL,3335\nORD,BHM,1511\nORD,BIL,105\nORD,BMI,2005\nORD,BNA,3905\nORD,BOI,786\nORD,BOS,7133\nORD,BTR,215\nORD,BTV,738\nORD,BUF,3437\nORD,BWI,3552\nORD,BZN,336\nORD,CAE,1373\nORD,CAK,1047\nORD,CHA,767\nORD,CHS,1337\nORD,CID,4154\nORD,CLE,4567\nORD,CLT,6013\nORD,CMH,4664\nORD,CMI,2404\nORD,COS,1525\nORD,CPR,134\nORD,CRW,708\nORD,CVG,5993\nORD,CWA,1715\nORD,DAL,1007\nORD,DAY,1786\nORD,DBQ,1347\nORD,DCA,7430\nORD,DEN,5773\nORD,DFW,8093\nORD,DSM,4823\nORD,DTW,7602\nORD,EGE,197\nORD,ELP,670\nORD,EVV,1944\nORD,EWR,7174\nORD,FAR,1344\nORD,FCA,104\nORD,FLL,1583\nORD,FNT,1265\nORD,FSD,1724\nORD,FWA,2956\nORD,GEG,327\nORD,GJT,13\nORD,GPT,214\nORD,GRB,3631\nORD,GRR,3699\nORD,GSO,870\nORD,GSP,1302\nORD,GTF,23\nORD,GUC,2\nORD,HDN,200\nORD,HNL,641\nORD,HPN,3624\nORD,HSV,547\nORD,IAD,2891\nORD,IAH,5463\nORD,ICT,3001\nORD,IND,4103\nORD,JAC,463\nORD,JAN,211\nORD,JAX,1697\nORD,JFK,3684\nORD,LAN,1409\nORD,LAS,5257\nORD,LAX,6974\nORD,LEX,1965\nORD,LGA,10770\nORD,LGB,604\nORD,LIT,1806\nORD,LNK,1407\nORD,LSE,1572\nORD,MBS,1339\nORD,MCI,3900\nORD,MCO,3798\nORD,MDT,1552\nORD,MEM,3782\nORD,MHT,1144\nORD,MIA,3343\nORD,MKE,3400\nORD,MLI,2579\nORD,MOB,210\nORD,MQT,313\nORD,MSN,4878\nORD,MSO,105\nORD,MSP,9688\nORD,MSY,1502\nORD,MTJ,30\nORD,OAK,59\nORD,OGG,221\nORD,OKC,1937\nORD,OMA,4097\nORD,ORF,1188\nORD,PBI,656\nORD,PDX,2394\nORD,PHL,6733\nORD,PHX,5124\nORD,PIA,3256\nORD,PIT,3611\nORD,PNS,292\nORD,PSP,451\nORD,PVD,1789\nORD,PWM,343\nORD,RAP,218\nORD,RDU,3140\nORD,RIC,1884\nORD,RNO,365\nORD,ROA,555\nORD,ROC,2550\nORD,RST,2366\nORD,RSW,764\nORD,SAN,3308\nORD,SAT,1713\nORD,SAV,1132\nORD,SBN,2266\nORD,SDF,3496\nORD,SEA,4802\nORD,SFO,5524\nORD,SGF,2306\nORD,SHV,211\nORD,SJC,1333\nORD,SJU,1036\nORD,SLC,2860\nORD,SMF,1077\nORD,SNA,2580\nORD,SPI,1085\nORD,STL,4558\nORD,STT,80\nORD,SYR,2314\nORD,TOL,1337\nORD,TPA,2443\nORD,TUL,2040\nORD,TUS,865\nORD,TVC,2435\nORD,TYS,2017\nORD,VPS,236\nORD,XNA,3116\nORF,ATL,2784\nORF,BDL,1\nORF,BNA,236\nORF,BOI,1\nORF,BOS,197\nORF,BWI,1675\nORF,CLE,2\nORF,CLT,1836\nORF,CVG,499\nORF,DFW,1035\nORF,DTW,968\nORF,EWR,380\nORF,IAD,1057\nORF,IAH,969\nORF,JAX,719\nORF,JFK,277\nORF,LAS,366\nORF,MCO,753\nORF,MDW,731\nORF,MEM,240\nORF,MIA,152\nORF,MSP,123\nORF,ORD,1089\nORF,PBI,1\nORF,SAV,1\nORF,TPA,366\nOTH,PDX,162\nOTH,SFO,353\nOTZ,ANC,361\nOTZ,OME,725\nOXR,LAX,1291\nOXR,PSP,1\nPBI,ATL,4262\nPBI,BDL,373\nPBI,BOS,1746\nPBI,BWI,1353\nPBI,CLE,383\nPBI,CLT,1871\nPBI,CMH,5\nPBI,CVG,390\nPBI,DCA,909\nPBI,DEN,95\nPBI,DFW,854\nPBI,DTW,472\nPBI,EWR,2770\nPBI,HPN,1046\nPBI,IAD,14\nPBI,IAH,1389\nPBI,ISP,1082\nPBI,JFK,2531\nPBI,LAS,62\nPBI,LGA,1934\nPBI,ORD,654\nPBI,PHL,1899\nPBI,PIT,4\nPBI,SWF,359\nPBI,TPA,1365\nPDX,ABQ,366\nPDX,ANC,576\nPDX,ATL,1102\nPDX,BOI,1038\nPDX,BOS,366\nPDX,BUR,60\nPDX,CLT,136\nPDX,CVG,311\nPDX,DEN,4654\nPDX,DFW,1577\nPDX,DTW,250\nPDX,EUG,1551\nPDX,EWR,692\nPDX,GEG,1311\nPDX,HNL,732\nPDX,IAD,367\nPDX,IAH,1265\nPDX,JFK,680\nPDX,LAS,3564\nPDX,LAX,3517\nPDX,LGB,141\nPDX,LMT,162\nPDX,MCI,366\nPDX,MCO,236\nPDX,MDW,894\nPDX,MFR,1543\nPDX,MSN,1\nPDX,MSP,1502\nPDX,OAK,2471\nPDX,OGG,366\nPDX,ONT,60\nPDX,ORD,2184\nPDX,OTH,162\nPDX,PHL,379\nPDX,PHX,3946\nPDX,PSP,168\nPDX,RDM,1621\nPDX,RNO,1150\nPDX,SAN,1352\nPDX,SEA,2449\nPDX,SFO,3088\nPDX,SJC,2322\nPDX,SLC,3277\nPDX,SMF,2484\nPDX,SNA,1421\nPFN,ATL,2548\nPFN,CVG,36\nPFN,MCO,196\nPFN,MEM,1095\nPHF,ATL,4157\nPHF,BOS,716\nPHF,FLL,310\nPHF,LGA,767\nPHF,MCO,361\nPHF,TPA,95\nPHL,ALB,448\nPHL,ATL,6918\nPHL,ATW,1\nPHL,AUS,290\nPHL,AVP,1\nPHL,BDL,521\nPHL,BNA,981\nPHL,BOS,6384\nPHL,BUF,365\nPHL,BWI,660\nPHL,CLE,674\nPHL,CLT,3545\nPHL,CMH,994\nPHL,CVG,1583\nPHL,DCA,584\nPHL,DEN,2961\nPHL,DFW,3485\nPHL,DTW,2760\nPHL,EWR,19\nPHL,FLL,2977\nPHL,GRR,1\nPHL,HOU,687\nPHL,IAD,607\nPHL,IAH,1732\nPHL,ICT,1\nPHL,IND,853\nPHL,JAX,1665\nPHL,JFK,675\nPHL,LAS,2836\nPHL,LAX,2240\nPHL,LGA,4\nPHL,MCO,7032\nPHL,MDW,2652\nPHL,MEM,1032\nPHL,MHT,2357\nPHL,MIA,2206\nPHL,MKE,774\nPHL,MSP,1749\nPHL,MSY,1107\nPHL,ORD,7078\nPHL,ORF,292\nPHL,PBI,1903\nPHL,PDX,380\nPHL,PHX,2885\nPHL,PIT,3188\nPHL,PVD,2550\nPHL,RDU,3347\nPHL,RIC,387\nPHL,RSW,1223\nPHL,SAN,817\nPHL,SAT,290\nPHL,SDF,2\nPHL,SEA,708\nPHL,SFO,2237\nPHL,SJU,1474\nPHL,SLC,670\nPHL,SMF,207\nPHL,STL,578\nPHL,STT,198\nPHL,SYR,334\nPHL,TPA,3390\nPHX,ABQ,5234\nPHX,ANC,366\nPHX,ASE,109\nPHX,ATL,4607\nPHX,AUS,2786\nPHX,BDL,334\nPHX,BFL,1194\nPHX,BHM,367\nPHX,BNA,1123\nPHX,BOI,679\nPHX,BOS,1067\nPHX,BUF,365\nPHX,BUR,4754\nPHX,BWI,2103\nPHX,CLD,43\nPHX,CLE,1115\nPHX,CLT,2183\nPHX,CMH,1096\nPHX,COS,1392\nPHX,CVG,463\nPHX,DCA,1080\nPHX,DEN,8402\nPHX,DFW,5387\nPHX,DRO,811\nPHX,DSM,749\nPHX,DTW,2929\nPHX,ELP,4155\nPHX,EUG,371\nPHX,EWR,2579\nPHX,FAT,1618\nPHX,FLG,1871\nPHX,FLL,620\nPHX,GEG,777\nPHX,GJT,1037\nPHX,HNL,914\nPHX,HOU,1677\nPHX,IAD,731\nPHX,IAH,4197\nPHX,ICT,692\nPHX,IND,1458\nPHX,JFK,2256\nPHX,KOA,330\nPHX,LAS,10337\nPHX,LAX,9992\nPHX,LGB,1624\nPHX,LIH,280\nPHX,LIT,235\nPHX,MCI,2140\nPHX,MCO,1039\nPHX,MDW,2795\nPHX,MEM,816\nPHX,MFR,303\nPHX,MHT,365\nPHX,MIA,366\nPHX,MKE,866\nPHX,MRY,911\nPHX,MSP,3508\nPHX,MSY,365\nPHX,OAK,4150\nPHX,OGG,586\nPHX,OKC,1516\nPHX,OMA,2060\nPHX,ONT,5627\nPHX,ORD,5130\nPHX,PDX,3948\nPHX,PHL,2883\nPHX,PIT,1086\nPHX,PSP,1752\nPHX,PVD,365\nPHX,RDU,755\nPHX,RNO,2776\nPHX,SAN,7609\nPHX,SAT,2783\nPHX,SBA,1618\nPHX,SBP,990\nPHX,SDF,365\nPHX,SEA,5072\nPHX,SFO,4884\nPHX,SJC,4050\nPHX,SLC,7177\nPHX,SMF,4134\nPHX,SNA,5497\nPHX,STL,2755\nPHX,TEX,194\nPHX,TPA,1022\nPHX,TUL,1015\nPHX,TUS,3684\nPHX,YUM,1962\nPIA,ATL,623\nPIA,DEN,362\nPIA,DFW,634\nPIA,DTW,701\nPIA,HPN,1\nPIA,LNK,1\nPIA,ORD,3259\nPIH,SLC,1659\nPIR,JAX,2\nPIR,MSP,3\nPIT,ATL,4557\nPIT,BOS,616\nPIT,BWI,1043\nPIT,CLT,2376\nPIT,CVG,1288\nPIT,DCA,7\nPIT,DEN,859\nPIT,DFW,2140\nPIT,DTW,1511\nPIT,EWR,671\nPIT,FLL,507\nPIT,GRB,1\nPIT,IAD,780\nPIT,IAH,1719\nPIT,JFK,2249\nPIT,LAS,1411\nPIT,LAX,373\nPIT,LGA,936\nPIT,MCI,266\nPIT,MCO,2470\nPIT,MDW,2070\nPIT,MEM,1005\nPIT,MIA,174\nPIT,MKE,1083\nPIT,MSP,1050\nPIT,ORD,3521\nPIT,PBI,4\nPIT,PHL,4169\nPIT,PHX,1086\nPIT,RSW,181\nPIT,SFO,369\nPIT,SJU,1\nPIT,SLC,218\nPIT,TPA,1089\nPLN,DCA,1\nPLN,DTW,263\nPMD,SFO,728\nPNS,ATL,4430\nPNS,CLT,372\nPNS,DFW,2024\nPNS,FLL,145\nPNS,IAH,635\nPNS,MCO,366\nPNS,MEM,1097\nPNS,ORD,293\nPNS,TPA,135\nPSC,DEN,940\nPSC,SLC,1600\nPSC,TWF,1\nPSE,EWR,17\nPSE,FLL,45\nPSE,JFK,346\nPSE,MCO,347\nPSG,JNU,364\nPSG,WRG,363\nPSP,DEN,998\nPSP,DFW,1096\nPSP,FAT,1\nPSP,GJT,1\nPSP,IAH,216\nPSP,LAS,1281\nPSP,LAX,2597\nPSP,MSP,214\nPSP,ONT,1\nPSP,ORD,452\nPSP,PDX,169\nPSP,PHX,1752\nPSP,SEA,664\nPSP,SFO,1638\nPSP,SLC,898\nPSP,TWF,1\nPUB,COS,2\nPVD,ATL,1390\nPVD,BDL,1\nPVD,BNA,366\nPVD,BOS,3\nPVD,BWI,3981\nPVD,CLE,360\nPVD,CLT,1439\nPVD,CVG,958\nPVD,DCA,672\nPVD,DTW,1105\nPVD,EWR,1102\nPVD,FLL,425\nPVD,IAD,511\nPVD,JFK,604\nPVD,LAS,364\nPVD,MCO,2148\nPVD,MDW,1373\nPVD,MSP,6\nPVD,ORD,1792\nPVD,PHL,2563\nPVD,PHX,365\nPVD,TPA,981\nPWM,ATL,904\nPWM,BOS,2\nPWM,BWI,995\nPWM,CLE,306\nPWM,CLT,277\nPWM,CVG,563\nPWM,DTW,67\nPWM,EWR,741\nPWM,IAD,407\nPWM,JFK,1818\nPWM,MCO,459\nPWM,MSP,42\nPWM,ORD,316\nRAP,DEN,2309\nRAP,MSP,877\nRAP,ORD,217\nRAP,SLC,757\nRAP,TWF,1\nRDD,SBA,1\nRDD,SFO,1680\nRDD,SMF,1\nRDM,DEN,12\nRDM,IDA,1\nRDM,PDX,1619\nRDM,SFO,1083\nRDM,SLC,719\nRDU,ATL,5418\nRDU,AUS,231\nRDU,BDL,1149\nRDU,BHM,160\nRDU,BNA,1617\nRDU,BOS,3870\nRDU,BWI,2078\nRDU,CLE,307\nRDU,CLT,2339\nRDU,CMH,500\nRDU,CVG,1317\nRDU,DCA,2772\nRDU,DEN,470\nRDU,DFW,2347\nRDU,DTW,1368\nRDU,EWR,2394\nRDU,FLL,696\nRDU,GRB,1\nRDU,IAD,1722\nRDU,IAH,1995\nRDU,IND,673\nRDU,JAX,595\nRDU,JFK,3989\nRDU,LAS,715\nRDU,LAX,8\nRDU,LGA,4135\nRDU,MCI,652\nRDU,MCO,1738\nRDU,MDW,1360\nRDU,MEM,1062\nRDU,MIA,1098\nRDU,MKE,490\nRDU,MSP,726\nRDU,MSY,474\nRDU,ORD,3094\nRDU,PHL,3363\nRDU,PHX,755\nRDU,SAT,229\nRDU,SDF,426\nRDU,SLC,327\nRDU,STL,358\nRDU,TPA,1057\nRDU,XNA,104\nRFD,DEN,290\nRHI,MSP,221\nRIC,ATL,4536\nRIC,BOS,688\nRIC,CLE,905\nRIC,CLT,1800\nRIC,CVG,779\nRIC,DCA,2\nRIC,DFW,1041\nRIC,DTW,700\nRIC,EWR,1576\nRIC,FLL,366\nRIC,IAH,971\nRIC,JAX,1\nRIC,JFK,1703\nRIC,LGA,1337\nRIC,MCO,515\nRIC,MEM,292\nRIC,MIA,152\nRIC,MSP,340\nRIC,ORD,1884\nRIC,ORF,1\nRIC,PHL,387\nRIC,RDU,1\nRKS,DEN,545\nRKS,GCC,58\nRKS,SLC,351\nRNO,ATL,169\nRNO,BOI,1025\nRNO,BUR,1\nRNO,DEN,1353\nRNO,DFW,1095\nRNO,GEG,214\nRNO,IAH,428\nRNO,LAS,4508\nRNO,LAX,1905\nRNO,LGB,464\nRNO,MDW,365\nRNO,OAK,1322\nRNO,ONT,273\nRNO,ORD,365\nRNO,PDX,1144\nRNO,PHX,2779\nRNO,PIH,1\nRNO,SAN,730\nRNO,SEA,799\nRNO,SFO,1886\nRNO,SJC,1364\nRNO,SLC,1814\nRNO,SNA,60\nRNO,TUS,222\nROA,ATL,1731\nROA,BWI,1\nROA,CLT,1\nROA,CVG,2\nROA,DTW,748\nROA,IAD,601\nROA,MSN,1\nROA,ORD,635\nROC,ATL,2488\nROC,BOS,1\nROC,BWI,865\nROC,CLE,921\nROC,CLT,412\nROC,CVG,724\nROC,DFW,177\nROC,DTW,864\nROC,EWR,933\nROC,FLL,114\nROC,IAD,560\nROC,JFK,2435\nROC,LAS,84\nROC,MCO,700\nROC,MSP,136\nROC,ORD,2484\nROC,TPA,366\nROW,DFW,961\nRST,DTW,171\nRST,MSP,817\nRST,ORD,2365\nRSW,ATL,4196\nRSW,BDL,134\nRSW,BOS,1716\nRSW,BUF,376\nRSW,BWI,1335\nRSW,CAK,138\nRSW,CLE,594\nRSW,CLT,1765\nRSW,CMH,137\nRSW,CVG,539\nRSW,DCA,708\nRSW,DEN,222\nRSW,DFW,919\nRSW,DTW,1144\nRSW,EWR,1874\nRSW,FNT,149\nRSW,HPN,520\nRSW,IAD,14\nRSW,IAH,1066\nRSW,IND,1057\nRSW,ISP,374\nRSW,JFK,1890\nRSW,LGA,237\nRSW,MCI,5\nRSW,MCO,1414\nRSW,MDW,1096\nRSW,MEM,58\nRSW,MIA,2\nRSW,MKE,225\nRSW,MSP,647\nRSW,ORD,763\nRSW,PBI,1\nRSW,PHL,1223\nRSW,PIT,181\nRSW,STL,417\nSAN,ABQ,1054\nSAN,ATL,2855\nSAN,AUS,715\nSAN,BFL,224\nSAN,BNA,727\nSAN,BOI,475\nSAN,BOS,610\nSAN,BWI,729\nSAN,CLE,87\nSAN,CLT,704\nSAN,COS,476\nSAN,CVG,573\nSAN,DEN,5263\nSAN,DFW,3528\nSAN,DTW,580\nSAN,ELP,366\nSAN,EWR,1180\nSAN,FAT,582\nSAN,GEG,452\nSAN,HNL,393\nSAN,HOU,422\nSAN,IAD,1331\nSAN,IAH,2388\nSAN,JFK,1630\nSAN,KOA,23\nSAN,LAS,5902\nSAN,LAX,11224\nSAN,LIH,31\nSAN,MCI,686\nSAN,MCO,13\nSAN,MDW,1708\nSAN,MEM,109\nSAN,MKE,106\nSAN,MRY,446\nSAN,MSP,1333\nSAN,OAK,5831\nSAN,OGG,279\nSAN,OKC,305\nSAN,OMA,317\nSAN,ONT,3\nSAN,ORD,2948\nSAN,PDX,1352\nSAN,PHL,817\nSAN,PHX,7581\nSAN,RNO,729\nSAN,SAT,643\nSAN,SEA,2831\nSAN,SFO,6769\nSAN,SJC,5286\nSAN,SLC,2549\nSAN,SMF,4603\nSAN,STL,366\nSAN,TUL,228\nSAN,TUS,1413\nSAT,ABQ,426\nSAT,AMA,1\nSAT,ATL,3241\nSAT,AUS,2\nSAT,BNA,676\nSAT,BWI,730\nSAT,CLE,233\nSAT,CLT,658\nSAT,CVG,882\nSAT,DAL,4999\nSAT,DEN,2510\nSAT,DFW,5413\nSAT,DTW,642\nSAT,ELP,1332\nSAT,EWR,954\nSAT,HOU,2582\nSAT,HRL,656\nSAT,IAD,149\nSAT,IAH,3755\nSAT,IND,236\nSAT,LAS,1575\nSAT,LAX,1783\nSAT,MCI,578\nSAT,MCO,744\nSAT,MDW,710\nSAT,MEM,788\nSAT,MGM,1\nSAT,MSP,191\nSAT,MSY,430\nSAT,OKC,87\nSAT,ONT,441\nSAT,ORD,1815\nSAT,PHL,290\nSAT,PHX,2767\nSAT,RDU,228\nSAT,SAN,646\nSAT,SFO,366\nSAT,SLC,587\nSAT,SMF,226\nSAT,STL,246\nSAT,TPA,365\nSAT,TUL,89\nSAT,TUS,240\nSAV,ATL,3888\nSAV,BOS,89\nSAV,CHS,1\nSAV,CLE,321\nSAV,CLT,1433\nSAV,CVG,731\nSAV,DFW,795\nSAV,DTW,509\nSAV,EWR,1127\nSAV,IAD,1007\nSAV,IAH,949\nSAV,JAX,3\nSAV,LGA,996\nSAV,MEM,764\nSAV,MSP,27\nSAV,ORD,1134\nSBA,DEN,840\nSBA,DFW,366\nSBA,LAS,305\nSBA,LAX,4498\nSBA,MRY,1\nSBA,PHX,1617\nSBA,SBP,1\nSBA,SFO,3047\nSBA,SJC,1208\nSBA,SLC,685\nSBN,ATL,1039\nSBN,CVG,12\nSBN,DTW,1638\nSBN,MSP,365\nSBN,ORD,2265\nSBP,FAT,1\nSBP,LAS,128\nSBP,LAX,2682\nSBP,MFR,1\nSBP,MRY,2\nSBP,PHX,990\nSBP,SFO,1758\nSBP,SLC,284\nSCC,ANC,363\nSCC,BRW,364\nSCE,ATL,122\nSCE,CVG,23\nSCE,DTW,500\nSDF,ATL,2756\nSDF,BHM,674\nSDF,BOS,81\nSDF,BWI,1483\nSDF,CLE,728\nSDF,CLT,795\nSDF,CVG,639\nSDF,DEN,384\nSDF,DFW,1386\nSDF,DTW,1011\nSDF,EWR,1037\nSDF,IAH,361\nSDF,LAS,365\nSDF,LGA,572\nSDF,MCO,533\nSDF,MDW,1685\nSDF,MEM,787\nSDF,MIA,366\nSDF,MKE,257\nSDF,MSP,780\nSDF,ORD,3497\nSDF,PHL,2\nSDF,PHX,365\nSDF,RDU,426\nSDF,SLC,3\nSDF,SPI,1\nSDF,STL,995\nSDF,TPA,489\nSEA,ABQ,708\nSEA,ANC,6256\nSEA,ATL,2571\nSEA,AUS,147\nSEA,BNA,364\nSEA,BOI,1070\nSEA,BOS,980\nSEA,BUR,1390\nSEA,BWI,242\nSEA,CLE,229\nSEA,CLT,480\nSEA,CVG,791\nSEA,DCA,727\nSEA,DEN,6623\nSEA,DFW,3917\nSEA,DTW,1172\nSEA,EWR,2026\nSEA,FAI,956\nSEA,GEG,4346\nSEA,HNL,1638\nSEA,IAD,1097\nSEA,IAH,2395\nSEA,IND,75\nSEA,JFK,1852\nSEA,JNU,1334\nSEA,KOA,45\nSEA,KTN,1289\nSEA,LAS,5051\nSEA,LAX,6865\nSEA,LGB,1500\nSEA,LIH,366\nSEA,MCI,365\nSEA,MCO,731\nSEA,MDW,1361\nSEA,MEM,350\nSEA,MIA,366\nSEA,MKE,121\nSEA,MSP,2474\nSEA,OAK,5095\nSEA,OGG,900\nSEA,ONT,1343\nSEA,ORD,4608\nSEA,PDX,2449\nSEA,PHL,707\nSEA,PHX,5062\nSEA,PSP,667\nSEA,RNO,802\nSEA,SAN,2833\nSEA,SFO,5409\nSEA,SIT,104\nSEA,SJC,3534\nSEA,SLC,3774\nSEA,SMF,3642\nSEA,SNA,2860\nSEA,STL,567\nSEA,TUS,443\nSFO,ABQ,529\nSFO,ACV,2337\nSFO,ANC,182\nSFO,ASE,59\nSFO,ATL,3098\nSFO,AUS,609\nSFO,BFL,941\nSFO,BOI,1766\nSFO,BOS,2594\nSFO,BUR,1962\nSFO,BWI,366\nSFO,BZN,28\nSFO,CEC,705\nSFO,CIC,1392\nSFO,CLE,466\nSFO,CLT,1429\nSFO,COS,364\nSFO,CVG,782\nSFO,DEN,5374\nSFO,DFW,3487\nSFO,DTW,1160\nSFO,EUG,1923\nSFO,EWR,3137\nSFO,FAT,2410\nSFO,FCA,12\nSFO,GJT,2\nSFO,HNL,2359\nSFO,IAD,2732\nSFO,IAH,2660\nSFO,IDA,1\nSFO,IND,173\nSFO,JFK,6971\nSFO,KOA,713\nSFO,LAS,7007\nSFO,LAX,13788\nSFO,LGB,209\nSFO,LIH,483\nSFO,LMT,348\nSFO,MCO,366\nSFO,MDW,1092\nSFO,MEM,208\nSFO,MFR,2570\nSFO,MIA,1098\nSFO,MKE,115\nSFO,MOD,1665\nSFO,MRY,2410\nSFO,MSO,12\nSFO,MSP,1984\nSFO,OGG,932\nSFO,ONT,1600\nSFO,ORD,5746\nSFO,OTH,354\nSFO,PDX,2972\nSFO,PHL,2554\nSFO,PHX,4870\nSFO,PIT,369\nSFO,PMD,728\nSFO,PSP,1636\nSFO,RDD,1683\nSFO,RDM,1082\nSFO,RNO,1885\nSFO,SAN,6312\nSFO,SAT,366\nSFO,SBA,2991\nSFO,SBP,1751\nSFO,SEA,5414\nSFO,SJC,1\nSFO,SLC,4064\nSFO,SMF,2301\nSFO,SMX,2\nSFO,SNA,3955\nSFO,STL,574\nSFO,TUS,365\nSFO,TWF,2\nSGF,ATL,1170\nSGF,BNA,2\nSGF,CVG,247\nSGF,DEN,777\nSGF,DFW,3228\nSGF,DTW,363\nSGF,FSD,1\nSGF,MEM,1079\nSGF,MSP,360\nSGF,ORD,2492\nSGF,STL,368\nSGU,CDC,1\nSGU,LAX,721\nSGU,PIH,1\nSGU,PSP,1\nSGU,SLC,2594\nSGU,TWF,1\nSHV,ATL,1817\nSHV,DFW,3579\nSHV,DTW,360\nSHV,IAH,1018\nSHV,MEM,1094\nSHV,ORD,211\nSIT,JNU,740\nSIT,KTN,365\nSIT,SEA,227\nSJC,ATL,634\nSJC,AUS,968\nSJC,BFL,1\nSJC,BOS,256\nSJC,BUR,3380\nSJC,DEN,3670\nSJC,DFW,2264\nSJC,EWR,200\nSJC,FAT,1\nSJC,HNL,366\nSJC,IAD,245\nSJC,IAH,994\nSJC,JFK,481\nSJC,LAS,4176\nSJC,LAX,8939\nSJC,LGB,660\nSJC,MDW,659\nSJC,MSP,695\nSJC,ONT,2719\nSJC,ORD,1348\nSJC,PDX,2322\nSJC,PHX,4027\nSJC,RNO,1371\nSJC,SAN,5254\nSJC,SBA,1206\nSJC,SEA,3543\nSJC,SFO,1\nSJC,SLC,1372\nSJC,SMX,1\nSJC,SNA,5383\nSJT,DFW,1316\nSJU,ATL,1872\nSJU,BDL,366\nSJU,BOS,1273\nSJU,BWI,318\nSJU,CLE,43\nSJU,CLT,795\nSJU,DFW,986\nSJU,DTW,172\nSJU,EWR,1582\nSJU,FLL,764\nSJU,IAD,844\nSJU,IAH,730\nSJU,JFK,3558\nSJU,LAX,144\nSJU,MCO,2415\nSJU,MEM,26\nSJU,MIA,2560\nSJU,MSP,26\nSJU,ORD,1115\nSJU,PHL,1475\nSJU,PIT,1\nSJU,STT,245\nSJU,TPA,366\nSLC,ABQ,2293\nSLC,ACV,389\nSLC,ANC,478\nSLC,ASE,443\nSLC,ATL,2866\nSLC,AUS,550\nSLC,BFL,371\nSLC,BHM,5\nSLC,BIL,1953\nSLC,BLI,120\nSLC,BNA,114\nSLC,BOI,3370\nSLC,BOS,707\nSLC,BTM,704\nSLC,BUR,1674\nSLC,BWI,728\nSLC,BZN,2029\nSLC,CDC,666\nSLC,CLE,348\nSLC,CLT,211\nSLC,CMH,290\nSLC,COD,706\nSLC,COS,1073\nSLC,CPR,1006\nSLC,CVG,1620\nSLC,CYS,1\nSLC,DCA,365\nSLC,DEN,9269\nSLC,DFW,3149\nSLC,DRO,386\nSLC,DSM,3\nSLC,DTW,573\nSLC,EKO,1579\nSLC,ELP,120\nSLC,EUG,714\nSLC,EWR,812\nSLC,FAI,80\nSLC,FAR,95\nSLC,FAT,849\nSLC,FCA,1742\nSLC,FLL,242\nSLC,FSD,7\nSLC,GCC,293\nSLC,GEG,1947\nSLC,GJT,1062\nSLC,GTF,1050\nSLC,GUC,14\nSLC,HDN,373\nSLC,HLN,1215\nSLC,HNL,366\nSLC,IAD,523\nSLC,IAH,2698\nSLC,IDA,1788\nSLC,JAC,1485\nSLC,JFK,1784\nSLC,LAS,5373\nSLC,LAX,5178\nSLC,LBB,1\nSLC,LGA,24\nSLC,LGB,2499\nSLC,LIT,18\nSLC,LWS,652\nSLC,MCI,1051\nSLC,MCO,687\nSLC,MDW,997\nSLC,MFR,726\nSLC,MKE,5\nSLC,MRY,6\nSLC,MSO,1845\nSLC,MSP,2191\nSLC,MSY,328\nSLC,MTJ,229\nSLC,OAK,3134\nSLC,OGD,1\nSLC,OGG,261\nSLC,OKC,740\nSLC,OMA,605\nSLC,ONT,1661\nSLC,ORD,2863\nSLC,PDX,3289\nSLC,PHL,671\nSLC,PHX,7168\nSLC,PIH,1660\nSLC,PIT,217\nSLC,PSC,1602\nSLC,PSP,901\nSLC,RAP,757\nSLC,RDM,720\nSLC,RDU,328\nSLC,RKS,349\nSLC,RNO,1817\nSLC,SAN,2548\nSLC,SAT,587\nSLC,SBA,688\nSLC,SBP,285\nSLC,SDF,2\nSLC,SEA,3771\nSLC,SFO,3705\nSLC,SGF,1\nSLC,SGU,2594\nSLC,SJC,1372\nSLC,SLE,484\nSLC,SMF,1660\nSLC,SNA,2016\nSLC,STL,1386\nSLC,SUN,2903\nSLC,TPA,329\nSLC,TUL,602\nSLC,TUS,1485\nSLC,TWF,1772\nSLC,WYS,264\nSLC,XNA,4\nSLC,YKM,338\nSLC,YUM,440\nSLE,SLC,484\nSLE,TWF,2\nSMF,ABQ,466\nSMF,ACV,616\nSMF,ATL,682\nSMF,BFL,229\nSMF,BUR,3466\nSMF,CLT,76\nSMF,COS,426\nSMF,DEN,3327\nSMF,DFW,1347\nSMF,GEG,371\nSMF,HNL,366\nSMF,IAD,366\nSMF,IAH,1085\nSMF,JFK,342\nSMF,LAS,4064\nSMF,LAX,5717\nSMF,LGB,729\nSMF,MCI,306\nSMF,MDW,683\nSMF,MSP,810\nSMF,OGG,59\nSMF,OKC,229\nSMF,ONT,3814\nSMF,ORD,1077\nSMF,PDX,2482\nSMF,PHL,207\nSMF,PHX,4115\nSMF,RDD,1\nSMF,SAN,4573\nSMF,SAT,228\nSMF,SBA,1\nSMF,SEA,3638\nSMF,SFO,2300\nSMF,SLC,1660\nSMF,SNA,2503\nSMF,TUL,228\nSMF,TUS,467\nSMX,LAX,1681\nSNA,ATL,1463\nSNA,AUS,246\nSNA,CVG,285\nSNA,DEN,3326\nSNA,DFW,3656\nSNA,EWR,954\nSNA,HNL,64\nSNA,IAH,1826\nSNA,KOA,36\nSNA,LAS,4130\nSNA,LAX,33\nSNA,LIH,23\nSNA,MSP,1036\nSNA,OAK,3652\nSNA,OGG,60\nSNA,ORD,2554\nSNA,PDX,1418\nSNA,PHX,5477\nSNA,RNO,60\nSNA,SAN,1\nSNA,SEA,2862\nSNA,SFO,3994\nSNA,SJC,5401\nSNA,SLC,2015\nSNA,SMF,2498\nSNA,STL,306\nSPI,IAD,142\nSPI,ORD,1083\nSPS,DFW,1834\nSRQ,ATL,3327\nSRQ,BOS,23\nSRQ,BWI,245\nSRQ,CLE,118\nSRQ,CLT,207\nSRQ,CVG,445\nSRQ,DCA,12\nSRQ,DTW,219\nSRQ,EWR,399\nSRQ,IAH,70\nSRQ,IND,155\nSRQ,JFK,534\nSRQ,LGA,74\nSRQ,MDW,565\nSRQ,STL,37\nSRQ,TPA,2\nSTL,ABQ,366\nSTL,ATL,3956\nSTL,AUS,95\nSTL,BHM,366\nSTL,BNA,258\nSTL,BOS,865\nSTL,BWI,1676\nSTL,CLE,916\nSTL,CLT,1093\nSTL,CMH,674\nSTL,CVG,346\nSTL,DAL,2718\nSTL,DCA,1296\nSTL,DEN,2430\nSTL,DFW,3597\nSTL,DTW,2455\nSTL,EWR,1725\nSTL,FLL,472\nSTL,HOU,1340\nSTL,IAH,1003\nSTL,JFK,795\nSTL,LAS,1651\nSTL,LAX,1687\nSTL,LGA,1603\nSTL,LIT,666\nSTL,MCI,1785\nSTL,MCO,2421\nSTL,MDW,3755\nSTL,MEM,1048\nSTL,MIA,731\nSTL,MKE,321\nSTL,MSP,1696\nSTL,OKC,687\nSTL,OMA,1043\nSTL,ORD,4256\nSTL,PHL,576\nSTL,PHX,2763\nSTL,RDU,357\nSTL,RSW,417\nSTL,SAN,366\nSTL,SAT,246\nSTL,SDF,994\nSTL,SEA,566\nSTL,SFO,574\nSTL,SGF,366\nSTL,SLC,1386\nSTL,SNA,305\nSTL,SRQ,38\nSTL,TPA,1088\nSTL,TUL,899\nSTT,ATL,451\nSTT,BOS,88\nSTT,CLT,418\nSTT,EWR,232\nSTT,JFK,366\nSTT,LGA,9\nSTT,MIA,732\nSTT,PHL,198\nSTT,SJU,478\nSTX,ATL,64\nSTX,CLT,20\nSTX,JAX,2\nSTX,MGM,1\nSTX,MIA,349\nSUN,SLC,2870\nSUN,TWF,1\nSUX,MSP,122\nSWF,ATL,1617\nSWF,BDL,1\nSWF,BOS,1\nSWF,DTW,724\nSWF,FLL,476\nSWF,MCO,835\nSWF,PBI,360\nSWF,TPA,235\nSYR,ATL,1419\nSYR,CAK,1\nSYR,CLE,686\nSYR,CLT,746\nSYR,CVG,831\nSYR,DCA,313\nSYR,DFW,178\nSYR,DTW,1015\nSYR,EWR,1002\nSYR,FLL,328\nSYR,IAD,622\nSYR,JFK,1825\nSYR,MCO,391\nSYR,ORD,2342\nSYR,PHL,333\nTEX,PHX,194\nTLH,ATL,2484\nTLH,CLT,240\nTLH,FLL,261\nTLH,IAH,482\nTLH,MCO,219\nTLH,MEM,1094\nTLH,MIA,831\nTLH,TPA,301\nTOL,ATL,120\nTOL,CVG,21\nTOL,ORD,1337\nTPA,ABQ,366\nTPA,ALB,391\nTPA,ATL,7313\nTPA,AUS,367\nTPA,BDL,1266\nTPA,BHM,1052\nTPA,BNA,1695\nTPA,BOS,1782\nTPA,BUF,728\nTPA,BWI,3402\nTPA,CAK,359\nTPA,CLE,874\nTPA,CLT,2825\nTPA,CMH,973\nTPA,CVG,1101\nTPA,DAY,204\nTPA,DCA,1554\nTPA,DEN,1692\nTPA,DFW,2804\nTPA,DTW,1452\nTPA,EWR,2837\nTPA,FLL,3051\nTPA,FNT,200\nTPA,GPT,366\nTPA,HOU,1411\nTPA,HPN,60\nTPA,IAD,1906\nTPA,IAH,1962\nTPA,IND,1578\nTPA,ISP,1093\nTPA,JAX,1006\nTPA,JFK,3395\nTPA,LAS,1178\nTPA,LAX,519\nTPA,LGA,1465\nTPA,MCI,699\nTPA,MCO,1\nTPA,MDW,2218\nTPA,MEM,860\nTPA,MHT,741\nTPA,MIA,1829\nTPA,MKE,178\nTPA,MSP,1005\nTPA,MSY,1088\nTPA,ORD,2288\nTPA,ORF,366\nTPA,PBI,1353\nTPA,PHF,95\nTPA,PHL,3380\nTPA,PHX,1022\nTPA,PIT,1096\nTPA,PNS,136\nTPA,PVD,981\nTPA,RDU,1067\nTPA,ROC,366\nTPA,SAT,365\nTPA,SDF,488\nTPA,SJU,366\nTPA,SLC,329\nTPA,STL,1099\nTPA,SWF,235\nTPA,TLH,301\nTRI,ATL,1808\nTRI,CLT,16\nTRI,CVG,249\nTRI,MEM,44\nTUL,ABQ,229\nTUL,ASE,1\nTUL,ATL,1980\nTUL,AUS,90\nTUL,CVG,883\nTUL,DAL,2284\nTUL,DEN,1631\nTUL,DFW,3260\nTUL,DTW,726\nTUL,EWR,344\nTUL,GJT,2\nTUL,HOU,1300\nTUL,IAH,2319\nTUL,LAS,391\nTUL,LAX,73\nTUL,MCI,806\nTUL,MCO,9\nTUL,MEM,1094\nTUL,MSP,717\nTUL,OKC,1\nTUL,OMA,1\nTUL,ONT,227\nTUL,ORD,2038\nTUL,PHX,1021\nTUL,PIA,1\nTUL,SAN,228\nTUL,SAT,88\nTUL,SLC,599\nTUL,SMF,225\nTUL,STL,890\nTUL,XNA,1\nTUP,ATL,10\nTUS,ABQ,718\nTUS,ATL,667\nTUS,AUS,229\nTUS,CLT,207\nTUS,DEN,2029\nTUS,DFW,2676\nTUS,ELP,88\nTUS,EWR,186\nTUS,GEG,151\nTUS,IAD,112\nTUS,IAH,1669\nTUS,JFK,132\nTUS,LAS,2242\nTUS,LAX,4190\nTUS,MCI,230\nTUS,MDW,723\nTUS,MSP,439\nTUS,OAK,306\nTUS,OMA,221\nTUS,ONT,477\nTUS,ORD,865\nTUS,PHX,3474\nTUS,PSP,1\nTUS,RNO,219\nTUS,SAN,1412\nTUS,SAT,239\nTUS,SEA,444\nTUS,SFO,365\nTUS,SLC,1485\nTUS,SMF,465\nTVC,CVG,129\nTVC,DEN,89\nTVC,DTW,1210\nTVC,LGA,50\nTVC,MSN,1\nTVC,MSP,347\nTVC,ORD,2436\nTWF,BOI,1\nTWF,SLC,1810\nTWF,SUN,2\nTXK,DFW,1250\nTYR,DFW,1585\nTYS,ATL,2431\nTYS,AUS,3\nTYS,CLE,511\nTYS,CVG,954\nTYS,DEN,511\nTYS,DFW,1506\nTYS,DTW,1424\nTYS,EWR,651\nTYS,IAD,96\nTYS,IAH,1344\nTYS,LGA,603\nTYS,MCI,1\nTYS,MCO,125\nTYS,MEM,1460\nTYS,MSP,365\nTYS,ORD,2019\nVLD,ATL,938\nVPS,ATL,3045\nVPS,CVG,103\nVPS,DFW,1968\nVPS,IAH,421\nVPS,LGA,2\nVPS,MEM,1045\nVPS,ORD,236\nWRG,KTN,363\nWRG,PSG,364\nWYS,SLC,264\nXNA,ATL,1768\nXNA,BHM,1\nXNA,CAK,1\nXNA,COS,1\nXNA,CVG,101\nXNA,DCA,209\nXNA,DEN,685\nXNA,DFW,2781\nXNA,DTW,361\nXNA,EWR,545\nXNA,FAR,1\nXNA,IAH,1435\nXNA,LAX,358\nXNA,LEX,1\nXNA,LGA,766\nXNA,MEM,1044\nXNA,MIA,154\nXNA,MSP,676\nXNA,ORD,3114\nXNA,RDU,104\nXNA,RFD,1\nXNA,SGF,1\nXNA,SLC,4\nYAK,CDV,363\nYAK,JNU,362\nYKM,SLC,340\nYUM,GJT,1\nYUM,IPL,326\nYUM,LAS,99\nYUM,LAX,1044\nYUM,PHX,1961\nYUM,SLC,440\n";
const R = 6371;
function computeDistance(coords1, coords2) {
  const long1 = toRadian(coords1.longitude);
  const lat1 = toRadian(coords1.latitude);
  const long2 = toRadian(coords2.longitude);
  const lat2 = toRadian(coords2.latitude);
  const longSquareSin = Math.sin((long2 - long1) / 2) ** 2;
  const latSquareSin = Math.sin((lat2 - lat1) / 2) ** 2;
  const d = 2 * R * Math.asin(Math.sqrt(latSquareSin + Math.cos(lat1) * Math.cos(lat2) * longSquareSin));
  return d;
}
const RAD = Math.PI / 180;
function toRadian(deg) {
  return deg * RAD;
}
let preparedData = null;
function prepare() {
  const airports = csvParse(airportsString);
  const flights = csvParse(flightsString);
  const airportMap = new Map(airports.map((airport) => [airport.iata, airport]));
  for (const flight of flights) {
    const origAirport = airportMap.get(flight.origin);
    const destAirport = airportMap.get(flight.destination);
    flight.distance = computeDistance(origAirport, destAirport);
  }
  preparedData = { flights, airportMap };
}
const ROOT = document.getElementById("chart");
const opaqueCheckBox = document.getElementById("opaque-color");
let currentChart = null;
function drawScattered(data) {
  if (!preparedData)
    throw new Error("Please prepare the data first.");
  reset();
  currentChart = new Chart(ROOT, {
    type: "scatter",
    data: {
      datasets: [
        {
          data: preparedData.flights,
          backgroundColor: opaqueCheckBox.checked ? "rgb(0, 125, 255)" : "rgba(0, 125, 255, .20)"
        }
      ]
    },
    options: {
      animation: false,
      parsing: {
        xAxisKey: "distance",
        yAxisKey: "count"
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Number of flights for a distance",
          position: "bottom"
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: (item) => {
              const orig = preparedData.airportMap.get(item.raw.origin);
              const dest = preparedData.airportMap.get(item.raw.destination);
              const result = `✈ ${orig.name} (${orig.iata}) → ${dest.name} (${dest.iata}): ${Math.round(item.raw.distance)} km`;
              return result;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            text: "distance →",
            align: "end",
            display: true
          },
          ticks: {
            format: {
              style: "unit",
              unit: "kilometer"
            }
          }
        },
        y: {
          type: "logarithmic",
          title: {
            text: "# of flights →",
            align: "end",
            display: true
          }
        }
      }
    }
  });
}
function openTooltip() {
  if (!currentChart)
    throw new Error("No chart is present, please draw a chart first");
  const renderedDataset = currentChart.getDatasetMeta(0);
  const node = currentChart.canvas;
  const rect = node.getBoundingClientRect();
  const point = renderedDataset.data[2426];
  const event = new MouseEvent("mousemove", {
    clientX: rect.left + point.x,
    clientY: rect.top + point.y,
    cancelable: true,
    bubbles: true
  });
  node.dispatchEvent(event);
}
function reset() {
  if (currentChart) {
    currentChart.destroy();
    currentChart = null;
  }
}
async function runAllTheThings() {
  [
    // Force prettier to use a multiline formatting
    "prepare",
    "add-scatter-chart-button",
    "open-tooltip"
  ].forEach((id) => document.getElementById(id).click());
}
document.getElementById("prepare").addEventListener("click", prepare);
document.getElementById("add-scatter-chart-button").addEventListener("click", drawScattered);
document.getElementById("open-tooltip").addEventListener("click", openTooltip);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("run-all").addEventListener("click", runAllTheThings);
window.name = "charts-chartjs";
window.version = "1.0.0";
function triggerEvent(t, e, n) {
  const a = new CustomEvent(e);
  a.name = e, a.state = n, t.dispatchEvent(a);
}
const pushState = history.pushState;
history.pushState = function(t) {
  const e = pushState.apply(history, arguments);
  return triggerEvent(window, "pushstate", t), triggerEvent(window, "statechange", t), e;
};
const replaceState = history.replaceState;
history.replaceState = function(t) {
  const e = replaceState.apply(history, arguments);
  return triggerEvent(window, "replacestate", t), triggerEvent(window, "statechange", t), e;
}, window.addEventListener("popstate", function(t) {
  triggerEvent(window, "statechange", t.state);
});
const appId = window.name && window.version ? `${window.name}-${window.version}` : -1;
window.onmessage = async (t) => {
  if (t.data.id !== appId || "benchmark-connector" !== t.data.type)
    return;
  const { name: e } = t.data, n = new Function(`return ${t.data.fn}`)();
  n && (requestAnimationFrame(() => {
    performance.mark(`${e}-start`);
  }), requestAnimationFrame(async () => {
    await n(), setTimeout(() => {
      performance.mark(`${e}-end`), performance.measure(`${e}`, { start: `${e}-start`, end: `${e}-end` });
      const t2 = JSON.stringify(performance.getEntriesByName(`${e}`)[0]);
      window.top.postMessage({ type: "test-completed", status: "success", result: t2 }, "*");
    }, 0);
  }));
}, window.top.postMessage({ type: "app-ready", status: "success", appId }, "*"), console.log(`Hello, benchmark connector for ${appId} is ready!`);
//# sourceMappingURL=index-22f68d6d.js.map
