import {Button, Input, Textarea} from "@headlessui/react";
import {useEffect, useState} from "react";
import {MdVisibility, MdVisibilityOff} from "react-icons/md";
import {FaTrashCan} from "react-icons/fa6";
import {Project, VisibilityType} from "@/types";
import clsx from "clsx";
import axios from "axios";

export function ProjectCard({project}: { project: Project }) {
    const [values, setValues] = useState({
        name: project.name,
        description: project.description,
        visibility: project.visibility
    });

    useEffect(() => {
        if (project.name === values.name ||
            project.visibility === values.visibility ||
            project.description === values.description) return;
        const delay = 500;
        const handler = setTimeout(() => {
            axios.patch(route('projects.update', {project: project.id}), values);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [values]);

    return <div className="card border p-4 gap-2">
        <div className="flex-row card-title">
            <Input className="nodrag input input-bordered" defaultValue={values.name}/>
            <Button
                className={clsx('nodrag btn btn-info', values.visibility == VisibilityType.Private && "btn-outline border-2")}
                onClick={() => setValues({
                    ...values,
                    visibility: values.visibility == VisibilityType.Private ? VisibilityType.Public : VisibilityType.Private
                })}>
                {values.visibility == VisibilityType.Public ? <MdVisibility/> : <MdVisibilityOff/>}
            </Button>
            <Button className="nodrag btn btn-error btn-outline"><FaTrashCan/></Button>
        </div>
        <Textarea className="nodrag textarea textarea-bordered" defaultValue={values.description}/>
    </div>;
}
