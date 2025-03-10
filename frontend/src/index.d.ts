// const ProjectVisibility = {
// 	PUBLIC: "public",
// 	PRIVATE: "private",
// } as const;

import { PanelPosition } from "@xyflow/react";

// export type ProjectVisibility =
// 	(typeof ProjectVisibility)[keyof typeof ProjectVisibility];

export type Project = {
	readonly id: number;
	name: string;
	description: string;
	default_branch: string;
	url: string;
	// visibility: ProjectVisibility;
};

export type User = {
	readonly id: number;
	name: string;
	email: string;
	email_verified_at?: string;
	readonly is_admin: boolean;
	settings: Settings;
};

const Themes = {
	Light: "light",
	Dark: "dark",
	Cupcake: "cupcake",
	Bumblebee: "bumblebee",
	Emerald: "emerald",
	Corporate: "corporate",
	Synthwave: "synthwave",
	Retro: "retro",
	Cyberpunk: "cyberpunk",
	Valentine: "valentine",
	Halloween: "halloween",
	Garden: "garden",
	Forest: "forest",
	Aqua: "aqua",
	Lofi: "lofi",
	Pastel: "pastel",
	Fantasy: "fantasy",
	Wireframe: "wireframe",
	Black: "black",
	Luxury: "luxury",
	Dracula: "dracula",
	Cmyk: "cmyk",
	Autumn: "autumn",
	Business: "business",
	Acid: "acid",
	Lemonade: "lemonade",
	Night: "night",
	Coffee: "coffee",
	Winter: "winter",
	Dim: "dim",
	Nord: "nord",
	Sunset: "sunset",
} as const;

export type Themes =
	(typeof Themes)[keyof typeof Themes];
	
export type Settings = {
	hideExtensions: boolean;
	defaultBranch: string;
	lang: 'en' | 'lv';
	style: {
		controlPosition: PanelPosition;
		minimapPosition: PanelPosition;
		pathPosition: PanelPosition;
		baseLightTheme: Themes;
		baseDarkTheme: Themes;
	};
};

export type Block = {
	readonly id: number;
	x: number;
	y: number;
	path: string;
	content: string | null;
	readonly is_file: boolean;
	readonly is_folder: boolean;
};
