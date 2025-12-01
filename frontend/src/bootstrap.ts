import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { components, paths } from "./api";
import { useReactFlow, useStoreApi, type NodeTypes } from "@xyflow/react";
import Auth from "./components/Auth";
import ContextMenu from "./components/ContextMenu";
import File from "./components/File";
import Folder from "./components/Folder";
import Github from "./components/Github";
import Projects from "./components/Projects";
import Settings from "./components/Settings";
import Profile from "./components/Settings/Profile";
import Theme from "./components/Settings/Theme";
import Welcome from "./components/Welcome";
import QuickCommand from "./components/QuickCommand";
import Keybinds from "./components/Settings/Keybinds";
import LightningFS from "@isomorphic-git/lightning-fs";
import git from "isomorphic-git";
import { Buffer } from "buffer";
import dedent from "dedent";
import { useCallback } from "react";
import type { CustomNodeType } from ".";
import http from "isomorphic-git/http/web";
import DeleteAccount from "./components/modals/DeleteAccount";
import DeleteProject from "./components/modals/DeleteProject";
import UpdatePassword from "./components/modals/UpdatePassword";
import UploadProject from "./components/modals/UploadProject";
import mime from 'mime';
// Bundlers require Buffer to be defined on window
window.Buffer = Buffer;
export const fs = new LightningFS("fs");
export const pfs = fs.promises;
if (import.meta.env.DEV) {
	window.fs = fs;
	window.pfs = pfs;
	window.git = git;
	//@ts-expect-error debug
	window.http = http;
	//@ts-expect-error debug
	window.mime = mime;
}

export const unstageChanges = async (dir: string) =>
	(await git.statusMatrix({ fs, dir }))
		.filter((row) => row["2"] !== row["3"])
		.map((row) => row["0"]);
//@ts-expect-error debug
if (import.meta.env.DEV) window.unstageChanges = unstageChanges;

export const getProjects = async (paths: string[]) =>
	paths.filter(
		async (path) => (await pfs.readdir(`/${path}/.git`)).length !== 0,
	);

// async function getFileStateChanges(
// 	commitHash1: string,
// 	commitHash2: string,
// 	dir: string,
// ) {
// 	return git.walk({
// 		fs,
// 		dir,
// 		trees: [git.TREE({ ref: commitHash1 }), git.TREE({ ref: commitHash2 })],
// 		map: async function (filepath, [A, B]) {
// 			// ignore directories
// 			if (filepath === ".") {
// 				return;
// 			}
// 			if ((await A?.type()) === "tree" || (await B?.type()) === "tree") {
// 				return;
// 			}

// 			// generate ids
// 			const Aoid = await A?.oid();
// 			const Boid = await B?.oid();

// 			// determine modification type
// 			let type = "equal";
// 			if (Aoid !== Boid) {
// 				type = "modify";
// 			}
// 			if (Aoid === undefined) {
// 				type = "add";
// 			}
// 			if (Boid === undefined) {
// 				type = "remove";
// 			}
// 			if (Aoid === undefined && Boid === undefined) {
// 				console.log("Something weird happened:");
// 				console.log(A);
// 				console.log(B);
// 			}

// 			return {
// 				path: `/${filepath}`,
// 				type: type,
// 			};
// 		},
// 	});
// }

export const useOnPaneClick = () => {
	const { deleteElements } = useReactFlow<CustomNodeType>();
	return useCallback(
		(id: string) =>
			deleteElements({
				nodes: [{ id }],
			}),
		[deleteElements],
	);
};

export function useAddQuickCommand() {
	const onPaneClick = useOnPaneClick();
	const { addNodes, screenToFlowPosition } = useReactFlow<CustomNodeType>();
	const store = useStoreApi();
	return () => {
		const { domNode } = store.getState();
		const boundingRect = domNode?.getBoundingClientRect();
		if (!boundingRect) return;
		const center = screenToFlowPosition({
			x: boundingRect.x + boundingRect.width / 2,
			y: boundingRect.y + boundingRect.height / 8,
		});
		addNodes({
			id: "quickCommand",
			type: "quickCommand",
			data: {
				onPaneClick: () => onPaneClick("quickCommand"),
			},
			position: center,
			origin: [0.5, 0.5], //uses center, but will through off all calculations
		});
	};
	//HACK: remove the size of an element, because an element doesnt exist so only way is to update later
	// updateNode("quickCommand", (node) => {
	// console.log(getNode('quickCommand'), node, center.x - (node.width ?? 100) / 2)
	// 	return ({
	// 	...node,
	// 	position: {
	// 		x: center.x - (node.width ?? 100) / 2,
	// 		y: center.y
	// 		// y: center.y - (node.height ?? 100) / 2,
	// 	},
	// });});
}

export const gitAddAll = async (dir: string) => {
	await git
		.statusMatrix({ fs, dir })
		.then((status) =>
			Promise.all(
				status.map(([filepath, , worktreeStatus]) =>
					worktreeStatus
						? git.add({ fs, dir, filepath })
						: git.remove({ fs, dir, filepath }),
				),
			),
		);
};
if (import.meta.env.DEV)
	//@ts-expect-error Debug
	window.gitAddAll = gitAddAll;

export const findMdFiles = async (dir: `/${string}`) =>
	(await pfs.readdir(dir))
		.filter((path) => path.endsWith(".md"))
		.map((path) => `${dir}/${path}`);
// import { TREE } from "isomorphic-git";
// const ref = "HEAD";
// const trees = [TREE({ ref }), WORKDIR(), STAGE()];
// window.test = await git.walk({
// 	fs,
// 	dir: "/untitled",
// 	trees,
// 	map: async (filepath, [head, workdir]) => {
// 		const content = Buffer.from(await workdir?.content() ?? []).toString("utf8");
// 		console.log((await head?.mode())?.toString(8));
// 		if (content?.includes("foo")) {
// 			return {
// 				filepath,
// 				content,
// 			};
// 		}
// 	},
// });

// export async function map(filepath: string, [head, workdir]: [head: string, workdir: string]) {
//   let content = (await workdir.content()).toString('utf8')
//   if (content.contains('foo')) {
//     return {
//       filepath,
//       content
//     }
//   }
// }

export async function initExample() {
	const dir = "/untitled";
	if ((await pfs.readdir("/")).includes("untitled")) return;
	await git.init({ fs, dir });
	if ((await pfs.readdir(dir)).length === 0) return;
	await pfs.writeFile(
		`${dir}/.gitignore`,
		dedent`
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
	await pfs.writeFile(
		`${dir}/README.md`,
		dedent`
	# This is example todo app. 
	Todo:
	- [x] Add list
	- [x] Add task
	- [ ] Edit task
	- [x] Delete task
	`,
	);
	pfs.mkdir(`${dir}/src`);
	await pfs.writeFile(
		`${dir}/src/index.html`,
		dedent`
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Todo App</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				margin: 20px;
			}
			ul {
				list-style-type: none;
				padding: 0;
			}
			li {
				margin: 5px 0;
			}
		</style>
	</head>
	<body>
		<h1>Todo App</h1>
		<input type="text" id="taskInput" placeholder="Add a new task" />
		<button id="addTaskButton">Add Task</button>
		<ul id="taskList"></ul>

		<script src="index.js"></script>
	</body>
	</html>
	`,
	);
	await pfs.writeFile(
		`${dir}/src/index.js`,
		dedent`
	let tasks = [];
	let taskId = 1;

	// Function to render tasks
	function renderTasks() {
		const taskList = document.getElementById('taskList');
		taskList.innerHTML = ''; // Clear the list

		tasks.forEach(task => {
			const li = document.createElement('li');
			li.textContent = task.title;

			// Edit button
			const editButton = document.createElement('button');
			editButton.textContent = 'Edit';
			editButton.onclick = () => editTask(task.id);
			li.appendChild(editButton);

			// Delete button
			const deleteButton = document.createElement('button');
			deleteButton.textContent = 'Delete';
			deleteButton.onclick = () => deleteTask(task.id);
			li.appendChild(deleteButton);

			taskList.appendChild(li);
		});
	}

	// Function to add a task
	function addTask() {
		const taskInput = document.getElementById('taskInput');
		const title = taskInput.value.trim();

		if (title) {
			tasks.push({ id: taskId++, title });
			taskInput.value = ''; // Clear input
			renderTasks();
		}
	}

	// Function to edit a task
	function editTask(id) {
		const task = tasks.find(t => t.id === id);
		const newTitle = prompt('Edit task:', task.title);
		if (newTitle !== null) {
			task.title = newTitle.trim();
			renderTasks();
		}
	}

	// Function to delete a task
	function deleteTask(id) {
		tasks = tasks.filter(t => t.id !== id);
		renderTasks();
	}

	// Event listener for the Add Task button
	document.getElementById('addTaskButton').addEventListener('click', addTask);

	// Initial render
	renderTasks();
	`,
	);
	await gitAddAll(dir);
	await git.commit({
		fs,
		dir,
		author: {
			name: "Lempac",
		},
		message: "init",
	});
}

if (import.meta.env.DEV)
	//@ts-expect-error @ts-ignore
	window.init = initExample;
export async function clearDirectory(
	dir: `/${string}` | `/${string}/${string}`,
) {
	for (const item of await pfs.readdir(dir)) {
		const item_path: `/${string}/${string}` = `/${dir}/${item}`;
		if ((await pfs.stat(item_path)).type === "file") {
			await pfs.unlink(item_path);
		} else {
			await clearDirectory(item_path);
			await pfs.rmdir(item_path);
		}
	}
}
if (import.meta.env.DEV)
	//@ts-expect-error Debug
	window.clearDir = clearDirectory;

// function getCookie(name: string) {
// 	const value = `; ${document.cookie}`;
// 	const parts = value.split(`; ${name}=`);
// 	if (parts.length === 2) return parts.pop()?.split(";").shift();
// }

export const fetchClient = createFetchClient<paths>({
	credentials: "include",
	baseUrl: import.meta.env.VITE_SERVER_URL,
	headers: {
		"X-Requested-With": "XMLHttpRequest",
		// "X-XSRF-TOKEN": decodeURIComponent(getCookie("XSRF-TOKEN") ?? ""),
	},
});

export const INITAL_SETTINGS_WINDOW = {
	width: 1000,
	height: 700,
	theme: {
		width: 200,
		height: 200,
		// x: 100,
		// y: 100
	} as {
		width: number;
		height: number;
		x?: number;
		y?: number;
	},
	keybinds: {
		width: 200,
		height: 200,
		// x: 100,
		// y: 100
	} as {
		width: number;
		height: number;
		x?: number;
		y?: number;
	},
	profile: {
		width: 200,
		height: 200,
		// x: 500,
		// y: 50
	} as {
		width: number;
		height: number;
		x?: number;
		y?: number;
	},
};

export const INITAL_PROFILE = {
	defaultBranch: "master",
	lang: "en",
	hideExtensions: false,
} as {
	hideExtensions: boolean;
	defaultBranch: string;
	lang: string;
};
export const INITAL_THEME = {
	controlPosition: "bottom-left",
	baseDarkTheme: "sunset",
	baseLightTheme: "nord",
	minimapPosition: "bottom-right",
	pathPosition: "top-left",
} as {
	controlPosition: components["schemas"]["PanelPosition"];
	minimapPosition: components["schemas"]["PanelPosition"];
	pathPosition: components["schemas"]["PanelPosition"];
	baseLightTheme: components["schemas"]["Themes"];
	baseDarkTheme: components["schemas"]["Themes"];
};

export const INITAL_KEYBINDS = {};

export const INITAL_SETTINGS = {
	...INITAL_PROFILE,
	style: { ...INITAL_THEME },
	keybinds: { ...INITAL_KEYBINDS },
};

export const INITAL_USER = {
	name: "",
	email: "",
	settings: { ...INITAL_SETTINGS },
} as {
	name: string;
	email: string;
	settings: typeof INITAL_SETTINGS;
};

const authMiddleware: Middleware = {
	async onRequest({ request }) {
		request.headers.set(
			"Authorization",
			`Bearer ${localStorage.getItem("token")}`,
		);
		return request;
	},
};

fetchClient.use(authMiddleware);
export const $api = createClient(fetchClient);
export const fileExtensionMap = {
	js: "javascript",
	py: "python",
	java: "java",
	// c: "c",
	cpp: "cpp",
	cs: "c#",
	rb: "ruby",
	php: "php",
	html: "html",
	css: "css",
	// swift: "swift",
	// go: "go",
	// rs: "rust",
	// kt: "kotlin",
	// pl: "perl",
	r: "r",
	// sql: "sql",
	// sh: "shell",
	ts: "typescript",
	// dart: "dart",
	xml: "xml",
	json: "json",
	md: "markdown",
	yml: "yaml",
	yaml: "yaml",
	// nix: "nix",
} as const;

export const allowedLang = { en: "en", lv: "lv" } as const;

export const themeToSet = () =>
	new Set<components["schemas"]["Themes"]>([
		"acid",
		"aqua",
		"autumn",
		"black",
		"bumblebee",
		"business",
		"cmyk",
		"coffee",
		"corporate",
		"cupcake",
		"cyberpunk",
		"dark",
		"dim",
		"dracula",
		"emerald",
		"fantasy",
		"forest",
		"garden",
		"halloween",
		"lemonade",
		"light",
		"lofi",
		"luxury",
		"night",
		"nord",
		"pastel",
		"retro",
		"sunset",
		"synthwave",
		"valentine",
		"winter",
		"wireframe",
	]);

export const panelPositionToSet = () =>
	new Set<components["schemas"]["PanelPosition"]>([
		"bottom-center",
		"bottom-left",
		"bottom-right",
		"top-center",
		"top-left",
		"top-right",
	]);

export function getLanguage(extension: string) {
	return extension in fileExtensionMap
		? fileExtensionMap[extension as keyof typeof fileExtensionMap]
		: "Unknown extension";
}

export const nodeTypes: NodeTypes = {
	auth: Auth,
	welcome: Welcome,
	profile: Profile,
	theme: Theme,
	keybinds: Keybinds,
	folder: Folder,
	settings: Settings,
	file: File,
	projects: Projects,
	github: Github,
	contextMenu: ContextMenu,
	quickCommand: QuickCommand,
	deleteAccount: DeleteAccount,
	deleteProject: DeleteProject,
	uploadProject: UploadProject,
	updatePassword: UpdatePassword,
} as const;
