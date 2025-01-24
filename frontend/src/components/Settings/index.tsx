import { Handle, Position } from "@xyflow/react";
import Resize from "../Resize";

export default function Settings() {
	return (
		<div className="card border-2 p-4 h-full grid content-between">
			<h2 className="border-2 text-2xl card p-2 bg-gray-800 relative -top-10 max-w-fit">
				Settings
			</h2>
			<button className="btn text-2xl">Save</button>
			<Resize/>
			<Handle
				type="source"
				position={Position.Right}
				className="p-1 hover:p-2 transition-[padding]"
			/>
		</div>
	);
}
