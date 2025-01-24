import Resize from "../Resize";

export default function Theme() {
	return (
		<div className="card border-2 p-4 h-full">
			<h2 className="border-2 card text-2xl p-2 -top-10 bg-gray-800 relative max-w-fit">
				Theme
			</h2>
			<Resize />
		</div>
	);
}
