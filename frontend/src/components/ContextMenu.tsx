import { $api, addOrUpdate, type CustomNodeType } from "@/bootstrap";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import type { ProjectProps } from "@/components/Projects";
import { useTranslation } from "react-i18next";
import { FaArrowRight } from "react-icons/fa6";

export type ContextMenuNode = Node<
	{ onClick: () => void } & ProjectProps,
	"contextMenu"
>;

export default function ContextMenu({
	positionAbsoluteX,
	positionAbsoluteY,
	data,
}: NodeProps<ContextMenuNode>) {
	const { t } = useTranslation();
	const { currentProject, setCurrentProject } = data;
	const { addNodes, setNodes } = useReactFlow<CustomNodeType>();
	const { isSuccess } = $api.useQuery("get", "/api/user");

	const addFile = () =>
		addNodes({
			id: crypto.randomUUID(),
			type: "file",
			data: {},
			position: { x: positionAbsoluteX, y: positionAbsoluteY },
		});

	const addFolder = () =>
		addNodes({
			id: crypto.randomUUID(),
			type: "folder",
			data: {},
			position: { x: positionAbsoluteX, y: positionAbsoluteY },
		});
	const showProjects = () =>
		setNodes((() => {
			console.log(positionAbsoluteX, positionAbsoluteY)
			return addOrUpdate({
			id: "projects",
			type: "projects",
			position: { x: positionAbsoluteX, y: positionAbsoluteY },
			data: { currentProject, setCurrentProject },
		})})());

	const showSettings = () =>
		setNodes(
			addOrUpdate({
				id: "settings",
				type: "settings",
				position: { x: positionAbsoluteX, y: positionAbsoluteY },
				data: {},
			}),
		);

	return (
		<div className="card gap-1 bg-base-300 p-2 shadow" onClick={data.onClick}>
			<div className="dropdown-hover nodrag dropdown dropdown-right flex">
				<button className="nodrag btn grow">
					{t("context-menu.new")}
					<FaArrowRight />
				</button>
				<ul
					tabIndex={0}
					className="dropdown-content menu gap-y-1 rounded-box bg-base-100 p-2 shadow-sm"
				>
					<li>
						<button className="nodrag btn" onClick={addFile}>
							{t("context-menu.file")}
							<VscNewFile />
						</button>
					</li>
					<li>
						<button className="nodrag btn" onClick={addFolder}>
							{t("context-menu.folder")}
							<VscNewFolder />
						</button>
					</li>
				</ul>
			</div>
			{isSuccess && (
				<button className="nodrag btn" onClick={showProjects}>
					{t("context-menu.show-project")}
				</button>
			)}
			<button className="nodrag btn" onClick={showSettings}>
				{t("context-menu.show-settings")}
			</button>
		</div>
	);
}
