import type { Node, NodeProps } from "@xyflow/react";
export type ContextMenuNode = Node<{ onClick?: () => void }, "contextMenu">;

export default function ContextMenu({ data }: NodeProps<ContextMenuNode>) {
	return (
		<div className="card gap-1 bg-base-300 p-2 shadow" onClick={data.onClick}>
			<button className="nodrag btn">Test</button>
			<button className="nodrag btn">Test</button>
			<button className="nodrag btn">Test</button>
			<button className="nodrag btn">Test</button>
		</div>
	);
}
