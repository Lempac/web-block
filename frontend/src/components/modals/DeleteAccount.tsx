import { fetchClient } from "@/bootstrap";
import { type CustomNodeType } from "@/index";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { useTranslation } from "react-i18next";
export type DeleteAccountNode = Node<Record<never, never>, "deleteAccount">;

//TODO: Delete account for github.
export default function DeleteAccount({ id }: NodeProps<DeleteAccountNode>) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { deleteElements } = useReactFlow<CustomNodeType>();
	const { Field, Subscribe, handleSubmit } = useForm({
		defaultValues: { password: "" },
		validators: {
			onSubmitAsync: async ({ value }) => {
				const { error } = await fetchClient.DELETE("/api/user", {
					body: value,
				});
				if (error) return { fields: error.errors };
				localStorage.removeItem("token");
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
			<label className="label">{t("delete-account.title")}</label>
			<Field
				name="password"
				children={(field) => (
					<>
						<label className="floating-label">
							<span>{t("delete-account.label")}</span>
							<input
								id={field.name}
								name={field.name}
								className="nodrag input"
								placeholder={t("delete-account.placeholder")}
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
						selector={(state) => [
							state.canSubmit,
							state.isSubmitting,
							state.values.password,
						]}
						children={([canSubmit, isSubmitting, password]) => (
							<button
								disabled={
									(!canSubmit as boolean) ||
									(isSubmitting as boolean) ||
									(typeof password === "string" && password === "")
								}
								className="nodrag btn btn-error"
							>
								{t("delete-account.confirm")}
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
					{t("delete-account.back")}
				</button>
			</div>
		</div>
	);
}
