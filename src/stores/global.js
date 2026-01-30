import { defineStore } from "pinia"
import { jwtDecode } from "jwt-decode"

export const useGlobalStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token")
  }),

  actions: {
    async login(data) {
      const res = await fetch(`${import.meta.env.VITE_BLOG_APP_API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      if (!result.token) throw new Error("No token returned")

      this.token = result.token
      localStorage.setItem("token", result.token)
      this.setUserFromToken()
    },

    setUserFromToken() {
      if (!this.token) return

      try {
        const decoded = jwtDecode(this.token)
        this.user = {
          id: decoded.id,
          username: decoded.username,
          isAdmin: decoded.isAdmin
        }
      } catch (err) {
        console.error("Invalid token")
        this.logout()
      }
    },

    logout() {
      localStorage.removeItem("token")
      this.token = null
      this.user = null
    }
  }
})
