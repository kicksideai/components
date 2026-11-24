<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useMail } from '../context'
import { kindIcons, originText, personLabel, plural } from '../copy'
import type { Resource } from '../types'

const props = defineProps<{ resource: Resource }>()
const { library, go, capabilities } = useMail()

const messages = computed(() => (props.resource.used_by?.messages ?? []).map(name => ({
  name, title: library.find('message', name)?.title ?? name,
})))
const senders = computed(() => props.resource.used_by?.recent_senders ?? [])
</script>

<template>
  <div class="mail-stack">
    <section v-if="resource.kind === 'base' || resource.kind === 'asset'" class="mail-group" aria-labelledby="used-by-messages">
      <h2 id="used-by-messages" class="mail-label">Messages</h2>
      <p v-if="!messages.length" class="mail-muted">No messages {{ resource.kind === 'asset' ? 'show' : 'use' }} {{ resource.title }}.</p>
      <ul v-else class="mail-list">
        <li v-for="message in messages" :key="message.name">
          <button type="button" class="mail-row-link" @click="go({ name: 'resource', kind: 'message', resource: message.name, section: 'content' })">
            <Icon :icon="kindIcons.message" aria-hidden="true" /><span>{{ message.title }}</span>
          </button>
        </li>
      </ul>
    </section>

    <template v-else-if="resource.kind === 'message'">
      <section class="mail-group" aria-labelledby="used-by-recent">
        <div class="mail-group-head">
          <h2 id="used-by-recent" class="mail-label">Sent in the last 30 days</h2>
          <button v-if="capabilities?.administer_delivery" type="button" class="mail-text-link" @click="go({ name: 'activity', template: resource.name })">Open in Activity</button>
        </div>
        <p v-if="!senders.length" class="mail-muted">Nobody has sent {{ resource.title }} recently.</p>
        <ul v-else class="mail-list">
          <li v-for="sender in senders" :key="sender.sender + (sender.origin?.id ?? '')" class="mail-list-row">
            <Icon :icon="sender.origin ? 'tabler:bolt' : 'tabler:user'" aria-hidden="true" />
            <span class="mail-list-main">
              <span>{{ personLabel(sender.sender_label, sender.sender) }}</span>
              <span v-if="sender.origin" class="mail-sub">{{ originText(sender.origin) }}</span>
            </span>
            <span class="mail-muted">{{ plural(sender.count, 'message') }}</span>
          </li>
        </ul>
      </section>
      <section class="mail-group" aria-labelledby="used-by-setup">
        <h2 id="used-by-setup" class="mail-label">Set up to send</h2>
        <p class="mail-muted">Workflows, automations and agents that name this message are not listed here yet.</p>
      </section>
    </template>

    <section v-else class="mail-group" aria-labelledby="used-by-templates">
      <h2 id="used-by-templates" class="mail-label">Templates</h2>
      <p class="mail-muted">Templates that include {{ resource.title }} are not listed here yet. Deleting a part checks every message first.</p>
    </section>
  </div>
</template>
