import { Panel } from "@xyflow/react";
import type { PanelPosition } from "@xyflow/react";

export type PathProps = {
	path: string;
	position?: PanelPosition;
	size?: number;
};

export default function Path({ path, position, size }: PathProps) {
	const segments = path.split("/");
	return (
		<Panel
			className="breadcrumbs rounded-t-md rounded-br-3xl rounded-bl-md bg-base-300 pr-5 pl-2 shadow"
			position={position ?? "top-left"}
		>
			<ul className="transition-all">
				{size !== undefined && segments?.length && size < segments?.length ? (
					<li>
						<a className="link link-hover">..</a>
					</li>
				) : null}
				{segments
					?.slice(
						size === undefined || size >= segments.length
							? 0
							: segments.length - size,
					)
					.map((element, index) => (
						<li key={index}>
							<a className="link link-hover">{element}</a>
						</li>
					))}
			</ul>
		</Panel>
	);
}
