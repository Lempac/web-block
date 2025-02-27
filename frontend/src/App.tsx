import React, { useCallback, useEffect } from "react";
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
import { User } from "@/index";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import File, { FileNode } from "@/components/File";
import Path from "@/components/Path";
import NodeInspector from "./components/NodeInspector";
import ContextMenu, { ContextMenuNode } from "@/components/ContextMenu";

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
	const { isSuccess } = useQuery<AxiosResponse<User>, AxiosError>({
		queryKey: ["user"],
		queryFn: async () => axios.get(route("user")),
		retry: 1,
		refetchInterval: 2 * 1000 * 60,
	});
	const { setNodes, setEdges, fitView, addNodes, deleteElements, screenToFlowPosition } = useReactFlow<CustomNodeType>();
	const [nodes, , onNodesChange] = useNodesState([]);

	// Show welcome node if user is not logged in or if user is logged in shows projects node
	useEffect(() => {
		setNodes(
			isSuccess
				? [
						{
							id: "projects",
							type: "projects",
							position: { x: 0, y: 0 },
							data: {},
						},
						{
							id: "folder",
							type: "folder",
							position: { x: 0, y: -200 },
							data: { name: "Test" },
						},
						{
							id: "file",
							type: "file",
							position: { x: -200, y: 0 },
							data: {
								title: "Test.txt",
								content: "Hello World!",
							},
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
	}, [fitView, isSuccess, setEdges, setNodes]);
	const [edges, setEdgeInternal, onEdgesChange] = useEdgesState([]);

	const onConnect: OnConnect = useCallback(
		(connection) => setEdgeInternal((eds) => addEdge(connection, eds)),
		[setEdgeInternal],
	);

	const onPaneClick = useCallback(() => {
		deleteElements({
			nodes: [{ id: "context" }],
		})
	}, [deleteElements]);

	const onPaneContextMenu = useCallback(
		(event: React.MouseEvent | MouseEvent) => {
			event.preventDefault();
			// Calculate position of the context menu. We want to make sure it
			// doesn't get positioned off-screen.
			const position = screenToFlowPosition({x: event.clientX, y: event.clientY })
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
					},
				},
			])
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
				{!process.env.NODE_ENV ||
					(process.env.NODE_ENV === "development" && <NodeInspector />)}
				<Background variant={BackgroundVariant.Dots} />
				{isSuccess && (
					<>
						<Controls />
						<MiniMap zoomable pannable />
						<Path path="123/123/123" />
					</>
				)}
			</ReactFlow>
			<ReactQueryDevtools initialIsOpen={false} />
		</div>
	);
}

export default App;
