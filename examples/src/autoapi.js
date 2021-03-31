import { createApp } from 'vue'
import AutoAPI from './AutoAPI.vue'

document.addEventListener('DOMContentLoaded', () => {
  const app = createApp({
    render (h) {
      return h(AutoAPI)
    }
  })
  app.mount('#app')
})
