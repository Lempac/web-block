import type { Node } from "@xyflow/react";

export type QuickCommandNode = Node<Record<never, never>, "quickCommand">;
export default function QuickCommand() {
	return (
		<div>
			<h1>Quick Command</h1>
			{/* Add your command logic here */}
		</div>
	);
}
