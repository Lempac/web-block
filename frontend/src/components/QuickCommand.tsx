import {
	useReactFlow,
	type Node,
	type NodeProps,
	type ReactFlowInstance,
} from "@xyflow/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { CustomNodeType } from "..";
import { useUser } from "@/Providers/useUser";
import type { INITAL_SETTINGS_WINDOW } from "@/bootstrap";
import useProjects from "@/Providers/useProjects";
import { IoMdSearch } from "react-icons/io";

const commands = new Map([
	[
		"addFile",
		[
			(
				ReactFlowInstance: ReactFlowInstance<CustomNodeType>,
				x: number,
				y: number,
			) => {
				const { addNodes } = ReactFlowInstance;
				addNodes({
					id: crypto.randomUUID(),
					type: "file",
					data: {},
					position: { x, y },
				});
			},
			false,
		],
	],
	[
		"addFolder",
		[
			(
				ReactFlowInstance: ReactFlowInstance<CustomNodeType>,
				x: number,
				y: number,
			) => {
				const { addNodes } = ReactFlowInstance;
				addNodes({
					id: crypto.randomUUID(),
					type: "folder",
					data: {},
					position: { x, y },
				});
			},
			false,
		],
	],
	[
		"showProjects",
		[
			(
				ReactFlowInstance: ReactFlowInstance<CustomNodeType>,
				x: number,
				y: number,
			) => {
				const { addNodes } = ReactFlowInstance;
				addNodes({
					id: "projects",
					type: "projects",
					position: { x, y },
					data: {},
				});
			},
			true,
		],
	],
	[
		"showSettings",
		[
			(
				ReactFlowInstance: ReactFlowInstance<CustomNodeType>,
				x: number,
				y: number,
				settings: typeof INITAL_SETTINGS_WINDOW,
			) => {
				const { addNodes } = ReactFlowInstance;
				addNodes({
					id: "settings",
					type: "settings",
					position: { x, y },
					style: { width: settings.width, height: settings.height },
					data: {},
				});
			},
			true,
		],
	],
]);

export type QuickCommandNode = Node<
	{
		onPaneClick: () => void;
	},
	"quickCommand"
>;

export default function QuickCommand({
	data,
	// id,
	width,
	height,
	positionAbsoluteX,
	positionAbsoluteY,
}: NodeProps<QuickCommandNode>) {
	const { settings } = useUser();
	const { currentProject } = useProjects();
	const reactFlow = useReactFlow<CustomNodeType>();
	const [size, setSize] = useState([0, 0]);
	// const { zoom } = useViewport();
	// const { updateNode } = useReactFlow<CustomNodeType>();
	const { t } = useTranslation();
	useEffect(() => {
		if (
			width === undefined ||
			height === undefined ||
			size[0] !== 0 ||
			size[1] !== 0
		)
			return;
		console.assert(
			width !== undefined || height !== undefined,
			"width and height must be provided",
		);
		console.assert(
			size[0] === 0 && size[1] === 0,
			`size is already set: ${size}`,
		);
		setSize([width, height]);
	}, [height, size, width]);
	// const position = useStore((state) => state.nodeLookup.get(id)?.position);
	// useEffect(() => {
	// 	if (!position) return;
	// 	updateNode(id, (node) => {
	// 		if (!node || !size[0] || !size[1]) return node;
	// 		return {
	// 			...node,
	// 			style: {
	// 				transform: `scale(${1 / zoom})`,
	// 			},
	// 		};
	// 	});
	// }, [data, id, position, size, updateNode, zoom]);

	// useEffect(() => {
	// 	updateNode(id, (node) => {
	// 		if (!node || !size[0] || !size[1]) return node;
	// 		return {
	// 			...node,
	// 			style: {
	// 				transform: `scale(${1 / zoom})`,
	// 			}
	// 		};
	// 	});
	// }, [id, size, updateNode, zoom]);

	return (
		<>
			<div
				onClick={data.onPaneClick}
				className="flex gap-1 rounded-box bg-base-300 p-2 shadow ring-neutral in-[.selected]:ring-4"
			>
				<label className="input grow">
					<IoMdSearch size={30}/>
					<input
						autoFocus
						type="search"
						placeholder={t("quick-command.name")}
						// onChange={(e) => {
						// 	console.log(e);
						// 	e.preventDefault();
						// 	e.stopPropagation();
						// }}
						// onFocus={(e) => {
						// 	console.log(e);
						// 	e.preventDefault();
						// 	e.stopPropagation();
						// }}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						// onSubmit={(e) => {
						// 	console.log(e);
						// 	e.preventDefault();
						// 	e.stopPropagation();
						// }}
					/>
					<kbd className="kbd kbd-sm">Ctrl</kbd>
					<kbd className="kbd kbd-sm">P</kbd>
				</label>
			</div>
			<ul
				tabIndex={0}
				className={clsx(
					"nowheel nodarg dropdown-content menu mt-2 flex-nowrap gap-0.5 overflow-y-scroll rounded-box bg-base-100 p-2 shadow sm:h-32 md:h-64",
					commands.size < 6 && "h-auto!",
				)}
			>
				{commands
					.entries()
					.filter(([, [, anytime]]) => anytime || currentProject !== "")
					.map(([name, [command]], i) => (
						<li key={i}>
							<button
								className="btn"
								onClick={() => {
									if (command === undefined || typeof command === "boolean") {
										data.onPaneClick();
										return;
									}
									console.assert(
										typeof command !== "boolean",
										`Some how command(${name}) is bool?: ${command}`,
									);
									command(
										reactFlow,
										positionAbsoluteX,
										positionAbsoluteY,
										settings,
									);
									data.onPaneClick();
								}}
							>
								{name}
							</button>
						</li>
					))
					.toArray()}
			</ul>
		</>
	);
}
