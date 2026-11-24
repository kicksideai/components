let Rr = [], na = [];
(() => {
  let n = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,1n,9,16,o,,x,1i,3,,i,,7,a,2,t,3,1k,,,7,2,2,2,3,9,,a,2,q,,2,3,1k,,,5,4,2,2,3,3,,u,2,3,,b,3,1k,,,8,,3,,3,k,2,m,6,,3,1k,,,7,2,2,2,3,7,3,a,2,u,,1n,5,3,3,,4,9,,14,5,1j,,,7,,3,,4,7,2,b,2,t,3,1k,,,7,,3,,4,7,2,b,2,f,,c,4,1j,2,,7,,3,,4,9,,a,2,t,3,1y,,4,6,,,,8,i,2,1p,,,8,c,8,2q,,,a,b,7,21,2,r,,,,,,4,2,1d,k,,2,5,b,,10,9,,2u,b,,6,n,4,4,3,g,4,d,,,3,6,,f,,jj,3,qa,4,s,3,t,2,u,2,1s,w,9,,19,3,,,39,2,y,,3a,c,4,c,63,5,1l,a,,,,,2,o,2,,1c,1a,2,c,k,5,1b,h,12,9,c,3,u,d,1k,e,1c,k,48,3,,l,4,,6,,2,3,5i,1s,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,n,5,4,,2b,2,1e,i,q,i,d,,12,8,p,d,18,4,1b,e,10,,1v,e,c,,8,2,1a,,1f,,,3,2,2,5,2,,,15,5,5,2,6k,8,,2,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,1t,5,8t,2,25,6,1y,b,1d,4,3e,3,1h,f,15,,2,2,a,4,19,b,7,,1p,3,10,e,g,2,18,,c,3,1c,e,8,4,,2,2k,c,6,,2,,4d,c,l,4,1j,2,,7,2,2,2,3,9,,a,2,2,7,3,5,1v,9,,,2,,,4,,5,,,e,2,2a,i,n,,29,k,6j,7,2,9,r,2,2a,h,2y,d,2t,3,2,a,74,f,6t,6,,2,2,4,,,,2,3x,7,2,7,3,,s,a,14,7,,4,8,,9,b,1a,g,5i,8,5j,8,,8,2a,m,,e,3e,6,3,,,2,,7,,,1u,5,,2,,5,9n,4,9,2,,,1c,7,3,5,n,,44l,,6,f,8ug,i,1xc,5,1n,7,t4,,,1j,7,4,29,,b,2,f57,2,3mp,1a,2,n,f2,5,3,6,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,2s,,4g,7,af,,1p,4,e4,4,72,2,6r,,2,,7,2,5,,d6,7,31,7,240,5".split(",").map((e) => e ? parseInt(e, 36) : 1);
  for (let e = 0, t = 0; e < n.length; e++)
    (e % 2 ? na : Rr).push(t = t + n[e]);
})();
function lc(n) {
  if (n < 768) return !1;
  for (let e = 0, t = Rr.length; ; ) {
    let i = e + t >> 1;
    if (n < Rr[i]) t = i;
    else if (n >= na[i]) e = i + 1;
    else return !0;
    if (e == t) return !1;
  }
}
function rl(n) {
  return n >= 127462 && n <= 127487;
}
const sl = 8205;
function oc(n, e, t = !0, i = !0) {
  return (t ? ra : ac)(n, e, i);
}
function ra(n, e, t) {
  if (e == n.length) return e;
  e && sa(n.charCodeAt(e)) && la(n.charCodeAt(e - 1)) && e--;
  let i = tr(n, e);
  for (e += ll(i); e < n.length; ) {
    let r = tr(n, e);
    if (i == sl || r == sl || t && lc(r))
      e += ll(r), i = r;
    else if (rl(r)) {
      let s = 0, l = e - 2;
      for (; l >= 0 && rl(tr(n, l)); )
        s++, l -= 2;
      if (s % 2 == 0) break;
      e += 2;
    } else
      break;
  }
  return e;
}
function ac(n, e, t) {
  for (; e > 1; ) {
    let i = ra(n, e - 2, t);
    if (i < e) return i;
    e--;
  }
  return 0;
}
function tr(n, e) {
  let t = n.charCodeAt(e);
  if (!la(t) || e + 1 == n.length) return t;
  let i = n.charCodeAt(e + 1);
  return sa(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function sa(n) {
  return n >= 56320 && n < 57344;
}
function la(n) {
  return n >= 55296 && n < 56320;
}
function ll(n) {
  return n < 65536 ? 1 : 2;
}
class _ {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, t, i) {
    [e, t] = Lt(this, e, t);
    let r = [];
    return this.decompose(
      0,
      e,
      r,
      2
      /* Open.To */
    ), i.length && i.decompose(
      0,
      i.length,
      r,
      3
      /* Open.To */
    ), this.decompose(
      t,
      this.length,
      r,
      1
      /* Open.From */
    ), De.from(r, this.length - (t - e) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, t = this.length) {
    [e, t] = Lt(this, e, t);
    let i = [];
    return this.decompose(e, t, i, 0), De.from(i, t - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let t = this.scanIdentical(e, 1), i = this.length - this.scanIdentical(e, -1), r = new pi(this), s = new pi(e);
    for (let l = t, o = t; ; ) {
      if (r.next(l), s.next(l), l = 0, r.lineBreak != s.lineBreak || r.done != s.done || r.value != s.value)
        return !1;
      if (o += r.value.length, r.done || o >= i)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new pi(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, t = this.length) {
    return new oa(this, e, t);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, t) {
    let i;
    if (e == null)
      i = this.iter();
    else {
      t == null && (t = this.lines + 1);
      let r = this.line(e).from;
      i = this.iterRange(r, Math.max(r, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
    }
    return new aa(i);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? _.empty : e.length <= 32 ? new H(e) : De.from(H.split(e, []));
  }
}
class H extends _ {
  constructor(e, t = hc(e)) {
    super(), this.text = e, this.length = t;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, t, i, r) {
    for (let s = 0; ; s++) {
      let l = this.text[s], o = r + l.length;
      if ((t ? i : o) >= e)
        return new Oc(r, o, i, l);
      r = o + 1, i++;
    }
  }
  decompose(e, t, i, r) {
    let s = e <= 0 && t >= this.length ? this : new H(ol(this.text, e, t), Math.min(t, this.length) - Math.max(0, e));
    if (r & 1) {
      let l = i.pop(), o = rn(s.text, l.text.slice(), 0, s.length);
      if (o.length <= 32)
        i.push(new H(o, l.length + s.length));
      else {
        let a = o.length >> 1;
        i.push(new H(o.slice(0, a)), new H(o.slice(a)));
      }
    } else
      i.push(s);
  }
  replace(e, t, i) {
    if (!(i instanceof H))
      return super.replace(e, t, i);
    [e, t] = Lt(this, e, t);
    let r = rn(this.text, rn(i.text, ol(this.text, 0, e)), t), s = this.length + i.length - (t - e);
    return r.length <= 32 ? new H(r, s) : De.from(H.split(r, []), s);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Lt(this, e, t);
    let r = "";
    for (let s = 0, l = 0; s <= t && l < this.text.length; l++) {
      let o = this.text[l], a = s + o.length;
      s > e && l && (r += i), e < a && t > s && (r += o.slice(Math.max(0, e - s), t - s)), s = a + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.text)
      e.push(t);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, t) {
    let i = [], r = -1;
    for (let s of e)
      i.push(s), r += s.length + 1, i.length == 32 && (t.push(new H(i, r)), i = [], r = -1);
    return r > -1 && t.push(new H(i, r)), t;
  }
}
class De extends _ {
  constructor(e, t) {
    super(), this.children = e, this.length = t, this.lines = 0;
    for (let i of e)
      this.lines += i.lines;
  }
  lineInner(e, t, i, r) {
    for (let s = 0; ; s++) {
      let l = this.children[s], o = r + l.length, a = i + l.lines - 1;
      if ((t ? a : o) >= e)
        return l.lineInner(e, t, i, r);
      r = o + 1, i = a + 1;
    }
  }
  decompose(e, t, i, r) {
    for (let s = 0, l = 0; l <= t && s < this.children.length; s++) {
      let o = this.children[s], a = l + o.length;
      if (e <= a && t >= l) {
        let h = r & ((l <= e ? 1 : 0) | (a >= t ? 2 : 0));
        l >= e && a <= t && !h ? i.push(o) : o.decompose(e - l, t - l, i, h);
      }
      l = a + 1;
    }
  }
  replace(e, t, i) {
    if ([e, t] = Lt(this, e, t), i.lines < this.lines)
      for (let r = 0, s = 0; r < this.children.length; r++) {
        let l = this.children[r], o = s + l.length;
        if (e >= s && t <= o) {
          let a = l.replace(e - s, t - s, i), h = this.lines - l.lines + a.lines;
          if (a.lines < h >> 4 && a.lines > h >> 6) {
            let O = this.children.slice();
            return O[r] = a, new De(O, this.length - (t - e) + i.length);
          }
          return super.replace(s, o, a);
        }
        s = o + 1;
      }
    return super.replace(e, t, i);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Lt(this, e, t);
    let r = "";
    for (let s = 0, l = 0; s < this.children.length && l <= t; s++) {
      let o = this.children[s], a = l + o.length;
      l > e && s && (r += i), e < a && t > l && (r += o.sliceString(e - l, t - l, i)), l = a + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.children)
      t.flatten(e);
  }
  scanIdentical(e, t) {
    if (!(e instanceof De))
      return 0;
    let i = 0, [r, s, l, o] = t > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; r += t, s += t) {
      if (r == l || s == o)
        return i;
      let a = this.children[r], h = e.children[s];
      if (a != h)
        return i + a.scanIdentical(h, t);
      i += a.length + 1;
    }
  }
  static from(e, t = e.reduce((i, r) => i + r.length + 1, -1)) {
    let i = 0;
    for (let u of e)
      i += u.lines;
    if (i < 32) {
      let u = [];
      for (let d of e)
        d.flatten(u);
      return new H(u, t);
    }
    let r = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), s = r << 1, l = r >> 1, o = [], a = 0, h = -1, O = [];
    function c(u) {
      let d;
      if (u.lines > s && u instanceof De)
        for (let p of u.children)
          c(p);
      else u.lines > l && (a > l || !a) ? (f(), o.push(u)) : u instanceof H && a && (d = O[O.length - 1]) instanceof H && u.lines + d.lines <= 32 ? (a += u.lines, h += u.length + 1, O[O.length - 1] = new H(d.text.concat(u.text), d.length + 1 + u.length)) : (a + u.lines > r && f(), a += u.lines, h += u.length + 1, O.push(u));
    }
    function f() {
      a != 0 && (o.push(O.length == 1 ? O[0] : De.from(O, h)), h = -1, a = O.length = 0);
    }
    for (let u of e)
      c(u);
    return f(), o.length == 1 ? o[0] : new De(o, t);
  }
}
_.empty = /* @__PURE__ */ new H([""], 0);
function hc(n) {
  let e = -1;
  for (let t of n)
    e += t.length + 1;
  return e;
}
function rn(n, e, t = 0, i = 1e9) {
  for (let r = 0, s = 0, l = !0; s < n.length && r <= i; s++) {
    let o = n[s], a = r + o.length;
    a >= t && (a > i && (o = o.slice(0, i - r)), r < t && (o = o.slice(t - r)), l ? (e[e.length - 1] += o, l = !1) : e.push(o)), r = a + 1;
  }
  return e;
}
function ol(n, e, t) {
  return rn(n, [""], e, t);
}
class pi {
  constructor(e, t = 1) {
    this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof H ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, t) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, r = this.nodes[i], s = this.offsets[i], l = s >> 1, o = r instanceof H ? r.text.length : r.children.length;
      if (l == (t > 0 ? o : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        t > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((s & 1) == (t > 0 ? 0 : 1)) {
        if (this.offsets[i] += t, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (r instanceof H) {
        let a = r.text[l + (t < 0 ? -1 : 0)];
        if (this.offsets[i] += t, a.length > Math.max(0, e))
          return this.value = e == 0 ? a : t > 0 ? a.slice(e) : a.slice(0, a.length - e), this;
        e -= a.length;
      } else {
        let a = r.children[l + (t < 0 ? -1 : 0)];
        e > a.length ? (e -= a.length, this.offsets[i] += t) : (t < 0 && this.offsets[i]--, this.nodes.push(a), this.offsets.push(t > 0 ? 1 : (a instanceof H ? a.text.length : a.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class oa {
  constructor(e, t, i) {
    this.value = "", this.done = !1, this.cursor = new pi(e, t > i ? -1 : 1), this.pos = t > i ? e.length : 0, this.from = Math.min(t, i), this.to = Math.max(t, i);
  }
  nextInner(e, t) {
    if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
    let i = t < 0 ? this.pos - this.from : this.to - this.pos;
    e > i && (e = i), i -= e;
    let { value: r } = this.cursor.next(e);
    return this.pos += (r.length + e) * t, this.value = r.length <= i ? r : t < 0 ? r.slice(r.length - i) : r.slice(0, i), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class aa {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: t, lineBreak: i, value: r } = this.inner.next(e);
    return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = r, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (_.prototype[Symbol.iterator] = function() {
  return this.iter();
}, pi.prototype[Symbol.iterator] = oa.prototype[Symbol.iterator] = aa.prototype[Symbol.iterator] = function() {
  return this;
});
class Oc {
  /**
  @internal
  */
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.number = i, this.text = r;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function Lt(n, e, t) {
  return e = Math.max(0, Math.min(n.length, e)), [e, Math.max(e, Math.min(n.length, t))];
}
function ae(n, e, t = !0, i = !0) {
  return oc(n, e, t, i);
}
function cc(n) {
  return n >= 56320 && n < 57344;
}
function fc(n) {
  return n >= 55296 && n < 56320;
}
function uc(n, e) {
  let t = n.charCodeAt(e);
  if (!fc(t) || e + 1 == n.length)
    return t;
  let i = n.charCodeAt(e + 1);
  return cc(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function dc(n) {
  return n < 65536 ? 1 : 2;
}
const Cr = /\r\n?|\n/;
var de = /* @__PURE__ */ (function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
})(de || (de = {}));
class Ke {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2)
      e += this.sections[t];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t + 1];
      e += i < 0 ? this.sections[t] : i;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let t = 0, i = 0, r = 0; t < this.sections.length; ) {
      let s = this.sections[t++], l = this.sections[t++];
      l < 0 ? (e(i, r, s), r += s) : r += l, i += s;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, t = !1) {
    Ar(this, e, t);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], r = this.sections[t++];
      r < 0 ? e.push(i, r) : e.push(r, i);
    }
    return new Ke(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : ha(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `this` happened before the ones in `other`.
  */
  mapDesc(e, t = !1) {
    return e.empty ? this : jr(this, e, t);
  }
  mapPos(e, t = -1, i = de.Simple) {
    let r = 0, s = 0;
    for (let l = 0; l < this.sections.length; ) {
      let o = this.sections[l++], a = this.sections[l++], h = r + o;
      if (a < 0) {
        if (h > e)
          return s + (e - r);
        s += o;
      } else {
        if (i != de.Simple && h >= e && (i == de.TrackDel && r < e && h > e || i == de.TrackBefore && r < e || i == de.TrackAfter && h > e))
          return null;
        if (h > e || h == e && t < 0 && !o)
          return e == r || t < 0 ? s : s + a;
        s += a;
      }
      r = h;
    }
    if (e > r)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${r}`);
    return s;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, t = e) {
    for (let i = 0, r = 0; i < this.sections.length && r <= t; ) {
      let s = this.sections[i++], l = this.sections[i++], o = r + s;
      if (l >= 0 && r <= t && o >= e)
        return r < e && o > t ? "cover" : !0;
      r = o;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], r = this.sections[t++];
      e += (e ? " " : "") + i + (r >= 0 ? ":" + r : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((t) => typeof t != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new Ke(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new Ke(e);
  }
}
class J extends Ke {
  constructor(e, t) {
    super(e), this.inserted = t;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return Ar(this, (t, i, r, s, l) => e = e.replace(r, r + (i - t), l), !1), e;
  }
  mapDesc(e, t = !1) {
    return jr(this, e, t, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let t = this.sections.slice(), i = [];
    for (let r = 0, s = 0; r < t.length; r += 2) {
      let l = t[r], o = t[r + 1];
      if (o >= 0) {
        t[r] = o, t[r + 1] = l;
        let a = r >> 1;
        for (; i.length < a; )
          i.push(_.empty);
        i.push(l ? e.slice(s, s + l) : _.empty);
      }
      s += l;
    }
    return new J(t, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : ha(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, t = !1) {
    return e.empty ? this : jr(this, e, t, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, t = !1) {
    Ar(this, e, t);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return Ke.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let t = [], i = [], r = [], s = new bi(this);
    e: for (let l = 0, o = 0; ; ) {
      let a = l == e.length ? 1e9 : e[l++];
      for (; o < a || o == a && s.len == 0; ) {
        if (s.done)
          break e;
        let O = Math.min(s.len, a - o);
        oe(r, O, -1);
        let c = s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0;
        oe(t, O, c), c > 0 && pt(i, t, s.text), s.forward(O), o += O;
      }
      let h = e[l++];
      for (; o < h; ) {
        if (s.done)
          break e;
        let O = Math.min(s.len, h - o);
        oe(t, O, -1), oe(r, O, s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0), s.forward(O), o += O;
      }
    }
    return {
      changes: new J(t, i),
      filtered: Ke.create(r)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t], r = this.sections[t + 1];
      r < 0 ? e.push(i) : r == 0 ? e.push([i]) : e.push([i].concat(this.inserted[t >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, t, i) {
    let r = [], s = [], l = 0, o = null;
    function a(O = !1) {
      if (!O && !r.length)
        return;
      l < t && oe(r, t - l, -1);
      let c = new J(r, s);
      o = o ? o.compose(c.map(o)) : c, r = [], s = [], l = 0;
    }
    function h(O) {
      if (Array.isArray(O))
        for (let c of O)
          h(c);
      else if (O instanceof J) {
        if (O.length != t)
          throw new RangeError(`Mismatched change set length (got ${O.length}, expected ${t})`);
        a(), o = o ? o.compose(O.map(o)) : O;
      } else {
        let { from: c, to: f = c, insert: u } = O;
        if (c > f || c < 0 || f > t)
          throw new RangeError(`Invalid change range ${c} to ${f} (in doc of length ${t})`);
        let d = u ? typeof u == "string" ? _.of(u.split(i || Cr)) : u : _.empty, p = d.length;
        if (c == f && p == 0)
          return;
        c < l && a(), c > l && oe(r, c - l, -1), oe(r, f - c, p), pt(s, r, d), l = f;
      }
    }
    return h(e), a(!o), o;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new J(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let t = [], i = [];
    for (let r = 0; r < e.length; r++) {
      let s = e[r];
      if (typeof s == "number")
        t.push(s, -1);
      else {
        if (!Array.isArray(s) || typeof s[0] != "number" || s.some((l, o) => o && typeof l != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (s.length == 1)
          t.push(s[0], 0);
        else {
          for (; i.length < r; )
            i.push(_.empty);
          i[r] = _.of(s.slice(1)), t.push(s[0], i[r].length);
        }
      }
    }
    return new J(t, i);
  }
  /**
  @internal
  */
  static createSet(e, t) {
    return new J(e, t);
  }
}
function oe(n, e, t, i = !1) {
  if (e == 0 && t <= 0)
    return;
  let r = n.length - 2;
  r >= 0 && t <= 0 && t == n[r + 1] ? n[r] += e : r >= 0 && e == 0 && n[r] == 0 ? n[r + 1] += t : i ? (n[r] += e, n[r + 1] += t) : n.push(e, t);
}
function pt(n, e, t) {
  if (t.length == 0)
    return;
  let i = e.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(t);
  else {
    for (; n.length < i; )
      n.push(_.empty);
    n.push(t);
  }
}
function Ar(n, e, t) {
  let i = n.inserted;
  for (let r = 0, s = 0, l = 0; l < n.sections.length; ) {
    let o = n.sections[l++], a = n.sections[l++];
    if (a < 0)
      r += o, s += o;
    else {
      let h = r, O = s, c = _.empty;
      for (; h += o, O += a, a && i && (c = c.append(i[l - 2 >> 1])), !(t || l == n.sections.length || n.sections[l + 1] < 0); )
        o = n.sections[l++], a = n.sections[l++];
      e(r, h, s, O, c), r = h, s = O;
    }
  }
}
function jr(n, e, t, i = !1) {
  let r = [], s = i ? [] : null, l = new bi(n), o = new bi(e);
  for (let a = -1; ; ) {
    if (l.done && o.len || o.done && l.len)
      throw new Error("Mismatched change set lengths");
    if (l.ins == -1 && o.ins == -1) {
      let h = Math.min(l.len, o.len);
      oe(r, h, -1), l.forward(h), o.forward(h);
    } else if (o.ins >= 0 && (l.ins < 0 || a == l.i || l.off == 0 && (o.len < l.len || o.len == l.len && !t))) {
      let h = o.len;
      for (oe(r, o.ins, -1); h; ) {
        let O = Math.min(l.len, h);
        l.ins >= 0 && a < l.i && l.len <= O && (oe(r, 0, l.ins), s && pt(s, r, l.text), a = l.i), l.forward(O), h -= O;
      }
      o.next();
    } else if (l.ins >= 0) {
      let h = 0, O = l.len;
      for (; O; )
        if (o.ins == -1) {
          let c = Math.min(O, o.len);
          h += c, O -= c, o.forward(c);
        } else if (o.ins == 0 && o.len < O)
          O -= o.len, o.next();
        else
          break;
      oe(r, h, a < l.i ? l.ins : 0), s && a < l.i && pt(s, r, l.text), a = l.i, l.forward(l.len - O);
    } else {
      if (l.done && o.done)
        return s ? J.createSet(r, s) : Ke.create(r);
      throw new Error("Mismatched change set lengths");
    }
  }
}
function ha(n, e, t = !1) {
  let i = [], r = t ? [] : null, s = new bi(n), l = new bi(e);
  for (let o = !1; ; ) {
    if (s.done && l.done)
      return r ? J.createSet(i, r) : Ke.create(i);
    if (s.ins == 0)
      oe(i, s.len, 0, o), s.next();
    else if (l.len == 0 && !l.done)
      oe(i, 0, l.ins, o), r && pt(r, i, l.text), l.next();
    else {
      if (s.done || l.done)
        throw new Error("Mismatched change set lengths");
      {
        let a = Math.min(s.len2, l.len), h = i.length;
        if (s.ins == -1) {
          let O = l.ins == -1 ? -1 : l.off ? 0 : l.ins;
          oe(i, a, O, o), r && O && pt(r, i, l.text);
        } else l.ins == -1 ? (oe(i, s.off ? 0 : s.len, a, o), r && pt(r, i, s.textBit(a))) : (oe(i, s.off ? 0 : s.len, l.off ? 0 : l.ins, o), r && !l.off && pt(r, i, l.text));
        o = (s.ins > a || l.ins >= 0 && l.len > a) && (o || i.length > h), s.forward2(a), l.forward(a);
      }
    }
  }
}
class bi {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, t = this.i - 2 >> 1;
    return t >= e.length ? _.empty : e[t];
  }
  textBit(e) {
    let { inserted: t } = this.set, i = this.i - 2 >> 1;
    return i >= t.length && !e ? _.empty : t[i].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class ut {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.flags = i, this.goalColumn = r;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  A flag that, when set, makes some selection-extending commands
  treat the range's head and anchor as exchangeable, so that for
  example Shift-ArrowUp will make the lower side of the selection
  the anchor, even if that was the head before. Used to implement
  MacOS-style undirectional selections.
  */
  get undirectional() {
    return (this.flags & 64) > 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, t = -1) {
    let i, r;
    return this.empty ? i = r = e.mapPos(this.from, t) : (i = e.mapPos(this.from, 1), r = e.mapPos(this.to, -1)), i == this.from && r == this.to ? this : new ut(i, r, this.flags, this.goalColumn);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, t = e, i = 0) {
    if (e <= this.anchor && t >= this.anchor)
      return Q.range(e, t, void 0, void 0, i);
    let r = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
    return Q.range(this.anchor, r, void 0, void 0, i);
  }
  /**
  Compare this range to another range.
  */
  eq(e, t = !1) {
    return this.anchor == e.anchor && this.head == e.head && this.goalColumn == e.goalColumn && (!t || !this.empty || this.assoc == e.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return Q.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, t, i, r) {
    return new ut(e, t, i, r);
  }
}
class Q {
  constructor(e, t) {
    this.ranges = e, this.mainIndex = t;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, t = -1) {
    return e.empty ? this : Q.create(this.ranges.map((i) => i.map(e, t)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(e, t = !1) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let i = 0; i < this.ranges.length; i++)
      if (!this.ranges[i].eq(e.ranges[i], t))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new Q([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, t = !0) {
    return Q.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, t = this.mainIndex) {
    let i = this.ranges.slice();
    return i[t] = e, Q.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new Q(e.ranges.map((t) => ut.fromJSON(t)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, t = e) {
    return new Q([Q.range(e, t)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, t = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, r = 0; r < e.length; r++) {
      let s = e[r];
      if (s.empty ? s.from <= i : s.from < i)
        return Q.normalized(e.slice(), t);
      i = s.to;
    }
    return new Q(e, t);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, t = 0, i, r) {
    return ut.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (i == null ? 7 : Math.min(6, i)), r);
  }
  /**
  Create a selection range.
  */
  static range(e, t, i, r, s) {
    let l = r == null ? 7 : Math.min(6, r);
    return !s && e != t && (s = t < e ? 1 : -1), s && (l |= s < 0 ? 8 : 16), t < e ? ut.create(t, e, l | 32, i) : ut.create(e, t, l, i);
  }
  /**
  Create an [undirectional](https://codemirror.net/6/docs/ref/#state.SelectionRange.undirectional)
  selection range.
  */
  static undirectionalRange(e, t) {
    return ut.create(e, t, 64, void 0);
  }
  /**
  @internal
  */
  static normalized(e, t = 0) {
    let i = e[t];
    e.sort((r, s) => r.from - s.from), t = e.indexOf(i);
    for (let r = 1; r < e.length; r++) {
      let s = e[r], l = e[r - 1];
      if (s.empty ? s.from <= l.to : s.from < l.to) {
        let o = l.from, a = Math.max(s.to, l.to);
        r <= t && t--, e.splice(--r, 2, s.anchor > s.head ? Q.range(a, o) : Q.range(o, a));
      }
    }
    return new Q(e, t);
  }
}
function Oa(n, e) {
  for (let t of n.ranges)
    if (t.to > e)
      throw new RangeError("Selection points outside of document");
}
let ws = 0;
class v {
  constructor(e, t, i, r, s) {
    this.combine = e, this.compareInput = t, this.compare = i, this.isStatic = r, this.id = ws++, this.default = e([]), this.extensions = typeof s == "function" ? s(this) : s;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new v(e.combine || ((t) => t), e.compareInput || ((t, i) => t === i), e.compare || (e.combine ? (t, i) => t === i : vs), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new sn([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new sn(e, this, 1, t);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new sn(e, this, 2, t);
  }
  from(e, t) {
    return t || (t = (i) => i), this.compute([e], (i) => t(i.field(e)));
  }
}
function vs(n, e) {
  return n == e || n.length == e.length && n.every((t, i) => t === e[i]);
}
class sn {
  constructor(e, t, i, r) {
    this.dependencies = e, this.facet = t, this.type = i, this.value = r, this.id = ws++;
  }
  dynamicSlot(e) {
    var t;
    let i = this.value, r = this.facet.compareInput, s = this.id, l = e[s] >> 1, o = this.type == 2, a = !1, h = !1, O = [];
    for (let c of this.dependencies)
      c == "doc" ? a = !0 : c == "selection" ? h = !0 : (((t = e[c.id]) !== null && t !== void 0 ? t : 1) & 1) == 0 && O.push(e[c.id]);
    return {
      create(c) {
        return c.values[l] = i(c), 1;
      },
      update(c, f) {
        if (a && f.docChanged || h && (f.docChanged || f.selection) || Wr(c, O)) {
          let u = i(c);
          if (o ? !al(u, c.values[l], r) : !r(u, c.values[l]))
            return c.values[l] = u, 1;
        }
        return 0;
      },
      reconfigure: (c, f) => {
        let u, d = f.config.address[s];
        if (d != null) {
          let p = gn(f, d);
          if (this.dependencies.every((m) => m instanceof v ? f.facet(m) === c.facet(m) : m instanceof ht ? f.field(m, !1) == c.field(m, !1) : !0) || (o ? al(u = i(c), p, r) : r(u = i(c), p)))
            return c.values[l] = p, 0;
        } else
          u = i(c);
        return c.values[l] = u, 1;
      }
    };
  }
  get extension() {
    return this;
  }
}
function al(n, e, t) {
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!t(n[i], e[i]))
      return !1;
  return !0;
}
function Wr(n, e) {
  let t = !1;
  for (let i of e)
    gi(n, i) & 1 && (t = !0);
  return t;
}
function pc(n, e, t) {
  let i = t.map((a) => n[a.id]), r = t.map((a) => a.type), s = i.filter((a) => !(a & 1)), l = n[e.id] >> 1;
  function o(a) {
    let h = [];
    for (let O = 0; O < i.length; O++) {
      let c = gn(a, i[O]);
      if (r[O] == 2)
        for (let f of c)
          h.push(f);
      else
        h.push(c);
    }
    return e.combine(h);
  }
  return {
    create(a) {
      for (let h of i)
        gi(a, h);
      return a.values[l] = o(a), 1;
    },
    update(a, h) {
      if (!Wr(a, s))
        return 0;
      let O = o(a);
      return e.compare(O, a.values[l]) ? 0 : (a.values[l] = O, 1);
    },
    reconfigure(a, h) {
      let O = Wr(a, i), c = h.config.facets[e.id], f = h.facet(e);
      if (c && !O && vs(t, c))
        return a.values[l] = f, 0;
      let u = o(a);
      return e.compare(u, f) ? (a.values[l] = f, 0) : (a.values[l] = u, 1);
    }
  };
}
const Ei = /* @__PURE__ */ v.define({ static: !0 });
class ht {
  constructor(e, t, i, r, s) {
    this.id = e, this.createF = t, this.updateF = i, this.compareF = r, this.spec = s, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let t = new ht(ws++, e.create, e.update, e.compare || ((i, r) => i === r), e);
    return e.provide && (t.provides = e.provide(t)), t;
  }
  create(e) {
    let t = e.facet(Ei).find((i) => i.field == this);
    return (t?.create || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let t = e[this.id] >> 1;
    return {
      create: (i) => (i.values[t] = this.create(i), 1),
      update: (i, r) => {
        let s = i.values[t], l = this.updateF(s, r);
        return this.compareF(s, l) ? 0 : (i.values[t] = l, 1);
      },
      reconfigure: (i, r) => {
        let s = i.facet(Ei), l = r.facet(Ei), o;
        return (o = s.find((a) => a.field == this)) && o != l.find((a) => a.field == this) ? (i.values[t] = o.create(i), 1) : r.config.address[this.id] != null ? (i.values[t] = r.field(this), 0) : (i.values[t] = this.create(i), 1);
      }
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, Ei.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const kt = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function si(n) {
  return (e) => new ca(e, n);
}
const Ri = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ si(kt.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ si(kt.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ si(kt.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ si(kt.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ si(kt.lowest)
};
class ca {
  constructor(e, t) {
    this.inner = e, this.prec = t;
  }
  get extension() {
    return this;
  }
}
class qn {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new _r(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return qn.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class _r {
  constructor(e, t) {
    this.compartment = e, this.inner = t;
  }
  get extension() {
    return this;
  }
}
class pn {
  constructor(e, t, i, r, s, l) {
    for (this.base = e, this.compartments = t, this.dynamicSlots = i, this.address = r, this.staticValues = s, this.facets = l, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let t = this.address[e.id];
    return t == null ? e.default : this.staticValues[t >> 1];
  }
  static resolve(e, t, i) {
    let r = [], s = /* @__PURE__ */ Object.create(null), l = /* @__PURE__ */ new Map();
    for (let f of gc(e, t, l))
      f instanceof ht ? r.push(f) : (s[f.facet.id] || (s[f.facet.id] = [])).push(f);
    let o = /* @__PURE__ */ Object.create(null), a = [], h = [];
    for (let f of r)
      o[f.id] = h.length << 1, h.push((u) => f.slot(u));
    let O = i?.config.facets;
    for (let f in s) {
      let u = s[f], d = u[0].facet, p = O && O[f] || [];
      if (u.every(
        (m) => m.type == 0
        /* Provider.Static */
      ))
        if (o[d.id] = a.length << 1 | 1, vs(p, u))
          a.push(i.facet(d));
        else {
          let m = d.combine(u.map(($) => $.value));
          a.push(i && d.compare(m, i.facet(d)) ? i.facet(d) : m);
        }
      else {
        for (let m of u)
          m.type == 0 ? (o[m.id] = a.length << 1 | 1, a.push(m.value)) : (o[m.id] = h.length << 1, h.push(($) => m.dynamicSlot($)));
        o[d.id] = h.length << 1, h.push((m) => pc(m, d, u));
      }
    }
    let c = h.map((f) => f(o));
    return new pn(e, l, c, o, a, s);
  }
}
function gc(n, e, t) {
  let i = [[], [], [], [], []], r = /* @__PURE__ */ new Map();
  function s(l, o) {
    let a = r.get(l);
    if (a != null) {
      if (a <= o)
        return;
      let h = i[a].indexOf(l);
      h > -1 && i[a].splice(h, 1), l instanceof _r && t.delete(l.compartment);
    }
    if (r.set(l, o), Array.isArray(l))
      for (let h of l)
        s(h, o);
    else if (l instanceof _r) {
      if (t.has(l.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = e.get(l.compartment) || l.inner;
      t.set(l.compartment, h), s(h, o);
    } else if (l instanceof ca)
      s(l.inner, l.prec);
    else if (l instanceof ht)
      i[o].push(l), l.provides && s(l.provides, o);
    else if (l instanceof sn)
      i[o].push(l), l.facet.extensions && s(l.facet.extensions, kt.default);
    else {
      let h = l.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${l}).`);
      if (h == l)
        throw new Error(`Unrecognized extension value in extension set (${l}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      s(h, o);
    }
  }
  return s(n, kt.default), i.reduce((l, o) => l.concat(o));
}
function gi(n, e) {
  if (e & 1)
    return 2;
  let t = e >> 1, i = n.status[t];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[t] = 4;
  let r = n.computeSlot(n, n.config.dynamicSlots[t]);
  return n.status[t] = 2 | r;
}
function gn(n, e) {
  return e & 1 ? n.config.staticValues[e >> 1] : n.values[e >> 1];
}
const fa = /* @__PURE__ */ v.define(), Mr = /* @__PURE__ */ v.define({
  combine: (n) => n.some((e) => e),
  static: !0
}), ua = /* @__PURE__ */ v.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), da = /* @__PURE__ */ v.define(), pa = /* @__PURE__ */ v.define(), ga = /* @__PURE__ */ v.define(), ma = /* @__PURE__ */ v.define({
  combine: (n) => n.length ? n[0] : !1
});
class Ot {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new mc();
  }
}
class mc {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new Ot(this, e);
  }
}
class $c {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new I(this, e);
  }
}
class I {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let t = this.type.map(this.value, e);
    return t === void 0 ? void 0 : t == this.value ? this : new I(this.type, t);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new $c(e.map || ((t) => t));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, t) {
    if (!e.length)
      return e;
    let i = [];
    for (let r of e) {
      let s = r.map(t);
      s && i.push(s);
    }
    return i;
  }
}
I.reconfigure = /* @__PURE__ */ I.define();
I.appendConfig = /* @__PURE__ */ I.define();
class K {
  constructor(e, t, i, r, s, l) {
    this.startState = e, this.changes = t, this.selection = i, this.effects = r, this.annotations = s, this.scrollIntoView = l, this._doc = null, this._state = null, i && Oa(i, t.newLength), s.some((o) => o.type == K.time) || (this.annotations = s.concat(K.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, t, i, r, s, l) {
    return new K(e, t, i, r, s, l);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let t of this.annotations)
      if (t.type == e)
        return t.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let t = this.annotation(K.userEvent);
    return !!(t && (t == e || t.length > e.length && t.slice(0, e.length) == e && t[e.length] == "."));
  }
}
K.time = /* @__PURE__ */ Ot.define();
K.userEvent = /* @__PURE__ */ Ot.define();
K.addToHistory = /* @__PURE__ */ Ot.define();
K.remote = /* @__PURE__ */ Ot.define();
function Qc(n, e) {
  let t = [];
  for (let i = 0, r = 0; ; ) {
    let s, l;
    if (i < n.length && (r == e.length || e[r] >= n[i]))
      s = n[i++], l = n[i++];
    else if (r < e.length)
      s = e[r++], l = e[r++];
    else
      return t;
    !t.length || t[t.length - 1] < s ? t.push(s, l) : t[t.length - 1] < l && (t[t.length - 1] = l);
  }
}
function $a(n, e, t) {
  var i;
  let r, s, l;
  return t ? (r = e.changes, s = J.empty(e.changes.length), l = n.changes.compose(e.changes)) : (r = e.changes.map(n.changes), s = n.changes.mapDesc(e.changes, !0), l = n.changes.compose(r)), {
    changes: l,
    selection: e.selection ? e.selection.map(s) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(r),
    effects: I.mapEffects(n.effects, r).concat(I.mapEffects(e.effects, s)),
    annotations: n.annotations.length ? n.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: n.scrollIntoView || e.scrollIntoView
  };
}
function qr(n, e, t) {
  let i = e.selection, r = Yt(e.annotations);
  return e.userEvent && (r = r.concat(K.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof J ? e.changes : J.of(e.changes || [], t, n.facet(ua)),
    selection: i && (i instanceof Q ? i : Q.single(i.anchor, i.head)),
    effects: Yt(e.effects),
    annotations: r,
    scrollIntoView: !!e.scrollIntoView
  };
}
function Qa(n, e, t) {
  let i = qr(n, e.length ? e[0] : {}, n.doc.length);
  e.length && e[0].filter === !1 && (t = !1);
  for (let s = 1; s < e.length; s++) {
    e[s].filter === !1 && (t = !1);
    let l = !!e[s].sequential;
    i = $a(i, qr(n, e[s], l ? i.changes.newLength : n.doc.length), l);
  }
  let r = K.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return bc(t ? Sc(r) : r);
}
function Sc(n) {
  let e = n.startState, t = !0;
  for (let r of e.facet(da)) {
    let s = r(n);
    if (s === !1) {
      t = !1;
      break;
    }
    Array.isArray(s) && (t = t === !0 ? s : Qc(t, s));
  }
  if (t !== !0) {
    let r, s;
    if (t === !1)
      s = n.changes.invertedDesc, r = J.empty(e.doc.length);
    else {
      let l = n.changes.filter(t);
      r = l.changes, s = l.filtered.mapDesc(l.changes).invertedDesc;
    }
    n = K.create(e, r, n.selection && n.selection.map(s), I.mapEffects(n.effects, s), n.annotations, n.scrollIntoView);
  }
  let i = e.facet(pa);
  for (let r = i.length - 1; r >= 0; r--) {
    let s = i[r](n);
    s instanceof K ? n = s : Array.isArray(s) && s.length == 1 && s[0] instanceof K ? n = s[0] : n = Qa(e, Yt(s), !1);
  }
  return n;
}
function bc(n) {
  let e = n.startState, t = e.facet(ga), i = n;
  for (let r = t.length - 1; r >= 0; r--) {
    let s = t[r](n);
    s && Object.keys(s).length && (i = $a(i, qr(e, s, n.changes.newLength), !0));
  }
  return i == n ? n : K.create(e, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const yc = [];
function Yt(n) {
  return n == null ? yc : Array.isArray(n) ? n : [n];
}
var st = /* @__PURE__ */ (function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
})(st || (st = {}));
const Pc = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let Yr;
try {
  Yr = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function xc(n) {
  if (Yr)
    return Yr.test(n);
  for (let e = 0; e < n.length; e++) {
    let t = n[e];
    if (/\w/.test(t) || t > "" && (t.toUpperCase() != t.toLowerCase() || Pc.test(t)))
      return !0;
  }
  return !1;
}
function kc(n) {
  return (e) => {
    if (!/\S/.test(e))
      return st.Space;
    if (xc(e))
      return st.Word;
    for (let t = 0; t < n.length; t++)
      if (e.indexOf(n[t]) > -1)
        return st.Word;
    return st.Other;
  };
}
class z {
  constructor(e, t, i, r, s, l) {
    this.config = e, this.doc = t, this.selection = i, this.values = r, this.status = e.statusTemplate.slice(), this.computeSlot = s, l && (l._state = this);
    for (let o = 0; o < this.config.dynamicSlots.length; o++)
      gi(this, o << 1);
    this.computeSlot = null;
  }
  field(e, t = !0) {
    let i = this.config.address[e.id];
    if (i == null) {
      if (t)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return gi(this, i), gn(this, i);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return Qa(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let t = this.config, { base: i, compartments: r } = t;
    for (let o of e.effects)
      o.is(qn.reconfigure) ? (t && (r = /* @__PURE__ */ new Map(), t.compartments.forEach((a, h) => r.set(h, a)), t = null), r.set(o.value.compartment, o.value.extension)) : o.is(I.reconfigure) ? (t = null, i = o.value) : o.is(I.appendConfig) && (t = null, i = Yt(i).concat(o.value));
    let s;
    t ? s = e.startState.values.slice() : (t = pn.resolve(i, r, this), s = new z(t, this.doc, this.selection, t.dynamicSlots.map(() => null), (a, h) => h.reconfigure(a, this), null).values);
    let l = e.startState.facet(Mr) ? e.newSelection : e.newSelection.asSingle();
    new z(t, e.newDoc, l, s, (o, a) => a.update(o, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
      changes: { from: t.from, to: t.to, insert: e },
      range: Q.cursor(t.from + e.length, -1)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let t = this.selection, i = e(t.ranges[0]), r = this.changes(i.changes), s = [i.range], l = Yt(i.effects);
    for (let o = 1; o < t.ranges.length; o++) {
      let a = e(t.ranges[o]), h = this.changes(a.changes), O = h.map(r);
      for (let f = 0; f < o; f++)
        s[f] = s[f].map(O);
      let c = r.mapDesc(h, !0);
      s.push(a.range.map(c)), r = r.compose(O), l = I.mapEffects(l, O).concat(I.mapEffects(Yt(a.effects), c));
    }
    return {
      changes: r,
      selection: Q.create(s, t.mainIndex),
      effects: l
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof J ? e : J.of(e, this.doc.length, this.facet(z.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return _.of(e.split(this.facet(z.lineSeparator) || Cr));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, t = this.doc.length) {
    return this.doc.sliceString(e, t, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let t = this.config.address[e.id];
    return t == null ? e.default : (gi(this, t), gn(this, t));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let t = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let i in e) {
        let r = e[i];
        r instanceof ht && this.config.address[r.id] != null && (t[i] = r.spec.toJSON(this.field(e[i]), this));
      }
    return t;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, t = {}, i) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let r = [];
    if (i) {
      for (let s in i)
        if (Object.prototype.hasOwnProperty.call(e, s)) {
          let l = i[s], o = e[s];
          r.push(l.init((a) => l.spec.fromJSON(o, a)));
        }
    }
    return z.create({
      doc: e.doc,
      selection: Q.fromJSON(e.selection),
      extensions: t.extensions ? r.concat([t.extensions]) : r
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let t = pn.resolve(e.extensions || [], /* @__PURE__ */ new Map()), i = e.doc instanceof _ ? e.doc : _.of((e.doc || "").split(t.staticFacet(z.lineSeparator) || Cr)), r = e.selection ? e.selection instanceof Q ? e.selection : Q.single(e.selection.anchor, e.selection.head) : Q.single(0);
    return Oa(r, i.length), t.staticFacet(Mr) || (r = r.asSingle()), new z(t, i, r, t.dynamicSlots.map(() => null), (s, l) => l.create(s), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(z.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(z.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(ma);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...t) {
    for (let i of this.facet(z.phrases))
      if (Object.prototype.hasOwnProperty.call(i, e)) {
        e = i[e];
        break;
      }
    return t.length && (e = e.replace(/\$(\$|\d*)/g, (i, r) => {
      if (r == "$")
        return "$";
      let s = +(r || 1);
      return !s || s > t.length ? i : t[s - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, t, i = -1) {
    let r = [];
    for (let s of this.facet(fa))
      for (let l of s(this, t, i))
        Object.prototype.hasOwnProperty.call(l, e) && r.push(l[e]);
    return r;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    let t = this.languageDataAt("wordChars", e);
    return kc(t.length ? t[0] : "");
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: t, from: i, length: r } = this.doc.lineAt(e), s = this.charCategorizer(e), l = e - i, o = e - i;
    for (; l > 0; ) {
      let a = ae(t, l, !1);
      if (s(t.slice(a, l)) != st.Word)
        break;
      l = a;
    }
    for (; o < r; ) {
      let a = ae(t, o);
      if (s(t.slice(o, a)) != st.Word)
        break;
      o = a;
    }
    return l == o ? null : Q.range(l + i, o + i);
  }
}
z.allowMultipleSelections = Mr;
z.tabSize = /* @__PURE__ */ v.define({
  combine: (n) => n.length ? n[0] : 4
});
z.lineSeparator = ua;
z.readOnly = ma;
z.phrases = /* @__PURE__ */ v.define({
  compare(n, e) {
    let t = Object.keys(n), i = Object.keys(e);
    return t.length == i.length && t.every((r) => n[r] == e[r]);
  }
});
z.languageData = fa;
z.changeFilter = da;
z.transactionFilter = pa;
z.transactionExtender = ga;
qn.reconfigure = /* @__PURE__ */ I.define();
function Yn(n, e, t = {}) {
  let i = {};
  for (let r of n)
    for (let s of Object.keys(r)) {
      let l = r[s], o = i[s];
      if (o === void 0)
        i[s] = l;
      else if (!(o === l || l === void 0)) if (Object.hasOwnProperty.call(t, s))
        i[s] = t[s](o, l);
      else
        throw new Error("Config merge conflict for field " + s);
    }
  for (let r in e)
    i[r] === void 0 && (i[r] = e[r]);
  return i;
}
class gt {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, t = e) {
    return zr.create(e, t, this);
  }
}
gt.prototype.startSide = gt.prototype.endSide = 0;
gt.prototype.point = !1;
gt.prototype.mapMode = de.TrackDel;
function Xs(n, e) {
  return n == e || n.constructor == e.constructor && n.eq(e);
}
let zr = class Sa {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.value = i;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Sa(e, t, i);
  }
};
function Er(n, e) {
  return n.from - e.from || n.value.startSide - e.value.startSide;
}
class Zs {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.value = i, this.maxPoint = r;
  }
  get length() {
    return jt(this.to);
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, t, i, r = 0) {
    let s = i ? this.to : this.from;
    for (let l = r, o = s.length; ; ) {
      if (l == o)
        return l;
      let a = l + o >> 1, h = s[a] - e || (i ? this.value[a].endSide : this.value[a].startSide) - t;
      if (a == l)
        return h >= 0 ? l : o;
      h >= 0 ? o = a : l = a + 1;
    }
  }
  between(e, t, i, r) {
    for (let s = this.findIndex(t, -1e9, !0), l = this.findIndex(i, 1e9, !1, s); s < l; s++)
      if (r(this.from[s] + e, this.to[s] + e, this.value[s]) === !1)
        return !1;
  }
  map(e, t, i, r, s) {
    let l = [], o = [], a = [], h = -1, O = -1;
    e: for (let c = 0; c < this.value.length; c++) {
      let f = this.value[c], u = this.from[c] + e, d = this.to[c] + e, p, m;
      if (u == d) {
        let $ = t.mapPos(u, f.startSide, f.mapMode);
        if ($ == null || (p = m = $, f.startSide != f.endSide && (m = t.mapPos(u, f.endSide), m < p)))
          continue;
      } else if (p = t.mapPos(u, f.startSide), m = t.mapPos(d, f.endSide), p > m || p == m && f.startSide > 0 && f.endSide <= 0)
        continue;
      if (!((m - p || f.endSide - f.startSide) < 0))
        if (h < 0 && (h = p), f.point && (O = Math.max(O, m - p)), (p - i || f.startSide - r) >= 0)
          l.push(f), o.push(p - h), a.push(m - h), i = m, r = f.endSide;
        else {
          if (p == m)
            for (let $ = l.length; $ > 0; $--) {
              if ((p - (a[$ - 1] + h) || f.startSide - l[$ - 1].endSide) >= 0) {
                l.splice($, 0, f), o.splice($, 0, p - h), a.splice($, 0, m - h);
                continue e;
              }
              if ((p - (o[$ - 1] + h) || f.endSide - l[$ - 1].startSide) > 0)
                break;
            }
          s(p, m, f);
        }
    }
    return { mapped: l.length ? new Zs(o, a, l, O) : null, pos: h };
  }
}
class W {
  constructor(e, t, i, r) {
    this.chunkPos = e, this.chunk = t, this.nextLayer = i, this.maxPoint = r;
  }
  /**
  @internal
  */
  static create(e, t, i, r) {
    return new W(e, t, i, r);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let t of this.chunk)
      e += t.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: t = [], sort: i = !1, filterFrom: r = 0, filterTo: s = this.length } = e, l = e.filter;
    if (t.length == 0 && !l)
      return this;
    if (i && (t = t.slice().sort(Er)), this.isEmpty)
      return t.length ? W.of(t) : this;
    let o = new ba(this, null, -1).goto(0), a = 0, h = [], O = new zt();
    for (; o.value || a < t.length; )
      if (a < t.length && (o.from - t[a].from || o.startSide - t[a].value.startSide) >= 0) {
        let c = t[a++];
        O.addInner(c.from, c.to, c.value, !1) || h.push(c);
      } else o.rangeIndex == 1 && o.chunkIndex < this.chunk.length && (a == t.length || this.chunkEnd(o.chunkIndex) < t[a].from) && (!l || r > this.chunkEnd(o.chunkIndex) || s < this.chunkPos[o.chunkIndex]) && O.addChunk(this.chunkPos[o.chunkIndex], this.chunk[o.chunkIndex]) ? o.nextChunk() : ((!l || r > o.to || s < o.from || l(o.from, o.to, o.value)) && (O.addInner(o.from, o.to, o.value, !1) || h.push(zr.create(o.from, o.to, o.value))), o.next());
    return O.finishInner(this.nextLayer.isEmpty && !h.length ? W.empty : this.nextLayer.update({ add: h, filter: l, filterFrom: r, filterTo: s }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let t = [], i = [], r = -1, s, l = (a, h, O) => {
      s || (s = new zt()), s.addRange(a, h, O, !1);
    };
    for (let a = 0; a < this.chunk.length; a++) {
      let h = this.chunkPos[a], O = this.chunk[a], c = e.touchesRange(h, h + O.length);
      if (c === !1)
        r = Math.max(r, O.maxPoint), t.push(O), i.push(e.mapPos(h));
      else if (c === !0) {
        let [f, u] = t.length ? [jt(i) + jt(t).length, jt(jt(t).value).endSide] : [-1, -1], { mapped: d, pos: p } = O.map(h, e, f, u, l);
        d && (r = Math.max(r, d.maxPoint), t.push(d), i.push(p));
      }
    }
    let o = this.nextLayer.map(e);
    return s && (o = s.finishInner(o)), t.length == 0 ? o : new W(i, t, o || W.empty, r);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, t, i) {
    if (!this.isEmpty) {
      for (let r = 0; r < this.chunk.length; r++) {
        let s = this.chunkPos[r], l = this.chunk[r];
        if (t >= s && e <= s + l.length && l.between(s, e - s, t - s, i) === !1)
          return;
      }
      this.nextLayer.between(e, t, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return yi.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, t = 0) {
    return yi.from(e).goto(t);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, t, i, r, s = -1) {
    let l = e.filter((c) => c.maxPoint > 0 || !c.isEmpty && c.maxPoint >= s), o = t.filter((c) => c.maxPoint > 0 || !c.isEmpty && c.maxPoint >= s), a = hl(l, o, i), h = new li(l, a, s), O = new li(o, a, s);
    i.iterGaps((c, f, u) => Ol(h, c, O, f, u, r)), i.empty && i.length == 0 && Ol(h, 0, O, 0, 0, r);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, t, i = 0, r) {
    r == null && (r = 999999999);
    let s = e.filter((O) => !O.isEmpty && t.indexOf(O) < 0), l = t.filter((O) => !O.isEmpty && e.indexOf(O) < 0);
    if (s.length != l.length)
      return !1;
    if (!s.length)
      return !0;
    let o = hl(s, l), a = new li(s, o, 0).goto(i), h = new li(l, o, 0).goto(i);
    for (; ; ) {
      if (a.to != h.to || !Ur(a.active, h.active) || a.point && (!h.point || !Xs(a.point, h.point)))
        return !1;
      if (a.to > r)
        return !0;
      a.next(), h.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, t, i, r, s = -1) {
    let l = new li(e, null, s).goto(t), o = t, a = l.openStart;
    for (; ; ) {
      let h = Math.min(l.to, i);
      if (l.point) {
        let O = l.activeForPoint(l.to), c = l.pointFrom < t ? O.length + 1 : l.point.startSide < 0 ? O.length : Math.min(O.length, a);
        r.point(o, h, l.point, O, c, l.pointRank), a = Math.min(l.openEnd(h), O.length);
      } else h > o && (r.span(o, h, l.active, a), a = l.openEnd(h));
      if (l.to > i)
        return a + (l.point && l.to > i ? 1 : 0);
      o = l.to, l.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, t = !1) {
    let i = new zt();
    for (let r of e instanceof zr ? [e] : t ? wc(e) : e)
      i.add(r.from, r.to, r.value);
    return i.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(e) {
    if (!e.length)
      return W.empty;
    let t = jt(e);
    for (let i = e.length - 2; i >= 0; i--)
      for (let r = e[i]; r != W.empty; r = r.nextLayer)
        t = new W(r.chunkPos, r.chunk, t, Math.max(r.maxPoint, t.maxPoint));
    return t;
  }
}
W.empty = /* @__PURE__ */ new W([], [], null, -1);
function jt(n) {
  return n[n.length - 1];
}
function wc(n) {
  if (n.length > 1)
    for (let e = n[0], t = 1; t < n.length; t++) {
      let i = n[t];
      if (Er(e, i) > 0)
        return n.slice().sort(Er);
      e = i;
    }
  return n;
}
W.empty.nextLayer = W.empty;
class zt {
  finishChunk(e) {
    this.chunks.push(new Zs(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, t, i) {
    this.addRange(e, t, i, !0);
  }
  /**
  @internal
  */
  addRange(e, t, i, r) {
    this.addInner(e, t, i, r) || (this.nextLayer || (this.nextLayer = new zt())).addRange(e, t, i, r);
  }
  /**
  @internal
  */
  addInner(e, t, i, r) {
    let s = e - this.lastTo || i.startSide - this.last.endSide;
    if (r && s <= 0 && (e - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return s < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = i, this.lastFrom = e, this.lastTo = t, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, t) {
    if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
    let i = t.value.length - 1;
    return this.last = t.value[i], this.lastFrom = t.from[i] + e, this.lastTo = t.to[i] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(W.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let t = W.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, t;
  }
}
function hl(n, e, t) {
  let i = /* @__PURE__ */ new Map();
  for (let s of n)
    for (let l = 0; l < s.chunk.length; l++)
      s.chunk[l].maxPoint <= 0 && i.set(s.chunk[l], s.chunkPos[l]);
  let r = /* @__PURE__ */ new Set();
  for (let s of e)
    for (let l = 0; l < s.chunk.length; l++) {
      let o = i.get(s.chunk[l]);
      o != null && (t ? t.mapPos(o) : o) == s.chunkPos[l] && !t?.touchesRange(o, o + s.chunk[l].length) && r.add(s.chunk[l]);
    }
  return r;
}
class ba {
  constructor(e, t, i, r = 0) {
    this.layer = e, this.skip = t, this.minPoint = i, this.rank = r;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, t = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, t, !1), this;
  }
  gotoInner(e, t, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let r = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(r) || this.layer.chunkEnd(this.chunkIndex) < e || r.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let r = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
      (!i || this.rangeIndex < r) && this.setRangeIndex(r);
    }
    this.next();
  }
  forward(e, t) {
    (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], i = e + t.from[this.rangeIndex];
        if (this.from = i, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class yi {
  constructor(e) {
    this.heap = e;
  }
  static from(e, t = null, i = -1) {
    let r = [];
    for (let s = 0; s < e.length; s++)
      for (let l = e[s]; !l.isEmpty; l = l.nextLayer)
        l.maxPoint >= i && r.push(new ba(l, t, i, s));
    return r.length == 1 ? r[0] : new yi(r);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, t = -1e9) {
    for (let i of this.heap)
      i.goto(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      ir(this.heap, i);
    return this.next(), this;
  }
  forward(e, t) {
    for (let i of this.heap)
      i.forward(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      ir(this.heap, i);
    (this.to - e || this.value.endSide - t) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), ir(this.heap, 0);
    }
  }
}
function ir(n, e) {
  for (let t = n[e]; ; ) {
    let i = (e << 1) + 1;
    if (i >= n.length)
      break;
    let r = n[i];
    if (i + 1 < n.length && r.compare(n[i + 1]) >= 0 && (r = n[i + 1], i++), t.compare(r) < 0)
      break;
    n[i] = t, n[e] = r, e = i;
  }
}
class li {
  constructor(e, t, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = yi.from(e, t, i);
  }
  goto(e, t = -1e9) {
    return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
  }
  forward(e, t) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, t);
  }
  removeActive(e) {
    Ui(this.active, e), Ui(this.activeTo, e), Ui(this.activeRank, e), this.minActive = cl(this.active, this.activeTo);
  }
  addActive(e) {
    let t = 0, { value: i, to: r, rank: s } = this.cursor;
    for (; t < this.activeRank.length && (s - this.activeRank[t] || r - this.activeTo[t]) > 0; )
      t++;
    Vi(this.active, t, i), Vi(this.activeTo, t, r), Vi(this.activeRank, t, s), e && Vi(e, t, this.cursor.from), this.minActive = cl(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, t = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let r = this.minActive;
      if (r > -1 && (this.activeTo[r] - this.cursor.from || this.active[r].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[r] > e) {
          this.to = this.activeTo[r], this.endSide = this.active[r].endSide;
          break;
        }
        this.removeActive(r), i && Ui(i, r);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let s = this.cursor.value;
          if (!s.point)
            this.addActive(i), this.cursor.next();
          else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = s, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = s.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (i) {
      this.openStart = 0;
      for (let r = i.length - 1; r >= 0 && i[r] < e; r--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let t = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > e || this.activeTo[i] == e && this.active[i].endSide >= this.point.endSide) && t.push(this.active[i]);
    return t.reverse();
  }
  openEnd(e) {
    let t = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > e; i--)
      t++;
    return t;
  }
}
function Ol(n, e, t, i, r, s) {
  n.goto(e), t.goto(i);
  let l = i + r, o = i, a = i - e, h = !!s.boundChange;
  for (let O = !1; ; ) {
    let c = n.to + a - t.to, f = c || n.endSide - t.endSide, u = f < 0 ? n.to + a : t.to, d = Math.min(u, l);
    if (n.point || t.point ? (n.point && t.point && Xs(n.point, t.point) && Ur(n.activeForPoint(n.to), t.activeForPoint(t.to)) || s.comparePoint(o, d, n.point, t.point), O = !1) : (O && (s.boundChange(o), O = !1), d > o && !Ur(n.active, t.active) && s.compareRange(o, d, n.active, t.active), h && d < l && (c || n.openEnd(u) != t.openEnd(u)) && (O = !0)), u > l)
      break;
    o = u, f <= 0 && n.next(), f >= 0 && t.next();
  }
}
function Ur(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] != e[t] && !Xs(n[t], e[t]))
      return !1;
  return !0;
}
function Ui(n, e) {
  for (let t = e, i = n.length - 1; t < i; t++)
    n[t] = n[t + 1];
  n.pop();
}
function Vi(n, e, t) {
  for (let i = n.length - 1; i >= e; i--)
    n[i + 1] = n[i];
  n[e] = t;
}
function cl(n, e) {
  let t = -1, i = 1e9;
  for (let r = 0; r < e.length; r++)
    (e[r] - i || n[r].endSide - n[t].endSide) < 0 && (t = r, i = e[r]);
  return t;
}
function zn(n, e, t = n.length) {
  let i = 0;
  for (let r = 0; r < t && r < n.length; )
    n.charCodeAt(r) == 9 ? (i += e - i % e, r++) : (i++, r = ae(n, r));
  return i;
}
function vc(n, e, t, i) {
  for (let r = 0, s = 0; ; ) {
    if (s >= e)
      return r;
    if (r == n.length)
      break;
    s += n.charCodeAt(r) == 9 ? t - s % t : 1, r = ae(n, r);
  }
  return n.length;
}
const Vr = "ͼ", fl = typeof Symbol > "u" ? "__" + Vr : Symbol.for(Vr), Gr = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), ul = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class mt {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, t) {
    this.rules = [];
    let { finish: i } = t || {};
    function r(s, l, o, a) {
      let h = [], O = /^@(\w+)\b/.exec(s[0]), c = O && O[1] == "keyframes";
      if (O && l == null) return o.push(s[0] + ";");
      for (let f in l) {
        let u = l[f];
        if (/&/.test(f))
          r(
            f.split(/,\s*/).map((d) => s.map((p) => d.replace(/&/, p))).reduce((d, p) => d.concat(p)),
            u,
            o
          );
        else if (u && typeof u == "object") {
          if (!O) throw new RangeError("The value of a property (" + f + ") should be a primitive value.");
          r(dl(f), u, h, c);
        } else u != null && (/^--/.test(f) || (f = f.replace(/_.*/, "").replace(/[A-Z]/g, (d) => "-" + d.toLowerCase())), h.push(f + ": " + u + ";"));
      }
      (h.length || c) && o.push((i && !O && !a ? s.map(i) : s).join(", ") + " {" + h.join(" ") + "}");
    }
    for (let s in e) r(dl(s), e[s], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = ul[fl] || 1;
    return ul[fl] = e + 1, Vr + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, t, i) {
    let r = e[Gr], s = i && i.nonce;
    r ? s && r.setNonce(s) : r = new Xc(e, s), r.mount(Array.isArray(t) ? t : [t], e);
  }
}
function dl(n) {
  if (/^@/.test(n)) return [n];
  let e = [], t = 0, i = null, r = 0, s = 0;
  for (let l = 0; l < n.length; l++) {
    let o = n[l];
    o == "\\" ? l++ : o == '"' || o == "'" ? o == i ? i = !1 : i || (i = o) : (o == "[" || o == "(") && !i ? t++ : (o == "]" || o == ")") && !i ? t-- : o == "," && !t && !i && (e.push(n.slice(s, r)), s = l + 1), /\S/.test(o) ? r = l + 1 : l == s && s++;
  }
  return e.push(n.slice(s, r)), e;
}
let pl = /* @__PURE__ */ new Map();
class Xc {
  constructor(e, t) {
    let i = e.ownerDocument || e, r = i.defaultView;
    if (!e.head && e.adoptedStyleSheets && r.CSSStyleSheet) {
      let s = pl.get(i);
      if (s) return e[Gr] = s;
      this.sheet = new r.CSSStyleSheet(), pl.set(i, this);
    } else
      this.styleTag = i.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
    this.modules = [], e[Gr] = this;
  }
  mount(e, t) {
    let i = this.sheet, r = 0, s = 0, l = !1;
    for (let o = 0; o < e.length; o++) {
      let a = e[o], h = this.modules.indexOf(a);
      if (h < s && h > -1 && (this.modules.splice(h, 1), l = !0, s--, h = -1), h == -1) {
        if (this.modules.splice(s++, 0, a), l = !0, i) for (let O = 0; O < a.rules.length; O++)
          i.insertRule(a.rules[O], r++);
      } else {
        for (; s < h; ) r += this.modules[s++].rules.length;
        r += a.rules.length, s++;
      }
    }
    if (i)
      t.adoptedStyleSheets.indexOf(this.sheet) < 0 && (t.adoptedStyleSheets = [this.sheet, ...t.adoptedStyleSheets]);
    else {
      if (l) {
        let a = "";
        for (let h = 0; h < this.modules.length; h++)
          a += this.modules[h].getRules() + `
`;
        this.styleTag.textContent = a;
      }
      let o = t.head || t;
      this.styleTag.parentNode != o && o.insertBefore(this.styleTag, o.firstChild);
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var $t = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, Pi = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, Zc = typeof navigator < "u" && /Mac/.test(navigator.platform), Tc = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var ne = 0; ne < 10; ne++) $t[48 + ne] = $t[96 + ne] = String(ne);
for (var ne = 1; ne <= 24; ne++) $t[ne + 111] = "F" + ne;
for (var ne = 65; ne <= 90; ne++)
  $t[ne] = String.fromCharCode(ne + 32), Pi[ne] = String.fromCharCode(ne);
for (var nr in $t) Pi.hasOwnProperty(nr) || (Pi[nr] = $t[nr]);
function Rc(n) {
  var e = Zc && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Tc && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Pi : $t)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
let ue = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, Dr = typeof document < "u" ? document : { documentElement: { style: {} } };
const Lr = /* @__PURE__ */ /Edge\/(\d+)/.exec(ue.userAgent), ya = /* @__PURE__ */ /MSIE \d/.test(ue.userAgent), Br = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(ue.userAgent), En = !!(ya || Br || Lr), gl = !En && /* @__PURE__ */ /gecko\/(\d+)/i.test(ue.userAgent), rr = !En && /* @__PURE__ */ /Chrome\/(\d+)/.exec(ue.userAgent), ml = "webkitFontSmoothing" in Dr.documentElement.style, Ir = !En && /* @__PURE__ */ /Apple Computer/.test(ue.vendor), $l = Ir && (/* @__PURE__ */ /Mobile\/\w+/.test(ue.userAgent) || ue.maxTouchPoints > 2);
var P = {
  mac: $l || /* @__PURE__ */ /Mac/.test(ue.platform),
  windows: /* @__PURE__ */ /Win/.test(ue.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(ue.platform),
  ie: En,
  ie_version: ya ? Dr.documentMode || 6 : Br ? +Br[1] : Lr ? +Lr[1] : 0,
  gecko: gl,
  gecko_version: gl ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(ue.userAgent) || [0, 0])[1] : 0,
  chrome: !!rr,
  chrome_version: rr ? +rr[1] : 0,
  ios: $l,
  android: /* @__PURE__ */ /Android\b/.test(ue.userAgent),
  webkit: ml,
  webkit_version: ml ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(ue.userAgent) || [0, 0])[1] : 0,
  safari: Ir,
  safari_version: Ir ? +(/* @__PURE__ */ /\bVersion\/(\d+(\.\d+)?)/.exec(ue.userAgent) || [0, 0])[1] : 0,
  tabSize: Dr.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
function Ts(n, e) {
  for (let t in n)
    t == "class" && e.class ? e.class += " " + n.class : t == "style" && e.style ? e.style += ";" + n.style : e[t] = n[t];
  return e;
}
const mn = /* @__PURE__ */ Object.create(null);
function Rs(n, e, t) {
  if (n == e)
    return !0;
  n || (n = mn), e || (e = mn);
  let i = Object.keys(n), r = Object.keys(e);
  if (i.length - 0 != r.length - 0)
    return !1;
  for (let s of i)
    if (s != t && (r.indexOf(s) == -1 || n[s] !== e[s]))
      return !1;
  return !0;
}
function Cc(n, e) {
  for (let t = n.attributes.length - 1; t >= 0; t--) {
    let i = n.attributes[t].name;
    e[i] == null && n.removeAttribute(i);
  }
  for (let t in e) {
    let i = e[t];
    t == "style" ? n.style.cssText = i : n.getAttribute(t) != i && n.setAttribute(t, i);
  }
}
function Ql(n, e, t) {
  let i = !1;
  if (e)
    for (let r in e)
      t && r in t || (i = !0, r == "style" ? n.style.cssText = "" : n.removeAttribute(r));
  if (t)
    for (let r in t)
      e && e[r] == t[r] || (i = !0, r == "style" ? n.style.cssText = t[r] : n.setAttribute(r, t[r]));
  return i;
}
function Ac(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t = 0; t < n.attributes.length; t++) {
    let i = n.attributes[t];
    e[i.name] = i.value;
  }
  return e;
}
class Ci {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, t, i) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, t, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var re = /* @__PURE__ */ (function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
})(re || (re = {}));
class G extends gt {
  constructor(e, t, i, r) {
    super(), this.startSide = e, this.endSide = t, this.widget = i, this.spec = r;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new Ai(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), i = !!e.block;
    return t += i && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new Xt(e, t, t, i, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let t = !!e.block, i, r;
    if (e.isBlockGap)
      i = -5e8, r = 4e8;
    else {
      let { start: s, end: l } = Pa(e, t);
      i = (s ? t ? -3e8 : -1 : 5e8) - 1, r = (l ? t ? 2e8 : 1 : -6e8) + 1;
    }
    return new Xt(e, i, r, t, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new ji(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, t = !1) {
    return W.of(e, t);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
G.none = W.empty;
class Ai extends G {
  constructor(e) {
    let { start: t, end: i } = Pa(e);
    super(t ? -1 : 5e8, i ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.attrs = e.class && e.attributes ? Ts(e.attributes, { class: e.class }) : e.class ? { class: e.class } : e.attributes || mn;
  }
  eq(e) {
    return this == e || e instanceof Ai && this.tagName == e.tagName && Rs(this.attrs, e.attrs);
  }
  range(e, t = e) {
    if (e >= t)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, t);
  }
}
Ai.prototype.point = !1;
class ji extends G {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof ji && this.spec.class == e.spec.class && Rs(this.spec.attributes, e.spec.attributes);
  }
  range(e, t = e) {
    if (t != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, t);
  }
}
ji.prototype.mapMode = de.TrackBefore;
ji.prototype.point = !0;
class Xt extends G {
  constructor(e, t, i, r, s, l) {
    super(t, i, s, e), this.block = r, this.isReplace = l, this.mapMode = r ? t <= 0 ? de.TrackBefore : de.TrackAfter : de.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? re.WidgetRange : this.startSide <= 0 ? re.WidgetBefore : re.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof Xt && jc(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, t = e) {
    if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && t != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, t);
  }
}
Xt.prototype.point = !0;
function Pa(n, e = !1) {
  let { inclusiveStart: t, inclusiveEnd: i } = n;
  return t == null && (t = n.inclusive), i == null && (i = n.inclusive), { start: t ?? e, end: i ?? e };
}
function jc(n, e) {
  return n == e || !!(n && e && n.compare(e));
}
function Et(n, e, t, i = 0) {
  let r = t.length - 1;
  r >= 0 && t[r] + i >= n ? t[r] = Math.max(t[r], e) : t.push(n, e);
}
class xi extends gt {
  constructor(e, t, i) {
    super(), this.tagName = e, this.attributes = t, this.rank = i;
  }
  eq(e) {
    return e == this || e instanceof xi && this.tagName == e.tagName && Rs(this.attributes, e.attributes);
  }
  /**
  Create a block wrapper object with the given tag name and
  attributes.
  */
  static create(e) {
    return new xi(e.tagName, e.attributes || mn, e.rank == null ? 50 : Math.max(0, Math.min(e.rank, 100)));
  }
  /**
  Create a range set from the given block wrapper ranges.
  */
  static set(e, t = !1) {
    return W.of(e, t);
  }
}
xi.prototype.startSide = xi.prototype.endSide = -1;
const ee = (n) => n.nodeType == 1, Bt = (n) => n.nodeType == 3;
function ki(n) {
  let e;
  return n.nodeType == 11 ? e = n.getSelection ? n : n.ownerDocument : e = n, e.getSelection();
}
function Nr(n, e) {
  return e ? n == e || n.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function mi(n, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return Nr(n, e.anchorNode);
  } catch {
    return !1;
  }
}
function ln(n) {
  return Bt(n) ? wi(n, 0, n.nodeValue.length).getClientRects() : ee(n) ? n.getClientRects() : [];
}
function $i(n, e, t, i) {
  return t ? Sl(n, e, t, i, -1) || Sl(n, e, t, i, 1) : !1;
}
function Qt(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}
function $n(n) {
  return ee(n) && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
function Sl(n, e, t, i, r) {
  for (; ; ) {
    if (n == t && e == i)
      return !0;
    if (e == (r < 0 ? 0 : at(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let s = n.parentNode;
      if (!s || !ee(s))
        return !1;
      e = Qt(n) + (r < 0 ? 0 : 1), n = s;
    } else if (ee(n)) {
      if (n = n.childNodes[e + (r < 0 ? -1 : 0)], ee(n) && (n.nodeName == "IMG" || n.nodeName == "BR" || n.contentEditable == "false"))
        return !1;
      e = r < 0 ? at(n) : 0;
    } else
      return !1;
  }
}
function at(n) {
  return Bt(n) ? n.nodeValue.length : n.childNodes.length;
}
function Qn(n, e) {
  let { left: t, right: i } = n;
  if (t == i)
    return n;
  let r = e ? t : i;
  return { left: r, right: r, top: n.top, bottom: n.bottom };
}
function Wc(n) {
  let e = n.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function xa(n, e) {
  let t = e.width / n.offsetWidth, i = e.height / n.offsetHeight;
  return (t > 0.995 && t < 1.005 || !isFinite(t) || Math.abs(e.width - n.offsetWidth) < 1) && (t = 1), (i > 0.995 && i < 1.005 || !isFinite(i) || Math.abs(e.height - n.offsetHeight) < 1) && (i = 1), { scaleX: t, scaleY: i };
}
function _c(n, e, t, i, r, s, l, o) {
  let a = n.ownerDocument, h = a.defaultView || window;
  for (let O = n, c = !1; O && !c; )
    if (ee(O)) {
      let f, u = O == a.body, d = 1, p = 1, m = !0, $ = !0;
      if (u)
        f = Wc(h);
      else {
        let R = getComputedStyle(O);
        if (/^(fixed|sticky)$/.test(R.position) && (c = !0), (O.scrollHeight <= O.clientHeight || !/auto|scroll/.test(R.overflowY)) && ($ = !1), (O.scrollWidth <= O.clientWidth || !/auto|scroll/.test(R.overflowX)) && (m = !1), !m && !$) {
          O = O.assignedSlot || O.parentNode;
          continue;
        }
        let S = O.getBoundingClientRect();
        ({ scaleX: d, scaleY: p } = xa(O, S)), f = {
          left: S.left,
          right: S.left + O.clientWidth * d,
          top: S.top,
          bottom: S.top + O.clientHeight * p
        };
      }
      let w = 0, b = 0;
      if ($) if (r == "nearest")
        e.top < f.top + l ? (b = e.top - (f.top + l), t > 0 && e.bottom > f.bottom + b && (b = e.bottom - f.bottom + l)) : e.bottom > f.bottom - l && (b = e.bottom - f.bottom + l, t < 0 && e.top - b < f.top && (b = e.top - (f.top + l)));
      else {
        let R = e.bottom - e.top, S = f.bottom - f.top;
        b = (r == "center" && R <= S ? e.top + R / 2 - S / 2 : r == "start" || r == "center" && t < 0 ? e.top - l : e.bottom - S + l) - f.top;
      }
      if (m && (i == "nearest" ? e.left < f.left + s ? (w = e.left - (f.left + s), t > 0 && e.right > f.right + w && (w = e.right - f.right + s)) : e.right > f.right - s && (w = e.right - f.right + s, t < 0 && e.left < f.left + w && (w = e.left - (f.left + s))) : w = (i == "center" ? e.left + (e.right - e.left) / 2 - (f.right - f.left) / 2 : i == "start" == o ? e.left - s : e.right - (f.right - f.left) + s) - f.left), w || b)
        if (u)
          h.scrollBy(w, b);
        else {
          let R = 0, S = 0;
          if (b) {
            let x = O.scrollTop;
            O.scrollTop += b / p, S = (O.scrollTop - x) * p;
          }
          if (w) {
            let x = O.scrollLeft;
            O.scrollLeft += w / d, R = (O.scrollLeft - x) * d;
          }
          e = {
            left: e.left - R,
            top: e.top - S,
            right: e.right - R,
            bottom: e.bottom - S
          }, R && Math.abs(R - w) < 1 && (i = "nearest"), S && Math.abs(S - b) < 1 && (r = "nearest");
        }
      if (u)
        break;
      (e.top < f.top || e.bottom > f.bottom || e.left < f.left || e.right > f.right) && (e = {
        left: Math.max(e.left, f.left),
        right: Math.min(e.right, f.right),
        top: Math.max(e.top, f.top),
        bottom: Math.min(e.bottom, f.bottom)
      }), O = O.assignedSlot || O.parentNode;
    } else if (O.nodeType == 11)
      O = O.host;
    else
      break;
}
function ka(n, e = !0) {
  let t = n.ownerDocument, i = null, r = null;
  for (let s = n.parentNode; s && !(s == t.body || (!e || i) && r); )
    if (ee(s))
      !r && s.scrollHeight > s.clientHeight && /scroll|auto/.test(getComputedStyle(s).overflowY) && (r = s), e && !i && s.scrollWidth > s.clientWidth && /scroll|auto/.test(getComputedStyle(s).overflowX) && (i = s), s = s.assignedSlot || s.parentNode;
    else if (s.nodeType == 11)
      s = s.host;
    else
      break;
  return { x: i, y: r };
}
class Mc {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: t, focusNode: i } = e;
    this.set(t, Math.min(e.anchorOffset, t ? at(t) : 0), i, Math.min(e.focusOffset, i ? at(i) : 0));
  }
  set(e, t, i, r) {
    this.anchorNode = e, this.anchorOffset = t, this.focusNode = i, this.focusOffset = r;
  }
}
function wa(n) {
  let e = [];
  for (let t = n; t; t = t.nodeType == 11 ? t.host : t.parentNode)
    ee(t) && e.push({ node: t, left: t.scrollLeft, top: t.scrollTop });
  return e;
}
function va(n, e = !0) {
  for (let { node: t, left: i, top: r } of n)
    e && t.scrollTop != r && (t.scrollTop = r), t.scrollLeft != i && (t.scrollLeft = i);
}
let xt = null;
P.safari && P.safari_version >= 26 && (xt = !1);
function Xa(n) {
  if (n.setActive)
    return n.setActive();
  if (xt)
    return n.focus(xt);
  let e = wa(n);
  n.focus(xt == null ? {
    get preventScroll() {
      return xt = { preventScroll: !0 }, !0;
    }
  } : void 0), xt || (xt = !1, va(e));
}
let bl;
function wi(n, e, t = e) {
  let i = bl || (bl = document.createRange());
  return i.setEnd(n, t), i.setStart(n, e), i;
}
function Ut(n, e, t, i) {
  let r = { key: e, code: e, keyCode: t, which: t, cancelable: !0 };
  i && ({ altKey: r.altKey, ctrlKey: r.ctrlKey, shiftKey: r.shiftKey, metaKey: r.metaKey } = i);
  let s = new KeyboardEvent("keydown", r);
  s.synthetic = !0, n.dispatchEvent(s);
  let l = new KeyboardEvent("keyup", r);
  return l.synthetic = !0, n.dispatchEvent(l), s.defaultPrevented || l.defaultPrevented;
}
function qc(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function Yc(n, e) {
  let t = e.focusNode, i = e.focusOffset;
  if (!t || e.anchorNode != t || e.anchorOffset != i)
    return !1;
  for (i = Math.min(i, at(t)); ; )
    if (i) {
      if (!ee(t))
        return !1;
      let r = t.childNodes[i - 1];
      r.contentEditable == "false" ? i-- : (t = r, i = at(t));
    } else {
      if (t == n)
        return !0;
      i = Qt(t), t = t.parentNode;
    }
}
function Za(n) {
  return n instanceof Window ? n.pageYOffset > Math.max(0, n.document.documentElement.scrollHeight - n.innerHeight - 4) : n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
function Ta(n, e) {
  for (let t = n, i = e; ; ) {
    if (Bt(t) && i > 0)
      return { node: t, offset: i };
    if (ee(t) && i > 0) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i - 1], i = at(t);
    } else if (t.parentNode && !$n(t))
      i = Qt(t), t = t.parentNode;
    else
      return null;
  }
}
function Ra(n, e) {
  for (let t = n, i = e; ; ) {
    if (Bt(t) && i < t.nodeValue.length)
      return { node: t, offset: i };
    if (ee(t) && i < t.childNodes.length) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i], i = 0;
    } else if (t.parentNode && !$n(t))
      i = Qt(t) + 1, t = t.parentNode;
    else
      return null;
  }
}
class Ae {
  constructor(e, t, i = !0) {
    this.node = e, this.offset = t, this.precise = i;
  }
  static before(e, t) {
    return new Ae(e.parentNode, Qt(e), t);
  }
  static after(e, t) {
    return new Ae(e.parentNode, Qt(e) + 1, t);
  }
}
var B = /* @__PURE__ */ (function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
})(B || (B = {}));
const It = B.LTR, Cs = B.RTL;
function Ca(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    e.push(1 << +n[t]);
  return e;
}
const zc = /* @__PURE__ */ Ca("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), Ec = /* @__PURE__ */ Ca("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), Fr = /* @__PURE__ */ Object.create(null), Ee = [];
for (let n of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ n.charCodeAt(0), t = /* @__PURE__ */ n.charCodeAt(1);
  Fr[e] = t, Fr[t] = -e;
}
function Aa(n) {
  return n <= 247 ? zc[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? Ec[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8204 ? 256 : 64336 <= n && n <= 65023 ? 4 : 1;
}
const Uc = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class Be {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Cs : It;
  }
  /**
  @internal
  */
  constructor(e, t, i) {
    this.from = e, this.to = t, this.level = i;
  }
  /**
  @internal
  */
  side(e, t) {
    return this.dir == t == e ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(e, t) {
    return e == (this.dir == t);
  }
  /**
  @internal
  */
  static find(e, t, i, r) {
    let s = -1;
    for (let l = 0; l < e.length; l++) {
      let o = e[l];
      if (o.from <= t && o.to >= t) {
        if (o.level == i)
          return l;
        (s < 0 || (r != 0 ? r < 0 ? o.from < t : o.to > t : e[s].level > o.level)) && (s = l);
      }
    }
    if (s < 0)
      throw new RangeError("Index out of range");
    return s;
  }
}
function ja(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++) {
    let i = n[t], r = e[t];
    if (i.from != r.from || i.to != r.to || i.direction != r.direction || !ja(i.inner, r.inner))
      return !1;
  }
  return !0;
}
const V = [];
function Vc(n, e, t, i, r) {
  for (let s = 0; s <= i.length; s++) {
    let l = s ? i[s - 1].to : e, o = s < i.length ? i[s].from : t, a = s ? 256 : r;
    for (let h = l, O = a, c = a; h < o; h++) {
      let f = Aa(n.charCodeAt(h));
      f == 512 ? f = O : f == 8 && c == 4 && (f = 16), V[h] = f == 4 ? 2 : f, f & 7 && (c = f), O = f;
    }
    for (let h = l, O = a, c = a; h < o; h++) {
      let f = V[h];
      if (f == 128)
        h < o - 1 && O == V[h + 1] && O & 24 ? f = V[h] = O : V[h] = 256;
      else if (f == 64) {
        let u = h + 1;
        for (; u < o && V[u] == 64; )
          u++;
        let d = h && O == 8 || u < t && V[u] == 8 ? c == 1 ? 1 : 8 : 256;
        for (let p = h; p < u; p++)
          V[p] = d;
        h = u - 1;
      } else f == 8 && c == 1 && (V[h] = 1);
      O = f, f & 7 && (c = f);
    }
  }
}
function Gc(n, e, t, i, r) {
  let s = r == 1 ? 2 : 1;
  for (let l = 0, o = 0, a = 0; l <= i.length; l++) {
    let h = l ? i[l - 1].to : e, O = l < i.length ? i[l].from : t;
    for (let c = h, f, u, d; c < O; c++)
      if (u = Fr[f = n.charCodeAt(c)])
        if (u < 0) {
          for (let p = o - 3; p >= 0; p -= 3)
            if (Ee[p + 1] == -u) {
              let m = Ee[p + 2], $ = m & 2 ? r : m & 4 ? m & 1 ? s : r : 0;
              $ && (V[c] = V[Ee[p]] = $), o = p;
              break;
            }
        } else {
          if (Ee.length == 189)
            break;
          Ee[o++] = c, Ee[o++] = f, Ee[o++] = a;
        }
      else if ((d = V[c]) == 2 || d == 1) {
        let p = d == r;
        a = p ? 0 : 1;
        for (let m = o - 3; m >= 0; m -= 3) {
          let $ = Ee[m + 2];
          if ($ & 2)
            break;
          if (p)
            Ee[m + 2] |= 2;
          else {
            if ($ & 4)
              break;
            Ee[m + 2] |= 4;
          }
        }
      }
  }
}
function Dc(n, e, t, i) {
  for (let r = 0, s = i; r <= t.length; r++) {
    let l = r ? t[r - 1].to : n, o = r < t.length ? t[r].from : e;
    for (let a = l; a < o; ) {
      let h = V[a];
      if (h == 256) {
        let O = a + 1;
        for (; ; )
          if (O == o) {
            if (r == t.length)
              break;
            O = t[r++].to, o = r < t.length ? t[r].from : e;
          } else if (V[O] == 256)
            O++;
          else
            break;
        let c = s == 1, f = (O < e ? V[O] : i) == 1, u = c == f ? c ? 1 : 2 : i;
        for (let d = O, p = r, m = p ? t[p - 1].to : n; d > a; )
          d == m && (d = t[--p].from, m = p ? t[p - 1].to : n), V[--d] = u;
        a = O;
      } else
        s = h, a++;
    }
  }
}
function Hr(n, e, t, i, r, s, l) {
  let o = i % 2 ? 2 : 1;
  if (i % 2 == r % 2)
    for (let a = e, h = 0; a < t; ) {
      let O = !0, c = !1;
      if (h == s.length || a < s[h].from) {
        let p = V[a];
        p != o && (O = !1, c = p == 16);
      }
      let f = !O && o == 1 ? [] : null, u = O ? i : i + 1, d = a;
      e: for (; ; )
        if (h < s.length && d == s[h].from) {
          if (c)
            break e;
          let p = s[h];
          if (!O)
            for (let m = p.to, $ = h + 1; ; ) {
              if (m == t)
                break e;
              if ($ < s.length && s[$].from == m)
                m = s[$++].to;
              else {
                if (V[m] == o)
                  break e;
                break;
              }
            }
          if (h++, f)
            f.push(p);
          else {
            p.from > a && l.push(new Be(a, p.from, u));
            let m = p.direction == It != !(u % 2);
            Kr(n, m ? i + 1 : i, r, p.inner, p.from, p.to, l), a = p.to;
          }
          d = p.to;
        } else {
          if (d == t || (O ? V[d] != o : V[d] == o))
            break;
          d++;
        }
      f ? Hr(n, a, d, i + 1, r, f, l) : a < d && l.push(new Be(a, d, u)), a = d;
    }
  else
    for (let a = t, h = s.length; a > e; ) {
      let O = !0, c = !1;
      if (!h || a > s[h - 1].to) {
        let p = V[a - 1];
        p != o && (O = !1, c = p == 16);
      }
      let f = !O && o == 1 ? [] : null, u = O ? i : i + 1, d = a;
      e: for (; ; )
        if (h && d == s[h - 1].to) {
          if (c)
            break e;
          let p = s[--h];
          if (!O)
            for (let m = p.from, $ = h; ; ) {
              if (m == e)
                break e;
              if ($ && s[$ - 1].to == m)
                m = s[--$].from;
              else {
                if (V[m - 1] == o)
                  break e;
                break;
              }
            }
          if (f)
            f.push(p);
          else {
            p.to < a && l.push(new Be(p.to, a, u));
            let m = p.direction == It != !(u % 2);
            Kr(n, m ? i + 1 : i, r, p.inner, p.from, p.to, l), a = p.from;
          }
          d = p.from;
        } else {
          if (d == e || (O ? V[d - 1] != o : V[d - 1] == o))
            break;
          d--;
        }
      f ? Hr(n, d, a, i + 1, r, f, l) : d < a && l.push(new Be(d, a, u)), a = d;
    }
}
function Kr(n, e, t, i, r, s, l) {
  let o = e % 2 ? 2 : 1;
  Vc(n, r, s, i, o), Gc(n, r, s, i, o), Dc(r, s, i, o), Hr(n, r, s, e, t, i, l);
}
function Lc(n, e, t) {
  if (!n)
    return [new Be(0, 0, e == Cs ? 1 : 0)];
  if (e == It && !t.length && !Uc.test(n))
    return Wa(n.length);
  if (t.length)
    for (; n.length > V.length; )
      V[V.length] = 256;
  let i = [], r = e == It ? 0 : 1;
  return Kr(n, r, r, t, 0, n.length, i), i;
}
function Wa(n) {
  return [new Be(0, n, 0)];
}
let _a = "";
function Bc(n, e, t, i, r) {
  var s;
  if (!n.length)
    return null;
  let l = i.head - n.from, o;
  if (i.head == n.from && i.assoc < 0) {
    if (!r)
      return null;
    l = e[o = 0].side(!1, t);
  } else if (i.head == n.to && i.assoc > 0) {
    if (r)
      return null;
    l = e[o = e.length - 1].side(!0, t);
  } else
    o = Be.find(e, l, (s = i.bidiLevel) !== null && s !== void 0 ? s : -1, i.assoc);
  let a = e[o], h = a.side(r, t);
  if (l == h) {
    let f = o += r ? 1 : -1;
    if (f < 0 || f >= e.length)
      return null;
    a = e[o = f], l = a.side(!r, t), h = a.side(r, t);
  }
  let O = ae(n.text, l, a.forward(r, t));
  (O < a.from || O > a.to) && (O = h), _a = n.text.slice(Math.min(l, O), Math.max(l, O));
  let c = o == (r ? e.length - 1 : 0) ? null : e[o + (r ? 1 : -1)];
  if (O == h) {
    if (!c)
      return r ? Q.cursor(n.to, 1) : Q.cursor(n.from, -1);
    if (c.level + (r ? 0 : 1) < a.level)
      return Q.cursor(c.side(!r, t) + n.from, c.forward(r, t) ? 1 : -1, c.level);
  }
  return Q.cursor(O + n.from, a.forward(r, t) ? -1 : 1, a.level);
}
function Ic(n, e, t) {
  for (let i = e; i < t; i++) {
    let r = Aa(n.charCodeAt(i));
    if (r == 1)
      return It;
    if (r == 2 || r == 4)
      return Cs;
  }
}
const Ma = /* @__PURE__ */ v.define(), qa = /* @__PURE__ */ v.define(), Ya = /* @__PURE__ */ v.define(), za = /* @__PURE__ */ v.define(), Jr = /* @__PURE__ */ v.define(), Ea = /* @__PURE__ */ v.define(), Ua = /* @__PURE__ */ v.define(), As = /* @__PURE__ */ v.define(), js = /* @__PURE__ */ v.define(), Va = /* @__PURE__ */ v.define({
  combine: (n) => n.some((e) => e)
}), Ga = /* @__PURE__ */ v.define({
  combine: (n) => n.some((e) => e)
}), Da = /* @__PURE__ */ v.define();
class Vt {
  constructor(e, t, i, r, s, l = !1) {
    this.range = e, this.y = t, this.x = i, this.yMargin = r, this.xMargin = s, this.isSnapshot = l;
  }
  map(e) {
    return e.empty ? this : new Vt(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new Vt(Q.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const Gi = /* @__PURE__ */ I.define({ map: (n, e) => n.map(e) }), La = /* @__PURE__ */ I.define();
function Ie(n, e, t) {
  let i = n.facet(za);
  i.length ? i[0](e) : window.onerror && window.onerror(String(e), t, void 0, void 0, e) || (t ? console.error(t + ":", e) : console.error(e));
}
const rt = /* @__PURE__ */ v.define({ combine: (n) => n.length ? n[0] : !0 });
let Nc = 0;
const _t = /* @__PURE__ */ v.define({
  combine(n) {
    return n.filter((e, t) => {
      for (let i = 0; i < t; i++)
        if (n[i].plugin == e.plugin)
          return !1;
      return !0;
    });
  }
});
class We {
  constructor(e, t, i, r, s) {
    this.id = e, this.create = t, this.domEventHandlers = i, this.domEventObservers = r, this.baseExtensions = s(this), this.extension = this.baseExtensions.concat(_t.of({ plugin: this, arg: void 0 }));
  }
  /**
  Create an extension for this plugin with the given argument.
  */
  of(e) {
    return this.baseExtensions.concat(_t.of({ plugin: this, arg: e }));
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, t) {
    const { eventHandlers: i, eventObservers: r, provide: s, decorations: l } = t || {};
    return new We(Nc++, e, i, r, (o) => {
      let a = [];
      return l && a.push(Un.of((h) => {
        let O = h.plugin(o);
        return O ? l(O) : G.none;
      })), s && a.push(s(o)), a;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, t) {
    return We.define((i, r) => new e(i, r), t);
  }
}
class sr {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  get plugin() {
    return this.spec && this.spec.plugin;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(t);
          } catch (i) {
            if (Ie(t.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.plugin.create(e, this.spec.arg);
      } catch (t) {
        Ie(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var t;
    if (!((t = this.value) === null || t === void 0) && t.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        Ie(e.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const Ba = /* @__PURE__ */ v.define(), Ws = /* @__PURE__ */ v.define(), Un = /* @__PURE__ */ v.define(), Ia = /* @__PURE__ */ v.define(), _s = /* @__PURE__ */ v.define(), Wi = /* @__PURE__ */ v.define(), Na = /* @__PURE__ */ v.define();
function yl(n, e) {
  let t = n.state.facet(Na);
  if (!t.length)
    return t;
  let i = t.map((s) => s instanceof Function ? s(n) : s), r = [];
  return W.spans(i, e.from, e.to, {
    point() {
    },
    span(s, l, o, a) {
      let h = s - e.from, O = l - e.from, c = r;
      for (let f = o.length - 1; f >= 0; f--, a--) {
        let u = o[f].spec.bidiIsolate, d;
        if (a > 0 && c.length && (d = c[c.length - 1]).to == h && d.direction == u)
          d.to = O, c = d.inner;
        else {
          let p = { from: h, to: O, direction: u, inner: [] };
          c.push(p), c = p.inner;
        }
      }
    }
  }), Fa(e.text, r);
}
function Fa(n, e) {
  for (let t of e) {
    if (t.direction == null) {
      for (let i = t.from, r = 0; i < t.to; r++) {
        let s = r < t.inner.length ? t.inner[r] : null, l = Ic(n, i, s ? s.from : t.to);
        if (l) {
          t.direction = l;
          break;
        }
        if (!s)
          break;
        i = s.to;
      }
      t.direction == null && (t.direction = B.LTR);
    }
    Fa(n, t.inner);
  }
  return e;
}
const Ha = /* @__PURE__ */ v.define();
function Ka(n) {
  let e = 0, t = 0, i = 0, r = 0;
  for (let s of n.state.facet(Ha)) {
    let l = s(n);
    l && (l.left != null && (e = Math.max(e, l.left)), l.right != null && (t = Math.max(t, l.right)), l.top != null && (i = Math.max(i, l.top)), l.bottom != null && (r = Math.max(r, l.bottom)));
  }
  return { left: e, right: t, top: i, bottom: r };
}
const fi = /* @__PURE__ */ v.define();
class ve {
  constructor(e, t, i, r) {
    this.fromA = e, this.toA = t, this.fromB = i, this.toB = r;
  }
  join(e) {
    return new ve(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let t = e.length, i = this;
    for (; t > 0; t--) {
      let r = e[t - 1];
      if (!(r.fromA > i.toA)) {
        if (r.toA < i.fromA)
          break;
        i = i.join(r), e.splice(t - 1, 1);
      }
    }
    return e.splice(t, 0, i), e;
  }
  // Extend a set to cover all the content in `ranges`, which is a
  // flat array with each pair of numbers representing fromB/toB
  // positions. These pairs are generated in unchanged ranges, so the
  // offset between doc A and doc B is the same for their start and
  // end points.
  static extendWithRanges(e, t) {
    if (t.length == 0)
      return e;
    let i = [];
    for (let r = 0, s = 0, l = 0; ; ) {
      let o = r < e.length ? e[r].fromB : 1e9, a = s < t.length ? t[s] : 1e9, h = Math.min(o, a);
      if (h == 1e9)
        break;
      let O = h + l, c = h, f = O;
      for (; ; )
        if (s < t.length && t[s] <= c) {
          let u = t[s + 1];
          s += 2, c = Math.max(c, u);
          for (let d = r; d < e.length && e[d].fromB <= c; d++)
            l = e[d].toA - e[d].toB;
          f = Math.max(f, u + l);
        } else if (r < e.length && e[r].fromB <= c) {
          let u = e[r++];
          c = Math.max(c, u.toB), f = Math.max(f, u.toA), l = u.toA - u.toB;
        } else
          break;
      i.push(new ve(O, f, h, c));
    }
    return i;
  }
}
class Sn {
  constructor(e, t, i) {
    this.view = e, this.state = t, this.transactions = i, this.flags = 0, this.startState = e.state, this.changes = J.empty(this.startState.doc.length);
    for (let s of i)
      this.changes = this.changes.compose(s.changes);
    let r = [];
    this.changes.iterChangedRanges((s, l, o, a) => r.push(new ve(s, l, o, a))), this.changedRanges = r;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Sn(e, t, i);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Returns true when
  [`viewportChanged`](https://codemirror.net/6/docs/ref/#view.ViewUpdate.viewportChanged) is true
  and the viewport change is not just the result of mapping it in
  response to document changes.
  */
  get viewportMoved() {
    return (this.flags & 8) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 18) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
const Fc = [];
class F {
  constructor(e, t, i = 0) {
    this.dom = e, this.length = t, this.flags = i, this.parent = null, e.cmTile = this;
  }
  get breakAfter() {
    return this.flags & 1;
  }
  get children() {
    return Fc;
  }
  isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  isComposite() {
    return !1;
  }
  isLine() {
    return !1;
  }
  isText() {
    return !1;
  }
  isBlock() {
    return !1;
  }
  get domAttrs() {
    return null;
  }
  sync(e) {
    if (this.flags |= 2, this.flags & 4) {
      this.flags &= -5;
      let t = this.domAttrs;
      t && Cc(this.dom, t);
    }
  }
  toString() {
    return this.constructor.name + (this.children.length ? `(${this.children})` : "") + (this.breakAfter ? "#" : "");
  }
  destroy() {
    this.parent = null;
  }
  setDOM(e) {
    this.dom = e, e.cmTile = this;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e, t = this.posAtStart) {
    let i = t;
    for (let r of this.children) {
      if (r == e)
        return i;
      i += r.length + r.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  covers(e) {
    return !0;
  }
  coordsIn(e, t, i) {
    return null;
  }
  domPosFor(e, t) {
    let i = Qt(this.dom), r = this.length ? e > 0 : t > 0;
    return new Ae(this.parent.dom, i + (r ? 1 : 0), e == 0 || e == this.length);
  }
  markDirty(e) {
    this.flags &= -3, e && (this.flags |= 4), this.parent && this.parent.flags & 2 && this.parent.markDirty(!1);
  }
  get overrideDOMText() {
    return null;
  }
  get root() {
    for (let e = this; e; e = e.parent)
      if (e instanceof Gn)
        return e;
    return null;
  }
  static get(e) {
    return e.cmTile;
  }
}
class Vn extends F {
  constructor(e) {
    super(e, 0), this._children = [];
  }
  isComposite() {
    return !0;
  }
  get children() {
    return this._children;
  }
  get lastChild() {
    return this.children.length ? this.children[this.children.length - 1] : null;
  }
  append(e) {
    this.children.push(e), e.parent = this;
  }
  sync(e) {
    if (this.flags & 2)
      return;
    super.sync(e);
    let t = this.dom, i = null, r, s = e?.node == t ? e : null, l = 0;
    for (let o of this.children) {
      if (o.sync(e), l += o.length + o.breakAfter, r = i ? i.nextSibling : t.firstChild, s && r != o.dom && (s.written = !0), o.dom.parentNode == t)
        for (; r && r != o.dom; )
          r = Pl(r);
      else
        t.insertBefore(o.dom, r);
      i = o.dom;
    }
    for (r = i ? i.nextSibling : t.firstChild, s && r && (s.written = !0); r; )
      r = Pl(r);
    this.length = l;
  }
}
function Pl(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Gn extends Vn {
  constructor(e, t) {
    super(t), this.view = e;
  }
  owns(e) {
    for (; e; e = e.parent)
      if (e == this)
        return !0;
    return !1;
  }
  isBlock() {
    return !0;
  }
  nearest(e) {
    for (; ; ) {
      if (!e)
        return null;
      let t = F.get(e);
      if (t && this.owns(t))
        return t;
      e = e.parentNode;
    }
  }
  blockTiles(e) {
    for (let t = [], i = this, r = 0, s = 0; ; )
      if (r == i.children.length) {
        if (!t.length)
          return;
        i = i.parent, i.breakAfter && s++, r = t.pop();
      } else {
        let l = i.children[r++];
        if (l instanceof lt)
          t.push(r), i = l, r = 0;
        else {
          let o = s + l.length, a = e(l, s);
          if (a !== void 0)
            return a;
          s = o + l.breakAfter;
        }
      }
  }
  // Find the block at the given position. If side < -1, make sure to
  // stay before block widgets at that position, if side > 1, after
  // such widgets (used for selection drawing, which needs to be able
  // to get coordinates for positions that aren't valid cursor positions).
  resolveBlock(e, t) {
    let i, r = -1, s, l = -1;
    if (this.blockTiles((o, a) => {
      let h = a + o.length;
      if (e >= a && e <= h) {
        if (o.isWidget() && t >= -1 && t <= 1) {
          if (o.flags & 32)
            return !0;
          o.flags & 16 && (i = void 0);
        }
        (a < e || e == h && (t < -1 ? o.length : o.covers(1))) && (!i || !o.isWidget() && i.isWidget()) && (i = o, r = e - a), (h > e || e == a && (t > 1 ? o.length : o.covers(-1))) && (!s || !o.isWidget() && s.isWidget()) && (s = o, l = e - a);
      }
    }), !i && !s)
      throw new Error("No tile at position " + e);
    return i && t < 0 || !s ? { tile: i, offset: r } : { tile: s, offset: l };
  }
}
class lt extends Vn {
  constructor(e, t) {
    super(e), this.wrapper = t;
  }
  isBlock() {
    return !0;
  }
  covers(e) {
    return this.children.length ? e < 0 ? this.children[0].covers(-1) : this.lastChild.covers(1) : !1;
  }
  get domAttrs() {
    return this.wrapper.attributes;
  }
  static of(e, t) {
    let i = new lt(t || document.createElement(e.tagName), e);
    return t || (i.flags |= 4), i;
  }
}
class Nt extends Vn {
  constructor(e, t) {
    super(e), this.attrs = t;
  }
  isLine() {
    return !0;
  }
  static start(e, t, i) {
    let r = new Nt(t || document.createElement("div"), e);
    return (!t || !i) && (r.flags |= 4), r;
  }
  get domAttrs() {
    return this.attrs;
  }
  // Find the tile associated with a given position in this line.
  // Side -2/2 is handled specially, in that it allows the position
  // returned to be before (-2) or after (2) widgets that would always
  // be after/before a cursor position.
  resolveInline(e, t, i = !1) {
    let r = null, s = -1, l = null, o = -1;
    function a(O, c) {
      for (let f = 0, u = 0; f < O.children.length && u <= c; f++) {
        let d = O.children[f], p = u + d.length;
        p >= c && (d.isComposite() ? a(d, c - u) : (!l || i && l.isHidden && (t > 0 && !(l.flags & 32) || i && Kc(l, d))) && (p > c || d.flags & 32 && t <= 1) ? (l = d, o = c - u) : (u < c || d.flags & 16 && !(i && d.isHidden) && t >= -1) && (r = d, s = c - u)), u = p;
      }
    }
    a(this, e);
    let h = (t < 0 ? r : l) || r || l;
    return h ? { tile: h, offset: h == r ? s : o } : null;
  }
  coordsIn(e, t, i) {
    let r = this.resolveInline(e, t, !0);
    return r ? r.tile.coordsIn(Math.max(0, r.offset), t, i) : Hc(this);
  }
  domIn(e, t) {
    let i = this.resolveInline(e, t);
    if (i) {
      let { tile: r, offset: s } = i;
      if (this.dom.contains(r.dom))
        return r.isText() ? new Ae(r.dom, Math.min(r.dom.nodeValue.length, s)) : r.domPosFor(s, r.flags & 16 ? 1 : r.flags & 32 ? -1 : t);
      let l = i.tile.parent, o = !1;
      for (let a of l.children) {
        if (o)
          return new Ae(a.dom, 0);
        a == i.tile && (o = !0);
      }
    }
    return new Ae(this.dom, 0);
  }
}
function Hc(n) {
  let e = n.dom.lastChild;
  if (!e)
    return n.dom.getBoundingClientRect();
  let t = ln(e);
  return t[t.length - 1] || null;
}
function Kc(n, e) {
  let t = n.coordsIn(0, 1), i = e.coordsIn(0, 1);
  return t && i && i.top < t.bottom;
}
class Qe extends Vn {
  constructor(e, t) {
    super(e), this.mark = t;
  }
  get domAttrs() {
    return this.mark.attrs;
  }
  static of(e, t) {
    let i = new Qe(t || document.createElement(e.tagName), e);
    return t || (i.flags |= 4), i;
  }
}
class wt extends F {
  constructor(e, t) {
    super(e, t.length), this.text = t;
  }
  sync(e) {
    this.flags & 2 || (super.sync(e), this.dom.nodeValue != this.text && (e && e.node == this.dom && (e.written = !0), this.dom.nodeValue = this.text));
  }
  isText() {
    return !0;
  }
  toString() {
    return JSON.stringify(this.text);
  }
  coordsIn(e, t, i) {
    let r = this.dom.nodeValue.length;
    e > r && (e = r);
    let s = e, l = e, o = 0;
    e == 0 && t < 0 || e == r && t >= 0 ? P.chrome || P.gecko || (e ? (s--, o = 1) : l < r && (l++, o = -1)) : t < 0 ? s-- : l < r && l++;
    let a = wi(this.dom, s, l).getClientRects();
    if (!a.length)
      return null;
    let h = a[(o ? o < 0 : t >= 0) ? 0 : a.length - 1];
    return P.safari && !o && h.width == 0 && (h = Array.prototype.find.call(a, (O) => O.width) || h), i == null ? h : Qn(h, (o ? o > 0 : t < 0) == i);
  }
  static of(e, t) {
    let i = new wt(t || document.createTextNode(e), e);
    return t || (i.flags |= 2), i;
  }
}
class Zt extends F {
  constructor(e, t, i, r) {
    super(e, t, r), this.widget = i;
  }
  isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  covers(e) {
    return this.flags & 48 ? !1 : (this.flags & (e < 0 ? 64 : 128)) > 0;
  }
  coordsIn(e, t) {
    return this.coordsInWidget(e, t, !1);
  }
  coordsInWidget(e, t, i) {
    let r = this.widget.coordsAt(this.dom, e, t);
    if (r)
      return r;
    if (i)
      return Qn(this.dom.getBoundingClientRect(), this.length ? e == 0 : t <= 0);
    {
      let s = this.dom.getClientRects(), l = null;
      if (!s.length)
        return null;
      let o = this.flags & 16 ? !0 : this.flags & 32 ? !1 : e > 0;
      for (let a = o ? s.length - 1 : 0; l = s[a], !(e > 0 ? a == 0 : a == s.length - 1 || l.top < l.bottom); a += o ? -1 : 1)
        ;
      return Qn(l, !o);
    }
  }
  get overrideDOMText() {
    if (!this.length)
      return _.empty;
    let { root: e } = this;
    if (!e)
      return _.empty;
    let t = this.posAtStart;
    return e.view.state.doc.slice(t, t + this.length);
  }
  destroy() {
    super.destroy(), this.widget.destroy(this.dom);
  }
  static of(e, t, i, r, s) {
    return s || (s = e.toDOM(t), e.editable || (s.contentEditable = "false")), new Zt(s, i, e, r);
  }
}
class bn extends F {
  constructor(e) {
    let t = document.createElement("img");
    t.className = "cm-widgetBuffer", t.setAttribute("aria-hidden", "true"), super(t, 0, e);
  }
  get isHidden() {
    return !0;
  }
  get overrideDOMText() {
    return _.empty;
  }
  coordsIn(e, t, i) {
    let r = this.dom.getBoundingClientRect();
    return i == null ? r : Qn(r, t > 0 == i);
  }
}
class Jc {
  constructor(e) {
    this.index = 0, this.beforeBreak = !1, this.parents = [], this.tile = e;
  }
  // Advance by the given distance. If side is -1, stop leaving or
  // entering tiles, or skipping zero-length tiles, once the distance
  // has been traversed. When side is 1, leave, enter, or skip
  // everything at the end position.
  advance(e, t, i) {
    let { tile: r, index: s, beforeBreak: l, parents: o } = this;
    for (; e || t > 0; )
      if (r.isComposite())
        if (l) {
          if (!e)
            break;
          i && i.break(), e--, l = !1;
        } else if (s == r.children.length) {
          if (!e && !o.length)
            break;
          i && i.leave(r), l = !!r.breakAfter, { tile: r, index: s } = o.pop(), s++;
        } else {
          let a = r.children[s], h = a.breakAfter;
          (t > 0 ? a.length <= e : a.length < e) && (!i || i.skip(a, 0, a.length) !== !1 || !a.isComposite) ? (l = !!h, s++, e -= a.length) : (o.push({ tile: r, index: s }), r = a, s = 0, i && a.isComposite() && i.enter(a));
        }
      else {
        let a = r.length;
        if (s < a && e) {
          let h = Math.min(e, a - s);
          i && i.skip(r, s, s + h), e -= h, s += h;
        }
        if (s == a)
          l = !!r.breakAfter, { tile: r, index: s } = o.pop(), s++;
        else if (!e)
          break;
      }
    return this.tile = r, this.index = s, this.beforeBreak = l, this;
  }
  get root() {
    return this.parents.length ? this.parents[0].tile : this.tile;
  }
}
class ef {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.wrapper = i, this.rank = r;
  }
}
class tf {
  constructor(e, t, i) {
    this.cache = e, this.root = t, this.blockWrappers = i, this.curLine = null, this.lastBlock = null, this.afterWidget = null, this.pos = 0, this.wrappers = [], this.wrapperPos = 0;
  }
  addText(e, t, i, r) {
    var s;
    this.flushBuffer();
    let l = this.ensureMarks(t, i), o = l.lastChild;
    if (o && o.isText() && !(o.flags & 8) && o.length + e.length < 512) {
      this.cache.reused.set(
        o,
        2
        /* Reused.DOM */
      );
      let a = l.children[l.children.length - 1] = new wt(o.dom, o.text + e);
      a.parent = l;
    } else
      l.append(r || wt.of(e, (s = this.cache.find(wt)) === null || s === void 0 ? void 0 : s.dom));
    this.pos += e.length, this.afterWidget = null;
  }
  addComposition(e, t) {
    let i = this.curLine;
    i.dom != t.line.dom && (i.setDOM(this.cache.reused.has(t.line) ? lr(t.line.dom) : t.line.dom), this.cache.reused.set(
      t.line,
      2
      /* Reused.DOM */
    ));
    let r = i;
    for (let o = t.marks.length - 1; o >= 0; o--) {
      let a = t.marks[o], h = r.lastChild;
      if (h instanceof Qe && h.mark.eq(a.mark))
        h.dom != a.dom && h.setDOM(lr(a.dom)), r = h;
      else {
        let { dom: O } = a;
        this.cache.reused.get(a) && F.get(a.dom) && (O = lr(a.dom));
        let c = Qe.of(a.mark, O);
        r.append(c), r = c;
      }
      this.cache.reused.set(
        a,
        2
        /* Reused.DOM */
      );
    }
    let s = F.get(e.text);
    s && this.cache.reused.set(
      s,
      2
      /* Reused.DOM */
    );
    let l = new wt(e.text, e.text.nodeValue);
    l.flags |= 8, this.pos = e.range.toB, r.append(l);
  }
  addInlineWidget(e, t, i) {
    let r = this.afterWidget && e.flags & 48 && (this.afterWidget.flags & 48) == (e.flags & 48);
    r || this.flushBuffer();
    let s = this.ensureMarks(t, i);
    !r && !(e.flags & 16) && s.append(this.getBuffer(1)), s.append(e), this.pos += e.length, this.afterWidget = e;
  }
  addMark(e, t, i) {
    this.flushBuffer(), this.ensureMarks(t, i).append(e), this.pos += e.length, this.afterWidget = null;
  }
  addBlockWidget(e) {
    this.getBlockPos().append(e), this.pos += e.length, this.lastBlock = e, this.endLine();
  }
  continueWidget(e) {
    let t = this.afterWidget || this.lastBlock;
    t.length += e, this.pos += e;
  }
  addLineStart(e, t) {
    var i;
    e || (e = Ja);
    let r = Nt.start(e, t || ((i = this.cache.find(Nt)) === null || i === void 0 ? void 0 : i.dom), !!t);
    this.getBlockPos().append(this.lastBlock = this.curLine = r);
  }
  addLine(e) {
    this.getBlockPos().append(e), this.pos += e.length, this.lastBlock = e, this.endLine();
  }
  addBreak() {
    this.lastBlock.flags |= 1, this.endLine(), this.pos++;
  }
  addLineStartIfNotCovered(e) {
    this.blockPosCovered() || this.addLineStart(e);
  }
  ensureLine(e) {
    this.curLine || this.addLineStart(e);
  }
  ensureMarks(e, t) {
    var i;
    let r = this.curLine;
    for (let s = e.length - 1; s >= 0; s--) {
      let l = e[s], o;
      if (t > 0 && (o = r.lastChild) && o instanceof Qe && o.mark.eq(l))
        r = o, t--;
      else {
        let a = Qe.of(l, (i = this.cache.find(Qe, (h) => h.mark.eq(l))) === null || i === void 0 ? void 0 : i.dom);
        r.append(a), r = a, t = 0;
      }
    }
    return r;
  }
  endLine() {
    if (this.curLine) {
      this.flushBuffer();
      let e = this.curLine.lastChild;
      (!e || !xl(this.curLine, !1) || e.dom.nodeName != "BR" && e.isWidget() && !(P.ios && xl(this.curLine, !0))) && this.curLine.append(this.cache.findWidget(
        or,
        0,
        32
        /* TileFlag.After */
      ) || new Zt(
        or.toDOM(),
        0,
        or,
        32
        /* TileFlag.After */
      )), this.curLine = this.afterWidget = null;
    }
  }
  updateBlockWrappers() {
    this.wrapperPos > this.pos + 1e4 && (this.blockWrappers.goto(this.pos), this.wrappers.length = 0);
    for (let e = this.wrappers.length - 1; e >= 0; e--)
      this.wrappers[e].to < this.pos && this.wrappers.splice(e, 1);
    for (let e = this.blockWrappers; e.value && e.from <= this.pos; e.next())
      if (e.to >= this.pos) {
        let t = e.rank * 102 + e.value.rank, i = new ef(e.from, e.to, e.value, t), r = this.wrappers.length;
        for (; r > 0 && (this.wrappers[r - 1].rank - i.rank || this.wrappers[r - 1].to - i.to) < 0; )
          r--;
        this.wrappers.splice(r, 0, i);
      }
    this.wrapperPos = this.pos;
  }
  getBlockPos() {
    var e;
    this.updateBlockWrappers();
    let t = this.root;
    for (let i of this.wrappers) {
      let r = t.lastChild;
      if (i.from < this.pos && r instanceof lt && r.wrapper.eq(i.wrapper))
        t = r;
      else {
        let s = lt.of(i.wrapper, (e = this.cache.find(lt, (l) => l.wrapper.eq(i.wrapper))) === null || e === void 0 ? void 0 : e.dom);
        t.append(s), t = s;
      }
    }
    return t;
  }
  blockPosCovered() {
    let e = this.lastBlock;
    return e != null && !e.breakAfter && (!e.isWidget() || (e.flags & 160) > 0);
  }
  getBuffer(e) {
    let t = 2 | (e < 0 ? 16 : 32), i = this.cache.find(
      bn,
      void 0,
      1
      /* Reused.Full */
    );
    return i && (i.flags = t), i || new bn(t);
  }
  flushBuffer() {
    this.afterWidget && !(this.afterWidget.flags & 32) && (this.afterWidget.parent.append(this.getBuffer(-1)), this.afterWidget = null);
  }
}
class nf {
  constructor(e) {
    this.skipCount = 0, this.text = "", this.textOff = 0, this.cursor = e.iter();
  }
  skip(e) {
    this.textOff + e <= this.text.length ? this.textOff += e : (this.skipCount += e - (this.text.length - this.textOff), this.text = "", this.textOff = 0);
  }
  next(e) {
    if (this.textOff == this.text.length) {
      let { value: r, lineBreak: s, done: l } = this.cursor.next(this.skipCount);
      if (this.skipCount = 0, l)
        throw new Error("Ran out of text content when drawing inline views");
      this.text = r;
      let o = this.textOff = Math.min(e, r.length);
      return s ? null : r.slice(0, o);
    }
    let t = Math.min(this.text.length, this.textOff + e), i = this.text.slice(this.textOff, t);
    return this.textOff = t, i;
  }
}
const yn = [Zt, Nt, wt, Qe, bn, lt, Gn];
for (let n = 0; n < yn.length; n++)
  yn[n].bucket = n;
class rf {
  constructor(e) {
    this.view = e, this.buckets = yn.map(() => []), this.index = yn.map(() => 0), this.reused = /* @__PURE__ */ new Map();
  }
  // Put a tile in the cache.
  add(e) {
    let t = e.constructor.bucket, i = this.buckets[t];
    i.length < 6 ? i.push(e) : i[
      this.index[t] = (this.index[t] + 1) % 6
      /* C.Bucket */
    ] = e;
  }
  find(e, t, i = 2) {
    let r = e.bucket, s = this.buckets[r], l = this.index[r];
    for (let o = 0; o < s.length; o++) {
      let a = (o + l) % s.length, h = s[a];
      if ((!t || t(h)) && !this.reused.has(h))
        return s.splice(a, 1), a < l && this.index[r]--, this.reused.set(h, i), h;
    }
    return null;
  }
  findWidget(e, t, i) {
    let r = this.buckets[0];
    if (r.length)
      for (let s = 0, l = 0; ; s++) {
        if (s == r.length) {
          if (l)
            return null;
          l = 1, s = 0;
        }
        let o = r[s];
        if (!this.reused.has(o) && (l == 0 ? o.widget.compare(e) : o.widget.constructor == e.constructor && e.updateDOM(o.dom, this.view, o.widget)))
          return r.splice(s, 1), s < this.index[0] && this.index[0]--, o.widget == e && o.length == t && (o.flags & 497) == i ? (this.reused.set(
            o,
            1
            /* Reused.Full */
          ), o) : (this.reused.set(
            o,
            2
            /* Reused.DOM */
          ), new Zt(o.dom, t, e, o.flags & -498 | i));
      }
  }
  reuse(e) {
    return this.reused.set(
      e,
      1
      /* Reused.Full */
    ), e;
  }
  maybeReuse(e, t = 2) {
    if (!this.reused.has(e))
      return this.reused.set(e, t), e.dom;
  }
  clear() {
    for (let e = 0; e < this.buckets.length; e++)
      this.buckets[e].length = this.index[e] = 0;
  }
}
class sf {
  constructor(e, t, i, r, s) {
    this.view = e, this.decorations = r, this.disallowBlockEffectsFor = s, this.openWidget = !1, this.openMarks = 0, this.cache = new rf(e), this.text = new nf(e.state.doc), this.builder = new tf(this.cache, new Gn(e, e.contentDOM), W.iter(i)), this.cache.reused.set(
      t,
      2
      /* Reused.DOM */
    ), this.old = new Jc(t), this.reuseWalker = {
      skip: (l, o, a) => {
        if (this.cache.add(l), l.isComposite())
          return !1;
      },
      enter: (l) => this.cache.add(l),
      leave: () => {
      },
      break: () => {
      }
    };
  }
  run(e, t) {
    let i = t && this.getCompositionContext(t.text);
    for (let r = 0, s = 0, l = 0; ; ) {
      let o = l < e.length ? e[l++] : null, a = o ? o.fromA : this.old.root.length;
      if (a > r) {
        let h = a - r;
        this.preserve(h, !l, !o), r = a, s += h;
      }
      if (!o)
        break;
      t && o.fromA <= t.range.fromA && o.toA >= t.range.toA ? (this.forward(o.fromA, t.range.fromA, t.range.fromA < t.range.toA ? 1 : -1), this.emit(s, t.range.fromB), this.builder.flushBuffer(), this.cache.clear(), this.builder.addComposition(t, i), this.text.skip(t.range.toB - t.range.fromB), this.forward(t.range.fromA, o.toA), this.emit(t.range.toB, o.toB)) : (this.forward(o.fromA, o.toA), this.emit(s, o.toB)), s = o.toB, r = o.toA;
    }
    return this.builder.curLine && this.builder.endLine(), this.builder.root;
  }
  preserve(e, t, i) {
    let r = af(this.old), s = this.openMarks;
    this.old.advance(e, i ? 1 : -1, {
      skip: (l, o, a) => {
        if (l.isWidget())
          if (this.openWidget)
            this.builder.continueWidget(a - o);
          else {
            let h = a > 0 || o < l.length ? Zt.of(l.widget, this.view, a - o, l.flags & 496, this.cache.maybeReuse(l)) : this.cache.reuse(l);
            h.flags & 256 ? (h.flags &= -2, this.builder.addBlockWidget(h)) : (this.builder.ensureLine(null), this.builder.addInlineWidget(h, r, s), s = r.length);
          }
        else if (l.isText())
          this.builder.ensureLine(null), !o && a == l.length && !this.cache.reused.has(l) ? this.builder.addText(l.text, r, s, this.cache.reuse(l)) : (this.cache.add(l), this.builder.addText(l.text.slice(o, a), r, s)), s = r.length;
        else if (l.isLine())
          l.flags &= -2, this.cache.reused.set(
            l,
            1
            /* Reused.Full */
          ), this.builder.addLine(l);
        else if (l instanceof bn)
          this.cache.add(l);
        else if (l instanceof Qe)
          this.builder.ensureLine(null), this.builder.addMark(l, r, s), this.cache.reused.set(
            l,
            1
            /* Reused.Full */
          ), s = r.length;
        else
          return !1;
        this.openWidget = !1;
      },
      enter: (l) => {
        l.isLine() ? this.builder.addLineStart(l.attrs, this.cache.maybeReuse(l)) : (this.cache.add(l), l instanceof Qe && r.unshift(l.mark)), this.openWidget = !1;
      },
      leave: (l) => {
        l.isLine() ? r.length && (r.length = s = 0) : l instanceof Qe && (r.shift(), s = Math.min(s, r.length));
      },
      break: () => {
        this.builder.addBreak(), this.openWidget = !1;
      }
    }), this.text.skip(e);
  }
  emit(e, t) {
    let i = null, r = this.builder, s = -1, l = W.spans(this.decorations, e, t, {
      point: (o, a, h, O, c, f) => {
        if (h instanceof Xt) {
          if (this.disallowBlockEffectsFor[f]) {
            if (h.block)
              throw new RangeError("Block decorations may not be specified via plugins");
            if (a > this.view.state.doc.lineAt(o).to)
              throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
          }
          if (s = O.length, c > O.length)
            r.continueWidget(a - o);
          else {
            let u = h.widget || (h.block ? Ft.block : Ft.inline), d = lf(h), p = this.cache.findWidget(u, a - o, d) || Zt.of(u, this.view, a - o, d);
            h.block ? (h.startSide > 0 && r.addLineStartIfNotCovered(i), r.addBlockWidget(p)) : (r.ensureLine(i), r.addInlineWidget(p, O, c));
          }
          i = null;
        } else
          i = of(i, h);
        a > o && this.text.skip(a - o);
      },
      span: (o, a, h, O) => {
        for (let c = o; c < a; ) {
          let f = this.text.next(Math.min(512, a - c));
          f == null ? (r.addLineStartIfNotCovered(i), r.addBreak(), c++) : (r.ensureLine(i), r.addText(f, h, c == o ? O : h.length), c += f.length), i = null;
        }
        s = h.length;
      }
    });
    s > -1 && (this.openWidget = l > s), this.openWidget || r.addLineStartIfNotCovered(i), this.openMarks = l;
  }
  forward(e, t, i = 1) {
    t - e <= 10 ? this.old.advance(t - e, i, this.reuseWalker) : (this.old.advance(5, -1, this.reuseWalker), this.old.advance(t - e - 10, -1), this.old.advance(5, i, this.reuseWalker));
  }
  getCompositionContext(e) {
    let t = [], i = null;
    for (let r = e.parentNode; ; r = r.parentNode) {
      let s = F.get(r);
      if (r == this.view.contentDOM)
        break;
      s instanceof Qe ? t.push(s) : s?.isLine() ? i = s : s instanceof lt || (r.nodeName == "DIV" && !i ? i = new Nt(r, Ja) : i || t.push(Qe.of(new Ai({ tagName: r.nodeName.toLowerCase(), attributes: Ac(r) }), r)));
    }
    return i ? { line: i, marks: t } : null;
  }
}
function xl(n, e) {
  let t = (i) => {
    for (let r of i.children)
      if ((e ? r.isText() : r.length) || t(r))
        return !0;
    return !1;
  };
  return t(n);
}
function lf(n) {
  let e = n.isReplace ? (n.startSide < 0 ? 64 : 0) | (n.endSide > 0 ? 128 : 0) : n.startSide > 0 ? 32 : 16;
  return n.block && (e |= 256), e;
}
const Ja = { class: "cm-line" };
function of(n, e) {
  let t = e.spec.attributes, i = e.spec.class;
  return !t && !i || (n || (n = { class: "cm-line" }), t && Ts(t, n), i && (n.class += " " + i)), n;
}
function af(n) {
  let e = [];
  for (let t = n.parents.length; t > 1; t--) {
    let i = t == n.parents.length ? n.tile : n.parents[t].tile;
    i instanceof Qe && e.push(i.mark);
  }
  return e;
}
function lr(n) {
  let e = F.get(n);
  return e && e.setDOM(n.cloneNode()), n;
}
class Ft extends Ci {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
Ft.inline = /* @__PURE__ */ new Ft("span");
Ft.block = /* @__PURE__ */ new Ft("div");
const or = /* @__PURE__ */ new class extends Ci {
  toDOM() {
    return document.createElement("br");
  }
  get isHidden() {
    return !0;
  }
  get editable() {
    return !0;
  }
}();
class kl {
  constructor(e) {
    this.view = e, this.decorations = [], this.blockWrappers = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.editContextFormatting = G.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.updateDeco(), this.tile = new Gn(e, e.contentDOM), this.updateInner([new ve(0, 0, 0, e.state.doc.length)], null);
  }
  // Update the document view to a given state.
  update(e) {
    var t;
    let i = e.changedRanges;
    this.minWidth > 0 && i.length && (i.every(({ fromA: O, toA: c }) => c < this.minWidthFrom || O > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(e);
    let r = -1;
    this.view.inputState.composing >= 0 && !this.view.observer.editContext && (!((t = this.domChanged) === null || t === void 0) && t.newSel ? r = this.domChanged.newSel.head : !mf(e.changes, this.hasComposition) && !e.selectionSet && (r = e.state.selection.main.head));
    let s = r > -1 ? Of(this.view, e.changes, r) : null;
    if (this.domChanged = null, this.hasComposition) {
      let { from: O, to: c } = this.hasComposition;
      i = new ve(O, c, e.changes.mapPos(O, -1), e.changes.mapPos(c, 1)).addToSet(i.slice());
    }
    this.hasComposition = s ? { from: s.range.fromB, to: s.range.toB } : null, (P.ie || P.chrome) && !s && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let l = this.decorations, o = this.blockWrappers;
    this.updateDeco();
    let a = uf(l, this.decorations, e.changes);
    a.length && (i = ve.extendWithRanges(i, a));
    let h = pf(o, this.blockWrappers, e.changes);
    return h.length && (i = ve.extendWithRanges(i, h)), s && !i.some((O) => O.fromA <= s.range.fromA && O.toA >= s.range.toA) && (i = s.range.addToSet(i.slice())), this.tile.flags & 2 && i.length == 0 ? !1 : (this.updateInner(i, s), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, t) {
    this.view.viewState.mustMeasureContent = !0;
    let { observer: i } = this.view;
    i.ignore(() => {
      if (t || e.length) {
        let l = this.tile, o = new sf(this.view, l, this.blockWrappers, this.decorations, this.dynamicDecorationMap);
        t && F.get(t.text) && o.cache.reused.set(
          F.get(t.text),
          2
          /* Reused.DOM */
        ), this.tile = o.run(e, t), es(l, o.cache.reused);
      }
      this.tile.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.tile.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let s = P.chrome || P.ios ? { node: i.selectionRange.focusNode, written: !1 } : void 0;
      this.tile.sync(s), s && (s.written || i.selectionRange.focusNode != s.node || !this.tile.dom.contains(s.node)) && (this.forceSelection = !0), this.tile.dom.style.height = "";
    });
    let r = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let s of this.tile.children)
        s.isWidget() && s.widget instanceof ar && r.push(s.dom);
    i.updateGaps(r);
  }
  updateEditContextFormatting(e) {
    this.editContextFormatting = this.editContextFormatting.map(e.changes);
    for (let t of e.transactions)
      for (let i of t.effects)
        i.is(La) && (this.editContextFormatting = i.value);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, t = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let { dom: i } = this.tile, r = this.view.root.activeElement, s = r == i, l = !s && !(this.view.state.facet(rt) || i.tabIndex > -1) && mi(i, this.view.observer.selectionRange) && !(r && i.contains(r));
    if (!(s || t || l))
      return;
    let o = this.forceSelection;
    this.forceSelection = !1;
    let a = this.view.state.selection.main, h, O;
    if (a.empty ? O = h = this.inlineDOMNearPos(a.anchor, a.assoc || 1) : (O = this.inlineDOMNearPos(a.head, a.head == a.from ? 1 : -1), h = this.inlineDOMNearPos(a.anchor, a.anchor == a.from ? 1 : -1)), P.gecko && a.empty && !this.hasComposition && hf(h)) {
      let f = document.createTextNode("");
      this.view.observer.ignore(() => h.node.insertBefore(f, h.node.childNodes[h.offset] || null)), h = O = new Ae(f, 0), o = !0;
    }
    let c = this.view.observer.selectionRange;
    (o || !c.focusNode || (!$i(h.node, h.offset, c.anchorNode, c.anchorOffset) || !$i(O.node, O.offset, c.focusNode, c.focusOffset)) && !this.suppressWidgetCursorChange(c, a)) && (this.view.observer.ignore(() => {
      P.android && P.chrome && i.contains(c.focusNode) && gf(c.focusNode, i) && (i.blur(), i.focus({ preventScroll: !0 }));
      let f = ki(this.view.root);
      if (f) if (a.empty) {
        if (P.gecko) {
          let u = cf(h.node, h.offset);
          if (u && u != 3) {
            let d = (u == 1 ? Ta : Ra)(h.node, h.offset);
            d && (h = new Ae(d.node, d.offset));
          }
        }
        f.collapse(h.node, h.offset), a.bidiLevel != null && f.caretBidiLevel !== void 0 && (f.caretBidiLevel = a.bidiLevel);
      } else if (f.extend) {
        f.collapse(h.node, h.offset);
        try {
          f.extend(O.node, O.offset);
        } catch {
        }
      } else {
        let u = document.createRange();
        a.anchor > a.head && ([h, O] = [O, h]), u.setEnd(O.node, O.offset), u.setStart(h.node, h.offset), f.removeAllRanges(), f.addRange(u);
      }
      l && this.view.root.activeElement == i && (i.blur(), r && r.focus());
    }), this.view.observer.setSelectionRange(h, O)), this.impreciseAnchor = h.precise ? null : new Ae(c.anchorNode, c.anchorOffset), this.impreciseHead = O.precise ? null : new Ae(c.focusNode, c.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(e, t) {
    return this.hasComposition && t.empty && $i(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, t = e.state.selection.main, i = ki(e.root), { anchorNode: r, anchorOffset: s } = e.observer.selectionRange;
    if (!i || !t.empty || !t.assoc || !i.modify)
      return;
    let l = this.lineAt(t.head, t.assoc);
    if (!l)
      return;
    let o = l.posAtStart;
    if (t.head == o || t.head == o + l.length)
      return;
    let a = this.coordsAt(t.head, -1), h = this.coordsAt(t.head, 1);
    if (!a || !h || a.bottom > h.top)
      return;
    let O = this.domAtPos(t.head + t.assoc, t.assoc);
    i.collapse(O.node, O.offset), i.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let c = e.observer.selectionRange;
    e.docView.posFromDOM(c.anchorNode, c.anchorOffset) != t.from && i.collapse(r, s);
  }
  posFromDOM(e, t) {
    let i = this.tile.nearest(e);
    if (!i)
      return this.tile.dom.compareDocumentPosition(e) & 2 ? 0 : this.view.state.doc.length;
    let r = i.posAtStart;
    if (i.isComposite()) {
      let s;
      if (e == i.dom)
        s = i.dom.childNodes[t];
      else {
        let l = at(e) == 0 ? 0 : t == 0 ? -1 : 1;
        for (; ; ) {
          let o = e.parentNode;
          if (o == i.dom)
            break;
          l == 0 && o.firstChild != o.lastChild && (e == o.firstChild ? l = -1 : l = 1), e = o;
        }
        l < 0 ? s = e : s = e.nextSibling;
      }
      if (s == i.dom.firstChild)
        return r;
      for (; s && !F.get(s); )
        s = s.nextSibling;
      if (!s)
        return r + i.length;
      for (let l = 0, o = r; ; l++) {
        let a = i.children[l];
        if (a.dom == s)
          return o;
        o += a.length + a.breakAfter;
      }
    } else return i.isText() ? e == i.dom ? r + t : r + (t ? i.length : 0) : r;
  }
  domAtPos(e, t) {
    let { tile: i, offset: r } = this.tile.resolveBlock(e, t);
    return i.isWidget() ? i.domPosFor(r, t) : i.domIn(r, t);
  }
  inlineDOMNearPos(e, t) {
    let i, r = -1, s = !1, l, o = -1, a = !1;
    return this.tile.blockTiles((h, O) => {
      if (h.isWidget()) {
        if (h.flags & 32 && O >= e)
          return !0;
        h.flags & 16 && (s = !0);
      } else {
        let c = O + h.length;
        if (O <= e && (i = h, r = e - O, s = c < e), c >= e && !l && (l = h, o = e - O, a = O > e), O > e && l)
          return !0;
      }
    }), !i && !l ? this.domAtPos(e, t) : (s && l ? i = null : a && i && (l = null), i && t < 0 || !l ? i.domIn(r, t) : l.domIn(o, t));
  }
  // Get the coord of the element at the given side of the given
  // position. If rtl is given, flatten it using that text direction.
  coordsAt(e, t, i) {
    let { tile: r, offset: s } = this.tile.resolveBlock(e, t);
    return r.isWidget() ? r.widget instanceof ar ? null : r.coordsInWidget(s, t, !0) : r.coordsIn(s, t, i);
  }
  lineAt(e, t) {
    let { tile: i } = this.tile.resolveBlock(e, t);
    return i.isLine() ? i : null;
  }
  coordsForChar(e) {
    let { tile: t, offset: i } = this.tile.resolveBlock(e, 1);
    if (!t.isLine())
      return null;
    function r(s, l) {
      if (s.isComposite())
        for (let o of s.children) {
          if (o.length >= l) {
            let a = r(o, l);
            if (a)
              return a;
          }
          if (l -= o.length, l < 0)
            break;
        }
      else if (s.isText() && l < s.length) {
        let o = ae(s.text, l);
        if (o == l)
          return null;
        let a = wi(s.dom, l, o).getClientRects();
        for (let h = 0; h < a.length; h++) {
          let O = a[h];
          if (h == a.length - 1 || O.top < O.bottom && O.left < O.right)
            return O;
        }
      }
      return null;
    }
    return r(t, i);
  }
  measureVisibleLineHeights(e) {
    let t = [], { from: i, to: r } = e, s = this.view.contentDOM.clientWidth, l = s > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, o = -1, a = this.view.textDirection == B.LTR, h = 0, O = (c, f, u) => {
      for (let d = 0; d < c.children.length && !(f > r); d++) {
        let p = c.children[d], m = f + p.length, $ = p.dom.getBoundingClientRect(), { height: w } = $;
        if (u && !d && (h += $.top - u.top), p instanceof lt)
          m > i && O(p, f, $);
        else if (f >= i && (h > 0 && t.push(-h), t.push(w + h), h = 0, l)) {
          let b = p.dom.lastChild, R = b ? ln(b) : [];
          if (R.length) {
            let S = R[R.length - 1], x = a ? S.right - $.left : $.right - S.left;
            x > o && (o = x, this.minWidth = s, this.minWidthFrom = f, this.minWidthTo = m);
          }
        }
        u && d == c.children.length - 1 && (h += u.bottom - $.bottom), f = m + p.breakAfter;
      }
    };
    return O(this.tile, 0, null), t;
  }
  textDirectionAt(e) {
    let { tile: t } = this.tile.resolveBlock(e, 1);
    return getComputedStyle(t.dom).direction == "rtl" ? B.RTL : B.LTR;
  }
  measureTextSize() {
    let e = this.tile.blockTiles((l) => {
      if (l.isLine() && l.children.length && l.length <= 20) {
        let o = 0, a;
        for (let h of l.children) {
          if (!h.isText() || /[^ -~]/.test(h.text))
            return;
          let O = ln(h.dom);
          if (O.length != 1)
            return;
          o += O[0].width, a = O[0].height;
        }
        if (o)
          return {
            lineHeight: l.dom.getBoundingClientRect().height,
            charWidth: o / l.length,
            textHeight: a
          };
      }
    });
    if (e)
      return e;
    let t = document.createElement("div"), i, r, s;
    return t.className = "cm-line", t.style.width = "99999px", t.style.position = "absolute", t.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.tile.dom.appendChild(t);
      let l = ln(t.firstChild)[0];
      i = t.getBoundingClientRect().height, r = l && l.width ? l.width / 27 : 7, s = l && l.height ? l.height : i, t.remove();
    }), { lineHeight: i, charWidth: r, textHeight: s };
  }
  computeBlockGapDeco() {
    let e = [], t = this.view.viewState;
    for (let i = 0, r = 0; ; r++) {
      let s = r == t.viewports.length ? null : t.viewports[r], l = s ? s.from - 1 : this.view.state.doc.length;
      if (l > i) {
        let o = (t.lineBlockAt(l).bottom - t.lineBlockAt(i).top) / this.view.scaleY;
        e.push(G.replace({
          widget: new ar(o),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, l));
      }
      if (!s)
        break;
      i = s.to + 1;
    }
    return G.set(e);
  }
  updateDeco() {
    let e = 1, t = this.view.state.facet(Un).map((s) => (this.dynamicDecorationMap[e++] = typeof s == "function") ? s(this.view) : s), i = !1, r = this.view.state.facet(_s).map((s, l) => {
      let o = typeof s == "function";
      return o && (i = !0), o ? s(this.view) : s;
    });
    for (r.length && (this.dynamicDecorationMap[e++] = i, t.push(W.join(r))), this.decorations = [
      this.editContextFormatting,
      ...t,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ]; e < this.decorations.length; )
      this.dynamicDecorationMap[e++] = !1;
    this.blockWrappers = this.view.state.facet(Ia).map((s) => typeof s == "function" ? s(this.view) : s);
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let h = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = h.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    for (let h of this.view.state.facet(Da))
      try {
        if (h(this.view, e.range, e))
          return !0;
      } catch (O) {
        Ie(this.view.state, O, "scroll handler");
      }
    let { range: t } = e, i = this.coordsAt(t.head, t.assoc || (t.head > t.anchor ? -1 : 1)), r;
    if (!i)
      return;
    !t.empty && (r = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (i = {
      left: Math.min(i.left, r.left),
      top: Math.min(i.top, r.top),
      right: Math.max(i.right, r.right),
      bottom: Math.max(i.bottom, r.bottom)
    });
    let s = Ka(this.view), l = {
      left: i.left - s.left,
      top: i.top - s.top,
      right: i.right + s.right,
      bottom: i.bottom + s.bottom
    }, { offsetWidth: o, offsetHeight: a } = this.view.scrollDOM;
    if (_c(this.view.scrollDOM, l, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, o), -o), Math.max(Math.min(e.yMargin, a), -a), this.view.textDirection == B.LTR), window.visualViewport && window.innerHeight - window.visualViewport.height > 1 && (i.top > window.visualViewport.offsetTop + window.visualViewport.height || i.bottom < window.visualViewport.offsetTop)) {
      let h = this.view.docView.lineAt(t.head, 1);
      if (h) {
        let O = wa(h.dom);
        h.dom.scrollIntoView({ block: "nearest" }), va(O, !1);
      }
    }
  }
  lineHasWidget(e) {
    let t = (i) => i.isWidget() || i.children.some(t);
    return t(this.tile.resolveBlock(e, 1).tile);
  }
  destroy() {
    es(this.tile);
  }
}
function es(n, e) {
  let t = e?.get(n);
  if (t != 1) {
    t == null && n.destroy();
    for (let i of n.children)
      es(i, e);
  }
}
function hf(n) {
  return ee(n.node) && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
function eh(n, e) {
  let t = n.observer.selectionRange;
  if (!t.focusNode)
    return null;
  let i = Ta(t.focusNode, t.focusOffset), r = Ra(t.focusNode, t.focusOffset), s = i || r;
  if (r && i && r.node != i.node) {
    let o = F.get(r.node);
    if (!o || o.isText() && o.text != r.node.nodeValue)
      s = r;
    else if (n.docView.lastCompositionAfterCursor) {
      let a = F.get(i.node);
      !a || a.isText() && a.text != i.node.nodeValue || (s = r);
    }
  }
  if (n.docView.lastCompositionAfterCursor = s != i, !s)
    return null;
  let l = e - s.offset;
  return { from: l, to: l + s.node.nodeValue.length, node: s.node };
}
function Of(n, e, t) {
  let i = eh(n, t);
  if (!i)
    return null;
  let { node: r, from: s, to: l } = i, o = r.nodeValue;
  if (/[\n\r]/.test(o) || n.state.doc.sliceString(i.from, i.to) != o)
    return null;
  let a = e.invertedDesc;
  return { range: new ve(a.mapPos(s), a.mapPos(l), s, l), text: r };
}
function cf(n, e) {
  return ee(n) ? (e && n.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < n.childNodes.length && n.childNodes[e].contentEditable == "false" ? 2 : 0) : 0;
}
let ff = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    Et(e, t, this.changes);
  }
  comparePoint(e, t) {
    Et(e, t, this.changes);
  }
  boundChange(e) {
    Et(e, e, this.changes);
  }
};
function uf(n, e, t) {
  let i = new ff();
  return W.compare(n, e, t, i), i.changes;
}
class df {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    Et(e, t, this.changes);
  }
  comparePoint() {
  }
  boundChange(e) {
    Et(e, e, this.changes);
  }
}
function pf(n, e, t) {
  let i = new df();
  return W.compare(n, e, t, i), i.changes;
}
function gf(n, e) {
  for (let t = n; t && t != e; t = t.assignedSlot || t.parentNode)
    if (ee(t) && t.contentEditable == "false")
      return !0;
  return !1;
}
function mf(n, e) {
  let t = !1;
  return e && n.iterChangedRanges((i, r) => {
    i < e.to && r > e.from && (t = !0);
  }), t;
}
class ar extends Ci {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return e.className = "cm-gap", this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
  ignoreEvent() {
    return !1;
  }
}
function $f(n, e, t = 1) {
  let i = n.charCategorizer(e), r = n.doc.lineAt(e), s = e - r.from;
  if (r.length == 0)
    return Q.cursor(e);
  s == 0 ? t = 1 : s == r.length && (t = -1);
  let l = s, o = s;
  t < 0 ? l = ae(r.text, s, !1) : o = ae(r.text, s);
  let a = i(r.text.slice(l, o));
  for (; l > 0; ) {
    let h = ae(r.text, l, !1);
    if (i(r.text.slice(h, l)) != a)
      break;
    l = h;
  }
  for (; o < r.length; ) {
    let h = ae(r.text, o);
    if (i(r.text.slice(o, h)) != a)
      break;
    o = h;
  }
  return Q.undirectionalRange(l + r.from, o + r.from);
}
function Qf(n, e, t, i, r) {
  let s = Math.round((i - e.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && t.height > n.defaultLineHeight * 1.5) {
    let o = n.viewState.heightOracle.textHeight, a = Math.floor((r - t.top - (n.defaultLineHeight - o) * 0.5) / o);
    s += a * n.viewState.heightOracle.lineLength;
  }
  let l = n.state.sliceDoc(t.from, t.to);
  return t.from + vc(l, s, n.state.tabSize);
}
function ts(n, e, t) {
  let i = n.lineBlockAt(e);
  if (Array.isArray(i.type)) {
    let r;
    for (let s of i.type) {
      if (s.from > e)
        break;
      if (!(s.to < e)) {
        if (s.from < e && s.to > e)
          return s;
        (!r || s.type == re.Text && (r.type != s.type || (t < 0 ? s.from < e : s.to > e))) && (r = s);
      }
    }
    return r || i;
  }
  return i;
}
function Sf(n, e, t, i) {
  let r = ts(n, e.head, e.assoc || -1), s = !i || r.type != re.Text || !(n.lineWrapping || r.widgetLineBreaks) ? null : n.coordsAtPos(e.assoc < 0 && e.head > r.from ? e.head - 1 : e.head);
  if (s) {
    let l = n.dom.getBoundingClientRect(), o = n.textDirectionAt(r.from), a = n.posAndSideAtCoords({
      x: t == (o == B.LTR) ? l.right - 1 : l.left + 1,
      y: (s.top + s.bottom) / 2
    });
    if (a)
      return Q.cursor(a.pos, a.assoc);
  }
  return Q.cursor(t ? r.to : r.from, t ? 1 : -1);
}
function wl(n, e, t, i) {
  let r = n.state.doc.lineAt(e.head), s = n.bidiSpans(r), l = n.textDirectionAt(r.from);
  for (let o = e, a = null; ; ) {
    let h = Bc(r, s, l, o, t), O = _a;
    if (!h) {
      if (r.number == (t ? n.state.doc.lines : 1))
        return o;
      O = `
`, r = n.state.doc.line(r.number + (t ? 1 : -1)), s = n.bidiSpans(r), h = t ? Q.cursor(r.from, -1) : Q.cursor(r.to, 1);
    }
    if (a) {
      if (!a(O))
        return o;
    } else {
      if (!i)
        return h;
      a = i(O);
    }
    o = h;
  }
}
function bf(n, e, t) {
  let i = n.state.charCategorizer(e), r = i(t);
  return (s) => {
    let l = i(s);
    return r == st.Space && (r = l), r == l;
  };
}
function yf(n, e, t, i) {
  let r = e.head, s = t ? 1 : -1;
  if (r == (t ? n.state.doc.length : 0))
    return Q.cursor(r, e.assoc);
  let l = e.goalColumn, o, a = n.contentDOM.getBoundingClientRect(), h = n.coordsAtPos(r, e.assoc || ((e.empty ? t : e.head == e.from) ? 1 : -1)), O = n.documentTop;
  if (h)
    l == null && (l = h.left - a.left), o = s < 0 ? h.top : h.bottom;
  else {
    let d = n.viewState.lineBlockAt(r);
    l == null && (l = Math.min(a.right - a.left, n.defaultCharacterWidth * (r - d.from))), o = (s < 0 ? d.top : d.bottom) + O;
  }
  let c = a.left + l, f = n.viewState.heightOracle.textHeight >> 1, u = i ?? f;
  for (let d = 0; ; d += f) {
    let p = o + (u + d) * s, m = is(n, { x: c, y: p }, !1, s);
    if (t ? p > a.bottom : p < a.top)
      return Q.cursor(m.pos, m.assoc);
    let $ = n.coordsAtPos(m.pos, m.assoc), w = $ ? ($.top + $.bottom) / 2 : 0;
    if (!$ || (t ? w > o : w < o))
      return Q.cursor(m.pos, m.assoc, void 0, l);
  }
}
function Qi(n, e, t) {
  for (; ; ) {
    let i = 0;
    for (let r of n)
      r.between(e - 1, e + 1, (s, l, o) => {
        if (e > s && e < l) {
          let a = i || t || (e - s < l - e ? -1 : 1);
          e = a < 0 ? s : l, i = a;
        }
      });
    if (!i)
      return e;
  }
}
function th(n, e) {
  let t = null;
  for (let i = 0; i < e.ranges.length; i++) {
    let r = e.ranges[i], s = null;
    if (r.empty) {
      let l = Qi(n, r.from, 0);
      l != r.from && (s = Q.cursor(l, -1));
    } else {
      let l = Qi(n, r.from, -1), o = Qi(n, r.to, 1);
      (l != r.from || o != r.to) && (r.undirectional ? s = Q.undirectionalRange(r.from, r.to) : s = Q.range(r.from == r.anchor ? l : o, r.from == r.head ? l : o));
    }
    s && (t || (t = e.ranges.slice()), t[i] = s);
  }
  return t ? Q.create(t, e.mainIndex) : e;
}
function hr(n, e, t) {
  let i = Qi(n.state.facet(Wi).map((r) => r(n)), t.from, e.head > t.from ? -1 : 1);
  return i == t.from ? t : Q.cursor(i, i < t.from ? 1 : -1);
}
class Le {
  constructor(e, t) {
    this.pos = e, this.assoc = t;
  }
}
function is(n, e, t, i) {
  let r = n.contentDOM.getBoundingClientRect(), s = r.top + n.viewState.paddingTop, { x: l, y: o } = e, a = o - s, h;
  for (; ; ) {
    if (a < 0)
      return new Le(0, 1);
    if (a > n.viewState.docHeight)
      return new Le(n.state.doc.length, -1);
    if (h = n.elementAtHeight(a), i == null)
      break;
    if (h.type == re.Text) {
      if (i < 0 ? h.to < n.viewport.from : h.from > n.viewport.to)
        break;
      let f = n.docView.coordsAt(i < 0 ? h.from : h.to, i > 0 ? -1 : 1);
      if (f && (i < 0 ? f.top <= a + s : f.bottom >= a + s))
        break;
    }
    let c = n.viewState.heightOracle.textHeight / 2;
    a = i > 0 ? h.bottom + c : h.top - c;
  }
  if (n.viewport.from >= h.to || n.viewport.to <= h.from) {
    if (t)
      return null;
    if (h.type == re.Text) {
      let c = Qf(n, r, h, l, o);
      return new Le(c, c == h.from ? 1 : -1);
    }
  }
  if (h.type != re.Text)
    return a < (h.top + h.bottom) / 2 ? new Le(h.from, 1) : new Le(h.to, -1);
  let O = n.docView.lineAt(h.from, 2);
  return (!O || O.length != h.length) && (O = n.docView.lineAt(h.from, -2)), new Pf(n, l, o, n.textDirectionAt(h.from)).scanTile(O, h.from);
}
class Pf {
  constructor(e, t, i, r) {
    this.view = e, this.x = t, this.y = i, this.baseDir = r, this.line = null, this.spans = null;
  }
  bidiSpansAt(e) {
    return (!this.line || this.line.from > e || this.line.to < e) && (this.line = this.view.state.doc.lineAt(e), this.spans = this.view.bidiSpans(this.line)), this;
  }
  baseDirAt(e, t) {
    let { line: i, spans: r } = this.bidiSpansAt(e);
    return r[Be.find(r, e - i.from, -1, t)].level == this.baseDir;
  }
  dirAt(e, t) {
    let { line: i, spans: r } = this.bidiSpansAt(e);
    return r[Be.find(r, e - i.from, -1, t)].dir;
  }
  // Used to short-circuit bidi tests for content with a uniform direction
  bidiIn(e, t) {
    let { spans: i, line: r } = this.bidiSpansAt(e);
    return i.length > 1 || i.length && (i[0].level != this.baseDir || i[0].to + r.from < t);
  }
  // Scan through the rectangles for the content of a tile with inline
  // content, looking for one that overlaps the queried position
  // vertically and is closest horizontally. The caller is responsible
  // for dividing its content into N pieces, and pass an array with
  // N+1 positions (including the position after the last piece). For
  // a text tile, these will be character clusters, for a composite
  // tile, these will be child tiles.
  scan(e, t, i = !1) {
    let r = 0, s = e.length - 1, l = /* @__PURE__ */ new Set(), o = this.bidiIn(e[0], e[s]), a, h, O = -1, c = 1e9, f;
    e: for (; r < s; ) {
      let d = s - r, p = r + s >> 1;
      t: if (l.has(p)) {
        for (let w = 1; w < d; w++) {
          let b = p + w;
          if (b >= s && (b -= d), !l.has(b)) {
            p = b;
            break t;
          }
        }
        break e;
      }
      l.add(p);
      let m = t(p), $ = 0;
      if (m)
        for (let w = 0; w < m.length; w++) {
          let b = m[w];
          if (!(b.width == 0 && m.length > 1))
            if (b.bottom < this.y)
              (!a || a.bottom < b.bottom) && (a = b), $ = 1;
            else if (b.top > this.y)
              (!h || h.top > b.top) && (h = b), $ = -1;
            else {
              let R = b.left > this.x ? this.x - b.left : b.right < this.x ? this.x - b.right : 0, S = Math.abs(R);
              S < c && (O = p, c = S, f = b), R && ($ = R < 0 == (this.baseDir == B.LTR) ? -1 : 1);
            }
        }
      $ == -1 && (!o || this.baseDirAt(e[p], 1)) ? s = p : $ == 1 && (!o || this.baseDirAt(e[p + 1], -1)) && (r = p + 1);
    }
    if (!f) {
      if (!h && !a)
        return { i: 0, after: !1 };
      let d = a && (!h || this.y - a.bottom < h.top - this.y) ? a : h;
      return this.y = (d.top + d.bottom) / 2, this.scan(e, t, !0);
    }
    if (c && !i) {
      let { top: d, bottom: p } = f;
      if (a && a.bottom > (d + d + p) / 3)
        return this.y = a.bottom - 1, this.scan(e, t, !0);
      if (h && h.top < (d + p + p) / 3)
        return this.y = h.top + 1, this.scan(e, t, !0);
    }
    let u = (o ? this.dirAt(e[O], 1) : this.baseDir) == B.LTR;
    return {
      i: O,
      // Test whether x is closes to the start or end of this element
      after: this.x > (f.left + f.right) / 2 == u
    };
  }
  scanText(e, t) {
    let i = [];
    for (let s = 0; s < e.length; s = ae(e.text, s))
      i.push(t + s);
    i.push(t + e.length);
    let r = this.scan(i, (s) => {
      let l = i[s] - t, o = i[s + 1] - t;
      return wi(e.dom, l, o).getClientRects();
    });
    return r.after ? new Le(i[r.i + 1], -1) : new Le(i[r.i], 1);
  }
  scanTile(e, t) {
    if (!e.length)
      return new Le(t, 1);
    if (e.children.length == 1) {
      let o = e.children[0];
      if (o.isText())
        return this.scanText(o, t);
      if (o.isComposite())
        return this.scanTile(o, t);
    }
    let i = [t];
    for (let o = 0, a = t; o < e.children.length; o++)
      i.push(a += e.children[o].length);
    let r = this.scan(i, (o) => {
      let a = e.children[o];
      return a.flags & 48 ? null : (ee(a.dom) ? a.dom : wi(a.dom, 0, a.length)).getClientRects();
    }), s = e.children[r.i], l = i[r.i];
    return s.isText() ? this.scanText(s, l) : s.isComposite() ? this.scanTile(s, l) : r.after ? new Le(i[r.i + 1], -1) : new Le(l, 1);
  }
}
const Wt = "￿";
class xf {
  constructor(e, t) {
    this.points = e, this.view = t, this.text = "", this.lineSeparator = t.state.facet(z.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += Wt;
  }
  readRange(e, t) {
    if (!e)
      return this;
    let i = e.parentNode;
    for (let r = e; ; ) {
      this.findPointBefore(i, r);
      let s = this.text.length;
      this.readNode(r);
      let l = F.get(r), o = r.nextSibling;
      if (o == t) {
        l?.breakAfter && !o && i != this.view.contentDOM && this.lineBreak();
        break;
      }
      let a = F.get(o);
      (l && a ? l.breakAfter : (l ? l.breakAfter : $n(r)) || $n(o) && (r.nodeName != "BR" || l?.isWidget()) && this.text.length > s) && !wf(o, t) && this.lineBreak(), r = o;
    }
    return this.findPointBefore(i, t), this;
  }
  readTextNode(e) {
    let t = e.nodeValue;
    for (let i of this.points)
      i.node == e && (i.pos = this.text.length + Math.min(i.offset, t.length));
    for (let i = 0, r = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let s = -1, l = 1, o;
      if (this.lineSeparator ? (s = t.indexOf(this.lineSeparator, i), l = this.lineSeparator.length) : (o = r.exec(t)) && (s = o.index, l = o[0].length), this.append(t.slice(i, s < 0 ? t.length : s)), s < 0)
        break;
      if (this.lineBreak(), l > 1)
        for (let a of this.points)
          a.node == e && a.pos > this.text.length && (a.pos -= l - 1);
      i = s + l;
    }
  }
  readNode(e) {
    let t = F.get(e), i = t && t.overrideDOMText;
    if (i != null) {
      this.findPointInside(e, i.length);
      for (let r = i.iter(); !r.next().done; )
        r.lineBreak ? this.lineBreak() : this.append(r.value);
    } else Bt(e) ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : ee(e) && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, t) {
    for (let i of this.points)
      i.node == e && e.childNodes[i.offset] == t && (i.pos = this.text.length);
  }
  findPointInside(e, t) {
    for (let i of this.points)
      (Bt(e) ? i.node == e : e.contains(i.node)) && (i.pos = this.text.length + (kf(e, i.node, i.offset) ? t : 0));
  }
}
function kf(n, e, t) {
  for (; ; ) {
    if (!e || t < at(e))
      return !1;
    if (e == n)
      return !0;
    t = Qt(e) + 1, e = e.parentNode;
  }
}
function wf(n, e) {
  let t;
  for (; !(n == e || !n); n = n.nextSibling) {
    let i = F.get(n);
    if (!i?.isWidget())
      return !1;
    i && (t || (t = [])).push(i);
  }
  if (t)
    for (let i of t) {
      let r = i.overrideDOMText;
      if (r?.length)
        return !1;
    }
  return !0;
}
class vl {
  constructor(e, t) {
    this.node = e, this.offset = t, this.pos = -1;
  }
}
class vf {
  constructor(e, t, i, r) {
    this.typeOver = r, this.bounds = null, this.text = "", this.domChanged = t > -1;
    let { impreciseHead: s, impreciseAnchor: l } = e.docView, o = e.state.selection;
    if (e.state.readOnly && t > -1)
      this.newSel = null;
    else if (t > -1 && (this.bounds = ih(e.docView.tile, t, i, 0))) {
      let a = s || l ? [] : Zf(e), h = new xf(a, e);
      h.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = h.text, this.newSel = Tf(a, this.bounds.from);
    } else {
      let a = e.observer.selectionRange, h = s && s.node == a.focusNode && s.offset == a.focusOffset || !Nr(e.contentDOM, a.focusNode) ? o.main.head : e.docView.posFromDOM(a.focusNode, a.focusOffset), O = l && l.node == a.anchorNode && l.offset == a.anchorOffset || !Nr(e.contentDOM, a.anchorNode) ? o.main.anchor : e.docView.posFromDOM(a.anchorNode, a.anchorOffset), c = e.viewport;
      if ((P.ios || P.chrome) && h != O && Math.min(h, O) <= o.main.from && Math.max(h, O) >= o.main.to && (c.from > 0 || c.to < e.state.doc.length)) {
        let f = Math.min(h, O), u = Math.max(h, O), d = c.from - f, p = c.to - u;
        (d == 0 || d == 1 || f == 0) && (p == 0 || p == -1 || u == e.state.doc.length) && (h = 0, O = e.state.doc.length);
      }
      if (e.inputState.composing > -1 && o.ranges.length > 1)
        this.newSel = o.replaceRange(Q.range(O, h));
      else if (e.lineWrapping && O == h && !(o.main.empty && o.main.head == h) && e.inputState.lastTouchTime > Date.now() - 100) {
        let f = e.coordsAtPos(h, -1), u = 0;
        f && (u = e.inputState.lastTouchY <= f.bottom ? -1 : 1), this.newSel = Q.create([Q.cursor(h, u)]);
      } else
        this.newSel = Q.single(O, h);
    }
  }
}
function ih(n, e, t, i) {
  if (n.isComposite()) {
    let r = -1, s = -1, l = -1, o = -1;
    for (let a = 0, h = i, O = i; a < n.children.length; a++) {
      let c = n.children[a], f = h + c.length;
      if (h < e && f > t)
        return ih(c, e, t, h);
      if (f >= e && r == -1 && (r = a, s = h), h > t && c.dom.parentNode == n.dom) {
        l = a, o = O;
        break;
      }
      O = f, h = f + c.breakAfter;
    }
    return {
      from: s,
      to: o < 0 ? i + n.length : o,
      startDOM: (r ? n.children[r - 1].dom.nextSibling : null) || n.dom.firstChild,
      endDOM: l < n.children.length && l >= 0 ? n.children[l].dom : null
    };
  } else return n.isText() ? { from: i, to: i + n.length, startDOM: n.dom, endDOM: n.dom.nextSibling } : null;
}
function nh(n, e) {
  let t, { newSel: i } = e, { state: r } = n, s = r.selection.main, l = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: o, to: a } = e.bounds, h = s.from, O = null;
    (l === 8 || P.android && e.text.length < a - o) && (h = s.to, O = "end");
    let c = r.doc.sliceString(o, a, Wt), f, u;
    !s.empty && s.from >= o && s.to <= a && (e.typeOver || c != e.text) && c.slice(0, s.from - o) == e.text.slice(0, s.from - o) && c.slice(s.to - o) == e.text.slice(f = e.text.length - (c.length - (s.to - o))) ? t = {
      from: s.from,
      to: s.to,
      insert: _.of(e.text.slice(s.from - o, f).split(Wt))
    } : (u = rh(c, e.text, h - o, O)) && (P.chrome && l == 13 && u.toB == u.from + 2 && e.text.slice(u.from, u.toB) == Wt + Wt && u.toB--, t = {
      from: o + u.from,
      to: o + u.toA,
      insert: _.of(e.text.slice(u.from, u.toB).split(Wt))
    });
  } else i && (!n.hasFocus && r.facet(rt) || ns(i, s)) && (i = null);
  if (!t && !i)
    return !1;
  if ((P.mac || P.android) && t && t.from == t.to && t.from == s.head - 1 && /^\. ?$/.test(t.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && t.insert.length == 2 && (i = Q.single(i.main.anchor - 1, i.main.head - 1)), t = { from: t.from, to: t.to, insert: _.of([t.insert.toString().replace(".", " ")]) }) : r.doc.lineAt(s.from).to < s.to && n.docView.lineHasWidget(s.to) && n.inputState.insertingTextAt > Date.now() - 50 ? t = {
    from: s.from,
    to: s.to,
    insert: r.toText(n.inputState.insertingText)
  } : P.chrome && t && t.from == t.to && t.from == s.head && t.insert.toString() == `
 ` && n.lineWrapping && (i && (i = Q.single(i.main.anchor - 1, i.main.head - 1)), t = { from: s.from, to: s.to, insert: _.of([" "]) }), t)
    return Ms(n, t, i, l);
  if (i && !ns(i, s)) {
    let o = !1, a = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (o = !0), a = n.inputState.lastSelectionOrigin, a == "select.pointer" && (i = th(r.facet(Wi).map((h) => h(n)), i))), n.dispatch({ selection: i, scrollIntoView: o, userEvent: a }), !0;
  } else
    return !1;
}
function Ms(n, e, t, i = -1) {
  if (P.ios && n.inputState.flushIOSKey(e))
    return !0;
  let r = n.state.selection.main;
  if (P.android && (e.to == r.to && // GBoard will sometimes remove a space it just inserted
  // after a completion when you press enter
  (e.from == r.from || e.from == r.from - 1 && n.state.sliceDoc(e.from, r.from) == " ") && e.insert.length == 1 && e.insert.lines == 2 && Ut(n.contentDOM, "Enter", 13) || (e.from == r.from - 1 && e.to == r.to && e.insert.length == 0 || i == 8 && e.insert.length < e.to - e.from && e.to > r.head) && Ut(n.contentDOM, "Backspace", 8) || e.from == r.from && e.to == r.to + 1 && e.insert.length == 0 && Ut(n.contentDOM, "Delete", 46)))
    return !0;
  let s = e.insert.toString();
  n.inputState.composing >= 0 && n.inputState.composing++;
  let l, o = () => l || (l = Xf(n, e, t));
  return n.state.facet(Ea).some((a) => a(n, e.from, e.to, s, o)) || n.dispatch(o()), !0;
}
function Xf(n, e, t) {
  let i, r = n.state, s = r.selection.main, l = -1;
  if (e.from == e.to && e.from < s.from || e.from > s.to) {
    let a = e.from < s.from ? -1 : 1, h = a < 0 ? s.from : s.to, O = Qi(r.facet(Wi).map((c) => c(n)), h, a);
    e.from == O && (l = O);
  }
  if (l > -1)
    i = {
      changes: e,
      selection: Q.cursor(e.from + e.insert.length, -1)
    };
  else if (e.from >= s.from && e.to <= s.to && e.to - e.from >= (s.to - s.from) / 3 && (!t || t.main.empty && t.main.from == e.from + e.insert.length) && n.inputState.composing < 0) {
    let a = s.from < e.from ? r.sliceDoc(s.from, e.from) : "", h = s.to > e.to ? r.sliceDoc(e.to, s.to) : "";
    i = r.replaceSelection(n.state.toText(a + e.insert.sliceString(0, void 0, n.state.lineBreak) + h));
  } else {
    let a = r.changes(e), h = t && t.main.to <= a.newLength ? t.main : void 0;
    if (r.selection.ranges.length > 1 && (n.inputState.composing >= 0 || n.inputState.compositionPendingChange) && e.to <= s.to + 10 && e.to >= s.to - 10) {
      let O = n.state.sliceDoc(e.from, e.to), c, f = t && eh(n, t.main.head);
      if (f) {
        let d = e.insert.length - (e.to - e.from);
        c = { from: f.from, to: f.to - d };
      } else
        c = n.state.doc.lineAt(s.head);
      let u = s.to - e.to;
      i = r.changeByRange((d) => {
        if (d.from == s.from && d.to == s.to)
          return { changes: a, range: h || d.map(a) };
        let p = d.to - u, m = p - O.length;
        if (n.state.sliceDoc(m, p) != O || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        p >= c.from && m <= c.to)
          return { range: d };
        let $ = r.changes({ from: m, to: p, insert: e.insert }), w = d.to - s.to;
        return {
          changes: $,
          range: h ? Q.range(Math.max(0, h.anchor + w), Math.max(0, h.head + w)) : d.map($)
        };
      });
    } else
      i = {
        changes: a,
        selection: h && r.selection.replaceRange(h)
      };
  }
  let o = "input.type";
  return (n.composing || n.inputState.compositionPendingChange && n.inputState.compositionEndedAt > Date.now() - 50) && (n.inputState.compositionPendingChange = !1, o += ".compose", n.inputState.compositionFirstChange && (o += ".start", n.inputState.compositionFirstChange = !1)), r.update(i, { userEvent: o, scrollIntoView: !0 });
}
function rh(n, e, t, i) {
  let r = Math.min(n.length, e.length), s = 0;
  for (; s < r && n.charCodeAt(s) == e.charCodeAt(s); )
    s++;
  if (s == r && n.length == e.length)
    return null;
  let l = n.length, o = e.length;
  for (; l > 0 && o > 0 && n.charCodeAt(l - 1) == e.charCodeAt(o - 1); )
    l--, o--;
  if (i == "end") {
    let a = Math.max(0, s - Math.min(l, o));
    t -= l + a - s;
  }
  if (l < s && n.length < e.length) {
    let a = t <= s && t >= l ? s - t : 0;
    s -= a, o = s + (o - l), l = s;
  } else if (o < s) {
    let a = t <= s && t >= o ? s - t : 0;
    s -= a, l = s + (l - o), o = s;
  }
  return { from: s, toA: l, toB: o };
}
function Zf(n) {
  let e = [];
  if (n.root.activeElement != n.contentDOM)
    return e;
  let { anchorNode: t, anchorOffset: i, focusNode: r, focusOffset: s } = n.observer.selectionRange;
  return t && (e.push(new vl(t, i)), (r != t || s != i) && e.push(new vl(r, s))), e;
}
function Tf(n, e) {
  if (n.length == 0)
    return null;
  let t = n[0].pos, i = n.length == 2 ? n[1].pos : t;
  return t < 0 || i < 0 ? null : t == i ? Q.create([Q.cursor(i + e, -1)]) : Q.single(t + e, i + e);
}
function ns(n, e) {
  return e.head == n.main.head && e.anchor == n.main.anchor;
}
class Rf {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.touchActive = !1, this.lastTouchTime = 0, this.lastTouchX = 0, this.lastTouchY = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.lastWheelEvent = 0, this.pendingIOSKey = void 0, this.lastIOSMomentumScroll = 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.insertingText = "", this.insertingTextAt = 0, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, P.safari && e.contentDOM.addEventListener("input", () => null), P.gecko && Bf(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !zf(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || (this.view.updateState != 0 ? Promise.resolve().then(() => this.runHandlers(e.type, e)) : this.runHandlers(e.type, e));
  }
  runHandlers(e, t) {
    let i = this.handlers[e];
    if (i) {
      for (let r of i.observers)
        r(this.view, t);
      for (let r of i.handlers) {
        if (t.defaultPrevented)
          break;
        if (r(this.view, t)) {
          t.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let t = Af(e), i = this.handlers, r = this.view.contentDOM;
    for (let s in t)
      if (s != "scroll") {
        let l = !t[s].handlers.length, o = i[s];
        o && l != !o.handlers.length && (r.removeEventListener(s, this.handleEvent), o = null), o || r.addEventListener(s, this.handleEvent, { passive: l });
      }
    for (let s in i)
      s != "scroll" && !t[s] && r.removeEventListener(s, this.handleEvent);
    this.handlers = t;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode))
      return !0;
    if (this.tabFocusMode > 0 && e.keyCode != 27 && lh.indexOf(e.keyCode) < 0 && (this.tabFocusMode = -1), P.android && P.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    if (P.ios && !e.synthetic && !e.altKey && !e.metaKey && (sh.some((t) => t.keyCode == e.keyCode) && !e.ctrlKey || jf.indexOf(e.key) > -1 && e.ctrlKey)) {
      let t = { ctrlKey: e.ctrlKey, altKey: e.altKey, metaKey: e.metaKey, shiftKey: e.shiftKey };
      t.shiftKey && P.ios && !/^(off|none)$/.test(this.view.contentDOM.autocapitalize) && Cf(this.view.win) && (t.shiftKey = !1);
      let i = this.pendingIOSKey = { key: e.key, keyCode: e.keyCode, mods: t };
      return setTimeout(() => {
        this.pendingIOSKey == i && this.flushIOSKey();
      }, 50), !0;
    }
    return e.keyCode != 229 && this.view.observer.forceFlush(), !1;
  }
  flushIOSKey(e) {
    let t = this.pendingIOSKey;
    return !t || this.view.observer.pendingRecords().length || t.key == "Enter" && e && e.from < e.to && /^\S+$/.test(e.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, Ut(this.view.contentDOM, t.key, t.keyCode, t.mods));
  }
  ignoreDuringComposition(e) {
    return !/^key/.test(e.type) || e.synthetic ? !1 : this.composing > 0 ? !0 : P.safari && !P.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.view.observer.update(e), this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function Cf(n) {
  return n.visualViewport ? n.visualViewport.height * n.visualViewport.scale / n.document.documentElement.clientHeight < 0.85 : !1;
}
function Xl(n, e) {
  return (t, i) => {
    try {
      return e.call(n, i, t);
    } catch (r) {
      Ie(t.state, r);
    }
  };
}
function Af(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(i) {
    return e[i] || (e[i] = { observers: [], handlers: [] });
  }
  for (let i of n) {
    let r = i.spec, s = r && r.plugin.domEventHandlers, l = r && r.plugin.domEventObservers;
    if (s)
      for (let o in s) {
        let a = s[o];
        a && t(o).handlers.push(Xl(i.value, a));
      }
    if (l)
      for (let o in l) {
        let a = l[o];
        a && t(o).observers.push(Xl(i.value, a));
      }
  }
  for (let i in _e)
    t(i).handlers.push(_e[i]);
  for (let i in ge)
    t(i).observers.push(ge[i]);
  return e;
}
const sh = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], jf = "dthko", lh = [16, 17, 18, 20, 91, 92, 224, 225], Di = 6;
function Li(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function Wf(n, e) {
  return Math.max(Math.abs(n.clientX - e.clientX), Math.abs(n.clientY - e.clientY));
}
class _f {
  constructor(e, t, i, r) {
    this.view = e, this.startEvent = t, this.style = i, this.mustSelect = r, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = t, this.scrollParents = ka(e.contentDOM), this.atoms = e.state.facet(Wi).map((l) => l(e));
    let s = e.contentDOM.ownerDocument;
    s.addEventListener("mousemove", this.move = this.move.bind(this)), s.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(z.allowMultipleSelections) && Mf(e, t), this.dragging = Yf(e, t) && hh(t) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && Wf(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let t = 0, i = 0, r = 0, s = 0, l = this.view.win.innerWidth, o = this.view.win.innerHeight;
    this.scrollParents.x && ({ left: r, right: l } = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({ top: s, bottom: o } = this.scrollParents.y.getBoundingClientRect());
    let a = Ka(this.view);
    e.clientX - a.left <= r + Di ? t = -Li(r - e.clientX) : e.clientX + a.right >= l - Di && (t = Li(e.clientX - l)), e.clientY - a.top <= s + Di ? i = -Li(s - e.clientY) : e.clientY + a.bottom >= o - Di && (i = Li(e.clientY - o)), this.setScrollSpeed(t, i);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, t) {
    this.scrollSpeed = { x: e, y: t }, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    let { x: e, y: t } = this.scrollSpeed;
    e && this.scrollParents.x && (this.scrollParents.x.scrollLeft += e, e = 0), t && this.scrollParents.y && (this.scrollParents.y.scrollTop += t, t = 0), (e || t) && this.view.win.scrollBy(e, t), this.dragging === !1 && this.select(this.lastEvent);
  }
  select(e) {
    let { view: t } = this, i = th(this.atoms, this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !i.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    e.transactions.some((t) => t.isUserEvent("input.type")) ? this.destroy() : this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function Mf(n, e) {
  let t = n.state.facet(Ma);
  return t.length ? t[0](e) : P.mac ? e.metaKey : e.ctrlKey;
}
function qf(n, e) {
  let t = n.state.facet(qa);
  return t.length ? t[0](e) : P.mac ? !e.altKey : !e.ctrlKey;
}
function Yf(n, e) {
  let { main: t } = n.state.selection;
  if (t.empty)
    return !1;
  let i = ki(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let r = i.getRangeAt(0).getClientRects();
  for (let s = 0; s < r.length; s++) {
    let l = r[s];
    if (l.left <= e.clientX && l.right >= e.clientX && l.top <= e.clientY && l.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function zf(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target, i; t != n.contentDOM; t = t.parentNode)
    if (!t || t.nodeType == 11 || (i = F.get(t)) && i.isWidget() && !i.isHidden && i.widget.ignoreEvent(e))
      return !1;
  return !0;
}
const _e = /* @__PURE__ */ Object.create(null), ge = /* @__PURE__ */ Object.create(null), oh = P.ie && P.ie_version < 15 || P.ios && P.webkit_version < 604;
function Ef(n) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let t = e.appendChild(document.createElement("textarea"));
  t.style.cssText = "position: fixed; left: -10000px; top: 10px", t.focus(), setTimeout(() => {
    n.focus(), t.remove(), ah(n, t.value);
  }, 50);
}
function Dn(n, e, t) {
  for (let i of n.facet(e))
    t = i(t, n);
  return t;
}
function ah(n, e) {
  e = Dn(n.state, As, e);
  let { state: t } = n, i, r = 1, s = t.toText(e), l = s.lines == t.selection.ranges.length;
  if (rs != null && t.selection.ranges.every((a) => a.empty) && rs == s.toString()) {
    let a = -1;
    i = t.changeByRange((h) => {
      let O = t.doc.lineAt(h.from);
      if (O.from == a)
        return { range: h };
      a = O.from;
      let c = t.toText((l ? s.line(r++).text : e) + t.lineBreak);
      return {
        changes: { from: O.from, insert: c },
        range: Q.cursor(h.from + c.length, -1)
      };
    });
  } else l ? i = t.changeByRange((a) => {
    let h = s.line(r++);
    return {
      changes: { from: a.from, to: a.to, insert: h.text },
      range: Q.cursor(a.from + h.length, -1)
    };
  }) : i = t.replaceSelection(s);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
ge.scroll = (n) => {
  let e = n.inputState;
  e.lastScrollTop = n.scrollDOM.scrollTop, e.lastScrollLeft = n.scrollDOM.scrollLeft, P.ios && !e.touchActive && (e.lastIOSMomentumScroll = Date.now());
};
ge.wheel = ge.mousewheel = (n) => {
  n.inputState.lastWheelEvent = Date.now();
};
_e.keydown = (n, e) => (n.inputState.setSelectionOrigin("select"), e.keyCode == 27 && n.inputState.tabFocusMode != 0 && (n.inputState.tabFocusMode = Date.now() + 2e3), !1);
ge.touchstart = (n, e) => {
  let t = n.inputState, i = e.targetTouches[0];
  t.touchActive = !0, t.lastTouchTime = Date.now(), i && (t.lastTouchX = i.clientX, t.lastTouchY = i.clientY), t.setSelectionOrigin("select.pointer");
};
ge.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
ge.touchend = (n, e) => {
  n.inputState.touchActive = !1;
};
_e.mousedown = (n, e) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let t = null;
  for (let i of n.state.facet(Ya))
    if (t = i(n, e), t)
      break;
  if (!t && e.button == 0 && (t = Vf(n, e)), t) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new _f(n, e, t, i)), i && n.observer.ignore(() => {
      Xa(n.contentDOM);
      let s = n.root.activeElement;
      s && !s.contains(n.contentDOM) && s.blur();
    });
    let r = n.inputState.mouseSelection;
    if (r)
      return r.start(e), r.dragging === !1;
  } else
    n.inputState.setSelectionOrigin("select.pointer");
  return !1;
};
function Zl(n, e, t, i) {
  if (i == 1)
    return Q.cursor(e, t);
  if (i == 2)
    return $f(n.state, e, t);
  {
    let r = n.docView.lineAt(e, t), s = n.state.doc.lineAt(r ? r.posAtEnd : e), l = r ? r.posAtStart : s.from, o = r ? r.posAtEnd : s.to;
    return o < n.state.doc.length && o == s.to && o++, Q.undirectionalRange(l, o);
  }
}
const Uf = P.ie && P.ie_version <= 11;
let Tl = null, Rl = 0, Cl = 0;
function hh(n) {
  if (!Uf)
    return n.detail;
  let e = Tl, t = Cl;
  return Tl = n, Cl = Date.now(), Rl = !e || t > Date.now() - 400 && Math.abs(e.clientX - n.clientX) < 2 && Math.abs(e.clientY - n.clientY) < 2 ? (Rl + 1) % 3 : 1;
}
function Vf(n, e) {
  let t = n.posAndSideAtCoords({ x: e.clientX, y: e.clientY }, !1), i = hh(e), r = n.state.selection;
  return {
    update(s) {
      s.docChanged && (t.pos = s.changes.mapPos(t.pos), r = r.map(s.changes));
    },
    get(s, l, o) {
      let a = n.posAndSideAtCoords({ x: s.clientX, y: s.clientY }, !1), h, O = Zl(n, a.pos, a.assoc, i);
      if (t.pos != a.pos && !l) {
        let c = Zl(n, t.pos, t.assoc, i), f = Math.min(c.from, O.from), u = Math.max(c.to, O.to);
        O = f < O.from ? Q.range(f, u, O.assoc) : Q.range(u, f, O.assoc);
      }
      return l ? r.replaceRange(r.main.extend(O.from, O.to, O.assoc)) : o && i == 1 && r.ranges.length > 1 && (h = Gf(r, a.pos)) ? h : o ? r.addRange(O) : Q.create([O]);
    }
  };
}
function Gf(n, e) {
  for (let t = 0; t < n.ranges.length; t++) {
    let { from: i, to: r } = n.ranges[t];
    if (i <= e && r >= e)
      return Q.create(n.ranges.slice(0, t).concat(n.ranges.slice(t + 1)), n.mainIndex == t ? 0 : n.mainIndex - (n.mainIndex > t ? 1 : 0));
  }
  return null;
}
_e.dragstart = (n, e) => {
  let { selection: { main: t } } = n.state;
  if (e.target.draggable) {
    let r = n.docView.tile.nearest(e.target);
    if (r && r.isWidget()) {
      let s = r.posAtStart, l = s + r.length;
      (s >= t.to || l <= t.from) && (t = Q.undirectionalRange(s, l));
    }
  }
  let { inputState: i } = n;
  return i.mouseSelection && (i.mouseSelection.dragging = !0), i.draggedContent = t, e.dataTransfer && (e.dataTransfer.setData("Text", Dn(n.state, js, n.state.sliceDoc(t.from, t.to))), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
_e.dragend = (n) => (n.inputState.draggedContent = null, !1);
function Al(n, e, t, i) {
  if (t = Dn(n.state, As, t), !t)
    return;
  let r = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: s } = n.inputState, l = i && s && qf(n, e) ? { from: s.from, to: s.to } : null, o = { from: r, insert: t }, a = n.state.changes(l ? [l, o] : o);
  n.focus(), n.dispatch({
    changes: a,
    selection: { anchor: a.mapPos(r, -1), head: a.mapPos(r, 1) },
    userEvent: l ? "move.drop" : "input.drop"
  }), n.inputState.draggedContent = null;
}
_e.drop = (n, e) => {
  if (!e.dataTransfer)
    return !1;
  if (n.state.readOnly)
    return !0;
  let t = e.dataTransfer.files;
  if (t && t.length) {
    let i = Array(t.length), r = 0, s = () => {
      ++r == t.length && Al(n, e, i.filter((l) => l != null).join(n.state.lineBreak), !1);
    };
    for (let l = 0; l < t.length; l++) {
      let o = new FileReader();
      o.onerror = s, o.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(o.result) || (i[l] = o.result), s();
      }, o.readAsText(t[l]);
    }
    return !0;
  } else {
    let i = e.dataTransfer.getData("Text");
    if (i)
      return Al(n, e, i, !0), !0;
  }
  return !1;
};
_e.paste = (n, e) => {
  if (n.state.readOnly)
    return !0;
  n.observer.flush();
  let t = oh ? null : e.clipboardData;
  return t ? (ah(n, t.getData("text/plain") || t.getData("text/uri-list")), !0) : (Ef(n), !1);
};
function Df(n, e) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let i = t.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = e, i.focus(), i.selectionEnd = e.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function Lf(n) {
  let e = [], t = [], i = !1;
  for (let r of n.selection.ranges)
    r.empty || (e.push(n.sliceDoc(r.from, r.to)), t.push(r));
  if (!e.length) {
    let r = -1;
    for (let { from: s } of n.selection.ranges) {
      let l = n.doc.lineAt(s);
      l.number > r && (e.push(l.text), t.push({ from: l.from, to: Math.min(n.doc.length, l.to + 1) })), r = l.number;
    }
    i = !0;
  }
  return { text: Dn(n, js, e.join(n.lineBreak)), ranges: t, linewise: i };
}
let rs = null;
_e.copy = _e.cut = (n, e) => {
  if (!mi(n.contentDOM, n.observer.selectionRange))
    return !1;
  let { text: t, ranges: i, linewise: r } = Lf(n.state);
  if (!t && !r)
    return !1;
  rs = r ? t : null, e.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let s = oh ? null : e.clipboardData;
  return s ? (s.clearData(), s.setData("text/plain", t), !0) : (Df(n, t), !1);
};
const Oh = /* @__PURE__ */ Ot.define();
function ch(n, e) {
  let t = [];
  for (let i of n.facet(Ua)) {
    let r = i(n, e);
    r && t.push(r);
  }
  return t.length ? n.update({ effects: t, annotations: Oh.of(!0) }) : null;
}
function fh(n) {
  setTimeout(() => {
    let e = n.hasFocus;
    if (e != n.inputState.notifiedFocused) {
      let t = ch(n.state, e);
      t ? n.dispatch(t) : n.update([]);
    }
  }, 10);
}
ge.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), fh(n);
};
ge.blur = (n) => {
  n.observer.clearSelectionRange(), fh(n);
};
ge.compositionstart = ge.compositionupdate = (n, e) => {
  if (!n.observer.editContext && (n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0)) {
    let { main: t } = n.state.selection;
    !t.empty && n.lineBlockAt(t.from).from != n.lineBlockAt(t.to).from && !n.state.readOnly && n.dispatch({
      changes: n.state.selection.ranges.filter((i) => !i.empty).map((i) => ({ from: i.from, to: i.to })),
      userEvent: "input"
    }), n.inputState.composing = 0;
  }
};
ge.compositionend = (n) => {
  n.observer.editContext || (n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, P.chrome && P.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50));
};
ge.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
_e.beforeinput = (n, e) => {
  var t, i;
  if ((e.inputType == "insertText" || e.inputType == "insertCompositionText") && (n.inputState.insertingText = e.data, n.inputState.insertingTextAt = Date.now()), e.inputType == "insertReplacementText" && n.observer.editContext) {
    let s = (t = e.dataTransfer) === null || t === void 0 ? void 0 : t.getData("text/plain"), l = e.getTargetRanges();
    if (s && l.length) {
      let o = l[0], a = n.posAtDOM(o.startContainer, o.startOffset), h = n.posAtDOM(o.endContainer, o.endOffset);
      return Ms(n, { from: a, to: h, insert: n.state.toText(s) }, null), !0;
    }
  }
  let r;
  if (P.chrome && P.android && (r = sh.find((s) => s.inputType == e.inputType)) && (n.observer.delayAndroidKey(r.key, r.keyCode), r.key == "Backspace" || r.key == "Delete")) {
    let s = ((i = window.visualViewport) === null || i === void 0 ? void 0 : i.height) || 0;
    setTimeout(() => {
      var l;
      (((l = window.visualViewport) === null || l === void 0 ? void 0 : l.height) || 0) > s + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
  return P.ios && e.inputType == "deleteContentForward" && n.observer.flushSoon(), P.safari && e.inputType == "insertText" && n.inputState.composing >= 0 && setTimeout(() => ge.compositionend(n, e), 20), !1;
};
const jl = /* @__PURE__ */ new Set();
function Bf(n) {
  jl.has(n) || (jl.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const Wl = ["pre-wrap", "normal", "pre-line", "break-spaces"];
let Ht = !1;
function _l() {
  Ht = !1;
}
class If {
  constructor(e) {
    this.lineWrapping = e, this.doc = _.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30;
  }
  heightForGap(e, t) {
    let i = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((t - e - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / Math.max(1, this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return Wl.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let t = !1;
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      r < 0 ? i++ : this.heightSamples[Math.floor(r * 10)] || (t = !0, this.heightSamples[Math.floor(r * 10)] = !0);
    }
    return t;
  }
  refresh(e, t, i, r, s, l) {
    let o = Wl.indexOf(e) > -1, a = Math.abs(t - this.lineHeight) > 0.3 || this.lineWrapping != o;
    if (this.lineWrapping = o, this.lineHeight = t, this.charWidth = i, this.textHeight = r, this.lineLength = s, a) {
      this.heightSamples = {};
      for (let h = 0; h < l.length; h++) {
        let O = l[h];
        O < 0 ? h++ : this.heightSamples[Math.floor(O * 10)] = !0;
      }
    }
    return a;
  }
}
class Nf {
  constructor(e, t) {
    this.from = e, this.heights = t, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class Ce {
  /**
  @internal
  */
  constructor(e, t, i, r, s) {
    this.from = e, this.length = t, this.top = i, this.height = r, this._content = s;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? re.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof Xt ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let t = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new Ce(this.from, this.length + e.length, this.top, this.height + e.height, t);
  }
}
var D = /* @__PURE__ */ (function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
})(D || (D = {}));
const on = 1e-3;
class pe {
  constructor(e, t, i = 2) {
    this.length = e, this.height = t, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e) {
    this.height != e && (Math.abs(this.height - e) > on && (Ht = !0), this.height = e);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, t, i) {
    return pe.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, t) {
    t.push(this);
  }
  decomposeRight(e, t) {
    t.push(this);
  }
  applyChanges(e, t, i, r) {
    let s = this, l = i.doc;
    for (let o = r.length - 1; o >= 0; o--) {
      let { fromA: a, toA: h, fromB: O, toB: c } = r[o], f = s.lineAt(a, D.ByPosNoHeight, i.setDoc(t), 0, 0), u = f.to >= h ? f : s.lineAt(h, D.ByPosNoHeight, i, 0, 0);
      for (c += u.to - h, h = u.to; o > 0 && f.from <= r[o - 1].toA; )
        a = r[o - 1].fromA, O = r[o - 1].fromB, o--, a < f.from && (f = s.lineAt(a, D.ByPosNoHeight, i, 0, 0));
      O += f.from - a, a = f.from;
      let d = qs.build(i.setDoc(l), e, O, c);
      s = Pn(s, s.replace(a, h, d));
    }
    return s.updateHeight(i, 0);
  }
  static empty() {
    return new xe(0, 0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let t = 0, i = e.length, r = 0, s = 0;
    for (; ; )
      if (t == i)
        if (r > s * 2) {
          let o = e[t - 1];
          o.break ? e.splice(--t, 1, o.left, null, o.right) : e.splice(--t, 1, o.left, o.right), i += 1 + o.break, r -= o.size;
        } else if (s > r * 2) {
          let o = e[i];
          o.break ? e.splice(i, 1, o.left, null, o.right) : e.splice(i, 1, o.left, o.right), i += 2 + o.break, s -= o.size;
        } else
          break;
      else if (r < s) {
        let o = e[t++];
        o && (r += o.size);
      } else {
        let o = e[--i];
        o && (s += o.size);
      }
    let l = !1;
    return e[t - 1] == null ? (l = !0, t--) : e[t] == null && (l = !0, i++), new Hf(pe.of(e.slice(0, t)), l, pe.of(e.slice(i)));
  }
}
function Pn(n, e) {
  return n == e ? n : (n.constructor != e.constructor && (Ht = !0), e);
}
pe.prototype.size = 1;
const Ff = /* @__PURE__ */ G.replace({});
class uh extends pe {
  constructor(e, t, i) {
    super(e, t), this.deco = i, this.spaceAbove = 0;
  }
  mainBlock(e, t) {
    return new Ce(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.deco || 0);
  }
  blockAt(e, t, i, r) {
    return this.spaceAbove && e < i + this.spaceAbove ? new Ce(r, 0, i, this.spaceAbove, Ff) : this.mainBlock(i, r);
  }
  lineAt(e, t, i, r, s) {
    let l = this.mainBlock(r, s);
    return this.spaceAbove ? this.blockAt(0, i, r, s).join(l) : l;
  }
  forEachLine(e, t, i, r, s, l) {
    e <= s + this.length && t >= s && l(this.lineAt(0, D.ByPos, i, r, s));
  }
  setMeasuredHeight(e) {
    let t = e.heights[e.index++];
    t < 0 ? (this.spaceAbove = -t, t = e.heights[e.index++]) : this.spaceAbove = 0, this.setHeight(t);
  }
  updateHeight(e, t = 0, i = !1, r) {
    return r && r.from <= t && r.more && this.setMeasuredHeight(r), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class xe extends uh {
  constructor(e, t, i) {
    super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0, this.spaceAbove = i;
  }
  mainBlock(e, t) {
    return new Ce(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.breaks);
  }
  replace(e, t, i) {
    let r = i[0];
    return i.length == 1 && (r instanceof xe || r instanceof ie && r.flags & 4) && Math.abs(this.length - r.length) < 10 ? (r instanceof ie ? r = new xe(r.length, this.height, this.spaceAbove) : r.height = this.height, this.outdated || (r.outdated = !1), r) : pe.of(i);
  }
  updateHeight(e, t = 0, i = !1, r) {
    return r && r.from <= t && r.more ? this.setMeasuredHeight(r) : (i || this.outdated) && (this.spaceAbove = 0, this.setHeight(Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight)), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class ie extends pe {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, t) {
    let i = e.doc.lineAt(t).number, r = e.doc.lineAt(t + this.length).number, s = r - i + 1, l, o = 0;
    if (e.lineWrapping) {
      let a = Math.min(this.height, e.lineHeight * s);
      l = a / s, this.length > s + 1 && (o = (this.height - a) / (this.length - s - 1));
    } else
      l = this.height / s;
    return { firstLine: i, lastLine: r, perLine: l, perChar: o };
  }
  blockAt(e, t, i, r) {
    let { firstLine: s, lastLine: l, perLine: o, perChar: a } = this.heightMetrics(t, r);
    if (t.lineWrapping) {
      let h = r + (e < t.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (e - i) / this.height)) * this.length)), O = t.doc.lineAt(h), c = o + O.length * a, f = Math.max(i, e - c / 2);
      return new Ce(O.from, O.length, f, c, 0);
    } else {
      let h = Math.max(0, Math.min(l - s, Math.floor((e - i) / o))), { from: O, length: c } = t.doc.line(s + h);
      return new Ce(O, c, i + o * h, o, 0);
    }
  }
  lineAt(e, t, i, r, s) {
    if (t == D.ByHeight)
      return this.blockAt(e, i, r, s);
    if (t == D.ByPosNoHeight) {
      let { from: u, to: d } = i.doc.lineAt(e);
      return new Ce(u, d - u, 0, 0, 0);
    }
    let { firstLine: l, perLine: o, perChar: a } = this.heightMetrics(i, s), h = i.doc.lineAt(e), O = o + h.length * a, c = h.number - l, f = r + o * c + a * (h.from - s - c);
    return new Ce(h.from, h.length, Math.max(r, Math.min(f, r + this.height - O)), O, 0);
  }
  forEachLine(e, t, i, r, s, l) {
    e = Math.max(e, s), t = Math.min(t, s + this.length);
    let { firstLine: o, perLine: a, perChar: h } = this.heightMetrics(i, s);
    for (let O = e, c = r; O <= t; ) {
      let f = i.doc.lineAt(O);
      if (O == e) {
        let d = f.number - o;
        c += a * d + h * (e - s - d);
      }
      let u = a + h * f.length;
      l(new Ce(f.from, f.length, c, u, 0)), c += u, O = f.to + 1;
    }
  }
  replace(e, t, i) {
    let r = this.length - t;
    if (r > 0) {
      let s = i[i.length - 1];
      s instanceof ie ? i[i.length - 1] = new ie(s.length + r) : i.push(null, new ie(r - 1));
    }
    if (e > 0) {
      let s = i[0];
      s instanceof ie ? i[0] = new ie(e + s.length) : i.unshift(new ie(e - 1), null);
    }
    return pe.of(i);
  }
  decomposeLeft(e, t) {
    t.push(new ie(e - 1), null);
  }
  decomposeRight(e, t) {
    t.push(null, new ie(this.length - e - 1));
  }
  updateHeight(e, t = 0, i = !1, r) {
    let s = t + this.length;
    if (r && r.from <= t + this.length && r.more) {
      let l = [], o = Math.max(t, r.from), a = -1;
      for (r.from > t && l.push(new ie(r.from - t - 1).updateHeight(e, t)); o <= s && r.more; ) {
        let O = e.doc.lineAt(o).length;
        l.length && l.push(null);
        let c = r.heights[r.index++], f = 0;
        c < 0 && (f = -c, c = r.heights[r.index++]), a == -1 ? a = c : Math.abs(c - a) >= on && (a = -2);
        let u = new xe(O, c, f);
        u.outdated = !1, l.push(u), o += O + 1;
      }
      o <= s && l.push(null, new ie(s - o).updateHeight(e, o));
      let h = pe.of(l);
      return (a < 0 || Math.abs(h.height - this.height) >= on || Math.abs(a - this.heightMetrics(e, t).perLine) >= on) && (Ht = !0), Pn(this, h);
    } else (i || this.outdated) && (this.setHeight(e.heightForGap(t, t + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class Hf extends pe {
  constructor(e, t, i) {
    super(e.length + (t ? 1 : 0) + i.length, e.height + i.height, (t ? 1 : 0) | (e.outdated || i.outdated ? 2 : 0)), this.left = e, this.right = i, this.size = e.size + i.size;
  }
  // Returns 1 if there is a line break between this.left and
  // this.right, 0 otherwise.
  get break() {
    return this.flags & 1;
  }
  blockAt(e, t, i, r) {
    let s = i + this.left.height;
    return e < s ? this.left.blockAt(e, t, i, r) : this.right.blockAt(e, t, s, r + this.left.length + this.break);
  }
  lineAt(e, t, i, r, s) {
    let l = r + this.left.height, o = s + this.left.length + this.break, a = t == D.ByHeight ? e < l : e < o, h = a ? this.left.lineAt(e, t, i, r, s) : this.right.lineAt(e, t, i, l, o);
    if (this.break || (a ? h.to < o : h.from > o))
      return h;
    let O = t == D.ByPosNoHeight ? D.ByPosNoHeight : D.ByPos;
    return a ? h.join(this.right.lineAt(o, O, i, l, o)) : this.left.lineAt(o, O, i, r, s).join(h);
  }
  forEachLine(e, t, i, r, s, l) {
    let o = r + this.left.height, a = s + this.left.length + this.break;
    if (this.break)
      e < a && this.left.forEachLine(e, t, i, r, s, l), t >= a && this.right.forEachLine(e, t, i, o, a, l);
    else {
      let h = this.lineAt(a, D.ByPos, i, r, s);
      e < h.from && this.left.forEachLine(e, Math.min(t, h.from - 1), i, r, s, l), h.to >= e && h.from <= t && l(h), t > h.to && this.right.forEachLine(Math.max(e, h.to + 1), t, i, o, a, l);
    }
  }
  replace(e, t, i) {
    let r = this.left.length + this.break;
    if (t < r)
      return this.balanced(this.left.replace(e, t, i), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - r, t - r, i));
    let s = [];
    e > 0 && this.decomposeLeft(e, s);
    let l = s.length;
    for (let o of i)
      s.push(o);
    if (e > 0 && Ml(s, l - 1), t < this.length) {
      let o = s.length;
      this.decomposeRight(t, s), Ml(s, o);
    }
    return pe.of(s);
  }
  decomposeLeft(e, t) {
    let i = this.left.length;
    if (e <= i)
      return this.left.decomposeLeft(e, t);
    t.push(this.left), this.break && (i++, e >= i && t.push(null)), e > i && this.right.decomposeLeft(e - i, t);
  }
  decomposeRight(e, t) {
    let i = this.left.length, r = i + this.break;
    if (e >= r)
      return this.right.decomposeRight(e - r, t);
    e < i && this.left.decomposeRight(e, t), this.break && e < r && t.push(null), t.push(this.right);
  }
  balanced(e, t) {
    return e.size > 2 * t.size || t.size > 2 * e.size ? pe.of(this.break ? [e, null, t] : [e, t]) : (this.left = Pn(this.left, e), this.right = Pn(this.right, t), this.setHeight(e.height + t.height), this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
  }
  updateHeight(e, t = 0, i = !1, r) {
    let { left: s, right: l } = this, o = t + s.length + this.break, a = null;
    return r && r.from <= t + s.length && r.more ? a = s = s.updateHeight(e, t, i, r) : s.updateHeight(e, t, i), r && r.from <= o + l.length && r.more ? a = l = l.updateHeight(e, o, i, r) : l.updateHeight(e, o, i), a ? this.balanced(s, l) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function Ml(n, e) {
  let t, i;
  n[e] == null && (t = n[e - 1]) instanceof ie && (i = n[e + 1]) instanceof ie && n.splice(e - 1, 3, new ie(t.length + 1 + i.length));
}
const Kf = 5;
class qs {
  constructor(e, t) {
    this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, t) {
    if (this.lineStart > -1) {
      let i = Math.min(t, this.lineEnd), r = this.nodes[this.nodes.length - 1];
      r instanceof xe ? r.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new xe(i - this.pos, -1, 0)), this.writtenTo = i, t > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = t;
  }
  point(e, t, i) {
    if (e < t || i.heightRelevant) {
      let r = i.widget ? i.widget.estimatedHeight : 0, s = i.widget ? i.widget.lineBreaks : 0;
      r < 0 && (r = this.oracle.lineHeight);
      let l = t - e;
      i.block ? this.addBlock(new uh(l, r, i)) : (l || s || r >= Kf) && this.addLineDeco(r, s, l);
    } else t > e && this.span(e, t);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new xe(this.pos - e, -1, 0)), this.writtenTo = this.pos;
  }
  blankContent(e, t) {
    let i = new ie(t - e);
    return this.oracle.doc.lineAt(e).to == t && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof xe)
      return e;
    let t = new xe(0, -1, 0);
    return this.nodes.push(t), t;
  }
  addBlock(e) {
    this.enterLine();
    let t = e.deco;
    t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, t && t.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, t, i) {
    let r = this.ensureLine();
    r.length += i, r.collapsed += i, r.widgetHeight = Math.max(r.widgetHeight, e), r.breaks += t, this.writtenTo = this.pos = this.pos + i;
  }
  finish(e) {
    let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(t instanceof xe) && !this.isCovered ? this.nodes.push(new xe(0, -1, 0)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = e;
    for (let r of this.nodes)
      r instanceof xe && r.updateHeight(this.oracle, i), i += r ? r.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, t, i, r) {
    let s = new qs(i, e);
    return W.spans(t, i, r, s, 0), s.finish(i);
  }
}
function Jf(n, e, t) {
  let i = new eu();
  return W.compare(n, e, t, i, 0), i.changes;
}
class eu {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, t, i, r) {
    (e < t || i && i.heightRelevant || r && r.heightRelevant) && Et(e, t, this.changes, 5);
  }
}
function tu(n, e) {
  let t = n.getBoundingClientRect(), i = n.ownerDocument, r = i.defaultView || window, s = Math.max(0, t.left), l = Math.min(r.innerWidth, t.right), o = Math.max(0, t.top), a = Math.min(r.innerHeight, t.bottom);
  for (let h = n.parentNode; h && h != i.body; )
    if (ee(h)) {
      let O = window.getComputedStyle(h);
      if ((h.scrollHeight > h.clientHeight || h.scrollWidth > h.clientWidth) && O.overflow != "visible") {
        let c = h.getBoundingClientRect();
        s = Math.max(s, c.left), l = Math.min(l, c.right), o = Math.max(o, c.top), a = Math.min(h == n.parentNode ? r.innerHeight : a, c.bottom);
      }
      h = O.position == "absolute" || O.position == "fixed" ? h.offsetParent : h.parentNode;
    } else if (h.nodeType == 11)
      h = h.host;
    else
      break;
  return {
    left: s - t.left,
    right: Math.max(s, l) - t.left,
    top: o - (t.top + e),
    bottom: Math.max(o, a) - (t.top + e)
  };
}
function iu(n) {
  let e = n.getBoundingClientRect(), t = n.ownerDocument.defaultView || window;
  return e.left < t.innerWidth && e.right > 0 && e.top < t.innerHeight && e.bottom > 0;
}
function nu(n, e) {
  let t = n.getBoundingClientRect();
  return {
    left: 0,
    right: t.right - t.left,
    top: e,
    bottom: t.bottom - (t.top + e)
  };
}
class Or {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.size = i, this.displaySize = r;
  }
  static same(e, t) {
    if (e.length != t.length)
      return !1;
    for (let i = 0; i < e.length; i++) {
      let r = e[i], s = t[i];
      if (r.from != s.from || r.to != s.to || r.size != s.size)
        return !1;
    }
    return !0;
  }
  draw(e, t) {
    return G.replace({
      widget: new ru(this.displaySize * (t ? e.scaleY : e.scaleX), t)
    }).range(this.from, this.to);
  }
}
class ru extends Ci {
  constructor(e, t) {
    super(), this.size = e, this.vertical = t;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class ql {
  constructor(e, t) {
    this.view = e, this.state = t, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scaleX = 1, this.scaleY = 1, this.scrollOffset = 0, this.scrolledToBottom = !1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = ss, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = B.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let i = t.facet(Ws).some((r) => typeof r != "function" && r.class == "cm-lineWrapping");
    this.heightOracle = new If(i), this.stateDeco = Yl(t), this.heightMap = pe.empty().applyChanges(this.stateDeco, _.empty, this.heightOracle.setDoc(t.doc), [new ve(0, 0, 0, t.doc.length)]);
    for (let r = 0; r < 2 && (this.viewport = this.getViewport(0, null), !!this.updateForViewport()); r++)
      ;
    this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = G.set(this.lineGaps.map((r) => r.draw(this, !1))), this.scrollParent = e.scrollDOM, this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: t } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let r = i ? t.head : t.anchor;
      if (!e.some(({ from: s, to: l }) => r >= s && r <= l)) {
        let { from: s, to: l } = this.lineBlockAt(r);
        e.push(new Bi(s, l));
      }
    }
    return this.viewports = e.sort((i, r) => i.from - r.from), this.updateScaler();
  }
  updateScaler() {
    let e = this.scaler;
    return this.scaler = this.heightMap.height <= 7e6 ? ss : xn.get(this.heightOracle, this.heightMap, this.viewports), e.eq(this.scaler) ? 0 : 2;
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(ui(e, this.scaler));
    });
  }
  update(e, t = null) {
    this.state = e.state;
    let i = this.stateDeco;
    this.stateDeco = Yl(this.state);
    let r = e.changedRanges, s = ve.extendWithRanges(r, Jf(i, this.stateDeco, e ? e.changes : J.empty(this.state.doc.length))), l = this.heightMap.height, o = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollOffset);
    _l(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), s), (this.heightMap.height != l || Ht) && (e.flags |= 2), o ? (this.scrollAnchorPos = e.changes.mapPos(o.from, -1), this.scrollAnchorHeight = o.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = l);
    let a = s.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (t && (t.range.head < a.from || t.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, t));
    let h = a.from != this.viewport.from || a.to != this.viewport.to;
    this.viewport = a, e.flags |= this.updateForViewport(), (h || !e.changes.empty || e.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(e.changes), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && (e.selectionSet || e.focusChanged) && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(Ga) && (this.mustEnforceCursorAssoc = !0);
  }
  measure() {
    let { view: e } = this, t = e.contentDOM, i = window.getComputedStyle(t), r = this.heightOracle, s = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? B.RTL : B.LTR;
    let l = this.heightOracle.mustRefreshForWrapping(s) || this.mustMeasureContent === "refresh", o = t.getBoundingClientRect(), a = l || this.mustMeasureContent || this.contentDOMHeight != o.height;
    this.contentDOMHeight = o.height, this.mustMeasureContent = !1;
    let h = 0, O = 0;
    if (o.width && o.height) {
      let { scaleX: S, scaleY: x } = xa(t, o);
      (S > 5e-3 && Math.abs(this.scaleX - S) > 5e-3 || x > 5e-3 && Math.abs(this.scaleY - x) > 5e-3) && (this.scaleX = S, this.scaleY = x, h |= 16, l = a = !0);
    }
    let c = (parseInt(i.paddingTop) || 0) * this.scaleY, f = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != c || this.paddingBottom != f) && (this.paddingTop = c, this.paddingBottom = f, h |= 18), this.editorWidth != e.scrollDOM.clientWidth && (r.lineWrapping && (a = !0), this.editorWidth = e.scrollDOM.clientWidth, h |= 16);
    let u = ka(this.view.contentDOM, !1).y;
    u != this.scrollParent && (this.scrollParent = u, this.scrollAnchorHeight = -1, this.scrollOffset = 0);
    let d = this.getScrollOffset();
    this.scrollOffset != d && (this.scrollAnchorHeight = -1, this.scrollOffset = d), this.scrolledToBottom = Za(this.scrollParent || e.win);
    let p = (this.printing ? nu : tu)(t, this.paddingTop), m = p.top - this.pixelViewport.top, $ = p.bottom - this.pixelViewport.bottom;
    this.pixelViewport = p;
    let w = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (w != this.inView && (this.inView = w, w && (a = !0)), !this.inView && !this.scrollTarget && !iu(e.dom))
      return 0;
    let b = o.width;
    if ((this.contentDOMWidth != b || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = o.width, this.editorHeight = e.scrollDOM.clientHeight, h |= 16), a) {
      let S = e.docView.measureVisibleLineHeights(this.viewport);
      if (r.mustRefreshForHeights(S) && (l = !0), l || r.lineWrapping && Math.abs(b - this.contentDOMWidth) > r.charWidth) {
        let { lineHeight: x, charWidth: k, textHeight: M } = e.docView.measureTextSize();
        l = x > 0 && r.refresh(s, x, k, M, Math.max(5, b / k), S), l && (e.docView.minWidth = 0, h |= 16);
      }
      m > 0 && $ > 0 ? O = Math.max(m, $) : m < 0 && $ < 0 && (O = Math.min(m, $)), _l();
      for (let x of this.viewports) {
        let k = x.from == this.viewport.from ? S : e.docView.measureVisibleLineHeights(x);
        this.heightMap = (l ? pe.empty().applyChanges(this.stateDeco, _.empty, this.heightOracle, [new ve(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(r, 0, l, new Nf(x.from, k));
      }
      Ht && (h |= 2);
    }
    let R = !this.viewportIsAppropriate(this.viewport, O) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return R && (h & 2 && (h |= this.updateScaler()), this.viewport = this.getViewport(O, this.scrollTarget), h |= this.updateForViewport()), (h & 2 || R) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(l ? [] : this.lineGaps, e)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, t) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), r = this.heightMap, s = this.heightOracle, { visibleTop: l, visibleBottom: o } = this, a = new Bi(r.lineAt(l - i * 1e3, D.ByHeight, s, 0, 0).from, r.lineAt(o + (1 - i) * 1e3, D.ByHeight, s, 0, 0).to);
    if (t) {
      let { head: h } = t.range;
      if (h < a.from || h > a.to) {
        let O = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), c = r.lineAt(h, D.ByPos, s, 0, 0), f;
        t.y == "center" ? f = (c.top + c.bottom) / 2 - O / 2 : t.y == "start" || t.y == "nearest" && h < a.from ? f = c.top : f = c.bottom - O, a = new Bi(r.lineAt(f - 1e3 / 2, D.ByHeight, s, 0, 0).from, r.lineAt(f + O + 1e3 / 2, D.ByHeight, s, 0, 0).to);
      }
    }
    return a;
  }
  mapViewport(e, t) {
    let i = t.mapPos(e.from, -1), r = t.mapPos(e.to, 1);
    return new Bi(this.heightMap.lineAt(i, D.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(r, D.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: t }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: r } = this.heightMap.lineAt(e, D.ByPos, this.heightOracle, 0, 0), { bottom: s } = this.heightMap.lineAt(t, D.ByPos, this.heightOracle, 0, 0), { visibleTop: l, visibleBottom: o } = this;
    return (e == 0 || r <= l - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (t == this.state.doc.length || s >= o + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && r > l - 2 * 1e3 && s < o + 2 * 1e3;
  }
  mapLineGaps(e, t) {
    if (!e.length || t.empty)
      return e;
    let i = [];
    for (let r of e)
      t.touchesRange(r.from, r.to) || i.push(new Or(t.mapPos(r.from), t.mapPos(r.to), r.size, r.displaySize));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, t) {
    let i = this.heightOracle.lineWrapping, r = i ? 1e4 : 2e3, s = r >> 1, l = r << 1;
    if (this.defaultTextDirection != B.LTR && !i)
      return [];
    let o = [], a = (O, c, f, u) => {
      if (c - O < s)
        return;
      let d = this.state.selection.main, p = [d.from];
      d.empty || p.push(d.to);
      for (let $ of p)
        if ($ > O && $ < c) {
          a(O, $ - 10, f, u), a($ + 10, c, f, u);
          return;
        }
      let m = lu(e, ($) => $.from >= f.from && $.to <= f.to && Math.abs($.from - O) < s && Math.abs($.to - c) < s && !p.some((w) => $.from < w && $.to > w));
      if (!m) {
        if (c < f.to && t && i && t.visibleRanges.some((b) => b.from <= c && b.to >= c)) {
          let b = t.moveToLineBoundary(Q.cursor(c), !1, !0).head;
          b > O && (c = b);
        }
        let $ = this.gapSize(f, O, c, u), w = i || $ < 2e6 ? $ : 2e6;
        m = new Or(O, c, $, w);
      }
      o.push(m);
    }, h = (O) => {
      if (O.length < l || O.type != re.Text)
        return;
      let c = su(O.from, O.to, this.stateDeco);
      if (c.total < l)
        return;
      let f = this.scrollTarget ? this.scrollTarget.range.head : null, u, d;
      if (i) {
        let p = r / this.heightOracle.lineLength * this.heightOracle.lineHeight, m, $;
        if (f != null) {
          let w = Ni(c, f), b = ((this.visibleBottom - this.visibleTop) / 2 + p) / O.height;
          m = w - b, $ = w + b;
        } else
          m = (this.visibleTop - O.top - p) / O.height, $ = (this.visibleBottom - O.top + p) / O.height;
        u = Ii(c, m), d = Ii(c, $);
      } else {
        let p = c.total * this.heightOracle.charWidth, m = r * this.heightOracle.charWidth, $ = 0;
        if (p > 2e6)
          for (let x of e)
            x.from >= O.from && x.from < O.to && x.size != x.displaySize && x.from * this.heightOracle.charWidth + $ < this.pixelViewport.left && ($ = x.size - x.displaySize);
        let w = this.pixelViewport.left + $, b = this.pixelViewport.right + $, R, S;
        if (f != null) {
          let x = Ni(c, f), k = ((b - w) / 2 + m) / p;
          R = x - k, S = x + k;
        } else
          R = (w - m) / p, S = (b + m) / p;
        u = Ii(c, R), d = Ii(c, S);
      }
      u > O.from && a(O.from, u, O, c), d < O.to && a(d, O.to, O, c);
    };
    for (let O of this.viewportLines)
      Array.isArray(O.type) ? O.type.forEach(h) : h(O);
    return o;
  }
  gapSize(e, t, i, r) {
    let s = Ni(r, i) - Ni(r, t);
    return this.heightOracle.lineWrapping ? e.height * s : r.total * this.heightOracle.charWidth * s;
  }
  updateLineGaps(e) {
    Or.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = G.set(e.map((t) => t.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges(e) {
    let t = this.stateDeco;
    this.lineGaps.length && (t = t.concat(this.lineGapDeco));
    let i = [];
    W.spans(t, this.viewport.from, this.viewport.to, {
      span(s, l) {
        i.push({ from: s, to: l });
      },
      point() {
      }
    }, 20);
    let r = 0;
    if (i.length != this.visibleRanges.length)
      r = 12;
    else
      for (let s = 0; s < i.length && !(r & 8); s++) {
        let l = this.visibleRanges[s], o = i[s];
        (l.from != o.from || l.to != o.to) && (r |= 4, e && e.mapPos(l.from, -1) == o.from && e.mapPos(l.to, 1) == o.to || (r |= 8));
      }
    return this.visibleRanges = i, r;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || ui(this.heightMap.lineAt(e, D.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return e >= this.viewportLines[0].top && e <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((t) => t.top <= e && t.bottom >= e) || ui(this.heightMap.lineAt(this.scaler.fromDOM(e), D.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  getScrollOffset() {
    return this.scrollParent == this.view.scrollDOM ? this.scrollParent.scrollTop * this.scaleY : (this.scrollParent ? this.scrollParent.getBoundingClientRect().top : 0) - this.view.contentDOM.getBoundingClientRect().top;
  }
  scrollAnchorAt(e) {
    let t = this.lineBlockAtHeight(e + 12 - this.paddingTop);
    return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return ui(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class Bi {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
function su(n, e, t) {
  let i = [], r = n, s = 0;
  return W.spans(t, n, e, {
    span() {
    },
    point(l, o) {
      l > r && (i.push({ from: r, to: l }), s += l - r), r = o;
    }
  }, 20), r < e && (i.push({ from: r, to: e }), s += e - r), { total: s, ranges: i };
}
function Ii({ total: n, ranges: e }, t) {
  if (t <= 0)
    return e[0].from;
  if (t >= 1)
    return e[e.length - 1].to;
  let i = Math.floor(n * t);
  for (let r = 0; ; r++) {
    let { from: s, to: l } = e[r], o = l - s;
    if (i <= o)
      return s + i;
    i -= o;
  }
}
function Ni(n, e) {
  let t = 0;
  for (let { from: i, to: r } of n.ranges) {
    if (e <= r) {
      t += e - i;
      break;
    }
    t += r - i;
  }
  return t / n.total;
}
function lu(n, e) {
  for (let t of n)
    if (e(t))
      return t;
}
const ss = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1,
  eq(n) {
    return n == this;
  }
};
function Yl(n) {
  let e = n.facet(Un).filter((i) => typeof i != "function"), t = n.facet(_s).filter((i) => typeof i != "function");
  return t.length && e.push(W.join(t)), e;
}
class xn {
  constructor(e, t) {
    this.scale = e, this.viewports = t;
  }
  static get(e, t, i) {
    let r = 0, s = 0, l = 0, o = i.map(({ from: h, to: O }) => {
      let c = t.lineAt(h, D.ByPos, e, 0, 0).top, f = t.lineAt(O, D.ByPos, e, 0, 0).bottom;
      return r += f - c, { from: h, to: O, top: c, bottom: f, domTop: 0, domBottom: 0 };
    });
    if (t.height - r < 10)
      return ss;
    let a = (7e6 - r) / (t.height - r);
    for (let h of o)
      h.domTop = l + (h.top - s) * a, l = h.domBottom = h.domTop + (h.bottom - h.top), s = h.bottom;
    return new xn(a, o);
  }
  toDOM(e) {
    for (let t = 0, i = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.top)
        return r + (e - i) * this.scale;
      if (e <= s.bottom)
        return s.domTop + (e - s.top);
      i = s.bottom, r = s.domBottom;
    }
  }
  fromDOM(e) {
    for (let t = 0, i = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.domTop)
        return i + (e - r) / this.scale;
      if (e <= s.domBottom)
        return s.top + (e - s.domTop);
      i = s.bottom, r = s.domBottom;
    }
  }
  eq(e) {
    return e instanceof xn ? this.scale == e.scale && this.viewports.length == e.viewports.length && this.viewports.every((t, i) => t.from == e.viewports[i].from && t.to == e.viewports[i].to) : !1;
  }
}
function ui(n, e) {
  if (e.scale == 1)
    return n;
  let t = e.toDOM(n.top), i = e.toDOM(n.bottom);
  return new Ce(n.from, n.length, t, i - t, Array.isArray(n._content) ? n._content.map((r) => ui(r, e)) : n._content);
}
const Fi = /* @__PURE__ */ v.define({ combine: (n) => n.join(" ") }), ls = /* @__PURE__ */ v.define({ combine: (n) => n.indexOf(!0) > -1 }), os = /* @__PURE__ */ mt.newName(), dh = /* @__PURE__ */ mt.newName(), ph = /* @__PURE__ */ mt.newName(), gh = { "&light": "." + dh, "&dark": "." + ph };
function as(n, e, t) {
  return new mt(e, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (r) => {
        if (r == "&")
          return n;
        if (!t || !t[r])
          throw new RangeError(`Unsupported selector: ${r}`);
        return t[r];
      }) : n + " " + i;
    }
  });
}
const ou = /* @__PURE__ */ as("." + os, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0,
    overflowAnchor: "none"
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // Issue #456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    userSelect: "none",
    // #1708
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#ddd"
  },
  ".cm-selectionHandle": {
    backgroundColor: "currentColor",
    width: "1.5px"
  },
  ".cm-selectionHandle-start::before, .cm-selectionHandle-end::before": {
    content: '""',
    backgroundColor: "inherit",
    borderRadius: "50%",
    width: "8px",
    height: "8px",
    position: "absolute",
    left: "-3.25px"
  },
  ".cm-selectionHandle-start::before": { top: "-8px" },
  ".cm-selectionHandle-end::before": { bottom: "-8px" },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    zIndex: 200
  },
  ".cm-gutters-before": { insetInlineStart: 0 },
  ".cm-gutters-after": { insetInlineEnd: 0 },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    border: "0px solid #ddd",
    "&.cm-gutters-before": { borderRightWidth: "1px" },
    "&.cm-gutters-after": { borderLeftWidth: "1px" }
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0,
    zIndex: 300
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  ".cm-panels-top": { top: "0" },
  ".cm-panels-bottom": { bottom: "0" },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-dialog": {
    padding: "2px 19px 4px 6px",
    position: "relative",
    "& label": { fontSize: "80%" }
  },
  ".cm-dialog-close": {
    position: "absolute",
    top: "3px",
    right: "4px",
    backgroundColor: "inherit",
    border: "none",
    font: "inherit",
    fontSize: "14px",
    padding: "0"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "baseline",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top",
    userSelect: "none"
  },
  ".cm-highlightSpace": {
    background: "radial-gradient(circle at 50% 55%, #aaa 20%, transparent 0) no-repeat",
    backgroundSize: ".4em",
    backgroundPosition: "calc(min(50%, 0px)) center"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, gh), au = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, cr = P.ie && P.ie_version <= 11;
class hu {
  constructor(e) {
    this.view = e, this.active = !1, this.editContext = null, this.selectionRange = new Mc(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
      for (let i of t)
        this.queue.push(i);
      (P.ie && P.ie_version <= 11 || P.ios && e.composing) && t.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), window.EditContext && P.android && e.constructor.EDIT_CONTEXT !== !1 && // Chrome <126 doesn't support inverted selections in edit context (#1392)
    !(P.chrome && P.chrome_version < 126) && (this.editContext = new cu(e), e.state.facet(rt) && (e.contentDOM.editContext = this.editContext.editContext)), cr && (this.onCharData = (t) => {
      this.queue.push({
        target: t.target,
        type: "characterData",
        oldValue: t.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var t;
      ((t = this.view.docView) === null || t === void 0 ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((t) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((t) => {
      t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(this.pendingRecords().length > 0), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint(e) {
    (e.type == "change" || !e.type) && !e.matches || (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500));
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, i) => t != e[i]))) {
      this.gapIntersection.disconnect();
      for (let t of e)
        this.gapIntersection.observe(t);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let t = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, r = this.selectionRange;
    if (i.state.facet(rt) ? i.root.activeElement != this.dom : !mi(this.dom, r))
      return;
    let s = r.anchorNode && i.docView.tile.nearest(r.anchorNode);
    if (s && s.isWidget() && s.widget.ignoreEvent(e)) {
      t || (this.selectionChanged = !1);
      return;
    }
    (P.ie && P.ie_version <= 11 || P.android && P.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    r.focusNode && $i(r.focusNode, r.focusOffset, r.anchorNode, r.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, t = ki(e.root);
    if (!t)
      return !1;
    let i = P.safari && e.root.nodeType == 11 && e.root.activeElement == this.dom && Ou(this.view, t) || t;
    if (!i || this.selectionRange.eq(i))
      return !1;
    let r = mi(this.dom, i);
    return r && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && Yc(this.dom, i) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(i), r && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, t) {
    this.selectionRange.set(e.node, e.offset, t.node, t.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, t = null;
    for (let i = this.dom; i; )
      if (ee(i))
        !t && e < this.scrollTargets.length && this.scrollTargets[e] == i ? e++ : t || (t = this.scrollTargets.slice(0, e)), t && t.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = t)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, au), cr && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), cr && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, t) {
    var i;
    if (!this.delayedAndroidKey) {
      let r = () => {
        let s = this.delayedAndroidKey;
        s && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = s.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && s.force && Ut(this.dom, s.key, s.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(r);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: t,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((i = this.delayedAndroidKey) === null || i === void 0) && i.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let t = -1, i = -1, r = !1;
    for (let s of e) {
      let l = this.readMutation(s);
      l && (l.typeOver && (r = !0), t == -1 ? { from: t, to: i } = l : (t = Math.min(l.from, t), i = Math.max(l.to, i)));
    }
    return { from: t, to: i, typeOver: r };
  }
  readChange() {
    let { from: e, to: t, typeOver: i } = this.processRecords(), r = this.selectionChanged && mi(this.dom, this.selectionRange);
    if (e < 0 && !r)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let s = new vf(this.view, e, t, i);
    return this.view.docView.domChanged = { newSel: s.newSel ? s.newSel.main : null }, s;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let t = this.selectionChanged, i = this.readChange();
    if (!i)
      return this.view.requestMeasure(), !1;
    let r = this.view.state, s = nh(this.view, i);
    return this.view.state == r && (i.domChanged || t) && this.view.update([]), s;
  }
  readMutation(e) {
    let t = this.view.docView.tile.nearest(e.target);
    if (!t || t.isWidget())
      return null;
    if (t.markDirty(e.type == "attributes"), e.type == "childList") {
      let i = zl(t, e.previousSibling || e.target.previousSibling, -1), r = zl(t, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: i ? t.posAfter(i) : t.posAtStart,
        to: r ? t.posBefore(r) : t.posAtEnd,
        typeOver: !1
      };
    } else return e.type == "characterData" ? { from: t.posAtStart, to: t.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), this.printQuery ? this.printQuery.addEventListener ? this.printQuery.addEventListener("change", this.onPrint) : this.printQuery.addListener(this.onPrint) : e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), this.printQuery ? this.printQuery.removeEventListener ? this.printQuery.removeEventListener("change", this.onPrint) : this.printQuery.removeListener(this.onPrint) : e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  update(e) {
    this.editContext && (this.editContext.update(e), e.startState.facet(rt) != e.state.facet(rt) && (e.view.contentDOM.editContext = e.state.facet(rt) ? this.editContext.editContext : null));
  }
  destroy() {
    var e, t, i;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (t = this.gapIntersection) === null || t === void 0 || t.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
    for (let r of this.scrollTargets)
      r.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy());
  }
}
function zl(n, e, t) {
  for (; e; ) {
    let i = F.get(e);
    if (i && i.parent == n)
      return i;
    let r = e.parentNode;
    e = r != n.dom ? r : t > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function El(n, e) {
  let t = e.startContainer, i = e.startOffset, r = e.endContainer, s = e.endOffset, l = n.docView.domAtPos(n.state.selection.main.anchor, 1);
  return $i(l.node, l.offset, r, s) && ([t, i, r, s] = [r, s, t, i]), { anchorNode: t, anchorOffset: i, focusNode: r, focusOffset: s };
}
function Ou(n, e) {
  if (e.getComposedRanges) {
    let r = e.getComposedRanges(n.root)[0];
    if (r)
      return El(n, r);
  }
  let t = null;
  function i(r) {
    r.preventDefault(), r.stopImmediatePropagation(), t = r.getTargetRanges()[0];
  }
  return n.contentDOM.addEventListener("beforeinput", i, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", i, !0), t ? El(n, t) : null;
}
class cu {
  constructor(e) {
    this.from = 0, this.to = 0, this.pendingContextChange = null, this.handlers = /* @__PURE__ */ Object.create(null), this.composing = null, this.resetRange(e.state);
    let t = this.editContext = new window.EditContext({
      text: e.state.doc.sliceString(this.from, this.to),
      selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, e.state.selection.main.anchor))),
      selectionEnd: this.toContextPos(e.state.selection.main.head)
    });
    this.handlers.textupdate = (i) => {
      let r = e.state.selection.main, { anchor: s, head: l } = r, o = this.toEditorPos(i.updateRangeStart), a = this.toEditorPos(i.updateRangeEnd);
      e.inputState.composing >= 0 && !this.composing && (this.composing = { contextBase: i.updateRangeStart, editorBase: o, drifted: !1 });
      let h = a - o > i.text.length;
      o == this.from && s < this.from ? o = s : a == this.to && s > this.to && (a = s);
      let O = rh(e.state.sliceDoc(o, a), i.text, (h ? r.from : r.to) - o, h ? "end" : null);
      if (!O) {
        let f = Q.single(this.toEditorPos(i.selectionStart), this.toEditorPos(i.selectionEnd));
        ns(f, r) || e.dispatch({ selection: f, userEvent: "select" });
        return;
      }
      let c = {
        from: O.from + o,
        to: O.toA + o,
        insert: _.of(i.text.slice(O.from, O.toB).split(`
`))
      };
      if ((P.mac || P.android) && c.from == l - 1 && /^\. ?$/.test(i.text) && e.contentDOM.getAttribute("autocorrect") == "off" && (c = { from: o, to: a, insert: _.of([i.text.replace(".", " ")]) }), this.pendingContextChange = c, !e.state.readOnly) {
        let f = this.to - this.from + (c.to - c.from + c.insert.length);
        Ms(e, c, Q.single(this.toEditorPos(i.selectionStart, f), this.toEditorPos(i.selectionEnd, f)));
      }
      this.pendingContextChange && (this.revertPending(e.state), this.setSelection(e.state)), c.from < c.to && !c.insert.length && e.inputState.composing >= 0 && !/[\\p{Alphabetic}\\p{Number}_]/.test(t.text.slice(Math.max(0, i.updateRangeStart - 1), Math.min(t.text.length, i.updateRangeStart + 1))) && this.handlers.compositionend(i);
    }, this.handlers.characterboundsupdate = (i) => {
      let r = [], s = null;
      for (let l = this.toEditorPos(i.rangeStart), o = this.toEditorPos(i.rangeEnd); l < o; l++) {
        let a = e.coordsForChar(l);
        s = a && new DOMRect(a.left, a.top, a.right - a.left, a.bottom - a.top) || s || new DOMRect(), r.push(s);
      }
      t.updateCharacterBounds(i.rangeStart, r);
    }, this.handlers.textformatupdate = (i) => {
      let r = [];
      for (let s of i.getTextFormats()) {
        let l = s.underlineStyle, o = s.underlineThickness;
        if (!/none/i.test(l) && !/none/i.test(o)) {
          let a = this.toEditorPos(s.rangeStart), h = this.toEditorPos(s.rangeEnd);
          if (a < h) {
            let O = `text-decoration: underline ${/^[a-z]/.test(l) ? l + " " : l == "Dashed" ? "dashed " : l == "Squiggle" ? "wavy " : ""}${/thin/i.test(o) ? 1 : 2}px`;
            r.push(G.mark({ attributes: { style: O } }).range(a, h));
          }
        }
      }
      e.dispatch({ effects: La.of(G.set(r)) });
    }, this.handlers.compositionstart = () => {
      e.inputState.composing < 0 && (e.inputState.composing = 0, e.inputState.compositionFirstChange = !0);
    }, this.handlers.compositionend = () => {
      if (e.inputState.composing = -1, e.inputState.compositionFirstChange = null, this.composing) {
        let { drifted: i } = this.composing;
        this.composing = null, i && this.reset(e.state);
      }
    };
    for (let i in this.handlers)
      t.addEventListener(i, this.handlers[i]);
    this.measureReq = { read: (i) => {
      let r = ki(i.root);
      r && r.rangeCount && this.editContext.updateSelectionBounds(r.getRangeAt(0).getBoundingClientRect());
    } };
  }
  applyEdits(e) {
    let t = 0, i = !1, r = this.pendingContextChange;
    return e.changes.iterChanges((s, l, o, a, h) => {
      if (i)
        return;
      let O = h.length - (l - s);
      if (r && l >= r.to)
        if (r.from == s && r.to == l && r.insert.eq(h)) {
          r = this.pendingContextChange = null, t += O, this.to += O;
          return;
        } else
          r = null, this.revertPending(e.state);
      if (s += t, l += t, l <= this.from)
        this.from += O, this.to += O;
      else if (s < this.to) {
        if (s < this.from || l > this.to || this.to - this.from + h.length > 3e4) {
          i = !0;
          return;
        }
        this.editContext.updateText(this.toContextPos(s), this.toContextPos(l), h.toString()), this.to += O;
      }
      t += O;
    }), r && !i && this.revertPending(e.state), !i;
  }
  update(e) {
    let t = this.pendingContextChange, i = e.startState.selection.main;
    this.composing && (this.composing.drifted || !e.changes.touchesRange(i.from, i.to) && e.transactions.some((r) => !r.isUserEvent("input.type") && r.changes.touchesRange(this.from, this.to))) ? (this.composing.drifted = !0, this.composing.editorBase = e.changes.mapPos(this.composing.editorBase)) : !this.applyEdits(e) || !this.rangeIsValid(e.state) ? (this.pendingContextChange = null, this.reset(e.state)) : (e.docChanged || e.selectionSet || t) && this.setSelection(e.state), (e.geometryChanged || e.docChanged || e.selectionSet) && e.view.requestMeasure(this.measureReq);
  }
  resetRange(e) {
    let { head: t } = e.selection.main;
    this.from = Math.max(
      0,
      t - 1e4
      /* CxVp.Margin */
    ), this.to = Math.min(
      e.doc.length,
      t + 1e4
      /* CxVp.Margin */
    );
  }
  reset(e) {
    this.resetRange(e), this.editContext.updateText(0, this.editContext.text.length, e.doc.sliceString(this.from, this.to)), this.setSelection(e);
  }
  revertPending(e) {
    let t = this.pendingContextChange;
    this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(t.from), this.toContextPos(t.from + t.insert.length), e.doc.sliceString(t.from, t.to));
  }
  setSelection(e) {
    let { main: t } = e.selection, i = this.toContextPos(Math.max(this.from, Math.min(this.to, t.anchor))), r = this.toContextPos(t.head);
    (this.editContext.selectionStart != i || this.editContext.selectionEnd != r) && this.editContext.updateSelection(i, r);
  }
  rangeIsValid(e) {
    let { head: t } = e.selection.main;
    return !(this.from > 0 && t - this.from < 500 || this.to < e.doc.length && this.to - t < 500 || this.to - this.from > 1e4 * 3);
  }
  toEditorPos(e, t = this.to - this.from) {
    e = Math.min(e, t);
    let i = this.composing;
    return i && i.drifted ? i.editorBase + (e - i.contextBase) : e + this.from;
  }
  toContextPos(e) {
    let t = this.composing;
    return t && t.drifted ? t.contextBase + (e - t.editorBase) : e - this.from;
  }
  destroy() {
    for (let e in this.handlers)
      this.editContext.removeEventListener(e, this.handlers[e]);
  }
}
class Z {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return !!this.inputState && this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return !!this.inputState && this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    var t;
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.clearAnnouncement = -1, this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: i } = e;
    this.dispatchTransactions = e.dispatchTransactions || i && ((r) => r.forEach((s) => i(s, this))) || ((r) => this.update(r)), this.dispatch = this.dispatch.bind(this), this._root = e.root || qc(e.parent) || document, this.viewState = new ql(this, e.state || z.create(e)), e.scrollTo && e.scrollTo.is(Gi) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(_t).map((r) => new sr(r));
    for (let r of this.plugins)
      r.update(this);
    this.observer = new hu(this), this.inputState = new Rf(this), this.inputState.ensureHandlers(this.plugins), this.docView = new kl(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), !((t = document.fonts) === null || t === void 0) && t.ready && document.fonts.ready.then(() => {
      this.viewState.mustMeasureContent = "refresh", this.requestMeasure();
    });
  }
  dispatch(...e) {
    let t = e.length == 1 && e[0] instanceof K ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(t, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let t = !1, i = !1, r, s = this.state;
    for (let f of e) {
      if (f.startState != s)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      s = f.state;
    }
    if (this.destroyed) {
      this.viewState.state = s;
      return;
    }
    let l = this.hasFocus, o = 0, a = null;
    e.some((f) => f.annotation(Oh)) ? (this.inputState.notifiedFocused = l, o = 1) : l != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = l, a = ch(s, l), a || (o = 1));
    let h = this.observer.delayedAndroidKey, O = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), O = this.observer.readChange(), (O && !this.state.doc.eq(s.doc) || !this.state.selection.eq(s.selection)) && (O = null)) : this.observer.clear(), s.facet(z.phrases) != this.state.facet(z.phrases))
      return this.setState(s);
    r = Sn.create(this, s, e), r.flags |= o;
    let c = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let f of e) {
        if (c && (c = c.map(f.changes)), f.scrollIntoView) {
          let { main: u } = f.state.selection, { x: d, y: p } = this.state.facet(Z.cursorScrollMargin);
          c = new Vt(u.empty ? u : Q.cursor(u.head, u.head > u.anchor ? -1 : 1), "nearest", "nearest", p, d);
        }
        for (let u of f.effects)
          u.is(Gi) && (c = u.value.clip(this.state));
      }
      this.viewState.update(r, c), this.bidiCache = kn.update(this.bidiCache, r.changes), r.empty || (this.updatePlugins(r), this.inputState.update(r)), t = this.docView.update(r), this.state.facet(fi) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(t, e.some((f) => f.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (r.startState.facet(Fi) != r.state.facet(Fi) && (this.viewState.mustMeasureContent = !0), (t || i || c || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), t && this.docViewUpdate(), !r.empty)
      for (let f of this.state.facet(Jr))
        try {
          f(r);
        } catch (u) {
          Ie(this.state, u, "update listener");
        }
    (a || O) && Promise.resolve().then(() => {
      a && this.state == a.startState && this.dispatch(a), O && !nh(this, O) && h.force && Ut(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let t = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new ql(this, e), this.plugins = e.facet(_t).map((i) => new sr(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView.destroy(), this.docView = new kl(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    t && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let t = e.startState.facet(_t), i = e.state.facet(_t);
    if (t != i) {
      let r = [];
      for (let s of i) {
        let l = t.indexOf(s);
        if (l < 0)
          r.push(new sr(s));
        else {
          let o = this.plugins[l];
          o.mustUpdate = e, r.push(o);
        }
      }
      for (let s of this.plugins)
        s.mustUpdate != e && s.destroy(this);
      this.plugins = r, this.pluginMap.clear();
    } else
      for (let r of this.plugins)
        r.mustUpdate = e;
    for (let r = 0; r < this.plugins.length; r++)
      this.plugins[r].update(this);
    t != i && this.inputState.ensureHandlers(this.plugins);
  }
  docViewUpdate() {
    for (let e of this.plugins) {
      let t = e.value;
      if (t && t.docViewUpdate)
        try {
          t.docViewUpdate(this);
        } catch (i) {
          Ie(this.state, i, "doc view update listener");
        }
    }
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let t = null, i = this.viewState.scrollParent, r = this.viewState.getScrollOffset(), { scrollAnchorPos: s, scrollAnchorHeight: l, scaleY: o } = this.viewState;
    Math.abs(r - this.viewState.scrollOffset) > 1 && (l = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let a = 0; ; a++) {
        if (l < 0) {
          if (Za(i || this.win))
            s = -1, l = this.viewState.heightMap.height / this.viewState.scaleY;
          else {
            let d = this.viewState.scrollAnchorAt(r);
            s = d.from, l = d.top;
          }
          o = this.viewState.scaleY;
        }
        this.updateState = 1;
        let h = this.viewState.measure();
        if (!h && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (a > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let O = [];
        h & 4 || ([this.measureRequests, O] = [O, this.measureRequests]);
        let c = O.map((d) => {
          try {
            return d.read(this);
          } catch (p) {
            return Ie(this.state, p), Ul;
          }
        }), f = Sn.create(this, this.state, []), u = !1;
        f.flags |= h, t ? t.flags |= h : t = f, this.updateState = 2, f.empty || (this.updatePlugins(f), this.inputState.update(f), this.updateAttrs(), u = this.docView.update(f), u && this.docViewUpdate());
        for (let d = 0; d < O.length; d++)
          if (c[d] != Ul)
            try {
              let p = O[d];
              p.write && p.write(c[d], this);
            } catch (p) {
              Ie(this.state, p);
            }
        if (u && this.docView.updateSelection(!0), !f.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, l = -1;
              continue;
            } else {
              let p = (s < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(s).top) / this.viewState.scaleY - l / o;
              if ((p > 1 || p < -1) && !(P.ios && this.inputState.lastIOSMomentumScroll > Date.now() - 100) && (i == this.scrollDOM || this.hasFocus || Math.max(this.inputState.lastWheelEvent, this.inputState.lastTouchTime) > Date.now() - 100)) {
                r = r + p, i ? s < 0 ? i.scrollTop = i.scrollHeight : i.scrollTop += p : this.win.scrollBy(0, p), l = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (t && !t.empty)
      for (let a of this.state.facet(Jr))
        a(t);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return os + " " + (this.state.facet(ls) ? ph : dh) + " " + this.state.facet(Fi);
  }
  updateAttrs() {
    let e = Vl(this, Ba, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), t = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      writingsuggestions: "false",
      translate: "no",
      contenteditable: this.state.facet(rt) ? "true" : "false",
      class: "cm-content",
      style: `${P.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (t["aria-readonly"] = "true"), Vl(this, Ws, t);
    let i = this.observer.ignore(() => {
      let r = Ql(this.contentDOM, this.contentAttrs, t), s = Ql(this.dom, this.editorAttrs, e);
      return r || s;
    });
    return this.editorAttrs = e, this.contentAttrs = t, i;
  }
  showAnnouncements(e) {
    let t = !0;
    for (let i of e)
      for (let r of i.effects)
        if (r.is(Z.announce)) {
          t && (this.announceDOM.textContent = "", this.win.clearTimeout(this.clearAnnouncement), this.clearAnnouncement = this.win.setTimeout(() => {
            this.announceDOM.textContent = " ";
          }, 200), t = !1);
          let s = this.announceDOM.appendChild(document.createElement("div"));
          s.textContent = r.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(fi);
    let e = this.state.facet(Z.cspNonce);
    mt.mount(this.root, this.styleModules.concat(ou).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable to reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let t = 0; t < this.measureRequests.length; t++)
          if (this.measureRequests[t].key === e.key) {
            this.measureRequests[t] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let t = this.pluginMap.get(e);
    return (t === void 0 || t && t.plugin != e) && this.pluginMap.set(e, t = this.plugins.find((i) => i.plugin == e) || null), t && t.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt)) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line break, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, t, i) {
    return hr(this, e, wl(this, e, t, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, t) {
    return hr(this, e, wl(this, e, t, (i) => bf(this, e.head, i)));
  }
  /**
  **\[DEPRECATED]** Get the cursor position visually at the start
  or end of a line.
  */
  visualLineSide(e, t) {
    return t ? Q.cursor(e.to, 1) : Q.cursor(e.from, -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, t, i = !0) {
    return Sf(this, e, t, i);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, t, i) {
    return hr(this, e, yf(this, e, t, i));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e, t = 1) {
    return this.docView.domAtPos(e, t);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, t = 0) {
    return this.docView.posFromDOM(e, t);
  }
  posAtCoords(e, t = !0) {
    this.readMeasured();
    let i = is(this, e, t);
    return i && i.pos;
  }
  posAndSideAtCoords(e, t = !0) {
    return this.readMeasured(), is(this, e, t);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, t = 1) {
    this.readMeasured();
    let i = this.state.doc.lineAt(e), r = this.bidiSpans(i), s = r[Be.find(r, e - i.from, -1, t)];
    return i.length && (e == i.from && t < 0 || e == i.to && t > 0) && s.dir != this.textDirectionAt(i.from) && (e == i.to ? (e = i.from + s.from, t = 1) : (e = i.from + s.to, t = -1)), this.docView.coordsAt(e, t, s.dir == B.RTL);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(Va) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > fu)
      return Wa(e.length);
    let t = this.textDirectionAt(e.from), i;
    for (let s of this.bidiCache)
      if (s.from == e.from && s.dir == t && (s.fresh || ja(s.isolates, i = yl(this, e))))
        return s.order;
    i || (i = yl(this, e));
    let r = Lc(e.text, t, i);
    return this.bidiCache.push(new kn(e.from, e.to, t, i, !0, r)), r;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || P.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      Xa(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    this.root.activeElement == this.contentDOM && this.contentDOM.blur();
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.win.clearTimeout(this.clearAnnouncement), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, t = {}) {
    var i, r, s, l;
    return Gi.of(new Vt(typeof e == "number" ? Q.cursor(e) : e, (i = t.y) !== null && i !== void 0 ? i : "nearest", (r = t.x) !== null && r !== void 0 ? r : "nearest", (s = t.yMargin) !== null && s !== void 0 ? s : 5, (l = t.xMargin) !== null && l !== void 0 ? l : 5));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: t } = this.scrollDOM, i = this.viewState.scrollAnchorAt(e);
    return Gi.of(new Vt(Q.cursor(i.from), "start", "start", i.top - e, t, !0));
  }
  /**
  Enable or disable tab-focus mode, which disables key bindings
  for Tab and Shift-Tab, letting the browser's default
  focus-changing behavior go through instead. This is useful to
  prevent trapping keyboard users in your editor.
  
  Without argument, this toggles the mode. With a boolean, it
  enables (true) or disables it (false). Given a number, it
  temporarily enables the mode until that number of milliseconds
  have passed or another non-Tab key is pressed.
  */
  setTabFocusMode(e) {
    e == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof e == "boolean" ? this.inputState.tabFocusMode = e ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + e);
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return We.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return We.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://code.haverbeke.berlin/marijn/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, t) {
    let i = mt.newName(), r = [Fi.of(i), fi.of(as(`.${i}`, e))];
    return t && t.dark && r.push(ls.of(!0)), r;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return Ri.lowest(fi.of(as("." + os, e, gh)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var t;
    let i = e.querySelector(".cm-content"), r = i && F.get(i) || F.get(e);
    return ((t = r?.root) === null || t === void 0 ? void 0 : t.view) || null;
  }
}
Z.styleModule = fi;
Z.inputHandler = Ea;
Z.clipboardInputFilter = As;
Z.clipboardOutputFilter = js;
Z.scrollHandler = Da;
Z.focusChangeEffect = Ua;
Z.perLineTextDirection = Va;
Z.exceptionSink = za;
Z.updateListener = Jr;
Z.editable = rt;
Z.mouseSelectionStyle = Ya;
Z.dragMovesSelection = qa;
Z.clickAddsSelectionRange = Ma;
Z.decorations = Un;
Z.blockWrappers = Ia;
Z.outerDecorations = _s;
Z.atomicRanges = Wi;
Z.bidiIsolatedRanges = Na;
Z.cursorScrollMargin = /* @__PURE__ */ v.define({
  combine: (n) => {
    let e = 5, t = 5;
    for (let i of n)
      typeof i == "number" ? e = t = i : { x: e, y: t } = i;
    return { x: e, y: t };
  }
});
Z.scrollMargins = Ha;
Z.darkTheme = ls;
Z.cspNonce = /* @__PURE__ */ v.define({ combine: (n) => n.length ? n[0] : "" });
Z.contentAttributes = Ws;
Z.editorAttributes = Ba;
Z.lineWrapping = /* @__PURE__ */ Z.contentAttributes.of({ class: "cm-lineWrapping" });
Z.announce = /* @__PURE__ */ I.define();
const fu = 4096, Ul = {};
class kn {
  constructor(e, t, i, r, s, l) {
    this.from = e, this.to = t, this.dir = i, this.isolates = r, this.fresh = s, this.order = l;
  }
  static update(e, t) {
    if (t.empty && !e.some((s) => s.fresh))
      return e;
    let i = [], r = e.length ? e[e.length - 1].dir : B.LTR;
    for (let s = Math.max(0, e.length - 10); s < e.length; s++) {
      let l = e[s];
      l.dir == r && !t.touchesRange(l.from, l.to) && i.push(new kn(t.mapPos(l.from, 1), t.mapPos(l.to, -1), l.dir, l.isolates, !1, l.order));
    }
    return i;
  }
}
function Vl(n, e, t) {
  for (let i = n.state.facet(e), r = i.length - 1; r >= 0; r--) {
    let s = i[r], l = typeof s == "function" ? s(n) : s;
    l && Ts(l, t);
  }
  return t;
}
const uu = P.mac ? "mac" : P.windows ? "win" : P.linux ? "linux" : "key";
function du(n, e) {
  const t = n.split(/-(?!$)/);
  let i = t[t.length - 1];
  i == "Space" && (i = " ");
  let r, s, l, o;
  for (let a = 0; a < t.length - 1; ++a) {
    const h = t[a];
    if (/^(cmd|meta|m)$/i.test(h))
      o = !0;
    else if (/^a(lt)?$/i.test(h))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      s = !0;
    else if (/^s(hift)?$/i.test(h))
      l = !0;
    else if (/^mod$/i.test(h))
      e == "mac" ? o = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return r && (i = "Alt-" + i), s && (i = "Ctrl-" + i), o && (i = "Meta-" + i), l && (i = "Shift-" + i), i;
}
function Hi(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
const pu = /* @__PURE__ */ Ri.default(/* @__PURE__ */ Z.domEventHandlers({
  keydown(n, e) {
    return Qu(gu(e.state), n, e, "editor");
  }
})), Ys = /* @__PURE__ */ v.define({ enables: pu }), Gl = /* @__PURE__ */ new WeakMap();
function gu(n) {
  let e = n.facet(Ys), t = Gl.get(e);
  return t || Gl.set(e, t = $u(e.reduce((i, r) => i.concat(r), []))), t;
}
let dt = null;
const mu = 4e3;
function $u(n, e = uu) {
  let t = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), r = (l, o) => {
    let a = i[l];
    if (a == null)
      i[l] = o;
    else if (a != o)
      throw new Error("Key binding " + l + " is used both as a regular binding and as a multi-stroke prefix");
  }, s = (l, o, a, h, O) => {
    var c, f;
    let u = t[l] || (t[l] = /* @__PURE__ */ Object.create(null)), d = o.split(/ (?!$)/).map(($) => du($, e));
    for (let $ = 1; $ < d.length; $++) {
      let w = d.slice(0, $).join(" ");
      r(w, !0), u[w] || (u[w] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(b) => {
          let R = dt = { view: b, prefix: w, scope: l };
          return setTimeout(() => {
            dt == R && (dt = null);
          }, mu), !0;
        }]
      });
    }
    let p = d.join(" ");
    r(p, !1);
    let m = u[p] || (u[p] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((f = (c = u._any) === null || c === void 0 ? void 0 : c.run) === null || f === void 0 ? void 0 : f.slice()) || []
    });
    a && m.run.push(a), h && (m.preventDefault = !0), O && (m.stopPropagation = !0);
  };
  for (let l of n) {
    let o = l.scope ? l.scope.split(" ") : ["editor"];
    if (l.any)
      for (let h of o) {
        let O = t[h] || (t[h] = /* @__PURE__ */ Object.create(null));
        O._any || (O._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        let { any: c } = l;
        for (let f in O)
          O[f].run.push((u) => c(u, hs));
      }
    let a = l[e] || l.key;
    if (a)
      for (let h of o)
        s(h, a, l.run, l.preventDefault, l.stopPropagation), l.shift && s(h, "Shift-" + a, l.shift, l.preventDefault, l.stopPropagation);
  }
  return t;
}
let hs = null;
function Qu(n, e, t, i) {
  hs = e;
  let r = Rc(e), s = uc(r, 0), l = dc(s) == r.length && r != " ", o = "", a = !1, h = !1, O = !1;
  dt && dt.view == t && dt.scope == i && (o = dt.prefix + " ", lh.indexOf(e.keyCode) < 0 && (h = !0, dt = null));
  let c = /* @__PURE__ */ new Set(), f = (m) => {
    if (m) {
      for (let $ of m.run)
        if (!c.has($) && (c.add($), $(t)))
          return m.stopPropagation && (O = !0), !0;
      m.preventDefault && (m.stopPropagation && (O = !0), h = !0);
    }
    return !1;
  }, u = n[i], d, p;
  return u && (f(u[o + Hi(r, e, !l)]) ? a = !0 : l && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(P.windows && e.ctrlKey && e.altKey) && // Alt-combinations on macOS tend to be typed characters
  !(P.mac && e.altKey && !(e.ctrlKey || e.metaKey)) && (d = $t[e.keyCode]) && d != r ? (f(u[o + Hi(d, e, !0)]) || e.shiftKey && (p = Pi[e.keyCode]) != r && p != d && f(u[o + Hi(p, e, !1)])) && (a = !0) : l && e.shiftKey && f(u[o + Hi(r, e, !0)]) && (a = !0), !a && f(u._any) && (a = !0)), h && (a = !0), a && O && e.stopPropagation(), hs = null, a;
}
class vt {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, t, i, r, s) {
    this.className = e, this.left = t, this.top = i, this.width = r, this.height = s;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, t) {
    return t.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, t, i) {
    if (i.empty) {
      let r = e.coordsAtPos(i.head, i.assoc || 1);
      if (!r)
        return [];
      let s = mh(e);
      return [new vt(t, r.left - s.left, r.top - s.top, null, r.bottom - r.top)];
    } else
      return Su(e, t, i);
  }
}
function mh(n) {
  let e = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == B.LTR ? e.left : e.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: e.top - n.scrollDOM.scrollTop * n.scaleY };
}
function Dl(n, e, t, i) {
  let r = n.coordsAtPos(e, t * 2);
  if (!r)
    return i;
  let s = n.dom.getBoundingClientRect(), l = (r.top + r.bottom) / 2, o = n.posAtCoords({ x: s.left + 1, y: l }), a = n.posAtCoords({ x: s.right - 1, y: l });
  return o == null || a == null ? i : { from: Math.max(i.from, Math.min(o, a)), to: Math.min(i.to, Math.max(o, a)) };
}
function Su(n, e, t) {
  if (t.to <= n.viewport.from || t.from >= n.viewport.to)
    return [];
  let i = Math.max(t.from, n.viewport.from), r = Math.min(t.to, n.viewport.to), s = n.textDirection == B.LTR, l = n.contentDOM, o = l.getBoundingClientRect(), a = mh(n), h = l.querySelector(".cm-line"), O = h && window.getComputedStyle(h), c = o.left + (O ? parseInt(O.paddingLeft) + Math.min(0, parseInt(O.textIndent)) : 0), f = o.right - (O ? parseInt(O.paddingRight) : 0), u = ts(n, i, 1), d = ts(n, r, -1), p = u.type == re.Text ? u : null, m = d.type == re.Text ? d : null;
  if (p && (n.lineWrapping || u.widgetLineBreaks) && (p = Dl(n, i, 1, p)), m && (n.lineWrapping || d.widgetLineBreaks) && (m = Dl(n, r, -1, m)), p && m && p.from == m.from && p.to == m.to)
    return w(b(t.from, t.to, p));
  {
    let S = p ? b(t.from, null, p) : R(u, !1), x = m ? b(null, t.to, m) : R(d, !0), k = [];
    return (p || u).to < (m || d).from - (p && m ? 1 : 0) || u.widgetLineBreaks > 1 && S.bottom + n.defaultLineHeight / 2 < x.top ? k.push($(c, S.bottom, f, x.top)) : S.bottom < x.top && n.elementAtHeight((S.bottom + x.top) / 2).type == re.Text && (S.bottom = x.top = (S.bottom + x.top) / 2), w(S).concat(k).concat(w(x));
  }
  function $(S, x, k, M) {
    return new vt(e, S - a.left, x - a.top, Math.max(0, k - S), M - x);
  }
  function w({ top: S, bottom: x, horizontal: k }) {
    let M = [];
    for (let j = 0; j < k.length; j += 2)
      M.push($(k[j], S, k[j + 1], x));
    return M;
  }
  function b(S, x, k) {
    let M = 1e9, j = -1e9, U = [];
    function A(Y, L, le, be, Ye) {
      let te = n.coordsAtPos(Y, Y == k.to ? -2 : 2), ke = n.coordsAtPos(le, le == k.from ? 2 : -2);
      !te || !ke || (M = Math.min(te.top, ke.top, M), j = Math.max(te.bottom, ke.bottom, j), Ye == B.LTR ? U.push(s && L ? c : te.left, s && be ? f : ke.right) : U.push(!s && be ? c : ke.left, !s && L ? f : te.right));
    }
    let T = S ?? k.from, E = x ?? k.to;
    for (let Y of n.visibleRanges)
      if (Y.to > T && Y.from < E)
        for (let L = Math.max(Y.from, T), le = Math.min(Y.to, E); ; ) {
          let be = n.state.doc.lineAt(L);
          for (let Ye of n.bidiSpans(be)) {
            let te = Ye.from + be.from, ke = Ye.to + be.from;
            if (te >= le)
              break;
            ke > L && A(Math.max(te, L), S == null && te <= T, Math.min(ke, le), x == null && ke >= E, Ye.dir);
          }
          if (L = be.to + 1, L >= le)
            break;
        }
    return U.length == 0 && A(T, S == null, E, x == null, n.textDirection), { top: M, bottom: j, horizontal: U };
  }
  function R(S, x) {
    let k = o.top + (x ? S.top : S.bottom);
    return { top: k, bottom: k, horizontal: [] };
  }
}
function bu(n, e) {
  return n.constructor == e.constructor && n.eq(e);
}
class yu {
  constructor(e, t) {
    this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(an) != e.state.facet(an) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  docViewUpdate(e) {
    this.layer.updateOnDocViewUpdate !== !1 && e.requestMeasure(this.measureReq);
  }
  setOrder(e) {
    let t = 0, i = e.facet(an);
    for (; t < i.length && i[t] != this.layer; )
      t++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: t } = this.view;
    (e != this.scaleX || t != this.scaleY) && (this.scaleX = e, this.scaleY = t, this.dom.style.transform = `scale(${1 / e}, ${1 / t})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((t, i) => !bu(t, this.drawn[i]))) {
      let t = this.dom.firstChild, i = 0;
      for (let r of e)
        r.update && t && r.constructor && this.drawn[i].constructor && r.update(t, this.drawn[i]) ? (t = t.nextSibling, i++) : this.dom.insertBefore(r.draw(), t);
      for (; t; ) {
        let r = t.nextSibling;
        t.remove(), t = r;
      }
      this.drawn = e, P.webkit && (this.dom.style.display = this.dom.firstChild ? "" : "none");
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const an = /* @__PURE__ */ v.define();
function $h(n) {
  return [
    We.define((e) => new yu(e, n)),
    an.of(n)
  ];
}
const Os = !P.ios, Kt = /* @__PURE__ */ v.define({
  combine(n) {
    return Yn(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0,
      iosSelectionHandles: !0
    }, {
      cursorBlinkRate: (e, t) => Math.min(e, t),
      drawRangeCursor: (e, t) => e || t
    });
  }
});
function Pu(n = {}) {
  return [
    Kt.of(n),
    xu,
    ku,
    vu,
    Ga.of(!0)
  ];
}
function Qh(n) {
  return n.startState.facet(Kt) != n.state.facet(Kt);
}
const xu = /* @__PURE__ */ $h({
  above: !0,
  markers(n) {
    let { state: e } = n, t = e.facet(Kt), i = [];
    for (let r of e.selection.ranges) {
      let s = r == e.selection.main;
      if (r.empty || t.drawRangeCursor && !(s && P.ios && t.iosSelectionHandles)) {
        let l = s ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", o = r.empty ? r : Q.cursor(r.head, r.assoc);
        for (let a of vt.forRange(n, l, o))
          i.push(a);
      }
    }
    return i;
  },
  update(n, e) {
    n.transactions.some((i) => i.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let t = Qh(n);
    return t && Ll(n.state, e), n.docChanged || n.selectionSet || t;
  },
  mount(n, e) {
    Ll(e.state, n);
  },
  class: "cm-cursorLayer"
});
function Ll(n, e) {
  e.style.animationDuration = n.facet(Kt).cursorBlinkRate + "ms";
}
const ku = /* @__PURE__ */ $h({
  above: !1,
  markers(n) {
    let e = [], { main: t, ranges: i } = n.state.selection;
    for (let r of i)
      if (!r.empty && (Os || r != t))
        for (let s of vt.forRange(n, "cm-selectionBackground", r))
          e.push(s);
    if (P.ios && !t.empty && n.state.facet(Kt).iosSelectionHandles) {
      for (let r of vt.forRange(n, "cm-selectionHandle cm-selectionHandle-start", Q.cursor(t.from, 1)))
        e.push(r);
      for (let r of vt.forRange(n, "cm-selectionHandle cm-selectionHandle-end", Q.cursor(t.to, 1)))
        e.push(r);
    }
    return e;
  },
  update(n, e) {
    return n.docChanged || n.selectionSet || n.viewportChanged || Qh(n);
  },
  class: "cm-selectionLayer"
}), wu = P.gecko && P.gecko_version == 153 ? "#ffffff01" : "transparent", vu = /* @__PURE__ */ Ri.highest(/* @__PURE__ */ Z.theme({
  ".cm-line": {
    ...Os ? {
      "& ::selection, &::selection": { backgroundColor: `${wu} !important` }
    } : {},
    caretColor: "transparent !important"
  },
  ".cm-content": {
    caretColor: "transparent !important",
    "& :focus": {
      caretColor: "initial !important",
      ...Os ? {
        "&::selection, & ::selection": {
          backgroundColor: "Highlight !important"
        }
      } : {}
    }
  }
}));
function Xu() {
  return Tu;
}
const Zu = /* @__PURE__ */ G.line({ class: "cm-activeLine" }), Tu = /* @__PURE__ */ We.fromClass(class {
  constructor(n) {
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.docChanged || n.selectionSet) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = -1, t = [];
    for (let i of n.state.selection.ranges) {
      let r = n.lineBlockAt(i.head);
      r.from > e && (t.push(Zu.range(r.from)), e = r.from);
    }
    return G.set(t);
  }
}, {
  decorations: (n) => n.decorations
});
class St extends gt {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
St.prototype.elementClass = "";
St.prototype.toDOM = void 0;
St.prototype.mapMode = de.TrackBefore;
St.prototype.startSide = St.prototype.endSide = -1;
St.prototype.point = !0;
const hn = /* @__PURE__ */ v.define(), Ru = /* @__PURE__ */ v.define(), Cu = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => W.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {},
  side: "before"
}, Si = /* @__PURE__ */ v.define();
function dQ(n) {
  return [Sh(), Si.of({ ...Cu, ...n })];
}
const Bl = /* @__PURE__ */ v.define({
  combine: (n) => n.some((e) => e)
});
function Sh(n) {
  return [
    Au
  ];
}
const Au = /* @__PURE__ */ We.fromClass(class {
  constructor(n) {
    this.view = n, this.domAfter = null, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters cm-gutters-before", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(Si).map((e) => new Nl(n, e)), this.fixed = !n.state.facet(Bl);
    for (let e of this.gutters)
      e.config.side == "after" ? this.getDOMAfter().appendChild(e.dom) : this.dom.appendChild(e.dom);
    this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  getDOMAfter() {
    return this.domAfter || (this.domAfter = document.createElement("div"), this.domAfter.className = "cm-gutters cm-gutters-after", this.domAfter.setAttribute("aria-hidden", "true"), this.domAfter.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.domAfter.style.position = this.fixed ? "sticky" : "", this.view.scrollDOM.appendChild(this.domAfter)), this.domAfter;
  }
  update(n) {
    if (this.updateGutters(n)) {
      let e = this.prevViewport, t = n.view.viewport, i = Math.min(e.to, t.to) - Math.max(e.from, t.from);
      this.syncGutters(i < (t.to - t.from) * 0.8);
    }
    if (n.geometryChanged) {
      let e = this.view.contentHeight / this.view.scaleY + "px";
      this.dom.style.minHeight = e, this.domAfter && (this.domAfter.style.minHeight = e);
    }
    this.view.state.facet(Bl) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : "", this.domAfter && (this.domAfter.style.position = this.fixed ? "sticky" : "")), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let e = this.dom.nextSibling;
    n && (this.dom.remove(), this.domAfter && this.domAfter.remove());
    let t = W.iter(this.view.state.facet(hn), this.view.viewport.from), i = [], r = this.gutters.map((s) => new ju(s, this.view.viewport, -this.view.documentPadding.top));
    for (let s of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(s.type)) {
        let l = !0;
        for (let o of s.type)
          if (o.type == re.Text && l) {
            cs(t, i, o.from);
            for (let a of r)
              a.line(this.view, o, i);
            l = !1;
          } else if (o.widget)
            for (let a of r)
              a.widget(this.view, o);
      } else if (s.type == re.Text) {
        cs(t, i, s.from);
        for (let l of r)
          l.line(this.view, s, i);
      } else if (s.widget)
        for (let l of r)
          l.widget(this.view, s);
    for (let s of r)
      s.finish();
    n && (this.view.scrollDOM.insertBefore(this.dom, e), this.domAfter && this.view.scrollDOM.appendChild(this.domAfter));
  }
  updateGutters(n) {
    let e = n.startState.facet(Si), t = n.state.facet(Si), i = n.docChanged || n.heightChanged || n.viewportChanged || !W.eq(n.startState.facet(hn), n.state.facet(hn), n.view.viewport.from, n.view.viewport.to);
    if (e == t)
      for (let r of this.gutters)
        r.update(n) && (i = !0);
    else {
      i = !0;
      let r = [];
      for (let s of t) {
        let l = e.indexOf(s);
        l < 0 ? r.push(new Nl(this.view, s)) : (this.gutters[l].update(n), r.push(this.gutters[l]));
      }
      for (let s of this.gutters)
        s.dom.remove(), r.indexOf(s) < 0 && s.destroy();
      for (let s of r)
        s.config.side == "after" ? this.getDOMAfter().appendChild(s.dom) : this.dom.appendChild(s.dom);
      this.gutters = r;
    }
    return i;
  }
  destroy() {
    for (let n of this.gutters)
      n.destroy();
    this.dom.remove(), this.domAfter && this.domAfter.remove();
  }
}, {
  provide: (n) => Z.scrollMargins.of((e) => {
    let t = e.plugin(n);
    if (!t || t.gutters.length == 0 || !t.fixed)
      return null;
    let i = t.dom.offsetWidth * e.scaleX, r = t.domAfter ? t.domAfter.offsetWidth * e.scaleX : 0;
    return e.textDirection == B.LTR ? { left: i, right: r } : { right: i, left: r };
  })
});
function Il(n) {
  return Array.isArray(n) ? n : [n];
}
function cs(n, e, t) {
  for (; n.value && n.from <= t; )
    n.from == t && e.push(n.value), n.next();
}
class ju {
  constructor(e, t, i) {
    this.gutter = e, this.height = i, this.i = 0, this.cursor = W.iter(e.markers, t.from);
  }
  addElement(e, t, i) {
    let { gutter: r } = this, s = (t.top - this.height) / e.scaleY, l = t.height / e.scaleY;
    if (this.i == r.elements.length) {
      let o = new bh(e, l, s, i);
      r.elements.push(o), r.dom.appendChild(o.dom);
    } else
      r.elements[this.i].update(e, l, s, i);
    this.height = t.bottom, this.i++;
  }
  line(e, t, i) {
    let r = [];
    cs(this.cursor, r, t.from), i.length && (r = r.concat(i));
    let s = this.gutter.config.lineMarker(e, t, r);
    s && r.unshift(s);
    let l = this.gutter;
    r.length == 0 && !l.config.renderEmptyElements || this.addElement(e, t, r);
  }
  widget(e, t) {
    let i = this.gutter.config.widgetMarker(e, t.widget, t), r = i ? [i] : null;
    for (let s of e.state.facet(Ru)) {
      let l = s(e, t.widget, t);
      l && (r || (r = [])).push(l);
    }
    r && this.addElement(e, t, r);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let t = e.elements.pop();
      e.dom.removeChild(t.dom), t.destroy();
    }
  }
}
class Nl {
  constructor(e, t) {
    this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in t.domEventHandlers)
      this.dom.addEventListener(i, (r) => {
        let s = r.target, l;
        if (s != this.dom && this.dom.contains(s)) {
          for (; s.parentNode != this.dom; )
            s = s.parentNode;
          let a = s.getBoundingClientRect();
          l = (a.top + a.bottom) / 2;
        } else
          l = r.clientY;
        let o = e.lineBlockAtHeight(l - e.documentTop);
        t.domEventHandlers[i](e, o, r) && r.preventDefault();
      });
    this.markers = Il(t.markers(e)), t.initialSpacer && (this.spacer = new bh(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let t = this.markers;
    if (this.markers = Il(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let r = this.config.updateSpacer(this.spacer.markers[0], e);
      r != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [r]);
    }
    let i = e.view.viewport;
    return !W.eq(this.markers, t, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class bh {
  constructor(e, t, i, r) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, i, r);
  }
  update(e, t, i, r) {
    this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""), Wu(this.markers, r) || this.setMarkers(e, r);
  }
  setMarkers(e, t) {
    let i = "cm-gutterElement", r = this.dom.firstChild;
    for (let s = 0, l = 0; ; ) {
      let o = l, a = s < t.length ? t[s++] : null, h = !1;
      if (a) {
        let O = a.elementClass;
        O && (i += " " + O);
        for (let c = l; c < this.markers.length; c++)
          if (this.markers[c].compare(a)) {
            o = c, h = !0;
            break;
          }
      } else
        o = this.markers.length;
      for (; l < o; ) {
        let O = this.markers[l++];
        if (O.toDOM) {
          O.destroy(r);
          let c = r.nextSibling;
          r.remove(), r = c;
        }
      }
      if (!a)
        break;
      a.toDOM && (h ? r = r.nextSibling : this.dom.insertBefore(a.toDOM(e), r)), h && l++;
    }
    this.dom.className = i, this.markers = t;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function Wu(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].compare(e[t]))
      return !1;
  return !0;
}
const _u = /* @__PURE__ */ v.define(), Mu = /* @__PURE__ */ v.define(), Mt = /* @__PURE__ */ v.define({
  combine(n) {
    return Yn(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, t) {
        let i = Object.assign({}, e);
        for (let r in t) {
          let s = i[r], l = t[r];
          i[r] = s ? (o, a, h) => s(o, a, h) || l(o, a, h) : l;
        }
        return i;
      }
    });
  }
});
class fr extends St {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function ur(n, e) {
  return n.state.facet(Mt).formatNumber(e, n.state);
}
const qu = /* @__PURE__ */ Si.compute([Mt], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(_u);
  },
  lineMarker(e, t, i) {
    return i.some((r) => r.toDOM) ? null : new fr(ur(e, e.state.doc.lineAt(t.from).number));
  },
  widgetMarker: (e, t, i) => {
    for (let r of e.state.facet(Mu)) {
      let s = r(e, t, i);
      if (s)
        return s;
    }
    return null;
  },
  lineMarkerChange: (e) => e.startState.facet(Mt) != e.state.facet(Mt),
  initialSpacer(e) {
    return new fr(ur(e, Fl(e.state.doc.lines)));
  },
  updateSpacer(e, t) {
    let i = ur(t.view, Fl(t.view.state.doc.lines));
    return i == e.number ? e : new fr(i);
  },
  domEventHandlers: n.facet(Mt).domEventHandlers,
  side: "before"
}));
function Yu(n = {}) {
  return [
    Mt.of(n),
    Sh(),
    qu
  ];
}
function Fl(n) {
  let e = 9;
  for (; e < n; )
    e = e * 10 + 9;
  return e;
}
const zu = /* @__PURE__ */ new class extends St {
  constructor() {
    super(...arguments), this.elementClass = "cm-activeLineGutter";
  }
}(), Eu = /* @__PURE__ */ hn.compute(["selection"], (n) => {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let r = n.doc.lineAt(i.head).from;
    r > t && (t = r, e.push(zu.range(r)));
  }
  return W.of(e);
});
function Uu() {
  return Eu;
}
const yh = 1024;
let Vu = 0;
class Xe {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
class C {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = Vu++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    }), this.combine = e.combine || null;
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = me.match(e)), (t) => {
      let i = e(t);
      return i === void 0 ? null : [this, i];
    };
  }
}
C.closedBy = new C({ deserialize: (n) => n.split(" ") });
C.openedBy = new C({ deserialize: (n) => n.split(" ") });
C.group = new C({ deserialize: (n) => n.split(" ") });
C.isolate = new C({ deserialize: (n) => {
  if (n && n != "rtl" && n != "ltr" && n != "auto")
    throw new RangeError("Invalid value for isolate: " + n);
  return n || "auto";
} });
C.contextHash = new C({ perNode: !0 });
C.lookAhead = new C({ perNode: !0 });
C.mounted = new C({ perNode: !0 });
class Gt {
  constructor(e, t, i, r = !1) {
    this.tree = e, this.overlay = t, this.parser = i, this.bracketed = r;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[C.mounted.id];
  }
}
const Gu = /* @__PURE__ */ Object.create(null);
class me {
  /**
  @internal
  */
  constructor(e, t, i, r = 0) {
    this.name = e, this.props = t, this.id = i, this.flags = r;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let t = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : Gu, i = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), r = new me(e.name || "", t, e.id, i);
    if (e.props) {
      for (let s of e.props)
        if (Array.isArray(s) || (s = s(r)), s) {
          if (s[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          t[s[0].id] = s[1];
        }
    }
    return r;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let t = this.prop(C.group);
      return t ? t.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e)
      for (let r of i.split(" "))
        t[r] = e[i];
    return (i) => {
      for (let r = i.prop(C.group), s = -1; s < (r ? r.length : 0); s++) {
        let l = t[s < 0 ? i.name : r[s]];
        if (l)
          return l;
      }
    };
  }
}
me.none = new me(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class zs {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(e) {
    this.types = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].id != t)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...e) {
    let t = [];
    for (let i of this.types) {
      let r = null;
      for (let s of e) {
        let l = s(i);
        if (l) {
          r || (r = Object.assign({}, i.props));
          let o = l[1], a = l[0];
          a.combine && a.id in r && (o = a.combine(r[a.id], o)), r[a.id] = o;
        }
      }
      t.push(r ? new me(i.name, r, i.id, i.flags) : i);
    }
    return new zs(t);
  }
}
const Ki = /* @__PURE__ */ new WeakMap(), Hl = /* @__PURE__ */ new WeakMap();
var q;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays", n[n.EnterBracketed = 16] = "EnterBracketed";
})(q || (q = {}));
class N {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, t, i, r, s) {
    if (this.type = e, this.children = t, this.positions = i, this.length = r, this.props = null, s && s.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [l, o] of s)
        this.props[typeof l == "number" ? l : l.id] = o;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = Gt.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let t = "";
    for (let i of this.children) {
      let r = i.toString();
      r && (t && (t += ","), t += r);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new wn(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, t = 0, i = 0) {
    let r = Ki.get(this) || this.topNode, s = new wn(r);
    return s.moveTo(e, t), Ki.set(this, s._tree), s;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new he(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, t = 0) {
    let i = vi(Ki.get(this) || this.topNode, e, t, !1);
    return Ki.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, t = 0) {
    let i = vi(Hl.get(this) || this.topNode, e, t, !0);
    return Hl.set(this, i), i;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, t = 0) {
    return Bu(this, e, t);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: t, leave: i, from: r = 0, to: s = this.length } = e, l = e.mode || 0, o = (l & q.IncludeAnonymous) > 0;
    for (let a = this.cursor(l | q.IncludeAnonymous); ; ) {
      let h = !1;
      if (a.from <= s && a.to >= r && (!o && a.type.isAnonymous || t(a) !== !1)) {
        if (a.firstChild())
          continue;
        h = !0;
      }
      for (; h && i && (o || !a.type.isAnonymous) && i(a), !a.nextSibling(); ) {
        if (!a.parent())
          return;
        h = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let t in this.props)
        e.push([+t, this.props[t]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : Vs(me.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, i, r) => new N(this.type, t, i, r, this.propValues), e.makeTree || ((t, i, r) => new N(me.none, t, i, r)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return Iu(e);
  }
}
N.empty = new N(me.none, [], [], 0);
class Es {
  constructor(e, t) {
    this.buffer = e, this.index = t;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new Es(this.buffer, this.index);
  }
}
class bt {
  /**
  Create a tree buffer.
  */
  constructor(e, t, i) {
    this.buffer = e, this.length = t, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return me.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let t = 0; t < this.buffer.length; )
      e.push(this.childString(t)), t = this.buffer[t + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let t = this.buffer[e], i = this.buffer[e + 3], r = this.set.types[t], s = r.name;
    if (/\W/.test(s) && !r.isError && (s = JSON.stringify(s)), e += 4, i == e)
      return s;
    let l = [];
    for (; e < i; )
      l.push(this.childString(e)), e = this.buffer[e + 3];
    return s + "(" + l.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, t, i, r, s) {
    let { buffer: l } = this, o = -1;
    for (let a = e; a != t && !(Ph(s, r, l[a + 1], l[a + 2]) && (o = a, i > 0)); a = l[a + 3])
      ;
    return o;
  }
  /**
  @internal
  */
  slice(e, t, i) {
    let r = this.buffer, s = new Uint16Array(t - e), l = 0;
    for (let o = e, a = 0; o < t; ) {
      s[a++] = r[o++], s[a++] = r[o++] - i;
      let h = s[a++] = r[o++] - i;
      s[a++] = r[o++] - e, l = Math.max(l, h);
    }
    return new bt(s, l, this.set);
  }
}
function Ph(n, e, t, i) {
  switch (n) {
    case -2:
      return t < e;
    case -1:
      return i >= e && t < e;
    case 0:
      return t < e && i > e;
    case 1:
      return t <= e && i > e;
    case 2:
      return i > e;
    case 4:
      return !0;
  }
}
function vi(n, e, t, i) {
  for (var r; n.from == n.to || (t < 1 ? n.from >= e : n.from > e) || (t > -1 ? n.to <= e : n.to < e); ) {
    let l = !i && n instanceof he && n.index < 0 ? null : n.parent;
    if (!l)
      return n;
    n = l;
  }
  let s = i ? 0 : q.IgnoreOverlays;
  if (i)
    for (let l = n, o = l.parent; o; l = o, o = l.parent)
      l instanceof he && l.index < 0 && ((r = o.enter(e, t, s)) === null || r === void 0 ? void 0 : r.from) != l.from && (n = o);
  for (; ; ) {
    let l = n.enter(e, t, s);
    if (!l)
      return n;
    n = l;
  }
}
class xh {
  cursor(e = 0) {
    return new wn(this, e);
  }
  getChild(e, t = null, i = null) {
    let r = Kl(this, e, t, i);
    return r.length ? r[0] : null;
  }
  getChildren(e, t = null, i = null) {
    return Kl(this, e, t, i);
  }
  resolve(e, t = 0) {
    return vi(this, e, t, !1);
  }
  resolveInner(e, t = 0) {
    return vi(this, e, t, !0);
  }
  matchContext(e) {
    return fs(this.parent, e);
  }
  enterUnfinishedNodesBefore(e) {
    let t = this.childBefore(e), i = this;
    for (; t; ) {
      let r = t.lastChild;
      if (!r || r.to != t.to)
        break;
      r.type.isError && r.from == r.to ? (i = t, t = r.prevSibling) : t = r;
    }
    return i;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class he extends xh {
  constructor(e, t, i, r) {
    super(), this._tree = e, this.from = t, this.index = i, this._parent = r;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, t, i, r, s = 0) {
    for (let l = this; ; ) {
      for (let { children: o, positions: a } = l._tree, h = t > 0 ? o.length : -1; e != h; e += t) {
        let O = o[e], c = a[e] + l.from, f;
        if (!(!(s & q.EnterBracketed && O instanceof N && (f = Gt.get(O)) && !f.overlay && f.bracketed && i >= c && i <= c + O.length) && !Ph(r, i, c, c + O.length))) {
          if (O instanceof bt) {
            if (s & q.ExcludeBuffers)
              continue;
            let u = O.findChild(0, O.buffer.length, t, i - c, r);
            if (u > -1)
              return new Ne(new Du(l, O, e, c), null, u);
          } else if (s & q.IncludeAnonymous || !O.type.isAnonymous || Us(O)) {
            let u;
            if (!(s & q.IgnoreMounts) && (u = Gt.get(O)) && !u.overlay)
              return new he(u.tree, c, e, l);
            let d = new he(O, c, e, l);
            return s & q.IncludeAnonymous || !d.type.isAnonymous ? d : d.nextChild(t < 0 ? O.children.length - 1 : 0, t, i, r, s);
          }
        }
      }
      if (s & q.IncludeAnonymous || !l.type.isAnonymous || (l.index >= 0 ? e = l.index + t : e = t < 0 ? -1 : l._parent._tree.children.length, l = l._parent, !l))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  prop(e) {
    return this._tree.prop(e);
  }
  enter(e, t, i = 0) {
    let r;
    if (!(i & q.IgnoreOverlays) && (r = Gt.get(this._tree)) && r.overlay) {
      let s = e - this.from, l = i & q.EnterBracketed && r.bracketed;
      for (let { from: o, to: a } of r.overlay)
        if ((t > 0 || l ? o <= s : o < s) && (t < 0 || l ? a >= s : a > s))
          return new he(r.tree, r.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, t, i);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function Kl(n, e, t, i) {
  let r = n.cursor(), s = [];
  if (!r.firstChild())
    return s;
  if (t != null) {
    for (let l = !1; !l; )
      if (l = r.type.is(t), !r.nextSibling())
        return s;
  }
  for (; ; ) {
    if (i != null && r.type.is(i))
      return s;
    if (r.type.is(e) && s.push(r.node), !r.nextSibling())
      return i == null ? s : [];
  }
}
function fs(n, e, t = e.length - 1) {
  for (let i = n; t >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (e[t] && e[t] != i.name)
        return !1;
      t--;
    }
  }
  return !0;
}
class Du {
  constructor(e, t, i, r) {
    this.parent = e, this.buffer = t, this.index = i, this.start = r;
  }
}
class Ne extends xh {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, t, i) {
    super(), this.context = e, this._parent = t, this.index = i, this.type = e.buffer.set.types[e.buffer.buffer[i]];
  }
  child(e, t, i) {
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.context.start, i);
    return s < 0 ? null : new Ne(this.context, this, s);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  prop(e) {
    return this.type.prop(e);
  }
  enter(e, t, i = 0) {
    if (i & q.ExcludeBuffers)
      return null;
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], t > 0 ? 1 : -1, e - this.context.start, t);
    return s < 0 ? null : new Ne(this.context, this, s);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, t = e.buffer[this.index + 3];
    return t < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new Ne(this.context, this._parent, t) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, t = this._parent ? this._parent.index + 4 : 0;
    return this.index == t ? this.externalSibling(-1) : new Ne(this.context, this._parent, e.findChild(
      t,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], t = [], { buffer: i } = this.context, r = this.index + 4, s = i.buffer[this.index + 3];
    if (s > r) {
      let l = i.buffer[this.index + 1];
      e.push(i.slice(r, s, l)), t.push(0);
    }
    return new N(this.type, e, t, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function kh(n) {
  if (!n.length)
    return null;
  let e = 0, t = n[0];
  for (let s = 1; s < n.length; s++) {
    let l = n[s];
    (l.from > t.from || l.to < t.to) && (t = l, e = s);
  }
  let i = t instanceof he && t.index < 0 ? null : t.parent, r = n.slice();
  return i ? r[e] = i : r.splice(e, 1), new Lu(r, t);
}
class Lu {
  constructor(e, t) {
    this.heads = e, this.node = t;
  }
  get next() {
    return kh(this.heads);
  }
}
function Bu(n, e, t) {
  let i = n.resolveInner(e, t), r = null;
  for (let s = i instanceof he ? i : i.context.parent; s; s = s.parent)
    if (s.index < 0) {
      let l = s.parent;
      (r || (r = [i])).push(l.resolve(e, t)), s = l;
    } else {
      let l = Gt.get(s.tree);
      if (l && l.overlay && l.overlay[0].from <= e && l.overlay[l.overlay.length - 1].to >= e) {
        let o = new he(l.tree, l.overlay[0].from + s.from, -1, s);
        (r || (r = [i])).push(vi(o, e, t, !1));
      }
    }
  return r ? kh(r) : i;
}
class wn {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, t = 0) {
    if (this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, this.mode = t & ~q.EnterBracketed, e instanceof he)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let i = e._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, t) {
    this.index = e;
    let { start: i, buffer: r } = this.buffer;
    return this.type = t || r.set.types[r.buffer[e]], this.from = i + r.buffer[e + 1], this.to = i + r.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof he ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, t, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, i, this.mode));
    let { buffer: r } = this.buffer, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.buffer.start, i);
    return s < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(s));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, t, i = this.mode) {
    return this.buffer ? i & q.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & q.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & q.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: t } = this.buffer, i = this.stack.length - 1;
    if (e < 0) {
      let r = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != r)
        return this.yieldBuf(t.findChild(
          r,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let r = t.buffer[this.index + 3];
      if (r < (i < 0 ? t.buffer.length : t.buffer[this.stack[i] + 3]))
        return this.yieldBuf(r);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let t, i, { buffer: r } = this;
    if (r) {
      if (e > 0) {
        if (this.index < r.buffer.buffer.length)
          return !1;
      } else
        for (let s = 0; s < this.index; s++)
          if (r.buffer.buffer[s + 3] < this.index)
            return !1;
      ({ index: t, parent: i } = r);
    } else
      ({ index: t, _parent: i } = this._tree);
    for (; i; { index: t, _parent: i } = i)
      if (t > -1)
        for (let s = t + e, l = e < 0 ? -1 : i._tree.children.length; s != l; s += e) {
          let o = i._tree.children[s];
          if (this.mode & q.IncludeAnonymous || o instanceof bt || !o.type.isAnonymous || Us(o))
            return !1;
        }
    return !0;
  }
  move(e, t) {
    if (t && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traversal. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, t = 0) {
    for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, t); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, t = null, i = 0;
    if (e && e.context == this.buffer)
      e: for (let r = this.index, s = this.stack.length; s >= 0; ) {
        for (let l = e; l; l = l._parent)
          if (l.index == r) {
            if (r == this.index)
              return l;
            t = l, i = s + 1;
            break e;
          }
        r = this.stack[--s];
      }
    for (let r = i; r < this.stack.length; r++)
      t = new Ne(this.buffer, t, this.stack[r]);
    return this.bufferNode = new Ne(this.buffer, t, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, t) {
    for (let i = 0; ; ) {
      let r = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (r = !0);
      }
      for (; ; ) {
        if (r && t && t(this), r = this.type.isAnonymous, !i)
          return;
        if (this.nextSibling())
          break;
        this.parent(), i--, r = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return fs(this.node.parent, e);
    let { buffer: t } = this.buffer, { types: i } = t.set;
    for (let r = e.length - 1, s = this.stack.length - 1; r >= 0; s--) {
      if (s < 0)
        return fs(this._tree, e, r);
      let l = i[t.buffer[this.stack[s]]];
      if (!l.isAnonymous) {
        if (e[r] && e[r] != l.name)
          return !1;
        r--;
      }
    }
    return !0;
  }
}
function Us(n) {
  return n.children.some((e) => e instanceof bt || !e.type.isAnonymous || Us(e));
}
function Iu(n) {
  var e;
  let { buffer: t, nodeSet: i, maxBufferLength: r = yh, reused: s = [], minRepeatType: l = i.types.length } = n, o = Array.isArray(t) ? new Es(t, t.length) : t, a = i.types, h = 0, O = 0;
  function c(S, x, k, M, j, U) {
    let { id: A, start: T, end: E, size: Y } = o, L = O, le = h;
    if (Y < 0)
      if (o.next(), Y == -1) {
        let et = s[A];
        k.push(et), M.push(T - S);
        return;
      } else if (Y == -3) {
        h = A;
        return;
      } else if (Y == -4) {
        O = A;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${Y}`);
    let be = a[A], Ye, te, ke = T - S;
    if (E - T <= r && (te = m(o.pos - x, j))) {
      let et = new Uint16Array(te.size - te.skip), fe = o.pos - te.size, Re = et.length;
      for (; o.pos > fe; )
        Re = $(te.start, et, Re);
      Ye = new bt(et, E - te.start, i), ke = te.start - S;
    } else {
      let et = o.pos - Y;
      o.next();
      let fe = [], Re = [], ze = A >= l ? A : -1, tt = 0, At = E, ri = L;
      for (; o.pos > et; )
        ze >= 0 && o.id == ze && o.size >= 0 ? (o.end <= At - r && (d(fe, Re, T, tt, o.end, At, ze, ri, le), tt = fe.length, At = o.end, ri = O), o.next()) : U > 2500 ? f(T, et, fe, Re) : (ze >= 0 && o.size == -1 && s[o.id].type == i.types[ze] && (tt < fe.length && d(fe, Re, T, tt, o.end, At, ze, ri, le), tt = fe.length + 1, At = o.start, ri = O), c(T, et, fe, Re, ze, U + 1));
      if (ze >= 0 && tt > 0 && tt < fe.length && d(fe, Re, T, tt, T, At, ze, ri, le), fe.reverse(), Re.reverse(), ze > -1 && tt > 0) {
        let nl = u(be, le);
        Ye = Vs(be, fe, Re, 0, fe.length, 0, E - T, nl, nl);
      } else
        Ye = p(be, fe, Re, E - T, L - E, le);
    }
    k.push(Ye), M.push(ke);
  }
  function f(S, x, k, M) {
    let j = [], U = 0, A = -1;
    for (; o.pos > x; ) {
      let { id: T, start: E, end: Y, size: L } = o;
      if (L > 4)
        o.next();
      else {
        if (A > -1 && E < A)
          break;
        A < 0 && (A = Y - r), j.push(T, E, Y), U++, o.next();
      }
    }
    if (U) {
      let T = new Uint16Array(U * 4), E = j[j.length - 2];
      for (let Y = j.length - 3, L = 0; Y >= 0; Y -= 3)
        T[L++] = j[Y], T[L++] = j[Y + 1] - E, T[L++] = j[Y + 2] - E, T[L++] = L;
      k.push(new bt(T, j[2] - E, i)), M.push(E - S);
    }
  }
  function u(S, x) {
    return (k, M, j) => {
      let U = 0, A = k.length - 1, T, E;
      if (A >= 0 && (T = k[A]) instanceof N) {
        if (!A && T.type == S && T.length == j)
          return T;
        (E = T.prop(C.lookAhead)) && (U = M[A] + T.length + E - j);
      }
      return p(S, k, M, j, U, x);
    };
  }
  function d(S, x, k, M, j, U, A, T, E) {
    let Y = [], L = [];
    for (; S.length > M; )
      Y.push(S.pop()), L.push(x.pop() + k - j);
    S.push(p(i.types[A], Y, L, U - j, T - U, E)), x.push(j - k);
  }
  function p(S, x, k, M, j, U, A) {
    if (U) {
      let T = [C.contextHash, U];
      A = A ? [T].concat(A) : [T];
    }
    if (j > 25) {
      let T = [C.lookAhead, j];
      A = A ? [T].concat(A) : [T];
    }
    return new N(S, x, k, M, A);
  }
  function m(S, x) {
    let k = o.fork(), M = 0, j = 0, U = 0, A = k.end - r, T = { size: 0, start: 0, skip: 0 };
    e: for (let E = k.pos - S; k.pos > E; ) {
      let Y = k.size;
      if (k.id == x && Y >= 0) {
        T.size = M, T.start = j, T.skip = U, U += 4, M += 4, k.next();
        continue;
      }
      let L = k.pos - Y;
      if (Y < 0 || L < E || k.start < A)
        break;
      let le = k.id >= l ? 4 : 0, be = k.start;
      for (k.next(); k.pos > L; ) {
        if (k.size < 0)
          if (k.size == -3 || k.size == -4)
            le += 4;
          else
            break e;
        else k.id >= l && (le += 4);
        k.next();
      }
      j = be, M += Y, U += le;
    }
    return (x < 0 || M == S) && (T.size = M, T.start = j, T.skip = U), T.size > 4 ? T : void 0;
  }
  function $(S, x, k) {
    let { id: M, start: j, end: U, size: A } = o;
    if (o.next(), A >= 0 && M < l) {
      let T = k;
      if (A > 4) {
        let E = o.pos - (A - 4);
        for (; o.pos > E; )
          k = $(S, x, k);
      }
      x[--k] = T, x[--k] = U - S, x[--k] = j - S, x[--k] = M;
    } else A == -3 ? h = M : A == -4 && (O = M);
    return k;
  }
  let w = [], b = [];
  for (; o.pos > 0; )
    c(n.start || 0, n.bufferStart || 0, w, b, -1, 0);
  let R = (e = n.length) !== null && e !== void 0 ? e : w.length ? b[0] + w[0].length : 0;
  return new N(a[n.topID], w.reverse(), b.reverse(), R);
}
const Jl = /* @__PURE__ */ new WeakMap();
function On(n, e) {
  if (!n.isAnonymous || e instanceof bt || e.type != n)
    return 1;
  let t = Jl.get(e);
  if (t == null) {
    t = 1;
    for (let i of e.children) {
      if (i.type != n || !(i instanceof N)) {
        t = 1;
        break;
      }
      t += On(n, i);
    }
    Jl.set(e, t);
  }
  return t;
}
function Vs(n, e, t, i, r, s, l, o, a) {
  let h = 0;
  for (let d = i; d < r; d++)
    h += On(n, e[d]);
  let O = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), c = [], f = [];
  function u(d, p, m, $, w) {
    for (let b = m; b < $; ) {
      let R = b, S = p[b], x = On(n, d[b]);
      for (b++; b < $; b++) {
        let k = On(n, d[b]);
        if (x + k >= O)
          break;
        x += k;
      }
      if (b == R + 1) {
        if (x > O) {
          let k = d[R];
          u(k.children, k.positions, 0, k.children.length, p[R] + w);
          continue;
        }
        c.push(d[R]);
      } else {
        let k = p[b - 1] + d[b - 1].length - S;
        c.push(Vs(n, d, p, R, b, S, k, null, a));
      }
      f.push(S + w - s);
    }
  }
  return u(e, t, i, r, 0), (o || a)(c, f, l);
}
class wh {
  constructor() {
    this.map = /* @__PURE__ */ new WeakMap();
  }
  setBuffer(e, t, i) {
    let r = this.map.get(e);
    r || this.map.set(e, r = /* @__PURE__ */ new Map()), r.set(t, i);
  }
  getBuffer(e, t) {
    let i = this.map.get(e);
    return i && i.get(t);
  }
  /**
  Set the value for this syntax node.
  */
  set(e, t) {
    e instanceof Ne ? this.setBuffer(e.context.buffer, e.index, t) : e instanceof he && this.map.set(e.tree, t);
  }
  /**
  Retrieve value for this syntax node, if it exists in the map.
  */
  get(e) {
    return e instanceof Ne ? this.getBuffer(e.context.buffer, e.index) : e instanceof he ? this.map.get(e.tree) : void 0;
  }
  /**
  Set the value for the node that a cursor currently points to.
  */
  cursorSet(e, t) {
    e.buffer ? this.setBuffer(e.buffer.buffer, e.index, t) : this.map.set(e.tree, t);
  }
  /**
  Retrieve the value for the node that a cursor currently points
  to.
  */
  cursorGet(e) {
    return e.buffer ? this.getBuffer(e.buffer.buffer, e.index) : this.map.get(e.tree);
  }
}
class ot {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, t, i, r, s = !1, l = !1) {
    this.from = e, this.to = t, this.tree = i, this.offset = r, this.open = (s ? 1 : 0) | (l ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, t = [], i = !1) {
    let r = [new ot(0, e.length, e, 0, !1, i)];
    for (let s of t)
      s.to > e.length && r.push(s);
    return r;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, t, i = 128) {
    if (!t.length)
      return e;
    let r = [], s = 1, l = e.length ? e[0] : null;
    for (let o = 0, a = 0, h = 0; ; o++) {
      let O = o < t.length ? t[o] : null, c = O ? O.fromA : 1e9;
      if (c - a >= i)
        for (; l && l.from < c; ) {
          let f = l;
          if (a >= f.from || c <= f.to || h) {
            let u = Math.max(f.from, a) - h, d = Math.min(f.to, c) - h;
            f = u >= d ? null : new ot(u, d, f.tree, f.offset + h, f.openStart || o > 0, f.openEnd || !!O);
          }
          if (f && r.push(f), l.to > c)
            break;
          l = s < e.length ? e[s++] : null;
        }
      if (!O)
        break;
      a = O.toA, h = O.toA - O.toB;
    }
    return r;
  }
}
class vh {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, t, i) {
    return typeof e == "string" && (e = new Nu(e)), i = i ? i.length ? i.map((r) => new Xe(r.from, r.to)) : [new Xe(0, 0)] : [new Xe(0, e.length)], this.createParse(e, t || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, t, i) {
    let r = this.startParse(e, t, i);
    for (; ; ) {
      let s = r.advance();
      if (s)
        return s;
    }
  }
}
class Nu {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, t) {
    return this.string.slice(e, t);
  }
}
function Xh(n) {
  return (e, t, i, r) => new Ku(e, n, t, i, r);
}
class eo {
  constructor(e, t, i, r, s, l) {
    this.parser = e, this.parse = t, this.overlay = i, this.bracketed = r, this.target = s, this.from = l;
  }
}
function to(n) {
  if (!n.length || n.some((e) => e.from >= e.to))
    throw new RangeError("Invalid inner parse ranges given: " + JSON.stringify(n));
}
class Fu {
  constructor(e, t, i, r, s, l, o, a) {
    this.parser = e, this.predicate = t, this.mounts = i, this.index = r, this.start = s, this.bracketed = l, this.target = o, this.prev = a, this.depth = 0, this.ranges = [];
  }
}
const Zh = new C({ perNode: !0 });
class Hu {
  constructor(e, t) {
    this.cursor = t, this.overlay = null, this.covered = null, this.fragmentCursor = new td(e);
  }
}
class Ku {
  constructor(e, t, i, r, s) {
    this.nest = t, this.input = i, this.fragments = r, this.ranges = s, this.inner = [], this.innerDone = 0, this.baseTree = null, this.scan = null, this.stoppedAt = null, this.baseParse = e;
  }
  advance() {
    if (this.baseParse) {
      let i = this.baseParse.advance();
      if (!i)
        return null;
      this.baseParse = null, this.baseTree = i, this.scan = new Hu(this.fragments, new wn(new he(i, this.ranges[0].from, 0, null), q.IncludeAnonymous | q.IgnoreMounts));
    }
    if (this.scan) {
      if (!this.scanInner())
        return null;
      if (this.scan = null, this.stoppedAt != null)
        for (let i of this.inner)
          i.parse.stopAt(this.stoppedAt);
    }
    if (this.innerDone == this.inner.length) {
      let i = this.baseTree;
      return this.stoppedAt != null && (i = new N(i.type, i.children, i.positions, i.length, i.propValues.concat([[Zh, this.stoppedAt]]))), i;
    }
    let e = this.inner[this.innerDone], t = e.parse.advance();
    if (t) {
      this.innerDone++;
      let i = Object.assign(/* @__PURE__ */ Object.create(null), e.target.props);
      i[C.mounted.id] = new Gt(t, e.overlay, e.parser, e.bracketed), e.target.props = i;
    }
    return null;
  }
  get parsedPos() {
    if (this.baseParse)
      return 0;
    let e = this.input.length;
    if (this.scan) {
      e = this.scan.cursor.from;
      for (let t = this.scan.overlay; t; t = t.prev)
        e = Math.min(e, t.start);
    }
    for (let t = this.innerDone; t < this.inner.length; t++)
      this.inner[t].from < e && (e = Math.min(e, this.inner[t].parse.parsedPos));
    return e;
  }
  stopAt(e) {
    if (this.stoppedAt = e, this.baseParse)
      this.baseParse.stopAt(e);
    else
      for (let t = this.innerDone; t < this.inner.length; t++)
        this.inner[t].parse.stopAt(e);
  }
  // Continue the walk that finds nested regions. Returns true when
  // it's done, false when it stopped to let advance() return.
  scanInner() {
    let e = this.scan, { fragmentCursor: t, cursor: i } = e, { overlay: r, covered: s } = e, l = 0;
    e: for (let o, a; ; ) {
      if (l >= 2e3)
        return e.overlay = r, e.covered = s, !1;
      l++;
      let h = !0, O;
      if (this.stoppedAt != null && i.from >= this.stoppedAt)
        h = !1;
      else if (t.hasNode(i)) {
        if (r) {
          let c = r.mounts.find((f) => f.frag.from <= i.from && f.frag.to >= i.to && f.mount.overlay);
          if (c)
            for (let f of c.mount.overlay) {
              let u = f.from + c.pos, d = f.to + c.pos;
              u >= i.from && d <= i.to && !r.ranges.some((p) => p.from < d && p.to > u) && r.ranges.push({ from: u, to: d });
            }
        }
        h = !1;
      } else if (s && (a = Ju(s.ranges, i.from, i.to)))
        h = a != 2;
      else if (!i.type.isAnonymous && (o = this.nest(i, this.input)) && (i.from < i.to || !o.overlay)) {
        i.tree || (ed(i), r && r.depth++, s && s.depth++);
        let c = t.findMounts(i.from, o.parser);
        if (typeof o.overlay == "function")
          r = new Fu(o.parser, o.overlay, c, this.inner.length, i.from, !!o.bracketed, i.tree, r);
        else {
          let f = so(this.ranges, o.overlay || (i.from < i.to ? [new Xe(i.from, i.to)] : []));
          f.length && (to(f), l += 20), (f.length || !o.overlay) && this.inner.push(new eo(o.parser, f.length ? o.parser.startParse(this.input, lo(c, f), f) : o.parser.startParse(""), o.overlay ? o.overlay.map((u) => new Xe(u.from - i.from, u.to - i.from)) : null, !!o.bracketed, i.tree, f.length ? f[0].from : i.from)), o.overlay ? f.length && (s = { ranges: f, depth: 0, prev: s }) : h = !1;
        }
      } else if (r && (O = r.predicate(i)) && (O === !0 && (O = new Xe(i.from, i.to)), O.from < O.to)) {
        let c = r.ranges.length - 1;
        c >= 0 && r.ranges[c].to == O.from ? r.ranges[c] = { from: r.ranges[c].from, to: O.to } : r.ranges.push(O);
      }
      if (h && i.firstChild())
        r && r.depth++, s && s.depth++;
      else
        for (; !i.nextSibling(); ) {
          if (!i.parent())
            break e;
          if (r && !--r.depth) {
            let c = so(this.ranges, r.ranges);
            c.length && (to(c), l += 20, this.inner.splice(r.index, 0, new eo(r.parser, r.parser.startParse(this.input, lo(r.mounts, c), c), r.ranges.map((f) => new Xe(f.from - r.start, f.to - r.start)), r.bracketed, r.target, c[0].from))), r = r.prev;
          }
          s && !--s.depth && (s = s.prev);
        }
    }
    return !0;
  }
}
function Ju(n, e, t) {
  for (let i of n) {
    if (i.from >= t)
      break;
    if (i.to > e)
      return i.from <= e && i.to >= t ? 2 : 1;
  }
  return 0;
}
function io(n, e, t, i, r, s) {
  if (e < t) {
    let l = n.buffer[e + 1];
    i.push(n.slice(e, t, l)), r.push(l - s);
  }
}
function ed(n) {
  let { node: e } = n, t = [], i = e.context.buffer;
  do
    t.push(n.index), n.parent();
  while (!n.tree);
  let r = n.tree, s = r.children.indexOf(i), l = r.children[s], o = l.buffer, a = [s];
  function h(O, c, f, u, d, p) {
    let m = t[p], $ = [], w = [];
    io(l, O, m, $, w, u);
    let b = o[m + 1], R = o[m + 2];
    a.push($.length);
    let S = p ? h(m + 4, o[m + 3], l.set.types[o[m]], b, R - b, p - 1) : e.toTree();
    return $.push(S), w.push(b - u), io(l, o[m + 3], c, $, w, u), new N(f, $, w, d);
  }
  r.children[s] = h(0, o.length, me.none, 0, l.length, t.length - 1);
  for (let O of a) {
    let c = n.tree.children[O], f = n.tree.positions[O];
    n.yield(new he(c, f + n.from, O, n._tree));
  }
}
class no {
  constructor(e, t) {
    this.offset = t, this.done = !1, this.cursor = e.cursor(q.IncludeAnonymous | q.IgnoreMounts | q.ExcludeBuffers);
  }
  // Move to the first node (in pre-order) that starts at or after `pos`.
  moveTo(e) {
    let { cursor: t } = this, i = e - this.offset;
    for (; !this.done && t.from < i; )
      if (!(t.to >= i && t.enter(i, 1, q.IncludeAnonymous | q.IgnoreMounts | q.IgnoreOverlays | q.ExcludeBuffers))) if (t.to <= i)
        t.next(!1) || (this.done = !0);
      else
        break;
  }
  hasNode(e) {
    if (this.moveTo(e.from), !this.done && this.cursor.from + this.offset == e.from && this.cursor.tree)
      for (let t = this.cursor.tree; ; ) {
        if (t == e.tree)
          return !0;
        if (t.children.length && t.positions[0] == 0 && t.children[0] instanceof N)
          t = t.children[0];
        else
          break;
      }
    return !1;
  }
}
function ro(n) {
  let e = n.tree.prop(Zh);
  return e == null ? n.to : Math.min(n.to, e - n.offset);
}
let td = class {
  constructor(e) {
    if (this.fragments = e, this.curTo = 0, this.fragI = 0, e.length) {
      let t = this.curFrag = e[0];
      this.curTo = ro(t), this.inner = new no(t.tree, -t.offset);
    } else
      this.curFrag = this.inner = null;
  }
  hasNode(e) {
    for (; this.curFrag && e.from >= this.curTo; )
      this.nextFrag();
    return this.curFrag && this.curFrag.from <= e.from && this.curTo >= e.to && this.inner.hasNode(e);
  }
  nextFrag() {
    if (this.fragI++, this.fragI == this.fragments.length)
      this.curFrag = this.inner = null;
    else {
      let e = this.curFrag = this.fragments[this.fragI];
      this.curTo = ro(e), this.inner = new no(e.tree, -e.offset);
    }
  }
  findMounts(e, t) {
    var i;
    let r = [];
    if (this.inner) {
      this.inner.cursor.moveTo(e, 1);
      for (let s = this.inner.cursor.node; s; s = s.parent) {
        let l = (i = s.tree) === null || i === void 0 ? void 0 : i.prop(C.mounted);
        if (l && l.parser == t)
          for (let o = this.fragI; o < this.fragments.length; o++) {
            let a = this.fragments[o];
            if (a.from >= s.to)
              break;
            a.tree == this.curFrag.tree && r.push({
              frag: a,
              pos: s.from - a.offset,
              mount: l
            });
          }
      }
    }
    return r;
  }
};
function so(n, e) {
  let t = null, i = e;
  for (let r = 1, s = 0; r < n.length; r++) {
    let l = n[r - 1].to, o = n[r].from;
    for (; s < i.length; s++) {
      let a = i[s];
      if (a.from >= o)
        break;
      a.to <= l || (t || (i = t = e.slice()), a.from < l ? (t[s] = new Xe(a.from, l), a.to > o && t.splice(s + 1, 0, new Xe(o, a.to))) : a.to > o ? t[s--] = new Xe(o, a.to) : t.splice(s--, 1));
    }
  }
  return i;
}
function id(n, e, t, i) {
  let r = 0, s = 0, l = !1, o = !1, a = -1e9, h = [];
  for (; ; ) {
    let O = r == n.length ? 1e9 : l ? n[r].to : n[r].from, c = s == e.length ? 1e9 : o ? e[s].to : e[s].from;
    if (l != o) {
      let f = Math.max(a, t), u = Math.min(O, c, i);
      f < u && h.push(new Xe(f, u));
    }
    if (a = Math.min(O, c), a == 1e9)
      break;
    O == a && (l ? (l = !1, r++) : l = !0), c == a && (o ? (o = !1, s++) : o = !0);
  }
  return h;
}
function lo(n, e) {
  let t = [];
  for (let { pos: i, mount: r, frag: s } of n) {
    let l = i + (r.overlay ? r.overlay[0].from : 0), o = l + r.tree.length, a = Math.max(s.from, l), h = Math.min(s.to, o);
    if (r.overlay) {
      let O = r.overlay.map((f) => new Xe(f.from + i, f.to + i)), c = id(e, O, a, h);
      for (let f = 0, u = a; ; f++) {
        let d = f == c.length, p = d ? h : c[f].from;
        if (p > u && t.push(new ot(u, p, r.tree, -l, s.from >= u || s.openStart, s.to <= p || s.openEnd)), d)
          break;
        u = c[f].to;
      }
    } else
      t.push(new ot(a, h, r.tree, -l, s.from >= l || s.openStart, s.to <= o || s.openEnd));
  }
  return t;
}
let nd = 0;
class we {
  /**
  @internal
  */
  constructor(e, t, i, r) {
    this.name = e, this.set = t, this.base = i, this.modified = r, this.id = nd++;
  }
  toString() {
    let { name: e } = this;
    for (let t of this.modified)
      t.name && (e = `${t.name}(${e})`);
    return e;
  }
  static define(e, t) {
    let i = typeof e == "string" ? e : "?";
    if (e instanceof we && (t = e), t?.base)
      throw new Error("Can not derive from a modified tag");
    let r = new we(i, [], null, []);
    if (r.set.push(r), t)
      for (let s of t.set)
        r.set.push(s);
    return r;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier(e) {
    let t = new vn(e);
    return (i) => i.modified.indexOf(t) > -1 ? i : vn.get(i.base || i, i.modified.concat(t).sort((r, s) => r.id - s.id));
  }
}
let rd = 0;
class vn {
  constructor(e) {
    this.name = e, this.instances = [], this.id = rd++;
  }
  static get(e, t) {
    if (!t.length)
      return e;
    let i = t[0].instances.find((o) => o.base == e && sd(t, o.modified));
    if (i)
      return i;
    let r = [], s = new we(e.name, r, e, t);
    for (let o of t)
      o.instances.push(s);
    let l = ld(t);
    for (let o of e.set)
      if (!o.modified.length)
        for (let a of l)
          r.push(vn.get(o, a));
    return s;
  }
}
function sd(n, e) {
  return n.length == e.length && n.every((t, i) => t == e[i]);
}
function ld(n) {
  let e = [[]];
  for (let t = 0; t < n.length; t++)
    for (let i = 0, r = e.length; i < r; i++)
      e.push(e[i].concat(n[t]));
  return e.sort((t, i) => i.length - t.length);
}
function _i(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let i = n[t];
    Array.isArray(i) || (i = [i]);
    for (let r of t.split(" "))
      if (r) {
        let s = [], l = 2, o = r;
        for (let c = 0; ; ) {
          if (o == "..." && c > 0 && c + 3 == r.length) {
            l = 1;
            break;
          }
          let f = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(o);
          if (!f)
            throw new RangeError("Invalid path: " + r);
          if (s.push(f[0] == "*" ? "" : f[0][0] == '"' ? JSON.parse(f[0]) : f[0]), c += f[0].length, c == r.length)
            break;
          let u = r[c++];
          if (c == r.length && u == "!") {
            l = 0;
            break;
          }
          if (u != "/")
            throw new RangeError("Invalid path: " + r);
          o = r.slice(c);
        }
        let a = s.length - 1, h = s[a];
        if (!h)
          throw new RangeError("Invalid path: " + r);
        let O = new Xi(i, l, a > 0 ? s.slice(0, a) : null);
        e[h] = O.sort(e[h]);
      }
  }
  return Th.add(e);
}
const Th = new C({
  combine(n, e) {
    let t, i, r;
    for (; n || e; ) {
      if (!n || e && n.depth <= e.depth ? (r = e, e = e.next) : (r = n, n = n.next), t && t.mode == r.mode && !r.context && !t.context)
        continue;
      let s = new Xi(r.tags, r.mode, r.context);
      t ? t.next = s : i = s, t = s;
    }
    return i;
  }
});
class Xi {
  constructor(e, t, i, r) {
    this.tags = e, this.mode = t, this.context = i, this.next = r;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
Xi.empty = new Xi([], 2, null);
function Rh(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let s of n)
    if (!Array.isArray(s.tag))
      t[s.tag.id] = s.class;
    else
      for (let l of s.tag)
        t[l.id] = s.class;
  let { scope: i, all: r = null } = e || {};
  return {
    style: (s) => {
      let l = r;
      for (let o of s)
        for (let a of o.set) {
          let h = t[a.id];
          if (h) {
            l = l ? l + " " + h : h;
            break;
          }
        }
      return l;
    },
    scope: i
  };
}
function od(n, e) {
  let t = null;
  for (let i of n) {
    let r = i.style(e);
    r && (t = t ? t + " " + r : r);
  }
  return t;
}
function ad(n, e, t, i = 0, r = n.length) {
  let s = new hd(i, Array.isArray(e) ? e : [e], t);
  s.highlightRange(n.cursor(), i, r, "", s.highlighters), s.flush(r);
}
class hd {
  constructor(e, t, i) {
    this.at = e, this.highlighters = t, this.span = i, this.class = "";
  }
  startSpan(e, t) {
    t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, t, i, r, s) {
    let { type: l, from: o, to: a } = e;
    if (o >= i || a <= t)
      return;
    l.isTop && (s = this.highlighters.filter((u) => !u.scope || u.scope(l)));
    let h = r, O = Od(e) || Xi.empty, c = od(s, O.tags);
    if (c && (h && (h += " "), h += c, O.mode == 1 && (r += (r ? " " : "") + c)), this.startSpan(Math.max(t, o), h), O.opaque)
      return;
    let f = e.tree && e.tree.prop(C.mounted);
    if (f && f.overlay) {
      let u = e.node.enter(f.overlay[0].from + o, 1), d = this.highlighters.filter((m) => !m.scope || m.scope(f.tree.type)), p = e.firstChild();
      for (let m = 0, $ = o; ; m++) {
        let w = m < f.overlay.length ? f.overlay[m] : null, b = w ? w.from + o : a, R = Math.max(t, $), S = Math.min(i, b);
        if (R < S && p)
          for (; e.from < S && (this.highlightRange(e, R, S, r, s), this.startSpan(Math.min(S, e.to), h), !(e.to >= b || !e.nextSibling())); )
            ;
        if (!w || b > i)
          break;
        $ = w.to + o, $ > t && (this.highlightRange(u.cursor(), Math.max(t, w.from + o), Math.min(i, $), "", d), this.startSpan(Math.min(i, $), h));
      }
      p && e.parent();
    } else if (e.firstChild()) {
      f && (r = "");
      do
        if (!(e.to <= t)) {
          if (e.from >= i)
            break;
          this.highlightRange(e, t, i, r, s), this.startSpan(Math.min(i, e.to), h);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function Od(n) {
  let e = n.type.prop(Th);
  for (; e && e.context && !n.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const y = we.define, Ji = y(), ct = y(), oo = y(ct), ao = y(ct), ft = y(), en = y(ft), dr = y(ft), Ge = y(), Pt = y(Ge), Ue = y(), Ve = y(), us = y(), oi = y(us), tn = y(), g = {
  /**
  A comment.
  */
  comment: Ji,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: y(Ji),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: y(Ji),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: y(Ji),
  /**
  Any kind of identifier.
  */
  name: ct,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: y(ct),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: oo,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: y(oo),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: ao,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: y(ao),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: y(ct),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: y(ct),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: y(ct),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: y(ct),
  /**
  A literal value.
  */
  literal: ft,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: en,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: y(en),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: y(en),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: y(en),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: dr,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: y(dr),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: y(dr),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: y(ft),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: y(ft),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: y(ft),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: y(ft),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: y(ft),
  /**
  A language keyword.
  */
  keyword: Ue,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: y(Ue),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: y(Ue),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: y(Ue),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: y(Ue),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: y(Ue),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: y(Ue),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: y(Ue),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: y(Ue),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: y(Ue),
  /**
  An operator.
  */
  operator: Ve,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: y(Ve),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: y(Ve),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: y(Ve),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: y(Ve),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: y(Ve),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: y(Ve),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: y(Ve),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: y(Ve),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: y(Ve),
  /**
  Program or markup punctuation.
  */
  punctuation: us,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: y(us),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: oi,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: y(oi),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: y(oi),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: y(oi),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: y(oi),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: Ge,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: Pt,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: y(Pt),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: y(Pt),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: y(Pt),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: y(Pt),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: y(Pt),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: y(Pt),
  /**
  A prose [content](#highlight.tags.content) separator (such as a horizontal rule).
  */
  contentSeparator: y(Ge),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: y(Ge),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: y(Ge),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: y(Ge),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: y(Ge),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: y(Ge),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: y(Ge),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: y(Ge),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: y(),
  /**
  Deleted text.
  */
  deleted: y(),
  /**
  Changed text.
  */
  changed: y(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: y(),
  /**
  Metadata or meta-instruction.
  */
  meta: tn,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: y(tn),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: y(tn),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: y(tn),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: we.defineModifier("definition"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: we.defineModifier("constant"),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: we.defineModifier("function"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: we.defineModifier("standard"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: we.defineModifier("local"),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: we.defineModifier("special")
};
for (let n in g) {
  let e = g[n];
  e instanceof we && (e.name = n);
}
Rh([
  { tag: g.link, class: "tok-link" },
  { tag: g.heading, class: "tok-heading" },
  { tag: g.emphasis, class: "tok-emphasis" },
  { tag: g.strong, class: "tok-strong" },
  { tag: g.keyword, class: "tok-keyword" },
  { tag: g.atom, class: "tok-atom" },
  { tag: g.bool, class: "tok-bool" },
  { tag: g.url, class: "tok-url" },
  { tag: g.labelName, class: "tok-labelName" },
  { tag: g.inserted, class: "tok-inserted" },
  { tag: g.deleted, class: "tok-deleted" },
  { tag: g.literal, class: "tok-literal" },
  { tag: g.string, class: "tok-string" },
  { tag: g.number, class: "tok-number" },
  { tag: [g.regexp, g.escape, g.special(g.string)], class: "tok-string2" },
  { tag: g.variableName, class: "tok-variableName" },
  { tag: g.local(g.variableName), class: "tok-variableName tok-local" },
  { tag: g.definition(g.variableName), class: "tok-variableName tok-definition" },
  { tag: g.special(g.variableName), class: "tok-variableName2" },
  { tag: g.definition(g.propertyName), class: "tok-propertyName tok-definition" },
  { tag: g.typeName, class: "tok-typeName" },
  { tag: g.namespace, class: "tok-namespace" },
  { tag: g.className, class: "tok-className" },
  { tag: g.macroName, class: "tok-macroName" },
  { tag: g.propertyName, class: "tok-propertyName" },
  { tag: g.operator, class: "tok-operator" },
  { tag: g.comment, class: "tok-comment" },
  { tag: g.meta, class: "tok-meta" },
  { tag: g.invalid, class: "tok-invalid" },
  { tag: g.punctuation, class: "tok-punctuation" }
]);
var pr;
const qt = /* @__PURE__ */ new C();
function Ch(n) {
  return v.define({
    combine: n ? (e) => e.concat(n) : void 0
  });
}
const Gs = /* @__PURE__ */ new C();
class je {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, t, i = [], r = "") {
    this.data = e, this.name = r, z.prototype.hasOwnProperty("tree") || Object.defineProperty(z.prototype, "tree", { get() {
      return se(this);
    } }), this.parser = t, this.extension = [
      ei.of(this),
      z.languageData.of((s, l, o) => {
        let a = ho(s, l, o), h = a.type.prop(qt);
        if (!h)
          return [];
        let O = s.facet(h), c = a.type.prop(Gs);
        if (c) {
          let f = a.resolve(l - a.from, o);
          for (let u of c)
            if (u.test(f, s)) {
              let d = s.facet(u.facet);
              return u.type == "replace" ? d : d.concat(O);
            }
        }
        return O;
      })
    ].concat(i);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, t, i = -1) {
    return ho(e, t, i).type.prop(qt) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let t = e.facet(ei);
    if (t?.data == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!t || !t.allowsNesting)
      return [];
    let i = [], r = (s, l) => {
      if (s.prop(qt) == this.data) {
        i.push({ from: l, to: l + s.length });
        return;
      }
      let o = s.prop(C.mounted);
      if (o) {
        if (o.tree.prop(qt) == this.data) {
          if (o.overlay)
            for (let a of o.overlay)
              i.push({ from: a.from + l, to: a.to + l });
          else
            i.push({ from: l, to: l + s.length });
          return;
        } else if (o.overlay) {
          let a = i.length;
          if (r(o.tree, o.overlay[0].from + l), i.length > a)
            return;
        }
      }
      for (let a = 0; a < s.children.length; a++) {
        let h = s.children[a];
        h instanceof N && r(h, s.positions[a] + l);
      }
    };
    return r(se(e), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
je.setState = /* @__PURE__ */ I.define();
function ho(n, e, t) {
  let i = n.facet(ei), r = se(n).topNode;
  if (!i || i.allowsNesting)
    for (let s = r; s; s = s.enter(e, t, q.ExcludeBuffers | q.EnterBracketed))
      s.type.isTop && (r = s);
  return r;
}
class Tt extends je {
  constructor(e, t, i) {
    super(e, t, [], i), this.parser = t;
  }
  /**
  Define a language from a parser.
  */
  static define(e) {
    let t = Ch(e.languageData);
    return new Tt(t, e.parser.configure({
      props: [qt.add((i) => i.isTop ? t : void 0)]
    }), e.name);
  }
  /**
  Create a new instance of this language with a reconfigured
  version of its parser and optionally a new name.
  */
  configure(e, t) {
    return new Tt(this.data, this.parser.configure(e), t || this.name);
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function se(n) {
  let e = n.field(je.state, !1);
  return e ? e.tree : N.empty;
}
class cd {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, t) {
    let i = this.cursorPos - this.string.length;
    return e < i || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - i, t - i);
  }
}
let ai = null;
class Xn {
  constructor(e, t, i = [], r, s, l, o, a) {
    this.parser = e, this.state = t, this.fragments = i, this.tree = r, this.treeLen = s, this.viewport = l, this.skipped = o, this.scheduleOn = a, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Xn(e, t, [], N.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new cd(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, t) {
    return t != null && t >= this.state.doc.length && (t = void 0), this.tree != N.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof e == "number") {
        let r = Date.now() + e;
        e = () => Date.now() > r;
      }
      for (this.parse || (this.parse = this.startParse()), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t); ; ) {
        let r = this.parse.advance();
        if (r)
          if (this.fragments = this.withoutTempSkipped(ot.addTree(r, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = r, this.parse = null, this.treeLen < (t ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, t;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(t = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(ot.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let t = ai;
    ai = this;
    try {
      return e();
    } finally {
      ai = t;
    }
  }
  withoutTempSkipped(e) {
    for (let t; t = this.tempSkipped.pop(); )
      e = Oo(e, t.from, t.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, t) {
    let { fragments: i, tree: r, treeLen: s, viewport: l, skipped: o } = this;
    if (this.takeTree(), !e.empty) {
      let a = [];
      if (e.iterChangedRanges((h, O, c, f) => a.push({ fromA: h, toA: O, fromB: c, toB: f })), i = ot.applyChanges(i, a), r = N.empty, s = 0, l = { from: e.mapPos(l.from, -1), to: e.mapPos(l.to, 1) }, this.skipped.length) {
        o = [];
        for (let h of this.skipped) {
          let O = e.mapPos(h.from, 1), c = e.mapPos(h.to, -1);
          O < c && o.push({ from: O, to: c });
        }
      }
    }
    return new Xn(this.parser, t, i, r, s, l, o, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let t = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: r, to: s } = this.skipped[i];
      r < e.to && s > e.from && (this.fragments = Oo(this.fragments, r, s), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= t ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, t) {
    this.skipped.push({ from: e, to: t });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends vh {
      createParse(t, i, r) {
        let s = r[0].from, l = r[r.length - 1].to;
        return {
          parsedPos: s,
          advance() {
            let a = ai;
            if (a) {
              for (let h of r)
                a.tempSkipped.push(h);
              e && (a.scheduleOn = a.scheduleOn ? Promise.all([a.scheduleOn, e]) : e);
            }
            return this.parsedPos = l, new N(me.none, [], [], l - s);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let t = this.fragments;
    return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return ai;
  }
}
function Oo(n, e, t) {
  return ot.applyChanges(n, [{ fromA: e, toA: t, fromB: e, toB: t }]);
}
class Jt {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let t = this.context.changes(e.changes, e.state), i = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
    return t.work(20, i) || t.takeTree(), new Jt(t);
  }
  static init(e) {
    let t = Math.min(3e3, e.doc.length), i = Xn.create(e.facet(ei).parser, e, { from: 0, to: t });
    return i.work(20, t) || i.takeTree(), new Jt(i);
  }
}
je.state = /* @__PURE__ */ ht.define({
  create: Jt.init,
  update(n, e) {
    for (let t of e.effects)
      if (t.is(je.setState))
        return t.value;
    return e.startState.facet(ei) != e.state.facet(ei) ? Jt.init(e.state) : n.apply(e);
  }
});
let Ah = (n) => {
  let e = setTimeout(
    () => n(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (Ah = (n) => {
  let e = -1, t = setTimeout(
    () => {
      e = requestIdleCallback(n, {
        timeout: 400
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(t) : cancelIdleCallback(e);
});
const gr = typeof navigator < "u" && (!((pr = navigator.scheduling) === null || pr === void 0) && pr.isInputPending) ? () => navigator.scheduling.isInputPending() : null, fd = /* @__PURE__ */ We.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let t = this.view.state.field(je.state).context;
    (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, t = e.field(je.state);
    (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = Ah(this.work));
  }
  work(e) {
    this.working = null;
    let t = Date.now();
    if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: r } } = this.view, s = i.field(je.state);
    if (s.tree == s.context.tree && s.context.isDone(
      r + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let l = Date.now() + Math.min(this.chunkBudget, 100, e && !gr ? Math.max(25, e.timeRemaining() - 5) : 1e9), o = s.context.treeLen < r && i.doc.length > r + 1e3, a = s.context.work(() => gr && gr() || Date.now() > l, r + (o ? 0 : 1e5));
    this.chunkBudget -= Date.now() - t, (a || this.chunkBudget <= 0) && (s.context.takeTree(), this.view.dispatch({ effects: je.setState.of(new Jt(s.context)) })), this.chunkBudget > 0 && !(a && !o) && this.scheduleWork(), this.checkAsyncSchedule(s.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((t) => Ie(this.view.state, t)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), ei = /* @__PURE__ */ v.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    je.state,
    fd,
    Z.contentAttributes.compute([n], (e) => {
      let t = e.facet(n);
      return t && t.name ? { "data-language": t.name } : {};
    })
  ]
});
class Ln {
  /**
  Create a language support object.
  */
  constructor(e, t = []) {
    this.language = e, this.support = t, this.extension = [e, t];
  }
}
const ud = /* @__PURE__ */ v.define(), Bn = /* @__PURE__ */ v.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let e = n[0];
    if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return e;
  }
});
function Zn(n) {
  let e = n.facet(Bn);
  return e.charCodeAt(0) == 9 ? n.tabSize * e.length : e.length;
}
function Tn(n, e) {
  let t = "", i = n.tabSize, r = n.facet(Bn)[0];
  if (r == "	") {
    for (; e >= i; )
      t += "	", e -= i;
    r = " ";
  }
  for (let s = 0; s < e; s++)
    t += r;
  return t;
}
function jh(n, e) {
  n instanceof z && (n = new In(n));
  for (let i of n.state.facet(ud)) {
    let r = i(n, e);
    if (r !== void 0)
      return r;
  }
  let t = se(n.state);
  return t.length >= e ? dd(n, t, e) : null;
}
class In {
  /**
  Create an indent context.
  */
  constructor(e, t = {}) {
    this.state = e, this.options = t, this.unit = Zn(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, t = 1) {
    let i = this.state.doc.lineAt(e), { simulateBreak: r, simulateDoubleBreak: s } = this.options;
    return r != null && r >= i.from && r <= i.to ? s && r == e ? { text: "", from: e } : (t < 0 ? r < e : r <= e) ? { text: i.text.slice(r - i.from), from: r } : { text: i.text.slice(0, r - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, t = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: i, from: r } = this.lineAt(e, t);
    return i.slice(e - r, Math.min(i.length, e + 100 - r));
  }
  /**
  Find the column for the given position.
  */
  column(e, t = 1) {
    let { text: i, from: r } = this.lineAt(e, t), s = this.countColumn(i, e - r), l = this.options.overrideIndentation ? this.options.overrideIndentation(r) : -1;
    return l > -1 && (s += l - this.countColumn(i, i.search(/\S|$/))), s;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, t = e.length) {
    return zn(e, this.state.tabSize, t);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, t = 1) {
    let { text: i, from: r } = this.lineAt(e, t), s = this.options.overrideIndentation;
    if (s) {
      let l = s(r);
      if (l > -1)
        return l;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Mi = /* @__PURE__ */ new C();
function dd(n, e, t) {
  let i = e.resolveStack(t), r = e.resolveInner(t, -1).resolve(t, 0).enterUnfinishedNodesBefore(t);
  if (r != i.node) {
    let s = [];
    for (let l = r; l && !(l.from < i.node.from || l.to > i.node.to || l.from == i.node.from && l.type == i.node.type); l = l.parent)
      s.push(l);
    for (let l = s.length - 1; l >= 0; l--)
      i = { node: s[l], next: i };
  }
  return Wh(i, n, t);
}
function Wh(n, e, t) {
  for (let i = n; i; i = i.next) {
    let r = gd(i.node);
    if (r)
      return r(Ds.create(e, t, i));
  }
  return 0;
}
function pd(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function gd(n) {
  let e = n.type.prop(Mi);
  if (e)
    return e;
  let t = n.firstChild, i;
  if (t && (i = t.type.prop(C.closedBy))) {
    let r = n.lastChild, s = r && i.indexOf(r.name) > -1;
    return (l) => Mh(l, !0, 1, void 0, s && !pd(l) ? r.from : void 0);
  }
  return n.parent == null ? md : null;
}
function md() {
  return 0;
}
class Ds extends In {
  constructor(e, t, i) {
    super(e.state, e.options), this.base = e, this.pos = t, this.context = i;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Ds(e, t, i);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let t = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let i = e.resolve(t.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if ($d(i, e))
        break;
      t = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(t.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return Wh(this.context.next, this.base, this.pos);
  }
}
function $d(n, e) {
  for (let t = e; t; t = t.parent)
    if (n == t)
      return !0;
  return !1;
}
function Qd(n) {
  let e = n.node, t = e.childAfter(e.from), i = e.lastChild;
  if (!t)
    return null;
  let r = n.options.simulateBreak, s = n.state.doc.lineAt(t.from), l = r == null || r <= s.from ? s.to : Math.min(s.to, r);
  for (let o = t.to; ; ) {
    let a = e.childAfter(o);
    if (!a || a == i)
      return null;
    if (!a.type.isSkipped) {
      if (a.from >= l)
        return null;
      let h = /^ */.exec(s.text.slice(t.to - s.from))[0].length;
      return { from: t.from, to: t.to + h };
    }
    o = a.to;
  }
}
function _h({ closing: n, align: e = !0, units: t = 1 }) {
  return (i) => Mh(i, e, t, n);
}
function Mh(n, e, t, i, r) {
  let s = n.textAfter, l = s.match(/^\s*/)[0].length, o = i && s.slice(l, l + i.length) == i || r == n.pos + l, a = e ? Qd(n) : null;
  return a ? o ? n.column(a.from) : n.column(a.to) : n.baseIndent + (o ? 0 : n.unit * t);
}
const Sd = (n) => n.baseIndent;
function cn({ except: n, units: e = 1 } = {}) {
  return (t) => {
    let i = n && n.test(t.textAfter);
    return t.baseIndent + (i ? 0 : e * t.unit);
  };
}
const Nn = /* @__PURE__ */ new C();
function qh(n) {
  let e = n.firstChild, t = n.lastChild;
  return e && e.to < t.from ? { from: e.to, to: t.type.isError ? n.to : t.from } : null;
}
class Fn {
  constructor(e, t) {
    this.specs = e;
    let i;
    function r(o) {
      let a = mt.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + a] = o, a;
    }
    const s = typeof t.all == "string" ? t.all : t.all ? r(t.all) : void 0, l = t.scope;
    this.scope = l instanceof je ? (o) => o.prop(qt) == l.data : l ? (o) => o == l : void 0, this.style = Rh(e.map((o) => ({
      tag: o.tag,
      class: o.class || r(Object.assign({}, o, { tag: null }))
    })), {
      all: s
    }).style, this.module = i ? new mt(i) : null, this.themeType = t.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://code.haverbeke.berlin/marijn/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, t) {
    return new Fn(e, t || {});
  }
}
const ds = /* @__PURE__ */ v.define(), bd = /* @__PURE__ */ v.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function mr(n) {
  let e = n.facet(ds);
  return e.length ? e : n.facet(bd);
}
function yd(n, e) {
  let t = [xd], i;
  return n instanceof Fn && (n.module && t.push(Z.styleModule.of(n.module)), i = n.themeType), i ? t.push(ds.computeN([Z.darkTheme], (r) => r.facet(Z.darkTheme) == (i == "dark") ? [n] : [])) : t.push(ds.of(n)), t;
}
class Pd {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = se(e.state), this.decorations = this.buildDeco(e, mr(e.state)), this.decoratedTo = e.viewport.to;
  }
  update(e) {
    let t = se(e.state), i = mr(e.state), r = i != mr(e.startState), { viewport: s } = e.view, l = e.changes.mapPos(this.decoratedTo, 1);
    t.length < s.to && !r && t.type == this.tree.type && l >= s.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = l) : (t != this.tree || e.viewportChanged || r) && (this.tree = t, this.decorations = this.buildDeco(e.view, i), this.decoratedTo = s.to);
  }
  buildDeco(e, t) {
    if (!t || !this.tree.length)
      return G.none;
    let i = new zt();
    for (let { from: r, to: s } of e.visibleRanges)
      ad(this.tree, t, (l, o, a) => {
        i.add(l, o, this.markCache[a] || (this.markCache[a] = G.mark({ class: a })));
      }, r, s);
    return i.finish();
  }
}
const xd = /* @__PURE__ */ Ri.high(/* @__PURE__ */ We.fromClass(Pd, {
  decorations: (n) => n.decorations
})), kd = /* @__PURE__ */ Z.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), Yh = 1e4, zh = "()[]{}", Eh = /* @__PURE__ */ v.define({
  combine(n) {
    return Yn(n, {
      afterCursor: !0,
      brackets: zh,
      maxScanDistance: Yh,
      renderMatch: Xd
    });
  }
}), wd = /* @__PURE__ */ G.mark({ class: "cm-matchingBracket" }), vd = /* @__PURE__ */ G.mark({ class: "cm-nonmatchingBracket" });
function Xd(n) {
  let e = [], t = n.matched ? wd : vd;
  return e.push(t.range(n.start.from, n.start.to)), n.end && e.push(t.range(n.end.from, n.end.to)), e;
}
function co(n) {
  let e = [], t = n.facet(Eh);
  for (let i of n.selection.ranges) {
    if (!i.empty)
      continue;
    let r = Fe(n, i.head, -1, t) || i.head > 0 && Fe(n, i.head - 1, 1, t) || t.afterCursor && (Fe(n, i.head, 1, t) || i.head < n.doc.length && Fe(n, i.head + 1, -1, t));
    r && (e = e.concat(t.renderMatch(r, n)));
  }
  return G.set(e, !0);
}
const Zd = /* @__PURE__ */ We.fromClass(class {
  constructor(n) {
    this.paused = !1, this.decorations = co(n.state);
  }
  update(n) {
    (n.docChanged || n.selectionSet || this.paused) && (n.view.composing ? (this.decorations = this.decorations.map(n.changes), this.paused = !0) : (this.decorations = co(n.state), this.paused = !1));
  }
}, {
  decorations: (n) => n.decorations
}), Td = [
  Zd,
  kd
];
function Rd(n = {}) {
  return [Eh.of(n), Td];
}
const Uh = /* @__PURE__ */ new C();
function ps(n, e, t) {
  let i = n.prop(e < 0 ? C.openedBy : C.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let r = t.indexOf(n.name);
    if (r > -1 && r % 2 == (e < 0 ? 1 : 0))
      return [t[r + e]];
  }
  return null;
}
function gs(n) {
  let e = n.type.prop(Uh);
  return e ? e(n.node) : n;
}
function Fe(n, e, t, i = {}) {
  let r = i.maxScanDistance || Yh, s = i.brackets || zh, l = se(n), o = l.resolveInner(e, t);
  for (let a = o; a; a = a.parent) {
    let h = ps(a.type, t, s);
    if (h && a.from < a.to) {
      let O = gs(a);
      if (O && (t > 0 ? e >= O.from && e < O.to : e > O.from && e <= O.to))
        return Cd(n, e, t, a, O, h, s);
    }
  }
  return Ad(n, e, t, l, o.type, r, s);
}
function Cd(n, e, t, i, r, s, l) {
  let o = i.parent, a = { from: r.from, to: r.to }, h = 0, O = o?.cursor();
  if (O && (t < 0 ? O.childBefore(i.from) : O.childAfter(i.to)))
    do
      if (t < 0 ? O.to <= i.from : O.from >= i.to) {
        if (h == 0 && s.indexOf(O.type.name) > -1 && O.from < O.to) {
          let c = gs(O);
          return { start: a, end: c ? { from: c.from, to: c.to } : void 0, matched: !0 };
        } else if (ps(O.type, t, l))
          h++;
        else if (ps(O.type, -t, l)) {
          if (h == 0) {
            let c = gs(O);
            return {
              start: a,
              end: c && c.from < c.to ? { from: c.from, to: c.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (t < 0 ? O.prevSibling() : O.nextSibling());
  return { start: a, matched: !1 };
}
function Ad(n, e, t, i, r, s, l) {
  if (t < 0 ? !e : e == n.doc.length)
    return null;
  let o = t < 0 ? n.sliceDoc(e - 1, e) : n.sliceDoc(e, e + 1), a = l.indexOf(o);
  if (a < 0 || a % 2 == 0 != t > 0)
    return null;
  let h = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e }, O = n.doc.iterRange(e, t > 0 ? n.doc.length : 0), c = 0;
  for (let f = 0; !O.next().done && f <= s; ) {
    let u = O.value;
    t < 0 && (f += u.length);
    let d = e + f * t;
    for (let p = t > 0 ? 0 : u.length - 1, m = t > 0 ? u.length : -1; p != m; p += t) {
      let $ = l.indexOf(u[p]);
      if (!($ < 0 || i.resolveInner(d + p, 1).type != r))
        if ($ % 2 == 0 == t > 0)
          c++;
        else {
          if (c == 1)
            return { start: h, end: { from: d + p, to: d + p + 1 }, matched: $ >> 1 == a >> 1 };
          c--;
        }
    }
    t > 0 && (f += u.length);
  }
  return O.done ? { start: h, matched: !1 } : null;
}
const jd = /* @__PURE__ */ Object.create(null), fo = [me.none], uo = [], po = /* @__PURE__ */ Object.create(null), Wd = /* @__PURE__ */ Object.create(null);
for (let [n, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  Wd[n] = /* @__PURE__ */ _d(jd, e);
function $r(n, e) {
  uo.indexOf(n) > -1 || (uo.push(n), console.warn(e));
}
function _d(n, e) {
  let t = [];
  for (let o of e.split(" ")) {
    let a = [];
    for (let h of o.split(".")) {
      let O = n[h] || g[h];
      O ? typeof O == "function" ? a.length ? a = a.map(O) : $r(h, `Modifier ${h} used at start of tag`) : a.length ? $r(h, `Tag ${h} used as modifier`) : a = Array.isArray(O) ? O : [O] : $r(h, `Unknown highlighting tag ${h}`);
    }
    for (let h of a)
      t.push(h);
  }
  if (!t.length)
    return 0;
  let i = e.replace(/ /g, "_"), r = i + " " + t.map((o) => o.id), s = po[r];
  if (s)
    return s.id;
  let l = po[r] = me.define({
    id: fo.length,
    name: i,
    props: [_i({ [i]: t })]
  });
  return fo.push(l), l.id;
}
B.RTL, B.LTR;
const Md = (n) => {
  let { state: e } = n, t = e.doc.lineAt(e.selection.main.from), i = Bs(n.state, t.from);
  return i.line ? qd(n) : i.block ? zd(n) : !1;
};
function Ls(n, e) {
  return ({ state: t, dispatch: i }) => {
    if (t.readOnly)
      return !1;
    let r = n(e, t);
    return r ? (i(t.update(r)), !0) : !1;
  };
}
const qd = /* @__PURE__ */ Ls(
  Vd,
  0
  /* CommentOption.Toggle */
), Yd = /* @__PURE__ */ Ls(
  Vh,
  0
  /* CommentOption.Toggle */
), zd = /* @__PURE__ */ Ls(
  (n, e) => Vh(n, e, Ud(e)),
  0
  /* CommentOption.Toggle */
);
function Bs(n, e) {
  let t = n.languageDataAt("commentTokens", e, 1);
  return t.length ? t[0] : {};
}
const hi = 50;
function Ed(n, { open: e, close: t }, i, r) {
  let s = n.sliceDoc(i - hi, i), l = n.sliceDoc(r, r + hi), o = /\s*$/.exec(s)[0].length, a = /^\s*/.exec(l)[0].length, h = s.length - o;
  if (s.slice(h - e.length, h) == e && l.slice(a, a + t.length) == t)
    return {
      open: { pos: i - o, margin: o && 1 },
      close: { pos: r + a, margin: a && 1 }
    };
  let O, c;
  r - i <= 2 * hi ? O = c = n.sliceDoc(i, r) : (O = n.sliceDoc(i, i + hi), c = n.sliceDoc(r - hi, r));
  let f = /^\s*/.exec(O)[0].length, u = /\s*$/.exec(c)[0].length, d = c.length - u - t.length;
  return O.slice(f, f + e.length) == e && c.slice(d, d + t.length) == t ? {
    open: {
      pos: i + f + e.length,
      margin: /\s/.test(O.charAt(f + e.length)) ? 1 : 0
    },
    close: {
      pos: r - u - t.length,
      margin: /\s/.test(c.charAt(d - 1)) ? 1 : 0
    }
  } : null;
}
function Ud(n) {
  let e = [];
  for (let t of n.selection.ranges) {
    let i = n.doc.lineAt(t.from), r = t.to <= i.to ? i : n.doc.lineAt(t.to);
    r.from > i.from && r.from == t.to && (r = t.to == i.to + 1 ? i : n.doc.lineAt(t.to - 1));
    let s = e.length - 1;
    s >= 0 && e[s].to > i.from ? e[s].to = r.to : e.push({ from: i.from + /^\s*/.exec(i.text)[0].length, to: r.to });
  }
  return e;
}
function Vh(n, e, t = e.selection.ranges) {
  let i = t.map((s) => Bs(e, s.from).block);
  if (!i.every((s) => s))
    return null;
  let r = t.map((s, l) => Ed(e, i[l], s.from, s.to));
  if (n != 2 && !r.every((s) => s))
    return { changes: e.changes(t.map((s, l) => r[l] ? [] : [{ from: s.from, insert: i[l].open + " " }, { from: s.to, insert: " " + i[l].close }])) };
  if (n != 1 && r.some((s) => s)) {
    let s = [];
    for (let l = 0, o; l < r.length; l++)
      if (o = r[l]) {
        let a = i[l], { open: h, close: O } = o;
        s.push({ from: h.pos - a.open.length, to: h.pos + h.margin }, { from: O.pos - O.margin, to: O.pos + a.close.length });
      }
    return { changes: s };
  }
  return null;
}
function Vd(n, e, t = e.selection.ranges) {
  let i = [], r = -1;
  e: for (let { from: s, to: l } of t) {
    let o = i.length, a = 1e9, h;
    for (let O = s; O <= l; ) {
      let c = e.doc.lineAt(O);
      if (h == null && (h = Bs(e, c.from).line, !h))
        continue e;
      if (c.from > r && (s == l || l > c.from)) {
        r = c.from;
        let f = /^\s*/.exec(c.text)[0].length, u = f == c.length, d = c.text.slice(f, f + h.length) == h ? f : -1;
        f < c.text.length && f < a && (a = f), i.push({ line: c, comment: d, token: h, indent: f, empty: u, single: !1 });
      }
      O = c.to + 1;
    }
    if (a < 1e9)
      for (let O = o; O < i.length; O++)
        i[O].indent < i[O].line.text.length && (i[O].indent = a);
    i.length == o + 1 && (i[o].single = !0);
  }
  if (n != 2 && i.some((s) => s.comment < 0 && (!s.empty || s.single))) {
    let s = [];
    for (let { line: o, token: a, indent: h, empty: O, single: c } of i)
      (c || !O) && s.push({ from: o.from + h, insert: a + " " });
    let l = e.changes(s);
    return { changes: l, selection: e.selection.map(l, 1) };
  } else if (n != 1 && i.some((s) => s.comment >= 0)) {
    let s = [];
    for (let { line: l, comment: o, token: a } of i)
      if (o >= 0) {
        let h = l.from + o, O = h + a.length;
        l.text[O - l.from] == " " && O++, s.push({ from: h, to: O });
      }
    return { changes: s };
  }
  return null;
}
const ms = /* @__PURE__ */ Ot.define(), Gd = /* @__PURE__ */ Ot.define(), Dd = /* @__PURE__ */ v.define(), Gh = /* @__PURE__ */ v.define({
  combine(n) {
    return Yn(n, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (e, t) => t
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (e, t) => (i, r) => e(i, r) || t(i, r)
    });
  }
}), Dh = /* @__PURE__ */ ht.define({
  create() {
    return He.empty;
  },
  update(n, e) {
    let t = e.state.facet(Gh), i = e.annotation(ms);
    if (i) {
      let a = Se.fromTransaction(e, i.selection), h = i.side, O = h == 0 ? n.undone : n.done;
      return a ? O = Rn(O, O.length, t.minDepth, a) : O = Ih(O, e.startState.selection), new He(h == 0 ? i.rest : O, h == 0 ? O : i.rest);
    }
    let r = e.annotation(Gd);
    if ((r == "full" || r == "before") && (n = n.isolate()), e.annotation(K.addToHistory) === !1)
      return e.changes.empty ? n : n.addMapping(e.changes.desc);
    let s = Se.fromTransaction(e), l = e.annotation(K.time), o = e.annotation(K.userEvent);
    return s ? n = n.addChanges(s, l, o, t, e) : e.selection && (n = n.addSelection(e.startState.selection, l, o, t.newGroupDelay)), (r == "full" || r == "after") && (n = n.isolate()), n;
  },
  toJSON(n) {
    return { done: n.done.map((e) => e.toJSON()), undone: n.undone.map((e) => e.toJSON()) };
  },
  fromJSON(n) {
    return new He(n.done.map(Se.fromJSON), n.undone.map(Se.fromJSON));
  }
});
function Ld(n = {}) {
  return [
    Dh,
    Gh.of(n),
    Z.domEventHandlers({
      beforeinput(e, t) {
        let i = e.inputType == "historyUndo" ? Lh : e.inputType == "historyRedo" ? $s : null;
        return i ? (e.preventDefault(), i(t)) : !1;
      }
    })
  ];
}
function Hn(n, e) {
  return function({ state: t, dispatch: i }) {
    if (!e && t.readOnly)
      return !1;
    let r = t.field(Dh, !1);
    if (!r)
      return !1;
    let s = r.pop(n, t, e);
    return s ? (i(s), !0) : !1;
  };
}
const Lh = /* @__PURE__ */ Hn(0, !1), $s = /* @__PURE__ */ Hn(1, !1), Bd = /* @__PURE__ */ Hn(0, !0), Id = /* @__PURE__ */ Hn(1, !0);
class Se {
  constructor(e, t, i, r, s) {
    this.changes = e, this.effects = t, this.mapped = i, this.startSelection = r, this.selectionsAfter = s;
  }
  setSelAfter(e) {
    return new Se(this.changes, this.effects, this.mapped, this.startSelection, e);
  }
  toJSON() {
    var e, t, i;
    return {
      changes: (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
      mapped: (t = this.mapped) === null || t === void 0 ? void 0 : t.toJSON(),
      startSelection: (i = this.startSelection) === null || i === void 0 ? void 0 : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((r) => r.toJSON())
    };
  }
  static fromJSON(e) {
    return new Se(e.changes && J.fromJSON(e.changes), [], e.mapped && Ke.fromJSON(e.mapped), e.startSelection && Q.fromJSON(e.startSelection), e.selectionsAfter.map(Q.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(e, t) {
    let i = Ze;
    for (let r of e.startState.facet(Dd)) {
      let s = r(e);
      s.length && (i = i.concat(s));
    }
    return !i.length && e.changes.empty ? null : new Se(e.changes.invert(e.startState.doc), i, void 0, t || e.startState.selection, Ze);
  }
  static selection(e) {
    return new Se(void 0, Ze, void 0, void 0, e);
  }
}
function Rn(n, e, t, i) {
  let r = e + 1 > t + 20 ? e - t - 1 : 0, s = n.slice(r, e);
  return s.push(i), s;
}
function Nd(n, e) {
  let t = [], i = !1;
  return n.iterChangedRanges((r, s) => t.push(r, s)), e.iterChangedRanges((r, s, l, o) => {
    for (let a = 0; a < t.length; ) {
      let h = t[a++], O = t[a++];
      o >= h && l <= O && (i = !0);
    }
  }), i;
}
function Fd(n, e) {
  return n.ranges.length == e.ranges.length && n.ranges.filter((t, i) => t.empty != e.ranges[i].empty).length === 0;
}
function Bh(n, e) {
  return n.length ? e.length ? n.concat(e) : n : e;
}
const Ze = [], Hd = 200;
function Ih(n, e) {
  if (n.length) {
    let t = n[n.length - 1], i = t.selectionsAfter.slice(Math.max(0, t.selectionsAfter.length - Hd));
    return i.length && i[i.length - 1].eq(e) ? n : (i.push(e), Rn(n, n.length - 1, 1e9, t.setSelAfter(i)));
  } else
    return [Se.selection([e])];
}
function Kd(n) {
  let e = n[n.length - 1], t = n.slice();
  return t[n.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), t;
}
function Qr(n, e) {
  if (!n.length)
    return n;
  let t = n.length, i = Ze;
  for (; t; ) {
    let r = Jd(n[t - 1], e, i);
    if (r.changes && !r.changes.empty || r.effects.length) {
      let s = n.slice(0, t);
      return s[t - 1] = r, s;
    } else
      e = r.mapped, t--, i = r.selectionsAfter;
  }
  return i.length ? [Se.selection(i)] : Ze;
}
function Jd(n, e, t) {
  let i = Bh(n.selectionsAfter.length ? n.selectionsAfter.map((o) => o.map(e)) : Ze, t);
  if (!n.changes)
    return Se.selection(i);
  let r = n.changes.map(e), s = e.mapDesc(n.changes, !0), l = n.mapped ? n.mapped.composeDesc(s) : s;
  return new Se(r, I.mapEffects(n.effects, e), l, n.startSelection.map(s), i);
}
const ep = /^(input\.type|delete)($|\.)/;
class He {
  constructor(e, t, i = 0, r = void 0) {
    this.done = e, this.undone = t, this.prevTime = i, this.prevUserEvent = r;
  }
  isolate() {
    return this.prevTime ? new He(this.done, this.undone) : this;
  }
  addChanges(e, t, i, r, s) {
    let l = this.done, o = l[l.length - 1];
    return o && o.changes && !o.changes.empty && e.changes && (!i || ep.test(i)) && (!o.selectionsAfter.length && t - this.prevTime < r.newGroupDelay && r.joinToEvent(s, Nd(o.changes, e.changes)) || // For compose (but not compose.start) events, always join with previous event
    i == "input.type.compose") ? l = Rn(l, l.length - 1, r.minDepth, new Se(e.changes.compose(o.changes), Bh(I.mapEffects(e.effects, o.changes), o.effects), o.mapped, o.startSelection, Ze)) : l = Rn(l, l.length, r.minDepth, e), new He(l, Ze, t, i);
  }
  addSelection(e, t, i, r) {
    let s = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Ze;
    return s.length > 0 && t - this.prevTime < r && i == this.prevUserEvent && i && /^select($|\.)/.test(i) && Fd(s[s.length - 1], e) ? this : new He(Ih(this.done, e), this.undone, t, i);
  }
  addMapping(e) {
    return new He(Qr(this.done, e), Qr(this.undone, e), this.prevTime, this.prevUserEvent);
  }
  pop(e, t, i) {
    let r = e == 0 ? this.done : this.undone;
    if (r.length == 0)
      return null;
    let s = r[r.length - 1], l = s.selectionsAfter[0] || (s.startSelection ? s.startSelection.map(s.changes.invertedDesc, 1) : t.selection);
    if (i && s.selectionsAfter.length)
      return t.update({
        selection: s.selectionsAfter[s.selectionsAfter.length - 1],
        annotations: ms.of({ side: e, rest: Kd(r), selection: l }),
        userEvent: e == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (s.changes) {
      let o = r.length == 1 ? Ze : r.slice(0, r.length - 1);
      return s.mapped && (o = Qr(o, s.mapped)), t.update({
        changes: s.changes,
        selection: s.startSelection,
        effects: s.effects,
        annotations: ms.of({ side: e, rest: o, selection: l }),
        filter: !1,
        userEvent: e == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
He.empty = /* @__PURE__ */ new He(Ze, Ze);
const tp = [
  { key: "Mod-z", run: Lh, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: $s, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: $s, preventDefault: !0 },
  { key: "Mod-u", run: Bd, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: Id, preventDefault: !0 }
];
function ii(n, e) {
  return Q.create(n.ranges.map(e), n.mainIndex);
}
function Me(n, e) {
  return n.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function qe({ state: n, dispatch: e }, t) {
  let i = ii(n.selection, t);
  return i.eq(n.selection, !0) ? !1 : (e(Me(n, i)), !0);
}
function Kn(n, e) {
  return Q.cursor(e ? n.to : n.from);
}
function Nh(n, e) {
  return qe(n, (t) => t.empty ? n.moveByChar(t, e) : Kn(t, e));
}
function Oe(n) {
  return n.textDirectionAt(n.state.selection.main.head) == B.LTR;
}
const Fh = (n) => Nh(n, !Oe(n)), Hh = (n) => Nh(n, Oe(n));
function Kh(n, e) {
  return qe(n, (t) => t.empty ? n.moveByGroup(t, e) : Kn(t, e));
}
const ip = (n) => Kh(n, !Oe(n)), np = (n) => Kh(n, Oe(n));
function rp(n, e, t) {
  if (e.type.prop(t))
    return !0;
  let i = e.to - e.from;
  return i && (i > 2 || /[^\s,.;:]/.test(n.sliceDoc(e.from, e.to))) || e.firstChild;
}
function Jn(n, e, t) {
  let i = se(n).resolveInner(e.head), r = t ? C.closedBy : C.openedBy;
  for (let a = e.head; ; ) {
    let h = t ? i.childAfter(a) : i.childBefore(a);
    if (!h)
      break;
    rp(n, h, r) ? i = h : a = t ? h.to : h.from;
  }
  let s = i.type.prop(r), l, o;
  return s && (l = t ? Fe(n, i.from, 1) : Fe(n, i.to, -1)) && l.matched ? o = t ? l.end.to : l.end.from : o = t ? i.to : i.from, Q.cursor(o, t ? -1 : 1);
}
const sp = (n) => qe(n, (e) => Jn(n.state, e, !Oe(n))), lp = (n) => qe(n, (e) => Jn(n.state, e, Oe(n)));
function Jh(n, e) {
  return qe(n, (t) => {
    if (!t.empty)
      return Kn(t, e);
    let i = n.moveVertically(t, e);
    return i.head != t.head ? i : n.moveToLineBoundary(t, e);
  });
}
const eO = (n) => Jh(n, !1), tO = (n) => Jh(n, !0);
function iO(n) {
  let e = n.scrollDOM.clientHeight < n.scrollDOM.scrollHeight - 2, t = 0, i = 0, r;
  if (e) {
    for (let s of n.state.facet(Z.scrollMargins)) {
      let l = s(n);
      l?.top && (t = Math.max(l?.top, t)), l?.bottom && (i = Math.max(l?.bottom, i));
    }
    r = n.scrollDOM.clientHeight - t - i;
  } else
    r = (n.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: t,
    marginBottom: i,
    selfScroll: e,
    height: Math.max(n.defaultLineHeight, r - 5)
  };
}
function nO(n, e) {
  let t = iO(n), { state: i } = n, r = ii(i.selection, (l) => l.empty ? n.moveVertically(l, e, t.height) : Kn(l, e));
  if (r.eq(i.selection))
    return !1;
  let s;
  if (t.selfScroll) {
    let l = n.coordsAtPos(i.selection.main.head), o = n.scrollDOM.getBoundingClientRect(), a = o.top + t.marginTop, h = o.bottom - t.marginBottom;
    l && l.top > a && l.bottom < h && (s = Z.scrollIntoView(r.main.head, { y: "start", yMargin: l.top - a }));
  }
  return n.dispatch(Me(i, r), { effects: s }), !0;
}
const go = (n) => nO(n, !1), Qs = (n) => nO(n, !0);
function yt(n, e, t) {
  let i = n.lineBlockAt(e.head), r = n.moveToLineBoundary(e, t);
  if (r.head == e.head && r.head != (t ? i.to : i.from) && (r = n.moveToLineBoundary(e, t, !1)), !t && r.head == i.from && i.length) {
    let s = /^\s*/.exec(n.state.sliceDoc(i.from, Math.min(i.from + 100, i.to)))[0].length;
    s && e.head != i.from + s && (r = Q.cursor(i.from + s));
  }
  return r;
}
const op = (n) => qe(n, (e) => yt(n, e, !0)), ap = (n) => qe(n, (e) => yt(n, e, !1)), hp = (n) => qe(n, (e) => yt(n, e, !Oe(n))), Op = (n) => qe(n, (e) => yt(n, e, Oe(n))), cp = (n) => qe(n, (e) => n.moveToLineBoundary(e, !1, !1)), fp = (n) => qe(n, (e) => n.moveToLineBoundary(e, !0, !1));
function up(n, e, t) {
  let i = !1, r = ii(n.selection, (s) => {
    let l = Fe(n, s.head, -1) || Fe(n, s.head, 1) || s.head > 0 && Fe(n, s.head - 1, 1) || s.head < n.doc.length && Fe(n, s.head + 1, -1);
    if (!l || !l.end)
      return s;
    i = !0;
    let o = l.start.from == s.head ? l.end.to : l.end.from;
    return Q.cursor(o);
  });
  return i ? (e(Me(n, r)), !0) : !1;
}
const dp = ({ state: n, dispatch: e }) => up(n, e);
function Te(n, e, t) {
  let i = ii(n.state.selection, (r) => {
    r.undirectional && r.head >= r.anchor != e && (r = Q.range(r.head, r.anchor));
    let s = t(r);
    return Q.range(r.anchor, s.head, s.goalColumn, s.bidiLevel || void 0, s.assoc);
  });
  return i.eq(n.state.selection) ? !1 : (n.dispatch(Me(n.state, i)), !0);
}
function rO(n, e) {
  return Te(n, e, (t) => n.moveByChar(t, e));
}
const sO = (n) => rO(n, !Oe(n)), lO = (n) => rO(n, Oe(n));
function oO(n, e) {
  return Te(n, e, (t) => n.moveByGroup(t, e));
}
const pp = (n) => oO(n, !Oe(n)), gp = (n) => oO(n, Oe(n)), mp = (n) => {
  let e = !Oe(n);
  return Te(n, e, (t) => Jn(n.state, t, e));
}, $p = (n) => {
  let e = Oe(n);
  return Te(n, e, (t) => Jn(n.state, t, e));
};
function aO(n, e) {
  return Te(n, e, (t) => n.moveVertically(t, e));
}
const hO = (n) => aO(n, !1), OO = (n) => aO(n, !0);
function cO(n, e) {
  return Te(n, e, (t) => n.moveVertically(t, e, iO(n).height));
}
const mo = (n) => cO(n, !1), $o = (n) => cO(n, !0), Qp = (n) => Te(n, !0, (e) => yt(n, e, !0)), Sp = (n) => Te(n, !1, (e) => yt(n, e, !1)), bp = (n) => {
  let e = !Oe(n);
  return Te(n, e, (t) => yt(n, t, e));
}, yp = (n) => {
  let e = Oe(n);
  return Te(n, e, (t) => yt(n, t, e));
}, Pp = (n) => Te(n, !1, (e) => Q.cursor(n.lineBlockAt(e.head).from)), xp = (n) => Te(n, !0, (e) => Q.cursor(n.lineBlockAt(e.head).to)), Qo = ({ state: n, dispatch: e }) => (e(Me(n, { anchor: 0 })), !0), So = ({ state: n, dispatch: e }) => (e(Me(n, { anchor: n.doc.length })), !0), bo = ({ state: n, dispatch: e }) => (e(Me(n, { anchor: n.selection.main.anchor, head: 0 })), !0), yo = ({ state: n, dispatch: e }) => (e(Me(n, { anchor: n.selection.main.anchor, head: n.doc.length })), !0), kp = ({ state: n, dispatch: e }) => (e(n.update({ selection: { anchor: 0, head: n.doc.length }, userEvent: "select" })), !0), wp = ({ state: n, dispatch: e }) => {
  let t = er(n).map(({ from: i, to: r }) => Q.undirectionalRange(i, Math.min(r + 1, n.doc.length)));
  return e(n.update({ selection: Q.create(t), userEvent: "select" })), !0;
}, vp = ({ state: n, dispatch: e }) => {
  let t = ii(n.selection, (i) => {
    let r = se(n), s = r.resolveStack(i.from, 1);
    if (i.empty) {
      let l = r.resolveStack(i.from, -1);
      l.node.from >= s.node.from && l.node.to <= s.node.to && (s = l);
    }
    for (let l = s; l; l = l.next) {
      let { node: o } = l;
      if ((o.from < i.from && o.to >= i.to || o.to > i.to && o.from <= i.from) && l.next)
        return Q.undirectionalRange(o.from, o.to);
    }
    return i;
  });
  return t.eq(n.selection) ? !1 : (e(Me(n, t)), !0);
};
function fO(n, e) {
  let { state: t } = n, i = t.selection, r = t.selection.ranges.slice();
  for (let s of t.selection.ranges) {
    let l = t.doc.lineAt(s.head);
    if (e ? l.to < n.state.doc.length : l.from > 0)
      for (let o = s; ; ) {
        let a = n.moveVertically(o, e);
        if (a.head < l.from || a.head > l.to) {
          r.some((h) => h.head == a.head) || r.push(a);
          break;
        } else {
          if (a.head == o.head)
            break;
          o = a;
        }
      }
  }
  return r.length == i.ranges.length ? !1 : (n.dispatch(Me(t, Q.create(r, r.length - 1))), !0);
}
const Xp = (n) => fO(n, !1), Zp = (n) => fO(n, !0), Tp = ({ state: n, dispatch: e }) => {
  let t = n.selection, i = null;
  return t.ranges.length > 1 ? i = Q.create([t.main]) : t.main.empty || (i = Q.create([Q.cursor(t.main.head)])), i ? (e(Me(n, i)), !0) : !1;
};
function qi(n, e) {
  if (n.state.readOnly)
    return !1;
  let t = "delete.selection", { state: i } = n, r = i.changeByRange((s) => {
    let { from: l, to: o } = s;
    if (l == o) {
      let a = e(s);
      a < l ? (t = "delete.backward", a = nn(n, a, !1)) : a > l && (t = "delete.forward", a = nn(n, a, !0)), l = Math.min(l, a), o = Math.max(o, a);
    } else
      l = nn(n, l, !1), o = nn(n, o, !0);
    return l == o ? { range: s } : { changes: { from: l, to: o }, range: Q.cursor(l, l < s.head ? -1 : 1) };
  });
  return r.changes.empty ? !1 : (n.dispatch(i.update(r, {
    scrollIntoView: !0,
    userEvent: t,
    effects: t == "delete.selection" ? Z.announce.of(i.phrase("Selection deleted")) : void 0
  })), !0);
}
function nn(n, e, t) {
  if (n instanceof Z)
    for (let i of n.state.facet(Z.atomicRanges).map((r) => r(n)))
      i.between(e, e, (r, s) => {
        r < e && s > e && (e = t ? s : r);
      });
  return e;
}
const uO = (n, e, t) => qi(n, (i) => {
  let r = i.from, { state: s } = n, l = s.doc.lineAt(r), o, a;
  if (t && !e && r > l.from && r < l.from + 200 && !/[^ \t]/.test(o = l.text.slice(0, r - l.from))) {
    if (o[o.length - 1] == "	")
      return r - 1;
    let h = zn(o, s.tabSize), O = h % Zn(s) || Zn(s);
    for (let c = 0; c < O && o[o.length - 1 - c] == " "; c++)
      r--;
    a = r;
  } else
    a = ae(l.text, r - l.from, e, e) + l.from, a == r && l.number != (e ? s.doc.lines : 1) ? a += e ? 1 : -1 : !e && /[\ufe00-\ufe0f]/.test(l.text.slice(a - l.from, r - l.from)) && (a = ae(l.text, a - l.from, !1, !1) + l.from);
  return a;
}), Ss = (n) => uO(n, !1, !0), dO = (n) => uO(n, !0, !1), pO = (n, e) => qi(n, (t) => {
  let i = t.head, { state: r } = n, s = r.doc.lineAt(i), l = r.charCategorizer(i);
  for (let o = null; ; ) {
    if (i == (e ? s.to : s.from)) {
      i == t.head && s.number != (e ? r.doc.lines : 1) && (i += e ? 1 : -1);
      break;
    }
    let a = ae(s.text, i - s.from, e) + s.from, h = s.text.slice(Math.min(i, a) - s.from, Math.max(i, a) - s.from), O = l(h);
    if (o != null && O != o)
      break;
    (h != " " || i != t.head) && (o = O), i = a;
  }
  return i;
}), gO = (n) => pO(n, !1), Rp = (n) => pO(n, !0), Cp = (n) => qi(n, (e) => {
  let t = n.lineBlockAt(e.head).to;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), Ap = (n) => qi(n, (e) => {
  let t = n.moveToLineBoundary(e, !1).head;
  return e.head > t ? t : Math.max(0, e.head - 1);
}), jp = (n) => qi(n, (e) => {
  let t = n.moveToLineBoundary(e, !0).head;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), Wp = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => ({
    changes: { from: i.from, to: i.to, insert: _.of(["", ""]) },
    range: Q.cursor(i.from)
  }));
  return e(n.update(t, { scrollIntoView: !0, userEvent: "input" })), !0;
}, _p = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => {
    if (!i.empty || i.from == 0 || i.from == n.doc.length)
      return { range: i };
    let r = i.from, s = n.doc.lineAt(r), l = r == s.from ? r - 1 : ae(s.text, r - s.from, !1) + s.from, o = r == s.to ? r + 1 : ae(s.text, r - s.from, !0) + s.from;
    return {
      changes: { from: l, to: o, insert: n.doc.slice(r, o).append(n.doc.slice(l, r)) },
      range: Q.cursor(o)
    };
  });
  return t.changes.empty ? !1 : (e(n.update(t, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function er(n) {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let r = n.doc.lineAt(i.from), s = n.doc.lineAt(i.to);
    if (!i.empty && i.to == s.from && (s = n.doc.lineAt(i.to - 1)), t >= r.number) {
      let l = e[e.length - 1];
      l.to = s.to, l.ranges.push(i);
    } else
      e.push({ from: r.from, to: s.to, ranges: [i] });
    t = s.number + 1;
  }
  return e;
}
function mO(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [], r = [];
  for (let s of er(n)) {
    if (t ? s.to == n.doc.length : s.from == 0)
      continue;
    let l = n.doc.lineAt(t ? s.to + 1 : s.from - 1), o = l.length + 1;
    if (t) {
      i.push({ from: s.to, to: l.to }, { from: s.from, insert: l.text + n.lineBreak });
      for (let a of s.ranges)
        r.push(Q.range(Math.min(n.doc.length, a.anchor + o), Math.min(n.doc.length, a.head + o)));
    } else {
      i.push({ from: l.from, to: s.from }, { from: s.to, insert: n.lineBreak + l.text });
      for (let a of s.ranges)
        r.push(Q.range(a.anchor - o, a.head - o));
    }
  }
  return i.length ? (e(n.update({
    changes: i,
    scrollIntoView: !0,
    selection: Q.create(r, n.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const Mp = ({ state: n, dispatch: e }) => mO(n, e, !1), qp = ({ state: n, dispatch: e }) => mO(n, e, !0);
function $O(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [];
  for (let s of er(n))
    t ? i.push({ from: s.from, insert: n.doc.slice(s.from, s.to) + n.lineBreak }) : i.push({ from: s.to, insert: n.lineBreak + n.doc.slice(s.from, s.to) });
  let r = n.changes(i);
  return e(n.update({
    changes: r,
    selection: n.selection.map(r, t ? 1 : -1),
    scrollIntoView: !0,
    userEvent: "input.copyline"
  })), !0;
}
const Yp = ({ state: n, dispatch: e }) => $O(n, e, !1), zp = ({ state: n, dispatch: e }) => $O(n, e, !0), Ep = (n) => {
  if (n.state.readOnly)
    return !1;
  let { state: e } = n, t = e.changes(er(e).map(({ from: r, to: s }) => (r > 0 ? r-- : s < e.doc.length && s++, { from: r, to: s }))), i = ii(e.selection, (r) => {
    let s;
    if (n.lineWrapping) {
      let l = n.lineBlockAt(r.head), o = n.coordsAtPos(r.head, r.assoc || 1);
      o && (s = l.bottom + n.documentTop - o.bottom + n.defaultLineHeight / 2);
    }
    return n.moveVertically(r, !0, s);
  }).map(t);
  return n.dispatch({ changes: t, selection: i, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function Up(n, e) {
  if (/\(\)|\[\]|\{\}/.test(n.sliceDoc(e - 1, e + 1)))
    return { from: e, to: e };
  let t = se(n).resolveInner(e), i = t.childBefore(e), r = t.childAfter(e), s;
  return i && r && i.to <= e && r.from >= e && (s = i.type.prop(C.closedBy)) && s.indexOf(r.name) > -1 && n.doc.lineAt(i.to).from == n.doc.lineAt(r.from).from && !/\S/.test(n.sliceDoc(i.to, r.from)) ? { from: i.to, to: r.from } : null;
}
const Po = /* @__PURE__ */ QO(!1), Vp = /* @__PURE__ */ QO(!0);
function QO(n) {
  return ({ state: e, dispatch: t }) => {
    if (e.readOnly)
      return !1;
    let i = e.changeByRange((r) => {
      let { from: s, to: l } = r, o = e.doc.lineAt(s), a = !n && s == l && Up(e, s);
      n && (s = l = (l <= o.to ? o : e.doc.lineAt(l)).to);
      let h = new In(e, { simulateBreak: s, simulateDoubleBreak: !!a }), O = jh(h, s);
      for (O == null && (O = zn(/^\s*/.exec(e.doc.lineAt(s).text)[0], e.tabSize)); l < o.to && /\s/.test(o.text[l - o.from]); )
        l++;
      a ? { from: s, to: l } = a : s > o.from && s < o.from + 100 && !/\S/.test(o.text.slice(0, s)) && (s = o.from);
      let c = ["", Tn(e, O)];
      return a && c.push(Tn(e, h.lineIndent(o.from, -1))), {
        changes: { from: s, to: l, insert: _.of(c) },
        range: Q.cursor(s + 1 + c[1].length)
      };
    });
    return t(e.update(i, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function Is(n, e) {
  let t = -1;
  return n.changeByRange((i) => {
    let r = [];
    for (let l = i.from; l <= i.to; ) {
      let o = n.doc.lineAt(l);
      o.number > t && (i.empty || i.to > o.from) && (e(o, r, i), t = o.number), l = o.to + 1;
    }
    let s = n.changes(r);
    return {
      changes: r,
      range: Q.range(s.mapPos(i.anchor, 1), s.mapPos(i.head, 1))
    };
  });
}
const Gp = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = /* @__PURE__ */ Object.create(null), i = new In(n, { overrideIndentation: (s) => {
    let l = t[s];
    return l ?? -1;
  } }), r = Is(n, (s, l, o) => {
    let a = jh(i, s.from);
    if (a == null)
      return;
    /\S/.test(s.text) || (a = 0);
    let h = /^\s*/.exec(s.text)[0], O = Tn(n, a);
    (h != O || o.from < s.from + h.length) && (t[s.from] = a, l.push({ from: s.from, to: s.from + h.length, insert: O }));
  });
  return r.changes.empty || e(n.update(r, { userEvent: "indent" })), !0;
}, Dp = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(Is(n, (t, i) => {
  i.push({ from: t.from, insert: n.facet(Bn) });
}), { userEvent: "input.indent" })), !0), Lp = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(Is(n, (t, i) => {
  let r = /^\s*/.exec(t.text)[0];
  if (!r)
    return;
  let s = zn(r, n.tabSize), l = 0, o = Tn(n, Math.max(0, s - Zn(n)));
  for (; l < r.length && l < o.length && r.charCodeAt(l) == o.charCodeAt(l); )
    l++;
  i.push({ from: t.from + l, to: t.from + r.length, insert: o.slice(l) });
}), { userEvent: "delete.dedent" })), !0), Bp = (n) => (n.setTabFocusMode(), !0), Ip = [
  { key: "Ctrl-b", run: Fh, shift: sO, preventDefault: !0 },
  { key: "Ctrl-f", run: Hh, shift: lO },
  { key: "Ctrl-p", run: eO, shift: hO },
  { key: "Ctrl-n", run: tO, shift: OO },
  { key: "Ctrl-a", run: cp, shift: Pp },
  { key: "Ctrl-e", run: fp, shift: xp },
  { key: "Ctrl-d", run: dO },
  { key: "Ctrl-h", run: Ss },
  { key: "Ctrl-k", run: Cp },
  { key: "Ctrl-Alt-h", run: gO },
  { key: "Ctrl-o", run: Wp },
  { key: "Ctrl-t", run: _p },
  { key: "Ctrl-v", run: Qs }
], Np = /* @__PURE__ */ [
  { key: "ArrowLeft", run: Fh, shift: sO, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: ip, shift: pp, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: hp, shift: bp, preventDefault: !0 },
  { key: "ArrowRight", run: Hh, shift: lO, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: np, shift: gp, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: Op, shift: yp, preventDefault: !0 },
  { key: "ArrowUp", run: eO, shift: hO, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: Qo, shift: bo },
  { mac: "Ctrl-ArrowUp", run: go, shift: mo },
  { key: "ArrowDown", run: tO, shift: OO, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: So, shift: yo },
  { mac: "Ctrl-ArrowDown", run: Qs, shift: $o },
  { key: "PageUp", run: go, shift: mo },
  { key: "PageDown", run: Qs, shift: $o },
  { key: "Home", run: ap, shift: Sp, preventDefault: !0 },
  { key: "Mod-Home", run: Qo, shift: bo },
  { key: "End", run: op, shift: Qp, preventDefault: !0 },
  { key: "Mod-End", run: So, shift: yo },
  { key: "Enter", run: Po, shift: Po },
  { key: "Mod-a", run: kp },
  { key: "Backspace", run: Ss, shift: Ss, preventDefault: !0 },
  { key: "Delete", run: dO, preventDefault: !0 },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: gO, preventDefault: !0 },
  { key: "Mod-Delete", mac: "Alt-Delete", run: Rp, preventDefault: !0 },
  { mac: "Mod-Backspace", run: Ap, preventDefault: !0 },
  { mac: "Mod-Delete", run: jp, preventDefault: !0 }
].concat(/* @__PURE__ */ Ip.map((n) => ({ mac: n.key, run: n.run, shift: n.shift }))), Fp = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: sp, shift: mp },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: lp, shift: $p },
  { key: "Alt-ArrowUp", run: Mp },
  { key: "Shift-Alt-ArrowUp", run: Yp },
  { key: "Alt-ArrowDown", run: qp },
  { key: "Shift-Alt-ArrowDown", run: zp },
  { key: "Mod-Alt-ArrowUp", run: Xp },
  { key: "Mod-Alt-ArrowDown", run: Zp },
  { key: "Escape", run: Tp },
  { key: "Mod-Enter", run: Vp },
  { key: "Alt-l", mac: "Ctrl-l", run: wp },
  { key: "Mod-i", run: vp, preventDefault: !0 },
  { key: "Mod-[", run: Lp },
  { key: "Mod-]", run: Dp },
  { key: "Mod-Alt-\\", run: Gp },
  { key: "Shift-Mod-k", run: Ep },
  { key: "Shift-Mod-\\", run: dp },
  { key: "Mod-/", run: Md },
  { key: "Alt-A", mac: "Ctrl-A", run: Yd },
  { key: "Ctrl-m", mac: "Shift-Alt-m", run: Bp }
].concat(Np);
var xo = {};
class Cn {
  /**
  @internal
  */
  constructor(e, t, i, r, s, l, o, a, h, O = 0, c) {
    this.p = e, this.stack = t, this.state = i, this.reducePos = r, this.pos = s, this.score = l, this.buffer = o, this.bufferBase = a, this.curContext = h, this.lookAhead = O, this.parent = c;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(e, t, i = 0) {
    let r = e.parser.context;
    return new Cn(e, [], t, i, i, 0, [], 0, r ? new ko(r, r.start) : null, 0, null);
  }
  /**
  The stack's current [context](#lr.ContextTracker) value, if
  any. Its type will depend on the context tracker's type
  parameter, or it will be `null` if there is no context
  tracker.
  */
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  // Push a state onto the stack, tracking its start position as well
  // as the buffer base at that point.
  /**
  @internal
  */
  pushState(e, t) {
    this.stack.push(this.state, t, this.bufferBase + this.buffer.length), this.state = e;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(e) {
    var t;
    let i = e >> 19, r = e & 65535, { parser: s } = this.p, l = this.reducePos < this.pos - 25 && this.setLookAhead(this.pos), o = s.dynamicPrecedence(r);
    if (o && (this.score += o), i == 0) {
      r < s.minRepeatTerm && this.reducePos < this.pos && (this.reducePos = this.pos), this.pushState(s.getGoto(this.state, r, !0), this.reducePos), r < s.minRepeatTerm && this.storeNode(r, this.reducePos, this.reducePos, l ? 8 : 4, !0), this.reduceContext(r, this.reducePos);
      return;
    }
    let a = this.stack.length - (i - 1) * 3 - (e & 262144 ? 6 : 0), h = a ? this.stack[a - 2] : this.p.ranges[0].from;
    r < s.minRepeatTerm && h == this.reducePos && this.reducePos < this.pos && (this.reducePos = this.pos);
    let O = this.reducePos - h;
    O >= 2e3 && !(!((t = this.p.parser.nodeSet.types[r]) === null || t === void 0) && t.isAnonymous) && (h == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = O) : this.p.lastBigReductionSize < O && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = h, this.p.lastBigReductionSize = O));
    let c = a ? this.stack[a - 1] : 0, f = this.bufferBase + this.buffer.length - c;
    if (r < s.minRepeatTerm || e & 131072) {
      let u = s.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(r, h, u, f + 4, !0);
    }
    if (e & 262144)
      this.state = this.stack[a];
    else {
      let u = this.stack[a - 3];
      this.state = s.getGoto(u, r, !0);
    }
    for (; this.stack.length > a; )
      this.stack.pop();
    this.reduceContext(r, h);
  }
  // Shift a value into the buffer
  /**
  @internal
  */
  storeNode(e, t, i, r = 4, s = !1) {
    if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let l = this.buffer.length;
      if (l > 0 && this.buffer[l - 4] == 0 && this.buffer[l - 1] > -1) {
        if (t == i)
          return;
        if (this.buffer[l - 2] >= t) {
          this.buffer[l - 2] = i;
          return;
        }
      }
    }
    if (!s || this.pos == i)
      this.buffer.push(e, t, i, r);
    else {
      let l = this.buffer.length;
      if (l > 0 && (this.buffer[l - 4] != 0 || this.buffer[l - 1] < 0)) {
        let o = !1;
        for (let a = l; a > 0 && this.buffer[a - 2] > i; a -= 4)
          if (this.buffer[a - 1] >= 0) {
            o = !0;
            break;
          }
        if (o)
          for (; l > 0 && this.buffer[l - 2] > i; )
            this.buffer[l] = this.buffer[l - 4], this.buffer[l + 1] = this.buffer[l - 3], this.buffer[l + 2] = this.buffer[l - 2], this.buffer[l + 3] = this.buffer[l - 1], l -= 4, r > 4 && (r -= 4);
      }
      this.buffer[l] = e, this.buffer[l + 1] = t, this.buffer[l + 2] = i, this.buffer[l + 3] = r;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(e, t, i, r) {
    if (e & 131072)
      this.pushState(e & 65535, this.pos);
    else if ((e & 262144) == 0) {
      let s = e, { parser: l } = this.p;
      this.pos = r;
      let o = l.stateFlag(
        s,
        1
        /* StateFlag.Skipped */
      );
      !o && (r > i || t <= l.maxNode) && (this.reducePos = r), this.pushState(s, o ? i : Math.min(i, this.reducePos)), this.shiftContext(t, i), t <= l.maxNode && this.buffer.push(t, i, r, 4);
    } else
      this.pos = r, this.shiftContext(t, i), t <= this.p.parser.maxNode && this.buffer.push(t, i, r, 4);
  }
  // Apply an action
  /**
  @internal
  */
  apply(e, t, i, r) {
    e & 65536 ? this.reduce(e) : this.shift(e, t, i, r);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(e, t, i) {
    let r = this.p.reused.length - 1;
    (r < 0 || this.p.reused[r] != e) && (this.p.reused.push(e), r++);
    let s = this.reducePos = this.pos = i + e.length;
    this.pushState(t, i), this.buffer.push(
      r,
      i,
      s,
      -1
      /* size == -1 means this is a reused value */
    ), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
  }
  // Split the stack. Due to the buffer sharing and the fact
  // that `this.stack` tends to stay quite shallow, this isn't very
  // expensive.
  /**
  @internal
  */
  split() {
    let e = this, t = e.buffer.length;
    for (t && e.buffer[t - 4] == 0 && (t -= 4); t > 0 && e.buffer[t - 2] > e.reducePos; )
      t -= 4;
    let i = e.buffer.slice(t), r = e.bufferBase + t;
    for (; e && r == e.bufferBase; )
      e = e.parent;
    return new Cn(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, i, r, this.curContext, this.lookAhead, e);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(e, t) {
    let i = e <= this.p.parser.maxNode;
    i && this.storeNode(e, this.pos, t, 4), this.storeNode(0, this.pos, t, i ? 8 : 4), this.pos = this.reducePos = t, this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(e) {
    for (let t = new Hp(this); ; ) {
      let i = this.p.parser.stateSlot(
        t.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(t.state, e);
      if (i == 0)
        return !1;
      if ((i & 65536) == 0)
        return !0;
      t.reduce(i);
    }
  }
  // Apply up to Recover.MaxNext recovery actions that conceptually
  // inserts some missing token or rule.
  /**
  @internal
  */
  recoverByInsert(e) {
    if (this.stack.length >= 300)
      return [];
    let t = this.p.parser.nextStates(this.state);
    if (t.length > 8 || this.stack.length >= 120) {
      let r = [];
      for (let s = 0, l; s < t.length; s += 2)
        (l = t[s + 1]) != this.state && this.p.parser.hasAction(l, e) && r.push(t[s], l);
      if (this.stack.length < 120)
        for (let s = 0; r.length < 8 && s < t.length; s += 2) {
          let l = t[s + 1];
          r.some((o, a) => a & 1 && o == l) || r.push(t[s], l);
        }
      t = r;
    }
    let i = [];
    for (let r = 0; r < t.length && i.length < 4; r += 2) {
      let s = t[r + 1];
      if (s == this.state)
        continue;
      let l = this.split();
      l.pushState(s, this.pos), l.storeNode(0, l.pos, l.pos, 4, !0), l.shiftContext(t[r], this.pos), l.reducePos = this.pos, l.score -= 200, i.push(l);
    }
    return i;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: e } = this.p, t = e.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if ((t & 65536) == 0)
      return !1;
    if (!e.validAction(this.state, t)) {
      let i = t >> 19, r = t & 65535, s = this.stack.length - i * 3;
      if (s < 0 || e.getGoto(this.stack[s], r, !1) < 0) {
        let l = this.findForcedReduction();
        if (l == null)
          return !1;
        t = l;
      }
      this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
    }
    return this.reducePos = this.pos, this.reduce(t), !0;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: e } = this.p, t = [], i = (r, s) => {
      if (!t.includes(r))
        return t.push(r), e.allActions(r, (l) => {
          if (!(l & 393216)) if (l & 65536) {
            let o = (l >> 19) - s;
            if (o > 1) {
              let a = l & 65535, h = this.stack.length - o * 3;
              if (h >= 0 && e.getGoto(this.stack[h], a, !1) >= 0)
                return o << 19 | 65536 | a;
            }
          } else {
            let o = i(l, s + 1);
            if (o != null)
              return o;
          }
        });
    };
    return i(this.state, 0);
  }
  /**
  @internal
  */
  forceAll() {
    for (; !this.p.parser.stateFlag(
      this.state,
      2
      /* StateFlag.Accepting */
    ); )
      if (!this.forceReduce()) {
        this.storeNode(0, this.pos, this.pos, 4, !0);
        break;
      }
    return this;
  }
  /**
  Check whether this state has no further actions (assumed to be a direct descendant of the
  top state, since any other states must be able to continue
  somehow). @internal
  */
  get deadEnd() {
    if (this.stack.length != 3)
      return !1;
    let { parser: e } = this.p;
    return e.data[e.stateSlot(
      this.state,
      1
      /* ParseState.Actions */
    )] == 65535 && !e.stateSlot(
      this.state,
      4
      /* ParseState.DefaultReduce */
    );
  }
  /**
  Restart the stack (put it back in its start state). Only safe
  when this.stack.length == 3 (state is directly below the top
  state). @internal
  */
  restart() {
    this.storeNode(0, this.pos, this.pos, 4, !0), this.state = this.stack[0], this.stack.length = 0;
  }
  /**
  @internal
  */
  sameState(e) {
    if (this.state != e.state || this.stack.length != e.stack.length)
      return !1;
    for (let t = 0; t < this.stack.length; t += 3)
      if (this.stack[t] != e.stack[t])
        return !1;
    return !0;
  }
  /**
  Get the parser used by this stack.
  */
  get parser() {
    return this.p.parser;
  }
  /**
  Test whether a given dialect (by numeric ID, as exported from
  the terms file) is enabled.
  */
  dialectEnabled(e) {
    return this.p.parser.dialect.flags[e];
  }
  shiftContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  reduceContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  /**
  @internal
  */
  emitContext() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -3) && this.storeNode(this.curContext.hash, this.reducePos, this.reducePos, -3, !0);
  }
  /**
  @internal
  */
  emitLookAhead() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
  }
  updateContext(e) {
    if (e != this.curContext.context) {
      let t = new ko(this.curContext.tracker, e);
      t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
    }
  }
  /**
  @internal
  */
  setLookAhead(e) {
    return e <= this.lookAhead ? !1 : (this.emitLookAhead(), this.lookAhead = e, !0);
  }
  /**
  @internal
  */
  close() {
    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
  }
}
class ko {
  constructor(e, t) {
    this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
  }
}
class Hp {
  constructor(e) {
    this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
  }
  reduce(e) {
    let t = e & 65535, i = e >> 19;
    i == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (i - 1) * 3;
    let r = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
    this.state = r;
  }
}
class An {
  constructor(e, t, i) {
    this.stack = e, this.pos = t, this.index = i, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
  }
  static create(e, t = e.bufferBase + e.buffer.length) {
    return new An(e, t, t - e.bufferBase);
  }
  maybeNext() {
    let e = this.stack.parent;
    e != null && (this.index = this.stack.bufferBase - e.bufferBase, this.stack = e, this.buffer = e.buffer);
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    this.index -= 4, this.pos -= 4, this.index == 0 && this.maybeNext();
  }
  fork() {
    return new An(this.stack, this.pos, this.index);
  }
}
function di(n, e = Uint16Array) {
  if (typeof n != "string")
    return n;
  let t = null;
  for (let i = 0, r = 0; i < n.length; ) {
    let s = 0;
    for (; ; ) {
      let l = n.charCodeAt(i++), o = !1;
      if (l == 126) {
        s = 65535;
        break;
      }
      l >= 92 && l--, l >= 34 && l--;
      let a = l - 32;
      if (a >= 46 && (a -= 46, o = !0), s += a, o)
        break;
      s *= 46;
    }
    t ? t[r++] = s : t = new e(s);
  }
  return t;
}
class fn {
  constructor() {
    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
  }
}
const wo = new fn();
class Kp {
  /**
  @internal
  */
  constructor(e, t) {
    this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = wo, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(e, t) {
    let i = this.range, r = this.rangeIndex, s = this.pos + e;
    for (; s < i.from; ) {
      if (!r)
        return null;
      let l = this.ranges[--r];
      s -= i.from - l.to, i = l;
    }
    for (; t < 0 ? s > i.to : s >= i.to; ) {
      if (r == this.ranges.length - 1)
        return null;
      let l = this.ranges[++r];
      s += l.from - i.to, i = l;
    }
    return s;
  }
  /**
  @internal
  */
  clipPos(e) {
    if (e >= this.range.from && e < this.range.to)
      return e;
    for (let t of this.ranges)
      if (t.to > e)
        return Math.max(e, t.from);
    return this.end;
  }
  /**
  Look at a code unit near the stream position. `.peek(0)` equals
  `.next`, `.peek(-1)` gives you the previous character, and so
  on.
  
  Note that looking around during tokenizing creates dependencies
  on potentially far-away content, which may reduce the
  effectiveness incremental parsing—when looking forward—or even
  cause invalid reparses when looking backward more than 25 code
  units, since the library does not track lookbehind.
  */
  peek(e) {
    let t = this.chunkOff + e, i, r;
    if (t >= 0 && t < this.chunk.length)
      i = this.pos + e, r = this.chunk.charCodeAt(t);
    else {
      let s = this.resolveOffset(e, 1);
      if (s == null)
        return -1;
      if (i = s, i >= this.chunk2Pos && i < this.chunk2Pos + this.chunk2.length)
        r = this.chunk2.charCodeAt(i - this.chunk2Pos);
      else {
        let l = this.rangeIndex, o = this.range;
        for (; o.to <= i; )
          o = this.ranges[++l];
        this.chunk2 = this.input.chunk(this.chunk2Pos = i), i + this.chunk2.length > o.to && (this.chunk2 = this.chunk2.slice(0, o.to - i)), r = this.chunk2.charCodeAt(0);
      }
    }
    return i >= this.token.lookAhead && (this.token.lookAhead = i + 1), r;
  }
  /**
  Accept a token. By default, the end of the token is set to the
  current stream position, but you can pass an offset (relative to
  the stream position) to change that.
  */
  acceptToken(e, t = 0) {
    let i = t ? this.resolveOffset(t, -1) : this.pos;
    if (i == null || i < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = e, this.token.end = i;
  }
  /**
  Accept a token ending at a specific given position.
  */
  acceptTokenTo(e, t) {
    this.token.value = e, this.token.end = t;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: e, chunkPos: t } = this;
      this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = e, this.chunk2Pos = t, this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
      let e = this.input.chunk(this.pos), t = this.pos + e.length;
      this.chunk = t > this.range.to ? e.slice(0, this.range.to - this.pos) : e, this.chunkPos = this.pos, this.chunkOff = 0;
    }
  }
  readNext() {
    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  /**
  Move the stream forward N (defaults to 1) code units. Returns
  the new value of [`next`](#lr.InputStream.next).
  */
  advance(e = 1) {
    for (this.chunkOff += e; this.pos + e >= this.range.to; ) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      e -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
    }
    return this.pos += e, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
  }
  setDone() {
    return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
  }
  /**
  @internal
  */
  reset(e, t) {
    if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = wo, this.pos != e) {
      if (this.pos = e, e == this.end)
        return this.setDone(), this;
      for (; e < this.range.from; )
        this.range = this.ranges[--this.rangeIndex];
      for (; e >= this.range.to; )
        this.range = this.ranges[++this.rangeIndex];
      e >= this.chunkPos && e < this.chunkPos + this.chunk.length ? this.chunkOff = e - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
    }
    return this;
  }
  /**
  @internal
  */
  read(e, t) {
    if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
    if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
    if (e >= this.range.from && t <= this.range.to)
      return this.input.read(e, t);
    let i = "";
    for (let r of this.ranges) {
      if (r.from >= t)
        break;
      r.to > e && (i += this.input.read(Math.max(r.from, e), Math.min(r.to, t)));
    }
    return i;
  }
}
class Dt {
  constructor(e, t) {
    this.data = e, this.id = t;
  }
  token(e, t) {
    let { parser: i } = t.p;
    SO(this.data, e, t, this.id, i.data, i.tokenPrecTable);
  }
}
Dt.prototype.contextual = Dt.prototype.fallback = Dt.prototype.extend = !1;
class jn {
  constructor(e, t, i) {
    this.precTable = t, this.elseToken = i, this.data = typeof e == "string" ? di(e) : e;
  }
  token(e, t) {
    let i = e.pos, r = 0;
    for (; ; ) {
      let s = e.next < 0, l = e.resolveOffset(1, 1);
      if (SO(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1)
        break;
      if (this.elseToken == null)
        return;
      if (s || r++, l == null)
        break;
      e.reset(l, e.token);
    }
    r && (e.reset(i, e.token), e.acceptToken(this.elseToken, r));
  }
}
jn.prototype.contextual = Dt.prototype.fallback = Dt.prototype.extend = !1;
class ce {
  /**
  Create a tokenizer. The first argument is the function that,
  given an input stream, scans for the types of tokens it
  recognizes at the stream's position, and calls
  [`acceptToken`](#lr.InputStream.acceptToken) when it finds
  one.
  */
  constructor(e, t = {}) {
    this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
  }
}
function SO(n, e, t, i, r, s) {
  let l = 0, o = 1 << i, { dialect: a } = t.p.parser;
  e: for (; (o & n[l]) != 0; ) {
    let h = n[l + 1];
    for (let u = l + 3; u < h; u += 2)
      if ((n[u + 1] & o) > 0) {
        let d = n[u];
        if (a.allows(d) && (e.token.value == -1 || e.token.value == d || Jp(d, e.token.value, r, s))) {
          e.acceptToken(d);
          break;
        }
      }
    let O = e.next, c = 0, f = n[l + 2];
    if (e.next < 0 && f > c && n[h + f * 3 - 3] == 65535) {
      l = n[h + f * 3 - 1];
      continue e;
    }
    for (; c < f; ) {
      let u = c + f >> 1, d = h + u + (u << 1), p = n[d], m = n[d + 1] || 65536;
      if (O < p)
        f = u;
      else if (O >= m)
        c = u + 1;
      else {
        l = n[d + 2], e.advance();
        continue e;
      }
    }
    break;
  }
}
function vo(n, e, t) {
  for (let i = e, r; (r = n[i]) != 65535; i++)
    if (r == t)
      return i - e;
  return -1;
}
function Jp(n, e, t, i) {
  let r = vo(t, i, e);
  return r < 0 || vo(t, i, n) < r;
}
const ye = typeof process < "u" && xo && /\bparse\b/.test(xo.LOG);
let Sr = null;
function Xo(n, e, t) {
  let i = n.cursor(q.IncludeAnonymous);
  for (i.moveTo(e); ; )
    if (!(t < 0 ? i.childBefore(e) : i.childAfter(e)))
      for (; ; ) {
        if ((t < 0 ? i.to < e : i.from > e) && !i.type.isError)
          return t < 0 ? Math.max(0, Math.min(
            i.to - 1,
            e - 25
            /* Lookahead.Margin */
          )) : Math.min(n.length, Math.max(
            i.from + 1,
            e + 25
            /* Lookahead.Margin */
          ));
        if (t < 0 ? i.prevSibling() : i.nextSibling())
          break;
        if (!i.parent())
          return t < 0 ? 0 : n.length;
      }
}
class eg {
  constructor(e, t) {
    this.fragments = e, this.minRepeat = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.lastRepeat = null, this.lastRepeatPos = -1, this.nextFragment();
  }
  nextFragment() {
    let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (e) {
      for (this.safeFrom = e.openStart ? Xo(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? Xo(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length; )
        this.trees.pop(), this.start.pop(), this.index.pop();
      this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
    } else
      this.nextStart = 1e9;
  }
  // `pos` must be >= any previously given `pos` for this cursor
  nodeAt(e) {
    if (e < this.nextStart)
      return null;
    for (; this.fragment && this.safeTo <= e; )
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let t = this.trees.length - 1;
      if (t < 0)
        return this.nextFragment(), null;
      if (e < this.safeFrom)
        return null;
      let i = this.trees[t], r = this.index[t];
      if (r == i.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let s = i.children[r], l = this.start[t] + i.positions[r];
      if (l > e)
        return this.nextStart = l, null;
      if (s instanceof N) {
        let o = l > this.lastRepeatPos && s.type.id >= this.minRepeat;
        if (l == e || o) {
          let a = l + s.length, h;
          if (l >= this.safeFrom && a <= this.safeTo && (!(h = s.prop(C.lookAhead)) || a + h < this.fragment.to) && (o && (this.lastRepeat = s, this.lastRepeatPos = l), l == e))
            return s;
        }
        this.index[t]++, l + s.length >= Math.max(this.safeFrom, e) && (this.trees.push(s), this.start.push(l), this.index.push(0));
      } else
        this.index[t]++, this.nextStart = l + s.length;
    }
  }
}
class tg {
  constructor(e, t) {
    this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((i) => new fn());
  }
  getActions(e) {
    let t = 0, i = null, { parser: r } = e.p, { tokenizers: s } = r, l = r.stateSlot(
      e.state,
      3
      /* ParseState.TokenizerMask */
    ), o = e.curContext ? e.curContext.hash : 0, a = 0;
    for (let h = 0; h < s.length; h++) {
      if ((1 << h & l) == 0)
        continue;
      let O = s[h], c = this.tokens[h];
      if (!(i && !O.fallback) && ((O.contextual || c.start != e.pos || c.mask != l || c.context != o) && (this.updateCachedToken(c, O, e), c.mask = l, c.context = o), c.lookAhead > c.end + 25 && (a = Math.max(c.lookAhead, a)), c.value != 0)) {
        let f = t;
        if (c.extended > -1 && (t = this.addActions(e, c.extended, c.end, t)), t = this.addActions(e, c.value, c.end, t), !O.extend && (i = c, t > f))
          break;
      }
    }
    for (; this.actions.length > t; )
      this.actions.pop();
    return a && e.setLookAhead(a), !i && e.pos == this.stream.end && (i = new fn(), i.value = e.p.parser.eofTerm, i.start = i.end = e.pos, t = this.addActions(e, i.value, i.end, t)), this.mainToken = i, this.actions;
  }
  getMainToken(e) {
    if (this.mainToken)
      return this.mainToken;
    let t = new fn(), { pos: i, p: r } = e;
    return t.start = i, t.end = Math.min(i + 1, r.stream.end), t.value = i == r.stream.end ? r.parser.eofTerm : 0, t;
  }
  updateCachedToken(e, t, i) {
    let r = this.stream.clipPos(i.pos);
    if (t.token(this.stream.reset(r, e), i), e.value > -1) {
      let { parser: s } = i.p;
      for (let l = 0; l < s.specialized.length; l++)
        if (s.specialized[l] == e.value) {
          let o = s.specializers[l](this.stream.read(e.start, e.end), i);
          if (o >= 0 && i.p.parser.dialect.allows(o >> 1)) {
            (o & 1) == 0 ? e.value = o >> 1 : e.extended = o >> 1;
            break;
          }
        }
    } else
      e.value = 0, e.end = this.stream.clipPos(r + 1);
  }
  putAction(e, t, i, r) {
    for (let s = 0; s < r; s += 3)
      if (this.actions[s] == e)
        return r;
    return this.actions[r++] = e, this.actions[r++] = t, this.actions[r++] = i, r;
  }
  addActions(e, t, i, r) {
    let { state: s } = e, { parser: l } = e.p, { data: o } = l;
    for (let a = 0; a < 2; a++)
      for (let h = l.stateSlot(
        s,
        a ? 2 : 1
        /* ParseState.Actions */
      ); ; h += 3) {
        if (o[h] == 65535)
          if (o[h + 1] == 1)
            h = nt(o, h + 2);
          else {
            r == 0 && o[h + 1] == 2 && (r = this.putAction(nt(o, h + 2), t, i, r));
            break;
          }
        o[h] == t && (r = this.putAction(nt(o, h + 1), t, i, r));
      }
    return r;
  }
}
class ig {
  constructor(e, t, i, r) {
    this.parser = e, this.input = t, this.ranges = r, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new Kp(t, r), this.tokens = new tg(e, this.stream), this.topTerm = e.top[1];
    let { from: s } = r[0];
    this.stacks = [Cn.start(this, e.top[0], s)], this.fragments = i.length && this.stream.end - s > e.bufferLength * 4 ? new eg(i, e.minRepeatTerm) : null;
  }
  get parsedPos() {
    return this.minStackPos;
  }
  // Move the parser forward. This will process all parse stacks at
  // `this.pos` and try to advance them to a further position. If no
  // stack for such a position is found, it'll start error-recovery.
  //
  // When the parse is finished, this will return a syntax tree. When
  // not, it returns `null`.
  advance() {
    let e = this.stacks, t = this.minStackPos, i = this.stacks = [], r, s;
    if (this.bigReductionCount > 300 && e.length == 1) {
      let [l] = e;
      for (; l.forceReduce() && l.stack.length && l.stack[l.stack.length - 2] >= this.lastBigReductionStart; )
        ;
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let l = 0; l < e.length; l++) {
      let o = e[l];
      for (; ; ) {
        if (this.tokens.mainToken = null, o.pos > t)
          i.push(o);
        else {
          if (this.advanceStack(o, i, e))
            continue;
          {
            r || (r = [], s = []), r.push(o);
            let a = this.tokens.getMainToken(o);
            s.push(a.value, a.end);
          }
        }
        break;
      }
    }
    if (!i.length) {
      let l = r && rg(r);
      if (l)
        return ye && console.log("Finish with " + this.stackID(l)), this.stackToTree(l);
      if (this.parser.strict)
        throw ye && r && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + t);
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && r) {
      let l = this.stoppedAt != null && r[0].pos > this.stoppedAt ? r[0] : this.runRecovery(r, s, i);
      if (l)
        return ye && console.log("Force-finish " + this.stackID(l)), this.stackToTree(l.forceAll());
    }
    if (this.recovering) {
      let l = this.recovering == 1 ? 1 : this.recovering * 3;
      if (i.length > l)
        for (i.sort((o, a) => a.score - o.score); i.length > l; )
          i.pop();
      i.some((o) => o.reducePos > t) && this.recovering--;
    } else if (i.length > 1) {
      e: for (let l = 0; l < i.length - 1; l++) {
        let o = i[l];
        for (let a = l + 1; a < i.length; a++) {
          let h = i[a];
          if (o.sameState(h) || o.buffer.length > 500 && h.buffer.length > 500)
            if ((o.score - h.score || o.buffer.length - h.buffer.length) > 0)
              i.splice(a--, 1);
            else {
              i.splice(l--, 1);
              continue e;
            }
        }
      }
      i.length > 12 && (i.sort((l, o) => o.score - l.score), i.splice(
        12,
        i.length - 12
        /* Rec.MaxStackCount */
      ));
    }
    this.minStackPos = i[0].pos;
    for (let l = 1; l < i.length; l++)
      i[l].pos < this.minStackPos && (this.minStackPos = i[l].pos);
    return null;
  }
  stopAt(e) {
    if (this.stoppedAt != null && this.stoppedAt < e)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = e;
  }
  // See if a given tree, or a descendant right at its start, can be
  // reused in the given stack.
  tryReuse(e, t, i, r) {
    if (!i)
      return null;
    let s = e.curContext && e.curContext.tracker.strict, l = s ? e.curContext.hash : 0;
    for (; i; ) {
      let o = this.parser.nodeSet.types[i.type.id] != i.type ? -1 : this.parser.getGoto(e.state, i.type.id);
      if (o > -1 && i.length && (!s || (i.prop(C.contextHash) || 0) == l))
        return e.useNode(i, o, t), i;
      if (i.children.length == 0 || i.positions[0] > 0)
        break;
      let a = i.children[0];
      if (a instanceof N && (!r || a.type.id >= this.parser.minRepeatTerm))
        i = a;
      else
        break;
    }
    return null;
  }
  // Returns an updated version of the given stack, or null if the
  // stack can't advance normally. When `split` and `stacks` are
  // given, stacks split off by ambiguous operations will be pushed to
  // `split`, or added to `stacks` if they move `pos` forward.
  advanceStack(e, t, i) {
    let r = e.pos, { parser: s } = this, l = ye ? this.stackID(e) + " -> " : "";
    if (this.stoppedAt != null && r > this.stoppedAt)
      return e.forceReduce() ? e : null;
    if (this.fragments) {
      let h = e.reducePos < r && e.buffer.length && e.buffer[e.buffer.length - 2] <= e.reducePos && this.fragments.lastRepeatPos == e.reducePos && this.tryReuse(e, e.reducePos, this.fragments.lastRepeat, !0) || this.tryReuse(e, r, this.fragments.nodeAt(r), !1);
      if (h)
        return ye && console.log(l + this.stackID(e) + ` (via reuse of ${s.getName(h.type.id)})`), !0;
    }
    let o = s.stateSlot(
      e.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (o > 0)
      return e.reduce(o), ye && console.log(l + this.stackID(e) + ` (via always-reduce ${s.getName(
        o & 65535
        /* Action.ValueMask */
      )})`), !0;
    if (e.stack.length >= 8400)
      for (; e.stack.length > 6e3 && e.forceReduce(); )
        ;
    let a = this.tokens.getActions(e);
    for (let h = 0; h < a.length; ) {
      let O = a[h++], c = a[h++], f = a[h++], u = h == a.length || !i, d = u ? e : e.split(), p = this.tokens.mainToken;
      if (d.apply(O, c, p ? p.start : d.pos, f), ye && console.log(l + this.stackID(d) + ` (via ${(O & 65536) == 0 ? "shift" : `reduce of ${s.getName(
        O & 65535
        /* Action.ValueMask */
      )}`} for ${s.getName(c)} @ ${r}${d == e ? "" : ", split"})`), u)
        return !0;
      d.pos > r ? t.push(d) : i.push(d);
    }
    return !1;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(e, t) {
    let i = e.pos;
    for (; ; ) {
      if (!this.advanceStack(e, null, null))
        return !1;
      if (e.pos > i)
        return Zo(e, t), !0;
    }
  }
  runRecovery(e, t, i) {
    let r = null, s = !1;
    for (let l = 0; l < e.length; l++) {
      let o = e[l], a = t[l << 1], h = t[(l << 1) + 1], O = ye ? this.stackID(o) + " -> " : "";
      if (o.deadEnd && (s || (s = !0, o.restart(), ye && console.log(O + this.stackID(o) + " (restarted)"), this.advanceFully(o, i))))
        continue;
      let c = o.split(), f = O;
      for (let u = 0; u < 10 && c.forceReduce() && (ye && console.log(f + this.stackID(c) + " (via force-reduce)"), !this.advanceFully(c, i)); u++)
        ye && (f = this.stackID(c) + " -> ");
      for (let u of o.recoverByInsert(a))
        ye && console.log(O + this.stackID(u) + " (via recover-insert)"), this.advanceFully(u, i);
      this.stream.end > o.pos ? (h == o.pos && (h++, a = 0), o.recoverByDelete(a, h), ye && console.log(O + this.stackID(o) + ` (via recover-delete ${this.parser.getName(a)})`), Zo(o, i)) : (!r || r.score < c.score) && (r = c);
    }
    return r;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(e) {
    return e.close(), N.build({
      buffer: An.create(e),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: e.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(e) {
    let t = (Sr || (Sr = /* @__PURE__ */ new WeakMap())).get(e);
    return t || Sr.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
  }
}
function Zo(n, e) {
  for (let t = 0; t < e.length; t++) {
    let i = e[t];
    if (i.pos == n.pos && i.sameState(n)) {
      e[t].score < n.score && (e[t] = n);
      return;
    }
  }
  e.push(n);
}
class ng {
  constructor(e, t, i) {
    this.source = e, this.flags = t, this.disabled = i;
  }
  allows(e) {
    return !this.disabled || this.disabled[e] == 0;
  }
}
const br = (n) => n;
class bO {
  /**
  Define a context tracker.
  */
  constructor(e) {
    this.start = e.start, this.shift = e.shift || br, this.reduce = e.reduce || br, this.reuse = e.reuse || br, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
  }
}
class Rt extends vh {
  /**
  @internal
  */
  constructor(e) {
    if (super(), this.wrappers = [], e.version != 14)
      throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
    let t = e.nodeNames.split(" ");
    this.minRepeatTerm = t.length;
    for (let o = 0; o < e.repeatNodeCount; o++)
      t.push("");
    let i = Object.keys(e.topRules).map((o) => e.topRules[o][1]), r = [];
    for (let o = 0; o < t.length; o++)
      r.push([]);
    function s(o, a, h) {
      r[o].push([a, a.deserialize(String(h))]);
    }
    if (e.nodeProps)
      for (let o of e.nodeProps) {
        let a = o[0];
        typeof a == "string" && (a = C[a]);
        for (let h = 1; h < o.length; ) {
          let O = o[h++];
          if (O >= 0)
            s(O, a, o[h++]);
          else {
            let c = o[h + -O];
            for (let f = -O; f > 0; f--)
              s(o[h++], a, c);
            h++;
          }
        }
      }
    this.nodeSet = new zs(t.map((o, a) => me.define({
      name: a >= this.minRepeatTerm ? void 0 : o,
      id: a,
      props: r[a],
      top: i.indexOf(a) > -1,
      error: a == 0,
      skipped: e.skippedNodes && e.skippedNodes.indexOf(a) > -1
    }))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = yh;
    let l = di(e.tokenData);
    this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let o = 0; o < this.specializerSpecs.length; o++)
      this.specialized[o] = this.specializerSpecs[o].term;
    this.specializers = this.specializerSpecs.map(To), this.states = di(e.states, Uint32Array), this.data = di(e.stateData), this.goto = di(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((o) => typeof o == "number" ? new Dt(l, o) : o), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(e, t, i) {
    let r = new ig(this, e, t, i);
    for (let s of this.wrappers)
      r = s(r, e, t, i);
    return r;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(e, t, i = !1) {
    let r = this.goto;
    if (t >= r[0])
      return -1;
    for (let s = r[t + 1]; ; ) {
      let l = r[s++], o = l & 1, a = r[s++];
      if (o && i)
        return a;
      for (let h = s + (l >> 1); s < h; s++)
        if (r[s] == e)
          return a;
      if (o)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(e, t) {
    let i = this.data;
    for (let r = 0; r < 2; r++)
      for (let s = this.stateSlot(
        e,
        r ? 2 : 1
        /* ParseState.Actions */
      ), l; ; s += 3) {
        if ((l = i[s]) == 65535)
          if (i[s + 1] == 1)
            l = i[s = nt(i, s + 2)];
          else {
            if (i[s + 1] == 2)
              return nt(i, s + 2);
            break;
          }
        if (l == t || l == 0)
          return nt(i, s + 1);
      }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(e, t) {
    return this.states[e * 6 + t];
  }
  /**
  @internal
  */
  stateFlag(e, t) {
    return (this.stateSlot(
      e,
      0
      /* ParseState.Flags */
    ) & t) > 0;
  }
  /**
  @internal
  */
  validAction(e, t) {
    return !!this.allActions(e, (i) => i == t ? !0 : null);
  }
  /**
  @internal
  */
  allActions(e, t) {
    let i = this.stateSlot(
      e,
      4
      /* ParseState.DefaultReduce */
    ), r = i ? t(i) : void 0;
    for (let s = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); r == null; s += 3) {
      if (this.data[s] == 65535)
        if (this.data[s + 1] == 1)
          s = nt(this.data, s + 2);
        else
          break;
      r = t(nt(this.data, s + 1));
    }
    return r;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(e) {
    let t = [];
    for (let i = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); ; i += 3) {
      if (this.data[i] == 65535)
        if (this.data[i + 1] == 1)
          i = nt(this.data, i + 2);
        else
          break;
      if ((this.data[i + 2] & 1) == 0) {
        let r = this.data[i + 1];
        t.some((s, l) => l & 1 && s == r) || t.push(this.data[i], r);
      }
    }
    return t;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(e) {
    let t = Object.assign(Object.create(Rt.prototype), this);
    if (e.props && (t.nodeSet = this.nodeSet.extend(...e.props)), e.top) {
      let i = this.topRules[e.top];
      if (!i)
        throw new RangeError(`Invalid top rule name ${e.top}`);
      t.top = i;
    }
    return e.tokenizers && (t.tokenizers = this.tokenizers.map((i) => {
      let r = e.tokenizers.find((s) => s.from == i);
      return r ? r.to : i;
    })), e.specializers && (t.specializers = this.specializers.slice(), t.specializerSpecs = this.specializerSpecs.map((i, r) => {
      let s = e.specializers.find((o) => o.from == i.external);
      if (!s)
        return i;
      let l = Object.assign(Object.assign({}, i), { external: s.to });
      return t.specializers[r] = To(l), l;
    })), e.contextTracker && (t.context = e.contextTracker), e.dialect && (t.dialect = this.parseDialect(e.dialect)), e.strict != null && (t.strict = e.strict), e.wrap && (t.wrappers = t.wrappers.concat(e.wrap)), e.bufferLength != null && (t.bufferLength = e.bufferLength), t;
  }
  /**
  Tells you whether any [parse wrappers](#lr.ParserConfig.wrap)
  are registered for this parser.
  */
  hasWrappers() {
    return this.wrappers.length > 0;
  }
  /**
  Returns the name associated with a given term. This will only
  work for all terms when the parser was generated with the
  `--names` option. By default, only the names of tagged terms are
  stored.
  */
  getName(e) {
    return this.termNames ? this.termNames[e] : String(e <= this.maxNode && this.nodeSet.types[e].name || e);
  }
  /**
  The eof term id is always allocated directly after the node
  types. @internal
  */
  get eofTerm() {
    return this.maxNode + 1;
  }
  /**
  The type of top node produced by the parser.
  */
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  /**
  @internal
  */
  dynamicPrecedence(e) {
    let t = this.dynamicPrecedences;
    return t == null ? 0 : t[e] || 0;
  }
  /**
  @internal
  */
  parseDialect(e) {
    let t = Object.keys(this.dialects), i = t.map(() => !1);
    if (e)
      for (let s of e.split(" ")) {
        let l = t.indexOf(s);
        l >= 0 && (i[l] = !0);
      }
    let r = null;
    for (let s = 0; s < t.length; s++)
      if (!i[s])
        for (let l = this.dialects[t[s]], o; (o = this.data[l++]) != 65535; )
          (r || (r = new Uint8Array(this.maxTerm + 1)))[o] = 1;
    return new ng(e, i, r);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(e) {
    return new Rt(e);
  }
}
function nt(n, e) {
  return n[e] | n[e + 1] << 16;
}
function rg(n) {
  let e = null;
  for (let t of n) {
    let i = t.p.stoppedAt;
    (t.pos == t.p.stream.end || i != null && t.pos > i) && t.p.parser.stateFlag(
      t.state,
      2
      /* StateFlag.Accepting */
    ) && (!e || e.score < t.score) && (e = t);
  }
  return e;
}
function To(n) {
  if (n.external) {
    let e = n.extend ? 1 : 0;
    return (t, i) => n.external(t, i) << 1 | e;
  }
  return n.get;
}
const sg = 55, lg = 1, og = 56, ag = 2, hg = 57, Og = 3, Ro = 4, cg = 5, Ns = 6, yO = 7, PO = 8, xO = 9, kO = 10, fg = 11, ug = 12, dg = 13, yr = 58, pg = 14, gg = 15, Co = 59, wO = 21, mg = 23, vO = 24, $g = 25, bs = 27, XO = 28, Qg = 29, Sg = 32, bg = 35, yg = 37, Pg = 38, xg = 0, kg = 1, wg = {
  area: !0,
  base: !0,
  br: !0,
  col: !0,
  command: !0,
  embed: !0,
  frame: !0,
  hr: !0,
  img: !0,
  input: !0,
  keygen: !0,
  link: !0,
  meta: !0,
  param: !0,
  source: !0,
  track: !0,
  wbr: !0,
  menuitem: !0
}, vg = {
  dd: !0,
  li: !0,
  optgroup: !0,
  option: !0,
  p: !0,
  rp: !0,
  rt: !0,
  tbody: !0,
  td: !0,
  tfoot: !0,
  th: !0,
  tr: !0
}, Ao = {
  dd: { dd: !0, dt: !0 },
  dt: { dd: !0, dt: !0 },
  li: { li: !0 },
  option: { option: !0, optgroup: !0 },
  optgroup: { optgroup: !0 },
  p: {
    address: !0,
    article: !0,
    aside: !0,
    blockquote: !0,
    dir: !0,
    div: !0,
    dl: !0,
    fieldset: !0,
    footer: !0,
    form: !0,
    h1: !0,
    h2: !0,
    h3: !0,
    h4: !0,
    h5: !0,
    h6: !0,
    header: !0,
    hgroup: !0,
    hr: !0,
    menu: !0,
    nav: !0,
    ol: !0,
    p: !0,
    pre: !0,
    section: !0,
    table: !0,
    ul: !0
  },
  rp: { rp: !0, rt: !0 },
  rt: { rp: !0, rt: !0 },
  tbody: { tbody: !0, tfoot: !0 },
  td: { td: !0, th: !0 },
  tfoot: { tbody: !0 },
  th: { td: !0, th: !0 },
  thead: { tbody: !0, tfoot: !0 },
  tr: { tr: !0 }
};
function Xg(n) {
  return n == 45 || n == 46 || n == 58 || n >= 65 && n <= 90 || n == 95 || n >= 97 && n <= 122 || n >= 161;
}
let jo = null, Wo = null, _o = 0;
function ys(n, e) {
  let t = n.pos + e;
  if (_o == t && Wo == n) return jo;
  let i = n.peek(e), r = "";
  for (; Xg(i); )
    r += String.fromCharCode(i), i = n.peek(++e);
  return Wo = n, _o = t, jo = r ? r.toLowerCase() : i == Zg || i == Tg ? void 0 : null;
}
const ZO = 60, Wn = 62, Fs = 47, Zg = 63, Tg = 33, Rg = 45;
function Mo(n, e) {
  this.name = n, this.parent = e;
}
const Cg = [Ns, kO, yO, PO, xO], Ag = new bO({
  start: null,
  shift(n, e, t, i) {
    return Cg.indexOf(e) > -1 ? new Mo(ys(i, 1) || "", n) : n;
  },
  reduce(n, e) {
    return e == wO && n ? n.parent : n;
  },
  reuse(n, e, t, i) {
    let r = e.type.id;
    return r == Ns || r == yg ? new Mo(ys(i, 1) || "", n) : n;
  },
  strict: !1
}), jg = new ce((n, e) => {
  if (n.next != ZO) {
    n.next < 0 && e.context && n.acceptToken(yr);
    return;
  }
  n.advance();
  let t = n.next == Fs;
  t && n.advance();
  let i = ys(n, 0);
  if (i === void 0) return;
  if (!i) return n.acceptToken(t ? gg : pg);
  let r = e.context ? e.context.name : null;
  if (t) {
    if (i == r) return n.acceptToken(fg);
    if (r && vg[r]) return n.acceptToken(yr, -2);
    if (e.dialectEnabled(xg)) return n.acceptToken(ug);
    for (let s = e.context; s; s = s.parent) if (s.name == i) return;
    n.acceptToken(dg);
  } else {
    if (i == "script") return n.acceptToken(yO);
    if (i == "style") return n.acceptToken(PO);
    if (i == "textarea") return n.acceptToken(xO);
    if (wg.hasOwnProperty(i)) return n.acceptToken(kO);
    r && Ao[r] && Ao[r][i] ? n.acceptToken(yr, -1) : n.acceptToken(Ns);
  }
}, { contextual: !0 }), Wg = new ce((n) => {
  for (let e = 0, t = 0; ; t++) {
    if (n.next < 0) {
      t && n.acceptToken(Co);
      break;
    }
    if (n.next == Rg)
      e++;
    else if (n.next == Wn && e >= 2) {
      t >= 3 && n.acceptToken(Co, -2);
      break;
    } else
      e = 0;
    n.advance();
  }
});
function _g(n) {
  for (; n; n = n.parent)
    if (n.name == "svg" || n.name == "math") return !0;
  return !1;
}
const Mg = new ce((n, e) => {
  if (n.next == Fs && n.peek(1) == Wn) {
    let t = e.dialectEnabled(kg) || _g(e.context);
    n.acceptToken(t ? cg : Ro, 2);
  } else n.next == Wn && n.acceptToken(Ro, 1);
});
function Hs(n, e, t) {
  let i = 2 + n.length;
  return new ce((r) => {
    for (let s = 0, l = 0, o = 0; ; o++) {
      if (r.next < 0) {
        o && r.acceptToken(e);
        break;
      }
      if (s == 0 && r.next == ZO || s == 1 && r.next == Fs || s >= 2 && s < i && r.next == n.charCodeAt(s - 2))
        s++, l++;
      else if (s == i && r.next == Wn) {
        o > l ? r.acceptToken(e, -l) : r.acceptToken(t, -(l - 2));
        break;
      } else if ((r.next == 10 || r.next == 13) && o) {
        r.acceptToken(e, 1);
        break;
      } else
        s = l = 0;
      r.advance();
    }
  });
}
const qg = Hs("script", sg, lg), Yg = Hs("style", og, ag), zg = Hs("textarea", hg, Og), Eg = _i({
  "Text RawText IncompleteTag IncompleteCloseTag": g.content,
  "StartTag StartCloseTag SelfClosingEndTag EndTag": g.angleBracket,
  TagName: g.tagName,
  "MismatchedCloseTag/TagName": [g.tagName, g.invalid],
  AttributeName: g.attributeName,
  "AttributeValue UnquotedAttributeValue": g.attributeValue,
  Is: g.definitionOperator,
  "EntityReference CharacterReference": g.character,
  Comment: g.blockComment,
  ProcessingInst: g.processingInstruction,
  DoctypeDecl: g.documentMeta
}), Ug = Rt.deserialize({
  version: 14,
  states: ",xOVO!rOOO!ZQ#tO'#CrO!`Q#tO'#C{O!eQ#tO'#DOO!jQ#tO'#DRO!oQ#tO'#DTO!tOaO'#CqO#PObO'#CqO#[OdO'#CqO$kO!rO'#CqOOO`'#Cq'#CqO$rO$fO'#DUO$zQ#tO'#DWO%PQ#tO'#DXOOO`'#Dl'#DlOOO`'#DZ'#DZQVO!rOOO%UQ&rO,59^O%aQ&rO,59gO%lQ&rO,59jO%wQ&rO,59mO&SQ&rO,59oOOOa'#D_'#D_O&_OaO'#CyO&jOaO,59]OOOb'#D`'#D`O&rObO'#C|O&}ObO,59]OOOd'#Da'#DaO'VOdO'#DPO'bOdO,59]OOO`'#Db'#DbO'jO!rO,59]O'qQ#tO'#DSOOO`,59],59]OOOp'#Dc'#DcO'vO$fO,59pOOO`,59p,59pO(OQ#|O,59rO(TQ#|O,59sOOO`-E7X-E7XO(YQ&rO'#CtOOQW'#D['#D[O(hQ&rO1G.xOOOa1G.x1G.xOOO`1G/Z1G/ZO(sQ&rO1G/ROOOb1G/R1G/RO)OQ&rO1G/UOOOd1G/U1G/UO)ZQ&rO1G/XOOO`1G/X1G/XO)fQ&rO1G/ZOOOa-E7]-E7]O)qQ#tO'#CzOOO`1G.w1G.wOOOb-E7^-E7^O)vQ#tO'#C}OOOd-E7_-E7_O){Q#tO'#DQOOO`-E7`-E7`O*QQ#|O,59nOOOp-E7a-E7aOOO`1G/[1G/[OOO`1G/^1G/^OOO`1G/_1G/_O*VQ,UO,59`OOQW-E7Y-E7YOOOa7+$d7+$dOOO`7+$u7+$uOOOb7+$m7+$mOOOd7+$p7+$pOOO`7+$s7+$sO*bQ#|O,59fO*gQ#|O,59iO*lQ#|O,59lOOO`1G/Y1G/YO*qO7[O'#CwO+SOMhO'#CwOOQW1G.z1G.zOOO`1G/Q1G/QOOO`1G/T1G/TOOO`1G/W1G/WOOOO'#D]'#D]O+eO7[O,59cOOQW,59c,59cOOOO'#D^'#D^O+vOMhO,59cOOOO-E7Z-E7ZOOQW1G.}1G.}OOOO-E7[-E7[",
  stateData: ",c~O!_OS~OUSOVPOWQOXROYTO[]O][O^^O_^Oa^Ob^Oc^Od^Oy^O|_O!eZO~OgaO~OgbO~OgcO~OgdO~OgeO~O!XfOPmP![mP~O!YiOQpP![pP~O!ZlORsP![sP~OUSOVPOWQOXROYTOZqO[]O][O^^O_^Oa^Ob^Oc^Od^Oy^O!eZO~O![rO~P#gO!]sO!fuO~OgvO~OgwO~OS|OT}OiyO~OS!POT}OiyO~OS!ROT}OiyO~OS!TOT}OiyO~OS}OT}OiyO~O!XfOPmX![mX~OP!WO![!XO~O!YiOQpX![pX~OQ!ZO![!XO~O!ZlORsX![sX~OR!]O![!XO~O![!XO~P#gOg!_O~O!]sO!f!aO~OS!bO~OS!cO~Oj!dOShXThXihX~OS!fOT!gOiyO~OS!hOT!gOiyO~OS!iOT!gOiyO~OS!jOT!gOiyO~OS!gOT!gOiyO~Og!kO~Og!lO~Og!mO~OS!nO~Ol!qO!a!oO!c!pO~OS!rO~OS!sO~OS!tO~Ob!uOc!uOd!uO!a!wO!b!uO~Ob!xOc!xOd!xO!c!wO!d!xO~Ob!uOc!uOd!uO!a!{O!b!uO~Ob!xOc!xOd!xO!c!{O!d!xO~OT~cbd!ey|!e~",
  goto: "%q!aPPPPPPPPPPPPPPPPPPPPP!b!hP!nPP!zP!}#Q#T#Z#^#a#g#j#m#s#y!bP!b!bP$P$V$m$s$y%P%V%]%cPPPPPPPP%iX^OX`pXUOX`pezabcde{!O!Q!S!UR!q!dRhUR!XhXVOX`pRkVR!XkXWOX`pRnWR!XnXXOX`pQrXR!XpXYOX`pQ`ORx`Q{aQ!ObQ!QcQ!SdQ!UeZ!e{!O!Q!S!UQ!v!oR!z!vQ!y!pR!|!yQgUR!VgQjVR!YjQmWR![mQpXR!^pQtZR!`tS_O`ToXp",
  nodeNames: "⚠ StartCloseTag StartCloseTag StartCloseTag EndTag SelfClosingEndTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteTag IncompleteCloseTag Document Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName Attribute AttributeName Is AttributeValue UnquotedAttributeValue ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag CloseTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl",
  maxTerm: 68,
  context: Ag,
  nodeProps: [
    ["closedBy", -10, 1, 2, 3, 7, 8, 9, 10, 11, 12, 13, "EndTag", 6, "EndTag SelfClosingEndTag", -4, 22, 31, 34, 37, "CloseTag"],
    ["openedBy", 4, "StartTag StartCloseTag", 5, "StartTag", -4, 30, 33, 36, 38, "OpenTag"],
    ["group", -10, 14, 15, 18, 19, 20, 21, 40, 41, 42, 43, "Entity", 17, "Entity TextContent", -3, 29, 32, 35, "TextContent Entity"],
    ["isolate", -11, 22, 30, 31, 33, 34, 36, 37, 38, 39, 42, 43, "ltr", -3, 27, 28, 40, ""]
  ],
  propSources: [Eg],
  skippedNodes: [0],
  repeatNodeCount: 9,
  tokenData: "!<p!aR!YOX$qXY,QYZ,QZ[$q[]&X]^,Q^p$qpq,Qqr-_rs3_sv-_vw3}wxHYx}-_}!OH{!O!P-_!P!Q$q!Q![-_![!]Mz!]!^-_!^!_!$S!_!`!;x!`!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4U-_4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!Z$|caPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr$qrs&}sv$qvw+Pwx(tx!^$q!^!_*V!_!a&X!a#S$q#S#T&X#T;'S$q;'S;=`+z<%lO$q!R&bXaP!b`!dpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&Xq'UVaP!dpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}P'pTaPOv'kw!^'k!_;'S'k;'S;=`(P<%lO'kP(SP;=`<%l'kp([S!dpOv(Vx;'S(V;'S;=`(h<%lO(Vp(kP;=`<%l(Vq(qP;=`<%l&}a({WaP!b`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t`)jT!b`Or)esv)ew;'S)e;'S;=`)y<%lO)e`)|P;=`<%l)ea*SP;=`<%l(t!Q*^V!b`!dpOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!Q*vP;=`<%l*V!R*|P;=`<%l&XW+UYlWOX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+PW+wP;=`<%l+P!Z+}P;=`<%l$q!a,]`aP!b`!dp!_^OX&XXY,QYZ,QZ]&X]^,Q^p&Xpq,Qqr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!_-ljiSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q[/ebiSlWOX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+PS0rXiSqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0mS1bP;=`<%l0m[1hP;=`<%l/^!V1vciSaP!b`!dpOq&Xqr1krs&}sv1kvw0mwx(tx!P1k!P!Q&X!Q!^1k!^!_*V!_!a&X!a#s1k#s$f&X$f;'S1k;'S;=`3R<%l?Ah1k?Ah?BY&X?BY?Mn1k?MnO&X!V3UP;=`<%l1k!_3[P;=`<%l-_!Z3hV!ahaP!dpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}!_4WiiSlWd!ROX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst>]tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^/^!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!Z5zblWOX5uXZ7SZ[5u[^7S^p5uqr5urs7Sst+Ptw5uwx7Sx!]5u!]!^7w!^!a7S!a#S5u#S#T7S#T;'S5u;'S;=`8n<%lO5u!R7VVOp7Sqs7St!]7S!]!^7l!^;'S7S;'S;=`7q<%lO7S!R7qOb!R!R7tP;=`<%l7S!Z8OYlWb!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!Z8qP;=`<%l5u!_8{iiSlWOX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst/^tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^:j!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!_:sbiSlWb!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!V<QciSOp7Sqr;{rs7Sst0mtw;{wx7Sx!P;{!P!Q7S!Q!];{!]!^=]!^!a7S!a#s;{#s$f7S$f;'S;{;'S;=`>P<%l?Ah;{?Ah?BY7S?BY?Mn;{?MnO7S!V=dXiSb!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!V>SP;=`<%l;{!_>YP;=`<%l8t!_>dhiSlWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^/^!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!Z@TalWOX@OXZAYZ[@O[^AY^p@Oqr@OrsAYsw@OwxAYx!]@O!]!^Az!^!aAY!a#S@O#S#TAY#T;'S@O;'S;=`Bq<%lO@O!RA]UOpAYq!]AY!]!^Ao!^;'SAY;'S;=`At<%lOAY!RAtOc!R!RAwP;=`<%lAY!ZBRYlWc!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!ZBtP;=`<%l@O!_COhiSlWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^Dj!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!_DsbiSlWc!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!VFQbiSOpAYqrE{rsAYswE{wxAYx!PE{!P!QAY!Q!]E{!]!^GY!^!aAY!a#sE{#s$fAY$f;'SE{;'S;=`G|<%l?AhE{?Ah?BYAY?BY?MnE{?MnOAY!VGaXiSc!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!VHPP;=`<%lE{!_HVP;=`<%lBw!ZHcW!cxaP!b`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t!aIYliSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OKQ!O!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!aK_kiSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!`&X!`!aMS!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!TM_XaP!b`!dp!fQOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!aNZ!ZiSgQaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OMz!O!PMz!P!Q$q!Q![Mz![!]Mz!]!^-_!^!_*V!_!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f$}-_$}%OMz%O%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4UMz4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Je-_$Je$JgMz$Jg$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!a!$PP;=`<%lMz!R!$ZY!b`!dpOq*Vqr!$yrs(Vsv*Vwx)ex!a*V!a!b!4t!b;'S*V;'S;=`*s<%lO*V!R!%Q]!b`!dpOr*Vrs(Vsv*Vwx)ex}*V}!O!%y!O!f*V!f!g!']!g#W*V#W#X!0`#X;'S*V;'S;=`*s<%lO*V!R!&QX!b`!dpOr*Vrs(Vsv*Vwx)ex}*V}!O!&m!O;'S*V;'S;=`*s<%lO*V!R!&vV!b`!dp!ePOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!'dX!b`!dpOr*Vrs(Vsv*Vwx)ex!q*V!q!r!(P!r;'S*V;'S;=`*s<%lO*V!R!(WX!b`!dpOr*Vrs(Vsv*Vwx)ex!e*V!e!f!(s!f;'S*V;'S;=`*s<%lO*V!R!(zX!b`!dpOr*Vrs(Vsv*Vwx)ex!v*V!v!w!)g!w;'S*V;'S;=`*s<%lO*V!R!)nX!b`!dpOr*Vrs(Vsv*Vwx)ex!{*V!{!|!*Z!|;'S*V;'S;=`*s<%lO*V!R!*bX!b`!dpOr*Vrs(Vsv*Vwx)ex!r*V!r!s!*}!s;'S*V;'S;=`*s<%lO*V!R!+UX!b`!dpOr*Vrs(Vsv*Vwx)ex!g*V!g!h!+q!h;'S*V;'S;=`*s<%lO*V!R!+xY!b`!dpOr!+qrs!,hsv!+qvw!-Swx!.[x!`!+q!`!a!/j!a;'S!+q;'S;=`!0Y<%lO!+qq!,mV!dpOv!,hvx!-Sx!`!,h!`!a!-q!a;'S!,h;'S;=`!.U<%lO!,hP!-VTO!`!-S!`!a!-f!a;'S!-S;'S;=`!-k<%lO!-SP!-kO|PP!-nP;=`<%l!-Sq!-xS!dp|POv(Vx;'S(V;'S;=`(h<%lO(Vq!.XP;=`<%l!,ha!.aX!b`Or!.[rs!-Ssv!.[vw!-Sw!`!.[!`!a!.|!a;'S!.[;'S;=`!/d<%lO!.[a!/TT!b`|POr)esv)ew;'S)e;'S;=`)y<%lO)ea!/gP;=`<%l!.[!R!/sV!b`!dp|POr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!0]P;=`<%l!+q!R!0gX!b`!dpOr*Vrs(Vsv*Vwx)ex#c*V#c#d!1S#d;'S*V;'S;=`*s<%lO*V!R!1ZX!b`!dpOr*Vrs(Vsv*Vwx)ex#V*V#V#W!1v#W;'S*V;'S;=`*s<%lO*V!R!1}X!b`!dpOr*Vrs(Vsv*Vwx)ex#h*V#h#i!2j#i;'S*V;'S;=`*s<%lO*V!R!2qX!b`!dpOr*Vrs(Vsv*Vwx)ex#m*V#m#n!3^#n;'S*V;'S;=`*s<%lO*V!R!3eX!b`!dpOr*Vrs(Vsv*Vwx)ex#d*V#d#e!4Q#e;'S*V;'S;=`*s<%lO*V!R!4XX!b`!dpOr*Vrs(Vsv*Vwx)ex#X*V#X#Y!+q#Y;'S*V;'S;=`*s<%lO*V!R!4{Y!b`!dpOr!4trs!5ksv!4tvw!6Vwx!8]x!a!4t!a!b!:]!b;'S!4t;'S;=`!;r<%lO!4tq!5pV!dpOv!5kvx!6Vx!a!5k!a!b!7W!b;'S!5k;'S;=`!8V<%lO!5kP!6YTO!a!6V!a!b!6i!b;'S!6V;'S;=`!7Q<%lO!6VP!6lTO!`!6V!`!a!6{!a;'S!6V;'S;=`!7Q<%lO!6VP!7QOyPP!7TP;=`<%l!6Vq!7]V!dpOv!5kvx!6Vx!`!5k!`!a!7r!a;'S!5k;'S;=`!8V<%lO!5kq!7yS!dpyPOv(Vx;'S(V;'S;=`(h<%lO(Vq!8YP;=`<%l!5ka!8bX!b`Or!8]rs!6Vsv!8]vw!6Vw!a!8]!a!b!8}!b;'S!8];'S;=`!:V<%lO!8]a!9SX!b`Or!8]rs!6Vsv!8]vw!6Vw!`!8]!`!a!9o!a;'S!8];'S;=`!:V<%lO!8]a!9vT!b`yPOr)esv)ew;'S)e;'S;=`)y<%lO)ea!:YP;=`<%l!8]!R!:dY!b`!dpOr!4trs!5ksv!4tvw!6Vwx!8]x!`!4t!`!a!;S!a;'S!4t;'S;=`!;r<%lO!4t!R!;]V!b`!dpyPOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!;uP;=`<%l!4t!V!<TXjSaP!b`!dpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X",
  tokenizers: [qg, Yg, zg, Mg, jg, Wg, 0, 1, 2, 3, 4, 5],
  topRules: { Document: [0, 16] },
  dialects: { noMatch: 0, selfClosing: 515 },
  tokenPrec: 517
});
function TO(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let i of n.getChildren(vO)) {
    let r = i.getChild($g), s = i.getChild(bs) || i.getChild(XO);
    r && (t[e.read(r.from, r.to)] = s ? s.type.id == bs ? e.read(s.from + 1, s.to - 1) : e.read(s.from, s.to) : "");
  }
  return t;
}
function qo(n, e) {
  let t = n.getChild(mg);
  return t ? e.read(t.from, t.to) : " ";
}
function Pr(n, e, t) {
  let i;
  for (let r of t)
    if (!r.attrs || r.attrs(i || (i = TO(n.node.parent.firstChild, e))))
      return { parser: r.parser, bracketed: !0 };
  return null;
}
function RO(n = [], e = []) {
  let t = [], i = [], r = [], s = [];
  for (let o of n)
    (o.tag == "script" ? t : o.tag == "style" ? i : o.tag == "textarea" ? r : s).push(o);
  let l = e.length ? /* @__PURE__ */ Object.create(null) : null;
  for (let o of e) (l[o.name] || (l[o.name] = [])).push(o);
  return Xh((o, a) => {
    let h = o.type.id;
    if (h == Qg) return Pr(o, a, t);
    if (h == Sg) return Pr(o, a, i);
    if (h == bg) return Pr(o, a, r);
    if (h == wO && s.length) {
      let O = o.node, c = O.firstChild, f = c && qo(c, a), u;
      if (f) {
        for (let d of s)
          if (d.tag == f && (!d.attrs || d.attrs(u || (u = TO(c, a))))) {
            let p = O.lastChild, m = p.type.id == Pg ? p.from : O.to;
            if (m > c.to)
              return { parser: d.parser, overlay: [{ from: c.to, to: m }] };
          }
      }
    }
    if (l && h == vO) {
      let O = o.node, c;
      if (c = O.firstChild) {
        let f = l[a.read(c.from, c.to)];
        if (f) for (let u of f) {
          if (u.tagName && u.tagName != qo(O.parent, a)) continue;
          let d = O.lastChild;
          if (d.type.id == bs) {
            let p = d.from + 1, m = d.lastChild, $ = d.to - (m && m.isError ? 0 : 1);
            if ($ > p) return { parser: u.parser, overlay: [{ from: p, to: $ }], bracketed: !0 };
          } else if (d.type.id == XO)
            return { parser: u.parser, overlay: [{ from: d.from, to: d.to }] };
        }
      }
    }
    return null;
  });
}
const Vg = 148, Yo = 1, Gg = 149, Dg = 150, CO = 2, Lg = 151, Bg = 3, Ig = 4, Ng = 152, AO = [
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
], Fg = 58, Hg = 40, jO = 95, Kg = 91, un = 45, Jg = 46, em = 35, tm = 37, im = 38, nm = 92, rm = 10, sm = 42;
function Zi(n) {
  return n >= 65 && n <= 90 || n >= 97 && n <= 122 || n >= 161;
}
function Ks(n) {
  return n >= 48 && n <= 57;
}
function zo(n) {
  return Ks(n) || n >= 97 && n <= 102 || n >= 65 && n <= 70;
}
const WO = (n, e, t) => (i, r) => {
  for (let s = !1, l = 0, o = 0; ; o++) {
    let { next: a } = i;
    if (Zi(a) || a == un || a == jO || s && Ks(a))
      !s && (a != un || o > 0) && (s = !0), l === o && a == un && l++, i.advance();
    else if (a == nm && i.peek(1) != rm) {
      if (i.advance(), zo(i.next)) {
        do
          i.advance();
        while (zo(i.next));
        i.next == 32 && i.advance();
      } else i.next > -1 && i.advance();
      s = !0;
    } else {
      s && i.acceptToken(
        l >= 2 && r.canShift(CO) ? e : a == Hg ? t : n
      );
      break;
    }
  }
}, lm = new ce(
  WO(Gg, CO, Dg),
  { contextual: !0 }
), om = new ce(
  WO(Lg, Bg, Ig),
  { contextual: !0 }
), am = new ce((n) => {
  if (AO.includes(n.peek(-1))) {
    let { next: e } = n;
    (Zi(e) || e == jO || e == em || e == Jg || e == sm || e == Kg || e == Fg && Zi(n.peek(1)) || e == un || e == im) && n.acceptToken(Vg);
  }
}), hm = new ce((n) => {
  if (!AO.includes(n.peek(-1))) {
    let { next: e } = n;
    if (e == tm && (n.advance(), n.acceptToken(Yo)), Zi(e)) {
      do
        n.advance();
      while (Zi(n.next) || Ks(n.next));
      n.acceptToken(Yo);
    }
  }
});
function Eo(n) {
  let e = n.length;
  return (e == 4 || e == 5 || e == 7 || e == 9) && /^#[a-f\d]+$/i.test(n) ? Ng : -1;
}
const Om = _i({
  "AtKeyword import charset namespace keyframes media supports font-feature-values": g.definitionKeyword,
  "from to selector scope MatchFlag": g.keyword,
  NamespaceName: g.namespace,
  KeyframeName: g.labelName,
  KeyframeRangeName: g.operatorKeyword,
  TagName: g.tagName,
  ClassName: g.className,
  PseudoClassName: g.constant(g.className),
  IdName: g.labelName,
  "FeatureName PropertyName": g.propertyName,
  AttributeName: g.attributeName,
  NumberLiteral: g.number,
  KeywordQuery: g.keyword,
  UnaryQueryOp: g.operatorKeyword,
  "CallTag ValueName FontName": g.atom,
  VariableName: g.variableName,
  Callee: g.operatorKeyword,
  Unit: g.unit,
  "UniversalSelector NestingSelector": g.definitionOperator,
  "MatchOp CompareOp": g.compareOperator,
  "ChildOp SiblingOp, LogicOp": g.logicOperator,
  BinOp: g.arithmeticOperator,
  Important: g.modifier,
  Comment: g.blockComment,
  ColorLiteral: g.color,
  "ParenthesizedContent StringLiteral": g.string,
  ":": g.punctuation,
  PseudoOp: g.derefOperator,
  "; , |": g.separator,
  "( )": g.paren,
  "[ ]": g.squareBracket,
  "{ }": g.brace
}), cm = { __proto__: null, lang: 44, "nth-child": 44, "nth-last-child": 44, "nth-of-type": 44, "nth-last-of-type": 44, dir: 44, "host-context": 44, if: 88, url: 158, "url-prefix": 158, domain: 158, regexp: 158 }, fm = { __proto__: null, or: 102, and: 102, not: 112, only: 112, layer: 212 }, um = { __proto__: null, selector: 118, style: 124, layer: 208 }, dm = { __proto__: null, "@import": 204, "@media": 216, "@charset": 220, "@namespace": 224, "@keyframes": 230, "@supports": 242, "@scope": 246, "@font-feature-values": 252 }, pm = { __proto__: null, to: 249 }, gm = Rt.deserialize({
  version: 14,
  states: "MrQYQdOOO$TQdOOP$[O`OOO%XQaO'#CfOOQP'#Ce'#CeO%`QdO'#CgO%eQ`O'#CgO%jQaO'#FrO&eQdO'#CkO'XQaO'#CcO'cQdO'#CnOOQP'#ES'#ESOOQP'#ER'#ERO'nQdO'#ETO'yQdO'#E[O'yQdO'#E_OOQP'#Fr'#FrO)`QhO'#FQOOQS'#Fq'#FqOOQS'#FT'#FTQYQdOOO)gQdO'#EeO*vQhO'#EkO)gQdO'#EmO*}QdO'#EoO+YQdO'#ErO*[QhO'#ExO+bQdO'#EzO+mQdO'#E}O+rQaO'#CfO+yQ`O'#EbO,OQ`O'#GPO,ZQdO'#GPQOQ`OOP,eO&jO'#CaPOOO)CAa)CAaOOQP'#Ci'#CiOOQP,59R,59RO%`QdO,59ROOQP'#Cm'#CmOOQP,59V,59VO&eQdO,59VO,pQdO,59YOOQP,5:m,5:mO'nQdO,5:oO'yQdO,5:vO'yQdO,5:xO'yQdO,5:yO'yQdO'#F[O,{Q`O,58}O-TQdO'#EaOOQS,58},58}OOQP'#Cq'#CqOOQO'#EP'#EPOOQP,59Y,59YO-[Q`O,59YO-aQ`O,59YO-fQpO'#EUO-qQdO'#EVO-vQ`O'#EVO-{QpO,5:oO.iQaO,5:vO/PQaO,5:yOOQW'#D]'#D]O0OQhO'#DgO0cQhO,5;lO*[QhO'#DeO0pQ`O'#DnO0uQhO'#D{OOQW'#Fx'#FxOOQS,5;l,5;lO0zQ`O'#DhO1PQ`O'#DkOOQS-E9R-E9ROOQ['#Cv'#CvO1UQdO'#CwO1iQdO'#C|O1|QdO'#DPOOQ['#DQ'#DQO2aQ!pO'#DRO4jQ!jO,5;POOQO'#DW'#DWO-aQ`O'#DVO4zQ!nO'#FuO6}Q`O'#DXO7SQ`O'#D|OOQ['#Fu'#FuO7XQhO'#GSO7gQ`O,5;VO7lQ!bO,5;XOOQS'#Eq'#EqO7tQ`O,5;ZO7yQdO,5;ZOOQO'#Et'#EtO8RQ`O,5;^O8WQhO,5;dO'yQdO'#DjOOQS,5;f,5;fO0zQ`O,5;fO8`QdO,5;fOOQS'#Fc'#FcO8hQdO'#FPO7gQ`O,5;iO8pQdO,5:|O9QQdO'#F^O9_Q`O,5<kO9_Q`O,5<kPOOO'#FS'#FSP9jO&jO,58{POOO,58{,58{OOQP1G.m1G.mOOQP1G.q1G.qOOQP1G.t1G.tO-[Q`O1G.tO-aQ`O1G.tO9uQpO1G0ZO9}QaO1G0bO:eQaO1G0dO:{QaO1G0eO;cQaO,5;vOOQO-E9Y-E9YOOQS1G.i1G.iO;mQ`O,5:{O;rQdO'#EQO;yQdO'#CuOOQO'#EX'#EXOOQO,5:q,5:qO-qQdO,5:qOOQP1G0Z1G0ZO)gQdO1G0ZO<QQ!jO'#D]O<`Q!bO,59xO<hQhO,5:ROOQO'#Dc'#DcOOQO'#Fy'#FyO<cQ!bO,59|O<pQhO'#FdO*[QhO,59zO*[QhO'#FdO=hQhO1G1WOOQS1G1W1G1WO=rQhO,5:PO>mQhO'#DoOOQW,5:Y,5:YOOQW,5:g,5:gOOQW,5:S,5:SO>wQhO,5:VO?cQ!fO'#FvOOQS'#Fv'#FvOOQS'#FV'#FVO@pQdO,59cOOQ[,59c,59cOATQdO,59hOOQ[,59h,59hOAhQdO,59kOOQ[,59k,59kOOQ[,59m,59mO)gQdO,59oOA{QhO'#EgOOQW'#Eg'#EgOBjQ`O1G0kO4sQhO1G0kOOQ[,59q,59qO*[QhO'#DZOOQ[,59s,59sOBoQ#tO,5:hOBzQhO'#F`OCXQ`O,5<nOOQS1G0q1G0qOOQS1G0s1G0sOOQS1G0u1G0uOCdQ`O1G0uOCiQdO'#EuOOQS1G0x1G0xOOQS1G1O1G1OOCtQaO,5:UO7gQ`O1G1QOOQS1G1Q1G1QO0zQ`O1G1QOOQS-E9a-E9aOOQS1G1T1G1TOC{Q!fO1G0hODcQ`O'#EdOOQO1G0h1G0hOOQO,5;x,5;xODhQdO,5;xOOQO-E9[-E9[ODuQ`O1G2VPOOO-E9Q-E9QPOOO1G.g1G.gOOQP7+$`7+$`OOQP7+%u7+%uO)gQdO7+%uOOQS1G0g1G0gOEQQaO'#F}OE[Q`O,5:lOEaQ!fO'#FUOF_QdO'#FtOFiQ`O,59aOOQO1G0]1G0]OFnQ!bO7+%uO)gQdO1G/dOFyQhO1G/hOOQW1G/m1G/mOOQW1G/f1G/fOG[QhO,5<OOOQW-E9b-E9bOOQS7+&r7+&rOHSQhO'#D]OHbQhO'#F|OHmQ`O'#F|OHrQ`O,5:ZOHwQ!bO'#D_O>wQhO'#DmOISQhO'#DsOI[QhO'#DuOIaQ!jO'#F{OOQO'#F{'#F{OIlQ`O'#DxOItQ!bO'#DzOOQO'#Fz'#FzOIyQ`O1G/qOOQS-E9T-E9TOOQ[1G.}1G.}OOQ[1G/S1G/SOOQ[1G/V1G/VOOQ[1G/Z1G/ZOJOQdO,5;ROOQS7+&V7+&VOJTQ`O7+&VOJYQhO'#D[OJbQ`O,59uO*[QhO,59uOOQ[1G0S1G0SOJjQ`O1G0SOJoQhO,5;zOOQO-E9^-E9^OOQS7+&a7+&aOJ}QbO'#DROOQO'#Ew'#EwOK]Q`O'#EvOOQO'#Ev'#EvOKhQ`O'#FaOKpQdO,5;aOOQS,5;a,5;aOOQ[1G/p1G/pOOQS7+&l7+&lO7gQ`O7+&lOK{Q!fO'#F]O)gQdO'#F]OMSQdO7+&SOOQO7+&S7+&SOOQO,5;O,5;OOOQO1G1d1G1dOMgQ!bO<<IaOMrQdO'#FZOM|Q`O,5<iOOQP1G0W1G0WOOQS-E9S-E9SONUQdO'#FYON`Q`O,5<`OOQ]1G.{1G.{OOQP<<Ia<<IaONhQ`O<<IaONmQdO7+%OOOQO'#D_'#D_ONtQ!bO7+%SON|QhO'#FXO! ZQ`O,5<hO)gQdO,5<hOOQW1G/u1G/uO! cQ`O,5:XO>wQhO'#DtOOQO,5:_,5:_O! hQhO,5:aO! pQhO,5:fO)gQdO,5:dOOQW7+%]7+%]OOQO'#Ei'#EiO! wQ`O1G0mOOQS<<Iq<<IqO)gQdO,59vO!!kQhO1G/aOOQ[1G/a1G/aO!!rQ`O1G/aOOQW-E9U-E9UOOQ[7+%n7+%nOOQO,5;b,5;bOClQdO'#FbOKhQ`O,5;{OOQS,5;{,5;{OOQS-E9_-E9_OOQS1G0{1G0{OOQS<<JW<<JWO!!zQ!fO,5;wOOQS-E9Z-E9ZOOQO<<In<<InOOQPAN>{AN>{O!$RQ`OAN>{O!$WQaO,5;uOOQO-E9X-E9XO!$bQdO,5;tOOQO-E9W-E9WOOQW<<Hj<<HjOOQW<<Hn<<HnO!$lQhO<<HnO!$}QhO'#D]O!%]QhO,5;sO!%hQ`O,5;sOOQO-E9V-E9VO!%mQdO1G2SO!%wQhO1G/sO!&PQ`O,5:`O>wQhO'#DwOOQO1G/{1G/{O!&UQ!bO1G0QO!&^QdO1G0OOJOQdO'#F_O!&eQ`O7+&XOOQW7+&X7+&XO!&mQ!bO1G/bOOQ[7+${7+${O!&xQhO7+${P!'PQ`O'#FWOOQO,5;|,5;|OOQO-E9`-E9`OOQS1G1g1G1gOOQPG24gG24gO!'UQ`OAN>YO)gQdO1G1_O!'ZQ`O7+'nOOQO1G/z1G/zO!'cQ`O,5:cO!'hQhO7+%lOOQO,5;y,5;yOOQO-E9]-E9]OOQW<<Is<<IsOOQ[<<Hg<<HgPOQW,5;r,5;rOOQWG23tG23tO!'oQdO7+&yOOQO1G/}1G/}OOQO<<IW<<IW",
  stateData: "!(R~O$`OS$aQQ~OWVO^`O`WOcYOdYOlaOo]O#P^O#S_O#YeO#`fO#bgO#dhO#giO#mjO#okO#rlO$ZRO$^ZO$gTO$rZO~OQnOWVO^`O`WOcYOdYOlaOo]O#P^O#S_O#YeO#`fO#bgO#dhO#giO#mjO#okO#rlO$ZmO$^ZO$gTO$rZO~O$X$sP~P!mO$arO~O`YXcYXdYXoYXrYX!eYX#PYX#SYX$YYX$^YX$g[X$rYX~OgYX~P$aO$ZtO~O$gvO~O$gvO`$fXc$fXd$fXo$fXr$fX!e$fX#P$fX#S$fX$Y$fX$^$fX$r$fXg$fX~O$ZwO~O`yOczOdzOo|O#P}O#S!PO$Y!OO$^ZO$rZO~Or!SO!e!QO~P&jOf!YO$Z!UO$[!VO~OW!]O$Z!ZO$g![O~OWVO^`O`WOcYOdYOo]O#P^O#S_O$ZRO$^ZO$gTO$rZO~OS!eOc!fOd!fOh!bOr!SO!Y!dO!]!iO!`!jO$]!aO~Om!hO~P(qOQ!uOh!mOo!nOr!oOv!xO|!vO!q!wO$Z!lO$[!sO$^!pO$k!qO~OS!eOc!fOd!fOh!bO!Y!dO!]!iO!`!jO$]!aO~Or$vP~P*[Ov!}O!q!wO$Z!|O~Ov#PO$Z#PO~Oh#SOr!SO#p#UO~O$Z#WO~Oc#VX~P$aOc#ZO~Om#[O$X$sXq$sX~O$X$sXq$sX~P!mO$b#_O$c#_O$d#aO~Of#fO$Z!UO$[!VO~Or!SO!e!QO~Oq$sP~P!mOh#oO~Oh#pO~On!xX!|!xX$g!zX~O$Z#qO~O$g#sO~On#tO!|#uO~O`yOczOdzOo|O$^ZO$rZO~Or#Oa!e#Oa#P#Oa#S#Oa$Y#Oag#Oa~P.TOr#Ra!e#Ra#P#Ra#S#Ra$Y#Rag#Ra~P.TOS!eOc!fOd!fOh!bO!Y!dO!]!iO!`!jO~OR#zOv#zO$]#vO$^#yO$k!qO~P/gOm$QO!T#}O!e$OO~P(qOh$SO~O$]$UO~Oh#SO~Oh$WO~O`$YOc$YOg$]Ol$YOm$YO~P)gO`$YOc$YOl$YOm$YOn$_O~P)gO`$YOc$YOl$YOm$YOq$aO~P)gOP$bOSuXcuXduXhuXmuXxuX!YuX!]uX!`uX#[uX#^uX$]uX!WuXQuX`uXguXluXouXruXvuX|uX!quX$ZuX$[uX$^uX$kuXnuXquX!euX$XuX$uuX!}uX~Ox$cO#[$dO#^$eOm$vP~P*[Oh#pOS$iXc$iXd$iXm$iXx$iX!Y$iX!]$iX!`$iX#[$iX#^$iX$]$iXQ$iX`$iXg$iXl$iXo$iXr$iXv$iX|$iX!q$iX$Z$iX$[$iX$^$iX$k$iXn$iXq$iX!e$iX$X$iX$u$iX!}$iX~Oh$iO~Oh$kO~O!T#}O!e$lOr$vXm$vX~Or!SO~Om$oOx$cO~Om$pO~Ov$qO!q!wO~Or$rO~Or!SO!T#}O~Or!SO#p$xO~O$Z#WOr#sX~O$u$|Om#Ua$X#Uaq#Ua~P)gOm$QX$X$QXq$QX~P!mOm#[O$X$saq$sa~O$b#_O$c#_O$d%TO~On%VO!|%WO~Or#Oi!e#Oi#P#Oi#S#Oi$Y#Oig#Oi~P.TOr#Qi!e#Qi#P#Qi#S#Qi$Y#Qig#Qi~P.TOr#Ri!e#Ri#P#Ri#S#Ri$Y#Rig#Ri~P.TOr$Oa!e$Oa~P&jOq%XO~Og$qP~P'yOg$hP~P)gOc!RXg!PX!T!PX!W!RX~Oc%aO!W%bO~Og%cO!T#}O~O!T#}OS$WXc$WXd$WXh$WXm$WXr$WX!Y$WX!]$WX!`$WX!e$WX$]$WX~Om%gO!e$OO~P(qO!T#}OS!Xac!Xad!Xah!Xam!Xar!Xa!Y!Xa!]!Xa!`!Xa!e!Xa$]!Xag!Xa~O$]%hOg$pP~P/gOR#zOS!eOh%mOv#zO!Y%nO$]%lO$^#yO$k!qO~Ox$cOQ$jX`$jXc$jXg$jXh$jXl$jXm$jXo$jXr$jXv$jX|$jX!q$jX$Z$jX$[$jX$^$jX$k$jXn$jXq$jX~O`$YOc$YOg%wOl$YOm$YO~P)gO`$YOc$YOl$YOm$YOn%xO~P)gO`$YOc$YOl$YOm$YOq%yO~P)gOh%{OS#ZXc#ZXd#ZXm#ZX!Y#ZX!]#ZX!`#ZX$]#ZX~Om%|O~Og&ROv&SO!r&SO~Or$SX!e$SXm$SX~P*[O!e$lOr$vam$va~Om&VO~Oq&^O$Z&XO$k&WO~Og&_O~P&jOx$cO!e&cO$u$|Om#Ui$X#Uiq#Ui~P)gO$t&fO~Om$Qa$X$Qaq$Qa~P!mOm#[O$X$siq$si~O!e&iOg$qX~P&jOg&kO~Ox$cOQ#xXg#xXh#xXo#xXr#xXv#xX|#xX!e#xX!q#xX$Z#xX$[#xX$^#xX$k#xX~O!e&mOg$hX~P)gOg&oO~On&pOx$cO!}&qO~OR#zOv#zO$]&sO$^#yO$k!qO~O!T#}OS$Wac$Wad$Wah$Wam$War$Wa!Y$Wa!]$Wa!`$Wa!e$Wa$]$Wa~Oc!dXg!PX!T!PX!e!PX~O!T#}O!e&uOg$pX~Oc&wO~Og&xO~Oc!mXg!mX!W!RX~OS!eOh&zO~O!T&|O~O!T&|O!W&}Og$oX~Oc'OOg!lX~O!W&}O~Og'PO~O$Z'QO~Om'SO~Oc'TO!T#}O~Og'VOm'UO~Og'YO~O!T#}Or$Sa!e$Sam$Sa~OP$bOruX!euXguX~O$k&WOr#jX!e#jX~Or!SO!e'[O~Oq'`O$Z&XO$k&WO~Ox$cOQ$PXh$PXm$PXo$PXr$PXv$PX|$PX!e$PX!q$PX$X$PX$Z$PX$[$PX$^$PX$k$PX$u$PXq$PX~O!e&cO$u$|Om#Uq$X#Uqq#Uq~P)gOn'eOx$cO!}'fO~Og#}X!e#}X~P'yO!e&iOg$qa~Og#|X!e#|X~P)gO!e&mOg$ha~On'eO~Og'kO~P)gOg'lO!W'mO~O$]'nOg#{X!e#{X~P/gO!e&uOg$pa~Og'sO~OS!eOh'uO~OS!eO~PFyO`'yOg'{O~OS#zac#zad#zah#za!Y#za!]#za!`#za$]#za~Og'}O~P!!POg'}Om(OO~Ox$cOQ$Pah$Pam$Pao$Par$Pav$Pa|$Pa!e$Pa!q$Pa$X$Pa$Z$Pa$[$Pa$^$Pa$k$Pa$u$Paq$Pa~On(TO~Og#}a!e#}a~P&jOg#|a!e#|a~P)gOR#zOv#zO$]&sO$^#yO$k&WO~Oc!fXg!PX!T!PX!e!PX~O!T#}Og#{a!e#{a~Oc(VO~O!e&uOg$pi~P)gOg!ai!T!ji~Og(XO~O!W(ZOg!ni~Og!li~P)gO`'yOg(^O~Ox$cOg!Oim!Oi~Og(_O~P!!POm(`O~Og(aO~O!e&uOg$pq~Og(cO~OS!eO~P!$lOg#{q!e#{q~P)gO$`!r$a$k`x#S~",
  goto: "8^$wPPPPP$xP${P%U%h%U%z&^P%UP&d%UPP&jPPP&p&z&zPPPP&zPP&z&z'jP&zP&z(m&zP)])`)f)f)x)fP)f*_P)fP)f)fP*j)fP*v*|+r+uP+x*v+{*v,O,U,X,_,X)f,ePP-Z-a%U-g%U.V.V.].aPP%UP%U%UP.g/c/p/w${P0QP0TP${P${P${P0Z${P0^0a0d0k${P${PP${P0p${P0s0y1Y1t2S2Y2d2j2p2v2|3W3^3d3j3p3vPPPPPPPPPPPP3|4VP4{5O6SP6[7U7k,X7w7zP7}PP8TRsQ_bOPdp!S#[%Pq`OP^_dp}!O!P!Q!S#S#[#o%P&iqSOP^_dp}!O!P!Q!S#S#[#o%P&iqUOP^_dp}!O!P!Q!S#S#[#o%P&iQuTR#bvQxWR#cyQ!WYR#dzQ#d!YS$h!t!uR%U#f!Z!xeg!m!n!o#Z#p#u$[$^$`$c${%W%]%a&c&d&m&r&w'O'T'i'r'x(V(b!Y!xeg!m!n!o#Z#p#u$[$^$`$c${%W%]%a&c&d&m&r&w'O'T'i'r'x(V(bb#z!b$W%b%m&z&}'m'u(ZU&Z$r&]'[R'Z&Y!Z!teg!m!n!o#Z#p#u$[$^$`$c${%W%]%a&c&d&m&r&w'O'T'i'r'x(V(bR$j!vQ&P$iR'W&Qq!gafj!b!c!d!r#}$O$P$S$g$i$l&Q&uQ#w!bW%s$W%m&z'uQ&t%bQ'w&}Q(U'mR(d(Zc#z!b$W%b%m&z&}'m'u(ZQ#VkQ$V!iQ$v#UR&a$xX%q$W%m&z'up!gafj!b!c!d!r#}$O$P$S$g$i$l&Q&uW%p$W%m&z'uQ&{%nQ'v&|Q'w&}R(d(ZR$T!eR%j$SR'p&uR&{%nX%o$W%m&z'uR'v&|X%t$W%m&z'uX%r$W%m&z'u!Y!xeg!m!n!o#Z#p#u$[$^$`$c${%W%]%a&c&d&m&r&w'O'T'i'r'x(V(bQ!}hR$q#OQ!XYR#ezQ#d!XR%U#ep[OP^_dp}!O!P!Q!S#S#[#o%P&ie{X!_!`#h#i#j#k$u%Y'gQ!^]R#g|T!]]|Q#r![R%_#sQ!TXQ!haQ#TkQ#m!RQ$Q!cQ$n!zQ$t#RQ$w#VQ$z#YQ%g$PQ&`$vQ'^&[Q'a&aR(S']SoP!SQ#^pQ%O#[R&g%PZnPp!S#[%PQ$}#ZQ&e${R'd&dR$g!rQ'R%{R(['yR#OhR#QiR$s#QS&[$r&]R(Q'[V&Y$r&]'[R#YlQ#`rR%S#`QdOSpP!SU!kdp%PR%P#[Q%]#p[&l%]&r'i'r'x(bQ&r%aQ'i&mQ'r&wQ'x'OR(b(VQ$[!mQ$^!nQ$`!oV%v$[$^$`Q&Q$iR'X&QQ&v%iS'q&v(WR(W'rQ&n%]R'j&nQ&j%YR'h&jQ!RXR#l!RQ&d${R'c&dQ#]oS%Q#]%RR%R#^Q'z'RR(]'zQ$m!yR&U$mQ&]$rR'_&]Q']&[R(R']Q#XlR$y#XQ$P!cR%f$P_cOPdp!S#[%P^XOPdp!S#[%PQ!_^Q!`_Q#h}Q#i!OQ#j!PQ#k!QQ$u#SQ%Y#oR'g&iR%^#pQ!reQ!{g[$X!m!n!o$[$^$`Q${#Zh%[#p%]%a&m&r&w'O'i'r'x(V(bQ%`#uQ%z$cS&b${&dQ&h%WQ'b&cR'|'T]$Z!m!n!o$[$^$`Q!caU!yf!r$gQ#RjQ#x!bS#|!c$PQ$R!dQ%d#}Q%e$OQ%i$SS&O$i&QQ&T$lR'o&uQ#{!bW%s$W%m&z'uQ&t%bQ'w&}Q(U'mR(d(ZQ%u$WQ&y%mQ't&zR(Y'uR%k$SR%Z#oQqPR#n!SQ!zfQ$f!rR%}$g",
  nodeNames: "⚠ Unit VariableName VariableName QueryCallee Comment StyleSheet RuleSet UniversalSelector TagSelector TagName NamespacedTagSelector NamespaceName TagName NestingSelector ClassSelector . ClassName PseudoClassSelector : :: PseudoClassName PseudoClassName ) ( ArgList ValueName ParenthesizedValue AtKeyword ; ] [ BracketedValue } { BracedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp CallExpression Callee IfExpression if ArgList IfBranch KeywordQuery FeatureQuery FeatureName BinaryQuery LogicOp ComparisonQuery ColorLiteral CompareOp UnaryQuery UnaryQueryOp ParenthesizedQuery SelectorQuery selector ParenthesizedSelector StyleQuery style ParenthesedQuery CallQuery ArgList PropertyName , PropertyName UnaryQuery ParenthesedQuery BinaryQuery ParenthesedQuery ParenthesedQuery StyleFeature PropertyName StyleRange PseudoQuery CallLiteral CallTag ParenthesizedContent PseudoClassName ArgList IdSelector IdName AttributeSelector AttributeName NamespacedAttribute NamespaceName AttributeName MatchOp MatchFlag ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp Block Declaration PropertyName Important ImportStatement import Layer layer LayerName layer MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList KeyframeSelector KeyframeRangeName SupportsStatement supports ScopeStatement scope to FontFeatureStatement font-feature-values FontName AtRule Styles",
  maxTerm: 176,
  nodeProps: [
    ["isolate", -2, 5, 38, ""],
    ["openedBy", 23, "(", 30, "[", 33, "{"],
    ["closedBy", 24, ")", 31, "]", 34, "}"]
  ],
  propSources: [Om],
  skippedNodes: [0, 5, 130],
  repeatNodeCount: 17,
  tokenData: "IO~R!bOX%ZX^&R^p%Zpq&Rqr)ers)vst+jtu/wuv%Zvw0qwx1Sxy2qyz3Sz{3X{|3r|}8e}!O8v!O!P9e!P!Q9|!Q![:u![!];p!]!^<l!^!_<}!_!`=y!`!a>^!a!b%Z!b!c?_!c!k%Z!k!lAl!l!u%Z!u!vAl!v!}%Z!}#OA}#O#P%Z#P#QB`#Q#R/w#R#]%Z#]#^Bq#^#g%Z#g#hAl#h#o%Z#o#pGU#p#qGg#q#rHO#r#sHa#s#y%Z#y#z&R#z$f%Z$f$g&R$g#BY%Z#BY#BZ&R#BZ$IS%Z$IS$I_&R$I_$I|%Z$I|$JO&R$JO$JT%Z$JT$JU&R$JU$KV%Z$KV$KW&R$KW&FU%Z&FU&FV&R&FV;'S%Z;'S;=`Hx<%lO%Z`%^SOy%jz;'S%j;'S;=`%{<%lO%j`%oS!r`Oy%jz;'S%j;'S;=`%{<%lO%j`&OP;=`<%l%j~&Wh$`~OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%j~'yh$`~!r`OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%jj)jS$uYOy%jz;'S%j;'S;=`%{<%lO%j~)yWOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d<%lO)v~*hOv~~*kRO;'S)v;'S;=`*t;=`O)v~*wXOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d;=`<%l)v<%lO)v~+gP;=`<%l)vj+maOy%jz}%j}!O,r!O!Q%j!Q![,r![!c%j!c!},r!}#O%j#O#P.O#P#R%j#R#S,r#S#T%j#T#o,r#o$g%j$g;'S,r;'S;=`/q<%lO,rj,ya$rY!r`Oy%jz}%j}!O,r!O!Q%j!Q![,r![!c%j!c!},r!}#O%j#O#P.O#P#R%j#R#S,r#S#T%j#T#o,r#o$g%j$g;'S,r;'S;=`/q<%lO,rj.TV!r`OY,rYZ%jZy,ryz.jz;'S,r;'S;=`/q<%lO,rY.oX$rY}!O.j!Q![.j!c!}.j#O#P/[#R#S.j#T#o.j$g;'S.j;'S;=`/k<%lO.jY/_SOY.jZ;'S.j;'S;=`/k<%lO.jY/nP;=`<%l.jj/tP;=`<%l,rd/zUOy%jz!_%j!_!`0^!`;'S%j;'S;=`%{<%lO%jd0eS!|S!r`Oy%jz;'S%j;'S;=`%{<%lO%jb0vS^QOy%jz;'S%j;'S;=`%{<%lO%j~1VWOY1SZw1Swx*cx#O1S#O#P1o#P;'S1S;'S;=`2k<%lO1S~1rRO;'S1S;'S;=`1{;=`O1S~2OXOY1SZw1Swx*cx#O1S#O#P1o#P;'S1S;'S;=`2k;=`<%l1S<%lO1S~2nP;=`<%l1Sj2vShYOy%jz;'S%j;'S;=`%{<%lO%j~3XOg~n3`UWQxWOy%jz!_%j!_!`0^!`;'S%j;'S;=`%{<%lO%jj3yWxW#SQOy%jz!O%j!O!P4c!P!Q%j!Q![7h![;'S%j;'S;=`%{<%lO%jj4hU!r`Oy%jz!Q%j!Q![4z![;'S%j;'S;=`%{<%lO%jj5RY!r`$kYOy%jz!Q%j!Q![4z![!g%j!g!h5q!h#X%j#X#Y5q#Y;'S%j;'S;=`%{<%lO%jj5vY!r`Oy%jz{%j{|6f|}%j}!O6f!O!Q%j!Q![6}![;'S%j;'S;=`%{<%lO%jj6kU!r`Oy%jz!Q%j!Q![6}![;'S%j;'S;=`%{<%lO%jj7UU!r`$kYOy%jz!Q%j!Q![6}![;'S%j;'S;=`%{<%lO%jj7o[!r`$kYOy%jz!O%j!O!P4z!P!Q%j!Q![7h![!g%j!g!h5q!h#X%j#X#Y5q#Y;'S%j;'S;=`%{<%lO%jj8jS!eYOy%jz;'S%j;'S;=`%{<%lO%jj8{WxWOy%jz!O%j!O!P4c!P!Q%j!Q![7h![;'S%j;'S;=`%{<%lO%jj9jU`YOy%jz!Q%j!Q![4z![;'S%j;'S;=`%{<%lO%j~:RTxWOy%jz{:b{;'S%j;'S;=`%{<%lO%j~:iS!r`$a~Oy%jz;'S%j;'S;=`%{<%lO%jj:z[$kYOy%jz!O%j!O!P4z!P!Q%j!Q![7h![!g%j!g!h5q!h#X%j#X#Y5q#Y;'S%j;'S;=`%{<%lO%jj;uUcYOy%jz![%j![!]<X!];'S%j;'S;=`%{<%lO%jj<`SdY!r`Oy%jz;'S%j;'S;=`%{<%lO%jj<qSmYOy%jz;'S%j;'S;=`%{<%lO%jh=SU!WWOy%jz!_%j!_!`=f!`;'S%j;'S;=`%{<%lO%jh=mS!WW!r`Oy%jz;'S%j;'S;=`%{<%lO%jl>QS!WW!|SOy%jz;'S%j;'S;=`%{<%lO%jj>eV#PQ!WWOy%jz!_%j!_!`=f!`!a>z!a;'S%j;'S;=`%{<%lO%jb?RS#PQ!r`Oy%jz;'S%j;'S;=`%{<%lO%jj?bYOy%jz}%j}!O@Q!O!c%j!c!}@o!}#T%j#T#o@o#o;'S%j;'S;=`%{<%lO%jj@VW!r`Oy%jz!c%j!c!}@o!}#T%j#T#o@o#o;'S%j;'S;=`%{<%lO%jj@v[lY!r`Oy%jz}%j}!O@o!O!Q%j!Q![@o![!c%j!c!}@o!}#T%j#T#o@o#o;'S%j;'S;=`%{<%lO%jhAqS!}WOy%jz;'S%j;'S;=`%{<%lO%jjBSSoYOy%jz;'S%j;'S;=`%{<%lO%jnBeSn^Oy%jz;'S%j;'S;=`%{<%lO%jjBvU!}WOy%jz#a%j#a#bCY#b;'S%j;'S;=`%{<%lO%jbC_U!r`Oy%jz#d%j#d#eCq#e;'S%j;'S;=`%{<%lO%jbCvU!r`Oy%jz#c%j#c#dDY#d;'S%j;'S;=`%{<%lO%jbD_U!r`Oy%jz#f%j#f#gDq#g;'S%j;'S;=`%{<%lO%jbDvU!r`Oy%jz#h%j#h#iEY#i;'S%j;'S;=`%{<%lO%jbE_U!r`Oy%jz#T%j#T#UEq#U;'S%j;'S;=`%{<%lO%jbEvU!r`Oy%jz#b%j#b#cFY#c;'S%j;'S;=`%{<%lO%jbF_U!r`Oy%jz#h%j#h#iFq#i;'S%j;'S;=`%{<%lO%jbFxS$tQ!r`Oy%jz;'S%j;'S;=`%{<%lO%jjGZSrYOy%jz;'S%j;'S;=`%{<%lO%jfGlU$gUOy%jz!_%j!_!`0^!`;'S%j;'S;=`%{<%lO%jjHTSqYOy%jz;'S%j;'S;=`%{<%lO%jfHfU#SQOy%jz!_%j!_!`0^!`;'S%j;'S;=`%{<%lO%j`H{P;=`<%l%Z",
  tokenizers: [am, hm, lm, om, 1, 2, 3, 4, new jn("m~RRYZ[z{a~~g~aO$c~~dP!P!Qg~lO$d~~", 28, 156)],
  topRules: { StyleSheet: [0, 6], Styles: [1, 129] },
  dynamicPrecedences: { 97: 1 },
  specialized: [{ term: 172, get: (n, e) => Eo(n) << 1, external: Eo }, { term: 150, get: (n) => cm[n] || -1 }, { term: 151, get: (n) => fm[n] || -1 }, { term: 4, get: (n) => um[n] || -1 }, { term: 28, get: (n) => dm[n] || -1 }, { term: 149, get: (n) => pm[n] || -1 }],
  tokenPrec: 2433
});
let xr = null;
function kr() {
  if (!xr && typeof document == "object" && document.body) {
    let { style: n } = document.body, e = [], t = /* @__PURE__ */ new Set();
    for (let i in n)
      i != "cssText" && i != "cssFloat" && typeof n[i] == "string" && (/[A-Z]/.test(i) && (i = i.replace(/[A-Z]/g, (r) => "-" + r.toLowerCase())), t.has(i) || (e.push(i), t.add(i)));
    xr = e.sort().map((i) => ({ type: "property", label: i, apply: i + ": " }));
  }
  return xr || [];
}
const Uo = /* @__PURE__ */ [
  "active",
  "after",
  "any-link",
  "autofill",
  "backdrop",
  "before",
  "checked",
  "cue",
  "default",
  "defined",
  "disabled",
  "empty",
  "enabled",
  "file-selector-button",
  "first",
  "first-child",
  "first-letter",
  "first-line",
  "first-of-type",
  "focus",
  "focus-visible",
  "focus-within",
  "fullscreen",
  "has",
  "host",
  "host-context",
  "hover",
  "in-range",
  "indeterminate",
  "invalid",
  "is",
  "lang",
  "last-child",
  "last-of-type",
  "left",
  "link",
  "marker",
  "modal",
  "not",
  "nth-child",
  "nth-last-child",
  "nth-last-of-type",
  "nth-of-type",
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "part",
  "placeholder",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "right",
  "root",
  "scope",
  "selection",
  "slotted",
  "target",
  "target-text",
  "valid",
  "visited",
  "where"
].map((n) => ({ type: "class", label: n })), Vo = /* @__PURE__ */ [
  "above",
  "absolute",
  "activeborder",
  "additive",
  "activecaption",
  "after-white-space",
  "ahead",
  "alias",
  "all",
  "all-scroll",
  "alphabetic",
  "alternate",
  "always",
  "antialiased",
  "appworkspace",
  "asterisks",
  "attr",
  "auto",
  "auto-flow",
  "avoid",
  "avoid-column",
  "avoid-page",
  "avoid-region",
  "axis-pan",
  "background",
  "backwards",
  "baseline",
  "below",
  "bidi-override",
  "blink",
  "block",
  "block-axis",
  "bold",
  "bolder",
  "border",
  "border-box",
  "both",
  "bottom",
  "break",
  "break-all",
  "break-word",
  "bullets",
  "button",
  "button-bevel",
  "buttonface",
  "buttonhighlight",
  "buttonshadow",
  "buttontext",
  "calc",
  "capitalize",
  "caps-lock-indicator",
  "caption",
  "captiontext",
  "caret",
  "cell",
  "center",
  "checkbox",
  "circle",
  "cjk-decimal",
  "clear",
  "clip",
  "close-quote",
  "col-resize",
  "collapse",
  "color",
  "color-burn",
  "color-dodge",
  "column",
  "column-reverse",
  "compact",
  "condensed",
  "contain",
  "content",
  "contents",
  "content-box",
  "context-menu",
  "continuous",
  "copy",
  "counter",
  "counters",
  "cover",
  "crop",
  "cross",
  "crosshair",
  "currentcolor",
  "cursive",
  "cyclic",
  "darken",
  "dashed",
  "decimal",
  "decimal-leading-zero",
  "default",
  "default-button",
  "dense",
  "destination-atop",
  "destination-in",
  "destination-out",
  "destination-over",
  "difference",
  "disc",
  "discard",
  "disclosure-closed",
  "disclosure-open",
  "document",
  "dot-dash",
  "dot-dot-dash",
  "dotted",
  "double",
  "down",
  "e-resize",
  "ease",
  "ease-in",
  "ease-in-out",
  "ease-out",
  "element",
  "ellipse",
  "ellipsis",
  "embed",
  "end",
  "ethiopic-abegede-gez",
  "ethiopic-halehame-aa-er",
  "ethiopic-halehame-gez",
  "ew-resize",
  "exclusion",
  "expanded",
  "extends",
  "extra-condensed",
  "extra-expanded",
  "fantasy",
  "fast",
  "fill",
  "fill-box",
  "fixed",
  "flat",
  "flex",
  "flex-end",
  "flex-start",
  "footnotes",
  "forwards",
  "from",
  "geometricPrecision",
  "graytext",
  "grid",
  "groove",
  "hand",
  "hard-light",
  "help",
  "hidden",
  "hide",
  "higher",
  "highlight",
  "highlighttext",
  "horizontal",
  "hsl",
  "hsla",
  "hue",
  "icon",
  "ignore",
  "inactiveborder",
  "inactivecaption",
  "inactivecaptiontext",
  "infinite",
  "infobackground",
  "infotext",
  "inherit",
  "initial",
  "inline",
  "inline-axis",
  "inline-block",
  "inline-flex",
  "inline-grid",
  "inline-table",
  "inset",
  "inside",
  "intrinsic",
  "invert",
  "italic",
  "justify",
  "keep-all",
  "landscape",
  "large",
  "larger",
  "left",
  "level",
  "lighter",
  "lighten",
  "line-through",
  "linear",
  "linear-gradient",
  "lines",
  "list-item",
  "listbox",
  "listitem",
  "local",
  "logical",
  "loud",
  "lower",
  "lower-hexadecimal",
  "lower-latin",
  "lower-norwegian",
  "lowercase",
  "ltr",
  "luminosity",
  "manipulation",
  "match",
  "matrix",
  "matrix3d",
  "medium",
  "menu",
  "menutext",
  "message-box",
  "middle",
  "min-intrinsic",
  "mix",
  "monospace",
  "move",
  "multiple",
  "multiple_mask_images",
  "multiply",
  "n-resize",
  "narrower",
  "ne-resize",
  "nesw-resize",
  "no-close-quote",
  "no-drop",
  "no-open-quote",
  "no-repeat",
  "none",
  "normal",
  "not-allowed",
  "nowrap",
  "ns-resize",
  "numbers",
  "numeric",
  "nw-resize",
  "nwse-resize",
  "oblique",
  "opacity",
  "open-quote",
  "optimizeLegibility",
  "optimizeSpeed",
  "outset",
  "outside",
  "outside-shape",
  "overlay",
  "overline",
  "padding",
  "padding-box",
  "painted",
  "page",
  "paused",
  "perspective",
  "pinch-zoom",
  "plus-darker",
  "plus-lighter",
  "pointer",
  "polygon",
  "portrait",
  "pre",
  "pre-line",
  "pre-wrap",
  "preserve-3d",
  "progress",
  "push-button",
  "radial-gradient",
  "radio",
  "read-only",
  "read-write",
  "read-write-plaintext-only",
  "rectangle",
  "region",
  "relative",
  "repeat",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
  "repeat-x",
  "repeat-y",
  "reset",
  "reverse",
  "rgb",
  "rgba",
  "ridge",
  "right",
  "rotate",
  "rotate3d",
  "rotateX",
  "rotateY",
  "rotateZ",
  "round",
  "row",
  "row-resize",
  "row-reverse",
  "rtl",
  "run-in",
  "running",
  "s-resize",
  "sans-serif",
  "saturation",
  "scale",
  "scale3d",
  "scaleX",
  "scaleY",
  "scaleZ",
  "screen",
  "scroll",
  "scrollbar",
  "scroll-position",
  "se-resize",
  "self-start",
  "self-end",
  "semi-condensed",
  "semi-expanded",
  "separate",
  "serif",
  "show",
  "single",
  "skew",
  "skewX",
  "skewY",
  "skip-white-space",
  "slide",
  "slider-horizontal",
  "slider-vertical",
  "sliderthumb-horizontal",
  "sliderthumb-vertical",
  "slow",
  "small",
  "small-caps",
  "small-caption",
  "smaller",
  "soft-light",
  "solid",
  "source-atop",
  "source-in",
  "source-out",
  "source-over",
  "space",
  "space-around",
  "space-between",
  "space-evenly",
  "spell-out",
  "square",
  "start",
  "static",
  "status-bar",
  "stretch",
  "stroke",
  "stroke-box",
  "sub",
  "subpixel-antialiased",
  "svg_masks",
  "super",
  "sw-resize",
  "symbolic",
  "symbols",
  "system-ui",
  "table",
  "table-caption",
  "table-cell",
  "table-column",
  "table-column-group",
  "table-footer-group",
  "table-header-group",
  "table-row",
  "table-row-group",
  "text",
  "text-bottom",
  "text-top",
  "textarea",
  "textfield",
  "thick",
  "thin",
  "threeddarkshadow",
  "threedface",
  "threedhighlight",
  "threedlightshadow",
  "threedshadow",
  "to",
  "top",
  "transform",
  "translate",
  "translate3d",
  "translateX",
  "translateY",
  "translateZ",
  "transparent",
  "ultra-condensed",
  "ultra-expanded",
  "underline",
  "unidirectional-pan",
  "unset",
  "up",
  "upper-latin",
  "uppercase",
  "url",
  "var",
  "vertical",
  "vertical-text",
  "view-box",
  "visible",
  "visibleFill",
  "visiblePainted",
  "visibleStroke",
  "visual",
  "w-resize",
  "wait",
  "wave",
  "wider",
  "window",
  "windowframe",
  "windowtext",
  "words",
  "wrap",
  "wrap-reverse",
  "x-large",
  "x-small",
  "xor",
  "xx-large",
  "xx-small"
].map((n) => ({ type: "keyword", label: n })).concat(/* @__PURE__ */ [
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "grey",
  "green",
  "greenyellow",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen"
].map((n) => ({ type: "constant", label: n }))), mm = /* @__PURE__ */ [
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "b",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "footer",
  "form",
  "header",
  "hgroup",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "meter",
  "nav",
  "ol",
  "output",
  "p",
  "pre",
  "ruby",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul"
].map((n) => ({ type: "type", label: n })), $m = /* @__PURE__ */ [
  "@charset",
  "@color-profile",
  "@container",
  "@counter-style",
  "@font-face",
  "@font-feature-values",
  "@font-palette-values",
  "@import",
  "@keyframes",
  "@layer",
  "@media",
  "@namespace",
  "@page",
  "@position-try",
  "@property",
  "@scope",
  "@starting-style",
  "@supports",
  "@view-transition"
].map((n) => ({ type: "keyword", label: n })), it = /^(\w[\w-]*|-\w[\w-]*|)$/, Qm = /^-(-[\w-]*)?$/;
function Sm(n, e) {
  var t;
  if ((n.name == "(" || n.type.isError) && (n = n.parent || n), n.name != "ArgList")
    return !1;
  let i = (t = n.parent) === null || t === void 0 ? void 0 : t.firstChild;
  return i?.name != "Callee" ? !1 : e.sliceString(i.from, i.to) == "var";
}
const Go = /* @__PURE__ */ new wh(), bm = ["Declaration"];
function ym(n) {
  for (let e = n; ; ) {
    if (e.type.isTop)
      return e;
    if (!(e = e.parent))
      return n;
  }
}
function _O(n, e, t) {
  if (e.to - e.from > 4096) {
    let i = Go.get(e);
    if (i)
      return i;
    let r = [], s = /* @__PURE__ */ new Set(), l = e.cursor(q.IncludeAnonymous);
    if (l.firstChild())
      do
        for (let o of _O(n, l.node, t))
          s.has(o.label) || (s.add(o.label), r.push(o));
      while (l.nextSibling());
    return Go.set(e, r), r;
  } else {
    let i = [], r = /* @__PURE__ */ new Set();
    return e.cursor().iterate((s) => {
      var l;
      if (t(s) && s.matchContext(bm) && ((l = s.node.nextSibling) === null || l === void 0 ? void 0 : l.name) == ":") {
        let o = n.sliceString(s.from, s.to);
        r.has(o) || (r.add(o), i.push({ label: o, type: "variable" }));
      }
    }), i;
  }
}
const Pm = (n) => (e) => {
  let { state: t, pos: i } = e, r = se(t).resolveInner(i, -1), s = r.type.isError && r.from == r.to - 1 && t.doc.sliceString(r.from, r.to) == "-";
  if (r.name == "PropertyName" || (s || r.name == "TagName") && /^(Block|Styles)$/.test(r.resolve(r.to).name))
    return { from: r.from, options: kr(), validFor: it };
  if (r.name == "ValueName")
    return { from: r.from, options: Vo, validFor: it };
  if (r.name == "PseudoClassName")
    return { from: r.from, options: Uo, validFor: it };
  if (n(r) || (e.explicit || s) && Sm(r, t.doc))
    return {
      from: n(r) || s ? r.from : i,
      options: _O(t.doc, ym(r), n),
      validFor: Qm
    };
  if (r.name == "TagName") {
    for (let { parent: a } = r; a; a = a.parent)
      if (a.name == "Block")
        return { from: r.from, options: kr(), validFor: it };
    return { from: r.from, options: mm, validFor: it };
  }
  if (r.name == "AtKeyword")
    return { from: r.from, options: $m, validFor: it };
  if (!e.explicit)
    return null;
  let l = r.resolve(i), o = l.childBefore(i);
  return o && o.name == ":" && l.name == "PseudoClassSelector" ? { from: i, options: Uo, validFor: it } : o && o.name == ":" && l.name == "Declaration" || l.name == "ArgList" ? { from: i, options: Vo, validFor: it } : l.name == "Block" || l.name == "Styles" ? { from: i, options: kr(), validFor: it } : null;
}, xm = /* @__PURE__ */ Pm((n) => n.name == "VariableName"), _n = /* @__PURE__ */ Tt.define({
  name: "css",
  parser: /* @__PURE__ */ gm.configure({
    props: [
      /* @__PURE__ */ Mi.add({
        Declaration: /* @__PURE__ */ cn()
      }),
      /* @__PURE__ */ Nn.add({
        "Block KeyframeList": qh
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*\}$/,
    wordChars: "-"
  }
});
function km() {
  return new Ln(_n, _n.data.of({ autocomplete: xm }));
}
const wm = 317, vm = 318, Do = 1, Xm = 2, Zm = 3, Tm = 4, Rm = 319, Cm = 321, Am = 322, jm = 5, Wm = 6, _m = 0, Ps = [
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
], MO = 125, Mm = 59, xs = 47, qm = 42, Ym = 43, zm = 45, Em = 60, Um = 44, Vm = 63, Gm = 46, Dm = 91, Lm = new bO({
  start: !1,
  shift(n, e) {
    return e == jm || e == Wm || e == Cm ? n : e == Am;
  },
  strict: !1
}), Bm = new ce((n, e) => {
  let { next: t } = n;
  (t == MO || t == -1 || e.context) && n.acceptToken(Rm);
}, { contextual: !0, fallback: !0 }), Im = new ce((n, e) => {
  let { next: t } = n, i;
  Ps.indexOf(t) > -1 || t == xs && ((i = n.peek(1)) == xs || i == qm) || t != MO && t != Mm && t != -1 && !e.context && n.acceptToken(wm);
}, { contextual: !0 }), Nm = new ce((n, e) => {
  n.next == Dm && !e.context && n.acceptToken(vm);
}, { contextual: !0 }), Fm = new ce((n, e) => {
  let { next: t } = n;
  if (t == Ym || t == zm) {
    if (n.advance(), t == n.next) {
      n.advance();
      let i = !e.context && e.canShift(Do);
      n.acceptToken(i ? Do : Xm);
    }
  } else t == Vm && n.peek(1) == Gm && (n.advance(), n.advance(), (n.next < 48 || n.next > 57) && n.acceptToken(Zm));
}, { contextual: !0 });
function wr(n, e) {
  return n >= 65 && n <= 90 || n >= 97 && n <= 122 || n == 95 || n >= 192 || !e && n >= 48 && n <= 57;
}
const Hm = new ce((n, e) => {
  if (n.next != Em || !e.dialectEnabled(_m) || (n.advance(), n.next == xs)) return;
  let t = 0;
  for (; Ps.indexOf(n.next) > -1; )
    n.advance(), t++;
  if (wr(n.next, !0)) {
    for (n.advance(), t++; wr(n.next, !1); )
      n.advance(), t++;
    for (; Ps.indexOf(n.next) > -1; )
      n.advance(), t++;
    if (n.next == Um) return;
    for (let i = 0; ; i++) {
      if (i == 7) {
        if (!wr(n.next, !0)) return;
        break;
      }
      if (n.next != "extends".charCodeAt(i)) break;
      n.advance(), t++;
    }
  }
  n.acceptToken(Tm, -t);
}), Km = _i({
  "get set async static": g.modifier,
  "for while do if else switch try catch finally return throw break continue default case defer": g.controlKeyword,
  "in of await yield void typeof delete instanceof as satisfies": g.operatorKeyword,
  "let var const using function class extends": g.definitionKeyword,
  "import export from": g.moduleKeyword,
  "with debugger new": g.keyword,
  TemplateString: g.special(g.string),
  super: g.atom,
  BooleanLiteral: g.bool,
  this: g.self,
  null: g.null,
  Star: g.modifier,
  VariableName: g.variableName,
  "CallExpression/VariableName TaggedTemplateExpression/VariableName": g.function(g.variableName),
  VariableDefinition: g.definition(g.variableName),
  Label: g.labelName,
  PropertyName: g.propertyName,
  PrivatePropertyName: g.special(g.propertyName),
  "CallExpression/MemberExpression/PropertyName": g.function(g.propertyName),
  "FunctionDeclaration/VariableDefinition": g.function(g.definition(g.variableName)),
  "ClassDeclaration/VariableDefinition": g.definition(g.className),
  "NewExpression/VariableName": g.className,
  PropertyDefinition: g.definition(g.propertyName),
  PrivatePropertyDefinition: g.definition(g.special(g.propertyName)),
  UpdateOp: g.updateOperator,
  "LineComment Hashbang": g.lineComment,
  BlockComment: g.blockComment,
  Number: g.number,
  String: g.string,
  Escape: g.escape,
  ArithOp: g.arithmeticOperator,
  LogicOp: g.logicOperator,
  BitOp: g.bitwiseOperator,
  CompareOp: g.compareOperator,
  RegExp: g.regexp,
  Equals: g.definitionOperator,
  Arrow: g.function(g.punctuation),
  ": Spread": g.punctuation,
  "( )": g.paren,
  "[ ]": g.squareBracket,
  "{ }": g.brace,
  "InterpolationStart InterpolationEnd": g.special(g.brace),
  ".": g.derefOperator,
  ", ;": g.separator,
  "@": g.meta,
  TypeName: g.typeName,
  TypeDefinition: g.definition(g.typeName),
  "type enum interface implements namespace module declare": g.definitionKeyword,
  "abstract global Privacy readonly override": g.modifier,
  "is keyof unique infer asserts": g.operatorKeyword,
  JSXAttributeValue: g.attributeValue,
  JSXText: g.content,
  "JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": g.angleBracket,
  "JSXIdentifier JSXNameSpacedName": g.tagName,
  "JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": g.attributeName,
  "JSXBuiltin/JSXIdentifier": g.standard(g.tagName)
}), Jm = { __proto__: null, export: 20, as: 25, from: 33, default: 36, async: 41, function: 42, in: 52, out: 55, const: 56, extends: 60, this: 64, true: 72, false: 72, null: 84, void: 88, typeof: 92, super: 108, new: 142, delete: 154, yield: 163, await: 167, class: 172, public: 237, private: 237, protected: 237, readonly: 239, instanceof: 258, satisfies: 261, import: 294, keyof: 351, unique: 355, infer: 361, asserts: 397, is: 399, abstract: 419, implements: 421, type: 423, let: 426, var: 428, using: 431, interface: 437, enum: 441, namespace: 447, module: 449, declare: 453, global: 457, defer: 473, for: 478, of: 487, while: 490, with: 494, do: 498, if: 502, else: 504, switch: 508, case: 514, try: 520, catch: 524, finally: 528, return: 532, throw: 536, break: 540, continue: 544, debugger: 548 }, e$ = { __proto__: null, async: 129, get: 131, set: 133, declare: 195, public: 197, private: 197, protected: 197, static: 199, abstract: 201, override: 203, readonly: 209, accessor: 211, new: 403 }, t$ = { __proto__: null, "<": 193 }, i$ = Rt.deserialize({
  version: 14,
  states: "$GSQ%TQlOOO%[QlOOO'_QpOOP(lO`OOO*zQ!0MxO'#CiO+RO#tO'#CjO+aO&jO'#CjO+oO#@ItO'#DaO.QQlO'#DgO.bQlO'#DrO%[QlO'#DzO0fQlO'#ESOOQ!0Lf'#E['#E[O1PQ`O'#EXOOQO'#Ep'#EpOOQO'#Im'#ImO1XQ`O'#GtO1dQ`O'#EoO1iQ`O'#EoO3hQ!0MxO'#JsO6[Q!0MxO'#JtO6uQ`O'#F^O6zQ,UO'#FuOOQ!0Lf'#Fg'#FgO7VO7dO'#FgO9XQMhO'#F}O9`Q`O'#F|OOQ!0Lf'#Jt'#JtOOQ!0Lb'#Js'#JsO9eQ`O'#GxOOQ['#K`'#K`O9pQ`O'#IZO9uQ!0LrO'#I[OOQ['#Ja'#JaOOQ['#I`'#I`Q`QlOOQ`QlOOO9}Q!L^O'#DvO:UQlO'#EOO:]QlO'#EQO9kQ`O'#GtO:dQMhO'#CoO:rQ`O'#EnO:}Q`O'#EzO;hQMhO'#FfO;xQ`O'#GtOOQO'#Ka'#KaO;}Q`O'#KaO<]Q`O'#G|O<]Q`O'#G}O<]Q`O'#HPO9kQ`O'#HSO=SQ`O'#HVO>kQ`O'#CeO>{Q`O'#HdO?TQ`O'#HjO?TQ`O'#HlO`QlO'#HnO?TQ`O'#HpO?TQ`O'#HsO?YQ`O'#HyO?_Q!0LsO'#IPO%[QlO'#IRO?jQ!0LsO'#ITO?uQ!0LsO'#IVO9uQ!0LrO'#IXO@QQ!0MxO'#CiOASQpO'#DlQOQ`OOO%[QlO'#EQOAjQ`O'#ETO:dQMhO'#EnOAuQ`O'#EnOBQQ!bO'#FfOOQ['#Cg'#CgOOQ!0Lb'#Dq'#DqOOQ!0Lb'#Jw'#JwO%[QlO'#JwOOQO'#Jz'#JzOOQO'#Ii'#IiOCQQpO'#EgOOQ!0Lb'#Ef'#EfOOQ!0Lb'#KO'#KOOC|Q!0MSO'#EgODWQpO'#EWOOQO'#Jy'#JyODlQpO'#JzOEyQpO'#EWODWQpO'#EgPFWO&2DjO'#CbPOOO)CEO)CEOOOOO'#Ia'#IaOFcO#tO,59UOOQ!0Lh,59U,59UOOOO'#Ib'#IbOFqO&jO,59UOGPQ!L^O'#DcOOOO'#Id'#IdOGWO#@ItO,59{OOQ!0Lf,59{,59{OGfQlO'#IeOGyQ`O'#JuOIxQ!fO'#JuO+}QlO'#JuOJPQ`O,5:ROJgQ`O'#EpOJtQ`O'#KUOKPQ`O'#KTOKPQ`O'#KTOKXQ`O,5;^OK^Q`O'#KSOOQ!0Ln,5:^,5:^OKeQlO,5:^OMcQ!0MxO,5:fONSQ`O,5:nONmQ!0LrO'#KRONtQ`O'#KQO9eQ`O'#KQO! YQ`O'#KQO! bQ`O,5;]O! gQ`O'#KQO!#lQ!fO'#JtOOQ!0Lh'#Ci'#CiO%[QlO'#ESO!$[Q!fO,5:sOOQS'#J{'#J{OOQO-E<k-E<kO9kQ`O,5=`O!$rQ`O,5=`O!$wQlO,5;ZO!&zQMhO'#EkO!(eQ`O,5;ZO!(jQlO'#DyO!(tQpO,5;eO!(|QpO,5;eO%[QlO,5;eOOQ['#FU'#FUOOQ['#FW'#FWO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fOOQ['#F['#F[O!)[QlO,5;uOOQ!0Lf,5;z,5;zOOQ!0Lf,5;{,5;{OOQ!0Lf,5;},5;}O%[QlO'#IqO!+_Q!0LrO,5<jO%[QlO,5;fO!&zQMhO,5;fO!+|QMhO,5;fO!-nQMhO'#E^O%[QlO,5;xOOQ!0Lf,5;|,5;|O!-uQ,UO'#FkO!.rQ,UO'#KYO!.^Q,UO'#KYO!.yQ,UO'#KYOOQO'#KY'#KYO!/_Q,UO,5<TOOOW,5<a,5<aO!/pQlO'#FwOOOW'#Ip'#IpO7VO7dO,5<RO!/wQ,UO'#FyOOQ!0Lf,5<R,5<RO!0hQ$IUO'#CyOOQ!0Lh'#C}'#C}O!0{O#@ItO'#DRO!1iQMjO,5<fO!1pQ`O,5<iO!3YQ(CWO'#GYO!3jQ`O'#GZO!3oQ`O'#GZO!5_Q(CWO'#G_O!6dQpO'#GcOOQO'#Go'#GoO!,TQMhO'#GnOOQO'#Gq'#GqO!,TQMhO'#GpO!7VQ$IUO'#JmOOQ!0Lh'#Jm'#JmO!7aQ`O'#JlO!7oQ`O'#JkO!7wQ`O'#CuOOQ!0Lh'#C{'#C{O!8YQ`O'#C}OOQ!0Lh'#DV'#DVOOQ!0Lh'#DX'#DXO!8_Q`O,5<fO1SQ`O'#DZO!,TQMhO'#GQO!,TQMhO'#GSO!8gQ`O'#GUO!8lQ`O'#GVO!3oQ`O'#G]O!,TQMhO'#GbO<]Q`O'#JlO!8qQ`O'#EqO!9`Q`O,5<hOOQ!0Lb'#Cr'#CrO!9hQ`O'#ErO!:bQpO'#EsOOQ!0Lb'#KS'#KSO!:iQ!0LrO'#KbO9uQ!0LrO,5=dO`QlO,5>uOOQ['#Ji'#JiOOQ[,5>v,5>vOOQ[-E<^-E<^O!<hQ!0MxO,5:bO!=[QpO,5:`O!?WQ!0MxO,5:jO%[QlO,5:jO!AnQ!0MxO,5:lOOQO,5@{,5@{O!B_QMhO,5=`O!BmQ!0LrO'#JjO9`Q`O'#JjO!COQ!0LrO,59ZO!CZQpO,59ZO!CcQMhO,59ZO:dQMhO,59ZO!CnQ`O,5;ZO!CvQ`O'#HcO!D[Q`O'#KeO%[QlO,5<OO!=[QpO,5<QO!DdQ`O,5={O!DiQ`O,5={O!DnQ`O,5={O!D|Q`O,5={O9uQ!0LrO,5={O<]Q`O,5=kOOQO'#Cy'#CyO!ETQpO,5=hO!E]QMhO,5=iO!EhQ`O,5=kO!EmQ!bO,5=nO!EuQ`O'#KaO?YQ`O'#HXO9kQ`O'#HZO!EzQ`O'#HZO:dQMhO'#H]O!FPQ`O'#H]OOQ[,5=q,5=qO!FUQ`O'#H^O!FgQ`O'#CoO!FlQ`O,59PO!FvQ`O,59PO!H{QlO,59POOQ[,59P,59PO!I]Q!0LrO,59PO%[QlO,59PO!KhQlO'#HfOOQ['#Hg'#HgOOQ['#Hh'#HhO`QlO,5>OO!LOQ`O,5>OO`QlO,5>UO`QlO,5>WO!LTQ`O,5>YO`QlO,5>[O!LYQ`O,5>_O!L_QlO,5>eOOQ[,5>k,5>kO%[QlO,5>kO9uQ!0LrO,5>mOOQ[,5>o,5>oO#!iQ`O,5>oOOQ[,5>q,5>qO#!iQ`O,5>qOOQ[,5>s,5>sO##VQpO'#D_O%[QlO'#JwO##aQpO'#JwO##{QpO'#DmO#$^QpO'#DmO#&oQlO'#DmO#&vQ`O'#JvO#'OQ`O,5:WO#'TQ`O'#EtO#'`Q`O'#EtO#'eQ`O'#KVO#'mQ`O,5;_O#'rQpO'#DmO#(PQpO'#EVOOQ!0Lf,5:o,5:oO%[QlO,5:oO#(WQ`O,5:oO?YQ`O,5;YO!CZQpO,5;YO!CcQMhO,5;YO:dQMhO,5;YO#(`Q`O,5@cO#(eQ07dO,5:sOOQO-E<g-E<gO#)kQ!0MSO,5;RODWQpO,5:rO#)uQpO,5:rODWQpO,5;RO!COQ!0LrO,5:rOOQ!0Lb'#Ej'#EjOOQO,5;R,5;RO%[QlO,5;RO#*SQ!0LrO,5;RO#*_Q!0LrO,5;RO!CZQpO,5:rOOQO,5;X,5;XO#*mQ!0LrO,5;RPOOO'#I_'#I_P#+RO&2DjO,58|POOO,58|,58|OOOO-E<_-E<_OOQ!0Lh1G.p1G.pOOOO-E<`-E<`OOOO,59},59}O#+^Q!bO,59}OOOO-E<b-E<bOOQ!0Lf1G/g1G/gO#+cQ!fO,5?PO+}QlO,5?POOQO,5?V,5?VO#+mQlO'#IeOOQO-E<c-E<cO#+zQ`O,5@aO#,SQ!fO,5@aO#,ZQ`O,5@oOOQ!0Lf1G/m1G/mO%[QlO,5@pO#,cQ`O'#IkOOQO-E<i-E<iO#,ZQ`O,5@oOOQ!0Lb1G0x1G0xOOQ!0Ln1G/x1G/xOOQ!0Ln1G0Y1G0YO%[QlO,5@mO#,wQ!0LrO,5@mO#-YQ!0LrO,5@mO#-aQ`O,5@lO9eQ`O,5@lO#-iQ`O,5@lO#-wQ`O'#InO#-aQ`O,5@lOOQ!0Lb1G0w1G0wO!(tQpO,5:uO!)PQpO,5:uOOQS,5:w,5:wO#.iQdO,5:wO#.qQMhO1G2zO9kQ`O1G2zOOQ!0Lf1G0u1G0uO#/PQ!0MxO1G0uO#0UQ!0MvO,5;VOOQ!0Lh'#GX'#GXO#0rQ!0MzO'#JmO!$wQlO1G0uO#2}Q!fO'#JxO%[QlO'#JxO#3XQ`O,5:eOOQ!0Lh'#D_'#D_OOQ!0Lf1G1P1G1PO%[QlO1G1POOQ!0Lf1G1g1G1gO#3^Q`O1G1PO#5rQ!0MxO1G1QO#5yQ!0MxO1G1QO#8aQ!0MxO1G1QO#8hQ!0MxO1G1QO#;OQ!0MxO1G1QO#=fQ!0MxO1G1QO#=mQ!0MxO1G1QO#=tQ!0MxO1G1QO#@[Q!0MxO1G1QO#@cQ!0MxO1G1QO#BpQ?MtO'#CiO#DkQ?MtO1G1aO#DrQ?MtO'#JtO#EVQ!0MxO,5?]OOQ!0Lb-E<o-E<oO#GdQ!0MxO1G1QO#HaQ!0MzO1G1QOOQ!0Lf1G1Q1G1QO#IdQMjO'#J}O#InQ`O,5:xO#IsQ!0MxO1G1dO#JgQ,UO,5<XO#JoQ,UO,5<YO#JwQ,UO'#FpO#K`Q`O'#FoOOQO'#KZ'#KZOOQO'#Io'#IoO#KeQ,UO1G1oOOQ!0Lf1G1o1G1oOOOW1G1z1G1zO#KvQ?MtO'#JsO#LQQ`O,5<cO!)[QlO,5<cOOOW-E<n-E<nOOQ!0Lf1G1m1G1mO#LVQpO'#KYOOQ!0Lf,5<e,5<eO#L_QpO,5<eO#LdQMhO'#DTOOOO'#Ic'#IcO#LkO#@ItO,59mOOQ!0Lh,59m,59mO%[QlO1G2QO!8lQ`O'#IsO#LvQ`O,5<{OOQ!0Lh,5<x,5<xO!,TQMhO'#IvO#MdQMjO,5=YO!,TQMhO'#IxO#NVQMjO,5=[O!&zQMhO,5=^OOQO1G2T1G2TO#NaQ!dO'#CrO#NtQ(CWO'#ErO$ |QpO'#GcO$!dQ!dO,5<tO$!kQ`O'#K]O9eQ`O'#K]O$!yQ`O,5<vO$#aQ!dO'#C{O!,TQMhO,5<uO$#kQ`O'#G[O$$PQ`O,5<uO$$UQ!dO'#GXO$$cQ!dO'#K^O$$mQ`O'#K^O!&zQMhO'#K^O$$rQ`O,5<yO$$wQlO'#JwO$%RQpO'#GdO#$^QpO'#GdO$%dQ`O'#GhO!3oQ`O'#GlO$%iQ!0LrO'#IuO$%tQpO,5<}OOQ!0Lp,5<},5<}O$%{QpO'#GdO$&YQpO'#GeO$&kQpO'#GeO$&pQMjO,5=YO$'QQMjO,5=[OOQ!0Lh,5=_,5=_O!,TQMhO,5@WO!,TQMhO,5@WO$'bQ`O'#IzO$'vQ`O,5@VO$(OQ`O,59aOOQ!0Lh,59i,59iO$(TQ`O,5@WO$)TQ$IYO,59uOOQ!0Lh'#Jq'#JqO$)vQMjO,5<lO$*iQMjO,5<nO@zQ`O,5<pOOQ!0Lh,5<q,5<qO$*sQ`O,5<wO$*xQMjO,5<|O$+YQ`O'#KQO!$wQlO1G2SO$+_Q`O1G2SO9eQ`O'#KTO$+dQ`O'#D_O9eQ`O'#EtO%[QlO'#EtO9eQ`O'#I|O$+rQ!0LrO,5@|OOQ[1G3O1G3OOOQ[1G4a1G4aOOQ!0Lf1G/|1G/|OOQ!0Lf1G/z1G/zO$-tQ!0MxO1G0UOOQ[1G2z1G2zO!&zQMhO1G2zO%[QlO1G2zO#.tQ`O1G2zO$/xQMhO'#EkOOQ!0Lb,5@U,5@UO$0VQ!0LrO,5@UOOQ[1G.u1G.uO!COQ!0LrO1G.uO!CZQpO1G.uO!CcQMhO1G.uO$0hQ`O1G0uO$0mQ`O'#CiO$0xQ`O'#KfO$1QQ`O,5=}O$1VQ`O'#KfO$1[Q`O'#KfO$1jQ`O'#JSO$1xQ`O,5APO$2QQ!fO1G1jOOQ!0Lf1G1l1G1lO9kQ`O1G3gO@zQ`O1G3gO$2XQ`O1G3gO$2^Q`O1G3gO!DnQ`O1G3gO9uQ!0LrO1G3gOOQ[1G3g1G3gO!EhQ`O1G3VO!&zQMhO1G3SO$2cQ`O1G3SOOQ[1G3T1G3TO!&zQMhO1G3TO$2hQ`O1G3TO$2pQpO'#HROOQ[1G3V1G3VO!6_QpO'#JOO!EmQ!bO1G3YOOQ[1G3Y1G3YOOQ[,5=s,5=sO$2xQMhO,5=uO9kQ`O,5=uO$%dQ`O,5=wO9`Q`O,5=wO!CZQpO,5=wO!CcQMhO,5=wO:dQMhO,5=wO$3WQ`O'#KdO$3cQ`O,5=xOOQ[1G.k1G.kO$3hQ!0LrO1G.kO@zQ`O1G.kO$3sQ`O1G.kO9uQ!0LrO1G.kO$5{Q!fO,5ARO$6YQ`O,5ARO9eQ`O,5ARO$6eQlO,5>QO$6lQ`O,5>QOOQ[1G3j1G3jO`QlO1G3jOOQ[1G3p1G3pOOQ[1G3r1G3rO?TQ`O1G3tO$6qQlO1G3vO$:uQlO'#HuOOQ[1G3y1G3yO$;SQ`O'#H{O?YQ`O'#H}OOQ[1G4P1G4PO$;[QlO1G4PO9uQ!0LrO1G4VOOQ[1G4X1G4XOOQ!0Lb'#G`'#G`O9uQ!0LrO1G4ZO9uQ!0LrO1G4]O$?cQ`O,5@cO9eQ`O,5;`O?YQ`O,5:XO!)[QlO,5:XO!CZQpO,5:XO$?hQ?MtO,5:XOOQO,5;`,5;`O$?rQpO'#IfO$@YQ`O,5@bOOQ!0Lf1G/r1G/rO!)[QlO,5;`O$@bQpO'#IlO$@lQ`O,5@qOOQ!0Lb1G0y1G0yO#$^QpO,5:XOOQO'#Ih'#IhO$@tQpO,5:qOOQ!0Ln,5:q,5:qO#(ZQ`O1G0ZOOQ!0Lf1G0Z1G0ZO%[QlO1G0ZOOQ!0Lf1G0t1G0tO?YQ`O1G0tO!CZQpO1G0tO!CcQMhO1G0tOOQ!0Lb1G5}1G5}O!COQ!0LrO1G0^OOQO1G0m1G0mO%[QlO1G0mO$@{Q!0LrO1G0mO$AWQ!0LrO1G0mO!CZQpO1G0^ODWQpO1G0^O$AfQ!0LrO1G0mOOQO1G0^1G0^O$AzQ!0MxO1G0mPOOO-E<]-E<]POOO1G.h1G.hOOOO1G/i1G/iO$BUQ!bO,5<jO$B^Q!fO1G4kOOQO1G4q1G4qO%[QlO,5?PO$BhQ`O1G5{O$BpQ`O1G6ZO$BxQ!fO1G6[O9eQ`O,5?VO$CSQ!0MxO1G6XO%[QlO1G6XO$CdQ!0LrO1G6XO$CuQ`O1G6WO$CuQ`O1G6WO9eQ`O1G6WO$C}Q`O,5?YO9eQ`O,5?YOOQO,5?Y,5?YO$DcQ`O,5?YO$+YQ`O,5?YOOQO-E<l-E<lOOQS1G0a1G0aOOQS1G0c1G0cO#.lQ`O1G0cOOQ[7+(f7+(fO!&zQMhO7+(fO%[QlO7+(fO$DqQ`O7+(fO$D|QMhO7+(fO$E[Q!0MzO,5=YO$GgQ!0MzO,5=[O$IrQ!0MzO,5=YO$LTQ!0MzO,5=[O$NfQ!0MzO,59uO%!kQ!0MzO,5<lO%$vQ!0MzO,5<nO%'RQ!0MzO,5<|OOQ!0Lf7+&a7+&aO%)dQ!0MxO7+&aO%*WQlO'#IgO%*eQ`O,5@dO%*mQ!fO,5@dOOQ!0Lf1G0P1G0PO%*wQ`O7+&kOOQ!0Lf7+&k7+&kO%*|Q?MtO,5:fO%[QlO7+&{O%+WQ?MtO,5:bO%+eQ?MtO,5:jO%+oQ?MtO,5:lO%+yQMhO'#IjO%,TQ`O,5@iOOQ!0Lh1G0d1G0dOOQO1G1s1G1sOOQO1G1t1G1tO%,]Q!jO,5<[O!)[QlO,5<ZOOQO-E<m-E<mOOQ!0Lf7+'Z7+'ZOOOW7+'f7+'fOOOW1G1}1G1}O%,hQ`O1G1}OOQ!0Lf1G2P1G2POOOO,59o,59oO%,mQ!dO,59oOOOO-E<a-E<aOOQ!0Lh1G/X1G/XO%,tQ!0MxO7+'lOOQ!0Lh,5?_,5?_O%-hQMhO1G2gP%-oQ`O'#IsPOQ!0Lh-E<q-E<qO%.]QMjO,5?bOOQ!0Lh-E<t-E<tO%/OQMjO,5?dOOQ!0Lh-E<v-E<vO%/YQ!dO1G2xO%/aQ!dO'#CrO%/wQMhO'#KTO$$wQlO'#JwOOQ!0Lh1G2`1G2`O%0RQ`O'#IrO%0jQ`O,5@wO%0jQ`O,5@wO%0rQ`O,5@wO%0}Q`O,5@wOOQO1G2b1G2bO%1]QMjO1G2aO$+YQ`O'#K]O!,TQMhO1G2aO%1mQ(CWO'#ItO%1zQ`O,5@xO!&zQMhO,5@xO%2SQ!dO,5@xOOQ!0Lh1G2e1G2eO%4dQ!fO'#CiO%4nQ`O,5=QOOQ!0Lb,5=O,5=OO%4vQpO,5=OOOQ!0Lb,5=P,5=POCwQ`O,5=OO%5RQpO,5=OOOQ!0Lb,5=S,5=SO$+YQ`O,5=WOOQO,5?a,5?aOOQO-E<s-E<sOOQ!0Lp1G2i1G2iO#$^QpO,5=OO$$wQlO,5=QO%5aQ`O,5=PO%5lQpO,5=PO!,TQMhO'#IvO%6fQMjO1G2tO!,TQMhO'#IxO%7XQMjO1G2vO%7cQMjO1G5rO%7mQMjO1G5rOOQO,5?f,5?fOOQO-E<x-E<xOOQO1G.{1G.{O!,TQMhO1G5rO!,TQMhO1G5rO!=[QpO,59wO%[QlO,59wOOQ!0Lh,5<k,5<kO%7zQ`O1G2[O!,TQMhO1G2cO%8PQ!0MxO7+'nOOQ!0Lf7+'n7+'nO!$wQlO7+'nO%8sQ`O,5;`OOQ!0Lb,5?h,5?hOOQ!0Lb-E<z-E<zO%8xQ!dO'#K_O#(ZQ`O7+(fO4UQ!fO7+(fO$DtQ`O7+(fO%9SQ!0MvO'#CiO%9gQ!0MvO,5=TO%9zQ`O,5=TO%:SQ`O,5=TOOQ!0Lb1G5p1G5pOOQ[7+$a7+$aO!COQ!0LrO7+$aO!CZQpO7+$aO!$wQlO7+&aO%:XQ`O'#JRO%:pQ`O,5AQOOQO1G3i1G3iO9kQ`O,5AQO%:pQ`O,5AQO%:xQ`O,5AQOOQO,5?n,5?nOOQO-E=Q-E=QOOQ!0Lf7+'U7+'UO%:}Q`O7+)RO9uQ!0LrO7+)RO9kQ`O7+)RO@zQ`O7+)RO%;SQ`O7+)ROOQ[7+)R7+)ROOQ[7+(q7+(qO%;XQ!0MvO7+(nO!&zQMhO7+(nO!EcQ`O7+(oOOQ[7+(o7+(oO!&zQMhO7+(oO%;cQ`O'#KcO%;nQ`O,5=mOOQO,5?j,5?jOOQO-E<|-E<|OOQ[7+(t7+(tO%=QQpO'#H[OOQ[1G3a1G3aO!&zQMhO1G3aO%[QlO1G3aO%=XQ`O1G3aO%=dQMhO1G3aO9uQ!0LrO1G3cO$%dQ`O1G3cO9`Q`O1G3cO!CZQpO1G3cO!CcQMhO1G3cO%=rQ`O'#JQO%>WQ`O,5AOO%>`QpO,5AOOOQ!0Lb1G3d1G3dOOQ[7+$V7+$VO@zQ`O7+$VO9uQ!0LrO7+$VO%>kQ`O7+$VO%[QlO1G6mO%[QlO1G6nO%>pQ!0LrO1G6mO%>zQlO1G3lO%?RQ`O1G3lO%?WQlO1G3lOOQ[7+)U7+)UO9uQ!0LrO7+)`O`QlO7+)bOOQ['#Ki'#KiOOQ['#JT'#JTO%?_QlO,5>aOOQ[,5>a,5>aO%[QlO'#HvO%?lQ`O'#HxOOQ[,5>g,5>gO9eQ`O,5>gOOQ[,5>i,5>iOOQ[7+)k7+)kOOQ[7+)q7+)qOOQ[7+)u7+)uOOQ[7+)w7+)wO%?qQpO1G5}O%@]Q`O1G0zOOQO1G/s1G/sO%@hQ?MtO1G/sO?YQ`O1G/sO!)[QlO'#DmOOQO,5?Q,5?QOOQO-E<d-E<dO%@rQ?MtO1G0zOOQO,5?W,5?WOOQO-E<j-E<jO!CZQpO1G/sOOQO-E<f-E<fOOQ!0Ln1G0]1G0]OOQ!0Lf7+%u7+%uO#(ZQ`O7+%uOOQ!0Lf7+&`7+&`O?YQ`O7+&`O!CZQpO7+&`OOQO7+%x7+%xO$AzQ!0MxO7+&XOOQO7+&X7+&XO%[QlO7+&XO%@|Q!0LrO7+&XO!COQ!0LrO7+%xO!CZQpO7+%xO%AXQ!0LrO7+&XO%AgQ!0MxO7++sO%[QlO7++sO%AwQ`O7++rO%AwQ`O7++rOOQO1G4t1G4tO9eQ`O1G4tO%BPQ`O1G4tOOQS7+%}7+%}O#(ZQ`O<<LQO4UQ!fO<<LQO%B_Q`O<<LQOOQ[<<LQ<<LQO!&zQMhO<<LQO%[QlO<<LQO%BgQ`O<<LQO%BrQ!0MzO,5?bO%D}Q!0MzO,5?dO%GYQ!0MzO1G2aO%IkQ!0MzO1G2tO%KvQ!0MzO1G2vO%NRQ!fO,5?RO%[QlO,5?ROOQO-E<e-E<eO%N]Q`O1G6OOOQ!0Lf<<JV<<JVO%NeQ?MtO1G0uO&!lQ?MtO1G1QO&!sQ?MtO1G1QO&$tQ?MtO1G1QO&${Q?MtO1G1QO&&|Q?MtO1G1QO&(}Q?MtO1G1QO&)UQ?MtO1G1QO&)]Q?MtO1G1QO&+^Q?MtO1G1QO&+eQ?MtO1G1QO&+lQ!0MxO<<JgO&-dQ?MtO1G1QO&.aQ?MvO1G1QO&/dQ?MvO'#JmO&1jQ?MtO1G1dO&1wQ?MtO1G0UO&2RQMjO,5?UOOQO-E<h-E<hO!)[QlO'#FrOOQO'#K['#K[OOQO1G1v1G1vO&2]Q`O1G1uO&2bQ?MtO,5?]OOOW7+'i7+'iOOOO1G/Z1G/ZO&2lQ!dO1G4yOOQ!0Lh7+(R7+(RP!&zQMhO,5?_O!,TQMhO7+(dO&2sQ`O,5?^O9eQ`O,5?^O$+YQ`O,5?^OOQO-E<p-E<pO&3RQ`O1G6cO&3RQ`O1G6cO&3ZQ`O1G6cO&3fQMjO7+'{O&3vQ!dO,5?`O&4QQ`O,5?`O!&zQMhO,5?`OOQO-E<r-E<rO&4VQ!dO1G6dO&4aQ`O1G6dO&4iQ`O1G2lO!&zQMhO1G2lOOQ!0Lb1G2j1G2jOOQ!0Lb1G2k1G2kO%4vQpO1G2jO!CZQpO1G2jOCwQ`O1G2jOOQ!0Lb1G2r1G2rO&4nQpO1G2jO&4|Q`O1G2lO$+YQ`O1G2kOCwQ`O1G2kO$$wQlO1G2lO&5UQ`O1G2kO&5xQMjO,5?bOOQ!0Lh-E<u-E<uO&6kQMjO,5?dOOQ!0Lh-E<w-E<wO!,TQMhO7++^O&6uQMjO7++^O&7PQMjO7++^OOQ!0Lh1G/c1G/cO&7^Q`O1G/cOOQ!0Lh7+'v7+'vO&7cQMjO7+'}O&7sQ!0MxO<<KYOOQ!0Lf<<KY<<KYO&8gQ`O1G0zO!&zQMhO'#I{O&8lQ`O,5@yO&:nQ!fO<<LQO!&zQMhO1G2oO&:uQ!0LrO1G2oOOQ[<<G{<<G{O!COQ!0LrO<<G{O&;WQ!0MxO<<I{OOQ!0Lf<<I{<<I{OOQO,5?m,5?mO&;zQ`O,5?mO&<PQ`O,5?mOOQO-E=P-E=PO&<_Q`O1G6lO&<_Q`O1G6lO9kQ`O1G6lO@zQ`O<<LmOOQ[<<Lm<<LmO&<gQ`O<<LmO9uQ!0LrO<<LmO9kQ`O<<LmOOQ[<<LY<<LYO%;XQ!0MvO<<LYOOQ[<<LZ<<LZO!EcQ`O<<LZO&<lQpO'#I}O&<wQ`O,5@}O!)[QlO,5@}OOQ[1G3X1G3XOOQO'#JP'#JPO9uQ!0LrO'#JPO&=PQpO,5=vOOQ[,5=v,5=vO&=WQpO'#EgO&=_QpO'#GfO&=dQ`O7+({O&=iQ`O7+({OOQ[7+({7+({O!&zQMhO7+({O%[QlO7+({O&=qQ`O7+({OOQ[7+(}7+(}O9uQ!0LrO7+(}O$%dQ`O7+(}O9`Q`O7+(}O!CZQpO7+(}O&=|Q`O,5?lOOQO-E=O-E=OOOQO'#H_'#H_O&>XQ`O1G6jO9uQ!0LrO<<GqOOQ[<<Gq<<GqO@zQ`O<<GqO&>aQ`O7+,XO&>fQ`O7+,YO%[QlO7+,XO%[QlO7+,YOOQ[7+)W7+)WO&>kQ`O7+)WO&>pQlO7+)WO&>wQ`O7+)WOOQ[<<Lz<<LzOOQ[<<L|<<L|OOQ[-E=R-E=ROOQ[1G3{1G3{O&>|Q`O,5>bOOQ[,5>d,5>dO&?RQ`O1G4RO9eQ`O7+&fO!)[QlO7+&fOOQO7+%_7+%_O&?WQ?MtO1G6[O?YQ`O7+%_OOQ!0Lf<<Ia<<IaOOQ!0Lf<<Iz<<IzO?YQ`O<<IzOOQO<<Is<<IsO$AzQ!0MxO<<IsO%[QlO<<IsOOQO<<Id<<IdO!COQ!0LrO<<IdO&?bQ!0LrO<<IsO&?mQ!0MxO<= _O&?}Q`O<= ^OOQO7+*`7+*`O9eQ`O7+*`OOQ[ANAlANAlO&@VQ!fOANAlO!&zQMhOANAlO#(ZQ`OANAlO4UQ!fOANAlO&@^Q`OANAlO%[QlOANAlO&@fQ!0MzO7+'{O&BwQ!0MzO,5?bO&ESQ!0MzO,5?dO&G_Q!0MzO7+'}O&IpQ!fO1G4mO&IzQ?MtO7+&aO&LOQ?MvO,5=YO&NVQ?MvO,5=[O&NgQ?MvO,5=YO&NwQ?MvO,5=[O' XQ?MvO,59uO'#_Q?MvO,5<lO'%bQ?MvO,5<nO''vQ?MvO,5<|O')lQ?MtO7+'lO')yQ?MtO7+'nO'*WQ`O,5<^OOQO7+'a7+'aOOQ!0Lh7+*e7+*eO'*]QMjO<<LOOOQO1G4x1G4xO'*dQ`O1G4xO'*oQ`O1G4xO'*}Q`O7++}O'*}Q`O7++}O!&zQMhO1G4zO'+VQ!dO1G4zO'+aQ`O7+,OO'+iQ`O7+(WO'+tQ!dO7+(WOOQ!0Lb7+(U7+(UOOQ!0Lb7+(V7+(VO!CZQpO7+(UOCwQ`O7+(UO',OQ`O7+(WO!&zQMhO7+(WO$+YQ`O7+(VO',TQ`O7+(WOCwQ`O7+(VO',]QMjO<<NxO!,TQMhO<<NxOOQ!0Lh7+$}7+$}O',gQ!dO,5?gOOQO-E<y-E<yO',qQ!0MvO7+(ZO!&zQMhO7+(ZOOQ[AN=gAN=gO9kQ`O1G5XOOQO1G5X1G5XO'-RQ`O1G5XO'-WQ`O7+,WO'-WQ`O7+,WO9uQ!0LrOANBXO@zQ`OANBXOOQ[ANBXANBXO'-`Q`OANBXOOQ[ANAtANAtOOQ[ANAuANAuO'-eQ`O,5?iOOQO-E<{-E<{O'-pQ?MtO1G6iOOQO,5?k,5?kOOQO-E<}-E<}OOQ[1G3b1G3bO'-zQ`O,5=QOOQ[<<Lg<<LgO!&zQMhO<<LgO&=dQ`O<<LgO'.PQ`O<<LgO%[QlO<<LgOOQ[<<Li<<LiO9uQ!0LrO<<LiO$%dQ`O<<LiO9`Q`O<<LiO'.XQpO1G5WO'.dQ`O7+,UOOQ[AN=]AN=]O9uQ!0LrOAN=]OOQ[<= s<= sOOQ[<= t<= tO'.lQ`O<= sO'.qQ`O<= tOOQ[<<Lr<<LrO'.vQ`O<<LrO'.{QlO<<LrOOQ[1G3|1G3|O?YQ`O7+)mO'/SQ`O<<JQO'/_Q?MtO<<JQOOQO<<Hy<<HyOOQ!0LfAN?fAN?fOOQOAN?_AN?_O$AzQ!0MxOAN?_OOQOAN?OAN?OO%[QlOAN?_OOQO<<Mz<<MzOOQ[G27WG27WO!&zQMhOG27WO#(ZQ`OG27WO'/iQ!fOG27WO4UQ!fOG27WO'/pQ`OG27WO'/xQ?MtO<<JgO'0VQ?MvO1G2aO'1{Q?MvO,5?bO'4OQ?MvO,5?dO'6RQ?MvO1G2tO'8UQ?MvO1G2vO':XQ?MtO<<KYO':fQ?MtO<<I{OOQO1G1x1G1xO!,TQMhOANAjOOQO7+*d7+*dO':sQ`O7+*dO';OQ`O<= iO';WQ!dO7+*fOOQ!0Lb<<Kr<<KrO$+YQ`O<<KrOCwQ`O<<KrO';bQ`O<<KrO!&zQMhO<<KrOOQ!0Lb<<Kp<<KpO!CZQpO<<KpO';mQ!dO<<KrOOQ!0Lb<<Kq<<KqO';wQ`O<<KrO!&zQMhO<<KrO$+YQ`O<<KqO';|QMjOANDdO'<WQ!0MvO<<KuOOQO7+*s7+*sO9kQ`O7+*sO'<hQ`O<= rOOQ[G27sG27sO9uQ!0LrOG27sO@zQ`OG27sO!)[QlO1G5TO'<pQ`O7+,TO'<xQ`O1G2lO&=dQ`OANBROOQ[ANBRANBRO!&zQMhOANBRO'<}Q`OANBROOQ[ANBTANBTO9uQ!0LrOANBTO$%dQ`OANBTOOQO'#H`'#H`OOQO7+*r7+*rOOQ[G22wG22wOOQ[ANE_ANE_OOQ[ANE`ANE`OOQ[ANB^ANB^O'=VQ`OANB^OOQ[<<MX<<MXO!)[QlOAN?lOOQOG24yG24yO$AzQ!0MxOG24yO#(ZQ`OLD,rOOQ[LD,rLD,rO!&zQMhOLD,rO'=[Q!fOLD,rO'=cQ?MvO7+'{O'?XQ?MvO,5?bO'A[Q?MvO,5?dO'C_Q?MvO7+'}O'ETQMjOG27UOOQO<<NO<<NOOOQ!0LbANA^ANA^O$+YQ`OANA^OCwQ`OANA^O'EeQ!dOANA^OOQ!0LbANA[ANA[O'ElQ`OANA^O!&zQMhOANA^O'EwQ!dOANA^OOQ!0LbANA]ANA]OOQO<<N_<<N_OOQ[LD-_LD-_O9uQ!0LrOLD-_O'FRQ?MtO7+*oOOQO'#Gg'#GgOOQ[G27mG27mO&=dQ`OG27mO!&zQMhOG27mOOQ[G27oG27oO9uQ!0LrOG27oOOQ[G27xG27xO'F]Q?MtOG25WOOQOLD*eLD*eOOQ[!$(!^!$(!^O#(ZQ`O!$(!^O!&zQMhO!$(!^O'FgQ!0MzOG27UOOQ!0LbG26xG26xO$+YQ`OG26xO'HxQ`OG26xOCwQ`OG26xO'ITQ!dOG26xO!&zQMhOG26xOOQ[!$(!y!$(!yOOQ[LD-XLD-XO&=dQ`OLD-XOOQ[LD-ZLD-ZOOQ[!)9Ex!)9ExO#(ZQ`O!)9ExOOQ!0LbLD,dLD,dO$+YQ`OLD,dOCwQ`OLD,dO'I[Q`OLD,dO'IgQ!dOLD,dOOQ[!$(!s!$(!sOOQ[!.K;d!.K;dO'InQ?MvOG27UOOQ!0Lb!$(!O!$(!OO$+YQ`O!$(!OOCwQ`O!$(!OO'KdQ`O!$(!OOOQ!0Lb!)9Ej!)9EjO$+YQ`O!)9EjOCwQ`O!)9EjOOQ!0Lb!.K;U!.K;UO$+YQ`O!.K;UOOQ!0Lb!4/0p!4/0pO!)[QlO'#DzO1PQ`O'#EXO'KoQ!fO'#JsO'KvQ!L^O'#DvO'K}QlO'#EOO'LUQ!fO'#CiO'NlQ!fO'#CiO!)[QlO'#EQO'N|QlO,5;ZO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO'#IqO(#PQ`O,5<jO!)[QlO,5;fO(#XQMhO,5;fO($rQMhO,5;fO!)[QlO,5;xO!&zQMhO'#GnO(#XQMhO'#GnO!&zQMhO'#GpO(#XQMhO'#GpO1SQ`O'#DZO1SQ`O'#DZO!&zQMhO'#GQO(#XQMhO'#GQO!&zQMhO'#GSO(#XQMhO'#GSO!&zQMhO'#GbO(#XQMhO'#GbO!)[QlO,5:jO($yQpO'#D_O!)[QlO,5@pO'N|QlO1G0uO(%TQ?MtO'#CiO!)[QlO1G2QO!&zQMhO'#IvO(#XQMhO'#IvO!&zQMhO'#IxO(#XQMhO'#IxO(%_Q!dO'#CrO!&zQMhO,5<uO(#XQMhO,5<uO'N|QlO1G2SO!)[QlO7+&{O!&zQMhO1G2aO(#XQMhO1G2aO!&zQMhO'#IvO(#XQMhO'#IvO!&zQMhO'#IxO(#XQMhO'#IxO!&zQMhO1G2cO(#XQMhO1G2cO'N|QlO7+'nO'N|QlO7+&aO!&zQMhOANAjO(#XQMhOANAjO(%rQ`O'#EoO(%wQ`O'#EoO(&PQ`O'#F^O(&UQ`O'#EzO(&ZQ`O'#KUO(&fQ`O'#KSO(&qQ`O,5;ZO(&vQMjO,5<fO(&}Q`O'#GZO('SQ`O'#GZO('XQ`O,5<fO('aQ`O,5<hO('iQ`O,5;ZO('qQ?MtO1G1aO('xQ`O,5<uO('}Q`O,5<uO((SQ`O,5<wO((XQ`O,5<wO((^Q`O1G2SO((cQ`O1G0uO((hQMjO<<LOO((oQMjO<<LOO((vQMhO'#F}O9`Q`O'#F|OAuQ`O'#EnO!)[QlO,5;uO!3oQ`O'#GZO!3oQ`O'#GZO!3oQ`O'#G]O!3oQ`O'#G]O!,TQMhO7+(dO!,TQMhO7+(dO%/YQ!dO1G2xO%/YQ!dO1G2xO!&zQMhO,5=^O!&zQMhO,5=^",
  stateData: "(){~O'}OS(OOSTOS(PRQ~OPYOQYOSfOY!VOaqOdzOeyOl!POpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!uwO!xxO!|]O$X|O$oiO%i}O%k!QO%m!OO%n!OO%o!OO%r!RO%t!SO%w!TO%x!TO%z!UO&X!WO&_!XO&a!YO&c!ZO&e![O&h!]O&n!^O&t!_O&v!`O&x!aO&z!bO&|!cO(USO(WTO(ZUO(bVO(p[O~OWtO~P`OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(U!dO(WTO(ZUO(bVO(p[O~Oa!wOs!nO!S!oO!b!yO!c!vO!d!vO!|<XO#T!pO#U!pO#V!xO#W!pO#X!pO#[!zO#]!zO(V!lO(WTO(ZUO(f!mO(p!sO~O(P!{O~OP]XR]X[]Xa]Xj]Xr]X!Q]X!S]X!]]X!l]X!p]X#R]X#S]X#`]X#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X'{]X(b]X(s]X(z]X({]X~O!g%SX~P(qO_!}O(W#PO(X!}O(Y#PO~O_#QO(Y#PO(Z#PO([#QO~Ox#SO!U#TO(c#TO(d#VO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(U<]O(WTO(ZUO(bVO(p[O~O![#ZO!]#WO!Y(iP!Y(wP~P+}O!^#cO~P`OPYOQYOSfOd!jOe!iOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(WTO(ZUO(bVO(p[O~Op#mO![#iO!|]O#j#lO#k#iO(U<^O!k(tP~P.iO!l#oO(U#nO~O!x#sO!|]O%i#tO~O#l#uO~O!g#vO#l#uO~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!]$_O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO#{$WO#|$XO(bVO(s$YO(z#|O({#}O~Oa(gX'{(gX'x(gX!k(gX!Y(gX!_(gX%j(gX!g(gX~P1qO#S$dO#`$eO$R$eOP(hXR(hX[(hXj(hXr(hX!Q(hX!S(hX!](hX!l(hX!p(hX#R(hX#o(hX#p(hX#q(hX#r(hX#s(hX#t(hX#u(hX#v(hX#w(hX#y(hX#{(hX#|(hX(b(hX(s(hX(z(hX({(hX!_(hX%j(hX~Oa(hX'{(hX'x(hX!Y(hX!k(hXv(hX!g(hX~P4UO#`$eO~O$^$hO$`$gO$g$mO~OSfO!_$nO$j$oO$l$qO~Oh%VOj%dOk%dOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#k%cO$X%`O$u%^O$w%_O$z%aO(U$sO(WTO(ZUO(b$uO(z$}O({%POg(_P~Ol%[O~P7eO!l%eO~O!S%hO!_%iO(U%gO~O!g%mO~Oa%nO'{%nO~O!Q%rO~P%[O(V!lO~P%[O%o%vO~P%[Oh%VO!l%eO(U%gO(V!lO~Oe%}O!l%eO(U%gO~Oj$RO~O!_&PO(U%gO(V!lO(WTO(ZUO`)XP~O!Q&SO!l&RO%k&VO&U&WO~P;SO!x#sO~O%t&YO!S)TX!_)TX(U)TX~O(U&ZO~Ol!PO!u&`O%k!QO%m!OO%n!OO%o!OO%r!RO%t!SO%w!TO%x!TO~Od&eOe&dO!x&bO%i&cO%|&aO~P<bOd&hOeyOl!PO!_&gO!u&`O!xxO!|]O%i}O%m!OO%n!OO%o!OO%r!RO%t!SO%w!TO%x!TO%z!UO~Ob&kO#`&nO%k&iO(V!lO~P=gO!l&oO!u&sO~O!l#oO~O!_XO~Oa%nO'y&{O'{%nO~Oa%nO'y'OO'{%nO~Oa%nO'y'QO'{%nO~O'x]X!Y]Xv]X!k]X&]]X!_]X%j]X!g]X~P(qO!b'`O!c'WO!d'WO(V!lO(WTO(ZUO~Os'UO!S'TO!['XO(f'SO!^(jP!^(yP~P@nOn'cO!_'aO(U%gO~Oe'hO!l%eO(U%gO~O!Q&SO!l&RO~Os!nO!S!oO!|<XO#T!pO#U!pO#W!pO#X!pO(V!lO(WTO(ZUO(f!mO(p!sO~O!b'nO!c'mO!d'mO#V!pO#['oO#]'oO~PBYOa%nOh%VO!g#vO!l%eO'{%nO(s'qO~O!p'uO#`'sO~PChOs!nO!S!oO(WTO(ZUO(f!mO(p!sO~O!_XOs(nX!S(nX!b(nX!c(nX!d(nX!|(nX#T(nX#U(nX#V(nX#W(nX#X(nX#[(nX#](nX(V(nX(W(nX(Z(nX(f(nX(p(nX~O!c'mO!d'mO(V!lO~PDWO(Q'yO(R'yO(S'{O~O_!}O(W'}O(X!}O(Y'}O~O_#QO(Y'}O(Z'}O([#QO~Ov(PO~P%[Ox#SO!U#TO(c#TO(d(SO~O![(UO!Y'XX!Y'_X!]'XX!]'_X~P+}O!](WO!Y(iX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!](WO!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO#{$WO#|$XO(bVO(s$YO(z#|O({#}O~O!Y(iX~PHRO!Y(]O~O!Y(vX!](vX!g(vX!k(vX(s(vX~O#`(vX#l#dX!^(vX~PJUO#`(^O!Y(xX!](xX~O!](_O!Y(wX~O!Y(bO~O#`$eO~PJUO!^(cO~P`OR#zO!Q#yO!S#{O!l#xO(bVOP!na[!naj!nar!na!]!na!p!na#R!na#o!na#p!na#q!na#r!na#s!na#t!na#u!na#v!na#w!na#y!na#{!na#|!na(s!na(z!na({!na~Oa!na'{!na'x!na!Y!na!k!nav!na!_!na%j!na!g!na~PKlO!k(dO~O!g#vO#`(eO(s'qO!](uXa(uX'{(uX~O!k(uX~PNXO!S%hO!_%iO!|]O#j(jO#k(iO(U%gO~O!](kO!k(tX~O!k(mO~O!S%hO!_%iO#k(iO(U%gO~OP(hXR(hX[(hXj(hXr(hX!Q(hX!S(hX!](hX!l(hX!p(hX#R(hX#o(hX#p(hX#q(hX#r(hX#s(hX#t(hX#u(hX#v(hX#w(hX#y(hX#{(hX#|(hX(b(hX(s(hX(z(hX({(hX~O!g#vO!k(hX~P! uOR(oO!Q(nO!l#xO#S$dO!|!{a!S!{a~O!x!{a%i!{a!_!{a#j!{a#k!{a(U!{a~P!#vO!x(sO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(U!dO(WTO(ZUO(bVO(p[O~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<uO!S${O!_$|O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(U(wO(WTO(ZUO(b$uO(z$}O({%PO~O#l(yO~O![({O!k(lP~P%[O(f(}O(p[O~O!S)PO!l#xO(f(}O(p[O~OP<WOQ<WOSfOd>SOe!iOpkOr<WOskOtkOzkO|<WO!O<WO!SWO!WkO!XkO!_!eO!i<ZO!lZO!o<WO!p<WO!q<WO!s<[O!u<_O!x!hO$X!kO$o>QO(U)^O(WTO(ZUO(bVO(p[O~O!]$_Oa$ra'{$ra'x$ra!k$ra!Y$ra!_$ra%j$ra!g$ra~Ol)eO~P!&zOh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#k%cO$X%`O$u%^O$w%_O$z%aO(U(wO(WTO(ZUO(b$uO(z$}O({%PO~Og(qP~P!,TO!Q)jO!g)iO!_$_X$[$_X$^$_X$`$_X$g$_X~O!g)iO!_(|X$[(|X$^(|X$`(|X$g(|X~O!Q)jO~P!.^O!Q)jO!_(|X$[(|X$^(|X$`(|X$g(|X~O!_)lO$[)pO$^)kO$`)kO$g)qO~O![)tO~P!)[O$^$hO$`$gO$g)xO~On${X!Q${X#S${X'z${X(z${X({${X~OgmXg${XnmX!]mX#`mX~P!0SOx)zO(c){O(d)}O~On*WO!Q*PO'z*QO(z$}O({%PO~Og*OO~P!1WOg*XO~Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<uO!S*ZO!_*[O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(WTO(ZUO(b$uO(z$}O({%PO~Op*aO![*_O(U*YO!k)PP~P!1uO#l*bO~O!l*cO~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<uO!S${O!_$|O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(U*eO(WTO(ZUO(b$uO(z$}O({%PO~O![*hO!Y)QP~P!3tOr*tOs!nO!S*jO!b*rO!c*lO!d*lO!l*cO#[*sO%a*nO(V!lO(WTO(ZUO(f!mO~O!^*qO~P!5iO#S$dOn(aX!Q(aX'z(aX(z(aX({(aX!](aX#`(aX~Og(aX$P(aX~P!6kOn*yO#`*xOg(`X!](`X~O!]*zOg(_X~Oj%dOk%dOl%dO(U&ZOg(_P~Os*}O~Og*OO(U&ZO~O!l+TO~O(U(wO~Op+XO!S%hO![#iO!_%iO!|]O#j#lO#k#iO(U%gO!k(tP~O!g#vO#l+YO~O!S%hO![+[O!](_O!_%iO(U%gO!Y(wP~Os']O!S+_O![+^O(WTO(ZUO(f+]O~O!^(yP~P!9|O!]+`Oa)UX'{)UX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO#{$WO#|$XO(bVO(s$YO(z#|O({#}O~Oa!ja!]!ja'{!ja'x!ja!Y!ja!k!jav!ja!_!ja%j!ja!g!ja~P!:tO(f(}O~OR#zO!Q#yO!S#{O!l#xO(bVOP!ra[!raj!rar!ra!]!ra!p!ra#R!ra#o!ra#p!ra#q!ra#r!ra#s!ra#t!ra#u!ra#v!ra#w!ra#y!ra#{!ra#|!ra(s!ra(z!ra({!ra~Oa!ra'{!ra'x!ra!Y!ra!k!rav!ra!_!ra%j!ra!g!ra~P!=aOR#zO!Q#yO!S#{O!l#xO(bVOP!ta[!taj!tar!ta!]!ta!p!ta#R!ta#o!ta#p!ta#q!ta#r!ta#s!ta#t!ta#u!ta#v!ta#w!ta#y!ta#{!ta#|!ta(s!ta(z!ta({!ta~Oa!ta'{!ta'x!ta!Y!ta!k!tav!ta!_!ta%j!ta!g!ta~P!?wOh%VOn+iO!_'aO%j+hO~O!g+kOa(^X!_(^X'{(^X!](^X~Oa%nO!_XO'{%nO~Oh%VO!l%eO~Oh%VO!l%eO(U%gO~O!g#vO#l(yO~Ob+vO%k+wO(U+sO(WTO(ZUO!^)YP~O!]+xO`)XX~O[+|O~O`+}O~O!_&PO(U%gO(V!lO`)XP~O%k,QO~P;SOh%VO#`,UO~Oh%VOn,XO!_$|O~O!_,ZO~O!Q,]O!_XO~O%o%vO~O!x,bO~Oe,gO~Ob,hO(U#nO(WTO(ZUO!^)WP~Oe%}O~O%k!QO(U&ZO~P=gO[,mO`,lO~OPYOQYOSfOdzOeyOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!iuO!lZO!oYO!pYO!qYO!svO!xxO!|]O$oiO%i}O(WTO(ZUO(bVO(p[O~O!_!eO!u!gO$X!kO(U!dO~P!GOO`,lOa%nO'{%nO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!x!hO$X!kO$oiO(U!dO(WTO(ZUO(bVO(p[O~Oa,rOl!OO!uwO%m!OO%n!OO%o!OO~P!IhO!l&oO~O&_,xO~O!_,zO~O&p,|O&r,}OP&maQ&maS&maY&maa&mad&mae&mal&map&mar&mas&mat&maz&ma|&ma!O&ma!S&ma!W&ma!X&ma!_&ma!i&ma!l&ma!o&ma!p&ma!q&ma!s&ma!u&ma!x&ma!|&ma$X&ma$o&ma%i&ma%k&ma%m&ma%n&ma%o&ma%r&ma%t&ma%w&ma%x&ma%z&ma&X&ma&_&ma&a&ma&c&ma&e&ma&h&ma&n&ma&t&ma&v&ma&x&ma&z&ma&|&ma'x&ma(U&ma(W&ma(Z&ma(b&ma(p&ma!^&ma&f&mab&ma&k&ma~O(U-SO~Oh!eX!]#iX!^#iX!g!RX!g!eX!l!eX#`#iX~O!]!eX!^!eX~P#!nO!g-WOh(kX!](kX!^(kX!g(kX!l(kXr(kX(s(kX~Oh%VO!g-YO!l%eO!]!aX!^!aX~Os!nO!S!oO(WTO(ZUO(f!mO~OP<WOQ<WOSfOd>SOe!iOpkOr<WOskOtkOzkO|<WO!O<WO!SWO!WkO!XkO!_!eO!i<ZO!lZO!o<WO!p<WO!q<WO!s<[O!u<_O!x!hO$X!kO$o>QO(WTO(ZUO(bVO(p[O~O(U=RO~P#$oO!]-^O!^(jX~O!^-`O~O#`-aO!]#hX!^#hX~O!g-WO~O!]-bO!^(yX~O!^-dO~O!c-eO!d-eO(V!lO~P#$^O!^-hO~P'_On-kO!_'aO~O!Y-pO~Os!{a!b!{a!c!{a!d!{a#T!{a#U!{a#V!{a#W!{a#X!{a#[!{a#]!{a(V!{a(W!{a(Z!{a(f!{a(p!{a~P!#vO!p-uO#`-sO~PChO!c-wO!d-wO(V!lO~PDWOa%nO#`-sO'{%nO~Oa%nO!g#vO#`-sO'{%nO~Oa%nO!g#vO!p-uO#`-sO'{%nO(s'qO~O(Q'yO(R'yO(S-|O~Ov-}O~O!Y'Xa!]'Xa~P!:tO![.RO!Y'XX!]'XX~P%[O!](WO!Y(ia~O!Y(ia~PHRO!](_O!Y(wa~O!S%hO![.VO!_%iO(U%gO!Y'_X!]'_X~O#`.XO!](ua!k(uaa(ua'{(ua~O!g#vO~P#,wO!](kO!k(ta~O!S%hO!_%iO#k.]O(U%gO~Op.bO!S%hO![._O!_%iO!|]O#j.aO#k._O(U%gO!]'bX!k'bX~OR.fO!l#xO~Oh%VOn.iO!_'aO%j.hO~Oa#ci!]#ci'{#ci'x#ci!Y#ci!k#civ#ci!_#ci%j#ci!g#ci~P!:tOn>^O!Q*PO'z*QO(z$}O({%PO~O#l#_aa#_a#`#_a'{#_a!]#_a!k#_a!_#_a!Y#_a~P#/sO#l(aXP(aXR(aX[(aXa(aXj(aXr(aX!S(aX!l(aX!p(aX#R(aX#o(aX#p(aX#q(aX#r(aX#s(aX#t(aX#u(aX#v(aX#w(aX#y(aX#{(aX#|(aX'{(aX(b(aX(s(aX!k(aX!Y(aX'x(aXv(aX!_(aX%j(aX!g(aX~P!6kO!].vO!k(lX~P!:tO!k.yO~O!Y.{O~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(bVO[#nia#nij#nir#ni!]#ni#R#ni#p#ni#q#ni#r#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni'{#ni(s#ni(z#ni({#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#o#ni~P#3cO#o$OO~P#3cOP$[OR#zOr$aO!Q#yO!S#{O!l#xO!p$[O#o$OO#p$PO#q$PO#r$PO(bVO[#nia#nij#ni!]#ni#R#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni'{#ni(s#ni(z#ni({#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#s#ni~P#6QO#s$QO~P#6QOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO(bVOa#ni!]#ni#y#ni#{#ni#|#ni'{#ni(s#ni(z#ni({#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#w#ni~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO(bVO({#}Oa#ni!]#ni#{#ni#|#ni'{#ni(s#ni(z#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#y$UO~P#;VO#y#ni~P#;VO#w$SO~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO(bVO(z#|O({#}Oa#ni!]#ni#|#ni'{#ni(s#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#{#ni~P#={O#{$WO~P#={OP]XR]X[]Xj]Xr]X!Q]X!S]X!l]X!p]X#R]X#S]X#`]X#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X(b]X(s]X(z]X({]X!]]X!^]X~O$P]X~P#@jOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO#w<eO#y<gO#{<iO#|<jO(bVO(s$YO(z#|O({#}O~O$P.}O~P#BwO#S$dO#`<pO$R<pO$P(hX!^(hX~P! uOa'ea!]'ea'{'ea'x'ea!k'ea!Y'eav'ea!_'ea%j'ea!g'ea~P!:tO[#nia#nij#nir#ni!]#ni#R#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni'{#ni(s#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#o$OO#p$PO#q$PO#r$PO(bVO(z#ni({#ni~P#EyOn>^O!Q*PO'z*QO(z$}O({%POP#niR#ni!S#ni!l#ni!p#ni#o#ni#p#ni#q#ni#r#ni(b#ni~P#EyO!]/ROg(qX~P!1WOg/TO~Oa$Qi!]$Qi'{$Qi'x$Qi!Y$Qi!k$Qiv$Qi!_$Qi%j$Qi!g$Qi~P!:tO$^/UO$`/UO~O$^/VO$`/VO~O!g)iO#`/WO!_$dX$[$dX$^$dX$`$dX$g$dX~O![/XO~O!_)lO$[/ZO$^)kO$`)kO$g/[O~O!]<kO!^(gX~P#BwO!^/]O~O!g)iO$g(|X~O$g/_O~Ov/`O~P!&zOx)zO(c){O(d/cO~O!S/fO~O(z$}On%ba!Q%ba'z%ba({%ba!]%ba#`%ba~Og%ba$P%ba~P#L{O({%POn%da!Q%da'z%da(z%da!]%da#`%da~Og%da$P%da~P#MnO!]fX!gfX!kfX!k${X(sfX~P!0SOp%WO![/oO!](_O(U/nO!Y(wP!Y)QP~P!1uOr*tO!b*rO!c*lO!d*lO!l*cO#[*sO%a*nO(V!lO(WTO(ZUO~Os'UO!S/pO![+^O!^*qO(f=OO!^(yP~P$ [O!k/qO~P#/sO!]/rO!g#vO(s'qO!k)PX~O!k/wO~OnoX!QoX'zoX(zoX({oX~O!g#vO!koX~P$#OOp/yO!S%hO![*_O!_%iO(U%gO!k)PP~O#l/zO~O!Y${X!]${X!g%SX~P!0SO!]/{O!Y)QX~P#/sO!g/}O~O!Y0PO~OpkO(U0QO~P.iOh%VOr0VO!g#vO!l%eO(s'qO~O!g+kO~Oa%nO!]0ZO'{%nO~O!^0]O~P!5iO!c0^O!d0^O(V!lO~P#$^Os!nO!S0_O(WTO(ZUO(f!mO~O#[0aO~Og%ba!]%ba#`%ba$P%ba~P!1WOg%da!]%da#`%da$P%da~P!1WOj%dOk%dOl%dO(U&ZOg'nX!]'nX~O!]*zOg(_a~Og0jO~On0lO#`0kOg(`a!](`a~OR0mO!Q0mO!S0nO#S$dOn}a'z}a(z}a({}a!]}a#`}a~Og}a$P}a~P$(cO!Q*PO'z*QOn$ta(z$ta({$ta!]$ta#`$ta~Og$ta$P$ta~P$)_O!Q*PO'z*QOn$va(z$va({$va!]$va#`$va~Og$va$P$va~P$*QO#l0qO~Og%Ua!]%Ua#`%Ua$P%Ua~P!1WO!g#vO~O#l0tO~O!]#iX!^#iX!g!RX#`#iX~O!]+`Oa)Ua'{)Ua~OR#zO!Q#yO!S#{O!l#xO(bVOP!ri[!rij!rir!ri!]!ri!p!ri#R!ri#o!ri#p!ri#q!ri#r!ri#s!ri#t!ri#u!ri#v!ri#w!ri#y!ri#{!ri#|!ri(s!ri(z!ri({!ri~Oa!ri'{!ri'x!ri!Y!ri!k!riv!ri!_!ri%j!ri!g!ri~P$+}Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<uO!S${O!_$|O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(WTO(ZUO(b$uO(z$}O({%PO~Op0}O%^1OO(U0|O~P$.eO!g+kOa(^a!_(^a'{(^a!](^a~O#l1UO~O[]X!]fX!^fX~O!]1VO!^)YX~O!^1XO~O[1YO~Ob1[O(U+sO(WTO(ZUO~O!_&PO(U%gO`'vX!]'vX~O!]+xO`)Xa~O!k1_O~P!:tO[1bO~O`1cO~O#`1hO~On1kO!_$|O~O(f(}O!^)VP~Oh%VOn1tO!_1qO%j1sO~O[2OO!]1|O!^)WX~O!^2PO~O`2ROa%nO'{%nO~O(U#nO(WTO(ZUO~O#S$dO#`$eO$R$eOP(hXR(hX[(hXr(hX!Q(hX!S(hX!](hX!l(hX!p(hX#R(hX#o(hX#p(hX#q(hX#r(hX#s(hX#t(hX#u(hX#v(hX#w(hX#y(hX#{(hX#|(hX(b(hX(s(hX(z(hX({(hX~Oj2UO&]2VOa(hX~P$4OOj2UO#`$eO&]2VO~Oa2XO~P%[Oa2ZO~O&f2^OP&diQ&diS&diY&dia&did&die&dil&dip&dir&dis&dit&diz&di|&di!O&di!S&di!W&di!X&di!_&di!i&di!l&di!o&di!p&di!q&di!s&di!u&di!x&di!|&di$X&di$o&di%i&di%k&di%m&di%n&di%o&di%r&di%t&di%w&di%x&di%z&di&X&di&_&di&a&di&c&di&e&di&h&di&n&di&t&di&v&di&x&di&z&di&|&di'x&di(U&di(W&di(Z&di(b&di(p&di!^&dib&di&k&di~Ob2dO!^2bO&k2cO~P`O!_XO!l2fO~O&r,}OP&miQ&miS&miY&mia&mid&mie&mil&mip&mir&mis&mit&miz&mi|&mi!O&mi!S&mi!W&mi!X&mi!_&mi!i&mi!l&mi!o&mi!p&mi!q&mi!s&mi!u&mi!x&mi!|&mi$X&mi$o&mi%i&mi%k&mi%m&mi%n&mi%o&mi%r&mi%t&mi%w&mi%x&mi%z&mi&X&mi&_&mi&a&mi&c&mi&e&mi&h&mi&n&mi&t&mi&v&mi&x&mi&z&mi&|&mi'x&mi(U&mi(W&mi(Z&mi(b&mi(p&mi!^&mi&f&mib&mi&k&mi~O!Y2lO~O!]!aa!^!aa~P#BwOs!nO!S!oO![2qO(f!mO!]'YX!^'YX~P@nO!]-^O!^(ja~O!]'`X!^'`X~P!9|O!]-bO!^(ya~O!^2yO~P'_Oa%nO#`3SO'{%nO~Oa%nO!g#vO#`3SO'{%nO~Oa%nO!g#vO!p3WO#`3SO'{%nO(s'qO~Oa%nO'{%nO~P!:tO!]$_Ov$ra~O!Y'Xi!]'Xi~P!:tO!](WO!Y(ii~O!](_O!Y(wi~O!Y(xi!](xi~P!:tO!](ui!k(uia(ui'{(ui~P!:tO#`3YO!](ui!k(uia(ui'{(ui~O!](kO!k(ti~O!S%hO!_%iO!|]O#j3_O#k3^O(U%gO~O!S%hO!_%iO#k3^O(U%gO~On3fO!_'aO%j3eO~Oh%VOn3fO!_'aO%j3eO~O#l%baP%baR%ba[%baa%baj%bar%ba!S%ba!l%ba!p%ba#R%ba#o%ba#p%ba#q%ba#r%ba#s%ba#t%ba#u%ba#v%ba#w%ba#y%ba#{%ba#|%ba'{%ba(b%ba(s%ba!k%ba!Y%ba'x%bav%ba!_%ba%j%ba!g%ba~P#L{O#l%daP%daR%da[%daa%daj%dar%da!S%da!l%da!p%da#R%da#o%da#p%da#q%da#r%da#s%da#t%da#u%da#v%da#w%da#y%da#{%da#|%da'{%da(b%da(s%da!k%da!Y%da'x%dav%da!_%da%j%da!g%da~P#MnO#l%baP%baR%ba[%baa%baj%bar%ba!S%ba!]%ba!l%ba!p%ba#R%ba#o%ba#p%ba#q%ba#r%ba#s%ba#t%ba#u%ba#v%ba#w%ba#y%ba#{%ba#|%ba'{%ba(b%ba(s%ba!k%ba!Y%ba'x%ba#`%bav%ba!_%ba%j%ba!g%ba~P#/sO#l%daP%daR%da[%daa%daj%dar%da!S%da!]%da!l%da!p%da#R%da#o%da#p%da#q%da#r%da#s%da#t%da#u%da#v%da#w%da#y%da#{%da#|%da'{%da(b%da(s%da!k%da!Y%da'x%da#`%dav%da!_%da%j%da!g%da~P#/sO#l}aP}a[}aa}aj}ar}a!l}a!p}a#R}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#w}a#y}a#{}a#|}a'{}a(b}a(s}a!k}a!Y}a'x}av}a!_}a%j}a!g}a~P$(cO#l$taP$taR$ta[$taa$taj$tar$ta!S$ta!l$ta!p$ta#R$ta#o$ta#p$ta#q$ta#r$ta#s$ta#t$ta#u$ta#v$ta#w$ta#y$ta#{$ta#|$ta'{$ta(b$ta(s$ta!k$ta!Y$ta'x$tav$ta!_$ta%j$ta!g$ta~P$)_O#l$vaP$vaR$va[$vaa$vaj$var$va!S$va!l$va!p$va#R$va#o$va#p$va#q$va#r$va#s$va#t$va#u$va#v$va#w$va#y$va#{$va#|$va'{$va(b$va(s$va!k$va!Y$va'x$vav$va!_$va%j$va!g$va~P$*QO#l%UaP%UaR%Ua[%Uaa%Uaj%Uar%Ua!S%Ua!]%Ua!l%Ua!p%Ua#R%Ua#o%Ua#p%Ua#q%Ua#r%Ua#s%Ua#t%Ua#u%Ua#v%Ua#w%Ua#y%Ua#{%Ua#|%Ua'{%Ua(b%Ua(s%Ua!k%Ua!Y%Ua'x%Ua#`%Uav%Ua!_%Ua%j%Ua!g%Ua~P#/sOa#cq!]#cq'{#cq'x#cq!Y#cq!k#cqv#cq!_#cq%j#cq!g#cq~P!:tO![3nO!]'ZX!k'ZX~P%[O!].vO!k(la~O!].vO!k(la~P!:tO!Y3qO~O$P!na!^!na~PKlO$P!ja!]!ja!^!ja~P#BwO$P!ra!^!ra~P!=aO$P!ta!^!ta~P!?wOg'^X!]'^X~P!,TO!]/ROg(qa~OSfO!_4VO$e4WO~O!^4[O~Ov4]O~P#/sOa$nq!]$nq'{$nq'x$nq!Y$nq!k$nqv$nq!_$nq%j$nq!g$nq~P!:tO!Y4_O~P!&zO!S4`O~O!Q*PO'z*QO({%POn'ja(z'ja!]'ja#`'ja~Og'ja$P'ja~P%-tO!Q*PO'z*QOn'la(z'la({'la!]'la#`'la~Og'la$P'la~P%.gO(s$YO~P#/sO!YfX!Y${X!]fX!]${X!g%SX#`fX~P!0SOp%WO(U=XO~P!1uOp4dO!S%hO![4cO!_%iO(U%gO!]'fX!k'fX~O!]/rO!k)Pa~O!]/rO!g#vO!k)Pa~O!]/rO!g#vO(s'qO!k)Pa~Og$}i!]$}i#`$}i$P$}i~P!1WO![4lO!Y'hX!]'hX~P!3tO!]/{O!Y)Qa~O!]/{O!Y)Qa~P#/sOP]XR]X[]Xj]Xr]X!Q]X!S]X!Y]X!]]X!l]X!p]X#R]X#S]X#`]X#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X(b]X(s]X(z]X({]X~Oj%ZX!g%ZX~P%2^Oj4qO!g#vO~Oh%VO!g#vO!l%eO~Oh%VOr4vO!l%eO(s'qO~Or4{O!g#vO(s'qO~Os!nO!S4|O(WTO(ZUO(f!mO~O(z$}On%bi!Q%bi'z%bi({%bi!]%bi#`%bi~Og%bi$P%bi~P%5}O({%POn%di!Q%di'z%di(z%di!]%di#`%di~Og%di$P%di~P%6pOg(`i!](`i~P!1WO#`5SOg(`i!](`i~P!1WO!k5XO~Oa$pq!]$pq'{$pq'x$pq!Y$pq!k$pqv$pq!_$pq%j$pq!g$pq~P!:tO!Y5]O~O!]5^O!_)RX~P#/sOa${X!_${X%_]X'{${X!]${X~P!0SO%_5aOaoX!_oX'{oX!]oX~P$#OOp5bO(U#nO~O%_5aO~Ob5hO%k5iO(U+sO(WTO(ZUO!]'uX!^'uX~O!]1VO!^)Ya~O[5mO~O`5nO~O[5rO~Oa%nO'{%nO~P#/sO!]5wO#`5yO!^)VX~O!^5zO~Or6QOs!nO!S*jO!b!yO!c!vO!d!vO!|<XO#T!pO#U!pO#V!pO#W!pO#X!pO#[6PO#]!zO(V!lO(WTO(ZUO(f!mO(p!sO~O!^6OO~P%;sOn6VO!_1qO%j6UO~Oh%VOn6VO!_1qO%j6UO~Ob6^O(U#nO(WTO(ZUO!]'tX!^'tX~O!]1|O!^)Wa~O(WTO(ZUO(f6`O~O`6dO~Oj6gO&]6hO~PNXO!k6iO~P%[Oa6kO~Oa6kO~P%[Ob2dO!^6pO&k2cO~P`O!g6rO~O!g6tOh(ki!](ki!^(ki!g(ki!l(kir(ki(s(ki~O#`6uO!]#hi!^#hi~O!]!ai!^!ai~P#BwO!]#hi!^#hi~P#BwOa%nO#`7OO'{%nO~Oa%nO!g#vO#`7OO'{%nO~O!](uq!k(uqa(uq'{(uq~P!:tO!](kO!k(tq~O!S%hO!_%iO#k7VO(U%gO~O!_'aO%j7YO~On7^O!_'aO%j7YO~O#l'jaP'jaR'ja['jaa'jaj'jar'ja!S'ja!l'ja!p'ja#R'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#w'ja#y'ja#{'ja#|'ja'{'ja(b'ja(s'ja!k'ja!Y'ja'x'jav'ja!_'ja%j'ja!g'ja~P%-tO#l'laP'laR'la['laa'laj'lar'la!S'la!l'la!p'la#R'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#w'la#y'la#{'la#|'la'{'la(b'la(s'la!k'la!Y'la'x'lav'la!_'la%j'la!g'la~P%.gO#l$}iP$}iR$}i[$}ia$}ij$}ir$}i!S$}i!]$}i!l$}i!p$}i#R$}i#o$}i#p$}i#q$}i#r$}i#s$}i#t$}i#u$}i#v$}i#w$}i#y$}i#{$}i#|$}i'{$}i(b$}i(s$}i!k$}i!Y$}i'x$}i#`$}iv$}i!_$}i%j$}i!g$}i~P#/sO#l%biP%biR%bi[%bia%bij%bir%bi!S%bi!l%bi!p%bi#R%bi#o%bi#p%bi#q%bi#r%bi#s%bi#t%bi#u%bi#v%bi#w%bi#y%bi#{%bi#|%bi'{%bi(b%bi(s%bi!k%bi!Y%bi'x%biv%bi!_%bi%j%bi!g%bi~P%5}O#l%diP%diR%di[%dia%dij%dir%di!S%di!l%di!p%di#R%di#o%di#p%di#q%di#r%di#s%di#t%di#u%di#v%di#w%di#y%di#{%di#|%di'{%di(b%di(s%di!k%di!Y%di'x%div%di!_%di%j%di!g%di~P%6pO!]'Za!k'Za~P!:tO!].vO!k(li~O$P#ci!]#ci!^#ci~P#BwOP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(bVO[#nij#nir#ni#R#ni#p#ni#q#ni#r#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni$P#ni(s#ni(z#ni({#ni!]#ni!^#ni~O#o#ni~P%NrO#o<aO~P%NrOP$[OR#zOr<mO!Q#yO!S#{O!l#xO!p$[O#o<aO#p<bO#q<bO#r<bO(bVO[#nij#ni#R#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni$P#ni(s#ni(z#ni({#ni!]#ni!^#ni~O#s#ni~P&!zO#s<cO~P&!zOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO(bVO#y#ni#{#ni#|#ni$P#ni(s#ni(z#ni({#ni!]#ni!^#ni~O#w#ni~P&%SOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO#w<eO(bVO({#}O#{#ni#|#ni$P#ni(s#ni(z#ni!]#ni!^#ni~O#y<gO~P&'TO#y#ni~P&'TO#w<eO~P&%SOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO#w<eO#y<gO(bVO(z#|O({#}O#|#ni$P#ni(s#ni!]#ni!^#ni~O#{#ni~P&)dO#{<iO~P&)dOa#}y!]#}y'{#}y'x#}y!Y#}y!k#}yv#}y!_#}y%j#}y!g#}y~P!:tO[#nij#nir#ni#R#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni$P#ni(s#ni!]#ni!^#ni~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#o<aO#p<bO#q<bO#r<bO(bVO(z#ni({#ni~P&,`On>_O!Q*PO'z*QO(z$}O({%POP#niR#ni!S#ni!l#ni!p#ni#o#ni#p#ni#q#ni#r#ni(b#ni~P&,`O#S$dOP(aXR(aX[(aXj(aXn(aXr(aX!Q(aX!S(aX!l(aX!p(aX#R(aX#o(aX#p(aX#q(aX#r(aX#s(aX#t(aX#u(aX#v(aX#w(aX#y(aX#{(aX#|(aX$P(aX'z(aX(b(aX(s(aX(z(aX({(aX!](aX!^(aX~O$P$Qi!]$Qi!^$Qi~P#BwO$P!ri!^!ri~P$+}Og'^a!]'^a~P!1WO!^7pO~O!]'ea!^'ea~P#BwO!Y7qO~P#/sO!g#vO(s'qO!]'fa!k'fa~O!]/rO!k)Pi~O!]/rO!g#vO!k)Pi~Og$}q!]$}q#`$}q$P$}q~P!1WO!Y'ha!]'ha~P#/sO!g7xO~O!]/{O!Y)Qi~P#/sO!]/{O!Y)Qi~O!Y7{O~Oh%VOr8QO!l%eO(s'qO~Oj8SO!g#vO~Or8VO!g#vO(s'qO~O!Q*PO'z*QO({%POn'ka(z'ka!]'ka#`'ka~Og'ka$P'ka~P&5aO!Q*PO'z*QOn'ma(z'ma({'ma!]'ma#`'ma~Og'ma$P'ma~P&6SOg(`q!](`q~P!1WO#`8XOg(`q!](`q~P!1WO!Y8YO~Og%Pq!]%Pq#`%Pq$P%Pq~P!1WOa$py!]$py'{$py'x$py!Y$py!k$pyv$py!_$py%j$py!g$py~P!:tO!g6tO~O!]5^O!_)Ra~O!_'aOP$UaR$Ua[$Uaj$Uar$Ua!Q$Ua!S$Ua!]$Ua!l$Ua!p$Ua#R$Ua#o$Ua#p$Ua#q$Ua#r$Ua#s$Ua#t$Ua#u$Ua#v$Ua#w$Ua#y$Ua#{$Ua#|$Ua(b$Ua(s$Ua(z$Ua({$Ua~O%j7YO~P&8tO%_8^Oa%]i!_%]i'{%]i!]%]i~Oa#cy!]#cy'{#cy'x#cy!Y#cy!k#cyv#cy!_#cy%j#cy!g#cy~P!:tO[8`O~Ob8bO(U+sO(WTO(ZUO~O!]1VO!^)Yi~O`8fO~O(f(}O!]'qX!^'qX~O!]5wO!^)Va~O!^8pO~P%;sO(p!sO~P$&YO#[8qO~O!_1qO~O!_1qO%j8sO~On8vO!_1qO%j8sO~O[8{O!]'ta!^'ta~O!]1|O!^)Wi~O!k9PO~O!k9QO~O!k9TO~O!k9TO~P%[Oa9VO~O!g9WO~O!k9XO~O!](xi!^(xi~P#BwOa%nO#`9aO'{%nO~O!](uy!k(uya(uy'{(uy~P!:tO!](kO!k(ty~O%j9dO~P&8tO!_'aO%j9dO~O#l$}qP$}qR$}q[$}qa$}qj$}qr$}q!S$}q!]$}q!l$}q!p$}q#R$}q#o$}q#p$}q#q$}q#r$}q#s$}q#t$}q#u$}q#v$}q#w$}q#y$}q#{$}q#|$}q'{$}q(b$}q(s$}q!k$}q!Y$}q'x$}q#`$}qv$}q!_$}q%j$}q!g$}q~P#/sO#l'kaP'kaR'ka['kaa'kaj'kar'ka!S'ka!l'ka!p'ka#R'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#w'ka#y'ka#{'ka#|'ka'{'ka(b'ka(s'ka!k'ka!Y'ka'x'kav'ka!_'ka%j'ka!g'ka~P&5aO#l'maP'maR'ma['maa'maj'mar'ma!S'ma!l'ma!p'ma#R'ma#o'ma#p'ma#q'ma#r'ma#s'ma#t'ma#u'ma#v'ma#w'ma#y'ma#{'ma#|'ma'{'ma(b'ma(s'ma!k'ma!Y'ma'x'mav'ma!_'ma%j'ma!g'ma~P&6SO#l%PqP%PqR%Pq[%Pqa%Pqj%Pqr%Pq!S%Pq!]%Pq!l%Pq!p%Pq#R%Pq#o%Pq#p%Pq#q%Pq#r%Pq#s%Pq#t%Pq#u%Pq#v%Pq#w%Pq#y%Pq#{%Pq#|%Pq'{%Pq(b%Pq(s%Pq!k%Pq!Y%Pq'x%Pq#`%Pqv%Pq!_%Pq%j%Pq!g%Pq~P#/sO!]'Zi!k'Zi~P!:tO$P#cq!]#cq!^#cq~P#BwO(z$}OP%baR%ba[%baj%bar%ba!S%ba!l%ba!p%ba#R%ba#o%ba#p%ba#q%ba#r%ba#s%ba#t%ba#u%ba#v%ba#w%ba#y%ba#{%ba#|%ba$P%ba(b%ba(s%ba!]%ba!^%ba~On%ba!Q%ba'z%ba({%ba~P&JXO({%POP%daR%da[%daj%dar%da!S%da!l%da!p%da#R%da#o%da#p%da#q%da#r%da#s%da#t%da#u%da#v%da#w%da#y%da#{%da#|%da$P%da(b%da(s%da!]%da!^%da~On%da!Q%da'z%da(z%da~P&L`On>_O!Q*PO'z*QO({%PO~P&JXOn>_O!Q*PO'z*QO(z$}O~P&L`OR0mO!Q0mO!S0nO#S$dOP}a[}aj}an}ar}a!l}a!p}a#R}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#w}a#y}a#{}a#|}a$P}a'z}a(b}a(s}a(z}a({}a!]}a!^}a~O!Q*PO'z*QOP$taR$ta[$taj$tan$tar$ta!S$ta!l$ta!p$ta#R$ta#o$ta#p$ta#q$ta#r$ta#s$ta#t$ta#u$ta#v$ta#w$ta#y$ta#{$ta#|$ta$P$ta(b$ta(s$ta(z$ta({$ta!]$ta!^$ta~O!Q*PO'z*QOP$vaR$va[$vaj$van$var$va!S$va!l$va!p$va#R$va#o$va#p$va#q$va#r$va#s$va#t$va#u$va#v$va#w$va#y$va#{$va#|$va$P$va(b$va(s$va(z$va({$va!]$va!^$va~On>_O!Q*PO'z*QO(z$}O({%PO~OP%UaR%Ua[%Uaj%Uar%Ua!S%Ua!l%Ua!p%Ua#R%Ua#o%Ua#p%Ua#q%Ua#r%Ua#s%Ua#t%Ua#u%Ua#v%Ua#w%Ua#y%Ua#{%Ua#|%Ua$P%Ua(b%Ua(s%Ua!]%Ua!^%Ua~P''eO$P$nq!]$nq!^$nq~P#BwO$P$pq!]$pq!^$pq~P#BwO!^9qO~O$P9rO~P!1WO!g#vO!]'fi!k'fi~O!g#vO(s'qO!]'fi!k'fi~O!]/rO!k)Pq~O!Y'hi!]'hi~P#/sO!]/{O!Y)Qq~Or9yO!g#vO(s'qO~O[9{O!Y9zO~P#/sO!Y9zO~Oj:RO!g#vO~Og(`y!](`y~P!1WO!]'oa!_'oa~P#/sOa%]q!_%]q'{%]q!]%]q~P#/sO[:WO~O!]1VO!^)Yq~O`:[O~O#`:]O!]'qa!^'qa~O!]5wO!^)Vi~P#BwO!S:_O~O!_1qO%j:bO~O(WTO(ZUO(f:gO~O!]1|O!^)Wq~O!k:jO~O!k:kO~O!k:lO~O!k:lO~P%[O#`:oO!]#hy!^#hy~O!]#hy!^#hy~P#BwO%j:tO~P&8tO!_'aO%j:tO~O$P#}y!]#}y!^#}y~P#BwOP$}iR$}i[$}ij$}ir$}i!S$}i!l$}i!p$}i#R$}i#o$}i#p$}i#q$}i#r$}i#s$}i#t$}i#u$}i#v$}i#w$}i#y$}i#{$}i#|$}i$P$}i(b$}i(s$}i!]$}i!^$}i~P''eO!Q*PO'z*QO({%POP'jaR'ja['jaj'jan'jar'ja!S'ja!l'ja!p'ja#R'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#w'ja#y'ja#{'ja#|'ja$P'ja(b'ja(s'ja(z'ja!]'ja!^'ja~O!Q*PO'z*QOP'laR'la['laj'lan'lar'la!S'la!l'la!p'la#R'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#w'la#y'la#{'la#|'la$P'la(b'la(s'la(z'la({'la!]'la!^'la~O(z$}OP%biR%bi[%bij%bin%bir%bi!Q%bi!S%bi!l%bi!p%bi#R%bi#o%bi#p%bi#q%bi#r%bi#s%bi#t%bi#u%bi#v%bi#w%bi#y%bi#{%bi#|%bi$P%bi'z%bi(b%bi(s%bi({%bi!]%bi!^%bi~O({%POP%diR%di[%dij%din%dir%di!Q%di!S%di!l%di!p%di#R%di#o%di#p%di#q%di#r%di#s%di#t%di#u%di#v%di#w%di#y%di#{%di#|%di$P%di'z%di(b%di(s%di(z%di!]%di!^%di~O$P$py!]$py!^$py~P#BwO$P#cy!]#cy!^#cy~P#BwO!g#vO!]'fq!k'fq~O!]/rO!k)Py~O!Y'hq!]'hq~P#/sOr;OO!g#vO(s'qO~O[;SO!Y;RO~P#/sO!Y;RO~Og(`!R!](`!R~P!1WOa%]y!_%]y'{%]y!]%]y~P#/sO!]1VO!^)Yy~O!]5wO!^)Vq~O(U;ZO~O!_1qO%j;^O~O!k;aO~O%j;fO~P&8tOP$}qR$}q[$}qj$}qr$}q!S$}q!l$}q!p$}q#R$}q#o$}q#p$}q#q$}q#r$}q#s$}q#t$}q#u$}q#v$}q#w$}q#y$}q#{$}q#|$}q$P$}q(b$}q(s$}q!]$}q!^$}q~P''eO!Q*PO'z*QO({%POP'kaR'ka['kaj'kan'kar'ka!S'ka!l'ka!p'ka#R'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#w'ka#y'ka#{'ka#|'ka$P'ka(b'ka(s'ka(z'ka!]'ka!^'ka~O!Q*PO'z*QOP'maR'ma['maj'man'mar'ma!S'ma!l'ma!p'ma#R'ma#o'ma#p'ma#q'ma#r'ma#s'ma#t'ma#u'ma#v'ma#w'ma#y'ma#{'ma#|'ma$P'ma(b'ma(s'ma(z'ma({'ma!]'ma!^'ma~OP%PqR%Pq[%Pqj%Pqr%Pq!S%Pq!l%Pq!p%Pq#R%Pq#o%Pq#p%Pq#q%Pq#r%Pq#s%Pq#t%Pq#u%Pq#v%Pq#w%Pq#y%Pq#{%Pq#|%Pq$P%Pq(b%Pq(s%Pq!]%Pq!^%Pq~P''eOg%f!Z!]%f!Z#`%f!Z$P%f!Z~P!1WO!Y;jO~P#/sOr;kO!g#vO(s'qO~O[;mO!Y;jO~P#/sO!]'qq!^'qq~P#BwO!]#h!Z!^#h!Z~P#BwO#l%f!ZP%f!ZR%f!Z[%f!Za%f!Zj%f!Zr%f!Z!S%f!Z!]%f!Z!l%f!Z!p%f!Z#R%f!Z#o%f!Z#p%f!Z#q%f!Z#r%f!Z#s%f!Z#t%f!Z#u%f!Z#v%f!Z#w%f!Z#y%f!Z#{%f!Z#|%f!Z'{%f!Z(b%f!Z(s%f!Z!k%f!Z!Y%f!Z'x%f!Z#`%f!Zv%f!Z!_%f!Z%j%f!Z!g%f!Z~P#/sOr;vO!g#vO(s'qO~O!Y;wO~P#/sOr<OO!g#vO(s'qO~O!Y<PO~P#/sOP%f!ZR%f!Z[%f!Zj%f!Zr%f!Z!S%f!Z!l%f!Z!p%f!Z#R%f!Z#o%f!Z#p%f!Z#q%f!Z#r%f!Z#s%f!Z#t%f!Z#u%f!Z#v%f!Z#w%f!Z#y%f!Z#{%f!Z#|%f!Z$P%f!Z(b%f!Z(s%f!Z!]%f!Z!^%f!Z~P''eOr<SO!g#vO(s'qO~Ov(gX~P1qO!Q%rO~P!)[O(V!lO~P!)[O!YfX!]fX#`fX~P%2^OP]XR]X[]Xj]Xr]X!Q]X!S]X!]]X!]fX!l]X!p]X#R]X#S]X#`]X#`fX#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X(b]X(s]X(z]X({]X~O!gfX!k]X!kfX(sfX~P'LcOP<WOQ<WOSfOd>SOe!iOpkOr<WOskOtkOzkO|<WO!O<WO!SWO!WkO!XkO!_XO!i<ZO!lZO!o<WO!p<WO!q<WO!s<[O!u<_O!x!hO$X!kO$o>QO(U)^O(WTO(ZUO(bVO(p[O~O!]<kO!^$ra~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<vO!S${O!_$|O!i>XO!l$xO#k<|O$X%`O$u<xO$w<zO$z%aO(U(wO(WTO(ZUO(b$uO(z$}O({%PO~Ol)eO~P(#XOr!eX(s!eX~P#!nO!^]X!^fX~P'LcO!YfX!Y${X!]fX!]${X#`fX~P!0SO#l<`O~O!g#vO#l<`O~O#`<pO~Oj<dO~O#`=PO!](xX!^(xX~O#`<pO!](vX!^(vX~O#l=QO~Og=SO~P!1WO#l=YO~O#l=ZO~Og=SO(U&ZO~O!g#vO#l=[O~O!g#vO#l=QO~O$P=]O~P#BwO#l=^O~O#l=_O~O#l=dO~O#l=eO~O#l=fO~O#l=gO~O$P=hO~P!1WO$P=iO~P!1WOl=tO~P7eOk#S#T#U#W#X#[#j#k#v$o$u$w$z%^%_%i%j%k%r%t%w%x%z%|~(PT#p!X'}(V#qs#o#rr!Q(O$^(U$`(f~",
  goto: "$9_)^PPPPPP)_PP)bP)sP+X/^PPPP6lPP7SPP=PPPP@sPA]PA]PPPA]PCePA]PA]PA]PCiPCnPD]PIVPPPIZPPPPIZL^PPPLdMUPIZPIZPP! dIZPPPIZPIZP!#kIZP!'R!(W!(aP!)T!)X!)T!,fPPPPPPP!-V!(WPP!-g!/XP!2hIZIZ!2m!5y!:g!:g!>f!>nPPP!>tIZPPPPPPPPP!BTP!CbPPIZ!DsPIZPIZIZIZIZIZPIZ!FVP!IaP!LgP!Lk!Lu!Ly!LyP!I^P!L}!L}P#!TP#!XIZPIZ#!_#%dCiA]PA]PA]A]P#&qA]A]#)TA]#+{A]#.XA]A]#.w#1]#1]#1b#1k#1]#1vPP#1]PA]#2`A]#6_A]A]6lPPP#:dPPP#:}#:}P#:}P#;e#:}PP#;kP#;bP#;b#<O#;b#<j#<p#<s)bP#<v)bP#=P#=P#=PP)bP)bP)bP)bPP)bP#=V#=YP#=Y)bP#=^P#=aP)bP)bP)bP)bP)bP)b)bPP#=g#=m#=x#>O#>U#>[#>b#>p#>v#?Q#?W#?b#?h#?x#@O#@p#AS#AY#A`#An#BT#Cx#DW#D_#Ey#FX#Gy#HX#H_#He#Hk#Hu#H{#IR#I]#Io#IuPPPPPPPPPPP#I{PPPPPPP#Jp#M}$ g$ n$ vPPP$'bP$'k$*d$0}$1Q$1T$2S$2V$2^$2fP$2l$2oP$3]$3a$4X$5g$5l$6SPP$6X$6_$6c$6f$6j$6n$7j$8R$8j$8n$8q$8t$9O$9R$9V$9ZR!|RoqOXst!Z#d%m&r&t&u&w,u,z2^2aY!vQ'a-g1q5}Q%tvQ%|yQ&T|Q&j!VS'W!e-^Q'g!iS'm!r!yU*l$|*[*pQ+q%}S,O&V&WQ,f&dQ-e'`Q-o'hQ-w'nQ0^*rQ1d,QQ1{,gR<}<[%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_,r,u,z-k-s.R.X.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3n4|6V6g6h6k7O8v9V9aS#q]<X!r)`$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TU+Q%]<u<vQ+v&PQ,h&gQ,o&oQ0z+iQ1P+kQ1[+wQ2T,mQ3b.iQ5b1OQ5h1VQ6^1|Q7[3fQ8b5iR9g7^'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>T!S!nQ!r!v!y!z$|'W'`'a'm'n'o*l*p*r*s-^-e-g-w0^0a1q5}6P%[$ti#v$b$c$d$x${%O%Q%^%_%c)z*S*U*W*Z*b*h*x*y+h+k,U,X.h/R/f/o/z/{/}0b0d0k0l0q1h1k1s3e4`4a4l4q5S5^5a6U7Y7x8S8X8^8s9d9r9{:R:b:t;S;^;f;m<n<o<q<r<s<t<w<x<y<z<{<|=T=U=V=W=Y=Z=^=_=`=a=b=c=d=e=h=i>Q>Y>Z>^>_Q&X|S'U!e*[S']%i-bQ+v&PQ,R&WQ,h&gQ0p+TQ1[+wQ1a+}Q2S,lQ2T,mQ5h1VQ5q1cQ6^1|Q6a2OQ6b2RQ8b5iQ8e5nQ9O6dQ:Z8fQ:h8{R;X:[rnOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aR,j&k&z^OPXYstuvwz!Z!`!g!j!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'c's(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>S>T[#]WZ#W#Z'X(U!b%jm#h#i#l$x%e%h(_(i(j(k*Z*_*c+[+^+`,q-W.V.].^._.a/o/r2f3^3_4c6t7VQ%wxQ%{yW&Q|&V&W,QQ&_!TQ'd!hQ'f!iQ(r#sS+p%|%}Q+t&PQ,a&bQ,e&dS-n'g'hQ.k(sQ1T+qQ1Z+wQ1]+xQ1`+|Q1v,bS1z,f,gQ3O-oQ5g1VQ5k1YQ5p1bQ6]1{Q8a5iQ8d5mQ8h5rQ:V8`R;V:W!U$zi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z!^%yy!i!u%{%|%}'V'f'g'h'l'v*k+p+q-Z-n-o-v0T0W1T2w3O3V4t4u4x8P9}Q+j%wQ,V&[Q,Y&]Q,d&dQ.j(rQ1u,aU1y,e,f,gQ3g.kQ6W1vS6[1z1{Q8z6]#f>U#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_o>V<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=iW%Ti%V*z>QS&[!Q&iQ&]!RQ&^!SU+O%[%d=tR,T&Y%]%Si#v$b$c$d$x${%O%Q%^%_%c)z*S*U*W*Z*b*h*x*y+h+k,U,X.h/R/f/o/z/{/}0b0d0k0l0q1h1k1s3e4`4a4l4q5S5^5a6U7Y7x8S8X8^8s9d9r9{:R:b:t;S;^;f;m<n<o<q<r<s<t<w<x<y<z<{<|=T=U=V=W=Y=Z=^=_=`=a=b=c=d=e=h=i>Q>Y>Z>^>_T){$u)|V+Q%]<u<vW']!e%i*[-bS)O#y#zQ+e%rQ+{&SS.d(n(oQ1l,ZQ5V0mR8k5w'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>T$i$^c#Y#e%q%s%u(T(Z(u(z)S)T)U)V)W)X)Y)Z)[)])_)a)c)h)r+f+z-[-z.P.U.W.u.x.|/O/P/Q/d0r2o2t3Q3X3m3r3s3t3u3v3w3x3y3z3{3|3}4O4R4S4Z5Z5e6w6}7S7c7d7m7n8m9Z9_9i9o9p:q;Y;b<Y=wT#TV#U'RkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TQ'Y!eR2r-^!W!nQ!e!r!v!y!z$|'W'`'a'm'n'o*[*l*p*r*s-^-e-g-w0^0a1q5}6PR1n,]nqOXst!Z#d%m&r&t&u&w,u,z2^2aQ&y!^Q'w!xS(t#u<`Q+n%zQ,_&_Q,`&aQ-l'eQ-y'pS.t(y=QS0s+Y=[Q1R+oQ1p,^Q2e,|Q2g,}Q2n-XQ2|-mQ3P-qS5[0t=fQ5c1SS5f1U=gQ6v2pQ6z2}Q7P3UQ8_5dQ9[6xQ9]6{Q9`7QR:n9X$d$]c#Y#e%s%u(T(Z(u(z)S)T)U)V)W)X)Y)Z)[)])_)a)c)h)r+f+z-[-z.P.U.W.u.x.|/P/Q/d0r2o2t3Q3X3m3r3s3t3u3v3w3x3y3z3{3|3}4O4R4S4Z5Z5e6w6}7S7c7d7m7n8m9Z9_9i9o9p:q;Y;b<Y=wS(p#p'jQ)Q#zS+d%q/OS.e(o(qR3`.f'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TS#q]<XQ&t!XQ&u!YQ&w![Q&x!]R2],xQ'b!hQ+g%wQ-j'dS.g(r+jQ2z-iW3d.j.k0y0{Q6y2{W7W3a3c3g5`U9c7X7Z7]U:s9e9f9hS;d:r:uQ;r;eR;z;sU!wQ'a-gT5{1q5}!Q_OXZ`st!V!Z#d#h%e%m&i&k&r&t&u&w(k,u,z.^2^2a]!pQ!r'a-g1q5}T#q]<X%^{OPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aS)O#y#zS.d(n(o!s=m$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TU$fd)`,oS(q#p'jU*w%R(x4QU0o+P.p7iQ5`0zQ7X3bQ9f7[R:u9gm!tQ!r!v!y!z'a'm'n'o-g-w1q5}6PQ'u!uS(g#g2WS-u'l'xQ/u*^Q0T*kQ3W-xQ4h/vQ4t0VQ4u0WQ4z0`Q7t4bS8P4v4xS8T4{4}Q9t7uQ9x7{Q9}8QQ:S8VS:}9y9zS;i;O;RS;u;j;kS;};v;wS<R<O<PR<U<SQ#wbQ't!uS(f#g2WS(h#m+XQ+Z%fQ+l%xQ+r&OU-t'l'u'xQ.Y(gU/t*^*a/yQ0U*kQ0X*mQ1Q+mQ1w,cS3T-u-xQ3].bS4g/u/vQ4p0RS4s0T0`Q4w0YQ6Y1xQ7R3WS7s4b4dQ7w4hU8O4t4z4}Q8R4yQ8x6ZS9s7t7uQ9w7{Q:P8TQ:Q8UQ:e8yQ:{9tS:|9x9zQ;U:SQ;`:fS;h:};RS;t;i;jS;|;u;wS<Q;}<PQ<T<RQ<V<UQ=p=kQ=|=uR=}=vV!wQ'a-g%^aOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aS#wz!j!r=j$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TR=p>S%^bOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aQ%fj!^%xy!i!u%{%|%}'V'f'g'h'l'v*k+p+q-Z-n-o-v0T0W1T2w3O3V4t4u4x8P9}S&Oz!jQ+m%yQ,c&dW1x,d,e,f,gU6Z1y1z1{S8y6[6]Q:f8z!r=k$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TQ=u>RR=v>S%QeOPXYstuvw!Z!`!g!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'c's(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aY#bWZ#W#Z(U!b%jm#h#i#l$x%e%h(_(i(j(k*Z*_*c+[+^+`,q-W.V.].^._.a/o/r2f3^3_4c6t7VQ,p&o!p=l$Z$n)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TR=o'XU'^!e%i*[R2u-bX'[!e%i*[-b%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_,r,u,z-k-s.R.X.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3n4|6V6g6h6k7O8v9V9a!r)`$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TQ,o&oQ0z+iQ3b.iQ7[3fR9g7^!b$Tc#Y%q(T(Z(u(z)[)])a)h+z-z.P.U.W.u.x/d0r3Q3X3m3}5Z5e6}7S7c9_:q<Y!P<f)_)r-[/O2o2t3r3{3|4R4Z6w7d7m7n8m9Z9i9o9p;Y;b=w!f$Vc#Y%q(T(Z(u(z)X)Y)[)])a)h+z-z.P.U.W.u.x/d0r3Q3X3m3}5Z5e6}7S7c9_:q<Y!T<h)_)r-[/O2o2t3r3x3y3{3|4R4Z6w7d7m7n8m9Z9i9o9p;Y;b=w!^$Zc#Y%q(T(Z(u(z)a)h+z-z.P.U.W.u.x/d0r3Q3X3m3}5Z5e6}7S7c9_:q<YQ4a/mz>T)_)r-[/O2o2t3r4R4Z6w7d7m7n8m9Z9i9o9p;Y;b=wQ>Y>[R>Z>]'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TS$oh$pR4W/W'XgOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/W/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TT$kf$qQ$ifS)k$l)oR)w$qT$jf$qT)m$l)o'XhOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/W/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TT$oh$pQ$rhR)v$p%^jOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9a!s>R$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>T#glOPXZst!Z!`!o#S#d#o#{$n%m&k&n&o&r&t&u&w&{'T'c)P)t*j+_+i,r,u,z-k.i/X/p0_0n1t2U2V2X2Z2^2a2c3f4V4|6V6g6h6k7^8v9V!U%Ri$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z#f(x#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_Q+U%aQ/e*Po4Q<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=i!U$yi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>ZQ*d$zU*m$|*[*pQ+V%bQ0Y*n#f=r#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_n=s<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=iQ=x>UQ=y>VQ=z>WR={>X!U%Ri$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z#f(x#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_o4Q<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=inoOXst!Z#d%m&r&t&u&w,u,z2^2aS*g${*ZQ-T'OQ-U'QR4k/{%[%Si#v$b$c$d$x${%O%Q%^%_%c)z*S*U*W*Z*b*h*x*y+h+k,U,X.h/R/f/o/z/{/}0b0d0k0l0q1h1k1s3e4`4a4l4q5S5^5a6U7Y7x8S8X8^8s9d9r9{:R:b:t;S;^;f;m<n<o<q<r<s<t<w<x<y<z<{<|=T=U=V=W=Y=Z=^=_=`=a=b=c=d=e=h=i>Q>Y>Z>^>_Q,W&]Q1j,YQ5u1iR8j5vV*o$|*[*pU*o$|*[*pT5|1q5}S0R*j/pQ4y0_T8U4|:_Q+l%xQ0X*mQ1Q+mQ1w,cQ6Y1xQ8x6ZQ:e8yR;`:f!U%Oi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Zx*S$v)f*T*v+W/x0f0g4T4i5T5U5Y7r8W:T:z=q>O>PS0b*u0c#f<q#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_n<r<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=i!d=T(v)d*]*f.l.o.s/a/m0O0x1g3j4^4j4n5t7_7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]`=U4P7e7h7l9j:v:y;{S=`.n3kT=a7g9m!U%Qi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z|*U$v)f*V*u+W/i/x0f0g4T4i5O5T5U5Y7r8W:T:z=q>O>PS0d*v0e#f<s#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_n<t<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=i!h=V(v)d*]*f.m.n.s/a/m0O0x1g3h3j4^4j4n5t7_7`7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]d=W4P7f7g7l9j9k:v:w:y;{S=b.o3lT=c7h9nrnOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aQ&f!UR,r&ornOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aR&f!UQ,[&^R1f,TsnOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aQ1r,aS6T1u1vU8r6R6S6WS:a8t8uS;[:`:cQ;o;]R;y;pQ&m!VR,k&iR6a2OR:h8{W&Q|&V&W,QR1]+xQ&r!WR,u&sR,{&xT2_,z2aR-P&yQ-O&yR2h-PQ'z!{R-{'zSsOtQ#dXT%ps#dQ#OTR'|#OQ#RUR(O#RQ)|$uR/b)|Q#UVR(R#UQ#XWU(X#X(Y.SQ(Y#YR.S(ZQ-_'YR2s-_Q.w(zS3o.w3pR3p.xQ-g'aR2x-gY!rQ'a-g1q5}R'k!rQ/S)fR4U/SU#_W%h*ZU(`#_(a.TQ(a#`R.T([Q-c'^R2v-ct`OXst!V!Z#d%m&i&k&r&t&u&w,u,z2^2aS#hZ%eU#r`#h.^R.^(kQ(l#jQ.Z(hW.c(l.Z3Z7TQ3Z.[R7T3[Q)o$lR/Y)oQ$phR)u$pQ$`cU)b$`.O<lQ.O<YR<l)rQ/s*^W4e/s4f7v9uU4f/t/u/vS7v4g4hR9u7w$e*R$v(v)d)f*]*f*u*v+R+S+W.n.o.q.r.s/a/i/k/m/x0O0f0g0x1g3h3i3j4P4T4^4i4j4n5O5Q5T5U5Y5t7_7`7a7b7g7h7j7k7l7r7y7|8W8Z8]9j9k9l9v:O:T:U:v:w:x:y:z;P;T;g;l;x;{=q>O>P>[>]Q/|*fU4m/|4o7zQ4o0OR7z4nS*p$|*[R0[*px*T$v)f*u*v+W/x0f0g4T4i5T5U5Y7r8W:T:z=q>O>P!d.l(v)d*]*f.n.o.s/a/m0O0x1g3j4^4j4n5t7_7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]U/j*T.l7ea7e4P7g7h7l9j:v:y;{Q0c*uQ3k.nU5P0c3k9mR9m7g|*V$v)f*u*v+W/i/x0f0g4T4i5O5T5U5Y7r8W:T:z=q>O>P!h.m(v)d*]*f.n.o.s/a/m0O0x1g3h3j4^4j4n5t7_7`7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]U/l*V.m7fe7f4P7g7h7l9j9k:v:w:y;{Q0e*vQ3l.oU5R0e3l9nR9n7hQ*{%UR0i*{Q5_0xR8[5_Q+a%kR0w+aQ5x1lS8l5x:^R:^8mQ,^&_R1o,^Q5}1qR8o5}Q1},hS6_1}8|R8|6aQ1W+tW5j1W5l8c:XQ5l1ZQ8c5kR:X8dQ+y&QR1^+yQ2a,zR6o2aYrOXst#dQ&v!ZQ+c%mQ,t&rQ,v&tQ,w&uQ,y&wQ2[,uS2_,z2aR6n2^Q%opQ&z!_Q&}!aQ'P!bQ'R!cQ'r!uQ+b%lQ+n%zQ,S&XQ,j&mQ-R&|W-r'l't'u'xQ-y'pQ0Z*oQ1R+oQ1e,RS2Q,k,nQ2i-QQ2j-TQ2k-UQ3P-qW3R-t-u-x-zQ5c1SQ5o1aQ5s1gQ6X1wQ6c2SQ6m2]U6|3Q3T3WQ7P3UQ8_5dQ8g5qQ8i5tQ8n5|Q8w6YQ8}6bS9^6}7RQ9`7QQ:Y8eQ:d8xQ:i9OQ:p9_Q;W:ZQ;_:eQ;c:qQ;n;XR;q;`Q%zyQ'e!iQ'p!uU+o%{%|%}Q-X'VU-m'f'g'hS-q'l'vQ0S*kS1S+p+qQ2p-ZS2}-n-oQ3U-vS4r0T0WQ5d1TQ6x2wQ6{3OQ7Q3VU7}4t4u4xQ9|8PR;Q9}S$wi>QR*|%VU%Ui%V>QR0h*zQ$viS(v#v+kS)d$b$cQ)f$dQ*]$xS*f${*ZQ*u%OQ*v%QQ+R%^Q+S%_Q+W%cQ.n<qQ.o<sQ.q<wQ.r<yQ.s<{Q/a)zQ/i*SQ/k*UQ/m*WQ/x*bS0O*h/oQ0f*xQ0g*yl0x+h,X.h1k1s3e6U7Y8s9d:b:t;^;fQ1g,UQ3h=TQ3i=VQ3j=YS4P<n<oQ4T/RS4^/f4`Q4i/zQ4j/{Q4n/}Q5O0bQ5Q0dQ5T0kQ5U0lQ5Y0qQ5t1hQ7_=^Q7`=`Q7a=bQ7b=dQ7g<rQ7h<tQ7j<xQ7k<zQ7l<|Q7r4aQ7y4lQ7|4qQ8W5SQ8Z5^Q8]5aQ9j=ZQ9k=UQ9l=WQ9v7xQ:O8SQ:T8XQ:U8^Q:v=_Q:w=aQ:x=cQ:y=eQ:z9rQ;P9{Q;T:RQ;g=hQ;l;SQ;x;mQ;{=iQ=q>QQ>O>YQ>P>ZQ>[>^R>]>_Q+P%]Q.p<uR7i<vnpOXst!Z#d%m&r&t&u&w,u,z2^2aQ!fPS#fZ#oQ&|!`W'i!o*j0_4|Q(Q#SQ)R#{Q)s$nS,n&k&nQ,s&oQ-Q&{S-V'T/pQ-i'cQ.z)PQ/^)tQ0u+_Q0{+iQ2Y,rQ2{-kQ3c.iQ4Y/XQ5W0nQ6S1tQ6e2UQ6f2VQ6j2XQ6l2ZQ6q2cQ7]3fQ7o4VQ8u6VQ9R6gQ9S6hQ9U6kQ9h7^Q:c8vR:m9V#[cOPXZst!Z!`!o#d#o#{%m&k&n&o&r&t&u&w&{'T'c)P*j+_+i,r,u,z-k.i/p0_0n1t2U2V2X2Z2^2a2c3f4|6V6g6h6k7^8v9VQ#YWQ#eYQ%quQ%svS%uw!gS(T#W(WQ(Z#ZQ(u#uQ(z#xQ)S$OQ)T$PQ)U$QQ)V$RQ)W$SQ)X$TQ)Y$UQ)Z$VQ)[$WQ)]$XQ)_$ZQ)a$_Q)c$aQ)h$eW)r$n)t/X4VQ+f%tQ+z&RS-['X2qQ-z'sS.P(U.RQ.U(^Q.W(eQ.u(yQ.x({Q.|<WQ/O<ZQ/P<[Q/Q<_Q/d*OQ0r+YQ2o-YQ2t-aQ3Q-sQ3X.XQ3m.vQ3r<`Q3s<aQ3t<bQ3u<cQ3v<dQ3w<eQ3x<fQ3y<gQ3z<hQ3{<iQ3|<jQ3}.}Q4O<mQ4R<pQ4S<}Q4Z<kQ5Z0tQ5e1UQ6w=PQ6}3SQ7S3YQ7c3nQ7d=QQ7m=SQ7n=[Q8m5yQ9Z6uQ9_7OQ9i=]Q9o=fQ9p=gQ:q9aQ;Y:]Q;b:oQ<Y#SR=w>TR#[WR'Z!el!tQ!r!v!y!z'a'm'n'o-g-w1q5}6PS'V!e-^U*k$|*[*pS-Z'W'`S0W*l*rQ0`*sQ2w-eQ4x0^R4}0aR(|#xQ!fQT-f'a-g]!qQ!r'a-g1q5}Q#p]R'j<XR)g$dY!uQ'a-g1q5}Q'l!rS'v!v!yS'x!z6PS-v'm'nQ-x'oR3V-wT#kZ%eS#jZ%eS%km,qU(h#h#i#lS.[(i(jQ.`(kQ0v+`Q3[.]U3].^._.aS7U3^3_R9b7Vd#^W#W#Z%h(U(_*Z+[.V/or#gZm#h#i#l%e(i(j(k+`.].^._.a3^3_7VS*^$x*cQ/v*_Q2W,qQ2m-WQ4b/rQ6s2fQ7u4cQ9Y6tT=n'X+^V#aW%h*ZU#`W%h*ZS(V#W(_U([#Z+[/oS-]'X+^T.Q(U.VV'_!e%i*[Q$lfR)y$qT)n$l)oR4X/WT*`$x*cT*i${*ZQ0y+hQ1i,XQ3a.hQ5v1kQ6R1sQ7Z3eQ8t6UQ9e7YQ:`8sQ:r9dQ;]:bQ;e:tQ;p;^R;s;fnqOXst!Z#d%m&r&t&u&w,u,z2^2aQ&l!VR,j&itmOXst!U!V!Z#d%m&i&r&t&u&w,u,z2^2aR,q&oT%lm,qR1m,ZR,i&gQ&U|S,P&V&WR1`,QR+u&PT&p!W&sT&q!W&sT2`,z2a",
  nodeNames: "⚠ ArithOp ArithOp ?. JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList in out const TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewTarget new NewExpression ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression TypeArgList CompareOp < declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty VariableDefinition Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression InstantiationExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast < ArrowFunction TypeParamList SequenceExpression InstantiationExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate asserts is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration defer ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
  maxTerm: 381,
  context: Lm,
  nodeProps: [
    ["isolate", -8, 5, 6, 14, 37, 39, 51, 53, 55, ""],
    ["group", -26, 9, 17, 19, 68, 208, 212, 216, 217, 219, 222, 225, 235, 238, 244, 246, 248, 250, 253, 259, 265, 267, 269, 271, 273, 275, 276, "Statement", -34, 13, 14, 32, 35, 36, 42, 51, 54, 55, 57, 62, 70, 72, 76, 80, 82, 84, 85, 110, 111, 121, 122, 137, 140, 142, 143, 144, 145, 146, 148, 149, 168, 170, 172, "Expression", -23, 31, 33, 37, 41, 43, 45, 174, 176, 178, 179, 181, 182, 183, 185, 186, 187, 189, 190, 191, 202, 204, 206, 207, "Type", -3, 88, 103, 109, "ClassItem"],
    ["openedBy", 23, "<", 38, "InterpolationStart", 56, "[", 60, "{", 73, "(", 161, "JSXStartCloseTag"],
    ["closedBy", -2, 24, 169, ">", 40, "InterpolationEnd", 50, "]", 61, "}", 74, ")", 166, "JSXEndTag"]
  ],
  propSources: [Km],
  skippedNodes: [0, 5, 6, 279],
  repeatNodeCount: 37,
  tokenData: "$Fq07[R!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#:O!R![#<_![!]#I_!]!^#Jk!^!_#Ku!_!`$![!`!a$$v!a!b$*T!b!c$,r!c!}Er!}#O$-|#O#P$/W#P#Q$4o#Q#R$5y#R#SEr#S#T$7W#T#o$8b#o#p$<r#p#q$=h#q#r$>x#r#s$@U#s$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$I|Er$I|$I}$Dk$I}$JO$Dk$JO$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr(n%d_$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$j&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$j&j([!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU([!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$j&j(XpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(XpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z07[+rq$j&j(Xp([!b'}0/lOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z07[.ST(Y#S$j&j(O0/lO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c07[.n_$j&j(Xp([!b(O0/lOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)3p/x`$j&j!p),Q(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW1V`#w(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW2d_#w(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At3l_(W':f$j&j([!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$j&j([!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$j&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$e`$j&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$e``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$e`$j&j([!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ([!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$e`([!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k%9[:hh$j&j(Xp([!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__WS$j&j(Xp([!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]WS$j&j([!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXWS$j&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSWSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWWS([!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]WS$j&j(XpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWWS(XpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYWS(Xp([!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S%9[C}i$j&j(p%1l(Xp([!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr%9[EoP;=`<%lCr07[FRk$j&j(Xp([!b$^#t(U,2j(f$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$j&j(Xp([!b$^#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv07[JPP;=`<%lEr(KWJ_`$j&j(Xp([!b#q(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWKl_$j&j$R(Ch(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,#xLva({+JY$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWNW`$j&j#{(Ch(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At! c_(Z';W$j&j(XpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$j&j(XpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$j&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$e`$j&j(XpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(XpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$e`(XpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b/5|!'t_!l/.^$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&U!)O_!k!Lf$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z-!n!*[b$j&j(Xp([!b(V%&f#r(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW!+o`$j&j(Xp([!b#o(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;x!,|`$j&j(Xp([!br+4YOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,$U!.Z_!]+Jf$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!/ec$j&j(Xp([!b!Q.2^OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!0ya$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!2Z_![!L^$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!3eg$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!5Vg$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!6wc$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!8_c$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!9uf$j&j(Xp([!b#p(ChOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcxz!;Zz{#-}{!P!;Z!P!Q#/d!Q!^!;Z!^!_#(i!_!`#7S!`!a#8i!a!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z?O!;fb$j&j(Xp([!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z>^!<w`$j&j([!b!X7`OY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eq!Q!^!<n!^!_!Gr!_!}!<n!}#O!KS#O#P!Dy#P#o!<n#o#p!Gr#p;'S!<n;'S;=`!L]<%lO!<n<z!>Q^$j&j!X7`OY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@c!_!}!=y!}#O!CW#O#P!Dy#P#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!?Td$j&j!X7`O!^&c!_#W&c#W#X!>|#X#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#k!>|#k#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&c7`!@hX!X7`OY!@cZ!P!@c!P!Q!AT!Q!}!@c!}#O!Ar#O#P!Bq#P;'S!@c;'S;=`!CQ<%lO!@c7`!AYW!X7`#W#X!AT#Z#[!AT#]#^!AT#a#b!AT#g#h!AT#i#j!AT#j#k!AT#m#n!AT7`!AuVOY!ArZ#O!Ar#O#P!B[#P#Q!@c#Q;'S!Ar;'S;=`!Bk<%lO!Ar7`!B_SOY!ArZ;'S!Ar;'S;=`!Bk<%lO!Ar7`!BnP;=`<%l!Ar7`!BtSOY!@cZ;'S!@c;'S;=`!CQ<%lO!@c7`!CTP;=`<%l!@c<z!C][$j&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#O!CW#O#P!DR#P#Q!=y#Q#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DWX$j&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DvP;=`<%l!CW<z!EOX$j&jOY!=yYZ&cZ!^!=y!^!_!@c!_#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!EnP;=`<%l!=y>^!Ezl$j&j([!b!X7`OY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#W&}#W#X!Eq#X#Z&}#Z#[!Eq#[#]&}#]#^!Eq#^#a&}#a#b!Eq#b#g&}#g#h!Eq#h#i&}#i#j!Eq#j#k!Eq#k#m&}#m#n!Eq#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}8r!GyZ([!b!X7`OY!GrZw!Grwx!@cx!P!Gr!P!Q!Hl!Q!}!Gr!}#O!JU#O#P!Bq#P;'S!Gr;'S;=`!J|<%lO!Gr8r!Hse([!b!X7`OY'}Zw'}x#O'}#P#W'}#W#X!Hl#X#Z'}#Z#[!Hl#[#]'}#]#^!Hl#^#a'}#a#b!Hl#b#g'}#g#h!Hl#h#i'}#i#j!Hl#j#k!Hl#k#m'}#m#n!Hl#n;'S'};'S;=`(f<%lO'}8r!JZX([!bOY!JUZw!JUwx!Arx#O!JU#O#P!B[#P#Q!Gr#Q;'S!JU;'S;=`!Jv<%lO!JU8r!JyP;=`<%l!JU8r!KPP;=`<%l!Gr>^!KZ^$j&j([!bOY!KSYZ&cZw!KSwx!CWx!^!KS!^!_!JU!_#O!KS#O#P!DR#P#Q!<n#Q#o!KS#o#p!JU#p;'S!KS;'S;=`!LV<%lO!KS>^!LYP;=`<%l!KS>^!L`P;=`<%l!<n=l!Ll`$j&j(Xp!X7`OY!LcYZ&cZr!Lcrs!=ys!P!Lc!P!Q!Mn!Q!^!Lc!^!_# o!_!}!Lc!}#O#%P#O#P!Dy#P#o!Lc#o#p# o#p;'S!Lc;'S;=`#&Y<%lO!Lc=l!Mwl$j&j(Xp!X7`OY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#W(r#W#X!Mn#X#Z(r#Z#[!Mn#[#](r#]#^!Mn#^#a(r#a#b!Mn#b#g(r#g#h!Mn#h#i(r#i#j!Mn#j#k!Mn#k#m(r#m#n!Mn#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r8Q# vZ(Xp!X7`OY# oZr# ors!@cs!P# o!P!Q#!i!Q!}# o!}#O#$R#O#P!Bq#P;'S# o;'S;=`#$y<%lO# o8Q#!pe(Xp!X7`OY)rZr)rs#O)r#P#W)r#W#X#!i#X#Z)r#Z#[#!i#[#])r#]#^#!i#^#a)r#a#b#!i#b#g)r#g#h#!i#h#i)r#i#j#!i#j#k#!i#k#m)r#m#n#!i#n;'S)r;'S;=`*Z<%lO)r8Q#$WX(XpOY#$RZr#$Rrs!Ars#O#$R#O#P!B[#P#Q# o#Q;'S#$R;'S;=`#$s<%lO#$R8Q#$vP;=`<%l#$R8Q#$|P;=`<%l# o=l#%W^$j&j(XpOY#%PYZ&cZr#%Prs!CWs!^#%P!^!_#$R!_#O#%P#O#P!DR#P#Q!Lc#Q#o#%P#o#p#$R#p;'S#%P;'S;=`#&S<%lO#%P=l#&VP;=`<%l#%P=l#&]P;=`<%l!Lc?O#&kn$j&j(Xp([!b!X7`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#W%Z#W#X#&`#X#Z%Z#Z#[#&`#[#]%Z#]#^#&`#^#a%Z#a#b#&`#b#g%Z#g#h#&`#h#i%Z#i#j#&`#j#k#&`#k#m%Z#m#n#&`#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z9d#(r](Xp([!b!X7`OY#(iZr#(irs!Grsw#(iwx# ox!P#(i!P!Q#)k!Q!}#(i!}#O#+`#O#P!Bq#P;'S#(i;'S;=`#,`<%lO#(i9d#)th(Xp([!b!X7`OY*gZr*grs'}sw*gwx)rx#O*g#P#W*g#W#X#)k#X#Z*g#Z#[#)k#[#]*g#]#^#)k#^#a*g#a#b#)k#b#g*g#g#h#)k#h#i*g#i#j#)k#j#k#)k#k#m*g#m#n#)k#n;'S*g;'S;=`+Z<%lO*g9d#+gZ(Xp([!bOY#+`Zr#+`rs!JUsw#+`wx#$Rx#O#+`#O#P!B[#P#Q#(i#Q;'S#+`;'S;=`#,Y<%lO#+`9d#,]P;=`<%l#+`9d#,cP;=`<%l#(i?O#,o`$j&j(Xp([!bOY#,fYZ&cZr#,frs!KSsw#,fwx#%Px!^#,f!^!_#+`!_#O#,f#O#P!DR#P#Q!;Z#Q#o#,f#o#p#+`#p;'S#,f;'S;=`#-q<%lO#,f?O#-tP;=`<%l#,f?O#-zP;=`<%l!;Z07[#.[b$j&j(Xp([!b(P0/l!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z07[#/o_$j&j(Xp([!bT0/lOY#/dYZ&cZr#/drs#0nsw#/dwx#4Ox!^#/d!^!_#5}!_#O#/d#O#P#1p#P#o#/d#o#p#5}#p;'S#/d;'S;=`#6|<%lO#/d06j#0w]$j&j([!bT0/lOY#0nYZ&cZw#0nwx#1px!^#0n!^!_#3R!_#O#0n#O#P#1p#P#o#0n#o#p#3R#p;'S#0n;'S;=`#3x<%lO#0n05W#1wX$j&jT0/lOY#1pYZ&cZ!^#1p!^!_#2d!_#o#1p#o#p#2d#p;'S#1p;'S;=`#2{<%lO#1p0/l#2iST0/lOY#2dZ;'S#2d;'S;=`#2u<%lO#2d0/l#2xP;=`<%l#2d05W#3OP;=`<%l#1p01O#3YW([!bT0/lOY#3RZw#3Rwx#2dx#O#3R#O#P#2d#P;'S#3R;'S;=`#3r<%lO#3R01O#3uP;=`<%l#3R06j#3{P;=`<%l#0n05x#4X]$j&j(XpT0/lOY#4OYZ&cZr#4Ors#1ps!^#4O!^!_#5Q!_#O#4O#O#P#1p#P#o#4O#o#p#5Q#p;'S#4O;'S;=`#5w<%lO#4O00^#5XW(XpT0/lOY#5QZr#5Qrs#2ds#O#5Q#O#P#2d#P;'S#5Q;'S;=`#5q<%lO#5Q00^#5tP;=`<%l#5Q05x#5zP;=`<%l#4O01p#6WY(Xp([!bT0/lOY#5}Zr#5}rs#3Rsw#5}wx#5Qx#O#5}#O#P#2d#P;'S#5};'S;=`#6v<%lO#5}01p#6yP;=`<%l#5}07[#7PP;=`<%l#/d)3h#7ab$j&j$R(Ch(Xp([!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;ZAt#8vb$[#t$j&j(Xp([!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z'Ad#:Zp$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#U%Z#U#V#?i#V#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#d#Bq#d#l%Z#l#m#Es#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#<jk$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#>j_$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#?rd$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#A]f$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Bzc$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Dbe$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#E|g$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Gpi$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x#Il_!g$b$j&j$P)Lv(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#Jv_al$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f#LS^h#)`#R-<U(Xp([!b$o7`OY*gZr*grs'}sw*gwx)rx!P*g!P!Q#MO!Q!^*g!^!_#Mt!_!`$ f!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#MXX$l&j(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El#M}Z#s(Ch(Xp([!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#Np!`#O*g#P;'S*g;'S;=`+Z<%lO*g(El#NyX$R(Ch(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El$ oX#t(Ch(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g*)x$!ga#`*!Y$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$#l!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(K[$#w_#l(Cl$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x$%Vag!*r#t(Ch$g#|$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$&[!`!a$'f!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$&g_#t(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$'qa#s(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$(v!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$)R`#s(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(Kd$*`a(s(Ct$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!a%Z!a!b$+e!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$+p`$j&j#|(Ch(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`$,}_!|$Ip$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f$.X_!S0,v$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/]Z$j&jO!^$0O!^!_$0f!_#i$0O#i#j$0k#j#l$0O#l#m$2^#m#o$0O#o#p$0f#p;'S$0O;'S;=`$4i<%lO$0O(n$0VT_#S$j&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0kO_#S(n$0p[$j&jO!Q&c!Q![$1f![!^&c!_!c&c!c!i$1f!i#T&c#T#Z$1f#Z#o&c#o#p$3|#p;'S&c;'S;=`&w<%lO&c(n$1kZ$j&jO!Q&c!Q![$2^![!^&c!_!c&c!c!i$2^!i#T&c#T#Z$2^#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2cZ$j&jO!Q&c!Q![$3U![!^&c!_!c&c!c!i$3U!i#T&c#T#Z$3U#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3ZZ$j&jO!Q&c!Q![$0O![!^&c!_!c&c!c!i$0O!i#T&c#T#Z$0O#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$4PR!Q![$4Y!c!i$4Y#T#Z$4Y#S$4]S!Q![$4Y!c!i$4Y#T#Z$4Y#q#r$0f(n$4lP;=`<%l$0O#1[$4z_!Y#)l$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$6U`#y(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;p$7c_$j&j(Xp([!b(b+4QOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$8qk$j&j(Xp([!b(U,2j$`#t(f$I[OY%ZYZ&cZr%Zrs&}st%Ztu$8buw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$8b![!^%Z!^!_*g!_!c%Z!c!}$8b!}#O%Z#O#P&c#P#R%Z#R#S$8b#S#T%Z#T#o$8b#o#p*g#p$g%Z$g;'S$8b;'S;=`$<l<%lO$8b+d$:qk$j&j(Xp([!b$`#tOY%ZYZ&cZr%Zrs&}st%Ztu$:fuw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$:f![!^%Z!^!_*g!_!c%Z!c!}$:f!}#O%Z#O#P&c#P#R%Z#R#S$:f#S#T%Z#T#o$:f#o#p*g#p$g%Z$g;'S$:f;'S;=`$<f<%lO$:f+d$<iP;=`<%l$:f07[$<oP;=`<%l$8b#Jf$<{X!_#Hb(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g,#x$=sa(z+JY$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+e#q;'S%Z;'S;=`+a<%lO%Z)>v$?V_!^(CdvBr$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z?O$@a_!q7`$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$Aq|$j&j(Xp([!b'}0/l$^#t(U,2j(f$I[OX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr07[$D|k$j&j(Xp([!b(O0/l$^#t(U,2j(f$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
  tokenizers: [Im, Nm, Fm, Hm, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, Bm, new jn("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOx~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!U~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(d~~", 141, 341), new jn("j~RQYZXz{^~^O(R~~aP!P!Qd~iO(S~~", 25, 324)],
  topRules: { Script: [0, 7], SingleExpression: [1, 277], SingleClassItem: [2, 278] },
  dialects: { jsx: 0, ts: 15179 },
  dynamicPrecedences: { 80: 1, 82: 1, 94: 1, 170: 1, 200: 1 },
  specialized: [{ term: 328, get: (n) => Jm[n] || -1 }, { term: 344, get: (n) => e$[n] || -1 }, { term: 95, get: (n) => t$[n] || -1 }],
  tokenPrec: 15205
});
function Lo(n) {
  let e = Object.keys(n).join(""), t = /\w/.test(e);
  return t && (e = e.replace(/\w/g, "")), `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function n$(n) {
  let e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  for (let { label: r } of n) {
    e[r[0]] = !0;
    for (let s = 1; s < r.length; s++)
      t[r[s]] = !0;
  }
  let i = Lo(e) + Lo(t) + "*$";
  return [new RegExp("^" + i), new RegExp(i)];
}
function r$(n) {
  let e = n.map((r) => typeof r == "string" ? { label: r } : r), [t, i] = e.every((r) => /^\w+$/.test(r.label)) ? [/\w*$/, /\w+$/] : n$(e);
  return (r) => {
    let s = r.matchBefore(i);
    return s || r.explicit ? { from: s ? s.from : r.pos, options: e, validFor: t } : null;
  };
}
function s$(n, e) {
  return (t) => {
    for (let i = se(t.state).resolveInner(t.pos, -1); i; i = i.parent) {
      if (n.indexOf(i.name) > -1)
        return null;
      if (i.type.isTop)
        break;
    }
    return e(t);
  };
}
const l$ = /* @__PURE__ */ Ot.define(), o$ = /* @__PURE__ */ Z.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center",
    cursor: "pointer"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box",
    whiteSpace: "pre-line"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
});
class a$ {
  constructor(e, t, i, r) {
    this.field = e, this.line = t, this.from = i, this.to = r;
  }
}
class Js {
  constructor(e, t, i) {
    this.field = e, this.from = t, this.to = i;
  }
  map(e) {
    let t = e.mapPos(this.from, -1, de.TrackDel), i = e.mapPos(this.to, 1, de.TrackDel);
    return t == null || i == null ? null : new Js(this.field, t, i);
  }
}
class el {
  constructor(e, t) {
    this.lines = e, this.fieldPositions = t;
  }
  instantiate(e, t) {
    let i = [], r = [t], s = e.doc.lineAt(t), l = /^\s*/.exec(s.text)[0];
    for (let a of this.lines) {
      if (i.length) {
        let h = l, O = /^\t*/.exec(a)[0].length;
        for (let c = 0; c < O; c++)
          h += e.facet(Bn);
        r.push(t + h.length - O), a = h + a.slice(O);
      }
      i.push(a), t += a.length + 1;
    }
    let o = this.fieldPositions.map((a) => new Js(a.field, r[a.line] + a.from, r[a.line] + a.to));
    return { text: i, ranges: o };
  }
  static parse(e) {
    let t = [], i = [], r = [], s;
    for (let l of e.split(/\r\n?|\n/)) {
      for (; s = /[#$]\{(?:(\d+)(?::([^{}]*))?|((?:\\[{}]|[^{}])*))\}/.exec(l); ) {
        let o = s[1] ? +s[1] : null, a = s[2] || s[3] || "", h = -1;
        o === 0 && (o = 1e9);
        let O = a.replace(/\\[{}]/g, (c) => c[1]);
        for (let c = 0; c < t.length; c++)
          (o != null ? t[c].seq == o : O && t[c].name == O) && (h = c);
        if (h < 0) {
          let c = 0;
          for (; c < t.length && (o == null || t[c].seq != null && t[c].seq < o); )
            c++;
          t.splice(c, 0, { seq: o, name: O }), h = c;
          for (let f of r)
            f.field >= h && f.field++;
        }
        for (let c of r)
          if (c.line == i.length && c.from > s.index) {
            let f = s[2] ? 3 + (s[1] || "").length : 2;
            c.from -= f, c.to -= f;
          }
        r.push(new a$(h, i.length, s.index, s.index + O.length)), l = l.slice(0, s.index) + a + l.slice(s.index + s[0].length);
      }
      l = l.replace(/\\([{}])/g, (o, a, h) => {
        for (let O of r)
          O.line == i.length && O.from > h && (O.from--, O.to--);
        return a;
      }), i.push(l);
    }
    return new el(i, r);
  }
}
let h$ = /* @__PURE__ */ G.widget({ widget: /* @__PURE__ */ new class extends Ci {
  toDOM() {
    let n = document.createElement("span");
    return n.className = "cm-snippetFieldPosition", n;
  }
  ignoreEvent() {
    return !1;
  }
}() }), O$ = /* @__PURE__ */ G.mark({ class: "cm-snippetField" });
class ni {
  constructor(e, t) {
    this.ranges = e, this.active = t, this.deco = G.set(e.map((i) => (i.from == i.to ? h$ : O$).range(i.from, i.to)), !0);
  }
  map(e) {
    let t = [];
    for (let i of this.ranges) {
      let r = i.map(e);
      if (!r)
        return null;
      t.push(r);
    }
    return new ni(t, this.active);
  }
  selectionInsideField(e) {
    return e.ranges.every((t) => this.ranges.some((i) => i.field == this.active && i.from <= t.from && i.to >= t.to));
  }
}
const Yi = /* @__PURE__ */ I.define({
  map(n, e) {
    return n && n.map(e);
  }
}), c$ = /* @__PURE__ */ I.define(), Ti = /* @__PURE__ */ ht.define({
  create() {
    return null;
  },
  update(n, e) {
    for (let t of e.effects) {
      if (t.is(Yi))
        return t.value;
      if (t.is(c$) && n)
        return new ni(n.ranges, t.value);
    }
    return n && e.docChanged && (n = n.map(e.changes)), n && e.selection && !n.selectionInsideField(e.selection) && (n = null), n;
  },
  provide: (n) => Z.decorations.from(n, (e) => e ? e.deco : G.none)
});
function tl(n, e) {
  return Q.create(n.filter((t) => t.field == e).map((t) => Q.range(t.from, t.to)));
}
function f$(n) {
  let e = el.parse(n);
  return (t, i, r, s) => {
    let { text: l, ranges: o } = e.instantiate(t.state, r), { main: a } = t.state.selection, h = {
      changes: { from: r, to: s == a.from ? a.to : s, insert: _.of(l) },
      scrollIntoView: !0,
      annotations: i ? [l$.of(i), K.userEvent.of("input.complete")] : void 0
    };
    if (o.length && (h.selection = tl(o, 0)), o.some((O) => O.field > 0)) {
      let O = new ni(o, 0), c = h.effects = [Yi.of(O)];
      t.state.field(Ti, !1) === void 0 && c.push(I.appendConfig.of([Ti, m$, $$, o$]));
    }
    t.dispatch(t.state.update(h));
  };
}
function qO(n) {
  return ({ state: e, dispatch: t }) => {
    let i = e.field(Ti, !1);
    if (!i || n < 0 && i.active == 0)
      return !1;
    let r = i.active + n, s = n > 0 && !i.ranges.some((l) => l.field == r + n);
    return t(e.update({
      selection: tl(i.ranges, r),
      effects: Yi.of(s ? null : new ni(i.ranges, r)),
      scrollIntoView: !0
    })), !0;
  };
}
const u$ = ({ state: n, dispatch: e }) => n.field(Ti, !1) ? (e(n.update({ effects: Yi.of(null) })), !0) : !1, d$ = /* @__PURE__ */ qO(1), p$ = /* @__PURE__ */ qO(-1), g$ = [
  { key: "Tab", run: d$, shift: p$ },
  { key: "Escape", run: u$ }
], Bo = /* @__PURE__ */ v.define({
  combine(n) {
    return n.length ? n[0] : g$;
  }
}), m$ = /* @__PURE__ */ Ri.highest(/* @__PURE__ */ Ys.compute([Bo], (n) => n.facet(Bo)));
function $e(n, e) {
  return { ...e, apply: f$(n) };
}
const $$ = /* @__PURE__ */ Z.domEventHandlers({
  mousedown(n, e) {
    let t = e.state.field(Ti, !1), i;
    if (!t || (i = e.posAtCoords({ x: n.clientX, y: n.clientY })) == null)
      return !1;
    let r = t.ranges.find((s) => s.from <= i && s.to >= i);
    return !r || r.field == t.active ? !1 : (e.dispatch({
      selection: tl(t.ranges, r.field),
      effects: Yi.of(t.ranges.some((s) => s.field > r.field) ? new ni(t.ranges, r.field) : null),
      scrollIntoView: !0
    }), !0);
  }
}), YO = /* @__PURE__ */ new class extends gt {
}();
YO.startSide = 1;
YO.endSide = -1;
const zO = [
  /* @__PURE__ */ $e("function ${name}(${params}) {\n	${}\n}", {
    label: "function",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ $e("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ $e("for (let ${name} of ${collection}) {\n	${}\n}", {
    label: "for",
    detail: "of loop",
    type: "keyword"
  }),
  /* @__PURE__ */ $e("do {\n	${}\n} while (${})", {
    label: "do",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ $e("while (${}) {\n	${}\n}", {
    label: "while",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ $e(`try {
	\${}
} catch (\${error}) {
	\${}
}`, {
    label: "try",
    detail: "/ catch block",
    type: "keyword"
  }),
  /* @__PURE__ */ $e("if (${}) {\n	${}\n}", {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  /* @__PURE__ */ $e(`if (\${}) {
	\${}
} else {
	\${}
}`, {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  /* @__PURE__ */ $e(`class \${name} {
	constructor(\${params}) {
		\${}
	}
}`, {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ $e('import {${names}} from "${module}"\n${}', {
    label: "import",
    detail: "named",
    type: "keyword"
  }),
  /* @__PURE__ */ $e('import ${name} from "${module}"\n${}', {
    label: "import",
    detail: "default",
    type: "keyword"
  })
], Q$ = /* @__PURE__ */ zO.concat([
  /* @__PURE__ */ $e("interface ${name} {\n	${}\n}", {
    label: "interface",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ $e("type ${name} = ${type}", {
    label: "type",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ $e("enum ${name} {\n	${}\n}", {
    label: "enum",
    detail: "definition",
    type: "keyword"
  })
]), Io = /* @__PURE__ */ new wh(), EO = /* @__PURE__ */ new Set([
  "Script",
  "Block",
  "FunctionExpression",
  "FunctionDeclaration",
  "ArrowFunction",
  "MethodDeclaration",
  "ForStatement"
]);
function Oi(n) {
  return (e, t) => {
    let i = e.node.getChild("VariableDefinition");
    return i && t(i, n), !0;
  };
}
const S$ = ["FunctionDeclaration"], b$ = {
  FunctionDeclaration: /* @__PURE__ */ Oi("function"),
  ClassDeclaration: /* @__PURE__ */ Oi("class"),
  ClassExpression: () => !0,
  EnumDeclaration: /* @__PURE__ */ Oi("constant"),
  TypeAliasDeclaration: /* @__PURE__ */ Oi("type"),
  NamespaceDeclaration: /* @__PURE__ */ Oi("namespace"),
  VariableDefinition(n, e) {
    n.matchContext(S$) || e(n, "variable");
  },
  TypeDefinition(n, e) {
    e(n, "type");
  },
  __proto__: null
};
function UO(n, e) {
  let t = Io.get(e);
  if (t)
    return t;
  let i = [], r = !0;
  function s(l, o) {
    let a = n.sliceString(l.from, l.to);
    i.push({ label: a, type: o });
  }
  return e.cursor(q.IncludeAnonymous).iterate((l) => {
    if (r)
      r = !1;
    else if (l.name) {
      let o = b$[l.name];
      if (o && o(l, s) || EO.has(l.name))
        return !1;
    } else if (l.to - l.from > 8192) {
      for (let o of UO(n, l.node))
        i.push(o);
      return !1;
    }
  }), Io.set(e, i), i;
}
const No = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/, VO = [
  "TemplateString",
  "String",
  "RegExp",
  "LineComment",
  "BlockComment",
  "VariableDefinition",
  "TypeDefinition",
  "Label",
  "PropertyDefinition",
  "PropertyName",
  "PrivatePropertyDefinition",
  "PrivatePropertyName",
  "JSXText",
  "JSXAttributeValue",
  "JSXOpenTag",
  "JSXCloseTag",
  "JSXSelfClosingTag",
  ".",
  "?."
];
function y$(n) {
  let e = se(n.state).resolveInner(n.pos, -1);
  if (VO.indexOf(e.name) > -1)
    return null;
  let t = e.name == "VariableName" || e.to - e.from < 20 && No.test(n.state.sliceDoc(e.from, e.to));
  if (!t && !n.explicit)
    return null;
  let i = [];
  for (let r = e; r; r = r.parent)
    EO.has(r.name) && (i = i.concat(UO(n.state.doc, r)));
  return {
    options: i,
    from: t ? e.from : n.pos,
    validFor: No
  };
}
const Je = /* @__PURE__ */ Tt.define({
  name: "javascript",
  parser: /* @__PURE__ */ i$.configure({
    props: [
      /* @__PURE__ */ Mi.add({
        IfStatement: /* @__PURE__ */ cn({ except: /^\s*({|else\b)/ }),
        TryStatement: /* @__PURE__ */ cn({ except: /^\s*({|catch\b|finally\b)/ }),
        LabeledStatement: Sd,
        SwitchBody: (n) => {
          let e = n.textAfter, t = /^\s*\}/.test(e), i = /^\s*(case|default)\b/.test(e);
          return n.baseIndent + (t ? 0 : i ? 1 : 2) * n.unit;
        },
        Block: /* @__PURE__ */ _h({ closing: "}" }),
        ArrowFunction: (n) => n.baseIndent + n.unit,
        "TemplateString BlockComment": () => null,
        "Statement Property": /* @__PURE__ */ cn({ except: /^\s*{/ }),
        JSXElement(n) {
          let e = /^\s*<\//.test(n.textAfter);
          return n.lineIndent(n.node.from) + (e ? 0 : n.unit);
        },
        JSXEscape(n) {
          let e = /\s*\}/.test(n.textAfter);
          return n.lineIndent(n.node.from) + (e ? 0 : n.unit);
        },
        "JSXOpenTag JSXSelfClosingTag"(n) {
          return n.column(n.node.from) + n.unit;
        }
      }),
      /* @__PURE__ */ Nn.add({
        "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": qh,
        BlockComment(n) {
          return { from: n.from + 2, to: n.to - 2 };
        },
        JSXElement(n) {
          let e = n.firstChild;
          if (!e || e.name == "JSXSelfClosingTag")
            return null;
          let t = n.lastChild;
          return { from: e.to, to: t.type.isError ? n.to : t.from };
        },
        "JSXSelfClosingTag JSXOpenTag"(n) {
          var e;
          let t = (e = n.firstChild) === null || e === void 0 ? void 0 : e.nextSibling, i = n.lastChild;
          return !t || t.type.isError ? null : { from: t.to, to: i.type.isError ? n.to : i.from };
        }
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
    wordChars: "$"
  }
}), GO = {
  test: (n) => /^JSX/.test(n.name),
  facet: /* @__PURE__ */ Ch({ commentTokens: { block: { open: "{/*", close: "*/}" } } })
}, DO = /* @__PURE__ */ Je.configure({ dialect: "ts" }, "typescript"), LO = /* @__PURE__ */ Je.configure({
  dialect: "jsx",
  props: [/* @__PURE__ */ Gs.add((n) => n.isTop ? [GO] : void 0)]
}), BO = /* @__PURE__ */ Je.configure({
  dialect: "jsx ts",
  props: [/* @__PURE__ */ Gs.add((n) => n.isTop ? [GO] : void 0)]
}, "typescript");
let IO = (n) => ({ label: n, type: "keyword" });
const NO = /* @__PURE__ */ "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(IO), P$ = /* @__PURE__ */ NO.concat(/* @__PURE__ */ ["declare", "implements", "private", "protected", "public"].map(IO));
function x$(n = {}) {
  let e = n.jsx ? n.typescript ? BO : LO : n.typescript ? DO : Je, t = n.typescript ? Q$.concat(P$) : zO.concat(NO);
  return new Ln(e, [
    Je.data.of({
      autocomplete: s$(VO, r$(t))
    }),
    Je.data.of({
      autocomplete: y$
    }),
    n.jsx ? v$ : []
  ]);
}
function k$(n) {
  for (; ; ) {
    if (n.name == "JSXOpenTag" || n.name == "JSXSelfClosingTag" || n.name == "JSXFragmentTag")
      return n;
    if (n.name == "JSXEscape" || !n.parent)
      return null;
    n = n.parent;
  }
}
function Fo(n, e, t = n.length) {
  for (let i = e?.firstChild; i; i = i.nextSibling)
    if (i.name == "JSXIdentifier" || i.name == "JSXBuiltin" || i.name == "JSXNamespacedName" || i.name == "JSXMemberExpression")
      return n.sliceString(i.from, Math.min(i.to, t));
  return "";
}
const w$ = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), v$ = /* @__PURE__ */ Z.inputHandler.of((n, e, t, i, r) => {
  if ((w$ ? n.composing : n.compositionStarted) || n.state.readOnly || e != t || i != ">" && i != "/" || !Je.isActiveAt(n.state, e, -1))
    return !1;
  let s = r(), { state: l } = s, o = l.changeByRange((a) => {
    var h;
    let { head: O } = a, c = se(l).resolveInner(O - 1, -1), f;
    if (c.name == "JSXStartTag" && (c = c.parent), !(l.doc.sliceString(O - 1, O) != i || c.name == "JSXAttributeValue" && c.to > O)) {
      if (i == ">" && c.name == "JSXFragmentTag")
        return { range: a, changes: { from: O, insert: "</>" } };
      if (i == "/" && c.name == "JSXStartCloseTag") {
        let u = c.parent, d = u.parent;
        if (d && u.from == O - 2 && ((f = Fo(l.doc, d.firstChild, O)) || ((h = d.firstChild) === null || h === void 0 ? void 0 : h.name) == "JSXFragmentTag")) {
          let p = `${f}>`;
          return { range: Q.cursor(O + p.length, -1), changes: { from: O, insert: p } };
        }
      } else if (i == ">") {
        let u = k$(c);
        if (u && u.name == "JSXOpenTag" && !/^\/?>|^<\//.test(l.doc.sliceString(O, O + 2)) && (f = Fo(l.doc, u, O)))
          return { range: a, changes: { from: O, insert: `</${f}>` } };
      }
    }
    return { range: a };
  });
  return o.changes.empty ? !1 : (n.dispatch([
    s,
    l.update(o, { userEvent: "input.complete", scrollIntoView: !0 })
  ]), !0);
}), ci = ["_blank", "_self", "_top", "_parent"], vr = ["ascii", "utf-8", "utf-16", "latin1", "latin1"], Xr = ["get", "post", "put", "delete"], Zr = ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], Pe = ["true", "false"], X = {}, X$ = {
  a: {
    attrs: {
      href: null,
      ping: null,
      type: null,
      media: null,
      target: ci,
      hreflang: null
    }
  },
  abbr: X,
  address: X,
  area: {
    attrs: {
      alt: null,
      coords: null,
      href: null,
      target: null,
      ping: null,
      media: null,
      hreflang: null,
      type: null,
      shape: ["default", "rect", "circle", "poly"]
    }
  },
  article: X,
  aside: X,
  audio: {
    attrs: {
      src: null,
      mediagroup: null,
      crossorigin: ["anonymous", "use-credentials"],
      preload: ["none", "metadata", "auto"],
      autoplay: ["autoplay"],
      loop: ["loop"],
      controls: ["controls"]
    }
  },
  b: X,
  base: { attrs: { href: null, target: ci } },
  bdi: X,
  bdo: X,
  blockquote: { attrs: { cite: null } },
  body: X,
  br: X,
  button: {
    attrs: {
      form: null,
      formaction: null,
      name: null,
      value: null,
      autofocus: ["autofocus"],
      disabled: ["autofocus"],
      formenctype: Zr,
      formmethod: Xr,
      formnovalidate: ["novalidate"],
      formtarget: ci,
      type: ["submit", "reset", "button"]
    }
  },
  canvas: { attrs: { width: null, height: null } },
  caption: X,
  center: X,
  cite: X,
  code: X,
  col: { attrs: { span: null } },
  colgroup: { attrs: { span: null } },
  command: {
    attrs: {
      type: ["command", "checkbox", "radio"],
      label: null,
      icon: null,
      radiogroup: null,
      command: null,
      title: null,
      disabled: ["disabled"],
      checked: ["checked"]
    }
  },
  data: { attrs: { value: null } },
  datagrid: { attrs: { disabled: ["disabled"], multiple: ["multiple"] } },
  datalist: { attrs: { data: null } },
  dd: X,
  del: { attrs: { cite: null, datetime: null } },
  details: { attrs: { open: ["open"] } },
  dfn: X,
  div: X,
  dl: X,
  dt: X,
  em: X,
  embed: { attrs: { src: null, type: null, width: null, height: null } },
  eventsource: { attrs: { src: null } },
  fieldset: { attrs: { disabled: ["disabled"], form: null, name: null } },
  figcaption: X,
  figure: X,
  footer: X,
  form: {
    attrs: {
      action: null,
      name: null,
      "accept-charset": vr,
      autocomplete: ["on", "off"],
      enctype: Zr,
      method: Xr,
      novalidate: ["novalidate"],
      target: ci
    }
  },
  h1: X,
  h2: X,
  h3: X,
  h4: X,
  h5: X,
  h6: X,
  head: {
    children: ["title", "base", "link", "style", "meta", "script", "noscript", "command"]
  },
  header: X,
  hgroup: X,
  hr: X,
  html: {
    attrs: { manifest: null }
  },
  i: X,
  iframe: {
    attrs: {
      src: null,
      srcdoc: null,
      name: null,
      width: null,
      height: null,
      sandbox: ["allow-top-navigation", "allow-same-origin", "allow-forms", "allow-scripts"],
      seamless: ["seamless"]
    }
  },
  img: {
    attrs: {
      alt: null,
      src: null,
      ismap: null,
      usemap: null,
      width: null,
      height: null,
      crossorigin: ["anonymous", "use-credentials"]
    }
  },
  input: {
    attrs: {
      alt: null,
      dirname: null,
      form: null,
      formaction: null,
      height: null,
      list: null,
      max: null,
      maxlength: null,
      min: null,
      name: null,
      pattern: null,
      placeholder: null,
      size: null,
      src: null,
      step: null,
      value: null,
      width: null,
      accept: ["audio/*", "video/*", "image/*"],
      autocomplete: ["on", "off"],
      autofocus: ["autofocus"],
      checked: ["checked"],
      disabled: ["disabled"],
      formenctype: Zr,
      formmethod: Xr,
      formnovalidate: ["novalidate"],
      formtarget: ci,
      multiple: ["multiple"],
      readonly: ["readonly"],
      required: ["required"],
      type: [
        "hidden",
        "text",
        "search",
        "tel",
        "url",
        "email",
        "password",
        "datetime",
        "date",
        "month",
        "week",
        "time",
        "datetime-local",
        "number",
        "range",
        "color",
        "checkbox",
        "radio",
        "file",
        "submit",
        "image",
        "reset",
        "button"
      ]
    }
  },
  ins: { attrs: { cite: null, datetime: null } },
  kbd: X,
  keygen: {
    attrs: {
      challenge: null,
      form: null,
      name: null,
      autofocus: ["autofocus"],
      disabled: ["disabled"],
      keytype: ["RSA"]
    }
  },
  label: { attrs: { for: null, form: null } },
  legend: X,
  li: { attrs: { value: null } },
  link: {
    attrs: {
      href: null,
      type: null,
      hreflang: null,
      media: null,
      sizes: ["all", "16x16", "16x16 32x32", "16x16 32x32 64x64"]
    }
  },
  map: { attrs: { name: null } },
  mark: X,
  menu: { attrs: { label: null, type: ["list", "context", "toolbar"] } },
  meta: {
    attrs: {
      content: null,
      charset: vr,
      name: ["viewport", "application-name", "author", "description", "generator", "keywords"],
      "http-equiv": ["content-language", "content-type", "default-style", "refresh"]
    }
  },
  meter: { attrs: { value: null, min: null, low: null, high: null, max: null, optimum: null } },
  nav: X,
  noscript: X,
  object: {
    attrs: {
      data: null,
      type: null,
      name: null,
      usemap: null,
      form: null,
      width: null,
      height: null,
      typemustmatch: ["typemustmatch"]
    }
  },
  ol: {
    attrs: { reversed: ["reversed"], start: null, type: ["1", "a", "A", "i", "I"] },
    children: ["li", "script", "template", "ul", "ol"]
  },
  optgroup: { attrs: { disabled: ["disabled"], label: null } },
  option: { attrs: { disabled: ["disabled"], label: null, selected: ["selected"], value: null } },
  output: { attrs: { for: null, form: null, name: null } },
  p: X,
  param: { attrs: { name: null, value: null } },
  pre: X,
  progress: { attrs: { value: null, max: null } },
  q: { attrs: { cite: null } },
  rp: X,
  rt: X,
  ruby: X,
  samp: X,
  script: {
    attrs: {
      type: ["text/javascript"],
      src: null,
      async: ["async"],
      defer: ["defer"],
      charset: vr
    }
  },
  section: X,
  select: {
    attrs: {
      form: null,
      name: null,
      size: null,
      autofocus: ["autofocus"],
      disabled: ["disabled"],
      multiple: ["multiple"]
    }
  },
  slot: { attrs: { name: null } },
  small: X,
  source: { attrs: { src: null, type: null, media: null } },
  span: X,
  strong: X,
  style: {
    attrs: {
      type: ["text/css"],
      media: null,
      scoped: null
    }
  },
  sub: X,
  summary: X,
  sup: X,
  table: X,
  tbody: X,
  td: { attrs: { colspan: null, rowspan: null, headers: null } },
  template: X,
  textarea: {
    attrs: {
      dirname: null,
      form: null,
      maxlength: null,
      name: null,
      placeholder: null,
      rows: null,
      cols: null,
      autofocus: ["autofocus"],
      disabled: ["disabled"],
      readonly: ["readonly"],
      required: ["required"],
      wrap: ["soft", "hard"]
    }
  },
  tfoot: X,
  th: { attrs: { colspan: null, rowspan: null, headers: null, scope: ["row", "col", "rowgroup", "colgroup"] } },
  thead: X,
  time: { attrs: { datetime: null } },
  title: X,
  tr: X,
  track: {
    attrs: {
      src: null,
      label: null,
      default: null,
      kind: ["subtitles", "captions", "descriptions", "chapters", "metadata"],
      srclang: null
    }
  },
  ul: { children: ["li", "script", "template", "ul", "ol"] },
  var: X,
  video: {
    attrs: {
      src: null,
      poster: null,
      width: null,
      height: null,
      crossorigin: ["anonymous", "use-credentials"],
      preload: ["auto", "metadata", "none"],
      autoplay: ["autoplay"],
      mediagroup: ["movie"],
      muted: ["muted"],
      controls: ["controls"]
    }
  },
  wbr: X
}, FO = {
  accesskey: null,
  class: null,
  contenteditable: Pe,
  contextmenu: null,
  dir: ["ltr", "rtl", "auto"],
  draggable: ["true", "false", "auto"],
  dropzone: ["copy", "move", "link", "string:", "file:"],
  hidden: ["hidden"],
  id: null,
  inert: ["inert"],
  itemid: null,
  itemprop: null,
  itemref: null,
  itemscope: ["itemscope"],
  itemtype: null,
  lang: ["ar", "bn", "de", "en-GB", "en-US", "es", "fr", "hi", "id", "ja", "pa", "pt", "ru", "tr", "zh"],
  spellcheck: Pe,
  autocorrect: Pe,
  autocapitalize: Pe,
  style: null,
  tabindex: null,
  title: null,
  translate: ["yes", "no"],
  rel: ["stylesheet", "alternate", "author", "bookmark", "help", "license", "next", "nofollow", "noreferrer", "prefetch", "prev", "search", "tag"],
  role: /* @__PURE__ */ "alert application article banner button cell checkbox complementary contentinfo dialog document feed figure form grid gridcell heading img list listbox listitem main navigation region row rowgroup search switch tab table tabpanel textbox timer".split(" "),
  "aria-activedescendant": null,
  "aria-atomic": Pe,
  "aria-autocomplete": ["inline", "list", "both", "none"],
  "aria-busy": Pe,
  "aria-checked": ["true", "false", "mixed", "undefined"],
  "aria-controls": null,
  "aria-describedby": null,
  "aria-disabled": Pe,
  "aria-dropeffect": null,
  "aria-expanded": ["true", "false", "undefined"],
  "aria-flowto": null,
  "aria-grabbed": ["true", "false", "undefined"],
  "aria-haspopup": Pe,
  "aria-hidden": Pe,
  "aria-invalid": ["true", "false", "grammar", "spelling"],
  "aria-label": null,
  "aria-labelledby": null,
  "aria-level": null,
  "aria-live": ["off", "polite", "assertive"],
  "aria-multiline": Pe,
  "aria-multiselectable": Pe,
  "aria-owns": null,
  "aria-posinset": null,
  "aria-pressed": ["true", "false", "mixed", "undefined"],
  "aria-readonly": Pe,
  "aria-relevant": null,
  "aria-required": Pe,
  "aria-selected": ["true", "false", "undefined"],
  "aria-setsize": null,
  "aria-sort": ["ascending", "descending", "none", "other"],
  "aria-valuemax": null,
  "aria-valuemin": null,
  "aria-valuenow": null,
  "aria-valuetext": null
}, HO = /* @__PURE__ */ "beforeunload copy cut dragstart dragover dragleave dragenter dragend drag paste focus blur change click load mousedown mouseenter mouseleave mouseup keydown keyup resize scroll unload".split(" ").map((n) => "on" + n);
for (let n of HO)
  FO[n] = null;
class Mn {
  constructor(e, t) {
    this.tags = { ...X$, ...e }, this.globalAttrs = { ...FO, ...t }, this.allTags = Object.keys(this.tags), this.globalAttrNames = Object.keys(this.globalAttrs);
  }
}
Mn.default = /* @__PURE__ */ new Mn();
function Ct(n, e, t = n.length) {
  if (!e)
    return "";
  let i = e.firstChild, r = i && i.getChild("TagName");
  return r ? n.sliceString(r.from, Math.min(r.to, t)) : "";
}
function ti(n, e = !1) {
  for (; n; n = n.parent)
    if (n.name == "Element")
      if (e)
        e = !1;
      else
        return n;
  return null;
}
function KO(n, e, t) {
  let i = t.tags[Ct(n, ti(e))];
  return i?.children || t.allTags;
}
function il(n, e) {
  let t = [];
  for (let i = ti(e); i && !i.type.isTop; i = ti(i.parent)) {
    let r = Ct(n, i);
    if (r && i.lastChild.name == "CloseTag")
      break;
    r && t.indexOf(r) < 0 && (e.name == "EndTag" || e.from >= i.firstChild.to) && t.push(r);
  }
  return t;
}
const JO = /^[:\-\.\w\u00b7-\uffff]*$/;
function Ho(n, e, t, i, r) {
  let s = /\s*>/.test(n.sliceDoc(r, r + 5)) ? "" : ">", l = ti(t, t.name == "StartTag" || t.name == "TagName");
  return {
    from: i,
    to: r,
    options: KO(n.doc, l, e).map((o) => ({ label: o, type: "type" })).concat(il(n.doc, t).map((o, a) => ({
      label: "/" + o,
      apply: "/" + o + s,
      type: "type",
      boost: 99 - a
    }))),
    validFor: /^\/?[:\-\.\w\u00b7-\uffff]*$/
  };
}
function Ko(n, e, t, i) {
  let r = /\s*>/.test(n.sliceDoc(i, i + 5)) ? "" : ">";
  return {
    from: t,
    to: i,
    options: il(n.doc, e).map((s, l) => ({ label: s, apply: s + r, type: "type", boost: 99 - l })),
    validFor: JO
  };
}
function Z$(n, e, t, i) {
  let r = [], s = 0;
  for (let l of KO(n.doc, t, e))
    r.push({ label: "<" + l, type: "type" });
  for (let l of il(n.doc, t))
    r.push({ label: "</" + l + ">", type: "type", boost: 99 - s++ });
  return { from: i, to: i, options: r, validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/ };
}
function T$(n, e, t, i, r) {
  let s = ti(t), l = s ? e.tags[Ct(n.doc, s)] : null, o = l && l.attrs ? Object.keys(l.attrs) : [], a = l && l.globalAttrs === !1 ? o : o.length ? o.concat(e.globalAttrNames) : e.globalAttrNames;
  return {
    from: i,
    to: r,
    options: a.map((h) => ({ label: h, type: "property" })),
    validFor: JO
  };
}
function R$(n, e, t, i, r) {
  var s;
  let l = (s = t.parent) === null || s === void 0 ? void 0 : s.getChild("AttributeName"), o = [], a;
  if (l) {
    let h = n.sliceDoc(l.from, l.to), O = e.globalAttrs[h];
    if (!O) {
      let c = ti(t), f = c ? e.tags[Ct(n.doc, c)] : null;
      O = f?.attrs && f.attrs[h];
    }
    if (O) {
      let c = n.sliceDoc(i, r).toLowerCase(), f = '"', u = '"';
      /^['"]/.test(c) ? (a = c[0] == '"' ? /^[^"]*$/ : /^[^']*$/, f = "", u = n.sliceDoc(r, r + 1) == c[0] ? "" : c[0], c = c.slice(1), i++) : a = /^[^\s<>='"]*$/;
      for (let d of O)
        o.push({ label: d, apply: f + d + u, type: "constant" });
    }
  }
  return { from: i, to: r, options: o, validFor: a };
}
function C$(n, e) {
  let { state: t, pos: i } = e, r = se(t).resolveInner(i, -1), s = r.resolve(i);
  for (let l = i, o; s == r && (o = r.childBefore(l)); ) {
    let a = o.lastChild;
    if (!a || !a.type.isError || a.from < a.to)
      break;
    s = r = o, l = a.from;
  }
  return r.name == "TagName" ? r.parent && /CloseTag$/.test(r.parent.name) ? Ko(t, r, r.from, i) : Ho(t, n, r, r.from, i) : r.name == "StartTag" || r.name == "IncompleteTag" ? Ho(t, n, r, i, i) : r.name == "StartCloseTag" || r.name == "IncompleteCloseTag" ? Ko(t, r, i, i) : r.name == "OpenTag" || r.name == "SelfClosingTag" || r.name == "AttributeName" ? T$(t, n, r, r.name == "AttributeName" ? r.from : i, i) : r.name == "Is" || r.name == "AttributeValue" || r.name == "UnquotedAttributeValue" ? R$(t, n, r, r.name == "Is" ? i : r.from, i) : e.explicit && (s.name == "Element" || s.name == "Text" || s.name == "Document") ? Z$(t, n, r, i) : null;
}
function A$(n) {
  let { extraTags: e, extraGlobalAttributes: t } = n, i = t || e ? new Mn(e, t) : Mn.default;
  return (r) => C$(i, r);
}
const j$ = /* @__PURE__ */ Je.parser.configure({ top: "SingleExpression" }), ec = [
  {
    tag: "script",
    attrs: (n) => n.type == "text/typescript" || n.lang == "ts",
    parser: DO.parser
  },
  {
    tag: "script",
    attrs: (n) => n.type == "text/babel" || n.type == "text/jsx",
    parser: LO.parser
  },
  {
    tag: "script",
    attrs: (n) => n.type == "text/typescript-jsx",
    parser: BO.parser
  },
  {
    tag: "script",
    attrs(n) {
      return /^(importmap|speculationrules|application\/(.+\+)?json)$/i.test(n.type);
    },
    parser: j$
  },
  {
    tag: "script",
    attrs(n) {
      return !n.type || /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(n.type);
    },
    parser: Je.parser
  },
  {
    tag: "style",
    attrs(n) {
      return (!n.lang || n.lang == "css") && (!n.type || /^(text\/)?(x-)?(stylesheet|css)$/i.test(n.type));
    },
    parser: _n.parser
  }
], tc = /* @__PURE__ */ [
  {
    name: "style",
    parser: /* @__PURE__ */ _n.parser.configure({ top: "Styles" })
  }
].concat(/* @__PURE__ */ HO.map((n) => ({ name: n, parser: Je.parser }))), ic = /* @__PURE__ */ Tt.define({
  name: "html",
  parser: /* @__PURE__ */ Ug.configure({
    props: [
      /* @__PURE__ */ Mi.add({
        Element(n) {
          let e = /^(\s*)(<\/)?/.exec(n.textAfter);
          return n.node.to <= n.pos + e[0].length ? n.continue() : n.lineIndent(n.node.from) + (e[2] ? 0 : n.unit);
        },
        "OpenTag CloseTag SelfClosingTag"(n) {
          return n.column(n.node.from) + n.unit;
        },
        Document(n) {
          if (n.pos + /\s*/.exec(n.textAfter)[0].length < n.node.to)
            return n.continue();
          let e = null, t;
          for (let i = n.node; ; ) {
            let r = i.lastChild;
            if (!r || r.name != "Element" || r.to != i.to)
              break;
            e = i = r;
          }
          return e && !((t = e.lastChild) && (t.name == "CloseTag" || t.name == "SelfClosingTag")) ? n.lineIndent(e.from) + n.unit : null;
        }
      }),
      /* @__PURE__ */ Nn.add({
        Element(n) {
          let e = n.firstChild, t = n.lastChild;
          return !e || e.name != "OpenTag" ? null : { from: e.to, to: t.name == "CloseTag" ? t.from : n.to };
        }
      }),
      /* @__PURE__ */ Uh.add({
        "OpenTag CloseTag": (n) => n.getChild("TagName")
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "<!--", close: "-->" } },
    indentOnInput: /^\s*<\/\w+\W$/,
    wordChars: "-_"
  }
}), dn = /* @__PURE__ */ ic.configure({
  wrap: /* @__PURE__ */ RO(ec, tc)
});
function nc(n = {}) {
  let e = "", t;
  n.matchClosingTags === !1 && (e = "noMatch"), n.selfClosingTags === !0 && (e = (e ? e + " " : "") + "selfClosing"), (n.nestedLanguages && n.nestedLanguages.length || n.nestedAttributes && n.nestedAttributes.length) && (t = RO((n.nestedLanguages || []).concat(ec), (n.nestedAttributes || []).concat(tc)));
  let i = t ? ic.configure({ wrap: t, dialect: e }) : e ? dn.configure({ dialect: e }) : dn;
  return new Ln(i, [
    dn.data.of({ autocomplete: A$(n) }),
    n.autoCloseTags !== !1 ? _$ : [],
    x$().support,
    km().support
  ]);
}
const Jo = /* @__PURE__ */ new Set(/* @__PURE__ */ "area base br col command embed frame hr img input keygen link meta param source track wbr menuitem".split(" "));
function W$(n, e, t) {
  for (var i; ; ) {
    if (((i = e.lastChild) === null || i === void 0 ? void 0 : i.name) != "CloseTag")
      return !1;
    let r = e.parent;
    if (!r || Ct(n, r) != t)
      return !0;
    e = r;
  }
}
const _$ = /* @__PURE__ */ Z.inputHandler.of((n, e, t, i, r) => {
  if (n.composing || n.state.readOnly || e != t || i != ">" && i != "/" || !dn.isActiveAt(n.state, e, -1))
    return !1;
  let s = r(), { state: l } = s, o = l.changeByRange((a) => {
    var h;
    let O = l.doc.sliceString(a.from - 1, a.to) == i, { head: c } = a, f = se(l).resolveInner(c, -1), u;
    if (O && i == ">" && f.name == "EndTag") {
      let d = f.parent;
      if ((u = Ct(l.doc, d.parent, c)) && !Jo.has(u) && !W$(l.doc, d.parent, u)) {
        let p = c + (l.doc.sliceString(c, c + 1) === ">" ? 1 : 0), m = `</${u}>`;
        return { range: a, changes: { from: c, to: p, insert: m } };
      }
    } else if (O && i == "/" && f.name == "IncompleteCloseTag") {
      let d = f.parent;
      if (f.from == c - 2 && ((h = d.lastChild) === null || h === void 0 ? void 0 : h.name) != "CloseTag" && (u = Ct(l.doc, d, c)) && !Jo.has(u)) {
        let p = c + (l.doc.sliceString(c, c + 1) === ">" ? 1 : 0), m = `${u}>`;
        return {
          range: Q.cursor(c + m.length, -1),
          changes: { from: c, to: p, insert: m }
        };
      }
    }
    return { range: a };
  });
  return o.changes.empty ? !1 : (n.dispatch([
    s,
    l.update(o, {
      userEvent: "input.complete",
      scrollIntoView: !0
    })
  ]), !0);
}), M$ = 1, q$ = 2, Y$ = 3, z$ = 183, E$ = 4, U$ = 184, V$ = 5, G$ = 185, D$ = 6;
function L$(n) {
  return n >= 65 && n <= 90 || n >= 97 && n <= 122;
}
const B$ = /* @__PURE__ */ new ce((n) => {
  let e = n.pos;
  for (; ; ) {
    let { next: t } = n;
    if (t < 0)
      break;
    if (t == 123) {
      let i = n.peek(1);
      if (i == 123) {
        if (n.pos > e)
          break;
        n.acceptToken(M$, 2);
        return;
      } else if (i == 37) {
        if (n.pos > e)
          break;
        let r = 2, s = 2;
        for (; ; ) {
          let l = n.peek(r);
          if (l == 32 || l == 10)
            ++r;
          else if (l == 35)
            for (++r; ; ) {
              let o = n.peek(r);
              if (o < 0 || o == 10)
                break;
              r++;
            }
          else if (l == 45 && s == 2)
            s = ++r;
          else {
            let o = l == 101 && n.peek(r + 1) == 110 && n.peek(r + 2) == 100;
            n.acceptToken(o ? Y$ : q$, s);
            return;
          }
        }
      }
    }
    if (n.advance(), t == 10)
      break;
  }
  n.pos > e && n.acceptToken(z$);
});
function rc(n, e, t) {
  return new ce((i) => {
    let r = i.pos;
    for (; ; ) {
      let { next: s } = i;
      if (s == 123 && i.peek(1) == 37) {
        let l = 2;
        for (; ; l++) {
          let a = i.peek(l);
          if (a != 32 && a != 10)
            break;
        }
        let o = "";
        for (; ; l++) {
          let a = i.peek(l);
          if (!L$(a))
            break;
          o += String.fromCharCode(a);
        }
        if (o == n) {
          if (i.pos > r)
            break;
          i.acceptToken(t, 2);
          break;
        }
      } else if (s < 0)
        break;
      if (i.advance(), s == 10)
        break;
    }
    i.pos > r && i.acceptToken(e);
  });
}
const I$ = /* @__PURE__ */ rc("endcomment", G$, V$), N$ = /* @__PURE__ */ rc("endraw", U$, E$), F$ = /* @__PURE__ */ new ce((n) => {
  if (n.next == 35) {
    for (n.advance(); !(n.next == 10 || n.next < 0 || (n.next == 37 || n.next == 125) && n.peek(1) == 125); )
      n.advance();
    n.acceptToken(D$);
  }
}), H$ = { __proto__: null, contains: 34, or: 38, and: 38, true: 52, false: 52, empty: 54, forloop: 57, tablerowloop: 59, continue: 61, in: 135, with: 199, for: 201, as: 203, if: 239, endif: 243, unless: 249, endunless: 253, elsif: 257, else: 261, case: 267, endcase: 271, when: 275, endfor: 283, tablerow: 289, endtablerow: 293, break: 297, cycle: 303, echo: 307, render: 311, include: 315, assign: 319, capture: 325, endcapture: 329, increment: 333, decrement: 337 }, K$ = { __proto__: null, if: 90, endif: 94, elsif: 98, else: 102, unless: 108, endunless: 112, case: 118, endcase: 122, when: 126, for: 132, endfor: 140, tablerow: 146, endtablerow: 150, break: 154, continue: 158, cycle: 162, comment: 168, endcomment: 174, raw: 180, endraw: 186, echo: 190, render: 194, include: 206, assign: 210, capture: 216, endcapture: 220, increment: 224, decrement: 228, liquid: 232 }, J$ = /* @__PURE__ */ Rt.deserialize({
  version: 14,
  states: "MfQYOPOOOOOP'#F}'#F}OhOaO'#CdOyQhO'#CfO!hQxO'#DUO$ROPO'#DXO$aOPO'#DbO$oOPO'#DgO$}OPO'#DnO%]OPO'#DuO%kOSO'#EQO%pOQO'#EWO%uOPO'#EjO&TQxO'#F{OOOP'#Gj'#GjOOOP'#G`'#G`OOOP'#F|'#F|QYOPOOOOOP-E9{-E9{OOQW'#Cg'#CgO&nQ!jO,59QO&uQ!jO'#GaOyQhO'#CtOOQW'#Ge'#GeOOQW'#Gf'#GfOOQW'#Gg'#GgOOQW'#Ga'#GaOOOP,59p,59pO*SQhO,59pOyQhO,59tOyQhO,59xO*^QhO,59zOyQhO,59}OyQhO,5:SOyQhO,5:WO!cQhO,5:ZO!cQhO,5:bO*cQhO,5:fO*hQhO,5:hO*mQhO,5:jO*rQhO,5:mO*wQhO,5:sOyQhO,5:xOyQhO,5:zOyQhO,5;QOyQhO,5;SOyQhO,5;VOyQhO,5;ZOyQhO,5;]O,WQhO,5;_O,_OPO'#CdOOOP,59s,59sO$ROPO,59sO,mQxO'#F{OOOP,59|,59|O$aOPO,59|O,uQxO'#F{OOOP,5:R,5:RO$oOPO,5:RO,}QxO'#F{OOOP,5:Y,5:YO$}OPO,5:YO-VQxO'#F{OOOP,5:a,5:aO%]OPO,5:aO-_QxO'#F{OOOS'#GT'#GTO-gOSO'#ETO-oOSO,5:lOOOQ'#GU'#GUO-tOQO'#EZO-|OQO,5:rOOOP,5;U,5;UO%uOPO,5;UO.RQxO'#F{O.ZQhO,5<gOOOP-E9z-E9zO.`Q#|O,59SOyQhO,59VOyQhO,59WOyQhO,59WO.eQhO'#C}OOQW'#GO'#GOO.jQhO1G.lOOOP1G.l1G.lOyQhO,59WOyQhO,59[O/TQ!jO,59`O/[Q!jO'#CgO1kQ!jO'#GiO3gQhO'#DROOQW'#Gi'#GiO3lQhO'#GhO5fQhO1G/[OOOP1G/[1G/[O5fQhO1G/[O5nQ!jO1G/`O5uQ!jO1G/dOOOP1G/f1G/fO5|Q!jO1G/iO6TQ!jO1G/nO6[Q!jO1G/rO6fQhO1G/uO6fQhO1G/|OOOP1G0Q1G0QOOOP1G0S1G0SO6kQhO1G0UOOOS1G0X1G0XOOOQ1G0_1G0_O6vQ!jO1G0dO6}Q!jO1G0fO7_Q!jO1G0lO7fQ!jO1G0nO7mQ!jO1G0qO7tQ!jO1G0uO7{Q!jO1G0wOOQW'#Gm'#GmOOQW'#Gp'#GpOyQhO'#EvO8SQhO'#EuOOQW'#Gr'#GrOyQhO'#E{O8ZQhO'#EzOOQW'#Gt'#GtOyQhO'#FPOOQW'#Gu'#GuOOQW'#FR'#FROOQW'#Gv'#GvOyQhO'#FUO8bQhO'#FTOOQW'#Gx'#GxOyQhO'#FYO!cQhO'#F]O8iQhO'#F[OOQW'#Gz'#GzO!cQhO'#FaO8pQhO'#F`OOQW'#G|'#G|OOQW'#Fe'#FeOOQW'#Fg'#FgOOQW'#G}'#G}O8wQhO'#FhOOQW'#HO'#HOOyQhO'#FjOOQW'#HP'#HPOyQhO'#FlOOQW'#HQ'#HQOyQhO'#FnOOQW'#HR'#HROyQhO'#FpOOQW'#HS'#HSOyQhO'#FsO8|QhO'#FrOOQW'#HU'#HUOyQhO'#FwOOQW'#HV'#HVOyQhO'#FyOOQW'#Go'#GoOOQW'#GW'#GWO9TQhO1G0yOOOP1G0y1G0yOOOP1G/_1G/_O9[QhO,59vOOOP1G/h1G/hO9aQhO,5:POOOP1G/m1G/mO9fQhO,5:UOOOP1G/t1G/tO9kQhO,5:_OOOP1G/{1G/{O9pQhO,5:dOOOS-E:R-E:ROOOP1G0W1G0WO9uQxO'#EUOOOQ-E:S-E:SOOOP1G0^1G0^O9zQxO'#E[OOOP1G0p1G0pO:PQhO,5;XOOOP1G2R1G2ROOQW1G.n1G.nO:UQ!jO1G.qO<uQ!jO1G.rO<|Q!jO1G.rOOQW'#DP'#DPO?[QhO,59iOOQW-E9|-E9|OOOP7+$W7+$WOAUQ!jO1G.rOA]Q!jO1G.vOyQhO1G.zOyQhO,59mO)eQhO'#GPOCkQhO,5=SOOOP7+$v7+$vOEeQhO7+$vOOOP7+$z7+$zOOOP7+%O7+%OOOOP7+%T7+%TOOOP7+%Y7+%YOyQhO'#GQOEmQhO7+%^OOOP7+%^7+%^OOQW'#Gk'#GkOyQhO7+%aOyQhO7+%hOEuQhO'#GSOEzQhO7+%pOOOP7+%p7+%pOFSQhO7+%pOFXQhO7+&OOOOP7+&O7+&OOOQW'#Gl'#GlO!cQhO'#EbOyQhO'#EbOOQW'#GV'#GVOFaQhO7+&QOOOP7+&Q7+&QOOOP7+&W7+&WOFoQhO7+&YOOOP7+&Y7+&YOOOP7+&]7+&]OOOP7+&a7+&aOOOP7+&c7+&cOFwQ!jO,5;bOOQW'#Gq'#GqOOQW'#Ex'#ExOOQW,5;a,5;aO8SQhO,5;aOHWQ!jO,5;gOOQW'#Gs'#GsOOQW'#E}'#E}OOQW,5;f,5;fO8ZQhO,5;fOIgQ!jO,5;kOKYQ!jO,5;pOOQW'#Gw'#GwOOQW'#FW'#FWOOQW,5;o,5;oO8bQhO,5;oOLiQ!jO,5;tO6fQhO,5;wOOQW'#Gy'#GyOOQW'#F^'#F^OOQW,5;v,5;vO8iQhO,5;vO6fQhO,5;{OOQW'#G{'#G{OOQW'#Fc'#FcOOQW,5;z,5;zO8pQhO,5;zON_QhO,5<SO!!UQ!jO,5<UO!#wQ!jO,5<WO!%pQ!jO,5<YO!'cQ!jO,5<[O!)UQ!jO,5<_OOQW'#HT'#HTOOQW'#Fu'#FuOOQW,5<^,5<^O8|QhO,5<^O!*eQ!jO,5<cO!,WQ!jO,5<eOOQW-E:U-E:UOOOP7+&e7+&eOOOP1G/b1G/bOOOP1G/k1G/kOOOP1G/p1G/pOOOP1G/y1G/yOOOP1G0O1G0OO!-yQhO,5:pO!.OQhO,5:vOOOP1G0s1G0sOOQW7+$]7+$]O)eQhO1G/TO!.TQ!jO7+$fO!.[Q!jO1G/XOOQW,5<k,5<kOOQW-E9}-E9}OOOP<<Hb<<HbO!0WQ!jO,5<lOOQW-E:O-E:OOOOP<<Hx<<HxO!1|Q!jO<<H{O!2WQ!jO<<ISOOQW,5<n,5<nOOQW-E:Q-E:QOOOP<<I[<<I[O!2bQhO<<I[OOOP<<Ij<<IjO!2jQhO,5:|O!2oQ!jO,5:|OOQW-E:T-E:TOOOP<<Il<<IlOOOP<<It<<ItOOQW1G0{1G0{OOQW1G1Q1G1QOOQW1G1Z1G1ZO!4kQhO1G1`OyQhO1G1cOOQW1G1b1G1bOyQhO1G1gOOQW1G1f1G1fO!6_QhO1G1nO!8RQhO1G1nO!8WQhO1G1pOOQW'#GX'#GXO!9zQhO1G1rO!;qQhO1G1vOOQW1G1x1G1xOOOP1G0[1G0[OOOP1G0b1G0bOOQW7+$o7+$oOOQW<<HQ<<HQOOQW'#DS'#DSO!=eQhO'#DrOOQW'#GR'#GRO!?OQhOAN>gOOOPAN>gAN>gO!?WQhOAN>nOOOPAN>nAN>nO!?`QhOAN>vOOOPAN>vAN>vOyQhO1G0hOOQW'#Gn'#GnO!cQhO1G0hO!?hQ!jO7+&}O!@zQ!jO7+'RO!B^QhO7+'YOOQW-E:V-E:VOyQhO,5:^OOQW-E:P-E:POOOPG24RG24ROOOPG24YG24YOOOPG24bG24bO!DQQ!jO7+&SOOQW7+&S7+&SO!EyQhO<<JiO!GZQhO<<JmO!HkQhO<<JtO!J_Q!jO1G/x",
  stateData: "!Kw~O%ROSUOS~OPROQSOR]O$}PO~O$}POPWXQWXRWX$|WX~OgfOjjOkjOlgOmhOniOojOpjO%UcO~OylOzkO}mO!RnO!ToO!WpO!]qO!arO!dsO!ktO!ouO!qvO!swO!vxO!|yO#RzO#T{O#Z|O#]}O#`!OO#d!PO#f!QO#h!RO~OPROQSOR!VO$}PO~OPROQSOR!YO$}PO~OPROQSOR!]O$}PO~OPROQSOR!`O$}PO~OPROQSOR!cO$}PO~O%P!dO~O%O!gO~OPROQSOR!lO$}PO~Oy!mO~O]!oOa!wOb!qOc!rOr!sO%W!pO~OX!vO~P&YOe!xOX%TX]%TXa%TXb%TXc%TXr%TX%W%TXi%TXw%TXz%TX#V%TX#W%TX%V%TXn%TX#k%TX#m%TX#p%TX#t%TX#v%TX#y%TX#}%TX$U%TX$Y%TX$]%TX$_%TX$a%TX$c%TX$e%TX$h%TX$l%TX$n%TX#r%TX#{%TX$j%TXf%TX%U%TX#X%TX$R%TX$W%TX~OgfOjjOkjOlgOmhOniOojOpjO%U!zO~Or!sOz#QO~P)eOz#UO~Oz#[O~Oz#]O~Oo#^O~Oz#_O~Oz#`O~OniO#W#hO#k#iO#p#lO#t#oO#v#qO#y#sO#}#vO$U#zO$Y#}O$]$QO$_$SO$a$UO$c$WO$e$YO$h$[O$l$_O$n$aO~Oz$fO~P*|O$}POPWXQWXRWX~Oy!mO!P$hO~Oy!mO!Y$jO~Oy!mO!_$lO~Oy!mO!h$nO~Oy!mO!m$pO~O%P!dOT!wX~OT$sO~O%O!gOS!}X~OS$vO~Oy!mO#b$xO~Oz$yO~O^$zO~O%U%OO~OX%ROr!sO~O]!oOa!wOb!qOc!rO%W!pO~Oi%UO~P.rO]ZXaZXbZXcZXeZXrZXtvXwZXzZX%WZXXZXnZX#WZX#kZX#pZX#tZX#vZX#yZX#}ZX$UZX$YZX$]ZX$_ZX$aZX$cZX$eZX$hZX$lZX$nZX#mZX#rZX#{ZX$RZX$WZX$jZX~Or%]Xw%]Xz%]XX%]Xn%]X#W%]X#k%]X#p%]X#t%]X#v%]X#y%]X#}%]X$U%]X$Y%]X$]%]X$_%]X$a%]X$c%]X$e%]X$h%]X$l%]X$n%]X#m%]X#r%]X#{%]X$R%]X$W%]X$j%]X~P.rOt%VO~Ow%WOr%[Xz%[XX%[Xn%[X#W%[X#k%[X#p%[X#t%[X#v%[X#y%[X#}%[X$U%[X$Y%[X$]%[X$_%[X$a%[X$c%[X$e%[X$h%[X$l%[X$n%[X#m%[X#r%[X#{%[X$R%[X$W%[X$j%[X~Or!sOz%YO~Oz%[O~P.rOz%]O~P.rOz%^O~P.rOz%_O~P.rOw%`Oz%bO~P.rO!e%cO~Ot%iOw%fOz%hO~Oz%kO~P&YOw%mOz%qO#V%lO#W#hO~P.rOz%rO~P.rOz%tO~P&YOz%uO~P.rOz%vO~P.rOz%wO~P.rO#m%yO~P*|O#r&OO~P*|O#{&UO~P*|O$R&[O~P*|O$W&aO~P*|Oo&eO~O$j&kO~P*|Oz&rO~P*|Oz&sO~Oz&tO~Oz&uO~Oz&vO~Oz&wO~O!y&xO~O#P&yO~Oz&zO~O%V&{O~P.rO]!oO%W!pOX`ia`ic`ir`ii`iw`iz`i#V`i#W`i%V`in`i#k`i#m`i#p`i#t`i#v`i#y`i#}`i$U`i$Y`i$]`i$_`i$a`i$c`i$e`i$h`i$l`i$n`i#r`i#{`i$j`if`i%U`i#X`i$R`i$W`i~Ob`i~P:]OX`ir`ii`iw`iz`i#V`i#W`i%V`in`i#k`i#m`i#p`i#t`i#v`i#y`i#}`i$U`i$Y`i$]`i$_`i$a`i$c`i$e`i$h`i$l`i$n`i#r`i#{`i$j`if`i%U`i#X`i$R`i$W`i~P.rOt&|OXqarqazqanqa#Wqa#kqa#pqa#tqa#vqa#yqa#}qa$Uqa$Yqa$]qa$_qa$aqa$cqa$eqa$hqa$lqa$nqa#mqa#rqa#{qa$Rqa$Wqa$jqa~Ob!qO~P:]OXdirdiidiwdizdi#Vdi#Wdi%Vdindi#kdi#mdi#pdi#tdi#vdi#ydi#}di$Udi$Ydi$]di$_di$adi$cdi$edi$hdi$ldi$ndi#rdi#{di$jdifdi%Udi#Xdi$Rdi$Wdi~P.rOw%WOr%[az%[aX%[an%[a#W%[a#k%[a#p%[a#t%[a#v%[a#y%[a#}%[a$U%[a$Y%[a$]%[a$_%[a$a%[a$c%[a$e%[a$h%[a$l%[a$n%[a#m%[a#r%[a#{%[a$R%[a$W%[a$j%[a~Or!sOz'RO~Ow%`Oz'UO~Oo'XO~Ow%fOz'ZO~Oo'[O~Or!sOz']O~Ow%mOz'aO#V%lO#W#hO~Or!sOz'bO~On#ja#W#ja#k#ja#m#ja#p#ja#t#ja#v#ja#y#ja#}#ja$U#ja$Y#ja$]#ja$_#ja$a#ja$c#ja$e#ja$h#ja$l#ja$n#ja~P.rOn#oa#W#oa#k#oa#p#oa#r#oa#t#oa#v#oa#y#oa#}#oa$U#oa$Y#oa$]#oa$_#oa$a#oa$c#oa$e#oa$h#oa$l#oa$n#oa~P.rOn#saz#sa#W#sa#k#sa#p#sa#t#sa#v#sa#y#sa#}#sa$U#sa$Y#sa$]#sa$_#sa$a#sa$c#sa$e#sa$h#sa$l#sa$n#sa#m#sa#r#sa#{#sa$R#sa$W#sa$j#sa~P.rOn#xa#W#xa#k#xa#p#xa#t#xa#v#xa#y#xa#{#xa#}#xa$U#xa$Y#xa$]#xa$_#xa$a#xa$c#xa$e#xa$h#xa$l#xa$n#xa~P.rOw%`On#|az#|a#W#|a#k#|a#p#|a#t#|a#v#|a#y#|a#}#|a$U#|a$Y#|a$]#|a$_#|a$a#|a$c#|a$e#|a$h#|a$l#|a$n#|a#m#|a#r#|a#{#|a$R#|a$W#|a$j#|a~P.rOt'lOw%fOn$[az$[a#W$[a#k$[a#p$[a#t$[a#v$[a#y$[a#}$[a$U$[a$Y$[a$]$[a$_$[a$a$[a$c$[a$e$[a$h$[a$l$[a$n$[a#m$[a#r$[a#{$[a$R$[a$W$[a$j$[a~On$^az$^a#W$^a#k$^a#p$^a#t$^a#v$^a#y$^a#}$^a$U$^a$Y$^a$]$^a$_$^a$a$^a$c$^a$e$^a$h$^a$l$^a$n$^a#m$^a#r$^a#{$^a$R$^a$W$^a$j$^a~P&YOw%mO#V%lO#W#hOn$`az$`a#k$`a#p$`a#t$`a#v$`a#y$`a#}$`a$U$`a$Y$`a$]$`a$_$`a$a$`a$c$`a$e$`a$h$`a$l$`a$n$`a#m$`a#r$`a#{$`a$R$`a$W$`a$j$`a~P.rOn$baz$ba#W$ba#k$ba#p$ba#t$ba#v$ba#y$ba#}$ba$U$ba$Y$ba$]$ba$_$ba$a$ba$c$ba$e$ba$h$ba$l$ba$n$ba#m$ba#r$ba#{$ba$R$ba$W$ba$j$ba~P.rOn$daz$da#W$da#k$da#p$da#t$da#v$da#y$da#}$da$U$da$Y$da$]$da$_$da$a$da$c$da$e$da$h$da$l$da$n$da#m$da#r$da#{$da$R$da$W$da$j$da~P&YOn$ga#W$ga#k$ga#p$ga#t$ga#v$ga#y$ga#}$ga$U$ga$Y$ga$]$ga$_$ga$a$ga$c$ga$e$ga$h$ga$j$ga$l$ga$n$ga~P.rOn$kaz$ka#W$ka#k$ka#p$ka#t$ka#v$ka#y$ka#}$ka$U$ka$Y$ka$]$ka$_$ka$a$ka$c$ka$e$ka$h$ka$l$ka$n$ka#m$ka#r$ka#{$ka$R$ka$W$ka$j$ka~P.rOn$maz$ma#W$ma#k$ma#p$ma#t$ma#v$ma#y$ma#}$ma$U$ma$Y$ma$]$ma$_$ma$a$ma$c$ma$e$ma$h$ma$l$ma$n$ma#m$ma#r$ma#{$ma$R$ma$W$ma$j$ma~P.rOz'rO~Oz'sO~Of'uO~P.rOruiwuizuiXuinui#Wui#kui#pui#tui#vui#yui#}ui$Uui$Yui$]ui$_ui$aui$cui$eui$hui$lui$nui#mui#rui#{ui$Rui$Wui$jui~P.rOw$taz$tan$ta#W$ta#k$ta#p$ta#t$ta#v$ta#y$ta#}$ta$U$ta$Y$ta$]$ta$_$ta$a$ta$c$ta$e$ta$h$ta$l$ta$n$ta#m$ta#r$ta#{$ta$R$ta$W$ta$j$ta~P.rOz'zO%U'vO~P.rOz'|O%U'vO~P.rOw%fOz(OO~Ot(PO~O#X(QOw#Uaz#Ua#V#Ua#W#Uan#Ua#k#Ua#p#Ua#t#Ua#v#Ua#y#Ua#}#Ua$U#Ua$Y#Ua$]#Ua$_#Ua$a#Ua$c#Ua$e#Ua$h#Ua$l#Ua$n#Ua#m#Ua#r#Ua#{#Ua$R#Ua$W#Ua$j#Ua~P.rOw%`On#|iz#|i#W#|i#k#|i#p#|i#t#|i#v#|i#y#|i#}#|i$U#|i$Y#|i$]#|i$_#|i$a#|i$c#|i$e#|i$h#|i$l#|i$n#|i#m#|i#r#|i#{#|i$R#|i$W#|i$j#|i~Ow%fOn$[iz$[i#W$[i#k$[i#p$[i#t$[i#v$[i#y$[i#}$[i$U$[i$Y$[i$]$[i$_$[i$a$[i$c$[i$e$[i$h$[i$l$[i$n$[i#m$[i#r$[i#{$[i$R$[i$W$[i$j$[i~Oo(UO~Or!sOn$^iz$^i#W$^i#k$^i#p$^i#t$^i#v$^i#y$^i#}$^i$U$^i$Y$^i$]$^i$_$^i$a$^i$c$^i$e$^i$h$^i$l$^i$n$^i#m$^i#r$^i#{$^i$R$^i$W$^i$j$^i~Ow%mO#V%lO#W#hOn$`iz$`i#k$`i#p$`i#t$`i#v$`i#y$`i#}$`i$U$`i$Y$`i$]$`i$_$`i$a$`i$c$`i$e$`i$h$`i$l$`i$n$`i#m$`i#r$`i#{$`i$R$`i$W$`i$j$`i~Or!sOn$diz$di#W$di#k$di#p$di#t$di#v$di#y$di#}$di$U$di$Y$di$]$di$_$di$a$di$c$di$e$di$h$di$l$di$n$di#m$di#r$di#{$di$R$di$W$di$j$di~Ot(WOz!fX%U!fXn!fX#W!fX#k!fX#p!fX#t!fX#v!fX#y!fX#}!fX$R!fX$U!fX$Y!fX$]!fX$_!fX$a!fX$c!fX$e!fX$h!fX$l!fX$n!fX$W!fX~Oz(YO%U'vO~Oz(ZO%U'vO~Ow%fOz([O~O%U'vOn$Pq#W$Pq#k$Pq#p$Pq#t$Pq#v$Pq#y$Pq#}$Pq$R$Pq$U$Pq$Y$Pq$]$Pq$_$Pq$a$Pq$c$Pq$e$Pq$h$Pq$l$Pq$n$Pq~P.rO%U'vOn$Tq#W$Tq#k$Tq#p$Tq#t$Tq#v$Tq#y$Tq#}$Tq$U$Tq$W$Tq$Y$Tq$]$Tq$_$Tq$a$Tq$c$Tq$e$Tq$h$Tq$l$Tq$n$Tq~P.rOw%fOn$[qz$[q#W$[q#k$[q#p$[q#t$[q#v$[q#y$[q#}$[q$U$[q$Y$[q$]$[q$_$[q$a$[q$c$[q$e$[q$h$[q$l$[q$n$[q#m$[q#r$[q#{$[q$R$[q$W$[q$j$[q~Ow#Uqz#Uq#V#Uq#W#Uqn#Uq#k#Uq#p#Uq#t#Uq#v#Uq#y#Uq#}#Uq$U#Uq$Y#Uq$]#Uq$_#Uq$a#Uq$c#Uq$e#Uq$h#Uq$l#Uq$n#Uq#m#Uq#r#Uq#{#Uq$R#Uq$W#Uq$j#Uq~P.rO%U'vOn$Py#W$Py#k$Py#p$Py#t$Py#v$Py#y$Py#}$Py$R$Py$U$Py$Y$Py$]$Py$_$Py$a$Py$c$Py$e$Py$h$Py$l$Py$n$Py~O%U'vOn$Ty#W$Ty#k$Ty#p$Ty#t$Ty#v$Ty#y$Ty#}$Ty$U$Ty$W$Ty$Y$Ty$]$Ty$_$Ty$a$Ty$c$Ty$e$Ty$h$Ty$l$Ty$n$Ty~Ow%fOn$[yz$[y#W$[y#k$[y#p$[y#t$[y#v$[y#y$[y#}$[y$U$[y$Y$[y$]$[y$_$[y$a$[y$c$[y$e$[y$h$[y$l$[y$n$[y#m$[y#r$[y#{$[y$R$[y$W$[y$j$[y~Oz!fi%U!fin!fi#W!fi#k!fi#p!fi#t!fi#v!fi#y!fi#}!fi$R!fi$U!fi$Y!fi$]!fi$_!fi$a!fi$c!fi$e!fi$h!fi$l!fi$n!fi$W!fi~P.rO",
  goto: "Ah%zPPPPPPPP%{P%{&]'oPP'o'oPPP'oPPP'oPPPPPPPP(oP)PP)S)XP)hPP)h)xP*YP)hP)hP)h*`P*pP)h*vP+WP)hP)h+^PP+n+xP)h,OP,`P)hP)hP)hP)h,fP,v,yP)h,|P-^-aP)hP)hP-dPPP)hP)hP)h-lP-|P)hP)hP)hP.S.dP.tP.S.zP/[P.SP.SP.S/bP/rP.SP.S/x0YP.S0`P0pP.SP.S.SP.SP.SP.SP.SP.S0vP1WP.SP.SP)h1^1|2d3S3Y3d3v4Y4`4f4l5[PPPPPP5b5rPPP'o'o8h9x:O%{:V:c:i;P;S;d;t;x<Y<^<n=O=`=d=t=x>Y>^>n?O?`?p@Q@b@r@vAWm_OTUVWX[a!U!X![!_!b!k!zeRflmnpqrz{|}!O!P!Q!p!q!r!w!x#j#m#p#t#w$T$V$X$Z$]$`$b%U%V%W%`%d%e%n&|'g'i(P(WQ#YsQ#ZtQ&Z#xQ&`#{Q'^%mR(^(R!{jRflmnpqrz{|}!O!P!Q!p!q!r!w!x#j#m#p#t#w$T$V$X$Z$]$`$b%U%V%W%`%d%e%n&|'g'i(P(Wm!tdl!u#P#R#a#d%Z%j%s&f&i'm'pR%P!sV!}l%W&|U!|l%W&|a'w'V'W'y'{(S(T(_(`m^OTUVWX[a!U!X![!_!b!kmTOTUVWX[a!U!X![!_!b!kQ!TTR$g!UmUOTUVWX[a!U!X![!_!b!kQ!WUR$i!XmVOTUVWX[a!U!X![!_!b!kQ!ZVR$k![mWOTUVWX[a!U!X![!_!b!ka'x'V'W'y'{(S(T(_(`Q!^WR$m!_mXOTUVWX[a!U!X![!_!b!kQ!aXR$o!bmYOTUVWX[a!U!X![!_!b!kR!fYR$r!fmZOTUVWX[a!U!X![!_!b!kR!iZR$u!iS%o#b%pT'n&g'om[OTUVWX[a!U!X![!_!b!kQ!j[R$w!km$c!R#k#n#u#y#|$^$e%|&R&X&_&d&nm#k!R#k#n#u#y#|$^$e%|&R&X&_&d&nQ%{#kR'c%|m#n!R#k#n#u#y#|$^$e%|&R&X&_&d&nQ&Q#nR'd&Rm#u!R#k#n#u#y#|$^$e%|&R&X&_&d&nQ&W#uR'e&Xm#y!R#k#n#u#y#|$^$e%|&R&X&_&d&nQ&^#yR'h&_m#|!R#k#n#u#y#|$^$e%|&R&X&_&d&nQ&c#|R'j&dm$^!R#k#n#u#y#|$^$e%|&R&X&_&d&nQ&m$^R'q&nQaOQ!UTQ!XUQ![VQ!_WQ!bXQ!k[_!na!U!X![!_!b!kSQOaSbQ!Si!STUVWX[!U!X![!_!b!kQ!udQ#Pl^%Q!u#P%Z%j%s'm'pQ%Z#RQ%j#aQ%s#dQ'm&fR'p&iQ%X#OR'Q%XQ%a#XS'T%a'fR'f&YQ'y'VQ'{'WW(X'y'{(_(`Q(_(SR(`(TQ%g#^W'Y%g'k'}(aQ'k&eQ'}'[R(a(UQ!eYR$q!eQ!hZR$t!hQ%p#bR'`%pQ$e!RQ%|#kQ&R#nQ&X#uQ&_#yQ&d#|Q&n$^_&q$e%|&R&X&_&d&nQ'o&gR(V'om`OTUVWX[a!U!X![!_!b!kQdRQ!yfU!{l%W&|Q#SmQ#TnQ#VpQ#WqQ#XrQ#azQ#b{Q#c|Q#d}Q#e!OQ#f!PQ#g!QQ${!pQ$|!qQ$}!rQ%S!wQ%T!xQ%x#jQ%}#mQ&S#pQ&T#tQ&Y#wQ&f$TQ&g$VQ&h$XQ&i$ZQ&j$]Q&o$`Q&p$bQ&}%UQ'O%VQ'S%`Q'V%dQ'W%eQ'_%nQ(S'gQ(T'iQ(](PR(b(W!zjRflmnpqrz{|}!O!P!Q!p!q!r!w!x#j#m#p#t#w$T$V$X$Z$]$`$b%U%V%W%`%d%e%n&|'g'i(P(Wm$P!R#k#n#u#y#|$^$e%|&R&X&_&d&nQ#RlR't&|S#Ol&|R'P%WQ%d#YQ%e#ZQ'g&ZR'i&`X%n#b%p&g'ol#x!R#k#n#u#y#|$^$e%|&R&X&_&d&nX%n#b%p&g'oR(R'_m$d!R#k#n#u#y#|$^$e%|&R&X&_&d&nm#j!R#k#n#u#y#|$^$e%|&R&X&_&d&nT%z#k%|m#m!R#k#n#u#y#|$^$e%|&R&X&_&d&nT&P#n&Rm#p!R#k#n#u#y#|$^$e%|&R&X&_&d&nm#r!R#k#n#u#y#|$^$e%|&R&X&_&d&nm#t!R#k#n#u#y#|$^$e%|&R&X&_&d&nT&V#u&Xm#w!R#k#n#u#y#|$^$e%|&R&X&_&d&nT&]#y&_m#{!R#k#n#u#y#|$^$e%|&R&X&_&d&nT&b#|&dm$O!R#k#n#u#y#|$^$e%|&R&X&_&d&nm$R!R#k#n#u#y#|$^$e%|&R&X&_&d&nm$T!R#k#n#u#y#|$^$e%|&R&X&_&d&nm$V!R#k#n#u#y#|$^$e%|&R&X&_&d&nm$X!R#k#n#u#y#|$^$e%|&R&X&_&d&nm$Z!R#k#n#u#y#|$^$e%|&R&X&_&d&nm$]!R#k#n#u#y#|$^$e%|&R&X&_&d&nT&l$^&nm$`!R#k#n#u#y#|$^$e%|&R&X&_&d&nm$b!R#k#n#u#y#|$^$e%|&R&X&_&d&n",
  nodeNames: "⚠ {{ {% {% {% {% InlineComment Template Text }} Interpolation VariableName MemberExpression . PropertyName SubscriptExpression BinaryExpression contains CompareOp LogicOp AssignmentExpression AssignOp ) ( RangeExpression .. BooleanLiteral empty forloop tablerowloop continue StringLiteral NumberLiteral Filter | FilterName : NamedArgument ParameterName , Tag TagName %} IfDirective Tag if EndTag endif Tag elsif Tag else UnlessDirective Tag unless EndTag endunless CaseDirective Tag case EndTag endcase Tag when ForDirective Tag for in Parameter EndTag endfor TableDirective Tag tablerow EndTag endtablerow Tag break Tag continue Tag cycle Comment Tag comment CommentText EndTag endcomment RawDirective Tag raw RawText EndTag endraw Tag echo Tag render RenderParameter with for as Tag include Tag assign CaptureDirective Tag capture EndTag endcapture Tag increment Tag decrement Tag liquid IfDirective Tag if EndTag endif UnlessDirective Tag unless EndTag endunless Tag elsif Tag else CaseDirective Tag case EndTag endcase Tag when ForDirective Tag EndTag endfor TableDirective Tag tablerow EndTag endtablerow Tag break Tag Tag cycle Tag echo Tag render Tag include Tag assign CaptureDirective Tag capture EndTag endcapture Tag increment Tag decrement EndTag",
  maxTerm: 225,
  nodeProps: [
    ["closedBy", 1, "}}", -4, 2, 3, 4, 5, "%}", 23, ")"],
    ["openedBy", 9, "{{", 22, "(", 42, "{%"],
    ["group", -13, 11, 12, 15, 16, 20, 24, 26, 27, 28, 29, 30, 31, 32, "Expression"]
  ],
  skippedNodes: [0, 6],
  repeatNodeCount: 12,
  tokenData: ")e~RmXY!|YZ!|]^!|pq!|qr#_rs#juv$[wx$gxy%Syz%X{|%^|}&x}!O&}!O!P'Z!Q![&g![!]'k!^!_'p!_!`'x!`!a'p!c!}(Q!}#O(y#P#Q)O#R#S(Q#T#o(Q#p#q)T#q#r)Y%W;'S(Q;'S;:j(s<%lO(Q~#RS%R~XY!|YZ!|]^!|pq!|~#bP!_!`#e~#jOb~~#mUOY#jZr#jrs$Ps;'S#j;'S;=`$U<%lO#j~$UOo~~$XP;=`<%l#j~$_P#q#r$b~$gOz~~$jUOY$gZw$gwx$Px;'S$g;'S;=`$|<%lO$g~%PP;=`<%l$g~%XOg~~%^Of~P%aQ!O!P%g!Q![&gP%jP!Q![%mP%rRpP!Q![%m!g!h%{#X#Y%{P&OR{|&X}!O&X!Q![&_P&[P!Q![&_P&dPpP!Q![&_P&lSpP!O!P%g!Q![&g!g!h%{#X#Y%{~&}Ow~~'QRuv$[!O!P%g!Q![&g~'`Q]S!O!P'f!Q![%m~'kOi~~'pOt~~'uPb~!_!`#e~'}Pe~!_!`#e_(ZW^WyQ%UT}!O(Q!Q![(Q!c!}(Q#R#S(Q#T#o(Q%W;'S(Q;'S;:j(s<%lO(Q_(vP;=`<%l(Q~)OO%W~~)TO%V~~)YOr~~)]P#q#r)`~)eOX~",
  tokenizers: [B$, N$, I$, F$, 0, 1, 2, 3],
  topRules: { Template: [0, 7] },
  dynamicPrecedences: { 193: 1, 194: 1, 195: 1, 199: 1, 200: 1, 201: 1, 202: 1, 204: 1, 205: 1, 206: 1, 207: 1, 208: 1, 209: 1, 210: 1, 211: 1, 212: 1, 213: 1, 214: 1, 215: 1, 216: 1, 217: 1, 218: 1, 219: 1, 220: 1, 221: 1, 222: 1, 223: 1, 224: 1, 225: 1 },
  specialized: [{ term: 190, get: (n) => H$[n] || -1 }, { term: 41, get: (n) => K$[n] || -1 }],
  tokenPrec: 0
});
function zi(n, e) {
  return n.split(" ").map((t) => ({ label: t, type: e }));
}
const ea = /* @__PURE__ */ zi("abs append at_least at_most capitalize ceil compact concat date default divided_by downcase escape escape_once first floor join last lstrip map minus modulo newline_to_br plus prepend remove remove_first replace replace_first reverse round rstrip size slice sort sort_natural split strip strip_html strip_newlines sum times truncate truncatewords uniq upcase url_decode url_encode where", "function"), ta = /* @__PURE__ */ zi("cycle comment endcomment raw endraw echo increment decrement liquid if elsif else endif unless endunless case endcase for endfor tablerow endtablerow break continue assign capture endcapture render include", "keyword"), ia = /* @__PURE__ */ zi("empty forloop tablerowloop in with as", "keyword"), eQ = /* @__PURE__ */ zi("first index index0 last length rindex", "property"), tQ = /* @__PURE__ */ zi("col col0 col_first col_last first index index0 last length rindex rindex0 row", "property");
function iQ(n) {
  var e;
  let { state: t, pos: i } = n, r = se(t).resolveInner(i, -1).enterUnfinishedNodesBefore(i), s = ((e = r.childBefore(i)) === null || e === void 0 ? void 0 : e.name) || r.name;
  if (r.name == "FilterName")
    return { type: "filter", node: r };
  if (n.explicit && s == "|")
    return { type: "filter" };
  if (r.name == "TagName")
    return { type: "tag", node: r };
  if (n.explicit && s == "{%")
    return { type: "tag" };
  if (r.name == "PropertyName" && r.parent.name == "MemberExpression")
    return { type: "property", node: r, target: r.parent };
  if (r.name == "." && r.parent.name == "MemberExpression")
    return { type: "property", target: r.parent };
  if (r.name == "MemberExpression" && s == ".")
    return { type: "property", target: r };
  if (r.name == "VariableName")
    return { type: "expression", from: r.from };
  let l = n.matchBefore(/[\w\u00c0-\uffff]+$/);
  return l ? { type: "expression", from: l.from } : n.explicit && r.name != "CommentText" && r.name != "StringLiteral" && r.name != "NumberLiteral" && r.name != "InlineComment" ? { type: "expression" } : null;
}
function nQ(n, e, t, i) {
  let r = [];
  for (; ; ) {
    let s = e.getChild("Expression");
    if (!s)
      return [];
    if (s.name == "VariableName" || s.name == "forloop" || s.name == "tablerowloop") {
      let l = n.sliceDoc(s.from, s.to);
      if (l == "forloop")
        return r.length ? [] : eQ;
      if (l == "tablerowloop")
        return r.length ? [] : tQ;
      r.unshift(l);
      break;
    } else if (s.name == "MemberExpression") {
      let l = s.getChild("PropertyName");
      l && r.unshift(n.sliceDoc(l.from, l.to)), e = s;
    } else if (s.name == "SubscriptExpression") {
      let l = s.getChildren("Expression")[1];
      r.unshift(l?.name == "StringLiteral" ? n.sliceDoc(l.from + 1, l.to - 1) : "[]"), e = s;
    } else
      return [];
  }
  return i ? i(r, n, t) : [];
}
function rQ(n = {}) {
  let e = n.filters ? n.filters.concat(ea) : ea, t = n.tags ? n.tags.concat(ta) : ta, i = n.variables ? n.variables.concat(ia) : ia, { properties: r } = n;
  return (s) => {
    var l;
    let o = iQ(s);
    if (!o)
      return null;
    let a = (l = o.from) !== null && l !== void 0 ? l : o.node ? o.node.from : s.pos, h;
    return o.type == "filter" ? h = e : o.type == "tag" ? h = t : o.type == "expression" ? h = i : h = nQ(s.state, o.target, s, r), h.length ? { options: h, from: a, validFor: /^[\w\u00c0-\uffff]*$/ } : null;
  };
}
const sQ = /* @__PURE__ */ Z.inputHandler.of((n, e, t, i) => i != "%" || e != t || n.state.doc.sliceString(e - 1, t + 1) != "{}" ? !1 : (n.dispatch(n.state.changeByRange((r) => ({
  changes: { from: r.from, to: r.to, insert: "%%" },
  range: Q.cursor(r.from + 1)
})), {
  scrollIntoView: !0,
  userEvent: "input.type"
}), !0));
function Tr(n) {
  return (e) => {
    let t = n.test(e.textAfter);
    return e.lineIndent(e.node.from) + (t ? 0 : e.unit);
  };
}
const lQ = /* @__PURE__ */ Tt.define({
  name: "liquid",
  parser: /* @__PURE__ */ J$.configure({
    props: [
      /* @__PURE__ */ _i({
        "cycle comment endcomment raw endraw echo increment decrement liquid in with as": g.keyword,
        "empty forloop tablerowloop": g.atom,
        "if elsif else endif unless endunless case endcase for endfor tablerow endtablerow break continue": g.controlKeyword,
        "assign capture endcapture": g.definitionKeyword,
        contains: g.operatorKeyword,
        "render include": g.moduleKeyword,
        VariableName: g.variableName,
        TagName: g.keyword,
        FilterName: /* @__PURE__ */ g.function(g.variableName),
        PropertyName: g.propertyName,
        ParameterName: g.attributeName,
        CompareOp: g.compareOperator,
        AssignOp: g.definitionOperator,
        LogicOp: g.logicOperator,
        NumberLiteral: g.number,
        StringLiteral: g.string,
        BooleanLiteral: g.bool,
        InlineComment: g.lineComment,
        CommentText: g.blockComment,
        "{% %} {{ }}": g.brace,
        "[ ]": g.bracket,
        "( )": g.paren,
        ".": g.derefOperator,
        ", .. : |": g.punctuation
      }),
      /* @__PURE__ */ Mi.add({
        Tag: /* @__PURE__ */ _h({ closing: "%}" }),
        "UnlessDirective ForDirective TablerowDirective CaptureDirective": /* @__PURE__ */ Tr(/^\s*(\{%-?\s*)?end\w/),
        IfDirective: /* @__PURE__ */ Tr(/^\s*(\{%-?\s*)?(endif|else|elsif)\b/),
        CaseDirective: /* @__PURE__ */ Tr(/^\s*(\{%-?\s*)?(endcase|when)\b/)
      }),
      /* @__PURE__ */ Nn.add({
        "UnlessDirective ForDirective TablerowDirective CaptureDirective IfDirective CaseDirective RawDirective Comment"(n) {
          let e = n.firstChild, t = n.lastChild;
          return !e || e.name != "Tag" ? null : { from: e.to, to: t.name == "EndTag" ? t.from : n.to };
        }
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "#" },
    indentOnInput: /^\s*{%-?\s*(?:end|elsif|else|when|)$/
  }
}), ks = /* @__PURE__ */ nc();
function sc(n) {
  return lQ.configure({
    wrap: Xh((e) => e.type.isTop ? {
      parser: n.parser,
      overlay: (t) => t.name == "Text" || t.name == "RawText"
    } : null)
  }, "liquid");
}
const oQ = /* @__PURE__ */ sc(ks.language);
function aQ(n = {}) {
  let e = n.base || ks, t = e.language == ks.language ? oQ : sc(e.language);
  return new Ln(t, [
    e.support,
    t.data.of({ autocomplete: rQ(n) }),
    e.language.data.of({ closeBrackets: { brackets: ["{"] } }),
    sQ
  ]);
}
const hQ = Fn.define([
  { tag: [g.tagName, g.angleBracket], color: "var(--mail-code-tag)" },
  { tag: g.attributeName, color: "var(--mail-code-attribute)" },
  { tag: [g.attributeValue, g.string], color: "var(--mail-code-string)" },
  { tag: [g.keyword, g.controlKeyword, g.operatorKeyword, g.definitionKeyword], color: "var(--mail-code-keyword)", fontWeight: "600" },
  { tag: [g.brace, g.special(g.brace), g.processingInstruction], color: "var(--mail-code-delimiter)", fontWeight: "600" },
  { tag: [g.variableName, g.propertyName], color: "var(--mail-code-variable)" },
  { tag: [g.number, g.bool, g.null], color: "var(--mail-code-number)" },
  { tag: [g.comment, g.blockComment], color: "var(--p-text-muted-color)", fontStyle: "italic" },
  { tag: g.invalid, color: "var(--p-danger-500)" }
]), OQ = Z.theme({
  "&": { color: "var(--p-text-color)", backgroundColor: "var(--p-content-background)", fontSize: "12.5px", height: "100%" },
  ".cm-content": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", caretColor: "var(--p-text-color)", padding: "10px 0" },
  ".cm-scroller": { lineHeight: "1.6", overflow: "auto" },
  ".cm-gutters": { backgroundColor: "var(--p-content-background)", color: "var(--p-text-muted-color)", border: "none" },
  ".cm-lineNumbers .cm-gutterElement": { padding: "0 12px 0 10px", minWidth: "36px" },
  ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--p-text-color) 4%, transparent)" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--p-text-color)" },
  "&.cm-focused": { outline: "none" },
  "&.cm-focused .cm-cursor": { borderLeftColor: "var(--p-text-color)" },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "color-mix(in srgb, var(--p-primary-color) 24%, transparent) !important"
  },
  ".cm-matchingBracket": { backgroundColor: "color-mix(in srgb, var(--p-primary-color) 18%, transparent)", outline: "none" }
});
function cQ() {
  return aQ({ base: nc({ autoCloseTags: !1 }) });
}
function fQ(n, e) {
  return [
    Yu(),
    Uu(),
    Pu(),
    Xu(),
    Rd(),
    yd(hQ),
    OQ,
    cQ(),
    z.readOnly.of(e),
    Z.editable.of(!e),
    Z.contentAttributes.of({ "aria-label": n, "aria-multiline": "true", role: "textbox" })
  ];
}
function mQ(n) {
  return new Z({
    root: n.root,
    parent: n.parent,
    state: z.create({
      doc: n.doc,
      extensions: [
        ...fQ(n.label, n.readOnly),
        Ld(),
        Ys.of([...Fp, ...tp]),
        Z.updateListener.of((e) => {
          e.docChanged && n.onChange(e.state.doc.toString());
        })
      ]
    })
  });
}
function $Q(n, e) {
  n.state.doc.toString() !== e && n.dispatch({ changes: { from: 0, to: n.state.doc.length, insert: e } });
}
function QQ(n, e) {
  const { from: t, to: i } = n.state.selection.main;
  n.dispatch({ changes: { from: t, to: i, insert: e }, selection: { anchor: t + e.length }, scrollIntoView: !0 }), n.focus();
}
export {
  qn as C,
  G as D,
  Z as E,
  v as F,
  St as G,
  Ri as P,
  zt as R,
  I as S,
  We as V,
  Ci as W,
  z as a,
  J as b,
  mQ as c,
  mt as d,
  ht as e,
  W as f,
  dQ as g,
  fQ as h,
  QQ as i,
  $Q as r
};
//# sourceMappingURL=codemirror-AyaUW9O0.js.map
