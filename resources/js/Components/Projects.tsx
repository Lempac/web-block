import {Button} from "@headlessui/react";
import {router} from "@inertiajs/react";
import {Handle, Position} from "@xyflow/react";
import {FaGear} from "react-icons/fa6";
import {FaSignOutAlt} from "react-icons/fa";
import {ProjectCard} from "@/Components/ProjectCard";

export function Projects()  {
    return <div className="card bg-base-content p-4 gap-2">
        <div className="navbar p-4 bg-base-100 rounded-xl">
            <h1 className="navbar-start text-2xl font-bold pl-4">Projects</h1>
            <div className="navbar-end gap-2 ml-2">
                <Button className="nodrag btn" title="Settings"><FaGear/></Button>
                <Button className="nodrag btn btn-info" onClick={() => router.post(route('logout'))} title="Logout"><FaSignOutAlt/></Button>
            </div>
        </div>
        <div className="card p-4 bg-base-100 gap-2 grid xl:grid-cols-3 md:grid-cols-2">
            <ProjectCard/>
            <ProjectCard/>
            <ProjectCard/>
            <ProjectCard/>
        </div>
        <Handle type={"target"} position={Position.Left} className="p-1 hover:p-2 transition-[padding]"/>
    </div>;
}
