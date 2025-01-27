import { Handle, Position, useReactFlow } from "@xyflow/react";
import { FaGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { ProjectCard } from "@/components/ProjectCard.tsx";
import { Project, VisibilityType } from "@/index";
import clsx from "clsx";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useRoute } from "ziggy-js";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

export default function Projects() {
	const route = useRoute();
	const queryClient = useQueryClient();
	const newProject = useForm<Omit<Project, "id">>({
		defaultValues: {
			name: "New project",
			description: "Project with ideas",
			visibility: VisibilityType.Private,
		},
		validators: {
			onSubmitAsync: async ({ value }) => {
				const res = await axios.post(route("projects.store"), value).catch(
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
	const reactFlowInstance = useReactFlow();
	const { data: projects } = useQuery<AxiosResponse<Project[]>, AxiosError>({
		queryKey: ["projects"],
		queryFn: async () => await axios.get(route("projects.index")),
	});
	const toggleSettings = () => {
		if (reactFlowInstance.getNode("settings")) {
			reactFlowInstance.deleteElements({
				nodes: reactFlowInstance
					.getNodes()
					.filter(
						(node) =>
							node.id === "settings" ||
							node.id === "profile" ||
							node.id === "theme",
					),
				edges: [reactFlowInstance.getEdge("settings-projects")!],
			});
		} else {
			reactFlowInstance.addNodes([
				{
					id: "settings",
					type: "settings",
					position: { x: 0, y: 0 },
					data: {},
				},
				{
					id: "profile",
					type: "profile",
					position: { x: 0, y: 0 },
					data: {},
					parentId: "settings",
					extent: "parent",
					expandParent: false,
				},
				{
					id: "theme",
					type: "theme",
					position: { x: 0, y: 0 },
					data: {},
					parentId: "settings",
					extent: "parent",
					expandParent: false,
				},
			]);
			reactFlowInstance.addEdges({
				id: "settings-projects",
				source: "settings",
				target: "projects",
			});
		}
	};

	return (
		<div className="card gap-2 bg-base-content p-4">
			<div className="navbar rounded-2xl bg-base-100 p-4">
				<h1 className="navbar-start text-2xl font-bold">Projects</h1>
				<div className="navbar-end gap-2">
					<button
						className="nodrag btn"
						onClick={toggleSettings}
						title="Settings"
					>
						<FaGear />
					</button>
					<button
						className="nodrag btn btn-info"
						onClick={async () => {
							await axios.post(route("logout"));
							await queryClient.resetQueries({ queryKey: ["user"] });
						}}
						title="Logout"
					>
						<FaSignOutAlt />
					</button>
				</div>
			</div>
			<div
				className={clsx(
					"card flex-row gap-2 bg-base-100 p-4",
					// projects?.data && projects.data.length !== 0 && "xl:flex-wrap"
				)}
			>
				{projects?.data?.map((project) => (
					<ProjectCard project={project} key={project.id} />
				))}
				<form
					className="card gap-2 border-2 border-dashed p-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						newProject.handleSubmit();
					}}
				>
					<div className="card-title flex-row">
						<newProject.Field
							name="name"
							children={(field) => (
								<input
									type="text"
									name={field.name}
									onBlur={field.handleBlur}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									className={clsx(
										"nodrag input-bordered input",
										field.state.meta.errors.length !== 0 && "input-error",
									)}
								/>
							)}
						/>
						{newProject.state.errors}
						<newProject.Field
							name="visibility"
							children={(field) => (
								<button
									className={clsx(
										"nodrag btn btn-info",
										field.state.value === VisibilityType.Private &&
											"border-2 btn-outline",
									)}
									onClick={() =>
										field.setValue(
											field.state.value === VisibilityType.Private
												? VisibilityType.Public
												: VisibilityType.Private,
										)
									}
								>
									{field.state.value == VisibilityType.Public ? (
										<MdVisibility />
									) : (
										<MdVisibilityOff />
									)}
								</button>
							)}
						/>
						<newProject.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<button
									type="submit"
									className="nodrag btn px-2 btn-outline btn-success"
									disabled={!canSubmit || isSubmitting}
									title="Create project"
								>
									<IoIosAdd size="2em" />
								</button>
							)}
						/>
					</div>
					<newProject.Field
						name="description"
						children={(field) => (
							<textarea
								className="nodrag textarea-bordered textarea"
								defaultValue={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
						)}
					/>
				</form>
			</div>
			<Handle
				type={"target"}
				position={Position.Left}
				className="p-1 transition-[padding] hover:p-2"
			/>
		</div>
	);
}
