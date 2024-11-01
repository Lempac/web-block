import {usePage} from "@inertiajs/react";
import '@xyflow/react/dist/style.css';
import {
    addEdge,
    Background,
    BackgroundVariant, Connection,
    Controls,
    Edge,
    Node,
    ReactFlow,
    useEdgesState,
    useNodesState, useReactFlow
} from "@xyflow/react";
import {useCallback, useEffect, useMemo} from "react";
import {Auth} from "@/Components/Auth";
import {router} from '@inertiajs/react'
import {Projects} from "@/Components/Projects";
import {Github} from "@/Components/Github";
import {Welcome} from "@/Components/Welcome";
import {Settings} from "@/Components/Settings";

export default function Dashboard() {
    // const handleBodyMove = (event: MouseEvent) => {
    //     if (!event.altKey) return;
    //     setPosition({x: event.screenX, y: event.screenY})
    //     document.body.style.transform = `translate(${position.x}px, ${position.y}px)`;
    //     console.log(document.body.style.transform)
    // }
    //
    // useEffect(() => {
    //     document.body.addEventListener('pointermove', handleBodyMove)
    //
    //     return () => {
    //         document.body.removeEventListener('pointermove', handleBodyMove)
    //     }
    // })

    // const [position, setPosition] = useState({x: 0, y: 0})
    const props = usePage().props
    const reactFlowInstance = useReactFlow();
    const position = {x: 0, y: 0};
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (props.user) {
            reactFlowInstance.setNodes([{
                id: 'projects',
                type: 'projects',
                position: {x: 0, y: 0},
                data: {projects: props.projects}
            }]);
        } else {
            reactFlowInstance.setNodes([
                {id: 'auth', type: 'auth', position: position, data: {}},
                {id: 'github', type: 'github', position: {x: position.x - 50, y: position.y - 150}, data: {}},
                {id: 'welcome', type: 'welcome', position: {x: position.x + 170, y: position.y - 210}, data: {}}
            ]);
            reactFlowInstance.setEdges([
                {
                    id: 'github-auth',
                    source: 'github',
                    target: 'auth'
                },
                {
                    id: 'welcome-auth',
                    source: 'welcome',
                    target: 'auth'
                }]);
        }
    }, [props.user])

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );
    const nodeTypes = useMemo(() => ({
        auth: Auth,
        projects: Projects,
        github: Github,
        welcome: Welcome,
        settings: Settings
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
    </div>;
};
