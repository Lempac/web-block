import { Handle, Position } from "@xyflow/react";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useRoute } from "ziggy-js";
import { useForm } from "@tanstack/react-form";
import axios, { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function Auth() {
	const route = useRoute();
	const queryClient = useQueryClient();
	const [toggle, setToggle] = useState(false);
	const form = useForm({
		defaultValues: {
			email: "",
			name: "",
			password: "",
			password_confirmation: "",
			remember: true,
		},
		validators: {
			onSubmitAsync: async ({ value }) => {
				const res = await axios
					.post(route(toggle ? "register" : "login"), value)
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
				queryClient.invalidateQueries({ queryKey: ["user"] });
				return null;
			},
		},
	});

	const t = useMemo(() => (toggle ? "To login" : "To register"), [toggle]);
	const t2 = useMemo(
		() => (toggle ? <FaArrowLeft /> : <FaArrowRight />),
		[toggle],
	);
	return (
		<form
			className="form-control card bg-base-300 p-4"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<Handle
				type="target"
				position={Position.Top}
				className="p-1 transition-[padding] hover:p-2"
			/>
			<div className={clsx(!toggle && "flex justify-end")}>
				<button
					className="nodrag btn btn-sm"
					onClick={(e) => {
						e.preventDefault();
						setToggle(!toggle);
					}}
					title={t}
				>
					{t2}
				</button>
			</div>

			<fieldset>
				{toggle && (
					<form.Field
						name="name"
						children={(field) => (
							<div>
								<label htmlFor={field.name} className="label w-min">
									Name:
								</label>
								<input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									type="text"
									className={clsx(
										"input-bordered nodrag input input-sm",
										field.state.meta.errors.length !== 0 && "input-error",
									)}
								/>
								{field.state.meta.errors && (
									<div className="w-fit text-error">
										{field.state.meta.errors}
									</div>
								)}
							</div>
						)}
					/>
				)}
				<form.Field
					name="email"
					children={(field) => (
						<div>
							<label htmlFor={field.name} className="label w-min">
								Email:
							</label>
							<input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								type="email"
								className={clsx(
									"input-bordered nodrag input input-sm",
									field.state.meta.errors.length !== 0 && "input-error",
								)}
							/>
							{field.state.meta.errors && (
								<div className="w-fit text-error">
									{field.state.meta.errors}
								</div>
							)}
						</div>
					)}
				/>
				<form.Field
					name="password"
					children={(field) => (
						<div>
							<label htmlFor={field.name} className="label w-min">
								Password:
							</label>
							<input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								type="password"
								className={clsx(
									"input-bordered nodrag input input-sm",
									field.state.meta.errors.length !== 0 && "input-error",
								)}
							/>
							{field.state.meta.errors && (
								<div className="w-fit text-error">
									{field.state.meta.errors}
								</div>
							)}
						</div>
					)}
				/>
				{toggle && (
					<form.Field
						name="password_confirmation"
						children={(field) => (
							<div>
								<label htmlFor={field.name} className="label w-fit">
									Reenter password:
								</label>
								<input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									type="password"
									className={clsx(
										"input-bordered nodrag input input-sm validator",
										field.state.meta.errors.length !== 0 && "",
									)}
								/>
								{field.state.meta.errors && (
									<div className="w-fit text-error validator-hint">
										{field.state.meta.errors}
									</div>
								)}
							</div>
						)}
					/>
				)}
				<form.Field
					name="remember"
					children={(field) => (
						<div className="mt-2">
							<input
								type="checkbox"
								id={field.name}
								name={field.name}
								className="nodrag checkbox"
								checked={field.state.value}
								onChange={(e) => field.handleChange(e.currentTarget.checked)}
							/>
							<label htmlFor={field.name} className="nodrag ml-1 w-min cursor-pointer">
								Remember Me
							</label>
						</div>
					)}
				/>
			</fieldset>
			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
				children={([canSubmit, isSubmitting]) => (
					<button
						disabled={!canSubmit || isSubmitting}
						className="nodrag btn mt-3"
						type="submit"
					>
						{toggle ? "Register" : "Login"}
					</button>
				)}
			/>
		</form>
	);
}
