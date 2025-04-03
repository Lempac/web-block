import type { Node } from "@xyflow/react";
import Resize from "../Resize";
import { $api, panelPositionToSet, themeToSet } from "@/bootstrap";
import { useForm } from "@tanstack/react-form";
import { components } from "@/api";
import { JSX } from "react";

export type ThemeNode = Node<Record<never, never>, "theme">;

const intrToOptions = (intr: SetIterator<string>) => {
	const options: JSX.Element[] = [];
	let current = intr.next();
	while (!current.done) {
		options.push(
			<option key={current.value} value={current.value}>
				{current.value}
			</option>,
		);
		current = intr.next();
	}
	return options;
};

export default function Theme() {
	const { data: user } = $api.useQuery("get", "/api/user");
	const { Field } = useForm({
		defaultValues: user?.settings,
		validators: {
			onChange: ({ value }) => {
				console.log(value);
				return null;
			},
		},
	});

	const themes = intrToOptions(themeToSet().values());
	const positions = intrToOptions(panelPositionToSet().values());

	return (
		<div className="card h-full border-2 p-4">
			<h2 className="card relative -top-10 max-w-fit border-2 bg-base-200 p-2 text-2xl">
				Theme
			</h2>
			<Field
				name={"style.baseDarkTheme"}
				children={(field) => (
					<select
						id={field.name}
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) =>
							field.handleChange(
								e.target.value as components["schemas"]["Themes"],
							)
						}
						className="nodrag select"
					>
						{themes}
					</select>
				)}
			/>
			<Field
				name={"style.baseLightTheme"}
				children={(field) => (
					<select
						id={field.name}
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) =>
							field.handleChange(
								e.target.value as components["schemas"]["Themes"],
							)
						}
						className="nodrag select"
					>
						{themes}
					</select>
				)}
			/>
			<Field
				name={"style.controlPosition"}
				children={(field) => (
					<select
						id={field.name}
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) =>
							field.handleChange(
								e.target.value as components["schemas"]["PanelPosition"],
							)
						}
						className="nodrag select"
					>
						{positions}
					</select>
				)}
			/>
			<Field
				name={"style.minimapPosition"}
				children={(field) => (
					<select
						id={field.name}
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) =>
							field.handleChange(
								e.target.value as components["schemas"]["PanelPosition"],
							)
						}
						className="nodrag select"
					>
						{positions}
					</select>
				)}
			/>
			<Field
				name={"style.pathPosition"}
				children={(field) => (
					<select
						id={field.name}
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) =>
							field.handleChange(
								e.target.value as components["schemas"]["PanelPosition"],
							)
						}
						className="nodrag select"
					>
						{positions}
					</select>
				)}
			/>
			<Resize />
		</div>
	);
}
