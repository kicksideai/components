import { defineComponent as I, openBlock as b, createElementBlock as D, createElementVNode as y, toDisplayString as $, renderSlot as R, createCommentVNode as q, onBeforeUnmount as j, useModel as L, createBlock as H, unref as h, withCtx as f, createVNode as v, createTextVNode as K, mergeModels as Y } from "vue";
import { api as n, on as C } from "@wippy-fe/proxy";
import V from "primevue/accordion";
import G from "primevue/accordioncontent";
import O from "primevue/accordionheader";
import J from "primevue/accordionpanel";
const z = { class: "system-section-head" }, W = { class: "system-section-head-text" }, Q = {
  key: 0,
  class: "kx-head-actions"
}, he = /* @__PURE__ */ I({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (t, a) => (b(), D("header", z, [
      y("div", W, [
        y("h1", null, $(e.title), 1),
        y("p", null, $(e.description), 1)
      ]),
      t.$slots.actions ? (b(), D("div", Q, [
        R(t.$slots, "actions")
      ])) : q("", !0)
    ]));
  }
});
function fe() {
  let e = 0;
  return () => {
    const t = ++e;
    return () => t === e;
  };
}
class c extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(t, a, s) {
    super(t.message ?? t.error ?? `${a} failed`), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.retryable = t.retryable, this.status = s;
  }
}
function p(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function S(e, t, a) {
  const s = p(e) ? e : {};
  return new c({
    message: typeof s.message == "string" ? s.message : void 0,
    error: typeof s.error == "string" ? s.error : void 0,
    kind: typeof s.kind == "string" ? s.kind : void 0,
    details: p(s.details) ? s.details : void 0,
    retryable: typeof s.retryable == "boolean" ? s.retryable : void 0
  }, t, a);
}
function X(e, t) {
  if (e instanceof c) return e;
  if (p(e) && p(e.response) && p(e.response.data)) {
    const { data: a, status: s } = e.response;
    return S(a, t, typeof s == "number" ? s : void 0);
  }
  return e instanceof Error ? e : new c({ kind: "UNAVAILABLE" }, t);
}
async function i(e, t) {
  let a;
  try {
    a = (await e()).data;
  } catch (s) {
    throw X(s, t);
  }
  if (a?.success === !0 && a.data !== void 0) return a.data;
  throw a?.success === !1 ? S(a, t) : new c({ kind: "INTERNAL", message: `${t}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, t);
}
const o = "/api/v1/mail", u = (e) => `${o}/library/${e.kind}/${encodeURIComponent(e.name)}`;
function _(e) {
  const t = {};
  for (const [a, s] of Object.entries(e)) s !== void 0 && s !== "" && (t[a] = String(s));
  return t;
}
function w(e) {
  const { kind: t, name: a, title: s, description: r, html: l, text: d, base: N, subject: P, schema: k, samples: T } = e;
  return t === "message" ? { kind: t, name: a, title: s, description: r, html: l, text: d, base: N, subject: P, schema: k, samples: T } : { kind: t, name: a, title: s, description: r, html: l, text: d, schema: k, samples: T };
}
const Z = (e) => e.kind === "message" ? e.name : "notice";
async function g(e, t) {
  const a = await i(
    () => n.post(`${o}/library/preview`, { message: Z(e), ...t }),
    "Review changes"
  ), s = a.errors?.[0];
  if (s)
    throw new c({ kind: "INVALID", message: s.message, details: {
      ...s,
      errors: a.errors,
      dependent_messages: a.dependent_messages
    } }, "Review changes");
  if (!a.preview_id) throw new c({ message: "Mail did not return a preview ID." }, "Review changes");
  return a.preview_id;
}
async function m(e, t) {
  let a = () => {
  };
  const s = C("mail.library", () => a());
  try {
    const r = await t();
    if ("kind" in r) return r;
    for (; ; ) {
      const l = new Promise((d) => {
        a = d;
      });
      try {
        const d = await te.get(e);
        if ((d.seq ?? 0) >= r.seq) return d;
      } catch (d) {
        if (!se(d)) throw d;
      }
      await l;
    }
  } finally {
    s();
  }
}
async function A(e, t) {
  const a = { ...e, note: t ?? ("note" in e ? e.note : void 0) }, s = await g(e, { create: a }), r = crypto.randomUUID();
  return m(e, () => i(
    () => n.post(`${o}/library`, { ...a, preview_id: s, command_id: r }),
    "Create resource"
  ));
}
function ee(e = {}) {
  const { names: t, ...a } = e;
  return i(
    () => n.get(`${o}/library`, { params: _({ limit: 100, ...a, names: t?.join(",") }) }),
    "Mail library"
  );
}
const te = {
  page: ee,
  get: (e) => i(() => n.get(u(e)), "Mail resource"),
  history: (e, t) => i(
    () => n.get(`${u(e)}/history`, { params: _({ cursor: t }) }),
    "Resource history"
  ),
  revision: (e, t) => i(
    () => n.get(`${u(e)}/history`, { params: _({ seq: t }) }),
    "Resource version"
  ),
  copy: (e) => A(e),
  create: (e, t) => A(w(e), t),
  async update(e, t, a) {
    const s = { ...w(e), expected_revision: t, note: a }, r = await g(e, { resources: [s] }), l = crypto.randomUUID();
    return m(e, () => i(
      () => n.put(u(e), { ...s, preview_id: r, command_id: l }),
      "Save resource"
    ));
  },
  async reset(e, t) {
    const a = { expected_revision: t }, s = e.kind === "asset" ? void 0 : await g(e, { reset: { ...e, ...a } }), r = crypto.randomUUID();
    return m(e, () => i(
      () => n.post(`${u(e)}/reset`, { ...a, preview_id: s, command_id: r }),
      "Reset resource"
    ));
  },
  async restore(e, t, a, s) {
    const r = { seq: t, expected_revision: a, note: s }, l = e.kind === "asset" ? void 0 : await g(e, { restore: { ...e, ...r } }), d = crypto.randomUUID();
    return m(e, () => i(
      () => n.post(`${u(e)}/restore`, { ...r, preview_id: l, command_id: d }),
      "Restore revision"
    ));
  },
  remove: (e, t) => {
    const a = crypto.randomUUID();
    return i(
      () => n.delete(u(e), { data: { expected_revision: t, command_id: a } }),
      "Delete resource"
    );
  },
  preview: (e, t) => i(() => n.post(`${o}/library/preview`, t.length ? { message: e, resources: t.map(w) } : { message: e }), "Preview"),
  sendTest: (e) => i(() => n.post(`${o}/library/send-test`, { message: e }), "Send test"),
  async addAsset(e) {
    const t = { kind: "asset", name: e.name }, a = crypto.randomUUID();
    return m(t, () => i(
      () => n.post(`${o}/library`, { kind: t.kind, ...e, command_id: a }),
      "Add image"
    ));
  },
  async replaceAsset(e, t) {
    const a = { kind: "asset", name: e.name }, s = crypto.randomUUID();
    return m(a, () => i(
      () => n.put(u(a), { ...e, expected_revision: t, command_id: s }),
      "Replace image"
    ));
  }
}, ge = {
  // The platform upload flow: the file becomes the caller's upload, which Mail adopts as an asset once the platform
  // reports it completed.
  async add(e) {
    const t = new FormData();
    return t.append("file", e), t.append("metadata", JSON.stringify({ filename: e.name })), i(async () => {
      const s = (await n.post("/api/v1/uploads", t, { headers: { "Content-Type": "multipart/form-data" } })).data;
      return { data: s?.success && s.uuid ? { success: !0, data: { uuid: s.uuid } } : { success: !1, error: s?.error } };
    }, "Upload").then((a) => a.uuid);
  },
  // The upload's processing status and the component whose public meta changes at each upload milestone.
  async state(e) {
    return i(async () => {
      const a = (await n.get(`/api/v1/uploads/${encodeURIComponent(e)}`)).data;
      return a?.success && a.upload && a.component_id ? { data: { success: !0, data: { component_id: a.component_id, status: String(a.upload.status ?? ""), error: a.upload.error } } } : { data: { success: !1, error: a?.error } };
    }, "Upload");
  }
}, _e = {
  capabilities: () => i(() => n.get(`${o}/capabilities`), "Mail access")
}, ye = {
  list: (e) => i(() => n.get(`${o}/activity`, { params: _({ limit: 50, ...e }) }), "Mail activity"),
  get: (e) => i(() => n.get(`${o}/activity/${encodeURIComponent(e)}`), "Mail message"),
  resend: (e) => i(() => n.post(`${o}/activity/${encodeURIComponent(e)}/resend`, {}), "Send again")
}, ve = {
  status: () => i(() => n.get(`${o}/delivery`), "Delivery status"),
  sendTest: () => i(() => n.post(`${o}/delivery/send-test`, {}), "Send test email")
};
function ae(e) {
  if (!(e instanceof c)) return;
  const t = e.details?.code;
  return typeof t == "string" ? t : void 0;
}
function we(e) {
  return e instanceof c && (e.status === 403 || e.kind === "PERMISSION_DENIED");
}
function se(e) {
  return e instanceof c && (e.status === 404 || e.kind === "NOT_FOUND");
}
const be = { message: "Message", base: "Base template", part: "Part", asset: "Image" }, $e = { message: "Messages", base: "Base templates", part: "Parts", asset: "Images" }, ke = { message: "tabler:mail", base: "tabler:layout", part: "tabler:puzzle", asset: "tabler:photo" }, Te = {
  created: "Created",
  edited: "Edited",
  base_changed: "Base template changed",
  reset: "Reset to the original",
  restored: "Restored",
  archived: "Archived",
  deleted: "Deleted"
};
function De(e) {
  return e.action !== "archived" && e.action !== "deleted";
}
function Ae(e, t) {
  return e?.label ?? t ?? "";
}
function x(e) {
  return e === void 0 ? "" : e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${Math.round(e / 1024)} KB` : `${(e / 1024 / 1024).toFixed(1)} MB`;
}
const xe = { queued: "Pending", sent: "Sent", failed: "Failed" }, Me = { queued: "secondary", sent: "success", failed: "danger" }, ne = {
  workflow: "Workflow",
  automation: "Automation",
  test: "Test send",
  resend: "Sent again"
};
function Ie(e) {
  if (!e) return "";
  const t = ne[e.kind];
  return t ? e.kind === "test" || e.kind === "resend" ? t : e.label ? `${t} · ${e.label}` : t : e.label;
}
const U = 1440 * 60 * 1e3, F = new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric" }), B = new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric", year: "numeric" }), ie = new Intl.DateTimeFormat(void 0, { hour: "2-digit", minute: "2-digit" }), re = new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" });
function E(e) {
  const t = new Date(e);
  return t.setHours(0, 0, 0, 0), t.getTime();
}
function oe(e, t = Date.now()) {
  if (!e) return "—";
  const a = E(t);
  return e >= a ? "Today" : e >= a - U ? "Yesterday" : new Date(e).getFullYear() === new Date(t).getFullYear() ? F.format(e) : B.format(e);
}
function Re(e, t = Date.now()) {
  const a = oe(e, t);
  return a === "Today" || a === "Yesterday" ? a.toLowerCase() : "on " + a;
}
function Ce(e, t = Date.now()) {
  const a = E(t);
  return e >= a ? ie.format(e) : e >= a - U ? "Yesterday" : new Date(e).getFullYear() === new Date(t).getFullYear() ? F.format(e) : B.format(e);
}
function Se(e) {
  return e ? re.format(e) : "—";
}
function Ue(e) {
  return e.length ? e.length === 1 ? `To ${e[0]}` : `To ${e[0]} +${e.length - 1}` : "";
}
function Fe(e, t, a = t + "s") {
  return `${e} ${e === 1 ? t : a}`;
}
const M = {
  mail_revision_conflict: "Someone saved this resource while you were looking at it. The latest version is shown now; review it and try again.",
  mail_resource_not_found: "This resource no longer exists.",
  mail_revision_not_found: "That version is no longer in History.",
  mail_resource_is_shipped: "An included resource cannot be deleted. Reset it to the original instead.",
  mail_resource_not_customized: "This resource already matches the original.",
  mail_library_denied: "Ask an administrator to grant you access to the mail library.",
  mail_delivery_denied: "Ask an administrator to grant you access to mail delivery.",
  mail_send_denied: "Ask an administrator to grant you permission to send mail.",
  mail_content_unavailable: "This message can no longer be sent again because its content was not kept.",
  mail_projection_failed: "Email could not switch to this version, so nothing was saved. Try again in a moment.",
  duplicate_template_name: "Two installed modules include a resource with this name. Ask an administrator to remove one of them.",
  mail_resource_collision: "An installed module now includes a resource with this name. Rename yours to keep both.",
  invalid_mail_asset: "Use a PNG, JPEG or GIF image of 1 MB or less.",
  mail_resource_in_use: "Messages still use this resource. Remove it from them first.",
  invalid_config: "Mail delivery is not set up yet. Ask an administrator to set it up.",
  from_name_invalid: "The sender name in the delivery settings cannot be used in email. Correct it in Settings → Mail.",
  invalid_request: "This is more than Mail accepts in one go. Shorten what you entered and try again.",
  invalid_mail_filter: "Mail could not use this search or filter. Clear the search and try again.",
  invalid_mail_resource: "Check the required fields. A reference takes up to 128 characters and a title up to 4,096.",
  mail_resource_too_large: "The HTML, plain text, and description can total up to 512 KiB.",
  invalid_revision_note: "Keep the note for History under 4,096 characters.",
  invalid_mail_resources: "Mail could not read this draft. Reload the page and try again.",
  invalid_mail_draft: "Mail could not read this draft. Reload the page and try again.",
  invalid_mail_revision: "That version is not in History any more. Reload History and try again.",
  invalid_template_vars: "The sample values are larger than Mail accepts. Keep them under 64 KB.",
  html_too_large: "The email’s HTML is larger than Mail can send. Keep it under 256 KB.",
  text_too_large: "The email’s plain text is larger than Mail can send. Keep it under 256 KB.",
  invalid_subject: "The subject has a line break or a character email cannot carry. Remove it and try again.",
  invalid_content_id: "An attachment shown inside the email is not attached as an inline image.",
  attachment_empty: "An attachment is empty. Attach the file again.",
  incomplete_attachment: "An attachment changed while the message was being sent. Send it again.",
  message_too_large: "The message with its attachments is larger than the delivery service accepts.",
  upload_still_processing: "The image is still being processed. Mail adds it as soon as it is ready."
};
function Be(e, t, a = "in Settings → Mail") {
  switch (e) {
    case "credentials_invalid":
      return { lead: `${t} refused the credentials.`, next: `Check the API key ${a}, save, and send again.` };
    case "authorization_refused":
      return { lead: `${t} refused to send for this account.`, next: `Check the API key’s sending permission and the account’s credits with ${t}.` };
    case "sender_or_recipient_not_allowed":
      return { lead: `${t} did not accept the sender or a recipient.`, next: `Verify the From address’s domain with ${t}, or check its restrictions on recipients.` };
    case "request_rejected":
      return { lead: `${t} rejected the request.`, next: `Check the API key and the From address ${a}.` };
    case "quota_exhausted":
      return { lead: `${t} reports the sending quota is used up.`, next: `Sending resumes when the quota renews, or after the plan changes with ${t}.` };
    case "rate_limited":
      return { lead: `${t} is limiting how fast mail is sent.`, next: "Mail tries again on its own." };
    case "message_rejected":
      return { lead: `${t} rejected the message itself.`, next: "Check the recipients, the subject and the attachments." };
    case "invalid_config":
    case "settings_read_failed":
    case "provider_endpoint_invalid":
    case "driver_not_admitted":
    case "invalid_transport_status":
      return { lead: "The delivery settings are not complete.", next: `Check the settings ${a}, save, and send again.` };
    case "from_name_invalid":
      return { lead: "The sender name cannot be used in email.", next: `Correct the From name ${a}.` };
    default:
      return;
  }
}
function Ee(e, t) {
  if (!(e instanceof c) || e.status === void 0) return `${t} Check your connection and try again.`;
  const a = ae(e);
  return a && M[a] ? M[a] : e.status >= 500 ? `${t} Try again in a moment.` : e.message || t;
}
function Ne(e) {
  return e.code === "gmail_html_clipping" && e.bytes && e.threshold_bytes ? `Gmail may clip this email: its HTML is ${x(e.bytes)}, above Gmail’s ${x(e.threshold_bytes)}. Readers then see only the start until they open the rest.` : e.message;
}
function Pe(e) {
  return e.trim().toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}
const qe = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.";
function je(e, t) {
  const a = C(e, t);
  j(a);
}
const Le = /* @__PURE__ */ I({
  __name: "Disclosure",
  props: /* @__PURE__ */ Y({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = L(e, "open");
    return (a, s) => (b(), H(h(V), {
      class: "kx-disclosure",
      value: t.value ? "content" : void 0,
      "onUpdate:value": s[0] || (s[0] = (r) => t.value = r === "content")
    }, {
      default: f(() => [
        v(h(J), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: f(() => [
            v(h(O), { class: "kx-disclosure-toggle" }, {
              default: f(() => [
                K($(e.label), 1)
              ]),
              _: 1
            }),
            v(h(G), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: f(() => [
                R(a.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["value"]));
  }
});
function He(e, t) {
  e?.dispatchEvent(new CustomEvent("navigate", { detail: { path: t }, bubbles: !0, composed: !0 }));
}
export {
  c as A,
  xe as B,
  Me as C,
  ye as D,
  Ue as E,
  Ce as F,
  _e as G,
  ve as H,
  S as I,
  X as J,
  he as _,
  Ae as a,
  x as b,
  $e as c,
  Ee as d,
  ae as e,
  ke as f,
  fe as g,
  Le as h,
  we as i,
  Te as j,
  be as k,
  te as l,
  Se as m,
  De as n,
  Ie as o,
  Fe as p,
  Re as q,
  se as r,
  oe as s,
  He as t,
  je as u,
  ge as v,
  Ne as w,
  Pe as x,
  qe as y,
  Be as z
};
