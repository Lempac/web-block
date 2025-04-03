import { FaTrashCan } from "react-icons/fa6";
import { MdOutlineOpenInNew } from "react-icons/md";
import clsx from "clsx";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
// import { useEffect, useRef, useState } from "react";
// import Editor from "@monaco-editor/react";
import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	codeBlockPlugin,
	CodeToggle,
	CreateLink,
	linkPlugin,
	listsPlugin,
	MDXEditor,
	quotePlugin,
	toolbarPlugin,
	UndoRedo,
} from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor";
import { useReactFlow } from "@xyflow/react";
import { CustomNodeType } from "@/bootstrap";
import { fetchClient } from "@/bootstrap";
import { components } from "@/api";

export default function ProjectCard({
	project,
	currentProject,
}: {
	project: components["schemas"]["Project"];
	currentProject: { value: boolean; set: (v: number) => void };
}) {
	const queryClient = useQueryClient();
	const { deleteElements } = useReactFlow<CustomNodeType>();

	async function deleteCard(id: number) {
		await fetchClient.DELETE("/api/projects/{project}", {
			params: {
				path: {
					project: id,
				},
			},
		});
		await queryClient.invalidateQueries({ queryKey: ["get", "/api/projects"] });
	}

	function openProject(id: number) {
		currentProject.set(id);
		deleteElements({
			nodes: [{ id: "projects" }],
		});
	}

	const { Field } = useForm({
		defaultValues: project,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				const { error } = await fetchClient.PUT("/api/projects/{project}", {
					params: {
						path: {
							project: value.id,
						},
					},
					credentials: "include",
					body: { name: value.name, description: value.description },
				});
				if (error) return { fields: error.errors };

				await queryClient.invalidateQueries({
					queryKey: ["get", "/api/projects"],
				});

				return null;
			},
		},
	});

	return (
		<div
			className={clsx(
				"grid flex-none content-start gap-2 rounded-box border-2 border-base-300 p-4 shadow",
				currentProject.value && "border-8 border-double",
			)}
		>
			<div className="flex gap-2">
				<Field
					name="name"
					children={(field) => (
						<input
							type="text"
							className={clsx(
								"nodrag input grow",
								field.state.meta.errors.length !== 0 && "input-error",
							)}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					)}
				/>
				<button
					className="nodrag btn btn-outline btn-success"
					onClick={() => openProject(project.id)}
					title="Open project"
				>
					<MdOutlineOpenInNew size={20} />
				</button>
				<button
					className="nodrag btn btn-outline btn-error"
					onClick={() => deleteCard(project.id)}
					title="Delete project"
				>
					<FaTrashCan />
				</button>
			</div>
			<div className="collapse-arrow collapse shadow">
				<input type="checkbox" />
				<div className="collapse-title font-semibold">Description</div>
				<div className="collapse-content shadow">
					<Field
						name="description"
						asyncDebounceMs={1000}
						children={(field) => (
							// <Editor height="90vh" onChange={(e) => field.handleChange(e ?? "")} defaultLanguage="markdown" defaultValue={field.state.value ?? "// some comment"} />
							<MDXEditor
								className="nodrag"
								contentEditableClassName="prose"
								onBlur={field.handleBlur}
								onChange={(e, init) => !init && field.handleChange(e)}
								markdown={field.state.value ?? "# some comment"}
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
							/>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
