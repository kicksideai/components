// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import schema from '../../src/config.schema.json'
export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'enum' | 'list' | 'object'
export interface Shape {type:FieldType;description?:string;enum_values?:string[];expected_format?:string;properties?:Property[];item?:Shape}
export interface Property extends Shape {name:string;description:string;enum_values:string[];expected_format:string;required:boolean}
export interface Field extends Property {search_hints:string;validation_hints:string;strategy:'standard'|'deep';search_within:'document'|'sections';group:string;evidence_required:boolean;chunks:number}
export const MAX_SHAPE_DEPTH=4
export const newProperty=():Property=>({name:'',type:'text',description:'',enum_values:[],expected_format:'',required:false})
export const newItem=():Shape=>({type:'text',description:'',enum_values:[],expected_format:''})
export const fieldPath=(f:Pick<Field,'name'|'group'>)=>f.group?`${f.group}.${f.name}`:f.name
export const groupPattern=/^(?:[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:_[a-z0-9]+)*)*)?$/
export function getValue(value:Record<string,unknown>,path:string):unknown{
 let node:unknown=value
 for(const segment of path.split('.')){if(node===null||typeof node!=='object'||!Object.hasOwn(node,segment))return undefined;node=(node as Record<string,unknown>)[segment]}
 return node
}
export function setValue(value:Record<string,unknown>,path:string,item:unknown){
 const segments=path.split('.');let node=value
 for(const segment of segments.slice(0,-1)){if(!Object.hasOwn(node,segment))node[segment]={};node=node[segment] as Record<string,unknown>}
 Object.defineProperty(node,segments.at(-1)!,{value:item,writable:true,enumerable:true,configurable:true})
}
export interface GroupNode {name:string;path:string;indices:number[];children:GroupNode[]}
export function groupTree(paths:string[]):GroupNode{
 const root:GroupNode={name:'',path:'',indices:[],children:[]}
 paths.forEach((path,index)=>{let node=root;for(const name of path.split('.').slice(0,-1)){let child=node.children.find(c=>c.name===name);if(!child){child={name,path:node.path?`${node.path}.${name}`:name,indices:[],children:[]};node.children.push(child)}node=child}node.indices.push(index)})
 return root
}
export interface PrefetchQuery { name:string; query:string; chunks:number }
export interface Stages {
 map:{enabled:boolean;model:string;outline:'find_or_build'|'build';section_summaries:boolean}
 prefetch:{enabled:boolean;queries:PrefetchQuery[]}
 scout:{enabled:boolean;mode:'loop'|'agent';model:string;max_rounds:number;target_confidence:number;max_extra_queries:number;max_tokens:number;drop_noise:boolean;share_notes:boolean;tools:string[]}
 deep:{enabled:boolean;model:string;query_model:string;read:'chunks'|'sections';parallel_fields:number;max_queries:number;chunks_per_query:number;chunk_cap:number;min_similarity:number;query_temperature:number;analysis_temperature:number}
 extract:{model:string;max_output_tokens:number;max_fields_per_call:number}
 verify:{enabled:boolean;model:string;check_quotes:boolean;check_support:boolean}
}
export type StageKey = keyof Stages
export interface Retrieval {chunk_size:number;overlap:number;split_headings:boolean;keep_tables:boolean;search_mode:'keyword'|'semantic'|'hybrid';embedding_model:string;context:'none'|'headings'|'generated';context_model:string;highlighter:boolean;highlighter_model:string;section_budget:number}
export interface Config {fields:Field[];stages:Stages;retrieval:Retrieval;tags:string[]}

export function newConfig():Config{
 const config=structuredClone(schema.default)
 const {model,max_output_tokens,max_fields_per_call}=config.stages.extract
 return {...config,stages:{...config.stages,extract:{model,max_output_tokens,max_fields_per_call}}} as Config
}
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
  case 'scout':return s.scout.mode==='agent'?`Agent with tools · up to ${plural(s.scout.max_rounds*s.scout.max_extra_queries,'tool call')}`:`Structured loop · ${s.scout.max_rounds?`up to ${plural(s.scout.max_rounds,'round')}, stop at ${Math.round(s.scout.target_confidence*100)}%`:'single pass'}`
  case 'deep':{const deep=config.fields.filter(f=>f.strategy==='deep').length;return deep?`${plural(deep,'field')} · reads ${s.deep.read} · ${s.deep.parallel_fields} at a time`:'No deep fields'}
  case 'extract':{const calls=extractCalls(config);return `Structured output · ${plural(fieldGroups(config).length,'group')}, ${plural(calls,'call')}`}
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
 return id.replace(/_/g,' ').replace(/^\w/,c=>c.toUpperCase())
}

export const takesChoices=(f:Shape,named=true)=>f.type==='enum'||(!named&&f.type==='text')
export function shapeError(f:Shape,depth=1):string{
 if(depth>MAX_SHAPE_DEPTH)return 'Shapes support at most four levels.'
 if(f.type==='enum'&&!f.enum_values?.length)return 'Add at least one allowed value.'
 if(f.enum_values?.length&&f.type!=='enum'&&f.type!=='text')return 'Allowed values apply to enum fields and text items.'
 if(f.type==='object'){
  if(!f.properties?.length)return 'Add at least one declared property.'
  const names=new Set<string>()
  for(const p of f.properties){const error=nameError(p.name,[...names])||shapeError(p,depth+1);if(error)return `${p.name||'New property'}: ${error}`;names.add(p.name)}
 }else if(f.properties)return 'Properties apply to object shapes.'
 if(f.type==='list'){if(!f.item)return 'Declare the item shape.';return shapeError(f.item,depth+1)}
 if(f.item)return 'Item shapes apply to lists.'
 return ''
}
function nameError(name:string,otherNames:string[]):string{
 if(!name)return 'Name the field.'
 if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(name))return 'Start with a letter; use letters, numbers and underscores.'
 if(otherNames.includes(name))return 'Another field already uses this name.'
 return ''
}
export function fieldError(f:Field,otherPaths:string[]):string{
 const error=nameError(f.name,otherPaths.includes(fieldPath(f))?[f.name]:[])
 if(error)return error
 if(!groupPattern.test(f.group))return 'Use a dotted path of snake_case group names.'
 if(f.enum_values.length&&f.type!=='enum')return 'Allowed values apply to enum fields and text items.'
 return shapeError(f)
}
export function formatPlaceholder(f:Shape):string{
 const item=f.type==='list'?f.item?.type:f.type
 return ({text:'For example, full legal name',number:'For example, decimal with 2 places',date:'For example, YYYY-MM-DD',object:'Describe the object format',boolean:'',enum:''} as Record<string,string>)[item??'']??''
}
export function configError(config:Config):string {
 for(const [i,f] of config.fields.entries()){const error=fieldError(f,config.fields.filter((_,j)=>j!==i).map(fieldPath));if(error)return `${f.name||'New field'}: ${error}`}
 const paths=config.fields.map(fieldPath)
 for(const path of paths){if(paths.some(other=>other!==path&&other.startsWith(path+'.')))return `Group path collides with field ${path}.`}
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
