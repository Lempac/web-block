import {
	useReactFlow,
	useStore,
	useViewport,
	type Node,
	type NodeProps,
} from "@xyflow/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { CustomNodeType } from "..";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const commands = new Map([
	["addFile", () => {}],
	["addFolder", () => {}],
	["showProjects", () => {}],
	["showSettings", () => {}],
]);

export type QuickCommandNode = Node<
	{
		onPaneClick: () => void;
		setX: Dispatch<SetStateAction<number | undefined>>;
		setY: Dispatch<SetStateAction<number | undefined>>;
		x: number | undefined;
		y: number | undefined;
	},
	"quickCommand"
>;

export default function QuickCommand({
	data,
	id,
	width,
	height,
}: NodeProps<QuickCommandNode>) {
	const [size, setSize] = useState([0, 0]);
	const { zoom } = useViewport();
	const { updateNode } = useReactFlow<CustomNodeType>();
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
	const position = useStore((state) => state.nodeLookup.get(id)?.position);
	useEffect(() => {
		if (!position) return;
		console.log("position updated", position, data.x, data.y);
		data.setX(position.x);
		data.setY(position.y);
		updateNode(id, (node) => {
			if (!node || !size[0] || !size[1]) return node;
			return {
				...node,
				style: {
					transform: `scale(${1 / zoom})`,
				},
			};
		});
	}, [data, id, position, size, updateNode, zoom]);

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
				className="flex gap-1 rounded-box bg-base-300 p-2 shadow"
			>
				<label className="input grow">
					<svg
						className="h-[1em] opacity-50"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<g
							strokeLinejoin="round"
							strokeLinecap="round"
							strokeWidth="2.5"
							fill="none"
							stroke="currentColor"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.3-4.3"></path>
						</g>
					</svg>
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
						// onClick={(e) => {
						// 	console.log(e);
						// 	e.preventDefault();
						// 	e.stopPropagation();
						// }}
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
					.map(([name, command], i) => (
						<li key={i}>
							<button
								className="btn"
								onClick={() => {
									command();
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
