import { Panel } from "@xyflow/react";

export function Path({ path, size }: { path?: string; size?: number }) {
	const segments = path?.split("/");
	return (
		<Panel className="breadcrumbs bg-slate-700 rounded-t-md rounded-bl-md rounded-br-3xl pl-2 pr-5 shadow-2xl">
			<ul className="transition-all">
				{size !== undefined && segments?.length && size < segments?.length ? (
					<li><a className="link link-hover">..</a></li>
				) : null}
				{segments
					?.slice(
						size === undefined || size >= segments.length
							? 0
							: segments.length - size
					)
					.map((element, index) => (
						<li key={index}><a className="link link-hover">{element}</a></li>
					))}
			</ul>
		</Panel>
	);
}
