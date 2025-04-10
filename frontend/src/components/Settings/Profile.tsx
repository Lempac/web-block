import type { Node } from "@xyflow/react";
import Resize from "../Resize";
import { $api, allowedLang, fetchClient } from "@/bootstrap";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import type { components } from "@/api";
import clsx from "clsx";
import IterToOptions from "../IterToOptions";

export type ProfileNode = Node<Record<string, never>, "profile">;

export default function Profile() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const { data: user } = $api.useQuery("get", "/api/user");
	const { Field } = useForm({
		defaultValues: { ...user, password: "" },
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				const { error } = await fetchClient.PUT("/api/user", {
					body: value as components["schemas"]["UpdateUserRequest"],
				});
				if (error) return { fields: error.errors };
				queryClient.invalidateQueries({ queryKey: ["get", "/api/user"] });
				return null;
			},
		},
	});

	return (
		<div className="card gap-2 border-2 bg-base-200/25 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<div className="mb-3">
				<h2 className="card absolute -top-6 card-body max-w-fit border-2 bg-base-200 p-2 text-2xl">
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
			<Field
				name={"password"}
				children={(field) => (
					<>
						<label className="floating-label">
							<span className="!scale-100">{t("settings.profile.password")}</span>
							<input
								type="text"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={t("settings.profile.password-placeholder")}
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
								onChange={(e) =>
									field.handleChange(
										e.target.value,
									)
								}
								className={clsx(
									"nodrag select input-sm",
									field.state.meta.errors.length !== 0 && "select-error",
								)}
							>
								<IterToOptions iter={(new Set(Object.keys(allowedLang)).values())} />
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
							<span className="!scale-100">{t("settings.profile.defaultBranch")}</span>
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
			<Resize />
		</div>
	);
}
