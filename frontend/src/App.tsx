import { useCallback, useEffect, useMemo } from "react";
import {
	addEdge,
	Background,
	BackgroundVariant,
	Connection,
	Controls,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "@xyflow/react";
import Auth from "@/components/Auth.tsx";
import Projects from "@/components/Projects.tsx";
import Github from "@/components/Github.tsx";
import Welcome from "@/components/Welcome.tsx";
import Settings from "@/components/Settings";
import Profile from "@/components/Settings/Profile";
import Theme from "@/components/Settings/Theme";
import Folder from "@/components/Folder";
import { User } from "@/index";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import File from "./components/File";
import { Path } from "./components/Path";

function App() {
	const route = useRoute();
	const reactFlowInstance = useReactFlow();
	const [nodes, , onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const { data: user, isSuccess } = useQuery<AxiosResponse<User>, AxiosError>({
		queryKey: ["user"],
		queryFn: async () => axios.get(route("user")),
		retry: 1,
		refetchInterval: 2 * 1000 * 60,
	});

	useEffect(() => {
		const position = { x: 0, y: 0 };
		if (isSuccess && !reactFlowInstance.getNode("projects")) {
			reactFlowInstance.setNodes([
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
					data: {},
				},
			]);
		} else {
			reactFlowInstance.setNodes([
				{ id: "auth", type: "auth", position: position, data: {} },
				{
					id: "github",
					type: "github",
					position: { x: position.x - 50, y: position.y - 150 },
					data: {},
				},
				{
					id: "welcome",
					type: "welcome",
					position: { x: position.x + 170, y: position.y - 210 },
					data: {},
				},
			]);
			reactFlowInstance.setEdges([
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
		}
	}, [user?.data, isSuccess]);

	const onConnect = useCallback(
		(params: Connection) => setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);
	const nodeTypes = useMemo(
		() => ({
			auth: Auth,
			projects: Projects,
			github: Github,
			welcome: Welcome,
			settings: Settings,
			profile: Profile,
			theme: Theme,
			folder: Folder,
			file: File,
		}),
		[],
	);

	useEffect(() => {
		reactFlowInstance.fitView({
			includeHiddenNodes: false,
			padding: isSuccess ? 1.1 : 0.1,
		});
	}, [isSuccess]);

	return (
		<div className="m-0 h-[100vh] w-[100vw]">
			<ReactFlow
				nodeTypes={nodeTypes}
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
				snapToGrid={true}
				snapGrid={[5, 5]}
				onlyRenderVisibleElements={true}
				fitViewOptions={{
					includeHiddenNodes: false,
					padding: isSuccess ? 1.1 : 0.1,
				}}
			>
				<Path path="123/123/123" size={2} />
				<Background variant={BackgroundVariant.Dots} />
				<Controls />
			</ReactFlow>
			<ReactQueryDevtools initialIsOpen={false} />
		</div>
	);
}

export default App;
