<script setup>
import { ref } from "vue"
import api from "../api"
import { useGlobalStore } from "../stores/global"
import { Notyf } from 'notyf';

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(["added"])
const comment = ref("")
const store = useGlobalStore()
const notyf = new Notyf();

const submitComment = async () => {
  if (!comment.value.trim()) return

  if (!store.user) {
    notyf.error("You must be logged in to comment")
    return
  }

  try {
    await api.post("/comments", {
      postId: props.postId,
      comment: comment.value
    })

    comment.value = ""
    emit("added")
    notyf.success("Comment added successfully!")
  } catch (err) {
    console.error(err)
    notyf.error("Failed to add comment")
  }
}
</script>

<template>
  <div class="comment-form glass-card p-3 mt-3">
    <textarea
      class="form-control comment-input mb-2"
      rows="3"
      placeholder="Write a comment..."
      v-model="comment"
    ></textarea>

    <button class="btn btn-post w-100" @click="submitComment">
      Post Comment
    </button>
  </div>
</template>

<style scoped>
/* Glass card style */
.glass-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  color: white;
}

/* Textarea styling */
.comment-input {
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  padding: 12px;
  outline: none;
  transition: border 0.3s;
}

.comment-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.comment-input:focus {
  border-color: #F1916D;
}

/* Button styling */
.btn-post {
  background-color: #F1916D;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 12px;
  padding: 10px 0;
  transition: all 0.3s;
}

.btn-post:hover {
  transform: scale(1.03);
  box-shadow: 0 0 15px #F1916D;
}
</style>
