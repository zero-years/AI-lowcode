<script setup lang="ts">
defineOptions({
  name: 'MultColor',
})

const modelValue = defineModel<string[]>()

const curColor = ref({
  key: 0,
  value: '',
})

function selectColor(value: string, index: number) {
  curColor.value = {
    key: index,
    value,
  }
}

function changColor(value: string) {
  const newColors = [...modelValue.value]
  newColors[curColor.value.key] = value
  modelValue.value = newColors
}
</script>

<template>
  <div>
    <el-color-picker v-model="curColor.value" @change="changColor" />
    <div class="flex justify-center items-center gap-10 mt-10">
      <div
        v-for="(value, index) in modelValue"
        :key="index"
        :style="{ backgroundColor: value }"
        class="w-16 h-16"
        @click="selectColor(value, index)"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="  "></style>
