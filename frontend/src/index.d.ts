export enum VisibilityType {
	Public = "public",
	Private = "private",
}

export interface Project {
	readonly id: number;
	name: string;
	description: string;
	visibility: VisibilityType;
}

export interface User {
	readonly id: number;
	name: string;
	email: string;
	email_verified_at?: string;
}

export interface Node {
	readonly id: number;
	name: string;
	position: {
		x: number;
		y: number;
	};
}
