import { W as o, l as r, P as s } from "./wc-runtime-CdjKNP2N.js";
import { define as a } from "@wippy-fe/proxy";
const i = ":host{display:block;height:100%;min-height:0;color:var(--p-text-color)}.storage-s3{box-sizing:border-box;height:100%;overflow:auto;padding:1.5rem;background:var(--p-content-background)}.storage-s3 header,.storage-s3 form{max-width:48rem}.storage-s3 h2{margin:0 0 .75rem;font-size:1.25rem}.storage-s3 p,.storage-s3 small{color:var(--p-text-muted-color);line-height:1.5}.storage-s3 form{display:grid;gap:.75rem;margin-top:1.25rem}.storage-s3:has(>p[role=status]){min-height:329px}.storage-s3 label{font-weight:600}.storage-s3-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:.5rem}:host>div:empty,:host>div:has(>[data-lazy-state]){min-height:329px}";
class e extends o {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: i
    };
  }
  static get vueConfig() {
    return r(() => import("./storage-EDxILpl-.js").then((t) => ({ rootComponent: t.default, plugins: [s] })), { surface: "compact", loading: "Loading the S3 storage settings…", failed: "Could not load the S3 storage settings. Reload the page to try again.", delay: 200, timeout: 3e4 });
  }
}
async function l() {
  return e;
}
a(import.meta.url, e);
export {
  l as webComponent
};
