import { Handle, Position } from "@xyflow/react";
import { type Node } from "@xyflow/react";
import { useState } from "react";
import clsx from "clsx";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/bootstrap";
import { useTranslation } from "react-i18next";

export type AuthNode = Node<Record<never, never>, "auth">;

export default function Auth() {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [toggle, setToggle] = useState(false);
	const { Field, Subscribe, handleSubmit } = useForm({
		defaultValues: {
			email: "",
			name: "",
			password: "",
			password_confirmation: "",
			remember: true,
		},
		validators: {
			onSubmitAsync: async ({ value }) => {
				const { error, data } = await fetchClient.POST(
					"/api/login",
					{
						body: value,
					},
				);
				if (error) return { fields: error.errors };
				localStorage.setItem('token', data.token);
				queryClient.invalidateQueries({ queryKey: ["get", "/api/user"] });
				return null;
			},
		},
	});

	return (
		<>
			<Handle
				type="target"
				position={Position.Top}
				className="z-20 p-1 transition-[padding] hover:p-2"
			/>
			<form
				className="card bg-base-100 p-4 shadow"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handleSubmit();
				}}
			>
				<div className={clsx(!toggle && "flex justify-end")}>
					<button
						className="nodrag btn btn-sm"
						onClick={(e) => {
							e.preventDefault();
							setToggle(!toggle);
						}}
						title={
							toggle ? t("auth.login.tooltip") : t("auth.register.tooltip")
						}
					>
						{toggle ? (
							<>
								<FaArrowLeft /> {t("auth.login.title")}
							</>
						) : (
							<>
								{t("auth.register.title")}
								<FaArrowRight />
							</>
						)}
					</button>
				</div>

				<fieldset className="fieldset">
					{toggle && (
						<Field
							name="name"
							children={(field) => (
								<>
									<label className="floating-label">
										<span className="!scale-100">{t("auth.name.title")}</span>
										<input
											type="text"
											id={field.name}
											name={field.name}
											value={field.state.value}
											placeholder={t("auth.name.placeholder")}
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
												<div key={i} className="fieldset-label text-error">
													{x}
												</div>
											))}
										</div>
									)}
								</>
							)}
						/>
					)}
					<Field
						name="email"
						children={(field) => (
							<>
								<label className="floating-label">
									<span className="!scale-100">{t("auth.email.title")}</span>
									<input
										type="email"
										id={field.name}
										name={field.name}
										value={field.state.value}
										placeholder={t("auth.email.placeholder")}
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
											<div key={i} className="flex flex-wrap">
												{x}
											</div>
										))}
									</div>
								)}
							</>
						)}
					/>
					<Field
						name="password"
						children={(field) => (
							<>
								<label className="floating-label">
									<span className="!scale-100">{t("auth.password.title")}</span>
									<input
										type="password"
										id={field.name}
										name={field.name}
										value={field.state.value}
										placeholder={t("auth.password.placeholder")}
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
											<div key={i} className="fieldset-label text-error">
												{x}
											</div>
										))}
									</div>
								)}
							</>
						)}
					/>
					{toggle && (
						<Field
							name="password_confirmation"
							children={(field) => (
								<>
									<label className="floating-label">
										<span className="!scale-100">
											{t("auth.password_confirmation.title")}
										</span>
										<input
											type="password"
											id={field.name}
											name={field.name}
											value={field.state.value}
											placeholder={t("auth.password_confirmation.placeholder")}
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
												<div key={i} className="flex flex-wrap">
													{x}
												</div>
											))}
										</div>
									)}
								</>
							)}
						/>
					)}
					<Field
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
								{t("auth.remember.title")}
							</label>
						)}
					/>
				</fieldset>
				<Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<button
							disabled={!canSubmit || isSubmitting}
							className="nodrag btn mt-3"
							type="submit"
						>
							{toggle ? t("auth.register.title") : t("auth.login.title")}
						</button>
					)}
				/>
			</form>
		</>
	);
}
