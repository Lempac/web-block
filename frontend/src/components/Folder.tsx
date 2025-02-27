import type { Node, NodeProps } from "@xyflow/react";
import Resize from "./Resize";

export type FolderNode = Node<{ name: string }, "folder">;

export default function Folder({ data }: NodeProps<FolderNode>) {
	return (
		<div className="card h-full min-h-8 min-w-32 border-base-100 border-2 p-4 shadow">
			<h2 className="card relative border-base-200 -top-10 max-w-fit border-2 bg-base-300 p-2 text-2xl">
				{data.name}
			</h2>
			<Resize />
		</div>
	);
}
