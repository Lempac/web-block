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

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if(auth.user){
            reactFlowInstance.setNodes([{id: '1', type: 'projects', position: {x: 0, y: 0}, data: {}}]);
        } else {
            reactFlowInstance.setNodes([{id: '2', type: 'auth', position: {x: 0, y: 0}, data: {}}])
        }
    }, [auth.user])

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );
    const nodeTypes = useMemo(() => ({auth: Auth, projects: Projects}), []);

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
