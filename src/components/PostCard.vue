<script setup>
import { getCurrentInstance } from "vue"

const props = defineProps({
  post: Object
})

const { appContext } = getCurrentInstance()
const notyf = appContext.config.globalProperties.$notyf

const notifyRead = () => {
  notyf.success(`Opening post: ${props.post.title}`)
}
</script>

<template>
  <div class="post-card mb-4">
    <div class="card-body">
      <h5 class="card-title">{{ post.title }}</h5>
      <p class="card-text">
        {{ post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content }}
      </p>

      <div class="d-flex justify-content-between align-items-center">
        <router-link :to="`/post/${post._id}`" class="btn btn-read btn-sm" @click="notifyRead">
          Read More
        </router-link>
        <small class="text-muted">Author:  {{ post.author.username }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  color: white;
  transition: transform 0.3s, box-shadow 0.3s;
  padding: 20px;
}

.post-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 25px rgba(186,125,157,0.5);
}

.card-title {
  color: white;
  font-weight: bold;
}

.card-text {
  color: rgba(255,255,255,0.85);
}

.btn-read {
  background-color: #F1916D;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 6px 12px;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-read:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(186,125,157,0.5);
  background-color: #EC6E41;
}

small.text-muted {
  color: #453C67 !important;
}
</style>
