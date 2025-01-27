import { Button, Input, Textarea } from "@headlessui/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import clsx from "clsx";
import { Project, VisibilityType } from "@/index";
import { useRoute } from "ziggy-js";
import { useForm } from "@tanstack/react-form";
import axios, { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export function ProjectCard({ project }: { project: Project }) {
	const route = useRoute();
	const queryClient = useQueryClient();

	async function deleteCard(id: number) {
		await axios.delete(route("projects.destroy", { project: id }));
		await queryClient.invalidateQueries({ queryKey: ["projects"] });
	}

	const form = useForm({
		defaultValues: project,
		validators: {
			onSubmitAsync: async ({ value }) => {
				const res = await axios
					.patch(route("projects.update", { id: value.id! }), value)
					.catch(
						(
							err: AxiosError<{
								message: string;
								errors: Record<string, string[]>;
							}>,
						) => err,
					);

				if (axios.isAxiosError(res) && res.response) {
					return { fields: res.response.data.errors };
				}

				await queryClient.invalidateQueries({ queryKey: ["projects"] });

				return null;
			},
		},
	});

	return (
		<div className="card gap-2 border p-4">
			<div className="card-title flex-row">
				<form.Field
					name="name"
					children={(field) => (
						<Input
							className="nodrag input-bordered input"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					)}
				/>
				<form.Field
					name="visibility"
					children={(field) => (
						<Button
							className={clsx(
								"nodrag btn btn-info",
								field.state.value === VisibilityType.Private &&
									"border-2 btn-outline",
							)}
							onClick={() =>
								field.state.value === VisibilityType.Private
									? field.setValue(VisibilityType.Public)
									: field.setValue(VisibilityType.Private)
							}
						>
							{field.state.value == VisibilityType.Public ? (
								<MdVisibility />
							) : (
								<MdVisibilityOff />
							)}
						</Button>
					)}
				/>
				<Button
					type="submit"
					className="nodrag btn btn-error btn-outline"
					onClick={() => deleteCard(project.id)}
				>
					<FaTrashCan />
				</Button>
			</div>
			<form.Field
				name="description"
				children={(field) => (
					<Textarea
						className="nodrag textarea-bordered textarea"
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
					/>
				)}
			/>
		</div>
	);
}
