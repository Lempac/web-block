import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import Editor from "@monaco-editor/react";
import Resize from "./Resize";
import { getLanguage, pfs } from "@/bootstrap";
import { type CustomNodeType } from "@/index";
import { useForm, useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import mime from "mime";
import Delete from "./Delete";

export type FileNode = Node<Record<never, never>, "file">;

// function isParent(
// 	folder: CustomNodeType | undefined,
// 	id: string | undefined,
// 	get: (id: string) => CustomNodeType | undefined,
// ) {
// 	if (folder === undefined) return false;
// 	if (folder.parentId === id) return true;
// 	else if (folder.parentId !== undefined)
// 		return isParent(get(folder.parentId), id, get);
// 	else return false;
// }

export default function File({
	positionAbsoluteX,
	positionAbsoluteY,
	width,
	height,
	id,
	parentId,
	dragging,
}: NodeProps<FileNode>) {
	const name = id.split("|*|")[0];
	const theme = useMediaQuery("(prefers-color-scheme: dark)")
		? "dark"
		: "light";
	const {
		getIntersectingNodes,
		getNode,
		updateNode,
		getNodes,
		updateNodeData,
	} = useReactFlow<CustomNodeType>();
	const { data, isSuccess } = useQuery({
		queryKey: ["fileData", id],
		queryFn: async () => ({
			path: id.split("|*|")[1]?.split("/").at(-1),
			content: ["text", "json", "yaml"].some((sub) =>
				(mime.getType(id.split("|*|")[1] ?? "txt") ?? "text").includes(sub),
			)
				? await pfs.readFile(`/${id.split("|*|").join("/")}`, "utf8")
				: await pfs.readFile(`/${id.split("|*|").join("/")}`),
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
				// console.log("Running", value);
				await pfs.writeFile(
					`/${name}/.web-block/${id.split("|*|")[1]?.replaceAll("/", "-")}.json`,
					JSON.stringify(value),
				);
				if (path !== "" && path !== value.path) {
					// console.log(path, value.path);
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
	const path = useStore(store, (state) => state.values.path ?? "");
	const hasValues = useStore(store, (state) => state.values !== undefined);
	useEffect(() => {
		// const nodes = getIntersectingNodes({ id: id }, true);
		// const folders = nodes.filter(
		// 	(node) =>
		// 		node.type === "folder" &&
		// 		(parentId === undefined || !isParent(node, parentId, getNode)),
		// );
		// folders.forEach(folder => )
		if (dragging) return;
		// console.log(folders, getNodes())
		// updateNodeData(id, (node) => node.parentId = folders[0]?.id)
	}, [
		dragging,
		getIntersectingNodes,
		getNode,
		getNodes,
		id,
		parentId,
		updateNode,
		updateNodeData,
	]);
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
	// console.log(mime.getType(id.split("|*|")[1] ?? "txt"), test);
	// console.log(
	// 	["text", "json", "yaml"].some((sub) =>
	// 		(mime.getType(id.split("|*|")[1] ?? "txt") ?? "text").includes(sub),
	// 	)
	// 		? `${path} is text`
	// 		: `${path} is image`,
	// );
	if (!isSuccess) return <></>;

	return (
		<div className="h-full max-h-full min-w-80 rounded-box border border-base-300 bg-base-100 p-5 shadow ring-neutral in-[.selected]:ring-4">
			{/* <div className="collapse-arrow collapse rounded-none"> */}
			<Field
				name="path"
				children={(field) => (
					// <div className="">
					<input
						id={field.name}
						name={field.name}
						type="text"
						className="nodrag input absolute -mt-10 rounded-t-selector border"
						value={field.state.value ?? ""}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
					/>
					// </div>
				)}
			/>
			{/* <input type="checkbox" className="nodrag" /> */}
			<Field
				name="content"
				children={(field) => {
					if (field.state.value === undefined) return <></>;
					let imageUrl;
					if (
						(mime.getType(id.split("|*|")[1] ?? "png") ?? "png").includes(
							"image",
						)
					) {
						const blob = new Blob(
							[new Uint8Array(Object.values(field.state.value))],
							{
								type: mime.getType(id.split("|*|")[1] ?? "png") ?? "image/png",
							},
						);
						imageUrl = URL.createObjectURL(blob);
					}
					return (
						<>
							{["text", "json", "yaml"].some((sub) =>
								(mime.getType(id.split("|*|")[1] ?? "txt") ?? "text").includes(
									sub,
								),
							) ? (
								<Editor
									className="nodrag rounded-b-field border border-neutral"
									theme={`vs-${theme}`}
									// width={`400px`}
									//HACK: if faild, check if it is string data
									value={field.state.value as string}
									language={getLanguage(path.split(".")[1] ?? "unkown")}
									onChange={(e) => field.handleChange(e ?? field.state.value)}
								/>
							) : (
								<img
									className="nodrag rounded-b-field border w-fit h-fit"
									alt={path}
									src={imageUrl}
								/>
							)}
						</>
					);
				}}
			/>
			<Resize />
			<Delete parent={id}/>
		</div>
	);
}
