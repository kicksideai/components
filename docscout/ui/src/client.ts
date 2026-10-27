// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {api} from '@wippy-fe/proxy'
import type {Config} from './config'
export type {Snapshot,EngineState,Extraction,EvalCase,Run,EvalResult,Proposal,EngineClient} from './models'
import type {Snapshot} from './models'
const path=(id:string)=>`/api/v1/docscout/${encodeURIComponent(id)}`
function checked<T>(data:T&{success?:boolean;error?:string}):T{if(data.success===false)throw new Error(data.error||'Request failed');return data}
export const client={
 async get(id:string):Promise<Snapshot>{return checked((await api.get(path(id))).data)},
 async create(input:{title:string;description:string;config:Config;parent_id?:string}):Promise<{component_id:string}>{return checked((await api.post('/api/v1/docscout',input)).data)},
 async update(id:string,input:{title:string;description:string;config:Config;expected_revision:number}):Promise<{context_revision:number}>{return checked((await api.put(path(id),input)).data)},
 async addCase(id:string,input:{upload_id:string;upload_name:string;expected:Record<string,unknown>}):Promise<{id:string}>{return checked((await api.post(path(id)+'/cases',input)).data)},
 async deleteCase(id:string,case_id:string):Promise<void>{checked((await api.delete(path(id)+'/cases/'+encodeURIComponent(case_id))).data)},
 async remove(id:string):Promise<void>{checked((await api.delete(path(id))).data)}
}
