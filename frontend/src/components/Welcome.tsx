import { Handle, Position } from "@xyflow/react";
import icon from "@/assets/favicon.ico";
export default function Welcome() {
	return (
		<div className="card flex-row bg-base-300 p-4">
			<div className="max-h-fit max-w-fit">
				<h1 className="card-title max-w-fit">Welcome to Web-block!</h1>
				<p className="w-80 pr-1">
					This is a project about editor in web, that lets you build projects
					using cool block interface.
				</p>
			</div>
			<img src={icon} alt="" className="size-28 rounded-xl" />
			<Handle
				type="source"
				position={Position.Bottom}
				className="p-1 transition-[padding] hover:p-2"
			/>
		</div>
	);
}
