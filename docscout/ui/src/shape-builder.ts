// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {fieldPath,newField,newProperty,setValue,MAX_SHAPE_DEPTH,type Field,type Shape,type Property,type FieldType} from './config'
export type Trail=(number|'item')[]
export interface ShapeNode {field:number;trail:Trail;shape:Shape;path:string;depth:number;key:string}
export const shapeKey=(field:number,trail:Trail)=>`${field}:${trail.join('/')}`
export const typeOptions:{value:FieldType;label:string;icon:string}[]=[
 {value:'text',label:'Text',icon:'tabler:typography'},{value:'number',label:'Number',icon:'tabler:123'},
 {value:'boolean',label:'Yes / no',icon:'tabler:toggle-right'},{value:'date',label:'Date',icon:'tabler:calendar'},
 {value:'enum',label:'One of a set',icon:'tabler:list-details'},{value:'list',label:'List',icon:'tabler:brackets'},
 {value:'object',label:'Object',icon:'tabler:braces'},
]
export const typeIcon=(type:FieldType)=>typeOptions.find(t=>t.value===type)!.icon
export function shapeNodes(fields:Field[]):ShapeNode[]{
 const nodes:ShapeNode[]=[]
 function visit(shape:Shape,field:number,trail:Trail,path:string){
  nodes.push({field,trail,shape,path,depth:trail.length+1,key:shapeKey(field,trail)})
  shape.properties?.forEach((p,i)=>visit(p,field,[...trail,i],`${path}.${p.name||'New property'}`))
  if(shape.item)visit(shape.item,field,[...trail,'item'],`${path}[]`)
 }
 fields.forEach((f,i)=>visit(f,i,[],fieldPath(f)||'New field'))
 return nodes
}
export function shapeHeight(shape:Shape):number{return 1+Math.max(0,...(shape.properties??[]).map(shapeHeight),shape.item?shapeHeight(shape.item):0)}
export function moveTargets(fields:Field[],source:ShapeNode):ShapeNode[]{
 return shapeNodes(fields).filter(n=>n.shape.type==='object'&&((n.shape.properties?.length??0)<100||(n.field===source.field&&shapeKey(n.field,n.trail)===shapeKey(source.field,source.trail.slice(0,-1))))&&n.depth+shapeHeight(source.shape)<=MAX_SHAPE_DEPTH&&
 !(n.field===source.field&&source.trail.every((segment,i)=>n.trail[i]===segment)))
}
export function moveShape(fields:Field[],source:ShapeNode,target?:ShapeNode):ShapeNode{
 const property:Property={...newProperty(),...source.shape,name:(source.shape as Property).name}
 if(!source.trail.length)fields.splice(source.field,1)
 else{
  const parent=shapeNodes(fields).find(n=>n.key===shapeKey(source.field,source.trail.slice(0,-1)))!
  parent.shape.properties!.splice(source.trail.at(-1) as number,1)
 }
 let moved:Shape
 if(target){
  // Properties carry only the recursive schema's shape and naming fields.
  const {name,type,description,enum_values,expected_format,required,properties,item}=property
  moved={name,type,description,enum_values,expected_format,required,...(properties?{properties}:{}),...(item?{item}:{})} as Property
  target.shape.properties!.push(moved as Property);moved=target.shape.properties!.at(-1)!
 }else{moved={...newField(),...property,group:''} as Field;fields.push(moved as Field);moved=fields.at(-1)!}
 return shapeNodes(fields).find(n=>n.shape===moved)!
}
export function outputPreview(fields:Field[],example=false):Record<string,unknown>{
 function value(s:Shape):unknown{
  if(s.type==='object')return Object.fromEntries((s.properties??[]).map(p=>[p.name||'unnamed',value(p)]))
  if(s.type==='list')return s.item?[value(s.item)]:[]
  if(!example)return s.type==='enum'?s.enum_values?.join(' | ')||'enum':s.type
  if(s.enum_values?.length)return s.enum_values[0]
  return {text:'Example value',number:42,boolean:true,date:'2026-01-15',enum:null}[s.type]
 }
 const result:Record<string,unknown>={}
 fields.forEach(f=>setValue(result,fieldPath(f)||'unnamed',value(f)))
 return result
}
