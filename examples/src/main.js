import { createApp } from 'vue/dist/vue.js'
import App from './app.vue'
import * as VueGoogleMaps from '../../src/main.js'

const app = createApp({
  components: {
    myApp: App
  }
})

app.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
    libraries: 'places'
  }
})

app.mount('#root')
