import { fs } from "@/bootstrap";
import { useMutation } from "@tanstack/react-query";
import {
	Panel,
	useReactFlow,
	useStoreApi,
	type PanelProps,
} from "@xyflow/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import git from "isomorphic-git";
import useProjects from "@/Providers/useProjects";
import type { CustomNodeType } from "..";
import { useUser } from "@/Providers/useUser";
export default function UploadProject({ position }: PanelProps) {
	const { t } = useTranslation();
	const { getProject } = useProjects();
	const { user } = useUser();
	const store = useStoreApi();
	const { addNodes, screenToFlowPosition } = useReactFlow<CustomNodeType>();

	const { mutateAsync, isPending, isError } = useMutation({
		mutationFn: async () => {
			const project = getProject();
			await git.commit({ fs, dir: `/${project?.name}`, author: {name: user.name, email: user.email} });
		},
	});

	//TODO: logic for file changes
	// const { data: files } = useQuery({
	// 	queryKey: ["currentProjectStatus"],
	// 	queryFn: async () => git.listFiles({ fs, dir: `/${getProject()?.name}` }),
	// 	enabled: getProject() !== undefined,
	// });
	return (
		<Panel
			className="rounded-field bg-base-300 shadow"
			position={position ?? "top-right"}
		>
			<button
				className={clsx("tooltip btn tooltip-left", isError && "btn-error")}
				data-tip={t("upload-project.tooltip")}
				onClick={() =>
					(user.name === "" || user.email === "") &&
					addNodes({
						id: "uploadProject",
						type: "uploadProject",
						data: { onConfirm: mutateAsync },
						position: (() => {
							const { domNode } = store.getState();
							const boundingRect = domNode?.getBoundingClientRect();
							if (!boundingRect) return;
							return screenToFlowPosition({
								x: boundingRect.x + boundingRect.width / 2,
								y: boundingRect.y + boundingRect.height / 2,
							});
						})() ?? { x: 0, y: 0 },
					})
				}
				// disabled={files?.length !== 0 || isPending}
			>
				{isPending ? (
					<span className="loading loading-spinner" />
				) : (
					<RiGitRepositoryCommitsLine />
				)}
			</button>
		</Panel>
	);
}
