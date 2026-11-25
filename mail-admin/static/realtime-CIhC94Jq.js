import { defineComponent as F, openBlock as $, createElementBlock as b, createElementVNode as g, toDisplayString as k, renderSlot as B, createCommentVNode as E, onBeforeUnmount as q } from "vue";
import { api as s, on as A } from "@wippy-fe/proxy";
const L = { class: "system-section-head" }, P = { class: "system-section-head-text" }, j = {
  key: 0,
  class: "kx-head-actions"
}, Z = /* @__PURE__ */ F({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (t, a) => ($(), b("header", L, [
      g("div", P, [
        g("h1", null, k(e.title), 1),
        g("p", null, k(e.description), 1)
      ]),
      t.$slots.actions ? ($(), b("div", j, [
        B(t.$slots, "actions")
      ])) : E("", !0)
    ]));
  }
});
function ee() {
  let e = 0;
  return () => {
    const t = ++e;
    return () => t === e;
  };
}
class c extends Error {
  constructor(t, a, n) {
    super(t.message ?? t.error ?? `${a} failed`), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.retryable = t.retryable, this.status = n;
  }
}
function p(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function I(e, t, a) {
  return new c({
    message: typeof e.message == "string" ? e.message : void 0,
    error: typeof e.error == "string" ? e.error : void 0,
    kind: typeof e.kind == "string" ? e.kind : void 0,
    details: p(e.details) ? e.details : void 0,
    retryable: typeof e.retryable == "boolean" ? e.retryable : void 0
  }, t, a);
}
function K(e, t) {
  if (e instanceof c) return e;
  if (p(e) && p(e.response) && p(e.response.data)) {
    const { data: a, status: n } = e.response;
    return I(a, t, typeof n == "number" ? n : void 0);
  }
  return e instanceof Error ? e : new c({ kind: "UNAVAILABLE" }, t);
}
async function i(e, t) {
  let a;
  try {
    a = (await e()).data;
  } catch (n) {
    throw K(n, t);
  }
  if (a?.success === !0 && a.data !== void 0) return a.data;
  throw a?.success === !1 ? I(a, t) : new c({ kind: "INTERNAL", message: `${t}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, t);
}
const o = "/api/v1/mail", u = (e) => `${o}/library/${e.kind}/${encodeURIComponent(e.name)}`;
function f(e) {
  const t = {};
  for (const [a, n] of Object.entries(e)) n !== void 0 && n !== "" && (t[a] = String(n));
  return t;
}
function _(e) {
  const { kind: t, name: a, title: n, description: r, html: l, text: d, base: C, subject: U, schema: v, samples: w } = e;
  return t === "message" ? { kind: t, name: a, title: n, description: r, html: l, text: d, base: C, subject: U, schema: v, samples: w } : { kind: t, name: a, title: n, description: r, html: l, text: d, schema: v, samples: w };
}
const N = (e) => e.kind === "message" ? e.name : "notice";
async function h(e, t) {
  const a = await i(
    () => s.post(`${o}/library/preview`, { message: N(e), ...t }),
    "Review changes"
  ), n = a.errors?.[0];
  if (n)
    throw new c({ kind: "INVALID", message: n.message, details: {
      ...n,
      errors: a.errors,
      dependent_messages: a.dependent_messages
    } }, "Review changes");
  if (!a.preview_id) throw new c({ message: "Mail did not return a preview ID." }, "Review changes");
  return a.preview_id;
}
async function m(e, t) {
  let a = () => {
  };
  const n = A("mail.library", () => a());
  try {
    const r = await t();
    if ("kind" in r) return r;
    for (; ; ) {
      const l = new Promise((d) => {
        a = d;
      });
      try {
        const d = await Y.get(e);
        if ((d.seq ?? 0) >= r.seq) return d;
      } catch (d) {
        if (!V(d)) throw d;
      }
      await l;
    }
  } finally {
    typeof n == "function" && n();
  }
}
async function T(e, t) {
  const a = { ...e, note: t ?? ("note" in e ? e.note : void 0) }, n = await h(e, { create: a }), r = crypto.randomUUID();
  return m(e, () => i(
    () => s.post(`${o}/library`, { ...a, preview_id: n, command_id: r }),
    "Create resource"
  ));
}
function H(e = {}) {
  const { names: t, ...a } = e;
  return i(
    () => s.get(`${o}/library`, { params: f({ limit: 100, ...a, names: t?.join(",") }) }),
    "Mail library"
  );
}
const Y = {
  page: H,
  get: (e) => i(() => s.get(u(e)), "Mail resource"),
  history: (e, t) => i(
    () => s.get(`${u(e)}/history`, { params: f({ cursor: t }) }),
    "Resource history"
  ),
  revision: (e, t) => i(
    () => s.get(`${u(e)}/history`, { params: f({ seq: t }) }),
    "Resource version"
  ),
  copy: (e) => T(e),
  create: (e, t) => T(_(e), t),
  async update(e, t, a) {
    const n = { ..._(e), expected_revision: t, note: a }, r = await h(e, { resources: [n] }), l = crypto.randomUUID();
    return m(e, () => i(
      () => s.put(u(e), { ...n, preview_id: r, command_id: l }),
      "Save resource"
    ));
  },
  async reset(e, t) {
    const a = { expected_revision: t }, n = e.kind === "asset" ? void 0 : await h(e, { reset: { ...e, ...a } }), r = crypto.randomUUID();
    return m(e, () => i(
      () => s.post(`${u(e)}/reset`, { ...a, preview_id: n, command_id: r }),
      "Reset resource"
    ));
  },
  async restore(e, t, a, n) {
    const r = { seq: t, expected_revision: a, note: n }, l = e.kind === "asset" ? void 0 : await h(e, { restore: { ...e, ...r } }), d = crypto.randomUUID();
    return m(e, () => i(
      () => s.post(`${u(e)}/restore`, { ...r, preview_id: l, command_id: d }),
      "Restore revision"
    ));
  },
  remove: (e, t) => {
    const a = crypto.randomUUID();
    return i(
      () => s.delete(u(e), { data: { expected_revision: t, command_id: a } }),
      "Delete resource"
    );
  },
  preview: (e, t) => i(() => s.post(`${o}/library/preview`, t.length ? { message: e, resources: t.map(_) } : { message: e }), "Preview"),
  sendTest: (e) => i(() => s.post(`${o}/library/send-test`, { message: e }), "Send test"),
  async addAsset(e) {
    const t = { kind: "asset", name: e.name }, a = crypto.randomUUID();
    return m(t, () => i(
      () => s.post(`${o}/library`, { kind: t.kind, ...e, command_id: a }),
      "Add image"
    ));
  },
  async replaceAsset(e, t) {
    const a = { kind: "asset", name: e.name }, n = crypto.randomUUID();
    return m(a, () => i(
      () => s.put(u(a), { ...e, expected_revision: t, command_id: n }),
      "Replace image"
    ));
  }
}, te = {
  // The platform upload flow: the file becomes the caller's upload, which Mail adopts as an asset once the platform
  // reports it completed.
  async add(e) {
    const t = new FormData();
    return t.append("file", e), t.append("metadata", JSON.stringify({ filename: e.name })), i(async () => {
      const n = (await s.post("/api/v1/uploads", t, { headers: { "Content-Type": "multipart/form-data" } })).data;
      return { data: n?.success && n.uuid ? { success: !0, data: { uuid: n.uuid } } : { success: !1, error: n?.error } };
    }, "Upload").then((a) => a.uuid);
  },
  // The upload's processing status and the component whose public meta changes at each upload milestone.
  async state(e) {
    return i(async () => {
      const a = (await s.get(`/api/v1/uploads/${encodeURIComponent(e)}`)).data;
      return a?.success && a.upload && a.component_id ? { data: { success: !0, data: { component_id: a.component_id, status: String(a.upload.status ?? ""), error: a.upload.error } } } : { data: { success: !1, error: a?.error } };
    }, "Upload");
  }
}, ae = {
  capabilities: () => i(() => s.get(`${o}/capabilities`), "Mail access")
}, ne = {
  list: (e) => i(() => s.get(`${o}/activity`, { params: f({ limit: 50, ...e }) }), "Mail activity"),
  get: (e) => i(() => s.get(`${o}/activity/${encodeURIComponent(e)}`), "Mail message"),
  resend: (e) => i(() => s.post(`${o}/activity/${encodeURIComponent(e)}/resend`, {}), "Send again")
}, se = {
  status: () => i(() => s.get(`${o}/delivery`), "Delivery status"),
  sendTest: () => i(() => s.post(`${o}/delivery/send-test`, {}), "Send test email")
};
function G(e) {
  if (!(e instanceof c)) return;
  const t = e.details?.code;
  return typeof t == "string" ? t : void 0;
}
function ie(e) {
  return e instanceof c && (e.status === 403 || e.kind === "PERMISSION_DENIED");
}
function V(e) {
  return e instanceof c && (e.status === 404 || e.kind?.replaceAll("_", "").toLowerCase() === "notfound");
}
const re = { message: "Message", base: "Base template", part: "Part", asset: "Image" }, oe = { message: "Messages", base: "Base templates", part: "Parts", asset: "Images" }, de = { message: "tabler:mail", base: "tabler:layout", part: "tabler:puzzle", asset: "tabler:photo" }, ce = {
  created: "Created",
  edited: "Edited",
  base_changed: "Base template changed",
  reset: "Reset to the original",
  restored: "Restored",
  archived: "Archived",
  deleted: "Deleted"
};
function le(e) {
  return e.action !== "archived" && e.action !== "deleted";
}
function ue(e, t) {
  return e?.label ?? t ?? "";
}
function D(e) {
  return e === void 0 ? "" : e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${Math.round(e / 1024)} KB` : `${(e / 1024 / 1024).toFixed(1)} MB`;
}
const me = { queued: "Pending", sent: "Sent", failed: "Failed" }, pe = { queued: "secondary", sent: "success", failed: "danger" }, O = {
  workflow: "Workflow",
  automation: "Automation",
  test: "Test send",
  resend: "Sent again"
};
function he(e) {
  if (!e) return "";
  const t = O[e.kind];
  return t ? e.kind === "test" || e.kind === "resend" ? t : e.label ? `${t} · ${e.label}` : t : e.label;
}
const M = 1440 * 60 * 1e3, R = new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric" }), x = new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric", year: "numeric" }), z = new Intl.DateTimeFormat(void 0, { hour: "2-digit", minute: "2-digit" }), J = new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" });
function S(e) {
  const t = new Date(e);
  return t.setHours(0, 0, 0, 0), t.getTime();
}
function W(e, t = Date.now()) {
  if (!e) return "—";
  const a = S(t);
  return e >= a ? "Today" : e >= a - M ? "Yesterday" : new Date(e).getFullYear() === new Date(t).getFullYear() ? R.format(e) : x.format(e);
}
function fe(e, t = Date.now()) {
  const a = W(e, t);
  return a === "Today" || a === "Yesterday" ? a.toLowerCase() : "on " + a;
}
function ge(e, t = Date.now()) {
  const a = S(t);
  return e >= a ? z.format(e) : e >= a - M ? "Yesterday" : new Date(e).getFullYear() === new Date(t).getFullYear() ? R.format(e) : x.format(e);
}
function _e(e) {
  return e ? J.format(e) : "—";
}
function ye(e) {
  return e.length ? e.length === 1 ? `To ${e[0]}` : `To ${e[0]} +${e.length - 1}` : "";
}
function ve(e, t, a = t + "s") {
  return `${e} ${e === 1 ? t : a}`;
}
const y = {
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
function we(e, t, a = "in Settings → Mail") {
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
function $e(e, t) {
  if (!(e instanceof c) || e.status === void 0) return `${t} Check your connection and try again.`;
  const a = G(e);
  return a && y[a] ? y[a] : e.status === 403 ? y.mail_library_denied : e.status >= 500 ? `${t} Try again in a moment.` : e.message || t;
}
function be(e) {
  return e.code === "gmail_html_clipping" && e.bytes && e.threshold_bytes ? `Gmail may clip this email: its HTML is ${D(e.bytes)}, above Gmail’s ${D(e.threshold_bytes)}. Readers then see only the start until they open the rest.` : e.message;
}
function ke(e) {
  return e.trim().toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}
const Te = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.";
function De(e, t) {
  const a = A(e, t);
  q(() => {
    typeof a == "function" && a();
  });
}
export {
  c as A,
  ne as B,
  ye as C,
  ge as D,
  ae as E,
  se as F,
  K as G,
  Z as _,
  ue as a,
  D as b,
  oe as c,
  $e as d,
  G as e,
  de as f,
  ee as g,
  ce as h,
  ie as i,
  _e as j,
  re as k,
  Y as l,
  le as m,
  fe as n,
  he as o,
  ve as p,
  V as q,
  te as r,
  W as s,
  ke as t,
  De as u,
  Te as v,
  be as w,
  we as x,
  me as y,
  pe as z
};
