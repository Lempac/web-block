import {Button, Input, Textarea} from "@headlessui/react";
import {useState} from "react";
import {MdVisibility, MdVisibilityOff} from "react-icons/md";
import {FaTrashCan} from "react-icons/fa6";
import {Project, VisibilityType} from "@/types";
import clsx from "clsx";

export function ProjectCard() {
    const [values, setValues] = useState<Project>({
        name: "New Project",
        description: "Project with ideas",
        visibility: VisibilityType.Private
    });

    return <div className="card bg-base-content p-4 gap-2">
        <div className="flex-row card-title">
            <Input className="nodrag input" defaultValue={values.name}/>
            <Button className={clsx('nodrag btn btn-info', values.visibility == VisibilityType.Private && "btn-outline border-2 bg-base-200")}
                    onClick={() => setValues({...values, visibility: values.visibility == VisibilityType.Private ? VisibilityType.Public : VisibilityType.Private})}>
                {values.visibility == VisibilityType.Public ? <MdVisibility/> : <MdVisibilityOff/>}
            </Button>
            <Button className="nodrag btn btn-error"><FaTrashCan/></Button>
        </div>
        <Textarea className="nodrag textarea card-body" defaultValue={values.description}/>
    </div>;
}
