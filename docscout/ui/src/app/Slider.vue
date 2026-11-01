<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
const props=withDefaults(defineProps<{label:string;min:number;max:number;step?:number;log?:boolean;percent?:boolean;unit?:string;hints?:[string,string];note?:string;disabled?:boolean}>(),{step:1})
const model=defineModel<number>({required:true})
const STEPS=1000
const shown=computed(()=>props.percent?`${Math.round(model.value*100)}%`:`${model.value.toLocaleString()}${props.unit?` ${props.unit}`:''}`)
const toPosition=(v:number)=>props.log?Math.log(v/props.min)/Math.log(props.max/props.min)*STEPS:(v-props.min)/(props.max-props.min)*STEPS
function fromPosition(p:number){
 const raw=props.log?props.min*Math.pow(props.max/props.min,p/STEPS):props.min+(props.max-props.min)*p/STEPS
 const snapped=Math.round(raw/props.step)*props.step
 return Math.min(props.max,Math.max(props.min,Number(snapped.toFixed(4))))
}
const position=computed({get:()=>Math.round(toPosition(model.value)),set:(p:number)=>{model.value=fromPosition(p)}})
</script>
<template>
 <div class="slider">
  <div class="slider-head"><span>{{label}}</span><output class="slider-value">{{shown}}</output></div>
  <input v-model.number="position" type="range" min="0" :max="STEPS" step="1" :aria-label="label" :aria-valuetext="shown" :disabled="disabled" :style="{'--fill':`${position/STEPS*100}%`}"/>
  <div v-if="hints" class="slider-hints"><span>{{hints[0]}}</span><span>{{hints[1]}}</span></div>
  <small v-if="note">{{note}}</small>
 </div>
</template>
