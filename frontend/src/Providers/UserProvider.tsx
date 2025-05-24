import { $api, INITAL_SETTINGS_WINDOW, INITAL_USER } from "@/bootstrap";
import { UserContext } from "./useUser";
import { useEffect, type ReactNode } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useLocalStorage("user", INITAL_USER);
	const {
		data: OnlineUser,
		isError,
		isLoading,
		isSuccess,
	} = $api.useQuery(
		"get",
		"/api/user",
		{},
		{
			retry: 1,
			refetchInterval: 2 * 1000 * 60,
			//HACK: so we dont have two cache for user("get","/api/user",{})
			queryKey: ["get", "/api/user"],
		},
	);
	const { data: repos } = $api.useQuery("get", "/api/user/repos");
	const [settings, setSettings] = useLocalStorage(
		"settings",
		INITAL_SETTINGS_WINDOW,
	);

	useEffect(() => {
		if (isSuccess) setUser(OnlineUser);
	}, [OnlineUser, isSuccess, setUser]);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				isError,
				isLoading,
				isSuccess,
				settings,
				setSettings,
				repos,
			}}
			children={children}
		/>
	);
}
