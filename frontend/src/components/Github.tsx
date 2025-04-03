import { BASE_URL } from "@/bootstrap";
import { Handle, Position, type Node } from "@xyflow/react";
import { FaGithub } from "react-icons/fa6";

export type GithubNode = Node<Record<never, never>, "github">;

export default function Github() {
	return (
		<div className="card card-sm bg-base-100 shadow">
			<div className="card-body">
				<a
					className="nodrag btn"
					type="button"
					href={`${BASE_URL}/auth/redirect`}
					title="Register/Login with Github!"
				>
					<FaGithub />
					Github
				</a>
			</div>
			<Handle
				type="source"
				position={Position.Bottom}
				className="p-1 transition-[padding] hover:p-2"
			/>
		</div>
	);
}
