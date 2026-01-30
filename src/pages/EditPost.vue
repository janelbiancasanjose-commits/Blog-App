<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import api from "../api"
import { Notyf } from "notyf"

const route = useRoute()
const router = useRouter()
const notyf = new Notyf()

const title = ref("")
const content = ref("")

onMounted(async () => {
  try {
    const res = await api.get(`/posts/${route.params.id}`)
    title.value = res.data.title
    content.value = res.data.content
  } catch (err) {
    notyf.error("Failed to load post")
  }
})

const updatePost = async () => {
  try {
    await api.put(
      `/posts/${route.params.id}`,
      { title: title.value, content: content.value },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    )
    notyf.success("Post updated successfully!")
    router.push("/admin")
  } catch (err) {
    console.error(err)
    notyf.error("Failed to update post")
  }
}
</script>

<template>
  <div class="edit-container">
    <h2>Edit Post</h2>
    <div class="glass-card p-4">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="title" class="form-control glass-input" />
      </div>
      <div class="mb-3">
        <label class="form-label">Content</label>
        <textarea v-model="content" class="form-control glass-input" rows="6"></textarea>
      </div>
      <button class="btn btn-primary btn-glass" @click="updatePost">Update Post</button>
    </div>
  </div>
</template>

<style scoped>
.edit-container {
  padding: 20px;
  color: white;
}

/* Glass Card */
.glass-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
}

/* Inputs with glass effect */
.glass-input {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  padding: 12px;
  outline: none;
  transition: border 0.3s;
}

.glass-input::placeholder {
  color: rgba(255,255,255,0.7);
}

.glass-input:focus {
  border-color: #EC6E41;
}

/* Buttons */
.btn-glass {
  background-color: #F1916D;
  border-color: #F1916D;
  color: white;
  padding: 10px 20px;
  border-radius: 40px;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-glass:hover {
  background-color: #EC6E41;
  border-color: #EC6E41;
  transform: scale(1.05);
}

/* Headings */
h2 {
  color: white;
  text-shadow: 0 0 5px rgba(0,0,0,0.5);
}
</style>
