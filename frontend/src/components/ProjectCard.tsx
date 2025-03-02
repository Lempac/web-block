import { FaTrashCan } from "react-icons/fa6";
import clsx from "clsx";
import { Project } from "@/index";
import { useRoute } from "ziggy-js";
import { useForm } from "@tanstack/react-form";
import axios, { AxiosError } from "axios";
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

export function ProjectCard({ project }: { project: Project }) {
	const route = useRoute();
	const queryClient = useQueryClient();
	// const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	// const [value, setValue] = useState<string>();

	// const textAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
	// 	setValue(event.target.value);
	// };

	// useEffect(() => {
	// 	if (textareaRef && textareaRef.current) {
	// 		textareaRef.current.style.height = "0px";
	// 		const scrollHeight = textareaRef.current.scrollHeight;
	// 		textareaRef.current.style.height = scrollHeight + "px";
	// 	}
	// }, [value]);

	async function deleteCard(id: number) {
		await axios.delete(route("projects.destroy", { project: id }));
		await queryClient.invalidateQueries({ queryKey: ["projects"] });
	}

	const { Field } = useForm({
		defaultValues: project,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				const res = await axios
					.patch(route("projects.update", { id: value.id! }), value)
					.catch(
						(
							err: AxiosError<{
								message: string;
								errors: Record<string, string[]>;
							}>,
						) => err,
					);

				if (axios.isAxiosError(res) && res.response) {
					return { fields: res.response.data.errors };
				}

				await queryClient.invalidateQueries({ queryKey: ["projects"] });

				return null;
			},
		},
	});

	return (
		<div className="grid flex-none content-start gap-2 rounded-box border-2 border-base-300 p-4 shadow">
			<div className="flex gap-2">
				<Field
					name="name"
					children={(field) => (
						<input
							type="text"
							className={clsx(
								"nodrag input",
								field.state.meta.errors.length !== 0 && "input-error",
							)}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					)}
				/>
				{/* <form.Field
					name="visibility"
					children={(field) => (
						<button
							className={clsx(
								"nodrag btn btn-info",
								field.state.value === ProjectVisibility.PRIVATE &&
									"border-2 btn-outline",
							)}
							onClick={() =>
								field.state.value === VisibilityType.Private
									? field.setValue(VisibilityType.Public)
									: field.setValue(VisibilityType.Private)
							}
						>
							{field.state.value == VisibilityType.Public ? (
								<MdVisibility />
							) : (
								<MdVisibilityOff />
							)}
						</button>
					)}
				/> */}
				<button
					className="nodrag btn btn-outline btn-error"
					onClick={() => deleteCard(project.id)}
				>
					<FaTrashCan />
				</button>
			</div>
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
										<BlockTypeSelect/>
										<CreateLink />
										<CodeToggle/>
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
					// <textarea
					// 	ref={textareaRef}
					// 	className="nodrag textarea-bordered textarea resize-none overflow-hidden flex-none"
					// 	value={field.state.value ?? ""}
					// 	onBlur={field.handleBlur}
					// 	onChange={(e) => {
					// 		field.handleChange(e.target.value);
					// 		textAreaChange(e);
					// 	}}
					// 	placeholder=""
					// />
				)}
			/>
		</div>
	);
}
