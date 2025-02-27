import { Handle, Position, type Node } from "@xyflow/react";
import Resize from "../Resize";

export type SettingsNode = Node<Record<never, never>, "settings">;

export default function Settings() {
	return (
		<div className="card grid h-full content-between border-2 p-4">
			<h2 className="card relative -top-10 max-w-fit border-2 bg-base-200 p-2 text-2xl">
				Settings
			</h2>
			<button className="btn text-2xl">Save</button>
			<Resize />
			<Handle
				type="source"
				position={Position.Right}
				className="p-1 transition-[padding] hover:p-2"
			/>
		</div>
	);
}
