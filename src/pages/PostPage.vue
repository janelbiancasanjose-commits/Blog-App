<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import api from "../api"
import CommentForm from "../components/CommentForm.vue"
import { useGlobalStore } from "../stores/global"
import { Notyf } from "notyf"

const route = useRoute()
const post = ref({})
const comments = ref([])
const notyf = new Notyf()

const globalStore = useGlobalStore()
const { user } = globalStore

// Load post data
const loadPost = async () => {
  try {
    const res = await api.get(`/posts/${route.params.id}`)
    post.value = res.data
  } catch (err) {
    console.error("Failed to load post", err)
    notyf.error("Failed to load post")
  }
}

// Load comments
const loadComments = async () => {
  try {
    const res = await api.get(`/comments/${route.params.id}`)
    comments.value = res.data
  } catch (err) {
    console.error("Failed to load comments", err)
    comments.value = []
    notyf.error("Failed to load comments")
  }
}

// Load everything on mount
onMounted(async () => {
  await loadPost()
  await loadComments()
})
</script>

<template>
  <div class="post-container">
    <!-- Post -->
    <div class="glass-card p-4 mb-4">
      <h2 class="post-title">{{ post.title }}</h2>
      <p class="post-content">{{ post.content }}</p>
    </div>

    <!-- Comments Section -->
    <div class="glass-card p-3 mb-4">
      <h5>Comments</h5>
      <div v-if="comments.length === 0" class="text-muted">No comments yet.</div>
      <div v-for="c in comments" :key="c._id" class="comment d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ c.user?.username || "User" }}:</strong> {{ c.comment }}
        </div>
      </div>
    </div>

    <!-- Comment Form -->
    <CommentForm :postId="post._id" @added="loadComments" />
  </div>
</template>

<style scoped>
.post-container {
  max-width: 700px;
  margin: 0 auto;
  color: white;
}

/* Glass Card Effect */
.glass-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
}

/* Post Content */
.post-title {
  color: white;
  margin-bottom: 1rem;
}

.post-content {
  line-height: 1.6;
}

/* Comments */
.comment {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

/* Optional: last comment no border */
.comment:last-child {
  border-bottom: none;
}

/* Comment Form adjustments */
</style>
