import { FaTrashCan } from "react-icons/fa6";
import { MdOutlineOpenInNew } from "react-icons/md";
import clsx from "clsx";
import { useForm, useStore } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	codeBlockPlugin,
	CodeToggle,
	CreateLink,
	imagePlugin,
	InsertImage,
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
import { clearDirectory, fetchClient, pfs } from "@/bootstrap";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import useProjects from "@/Providers/useProjects";
import type { components } from "@/api";
import { useMediaQuery, useMouse } from "@uidotdev/usehooks";

export default function ProjectCard({ id }: { id: string }) {
	const isDark = useMediaQuery("(prefers-color-scheme: dark)");
	const { t } = useTranslation(["base", "md"]);
	const queryClient = useQueryClient();
	const [position] = useMouse();
	const { setCurrentProject, currentProject, projects } = useProjects();

	const { deleteElements, addNodes, screenToFlowPosition } =
		useReactFlow<CustomNodeType>();
	const description = useRef<MDXEditorMethods>(null);
	async function deleteCard(id: string) {
		await clearDirectory(`/${projects.get(id)?.name}`);
		await pfs.rmdir(`/${projects.get(id)?.name}`);
		projects.delete(id);
		if (currentProject === id) setCurrentProject("");
		queryClient.invalidateQueries({ queryKey: ["get", "/api/projects"] });
		queryClient.invalidateQueries({ queryKey: ["getProjects"] });
		queryClient.invalidateQueries({ queryKey: ["filteredProjects"] });
		fetchClient.DELETE("/api/projects/{project}", {
			params: {
				path: {
					project: id,
				},
			},
		});
	}

	function openProject(id: string) {
		setCurrentProject(id);
		deleteElements({
			nodes: [{ id: "projects" }],
		});
	}

	const { data: project, isSuccess } = useQuery({
		queryKey: ["project", id],
		queryFn: async () =>
			({
				...projects.get(id),
				description: await pfs.readFile(projects.get(id)!.description!, "utf8"),
			}) as components["schemas"]["Project"],
	});

	const { Field, store } = useForm({
		defaultValues: project,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				await pfs.writeFile(projects.get(id)!.description, value.description);
				if (projects.get(id)?.name !== value.name) {
					await pfs.rename(`/${projects.get(id)?.name}`, `/${value.name}`);
					projects.set(id, {
						...value,
						description: projects.get(id)?.description as string,
					});
				}
				queryClient.invalidateQueries({
					queryKey: ["get", "/api/projects"],
				});
				queryClient.invalidateQueries({
					queryKey: ["filteredProjects"],
				});
				queryClient.invalidateQueries({
					queryKey: ["getProjects"],
				});
				queryClient.invalidateQueries({
					queryKey: ["project", id],
				});
				fetchClient.PUT("/api/projects/{project}", {
					params: {
						path: {
							project: value.id,
						},
					},
					credentials: "include",
					body: {
						...value,
						description: projects.get(id)?.description as string,
					},
				});
				// if (error) return { fields: error.errors };
				// console.log(project, projects.get(id), value);
				return null;
			},
		},
	});

	const des = useStore(store, (state) => state.values.description);

	if (!isSuccess || !des || des === "") return <></>;

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
					onClick={() => openProject(id)}
					title={t("projects-card.open")}
				>
					<MdOutlineOpenInNew size={20} />
				</button>
				<button
					className="nodrag btn btn-outline btn-error"
					onClick={() =>
						addNodes({
							id: "deleteProject",
							type: "deleteProject",
							zIndex: 9999,
							data: { onConfirm: () => deleteCard(id) },
							position: screenToFlowPosition(position),
						})
					}
					title={t("projects-card.delete")}
				>
					<FaTrashCan />
				</button>
			</div>
			<div className="collapse-arrow collapse bg-base-300 shadow">
				<input type="checkbox" />
				<div className="collapse-title font-semibold">
					{t("projects-card.description")}
				</div>
				<div className="collapse-content shadow">
					<Field
						name="description"
						asyncDebounceMs={1000}
						children={(field) => (
							<MDXEditor
								ref={description}
								className={clsx("nodrag", isDark && "dark-theme")}
								contentEditableClassName="prose"
								onBlur={field.handleBlur}
								markdown={field.state.value}
								onChange={(e, init) => !init && field.handleChange(e)}
								translation={(key, defaultValue, interpolations) => {
									return t(key, defaultValue, {
										ns: "md",
										...interpolations,
									});
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
												<InsertImage />
											</>
										),
									}),
									headingsPlugin(),
									listsPlugin(),
									quotePlugin(),
									linkPlugin(),
									imagePlugin(),
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
