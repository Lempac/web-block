import { type Node, type NodeProps } from "@xyflow/react";
import Resize from "./Resize";
import { useForm, useStore } from "@tanstack/react-form";
import { $api, fetchClient } from "@/bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export type FolderNode = Node<Record<never, never>, "folder">;

export default function Folder({
	positionAbsoluteX,
	positionAbsoluteY,
	width,
	height,
	id,
}: NodeProps<FolderNode>) {
	const queryClient = useQueryClient();
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
		setFieldValue("width", width ?? 0);
		setFieldValue("height", height ?? 0);
		validateAsync("change");
	}, [hasValues, height, isSuccess, setFieldValue, validateAsync, width]);

	return (
		<div className="card h-full min-h-8 min-w-32 rounded-box border border-base-300 bg-base-200/25 p-4 shadow ring-neutral in-[.selected]:ring-4">
			<Field
				name="path"
				children={(field) => (
					<input
						className="nodrag card relative -top-10 max-w-fit border-2 border-base-200 bg-base-300 p-2 text-2xl"
						type="text"
						id={field.name}
						name={field.name}
						value={field.state.value ?? "Unknown state"}
						onChange={(e) => field.handleChange(e.target.value)}
						onBlur={field.handleBlur}
					/>
				)}
			/>
			<Resize />
		</div>
	);
}
