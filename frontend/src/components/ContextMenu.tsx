import { CustomNodeType } from "@/App";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { ProjectProps } from "@/components/Projects";

export type ContextMenuNode = Node<
	{ onClick?: () => void } & ProjectProps,
	"contextMenu"
>;

export default function ContextMenu({ data }: NodeProps<ContextMenuNode>) {
	const { currentProject, setCurrentProject } = data;
	const { addNodes, getNode, updateNode } = useReactFlow<CustomNodeType>();

	function showProjects() {
		const projects = getNode("projects");
		const contextMenu = getNode("context");
		if (!contextMenu) return;
		if (!projects)
			addNodes({
				id: "projects",
				type: "projects",
				position: contextMenu.position,
				data: { currentProject, setCurrentProject },
			});
		else
			updateNode(projects.id, {
				position: contextMenu.position,
			});
	}

	function showSettings() {
		const settings = getNode("settings");
		const contextMenu = getNode("context");
		if (!contextMenu) return;
		if (!settings) {
			addNodes([
				{
					id: "settings",
					type: "settings",
					position: contextMenu.position,
					data: {},
				},
				{
					id: "profile",
					type: "profile",
					position: { x: 0, y: 0 },
					data: {},
					parentId: "settings",
					extent: "parent",
					expandParent: false,
				},
				{
					id: "theme",
					type: "theme",
					position: { x: 0, y: 0 },
					data: {},
					parentId: "settings",
					extent: "parent",
					expandParent: false,
				},
			]);
		} else
			updateNode(settings.id, {
				position: contextMenu.position,
			});
	}

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
						<button className="btn">
							File
							<VscNewFile />
						</button>
					</li>
					<li>
						<button className="btn">
							Folder
							<VscNewFolder />
						</button>
					</li>
				</ul>
			</div>
			<button className="btn" onClick={showProjects}>
				Show projects
			</button>
			<button className="btn" onClick={showSettings}>
				Show settings
			</button>
		</div>
	);
}
