<template>
  <div
    class="dashboard-container h-screen bg-red-300 flex justify-center items-center"
  >
    <div class="bg-blue-100 p-2" @click="handleGoMine">跳去Mine</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const handleGoMine = () => {
  router.push('/mine')
}
</script>

<style lang="less" scoped>
.dashboard-container {
  color: @mainColor;
}
</style>
