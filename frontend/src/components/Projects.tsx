import { useReactFlow } from "@xyflow/react";
import type { Node } from "@xyflow/react";
import { FaGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { ProjectCard } from "@/components/ProjectCard.tsx";
import { Project } from "@/index";
import clsx from "clsx";
import { IoIosAdd, IoMdSearch } from "react-icons/io";
import { useRoute } from "ziggy-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback, useState } from "react";

export type ProjectsNode = Node<Record<never, never>, "projects">;

export default function Projects() {
	const route = useRoute();
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const { getNode, getNodes, getEdge, addNodes, addEdges, deleteElements } = useReactFlow();
	const { data: repos } = useQuery<AxiosResponse<string[], AxiosError>>({
		queryKey: ["repos"],
		queryFn: async () => await axios.get(route("user.repos")),
	});
	
	const { mutateAsync : createProject, isPending: isCreating } = useMutation({
		mutationFn: async (name: string) =>
			await axios.post(route("projects.store"), {
				name: name,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			setSearch("");
		},
	});

	// const createProject = useMutation<string, AxiosError>(route("projects.store"), {
	// 	onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
	// })

	// async function createProject(name: string) {
	// 	await axios
	// 		.post<
	// 			AxiosResponse<string>,
	// 			AxiosError<{
	// 				message: string;
	// 				errors: Record<string, string[]>;
	// 			}>
	// 		>(route("projects.store"), {
	// 			name,
	// 		})
	// 		.catch((err) => console.log(err));
	// 	await queryClient.invalidateQueries({ queryKey: ["projects"] });
	// }

	// const newProject = useForm<Omit<Project, "id">>({
	// 	defaultValues: {
	// 		name: "New project",
	// 		description: "Project with ideas",
	// 		visibility: VisibilityType.Private,
	// 	},
	// 	validators: {
	// 		onSubmitAsync: async ({ value }) => {
	// 			const res = await axios.post(route("projects.store"), value).catch(
	// 				(
	// 					err: AxiosError<{
	// 						message: string;
	// 						errors: Record<string, string[]>;
	// 					}>,
	// 				) => err,
	// 			);

	// 			if (axios.isAxiosError(res) && res.response) {
	// 				return { fields: res.response.data.errors };
	// 			}

	// 			await queryClient.invalidateQueries({ queryKey: ["projects"] });

	// 			return null;
	// 		},
	// 	},
	// });

	const filteredRepos = useCallback(
		() =>
			repos?.data
				.filter((repo) => repo.toLowerCase().includes(search.toLowerCase()))
				.map((repo, i) => (
					<li key={i}>
						<button
							className="btn"
							onClick={() => createProject(repo)}
						>
							{repo}
						</button>
					</li>
				)),
		[createProject, repos?.data, search],
	);
	const { data: projects, isSuccess } = useQuery<
		AxiosResponse<Project[]>,
		AxiosError
	>({
		queryKey: ["projects"],
		queryFn: async () => await axios.get(route("projects.index")),
	});

	const filteredProjects = useCallback(
		() =>
			projects?.data
				.filter((project) =>
					project.name.toLowerCase().includes(search.toLowerCase()),
				)
				.map((project) => <ProjectCard project={project} key={project.id} />),
		[projects?.data, search],
	);
	const toggleSettings = () => {
		if (getNode("settings")) {
			deleteElements({
				nodes: getNodes()
					.filter((node) => ["settings", "profile", "theme"].includes(node.id)),
				edges: [getEdge("settings-projects")!],
			});
		} else {
			addNodes([
				{
					id: "settings",
					type: "settings",
					position: { x: 0, y: 0 },
					data: {},
				},
				{
					id: "profile",
					type: "profile",
					position: { x: 0, y: 0 },
					data: {},
					parentId: "settings",
					extent: "parent",
					expandParent: false,
				},
				{
					id: "theme",
					type: "theme",
					position: { x: 0, y: 0 },
					data: {},
					parentId: "settings",
					extent: "parent",
					expandParent: false,
				},
			]);
			addEdges({
				id: "settings-projects",
				source: "settings",
				target: "projects",
			});
		}
	};

	return (
		<div className="grid gap-2 rounded-box bg-base-300 p-4 shadow">
			<div className="navbar gap-2 rounded-box bg-base-200 p-4">
				<h1 className="flex-1 text-2xl font-bold">Projects</h1>
				<div className="flex gap-2">
					<div className="dropdown dropdown-start">
						<div className="join">
							<label tabIndex={0} className="input join-item">
								<IoMdSearch />
								<input
									className=""
									type="search"
									placeholder=""
									value={search}
									disabled={isCreating}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</label>
							<button
								className="btn join-item btn-success"
								onClick={() => createProject(search)}
							>
								<IoIosAdd size="1.5em" />
							</button>
						</div>
						<ul
							tabIndex={0}
							className="dropdown-content menu gap-0.5 rounded-box bg-base-100 p-2 shadow"
						>
							{filteredRepos()?.length === 0 ? (
								<p>No results found.</p>
							) : (
								filteredRepos()
							)}
						</ul>
					</div>
					<button
						className="nodrag btn btn-neutral"
						onClick={toggleSettings}
						title="Settings"
					>
						<FaGear />
					</button>
					<button
						className="nodrag btn btn-primary"
						onClick={async () => {
							await axios.post(route("logout"));
							await queryClient.resetQueries({ queryKey: ["user"] });
						}}
						title="Logout"
					>
						<FaSignOutAlt />
					</button>
				</div>
			</div>
			<div
				className={clsx(
					"grid min-w-max items-start gap-2 rounded-box bg-base-200 p-4",
					projects && projects.data.length == 2 && "grid-cols-2",
					projects && projects.data.length >= 3 && "grid-cols-3",
				)}
			>
				{isSuccess && filteredProjects()?.length === 0 ? (
					<p>No results found.</p>
				) : (
					filteredProjects()
				)}
				{/* <form
					className="card gap-2 border-2 border-dashed p-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						newProject.handleSubmit();
					}}
				>
					<div className="card-title flex-row">
						<newProject.Field
							name="name"
							children={(field) => (
								<input
									type="text"
									name={field.name}
									onBlur={field.handleBlur}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									className={clsx(
										"nodrag  input",
										field.state.meta.errors.length !== 0 && "input-error",
									)}
								/>
							)}
						/>
						{newProject.state.errors}
						<newProject.Field
							name="visibility"
							children={(field) => (
								<button
									className={clsx(
										"nodrag btn btn-info",
										field.state.value === VisibilityType.Private &&
											"border-2 btn-outline",
									)}
									onClick={() =>
										field.setValue(
											field.state.value === VisibilityType.Private
												? VisibilityType.Public
												: VisibilityType.Private,
										)
									}
								>
									{field.state.value == VisibilityType.Public ? (
										<MdVisibility />
									) : (
										<MdVisibilityOff />
									)}
								</button>
							)}
						/>
						<newProject.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<button
									type="submit"
									className="nodrag btn px-2 btn-outline btn-success"
									disabled={!canSubmit || isSubmitting}
									title="Create project"
								>
									<IoIosAdd size="2em" />
								</button>
							)}
						/>
					</div>
					<newProject.Field
						name="description"
						children={(field) => (
							<textarea
								className="nodrag textarea-bordered textarea"
								defaultValue={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
						)}
					/>
				</form> */}
			</div>
			{/* <Handle
				type="target"
				position={Position.Left}
				className="p-1 transition-[padding] hover:p-2"
			/> */}
		</div>
	);
}
