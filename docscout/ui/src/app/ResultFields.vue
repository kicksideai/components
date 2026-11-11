<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref} from 'vue'
import {Icon} from '@iconify/vue'
import {groupTree} from '../config'
import type {PageRange,Value} from '../models'
import FieldGroups from './FieldGroups.vue'
import FieldFailure from './FieldFailure.vue'
import NestedValue from './NestedValue.vue'
const props=defineProps<{fields:Value[];pageRange?:PageRange}>()
const groups=computed(()=>groupTree(props.fields.map(f=>f.path)))
const open=ref<string>()
const percent=(n:number)=>`${Math.round(n*100)}%`
const complex=(value:unknown)=>value!==null&&typeof value==='object'
const preview=(value:unknown)=>Array.isArray(value)?`${value.length} items`:complex(value)?`${Object.keys(value as object).length} properties`:value===null||value===undefined?'—':String(value)
const tone=(c:number)=>c>=.9?'high':c>=.7?'mid':'low'
const missingLabel=(field:Value)=>field.codes?.includes('missing_in_sections')?'Not in the selected sections'+(props.pageRange?' of the searched pages':''):'Not in the document'
const budgetExceeded=(field:Value)=>{
 const details=field.error?.details
 return !!details&&typeof details==='object'&&'code' in details&&details.code==='context_budget_exceeded'
}
</script>
<template>
    <div class="value-list"><FieldGroups :node="groups"><template #default="{index}"><template v-for="field in [fields[index]]" :key="field.path"><div class="value-row">
      <button type="button" class="value-main" :aria-expanded="open===field.path" @click="open=open===field.path?undefined:field.path">
       <span class="value-name">{{field.name}}</span>
       <span class="value-text" :class="{missing:field.missing}">{{field.failed?(budgetExceeded(field)?'Context budget exceeded':'Failed'):field.missing?missingLabel(field):preview(field.value)}}</span>
       <span v-if="!field.failed" class="confidence" :class="tone(field.confidence)"><span class="bar"><span :style="{width:percent(field.confidence)}"/></span>{{percent(field.confidence)}}<span class="conf-word"> confidence</span></span>
       <span v-if="!field.failed" class="value-checks"><span class="chip" :class="field.verified?'primary':'warn'" :title="field.reason"><Icon :icon="field.verified?'tabler:shield-check':'tabler:shield-question'"/>{{field.verified?'Verified':'Check'}}</span>
       <span v-if="field.codes?.includes('context_budget_partial')" class="chip warn" aria-label="Context">Partial context</span>
       <span v-if="!field.missing" class="chip" aria-label="Completeness">{{field.complete===true?'Complete':field.complete===false?'Incomplete':'Completeness unknown'}}</span></span>
       <Icon :icon="open===field.path?'tabler:chevron-up':'tabler:chevron-down'" class="value-caret"/>
      </button>
      <NestedValue v-if="!field.failed&&!field.missing&&complex(field.value)" class="structured-value" :value="field.value"/>
      <FieldFailure v-if="field.failed" :error="field.error"/>
      <div v-show="open===field.path&&!field.failed" class="evidence">
       <NestedValue v-if="!field.failed&&!field.missing&&!complex(field.value)" :value="field.value"/>
       <blockquote v-for="(e,i) in field.evidence" :key="i" :class="{unfound:e.found===false}"><p>“{{e.quote}}”</p><cite>{{e.section}}<template v-if="e.page!==undefined&&e.page!==null"> · Page {{e.page}}</template><template v-if="e.found===false"> · not found word for word in the document</template></cite></blockquote>
       <p v-if="!field.evidence.length" class="muted">No evidence.</p>
       <p v-if="field.reason||(!field.verified&&!field.failed)" class="muted">{{field.reason||'No reason recorded'}}</p>
      </div>
    </div></template></template></FieldGroups></div>
</template>
