import type { Node } from "@xyflow/react";
import Resize from "../Resize";
import { $api, fetchClient, panelPositionToSet, themeToSet } from "@/bootstrap";
import { useForm } from "@tanstack/react-form";
import type { components } from "@/api";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import IterToOptions from "../IterToOptions";

export type ThemeNode = Node<Record<string, never>, "theme">;

export default function Theme() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const { data: user } = $api.useQuery("get", "/api/user");
	const { Field } = useForm({
		defaultValues: user?.settings.style,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				const { error } = await fetchClient.PUT("/api/user/style", {
					body: value,
				});
				if (error) return { fields: error.errors };
				queryClient.invalidateQueries({ queryKey: ["get", "/api/user"] });
				return null;
			},
		},
	});

	return (
		<div className="card h-full gap-2 border-2 bg-base-200/25 p-4 shadow ring-neutral first:mb-9 in-[.selected]:ring-4">
			<div className="mb-3">
				<h2 className="card absolute -top-6 card-body max-w-fit border-2 bg-base-200 p-2 text-2xl">
					{t("settings.theme.name")}
				</h2>
			</div>
			<Field
				name={"baseDarkTheme"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">{t("settings.theme.baseDarkTheme")}</span>
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
								className={clsx(
									"nodrag select input-sm",
									field.state.meta.errors.length !== 0 && "select-error",
								)}
							>
								<IterToOptions iter={themeToSet().values()} />
							</select>
						</label>
						{field.state.meta.errors.length !== 0 && (
							<div className="flex flex-col">
								{field.state.meta.errors.flat().map((x, i) => (
									<div key={i} className="fieldset-label text-error">
										{x}
									</div>
								))}
							</div>
						)}
					</>
				)}
			/>
			<Field
				name={"baseLightTheme"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">{t("settings.theme.baseLightTheme")}</span>
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
								className={clsx(
									"nodrag select input-sm",
									field.state.meta.errors.length !== 0 && "select-error",
								)}
							>
								<IterToOptions iter={themeToSet().values()} />
							</select>
						</label>
						{field.state.meta.errors.length !== 0 && (
							<div className="flex flex-col">
								{field.state.meta.errors.flat().map((x, i) => (
									<div key={i} className="fieldset-label text-error">
										{x}
									</div>
								))}
							</div>
						)}
					</>
				)}
			/>
			<Field
				name={"controlPosition"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">{t("settings.theme.controlPosition")}</span>
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
								className={clsx(
									"nodrag select input-sm",
									field.state.meta.errors.length !== 0 && "select-error",
								)}
							>
								<IterToOptions iter={panelPositionToSet().values()} />
							</select>
						</label>
						{field.state.meta.errors.length !== 0 && (
							<div className="flex flex-col">
								{field.state.meta.errors.flat().map((x, i) => (
									<div key={i} className="fieldset-label text-error">
										{x}
									</div>
								))}
							</div>
						)}
					</>
				)}
			/>
			<Field
				name={"minimapPosition"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">{t("settings.theme.minimapPosition")}</span>
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
								className={clsx(
									"nodrag select input-sm",
									field.state.meta.errors.length !== 0 && "select-error",
								)}
							>
								<IterToOptions iter={panelPositionToSet().values()} />
							</select>
						</label>
						{field.state.meta.errors.length !== 0 && (
							<div className="flex flex-col">
								{field.state.meta.errors.flat().map((x, i) => (
									<div key={i} className="fieldset-label text-error">
										{x}
									</div>
								))}
							</div>
						)}
					</>
				)}
			/>
			<Field
				name={"pathPosition"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">{t("settings.theme.pathPosition")}</span>
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
								className={clsx(
									"nodrag select input-sm",
									field.state.meta.errors.length !== 0 && "select-error",
								)}
							>
								<IterToOptions iter={panelPositionToSet().values()} />
							</select>
						</label>
						{field.state.meta.errors.length !== 0 && (
							<div className="flex flex-col">
								{field.state.meta.errors.flat().map((x, i) => (
									<div key={i} className="fieldset-label text-error">
										{x}
									</div>
								))}
							</div>
						)}
					</>
				)}
			/>
			<Resize />
		</div>
	);
}
