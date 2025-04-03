import { type Node, type NodeProps } from "@xyflow/react";
import Editor from "@monaco-editor/react";
import Resize from "./Resize";
import {
	$api,
	fetchClient,
	getLanguage,
	usePreferredColorScheme,
} from "@/bootstrap";
import { useForm, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export type FileNode = Node<Record<never, never>, "file">;

export default function File({
	positionAbsoluteX,
	positionAbsoluteY,
	id,
}: NodeProps<FileNode>) {
	const theme = usePreferredColorScheme();
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
	const x = useStore(store, (state) => state.values.x ?? 0);
	const y = useStore(store, (state) => state.values.y ?? 0);
	const path = useStore(store, (state) => state.values.path ?? "");
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
	}, [
		all,
		isSuccess,
		positionAbsoluteX,
		positionAbsoluteY,
		setFieldValue,
		validateAsync,
		x,
		y,
	]);
	return (
		<div>
			<div className="collapse-arrow collapse border border-base-300 bg-base-100 p-5">
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
						<div className="nodrag collapse-title border">
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
						<Editor
							className="nodrag collapse-content border"
							height={"700px"}
							width={"1000px"}
							theme={`vs-${theme}`}
							value={field.state.value ?? "test test"}
							language={getLanguage(path.split(".")[1] ?? "unkown")}
							onChange={(e) => field.handleChange(e ?? field.state.value)}
						/>
					)}
				/>
				<Resize />
			</div>
		</div>
	);
}
