import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import Resize from "./Resize";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, type MouseEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pfs } from "@/bootstrap";
import type { CustomNodeType } from "..";
import { useTranslation } from "react-i18next";
import { MdOutlineOpenInNew } from "react-icons/md";
import useProjects from "@/Providers/useProjects";
import Delete from "./Delete";

export type FolderNode = Node<Record<never, never>, "folder">;

export default function Folder({
	positionAbsoluteX,
	positionAbsoluteY,
	width,
	height,
	id,
}: NodeProps<FolderNode>) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { getProject, cwd } = useProjects();
	const { updateNode } = useReactFlow<CustomNodeType>();
	
	const name = id.split("|*|")[0];
	const path = id.split("|*|")[1]?.split("/").at(-1);
	// const { data: block, isSuccess } = $api.useQuery(
	// 	"get",
	// 	"/api/blocks/{block}",
	// 	{
	// 		params: {
	// 			path: {
	// 				block: Number(id.split("-")[1]),
	// 			},
	// 		},
	// 	},
	// );
	const openFolder = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
		const project = getProject()!;
		await pfs.writeFile(
			`/${name}/.web-block.json`,
			JSON.stringify({x: project.x, y: project.y, zoom: project.zoom,
				cwd: cwd.endsWith('/') ? `${cwd}${path}` : `${cwd}/${path}`,
			}),
		);
		await queryClient.invalidateQueries({ queryKey: ["getProjects"] });
	};
	const { data, isSuccess } = useQuery({
		queryKey: ["folderData", id],
		queryFn: async () => ({
			path: path,
			...(JSON.parse(
				await pfs.readFile(
					`/${name}/.web-block/${id.split("|*|")[1]?.replaceAll("/", "-")}.json`,
					`utf8`,
				),
			) as { x: number; y: number; width: number; height: number }),
		}),
	});
	const { Field, store, setFieldValue, validateAsync } = useForm({
		defaultValues: data,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				await pfs.writeFile(
					`/${name}/.web-block/${id.split("|*|")[1]?.replaceAll("/", "-")}.json`,
					JSON.stringify(value),
				);
				if (path !== value.path) {
					await pfs.rename(
						`/${name}/.web-block/${id.split("|*|")[1]?.replaceAll("/", "-")}.json`,
						`/${name}/.web-block/${value.path?.replaceAll("/", "-")}.json`,
					);
					await pfs.rename(
						`/${id.split("|*|").join("/")}`,
						`/${name}/${value.path}`,
					);
					updateNode(id, {
						id: `${name}|*|${value.path}`,
					});
				}

				// const { error } = await fetchClient.PUT("/api/blocks/{block}", {
				// 	params: {
				// 		path: {
				// 			block: value.id,
				// 		},
				// 	},
				// 	body: value,
				// });
				// if (error) return { fields: error.errors };

				// await queryClient.invalidateQueries({
				// 	queryKey: [
				// 		"get",
				// 		"/api/blocks/{block}",
				// 		`{"params":{"path":{"block":${id}}}}`,
				// 	],
				// });

				return null;
			},
		},
	});
	const hasValues = useStore(store, (state) => state.values !== undefined);

	useEffect(() => {
		if (!isSuccess || !hasValues) return;
		setFieldValue("x", positionAbsoluteX);
		setFieldValue("y", positionAbsoluteY);
		validateAsync("change");
	}, [
		hasValues,
		isSuccess,
		positionAbsoluteX,
		positionAbsoluteY,
		setFieldValue,
		validateAsync,
	]);

	useEffect(() => {
		if (!isSuccess || !hasValues) return;
		if (width === 0 || height === 0) return;
		setFieldValue("width", width ?? 100);
		setFieldValue("height", height ?? 100);
		validateAsync("change");
	}, [hasValues, height, isSuccess, setFieldValue, validateAsync, width]);

	return (
		<div className="card h-full min-h-8 min-w-32 rounded-box border border-base-300 bg-base-200/25 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<div className="relative -top-10 flex justify-between">
				<Field
					name="path"
					children={(field) => (
						<input
							className="nodrag card max-w-fit border-2 border-base-200 bg-base-300 p-2 text-2xl"
							type="text"
							id={field.name}
							name={field.name}
							value={field.state.value ?? ""}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
						/>
					)}
				/>
				<button
					className="nodrag btn btn-success"
					title={t("folder.title")}
					onClick={(e) => openFolder(e)}
				>
					<MdOutlineOpenInNew size={20} />
				</button>
			</div>
			<Resize />
			<Delete parent={id}/>
		</div>
	);
}
