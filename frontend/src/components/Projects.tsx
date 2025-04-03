import { useReactFlow } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { FaGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import ProjectCard from "@/components/ProjectCard.tsx";
import clsx from "clsx";
import { IoIosAdd, IoMdSearch } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { CustomNodeType } from "@/bootstrap";
import { $api, fetchClient } from "@/bootstrap";

export type ProjectProps = {
	currentProject: number;
	setCurrentProject: (v: number) => void;
};
export type ProjectsNode = Node<ProjectProps, "projects">;

export default function Projects({ data }: NodeProps<ProjectsNode>) {
	const { currentProject, setCurrentProject } = data;
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const { getNode, addNodes, deleteElements } =
		useReactFlow<CustomNodeType>();

	const { data: repos } = $api.useQuery("get", "/api/user/repos");
	const { mutateAsync: createProject, isPending: isCreating } =
		$api.useMutation("post", "/api/projects", {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["get", "/api/projects"] });
				setSearch("");
			},
		});

	const filteredRepos = useCallback(
		() =>
			repos
				?.filter((repo) => repo.toLowerCase().includes(search.toLowerCase()))
				.map((repo, i) => (
					<li key={i}>
						<button
							className="btn"
							onClick={() => createProject({ body: { nameOrUrl: repo } })}
							disabled={isCreating}
						>
							{repo}
						</button>
					</li>
				)),
		[createProject, isCreating, repos, search],
	);
	const { data: projects, isSuccess } = $api.useQuery("get", "/api/projects");
	const filteredProjects = useCallback(
		() =>
			projects
				?.filter((project) =>
					project.name.toLowerCase().includes(search.toLowerCase()),
				)
				.map((project) => (
					<ProjectCard
						project={project}
						key={project.id}
						currentProject={{
							value: currentProject === project.id,
							set: setCurrentProject,
						}}
					/>
				)),
		[currentProject, projects, search, setCurrentProject],
	);
	const toggleSettings = () => {
		if (getNode("settings")) {
			deleteElements({
				nodes: [{ id: "settings" }, { id: "profile" }, { id: "theme" }],
			})
		} else {
			//TODO: add settings resizing
			addNodes({
				id: "settings",
				type: "settings",
				position: { x: 0, y: 0 },
				data: {},
			});
		}
	};
	const filRepoLen = filteredRepos()?.length;
	return (
		<div className="grid gap-2 rounded-box bg-base-300 p-4 shadow ring-neutral in-[.selected]:ring-4">
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
									placeholder="Search for repo"
									value={search}
									disabled={isCreating}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</label>
							<button
								className="btn join-item btn-success"
								onClick={() => createProject({ body: { nameOrUrl: search } })}
							>
								<IoIosAdd size="1.5em" />
							</button>
						</div>
						<ul
							tabIndex={0}
							className={clsx(
								"nowheel nodarg dropdown-content menu flex-nowrap gap-0.5 overflow-y-scroll rounded-box bg-base-100 p-2 shadow sm:h-32 md:h-64",
								filRepoLen && filRepoLen < 6 && "h-auto!",
							)}
						>
							{filRepoLen === 0 ? <p>No results found.</p> : filteredRepos()}
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
							await fetchClient.DELETE("/logout");
							await queryClient.resetQueries({
								queryKey: ["get", "/api/user"],
							});
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
					projects && projects.length == 2 && "grid-cols-2",
					projects && projects.length >= 3 && "grid-cols-3",
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
