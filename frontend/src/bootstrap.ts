import createFetchClient, { Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import { type components, paths } from "./api";
import { BuiltInNode, NodeTypes } from "@xyflow/react";
import Auth, { AuthNode } from "./components/Auth";
import ContextMenu, { ContextMenuNode } from "./components/ContextMenu";
import File, { FileNode } from "./components/File";
import Folder, { FolderNode } from "./components/Folder";
import Github, { GithubNode } from "./components/Github";
import Projects, { ProjectsNode } from "./components/Projects";
import Settings, { SettingsNode } from "./components/Settings";
import Profile, { ProfileNode } from "./components/Settings/Profile";
import Theme, { ThemeNode } from "./components/Settings/Theme";
import Welcome, { WelcomeNode } from "./components/Welcome";
import { useState, useEffect } from "react";

export const BASE_URL = "http://localhost:8000";
// import axios from "axios";
// import { Ziggy } from "./ziggy.js";
// window.axios = axios;
// window.axios.defaults.withCredentials = true;
// window.axios.defaults.timeout = 60000;
// window.axios.defaults.withXSRFToken = true;
// window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// window.Ziggy = Ziggy;

// export const theme = use(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; 
export const usePreferredColorScheme = () => {
	const [theme, setTheme] = useState(() => {
	  // Check the initial preference
	  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	});
  
	useEffect(() => {
	  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  
	  // Function to handle changes in the color scheme
	  const handleChange = (e: MediaQueryListEvent) => {
		setTheme(e.matches ? "dark" : "light");
	  };
  
	  // Set up the event listener
	  mediaQuery.addEventListener('change', handleChange);
  
	  // Clean up the event listener on component unmount
	  return () => {
		mediaQuery.removeEventListener('change', handleChange);
	  };
	}, []);
  
	return theme;
  };


function getCookie(name: string) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export const fetchClient = createFetchClient<paths>({
	credentials: "include",
	baseUrl: BASE_URL,
	headers: {
		"X-Requested-With": "XMLHttpRequest",
	},
});
//for csrf and xsrf token
// fetch(`${BASE_URL}/sanctum/csrf-cookie`);
if (!getCookie("XSRF-TOKEN")) fetch(`${BASE_URL}/sanctum/csrf-cookie`);

const myMiddleware: Middleware = {
	async onRequest({ request }) {
		request.headers.set(
			"X-XSRF-TOKEN",
			decodeURIComponent(getCookie("XSRF-TOKEN") ?? ""),
		);
		return request;
	},
};

fetchClient.use(myMiddleware);
export const $api = createClient(fetchClient);

export const fileExtensionMap = {
	js: "javascript",
	py: "python",
	java: "java",
	c: "c",
	cpp: "cpp",
	cs: "c#",
	rb: "ruby",
	php: "php",
	html: "html",
	css: "css",
	swift: "swift",
	go: "go",
	rs: "rust",
	kt: "kotlin",
	pl: "perl",
	r: "r",
	sql: "sql",
	sh: "shell",
	ts: "typescript",
	dart: "dart",
	xml: "xml",
	json: "json",
	md: "markdown",
	yml: "yaml",
	nix: "nix",
} as const;

export const themeToSet = () => new Set<components["schemas"]["Themes"]>(["acid", "aqua", "autumn", "black", "bumblebee", "business", "cmyk", "coffee", "corporate", "cupcake", "cyberpunk", "dark", "dim", "dracula", "emerald", "fantasy", "forest", "garden", "halloween", "lemonade", "light", "lofi", "luxury", "night", "nord", "pastel", "retro", "sunset", "synthwave", "valentine", "winter", "wireframe"]);
export const panelPositionToSet = () => new Set<components["schemas"]["PanelPosition"]>(["bottom-center", "bottom-left", "bottom-right", "top-center", "top-left", "top-right"]);
export function getLanguage(extension: string) {
	return extension in fileExtensionMap
		? fileExtensionMap[extension as keyof typeof fileExtensionMap]
		: "Unknown extension";
}

// let test = themeToSet().values()

// setInterval(() => {
// 	let val = test.next();
// 	if(val.done){
// 		test = themeToSet().values();
// 		val = test.next();
// 	}
// 	document.documentElement.setAttribute('data-theme', val.value!)
// }, 2000);

export type CustomNodeType =
	| BuiltInNode
	| AuthNode
	| ProjectsNode
	| GithubNode
	| WelcomeNode
	| SettingsNode
	| ProfileNode
	| ThemeNode
	| FolderNode
	| FileNode
	| ContextMenuNode;

export const nodeTypes: NodeTypes = {
	auth: Auth,
	welcome: Welcome,
	profile: Profile,
	theme: Theme,
	folder: Folder,
	settings: Settings,
	file: File,
	projects: Projects,
	github: Github,
	contextMenu: ContextMenu,
} as const;