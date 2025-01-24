import Resize from "./Resize";

export default function Folder({ data }: { data: { name: string } }) {
	return (
		<div className="card border-2 p-4 h-full min-w-32 min-h-8">
			<h2 className="nodrag text-2xl border-2 card p-2 -top-10 bg-gray-800 relative max-w-fit">
				{data.name}
			</h2>
			<Resize />
		</div>
	);
}
