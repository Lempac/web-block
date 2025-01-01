import {Handle, Position} from "@xyflow/react";

export function Settings(){
    return <div className="card border-2 p-4 h-full grid content-between">
        <h2 className="border-2 card p-1 bg-gray-800 relative -top-8 max-w-fit">
            Settings
        </h2>
        <button className="btn">
            Save
        </button>
        <Handle type={"source"} position={Position.Right} className="p-1 hover:p-2 transition-[padding]"/>
    </div>;
}