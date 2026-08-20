<script setup lang="ts">
defineOptions({
  name: 'MessageList',
})

defineProps(['messages'])
</script>

<template>
  <div class="message_container scrollbar-none">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message_box"
      :class="`message_box_${message.type}`"
    >
      <!-- 头像 -->
      <el-avatar>
        {{ message.type === 'ai' ? 'AI' : '我' }}
      </el-avatar>

      <!-- 内容 -->
      <div class="message_content">{{ message.text }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message_container {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
