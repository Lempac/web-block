import { useQueryClient } from "@tanstack/react-query";
import { Panel, useReactFlow } from "@xyflow/react";
import type { PanelProps } from "@xyflow/react";
import { LuStepBack } from "react-icons/lu";
import type { CustomNodeType } from "..";
import useProjects from "@/Providers/useProjects";
export default function CloseProject({ position }: PanelProps) {
	const queryClient = useQueryClient();
	const { currentProject, setCurrentProject } = useProjects();
	const { deleteElements, getNodes } = useReactFlow<CustomNodeType>();
	const handleClick = () => {
		deleteElements({
			nodes: getNodes().filter((node) =>
				node.id.startsWith(`${currentProject}-`),
			),
		});
		setCurrentProject("");
		queryClient.invalidateQueries({ queryKey: ["get", "/api/projects"] });
		queryClient.invalidateQueries({
			queryKey: ["get", "/api/projects/{project}"],
		});
		queryClient.invalidateQueries({ queryKey: ["get", "/api/blocks/{block}"] });
	};

	return (
		<Panel position={position}>
			<button className="btn" onClick={handleClick}>
				<LuStepBack />
			</button>
		</Panel>
	);
}
