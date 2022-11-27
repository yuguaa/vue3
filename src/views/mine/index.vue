<template>
  <div class="h-screen flex justify-center items-center">
    <button @click="handleGoDashBoard">跳去Dashboard</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const handleGoDashBoard = () => {
  router.push('/dashboard')
}
</script>
