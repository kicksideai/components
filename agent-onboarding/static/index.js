import { W as p, u as l } from "./wc-runtime-DZZltuMO.js";
import "@iconify/vue";
import { defineComponent as d, h as s, onMounted as m } from "vue";
import { define as g } from "@wippy-fe/proxy";
const o = 3e4;
function c(t) {
  let e;
  const i = new Promise((r, a) => {
    e = setTimeout(() => a(new Error(`Loading timed out after ${o} ms.`)), o);
  });
  return Promise.race([t, i]).finally(() => clearTimeout(e));
}
function u(t, e, i) {
  const r = i();
  m(() => r("error", { message: t, error: e }));
}
function x(t, e, i) {
  return () => c(t()).catch((r) => ({
    rootComponent: d(() => (u(e, r, i), () => s("wippy-error", { title: "Failed to load", message: e })))
  }));
}
const f = ":host{display:block;min-width:0;color:var(--p-text-color)}wippy-loading,wippy-error{height:100%}wippy-loading~wippy-loading{display:none}.onboarding{box-sizing:border-box;width:100%;min-width:0}p{line-height:1.5;margin:0}.stack{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}.status{color:var(--p-text-muted-color)}.hint{color:var(--p-text-muted-color);font-size:.8125rem}.intro{color:var(--p-text-muted-color)}fieldset{border:0;padding:0;margin:0;min-width:0;display:grid;grid-template-columns:minmax(0,1fr);gap:16px}.field-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}.field{display:grid;gap:6px;min-width:0;align-content:start}.field label,.field .label{font-weight:700;font-size:13.5px}wc-model-picker{display:block;width:100%}wc-agent-trait-picker{display:block;min-width:0}.title{margin:0;padding-right:32px;font-family:var(--kx-font-heading);font-size:24px;font-weight:800;line-height:1.15;letter-spacing:-.6px;color:var(--p-text-color)}.head{display:flex;align-items:center;gap:12px;padding-right:32px}.head .title{padding-right:0}.head-icon{display:grid;place-items:center;flex:none;width:40px;height:40px;border-radius:var(--kx-radius-10);background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);font-size:22px}.text{color:var(--p-text-muted-color)}.model-setup{display:grid;gap:12px}.model-setup .actions{margin-top:8px}.model-config{display:block;min-width:0}.error{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-600, var(--p-danger-500)) 8%,transparent);border-radius:var(--kx-radius-10);padding:12px}.actions{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}.memory-choice{display:flex;align-items:center;gap:8px}", h = { props: { type: "object", properties: {} } }, y = {
  wippy: h
};
class n extends p {
  static get wippyConfig() {
    return { propsSchema: y.wippy.props, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: f };
  }
  static get vueConfig() {
    return {
      lazyConfig: x(
        () => import("./lazy-mount-CoGN0Tz6.js").then((e) => e.mountConfig),
        "Could not load the onboarding. Reload the page to try again.",
        l
      )
    };
  }
}
async function C() {
  return n;
}
g(import.meta.url, n);
export {
  C as webComponent
};
