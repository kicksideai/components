// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {api} from '@wippy-fe/proxy'
import type {Config} from './config'
export type {Snapshot,Extraction,EvalCase,Run,Evaluation,CaseResult,FieldMetric,FieldScore,EvalStatus} from './models'
import type {Snapshot,Extraction,Evaluation,TraceStep} from './models'
export interface ExtractorItem {component_id:string;updated_at:string;access_level?:number;meta:{title:string;description?:string;field_count?:string;status?:string;owner?:string}}
interface Failure {success:false;error?:string;kind?:string;details?:{run_id?:string;trace?:TraceStep[]}}
const path=(id:string)=>`/api/v1/docscout/${encodeURIComponent(id)}`
function checked<T>(data:T&{success?:boolean;error?:string}):T{if(data.success===false)throw new Error(data.error||'Request failed');return data}
const failure=(e:unknown)=>(e as {response?:{data?:Failure}}).response?.data
export const client={
 async list():Promise<{items:ExtractorItem[];truncated:boolean}>{const data=checked((await api.get('/api/v1/docscout')).data);return {items:data.items,truncated:!!data.truncated}},
 async get(id:string):Promise<Snapshot>{return checked((await api.get(path(id))).data)},
 async create(input:{title:string;description:string;config:Config;parent_id?:string}):Promise<{component_id:string}>{return checked((await api.post('/api/v1/docscout',input)).data)},
 async update(id:string,input:{title:string;description:string;config:Config;expected_revision:number}):Promise<{context_revision:number}>{return checked((await api.put(path(id),input)).data)},
 async addCase(id:string,input:{upload_id:string;expected:Record<string,unknown>}):Promise<{id:string}>{return checked((await api.post(path(id)+'/cases',input)).data)},
 async deleteCase(id:string,case_id:string):Promise<void>{checked((await api.delete(path(id)+'/cases/'+encodeURIComponent(case_id))).data)},
 // A run that stops partway still answers with its run id and step trace.
 async run(id:string,upload_id:string):Promise<Extraction>{
  try{return checked((await api.post(path(id)+'/run',{upload_id})).data)}
  catch(e){
   const data=failure(e),trace=data?.details?.trace
   if(!trace)throw e
   return {run_id:data?.details?.run_id??'',upload_id,config_revision:0,fields:[],trace,duration_ms:trace.reduce((n,t)=>n+t.duration_ms,0),tokens:trace.reduce((n,t)=>n+t.input_tokens+t.output_tokens,0),status:'failed',error:data?.error}
  }
 },
 async evaluate(id:string):Promise<{eval_id:string}>{return checked((await api.post(path(id)+'/evaluations',{})).data)},
 async evaluations(id:string):Promise<Evaluation[]>{return checked((await api.get(path(id)+'/evaluations')).data).items},
 async evaluation(id:string,eval_id:string):Promise<Evaluation>{return checked((await api.get(path(id)+'/evaluations/'+encodeURIComponent(eval_id))).data).evaluation},
 async remove(id:string):Promise<void>{checked((await api.delete(path(id))).data)}
}
