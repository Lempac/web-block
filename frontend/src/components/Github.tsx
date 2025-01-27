import { Handle, Position } from "@xyflow/react";
import { FaGithub } from "react-icons/fa6";
import { useRoute } from "ziggy-js";

export default function Github() {
	const route = useRoute();

	return (
		<div className="card bg-base-300 p-4">
			<a
				className="nodrag btn"
				type="button"
				href={route("auth.redirect")}
				title="Register/Login with Github!"
			>
				<FaGithub />
				Github
			</a>
			<Handle
				type="source"
				position={Position.Bottom}
				className="p-1 transition-[padding] hover:p-2"
			/>
		</div>
	);
}
