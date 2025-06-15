import type { AuthNode } from "./components/Auth";
import type { ContextMenuNode } from "./components/ContextMenu";
import type { FileNode } from "./components/File";
import type { FolderNode } from "./components/Folder";
import type { GithubNode } from "./components/Github";
import type { DeleteAccountNode } from "./components/modals/DeleteAccount";
import type { DeleteProjectNode } from "./components/modals/DeleteProject";
import type { UpdatePasswordNode } from "./components/modals/UpdatePassword";
import type { UploadProjectNode } from "./components/modals/UploadProject";
import type { ProjectsNode } from "./components/Projects";
import type { QuickCommandNode } from "./components/QuickCommand";
import type { SettingsNode } from "./components/Settings";
import type { KeybindsNode } from "./components/Settings/Keybinds";
import type { ProfileNode } from "./components/Settings/Profile";
import type { ThemeNode } from "./components/Settings/Theme";
import type { WelcomeNode } from "./components/Welcome";
import git from 'isomorphic-git';

declare global {
	interface Window {
		fs: LightningFS;
		pfs: LightningFS.PromisifiedFS;
		git: git;
	}
}
export type CustomNodeType =
	| ProjectsNode
	| AuthNode
	| GithubNode
	| WelcomeNode
	| SettingsNode
	| ProfileNode
	| ThemeNode
	| KeybindsNode
	| FolderNode
	| FileNode
	| ContextMenuNode
	| QuickCommandNode
	| DeleteAccountNode
	| DeleteProjectNode
	| UploadProjectNode
	| UpdatePasswordNode;
// export type ProjectVisibility =
// 	(typeof ProjectVisibility)[keyof typeof ProjectVisibility];

// export type Project = {
// 	readonly id: number;
// 	name: string;
// 	description: string;
// 	default_branch: string;
// 	url: string;
// visibility: ProjectVisibility;
// };

// export type User = {
// 	readonly id: number;
// 	name: string;
// 	email: string;
// 	email_verified_at?: string;
// 	readonly is_admin: boolean;
// 	settings: Settings;
// };

// const Themes = {
// 	Light: "light",
// 	Dark: "dark",
// 	Cupcake: "cupcake",
// 	Bumblebee: "bumblebee",
// 	Emerald: "emerald",
// 	Corporate: "corporate",
// 	Synthwave: "synthwave",
// 	Retro: "retro",
// 	Cyberpunk: "cyberpunk",
// 	Valentine: "valentine",
// 	Halloween: "halloween",
// 	Garden: "garden",
// 	Forest: "forest",
// 	Aqua: "aqua",
// 	Lofi: "lofi",
// 	Pastel: "pastel",
// 	Fantasy: "fantasy",
// 	Wireframe: "wireframe",
// 	Black: "black",
// 	Luxury: "luxury",
// 	Dracula: "dracula",
// 	Cmyk: "cmyk",
// 	Autumn: "autumn",
// 	Business: "business",
// 	Acid: "acid",
// 	Lemonade: "lemonade",
// 	Night: "night",
// 	Coffee: "coffee",
// 	Winter: "winter",
// 	Dim: "dim",
// 	Nord: "nord",
// 	Sunset: "sunset",
// } as const;

// export type Themes =
// 	(typeof Themes)[keyof typeof Themes];

// export type Settings = {
// 	hideExtensions: boolean;
// 	defaultBranch: string;
// 	lang: 'en' | 'lv';
// 	style: {
// 		controlPosition: PanelPosition;
// 		minimapPosition: PanelPosition;
// 		pathPosition: PanelPosition;
// 		baseLightTheme: Themes;
// 		baseDarkTheme: Themes;
// 	};
// };

// export type Block = {
// 	readonly id: number;
// 	x: number;
// 	y: number;
// 	path: string;
// 	content: string | null;
// 	readonly is_file: boolean;
// 	readonly is_folder: boolean;
// };

// let test = themeToSet().values()
// setInterval(() => {
// 	let val = test.next();
// 	if(val.done){
// 		test = themeToSet().values();
// 		val = test.next();
// 	}
// 	document.documentElement.setAttribute('data-theme', val.value!)
// }, 2000);
