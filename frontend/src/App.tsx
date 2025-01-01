import {useCallback, useEffect, useMemo} from 'react';
import {
    addEdge, Background, BackgroundVariant, Connection, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow
} from "@xyflow/react";
import {Auth} from "@/components/Auth.tsx";
import {Projects} from "@/components/Projects.tsx";
import {Github} from "@/components/Github.tsx";
import {Welcome} from "@/components/Welcome.tsx";
import {Settings} from "@/components/Settings";
import {User} from "@/index";
import {useQuery} from "@tanstack/react-query";
import {useRoute} from "ziggy-js";
import axios, {AxiosError, AxiosResponse} from "axios";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import Profile from '@/components/Settings/Profile';
import Theme from '@/components/Settings/Theme';
function App() {
    const route = useRoute();
    const reactFlowInstance = useReactFlow();
    const [nodes, , onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const {data: user, error } = useQuery<AxiosResponse<User>, AxiosError>({
        queryKey: ["user"],
        queryFn: async () => axios.get(route("user")),
        retry: 1,
        refetchInterval: 2 * 1000 * 60,
    });

    useEffect(() => {
        const position = {x: 0, y: 0};
        if (error === null && user?.data?.id && !reactFlowInstance.getNode('projects')) {
            reactFlowInstance.setNodes([{
                id: 'projects', type: 'projects', position: {x: 0, y: 0}, data: {}
            }]);
        } else {
            reactFlowInstance.setNodes([{id: 'auth', type: 'auth', position: position, data: {}}, {
                id: 'github', type: 'github', position: {x: position.x - 50, y: position.y - 150}, data: {}
            }, {id: 'welcome', type: 'welcome', position: {x: position.x + 170, y: position.y - 210}, data: {}}]);
            reactFlowInstance.setEdges([{
                id: 'github-auth', source: 'github', target: 'auth'
            }, {
                id: 'welcome-auth', source: 'welcome', target: 'auth'
            }]);
        }
    }, [user?.data, error]);

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const nodeTypes = useMemo(() => ({
        auth: Auth, projects: Projects, github: Github, welcome: Welcome, settings: Settings, profile: Profile, theme: Theme
    }), []);

    return <div style={{height: '100vh', width: '100vw', margin: 0}}>
        <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <Background variant={BackgroundVariant.Dots}/>
            <Controls/>
        </ReactFlow>
        <ReactQueryDevtools initialIsOpen={false} />
    </div>;
}

export default App
