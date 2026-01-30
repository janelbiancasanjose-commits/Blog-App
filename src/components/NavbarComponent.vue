<script setup>
import { useGlobalStore } from "../stores/global.js"

const auth = useGlobalStore()

const logout = () => {
  auth.logout()
  window.location.href = "/"  // optional redirect
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-glass mb-4">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">BlogApp</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- Guest -->
          <li class="nav-item" v-if="!auth.user">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="!auth.user">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>

          <!-- Logged-in user -->
          <li class="nav-item" v-if="auth.user">
            <router-link class="nav-link" to="/">Posts</router-link>
          </li>

          <!-- Admin -->
          <li class="nav-item" v-if="auth.user && auth.user.isAdmin">
            <router-link class="nav-link" to="/admin">Admin Dashboard</router-link>
          </li>

          <!-- Logout -->
          <li class="nav-item" v-if="auth.user">
            <button class="btn btn-outline-danger btn-sm" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-glass {
  background-color: #CFA7AE; 
  backdrop-filter: blur(15px); 
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
}

.navbar-brand {
  color: #453C67;
  font-size: 1.5rem;
}

.nav-link {
  color: white;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  transition: all 0.3s;
}

.nav-link:hover {
  color: #342E47;
  text-shadow: 0 0 5px #342E47;
}

.btn-outline-danger {
  border-radius: 20px;
  border: 1px solid #342E47;
  color: white;
  transition: all 0.3s;
}

.btn-outline-danger:hover {
  background-color: #342E47;
  color: white;
  box-shadow: 0 0 10px #342E47;
}

.navbar-toggler {
  border-color: rgba(255,255,255,0.3);
}

.navbar-toggler-icon {
  filter: invert(1);
}
</style>
