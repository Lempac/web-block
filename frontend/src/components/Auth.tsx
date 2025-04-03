import { Handle, Position } from "@xyflow/react";
import type { Node } from "@xyflow/react";
import { useState } from "react";
import clsx from "clsx";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/bootstrap";

export type AuthNode = Node<Record<never, never>, "auth">;

export default function Auth() {
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
				const { error } = await fetchClient.POST(
					toggle ? "/register" : "/login",
					{
						body: value,
					},
				);
				if (error) return { fields: error.errors };
				queryClient.invalidateQueries({ queryKey: ["get", "/api/user", {}] });
				return null;
			},
		},
	});

	return (
		<form
			className="card bg-base-100 p-4 shadow"
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
					title={toggle ? "To login" : "To register"}
				>
					{toggle ? <><FaArrowLeft /> Login</> : <>Register<FaArrowRight /></>}
				</button>
			</div>

			<fieldset className="fieldset">
				{toggle && (
					<form.Field
						name="name"
						children={(field) => (
							<>
								<label className="floating-label">
									<span className="!scale-100">Name</span>
									<input
										type="text"
										id={field.name}
										name={field.name}
										value={field.state.value}
										placeholder="Enter your name"
										onChange={(e) => field.handleChange(e.target.value)}
										className={clsx(
											"nodrag input input-sm",
											field.state.meta.errors.length !== 0 && "input-error",
										)}
									/>
								</label>
								{field.state.meta.errors.length !== 0 && (
									<div className="flex flex-col">
										{field.state.meta.errors.flat().map((x, i) => (
											<div key={i} className="fieldset-label text-error">{x}</div>
										))}
									</div>
								)}
							</>
						)}
					/>
				)}
				<form.Field
					name="email"
					children={(field) => (
						<>
							<label className="floating-label">
								<span className="!scale-100">Email</span>
								<input
									type="email"
									id={field.name}
									name={field.name}
									value={field.state.value}
									placeholder="Enter your email"
									onChange={(e) => field.handleChange(e.target.value)}
									className={clsx(
										"nodrag input input-sm",
										field.state.meta.errors.length !== 0 && "input-error",
									)}
								/>
							</label>
							{field.state.meta.errors.length !== 0 && (
								<div className="text-error">
									{field.state.meta.errors.flat().map((x, i) => (
										<div key={i} className="flex flex-wrap">{x}</div>
									))}
								</div>
							)}
						</>
					)}
				/>
				<form.Field
					name="password"
					children={(field) => (
						<>
							<label className="floating-label">
								<span className="!scale-100">Password</span>
								<input
									type="password"
									id={field.name}
									name={field.name}
									value={field.state.value}
									placeholder="Enter your password"
									onChange={(e) => field.handleChange(e.target.value)}
									className={clsx(
										"nodrag input input-sm",
										field.state.meta.errors.length !== 0 && "input-error",
									)}
								/>
							</label>
							{field.state.meta.errors.length !== 0 && (
								<div className="flex flex-col">
									{field.state.meta.errors.flat().map((x, i) => (
										<div key={i} className="fieldset-label text-error">{x}</div>
									))}
								</div>
							)}
						</>
					)}
				/>
				{toggle && (
					<form.Field
						name="password_confirmation"
						children={(field) => (
							<>
								<label className="floating-label">
									<span className="!scale-100">Reenter password</span>
									<input
										type="password"
										id={field.name}
										name={field.name}
										value={field.state.value}
										placeholder="Re-enter your password"
										onChange={(e) => field.handleChange(e.target.value)}
										className={clsx(
											"nodrag input input-sm",
											field.state.meta.errors.length !== 0 && "input-error",
										)}
									/>
								</label>
								{field.state.meta.errors.length !== 0 && (
									<div className="flex flex-row text-error">
										{field.state.meta.errors.flat().map((x, i) => (
											<div key={i} className="flex flex-wrap">{x}</div>
										))}
									</div>
								)}
							</>
						)}
					/>
				)}
				<form.Field
					name="remember"
					children={(field) => (
						<label className="fieldset-label">
							<input
								type="checkbox"
								id={field.name}
								name={field.name}
								checked={field.state.value}
								onChange={(e) => field.handleChange(e.currentTarget.checked)}
								className="checkbox"
							/>
							Remember me
						</label>
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
