<script setup lang="ts">
import { getValue } from '@/utils'
import { ElInput, ElInputNumber, ElColorPicker } from 'element-plus'
import { useUndoRedo } from '@/composables/useUndoRedo'

defineOptions({
  name: 'FormCreate',
})

const componentMap = {
  input: ElInput,
  number: (props) => h(ElInputNumber, { precision: 0, ...props }),
  color: ElColorPicker,
}

const { applyChange } = useUndoRedo()

defineProps(['setters', 'formdata'])
</script>

<template>
  <el-form class="p-20" size="small">
    <el-row :gutter="10">
      <el-col v-for="item in setters" :key="item.key" :span="item.span || 24">
        <el-form-item :label="item.label" label-width="40">
          <component
            :is="componentMap[item.type]"
            :modelValue="getValue(formdata, item.key)"
            @update:modelValue="(value) => applyChange(formdata, item.key, value)"
          ></component>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style scoped lang="  "></style>
