import type { Node } from "@xyflow/react";
import Resize from "../Resize";
import { $api } from "@/bootstrap";
import { useForm } from "@tanstack/react-form";

export type ProfileNode = Node<Record<never, never>, "profile">;

export default function Profile() {
	const { data: user } = $api.useQuery("get", "/api/user");
	const { Field } = useForm({
		defaultValues: user,
	});
	return (
		<div className="card gap-2 border-2 p-4">
			<div className="mb-3">
				<h2 className="card absolute -top-6 card-body max-w-fit border-2 bg-base-200 p-2 text-2xl">
					Profile
				</h2>
			</div>
			<Field
				name={"name"}
				children={(field) => (
					<input
						className="nodrag input"
						type="text"
						id={field.name}
						name={field.name}
						value={field.state.value}
						onChange={e => field.handleChange(e.target.value)}
						onBlur={field.handleBlur}
					/>
				)}
			/>
			<Field
				name={"email"}
				children={(field) => (
					<input
						className="nodrag input"
						type="text"
						id={field.name}
						name={field.name}
						value={field.state.value}
						onChange={e => field.handleChange(e.target.value)}
						onBlur={field.handleBlur}
					/>
				)}
			/>
			<Field
				name={"settings.lang"}
				children={(field) => (
					// <select id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value as components["schemas"]["Themes"])} className="nodrag select">
					// 	{themes}
					// </select>
					<input
						className="nodrag input"
						type="text"
						id={field.name}
						name={field.name}
						value={field.state.value}
						onChange={e => field.handleChange(e.target.value)}
						onBlur={field.handleBlur}
					/>
				)}
			/>
			<Field
				name={"settings.defaultBranch"}
				children={(field) => (
					<input
						className="nodrag input"
						type="text"
						id={field.name}
						name={field.name}
						value={field.state.value}
						onChange={e => field.handleChange(e.target.value)}
						onBlur={field.handleBlur}
					/>
				)}
			/>
			<Field
				name={"settings.hideExtensions"}
				children={(field) => (
					<input
						className="nodrag checkbox"
						type="checkbox"
						id={field.name}
						name={field.name}
						checked={field.state.value}
						onChange={e => field.handleChange(e.target.checked)}
						onBlur={field.handleBlur}
					/>
				)}
			/>
			<Resize />
		</div>
	);
}
