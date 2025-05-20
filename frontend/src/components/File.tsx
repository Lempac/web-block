import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import Editor from "@monaco-editor/react";
import Resize from "./Resize";
import { $api, fetchClient, getLanguage } from "@/bootstrap";
import { type CustomNodeType } from "@/index";
import { useForm, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

export type FileNode = Node<Record<never, never>, "file">;

export default function File({
	positionAbsoluteX,
	positionAbsoluteY,
	width,
	height,
	id,
}: NodeProps<FileNode>) {
	const theme = useMediaQuery("(prefers-color-scheme: dark)")
		? "dark"
		: "light";
	const queryClient = useQueryClient();
	const { getIntersectingNodes } = useReactFlow<CustomNodeType>();
	const { data: block, isSuccess } = $api.useQuery(
		"get",
		"/api/blocks/{block}",
		{
			params: {
				path: {
					block: Number(id.split("-")[1]),
				},
			},
		},
	);
	const { Field, store, setFieldValue, validateAsync } = useForm({
		defaultValues: block,
		validators: {
			onChangeAsyncDebounceMs: 500,
			onChangeAsync: async ({ value }) => {
				const { error } = await fetchClient.PUT("/api/blocks/{block}", {
					params: {
						path: {
							block: value.id,
						},
					},
					body: value,
				});
				if (error) return { fields: error.errors };
				await queryClient.invalidateQueries({
					queryKey: [
						"get",
						"/api/blocks/{block}",
						`{"params":{"path":{"block":${id}}}}`,
					],
				});

				return null;
			},
		},
	});
	// const x = useStore(store, (state) => state.values.x ?? 0);
	// const y = useStore(store, (state) => state.values.y ?? 0);
	// const w = useStore(store, (state) => state.values.width ?? 0);
	// const h = useStore(store, (state) => state.values.height ?? 0);
	const path = useStore(store, (state) => state.values.path ?? "");
	const hasValues = useStore(store, (state) => state.values !== undefined);
	useEffect(() => {
		// const nodes = getIntersectingNodes({id: id});
		// const folders = nodes.filter((node) => node.type === "folder")
	}, [getIntersectingNodes, id]);
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
		setFieldValue("width", width ?? 0);
		setFieldValue("height", height ?? 0);
		validateAsync("change");
	}, [hasValues, height, isSuccess, setFieldValue, validateAsync, width]);

	return (
		<div className="h-full rounded-box border border-base-300 bg-base-100 p-5 shadow ring-neutral in-[.selected]:ring-4">
			<div className="collapse-arrow collapse rounded-none">
				<Field
					name="path"
					children={(field) => (
						<input
							type="checkbox"
							title={field.state.value ?? "test"}
							className="nodrag"
						/>
					)}
				/>
				<input type="checkbox" className="nodrag" />
				<Field
					name="path"
					children={(field) => (
						<div className="nodrag collapse-title rounded-t-selector border">
							<input
								id={field.name}
								name={field.name}
								type="text"
								value={field.state.value ?? "test title"}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</div>
					)}
				/>
				<Field
					name="content"
					children={(field) => (
						<div className="collapse-content">
							<Editor
								className="nodrag rounded-b-field border"
								theme={`vs-${theme}`}
								value={field.state.value ?? "test test"}
								language={getLanguage(path.split(".")[1] ?? "unkown")}
								onChange={(e) => field.handleChange(e ?? field.state.value)}
							/>
						</div>
					)}
				/>
			</div>
			<Resize />
		</div>
	);
}
