const ProjectVisibility = {
	PUBLIC: "public",
	PRIVATE: "private",
} as const;

export type ProjectVisibility =
	(typeof ProjectVisibility)[keyof typeof ProjectVisibility];

export type Project = {
	readonly id: number;
	name: string;
	description: string;
	visibility: ProjectVisibility;
};

type test = {
	visibility: ProjectVisibility;
};

export type User = {
	readonly id: number;
	name: string;
	email: string;
	email_verified_at?: string;
};

export type Node = {
	readonly id: number;
	name?: string;
	position: {
		x: number;
		y: number;
	};
};
