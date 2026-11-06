import { W as a, u as s } from "./wc-runtime-DZZltuMO.js";
import "@iconify/vue";
import { defineComponent as d, h as l, onMounted as g } from "vue";
import { define as m } from "@wippy-fe/proxy";
const t = 3e4;
function c(r) {
  let o;
  const i = new Promise((e, p) => {
    o = setTimeout(() => p(new Error(`Loading timed out after ${t} ms.`)), t);
  });
  return Promise.race([r, i]).finally(() => clearTimeout(o));
}
function u(r, o, i) {
  const e = i();
  g(() => e("error", { message: r, error: o }));
}
function f(r, o, i) {
  return () => c(r()).catch((e) => ({
    rootComponent: d(() => (u(o, e, i), () => l("wippy-error", { title: "Failed to load", message: o })))
  }));
}
const y = ":host{display:block;min-width:0;color:var(--p-text-color)}wippy-loading,wippy-error{height:100%}wippy-loading~wippy-loading{display:none}.onboarding{box-sizing:border-box;width:100%}.onboarding-intro{margin-bottom:16px}.onboarding-intro p{margin:0}p{line-height:1.5}.onboarding-form{display:grid;gap:16px}fieldset{border:0;padding:0;margin:0;display:grid;gap:10px;min-width:0}label{font-weight:600}summary:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:var(--p-focus-ring-shadow)}.hint{color:var(--p-text-muted-color);font-size:.9rem;margin:0 0 8px}.capabilities{border:1px solid var(--p-content-border-color);border-radius:14px;padding:14px;display:grid;gap:12px}details{margin-top:8px}summary{cursor:pointer;padding:8px 0}.error{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-600, var(--p-danger-500)) 8%,transparent);border-radius:10px;padding:12px;margin:0}.actions{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-top:8px}", b = { props: { type: "object", properties: {} } }, x = {
  wippy: b
};
class n extends a {
  static get wippyConfig() {
    return { propsSchema: x.wippy.props, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: y };
  }
  static get vueConfig() {
    return {
      lazyConfig: f(
        () => import("./lazy-mount--U0SMlw6.js").then((o) => o.mountConfig),
        "Could not load the onboarding. Reload the page to try again.",
        s
      )
    };
  }
}
async function T() {
  return n;
}
m(import.meta.url, n);
export {
  T as webComponent
};
