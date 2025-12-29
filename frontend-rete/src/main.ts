import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import { Presets, type VueArea2D, VuePlugin } from 'rete-vue-plugin'
import { ClassicPreset, type GetSchemes, NodeEditor } from 'rete'
import { AreaPlugin } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { type MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin'
import { type ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets } from 'rete-context-menu-plugin'
// import router from '@/router'

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>

const editor = new NodeEditor<Schemes>()

type AreaExtra = VueArea2D<Schemes> | MinimapExtra | ContextMenuExtra

const app = createApp(App)

app.use(createPinia())
// app.use(router)
app.mount('#app')

const area = new AreaPlugin<Schemes, AreaExtra>(document.getElementById('editor')!)
const render = new VuePlugin<Schemes, AreaExtra>()
const connection = new ConnectionPlugin<Schemes, AreaExtra>()
const minimap = new MinimapPlugin<Schemes>()
render.addPreset(Presets.classic.setup())
render.addPreset(Presets.minimap.setup({ size: 200 }))
render.addPreset(Presets.contextMenu.setup())
connection.addPreset(ConnectionPresets.classic.setup())
const socket = new ClassicPreset.Socket('socket')

const contextMenu = new ContextMenuPlugin<Schemes>({
  items: ContextMenuPresets.classic.setup([
    ['NodeA', () => new ClassicPreset.Node(socket)],
    ['NodeB', () => new ClassicPreset.Node(socket)],
  ]),
})

editor.use(area)
area.use(render)
area.use(connection)
area.use(minimap)
area.use(contextMenu)

const nodeA = new ClassicPreset.Node('A')
nodeA.addControl('a', new ClassicPreset.InputControl('text', {}))
nodeA.addOutput('a', new ClassicPreset.Output(socket))
await editor.addNode(nodeA)

const nodeB = new ClassicPreset.Node('B')
nodeB.addControl('b', new ClassicPreset.InputControl('text', {}))
nodeB.addInput('b', new ClassicPreset.Input(socket))
await editor.addNode(nodeB)
await editor.addConnection(new ClassicPreset.Connection(nodeA, 'a', nodeB, 'b'))
