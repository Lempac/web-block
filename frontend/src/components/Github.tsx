import { Handle, Position, type Node } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { FaGithub } from "react-icons/fa6";

export type GithubNode = Node<Record<never, never>, "github">;

export default function Github() {
	const { t } = useTranslation();
	return (
		<div className="card bg-base-100 shadow card-sm">
			<div className="card-body">
				<a
					className="nodrag btn"
					type="button"
					href={`${import.meta.env.VITE_SERVER_URL}/auth/redirect`}
					title={t("github.title")}
				>
					<FaGithub />
					{t("github.title")}
				</a>
			</div>
			<Handle
				type="source"
				position={Position.Bottom}
				className="p-1 transition-[padding] hover:p-2"
			/>
		</div>
	);
}
