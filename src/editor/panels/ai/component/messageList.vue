<script setup lang="ts">
import LoadingAnimation from '@/components/Loading/index.vue'
import MarkdownRender from 'markstream-vue'
import 'markstream-vue/index.css'

defineOptions({
  name: 'MessageList',
})

const props = defineProps(['messages', 'isLoading'])

const messageListRef = useTemplateRef('messageList')
const messageContainerRef = useTemplateRef('messageContainer')

let isScroll = true

const visiableMessages = computed(() => {
  const lastIndex = props.messages.length - 1
  return props.messages.filter((message, index) => {
    return message.text || (index === lastIndex && props.isLoading)
  })
})

function onScroll() {
  const el = messageContainerRef.value

  isScroll = el.scrollHeight - el.scrollTop - el.clientHeight <= 30
}

onMounted(() => {
  const observer = new ResizeObserver(() => {
    if (!isScroll) return

    messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight
  })

  observer.observe(messageListRef.value)

  onBeforeMount(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <div ref="messageContainer" class="message_container scrollbar-none" @scroll="onScroll">
    <div ref="messageList" class="flex flex-col gap-10">
      <div
        v-for="message in visiableMessages"
        :key="message.id"
        class="message_box"
        :class="`message_box_${message.type}`"
      >
        <!-- 头像 -->
        <el-avatar>
          {{ message.type === 'ai' ? 'AI' : '我' }}
        </el-avatar>

        <!-- 内容 -->
        <div class="message_content">
          <MarkdownRender
            v-if="message.text"
            :render-code-blocks-as-pre="false"
            :code-block-props="{ showCopyButton: true }"
            :content="message.text"
            mode="chat"
            html-policy="escape"
            :final="true"
          ></MarkdownRender>
          <LoadingAnimation v-else></LoadingAnimation>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message_container {
  overflow-y: auto;
}

.message_box {
  width: 100%;
  display: flex;
  gap: 8px;

  .message_content {
    max-width: 85%;
    background: my-color-mix(--bg-color, 10%);
    padding: 8px 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
  }
}

.message_box_ai {
  flex-direction: row;

  .message_content {
    border-radius: 2px 8px 8px 8px;
  }
}

.message_box_human {
  flex-direction: row-reverse;

  .message_content {
    border-radius: 8px 2px 8px 8px;
  }
}
</style>
