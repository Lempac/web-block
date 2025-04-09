import React, { useCallback, useEffect, useState } from "react";
import {
	addEdge,
	Background,
	BackgroundVariant,
	type Connection,
	Controls,
	MiniMap,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow,
	useStoreApi,
	type Viewport,
} from "@xyflow/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	$api,
	addOrUpdate,
	type CustomNodeType,
	fetchClient,
	getPositionReletiveToParent,
	nodeTypes,
} from "./bootstrap";
import CloseProject from "@/components/CloseProject";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { useMediaQuery, usePreferredLanguage } from "@uidotdev/usehooks";
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

function App() {
	const { i18n } = useTranslation();
	const language = usePreferredLanguage();
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
	// console.log(user);
	const theme = useMediaQuery("(prefers-color-scheme: dark)") ? user?.settings.style.baseDarkTheme : user?.settings.style.baseLightTheme;
	useEffect(() => {
		if(theme) document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);
	useEffect(() => {
		i18n.changeLanguage(language === user?.settings.lang ? user?.settings.lang : user?.settings.lang || "en");
	}, [i18n, language, user?.settings.lang]);
	// console.log(t('failed'));
	// const { getLayoutedElements } = useLayoutedElements();
	// const [currectRadiusField] = useState('');
	const [currentProject, setCurrentProject] = useState(0);


	const {
		setNodes,
		setEdges,
		fitView,
		deleteElements,
		screenToFlowPosition,
		setCenter,
	} = useReactFlow<CustomNodeType>();
	const [nodes, , onNodesChange] = useNodesState<CustomNodeType>([]);
	const [edges, setEdgeInternal, onEdgesChange] = useEdgesState([]);
	const store = useStoreApi();
	// const r = useKeyPress('r');
	// useEffect(() => {
	// 	if(r === false) return;
	// 	getLayoutedElements({
	// 	'elk.algorithm': 'org.eclipse.elk.radial',
	// })}, [r]);
	const { data: currentProjectData, isSuccess: isCurrentProjectDataLoaded } =
		$api.useQuery(
			"get",
			"/api/projects/{project}",
			{
				params: {
					path: {
						project: currentProject,
					},
				},
			},
			{ enabled: currentProject !== 0 },
		);
	const { validateAsync, setFieldValue } = useForm({
		defaultValues: currentProjectData,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
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
		if (
			currentProject === 0 ||
			!isCurrentProjectDataLoaded ||
			currentProjectData === undefined
		)
			return;
		setCenter(currentProjectData.x, currentProjectData.y, {
			duration: 300,
			zoom: currentProjectData.zoom,
		});
	}, [
		currentProject,
		currentProjectData,
		isCurrentProjectDataLoaded,
		setCenter,
	]);

	useEffect(() => {
		if (blocks === undefined) return;
		setNodes(
			addOrUpdate(
				blocks.map((block) =>
					block.is_file
						? {
								id: block.id.toString(),
								type: "file",
								data: {},
								style: { width: block.width, height: block.height },
								parentId: block.block_id?.toString(),
								position: (() => {
									const res = getPositionReletiveToParent(block, blocks);
									console.log(res);
									return res;
								})(),
								expandParent: true,
							}
						: {
								id: block.id.toString(),
								type: "folder",
								data: {},
								style: { width: block.width, height: block.height },
								parentId: block.block_id?.toString(),
								position: (() => {
									const res = getPositionReletiveToParent(block, blocks);
									console.log(res);
									return res;
								})(),
								expandParent: true,
							},
				),
			),
		);
	}, [blocks, hasOpenProject, setNodes]);

	// Show welcome node if user is not logged in or if user is logged in shows projects node

	useEffect(() => {
		if (isSuccess) {
			if (currentProject !== 0) return;
			setNodes(
				addOrUpdate({
					id: "projects",
					type: "projects",
					position: { x: 0, y: 0 },
					data: {
						currentProject: currentProject,
						setCurrentProject: setCurrentProject,
					},
				}),
			);
			deleteElements({
				nodes: [{ id: "auth" }, { id: "github" }, { id: "welcome" }],
				edges: [{ id: "github-auth" }, { id: "welcome-auth" }],
			});
		} else {
			setNodes(
				addOrUpdate([
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
				]),
			);
			setEdges(
				addOrUpdate([
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
				]),
			);
			deleteElements({
				nodes: [{ id: "projects" }],
			});
		}

		// Add padding to fit view, so when user authenticates, the view is not zoomed in.
		fitView({
			padding: isSuccess ? 1.1 : 0.1,
		});
	}, [currentProject, deleteElements, fitView, isSuccess, setEdges, setNodes]);

	const onConnect = useCallback(
		(connection: Connection) =>
			setEdgeInternal((eds) => addEdge(connection, eds)),
		[setEdgeInternal],
	);

	const onViewportChange = useCallback(
		(viewport: Viewport) => {
			if (currentProject === 0 || !isCurrentProjectDataLoaded) return;
			const { domNode } = store.getState();
			const boundingRect = domNode?.getBoundingClientRect();
			if (!boundingRect) return;
			const center = screenToFlowPosition({
				x: boundingRect.x + boundingRect.width / 2,
				y: boundingRect.y + boundingRect.height / 2,
			});
			setFieldValue("x", Math.round(center.x));
			setFieldValue("y", Math.round(center.y));
			setFieldValue("zoom", viewport.zoom);
			validateAsync("change");
		},
		[
			currentProject,
			isCurrentProjectDataLoaded,
			screenToFlowPosition,
			setFieldValue,
			store,
			validateAsync,
		],
	);

	const onPaneClick = useCallback(
		() =>
			deleteElements({
				nodes: [{ id: "context" }],
			}),
		[deleteElements],
	);

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
			setNodes(
				addOrUpdate<CustomNodeType>({
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
				}),
			);
		},
		[currentProject, onPaneClick, screenToFlowPosition, setNodes],
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
				onPaneClick={onPaneClick}
				fitView
				snapToGrid={true}
				snapGrid={[5, 5]}
				onlyRenderVisibleElements={false}
				fitViewOptions={{
					minZoom: 0.001,
					maxZoom: 1000,
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
						<MiniMap
							zoomable
							pannable
							position={user.settings?.style?.minimapPosition}
						/>
						{currentProject !== 0 && (
							<>
								<CloseProject
									position="top-left"
									setCurrentProject={setCurrentProject}
								/>
								{/* <Path
									path="123/123/123"
									position={user.settings?.style?.pathPosition}
								/> */}
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
