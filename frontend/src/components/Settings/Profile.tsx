import Resize from "../Resize";

export default function Profile() {
	return (
		<div className="card h-full gap-2 border-2 p-4">
			<div className="mb-3">
				<h2 className="card absolute -top-6 max-w-fit border-2 bg-gray-800 p-2 text-2xl">
					Profile
				</h2>
			</div>
			<input className="input-bordered input" />
			<input className="input-bordered input" />
			<input className="input-bordered input" />
			<Resize />
		</div>
	);
}
