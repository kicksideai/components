// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type {Config,Field} from './config'
export interface Evidence {quote:string;section:string;page?:number;chunk_id:string;found?:boolean}
export interface Value {name:string;value:unknown;confidence:number;evidence:Evidence[];verified:boolean;missing?:boolean;reason?:string}
export interface TraceStep {kind:string;status:'completed'|'failed';scope?:string;model?:string;duration_ms:number;input_tokens:number;output_tokens:number;queries?:string[];message?:string}
export interface Extraction {run_id:string;upload_id:string;config_revision:number;fields:Value[];trace:TraceStep[];duration_ms:number;tokens:number;status?:'completed'|'failed';error?:string;pages?:number}
export interface Run {id:string;caller:'ui'|'agent'|'eval'|'workflow';status:'completed'|'failed';upload_id:string;duration_ms:number;tokens:number;created_at:string;expires_at:string}
export interface EvalCase {id:string;upload_id:string;upload_name:string;expected:Record<string,unknown>}
export interface FieldMetric {field:string;accuracy:number;verified:number}
export interface FieldScore {field:string;expected?:unknown;value?:unknown;score:number;verified:boolean}
export interface CaseError {kind:string;message:string;retryable:boolean;details:unknown}
export interface CaseResult {case_id:string;upload_name:string;status:'queued'|'completed'|'failed';run_id?:string;scores:FieldScore[];tokens:number;duration_ms:number;error?:CaseError|null}
export type EvalStatus='queued'|'running'|'completed'|'failed'
export interface Evaluation {id:string;config_revision:number;fields:Field[];status:EvalStatus;case_count:number;metrics:FieldMetric[];tokens:number;duration_ms:number;error?:string;created_at:string;finished_at?:string;results?:CaseResult[]}
interface SnapshotBase {id:string;title:string;description?:string;field_count:number;status:string;retention:string;runs:Run[];can_share:boolean}
export type Snapshot = SnapshotBase & (
 {can_edit:true;expected_revision:number;config:Config;cases:EvalCase[]} |
 {can_edit:false;expected_revision?:never;config?:never;cases?:never}
)
export const finished=(e:Evaluation)=>e.status==='completed'||e.status==='failed'
export const meanAccuracy=(e:Evaluation)=>e.metrics.length?e.metrics.reduce((s,m)=>s+m.accuracy,0)/e.metrics.length:0
