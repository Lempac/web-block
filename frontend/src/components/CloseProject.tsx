import { useQueryClient } from "@tanstack/react-query";
import { Panel, useReactFlow } from "@xyflow/react";
import type { PanelProps } from "@xyflow/react";
import { LuStepBack } from "react-icons/lu";
import type { CustomNodeType } from "..";
import useProjects from "@/Providers/useProjects";
export default function CloseProject({ position }: PanelProps) {
	const queryClient = useQueryClient();
	const { setCurrentProject, getProject, currentProject } = useProjects();
	const { deleteElements, getNodes } = useReactFlow<CustomNodeType>();
	const handleClick = () => {
		deleteElements({
			nodes: getNodes().filter((node) =>
				node.id.startsWith(`${getProject(currentProject)?.name}|*|`),
			),
		});
		setCurrentProject("");
		queryClient.invalidateQueries({ queryKey: ["getProjects"] });
	};

	return (
		<Panel position={position}>
			<button className="btn" onClick={handleClick}>
				<LuStepBack />
			</button>
		</Panel>
	);
}
