import { Panel } from "@xyflow/react";
import type { PanelPosition } from "@xyflow/react";
import { LuStepBack } from "react-icons/lu";

export type CloseProjectProps = {
	position: PanelPosition;
};

export default function CloseProject({ position }: CloseProjectProps){
    return <Panel position={position}>
        <button className="btn"><LuStepBack /></button>
    </Panel>;
}