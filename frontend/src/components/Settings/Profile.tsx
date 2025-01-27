import { Input } from "@headlessui/react";
import Resize from "../Resize";

export default function Profile() {
	return (
		<div className="card border-2 p-4 h-full gap-2">
			<div className="mb-3">
				<h2 className="border-2 card text-2xl p-2 -top-6 bg-gray-800 absolute max-w-fit">
					Profile
				</h2>
			</div>
			<Input className="input input-bordered"/>
			<Input className="input input-bordered"/>
			<Input className="input input-bordered"/>
			<Resize />
		</div>
	);
}
