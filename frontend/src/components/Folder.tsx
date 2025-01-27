import Resize from "./Resize";

export default function Folder({ data }: { data: { name: string } }) {
	return (
		<div className="card h-full min-h-8 min-w-32 border-2 p-4">
			<h2 className="nodrag card relative -top-10 max-w-fit border-2 bg-gray-800 p-2 text-2xl">
				{data.name}
			</h2>
			<Resize />
		</div>
	);
}
