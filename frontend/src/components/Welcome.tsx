import { Handle, Position, type Node } from "@xyflow/react";
import icon from "@/assets/favicon.ico";
import { useTranslation } from "react-i18next";

export type WelcomeNode = Node<Record<never, never>, "welcome">;

export default function Welcome() {
	const { t } = useTranslation();

	return (
		<div className="card flex-row bg-base-100 shadow">
			<div className="card-body">
				<h1 className="card-title max-w-fit">{t("welcome.title")}</h1>
				<p className="w-80 pr-1">{t("welcome.description")}</p>
			</div>
			<img src={icon} alt="" className="m-4 -ml-6 size-25 rounded-lg" />
			<Handle
				type="source"
				position={Position.Bottom}
				className="p-1 transition-[padding] hover:p-2"
			/>
		</div>
	);
}
