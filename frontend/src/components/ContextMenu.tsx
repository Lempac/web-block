import { $api, CustomNodeType } from "@/bootstrap";
import {
	useReactFlow,
	type Node,
	type NodeProps,
} from "@xyflow/react";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { ProjectProps } from "@/components/Projects";

export type ContextMenuNode = Node<
	{ onClick?: () => void } & ProjectProps,
	"contextMenu"
>;

export default function ContextMenu({
	positionAbsoluteX,
	positionAbsoluteY,
	data,
}: NodeProps<ContextMenuNode>) {
	const { currentProject, setCurrentProject } = data;
	const { addNodes, updateNode, getNode } = useReactFlow<CustomNodeType>();
	const { isSuccess } = $api.useQuery("get", "/api/user");
	const projects = getNode("projects");
	const settings = getNode("settings");
	// console.log(projects, settings);
	
	const addFile = () =>
		addNodes({
			id: crypto.randomUUID(),
			type: "file",
			data: { id: -1 },
			position: { x: positionAbsoluteX, y: positionAbsoluteY },
		});

	const addFolder = () =>
		addNodes({
			id: crypto.randomUUID(),
			type: "folder",
			data: { id: -1 },
			position: { x: positionAbsoluteX, y: positionAbsoluteY },
		});

	const showProjects = () =>
		projects
			? updateNode(projects.id, {
					position: { x: positionAbsoluteX, y: positionAbsoluteY },
				})
			: addNodes({
					id: "projects",
					type: "projects",
					position: { x: positionAbsoluteX, y: positionAbsoluteY },
					data: { currentProject, setCurrentProject },
				});

	const showSettings = () =>
		settings
			? updateNode(settings.id, {
					position: { x: positionAbsoluteX, y: positionAbsoluteY },
				})
			: addNodes([
					{
						id: "settings",
						type: "settings",
						position: { x: positionAbsoluteX, y: positionAbsoluteY },
						data: {},
					},
				]);

	return (
		<div className="card gap-1 bg-base-300 p-2 shadow" onClick={data.onClick}>
			<div className="dropdown-hover nodrag dropdown dropdown-right flex">
				<button tabIndex={0} className="btn grow">
					New
				</button>
				<ul
					tabIndex={0}
					className="dropdown-content menu gap-y-1 rounded-box bg-base-100 p-2 shadow-sm"
				>
					<li>
						<button className="nodrag btn" onClick={addFile}>
							File
							<VscNewFile />
						</button>
					</li>
					<li>
						<button className="nodrag btn" onClick={addFolder}>
							Folder
							<VscNewFolder />
						</button>
					</li>
				</ul>
			</div>
			{isSuccess && (
				<button className="nodrag btn" onClick={showProjects}>
					Show projects
				</button>
			)}
			<button className="nodrag btn" onClick={showSettings}>
				Show settings
			</button>
		</div>
	);
}
