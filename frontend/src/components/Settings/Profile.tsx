import type { Node } from "@xyflow/react";
import Resize from "../Resize";

export type ProfileNode = Node<Record<never, never>, "profile">;

export default function Profile() {
	return (
		<div className="card gap-2 border-2 p-4">
			<div className="mb-3">
				<h2 className="card absolute -top-6 card-body max-w-fit border-2 bg-base-200 p-2 text-2xl">
					Profile
				</h2>
			</div>
			<input className="nodrag input" />
			<input className="nodrag input" />
			<input className="nodrag input" />
			<Resize />
		</div>
	);
}
