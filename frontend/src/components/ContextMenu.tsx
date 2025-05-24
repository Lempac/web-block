import { INITAL_SETTINGS_WINDOW, useAddQuickCommand } from "@/bootstrap";
import { type CustomNodeType } from "@/index";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { useTranslation } from "react-i18next";
import { FaArrowRight } from "react-icons/fa6";
import { useLocalStorage } from "@uidotdev/usehooks";

export type ContextMenuNode = Node<{ onClick: () => void }, "contextMenu">;

export default function ContextMenu({
	positionAbsoluteX,
	positionAbsoluteY,
	data,
}: NodeProps<ContextMenuNode>) {
	const addQuickCommand = useAddQuickCommand();
	const [settings] = useLocalStorage("settings", INITAL_SETTINGS_WINDOW);
	const { t } = useTranslation();
	const { addNodes } = useReactFlow<CustomNodeType>();

	const addFile = () =>
		addNodes([
			{
				id: crypto.randomUUID(),
				type: "file",
				data: {},
				position: { x: positionAbsoluteX, y: positionAbsoluteY },
			},
		]);

	const addFolder = () =>
		addNodes({
			id: crypto.randomUUID(),
			type: "folder",
			data: {},
			position: { x: positionAbsoluteX, y: positionAbsoluteY },
		});
	const showProjects = () =>
		addNodes({
			id: "projects",
			type: "projects",
			position: { x: positionAbsoluteX, y: positionAbsoluteY },
			data: { },
		});

	const showSettings = () =>
		addNodes({
			id: "settings",
			type: "settings",
			position: { x: positionAbsoluteX, y: positionAbsoluteY },
			style: { width: settings.width, height: settings.height },
			data: {},
		});
	const showQuickCommand = addQuickCommand;

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
			<button className="nodrag btn" onClick={showProjects}>
				{t("context-menu.show-project")}
			</button>
			<button className="nodrag btn" onClick={showSettings}>
				{t("context-menu.show-settings")}
			</button>
			<button className="nodrag btn" onClick={showQuickCommand}>
				{t("context-menu.show-quick-command")}
			</button>
		</div>
	);
}
