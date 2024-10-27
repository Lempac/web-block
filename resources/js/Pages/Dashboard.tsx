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
import { router } from '@inertiajs/react'
import {Projects} from "@/Components/Projects";
import {Github} from "@/Components/Github";
import {Welcome} from "@/Components/Welcome";

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
    const {auth} = usePage().props
    const reactFlowInstance = useReactFlow();
    const position = {x: 0, y: 0};
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if(auth.user){
            reactFlowInstance.setNodes([{id: '1', type: 'projects', position: {x: 0, y: 0}, data: {}}]);
        } else {
            reactFlowInstance.setNodes([
                {id: '2', type: 'auth', position: position, data: {}},
                {id: '3', type: 'github', position: {x: position.x - 50, y: position.y - 150}, data: {}},
                {id: '4', type: 'welcome', position: {x: position.x + 170, y: position.y - 210}, data: {}}
            ]);
            reactFlowInstance.setEdges([{id: 'e3-2', source: '3', target: '2'}, {id: 'e4-2', source: '4', target: '2'}]);
        }
    }, [auth.user])

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );
    const nodeTypes = useMemo(() => ({auth: Auth, projects: Projects, github: Github, welcome: Welcome}), []);

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
