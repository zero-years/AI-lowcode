<script setup lang="ts">
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { deepClone } from '@/utils'
import { Icon } from '@iconify/vue'
import { fetchData } from '@/composables/useDataSource'

defineOptions({
  name: 'DataSourceManager',
})

const editorStore = UseEditorStore()

const { dataSources } = storeToRefs(editorStore)

const data = ref(
  deepClone(dataSources.value).map((item) => {
    return {
      ...item,
      data: item.data ? JSON.stringify(item.data, null, 2) : undefined,
      params: item.params ? JSON.stringify(item.params, null, 2) : undefined,
    }
  }),
)

const activeSource = ref()
const responseText = ref('')

function selectDataSource(source) {
  activeSource.value = source
}

function onAdd() {
  data.value.push({
    id: crypto.randomUUID(),
    name: '未命名数据源',
    type: 'static',
    data: '',
    params: '{}',
    url: undefined,
  })

  selectDataSource(data.value.at(-1))
}

function onRemove(id) {
  data.value = data.value.filter((item) => item.id !== id)

  selectDataSource(null)
}

function onSave() {
  const _data = deepClone(data.value).map((item) => {
    return {
      ...item,
      data: item.data ? JSON.parse(item.data) : undefined,
      params: item.params ? JSON.parse(item.params) : undefined,
    }
  })

  // 更新页面数据
  editorStore.page.dataSources = _data
}

function onRequest() {
  fetchData({
    ...activeSource.value,
    params: activeSource.value.params ? JSON.parse(activeSource.value.params) : undefined,
  }).then((res) => {
    responseText.value = JSON.stringify(res, null, 2)
  })
}

defineExpose({
  onSave,
})
</script>

<template>
  <div class="data_source_container">
    <div class="siderbar">
      <el-button @click="onAdd" type="primary" size="small">新增</el-button>
      <div class="overflow-auto scrollbar-none">
        <div
          v-for="item in data"
          :key="item.id"
          class="siderbar_item"
          :class="{ active: item.id == activeSource?.id }"
          @click="selectDataSource(item)"
        >
          <span>{{ item.name }}</span>
          <span @click.stop="onRemove(item.id)">
            <Icon icon="gala:remove"></Icon>
          </span>
        </div>
      </div>
    </div>
    <div class="content scrollbar-none">
      <el-form v-if="activeSource" label-width="80">
        <el-form-item label="名称">
          <el-input v-model="activeSource.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="activeSource.type">
            <el-radio-button label="静态数据源" value="static">静态数据源</el-radio-button>
            <el-radio-button label="动态数据源" value="api">动态数据源</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据" v-if="activeSource.type === 'static'">
          <MonacoEditor v-model="activeSource.data"></MonacoEditor>
        </el-form-item>
        <div v-else>
          <el-form-item label="请求地址">
            <el-input v-model="activeSource.url"></el-input>
          </el-form-item>
          <el-form-item label="请求方法">
            <el-radio-group v-model="activeSource.method">
              <el-radio-button label="Get" value="get"></el-radio-button>
              <el-radio-button label="Post" value="post"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="轮询时间">
            <el-input-number v-model="activeSource.interval" :min="0" step="500"></el-input-number>
          </el-form-item>
          <el-form-item label="参数">
            <MonacoEditor v-model="activeSource.params"></MonacoEditor>
          </el-form-item>
          <el-form-item label="相应路径">
            <el-input v-model="activeSource.responsePath"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onRequest">请求浏览</el-button>
          </el-form-item>
          <el-form-item label="预览数据">
            <MonacoEditor v-model="responseText"></MonacoEditor>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data_source_container {
  height: 600px;
  display: flex;
  gap: 20px;

  .siderbar {
    width: 200px;
    flex: none;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 10px;

    .siderbar_item {
      height: 40px;
      line-height: 40px;
      background: my-color-mix(--bg-color, 35%);
      padding-left: 20px;
      padding-right: 10px;
      margin-top: 10px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.active {
        background: my-color-mix(--bg-color, 6%);
      }
    }
  }
  .content {
    padding: 10px;
    flex: 1;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: auto;
  }
}
</style>
