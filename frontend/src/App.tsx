import React, { useCallback, useEffect, useState } from "react";
import {
	addEdge,
	Background,
	BackgroundVariant,
	Connection,
	Controls,
	MiniMap,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow,
	// useStore,
} from "@xyflow/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Path from "@/components/Path";
import { $api, CustomNodeType, nodeTypes } from "./bootstrap";
import CloseProject from "@/components/CloseProject";
// import ELK from "elkjs/lib/elk.bundled.js";
import { loadTranslations } from "./i18n";

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

function App() {
	loadTranslations('en'); // Load default language
	loadTranslations('lv'); // Load additional languages
	// const { t } = useTranslation();
	// console.log(t('failed'));
	// const { getLayoutedElements } = useLayoutedElements();
	const [currentProject, setCurrentProject] = useState(0);

	const { isSuccess, data: user } = $api.useQuery(
		"get",
		"/api/user",
		{},
		{
			retry: 1,
			refetchInterval: 2 * 1000 * 60,
			//HACK: so we doest have two cache for user("get","/api/user",{})
			queryKey: ["get", "/api/user"],
		},
	);

	const {
		setNodes,
		setEdges,
		fitView,
		addNodes,
		deleteElements,
		screenToFlowPosition,
	} = useReactFlow<CustomNodeType>();
	const [nodes, , onNodesChange] = useNodesState<CustomNodeType>([]);
	const [edges, setEdgeInternal, onEdgesChange] = useEdgesState([]);
	// const r = useKeyPress('r');
	// useEffect(() => {
	// 	if(r === false) return;
	// 	getLayoutedElements({
	// 	'elk.algorithm': 'org.eclipse.elk.radial',
	// })}, [r]);
	const { isSuccess: hasOpenProject, data: blocks } = $api.useQuery(
		"get",
		"/api/blocks/{project}/blocks",
		{
			params: {
				path: {
					project: currentProject,
				},
			},
		},
		{ enabled: currentProject !== 0 },
	);
	useEffect(() => {
		if (blocks === undefined) return;
		addNodes(
			blocks.map((block) => ({
				id: block.id.toString(),
				type: block.is_file ? "file" : "folder",
				data: { },
				position: { x: block.x, y: block.y },
			})),
		);
	}, [addNodes, blocks, hasOpenProject]);

	// Show welcome node if user is not logged in or if user is logged in shows projects node
	useEffect(() => {
		// if(isSuccess) document.documentElement.setAttribute('data-theme', user.settings?.style?.baseLightTheme ?? '')
		setNodes(
			isSuccess
				? [
						{
							id: "projects",
							type: "projects",
							position: { x: 0, y: 0 },
							data: { currentProject, setCurrentProject },
						},
					]
				: [
						{ id: "auth", type: "auth", position: { x: 0, y: 0 }, data: {} },
						{
							id: "github",
							type: "github",
							position: { x: 0 - 50, y: 0 - 150 },
							data: {},
						},
						{
							id: "welcome",
							type: "welcome",
							position: { x: 0 + 170, y: 0 - 210 },
							data: {},
						},
					],
		);
		setEdges(
			!isSuccess
				? [
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
					]
				: [],
		);
		// Add padding to fit view, so when user authenticates, the view is not zoomed in.
		fitView({
			padding: isSuccess ? 1.1 : 0.1,
		});
	}, [currentProject, fitView, isSuccess, setEdges, setNodes]);

	const onConnect = useCallback(
		(connection: Connection) => setEdgeInternal((eds) => addEdge(connection, eds)),
		[setEdgeInternal],
	);

	const onPaneClick = useCallback(() => {
		deleteElements({
			nodes: [{ id: "context" }],
		});
	}, [deleteElements]);

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
			addNodes([
				{
					id: "context",
					type: "contextMenu",
					position: {
						x: position.x,
						y: position.y,
					},
					data: {
						onClick: onPaneClick,
						currentProject,
						setCurrentProject,
					},
				},
			]);
		},
		[addNodes, currentProject, onPaneClick, screenToFlowPosition],
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
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onPaneContextMenu={onPaneContextMenu}
				onPaneClick={onPaneClick}
				fitView
				snapToGrid={true}
				snapGrid={[5, 5]}
				onlyRenderVisibleElements={true}
				fitViewOptions={{
					padding: isSuccess ? 1.1 : 0.1,
				}}
				proOptions={{ hideAttribution: true }}
			>
				{/* {!process.env.NODE_ENV ||
					(process.env.NODE_ENV === "development" && <NodeInspector />)} */}
				<Background variant={BackgroundVariant.Dots} />
				{isSuccess && (
					<>
						<Controls position={user.settings?.style?.controlPosition} />
						<MiniMap zoomable pannable position={user.settings?.style?.minimapPosition} />
						{currentProject !== 0 && (
							<>
								<CloseProject position="top-left" />
								<Path path="123/123/123" position={user.settings?.style?.pathPosition} />
							</>
						)}
					</>
				)}
			</ReactFlow>
			<ReactQueryDevtools initialIsOpen={false} />
		</div>
	);
}

export default App;
