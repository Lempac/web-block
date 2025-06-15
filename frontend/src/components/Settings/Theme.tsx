import {
	useReactFlow,
	useStore,
	type Node,
	type NodeProps,
} from "@xyflow/react";
import Resize from "../Resize";
import {
	fetchClient,
	INITAL_SETTINGS_WINDOW,
	panelPositionToSet,
	themeToSet,
} from "@/bootstrap";
import { type CustomNodeType } from "@/index";
import { useForm } from "@tanstack/react-form";
import type { components } from "@/api";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import IterToOptions from "../IterToOptions";
import { useEffect } from "react";
import { useUser } from "@/Providers/useUser";

export type ThemeNode = Node<Record<string, never>, "theme">;

export default function Theme({ width, height, id }: NodeProps<ThemeNode>) {
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const { user, setUser, settings, setSettings } = useUser();
	const { getNode } = useReactFlow<CustomNodeType>();
	const { Field } = useForm({
		defaultValues: user?.settings.style,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				setUser({ ...user, settings: { ...user.settings, style: value } });
				const { error } = await fetchClient.PUT("/api/user/style", {
					body: value,
				});
				if (error) return { fields: error.errors };
				queryClient.invalidateQueries({ queryKey: ["get", "/api/user"] });
				return null;
			},
		},
	});

	const position = useStore((state) => state.nodeLookup.get(id)?.position);
	useEffect(() => {
		//HACK: values are 0 on init
		if (width === 0 || height === 0) return;
		setSettings({
			...settings,
			theme: {
				...settings.theme,
				height: height ?? INITAL_SETTINGS_WINDOW.theme.height,
				width: width ?? INITAL_SETTINGS_WINDOW.theme.width,
			},
		});
	}, [getNode, height, id, setSettings, settings, width]);

	useEffect(() => {
		if (!position) return;
		setSettings({
			...settings,
			theme: {
				...settings.theme,
				...position,
			},
		});
	}, [position, setSettings, settings]);

	return (
		<div className="card min-h-max min-w-max gap-2 border-2 bg-base-200/25 p-4 shadow ring-neutral in-[.selected]:ring-4">
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
							<span className="!scale-100">
								{t("settings.theme.baseDarkTheme")}
							</span>
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
									"nodrag select input-sm min-w-auto",
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
							<span className="!scale-100">
								{t("settings.theme.baseLightTheme")}
							</span>
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
							<span className="!scale-100">
								{t("settings.theme.controlPosition")}
							</span>
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
							<span className="!scale-100">
								{t("settings.theme.minimapPosition")}
							</span>
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
							<span className="!scale-100">
								{t("settings.theme.pathPosition")}
							</span>
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
