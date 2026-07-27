<script setup lang="ts">
import { editor } from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

defineOptions({
  name: 'MonacoEditor',
})

window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new JsonWorker()

    if (label === 'typescript' || label === 'javascript') return new TsWorker()

    return new EditorWorker()
  },
}

const props = defineProps<{ lang?: string }>()

const monocaRef = useTemplateRef('monaco')

const modelValue = defineModel<string>()

let instance: editor.IStandaloneCodeEditor
onMounted(() => {
  instance = editor.create(monocaRef.value, {
    value: modelValue.value,
    tabSize: 2,
    theme: 'vs-dark',
    fontSize: 14,
    language: props.lang || 'json',
    // 自适应父元素宽高
    automaticLayout: true,
  })

  // 更改时更新新值
  instance.onDidChangeModelContent(() => {
    modelValue.value = instance.getValue()
  })

  onBeforeUnmount(() => {
    instance.dispose()
  })
})

watch(modelValue, (newValue) => {
  if (newValue == instance.getValue()) return

  instance.setValue(newValue)
})
</script>

<template>
  <div class="editor_container h-full w-full min-h-400" ref="monaco"></div>
</template>

<style scoped lang="  "></style>
