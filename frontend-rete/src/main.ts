import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { AreaPlugin } from 'rete-area-plugin'
import {
  type AreaExtra,
  connection,
  contextMenu,
  editor,
  history,
  minimap,
  render as vue_render,
  type Schemes,
} from '@/rete.ts'

const app = createApp(App)

app.use(createPinia())
// app.use(router)
app.mount('#app')

export const area = new AreaPlugin<Schemes, AreaExtra>(document.getElementById('editor')!)
area.use(vue_render)
area.use(contextMenu)
editor.use(area)
area.use(connection)
area.use(history)
area.use(minimap)
