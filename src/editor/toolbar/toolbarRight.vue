<script setup lang="ts">
import { Icon } from '@iconify/vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const editorStore = UseEditorStore()

const { page } = storeToRefs(editorStore)

defineOptions({
  name: 'ToolbarRight',
})

const inputRef = useTemplateRef('inputRef')

const jsonText = ref('')

const visiable = ref(false)

function previewJson() {
  jsonText.value = JSON.stringify(page.value, null, 2)
  visiable.value = true
}

function onConfirm() {
  const newPage = JSON.parse(jsonText.value)
  editorStore.setPage(newPage)
  visiable.value = false
}

function onImport() {
  inputRef.value.click()
}

async function onFileChange(e) {
  const file: File = e.target.files[0]

  if (!file) return

  const text = await file.text()

  try {
    const newPage = JSON.parse(text)
    editorStore.setPage(newPage)
    ElMessage.success('导入成功')
  } catch {
    ElMessage.error('导入失败，请检查 JSON 是否合法')
  }
}

function onExport() {
  // 拉取 JSON
  const json = JSON.stringify(page.value, null, 2)

  // 创建文件 blob
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })

  // 创建为下载链接
  const url = URL.createObjectURL(blob)

  // 创建 a 标签并触发下载
  const a = document.createElement('a')
  a.href = url
  a.download = 'screen-design.json'

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  // 释放 URL 对象
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="toolbar_right flex justify-end gap-20">
    <span>
      <Icon icon="pajamas:live-preview" />
    </span>
    <span @click="previewJson">
      <Icon icon="mingcute:code-fill" />
    </span>
    <span>
      <Icon icon="material-symbols:published-with-changes-rounded" />
    </span>
    <span @click="onImport">
      <Icon icon="pajamas:import" />
    </span>
    <span @click="onExport">
      <Icon icon="pajamas:export" />
    </span>

    <input type="file" v-show="false" ref="inputRef" @change="onFileChange" />

    <el-drawer :destroy-on-close="true" title="编辑JSON" size="800" v-model="visiable">
      <MonacoEditor v-model="jsonText" />

      <template #footer>
        <el-button @click="visiable = false">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.toolbar_right {
  span {
    padding: 4px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
  }
}
</style>
