import Resize from "../Resize";

export default function Theme() {
	return (
		<div className="card h-full border-2 p-4">
			<h2 className="card relative -top-10 max-w-fit border-2 bg-gray-800 p-2 text-2xl">
				Theme
			</h2>
			<Resize />
		</div>
	);
}
