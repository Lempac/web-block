import ELK from 'elkjs/lib/elk-api';
import React, { useCallback, useEffect, useState } from "react";
import {
	addEdge,
	Background,
	BackgroundVariant,
	BuiltInNode,
	Controls,
	MiniMap,
	NodeTypes,
	OnConnect,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "@xyflow/react";
import Auth, { AuthNode } from "@/components/Auth.tsx";
import Projects, { ProjectsNode } from "@/components/Projects.tsx";
import Github, { GithubNode } from "@/components/Github.tsx";
import Welcome, { WelcomeNode } from "@/components/Welcome.tsx";
import Settings, { SettingsNode } from "@/components/Settings";
import Profile, { ProfileNode } from "@/components/Settings/Profile";
import Theme, { ThemeNode } from "@/components/Settings/Theme";
import Folder, { FolderNode } from "@/components/Folder";
import { Block, User } from "@/index";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import File, { FileNode } from "@/components/File";
import Path from "@/components/Path";
import ContextMenu, { ContextMenuNode } from "@/components/ContextMenu";

const elk = new ELK({workerUrl: './elk-worker.min.js'});

const defaultOptions = {
	"elk.algorithm": "layered",
	"elk.layered.spacing.nodeNodeBetweenLayers": 100,
	"elk.spacing.nodeNode": 80,
};
const useLayoutedElements = () => {
	const { getNodes, setNodes, getEdges, fitView } = useReactFlow<CustomNodeType>();

	const getLayoutedElements = useCallback((options: Record<string, unknown>) => {
		const layoutOptions = { ...defaultOptions, ...options };
		const graph = {
			id: "root",
			layoutOptions: layoutOptions,
			children: getNodes().map((node) => ({
				...node,
				width: node.measured?.width,
				height: node.measured?.height,
			})),
			edges: getEdges(),
		};

		elk.layout(graph).then(({ children }) => {
			if(!children) return;
			// By mutating the children in-place we saves ourselves from creating a
			// needless copy of the nodes array.
			const nodes = children.map(node => ({ position: { x: node.x, y: node.y }, ...node }));

			setNodes(nodes);
			window.requestAnimationFrame(() => {
				fitView();
			});
		});
	}, [fitView, getEdges, getNodes, setNodes]);

	return { getLayoutedElements };
};

export type CustomNodeType =
	| BuiltInNode
	| AuthNode
	| ProjectsNode
	| GithubNode
	| WelcomeNode
	| SettingsNode
	| ProfileNode
	| ThemeNode
	| FolderNode
	| FileNode
	| ContextMenuNode;

const nodeTypes: NodeTypes = {
	auth: Auth,
	welcome: Welcome,
	profile: Profile,
	theme: Theme,
	folder: Folder,
	settings: Settings,
	file: File,
	projects: Projects,
	github: Github,
	contextMenu: ContextMenu,
} as const;
function App() {
	const route = useRoute();
	const [currentProject, setCurrentProject] = useState(0);
	const { getLayoutedElements } = useLayoutedElements();
	const { isSuccess } = useQuery<AxiosResponse<User>, AxiosError>({
		queryKey: ["user"],
		queryFn: async () => axios.get(route("user")),
		retry: 1,
		refetchInterval: 2 * 1000 * 60,
	});
	const {
		setNodes,
		setEdges,
		fitView,
		addNodes,
		deleteElements,
		screenToFlowPosition,
	} = useReactFlow<CustomNodeType>();
	const [nodes, , onNodesChange] = useNodesState([]);
	const { isSuccess: hasOpenProject, data: blocks } = useQuery<
		AxiosResponse<Block[]>,
		AxiosError
	>({
		queryKey: [currentProject, "blocks"],
		queryFn: async () =>
			axios.get(route("blocks.index", { project: currentProject })),
		enabled: currentProject !== 0,
	});
	useEffect(() => {
		if (blocks === undefined) return;
		addNodes(
			blocks.data.map((block) => ({
				id: block.path,
				type: block.is_file ? "file" : "folder",
				data: { title: block.path, content: block.content ?? "" },
				position: { x: block.x, y: block.y },
			})),
		);
	}, [addNodes, blocks, blocks?.data, hasOpenProject]);

	// Show welcome node if user is not logged in or if user is logged in shows projects node
	useEffect(() => {
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
	const [edges, setEdgeInternal, onEdgesChange] = useEdgesState([]);

	const onConnect: OnConnect = useCallback(
		(connection) => setEdgeInternal((eds) => addEdge(connection, eds)),
		[setEdgeInternal],
	);

	const onPaneClick = useCallback(() => {
		deleteElements({
			nodes: [{ id: "context" }],
		});
	}, [deleteElements]);

	const onPaneContextMenu = useCallback(
		(event: React.MouseEvent | MouseEvent) => {
			if (!isSuccess) return;
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
		[addNodes, currentProject, isSuccess, onPaneClick, screenToFlowPosition],
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
						<Controls />
						<MiniMap zoomable pannable />
						{currentProject !== 0 && <Path path="123/123/123" />}
					</>
				)}
			</ReactFlow>
			<ReactQueryDevtools initialIsOpen={false} />
		</div>
	);
}

export default App;
