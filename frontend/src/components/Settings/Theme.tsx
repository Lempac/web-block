import type { Node } from "@xyflow/react";
import Resize from "../Resize";
import { $api, fetchClient, panelPositionToSet, themeToSet } from "@/bootstrap";
import { useForm } from "@tanstack/react-form";
import type { components } from "@/api";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

export type ThemeNode = Node<Record<string, never>, "theme">;

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
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const { data: user } = $api.useQuery("get", "/api/user");
	const { Field } = useForm({
		defaultValues: user?.settings.style,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({value}) => {
				const {error} = await fetchClient.PUT("/api/user/style", {
					body: value,
				});
				if (error) return { fields: error.errors };
				queryClient.invalidateQueries({ queryKey: ["get", "/api/user"] });
				return null;
			},
		},
	});

	const themes = intrToOptions(themeToSet().values());
	const positions = intrToOptions(panelPositionToSet().values());

	return (
		<div className="card h-full border-2 gap-2 p-4 bg-base-200/25 shadow ring-neutral in-[.selected]:ring-4 first:mb-9">
			<div className="mb-3">
				<h2 className="card absolute -top-6 card-body max-w-fit border-2 bg-base-200 p-2 text-2xl">
					{t("settings.theme.name")}
				</h2>
			</div>
			<Field
				name={"baseDarkTheme"}
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
				name={"baseLightTheme"}
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
				name={"controlPosition"}
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
				name={"minimapPosition"}
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
				name={"pathPosition"}
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
