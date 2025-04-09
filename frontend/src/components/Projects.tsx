import { useReactFlow } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { FaGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import ProjectCard from "@/components/ProjectCard.tsx";
import clsx from "clsx";
import { IoIosAdd, IoMdSearch } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type CustomNodeType } from "@/bootstrap";
import { $api, fetchClient } from "@/bootstrap";
import { useTranslation } from "react-i18next";

export type ProjectProps = {
	currentProject: number;
	setCurrentProject: (v: number) => void;
};
export type ProjectsNode = Node<ProjectProps, "projects">;

export default function Projects({ data }: NodeProps<ProjectsNode>) {
	const { t } = useTranslation();
	const { currentProject, setCurrentProject } = data;
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const { getNode, addNodes, deleteElements } = useReactFlow<CustomNodeType>();

	const { data: repos } = $api.useQuery("get", "/api/user/repos");
	const { mutateAsync: createProject, isPending: isCreating } =
		$api.useMutation("post", "/api/projects", {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["get", "/api/projects"] });
				setSearch("");
			},
		});
	const toggleSettings = () => {
		if (getNode("settings")) {
			deleteElements({
				nodes: [{ id: "settings" }, { id: "profile" }, { id: "theme" }],
			});
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
	const filteredRepos = repos
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
		));
	const { data: projects, isSuccess } = $api.useQuery("get", "/api/projects");
	const filteredProjects = projects
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
		));
	const filRepoLen = filteredRepos?.length;
	return (
		<div className="grid gap-2 rounded-box bg-base-300 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<div className="navbar gap-2 rounded-box bg-base-200 p-4">
				<h1 className="flex-1 text-2xl font-bold">{t("projects.name")}</h1>
				<div className="flex gap-2">
					<div className="dropdown dropdown-start">
						<div className="join">
							<label tabIndex={0} className="input join-item">
								<IoMdSearch />
								<input
									type="search"
									placeholder={t("projects.search-repo")}
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
								filRepoLen === undefined || (filRepoLen < 6 && "h-auto!"),
							)}
						>
							{filRepoLen === 0 ? (
								<p>{t("projects.no-projects")}</p>
							) : (
								filteredRepos
							)}
						</ul>
					</div>
					<button
						className="nodrag btn btn-neutral"
						onClick={toggleSettings}
						title={t("projects.settings")}
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
						title={t("projects.logout")}
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
				{isSuccess && filteredProjects?.length === 0 ? (
					<p>{t("projects.no-projects")}</p>
				) : (
					filteredProjects
				)}
			</div>
		</div>
	);
}
