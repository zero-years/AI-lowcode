<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import DataSourceManager from './components/dataSourceManager.vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { useRouter } from 'vue-router'
import { publishPage } from '@/utils/publish.ts'

defineOptions({
  name: 'ToolbarRight',
})

const editorStore = UseEditorStore()

const { page } = storeToRefs(editorStore)

const router = useRouter()

const inputRef = useTemplateRef('inputRef')
const sourceManagerRef = useTemplateRef('sourceManager')

const jsonText = ref('')

// JSON 弹框
const visiable = ref(false)
// 数据源弹框
const dataSourceVisiable = ref(false)

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

function openDataSource() {
  dataSourceVisiable.value = true
}

function onSave() {
  sourceManagerRef.value.onSave()

  dataSourceVisiable.value = false
}

function onPreview() {
  router.push('/preview')
}

function onPublish() {
  const id = publishPage(page.value)
  router.push(`/screen?id=${id}`)
}
</script>

<template>
  <div class="toolbar_right flex justify-end gap-20">
    <span @click="onPreview">
      <Icon icon="pajamas:live-preview" />
      <span class="hoveBox">预览</span>
    </span>
    <span @click="previewJson">
      <Icon icon="mingcute:code-fill" />
      <span class="hoveBox">修改 JSON</span>
    </span>
    <span @click="onPublish">
      <Icon icon="material-symbols:published-with-changes-rounded" />
      <span class="hoveBox">发布</span>
    </span>
    <span @click="openDataSource">
      <Icon icon="charm:database"></Icon>
      <span class="hoveBox">修改数据源</span>
    </span>
    <span @click="onImport">
      <Icon icon="pajamas:import" />
      <span class="hoveBox">导入</span>
    </span>
    <span @click="onExport">
      <Icon icon="pajamas:export" />
      <span class="hoveBox">导出</span>
    </span>

    <input type="file" v-show="false" ref="inputRef" @change="onFileChange" />

    <el-drawer :destroy-on-close="true" title="编辑JSON" size="800" v-model="visiable">
      <MonacoEditor v-model="jsonText" />

      <template #footer>
        <el-button @click="visiable = false">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </template>
    </el-drawer>

    <el-dialog :destroy-on-close="true" title="数据源设置" v-model="dataSourceVisiable" width="800">
      <DataSourceManager ref="sourceManager"></DataSourceManager>

      <template #footer>
        <el-button @click="dataSourceVisiable = false">取消</el-button>
        <el-button type="primary" @click="onSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.toolbar_right {
  span {
    padding: 4px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;

    .hoveBox {
      position: absolute;
      font-size: 12px;
      transform: translateY(6px) translateX(-25%);
      opacity: 0;
      transition: all 0.2s;
      text-align: center;
    }

    &:hover {
      .hoveBox {
        opacity: 1;
      }
    }
  }
}
</style>
