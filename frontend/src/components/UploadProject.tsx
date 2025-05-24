import { fs } from "@/bootstrap";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Panel, type PanelProps } from "@xyflow/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import git from "isomorphic-git";
import useProjects from "@/Providers/useProjects";
export default function UploadProject({ position }: PanelProps) {
	const { t } = useTranslation();
	const { getProject } = useProjects();
	const { mutateAsync, isPending, isError } = useMutation({
		mutationFn: async () => {
			const project = getProject();
			await git.commit({ fs, dir: `/${project?.name}` });
		},
	});

	//TODO: logic for file changes
	const {data: files} = useQuery({
		queryKey: ['currentProjectStatus'],
		queryFn: async () => git.listFiles({fs, dir: `/${getProject()?.name}`}),
		enabled: getProject() !== undefined
	})
	return (
		<Panel
			className="rounded-field bg-base-300 shadow"
			position={position ?? "top-right"}
		>
			<button
				className={clsx("tooltip btn tooltip-bottom", isError && "btn-error")}
				data-tip={t("upload-project.tooltip")}
				onClick={() => mutateAsync()}
				disabled={files?.length !== 0 || isPending}
			>
				{isPending ? <span className="loading loading-spinner"/> : <RiGitRepositoryCommitsLine />}
			</button>
		</Panel>
	);
}
