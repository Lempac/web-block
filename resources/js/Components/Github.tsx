import {Handle, Position} from "@xyflow/react";
import {FaGithub} from "react-icons/fa6";
import {Link} from "@inertiajs/react";

export function Github() {
    return <div className="card bg-base-300 p-4">
        <a className="btn" type="button" href={route('auth.redirect')} title="Register/Login with Github!">
            <FaGithub/>Github
        </a>
        <Handle type={"source"} position={Position.Bottom} className="p-1 hover:p-2 transition-[padding]"/>
    </div>;
}
