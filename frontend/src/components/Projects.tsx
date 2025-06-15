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
import {
	$api,
	clearDirectory,
	fetchClient,
	fs,
	gitAddAll,
	pfs,
} from "@/bootstrap";
import { useTranslation } from "react-i18next";
import useProjects from "@/Providers/useProjects";
import { useUser } from "@/Providers/useUser";
import { LuPackagePlus } from "react-icons/lu";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import dedent from "dedent";
export type ProjectsNode = Node<Record<never, never>, "projects">;
export const UPLOAD_LIMT = 50000;
export default function Projects({
	positionAbsoluteX,
	positionAbsoluteY,
}: NodeProps<ProjectsNode>) {
	const { projects, isLoading, isSuccess, setCurrentProject } = useProjects();
	const { isSuccess: gotUser, repos, settings, user } = useUser();
	const { t } = useTranslation();

	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const { getNode, addNodes, deleteElements } = useReactFlow<CustomNodeType>();
	const [isCreating, setIsCreating] = useState(false);

	const { mutateAsync: createProjectOnServer, isPending: isCreatingOnServer } =
		$api.useMutation("post", "/api/projects");

	const toggleSettings = () => {
		if (getNode("settings")) {
			deleteElements({
				nodes: [{ id: "settings" }],
			});
		} else {
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
	const filteredRepos = Object.entries(repos ?? {})
		.filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
		.map(([name, size], i) => (
			<li key={i}>
				<button
					className="btn"
					onClick={() => createProject(name, size)}
					disabled={isCreating || isCreatingOnServer}
				>
					{name}
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
	}, [projects, queryClient]);

	const createProject = async (nameOrUrl: string, size?: number) => {
		if (isCreating) return;
		setIsCreating(true);
		(async () => {
			try {
				if ((await pfs.lstat(`/${nameOrUrl}`)).isDirectory()) return;
			} catch {
				/* empty */
			}
			if (size === undefined || size < UPLOAD_LIMT) {
				let data = undefined;
				if (size !== undefined) {
					const { data: url, error } = await fetchClient.GET(
						"/api/user/repo/{name}",
						{
							params: {
								path: {
									name: nameOrUrl,
								},
							},
						},
					);
					if (error) return;
					data = url;
				}
				if (URL.canParse(nameOrUrl) || size !== undefined) {
					try {
						const dir = `/${nameOrUrl
							.split("/")
							.filter((route) => route !== "")
							.at(-1)}`;
						await pfs.mkdir(dir);
						await git.clone({
							fs,
							http,
							dir: dir,
							corsProxy: import.meta.env.VITE_PROXY_URL,
							url:
								size !== undefined && data !== undefined
									? (data as string)
									: nameOrUrl,
						});
						try {
							await pfs.lstat(`/${dir}/.gitignore`);
						} catch {
							await pfs.writeFile(`/${dir}/.gitignore`, "");
						}
						await pfs.writeFile(
							`/${dir}/.gitignore`,
							dedent`${await pfs.readFile(`/${dir}/.gitignore`, "utf8")}
							.web-block.json
							`,
						);
						await pfs.mkdir(`${dir}/.web-block`);
						await pfs.writeFile(
							`${dir}/.web-block.json`,
							JSON.stringify({
								cwd: "/",
								x: 0,
								y: 0,
								zoom: 1,
							}),
						);
					} catch (e) {
						console.warn(e);
						clearDirectory(
							`/${nameOrUrl
								.split("/")
								.filter((route) => route !== "")
								.at(-1)}`,
						);
						await pfs.rmdir(
							`/${nameOrUrl
								.split("/")
								.filter((route) => route !== "")
								.at(-1)}`,
						);
					}
				} else {
					await git.init({
						fs,
						dir: `/${nameOrUrl}`,
						defaultBranch: user.settings.defaultBranch,
					});
					await pfs.writeFile(`/${nameOrUrl}/.gitignore`, `.web-block.json`);
					await pfs.mkdir(`${nameOrUrl}/.web-block`);
					await pfs.writeFile(
						`${nameOrUrl}/.web-block.json`,
						JSON.stringify({
							cwd: "/",
							x: 0,
							y: 0,
							zoom: 1,
						}),
					);
					await gitAddAll(`/${nameOrUrl}`);
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
		})();
		setIsCreating(false);
	};
	const [exist, setExist] = useState(false);
	useEffect(() => {
		if (search === "") return;
		(async () => {
			try {
				setExist((await pfs.lstat(`/${search}`)).isDirectory());
			} catch {
				setExist(false);
			}
		})();
	}, [search]);

	return (
		<div className="grid gap-2 rounded-box bg-base-300 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<div className="navbar gap-2 rounded-box bg-base-200 p-4">
				<h1 className="navbar-start text-2xl font-bold">
					{t("projects.name")}
				</h1>
				<div className="navbar-end flex gap-2">
					<div className="dropdown dropdown-start">
						<div className="join">
							<label
								tabIndex={0}
								data-tip={t("projects.directory-exists")}
								className={clsx(
									"input join-item",
									exist && "tooltip-open tooltip tooltip-error input-error",
								)}
							>
								<IoMdSearch />
								<input
									type="search"
									className="w-60"
									title={t("projects.search-repo.placeholder")}
									placeholder={t("projects.search-repo.placeholder")}
									value={search}
									disabled={isCreating || isCreatingOnServer}
									onChange={(e) => setSearch(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") createProject(search);
									}}
								/>
							</label>
							<button
								className="tooltip btn join-item btn-success"
								disabled={isCreating || isCreatingOnServer}
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
								await fetchClient.DELETE("/api/logout");
								localStorage.removeItem("token");
								queryClient.invalidateQueries({
									queryKey: ["get", "/api/user"],
								});
								queryClient.removeQueries({
									queryKey: ["get", "/api/user/repos"],
								});
								queryClient.invalidateQueries({
									queryKey: ["get", "/api/projects"],
								});
								queryClient.invalidateQueries({
									queryKey: ["filteredProjects"],
								});
								setCurrentProject("");
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
