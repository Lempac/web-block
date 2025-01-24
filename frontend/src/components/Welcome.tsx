import { Handle, Position } from "@xyflow/react";
import icon from "@/assets/favicon.ico";
export default function Welcome() {
	return (
		<div className="card bg-base-300 p-4 flex-row">
			<div className="max-w-fit max-h-fit">
				<h1 className="card-title max-w-fit">Welcome to Web-block!</h1>
				<p className="w-80 pr-1">
					This is a project about editor in web, that lets you build projects
					using cool block interface.
				</p>
			</div>
			<img src={icon} alt="" className="rounded-xl size-28" />
			<Handle
				type="source"
				position={Position.Bottom}
				className="p-1 hover:p-2 transition-[padding]"
			/>
		</div>
	);
}
