<script setup lang="ts">
import MessageList from './component/messageList.vue'

defineOptions({
  name: 'AiPanel',
})

const message = ref('')

const messages = ref([
  {
    id: '1',
    type: 'human',
    text: '你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型',
  },
  {
    id: '2',
    type: 'ai',
    text: '我是一个AI模型，可以帮助你进行各种任务。',
  },
  {
    id: '1',
    type: 'human',
    text: '你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型',
  },
  {
    id: '2',
    type: 'ai',
    text: '我是一个AI模型，可以帮助你进行各种任务。',
  },
  {
    id: '1',
    type: 'human',
    text: '你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型',
  },
  {
    id: '2',
    type: 'ai',
    text: '我是一个AI模型，可以帮助你进行各种任务。',
  },
  {
    id: '1',
    type: 'human',
    text: '你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型',
  },
  {
    id: '2',
    type: 'ai',
    text: '我是一个AI模型，可以帮助你进行各种任务。',
  },

  {
    id: '1',
    type: 'human',
    text: '你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型',
  },
  {
    id: '2',
    type: 'ai',
    text: '我是一个AI模型，可以帮助你进行各种任务。',
  },
  {
    id: '1',
    type: 'human',
    text: '你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型',
  },
  {
    id: '2',
    type: 'ai',
    text: '我是一个AI模型，可以帮助你进行各种任务。',
  },
  {
    id: '1',
    type: 'human',
    text: '你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型',
  },
  {
    id: '2',
    type: 'ai',
    text: '我是一个AI模型，可以帮助你进行各种任务。',
  },
  {
    id: '1',
    type: 'human',
    text: '你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型',
  },
  {
    id: '2',
    type: 'ai',
    text: '我是一个AI模型，可以帮助你进行各种任务。',
  },
  {
    id: '1',
    type: 'human',
    text: '你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型你好，你是什么模型',
  },
  {
    id: '2',
    type: 'ai',
    text: '我是一个AI模型，可以帮助你进行各种任务。',
  },
])
</script>

<template>
  <div class="ai_panel h-full">
    <div class="flex flex-col gap-10 h-full p-20">
      <MessageList class="message_list flex-1" :messages="messages"></MessageList>
      <footer class="flex flex-col w-full flex-none gap-10">
        <el-input type="textarea" :rows="4" v-model="message"></el-input>
        <el-button type="primary">发送</el-button>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ai_panel {
  background: my-color-mix(--bg-color, 40%);
}
</style>
