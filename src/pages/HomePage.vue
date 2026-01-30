<script setup>
import { ref, onMounted, getCurrentInstance } from "vue"
import api from "../api"
import PostCard from "../components/PostCard.vue"

const posts = ref([])
const loading = ref(true)

// Get Notyf safely inside setup
const { appContext } = getCurrentInstance()
const notyf = appContext.config.globalProperties.$notyf

const getPosts = async () => {
  loading.value = true
  try {
    const res = await api.get("/posts")
    posts.value = res.data
    notyf && notyf.success("Posts loaded successfully!")
  } catch (err) {
    console.error(err)
    notyf && notyf.error("Failed to load posts")
  } finally {
    loading.value = false
  }
}

onMounted(getPosts)
</script>

<template>
  <div class="home-wrapper py-5">
    <h1 class="mb-5 text-center page-title">All Blog Posts</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-light" role="status"></div>
    </div>

    <!-- No posts -->
    <div v-if="!loading && posts.length === 0" class="alert alert-info text-center">
      No posts available.
    </div>

    <!-- Posts Grid -->
    <div class="posts-grid">
      <PostCard v-for="post in posts" :key="post._id" :post="post" />
    </div>
  </div>
</template>

<style scoped>
.home-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  color: #453C67;
  text-shadow: 0 0 8px rgba(186,125,157,0.7);
}

/* Flexible grid for PostCards */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  justify-items: center;
}

/* Make spinner visible on dark background */
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.4em;
  color: #BA7D9D;
}
</style>
