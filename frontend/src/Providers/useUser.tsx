import type { paths } from "@/api";
import type {
	INITAL_SETTINGS,
	INITAL_SETTINGS_WINDOW,
	INITAL_USER,
} from "@/bootstrap";
import {
	createContext,
	useContext,
	type Dispatch,
	type SetStateAction,
} from "react";

export const UserContext = createContext(
	{} as {
		user: typeof INITAL_USER;
		setUser: Dispatch<
			SetStateAction<{
				name: string;
				email: string;
				settings: typeof INITAL_SETTINGS;
			}>
		>;
		isLoading: boolean;
		isError: boolean;
		isSuccess: boolean;
		settings: typeof INITAL_SETTINGS_WINDOW;
		setSettings: Dispatch<SetStateAction<typeof INITAL_SETTINGS_WINDOW>>;
		repos?: paths["/api/user/repos"]["get"]["responses"]["200"]["content"]["application/json"];
	},
);

export const useUser = () => useContext(UserContext);
