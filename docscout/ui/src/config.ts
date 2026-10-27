// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import schema from '../../src/config.schema.json'
export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'enum' | 'list' | 'object'
export interface Field { name:string; type:FieldType; description:string; enum_values:string[]; item_type:string; required:boolean; search_hints:string; validation_hints:string; expected_format:string; strategy:'standard'|'deep'; evidence_required:boolean; chunks:number }
export interface PrefetchQuery { name:string; query:string; chunks:number }
export type StepKind = 'map'|'prefetch'|'scout'|'deep'|'extract'|'verify'
export type Scope = 'outline'|'section'|'chunk'
export interface Step {kind:StepKind;enabled:boolean;scope:Scope;model?:string;options:Record<string,any>}
export interface Retrieval {chunk_size:number;overlap:number;split_headings:boolean;search_mode:'keyword'|'semantic'|'hybrid';top_results:number;contextual_embeddings:boolean;highlighter:boolean;highlighter_model:string;embedding_model:string}
export interface Config {fields:Field[];workflow:Step[];retrieval:Retrieval;tools:string[];tags:string[];shared_context:boolean}

export const newConfig=():Config=>structuredClone(schema.default) as Config
export const newField=():Field=>structuredClone(schema.properties.fields.items.default) as Field
export const newQuery=():PrefetchQuery=>({name:'',query:'',chunks:5})
export const documentTools=():string[]=>[...schema.default.tools]

export const stepLabels:Record<StepKind,string>={map:'Map the document',prefetch:'Prefetch',scout:'Scout loop',deep:'Deep analysis',extract:'Extract',verify:'Verify'}
export const stepIcons:Record<StepKind,string>={map:'tabler:list-tree',prefetch:'tabler:search',scout:'tabler:radar-2',deep:'tabler:microscope',extract:'tabler:table-export',verify:'tabler:shield-check'}
export const stepPurpose:Record<StepKind,string>={map:'Find the table of contents or build an outline before reading.',prefetch:'Run fixed queries before scouting.',scout:'Judge the evidence, drop noise and ask for more until confident.',deep:'Analyse deep fields on their own, in parallel.',extract:'Fill every field with structured output.',verify:'Check each value against its cited evidence.'}

const reorderable:StepKind[]=['prefetch','scout','deep']
export const canMove=(config:Config,index:number,delta:number)=>{
 const step=config.workflow[index],other=config.workflow[index+delta]
 return !!step&&!!other&&reorderable.includes(step.kind)&&reorderable.includes(other.kind)
}
export function moveStep(config:Config,index:number,delta:number){
 if(!canMove(config,index,delta))return
 const [step]=config.workflow.splice(index,1);config.workflow.splice(index+delta,0,step)
}

const plural=(n:number,word:string)=>`${n} ${n===1?word:word.endsWith('y')?word.slice(0,-1)+'ies':word+'s'}`
export function stepSummary(step:Step,config:Config):string{
 const o=step.options
 switch(step.kind){
  case 'map':return o.outline_mode==='build'?'Build an outline':'Use the table of contents, or build an outline'
  case 'prefetch':{const hints=config.fields.filter(f=>f.search_hints.trim()).length;return [plural(o.queries.length,'query'),hints?`${plural(hints,'field hint')}`:''].filter(Boolean).join(' · ')}
  case 'scout':return o.max_iterations?`Up to ${plural(o.max_iterations,'round')} · stop at ${Math.round(o.target_confidence*100)}% · ${plural(o.max_extra_queries,'extra query')}`:'Single pass, no extra rounds'
  case 'deep':{const deep=config.fields.filter(f=>f.strategy==='deep').length;return deep?`${plural(deep,'field')} · ${o.parallel_fields} at a time`:'No deep fields'}
  case 'extract':return `${o.structured_output?'Structured output':'Free text'} · up to ${o.max_output_tokens.toLocaleString()} tokens`
  case 'verify':return o.require_all_values?'Every value against its evidence':'Values that carry evidence'
 }
}
export function documentSummary(r:Retrieval):string{
 return `${r.chunk_size.toLocaleString()}-token chunks · ${r.search_mode} search${r.contextual_embeddings?' · contextual':''}${r.highlighter?' · highlighter':''}`
}
export function modelLabel(model:string|undefined):string{
 if(!model)return ''
 if(model.startsWith('class:'))return model.slice(6).replace(/^\w/,c=>c.toUpperCase())
 return model.split('/').pop()??model
}
export function toolLabel(id:string):string{
 const name=id.split(':').pop()??id
 return name.replace(/_/g,' ').replace(/^\w/,c=>c.toUpperCase())
}

export const takesChoices=(f:Field)=>f.type==='enum'||f.type==='list'
export function fieldError(f:Field,otherNames:string[]):string{
 if(!f.name)return 'Name the field.'
 if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(f.name))return 'Start with a letter; use letters, numbers and underscores.'
 if(otherNames.includes(f.name))return 'Another field already uses this name.'
 if(f.type==='enum'&&!f.enum_values.length)return 'Add at least one allowed value.'
 return ''
}
export function formatPlaceholder(f:Field):string{
 const item=f.type==='list'?f.item_type:f.type
 return ({text:'For example, full legal name',number:'For example, decimal with 2 places',date:'For example, YYYY-MM-DD',object:'For example, {"name": "", "amount": 0}',boolean:'',enum:''} as Record<string,string>)[item]??''
}
export function configError(config:Config):string {
 for(const [i,f] of config.fields.entries()){const error=fieldError(f,config.fields.filter((_,j)=>j!==i).map(o=>o.name));if(error)return `${f.name||'New field'}: ${error}`}
 const prefetch=config.workflow.find(s=>s.kind==='prefetch')
 if(prefetch?.options.queries.some((q:PrefetchQuery)=>!q.name.trim()||!q.query.trim()))return 'Prefetch queries need a name and a query.'
 if(config.retrieval.overlap>=config.retrieval.chunk_size)return 'Overlap must be smaller than chunk size.'
 return ''
}

export function sameConfig(left:Config,right:Config|undefined):boolean {
 const ordered=(_key:string,value:unknown)=>value!==null&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(key=>[key,(value as Record<string,unknown>)[key]])):value
 return JSON.stringify(left,ordered)===JSON.stringify(right,ordered)
}
