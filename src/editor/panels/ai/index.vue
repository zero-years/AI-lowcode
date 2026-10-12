<script setup lang="ts">
import { useStream } from '@langchain/vue'
import MessageList from './component/messageList.vue'
import { deleteThreadId, getThreadId, setThreadId } from './threadId-storage.ts'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { UseEditorStore } from '@/stores/editor.ts'
import { getAllMaterialSchema } from '@/materials/index.ts'
import { CanvasSchema } from '@/editor/schema/common.ts'
import { deepClone } from '@/utils/index.ts'
import { toJSONSchema } from '@/utils/agentSchema.ts'

defineOptions({
  name: 'AiPanel',
})

const message = ref('')
const curRunId = ref<string>(null)

const editorstore = UseEditorStore()

const { messages, submit, isLoading, stop, client, values } = useStream({
  apiUrl: 'http://localhost:2024',
  assistantId: 'screen_design_agent',
  transport: 'sse',
  threadId: getThreadId(),
  optimistic: false,
  onThreadId: setThreadId,
  onCreated: ({ runId }) => {
    curRunId.value = runId
  },
})

const { page, selectedNodeIds } = storeToRefs(editorstore)

const methodMap = {
  add_node: 'addNode',
  update_node: 'updateNode',
  remove_node: 'removeNode',
}

watch(
  () => values.value.actions,
  (actions: any) => {
    if (!actions.length) return
    for (const action of actions) {
      const node = deepClone(toRaw(action.node))
      const method = methodMap[action.type]
      console.log('method ==>', method)
      editorstore[method](node)
    }
  },
)

function onSubmit() {
  if (isLoading.value || !message.value) return

  submit({
    messages: [
      {
        type: 'human',
        content: message.value,
      },
    ],
    page: page.value,
    selectedNodeIds: selectedNodeIds.value,
    schema: {
      material: getAllMaterialSchema(),
      canvas: toJSONSchema(CanvasSchema),
    },
  })
  message.value = ''
}

function onKeyDown(e: KeyboardEvent) {
  if (e.shiftKey || e.isComposing) return

  e.preventDefault()

  onSubmit()
}

function onCancel() {
  client.runs.cancel(getThreadId(), curRunId.value, true, 'rollback')
  stop()
}

async function deleteSession() {
  const id = getThreadId()
  deleteThreadId()

  await client.threads.delete(id)

  message.value = ''

  location.reload()
}
</script>

<template>
  <div class="ai_panel h-full">
    <div class="flex flex-col gap-10 h-full p-20 translate-z-1">
      <div class="ai_tools">
        <div class="tool" @click="deleteSession">
          <Icon icon="fluent:delete-12-regular" />
        </div>
      </div>

      <MessageList
        class="message_list flex-1"
        :messages="messages"
        :isLoading="isLoading"
      ></MessageList>
      <footer class="flex flex-col w-full flex-none gap-10">
        <el-input type="textarea" :rows="4" v-model="message" @keydown.enter="onKeyDown"></el-input>
        <el-button type="primary" @click="onSubmit" v-if="!isLoading">发送</el-button>
        <el-button type="danger" @click="onCancel" v-else>取消</el-button>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ai_panel {
  background: my-color-mix(--bg-color, 40%);

  .ai_tools {
    display: flex;

    .tool {
      padding: 4px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
    }
  }
}
</style>
