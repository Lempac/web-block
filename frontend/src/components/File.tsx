// import { useForm } from "@tanstack/react-form";
import type { Node, NodeProps } from "@xyflow/react";
import Editor from '@monaco-editor/react';
import Resize from "./Resize";
import { getLanguage } from "@/bootstrap";

export type FileNode = Node<{ title: string, content: string }, "file">;

export default function File({ data }: NodeProps<FileNode>) {
	// const { Field } = useForm({
	// 	defaultValues: {...data},
	// });
	const extension = data.title.split('.')[1];
	return (
		<div className="card gap-2 bg-base-300 p-2 shadow">
			<div className="collapse-arrow collapse bg-base-100">
				<input type="checkbox" className="nodrag" />
				<h1 className="nodrag collapse-title rounded-box border-base-100 bg-base-200 text-xl font-medium shadow">
					{data.title}
				</h1>
				<Editor className="nodrag" height={"200px"} defaultLanguage={getLanguage(extension ?? 'unkown')} defaultValue={data.content} />
				{/* <MDXEditor
						className="nodrag collapse-content bg-base-100"
						contentEditableClassName="prose"
						// onBlur={field.handleBlur}
						// onChange={(e, init) => !init && field.handleChange(e)}
						markdown={data.content ?? "# some comment"}
						plugins={[
							toolbarPlugin({
								toolbarContents: () => (
									<>
										<UndoRedo />
										<BoldItalicUnderlineToggles />
										<BlockTypeSelect />
										<CreateLink />
										<CodeToggle />
									</>
								),
							}),
							headingsPlugin(),
							listsPlugin(),
							quotePlugin(),
							linkPlugin(),
							codeBlockPlugin({ defaultCodeBlockLanguage: "markdown" }),
						]}
					/> */}
			</div>
			<Resize/>
		</div>
	);
}
