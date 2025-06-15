import type { CustomNodeType } from "@/index";
import { useUser } from "@/Providers/useUser";
import { useForm } from "@tanstack/react-form";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { useTranslation } from "react-i18next";
export type UploadProjectNode = Node<
	{ onConfirm: () => void },
	"uploadProject"
>;

export default function UploadProject({ id }: NodeProps<UploadProjectNode>) {
	const { deleteElements } = useReactFlow<CustomNodeType>();
	const { t } = useTranslation();
	const { user, setUser } = useUser();
	const { Field, Subscribe, handleSubmit } = useForm({
		defaultValues: { name: user.name, email: user.email },
		validators: {
			onSubmitAsync: async ({ value }) => {
				setUser({ ...user, ...value });
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
			<label className="label">{t("upload-project.title")}</label>
			<Field
				name="name"
				children={(field) => (
					<label className="floating-label">
						<span>{t("upload-project.name.label")}</span>
						<input
							id={field.name}
							name={field.name}
							className="nodrag input"
							placeholder={t("upload-project.name.placeholder")}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					</label>
				)}
			/>
			<Field
				name="email"
				children={(field) => (
					<label className="floating-label">
						<span>{t("upload-project.email.label")}</span>
						<input
							id={field.name}
							name={field.name}
							className="nodrag input"
							placeholder={t("upload-project.email.placeholder")}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					</label>
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
							>
								{t("upload-project.confirm")}
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
					{t("upload-project.back")}
				</button>
			</div>
		</div>
	);
}
