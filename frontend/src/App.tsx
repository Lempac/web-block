import React, { useCallback, useEffect } from "react";
import {
	addEdge,
	Background,
	BackgroundVariant,
	type Connection,
	Controls,
	MiniMap,
	ReactFlow,
	useEdgesState,
	useKeyPress,
	useNodesState,
	useReactFlow,
	useStoreApi,
	type Viewport,
} from "@xyflow/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	fetchClient,
	nodeTypes,
	useAddQuickCommand,
	useOnPaneClick,
} from "./bootstrap";
import { type CustomNodeType } from "@/index";
import CloseProject from "@/components/CloseProject";
import { useTranslation } from "react-i18next";
import {
	useLocalStorage,
	useMediaQuery,
	usePreferredLanguage,
} from "@uidotdev/usehooks";
import Path from "./components/Path";
import useProjects from "./Providers/useProjects";
import UploadProject from "./components/UploadProject";
import { useUser } from "./Providers/useUser";
import { useForm } from "@tanstack/react-form";
// import NodeInspector from "./components/NodeInspector";
// import ELK from "elkjs/lib/elk.bundled.js";

// const elk = new ELK();

// const defaultOptions = {
// 	"elk.algorithm": "layered",
// 	"elk.layered.spacing.nodeNodeBetweenLayers": 100,
// 	"elk.spacing.nodeNode": 80,
// };

// const useLayoutedElements = () => {
// 	const { getNodes, setNodes, getEdges, fitView } = useReactFlow();

// 	const getLayoutedElements = useCallback((options: unknown) => {
// 		const layoutOptions = { ...defaultOptions, ...options };
// 		const graph = {
// 			id: "root",
// 			layoutOptions: layoutOptions,
// 			children: getNodes().map((node) => ({
// 				...node,
// 				width: node.measured?.width,
// 				height: node.measured?.height,
// 			})),
// 			edges: getEdges(),
// 		};
// 		if (graph.children.length === 0) return;
// 		// console.log(graph);
// 		elk.layout(graph).then(({ children }) => {
// 			// By mutating the children in-place we saves ourselves from creating a
// 			// needless copy of the nodes array.
// 			children?.forEach((node) => {
// 				node.position = { x: node.x, y: node.y };
// 			});

// 			setNodes(children);
// 			window.requestAnimationFrame(() => {
// 				fitView();
// 			});
// 		});
// 	}, [fitView, getEdges, getNodes, setNodes]);

// 	return { getLayoutedElements };
// };

export default function App() {
	const {
		fitView,
		screenToFlowPosition,
		setCenter,
		addNodes,
		addEdges,
		deleteElements,
	} = useReactFlow<CustomNodeType>();
	const [nodes, , onNodesChange] = useNodesState<CustomNodeType>([]);
	const [edges, setEdgeInternal, onEdgesChange] = useEdgesState([]);
	const store = useStoreApi();

	const onPaneClick = useOnPaneClick();
	const addQuickCommand = useAddQuickCommand();
	const [firstTime, setFirstTime] = useLocalStorage("firstTime", true);
	const {
		currentProject,
		projects,
		setCurrentProject,
		isLoading,
		isSuccess,
		cwd,
		getCurrentProject,
	} = useProjects();
	const { user, isSuccess: gotUser } = useUser();
	const { i18n } = useTranslation();
	const language = usePreferredLanguage();
	const theme = useMediaQuery("(prefers-color-scheme: dark)")
		? user?.settings.style.baseDarkTheme
		: user?.settings.style.baseLightTheme;

	//If new user create example project
	useEffect(() => {
		if (!firstTime || isLoading) return;
		const project = getCurrentProject();
		if (isSuccess && project?.name === "untitled")
			setCurrentProject(project.id);
		setFirstTime(false);
	}, [
		firstTime,
		getCurrentProject,
		isLoading,
		isSuccess,
		projects,
		setCurrentProject,
		setFirstTime,
	]);

	useEffect(() => {
		if (theme) document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);
	useEffect(() => {
		i18n.changeLanguage(
			language === user?.settings.lang
				? user?.settings.lang
				: user?.settings.lang || "en",
		);
	}, [i18n, language, user?.settings.lang]);

	// const r = useKeyPress('r');
	// useEffect(() => {
	// 	if(r === false) return;
	// 	getLayoutedElements({
	// 	'elk.algorithm': 'org.eclipse.elk.radial',
	// })}, [r]);

	const quickCommand = useKeyPress("Control+p", {
		preventDefault: true,
	});
	const { validateAsync, setFieldValue } = useForm({
		defaultValues: getCurrentProject(),
		validators: {
			onChangeAsyncDebounceMs: 250,
			onChangeAsync: async ({ value }) => {
				projects.set(currentProject, value);
				const { error } = await fetchClient.PUT("/api/projects/{project}", {
					params: {
						path: {
							project: value.id,
						},
					},
					body: value,
				});
				if (error) return { fields: error.errors };
				return null;
			},
		},
	});

	useEffect(() => {
		if (currentProject === "") return;
		const { x, y, zoom } = getCurrentProject()!;
		setCenter(x, y, {
			duration: 300,
			zoom: zoom || 1,
		});
	}, [currentProject, getCurrentProject, setCenter]);

	useEffect(() => {
		if (currentProject === "") return;
		addNodes([
			
		]);
	}, [addNodes, currentProject]);

	// useEffect(() => {
	// 	if (blocks === undefined || !hasOpenProject) return;
	// 	addNodes(
	// 		blocks.map((block) => ({
	// 			id: `${currentProject}-${block.id.toString()}`,
	// 			type: block.is_file ? "file" : "folder",
	// 			data: {},
	// 			style: { width: block.width, height: block.height },
	// 			parentId:
	// 				block.block_id !== null
	// 					? `${currentProject}-${block.block_id?.toString()}`
	// 					: undefined,
	// 			position:
	// 				block.block_id === null
	// 					? { x: block.x, y: block.y }
	// 					: (() => {
	// 							const parent = blocks.find((b) => b.id === block.block_id);
	// 							if (parent)
	// 								return { x: block.x - parent.x, y: block.y - parent.y };
	// 							console.assert(
	// 								parent !== undefined,
	// 								`Block: ${block.path} has ${block.block_id}, but parent: ${block.block_id} doesnt exist???`,
	// 							);
	// 							return { x: 0, y: 0 };
	// 						})(),
	// 			expandParent: true,
	// 		})),
	// 	);
	// }, [addNodes, blocks, currentProject, hasOpenProject]);

	// Show welcome node if user is not logged in or if user is logged in shows projects node
	useEffect(() => {
		addNodes({
			id: "projects",
			type: "projects",
			position: gotUser ? { x: 0, y: 0 } : { x: 300, y: 20 },
			data: {},
		});
		if (!gotUser) {
			addNodes([
				{ id: "auth", type: "auth", position: { x: 0, y: 0 }, data: {} },
				{
					id: "github",
					type: "github",
					position: { x: -50, y: -150 },
					data: {},
				},
				{
					id: "welcome",
					type: "welcome",
					position: { x: 170, y: -210 },
					data: {},
				},
			]);
			addEdges([
				{
					id: "github-auth",
					source: "github",
					target: "auth",
				},
				{
					id: "welcome-auth",
					source: "welcome",
					target: "auth",
				},
			]);
		} else {
			deleteElements({
				edges: [{ id: "github-auth" }, { id: "welcome-auth" }],
				nodes: [{ id: "welcome" }, { id: "github" }, { id: "auth" }],
			});
		}
		// Add padding to fit view, so when user authenticates, the view is not zoomed in.
		fitView({
			padding: gotUser ? 1.1 : 0.1,
		});
	}, [addEdges, addNodes, deleteElements, fitView, gotUser]);

	const onConnect = useCallback(
		(connection: Connection) =>
			setEdgeInternal((eds) => addEdge(connection, eds)),
		[setEdgeInternal],
	);

	const onViewportChange = useCallback(
		(viewport: Viewport) => {
			if (currentProject === "") return;
			const { domNode } = store.getState();
			const boundingRect = domNode?.getBoundingClientRect();
			if (!boundingRect) return;
			const center = screenToFlowPosition({
				x: boundingRect.x + boundingRect.width / 2,
				y: boundingRect.y + boundingRect.height / 2,
			});
			// Update form values with new center coordinates and zoom leve
			setFieldValue("x", Math.round(center.x));
			setFieldValue("y", Math.round(center.y));
			setFieldValue("zoom", viewport.zoom);
			validateAsync("change");
		},
		[currentProject, screenToFlowPosition, setFieldValue, store, validateAsync],
	);

	useEffect(() => {
		if (quickCommand === false || addQuickCommand === undefined) return;
		addQuickCommand();
	}, [addQuickCommand, quickCommand]);

	const onPaneContextMenu = useCallback(
		(event: React.MouseEvent | MouseEvent) => {
			// if (!isSuccess) return;
			event.preventDefault();
			// Calculate position of the context menu. We want to make sure it
			// doesn't get positioned off-screen.
			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});
			addNodes({
				id: "context",
				type: "contextMenu",
				position: {
					x: position.x,
					y: position.y,
				},
				data: {
					onClick: () => onPaneClick("context"),
				},
			});
		},
		[addNodes, onPaneClick, screenToFlowPosition],
	);
	return (
		<div
			className="absolute m-0 overflow-hidden"
			style={{ width: "100vw", height: "100vh" }}
		>
			<ReactFlow
				colorMode="system"
				nodeTypes={nodeTypes}
				nodes={nodes}
				edges={edges}
				onViewportChange={onViewportChange}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onPaneContextMenu={onPaneContextMenu}
				onPaneClick={() => {
					onPaneClick("context");
					onPaneClick("quickCommand");
				}}
				fitView
				maxZoom={100}
				minZoom={0.05}
				snapToGrid={true}
				snapGrid={[5, 5]}
				onlyRenderVisibleElements={false}
				fitViewOptions={{
					padding: gotUser ? 1.1 : 0.1,
				}}
				proOptions={{ hideAttribution: true }}
			>
				<Background variant={BackgroundVariant.Dots} />
				<Controls position={user?.settings?.style?.controlPosition} />
				<MiniMap
					zoomable
					pannable
					position={user?.settings?.style?.minimapPosition}
				/>
				{currentProject !== "" && (
					<>
						<UploadProject />
						<CloseProject position="top-left" />
						<Path path={cwd} position={user?.settings?.style?.pathPosition} />
					</>
				)}
			</ReactFlow>
			<ReactQueryDevtools initialIsOpen={false} />
		</div>
	);
}
