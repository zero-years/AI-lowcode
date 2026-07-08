<script setup lang="ts">
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'CanvasProperty',
})

const editorStore = UseEditorStore()
const { canvas } = storeToRefs(editorStore)
</script>

<template>
  <div>
    <h3 class="pl-20 pt-10 text-14">画布属性</h3>
    <el-form class="p-20" size="small" label-width="80">
      <el-form-item label="宽度">
        <el-input-number v-model.number="canvas.width" />
      </el-form-item>
      <el-form-item label="高度">
        <el-input-number v-model.number="canvas.height" />
      </el-form-item>
      <el-form-item label="画布背景色">
        <el-color-picker v-model="canvas.backgroundColor" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="  "></style>
