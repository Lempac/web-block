import { Presets, type VueArea2D, VuePlugin } from 'rete-vue-plugin'
import { ClassicPreset, type GetSchemes, NodeEditor } from 'rete'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { type MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin'
import { type HistoryActions, HistoryExtensions, HistoryPlugin } from 'rete-history-plugin'

import {
  type ContextMenuExtra,
  ContextMenuPlugin,
  Presets as ContextMenuPresets,
} from 'rete-context-menu-plugin'

export type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>

class Node extends ClassicPreset.Node {
  width = 190
  height = 120
}
class Connection<N extends Node> extends ClassicPreset.Connection<N, N> {}
type MinimapSchemes = GetSchemes<Node, Connection<Node>>

export const editor = new NodeEditor<Schemes>()

export type AreaExtra = VueArea2D<Schemes> | MinimapExtra | ContextMenuExtra
export const render = new VuePlugin<Schemes, AreaExtra>()
export const connection = new ConnectionPlugin<Schemes, AreaExtra>()
export const minimap = new MinimapPlugin<Schemes>()
export const history = new HistoryPlugin<Schemes, HistoryActions<Schemes>>()
HistoryExtensions.keyboard(history)
render.addPreset(Presets.classic.setup())
render.addPreset(Presets.minimap.setup({ size: 200 }))
render.addPreset(Presets.contextMenu.setup())
connection.addPreset(ConnectionPresets.classic.setup())
export const socket = new ClassicPreset.Socket('socket')

export const contextMenu = new ContextMenuPlugin<Schemes>({
  items: ContextMenuPresets.classic.setup([
    ['NodeA', () => new ClassicPreset.Node(socket.name)],
    ['NodeB', () => new ClassicPreset.Node(socket.name)],
  ]),
})
