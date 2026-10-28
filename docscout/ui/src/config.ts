// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import schema from '../../src/config.schema.json'
export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'enum' | 'list' | 'object'
export interface Field { name:string; type:FieldType; description:string; enum_values:string[]; item_type:string; required:boolean; search_hints:string; validation_hints:string; expected_format:string; strategy:'standard'|'deep'; search_within:'document'|'sections'; group:string; evidence_required:boolean; chunks:number }
export interface PrefetchQuery { name:string; query:string; chunks:number }
export interface Stages {
 map:{enabled:boolean;model:string;outline:'find_or_build'|'build';section_summaries:boolean}
 prefetch:{enabled:boolean;queries:PrefetchQuery[]}
 scout:{enabled:boolean;mode:'loop'|'agent';model:string;max_rounds:number;target_confidence:number;max_extra_queries:number;max_tokens:number;drop_noise:boolean;share_notes:boolean;tools:string[]}
 deep:{enabled:boolean;model:string;query_model:string;read:'chunks'|'sections';parallel_fields:number;max_queries:number;chunks_per_query:number;chunk_cap:number;min_similarity:number;query_temperature:number;analysis_temperature:number}
 extract:{model:string;structured_output:boolean;max_output_tokens:number;max_fields_per_call:number}
 verify:{enabled:boolean;model:string;check_quotes:boolean;check_support:boolean}
}
export type StageKey = keyof Stages
export interface Retrieval {chunk_size:number;overlap:number;split_headings:boolean;keep_tables:boolean;search_mode:'keyword'|'semantic'|'hybrid';top_results:number;embedding_model:string;context:'none'|'headings'|'generated';context_model:string;highlighter:boolean;highlighter_model:string;section_budget:number}
export interface Config {fields:Field[];stages:Stages;retrieval:Retrieval;tags:string[]}

export const newConfig=():Config=>structuredClone(schema.default) as Config
export const newField=():Field=>structuredClone(schema.properties.fields.items.default) as Field
export const newQuery=():PrefetchQuery=>({name:'',query:'',chunks:5})
export const documentTools=():string[]=>[...schema.properties.stages.properties.scout.properties.tools.default]

type Bounds={min:number;max:number}
type NumberSchema={minimum?:number;maximum?:number}
const ranges=schema as unknown as {properties:{stages:{properties:Record<string,{properties:Record<string,NumberSchema>}>};retrieval:{properties:Record<string,NumberSchema>}}}
const bounds=(p:NumberSchema|undefined):Bounds=>({min:p?.minimum??0,max:p?.maximum??100})
export const stageBounds=(stage:StageKey,key:string):Bounds=>bounds(ranges.properties.stages.properties[stage]?.properties[key])
export const retrievalBounds=(key:keyof Retrieval):Bounds=>bounds(ranges.properties.retrieval.properties[key])

export const stageLabels:Record<StageKey,string>={map:'Map the document',prefetch:'Prefetch',scout:'Scout loop',deep:'Deep analysis',extract:'Extract',verify:'Verify'}
export const stageIcons:Record<StageKey,string>={map:'tabler:list-tree',prefetch:'tabler:search',scout:'tabler:radar-2',deep:'tabler:microscope',extract:'tabler:table-export',verify:'tabler:shield-check'}
export const stagePurpose:Record<StageKey,string>={
 map:'Find the table of contents or build an outline, then pick the sections each field should read.',
 prefetch:'Search for every field by its name, description and hints, plus any fixed queries, to fill the evidence pool.',
 scout:'Judge the evidence, drop noise and look for more until confident.',
 deep:'Give each deep field its own searches and a written analysis, several fields at a time.',
 extract:'Fill the fields from the evidence, one group of fields per call.',
 verify:'Check that each quote exists in the document and supports its value.',
}
export const optionalStages:StageKey[]=['map','prefetch','scout','deep','verify']
export const isOn=(config:Config,key:StageKey)=>key==='extract'||(config.stages[key] as {enabled:boolean}).enabled

const plural=(n:number,word:string)=>`${n} ${n===1?word:word.endsWith('y')?word.slice(0,-1)+'ies':word+'s'}`
export function fieldGroups(config:Config):{name:string;fields:Field[]}[]{
 const groups=new Map<string,Field[]>()
 for(const f of config.fields){const g=f.group.trim()||'Default';groups.set(g,[...(groups.get(g)??[]),f])}
 return [...groups].map(([name,fields])=>({name,fields}))
}
export function extractCalls(config:Config):number{
 return fieldGroups(config).reduce((n,g)=>n+Math.max(1,Math.ceil(g.fields.length/config.stages.extract.max_fields_per_call)),0)
}
export function stageSummary(key:StageKey,config:Config):string{
 const s=config.stages
 switch(key){
  case 'map':{const scoped=config.fields.filter(f=>f.search_within==='sections').length;return [s.map.outline==='build'?'Always build an outline':'Contents first, else build',scoped?`${plural(scoped,'field')} read Map's sections`:''].filter(Boolean).join(' · ')}
  case 'prefetch':{const searched=config.fields.filter(f=>f.strategy!=='deep'||!s.deep.enabled).length,hints=config.fields.filter(f=>f.search_hints.trim()).length;return [plural(searched,'field'),hints?plural(hints,'field hint'):'',s.prefetch.queries.length?plural(s.prefetch.queries.length,'query'):''].filter(Boolean).join(' · ')}
  case 'scout':return `${s.scout.mode==='agent'?'Agent with tools':'Structured loop'} · ${s.scout.max_rounds?`up to ${plural(s.scout.max_rounds,'round')}, stop at ${Math.round(s.scout.target_confidence*100)}%`:'single pass'}`
  case 'deep':{const deep=config.fields.filter(f=>f.strategy==='deep').length;return deep?`${plural(deep,'field')} · reads ${s.deep.read} · ${s.deep.parallel_fields} at a time`:'No deep fields'}
  case 'extract':{const calls=extractCalls(config);return `${s.extract.structured_output?'Structured output':'Free text'} · ${plural(fieldGroups(config).length,'group')}, ${plural(calls,'call')}`}
  case 'verify':return [s.verify.check_quotes?'quotes exist':'',s.verify.check_support?'quotes support values':''].filter(Boolean).join(' · ')||'No checks'
 }
}
export function documentSummary(r:Retrieval):string{
 const context=r.context==='generated'?'generated context':r.context==='headings'?'heading context':''
 return [`${r.chunk_size.toLocaleString()}-token chunks`,`${r.search_mode} search`,context,r.highlighter?'highlighter':''].filter(Boolean).join(' · ')
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

export const takesChoices=(f:Field)=>f.type==='enum'||(f.type==='list'&&f.item_type==='text')
export function fieldError(f:Field,otherNames:string[]):string{
 if(!f.name)return 'Name the field.'
 if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(f.name))return 'Start with a letter; use letters, numbers and underscores.'
 if(otherNames.includes(f.name))return 'Another field already uses this name.'
 if(f.type==='enum'&&!f.enum_values.length)return 'Add at least one allowed value.'
 if(f.enum_values.length&&f.type!=='enum'&&!(f.type==='list'&&f.item_type==='text'))return 'Allowed values apply to enum fields and lists of text.'
 return ''
}
export function formatPlaceholder(f:Field):string{
 const item=f.type==='list'?f.item_type:f.type
 return ({text:'For example, full legal name',number:'For example, decimal with 2 places',date:'For example, YYYY-MM-DD',object:'For example, {"name": "", "amount": 0}',boolean:'',enum:''} as Record<string,string>)[item]??''
}
export function configError(config:Config):string {
 for(const [i,f] of config.fields.entries()){const error=fieldError(f,config.fields.filter((_,j)=>j!==i).map(o=>o.name));if(error)return `${f.name||'New field'}: ${error}`}
 const s=config.stages
 if(s.prefetch.queries.some(q=>!q.name.trim()||!q.query.trim()))return 'Prefetch queries need a name and a query.'
 if(!s.map.enabled&&config.fields.some(f=>f.search_within==='sections'))return 'Fields that read sections need Map the document.'
 const unread=config.fields.find(f=>!(f.strategy==='deep'&&s.deep.enabled)&&!s.prefetch.enabled&&!s.scout.enabled)
 if(unread)return `Turn on Prefetch or Scout so extraction has passages to read for ${unread.name}.`
 if(s.scout.enabled&&s.scout.mode==='agent'&&!s.scout.tools.length)return 'Agent scouting needs at least one tool.'
 if(s.scout.enabled&&s.scout.mode==='agent'&&(!s.scout.max_rounds||!s.scout.max_extra_queries))return 'Agent scouting needs at least one round and one tool call per round.'
 if(s.verify.enabled&&!s.verify.check_quotes&&!s.verify.check_support)return 'Verify needs at least one check.'
 if(config.retrieval.overlap>=config.retrieval.chunk_size)return 'Overlap must be smaller than chunk size.'
 return ''
}

export function sameConfig(left:Config,right:Config|undefined):boolean {
 const ordered=(_key:string,value:unknown)=>value!==null&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(key=>[key,(value as Record<string,unknown>)[key]])):value
 return JSON.stringify(left,ordered)===JSON.stringify(right,ordered)
}
