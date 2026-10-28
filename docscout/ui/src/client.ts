// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {api} from '@wippy-fe/proxy'
import type {Config} from './config'
export type {Snapshot,EngineState,Extraction,EvalCase,Run,EvalResult,Proposal,EngineClient} from './models'
import type {Snapshot,Extraction} from './models'
export interface ExtractorItem {component_id:string;updated_at:string;meta:{title:string;description?:string;field_count?:string;status?:string;owner?:string}}
const path=(id:string)=>`/api/v1/docscout/${encodeURIComponent(id)}`
function checked<T>(data:T&{success?:boolean;error?:string}):T{if(data.success===false)throw new Error(data.error||'Request failed');return data}
export const client={
 async list():Promise<ExtractorItem[]>{return checked((await api.get('/api/v1/docscout')).data).items},
 async get(id:string):Promise<Snapshot>{return checked((await api.get(path(id))).data)},
 async create(input:{title:string;description:string;config:Config;parent_id?:string}):Promise<{component_id:string}>{return checked((await api.post('/api/v1/docscout',input)).data)},
 async update(id:string,input:{title:string;description:string;config:Config;expected_revision:number}):Promise<{context_revision:number}>{return checked((await api.put(path(id),input)).data)},
 async addCase(id:string,input:{upload_id:string;upload_name:string;expected:Record<string,unknown>}):Promise<{id:string}>{return checked((await api.post(path(id)+'/cases',input)).data)},
 async deleteCase(id:string,case_id:string):Promise<void>{checked((await api.delete(path(id)+'/cases/'+encodeURIComponent(case_id))).data)},
 async run(id:string,upload_id:string):Promise<Extraction>{
  try{return checked((await api.post(path(id)+'/run',{upload_id})).data)}
  catch(e){const data=(e as {response?:{data?:{error?:string;trace?:Extraction['trace'];run_id?:string}}}).response?.data;if(data?.trace)return {run_id:data.run_id??'',upload_id,config_revision:0,fields:[],trace:data.trace,duration_ms:data.trace.reduce((n,t)=>n+t.duration_ms,0),tokens:data.trace.reduce((n,t)=>n+t.input_tokens+t.output_tokens,0),status:'failed',error:data.error};throw e}
 },
 async remove(id:string):Promise<void>{checked((await api.delete(path(id))).data)}
}
