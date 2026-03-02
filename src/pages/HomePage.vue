<script setup>
import { ref, onMounted, getCurrentInstance } from "vue"
import api from "../api"
import PostCard from "../components/PostCard.vue"

/* ======================
   STATE
====================== */
const posts = ref([])
const loading = ref(true)

const showAddPost = ref(false)

const newPost = ref({
  title: "",
  content: ""
})

/* ======================
   NOTYF
====================== */
const { appContext } = getCurrentInstance()
const notyf = appContext.config.globalProperties.$notyf

/* ======================
   GET POSTS
====================== */
const getPosts = async () => {
  loading.value = true
  try {
    const res = await api.get("/posts")
    posts.value = res.data
  } catch (err) {
    console.error(err)
    notyf?.error("Failed to load posts")
  } finally {
    loading.value = false
  }
}

/* ======================
   CREATE POST
====================== */
const addPost = async () => {
  try {
    await api.post("/posts", newPost.value)

    notyf?.success("Post created!")

    newPost.value.title = ""
    newPost.value.content = ""
    showAddPost.value = false

    // refresh posts instantly
    getPosts()

  } catch (err) {
    console.error(err)
    notyf?.error("Failed to create post")
  }
}

onMounted(getPosts)
</script>

<template>
  <div class="home-wrapper py-5">

    <!-- ======================
         TITLE
    ======================= -->
    <h1 class="mb-4 text-center page-title">
      All Blog Posts
    </h1>

    <!-- ======================
         ADD POST BUTTON
    ======================= -->
   <div class="post-container mb-4">

  <!-- Add Button -->
  <div class="text-end mb-3">
    <button
      class="glass-button"
      @click="showAddPost = true"
      id="addPost"
    >
       Add Post
    </button>
  </div>

    <!-- ======================
         ADD POST FORM
    ======================= -->
    <div v-if="showAddPost" class="glass-card p-4">
    <h5 class="post-title">Create New Post</h5>

    <form @submit.prevent="addPost">

      <input
        v-model="newPost.title"
        class="glass-input mb-3"
        placeholder="Post title"
        required
      />

      <textarea
        v-model="newPost.content"
        rows="4"
        class="glass-input mb-3"
        placeholder="Write something..."
        required
      ></textarea>

      <div class="text-end">
        <button class="glass-submit me-2">
          Publish
        </button>

        <button
          type="button"
          class="glass-cancel"
          @click="showAddPost = false"
        >
          Cancel
        </button>
      </div>

    </form>
  </div>

</div>

    <!-- ======================
         LOADING
    ======================= -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-light"></div>
    </div>

    <!-- ======================
         NO POSTS
    ======================= -->
    <div
      v-if="!loading && posts.length === 0"
      class="alert alert-info text-center"
    >
      No posts available.
    </div>

    <!-- ======================
         POSTS GRID
    ======================= -->
    <div class="posts-grid">
      <PostCard
        v-for="post in posts"
        :key="post._id"
        :post="post"
      />
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

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  justify-items: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.4em;
  color: #BA7D9D;
}

.glass-card {
  background-color: rgba(255,255,255,0.05);
  backdrop-filter: blur(15px);
  border-radius: 16px;
}

#addPost {
  background-color: #F1916D !important;
  color: white;
  font-weight: bold;
}

button#addPost:hover {
  background-color: #EC6E41 !important;
  box-shadow: 0 0 15px rgba(186,125,157,0.5);
  border-radius: 12px;

}

/* =============================
   GLASS BUTTON
============================= */
.glass-button {
  background-color: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  color: white;
  transition: 0.3s ease;
}

.glass-button:hover {
  background-color: rgba(255,255,255,0.15);
  box-shadow: 0 0 15px rgba(255,255,255,0.2);
}

/* =============================
   INPUTS
============================= */
.glass-input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  outline: none;
  color: white;
  background-color: rgba(255,255,255,0.07);
  backdrop-filter: blur(10px);
}

.glass-input::placeholder {
  color: rgba(255,255,255,0.6);
}

/* =============================
   SUBMIT BUTTON
============================= */
.glass-submit {
  background-color: #F1916D;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  color: white;
  transition: 0.3s;
}

.glass-submit:hover {
  background-color: #EC6E41;
  box-shadow: 0 0 15px rgba(186,125,157,0.5);
}

/* =============================
   CANCEL BUTTON
============================= */
.glass-cancel {
  background: #BF4545;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  border-radius: 10px;
  color: white;
  transition: 0.3s;
}

.glass-cancel:hover {
  background-color: rgba(255,255,255,0.1);
}

.post-title {
  color: white;
  font-weight: bold;
}
</style>