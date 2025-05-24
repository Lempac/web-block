import { useState, type ReactNode } from "react";
import git from "isomorphic-git";
import { useQuery } from "@tanstack/react-query";
import { getProjects, fs, findMdFiles, pfs, gitAddAll } from "../bootstrap";
import { ProjectContext } from "./useProjects";
import type { components } from "../api";
import { useUser } from "./useUser";

export default function ProjectProvider({ children }: { children: ReactNode }) {
	const { user } = useUser();
	const {
		data: projects,
		isLoading,
		isError,
		isSuccess,
	} = useQuery({
		queryKey: ["getProjects"],
		queryFn: async () => {
			const data = await getProjects(await pfs.readdir("/"));
			// console.log(data)
			const projects = new Map<string, components["schemas"]["Project"]>();
			const pro = await Promise.all(
				data.map(async (project) => ({
					id:
						(await ((await git.getConfig({
							fs,
							dir: `/${project}`,
							path: "project.id",
						})) as Promise<string | undefined>)) ??
						(await (async () => {
							const id = crypto.randomUUID();
							await git.setConfig({
								fs,
								dir: `/${project}`,
								path: "project.id",
								value: id,
							});
							return id;
						})()),
					name: project,
					description:
						(await findMdFiles(`/${project}`))[0] ??
						(await (async () => {
							await pfs.writeFile(
								`/${project}/README.md`,
								`This is ${project} description.`,
							);
							return `/${project}/README.md`;
						})()),
					cwd: "/",
					// (await ((await git.getConfig({
					// 	fs,
					// 	dir: `/${project}`,
					// 	path: "project.cwd",
					// })) as Promise<string | undefined>)) ??
					// (await (async () => {
					// 	await git.setConfig({
					// 		fs,
					// 		dir: `/${project}`,
					// 		path: "project.cwd",
					// 		value: `/`,
					// 	});
					// 	return `/`;
					// })()),
					x: 0,
					y: 0,
					zoom: 1,
					default_branch:
						(await git.currentBranch({ fs, dir: `/${project}` })) ?? "master",
					oid: await git
						.resolveRef({ fs, dir: `/${project}`, ref: "HEAD" })
						.catch(async (e: typeof git.Errors.NotFoundError) => {
							console.assert(
								e.code === "NotFoundError",
								`Other error?, code is: ${e.code}`,
							);
							await gitAddAll(`/${project}`);
							await git.commit({
								fs,
								dir: `/${project}`,
								message: "init",
								author: { name: user.name, email: user.email },
							});
							return await git.resolveRef({
								fs,
								dir: `/${project}`,
								ref: "HEAD",
							});
						}),
					url: "",
				})),
			);
			for (const project of pro) {
				projects.set(project.id, project);
			}
			return projects;
		},
	});
	const [currentProject, setCurrentProject] = useState("");
	const getProject = (id = currentProject) => projects?.get(id);

	return (
		<ProjectContext.Provider
			value={{
				projects: projects ?? new Map(),
				currentProject,
				setCurrentProject,
				isLoading,
				isError,
				isSuccess,
				getProject,
				cwd: getProject()?.cwd ?? "/",
			}}
			children={children}
		/>
	);
}
