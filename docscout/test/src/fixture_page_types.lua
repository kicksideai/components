-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
type Json = nil | string | number | boolean | {Json} | {[string]: Json}
type Schema = {type: string?, properties: {[string]: Schema}?, enum: {Json}?, items: Schema?, anyOf: {Schema}?}
type Part = {type: string, text: string?, source: {data: string}?}
type Args = {messages: {{role: string, content: {Part}}}, schema: Schema, options: {reject_image: boolean?}?}
type Reply = {result: {data: Json}, tokens: {prompt_tokens: integer, completion_tokens: integer}}
return {}
