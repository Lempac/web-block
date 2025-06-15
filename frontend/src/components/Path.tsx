import { pfs } from "@/bootstrap";
import useProjects from "@/Providers/useProjects";
import { useQueryClient } from "@tanstack/react-query";
import { Panel } from "@xyflow/react";
import type { PanelPosition } from "@xyflow/react";
import type { MouseEvent } from "react";

export type PathProps = {
	path: string;
	position?: PanelPosition;
	size?: number;
};

export default function Path({ path, position, size }: PathProps) {
	console.assert(path !== "", "Path is empty string?");
	const queryClient = useQueryClient();
	const { getProject } = useProjects();
	const changePath = async (
		e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
		index: number,
	) => {
		e.preventDefault();
		e.stopPropagation();
		const project = getProject();
		await pfs.writeFile(
			`/${project?.name}/.web-block.json`,
			JSON.stringify({
				x: project?.x,
				y: project?.y,
				zoom: project?.zoom,
				cwd:
					index === 0
						? "/"
						: `${path
								.split("/")
								.slice(0, index + 1)
								.join("/")}`,
			}),
		);
		await queryClient.invalidateQueries({ queryKey: ["getProjects"] });
	};

	const segments = path === "/" ? [""] : path.split("/");
	return (
		<Panel
			className="left-16! breadcrumbs rounded-t-md rounded-br-3xl rounded-bl-md bg-base-300 pr-5 pl-2 shadow"
			position={position ?? "top-left"}
		>
			<ul className="transition-all">
				{size !== undefined && segments?.length && size < segments?.length && (
					<li>
						<a className="link link-hover">..</a>
					</li>
				)}
				{segments
					?.slice(
						size === undefined || size >= segments.length
							? 0
							: segments.length - size,
					)
					.map((element, index) => (
						<li key={index}>
							<a
								className="link link-hover"
								onClick={(e) => changePath(e, index)}
							>
								{element === "" ? "/" : element}
							</a>
						</li>
					))}
			</ul>
		</Panel>
	);
}
