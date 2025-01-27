import { NodeResizeControl } from "@xyflow/react";
import { IoMdResize } from "react-icons/io";

export default function Resize() {
	return (
		<NodeResizeControl
			position="bottom-right"
			style={{ background: "transparent", border: "none" }}
		>
			<IoMdResize className="relative -top-5 -left-5 rotate-90" />
		</NodeResizeControl>
	);
}
