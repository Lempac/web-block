import { fetchClient } from "@/bootstrap";
import type { CustomNodeType } from "@/index";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { useTranslation } from "react-i18next";
export type UpdatePasswordNode = Node<Record<never, never>, "updatePassword">;

export default function UpdatePassword({ id }: NodeProps<UpdatePasswordNode>) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { deleteElements } = useReactFlow<CustomNodeType>();
	const { Field, Subscribe, handleSubmit } = useForm({
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			newPassword_confirmation: "",
		},
		validators: {
			onSubmitAsync: async ({ value }) => {
				const { error } = await fetchClient.PATCH("/api/user/password", {
					body: value,
				});
				if (error) return { fields: error.errors };
				queryClient.invalidateQueries({
					queryKey: ["get", "/api/user"],
				});
				queryClient.removeQueries({
					queryKey: ["get", "/api/user/repos"],
				});
				queryClient.invalidateQueries({
					queryKey: ["get", "/api/projects"],
				});
				deleteElements({
					nodes: [
						{
							id,
						},
					],
				});
				return null;
			},
		},
	});
	return (
		<div className="grid w-xs gap-2 rounded-box border-2 bg-base-200 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<label className="label">{t("update-password.title")}</label>
			<Field
				name="oldPassword"
				children={(field) => (
					<>
						<label className="floating-label">
							<span>{t("update-password.old-password.label")}</span>
							<input
								id={field.name}
								name={field.name}
								type="password"
								className="nodrag input"
								placeholder={t("update-password.old-password.placeholder")}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
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
				name="newPassword"
				children={(field) => (
					<>
						<label className="floating-label">
							<span>{t("update-password.new-password.label")}</span>
							<input
								id={field.name}
								name={field.name}
								type="password"
								className="nodrag input"
								placeholder={t("update-password.new-password.placeholder")}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
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
				name="newPassword_confirmation"
				children={(field) => (
					<>
						<label className="floating-label">
							<span>{t("update-password.confirm-new-password.label")}</span>
							<input
								id={field.name}
								name={field.name}
								type="password"
								className="nodrag input"
								placeholder={t(
									"update-password.confirm-new-password.placeholder",
								)}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
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
			<div className="flex justify-between">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleSubmit();
					}}
				>
					<Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<button
								disabled={!canSubmit || isSubmitting}
								className="nodrag btn btn-error"
								type="submit"
							>
								{t("update-password.confirm")}
							</button>
						)}
					/>
				</form>
				<button
					className="nodrag btn btn-success"
					onClick={() =>
						deleteElements({
							nodes: [
								{
									id,
								},
							],
						})
					}
				>
					{t("update-password.back")}
				</button>
			</div>
		</div>
	);
}
