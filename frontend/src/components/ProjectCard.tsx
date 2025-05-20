import { FaTrashCan } from "react-icons/fa6";
import { MdOutlineOpenInNew } from "react-icons/md";
import clsx from "clsx";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
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
	type MDXEditorMethods,
} from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor";
import { useReactFlow } from "@xyflow/react";
import type { CustomNodeType } from "..";
import { fetchClient, pfs } from "@/bootstrap";
import type { components } from "@/api";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import useProjects from "@/Providers/useProjects";

export default function ProjectCard({
	project,
}: {
	//HACK: Tehnically, by this point description cant be null.
	project: components["schemas"]["Project"] & {
		description: string;
		raw_description: string;
	};
}) {
	const { t } = useTranslation(["base", "md"]);
	const queryClient = useQueryClient();
	const { setCurrentProject, currentProject } = useProjects();
	const { deleteElements } = useReactFlow<CustomNodeType>();
	const description = useRef<MDXEditorMethods>(null);

	async function deleteCard(id: string) {
		const { error } = await fetchClient.DELETE("/api/projects/{project}", {
			params: {
				path: {
					project: id,
				},
			},
		});
		if (error) return;
		setCurrentProject("");
		await queryClient.invalidateQueries({ queryKey: ["get", "/api/projects"] });
	}

	function openProject(id: string) {
		setCurrentProject(id);
		deleteElements({
			nodes: [{ id: "projects" }],
		});
	}

	const { Field } = useForm({
		defaultValues: project,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				await pfs.writeFile(project.raw_description, value.description);
				const { error } = await fetchClient.PUT("/api/projects/{project}", {
					params: {
						path: {
							project: value.id,
						},
					},
					credentials: "include",
					body: { ...value, description: project.description },
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
				currentProject && "border-8 border-double",
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
					title={t("projects-card.open")}
				>
					<MdOutlineOpenInNew size={20} />
				</button>
				<button
					className="nodrag btn btn-outline btn-error"
					onClick={() => deleteCard(project.id)}
					title={t("projects-card.delete")}
				>
					<FaTrashCan />
				</button>
			</div>
			<div className="collapse-arrow collapse shadow">
				<input type="checkbox" />
				<div className="collapse-title font-semibold">
					{t("projects-card.description")}
				</div>
				<div className="collapse-content shadow">
					<Field
						name="description"
						asyncDebounceMs={1000}
						// listeners={{
						// onChange: ({ value }) => {

						// },
						// onMount: ({value}) => {
						// 	description.current?.setMarkdown(value as string);
						// },
						// }}
						children={(field) => (
							<MDXEditor
								ref={description}
								className="nodrag"
								contentEditableClassName="prose"
								onBlur={field.handleBlur}
								markdown={field.state.value}
								onChange={(e, init) => !init && field.handleChange(e)}
								translation={(key, defaultValue, interpolations) => {
									return t(key, defaultValue, { ns: "md", ...interpolations });
								}}
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
