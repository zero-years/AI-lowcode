<script setup lang="ts">
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { deepClone } from '@/utils'
import { Icon } from '@iconify/vue'
import { fetchData } from '@/composables/useDataSource'
import type { MaterialEvent } from '@/schema/material'

defineOptions({
  name: 'NodeEventManager',
})

const editorStore = UseEditorStore()

const { selectedNode } = storeToRefs(editorStore)

const data = ref(selectedNode.value.event || [])

const activeEvent = ref()

function selectEvent(event: MaterialEvent) {
  activeEvent.value = event
}

function onAdd() {
  data.value.push({
    name: '未命名数据源',
    type: '',
    code: '',
  })

  selectEvent(data.value.at(-1))
}

function removeEvent(name: string) {
  data.value = data.value.filter((item) => item.name !== name)

  selectEvent(null)
}

function onSave() {
  editorStore.updateNode(selectedNode.value.id, {
    ...selectedNode.value,
    event: data.value,
  })
}

defineExpose({
  onSave,
})
</script>

<template>
  <div class="node_event_container">
    <div class="siderbar">
      <el-button @click="onAdd" type="primary" size="small">新增</el-button>
      <div class="overflow-auto scrollbar-none">
        <div
          v-for="item in data"
          :key="item.name"
          class="siderbar_item"
          :class="{ active: item.name == activeEvent?.name }"
          @click="selectEvent(item)"
        >
          <span>{{ item.name }}</span>
          <span @click.stop="removeEvent(item.name)">
            <Icon icon="gala:remove"></Icon>
          </span>
        </div>
      </div>
    </div>
    <div class="content scrollbar-none">
      <el-form v-if="activeEvent" label-width="80">
        <el-form-item label="名称">
          <el-input v-model="activeEvent.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="activeEvent.type"></el-input>
        </el-form-item>
        <el-form-item label="事件函数">
          <div class="function_content bg-[#1E1E1E] flex w-full flex-col">
            <div class="flex-none pl-20">
              <span class="text-[#C678DD]">function</span>
              <span class="text-[#8D56A1]"
                >(<span class="text-[#DB616A]"
                  >$context<span class="text-[#E1B870]">,</span>$node</span
                >)</span
              >{
            </div>
            <MonacoEditor v-model="activeEvent.code" lang="javascript" class="flex-1" />
            <div class="flex-none pl-20">}</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.node_event_container {
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

    .function_content {
      font-family: Menlo, Monaco, 'Courier New', monospace;
    }
  }
}
</style>
