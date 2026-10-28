// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type {Config} from './config'
export interface Evidence {quote:string;section:string;page?:number;chunk_id:string;found?:boolean}
export interface Value {name:string;value:unknown;confidence:number;evidence:Evidence[];verified:boolean;missing?:boolean;reason?:string}
export interface TraceStep {kind:string;status:'completed'|'failed'|'running';scope?:string;model?:string;duration_ms:number;input_tokens:number;output_tokens:number;cost?:number;queries?:string[];message?:string}
export interface Extraction {run_id:string;upload_id:string;config_revision:number;fields:Value[];trace:TraceStep[];duration_ms:number;tokens:number;cost?:number;status?:'completed'|'failed';error?:string;pages?:number}
export interface Run {id:string;caller:'ui'|'agent'|'eval'|'workflow';status:'completed'|'running'|'failed';duration_ms:number;expires_at:string}
export interface EvalCase {id:string;upload_id:string;upload_name:string;expected:Record<string,unknown>}
export interface EvalMetric {field:string;accuracy:number;cost:number;duration_ms:number}
export interface EvalResult {revision:number;cases:number;metrics:EvalMetric[];cost:number;duration_ms:number}
export interface Proposal {id:string;title:string;changes:string[];config:Config;base_revision:number;accuracy_delta:number;cost_delta:number;duration_delta_ms:number}
interface SnapshotBase {id:string;title:string;description?:string;field_count:number;status:string;retention:string;runs:Run[]}
export type Snapshot = SnapshotBase & (
 {can_edit:true;expected_revision:number;config:Config;cases:EvalCase[]} |
 {can_edit:false;expected_revision?:never;config?:never;cases?:never}
)
export interface EngineState {result:Extraction|null;evals:EvalResult[];proposals:Proposal[]}
export interface EngineClient {run(id:string,upload_id:string,overrides?:Partial<Config>):Promise<Extraction>;evaluate(id:string):Promise<EvalResult>;tune(id:string):Promise<Proposal[]>;discard(id:string,proposal_id:string):Promise<void>}
export const emptyEngine=():EngineState=>({result:null,evals:[],proposals:[]})
