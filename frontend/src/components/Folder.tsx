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
	id,
}: NodeProps<FolderNode>) {
	const queryClient = useQueryClient();
	const { data: block, isSuccess } = $api.useQuery(
		"get",
		"/api/blocks/{block}",
		{
			params: {
				path: {
					block: Number(id),
				},
			},
		},
	);
	const { Field, store, setFieldValue, validateAsync } = useForm(
		{
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
		},
	);
	const x = useStore(store, (state) => state.values.x ?? 0);
	const y = useStore(store, (state) => state.values.y ?? 0);
	const all = useStore(store, (state) => Object.keys(state.values).length);

	useEffect(() => {
		if (!isSuccess || all === 0) return;
		if (x !== positionAbsoluteX) {
			setFieldValue("x", positionAbsoluteX);
			validateAsync("change");
		}

		if (y !== positionAbsoluteY) {
			setFieldValue("y", positionAbsoluteY);
			validateAsync("change");
		}
	}, [all, isSuccess, positionAbsoluteX, positionAbsoluteY, setFieldValue, validateAsync, x, y]);
	
	return (
		<div className="card h-full min-h-8 min-w-32 border-2 border-base-100 p-4 shadow">
			<Field
				name="path"
				children={(field) => (
					<input
						className="nodrag card relative -top-10 max-w-fit border-2 border-base-200 bg-base-300 p-2 text-2xl"
						type="text"
						id={field.name}
						name={field.name}
						value={field.state.value ?? ""}
						onChange={(e) => field.handleChange(e.target.value)}
						onBlur={field.handleBlur}
					/>
				)}
			/>
			<Resize />
		</div>
	);
}
