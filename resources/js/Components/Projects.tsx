import {Button, Input, Textarea} from "@headlessui/react";
import {router} from "@inertiajs/react";
import {Handle, Position, useReactFlow} from "@xyflow/react";
import {FaGear, FaTrashCan} from "react-icons/fa6";
import {FaSignOutAlt} from "react-icons/fa";
import {ProjectCard} from "@/Components/ProjectCard";
import {Project, VisibilityType} from '@/types';
import {useEffect, useMemo, useState} from "react";
import clsx from "clsx";
import {MdVisibility, MdVisibilityOff} from "react-icons/md";
import {IoIosAdd} from "react-icons/io";
import axios from "axios";

export function Projects() {
    const [newProject, setNewProject] = useState({
        name: "New project",
        description: "Project with ideas",
        visibility: VisibilityType.Private
    });
    const [projects, setProjects] = useState<Project[] | null>();
    const reactFlowInstance = useReactFlow();
    useEffect(() => {
        axios.get(route('projects.index')).then(response => {
            setProjects(response.data);
        })
    }, []);

    const toggleSettings = () => {
        if (reactFlowInstance.getNode('settings')) {
            reactFlowInstance.setNodes(reactFlowInstance.getNodes().filter(node => node.id !== 'settings'))
            reactFlowInstance.setEdges(reactFlowInstance.getEdges().filter(edge => edge.id !== 'settings-projects'))
        } else {
            reactFlowInstance.addNodes({id: 'settings', type: 'settings', position: {x: 0, y: 0}, data: {}})
            reactFlowInstance.addEdges({id: 'settings-projects', source: 'settings', target: 'projects'})
        }
    }

    return <div className="card bg-base-content p-4 gap-2">
        <div className="navbar p-4 bg-base-100 rounded-xl">
            <h1 className="navbar-start text-2xl font-bold pl-4">Projects</h1>
            <div className="navbar-end gap-2 ml-2">
                <Button className="nodrag btn" onClick={toggleSettings} title="Settings"><FaGear/></Button>
                <Button className="nodrag btn btn-info" onClick={() => router.post(route('logout'))}
                        title="Logout"><FaSignOutAlt/></Button>
            </div>
        </div>
        <div
            className={clsx("card p-4 bg-base-100 gap-2 grid grid-flow-row grid-cols-2", projects && projects?.length > 1 && 'xl:grid-cols-3')}>
            {
                projects?.map(project => (
                    <ProjectCard project={project} key={project.id}/>
                ))
            }

            <div className="card border-2 border-dashed p-4 gap-2">
                <div className="flex-row card-title">
                    <Input className="nodrag input input-bordered" defaultValue={newProject.name}/>
                    <Button
                        className={clsx('nodrag btn btn-info', newProject.visibility == VisibilityType.Private && "btn-outline border-2")}
                        onClick={() => setNewProject({
                            ...newProject,
                            visibility: newProject.visibility == VisibilityType.Private ? VisibilityType.Public : VisibilityType.Private
                        })}>
                        {newProject.visibility == VisibilityType.Public ? <MdVisibility/> : <MdVisibilityOff/>}
                    </Button>
                    <Button onClick={() => axios.postForm(route('projects.create'))}
                            className="nodrag btn btn-success btn-outline px-2" title="Create project"><IoIosAdd
                        size="2em"/></Button>
                </div>
                <Textarea className="nodrag textarea textarea-bordered" defaultValue={newProject.description}/>
            </div>
        </div>
        <Handle type={"target"} position={Position.Left} className="p-1 hover:p-2 transition-[padding]"/>
    </div>;
}
