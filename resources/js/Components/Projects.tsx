import {Button} from "@headlessui/react";
import {router} from "@inertiajs/react";
import {Handle, Position} from "@xyflow/react";
import {FaGear} from "react-icons/fa6";

export function Projects()  {
    return <div className="card bg-base-content p-4 flex-row gap-2">
        <Button className="nodrag btn" onClick={() => router.post(route('logout'))}>Logout</Button>
        <Button className="nodrag btn"><FaGear/></Button>
        <Handle type={"target"} position={Position.Top} className="p-1 hover:p-2 transition-[padding]"/>
    </div>;
};
