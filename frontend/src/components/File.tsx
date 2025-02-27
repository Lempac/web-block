// import { useForm } from "@tanstack/react-form";
import type { Node, NodeProps } from "@xyflow/react";

export type FileNode = Node<{ title: string, content: string }, "file">;

export default function File({ data }: NodeProps<FileNode>) {
	// const { Field } = useForm({
	// 	defaultValues: {...data},
	// });

	return (
		<div className="card gap-2 bg-base-300 p-2 shadow">
			<div className="collapse-arrow collapse bg-base-100">
				<input type="checkbox" className="nodrag" />
				<h1 className="nodrag collapse-title rounded-box border-base-100 bg-base-200 text-xl font-medium shadow">
					{data.title}
				</h1>
				<div className="collapse-content max-w-60 bg-base-100 text-wrap">
					{data.content}
				</div>
			</div>
		</div>
	);
}
