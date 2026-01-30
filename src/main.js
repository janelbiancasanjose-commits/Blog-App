import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "notyf/notyf.min.css";
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'

import { createRouter, createWebHistory } from "vue-router"
import { useGlobalStore } from "./stores/global";

import HomePage from "./pages/HomePage.vue"
import RegisterPage from "./pages/Register.vue";
import Login from "./pages/Login.vue"
import LogoutPage from "./pages/Logout.vue";
import Post from "./pages/PostPage.vue"
import AdminDashboard from "./pages/Admin.vue"
import EditPost from "./pages/EditPost.vue"


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {   path: "/", 
        component: HomePage 
    },
    {
        path: "/register",
        name: "Register",
        component: RegisterPage,
    },
    {   path: "/login", 
        component: Login 
    },
    {
        path: "/logout",
        name: "Logout",
        component: LogoutPage,
    },
    {   path: "/post/:id", 
        component: Post 
    },
    {
        path: "/admin",
        name: "AdminDashboard",
        component: AdminDashboard,
        meta: { requiresAdmin: true }
    },
    {   path: "/admin/post/edit/:id", 
        component: EditPost 

    }
  ]
})
router.beforeEach((to, from, next) => {
  const store = useGlobalStore()

  if (to.meta.requiresAdmin && (!store.user || !store.user.isAdmin)) {
    return next("/") // redirect non-admins
  }

  next()
})

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
