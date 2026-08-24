<script setup lang="ts">
import { useStream } from '@langchain/vue'
import MessageList from './component/messageList.vue'

defineOptions({
  name: 'AiPanel',
})

const message = ref('')

const { messages, submit, isLoading } = useStream({
  apiUrl: 'http://localhost:2024',
  assistantId: 'screen_design_agent',
  transport: 'sse',
})

function onSubmit() {
  if (isLoading.value) return

  submit({
    messages: [
      {
        type: 'human',
        content: message.value,
      },
    ],
  })
  message.value = ''
}

function onKeyDown(e: KeyboardEvent) {
  if (e.shiftKey || e.isComposing) return

  e.preventDefault()

  onSubmit()
}
</script>

<template>
  <div class="ai_panel h-full">
    <div class="flex flex-col gap-10 h-full p-20">
      <MessageList class="message_list flex-1" :messages="messages"></MessageList>
      <footer class="flex flex-col w-full flex-none gap-10">
        <el-input type="textarea" :rows="4" v-model="message" @keydown.enter="onKeyDown"></el-input>
        <el-button type="primary" @click="onSubmit" :loading="isLoading">发送</el-button>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ai_panel {
  background: my-color-mix(--bg-color, 40%);
}
</style>
