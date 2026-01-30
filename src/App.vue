<script>
import { onBeforeMount } from "vue"
import { useGlobalStore } from "./stores/global"
import NavbarComponent from "./components/NavbarComponent.vue"

export default {
  components: { NavbarComponent },
  setup() {
    const store = useGlobalStore()

    onBeforeMount(() => {
      if (store.token) {
        store.setUserFromToken()
      }
    })
  }
}
</script>


<template>
  <NavbarComponent />
  <div class="container">
    <router-view />
  </div>
</template>
