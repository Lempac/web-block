import {
	useReactFlow,
	useStore,
	type Node,
	type NodeProps,
} from "@xyflow/react";
import Resize from "../Resize";
import { allowedLang, fetchClient, INITAL_SETTINGS_WINDOW } from "@/bootstrap";
import { type CustomNodeType } from "@/index";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import type { components } from "@/api";
import clsx from "clsx";
import IterToOptions from "../IterToOptions";
import { useEffect } from "react";
import { useUser } from "@/Providers/useUser";
export type ProfileNode = Node<Record<string, never>, "profile">;

export default function Profile({
	width,
	height,
	id,
	positionAbsoluteX,
	positionAbsoluteY,
}: NodeProps<ProfileNode>) {
	const queryClient = useQueryClient();
	const { user, settings, setSettings, setUser, isSuccess } = useUser();
	const { getNode, addNodes } = useReactFlow<CustomNodeType>();
	const { t } = useTranslation();
	const { Field } = useForm({
		defaultValues: { ...user, password: "" },
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				const valueWithoutPassword: Omit<typeof value, "password"> & {
					password?: string;
				} = value;
				delete valueWithoutPassword.password;
				setUser({
					...valueWithoutPassword,
					settings: {
						...valueWithoutPassword.settings,
						style: user.settings.style,
						keybinds: user.settings.keybinds,
					},
				});
				const { error } = await fetchClient.PUT("/api/user", {
					body: value as components["schemas"]["UpdateUserRequest"],
				});
				if (error) return { fields: error.errors };
				queryClient.invalidateQueries({ queryKey: ["get", "/api/user"] });
				return null;
			},
			onSubmitAsync: async () => {
				const { error } = await fetchClient.DELETE("/api/user");
				if (error) return { fields: error.errors };
			},
		},
	});

	const position = useStore((state) => state.nodeLookup.get(id)?.position);

	useEffect(() => {
		//HACK: values are 0 on init
		if (width === 0 || height === 0) return;
		setSettings({
			...settings,
			profile: {
				...settings.profile,
				height: height ?? INITAL_SETTINGS_WINDOW.profile.height,
				width: width ?? INITAL_SETTINGS_WINDOW.profile.width,
			},
		});
	}, [getNode, height, id, setSettings, settings, width]);

	useEffect(() => {
		if (!position) return;
		setSettings({
			...settings,
			profile: {
				...settings.profile,
				...position,
			},
		});
	}, [position, setSettings, settings]);

	return (
		<div className="card min-w-max gap-2 border-2 bg-base-200/25 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<div className="mb-3">
				<h2 className="absolute -top-6 card-body max-w-fit rounded-box border-2 bg-base-200 p-2 text-2xl">
					{t("settings.profile.name")}
				</h2>
			</div>
			<Field
				name={"name"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">{t("auth.name.title")}</span>
							<input
								type="text"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								className={clsx(
									"nodrag input input-sm",
									field.state.meta.errors.length !== 0 && "input-error",
								)}
							/>
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
				name={"email"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">{t("settings.profile.email")}</span>
							<input
								type="text"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								className={clsx(
									"nodrag input input-sm",
									field.state.meta.errors.length !== 0 && "input-error",
								)}
							/>
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
			<button
				className="btn"
				onClick={() =>
					addNodes({
						id: "updatePassword",
						type: "updatePassword",
						zIndex: 99999,
						data: {},
						position: {
							x: positionAbsoluteX + (width ?? 2) / 2,
							y: positionAbsoluteY + (height ?? 2) / 2,
						},
					})
				}
			>
				{t("settings.profile.password")}
			</button>
			<Field
				name={"settings.lang"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">{t("settings.profile.lang")}</span>
							<select
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={clsx(
									"nodrag select input-sm",
									field.state.meta.errors.length !== 0 && "select-error",
								)}
							>
								<IterToOptions
									iter={new Set(Object.keys(allowedLang)).values()}
								/>
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
				name={"settings.defaultBranch"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">
								{t("settings.profile.defaultBranch")}
							</span>
							<input
								type="text"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								className={clsx(
									"nodrag input input-sm",
									field.state.meta.errors.length !== 0 && "input-error",
								)}
							/>
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
				name={"settings.hideExtensions"}
				children={(field) => (
					<label className="fieldset-label">
						<input
							className="nodrag checkbox"
							type="checkbox"
							id={field.name}
							name={field.name}
							checked={field.state.value}
							onChange={(e) => field.handleChange(e.target.checked)}
							onBlur={field.handleBlur}
						/>
						{t("settings.profile.hideExtensions")}
					</label>
				)}
			/>
			{isSuccess && (
				<button
					className="nodrag btn mb-3 btn-error"
					onClick={() =>
						addNodes({
							id: "deleteAccount",
							type: "deleteAccount",
							zIndex: 99999,
							data: {},
							position: {
								x: positionAbsoluteX + (width ?? 2) / 2,
								y: positionAbsoluteY + (height ?? 2) / 2,
							},
						})
					}
				>
					{t("settings.profile.delete")}
				</button>
			)}
			<Resize />
		</div>
	);
}
