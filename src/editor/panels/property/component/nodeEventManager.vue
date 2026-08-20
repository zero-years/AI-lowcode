<script setup lang="ts">
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { Icon } from '@iconify/vue'
import type { MaterialEvent } from '@/schema/material'
import { ElMessage } from 'element-plus'
import { getMaterialEventOptions } from '@/materials'

defineOptions({
  name: 'NodeEventManager',
})

const editorStore = UseEditorStore()

const { selectedNode, nodes } = storeToRefs(editorStore)

const data = ref(selectedNode.value.event || [])

const activeEvent = ref<MaterialEvent>()

function selectEvent(event: MaterialEvent) {
  activeEvent.value = event
}

function onAdd() {
  data.value.push({
    name: '函数名称(不可重复)',
    title: '事件标题',
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

const dispatchEvent = ref()

const dispatchOptions = computed(() => {
  return nodes.value.map((node) => {
    return {
      label: node.name,
      value: node.id,
      children: node.event?.map((event) => {
        return {
          label: event.title,
          value: event.name,
          disabled: activeEvent.value?.name == event.name,
        }
      }),
    }
  })
})

const eventOptions = computed(() => {
  return getMaterialEventOptions(selectedNode.value.type)
})

async function copyNodeId(id: string) {
  // 只支持 https 或 开发环境
  try {
    await navigator.clipboard.writeText(id)

    ElMessage.success('复制成功')
  } catch {
    const textarea = document.createElement('textarea')

    textarea.value = id
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'

    document.body.appendChild(textarea)

    textarea.select()
    document.execCommand('copy')

    document.body.removeChild(textarea)
  }
}

function insertDispatchCode(values: string[]) {
  const [id, name] = values
  const code = `\n$context.disptach('${id}','${name}')`

  activeEvent.value.code += code

  nextTick(() => {
    dispatchEvent.value = undefined
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
          <span>{{ item.title }}</span>
          <span @click.stop="removeEvent(item.name)">
            <Icon icon="gala:remove"></Icon>
          </span>
        </div>
      </div>
    </div>
    <div class="content scrollbar-none">
      <el-form v-if="activeEvent" label-width="80">
        <div class="w-400 mb-20 ml-80 flex gap-20">
          <el-select class="flex-1" placeholder="复制组件ID" @change="copyNodeId">
            <el-option
              v-for="node in nodes"
              :key="node.id"
              :value="node.id"
              :label="node.name"
            ></el-option>
          </el-select>
          <el-cascader
            class="flex-1"
            placeholder="选择组件事件"
            :options="dispatchOptions"
            v-model="dispatchEvent"
            @change="insertDispatchCode"
          >
          </el-cascader>
        </div>
        <el-form-item label="事件标题">
          <el-input v-model="activeEvent.title" />
        </el-form-item>
        <el-form-item label="函数名称">
          <el-input v-model="activeEvent.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="activeEvent.type"
            :options="eventOptions"
            allow-create
            filterable
            placeholder="请选择触发的事件名"
          ></el-select>
        </el-form-item>
        <el-form-item label="事件函数">
          <div class="function_content bg-[#1E1E1E] flex w-full flex-col">
            <div class="flex-none pl-20">
              <span class="text-[#C678DD]">function </span>
              <span class="text-[#56A6ED]">{{ activeEvent.name }}</span>
              <span class="text-[#8D56A1]"
                >(<span class="text-[#DB616A]"
                  >$context<span class="text-[#E1B870]">,</span>$node<span class="text-[#E1B870]"
                    >,</span
                  >$payload</span
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
