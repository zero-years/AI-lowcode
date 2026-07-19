<script setup lang="ts">
import ScreenRender from '@/components/ScreenRender/index.vue'
import { getPublishPage } from '@/utils/publish'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'ScreenPage',
})

const route = useRoute()

// 点击预览，数据从 localstorage 或者 后端 中获取
const page = getPublishPage(route.query.id as string)
</script>

<template>
  <ScreenRender :page="page"></ScreenRender>
</template>
