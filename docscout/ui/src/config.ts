// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import schema from '../../src/config.schema.json'
export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'enum' | 'list' | 'object'
export interface Field { name:string; type:FieldType; description:string; enum_values:string[]; item_type:string; required:boolean; search_hints:string; validation_hints:string; expected_format:string; strategy:'standard'|'deep'; evidence_required:boolean }
export interface Step {kind:'map'|'prefetch'|'scout'|'deep'|'extract'|'verify';enabled:boolean;scope:'outline'|'section'|'chunk';model?:string;options:Record<string,string|number|boolean|string[]|undefined>}
export interface Config {fields:Field[];workflow:Step[];retrieval:{chunk_size:number;overlap:number;split_headings:boolean;search_mode:'keyword'|'semantic'|'hybrid';top_results:number;contextual_embeddings:boolean;highlighter:boolean;highlighter_model:string;embedding_model:string};tools:{keyword_search:boolean;semantic_search:boolean;read_section:boolean;read_outline:boolean}}
export const newConfig=():Config=>structuredClone(schema.default) as Config
export const newField=():Field=>structuredClone(schema.properties.fields.items.default) as Field
export const stepLabels:Record<Step['kind'],string>={map:'Map the document',prefetch:'Prefetch',scout:'Scout loop',deep:'Deep analysis',extract:'Extract',verify:'Verify'}
export function configError(config:Config):string {
 const names=new Set<string>()
 for(const f of config.fields){
  if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(f.name))return 'Field names start with a letter and contain letters, numbers, and underscores.'
  if(names.has(f.name))return 'Field names must be unique.'
  names.add(f.name)
  if(f.type==='enum'&&!f.enum_values.length)return 'Enum fields need at least one value.'
 }
 if(config.retrieval.overlap>=config.retrieval.chunk_size)return 'Overlap must be smaller than chunk size.'
 return ''
}
export function moveStep(config:Config,index:number,delta:number){
 const next=index+delta
 if(index===0||next<=0||next>=config.workflow.length)return
 const [step]=config.workflow.splice(index,1);config.workflow.splice(next,0,step)
}

export function sameConfig(left:Config,right:Config|undefined):boolean {
 const ordered=(_key:string,value:unknown)=>value!==null&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(key=>[key,(value as Record<string,unknown>)[key]])):value
 return JSON.stringify(left,ordered)===JSON.stringify(right,ordered)
}
