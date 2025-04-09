import { useQueryClient } from "@tanstack/react-query";
import { Panel } from "@xyflow/react";
import type { PanelProps } from "@xyflow/react";
import { LuStepBack } from "react-icons/lu";

export type CloseProjectProps = {
	setCurrentProject: React.Dispatch<React.SetStateAction<number>>;
} & PanelProps;

export default function CloseProject({
	position,
	setCurrentProject,
}: CloseProjectProps) {
	const queryClient = useQueryClient();
	const handleClick = () => {
		setCurrentProject(0);
		queryClient.invalidateQueries({ queryKey: ["get", "/api/projects"] });
	};

	return (
		<Panel position={position}>
			<button className="btn" onClick={handleClick}>
				<LuStepBack />
			</button>
		</Panel>
	);
}
