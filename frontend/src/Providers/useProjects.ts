import { useContext, createContext } from "react";
import type { components } from "../api";

export const ProjectContext = createContext(
	{} as {
		projects: Map<
			components["schemas"]["Project"]["id"],
			components["schemas"]["Project"]
		>;
		currentProject: string;
		setCurrentProject: React.Dispatch<React.SetStateAction<string>>;
		isLoading: boolean;
		isError: boolean;
		isSuccess: boolean;
		cwd: string;
		getCurrentProject: (
			id?: string,
		) => components["schemas"]["Project"] | undefined;
	},
);

export const useProjects = () => useContext(ProjectContext);

export default useProjects;
