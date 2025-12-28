import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { VuePlugin } from 'rete-vue-plugin'

const render = new VuePlugin<Schemes, AreaExtra>({
  setup(context) {
    const app = createApp(App)

    app.use(createPinia())
    app.use(router)

    app.mount('#app')

    return app
  },
})
