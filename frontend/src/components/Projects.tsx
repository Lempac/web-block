import { useReactFlow } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { FaGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import ProjectCard from "@/components/ProjectCard.tsx";
import clsx from "clsx";
import { IoIosAdd, IoMdSearch } from "react-icons/io";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type CustomNodeType } from "@/index";
import { $api, fetchClient, fs } from "@/bootstrap";
import { useTranslation } from "react-i18next";
import useProjects from "@/Providers/useProjects";
import { useUser } from "@/Providers/useUser";
import { LuPackagePlus } from "react-icons/lu";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";

export type ProjectsNode = Node<Record<never, never>, "projects">;

export default function Projects({
	positionAbsoluteX,
	positionAbsoluteY,
}: NodeProps<ProjectsNode>) {
	const { projects, isLoading, isSuccess } = useProjects();
	const { isSuccess: gotUser, repos, settings, user } = useUser();
	const { t } = useTranslation();

	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const { getNode, addNodes, deleteElements } = useReactFlow<CustomNodeType>();

	const { mutateAsync: createProjectOnServer, isPending: isCreating } =
		$api.useMutation("post", "/api/projects");

	const toggleSettings = () => {
		if (getNode("settings")) {
			deleteElements({
				nodes: [{ id: "settings" }],
			});
		} else {
			//TODO: add settings resizing
			addNodes({
				id: "settings",
				type: "settings",
				position: {
					x: positionAbsoluteX - (settings.width + 200),
					y: positionAbsoluteY,
				},
				style: { width: settings.width, height: settings.height },
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
					onClick={() => createProject(repo)}
					disabled={isCreating}
				>
					{repo}
				</button>
			</li>
		));

	const { data: filteredProjects } = useQuery({
		queryKey: ["filteredProjects"],
		queryFn: async () =>
			projects
				.values()
				.filter((project) =>
					project.name.toLowerCase().includes(search.toLowerCase()),
				)
				.map((project) => project.id)
				.toArray(),
		enabled: isSuccess,
	});
	const filRepoLen = filteredRepos?.length;

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ["filteredProjects"] });
	}, [projects, queryClient])

	const createProject = async (nameOrUrl: string) => {
		if (filRepoLen === 0 || filRepoLen === undefined) {
			if (URL.canParse(nameOrUrl)) {
				await git.clone({
					fs,
					http,
					dir: `/${nameOrUrl
						.split("/")
						.filter((route) => route !== "")
						.at(-1)}`,
					corsProxy: import.meta.env.VITE_PROXY_URL,
					url: nameOrUrl,
				});
			} else {
				await git.init({
					fs,
					dir: `/${nameOrUrl}`,
					defaultBranch: user.settings.defaultBranch,
				});
				await git.commit({
					fs,
					dir: `/${nameOrUrl}`,
					message: "init",
					author: { name: user.name, email: user.email },
				});
			}
		} else {
			createProjectOnServer({ body: { nameOrUrl } });
		}
		setSearch("");
		await queryClient.invalidateQueries({ queryKey: ["getProjects"] });
		queryClient.invalidateQueries({ queryKey: ["get", "/api/projects"] });
	};

	return (
		<div className="grid gap-2 rounded-box bg-base-300 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<div className="navbar gap-2 rounded-box bg-base-200 p-4">
				<h1 className="navbar-start text-2xl font-bold">
					{t("projects.name")}
				</h1>
				<div className="navbar-end flex gap-2">
					<div className="dropdown dropdown-start">
						<div className="join">
							<label tabIndex={0} className="input join-item">
								<IoMdSearch />
								<input
									type="search"
									className="w-60"
									placeholder={t("projects.search-repo.placeholder")}
									value={search}
									disabled={isCreating}
									onChange={(e) => setSearch(e.target.value)}
									onKeyDown={(e) => {
										if(e.key === "Enter") createProject(search)}}
								/>
							</label>
							<button
								className="tooltip btn join-item btn-success"
								onClick={() => createProject(search)}
								data-tip={
									filRepoLen === 0 || filRepoLen === undefined
										? t("projects.search-repo.create")
										: t("projects.search-repo.add")
								}
							>
								{filRepoLen === 0 || filRepoLen === undefined ? (
									<LuPackagePlus size="1.5em" />
								) : (
									<IoIosAdd size="1.5em" />
								)}
							</button>
						</div>
						<ul
							tabIndex={0}
							className={clsx(
								"nowheel nodarg dropdown-content menu flex-nowrap gap-0.5 overflow-y-scroll rounded-box bg-base-100 p-2 shadow sm:h-32 md:h-64",
								(filRepoLen === undefined || filRepoLen < 6) && "h-auto!",
							)}
						>
							{filRepoLen === 0 || filRepoLen === undefined ? (
								<p>{t("projects.no-search")}</p>
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
					{gotUser && (
						<button
							className="nodrag btn btn-primary"
							onClick={async () => {
								await fetchClient.DELETE("/logout");
								await queryClient.invalidateQueries({
									queryKey: ["get", "/api/user"],
								});
								await queryClient.invalidateQueries({
									queryKey: ["get", "/api/user/repos"],
								});
								await queryClient.invalidateQueries({
									queryKey: ["get", "/api/projects"],
								});
							}}
							title={t("projects.logout")}
						>
							<FaSignOutAlt />
						</button>
					)}
				</div>
			</div>
			<div
				className={clsx(
					"grid min-w-max items-start gap-2 rounded-box bg-base-200 p-4",
					projects && projects.size == 2 && "grid-cols-2",
					projects && projects.size >= 3 && "grid-cols-3",
				)}
			>
				{filteredProjects === undefined || filteredProjects.length === 0 ? (
					<p>{t("projects.no-projects")}</p>
				) : (
					filteredProjects.map((project) => (
						<ProjectCard id={project} key={project} />
					))
				)}
			</div>
			{isLoading ? (
				<div className="animate-pulse rounded-box bg-base-200 p-4">
					<span className="loading loading-md animate-spin loading-infinity"></span>
					{t("loading")}
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
