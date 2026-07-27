<script setup lang="ts">
import { getValue } from '@/utils'
import { ElInput, ElInputNumber, ElColorPicker, ElCheckbox, ElSelect } from 'element-plus'
import { useUndoRedo } from '@/composables/useUndoRedo'

defineOptions({
  name: 'FormCreate',
})

const componentMap = {
  input: ElInput,
  number: (props) => h(ElInputNumber, { precision: 0, ...props }),
  color: ElColorPicker,
  checkbox: ElCheckbox,
  select: ElSelect,
}

const { applyChange, startBatch, commitBatch } = useUndoRedo()

defineProps(['setters', 'formdata'])
</script>

<template>
  <el-form class="p-20" size="small">
    <el-row :gutter="10">
      <el-col v-for="item in setters" :key="item.key" :span="item.span || 24">
        <el-form-item :label="item.label" label-width="60">
          <component
            :is="componentMap[item.type]"
            :modelValue="getValue(formdata, item.key)"
            v-bind="item.props"
            @update:modelValue="(value) => applyChange(formdata, item.key, value)"
            @focus="startBatch"
            @blur="commitBatch"
          ></component>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style scoped lang="  "></style>
