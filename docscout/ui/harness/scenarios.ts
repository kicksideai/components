// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {newField,newProperty,setValue} from '../src/config'
import {snapshot,result,evaluation,evaluations} from './fixtures'
export function scenario(state:string|null){
 const data=structuredClone(snapshot),run=structuredClone(result),current=structuredClone(evaluation),history=structuredClone(evaluations)
 if(state==='nested'&&data.can_edit){
  data.config.fields.push({...newField(),name:'terms',group:'contract',type:'object',required:true,description:'Payment schedule with amounts and due dates.',properties:[{...newProperty(),name:'currency',type:'enum',enum_values:['USD','EUR'],required:true},{...newProperty(),name:'payments',type:'list',item:{type:'object',properties:[{...newProperty(),name:'amount',type:'number',required:true},{...newProperty(),name:'due',type:'date'}]}}]})
  data.field_count=data.config.fields.length
 }
 if(state==='groups'&&data.can_edit){
  data.title='Credit agreement'
  data.config.fields=[
   {...newField(),group:'agreement',name:'title',required:true,description:'Formal title of the agreement, including the document version and any amendment.'},
   {...newField(),group:'agreement',name:'effective_date',type:'date',description:'The date on which this agreement becomes effective.'},
   {...newField(),group:'agreement',name:'governing_law',description:'The jurisdiction whose laws govern the agreement.'},
   {...newField(),group:'parties',name:'issuing_lenders',type:'list',item:{type:'text'},description:'Lenders that issue letters of credit under this agreement.'},
   {...newField(),group:'parties.borrower',name:'legal_name',required:true,description:'Full legal name of the borrower, including its registered legal form.'},
   {...newField(),group:'parties.borrower',name:'notice_address',strategy:'deep',search_within:'sections',required:true,description:'Registered address used for formal notices, including the attention line and postal code.'},
   {...newField(),group:'parties.borrower',name:'registered_office',type:'object',description:'The borrower’s registered office.',properties:[{...newProperty(),name:'city',description:'City of registration.'},{...newProperty(),name:'country',description:'Country of registration.',required:true}]},
   {...newField(),group:'parties.agent',name:'legal_name',description:'The administrative agent’s full legal name.'},
  ]
  data.field_count=data.config.fields.length
 }
 if(state==='partial'){
  const error={kind:'UNAVAILABLE',message:'The payment section could not be read.',retryable:true,details:{section:'Payment terms'}}
  run.status='partial';Object.assign(run.fields[1],{failed:true,error,value:null,verified:false,confidence:0,evidence:[]})
  setValue(run.values,'payment.payment_terms',null)
  data.runs[0].status='partial';data.runs[0].result={fields:run.fields,values:run.values}
  current.status='partial';current.error=undefined
  current.results![0].status='partial';Object.assign(current.results![0].scores[1],{failed:true,error,value:null,verified:false,score:0})
  history[0]=current
 }
 return {data,run,current,history}
}
