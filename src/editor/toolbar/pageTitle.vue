<script setup lang="ts">
defineOptions({
  name: 'PageTitle',
})

const pageName = defineModel()

const editorVisible = ref(false)

const input = ref<HTMLInputElement>()

function applyEditor() {
  editorVisible.value = true
  nextTick(() => {
    input.value?.focus()
  })
}

function submit() {
  editorVisible.value = false
}
</script>

<template>
  <div @dblclick="applyEditor" class="flex-1 text-center">
    <div v-if="!editorVisible">{{ pageName }}</div>
    <label v-else class="title_input_wrap">
      <span class="title_input_sizer">{{ pageName || ' ' }}</span>
      <input v-model="pageName" @blur="submit" ref="input" class="title_input" />
    </label>
  </div>
</template>

<style scoped lang="scss">
.title_input_wrap {
  display: inline-grid;
  align-items: center;
}

.title_input_sizer,
.title_input {
  grid-area: 1 / 1;
  font: inherit;
  padding: 0 4px;
}

.title_input_sizer {
  visibility: hidden;
  white-space: pre;
}

.title_input {
  width: 100%;
  min-width: 0;
  text-align: center;
  background: transparent;
  border: none;
  outline: none;
}
</style>
