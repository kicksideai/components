import { defineComponent as te, useId as pe, openBlock as i, createElementBlock as s, unref as a, normalizeClass as ne, createElementVNode as t, createTextVNode as J, toDisplayString as c, createCommentVNode as V, renderSlot as Te, computed as N, createBlock as B, resolveDynamicComponent as ot, normalizeProps as st, guardReactiveProps as nt, createSlots as ua, withCtx as j, Fragment as K, renderList as ue, createVNode as o, inject as ct, onBeforeUnmount as ea, shallowRef as he, ref as f, watch as X, reactive as dt, withModifiers as Re, useModel as ut, mergeModels as pt, defineAsyncComponent as na, withDirectives as mt, vShow as vt, provide as ft } from "vue";
import { W as gt, P as bt, u as Be, a as ht, b as yt } from "./wc-runtime-IM7bQYl9.js";
import "pinia";
import { api as le, on as ja, host as De, define as xt } from "@wippy-fe/proxy";
import { Icon as D } from "@iconify/vue";
import H from "primevue/button";
import de from "primevue/column";
import pa from "primevue/datatable";
import ma from "primevue/iconfield";
import va from "primevue/inputicon";
import me from "primevue/inputtext";
import xe from "primevue/selectbutton";
import je from "primevue/dialog";
import Ae from "primevue/tag";
import Me from "primevue/select";
import kt from "primevue/accordion";
import wt from "primevue/accordioncontent";
import $t from "primevue/accordionheader";
import _t from "primevue/accordionpanel";
import Ct from "primevue/checkbox";
import Ua from "primevue/drawer";
import Vt from "primevue/fileupload";
import St from "primevue/textarea";
const zt = '.kx-settings-shell.kx-shell{grid-template-columns:232px minmax(0,1fr)}.kx-rail.kx-settings-list-rail{flex:0 0 232px;min-width:0;background:var(--p-content-background)}.kx-settings-list-rail .kx-railhead{min-height:53px}.kx-settings-list-rail .kx-rail-body{padding:8px 12px 12px}.kx-settings-rail-standalone{display:contents}.kx-settings-rail{flex:0 0 232px;min-width:0;overflow-y:auto;overflow-x:hidden;padding:16px 12px;display:flex;flex-direction:column;gap:14px;border-right:1px solid var(--p-content-border-color)}.kx-settings-rail-section{display:flex;flex-direction:column;gap:2px}.kx-settings-rail-group{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color);margin:2px 0 4px 10px}.kx-settings-rail-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:8px 10px;border:none;border-radius:8px;cursor:pointer;font:inherit;font-size:13px;font-weight:500;color:var(--p-text-color);background:transparent;transition:background .15s,color .15s}.kx-settings-rail-item:hover:where(:not([aria-current=true])){background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.kx-settings-rail-item[aria-current=true]{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-settings-rail-icon{flex:0 0 auto;width:18px;height:18px}.kx-settings-rail-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-settings-rail-leading{display:contents}@media(max-width:640px){.kx-settings-rail{flex:0 0 auto;max-height:40%;flex-direction:row;flex-wrap:wrap;gap:6px;border-right:none;border-bottom:1px solid var(--p-content-border-color)}.kx-settings-rail-section{flex-direction:row;flex-wrap:wrap;align-items:center;gap:6px}.kx-settings-rail-group{margin:0 6px 0 2px}.kx-settings-rail:not(.kx-settings-rail-framed) .kx-settings-rail-section{display:flex;flex:0 0 100%}}.kx-settings-list-rail .kx-settings-rail-framed{padding:0;border:0;overflow:visible}@media(max-width:760px){.kx-settings-shell.kx-shell{grid-template-columns:minmax(0,1fr)}.kx-rail.kx-settings-list-rail{flex:0 0 auto}.kx-settings-rail-framed{gap:8px}.kx-settings-rail-framed .kx-settings-rail-section{flex-flow:row wrap;gap:4px}.kx-settings-rail-framed .kx-settings-rail-group{flex-basis:100%}.kx-settings-rail-framed .kx-settings-rail-item{width:auto}}.kx-settings-list-rail .picker-search{flex:none;padding:8px 10px}.kx-settings-list-rail .picker-search-input{width:100%}.kx-settings-list-rail .picker-search-input::-webkit-search-cancel-button{display:none}.kx-settings-list-rail .picker-search-clear{position:absolute;right:0;top:0;height:100%}.kx-settings-list-rail .picker-search:has(.picker-search-clear) .picker-search-input{padding-inline-end:34px}.kx-settings-list-rail .picker-group{margin:0;padding:10px 6px 4px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--p-text-muted-color)}.kx-settings-list-rail .picker-list{margin:0;padding:0;list-style:none}.kx-settings-list-rail .picker-row{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:none;border-radius:var(--kx-radius-8);background:transparent;color:var(--p-text-color);cursor:pointer;text-align:left;transition:background .12s;font:inherit}.kx-settings-list-rail .picker-row:hover:where(:not(:disabled,[aria-current=true])){background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.kx-settings-list-rail .picker-row[aria-current=true]{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-settings-list-rail .picker-row:disabled{color:var(--p-text-muted-color);cursor:default}.kx-settings-list-rail .picker-name{font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-settings-list-rail .picker-message{color:var(--p-text-muted-color);font-size:11.5px;line-height:1.3;padding:7px 10px}:is(.kx-settings-rail-item,.kx-settings-list-rail .picker-row):focus:not(:focus-visible){outline:none;box-shadow:none}:is(.kx-settings-rail-item,.kx-settings-list-rail .picker-row):focus-visible{outline:var(--p-focus-ring-width, 2px) var(--p-focus-ring-style, solid) var(--p-focus-ring-color, currentColor);outline-offset:calc(-1 * var(--p-focus-ring-width, 2px));box-shadow:none}.system-section-head{display:flex;flex:none;flex-wrap:wrap;align-items:center;gap:12px;margin:0}.system-section-head-text{flex:1 1 180px;min-width:0}.system-section-head-text h1{margin:0;font-size:17px;font-weight:700;letter-spacing:-.2px;color:var(--p-text-color)}.system-section-head-text p{margin:2px 0 0;font-size:13px;color:var(--p-text-muted-color)}.system-section-head .kx-head-actions{justify-content:flex-end}.kx-disclosure-panel:has(>.kx-disclosure-toggle[aria-expanded=false]){border-bottom-width:0}.kx-disclosure .kx-disclosure-motion-enter-active,.kx-disclosure .kx-disclosure-motion-leave-active{display:grid;grid-template-rows:1fr;overflow:hidden;transition:grid-template-rows var(--p-form-field-transition-duration, .2s) ease-in-out}.kx-disclosure .kx-disclosure-motion-enter-from,.kx-disclosure .kx-disclosure-motion-leave-to{grid-template-rows:0fr}.kx-disclosure .kx-disclosure-content{min-height:0;overflow:hidden}@media(prefers-reduced-motion:reduce){.kx-disclosure .kx-disclosure-motion-enter-active,.kx-disclosure .kx-disclosure-motion-leave-active,.kx-disclosure .kx-disclosure-toggle{transition:none}}:root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-shell{flex:1;min-height:0;display:grid;grid-template-columns:var(--kx-rail-width) minmax(0,1fr);background:var(--p-content-background)}.kx-rail{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--p-content-border-color);background:color-mix(in srgb,var(--p-text-color) 2.5%,var(--p-content-background))}.kx-rail-body{flex:1;min-height:0;overflow-y:auto;padding:4px 8px 12px}.kx-main{display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden}.kx-main-scroll{flex:1;min-height:0;overflow-y:auto;padding:18px 28px 80px 24px;display:flex;flex-direction:column;gap:16px}@media(max-width:760px){.kx-shell{grid-template-columns:minmax(0,1fr);grid-auto-rows:auto minmax(0,1fr)}.kx-rail{max-height:40vh;border-right:none;border-bottom:1px solid var(--p-content-border-color)}.kx-main-scroll{padding:20px 22px 64px}}.kx-railhead{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 12px 10px;border-bottom:1px solid var(--p-content-border-color)}.kx-railhead-title{font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--p-text-muted-color)}.kx-railhead-title b{color:var(--p-text-muted-color);margin-left:4px;font-variant-numeric:tabular-nums}.kx-railhead-acts{display:flex;align-items:center;gap:2px}.kx-railsec+.kx-railsec{border-top:1px solid var(--p-content-border-color)}.kx-railsec-h{display:flex;align-items:center;gap:6px;width:100%;padding:9px 12px 7px;background:none;border:none;cursor:pointer;font:inherit;font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--p-text-muted-color)}.kx-railsec-h:hover{color:var(--p-text-muted-color)}.kx-railsec-chev{width:13px;height:13px;flex:none;transition:transform .15s ease}.kx-railsec:not(.closed) .kx-railsec-chev{transform:rotate(90deg)}.kx-railsec-ic{width:14px;height:14px;flex:none}.kx-railsec-t{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-railsec-h .count{margin-left:auto;color:var(--p-text-muted-color);font-variant-numeric:tabular-nums}.kx-railsec-b{padding:2px 0 8px}.kx-system-tabs.p-tabs{margin-bottom:0;flex:none;min-width:0;border-bottom:1px solid var(--p-content-border-color)}.kx-system-tabs .p-tablist-tab-list{padding-inline:var(--kickside-system-surface-gutter, 24px)}.kx-system-tab-count{padding-inline:6px;border-radius:999px;font-size:inherit;line-height:inherit;background:color-mix(in srgb,currentColor 10%,transparent);font-variant-numeric:tabular-nums}.kx-system-toolbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;min-height:58px;padding:12px var(--kickside-system-surface-gutter, 24px);color:var(--p-text-muted-color);font-size:12.5px}.kx-system-pane{flex:1;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);overflow:auto}.kx-system-tools{grid-row:1;min-width:0}.kx-system-body{grid-row:2;min-width:0;min-height:0;overflow:auto}.kx-system-pane:has(>.kx-system-body>.kx-empty){grid-template-rows:minmax(120px,auto) minmax(0,1fr)}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-text-color)}.kx-err.inline{margin:12px 0 0}.kx-empty.kx-empty-spacious{padding:60px 24px;gap:9px}.kx-empty-spacious .kx-empty-ico{width:58px;height:58px;margin-bottom:5px}.kx-empty-spacious .kx-empty-ico svg{width:27px;height:27px}.kx-empty-spacious .kx-empty-title{font-size:14.5px}.kx-empty-spacious .kx-empty-sub{font-size:12.5px;max-width:360px;line-height:1.55}.kx-empty-ico.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 28%,transparent)}.kx-empty-ico.muted{background:var(--kx-surface-2);color:color-mix(in srgb,var(--p-text-color) 45%,transparent);border:1px solid var(--p-content-border-color)}.kx-empty>.kx-empty-cta{margin-top:8px;padding-inline:16px}.kx-loading.kx-loading-centered{flex:1;display:grid;place-items:center;padding:64px 20px}.kx-loading-inner{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:13px}.kx-loading-inner svg{width:24px;height:24px}.kx-notice{display:flex;align-items:flex-start;gap:9px;padding:11px 14px;border-radius:var(--kx-radius-14);font-size:13px;line-height:1.5;background:var(--kx-surface-2);color:var(--p-text-muted-color)}.kx-notice svg{width:16px;height:16px;flex:none;margin-top:1px}.kx-notice.info svg{color:var(--p-primary-color)}.kx-notice.warn{background:color-mix(in srgb,var(--p-warn-500) 12%,transparent);color:var(--p-text-color);border:1px solid color-mix(in srgb,var(--p-warn-500) 30%,transparent)}.kx-notice.error{background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-text-color);border:1px solid color-mix(in srgb,var(--p-danger-500) 30%,transparent)}.kx-notice.help{background:color-mix(in srgb,var(--p-help-500) 12%,transparent);color:var(--p-text-color);border:1px solid color-mix(in srgb,var(--p-help-500) 30%,transparent)}.kx-notice.warn svg{color:var(--p-warn-500)}.kx-notice.error svg{color:var(--p-danger-500)}.kx-notice.help svg{color:var(--p-help-500)}.kx-notice-action{margin-left:8px;padding:2px 10px;border-radius:var(--kx-radius-8);font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:inherit;border:1px solid currentColor}.kx-notice-action:hover:not(:disabled){background:color-mix(in srgb,currentColor 10%,transparent)}.kx-notice-action:disabled{opacity:.6;cursor:default}.kx-drawer-mask{position:fixed;inset:0;z-index:1000;display:flex;justify-content:flex-end;overflow:clip;background:color-mix(in srgb,var(--p-text-color) 32%,transparent);backdrop-filter:blur(2px)}.kx-drawer{width:min(560px,100%);min-width:0;box-sizing:border-box;height:100%;display:flex;flex-direction:column;background:var(--p-content-background);border-left:1px solid var(--p-content-border-color);box-shadow:-16px 0 50px -12px color-mix(in srgb,var(--p-text-color) 40%,transparent)}.kx-drawer-h{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--p-content-border-color);flex:none}.kx-drawer-title{display:inline-flex;align-items:center;gap:9px;font-size:15px;font-weight:700;color:var(--p-text-color)}.kx-drawer-title svg{width:18px;height:18px;color:var(--p-primary-color)}.kx-drawer-b{flex:1;min-height:0;overflow-y:auto;padding:20px 20px 36px}.kx-drawer-enter-active,.kx-drawer-leave-active{transition:opacity .22s ease}.kx-drawer-enter-active .kx-drawer,.kx-drawer-leave-active .kx-drawer{transition:transform .26s cubic-bezier(.4,0,.2,1)}.kx-drawer-enter-from,.kx-drawer-leave-to{opacity:0}.kx-drawer-enter-from .kx-drawer,.kx-drawer-leave-to .kx-drawer{transform:translate(100%)}.kx-modal-mask{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:20px;background:color-mix(in srgb,var(--p-text-color) 45%,transparent)}.kx-modal{width:min(460px,100%);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);overflow:hidden;box-shadow:0 20px 60px color-mix(in srgb,var(--p-text-color) 28%,transparent)}.kx-modal-h{display:flex;align-items:center;gap:11px;padding:14px 16px 4px}.kx-modal-h-ico{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:var(--kx-radius-14);background:var(--kx-surface-2);color:var(--p-text-muted-color)}.kx-modal.danger .kx-modal-h-ico{background:color-mix(in srgb,var(--p-danger-500) 14%,transparent);color:var(--p-danger-500)}.kx-modal-h-ico svg{width:17px;height:17px}.kx-modal-h-text{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}.kx-modal-h-title{font-size:14px;font-weight:700;color:var(--p-text-color)}.kx-modal-h-sub{font-size:12px;color:var(--p-text-muted-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-modal-body{padding:8px 16px 14px;font-size:13px;line-height:1.55;color:var(--p-text-muted-color)}.kx-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--p-content-border-color);background:var(--kx-surface-1)}.kx-modal-enter-active,.kx-modal-leave-active{transition:opacity .18s ease}.kx-modal-enter-from,.kx-modal-leave-to{opacity:0}.kx-modal-head-icon{width:38px;height:38px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-modal-head-icon svg{width:20px;height:20px}.kx-modal-head-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}.kx-modal-head-title{font-size:15.5px;font-weight:700;color:var(--p-text-color);line-height:1.2}.kx-modal-head-sub{font-size:12.5px;font-weight:400;color:var(--p-text-muted-color);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-tag-sm,.kx-tag-sm.kx-tag-sm{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:var(--kx-radius-tag, 6px);font-size:10.5px;font-weight:600;line-height:1.5;white-space:nowrap}.kx-tag-sm svg,.kx-tag-sm.kx-tag-sm svg{width:12px;height:12px}.kx-tag-caps,.kx-tag-caps.kx-tag-caps{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:var(--kx-radius-tag, 6px);font-size:9px;font-weight:700;line-height:1.5;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.kx-tag-caps svg,.kx-tag-caps.kx-tag-caps svg{width:11px;height:11px}.spin{animation:kx-spin 1s linear infinite}@keyframes kx-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation:none}}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);background:var(--p-content-background);font-family:var(--kx-font-body);font-size:13px;line-height:1.5}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}h1,h2,h3,p,dl,dd,ol,ul{margin:0}.mail-admin{height:100%}.mail-main>*{max-width:1120px}.mail-muted{color:var(--p-text-muted-color)}.mail-sub{display:block;margin-top:2px;font-size:12px;color:var(--p-text-muted-color)}.mail-sub.mail-inline{display:inline;margin:0}.mail-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.mail-block{margin:0}.mail-error{margin:0;display:flex;align-items:center;justify-content:space-between;gap:12px}.mail-stack{display:flex;flex-direction:column;gap:20px}.mail-mono,.mail-mono-block,.mail-mono-input{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.mail-mono{font-size:12px;padding:1px 6px;border-radius:6px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.mail-mono-block,.mail-value{font-size:12px;overflow-wrap:anywhere}.mail-name,.mail-text-link,.mail-row-link{padding:0;border:0;background:none;font:inherit;color:inherit;cursor:pointer;text-align:left}.mail-name{font-weight:600;color:var(--p-text-color)}.mail-name:hover,.mail-text-link:hover{text-decoration:underline}.mail-text-link{color:var(--p-primary-color);font-weight:600}.mail-name:focus-visible,.mail-text-link:focus-visible,.mail-row-link:focus-visible{outline:var(--p-focus-ring-width, 2px) var(--p-focus-ring-style, solid) var(--p-focus-ring-color, currentColor);outline-offset:2px;border-radius:4px}.mail-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.mail-search{flex:0 1 260px;min-width:180px}.mail-search .p-inputtext{width:100%}.mail-filter{width:150px}.mail-count{margin-left:auto;font-size:12.5px;color:var(--p-text-muted-color);white-space:nowrap}.mail-nomatch{padding:8px 0}.mail-more{display:flex;justify-content:center}.mail-table .p-datatable-tbody>tr{cursor:pointer}.mail-table .p-datatable-tbody>tr>td{vertical-align:middle}.mail-col-name{min-width:260px}.mail-col-kind,.mail-col-status,.mail-col-when,.mail-col-updated,.mail-col-used{white-space:nowrap}.mail-col-source{min-width:170px}.mail-kind{display:inline-flex;align-items:center;gap:6px}.mail-kind svg{width:16px;height:16px;color:var(--p-text-muted-color)}.mail-source{display:inline-flex;flex-direction:column;align-items:flex-start;gap:3px}.mail-required{margin-left:6px}.mail-card{padding:16px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.mail-facts{display:grid;grid-template-columns:minmax(120px,max-content) minmax(0,1fr);gap:8px 20px}.mail-facts dt{color:var(--p-text-muted-color)}.mail-facts dd{min-width:0;overflow-wrap:anywhere}.mail-customized{align-items:center}.mail-customized-text{flex:1;min-width:0}.mail-source-faces{display:flex;flex-direction:column;gap:8px}.mail-face-bar{display:flex;align-items:center;justify-content:space-between;gap:12px}.mail-code{margin:0;padding:12px 0;max-height:560px;overflow:auto;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;line-height:1.6;color:var(--p-text-color);background:var(--p-content-background)}.mail-code code{display:block;min-width:max-content}.mail-code-line{display:flex}.mail-code-number{flex:none;width:44px;padding-right:12px;text-align:right;color:var(--p-text-muted-color);user-select:none}.mail-code-text{white-space:pre;padding-right:16px}.mail-group{display:flex;flex-direction:column;gap:8px}.mail-group-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.mail-list{list-style:none;padding:0;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.mail-list>li{border-bottom:1px solid var(--p-content-border-color)}.mail-list>li:last-child{border-bottom:0}.mail-row-link,.mail-list-row{display:flex;align-items:center;gap:10px;width:100%;padding:12px 16px}.mail-row-link:hover{background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.mail-row-link svg,.mail-list-row svg{width:18px;height:18px;flex:none;color:var(--p-text-muted-color)}.mail-list-main{flex:1;min-width:0}.mail-history{list-style:none;padding:0;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.mail-history-row{display:flex;flex-direction:column;gap:4px;padding:14px 16px;border-bottom:1px solid var(--p-content-border-color)}.mail-history-row:last-child{border-bottom:0}.mail-history-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.mail-history-main{display:flex;flex-direction:column;min-width:0}.mail-history-title{display:inline-flex;align-items:center;gap:8px;font-weight:600}.mail-history-note{margin-top:4px}.mail-history-row .mail-facts{margin-bottom:12px}.mail-dialog{width:min(520px,calc(100vw - 32px))}.mail-dialog .mail-dialog-header{display:flex;align-items:center;gap:12px}.mail-dialog .mail-dialog-footer{display:flex;justify-content:flex-end;gap:8px}.mail-head-warn{background:color-mix(in srgb,var(--p-warn-500) 14%,transparent);color:var(--p-warn-500)}.mail-dialog-text{margin-bottom:12px}.mail-form,.mail-fieldset{display:flex;flex-direction:column;gap:14px}.mail-fieldset{border:0;padding:0;margin:0;min-width:0}.mail-field{display:flex;flex-direction:column;gap:6px}.mail-field>.p-inputtext,.mail-field>.p-select,.mail-field>.p-textarea{width:100%}.mail-field-label{font-size:12px;font-weight:600;color:var(--p-text-color)}.mail-field-hint{font-size:12px;color:var(--p-text-muted-color)}.mail-field-error{font-size:12px;color:var(--p-danger-500)}.mail-field-invalid{margin-inline:-8px;padding:6px 8px;border-radius:var(--kx-radius-8);background:color-mix(in srgb,var(--p-danger-500) 5%,transparent)}.mail-drawer-body{display:flex;flex-direction:column;gap:16px}.mail-drawer-head{display:flex;align-items:flex-start;gap:4px}.mail-drawer-title{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:6px}.mail-drawer-title h2{font-size:16px;font-weight:700;overflow-wrap:anywhere}.mail-failure-body{display:flex;flex-direction:column;gap:8px;min-width:0}.mail-failure-done{display:flex;flex-wrap:wrap;gap:6px}.mail-timeline{list-style:none;padding:0;display:flex;flex-direction:column;gap:6px}.mail-timeline li{display:flex;justify-content:space-between;gap:12px}:host{--mail-code-tag: color-mix(in srgb, var(--p-primary-color) 82%, var(--p-text-color));--mail-code-attribute: color-mix(in srgb, var(--p-help-500) 78%, var(--p-text-color));--mail-code-string: color-mix(in srgb, var(--p-success-500) 72%, var(--p-text-color));--mail-code-keyword: color-mix(in srgb, var(--p-info-500) 75%, var(--p-text-color));--mail-code-delimiter: color-mix(in srgb, var(--p-warn-500) 80%, var(--p-text-color));--mail-code-variable: color-mix(in srgb, var(--p-info-500) 55%, var(--p-text-color));--mail-code-number: color-mix(in srgb, var(--p-danger-500) 70%, var(--p-text-color))}.mail-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.mail-main.mail-main-wide>*{max-width:none}.mail-editor-layout{display:grid;grid-template-columns:minmax(0,1fr) 470px;gap:16px;align-items:start}@container (width < 980px){.mail-editor-layout{grid-template-columns:minmax(0,1fr)}}@media(max-width:1180px){.mail-editor-layout{grid-template-columns:minmax(0,1fr)}}.mail-source-column{display:flex;flex-direction:column;gap:14px;min-width:0;border:0;padding:0;margin:0}.mail-code-frame{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);overflow:hidden;background:var(--p-content-background)}.mail-code-frame:focus-within{border-color:var(--p-primary-color);box-shadow:var(--p-focus-ring-shadow, none)}.mail-code-subject .cm-content{padding:6px 0}.mail-code-body{height:clamp(320px,calc(100vh - 430px),760px)}.mail-code-version{height:420px}.mail-editor{height:100%}.mail-base-row{display:flex;align-items:center;gap:8px}.mail-base-select{width:280px;max-width:100%}.mail-blocked{font-size:12.5px}.mail-preview{position:sticky;top:0;display:flex;flex-direction:column;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);overflow:hidden;background:var(--p-content-background)}.mail-preview-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:10px;border-bottom:1px solid var(--p-content-border-color)}.mail-preview-bar .p-togglebutton svg{width:14px;height:14px;margin-right:4px}.mail-preview-with{display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid var(--p-content-border-color);font-size:12.5px;color:var(--p-text-muted-color)}.mail-preview-with .p-select{flex:1;min-width:0}.mail-preview-envelope{display:grid;grid-template-columns:64px minmax(0,1fr);gap:4px 12px;padding:10px 14px;border-bottom:1px solid var(--p-content-border-color);font-size:12.5px}.mail-preview-envelope dt{color:var(--p-text-muted-color)}.mail-preview-envelope dd{overflow-wrap:anywhere}.mail-preview-body{height:clamp(360px,calc(100vh - 380px),820px);display:flex;justify-content:center;background:color-mix(in srgb,var(--p-text-color) 4%,var(--p-content-background))}.mail-preview-stale .mail-preview-frame,.mail-preview-stale .mail-preview-text{opacity:.55}.mail-preview-frame{width:100%;height:100%;border:0;background:#fff}.mail-preview-phone .mail-preview-frame{width:375px;max-width:100%}.mail-preview-text{margin:0;width:100%;padding:16px;overflow:auto;white-space:pre-wrap;font:12.5px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:var(--p-content-background);color:var(--p-text-color)}.mail-preview-empty{padding:24px;align-self:center;text-align:center}.mail-preview-foot{display:flex;gap:8px;align-items:flex-start;padding:9px 14px;border-top:1px solid var(--p-content-border-color);font-size:12px;color:var(--p-text-muted-color)}.mail-preview-foot svg{width:14px;height:14px;flex:none;margin-top:2px}.mail-preview-problem{color:var(--p-text-color);background:color-mix(in srgb,var(--p-danger-500) 10%,transparent)}.mail-preview-problem svg{color:var(--p-danger-500)}.mail-variables{display:flex;flex-direction:column;gap:12px;border:0;padding:0;margin:0;min-width:0}.mail-variable-grid{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.mail-variable-row{display:grid;grid-template-columns:minmax(130px,1fr) 150px 72px minmax(160px,1.4fr) minmax(140px,1.2fr) 44px;gap:8px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--p-content-border-color)}.mail-variable-row:has(>:nth-child(7):not(small)){grid-template-columns:minmax(130px,1fr) 150px 72px minmax(160px,1.4fr) minmax(110px,1fr) minmax(130px,1fr) 44px}.mail-variable-row:last-child{border-bottom:0}.mail-variable-row .p-inputtext,.mail-variable-row .p-select{width:100%;min-width:0}.mail-variable-head{font-size:12px;font-weight:600;color:var(--p-text-muted-color);padding-block:10px}.mail-variable-check{display:flex;justify-content:center}.mail-variable-invalid{background:color-mix(in srgb,var(--p-danger-500) 5%,transparent)}.mail-variable-error{grid-column:1 / -1}.mail-history-actions{display:flex;gap:6px;align-items:center}.mail-dialog.mail-dialog-wide{width:min(1080px,calc(100vw - 32px))}.mail-version-subject{display:flex;gap:10px;align-items:baseline}.mail-diff{display:flex;flex-direction:column;gap:6px}.mail-diff-labels{display:grid;grid-template-columns:1fr 1fr;font-size:12px;color:var(--p-text-muted-color)}.mail-diff-view{height:460px;overflow:auto;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8)}.mail-diff-view .cm-mergeView{height:100%}.mail-diff-view .cm-changedLine{background:color-mix(in srgb,var(--p-warn-500) 10%,transparent)}.mail-diff-view .cm-changedText{background:color-mix(in srgb,var(--p-warn-500) 30%,transparent)}.mail-diff-view .cm-deletedChunk{background:color-mix(in srgb,var(--p-danger-500) 10%,transparent)}.mail-diff-view .cm-collapsedLines{color:var(--p-text-muted-color);background:color-mix(in srgb,var(--p-text-color) 5%,transparent)}.mail-change-list{margin:6px 0 0;padding-left:18px}.mail-dependents{display:flex;flex-wrap:wrap;gap:4px 12px}.mail-dialog-actions{display:flex;justify-content:flex-end;gap:8px}.mail-insert-list{max-height:360px;overflow-y:auto}.mail-row-link:disabled{opacity:.6;cursor:default}.mail-dialog.mail-dialog-gallery{width:min(1240px,calc(100vw - 32px))}.mail-gallery{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,242px);justify-content:center;gap:16px}.mail-gallery-tile{display:flex;flex-direction:column;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);overflow:hidden}.mail-gallery-failed{border-color:color-mix(in srgb,var(--p-danger-500) 45%,transparent)}.mail-gallery-open{display:flex;flex-direction:column;align-items:flex-start;padding:10px 12px;border:0;border-bottom:1px solid var(--p-content-border-color);background:none;font:inherit;color:inherit;text-align:left;cursor:pointer}.mail-gallery-open:hover{background:color-mix(in srgb,var(--p-text-color) 5%,transparent)}.mail-gallery-title{font-weight:600}.mail-gallery-frame{position:relative;height:340px;overflow:hidden;background:color-mix(in srgb,var(--p-text-color) 4%,var(--p-content-background))}.mail-gallery-frame iframe{width:375px;height:680px;border:0;background:#fff;transform:scale(.64);transform-origin:0 0;pointer-events:none}.mail-gallery-problem{display:flex;gap:8px;padding:14px;font-size:12.5px}.mail-gallery-problem svg{width:16px;height:16px;flex:none;color:var(--p-danger-500)}.mail-col-thumb{width:72px}.mail-asset-tile{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;width:44px;height:32px;border-radius:6px;font-size:8.5px;font-weight:700;letter-spacing:.3px;color:var(--p-text-muted-color);background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.mail-asset-tile svg{width:14px;height:14px}.mail-asset-actions{display:flex;gap:8px;flex-wrap:wrap}.mail-reference{display:flex;align-items:center;gap:4px}.mail-asset-context{height:320px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);overflow:hidden}.mail-asset-context iframe{width:100%;height:100%;border:0;background:#fff}.mail-file-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.mail-file-row input[type=file]{display:none}.mail-health-text{flex:1}';
function Tt(e, l) {
  return class extends gt {
    static get wippyConfig() {
      return { propsSchema: l, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: zt };
    }
    static get vueConfig() {
      return { rootComponent: e, plugins: [bt] };
    }
  };
}
const At = ["aria-labelledby"], Rt = { class: "kx-railhead" }, jt = ["id"], Ut = { key: 0 }, It = { class: "kx-railhead-acts" }, Dt = { class: "kx-rail-body" }, Lt = /* @__PURE__ */ te({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const l = pe();
    return (r, u) => (i(), s("aside", {
      class: ne(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": a(l)
    }, [
      t("div", Rt, [
        t("span", {
          id: a(l),
          class: "kx-railhead-title"
        }, [
          J(c(e.title), 1),
          e.count !== void 0 ? (i(), s("b", Ut, c(e.count), 1)) : V("", !0)
        ], 8, jt),
        t("div", It, [
          Te(r.$slots, "actions")
        ])
      ]),
      Te(r.$slots, "toolbar"),
      t("div", Dt, [
        Te(r.$slots, "default")
      ])
    ], 10, At));
  }
}), Mt = ["aria-label"], Nt = {
  key: 0,
  class: "kx-settings-rail-group"
}, Pt = ["aria-current", "onClick"], Et = { class: "kx-settings-rail-label" }, Ot = /* @__PURE__ */ te({
  __name: "SettingsRail",
  props: {
    label: {},
    title: {},
    count: {},
    value: {},
    groups: {},
    leadingItem: {}
  },
  emits: ["update:value"],
  setup(e) {
    const l = e, r = N(() => l.leadingItem ? [{ items: [l.leadingItem] }, ...l.groups] : l.groups);
    function u($) {
      const p = [...$.currentTarget.querySelectorAll(".kx-settings-rail-item")], n = p.indexOf($.target);
      if (n < 0) return;
      let w;
      switch ($.key) {
        case "ArrowDown":
        case "ArrowRight":
          w = (n + 1) % p.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          w = (n + p.length - 1) % p.length;
          break;
        case "Home":
          w = 0;
          break;
        case "End":
          w = p.length - 1;
          break;
        default:
          return;
      }
      $.preventDefault(), p[w]?.focus();
    }
    return ($, p) => (i(), B(ot(e.title ? Lt : "div"), st(nt(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ua({
      default: j(() => [
        t("nav", {
          class: ne(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: u
        }, [
          (i(!0), s(K, null, ue(r.value, (n, w) => (i(), s("div", {
            key: n.items[0]?.value ?? w,
            class: ne(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && w === 0 }])
          }, [
            n.heading ? (i(), s("div", Nt, c(n.heading), 1)) : V("", !0),
            (i(!0), s(K, null, ue(n.items, (x) => (i(), s("button", {
              key: x.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": x.value === e.value ? "true" : void 0,
              onClick: (b) => $.$emit("update:value", x.value)
            }, [
              x.icon ? (i(), B(a(D), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: x.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : V("", !0),
              t("span", Et, c(x.label), 1)
            ], 8, Pt))), 128))
          ], 2))), 128))
        ], 42, Mt)
      ]),
      _: 2
    }, [
      e.title && $.$slots.actions ? {
        name: "actions",
        fn: j(() => [
          Te($.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Bt = /* @__PURE__ */ te({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(e) {
    return (l, r) => (i(), s(K, null, [
      o(a(H), {
        type: "button",
        text: "",
        "aria-label": e.createLabel,
        title: e.createLabel,
        onClick: r[0] || (r[0] = (u) => l.$emit("create"))
      }, {
        icon: j(() => [
          o(a(D), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      o(a(H), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: r[1] || (r[1] = (u) => l.$emit("defaults"))
      }, {
        icon: j(() => [
          o(a(D), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
});
class ke extends Error {
  constructor(l, r, u) {
    super(l.message ?? l.error ?? `${r} failed`), this.name = "ApiError", this.kind = l.kind, this.details = l.details, this.retryable = l.retryable, this.status = u;
  }
}
function Ge(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ia(e, l, r) {
  return new ke({
    message: typeof e.message == "string" ? e.message : void 0,
    error: typeof e.error == "string" ? e.error : void 0,
    kind: typeof e.kind == "string" ? e.kind : void 0,
    details: Ge(e.details) ? e.details : void 0,
    retryable: typeof e.retryable == "boolean" ? e.retryable : void 0
  }, l, r);
}
function Ft(e, l) {
  if (e instanceof ke) return e;
  if (Ge(e) && Ge(e.response) && Ge(e.response.data)) {
    const { data: r, status: u } = e.response;
    return Ia(r, l, typeof u == "number" ? u : void 0);
  }
  return e instanceof Error ? e : new ke({ kind: "UNAVAILABLE" }, l);
}
async function re(e, l) {
  let r;
  try {
    r = (await e()).data;
  } catch (u) {
    throw Ft(u, l);
  }
  if (r?.success === !0 && r.data !== void 0) return r.data;
  throw r?.success === !1 ? Ia(r, l) : new ke({ kind: "INTERNAL", message: `${l}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, l);
}
const ve = "/api/v1/mail", Ie = (e) => `${ve}/library/${e.kind}/${encodeURIComponent(e.name)}`;
function ca(e) {
  const l = {};
  for (const [r, u] of Object.entries(e)) u !== void 0 && u !== "" && (l[r] = String(u));
  return l;
}
function ra(e) {
  const { kind: l, name: r, title: u, description: $, html: p, text: n, base: w, subject: x, schema: b, samples: R } = e;
  return l === "message" ? { kind: l, name: r, title: u, description: $, html: p, text: n, base: w, subject: x, schema: b, samples: R } : { kind: l, name: r, title: u, description: $, html: p, text: n, schema: b, samples: R };
}
const ie = {
  page: (e = {}) => re(() => le.get(`${ve}/library`, { params: ca({ view: "summary", limit: 100, ...e }) }), "Mail library"),
  async all(e = {}) {
    const l = [];
    let r;
    do {
      const u = await ie.page({ ...e, cursor: r });
      l.push(...u.items), r = u.next_cursor;
    } while (r);
    return l;
  },
  // Images carry no template source, so their full rows are small enough to list whole.
  assets: (e) => re(() => le.get(`${ve}/library`, { params: ca({ kind: "asset", q: e }) }), "Assets").then((l) => l.items),
  get: (e) => re(() => le.get(Ie(e)), "Mail resource"),
  history: (e) => re(() => le.get(`${Ie(e)}/history`), "Resource history").then((l) => l.items),
  copy: (e) => re(() => le.post(`${ve}/library`, e), "Create resource"),
  create: (e, l) => re(() => le.post(`${ve}/library`, { ...ra(e), note: l }), "Create resource"),
  update: (e, l, r) => re(() => le.put(Ie(e), { ...ra(e), expected_revision: l, note: r }), "Save resource"),
  reset: (e, l) => re(() => le.post(`${Ie(e)}/reset`, { expected_revision: l }), "Reset resource"),
  restore: (e, l, r) => re(() => le.post(`${Ie(e)}/restore`, { revision: l, expected_revision: r }), "Restore revision"),
  remove: (e, l) => re(() => le.delete(Ie(e), { data: { expected_revision: l } }), "Delete resource"),
  preview: (e, l) => re(() => le.post(`${ve}/library/preview`, l.length ? { message: e, resources: l.map(ra) } : { message: e }), "Preview"),
  sendTest: (e) => re(() => le.post(`${ve}/library/send-test`, { message: e }), "Send test"),
  addAsset: (e) => re(() => le.post(`${ve}/library`, { kind: "asset", ...e }), "Add image"),
  replaceAsset: (e, l) => re(() => le.put(`${ve}/library/asset/${encodeURIComponent(e.name)}`, { ...e, expected_revision: l }), "Replace image")
}, qt = {
  // The platform upload flow: the file becomes the caller's upload, which Mail adopts as an asset.
  async add(e) {
    const l = new FormData();
    return l.append("file", e), l.append("metadata", JSON.stringify({ filename: e.name })), re(async () => {
      const u = (await le.post("/api/v1/uploads", l, { headers: { "Content-Type": "multipart/form-data" } })).data;
      return { data: u?.success && u.uuid ? { success: !0, data: { uuid: u.uuid } } : { success: !1, error: u?.error } };
    }, "Upload").then((r) => r.uuid);
  }
}, Ht = {
  capabilities: () => re(() => le.get(`${ve}/capabilities`), "Mail access")
}, Ze = {
  list: (e) => re(() => le.get(`${ve}/activity`, { params: ca({ limit: 50, ...e }) }), "Mail activity"),
  get: (e) => re(() => le.get(`${ve}/activity/${encodeURIComponent(e)}`), "Mail message"),
  resend: (e) => re(() => le.post(`${ve}/activity/${encodeURIComponent(e)}/resend`, {}), "Send again")
}, Kt = {
  status: () => re(() => le.get(`${ve}/delivery`), "Delivery status")
};
function Ce(e) {
  if (!(e instanceof ke)) return;
  const l = e.details?.code;
  return typeof l == "string" ? l : void 0;
}
function Pe(e) {
  return e instanceof ke && (e.status === 403 || e.kind === "PERMISSION_DENIED");
}
function Qe(e) {
  return e instanceof ke && (e.status === 404 || e.kind === "NOT_FOUND");
}
const Da = Symbol("mail-admin");
function fe() {
  const e = ct(Da);
  if (!e) throw new Error("Mail administration context is missing");
  return e;
}
const be = { message: "Message", base: "Base template", part: "Part", asset: "Image" }, fa = { message: "Messages", base: "Base templates", part: "Parts", asset: "Assets" }, ge = { message: "tabler:mail", base: "tabler:layout", part: "tabler:puzzle", asset: "tabler:photo" }, ga = {
  created: "Created",
  edited: "Edited",
  base_changed: "Base template changed",
  reset: "Reset to the original",
  restored: "Restored",
  previous_change: "Changed"
};
function we(e, l) {
  return e?.label ?? l ?? "";
}
function Xe(e) {
  return e === void 0 ? "" : e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${Math.round(e / 1024)} KB` : `${(e / 1024 / 1024).toFixed(1)} MB`;
}
const La = { queued: "Pending", sent: "Sent", failed: "Failed" }, Ma = { queued: "secondary", sent: "success", failed: "danger" }, Jt = {
  workflow: "Workflow",
  automation: "Automation",
  agent: "Agent",
  module: "Module",
  test: "Test send"
};
function aa(e) {
  if (!e) return "";
  const l = Jt[e.kind] ?? e.kind;
  return e.kind === "test" || e.kind === "resend" ? l : e.label ? `${l} · ${e.label}` : l;
}
const Na = 1440 * 60 * 1e3, Pa = new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric" }), Ea = new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric", year: "numeric" }), Wt = new Intl.DateTimeFormat(void 0, { hour: "2-digit", minute: "2-digit" }), Yt = new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" });
function Oa(e) {
  const l = new Date(e);
  return l.setHours(0, 0, 0, 0), l.getTime();
}
function ba(e, l = Date.now()) {
  if (!e) return "—";
  const r = Oa(l);
  return e >= r ? "Today" : e >= r - Na ? "Yesterday" : new Date(e).getFullYear() === new Date(l).getFullYear() ? Pa.format(e) : Ea.format(e);
}
function Gt(e, l = Date.now()) {
  const r = ba(e, l);
  return r === "Today" || r === "Yesterday" ? r.toLowerCase() : "on " + r;
}
function Zt(e, l = Date.now()) {
  const r = Oa(l);
  return e >= r ? Wt.format(e) : e >= r - Na ? "Yesterday" : new Date(e).getFullYear() === new Date(l).getFullYear() ? Pa.format(e) : Ea.format(e);
}
function Fe(e) {
  return e ? Yt.format(e) : "—";
}
function Qt(e) {
  return e.length ? e.length === 1 ? `To ${e[0]}` : `To ${e[0]} +${e.length - 1}` : "";
}
function ye(e, l, r = l + "s") {
  return `${e} ${e === 1 ? l : r}`;
}
const oa = {
  mail_revision_conflict: "Someone saved this resource while you were looking at it. The latest version is shown now; review it and try again.",
  mail_resource_not_found: "This resource no longer exists.",
  mail_revision_not_found: "That version is no longer in History.",
  mail_resource_is_shipped: "An included resource cannot be deleted. Reset it to the original instead.",
  mail_resource_not_customized: "This resource already matches the original.",
  mail_library_denied: "Ask an administrator to grant you access to the mail library.",
  mail_delivery_denied: "Ask an administrator to grant you access to mail delivery.",
  mail_send_denied: "Ask an administrator to grant you permission to send mail.",
  mail_content_unavailable: "This message can no longer be sent again because its content was not kept.",
  mail_projection_failed: "The change was saved, but email is still using the previous version. Try again in a moment.",
  duplicate_template_name: "Two installed modules include a resource with this name. Ask an administrator to remove one of them.",
  mail_resource_collision: "An installed module now includes a resource with this name. Rename yours to keep both.",
  invalid_mail_asset: "Use a PNG, JPEG or GIF image of 1 MB or less.",
  mail_resource_in_use: "Messages still use this resource. Remove it from them first."
};
function oe(e, l) {
  if (!(e instanceof ke) || e.status === void 0) return `${l} Check your connection and try again.`;
  const r = Ce(e);
  return r && oa[r] ? oa[r] : e.status === 403 ? oa.mail_library_denied : e.status >= 500 ? `${l} Try again in a moment.` : e.message || l;
}
function Ba(e) {
  return e.trim().toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}
const Fa = /^[a-z0-9][a-z0-9_-]*$/;
function $e() {
  let e = 0;
  return () => {
    const l = ++e;
    return () => l === e;
  };
}
function za(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function qa(e) {
  return za(e) ? za(e.data) ? e.data : e : {};
}
function Xt(e) {
  const l = qa(e);
  if ((l.kind === "message" || l.kind === "base" || l.kind === "part") && typeof l.name == "string" && typeof l.revision == "number")
    return { kind: l.kind, name: l.name, revision: l.revision };
}
function ei(e) {
  const l = qa(e);
  if (typeof l.message_id == "string" && (l.status === "queued" || l.status === "sent" || l.status === "failed"))
    return { message_id: l.message_id, status: l.status };
}
function qe(e) {
  const l = ja("mail.library.changed", (r) => {
    const u = Xt(r);
    u && e(u);
  });
  ea(() => {
    typeof l == "function" && l();
  });
}
function Ha(e) {
  const l = ja("mail.message.changed", (r) => {
    const u = ei(r);
    u && e(u);
  });
  ea(() => {
    typeof l == "function" && l();
  });
}
function ai() {
  const e = he([]), l = f(!0), r = f(!1), u = f(!1), $ = f(""), p = f(0), n = $e();
  async function w() {
    const z = n();
    r.value || (l.value = !0);
    try {
      const v = await ie.all();
      if (!z()) return;
      e.value = v, $.value = "", u.value = !1, r.value = !0, p.value++;
    } catch (v) {
      if (!z()) return;
      u.value = Pe(v), $.value = u.value ? "" : oe(v, "The mail library could not be loaded.");
    } finally {
      z() && (l.value = !1);
    }
  }
  qe(() => {
    w();
  }), Be(w);
  const x = N(() => new Map(e.value.map((z) => [z.kind + "/" + z.name, z])));
  return { resources: e, loading: l, loaded: r, denied: u, error: $, version: p, load: w, find: (z, v) => x.value.get(z + "/" + v), ofKind: (z) => e.value.filter((v) => v.kind === z).sort((v, S) => v.title.localeCompare(S.title)) };
}
const ti = { class: "kx-empty" }, ii = { class: "kx-empty-ico" }, li = { class: "kx-empty-title" }, ri = {
  key: 0,
  class: "kx-empty-sub"
}, ha = /* @__PURE__ */ te({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(e) {
    return (l, r) => (i(), s("div", ti, [
      t("div", ii, [
        o(a(D), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      t("div", li, c(e.title), 1),
      e.hint || l.$slots.hint ? (i(), s("p", ri, [
        Te(l.$slots, "hint", {}, () => [
          J(c(e.hint), 1)
        ])
      ])) : V("", !0),
      e.cta ? (i(), B(a(H), {
        key: 1,
        label: e.cta,
        onClick: r[0] || (r[0] = (u) => l.$emit("cta"))
      }, ua({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: j(({ class: u }) => [
            o(a(D), {
              icon: e.ctaIcon,
              class: ne(u),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : V("", !0)
    ]));
  }
}), oi = { class: "system-section-head" }, si = { class: "system-section-head-text" }, ni = {
  key: 0,
  class: "kx-head-actions"
}, ta = /* @__PURE__ */ te({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (l, r) => (i(), s("header", oi, [
      t("div", si, [
        t("h1", null, c(e.title), 1),
        t("p", null, c(e.description), 1)
      ]),
      l.$slots.actions ? (i(), s("div", ni, [
        Te(l.$slots, "actions")
      ])) : V("", !0)
    ]));
  }
}), ya = {
  message: "messages",
  base: "bases",
  part: "parts"
}, Ka = Object.fromEntries(Object.entries(ya).map(([e, l]) => [l, e])), ci = ["content", "variables", "used-by", "history"];
function da(e) {
  return ya[e];
}
function di(e) {
  return Ka[e];
}
function Ja(e) {
  return e === "base" ? ["content", "used-by", "history"] : ci;
}
function Ta(e) {
  return e.name === "activity" ? e.message ? `activity/${encodeURIComponent(e.message)}` : e.template ? `activity/template/${encodeURIComponent(e.template)}` : "activity" : e.name === "library" ? e.section === "assets" && e.asset ? `assets/${encodeURIComponent(e.asset)}` : e.section === "all" ? "" : e.section : `${ya[e.kind]}/${encodeURIComponent(e.resource)}/${e.section}`;
}
function Aa(e) {
  const l = (e ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [r, u, $] = l;
  if (!r) return { name: "library", section: "all" };
  try {
    if (r === "activity")
      return u === "template" && $ ? { name: "activity", template: decodeURIComponent($) } : u ? { name: "activity", message: decodeURIComponent(u) } : { name: "activity" };
    if (r === "assets") return u ? { name: "library", section: "assets", asset: decodeURIComponent(u) } : { name: "library", section: "assets" };
    const p = Ka[r];
    if (!p) return { name: "library", section: "all" };
    if (!u) return { name: "library", section: r };
    const w = Ja(p).find((x) => x === $) ?? "content";
    return { name: "resource", kind: p, resource: decodeURIComponent(u), section: w };
  } catch {
    return { name: "library", section: "all" };
  }
}
function xa(e, l) {
  let r = e;
  for (const [u, $] of Object.entries(l ?? {}))
    r = r.split("cid:" + u).join($);
  return r;
}
const Ra = ["html", "text", "subject", "variables", "samples"];
function sa(e) {
  return !!e && typeof e == "object" && typeof e.kind == "string" && typeof e.name == "string";
}
function Le(e) {
  if (!(e instanceof ke)) return;
  const l = e.details ?? {};
  if (Ce(e) === "mail_resource_in_use") {
    const n = Array.isArray(l.messages) ? l.messages.filter((x) => typeof x == "string") : [], w = l.dependent;
    return {
      message: e.message,
      dependents: n,
      face: Ra.find((x) => x === w?.face),
      resource: sa(w?.resource) ? w.resource : void 0
    };
  }
  const u = Ra.find((n) => n === l.face);
  if (!u) return;
  const $ = Array.isArray(l.dependent_messages) ? l.dependent_messages.filter((n) => typeof n == "string") : [], p = Array.isArray(l.errors) ? l.errors.flatMap((n) => {
    const w = n;
    return sa(w.resource) && typeof w.message == "string" ? [{ name: w.resource.name, message: w.message }] : [];
  }) : [];
  return {
    message: e.message,
    face: u,
    resource: sa(l.resource) ? l.resource : void 0,
    dependents: $.length ? $ : void 0,
    reasons: p.length ? p : void 0
  };
}
const ze = {
  html: "HTML",
  text: "Plain text",
  subject: "Subject",
  variables: "Variables",
  samples: "Sample values"
}, ui = { class: "kx-modal-head-icon" }, pi = {
  key: 0,
  class: "mail-muted"
}, mi = { class: "mail-gallery" }, vi = ["aria-label", "onClick"], fi = { class: "mail-gallery-title" }, gi = { class: "mail-sub" }, bi = { class: "mail-gallery-frame" }, hi = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, yi = {
  key: 1,
  class: "mail-gallery-problem",
  role: "status"
}, xi = ["srcdoc", "title"], ki = /* @__PURE__ */ te({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: l }) {
    const r = e, u = l, { library: $, go: p } = fe(), n = f([]);
    let w = 0;
    async function x(v, S) {
      try {
        const d = await ie.preview(v.name, []);
        if (S !== w) return;
        v.subject = d.subject, v.document = d.html ? xa(d.html, d.inline_assets) : "", v.state = "ready";
      } catch (d) {
        if (S !== w) return;
        const m = Le(d), y = m?.resource && m.resource.name !== v.name ? ($.find(m.resource.kind, m.resource.name)?.title ?? m.resource.name) + ", " : "";
        v.problem = m ? `${y}${m.face ? ze[m.face] + ": " : ""}${m.message}` : oe(d, "This message could not be rendered."), v.state = "failed";
      }
    }
    async function b() {
      const v = ++w;
      n.value = $.ofKind("message").map((m) => dt({ name: m.name, title: m.title, state: "loading" }));
      const S = [...n.value], d = Array.from({ length: 3 }, async () => {
        for (let m = S.shift(); m; m = S.shift()) await x(m, v);
      });
      await Promise.all(d);
    }
    X(() => r.visible, (v) => {
      v ? b() : w++;
    });
    function R(v) {
      u("close"), p({ name: "resource", kind: "message", resource: v, section: "content" });
    }
    const z = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (v, S) => (i(), B(a(je), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: z,
      "aria-label": "Preview all messages",
      "onUpdate:visible": S[0] || (S[0] = (d) => {
        d || u("close");
      })
    }, {
      header: j(() => [
        t("span", ui, [
          o(a(D), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        S[1] || (S[1] = t("span", { class: "kx-modal-head-text" }, [
          t("span", { class: "kx-modal-head-title" }, "All messages"),
          t("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: j(() => [
        o(a(H), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          onClick: b
        }, {
          icon: j(() => [
            o(a(D), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ]),
      default: j(() => [
        n.value.length ? V("", !0) : (i(), s("p", pi, "There are no messages yet.")),
        t("ul", mi, [
          (i(!0), s(K, null, ue(n.value, (d) => (i(), s("li", {
            key: d.name,
            class: ne(["mail-gallery-tile", { "mail-gallery-failed": d.state === "failed" }])
          }, [
            t("button", {
              type: "button",
              class: "mail-gallery-open",
              "aria-label": "Open " + d.title,
              onClick: (m) => R(d.name)
            }, [
              t("span", fi, c(d.title), 1),
              t("span", gi, c(d.subject ?? ""), 1)
            ], 8, vi),
            t("div", bi, [
              d.state === "loading" ? (i(), s("p", hi, [
                o(a(D), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                S[2] || (S[2] = J("Rendering…", -1))
              ])) : d.state === "failed" ? (i(), s("p", yi, [
                o(a(D), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                J(c(d.problem), 1)
              ])) : (i(), s("iframe", {
                key: 2,
                sandbox: "",
                srcdoc: d.document,
                title: d.title + " preview",
                tabindex: "-1"
              }, null, 8, xi))
            ])
          ], 2))), 128))
        ])
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), wi = { class: "mail-source" }, $i = { key: 0 }, _i = { key: 1 }, ka = /* @__PURE__ */ te({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(e) {
    return (l, r) => (i(), s("span", wi, [
      e.resource.state === "created" ? (i(), s("span", $i, c((e.resource.kind === "asset" ? "Uploaded by " : "Created by ") + a(we)(e.resource.author_label, e.resource.author)), 1)) : (i(), s("span", _i, "Included with " + c(e.resource.origin_label), 1)),
      e.resource.state === "customized" ? (i(), B(a(Ae), {
        key: 2,
        severity: "info",
        value: e.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : V("", !0)
    ]));
  }
}), Ci = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Vi = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, Si = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, zi = { class: "mail-toolbar" }, Ti = {
  class: "mail-count",
  role: "status"
}, Ai = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Ri = ["onClick"], ji = {
  key: 0,
  class: "mail-sub"
}, Ui = { class: "mail-kind" }, Ii = { class: "mail-muted" }, Di = {
  key: 2,
  class: "mail-more"
}, Li = /* @__PURE__ */ te({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(e) {
    const l = e, { library: r, go: u, create: $ } = fe(), p = N(() => di(l.section)), n = f("all"), w = f(""), x = f("");
    let b;
    X(w, (O) => {
      clearTimeout(b), b = setTimeout(() => {
        x.value = O.trim();
      }, 250);
    }), X(() => l.section, () => {
      w.value = x.value = "", n.value = "all";
    });
    const R = he([]), z = f(), v = f(!0), S = f(!1), d = f(!1), m = f(!1), y = f(""), P = $e(), T = () => ({ kind: p.value, state: n.value === "all" ? void 0 : n.value, q: x.value || void 0 });
    async function A() {
      const O = P();
      v.value = !0;
      try {
        const q = await ie.page(T());
        if (!O()) return;
        R.value = q.items, z.value = q.next_cursor, y.value = "", m.value = !1, S.value = !0;
      } catch (q) {
        if (!O()) return;
        m.value = Pe(q), y.value = m.value ? "" : oe(q, "The mail library could not be loaded.");
      } finally {
        O() && (v.value = !1);
      }
    }
    async function _() {
      if (!z.value || d.value) return;
      const O = P();
      d.value = !0;
      try {
        const q = await ie.page({ ...T(), cursor: z.value });
        if (!O()) return;
        R.value = [...R.value, ...q.items], z.value = q.next_cursor;
      } catch (q) {
        O() && (y.value = oe(q, "More resources could not be loaded."));
      } finally {
        d.value = !1;
      }
    }
    X([p, n, x], () => {
      A();
    }), Be(A), qe(() => {
      A();
    });
    const k = N(() => {
      switch (p.value) {
        case "message":
          return { title: "Messages", description: "What recipients read. Each message follows its base template." };
        case "base":
          return { title: "Base templates", description: "The frame around messages: the page, the header and the footer." };
        case "part":
          return { title: "Parts", description: "Reusable pieces that templates include, such as the header, footer and buttons." };
        default:
          return { title: "All resources", description: "Everything your email is made of. Messages follow the base templates and parts they use." };
      }
    }), F = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], W = { base: 0, part: 1, message: 2, asset: 3 }, U = N(() => [...R.value].sort((O, q) => W[O.kind] - W[q.kind] || O.title.localeCompare(q.title))), g = N(() => {
      const O = p.value ? be[p.value].toLowerCase() : "resource";
      return ye(R.value.length, O) + (z.value ? " so far" : "");
    });
    function I(O) {
      const q = O.used_by;
      return O.kind === "base" || O.kind === "asset" ? q?.messages ? ye(q.messages, "message") : "—" : O.kind === "message" ? q?.recent_sources ? ye(q.recent_sources, "recent sender") : "—" : "";
    }
    function C(O) {
      return O.base ? r.find("base", O.base)?.title ?? O.base : "";
    }
    function h(O) {
      O.kind === "asset" ? u({ name: "library", section: "assets", asset: O.name }) : u({ name: "resource", kind: O.kind, resource: O.name, section: "content" });
    }
    const Z = N(() => S.value && !y.value && p.value && !R.value.length && n.value === "all" && !x.value), L = f(!1);
    return (O, q) => (i(), s(K, null, [
      o(ta, {
        title: k.value.title,
        description: k.value.description
      }, {
        actions: j(() => [
          !p.value || p.value === "message" ? (i(), B(a(H), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: q[0] || (q[0] = (Q) => L.value = !0)
          }, {
            icon: j(() => [
              o(a(D), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : V("", !0),
          o(a(H), {
            label: p.value ? "New " + a(be)[p.value].toLowerCase() : "New",
            onClick: q[1] || (q[1] = (Q) => a($)({ kind: p.value }))
          }, {
            icon: j(() => [
              o(a(D), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      m.value ? (i(), s("p", Ci, [
        o(a(D), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        q[8] || (q[8] = J("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : y.value ? (i(), s("div", Vi, [
        t("span", null, c(y.value), 1),
        o(a(H), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: q[2] || (q[2] = (Q) => A())
        })
      ])) : v.value && !S.value ? (i(), s("p", Si, [
        o(a(D), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        q[9] || (q[9] = J("Loading mail library…", -1))
      ])) : Z.value && p.value ? (i(), B(ha, {
        key: 3,
        icon: a(ge)[p.value],
        title: "No " + a(fa)[p.value].toLowerCase() + " yet",
        hint: "Create a " + a(be)[p.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + a(be)[p.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: q[3] || (q[3] = (Q) => a($)({ kind: p.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : S.value ? (i(), s(K, { key: 4 }, [
        t("div", zi, [
          o(a(xe), {
            modelValue: n.value,
            "onUpdate:modelValue": q[4] || (q[4] = (Q) => n.value = Q),
            options: F,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          o(a(ma), { class: "mail-search" }, {
            default: j(() => [
              o(a(va), null, {
                default: j(() => [
                  o(a(D), {
                    icon: v.value ? "tabler:loader-2" : "tabler:search",
                    class: ne({ spin: v.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              o(a(me), {
                modelValue: w.value,
                "onUpdate:modelValue": q[5] || (q[5] = (Q) => w.value = Q),
                type: "search",
                "aria-label": "Search " + k.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          t("span", Ti, c(g.value), 1)
        ]),
        R.value.length ? (i(), B(a(pa), {
          key: 1,
          value: U.value,
          "data-key": (Q) => Q.kind + "/" + Q.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": k.value.title } },
          onRowClick: q[6] || (q[6] = (Q) => h(Q.data))
        }, {
          default: j(() => [
            o(a(de), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: j(({ data: Q }) => [
                t("button", {
                  type: "button",
                  class: "mail-name",
                  onClick: Re((ee) => h(Q), ["stop"])
                }, c(Q.title), 9, Ri),
                Q.description ? (i(), s("span", ji, c(Q.description), 1)) : V("", !0)
              ]),
              _: 1
            }),
            p.value ? V("", !0) : (i(), B(a(de), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: j(({ data: Q }) => [
                t("span", Ui, [
                  o(a(D), {
                    icon: a(ge)[Q.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  J(c(a(be)[Q.kind]), 1)
                ])
              ]),
              _: 1
            })),
            p.value === "message" ? (i(), B(a(de), {
              key: 1,
              header: "Base template"
            }, {
              body: j(({ data: Q }) => [
                J(c(C(Q)), 1)
              ]),
              _: 1
            })) : V("", !0),
            o(a(de), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: j(({ data: Q }) => [
                o(ka, { resource: Q }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            p.value !== "part" ? (i(), B(a(de), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: j(({ data: Q }) => [
                J(c(I(Q)), 1)
              ]),
              _: 1
            })) : V("", !0),
            o(a(de), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: j(({ data: Q }) => [
                t("span", Ii, c(Q.state === "original" ? "—" : a(ba)(Q.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (i(), s("p", Ai, "Nothing matches. Try another name or a word from the template.")),
        z.value ? (i(), s("div", Di, [
          o(a(H), {
            label: "Show more",
            severity: "secondary",
            outlined: "",
            loading: d.value,
            onClick: _
          }, null, 8, ["loading"])
        ])) : V("", !0)
      ], 64)) : V("", !0),
      o(ki, {
        visible: L.value,
        onClose: q[7] || (q[7] = (Q) => L.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
}), Mi = /* @__PURE__ */ te({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (l, r) => (i(), s(K, null, [
      o(a(Ae), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      o(a(H), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: r[0] || (r[0] = (u) => l.$emit("discard"))
      }, {
        icon: j(() => [
          o(a(D), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      o(a(H), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: r[1] || (r[1] = (u) => l.$emit("review", u.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
});
function Ne(e) {
  return Array.isArray(e.properties) ? {} : e.properties;
}
function Oe(e) {
  return Array.isArray(e.samples) ? {} : e.samples;
}
function Ni(e) {
  return JSON.parse(JSON.stringify(e));
}
function _e(e) {
  const l = Ni(e);
  return {
    kind: l.kind,
    name: l.name,
    title: l.title,
    description: l.description,
    html: l.html,
    text: l.text,
    base: l.base,
    subject: l.subject,
    schema: { ...l.schema, properties: Ne(l.schema) },
    samples: Oe(l)
  };
}
function Pi(e, l) {
  return JSON.stringify(_e(e)) === JSON.stringify(_e(l));
}
function Ei(e, l, r, u, $) {
  const p = { type: "object", properties: {} };
  return e === "message" ? {
    kind: e,
    name: l,
    title: r,
    description: u,
    base: $,
    subject: r,
    schema: p,
    samples: {},
    html: `{{ block body() }}
  <p>Write your message here.</p>
{{ end }}
`,
    text: `{{ block body() }}
Write your message here.
{{ end }}
`
  } : e === "base" ? {
    kind: e,
    name: l,
    title: r,
    description: u,
    schema: p,
    samples: {},
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{ message.subject }}</title>
</head>
<body>
  {{ block body() }}{{ end }}
</body>
</html>
`,
    text: `{{ block body() }}{{ end }}
`
  } : { kind: e, name: l, title: r, description: u, schema: p, samples: {}, html: `<p>{{ site.title }}</p>
`, text: `{{ site.title }}
` };
}
function Oi(e) {
  if (typeof e == "string") return JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean") return String(e);
}
function Bi(e) {
  const l = [], r = Oe(e);
  for (const [u, $] of Object.entries(Ne(e.schema))) {
    const p = Oi(r[u] ?? $.default ?? ($.type === "string" ? "" : null));
    p !== void 0 && l.push(`${JSON.stringify(u)}, ${p}`);
  }
  return l.length ? `{{ include "/part/${e.name}" map(${l.join(", ")}) }}` : `{{ include "/part/${e.name}" }}`;
}
function Wa(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ assets.${e} }}` : `{{ assets[${JSON.stringify(e)}] }}`;
}
function Fi(e, l, r) {
  const u = r ? ` width="${r}"` : "";
  return `<img src="${Wa(e)}" alt="${l.replace(/"/g, "&quot;")}"${u} style="display:block;border:0;max-width:100%;height:auto;">`;
}
const qi = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function Hi(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) && !qi.has(e) ? `{{ ${e} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ vars.${e} }}` : `{{ vars[${JSON.stringify(e)}] }}`;
}
const Ki = "{{ block body() }}{{ end }}", Ji = {
  class: "mail-preview",
  "aria-label": "Preview"
}, Wi = { class: "mail-preview-bar" }, Yi = {
  key: 0,
  class: "mail-preview-with"
}, Gi = ["for"], Zi = {
  key: 1,
  class: "mail-preview-envelope"
}, Qi = ["aria-busy"], Xi = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, el = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, al = ["srcdoc", "title"], tl = {
  key: 1,
  class: "mail-preview-text"
}, il = {
  key: 2,
  class: "mail-preview-foot mail-preview-problem",
  role: "status"
}, ll = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, rl = {
  key: 4,
  class: "mail-preview-foot"
}, ol = /* @__PURE__ */ te({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(e, { emit: l }) {
    const r = e, u = l, { library: $, delivery: p } = fe(), n = { message: pe() }, w = f("email"), x = f("desktop"), b = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], R = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], z = N(() => (r.messages ?? $.ofKind("message").map((h) => h.name)).map((h) => ({ value: h, label: $.find("message", h)?.title ?? h }))), v = f("");
    X(z, (C) => {
      r.draft.kind !== "message" && (C.some((h) => h.value === v.value) || (v.value = C[0]?.value ?? ""));
    }, { immediate: !0 });
    const S = N(() => r.draft.kind === "message" ? r.draft.name : v.value), d = he(), m = f(!1), y = f(), P = f(""), T = $e();
    let A, _ = !1, k = !1;
    async function F() {
      const C = S.value;
      if (!C) return;
      if (_) {
        k = !0;
        return;
      }
      _ = !0;
      const h = T();
      m.value = !0;
      try {
        const Z = await ie.preview(C, [r.draft]);
        if (!h()) return;
        d.value = Z, y.value = void 0, P.value = "";
      } catch (Z) {
        if (!h()) return;
        const L = Le(Z);
        y.value = L ? { ...L, previewOf: C } : void 0, P.value = y.value ? "" : oe(Z, "The preview could not be rendered.");
      } finally {
        _ = !1, h() && (m.value = !1), k && (k = !1, F());
      }
    }
    function W() {
      clearTimeout(A), A = setTimeout(() => {
        F();
      }, 450);
    }
    X(() => JSON.stringify(r.draft), W), X(S, () => {
      d.value = void 0, F();
    }, { immediate: !0 }), X(y, (C) => u("problem", C)), ea(() => clearTimeout(A));
    const U = N(() => d.value?.html ? xa(d.value.html, d.value.inline_assets) : ""), g = N(() => {
      const C = p.value?.from;
      return C ? C.name ? `${C.name} <${C.address}>` : C.address : "";
    }), I = N(() => {
      const C = y.value;
      if (!C) return "";
      const h = C.resource, Z = h ? $.find(h.kind, h.name)?.title ?? h.name : "";
      return h && r.draft.kind !== "message" && h.kind === "message" && h.name === C.previewOf ? `${Z} does not render with your changes. ${C.message}` : `${h && (h.kind !== r.draft.kind || h.name !== r.draft.name) ? Z + ", " : ""}${C.face ? ze[C.face] + ": " : ""}${C.message}`;
    });
    return (C, h) => (i(), s("section", Ji, [
      t("div", Wi, [
        o(a(xe), {
          modelValue: w.value,
          "onUpdate:modelValue": h[0] || (h[0] = (Z) => w.value = Z),
          options: b,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        w.value === "email" ? (i(), B(a(xe), {
          key: 0,
          modelValue: x.value,
          "onUpdate:modelValue": h[1] || (h[1] = (Z) => x.value = Z),
          options: R,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: j(({ option: Z }) => [
            o(a(D), {
              icon: Z.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            J(c(Z.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : V("", !0)
      ]),
      e.draft.kind !== "message" ? (i(), s("div", Yi, [
        t("label", {
          for: n.message
        }, "Preview with", 8, Gi),
        o(a(Me), {
          modelValue: v.value,
          "onUpdate:modelValue": h[2] || (h[2] = (Z) => v.value = Z),
          "input-id": n.message,
          options: z.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self",
          placeholder: "Choose a message…",
          "empty-message": "No messages yet"
        }, null, 8, ["modelValue", "input-id", "options"])
      ])) : V("", !0),
      d.value ? (i(), s("dl", Zi, [
        g.value ? (i(), s(K, { key: 0 }, [
          h[3] || (h[3] = t("dt", null, "From", -1)),
          t("dd", null, c(g.value), 1)
        ], 64)) : V("", !0),
        h[4] || (h[4] = t("dt", null, "Subject", -1)),
        t("dd", null, c(d.value.subject), 1)
      ])) : V("", !0),
      t("div", {
        class: ne(["mail-preview-body", ["mail-preview-" + x.value, { "mail-preview-stale": y.value || P.value }]]),
        "aria-busy": m.value
      }, [
        !d.value && m.value ? (i(), s("p", Xi, [
          o(a(D), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          h[5] || (h[5] = J("Rendering preview…", -1))
        ])) : S.value ? d.value ? (i(), s(K, { key: 2 }, [
          w.value === "email" ? (i(), s("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: U.value,
            title: "Email preview: " + (d.value.subject ?? "")
          }, null, 8, al)) : (i(), s("pre", tl, c(d.value.text), 1))
        ], 64)) : V("", !0) : (i(), s("p", el, "Choose a message to see this " + c(e.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, Qi),
      y.value ? (i(), s("p", il, [
        o(a(D), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, c(d.value ? "Showing the last version that rendered." : "The draft does not render yet.") + " " + c(I.value), 1)
      ])) : P.value ? (i(), s("p", ll, [
        o(a(D), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, c(P.value), 1)
      ])) : (i(), s("p", rl, [
        o(a(D), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        J(" " + c(e.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), sl = { class: "kx-modal-head-icon" }, nl = { class: "kx-modal-head-text" }, cl = { class: "kx-modal-head-sub" }, dl = { class: "mail-change-list" }, ul = { class: "mail-muted" }, pl = { class: "mail-field" }, ml = ["for"], vl = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, fl = { class: "mail-failure-body" }, gl = { class: "mail-dependents" }, bl = ["onClick"], hl = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, yl = /* @__PURE__ */ te({
  __name: "ReviewDialog",
  props: {
    visible: { type: Boolean },
    saved: {},
    draft: {},
    busy: { type: Boolean },
    error: {},
    dependents: {}
  },
  emits: ["close", "save"],
  setup(e, { emit: l }) {
    const r = e, u = l, { library: $, go: p } = fe(), n = f(""), w = pe();
    X(() => r.visible, (z) => {
      z && (n.value = "");
    });
    const x = N(() => {
      const z = r.saved, v = r.draft, S = [];
      return (z.title !== v.title || z.description !== v.description) && S.push("Name and description"), z.base !== v.base && S.push(`Base template: ${$.find("base", v.base ?? "")?.title ?? v.base}`), z.subject !== v.subject && S.push("Subject"), z.html !== v.html && S.push("HTML"), z.text !== v.text && S.push("Plain text"), (JSON.stringify(Ne(z.schema)) !== JSON.stringify(Ne(v.schema)) || JSON.stringify(z.schema.required ?? []) !== JSON.stringify(v.schema.required ?? [])) && S.push(v.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(Oe(z)) !== JSON.stringify(Oe(v)) && S.push("Sample values"), S;
    }), b = N(() => r.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${be[r.draft.kind].toLowerCase()} changes when you save.`), R = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (z, v) => (i(), B(a(je), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !e.busy,
      "close-on-escape": !e.busy,
      class: "mail-dialog",
      pt: R,
      "aria-label": "Review changes",
      "onUpdate:visible": v[3] || (v[3] = (S) => {
        S || u("close");
      })
    }, {
      header: j(() => [
        t("span", sl, [
          o(a(D), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        t("span", nl, [
          v[4] || (v[4] = t("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          t("span", cl, c(e.draft.title), 1)
        ])
      ]),
      footer: j(() => [
        o(a(H), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: v[2] || (v[2] = (S) => u("close"))
        }, null, 8, ["disabled"]),
        o(a(H), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: e.busy,
          disabled: !!e.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: j(() => [
        t("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: v[1] || (v[1] = Re((S) => u("save", n.value.trim()), ["prevent"]))
        }, [
          t("div", null, [
            v[5] || (v[5] = t("p", { class: "mail-field-label" }, "Changed", -1)),
            t("ul", dl, [
              (i(!0), s(K, null, ue(x.value, (S) => (i(), s("li", { key: S }, c(S), 1))), 128))
            ])
          ]),
          t("p", ul, c(b.value) + " The previous version stays in History.", 1),
          t("div", pl, [
            t("label", {
              class: "mail-field-label",
              for: a(w)
            }, "Note for History", 8, ml),
            o(a(me), {
              id: a(w),
              modelValue: n.value,
              "onUpdate:modelValue": v[0] || (v[0] = (S) => n.value = S),
              placeholder: "What changed and why…",
              disabled: e.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          e.dependents ? (i(), s("div", vl, [
            o(a(D), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("div", fl, [
              t("strong", null, c(e.dependents.names.length === 1 ? "1 message would break" : e.dependents.names.length + " messages would break") + ".", 1),
              t("span", null, c(e.dependents.reason), 1),
              t("span", gl, [
                (i(!0), s(K, null, ue(e.dependents.names, (S) => (i(), s("button", {
                  key: S,
                  type: "button",
                  class: "mail-text-link",
                  onClick: (d) => {
                    u("close"), a(p)({ name: "resource", kind: "message", resource: S, section: "content" });
                  }
                }, c(a($).find("message", S)?.title ?? S), 9, bl))), 128))
              ])
            ])
          ])) : e.error ? (i(), s("p", hl, c(e.error), 1)) : V("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), Ya = /* @__PURE__ */ te({
  __name: "Disclosure",
  props: /* @__PURE__ */ pt({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const l = ut(e, "open");
    return (r, u) => (i(), B(a(kt), {
      class: "kx-disclosure",
      value: l.value ? "content" : void 0,
      "onUpdate:value": u[0] || (u[0] = ($) => l.value = $ === "content")
    }, {
      default: j(() => [
        o(a(_t), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: j(() => [
            o(a($t), { class: "kx-disclosure-toggle" }, {
              default: j(() => [
                J(c(e.label), 1)
              ]),
              _: 1
            }),
            o(a(wt), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: j(() => [
                Te(r.$slots, "default")
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
}), xl = { class: "kx-modal-head-icon" }, kl = { class: "kx-modal-head-text" }, wl = { class: "kx-modal-head-sub" }, $l = { class: "mail-form" }, _l = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Cl = {
  key: 1,
  class: "mail-list mail-insert-list"
}, Vl = ["onClick"], Sl = { class: "mail-list-main" }, zl = { class: "mail-mono" }, Tl = {
  key: 0,
  class: "mail-sub"
}, Al = {
  key: 0,
  class: "mail-muted"
}, Rl = {
  key: 1,
  class: "mail-list mail-insert-list"
}, jl = ["disabled", "onClick"], Ul = { class: "mail-list-main" }, Il = { class: "mail-sub" }, Dl = { class: "mail-field" }, Ll = ["for"], Ml = { class: "mail-dialog-actions" }, Nl = {
  key: 1,
  class: "mail-muted"
}, Pl = {
  key: 2,
  class: "mail-list mail-insert-list"
}, El = ["disabled", "onClick"], Ol = { class: "mail-list-main" }, Bl = { class: "mail-sub mail-mono-block" }, Fl = {
  key: 4,
  class: "mail-list mail-insert-list"
}, ql = /* @__PURE__ */ te({
  __name: "InsertDialog",
  props: {
    visible: { type: Boolean },
    draft: {},
    face: {}
  },
  emits: ["close", "insert"],
  setup(e, { emit: l }) {
    const r = e, u = l, { library: $ } = fe(), p = f("variable"), n = N(() => [
      { label: "Variable", value: "variable" },
      { label: "Part", value: "part" },
      ...r.face === "html" ? [{ label: "Image", value: "image" }] : [],
      ...r.draft.kind === "base" ? [{ label: "Message body", value: "block" }] : []
    ]);
    X(() => r.visible, (A) => {
      A && (p.value = "variable", d.value = void 0, v.value = "");
    });
    const w = [
      { name: "site.title", hint: "Your workspace name" },
      { name: "site.url", hint: "Your workspace address" },
      { name: "sender.name", hint: "The person sending the message" },
      { name: "message.subject", hint: "This message’s subject" }
    ], x = N(() => [...Object.entries(Ne(r.draft.schema)).map(([_, k]) => ({
      text: r.draft.kind === "part" ? `{{ .${_} }}` : Hi(_),
      name: _,
      hint: typeof k.description == "string" ? k.description : ""
    })), ...w.map((_) => ({ text: `{{ ${_.name} }}`, name: _.name, hint: _.hint }))]), b = N(() => $.ofKind("part").filter((A) => !(r.draft.kind === "part" && A.name === r.draft.name))), R = N(() => $.ofKind("asset")), z = f(""), v = f("");
    async function S(A) {
      z.value = A, v.value = "";
      try {
        u("insert", Bi(await ie.get({ kind: "part", name: A })));
      } catch (_) {
        v.value = oe(_, "The part could not be read.");
      } finally {
        z.value = "";
      }
    }
    const d = f(), m = f(""), y = pe();
    async function P(A, _) {
      z.value = A, v.value = "";
      try {
        const k = await ie.get({ kind: "asset", name: A });
        d.value = { name: A, title: _, width: k.asset?.width }, m.value = _;
      } catch (k) {
        v.value = oe(k, "The image could not be read.");
      } finally {
        z.value = "";
      }
    }
    const T = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (A, _) => (i(), B(a(je), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog",
      pt: T,
      "aria-label": "Insert",
      "onUpdate:visible": _[5] || (_[5] = (k) => {
        k || u("close");
      })
    }, {
      header: j(() => [
        t("span", xl, [
          o(a(D), {
            icon: "tabler:code-plus",
            "aria-hidden": "true"
          })
        ]),
        t("span", kl, [
          _[6] || (_[6] = t("span", { class: "kx-modal-head-title" }, "Insert", -1)),
          t("span", wl, "Added at the cursor in " + c(e.face === "html" ? "HTML" : "plain text") + ".", 1)
        ])
      ]),
      default: j(() => [
        t("div", $l, [
          o(a(xe), {
            modelValue: p.value,
            "onUpdate:modelValue": _[0] || (_[0] = (k) => p.value = k),
            options: n.value,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "What to insert"
          }, null, 8, ["modelValue", "options"]),
          v.value ? (i(), s("p", _l, c(v.value), 1)) : V("", !0),
          p.value === "variable" ? (i(), s("ul", Cl, [
            (i(!0), s(K, null, ue(x.value, (k) => (i(), s("li", {
              key: k.name
            }, [
              t("button", {
                type: "button",
                class: "mail-row-link",
                onClick: (F) => u("insert", k.text)
              }, [
                o(a(D), {
                  icon: "tabler:variable",
                  "aria-hidden": "true"
                }),
                t("span", Sl, [
                  t("span", zl, c(k.name), 1),
                  k.hint ? (i(), s("span", Tl, c(k.hint), 1)) : V("", !0)
                ])
              ], 8, Vl)
            ]))), 128))
          ])) : p.value === "part" ? (i(), s(K, { key: 2 }, [
            b.value.length ? (i(), s("ul", Rl, [
              (i(!0), s(K, null, ue(b.value, (k) => (i(), s("li", {
                key: k.name
              }, [
                t("button", {
                  type: "button",
                  class: "mail-row-link",
                  disabled: !!z.value,
                  onClick: (F) => S(k.name)
                }, [
                  o(a(D), {
                    icon: z.value === k.name ? "tabler:loader-2" : a(ge).part,
                    class: ne({ spin: z.value === k.name }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"]),
                  t("span", Ul, [
                    t("span", null, c(k.title), 1),
                    t("span", Il, c(k.description), 1)
                  ])
                ], 8, jl)
              ]))), 128))
            ])) : (i(), s("p", Al, "There are no parts to include yet."))
          ], 64)) : p.value === "image" ? (i(), s(K, { key: 3 }, [
            d.value ? (i(), s("form", {
              key: 0,
              class: "mail-form",
              onSubmit: _[3] || (_[3] = Re((k) => u("insert", a(Fi)(d.value.name, m.value, d.value.width)), ["prevent"]))
            }, [
              t("div", Dl, [
                t("label", {
                  class: "mail-field-label",
                  for: a(y)
                }, "Alternative text for " + c(d.value.title), 9, Ll),
                o(a(me), {
                  id: a(y),
                  modelValue: m.value,
                  "onUpdate:modelValue": _[1] || (_[1] = (k) => m.value = k),
                  autofocus: ""
                }, null, 8, ["id", "modelValue"]),
                _[7] || (_[7] = t("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
              ]),
              t("div", Ml, [
                o(a(H), {
                  label: "Back",
                  severity: "secondary",
                  outlined: "",
                  onClick: _[2] || (_[2] = (k) => d.value = void 0)
                }),
                o(a(H), {
                  label: "Insert image",
                  type: "submit"
                })
              ])
            ], 32)) : R.value.length ? (i(), s("ul", Pl, [
              (i(!0), s(K, null, ue(R.value, (k) => (i(), s("li", {
                key: k.name
              }, [
                t("button", {
                  type: "button",
                  class: "mail-row-link",
                  disabled: !!z.value,
                  onClick: (F) => P(k.name, k.title)
                }, [
                  o(a(D), {
                    icon: z.value === k.name ? "tabler:loader-2" : a(ge).asset,
                    class: ne({ spin: z.value === k.name }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"]),
                  t("span", Ol, [
                    t("span", null, c(k.title), 1),
                    t("span", Bl, c(k.name), 1)
                  ])
                ], 8, El)
              ]))), 128))
            ])) : (i(), s("p", Nl, "There are no images yet. Upload one in Assets."))
          ], 64)) : (i(), s("ul", Fl, [
            t("li", null, [
              t("button", {
                type: "button",
                class: "mail-row-link",
                onClick: _[4] || (_[4] = (k) => u("insert", a(Ki)))
              }, [
                o(a(D), {
                  icon: "tabler:layout-rows",
                  "aria-hidden": "true"
                }),
                _[8] || (_[8] = t("span", { class: "mail-list-main" }, [
                  t("span", null, "Message body"),
                  t("span", { class: "mail-sub" }, "Where each message that uses this base template appears.")
                ], -1))
              ])
            ])
          ]))
        ])
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), Hl = ["disabled", "inert"], Kl = { class: "mail-form" }, Jl = { class: "mail-field" }, Wl = ["for"], Yl = { class: "mail-field" }, Gl = ["for"], Zl = { class: "mail-field-hint" }, Ql = { class: "mail-mono" }, Xl = { class: "mail-field" }, er = ["for"], ar = { class: "mail-base-row" }, tr = { class: "mail-kind" }, ir = ["id"], lr = { class: "mail-code-frame mail-code-subject" }, rr = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, or = { class: "mail-face-bar" }, sr = { class: "mail-code-frame mail-code-body" }, nr = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, cr = {
  key: 1,
  class: "mail-field-error",
  role: "alert"
}, dr = {
  key: 2,
  class: "mail-field-error",
  role: "alert"
}, ur = {
  key: 3,
  class: "mail-field-error",
  role: "alert"
}, pr = /* @__PURE__ */ te({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const l = na(() => import("./CodeEditor-Ffxb3yxc.js")), r = e, { library: u, go: $ } = fe(), p = { base: pe(), title: pe(), description: pe(), face: pe() }, n = f("html"), w = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], x = N(() => u.ofKind("base").map((T) => ({ value: T.name, label: T.title }))), b = f(), R = f(!1);
    function z(T) {
      R.value = !1, b.value?.insert(T);
    }
    const v = N(() => {
      const T = r.problem;
      return !!T?.resource && r.draft.kind !== "message" && T.resource.kind === "message" && T.resource.name === T.previewOf;
    }), S = N(() => {
      const T = r.problem;
      return !!T && (!T.resource || v.value || T.resource.kind === r.draft.kind && T.resource.name === r.draft.name);
    });
    function d(T) {
      const A = r.problem;
      return !S.value || A?.face !== T ? "" : !v.value || !A.resource ? A.message : `${u.find(A.resource.kind, A.resource.name)?.title ?? A.resource.name} does not render with your changes. ${A.message}`;
    }
    const m = N(() => {
      const T = r.problem;
      if (!T?.resource || S.value) return;
      const A = T.resource;
      return {
        title: u.find(A.kind, A.name)?.title ?? A.name,
        face: T.face ? ze[T.face] : "",
        message: T.message,
        open: () => A.kind !== "asset" && $({ name: "resource", kind: A.kind, resource: A.name, section: "content" })
      };
    }), y = N(() => S.value && r.problem && (r.problem.face === "variables" || r.problem.face === "samples") ? `${ze[r.problem.face]}: ${r.problem.message}` : ""), P = N(() => (r.draft.kind === "message" ? "Body" : "Source") + (n.value === "html" ? ", HTML" : ", plain text"));
    return (T, A) => (i(), s("fieldset", {
      class: "mail-source-column",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      o(Ya, { label: "Name and description" }, {
        default: j(() => [
          t("div", Kl, [
            t("div", Jl, [
              t("label", {
                class: "mail-field-label",
                for: p.title
              }, "Name", 8, Wl),
              o(a(me), {
                id: p.title,
                modelValue: e.draft.title,
                "onUpdate:modelValue": A[0] || (A[0] = (_) => e.draft.title = _)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", Yl, [
              t("label", {
                class: "mail-field-label",
                for: p.description
              }, "Description", 8, Gl),
              o(a(me), {
                id: p.description,
                modelValue: e.draft.description,
                "onUpdate:modelValue": A[1] || (A[1] = (_) => e.draft.description = _)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("p", Zl, [
              A[11] || (A[11] = J("Reference ", -1)),
              t("span", Ql, c(e.draft.name), 1),
              J(", used to " + c(e.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      e.draft.kind === "message" ? (i(), s(K, { key: 0 }, [
        t("div", Xl, [
          t("label", {
            class: "mail-field-label",
            for: p.base
          }, "Base template", 8, er),
          t("div", ar, [
            o(a(Me), {
              modelValue: e.draft.base,
              "onUpdate:modelValue": A[2] || (A[2] = (_) => e.draft.base = _),
              "input-id": p.base,
              options: x.value,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              class: "mail-base-select"
            }, {
              value: j(({ value: _ }) => [
                t("span", tr, [
                  o(a(D), {
                    icon: a(ge).base,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  J(c(x.value.find((k) => k.value === _)?.label ?? _), 1)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "input-id", "options"]),
            e.draft.base ? (i(), B(a(H), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: A[3] || (A[3] = (_) => a($)({ name: "resource", kind: "base", resource: e.draft.base, section: "content" }))
            })) : V("", !0)
          ])
        ]),
        t("div", {
          class: ne(["mail-field", { "mail-field-invalid": d("subject") }])
        }, [
          t("span", {
            id: p.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, ir),
          t("div", lr, [
            o(a(l), {
              modelValue: e.draft.subject,
              "onUpdate:modelValue": A[4] || (A[4] = (_) => e.draft.subject = _),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          d("subject") ? (i(), s("small", rr, c(d("subject")), 1)) : V("", !0)
        ], 2)
      ], 64)) : V("", !0),
      t("div", {
        class: ne(["mail-field", { "mail-field-invalid": d(n.value) }])
      }, [
        t("div", or, [
          o(a(xe), {
            modelValue: n.value,
            "onUpdate:modelValue": A[5] || (A[5] = (_) => n.value = _),
            options: w,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (e.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          o(a(H), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: A[6] || (A[6] = (_) => R.value = !0)
          }, {
            icon: j(() => [
              o(a(D), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        t("div", sr, [
          n.value === "html" ? (i(), B(a(l), {
            ref_key: "editor",
            ref: b,
            key: "html",
            modelValue: e.draft.html,
            "onUpdate:modelValue": A[7] || (A[7] = (_) => e.draft.html = _),
            label: P.value
          }, null, 8, ["modelValue", "label"])) : (i(), B(a(l), {
            ref_key: "editor",
            ref: b,
            key: "text",
            modelValue: e.draft.text,
            "onUpdate:modelValue": A[8] || (A[8] = (_) => e.draft.text = _),
            label: P.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        d(n.value) ? (i(), s("small", nr, c(a(ze)[n.value]) + ": " + c(d(n.value)), 1)) : d(n.value === "html" ? "text" : "html") ? (i(), s("small", cr, c(a(ze)[n.value === "html" ? "text" : "html"]) + ": " + c(d(n.value === "html" ? "text" : "html")), 1)) : y.value ? (i(), s("small", dr, c(y.value), 1)) : m.value ? (i(), s("small", ur, [
          J(c(m.value.title) + c(m.value.face ? ", " + m.value.face : "") + ": " + c(m.value.message) + " ", 1),
          t("button", {
            type: "button",
            class: "mail-text-link",
            onClick: A[9] || (A[9] = (_) => m.value.open())
          }, "Open " + c(m.value.title), 1)
        ])) : V("", !0)
      ], 2),
      o(ql, {
        visible: R.value,
        draft: e.draft,
        face: n.value,
        onClose: A[10] || (A[10] = (_) => R.value = !1),
        onInsert: z
      }, null, 8, ["visible", "draft", "face"])
    ], 8, Hl));
  }
}), mr = ["disabled", "inert"], vr = { class: "mail-sr-only" }, fr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, gr = {
  key: 1,
  class: "mail-muted"
}, br = ["aria-label"], hr = {
  class: "mail-variable-row mail-variable-head",
  role: "row"
}, yr = {
  key: 0,
  role: "columnheader"
}, xr = { role: "cell" }, kr = { role: "cell" }, wr = {
  role: "cell",
  class: "mail-variable-check"
}, $r = { role: "cell" }, _r = {
  key: 0,
  role: "cell"
}, Cr = { role: "cell" }, Vr = { role: "cell" }, Sr = {
  key: 1,
  class: "mail-field-error mail-variable-error",
  role: "alert"
}, zr = /* @__PURE__ */ te({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(e, { emit: l }) {
    const r = e, u = l, $ = [
      { value: "string", label: "Text" },
      { value: "number", label: "Number" },
      { value: "integer", label: "Whole number" },
      { value: "boolean", label: "Yes or no" },
      { value: "array", label: "List" },
      { value: "object", label: "Record" }
    ];
    let p = 0;
    function n(d) {
      return d == null ? "" : typeof d == "string" ? d : JSON.stringify(d);
    }
    function w(d) {
      const m = new Set(d.schema.required ?? []), y = Oe(d);
      return Object.entries(Ne(d.schema)).map(([P, T]) => ({
        id: p++,
        name: P,
        schema: T,
        type: $.some((A) => A.value === T.type) ? T.type : "string",
        required: m.has(P),
        description: typeof T.description == "string" ? T.description : "",
        sample: n(y[P]),
        fallback: n(T.default)
      }));
    }
    const x = f(w(r.draft));
    X(() => r.draft, (d) => {
      x.value = w(d);
    });
    function b(d, m) {
      if (m === "") return {};
      if (d.type === "string") return { value: m };
      try {
        const y = JSON.parse(m);
        return (d.type === "array" ? Array.isArray(y) : d.type === "object" ? !!y && typeof y == "object" && !Array.isArray(y) : d.type === "boolean" ? typeof y == "boolean" : typeof y == "number" && (d.type === "number" || Number.isInteger(y))) ? { value: y } : { invalid: `Enter a ${$.find((T) => T.value === d.type)?.label.toLowerCase()} value.` };
      } catch {
        return { invalid: d.type === "array" ? 'Enter a list, for example ["a", "b"].' : d.type === "object" ? 'Enter a record, for example {"key": "value"}.' : d.type === "boolean" ? "Enter true or false." : "Enter a number." };
      }
    }
    const R = N(() => x.value.map((d) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(d.name) ? x.value.some((m) => m !== d && m.name === d.name) ? "Another one has this name." : b(d, d.sample).invalid ?? b(d, d.fallback).invalid ?? "" : "Use letters, digits and underscores, starting with a letter."));
    X(R, (d) => u("invalid", d.some(Boolean)), { immediate: !0 }), X(x, (d) => {
      if (R.value.some(Boolean)) return;
      const m = {}, y = {};
      for (const T of d) {
        const A = { ...T.schema, type: T.type };
        T.description ? A.description = T.description : delete A.description;
        const _ = b(T, T.fallback).value;
        _ !== void 0 ? A.default = _ : delete A.default, m[T.name] = A;
        const k = b(T, T.sample).value;
        k !== void 0 && (y[T.name] = k);
      }
      const P = d.filter((T) => T.required).map((T) => T.name);
      r.draft.schema = { ...r.draft.schema, properties: m, required: P.length ? P : void 0 }, r.draft.samples = y;
    }, { deep: !0 });
    function z() {
      let d = x.value.length + 1;
      for (; x.value.some((m) => m.name === `value_${d}`); ) d++;
      x.value.push({ id: p++, name: `value_${d}`, type: "string", required: !1, description: "", sample: "", fallback: "", schema: {} });
    }
    const v = N(() => r.draft.kind === "part"), S = N(() => r.problem && (r.problem.face === "variables" || r.problem.face === "samples") ? `${ze[r.problem.face]}: ${r.problem.message}` : "");
    return (d, m) => (i(), s("fieldset", {
      class: "mail-variables",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      t("legend", vr, c(e.label), 1),
      S.value ? (i(), s("p", fr, c(S.value), 1)) : V("", !0),
      x.value.length ? (i(), s("div", {
        key: 2,
        class: "mail-variable-grid",
        role: "table",
        "aria-label": e.label
      }, [
        t("div", hr, [
          m[0] || (m[0] = t("span", { role: "columnheader" }, "Name", -1)),
          m[1] || (m[1] = t("span", { role: "columnheader" }, "Type", -1)),
          m[2] || (m[2] = t("span", { role: "columnheader" }, "Required", -1)),
          m[3] || (m[3] = t("span", { role: "columnheader" }, "Description", -1)),
          v.value ? (i(), s("span", yr, "Default")) : V("", !0),
          m[4] || (m[4] = t("span", { role: "columnheader" }, "Sample value", -1)),
          m[5] || (m[5] = t("span", { role: "columnheader" }, [
            t("span", { class: "mail-sr-only" }, "Remove")
          ], -1))
        ]),
        (i(!0), s(K, null, ue(x.value, (y, P) => (i(), s("div", {
          key: y.id,
          class: ne(["mail-variable-row", { "mail-variable-invalid": R.value[P] }]),
          role: "row"
        }, [
          t("span", xr, [
            o(a(me), {
              modelValue: y.name,
              "onUpdate:modelValue": (T) => y.name = T,
              class: "mail-mono-input",
              "aria-label": "Name of " + (y.name || "value"),
              invalid: !!R.value[P]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "invalid"])
          ]),
          t("span", kr, [
            o(a(Me), {
              modelValue: y.type,
              "onUpdate:modelValue": (T) => y.type = T,
              options: $,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              "aria-label": "Type of " + y.name
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ]),
          t("span", wr, [
            o(a(Ct), {
              modelValue: y.required,
              "onUpdate:modelValue": (T) => y.required = T,
              binary: "",
              "aria-label": y.name + " is required"
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ]),
          t("span", $r, [
            o(a(me), {
              modelValue: y.description,
              "onUpdate:modelValue": (T) => y.description = T,
              "aria-label": "Description of " + y.name
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ]),
          v.value ? (i(), s("span", _r, [
            o(a(me), {
              modelValue: y.fallback,
              "onUpdate:modelValue": (T) => y.fallback = T,
              "aria-label": "Default of " + y.name
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ])) : V("", !0),
          t("span", Cr, [
            o(a(me), {
              modelValue: y.sample,
              "onUpdate:modelValue": (T) => y.sample = T,
              "aria-label": "Sample value of " + y.name
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ]),
          t("span", Vr, [
            o(a(H), {
              text: "",
              severity: "secondary",
              "aria-label": "Remove " + y.name,
              title: "Remove " + y.name,
              onClick: (T) => x.value.splice(P, 1)
            }, {
              icon: j(() => [
                o(a(D), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          R.value[P] ? (i(), s("small", Sr, c(y.name) + ": " + c(R.value[P]), 1)) : V("", !0)
        ], 2))), 128))
      ], 8, br)) : (i(), s("p", gr, c(e.draft.title) + " takes no " + c(e.label.toLowerCase()) + " yet.", 1)),
      t("div", null, [
        o(a(H), {
          label: v.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: z
        }, {
          icon: j(() => [
            o(a(D), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, mr));
  }
}), Tr = { class: "kx-modal-head-icon" }, Ar = {
  key: 0,
  class: "kx-modal-head-text"
}, Rr = { class: "kx-modal-head-title" }, jr = { class: "kx-modal-head-sub" }, Ur = {
  key: 0,
  class: "mail-form"
}, Ir = { class: "mail-face-bar" }, Dr = {
  key: 0,
  class: "mail-version-subject"
}, Lr = { class: "mail-mono-block" }, Mr = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, Nr = /* @__PURE__ */ te({
  __name: "VersionDialog",
  props: {
    revision: {},
    current: {},
    compare: { type: Boolean },
    busy: { type: Boolean }
  },
  emits: ["close", "restore"],
  setup(e, { emit: l }) {
    const r = na(() => import("./CodeEditor-Ffxb3yxc.js")), u = na(() => import("./DiffView-CvKuoDEA.js")), $ = e, p = l, n = f("version"), w = f("html");
    X(() => $.revision, (m) => {
      m && (n.value = $.compare ? "compare" : "version", w.value = "html");
    });
    const x = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], b = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], R = N(() => $.revision?.revision === $.current.revision), z = N(() => {
      const m = $.revision;
      return m ? m.state === "original" && m.action === "reset" ? `${$.current.title}: the included version` : `${$.current.title}, version ${m.version}` : "";
    }), v = N(() => $.revision ? w.value === "html" ? $.revision.content.html : $.revision.content.text : ""), S = N(() => w.value === "html" ? $.current.html : $.current.text), d = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (m, y) => (i(), B(a(je), {
      visible: !!e.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: d,
      "aria-label": z.value,
      closable: !1,
      "close-on-escape": !e.busy,
      "onUpdate:visible": y[4] || (y[4] = (P) => {
        P || p("close");
      })
    }, {
      header: j(() => [
        t("span", Tr, [
          o(a(D), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        e.revision ? (i(), s("span", Ar, [
          t("span", Rr, c(z.value), 1),
          t("span", jr, c(a(ga)[e.revision.action]) + " by " + c(a(we)(e.revision.author_label, e.revision.author)) + " · " + c(a(Fe)(e.revision.created_at)), 1)
        ])) : V("", !0)
      ]),
      footer: j(() => [
        o(a(H), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: y[2] || (y[2] = (P) => p("close"))
        }, null, 8, ["disabled"]),
        e.revision && !R.value ? (i(), B(a(H), {
          key: 0,
          label: "Restore this version",
          loading: e.busy,
          onClick: y[3] || (y[3] = (P) => p("restore", e.revision))
        }, {
          icon: j(() => [
            o(a(D), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : V("", !0)
      ]),
      default: j(() => [
        e.revision ? (i(), s("div", Ur, [
          t("div", Ir, [
            R.value ? V("", !0) : (i(), B(a(xe), {
              key: 0,
              modelValue: n.value,
              "onUpdate:modelValue": y[0] || (y[0] = (P) => n.value = P),
              options: x,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            o(a(xe), {
              modelValue: w.value,
              "onUpdate:modelValue": y[1] || (y[1] = (P) => w.value = P),
              options: b,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          e.revision.content.subject !== void 0 && n.value === "version" ? (i(), s("p", Dr, [
            y[5] || (y[5] = t("span", { class: "mail-muted" }, "Subject", -1)),
            y[6] || (y[6] = J()),
            t("span", Lr, c(e.revision.content.subject), 1)
          ])) : V("", !0),
          n.value === "version" ? (i(), s("div", Mr, [
            (i(), B(a(r), {
              key: w.value,
              "model-value": v.value,
              label: z.value + (w.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (i(), B(a(u), {
            key: "diff-" + w.value,
            before: v.value,
            after: S.value,
            "before-label": e.revision.state === "original" && e.revision.action === "reset" ? "Included version" : "Version " + e.revision.version,
            "after-label": "Current version"
          }, null, 8, ["before", "after", "before-label"]))
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label", "close-on-escape"]));
  }
}), Pr = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Er = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Or = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, Br = {
  key: 3,
  class: "mail-history"
}, Fr = { class: "mail-history-head" }, qr = { class: "mail-history-main" }, Hr = { class: "mail-history-title" }, Kr = { class: "mail-sub" }, Jr = {
  key: 0,
  class: "mail-history-note"
}, Wr = { class: "mail-history-actions" }, Yr = /* @__PURE__ */ te({
  __name: "HistoryList",
  props: {
    resource: {},
    revisions: {},
    loading: { type: Boolean },
    error: {},
    busy: {}
  },
  emits: ["show", "restore", "retry"],
  setup(e) {
    return (l, r) => e.error ? (i(), s("div", Pr, [
      t("span", null, c(e.error), 1),
      o(a(H), {
        label: "Retry",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: r[0] || (r[0] = (u) => l.$emit("retry"))
      })
    ])) : e.loading && !e.revisions.length ? (i(), s("p", Er, [
      o(a(D), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      r[1] || (r[1] = J("Loading history…", -1))
    ])) : e.revisions.length ? (i(), s("ol", Br, [
      (i(!0), s(K, null, ue(e.revisions, (u) => (i(), s("li", {
        key: u.revision,
        class: "mail-history-row"
      }, [
        t("div", Fr, [
          t("div", qr, [
            t("span", Hr, [
              J(" Version " + c(u.version) + " · " + c(a(ga)[u.action]) + c(u.restored_from ? " from version " + u.restored_from : "") + " ", 1),
              u.revision === e.resource.revision ? (i(), B(a(Ae), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : V("", !0)
            ]),
            t("span", Kr, c(a(we)(u.author_label, u.author)) + " · " + c(a(Fe)(u.created_at)), 1),
            u.note ? (i(), s("span", Jr, c(u.note), 1)) : V("", !0)
          ]),
          t("div", Wr, [
            o(a(H), {
              label: "Show this version",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: ($) => l.$emit("show", u)
            }, {
              icon: j(() => [
                o(a(D), {
                  icon: "tabler:eye",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            u.revision !== e.resource.revision ? (i(), B(a(H), {
              key: 0,
              label: "Restore",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: e.busy === u.revision,
              disabled: e.busy !== void 0,
              onClick: ($) => l.$emit("restore", u)
            }, {
              icon: j(() => [
                o(a(D), {
                  icon: "tabler:restore",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
          ])
        ])
      ]))), 128))
    ])) : (i(), s("p", Or, c(e.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1));
  }
}), Gr = { class: "kx-modal-head-icon mail-head-warn" }, Zr = { class: "kx-modal-head-text" }, Qr = { class: "kx-modal-head-title" }, Xr = { class: "mail-dialog-text" }, eo = {
  key: 0,
  class: "mail-list"
}, ao = ["onClick"], Ga = /* @__PURE__ */ te({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(e, { emit: l }) {
    const r = l, u = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function $(p) {
      r("close"), p();
    }
    return (p, n) => (i(), B(a(je), {
      visible: !!e.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: u,
      role: "alertdialog",
      "aria-label": e.refusal?.header,
      "onUpdate:visible": n[1] || (n[1] = (w) => {
        w || r("close");
      })
    }, {
      header: j(() => [
        t("span", Gr, [
          o(a(D), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        t("span", Zr, [
          t("span", Qr, c(e.refusal?.header), 1)
        ])
      ]),
      footer: j(() => [
        o(a(H), {
          label: "Close",
          autofocus: "",
          onClick: n[0] || (n[0] = (w) => r("close"))
        })
      ]),
      default: j(() => [
        t("p", Xr, c(e.refusal?.message), 1),
        e.refusal?.links.length ? (i(), s("ul", eo, [
          (i(!0), s(K, null, ue(e.refusal.links, (w) => (i(), s("li", {
            key: w.label
          }, [
            t("button", {
              type: "button",
              class: "mail-row-link",
              onClick: (x) => $(w.open)
            }, [
              o(a(D), {
                icon: "tabler:mail",
                "aria-hidden": "true"
              }),
              t("span", null, c(w.label), 1)
            ], 8, ao)
          ]))), 128))
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), to = { class: "mail-stack" }, io = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, lo = {
  key: 0,
  class: "mail-muted"
}, ro = {
  key: 1,
  class: "mail-list"
}, oo = ["onClick"], so = {
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, no = { class: "mail-group-head" }, co = {
  key: 0,
  class: "mail-muted"
}, uo = {
  key: 1,
  class: "mail-list"
}, po = { class: "mail-list-main" }, mo = {
  key: 0,
  class: "mail-sub"
}, vo = { class: "mail-muted" }, fo = {
  key: 2,
  class: "mail-group",
  "aria-labelledby": "used-by-templates"
}, go = { class: "mail-muted" }, bo = /* @__PURE__ */ te({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(e) {
    const l = e, { library: r, go: u, capabilities: $ } = fe(), p = N(() => (l.resource.used_by?.messages ?? []).map((w) => ({
      name: w,
      title: r.find("message", w)?.title ?? w
    }))), n = N(() => l.resource.used_by?.recent_senders ?? []);
    return (w, x) => (i(), s("div", to, [
      e.resource.kind === "base" || e.resource.kind === "asset" ? (i(), s("section", io, [
        x[1] || (x[1] = t("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        p.value.length ? (i(), s("ul", ro, [
          (i(!0), s(K, null, ue(p.value, (b) => (i(), s("li", {
            key: b.name
          }, [
            t("button", {
              type: "button",
              class: "mail-row-link",
              onClick: (R) => a(u)({ name: "resource", kind: "message", resource: b.name, section: "content" })
            }, [
              o(a(D), {
                icon: a(ge).message,
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              t("span", null, c(b.title), 1)
            ], 8, oo)
          ]))), 128))
        ])) : (i(), s("p", lo, "No messages " + c(e.resource.kind === "asset" ? "show" : "use") + " " + c(e.resource.title) + ".", 1))
      ])) : e.resource.kind === "message" ? (i(), s(K, { key: 1 }, [
        t("section", so, [
          t("div", no, [
            x[2] || (x[2] = t("h2", {
              id: "used-by-recent",
              class: "mail-label"
            }, "Sent in the last 30 days", -1)),
            a($)?.administer_delivery ? (i(), s("button", {
              key: 0,
              type: "button",
              class: "mail-text-link",
              onClick: x[0] || (x[0] = (b) => a(u)({ name: "activity", template: e.resource.name }))
            }, "Open in Activity")) : V("", !0)
          ]),
          n.value.length ? (i(), s("ul", uo, [
            (i(!0), s(K, null, ue(n.value, (b) => (i(), s("li", {
              key: b.sender + (b.origin?.id ?? ""),
              class: "mail-list-row"
            }, [
              o(a(D), {
                icon: b.origin ? "tabler:bolt" : "tabler:user",
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              t("span", po, [
                t("span", null, c(a(we)(b.sender_label, b.sender)), 1),
                b.origin ? (i(), s("span", mo, c(a(aa)(b.origin)), 1)) : V("", !0)
              ]),
              t("span", vo, c(a(ye)(b.count, "message")), 1)
            ]))), 128))
          ])) : (i(), s("p", co, "Nobody has sent " + c(e.resource.title) + " recently.", 1))
        ]),
        x[3] || (x[3] = t("section", {
          class: "mail-group",
          "aria-labelledby": "used-by-setup"
        }, [
          t("h2", {
            id: "used-by-setup",
            class: "mail-label"
          }, "Set up to send"),
          t("p", { class: "mail-muted" }, "Workflows, automations and agents that name this message are not listed here yet.")
        ], -1))
      ], 64)) : (i(), s("section", fo, [
        x[4] || (x[4] = t("h2", {
          id: "used-by-templates",
          class: "mail-label"
        }, "Templates", -1)),
        t("p", go, "Templates that include " + c(e.resource.title) + " are not listed here yet. Deleting a part checks every message first.", 1)
      ]))
    ]));
  }
}), ho = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, yo = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, xo = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, ko = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, wo = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, $o = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, _o = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Co = {
  key: 4,
  class: "kx-notice info mail-block",
  role: "status"
}, Vo = {
  key: 5,
  class: "kx-notice mail-customized"
}, So = { class: "mail-customized-text" }, zo = { class: "mail-editor-layout" }, To = /* @__PURE__ */ te({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(e) {
    const l = e, { library: r, capabilities: u, delivery: $, go: p, create: n, setDirty: w } = fe(), x = N(() => ({ kind: l.kind, name: l.name })), b = he(), R = f(), z = f(!0), v = f(!1), S = f(!1), d = f(""), m = f(), y = $e(), P = N(() => !!R.value && !!b.value && !Pi(R.value, b.value));
    X(P, (M) => w(M), { immediate: !0 }), ea(() => w(!1));
    async function T(M = {}) {
      const E = y();
      try {
        const G = await ie.get(x.value);
        if (!E()) return;
        if (M.keepDraft && P.value && b.value && G.revision !== b.value.revision) {
          m.value = { revision: G.revision, by: we(G.author_label, G.author) || "Someone" };
          return;
        }
        b.value = G, R.value = _e(G), m.value = void 0, v.value = S.value = !1, d.value = "";
      } catch (G) {
        if (!E()) return;
        v.value = Qe(G), S.value = Pe(G), d.value = v.value || S.value ? "" : oe(G, "This resource could not be loaded."), v.value && (b.value = void 0, R.value = void 0);
      } finally {
        E() && (z.value = !1);
      }
    }
    const A = he([]), _ = f(!1), k = f(""), F = $e();
    async function W() {
      const M = F();
      _.value = !0;
      try {
        const E = await ie.history(x.value);
        if (!M()) return;
        A.value = E, k.value = "";
      } catch (E) {
        if (!M()) return;
        k.value = Qe(E) ? "" : oe(E, "History could not be loaded.");
      } finally {
        M() && (_.value = !1);
      }
    }
    async function U() {
      await Promise.all([T({ keepDraft: !0 }), W()]);
    }
    Be(U), qe((M) => {
      M.kind === l.kind && M.name === l.name ? U() : l.kind === "base" && M.kind === "message" && T({ keepDraft: !0 });
    });
    const g = f(), I = f(""), C = f(!1), h = f(""), Z = f(), L = N(() => b.value?.title ?? l.name), O = N(() => {
      const M = b.value, E = L.value, G = M?.used_by?.messages?.length ?? 0, ce = M?.used_by?.recent_senders?.find((la) => la.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (ce?.origin ? ` Sent recently by “${aa(ce.origin)}”.` : "") },
          base: { title: "Layout", description: G ? `The frame around the ${ye(G, "message")} that ${G === 1 ? "uses" : "use"} ${E}.` : `The frame around messages that use ${E}.` },
          part: { title: "Content", description: `Shown wherever ${E} is included.` }
        }[l.kind],
        variables: l.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${E} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: l.kind === "message" ? `Who sends ${E}.` : l.kind === "base" ? `Messages that use ${E}.` : `Templates that include ${E}.`
        },
        history: { title: "History", description: `Every saved version of ${E}, newest first.` }
      }[l.section];
    }), q = N(() => {
      const M = b.value;
      return M?.state !== "customized" ? "" : `Customized by ${we(M.author_label, M.author)} ${Gt(M.updated_at)} from the version included with ${M.origin_label}.`;
    }), Q = N(() => A.value.find((M) => M.state === "original"));
    X(() => b.value?.state, (M) => {
      M === "customized" && !A.value.length && W();
    }, { immediate: !0 });
    const ee = f(), Y = f(), ae = f(!1), Ee = N(() => Y.value ?? ee.value);
    X(() => JSON.stringify(R.value), () => {
      Y.value = void 0;
    });
    const Qa = N(() => !!Ee.value || ae.value || !!m.value), wa = N(() => m.value ? "Discard your changes to load the newer version first." : ae.value ? "Fix the variables first." : Ee.value ? "Fix the error first." : "");
    function He(M, E) {
      C.value = Ce(M) === "mail_revision_conflict", C.value && U(), I.value = oe(M, E);
    }
    function $a() {
      if (!b.value) return;
      const M = !!m.value;
      R.value = _e(b.value), m.value = void 0, Y.value = void 0, M && T();
    }
    const Ue = f(!1), Ke = f(""), Je = f();
    function Xa() {
      Ke.value = "", Je.value = void 0, Ue.value = !0;
    }
    async function et(M) {
      const E = b.value, G = R.value;
      if (!(!E || !G || g.value !== void 0)) {
        g.value = "save", Ke.value = I.value = h.value = "", Je.value = void 0;
        try {
          const ce = await ie.update(G, E.revision, M || void 0);
          b.value = { ...E, ...ce }, R.value = _e(b.value), Ue.value = !1, h.value = `Saved ${ce.title}.${l.kind === "message" ? "" : " Every message that uses it has the change."}`, await U();
        } catch (ce) {
          const se = Le(ce), Ve = se?.resource?.kind === G.kind && se.resource.name === G.name;
          se?.dependents?.length && !Ve ? Je.value = { names: se.dependents, reason: se.reasons?.[0]?.message ?? se.message } : se ? (Y.value = se, Ue.value = !1) : Ce(ce) === "mail_revision_conflict" ? (Ue.value = !1, await T({ keepDraft: !0 })) : Ke.value = oe(ce, `${G.title} could not be saved.`);
        } finally {
          g.value = void 0;
        }
      }
    }
    async function at() {
      const M = b.value;
      if (!(!M || g.value !== void 0)) {
        g.value = "test", I.value = h.value = "";
        try {
          await ie.sendTest(M.name), h.value = "Test sent to you with the sample values. It appears in Activity.";
        } catch (E) {
          He(E, "The test could not be sent.");
        } finally {
          g.value = void 0;
        }
      }
    }
    const _a = N(() => P.value ? "Save your changes to send a test." : u.value?.send ? $.value && !$.value.configured ? "Mail delivery is not set up. Open Delivery settings." : "" : "Ask an administrator for permission to send mail.");
    async function tt() {
      const M = b.value;
      if (!(!M || g.value !== void 0 || !await De.confirm({
        header: `Reset ${M.title} to the original?`,
        message: `Your changes are replaced by the version included with ${M.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        g.value = "reset", I.value = h.value = "", C.value = !1;
        try {
          b.value = await ie.reset(x.value, M.revision), R.value = _e(b.value), h.value = `${M.title} is back to the original. Your changes are in History.`, await U();
        } catch (G) {
          He(G, `${M.title} could not be reset.`);
        } finally {
          g.value = void 0;
        }
      }
    }
    const We = f(), Ca = f(!1);
    function Va(M, E = !1) {
      Ca.value = E, We.value = M;
    }
    async function Sa(M) {
      const E = b.value;
      if (!(!E || g.value !== void 0 || !await De.confirm({
        header: `Restore version ${M.version} of ${E.title}?`,
        message: "It becomes the current version. The current version stays in History.",
        acceptLabel: "Restore this version",
        rejectLabel: "Cancel"
      }))) {
        g.value = M.revision, I.value = h.value = "";
        try {
          b.value = await ie.restore(x.value, M.revision, E.revision), R.value = _e(b.value), We.value = void 0, h.value = `Version ${M.version} from ${Fe(M.created_at)} is now in effect.`, await U();
        } catch (ce) {
          const se = Le(ce);
          se?.dependents?.length ? ia(E, se.dependents, `Restoring version ${M.version} would break them: ${se.message}`) : He(ce, "That version could not be restored.");
        } finally {
          g.value = void 0;
        }
      }
    }
    function ia(M, E, G) {
      const ce = E.map((Ve) => r.find("message", Ve)?.title ?? Ve), se = M.kind === "base" ? "use" : "include";
      Z.value = {
        header: G ? `${M.title} cannot change this way` : `${M.title} is in use`,
        message: G ?? `${ye(E.length, "message")} ${E.length === 1 ? se + "s" : se} it: ${ce.join(", ")}. Remove it from ${E.length === 1 ? "that message" : "them"} first.`,
        links: E.map((Ve, la) => ({ label: ce[la], open: () => p({ name: "resource", kind: "message", resource: Ve, section: "content" }) }))
      };
    }
    async function it() {
      const M = b.value;
      if (!M || M.state !== "created" || g.value !== void 0) return;
      const E = M.used_by?.messages ?? [];
      if (M.kind === "base" && E.length) {
        ia(M, E);
        return;
      }
      if (await De.confirm({
        header: `Delete ${M.title}?`,
        message: M.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${be[M.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        g.value = "delete", I.value = h.value = "";
        try {
          await ie.remove(x.value, M.revision), w(!1), p({ name: "library", section: da(l.kind) });
        } catch (ce) {
          const se = Le(ce);
          se?.dependents?.length ? ia(M, se.dependents) : He(ce, `${M.title} could not be deleted.`);
        } finally {
          g.value = void 0;
        }
      }
    }
    function lt() {
      const M = b.value;
      M && n({ kind: l.kind, from: { kind: M.kind, name: M.name } });
    }
    const rt = N(() => l.kind === "base" ? b.value?.used_by?.messages : void 0), Ye = N(() => g.value === "save");
    return T(), X(() => l.section, (M) => {
      M === "history" && !A.value.length && W();
    }, { immediate: !0 }), (M, E) => (i(), s(K, null, [
      v.value ? (i(), B(ha, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + a(fa)[e.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: E[0] || (E[0] = (G) => a(p)({ name: "library", section: a(da)(e.kind) }))
      }, null, 8, ["cta"])) : S.value ? (i(), s("p", ho, [
        o(a(D), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        E[8] || (E[8] = J("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (i(), s(K, { key: 2 }, [
        o(ta, {
          title: O.value.title,
          description: O.value.description
        }, ua({ _: 2 }, [
          b.value ? {
            name: "actions",
            fn: j(() => [
              P.value ? (i(), B(Mi, {
                key: 0,
                busy: Ye.value,
                "review-disabled": Qa.value,
                onDiscard: $a,
                onReview: Xa
              }, null, 8, ["busy", "review-disabled"])) : (i(), s(K, { key: 1 }, [
                e.kind === "message" ? (i(), B(a(H), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: g.value === "test",
                  disabled: !!_a.value || g.value !== void 0,
                  title: _a.value || void 0,
                  onClick: at
                }, {
                  icon: j(() => [
                    o(a(D), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : V("", !0),
                o(a(H), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: g.value !== void 0,
                  onClick: lt
                }, {
                  icon: j(() => [
                    o(a(D), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                b.value.state === "created" ? (i(), B(a(H), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: g.value === "delete",
                  disabled: g.value !== void 0,
                  onClick: it
                }, {
                  icon: j(() => [
                    o(a(D), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0)
              ], 64))
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "description"]),
        d.value ? (i(), s("div", yo, [
          t("span", null, c(d.value), 1),
          o(a(H), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: E[1] || (E[1] = (G) => U())
          })
        ])) : z.value ? (i(), s("p", xo, [
          o(a(D), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          J("Loading " + c(L.value) + "…", 1)
        ])) : V("", !0),
        b.value && R.value ? (i(), s(K, { key: 2 }, [
          m.value ? (i(), s("p", ko, [
            o(a(D), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("span", null, [
              J(c(m.value.by) + " saved " + c(b.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              t("button", {
                type: "button",
                class: "mail-text-link",
                onClick: $a
              }, "Discard and load")
            ])
          ])) : V("", !0),
          P.value && wa.value && !m.value ? (i(), s("p", wo, c(wa.value), 1)) : V("", !0),
          I.value && C.value ? (i(), s("p", $o, [
            o(a(D), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            J(c(I.value), 1)
          ])) : I.value ? (i(), s("p", _o, [
            t("span", null, c(I.value), 1)
          ])) : V("", !0),
          h.value ? (i(), s("p", Co, [
            o(a(D), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            J(c(h.value), 1)
          ])) : V("", !0),
          q.value && e.section === "content" ? (i(), s("div", Vo, [
            o(a(D), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            t("span", So, c(q.value), 1),
            Q.value ? (i(), B(a(H), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: E[2] || (E[2] = (G) => Va(Q.value, !0))
            }, {
              icon: j(() => [
                o(a(D), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : V("", !0),
            o(a(H), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: g.value === "reset",
              disabled: g.value !== void 0 || P.value,
              onClick: tt
            }, {
              icon: j(() => [
                o(a(D), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : V("", !0),
          mt(t("div", zo, [
            o(pr, {
              draft: R.value,
              problem: Ee.value,
              disabled: Ye.value
            }, null, 8, ["draft", "problem", "disabled"]),
            o(ol, {
              draft: R.value,
              messages: rt.value,
              onProblem: E[3] || (E[3] = (G) => ee.value = G)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [vt, e.section === "content"]
          ]),
          e.section === "variables" ? (i(), B(zr, {
            key: 6,
            draft: R.value,
            label: O.value.title,
            problem: Ee.value,
            disabled: Ye.value,
            onInvalid: E[4] || (E[4] = (G) => ae.value = G)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : e.section === "used-by" ? (i(), B(bo, {
            key: 7,
            resource: b.value
          }, null, 8, ["resource"])) : e.section === "history" ? (i(), B(Yr, {
            key: 8,
            resource: b.value,
            revisions: A.value,
            loading: _.value,
            error: k.value,
            busy: typeof g.value == "number" ? g.value : g.value ? -1 : void 0,
            onShow: Va,
            onRestore: Sa,
            onRetry: W
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      b.value && R.value ? (i(), B(yl, {
        key: 3,
        visible: Ue.value,
        saved: a(_e)(b.value),
        draft: R.value,
        busy: Ye.value,
        error: Ke.value,
        dependents: Je.value,
        onClose: E[5] || (E[5] = (G) => Ue.value = !1),
        onSave: et
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents"])) : V("", !0),
      b.value ? (i(), B(Nr, {
        key: 4,
        revision: We.value,
        current: b.value,
        compare: Ca.value,
        busy: typeof g.value == "number",
        onClose: E[6] || (E[6] = (G) => We.value = void 0),
        onRestore: Sa
      }, null, 8, ["revision", "current", "compare", "busy"])) : V("", !0),
      o(Ga, {
        refusal: Z.value,
        onClose: E[7] || (E[7] = (G) => Z.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Ao = { class: "kx-modal-head-icon" }, Ro = { class: "kx-modal-head-text" }, jo = { class: "kx-modal-head-title" }, Uo = { class: "kx-modal-head-sub" }, Io = ["disabled", "inert"], Do = ["for"], Lo = { class: "mail-muted" }, Mo = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, No = {
  key: 0,
  class: "mail-field"
}, Po = ["for"], Eo = ["for"], Oo = ["id"], Bo = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Fo = 1024 * 1024, Za = /* @__PURE__ */ te({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(e, { emit: l }) {
    const r = e, u = l, { library: $, go: p } = fe(), n = { file: pe(), title: pe(), name: pe() }, w = ["image/png", "image/jpeg", "image/gif"], x = f(), b = f(), R = f(""), z = f(""), v = f(!1), S = f(!1), d = f(""), m = f(""), y = f("");
    X(() => r.visible, (W) => {
      W && (x.value = b.value = void 0, R.value = r.replace?.title ?? "", z.value = r.replace?.name ?? "", v.value = !1, d.value = m.value = y.value = "");
    }), X(R, (W) => {
      !r.replace && !v.value && (z.value = Ba(W));
    });
    function P(W) {
      return new Promise((U) => {
        const g = URL.createObjectURL(W), I = new Image();
        I.onload = () => {
          U({ width: I.naturalWidth, height: I.naturalHeight }), URL.revokeObjectURL(g);
        }, I.onerror = () => {
          U(void 0), URL.revokeObjectURL(g);
        }, I.src = g;
      });
    }
    async function T(W) {
      const U = Array.isArray(W.files) ? W.files[0] : W.files;
      if (m.value = "", x.value = void 0, !!U) {
        if (!w.includes(U.type)) {
          m.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (U.size > Fo) {
          m.value = "Images must be 1 MB or smaller.";
          return;
        }
        x.value = U, b.value = await P(U), !r.replace && !R.value && (R.value = U.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function A() {
      return y.value = "", r.replace ? !0 : (Fa.test(z.value) ? $.find("asset", z.value) && (y.value = `An image named ${z.value} already exists. Choose another name or replace ${z.value}.`) : y.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.", !y.value);
    }
    async function _() {
      if (!(S.value || !x.value || !R.value.trim() || !A())) {
        S.value = !0, d.value = "";
        try {
          const W = await qt.add(x.value), U = { name: z.value, upload_id: W, title: R.value.trim(), ...b.value }, g = r.replace ? await ie.replaceAsset(U, r.replace.revision) : await ie.addAsset(U);
          await $.load(), u("done", g), u("close"), r.replace || p({ name: "library", section: "assets", asset: g.name });
        } catch (W) {
          Ce(W) === "mail_revision_conflict" && !r.replace ? y.value = `An image named ${z.value} already exists. Choose another name or replace ${z.value}.` : d.value = oe(W, "The image could not be uploaded.");
        } finally {
          S.value = !1;
        }
      }
    }
    const k = N(() => r.replace ? `Replace ${r.replace.title}` : "Upload image"), F = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (W, U) => (i(), B(a(je), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !S.value,
      "close-on-escape": !S.value,
      class: "mail-dialog",
      pt: F,
      "aria-label": k.value,
      "onUpdate:visible": U[4] || (U[4] = (g) => {
        g || u("close");
      })
    }, {
      header: j(() => [
        t("span", Ao, [
          o(a(D), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        t("span", Ro, [
          t("span", jo, c(k.value), 1),
          t("span", Uo, c(e.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: j(() => [
        o(a(H), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: S.value,
          onClick: U[3] || (U[3] = (g) => u("close"))
        }, null, 8, ["disabled"]),
        o(a(H), {
          label: e.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: S.value,
          disabled: !x.value || !e.replace && !R.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: j(() => [
        t("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: Re(_, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: S.value,
            inert: S.value || void 0
          }, [
            t("div", {
              class: ne(["mail-field", { "mail-field-invalid": m.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: n.file
              }, "Image", 8, Do),
              o(a(Vt), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": x.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: n.file, "aria-label": "Image file" } },
                onSelect: T
              }, {
                chooseicon: j(() => [
                  o(a(D), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: j(() => [
                  t("span", Lo, c(x.value ? `${x.value.name} · ${a(Xe)(x.value.size)}${b.value ? ` · ${b.value.width} × ${b.value.height}` : ""}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              m.value ? (i(), s("small", Mo, c(m.value), 1)) : V("", !0)
            ], 2),
            e.replace ? V("", !0) : (i(), s("div", No, [
              t("label", {
                class: "mail-field-label",
                for: n.title
              }, "Name", 8, Po),
              o(a(me), {
                id: n.title,
                modelValue: R.value,
                "onUpdate:modelValue": U[0] || (U[0] = (g) => R.value = g)
              }, null, 8, ["id", "modelValue"])
            ])),
            e.replace ? V("", !0) : (i(), s("div", {
              key: 1,
              class: ne(["mail-field", { "mail-field-invalid": y.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: n.name
              }, "Reference", 8, Eo),
              o(a(me), {
                id: n.name,
                modelValue: z.value,
                "onUpdate:modelValue": U[1] || (U[1] = (g) => z.value = g),
                class: "mail-mono-input",
                invalid: !!y.value,
                "aria-describedby": n.name + "-hint",
                onInput: U[2] || (U[2] = (g) => v.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: n.name + "-hint",
                class: ne(y.value ? "mail-field-error" : "mail-field-hint")
              }, c(y.value || "Templates show it with this name. It cannot change later."), 11, Oo)
            ], 2))
          ], 8, Io),
          d.value ? (i(), s("p", Bo, c(d.value), 1)) : V("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), qo = { class: "mail-drawer-body" }, Ho = { class: "mail-drawer-head" }, Ko = { class: "mail-drawer-title" }, Jo = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Wo = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Yo = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Go = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Zo = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, Qo = { class: "mail-asset-actions" }, Xo = { class: "mail-facts mail-card" }, es = { class: "mail-reference" }, as = { class: "mail-mono-block" }, ts = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, is = {
  key: 0,
  class: "mail-muted"
}, ls = { class: "mail-list" }, rs = ["onClick"], os = {
  key: 0,
  class: "mail-asset-context"
}, ss = ["srcdoc", "title"], ns = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, cs = {
  key: 0,
  class: "mail-muted"
}, ds = {
  key: 1,
  class: "mail-history"
}, us = { class: "mail-history-head" }, ps = { class: "mail-history-main" }, ms = { class: "mail-history-title" }, vs = { class: "mail-sub" }, fs = /* @__PURE__ */ te({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(e, { emit: l }) {
    const r = e, u = l, { library: $, go: p } = fe(), n = he(), w = he([]), x = he(), b = f(""), R = f(!1), z = f(!1), v = f(""), S = f(""), d = f(""), m = f(), y = f(!1), P = f(!1), T = f(), A = $e();
    async function _() {
      const I = r.name, C = A();
      if (!I) {
        n.value = void 0;
        return;
      }
      R.value = !0;
      try {
        const [h, Z] = await Promise.all([ie.get({ kind: "asset", name: I }), ie.history({ kind: "asset", name: I })]);
        if (!C()) return;
        n.value = h, w.value = Z, z.value = !1, v.value = "";
        const L = h.used_by?.messages?.[0];
        b.value = L ?? "", x.value = L ? await ie.preview(L, []) : void 0;
      } catch (h) {
        if (!C()) return;
        z.value = Qe(h), v.value = z.value ? "" : oe(h, "This image could not be loaded.");
      } finally {
        C() && (R.value = !1);
      }
    }
    X(() => r.name, () => {
      y.value = !1, d.value = S.value = "", _();
    }, { immediate: !0 }), qe((I) => {
      I.kind === "asset" && I.name === r.name && _();
    });
    const k = N(() => (n.value?.used_by?.messages ?? []).map((I) => ({ name: I, title: $.find("message", I)?.title ?? I }))), F = N(() => n.value ? Wa(n.value.name) : "");
    async function W() {
      try {
        await navigator.clipboard.writeText(F.value), y.value = !0;
      } catch {
        y.value = !1;
      }
    }
    async function U(I, C) {
      const h = n.value;
      if (!h || m.value !== void 0) return;
      if (I === "delete" && k.value.length) {
        T.value = {
          header: `${h.title} is in use`,
          message: `${ye(k.value.length, "message")} ${k.value.length === 1 ? "shows" : "show"} it: ${k.value.map((L) => L.title).join(", ")}. Remove it from ${k.value.length === 1 ? "that message" : "them"} first.`,
          links: k.value.map((L) => ({ label: L.title, open: () => p({ name: "resource", kind: "message", resource: L.name, section: "content" }) }))
        };
        return;
      }
      const Z = {
        reset: { header: `Reset ${h.title} to the original?`, message: `The image included with ${h.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${h.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${C?.version} of ${h.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[I];
      if (await De.confirm({ header: Z.header, message: Z.message, acceptLabel: Z.accept, rejectLabel: "Cancel", ...I === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        m.value = C ? C.revision : I, S.value = d.value = "";
        try {
          if (I === "delete") {
            await ie.remove({ kind: "asset", name: h.name }, h.revision), u("close");
            return;
          }
          n.value = I === "reset" ? await ie.reset({ kind: "asset", name: h.name }, h.revision) : await ie.restore({ kind: "asset", name: h.name }, C.revision, h.revision), d.value = I === "reset" ? `${h.title} is back to the original.` : `Version ${C.version} is shown again everywhere.`, await _();
        } catch (L) {
          const O = Le(L);
          O?.dependents?.length ? T.value = { header: `${h.title} is in use`, message: O.message, links: O.dependents.map((q) => ({ label: $.find("message", q)?.title ?? q, open: () => p({ name: "resource", kind: "message", resource: q, section: "content" }) })) } : (S.value = Ce(L) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : oe(L, "The image could not be changed."), Ce(L) === "mail_revision_conflict" && _());
        } finally {
          m.value = void 0;
        }
      }
    }
    const g = N(() => x.value?.html ? xa(x.value.html, x.value.inline_assets) : "");
    return (I, C) => (i(), s(K, null, [
      o(a(Ua), {
        visible: !!e.name,
        position: "right",
        modal: !0,
        dismissable: m.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": C[5] || (C[5] = (h) => {
          h || u("close");
        })
      }, {
        default: j(() => [
          t("div", qo, [
            t("header", Ho, [
              t("div", Ko, [
                n.value?.state === "customized" ? (i(), B(a(Ae), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : V("", !0),
                t("h2", null, c(n.value?.title ?? "Image"), 1)
              ]),
              o(a(H), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: m.value !== void 0,
                onClick: C[0] || (C[0] = (h) => u("close"))
              }, {
                icon: j(() => [
                  o(a(D), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            R.value && !n.value ? (i(), s("p", Jo, [
              o(a(D), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              C[9] || (C[9] = J("Loading image…", -1))
            ])) : z.value ? (i(), s("p", Wo, [
              o(a(D), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              C[10] || (C[10] = J("This image no longer exists. It was deleted while you were away.", -1))
            ])) : v.value ? (i(), s("div", Yo, [
              t("span", null, c(v.value), 1),
              o(a(H), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: C[1] || (C[1] = (h) => _())
              })
            ])) : V("", !0),
            n.value ? (i(), s(K, { key: 3 }, [
              S.value ? (i(), s("p", Go, [
                o(a(D), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                J(c(S.value), 1)
              ])) : V("", !0),
              d.value ? (i(), s("p", Zo, [
                o(a(D), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                J(c(d.value), 1)
              ])) : V("", !0),
              t("div", Qo, [
                o(a(H), {
                  label: "Replace",
                  disabled: m.value !== void 0,
                  onClick: C[2] || (C[2] = (h) => P.value = !0)
                }, {
                  icon: j(() => [
                    o(a(D), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                n.value.state === "customized" ? (i(), B(a(H), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: m.value === "reset",
                  disabled: m.value !== void 0,
                  onClick: C[3] || (C[3] = (h) => U("reset"))
                }, {
                  icon: j(() => [
                    o(a(D), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0),
                n.value.state === "created" ? (i(), B(a(H), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: m.value === "delete",
                  disabled: m.value !== void 0,
                  onClick: C[4] || (C[4] = (h) => U("delete"))
                }, {
                  icon: j(() => [
                    o(a(D), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0)
              ]),
              t("dl", Xo, [
                C[12] || (C[12] = t("dt", null, "Reference", -1)),
                t("dd", es, [
                  t("span", as, c(F.value), 1),
                  o(a(H), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": y.value ? "Reference copied" : "Copy reference",
                    title: y.value ? "Reference copied" : "Copy reference",
                    onClick: W
                  }, {
                    icon: j(() => [
                      o(a(D), {
                        icon: y.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                C[13] || (C[13] = t("dt", null, "File", -1)),
                t("dd", null, c(n.value.asset?.filename) + " · " + c(a(Xe)(n.value.asset?.size)), 1),
                n.value.asset?.width ? (i(), s(K, { key: 0 }, [
                  C[11] || (C[11] = t("dt", null, "Size", -1)),
                  t("dd", null, c(n.value.asset.width) + " × " + c(n.value.asset.height), 1)
                ], 64)) : V("", !0),
                C[14] || (C[14] = t("dt", null, "Source", -1)),
                t("dd", null, [
                  o(ka, { resource: n.value }, null, 8, ["resource"])
                ])
              ]),
              t("section", ts, [
                C[15] || (C[15] = t("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                k.value.length ? (i(), s(K, { key: 1 }, [
                  t("ul", ls, [
                    (i(!0), s(K, null, ue(k.value, (h) => (i(), s("li", {
                      key: h.name
                    }, [
                      t("button", {
                        type: "button",
                        class: "mail-row-link",
                        onClick: (Z) => a(p)({ name: "resource", kind: "message", resource: h.name, section: "content" })
                      }, [
                        o(a(D), {
                          icon: a(ge).message,
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        t("span", null, c(h.title), 1)
                      ], 8, rs)
                    ]))), 128))
                  ]),
                  g.value ? (i(), s("div", os, [
                    t("iframe", {
                      sandbox: "",
                      srcdoc: g.value,
                      title: "How " + n.value.title + " looks in " + (a($).find("message", b.value)?.title ?? b.value)
                    }, null, 8, ss)
                  ])) : V("", !0)
                ], 64)) : (i(), s("p", is, "No message shows " + c(n.value.title) + " with its sample values.", 1))
              ]),
              t("section", ns, [
                C[16] || (C[16] = t("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                w.value.length ? (i(), s("ol", ds, [
                  (i(!0), s(K, null, ue(w.value, (h) => (i(), s("li", {
                    key: h.revision,
                    class: "mail-history-row"
                  }, [
                    t("div", us, [
                      t("div", ps, [
                        t("span", ms, [
                          J("Version " + c(h.version) + " · " + c(a(ga)[h.action]) + " ", 1),
                          h.revision === n.value.revision ? (i(), B(a(Ae), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : V("", !0)
                        ]),
                        t("span", vs, [
                          J(c(a(we)(h.author_label, h.author)) + " · " + c(a(Fe)(h.created_at)) + " ", 1),
                          h.content.asset?.filename ? (i(), s(K, { key: 0 }, [
                            J(" · " + c(h.content.asset.filename), 1)
                          ], 64)) : V("", !0)
                        ])
                      ]),
                      h.revision !== n.value.revision ? (i(), B(a(H), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: m.value === h.revision,
                        disabled: m.value !== void 0,
                        onClick: (Z) => U("restore", h)
                      }, {
                        icon: j(() => [
                          o(a(D), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
                    ])
                  ]))), 128))
                ])) : (i(), s("p", cs, c(n.value.title) + " has not been replaced.", 1))
              ])
            ], 64)) : V("", !0)
          ])
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      n.value ? (i(), B(Za, {
        key: 0,
        visible: P.value,
        replace: n.value,
        onClose: C[6] || (C[6] = (h) => P.value = !1),
        onDone: C[7] || (C[7] = (h) => _())
      }, null, 8, ["visible", "replace"])) : V("", !0),
      o(Ga, {
        refusal: T.value,
        onClose: C[8] || (C[8] = (h) => T.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), gs = { key: 0 }, bs = /* @__PURE__ */ te({
  __name: "AssetTile",
  props: {
    asset: {},
    large: { type: Boolean }
  },
  setup(e) {
    const l = e, r = N(() => l.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (u, $) => (i(), s("span", {
      class: ne(["mail-asset-tile", { "mail-asset-tile-large": e.large }]),
      "aria-hidden": "true"
    }, [
      o(a(D), { icon: "tabler:photo" }),
      r.value ? (i(), s("span", gs, c(r.value), 1)) : V("", !0)
    ], 2));
  }
}), hs = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, ys = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, xs = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, ks = { class: "mail-toolbar" }, ws = {
  class: "mail-count",
  role: "status"
}, $s = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, _s = ["onClick"], Cs = { class: "mail-sub" }, Vs = { class: "mail-mono-block" }, Ss = { class: "mail-muted" }, zs = { class: "mail-muted" }, Ts = /* @__PURE__ */ te({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(e) {
    const l = e, { library: r, go: u, upload: $ } = fe(), p = f(""), n = f("");
    let w;
    X(p, (_) => {
      clearTimeout(w), w = setTimeout(() => {
        n.value = _.trim();
      }, 250);
    });
    const x = he([]), b = f(!0), R = f(!1), z = f(!1), v = f(""), S = $e();
    async function d() {
      const _ = S();
      b.value = !0;
      try {
        const k = await ie.assets(n.value || void 0);
        if (!_()) return;
        x.value = k.sort((F, W) => F.title.localeCompare(W.title)), v.value = "", z.value = !1, R.value = !0;
      } catch (k) {
        if (!_()) return;
        z.value = Pe(k), v.value = z.value ? "" : oe(k, "Assets could not be loaded.");
      } finally {
        _() && (b.value = !1);
      }
    }
    X(n, () => {
      d();
    }), Be(d), qe((_) => {
      _.kind === "asset" && d();
    });
    const m = N(() => x.value.reduce((_, k) => _ + (k.asset?.size ?? 0), 0)), y = N(() => `${ye(x.value.length, "image")} · ${Xe(m.value)}`);
    function P(_) {
      const k = _.asset;
      return k ? (k.width && k.height ? `${k.width} × ${k.height} · ` : "") + Xe(k.size) : "";
    }
    function T(_) {
      const k = r.find("asset", _.name)?.used_by?.messages ?? 0;
      return k ? ye(k, "message") : "—";
    }
    function A(_) {
      u({ name: "library", section: "assets", asset: _.name });
    }
    return (_, k) => (i(), s(K, null, [
      o(ta, {
        title: "Assets",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: j(() => [
          o(a(H), {
            label: "Upload image",
            onClick: k[0] || (k[0] = (F) => a($)())
          }, {
            icon: j(() => [
              o(a(D), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      z.value ? (i(), s("p", hs, [
        o(a(D), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        k[6] || (k[6] = J("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : v.value ? (i(), s("div", ys, [
        t("span", null, c(v.value), 1),
        o(a(H), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: k[1] || (k[1] = (F) => d())
        })
      ])) : b.value && !R.value ? (i(), s("p", xs, [
        o(a(D), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        k[7] || (k[7] = J("Loading assets…", -1))
      ])) : R.value && !x.value.length && !n.value ? (i(), B(ha, {
        key: 3,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: k[2] || (k[2] = (F) => a($)())
      })) : R.value ? (i(), s(K, { key: 4 }, [
        t("div", ks, [
          o(a(ma), { class: "mail-search" }, {
            default: j(() => [
              o(a(va), null, {
                default: j(() => [
                  o(a(D), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              o(a(me), {
                modelValue: p.value,
                "onUpdate:modelValue": k[3] || (k[3] = (F) => p.value = F),
                type: "search",
                "aria-label": "Search assets",
                placeholder: "Search assets…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          t("span", ws, c(y.value), 1)
        ]),
        x.value.length ? (i(), B(a(pa), {
          key: 1,
          value: x.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Assets" } },
          onRowClick: k[4] || (k[4] = (F) => A(F.data))
        }, {
          default: j(() => [
            o(a(de), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: j(({ data: F }) => [
                o(bs, {
                  asset: F.asset
                }, null, 8, ["asset"])
              ]),
              _: 1
            }),
            o(a(de), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: j(({ data: F }) => [
                t("button", {
                  type: "button",
                  class: "mail-name",
                  onClick: Re((W) => A(F), ["stop"])
                }, c(F.title), 9, _s),
                t("span", Cs, [
                  t("span", Vs, c(F.name), 1),
                  F.asset?.filename ? (i(), s(K, { key: 0 }, [
                    J(" · " + c(F.asset.filename), 1)
                  ], 64)) : V("", !0)
                ])
              ]),
              _: 1
            }),
            o(a(de), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: j(({ data: F }) => [
                t("span", Ss, c(P(F)), 1)
              ]),
              _: 1
            }),
            o(a(de), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: j(({ data: F }) => [
                o(ka, { resource: F }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            o(a(de), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: j(({ data: F }) => [
                J(c(T(F)), 1)
              ]),
              _: 1
            }),
            o(a(de), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: j(({ data: F }) => [
                t("span", zs, c(F.state === "original" ? "—" : a(ba)(F.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (i(), s("p", $s, "Nothing matches. Try another name."))
      ], 64)) : V("", !0),
      o(fs, {
        name: l.asset,
        onClose: k[5] || (k[5] = (F) => a(u)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), As = { class: "kx-modal-head-icon" }, Rs = { class: "kx-modal-head-text" }, js = { class: "kx-modal-head-title" }, Us = { class: "kx-modal-head-sub" }, Is = ["id"], Ds = ["disabled", "inert"], Ls = {
  key: 0,
  class: "mail-field"
}, Ms = {
  key: 1,
  class: "mail-field"
}, Ns = ["for"], Ps = { class: "mail-field" }, Es = ["for"], Os = ["for"], Bs = ["id"], Fs = { class: "mail-field" }, qs = ["for"], Hs = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Se = "\0blank", Ks = /* @__PURE__ */ te({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(e, { emit: l }) {
    const r = e, u = l, { library: $, go: p } = fe(), n = f("message"), w = f(""), x = f(""), b = f(""), R = f(""), z = f(!1), v = f(!1), S = f(""), d = f(""), m = { title: pe(), reference: pe(), description: pe(), source: pe(), hint: pe() }, y = ["message", "base", "part"].map((I) => ({ value: I, label: be[I] })), P = N(() => !!r.intent.from), T = N(() => [
      { value: Se, label: "Blank" },
      ...$.ofKind(n.value).map((I) => ({ value: I.name, label: I.title }))
    ]), A = N(() => w.value === Se || !!$.find(n.value, w.value));
    function _(I) {
      if (w.value = I, I === Se) return;
      const C = $.find(n.value, I);
      C && (R.value = C.description, r.intent.from && (x.value = `${C.title} copy`, z.value = !1));
    }
    X(() => r.visible, (I) => {
      I && (n.value = r.intent.from?.kind ?? r.intent.kind ?? "message", x.value = b.value = R.value = w.value = "", S.value = d.value = "", z.value = !1, r.intent.from ? _(r.intent.from.name) : w.value = Se);
    }, { immediate: !0 }), X(n, () => {
      r.intent.from || (w.value = Se, R.value = "");
    }), X(x, (I) => {
      z.value || (b.value = Ba(I));
    });
    const k = N(() => n.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function F() {
      return d.value = "", b.value ? Fa.test(b.value) ? $.find(n.value, b.value) && (d.value = `A ${be[n.value].toLowerCase()} with this reference already exists. Choose another.`) : d.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : d.value = "Enter a reference.", !d.value;
    }
    async function W() {
      if (!(v.value || !x.value.trim() || !A.value || !F())) {
        v.value = !0, S.value = "";
        try {
          const I = w.value === Se ? await ie.create(Ei(n.value, b.value, x.value.trim(), R.value.trim())) : await ie.copy({
            kind: n.value,
            name: b.value,
            title: x.value.trim(),
            description: R.value.trim(),
            from: { kind: n.value, name: w.value }
          });
          await $.load(), u("close"), p({ name: "resource", kind: I.kind, resource: I.name, section: "content" });
        } catch (I) {
          Ce(I) === "mail_revision_conflict" ? d.value = `A ${be[n.value].toLowerCase()} with this reference already exists. Choose another.` : S.value = oe(I, "The resource could not be created.");
        } finally {
          v.value = !1;
        }
      }
    }
    const U = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, g = N(() => r.intent.from ? `Duplicate ${$.find(r.intent.from.kind, r.intent.from.name)?.title ?? ""}` : `New ${be[n.value].toLowerCase()}`);
    return (I, C) => (i(), B(a(je), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !v.value,
      "close-on-escape": !v.value,
      class: "mail-dialog",
      pt: U,
      "aria-label": g.value,
      "onUpdate:visible": C[6] || (C[6] = (h) => {
        h || u("close");
      })
    }, {
      header: j(() => [
        t("span", As, [
          o(a(D), {
            icon: a(ge)[n.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        t("span", Rs, [
          t("span", js, c(g.value), 1),
          t("span", Us, c(w.value === Se ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: j(() => [
        o(a(H), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: v.value,
          onClick: C[5] || (C[5] = (h) => u("close"))
        }, null, 8, ["disabled"]),
        o(a(H), {
          label: "Create " + a(be)[n.value].toLowerCase(),
          type: "submit",
          form: m.hint,
          loading: v.value,
          disabled: !x.value.trim() || !A.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: j(() => [
        t("form", {
          id: m.hint,
          class: "mail-form",
          onSubmit: Re(W, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: v.value,
            inert: v.value || void 0
          }, [
            P.value ? V("", !0) : (i(), s("div", Ls, [
              C[7] || (C[7] = t("span", { class: "mail-field-label" }, "Kind", -1)),
              o(a(xe), {
                modelValue: n.value,
                "onUpdate:modelValue": C[0] || (C[0] = (h) => n.value = h),
                options: a(y),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            P.value ? V("", !0) : (i(), s("div", Ms, [
              t("label", {
                class: "mail-field-label",
                for: m.source
              }, "Start from", 8, Ns),
              o(a(Me), {
                "model-value": w.value,
                "input-id": m.source,
                options: T.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                "onUpdate:modelValue": _
              }, null, 8, ["model-value", "input-id", "options"])
            ])),
            t("div", Ps, [
              t("label", {
                class: "mail-field-label",
                for: m.title
              }, "Name", 8, Es),
              o(a(me), {
                id: m.title,
                modelValue: x.value,
                "onUpdate:modelValue": C[1] || (C[1] = (h) => x.value = h),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", {
              class: ne(["mail-field", { "mail-field-invalid": d.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: m.reference
              }, "Reference", 8, Os),
              o(a(me), {
                id: m.reference,
                modelValue: b.value,
                "onUpdate:modelValue": C[2] || (C[2] = (h) => b.value = h),
                class: "mail-mono-input",
                invalid: !!d.value,
                "aria-describedby": m.reference + "-hint",
                onInput: C[3] || (C[3] = (h) => z.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: m.reference + "-hint",
                class: ne(d.value ? "mail-field-error" : "mail-field-hint")
              }, c(d.value || k.value), 11, Bs)
            ], 2),
            t("div", Fs, [
              t("label", {
                class: "mail-field-label",
                for: m.description
              }, "Description", 8, qs),
              o(a(St), {
                id: m.description,
                modelValue: R.value,
                "onUpdate:modelValue": C[4] || (C[4] = (h) => R.value = h),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, Ds),
          S.value ? (i(), s("p", Hs, c(S.value), 1)) : V("", !0)
        ], 40, Is)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Js = { class: "mail-drawer-body" }, Ws = { class: "mail-drawer-head" }, Ys = { class: "mail-drawer-title" }, Gs = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Zs = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Qs = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Xs = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, en = {
  key: 0,
  class: "kx-notice error mail-failure"
}, an = { class: "mail-failure-body" }, tn = { key: 0 }, ln = {
  key: 1,
  class: "mail-failure-done",
  role: "status"
}, rn = {
  key: 2,
  class: "mail-sub"
}, on = {
  key: 3,
  class: "mail-field-error",
  role: "alert"
}, sn = { key: 4 }, nn = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, cn = { class: "mail-facts mail-card" }, dn = { key: 1 }, un = {
  key: 0,
  class: "mail-sub"
}, pn = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, mn = { class: "mail-timeline" }, vn = { class: "mail-muted" }, fn = { class: "mail-facts" }, gn = { class: "mail-mono-block" }, bn = /* @__PURE__ */ te({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close", "changed"],
  setup(e, { emit: l }) {
    const r = e, u = l, { library: $, go: p } = fe(), n = he(), w = f(!1), x = f(!1), b = f(!1), R = f(""), z = f(""), v = f(!1), S = f(), d = f(!1), m = $e();
    async function y() {
      const U = r.messageId, g = m();
      if (!U) {
        n.value = void 0;
        return;
      }
      w.value = !0;
      try {
        const I = await Ze.get(U);
        if (!g()) return;
        n.value = I, R.value = "", x.value = b.value = !1;
      } catch (I) {
        if (!g()) return;
        n.value = void 0, x.value = Qe(I), b.value = Pe(I), R.value = x.value || b.value ? "" : oe(I, "This message could not be loaded.");
      } finally {
        g() && (w.value = !1);
      }
    }
    X(() => r.messageId, (U) => {
      S.value = void 0, z.value = "", d.value = !1, U !== n.value?.message_id && (n.value = void 0), y();
    }, { immediate: !0 }), Ha((U) => {
      U.message_id === r.messageId && y();
    });
    async function P() {
      const U = n.value;
      if (!(!U || v.value)) {
        v.value = !0, z.value = "";
        try {
          S.value = await Ze.resend(U.message_id), u("changed");
        } catch (g) {
          z.value = oe(g, "The message could not be sent again.");
        } finally {
          v.value = !1;
        }
      }
    }
    async function T() {
      const U = n.value;
      if (U)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(U.message_id)}`), d.value = !0;
        } catch {
          d.value = !1;
        }
    }
    const A = N(() => {
      const U = n.value?.template;
      return U ? $.find("message", U)?.title ?? U : "";
    }), _ = N(() => !!n.value?.template && !!$.find("message", n.value.template)), k = N(() => {
      const U = n.value;
      if (!U) return [];
      const g = [{ label: "Accepted for delivery", at: U.created_at }];
      return U.status === "queued" && U.next_attempt_at && g.push({ label: U.attempts ? `Attempt ${U.attempts} did not go through; trying again` : "Next delivery attempt", at: U.next_attempt_at }), U.sent_at ? g.push({ label: U.attempts > 1 ? `Sent after ${U.attempts} attempts` : "Sent", at: U.sent_at }) : U.status === "failed" && U.finished_at && g.push({ label: U.attempts > 1 ? `Failed after ${U.attempts} attempts` : "Failed", at: U.finished_at }), g;
    }), F = N(() => (n.value?.attachments ?? []).map((U) => U.filename || "Attachment")), W = N(() => {
      const U = n.value;
      return U ? [
        { label: "Message ID", value: U.message_id },
        { label: "Delivery service", value: U.driver_id },
        { label: "Service message ID", value: U.provider_message_id },
        { label: "Error code", value: U.last_error?.code },
        { label: "Service response", value: U.last_error?.provider_detail }
      ].filter((g) => !!g.value) : [];
    });
    return (U, g) => (i(), B(a(Ua), {
      visible: !!e.messageId,
      position: "right",
      modal: !0,
      dismissable: !v.value,
      "close-on-escape": !v.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": g[5] || (g[5] = (I) => {
        I || u("close");
      })
    }, {
      default: j(() => [
        t("div", Js, [
          t("header", Ws, [
            t("div", Ys, [
              n.value ? (i(), B(a(Ae), {
                key: 0,
                severity: a(Ma)[n.value.status],
                value: a(La)[n.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : V("", !0),
              t("h2", null, c(n.value?.subject ?? "Message"), 1)
            ]),
            o(a(H), {
              text: "",
              severity: "secondary",
              disabled: !n.value,
              "aria-label": d.value ? "Link copied" : "Copy link",
              title: d.value ? "Link copied" : "Copy link",
              onClick: T
            }, {
              icon: j(() => [
                o(a(D), {
                  icon: d.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            o(a(H), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: v.value,
              onClick: g[0] || (g[0] = (I) => u("close"))
            }, {
              icon: j(() => [
                o(a(D), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          w.value && !n.value ? (i(), s("p", Gs, [
            o(a(D), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            g[6] || (g[6] = J("Loading message…", -1))
          ])) : x.value ? (i(), s("p", Zs, [
            o(a(D), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            g[7] || (g[7] = J("This message is no longer in Activity.", -1))
          ])) : b.value ? (i(), s("p", Qs, [
            o(a(D), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            g[8] || (g[8] = J("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : R.value ? (i(), s("div", Xs, [
            t("span", null, c(R.value), 1),
            o(a(H), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: g[1] || (g[1] = (I) => y())
            })
          ])) : V("", !0),
          n.value ? (i(), s(K, { key: 4 }, [
            n.value.status === "failed" ? (i(), s("div", en, [
              o(a(D), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", an, [
                g[10] || (g[10] = t("strong", null, "This message was not delivered.", -1)),
                n.value.last_error ? (i(), s("span", tn, c(n.value.last_error.message), 1)) : V("", !0),
                S.value ? (i(), s("p", ln, [
                  g[9] || (g[9] = J(" Sent again as a new message. ", -1)),
                  t("button", {
                    type: "button",
                    class: "mail-text-link",
                    onClick: g[2] || (g[2] = (I) => a(p)({ name: "activity", message: S.value.message_id }))
                  }, "Open the new message")
                ])) : n.value.can_resend ? V("", !0) : (i(), s("p", rn, "It cannot be sent again because its content was not kept.")),
                z.value ? (i(), s("p", on, c(z.value), 1)) : V("", !0),
                n.value.can_resend && !S.value ? (i(), s("div", sn, [
                  o(a(H), {
                    label: "Send again",
                    loading: v.value,
                    onClick: P
                  }, {
                    icon: j(() => [
                      o(a(D), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : V("", !0)
              ])
            ])) : n.value.status === "queued" ? (i(), s("p", nn, [
              o(a(D), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              g[11] || (g[11] = J("Waiting to be delivered. ", -1))
            ])) : V("", !0),
            t("dl", cn, [
              g[17] || (g[17] = t("dt", null, "To", -1)),
              t("dd", null, c(n.value.to.join(", ")), 1),
              n.value.cc?.length ? (i(), s(K, { key: 0 }, [
                g[12] || (g[12] = t("dt", null, "Cc", -1)),
                t("dd", null, c(n.value.cc.join(", ")), 1)
              ], 64)) : V("", !0),
              n.value.bcc?.length ? (i(), s(K, { key: 1 }, [
                g[13] || (g[13] = t("dt", null, "Bcc", -1)),
                t("dd", null, c(n.value.bcc.join(", ")), 1)
              ], 64)) : V("", !0),
              n.value.reply_to ? (i(), s(K, { key: 2 }, [
                g[14] || (g[14] = t("dt", null, "Reply-to", -1)),
                t("dd", null, c(n.value.reply_to), 1)
              ], 64)) : V("", !0),
              g[18] || (g[18] = t("dt", null, "Template", -1)),
              t("dd", null, [
                _.value ? (i(), s("button", {
                  key: 0,
                  type: "button",
                  class: "mail-text-link",
                  onClick: g[3] || (g[3] = (I) => a(p)({ name: "resource", kind: "message", resource: n.value.template, section: "content" }))
                }, c(A.value), 1)) : (i(), s("span", dn, c(A.value || "Written directly"), 1))
              ]),
              g[19] || (g[19] = t("dt", null, "Sent by", -1)),
              t("dd", null, [
                J(c(a(we)(n.value.sender_label, n.value.sender)), 1),
                n.value.origin ? (i(), s("span", un, c(a(aa)(n.value.origin)), 1)) : V("", !0)
              ]),
              F.value.length ? (i(), s(K, { key: 3 }, [
                g[15] || (g[15] = t("dt", null, "Attachments", -1)),
                t("dd", null, c(F.value.join(", ")), 1)
              ], 64)) : V("", !0),
              n.value.resend_of ? (i(), s(K, { key: 4 }, [
                g[16] || (g[16] = t("dt", null, "Sent again from", -1)),
                t("dd", null, [
                  t("button", {
                    type: "button",
                    class: "mail-text-link",
                    onClick: g[4] || (g[4] = (I) => a(p)({ name: "activity", message: n.value.resend_of }))
                  }, "The original message")
                ])
              ], 64)) : V("", !0)
            ]),
            t("section", pn, [
              g[20] || (g[20] = t("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              t("ol", mn, [
                (i(!0), s(K, null, ue(k.value, (I) => (i(), s("li", {
                  key: I.label
                }, [
                  t("span", null, c(I.label), 1),
                  t("span", vn, c(a(Fe)(I.at)), 1)
                ]))), 128))
              ])
            ]),
            W.value.length ? (i(), B(Ya, {
              key: 2,
              label: "Technical details"
            }, {
              default: j(() => [
                t("dl", fn, [
                  (i(!0), s(K, null, ue(W.value, (I) => (i(), s(K, {
                    key: I.label
                  }, [
                    t("dt", null, c(I.label), 1),
                    t("dd", gn, c(I.value), 1)
                  ], 64))), 128))
                ])
              ]),
              _: 1
            })) : V("", !0)
          ], 64)) : V("", !0)
        ])
      ]),
      _: 1
    }, 8, ["visible", "dismissable", "close-on-escape"]));
  }
}), hn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, yn = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, xn = { class: "mail-health-text" }, kn = { class: "mail-toolbar" }, wn = {
  key: 0,
  class: "mail-count",
  role: "status"
}, $n = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, _n = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, Cn = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Vn = ["onClick"], Sn = { class: "mail-sub" }, zn = {
  key: 0,
  class: "mail-sub"
}, Tn = { class: "mail-muted" }, An = {
  key: 2,
  class: "mail-more"
}, Rn = /* @__PURE__ */ te({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(e) {
    const l = e, { library: r, go: u, capabilities: $ } = fe(), p = f("all"), n = f(l.template ?? null), w = f(30), x = f(""), b = f("");
    let R;
    X(x, (ee) => {
      clearTimeout(R), R = setTimeout(() => {
        b.value = ee.trim();
      }, 250);
    }), X(() => l.template, (ee) => {
      ee !== void 0 && (n.value = ee);
    });
    const z = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], v = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], S = N(() => r.resources.value.filter((ee) => ee.kind === "message").sort((ee, Y) => ee.title.localeCompare(Y.title)).map((ee) => ({ label: ee.title, value: ee.name }))), d = he([]), m = f(), y = f(!0), P = f(!1), T = f(!1), A = f(!1), _ = f(""), k = $e();
    function F(ee) {
      return {
        status: p.value === "all" ? void 0 : p.value,
        message: n.value || void 0,
        since: Date.now() - w.value * 24 * 60 * 60 * 1e3,
        q: b.value || void 0,
        cursor: ee
      };
    }
    async function W() {
      const ee = k();
      y.value = !0;
      try {
        const Y = await Ze.list(F());
        if (!ee()) return;
        d.value = Y.items, m.value = Y.next_cursor, g.value = Y.total, I.value = Y.failed_today ?? 0, _.value = "", A.value = !1, P.value = !0;
      } catch (Y) {
        if (!ee()) return;
        A.value = Pe(Y), _.value = A.value ? "" : oe(Y, "Activity could not be loaded.");
      } finally {
        ee() && (y.value = !1);
      }
    }
    async function U() {
      if (!m.value || T.value) return;
      const ee = k();
      T.value = !0;
      try {
        const Y = await Ze.list(F(m.value));
        if (!ee()) return;
        d.value = [...d.value, ...Y.items], m.value = Y.next_cursor;
      } catch (Y) {
        ee() && (_.value = oe(Y, "More activity could not be loaded."));
      } finally {
        T.value = !1;
      }
    }
    const g = f(), I = f(0);
    X([p, n, w, b], () => {
      W();
    }), Be(W), Ha(() => {
      W();
    });
    const C = N(() => ye(g.value ?? d.value.length, "message")), h = N(() => I.value ? `${ye(I.value, "message")} failed today.` : ""), Z = N(() => !!$.value?.administer_delivery), L = N(() => Z.value ? "Every email sent from this workspace in the last 30 days." : "Email you sent in the last 30 days.");
    function O(ee) {
      return ee ? r.find("message", ee)?.title ?? ee : "—";
    }
    function q(ee) {
      u({ name: "activity", message: ee.message_id });
    }
    function Q() {
      u({ name: "activity", template: n.value || void 0 });
    }
    return (ee, Y) => (i(), s(K, null, [
      o(ta, {
        title: "Activity",
        description: L.value
      }, null, 8, ["description"]),
      A.value ? (i(), s("p", hn, [
        o(a(D), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        Y[7] || (Y[7] = J("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (i(), s(K, { key: 1 }, [
        h.value ? (i(), s("p", yn, [
          o(a(D), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", xn, [
            t("strong", null, c(h.value), 1),
            J(" " + c(p.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          p.value !== "failed" ? (i(), B(a(H), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: Y[0] || (Y[0] = (ae) => p.value = "failed")
          })) : V("", !0)
        ])) : V("", !0),
        t("div", kn, [
          o(a(xe), {
            modelValue: p.value,
            "onUpdate:modelValue": Y[1] || (Y[1] = (ae) => p.value = ae),
            options: z,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          o(a(Me), {
            modelValue: n.value,
            "onUpdate:modelValue": Y[2] || (Y[2] = (ae) => n.value = ae),
            options: S.value,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue", "options"]),
          o(a(Me), {
            modelValue: w.value,
            "onUpdate:modelValue": Y[3] || (Y[3] = (ae) => w.value = ae),
            options: v,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          o(a(ma), { class: "mail-search" }, {
            default: j(() => [
              o(a(va), null, {
                default: j(() => [
                  o(a(D), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              o(a(me), {
                modelValue: x.value,
                "onUpdate:modelValue": Y[4] || (Y[4] = (ae) => x.value = ae),
                type: "search",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          P.value ? (i(), s("span", wn, c(C.value), 1)) : V("", !0)
        ]),
        _.value ? (i(), s("div", $n, [
          t("span", null, c(_.value), 1),
          o(a(H), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: Y[5] || (Y[5] = (ae) => W())
          })
        ])) : y.value && !P.value ? (i(), s("p", _n, [
          o(a(D), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          Y[8] || (Y[8] = J("Loading activity…", -1))
        ])) : P.value ? (i(), s(K, { key: 3 }, [
          d.value.length ? (i(), B(a(pa), {
            key: 1,
            value: d.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: Y[6] || (Y[6] = (ae) => q(ae.data))
          }, {
            default: j(() => [
              o(a(de), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: j(({ data: ae }) => [
                  o(a(Ae), {
                    severity: a(Ma)[ae.status],
                    value: a(La)[ae.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              o(a(de), { header: "Message" }, {
                body: j(({ data: ae }) => [
                  t("button", {
                    type: "button",
                    class: "mail-name",
                    onClick: Re((Ee) => q(ae), ["stop"])
                  }, c(ae.subject), 9, Vn),
                  t("span", Sn, c(a(Qt)(ae.to)), 1)
                ]),
                _: 1
              }),
              o(a(de), { header: "Template" }, {
                body: j(({ data: ae }) => [
                  J(c(O(ae.template)), 1)
                ]),
                _: 1
              }),
              o(a(de), { header: "Sent by" }, {
                body: j(({ data: ae }) => [
                  t("span", null, c(a(we)(ae.sender_label, ae.sender)), 1),
                  ae.origin ? (i(), s("span", zn, c(a(aa)(ae.origin)), 1)) : V("", !0)
                ]),
                _: 1
              }),
              o(a(de), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: j(({ data: ae }) => [
                  t("span", Tn, c(a(Zt)(ae.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (i(), s("p", Cn, c(b.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          m.value ? (i(), s("div", An, [
            o(a(H), {
              label: "Show more",
              severity: "secondary",
              outlined: "",
              loading: T.value,
              onClick: U
            }, null, 8, ["loading"])
          ])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      o(bn, {
        "message-id": e.message,
        onClose: Q,
        onChanged: W
      }, null, 8, ["message-id"])
    ], 64));
  }
}), jn = { class: "kx-shell kx-settings-shell mail-admin" }, Un = { class: "kx-main" }, In = /* @__PURE__ */ te({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(e, { emit: l }) {
    const r = e, u = l, $ = f(Aa("")), p = N(() => r.route === void 0 ? $.value : Aa(r.route)), n = f(!1);
    X(n, (L) => u("dirty-change", L), { flush: "sync" });
    let w = !1;
    async function x() {
      if (!n.value) return !0;
      if (w) return !1;
      w = !0;
      try {
        return await De.confirm({
          header: "Discard unsaved changes?",
          message: "Your changes to this resource are not saved yet.",
          acceptLabel: "Discard changes",
          rejectLabel: "Keep editing",
          acceptClass: "p-button-danger"
        });
      } finally {
        w = !1;
      }
    }
    function b(L, O) {
      return L.name === "resource" && O.name === "resource" && L.kind === O.kind && L.resource === O.resource;
    }
    async function R(L) {
      const O = Ta(L);
      !b(p.value, L) && !await x() || (b(p.value, L) || (n.value = !1), r.route === void 0 ? $.value = L : O !== r.route && u("navigate", O));
    }
    const z = ai(), v = f(), S = f();
    async function d() {
      try {
        v.value = await Ht.capabilities();
      } catch {
        v.value = void 0;
      }
      if (v.value?.administer_delivery)
        try {
          S.value = await Kt.status();
        } catch {
          S.value = void 0;
        }
    }
    d();
    const m = f(!1), y = f(!1), P = f({});
    function T(L) {
      P.value = L, m.value = !0;
    }
    ft(Da, {
      library: z,
      capabilities: v,
      delivery: S,
      go: (L) => {
        R(L);
      },
      create: T,
      upload: () => {
        y.value = !0;
      },
      setDirty: (L) => {
        n.value = L;
      }
    });
    const A = {
      content: (L) => L === "message" ? "Message" : L === "base" ? "Layout" : "Content",
      variables: (L) => L === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, _ = {
      content: (L) => ge[L],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, k = N(() => !!v.value && (v.value.administer_delivery || v.value.send)), F = N(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: ge.message },
        { value: "bases", label: "Base templates", icon: ge.base },
        { value: "parts", label: "Parts", icon: ge.part },
        { value: "assets", label: "Assets", icon: ge.asset }
      ] },
      ...k.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), W = { value: "all", label: "All resources", icon: "tabler:table" }, U = N(() => {
      const L = p.value;
      return L.name !== "resource" ? "" : z.find(L.kind, L.resource)?.title ?? L.resource;
    }), g = N(() => {
      const L = p.value;
      if (L.name === "resource")
        return {
          leading: { value: "all", label: "All " + fa[L.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: U.value, items: Ja(L.kind).map((O) => ({
            value: O,
            label: A[O](L.kind),
            icon: _[O](L.kind)
          })) }]
        };
    }), I = N(() => {
      const L = p.value;
      return L.name === "resource" ? L.section : L.name === "activity" ? "activity" : L.section;
    });
    function C(L) {
      const O = p.value;
      if (O.name === "resource") {
        R(L === "all" ? { name: "library", section: da(O.kind) } : { ...O, section: L });
        return;
      }
      R(L === "activity" ? { name: "activity" } : { name: "library", section: L });
    }
    function h() {
      const L = p.value;
      if (L.name === "library" && L.section === "assets") {
        y.value = !0;
        return;
      }
      L.name === "resource" ? T({ kind: L.kind }) : L.name === "library" ? T({ kind: L.section === "bases" ? "base" : L.section === "parts" ? "part" : "message" }) : T({});
    }
    const Z = f();
    return X(() => Ta(p.value), () => {
      Z.value?.scrollTo({ top: 0 });
    }), (L, O) => (i(), s("main", jn, [
      o(Ot, {
        label: "Mail sections",
        title: "Mail",
        value: I.value,
        groups: g.value ? g.value.groups : F.value,
        "leading-item": g.value ? g.value.leading : W,
        "onUpdate:value": C
      }, {
        actions: j(() => [
          o(Bt, {
            "create-label": "New resource",
            onCreate: h,
            onDefaults: O[0] || (O[0] = (q) => a(De).navigate("/system/settings/mail"))
          })
        ]),
        _: 1
      }, 8, ["value", "groups", "leading-item"]),
      t("div", Un, [
        t("div", {
          ref_key: "main",
          ref: Z,
          class: ne(["kx-main-scroll mail-main", { "mail-main-wide": p.value.name === "resource" && p.value.section === "content" }])
        }, [
          p.value.name === "resource" ? (i(), B(To, {
            key: p.value.kind + "/" + p.value.resource,
            kind: p.value.kind,
            name: p.value.resource,
            section: p.value.section
          }, null, 8, ["kind", "name", "section"])) : p.value.name === "activity" ? (i(), B(Rn, {
            key: 1,
            message: p.value.message,
            template: p.value.template
          }, null, 8, ["message", "template"])) : p.value.section === "assets" ? (i(), B(Ts, {
            key: 2,
            asset: p.value.asset
          }, null, 8, ["asset"])) : (i(), B(Li, {
            key: 3,
            section: p.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      o(Ks, {
        visible: m.value,
        intent: P.value,
        onClose: O[1] || (O[1] = (q) => m.value = !1)
      }, null, 8, ["visible", "intent"]),
      o(Za, {
        visible: y.value,
        onClose: O[2] || (O[2] = (q) => y.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), Dn = /* @__PURE__ */ te({
  __name: "MailAdminRoot",
  setup(e) {
    const l = ht(), r = yt();
    return (u, $) => (i(), B(In, {
      route: a(l).route,
      onNavigate: $[0] || ($[0] = (p) => a(r)("navigate", { route: p })),
      onDirtyChange: $[1] || ($[1] = (p) => a(r)("dirty-change", { dirty: p }))
    }, null, 8, ["route"]));
  }
}), Ln = Tt(Dn, { type: "object", properties: { route: { type: "string", default: "" } } });
xt(import.meta.url, Ln);
//# sourceMappingURL=admin.js.map
