<script setup>
import { ref, onMounted } from "vue"
import api from "../api"
import { Notyf } from "notyf"
import { useGlobalStore } from "../stores/global"
import { useRouter } from "vue-router"

const notyf = new Notyf()
const router = useRouter()
const globalStore = useGlobalStore()
const { user } = globalStore

const posts = ref([])
const comments = ref([])

// Load all posts
const loadPosts = async () => {
  try {
    const res = await api.get("/posts")
    posts.value = res.data
  } catch (err) {
    console.error("Failed to load posts", err)
    notyf.error("Failed to load posts")
  }
}

// Load all comments
const loadComments = async () => {
  comments.value = [] // reset
  try {
    for (let post of posts.value) {
      const res = await api.get(`/comments/${post._id}`)
      comments.value.push(...res.data)
    }
  } catch (err) {
    console.error("Failed to load comments", err)
    notyf.error("Failed to load comments")
  }
}

// Delete a post
const deletePost = async (postId) => {
  if (!confirm("Are you sure you want to delete this post?")) return
  try {
    await api.delete(`/posts/${postId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    await loadPosts()
    notyf.success("Post deleted successfully!")
  } catch (err) {
    console.error("Failed to delete post", err)
    notyf.error("Failed to delete post")
  }
}

// Delete a comment
const deleteComment = async (commentId) => {
  if (!confirm("Are you sure you want to delete this comment?")) return
  try {
    await api.delete(`/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    await loadComments()
    notyf.success("Comment deleted successfully!")
  } catch (err) {
    console.error("Failed to delete comment", err)
    notyf.error("Failed to delete comment")
  }
}

// Only allow admins
onMounted(async () => {
  if (!user || !user.isAdmin) {
    notyf.error("Access denied: Admins only")
    router.push("/")
    return
  }
  await loadPosts()
  await loadComments()
})
</script>

<template>
  <div class="admin-container">
    <h2 class="mb-4">Admin Dashboard</h2>

    <!-- Posts Table -->
    <div class="glass-card mb-5">
      <h4>Posts</h4>
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post._id">
            <td>{{ post.title }}</td>
            <td>{{ post.author?.username || "User" }}</td>
            <td>{{ new Date(post.createdAt).toLocaleString() }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="router.push(`/admin/post/edit/${post._id}`)">
                Edit
              </button>
              <button class="btn btn-sm btn-danger" @click="deletePost(post._id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Comments Table -->
    <div class="glass-card">
      <h4>Comments</h4>
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Post</th>
            <th>User</th>
            <th>Comment</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in comments" :key="c._id">
            <td>{{ c.postId }}</td>
            <td>{{ c.user?.username || "User" }}</td>
            <td>{{ c.comment }}</td>
            <td>{{ new Date(c.createdAt).toLocaleString() }}</td>
            <td>
              <button class="btn btn-sm btn-danger" @click="deleteComment(c._id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  padding: 20px;
}

/* Glass Card Effect */
.glass-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  margin-bottom: 20px;
  color: white;
}

h2, h4 {
  color: white;
  text-shadow: 0 0 5px rgba(0,0,0,0.5);
}

/* Buttons */
.btn-primary {
  background-color: #655B8A;
  border-color: #342E47;
  color: white;
}

.btn-primary:hover {
  background-color: #A49CBF;
  border-color: #A49CBF;
}

.btn-danger {
  background-color: #EC6E41;
  border-color: #EC6E41;
  color: white;
}

.btn-danger:hover {
  background-color: #F1916D;
  border-color: #F1916D;
}

.table {
  color: white;
}

.table th, .table td {
  vertical-align: middle;
}
</style>
