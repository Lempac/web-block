import type { CustomNodeType } from "@/index";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { useTranslation } from "react-i18next";
export type DeleteProjectNode = Node<
	{ onConfirm: () => void },
	"deleteProject"
>;

export default function DeleteProject({
	id,
	data,
}: NodeProps<DeleteProjectNode>) {
	const { t } = useTranslation();
	const { deleteElements } = useReactFlow<CustomNodeType>();
	return (
		<div className="grid w-xs gap-2 rounded-box border-2 bg-base-200 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<label className="label">{t("delete-project.title")}</label>
			<div className="flex justify-between">
				<button
					className="btn btn-error nodrag"
					onClick={() => {
						data.onConfirm();
						deleteElements({
							nodes: [
								{
									id,
								},
							],
						});
					}}
				>
					{t("delete-project.confirm")}
				</button>
				<button
					className="btn btn-success nodrag"
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
					{t("delete-project.back")}
				</button>
			</div>
		</div>
	);
}
