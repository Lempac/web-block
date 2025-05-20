import { NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { CustomNodeType } from "..";

export default function Delete({ parent }: { parent: string }) {
	const { deleteElements } = useReactFlow<CustomNodeType>();
	return (
		<NodeToolbar
			//BUG: The only possible position cause the need to do custom css
			// that support scaling, so for now the delete button is on right side.
			position={Position.Right}
		>
			{/* <div className="relative -top-50"> */}
			<button
				className="btn btn-error"
				onClick={() => deleteElements({ nodes: [{ id: parent }] })}
			>
				<RiDeleteBin6Line />
			</button>
			{/* </div> */}
		</NodeToolbar>
	);
}
