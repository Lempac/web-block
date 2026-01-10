<script lang="ts" setup></script>

<script lang="ts">
import { ClassicPreset } from 'rete'
import { editor, socket } from '@/rete.ts'

const nodeA = new ClassicPreset.Node('A')
nodeA.addControl('a', new ClassicPreset.InputControl('text', {}))
nodeA.addOutput('a', new ClassicPreset.Output(socket))
await editor.addNode(nodeA)

const nodeB = new ClassicPreset.Node('B')
nodeB.addControl('b', new ClassicPreset.InputControl('text', {}))
nodeB.addInput('b', new ClassicPreset.Input(socket))
await editor.addNode(nodeB)
await editor.addConnection(new ClassicPreset.Connection(nodeA, 'a', nodeB, 'b'))
</script>

<template>
  <div id="editor" class="w-full h-full absolute" />
</template>

<style></style>
