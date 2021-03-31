import ExamplesApp from './ExamplesApp.vue'
import ExamplePageDefault from './ExamplePageDefault.vue'
import ExamplePage from './ExamplePage.vue'
import Examples from '../examples-index'
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import * as VueGoogleMaps from '../../dist/main.js'

document.addEventListener('DOMContentLoaded', () => {
  const app = createApp({
    extends: ExamplesApp
  })

  app.config.optionMergeStrategies.description = (a, b) => a || b

  app.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
      libraries: 'places'
    }
  })

  const router = createRouter({
    routes: Examples.map(e => ({
      path: `/${e.name}`,
      component: ExamplePage,
      name: e.name,
      props: {
        name: e.name,
        description: e.description,
        source: e.source,
        component: e.module
      }
    }))
      .concat([
        { path: '/', component: ExamplePageDefault }
      ])
  })
  app.use(router)

  app.mount('#app')
})
