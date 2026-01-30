import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { Key, Loader2, X } from "lucide-react";
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { authenticateSearchParams } from '@/schema/params';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { forgetPasswordSchema, signInSchema, signUpSchema } from '@/schema/auth';
import { Separator } from '@/components/ui/separator';
import { AuthpageGuard } from '@/middleware/auth';

export const Route = createFileRoute('/_auth/authenticate')({
	async beforeLoad(ctx) {
		await AuthpageGuard()
	},
	validateSearch: authenticateSearchParams,
	component: AuthenticationPage,
})

function AuthenticationPage() {
	const { mode } = Route.useSearch();
	const signInForm = useForm({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
		validators: {
			onSubmit: signInSchema
		},
		async onSubmit({ value }) {
			await authClient.signIn.email({
				email: value.email,
				password: value.password,
				rememberMe: value.rememberMe,
				fetchOptions: {
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
					onSuccess: () => {
						navigate({ to: "/" })
					}
				},
			})
		},
		onSubmitInvalid({ formApi }) {
			const errors = formApi.state.errors;

			Object.entries(errors.flat()[0] as object).map(([key, value]) => {
				value.forEach((element: {
					path: Array<string>;
					message: string;
				}) => {
					toast.error(`${element.path[0].charAt(0).toUpperCase() + element.path[0].substring(1)} : ${element.message}`)
				});
			})
		},
	});

	const signUpForm = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			image: ""
		},
		validators: {
			onSubmit: signUpSchema
		},
		async onSubmit({ value }) {
			await authClient.signUp.email({
				email: value.email,
				password: value.password,
				name: `${value.firstName} ${value.lastName}`,
				image: image ? await convertImageToBase64(image) : "",
				fetchOptions: {
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
					onSuccess: () => {
						toast.success("Verification Email sent successfully! Please check out your email to login to the app")
						navigate({
							to: "/"
						});
					},

				},
			});
		},
		onSubmitInvalid({ formApi }) {
			const errors = formApi.state.errors;

			Object.entries(errors.flat()[0] as object).map(([key, value]) => {
				value.forEach((element: {
					path: Array<string>;
					message: string;
				}) => {
					toast.error(`${element.path[0].charAt(0).toUpperCase() + element.path[0].substring(1)} : ${element.message}`)
				});
			})
		},
	});

	const [loading, setLoading] = useState<number>(0);
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleResetPassword = async () => {
		const email = signInForm.getFieldValue("email");

		const result = forgetPasswordSchema.safeParse({ email });
		if (!result.success) {
			toast.error(result.error.issues[0].message)
			return
		}

		try {
			await authClient.requestPasswordReset({
				email,
				redirectTo: "http://localhost:3000/reset-password"
			})

			toast.success("Reset Password email sent successfully. Please check out your mail!")
		} catch (error: any) {
			toast.error("Something went wrong");
		}
	}

	const handlePasskeyLogin = async () => {
		try {
			await authClient.signIn.passkey({
				fetchOptions: {
					onRequest: () => {
						setLoading(1)
					},
					onResponse: () => {
						setLoading(0)
					},
				},
			})
		} catch (error: any) {
			toast.error("Something went wrong");

		}

	}

	const handleGoogleLogin = async () => {
		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/dashboard",
				fetchOptions: {
					onRequest: () => {
						setLoading(2)
					},
					onResponse: () => {
						setLoading(0)
					},
				},
			})
		} catch (error: any) {
			toast.error("Something went wrong");

		}
	}

	return (
		<div className="flex w-full h-screen flex-row items-center justify-center">
			<Tabs defaultValue="signup" value={mode} className="max-w-md w-full">
				<TabsList>
					<TabsTrigger onClick={() => navigate({
						to: Route.fullPath,
						search: { mode: "login" }
					})} value="login">
						Login
					</TabsTrigger>
					<TabsTrigger onClick={() => navigate({
						to: Route.fullPath,
						search: { mode: "signup" }
					})} value="signup">
						Sign Up
					</TabsTrigger>
				</TabsList>
				<TabsContent value="login" >
					<Card className="max-w-md w-full">
						<CardHeader>
							<CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
							<CardDescription className="text-xs md:text-sm">
								Enter your email below to login to your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={(e) => {
								e.preventDefault()
								signInForm.handleSubmit()
							}}>
								<FieldGroup>
									<signInForm.Field name='email'>
										{(field) => (
											<div className='flex flex-col gap-2'>
												<FieldLabel htmlFor="email">Email</FieldLabel>
												<Input
													id="email"
													type="email"
													placeholder="m@example.com"
													required
													onChange={(e) => {
														field.handleChange(e.target.value)
													}}
													value={field.state.value}
												/>
											</div>
										)}

									</signInForm.Field>


									<signInForm.Field name='password'>
										{(field) => (
											<div className='flex flex-col gap-2'>
												<div className="flex items-center">
													<FieldLabel htmlFor="password">Password</FieldLabel>
													<button
														type='button'
														onClick={() => handleResetPassword()}
														className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
													>
														Forgot your password?
													</button>
												</div>
												<Input
													className=''
													id="password"
													type="password"
													placeholder="password"
													autoComplete="password"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												<signInForm.Field name='rememberMe'>
													{(checkboxField) => (
														<div className="flex items-center gap-2">
															<Checkbox
																id="remember"
																name='rememberMe'
																checked={checkboxField.state.value}
																onCheckedChange={(checked) => {
																	checkboxField.handleChange(checked === true);
																}}
															/>
															<Label htmlFor="remember">Remember me</Label>
														</div>
													)}
												</signInForm.Field>
											</div>
										)}
									</signInForm.Field>

									<signInForm.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
										{([canSubmit, isSubmitting]) => (
											<>
												<Button
													type="submit"
													className="w-full mt-2"
													disabled={isSubmitting}
												>
													{isSubmitting ? (
														<Loader2 size={16} className="animate-spin" />
													) : (
														<p>Login</p>
													)}
												</Button>
												<Separator></Separator>

												<div className="flex flex-col gap-2">

													<Button
														variant="secondary"
														type='button'
														disabled={isSubmitting}
														className="gap-2"
														onClick={() => handlePasskeyLogin()}
													>
														{loading === 1 ? (
															<Loader2 size={16} className="animate-spin" />
														) : (
															<>
																<Key size={16} />
																Sign-in with Passkey
															</>
														)}

													</Button>
													<div className={cn(
														"w-full gap-2 flex items-center",
														"justify-between flex-col"
													)}>
														<Button
															variant="outline"
															className="w-full gap-2"
															type='button'
															disabled={isSubmitting}
															onClick={() => handleGoogleLogin()}
														>
															{loading === 2 ? (
																<Loader2 size={16} className="animate-spin" />
															) : (
																<>
																	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 262">
																		<path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
																		<path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
																		<path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
																		<path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
																	</svg>
																	Sign in with Google
																</>
															)}
														</Button>
													</div>
												</div>
											</>
										)}

									</signInForm.Subscribe>

									<FieldDescription className="text-center">
										Don&apos;t have an account? <Link from={Route.fullPath} search={{ mode: "signup" }} >Sign up</Link>
									</FieldDescription>

								</FieldGroup>
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="signup">
					<Card className="max-w-md w-full">
						<CardHeader>
							<CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
							<CardDescription className="text-xs md:text-sm">
								Enter your information to create an account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={(e) => {
								e.preventDefault()
								signUpForm.handleSubmit()
							}}>
								<FieldGroup>
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<signUpForm.Field name='firstName'>
												{(field) => (
													<>
														<FieldLabel htmlFor="first-name">First name</FieldLabel>
														<Input
															id="first-name"
															placeholder="Max"
															required
															onChange={(e) => {
																field.handleChange(e.target.value);
															}}
															value={field.state.value}
														/>

													</>
												)}
											</signUpForm.Field>
										</div>
										<div className="grid gap-2">

											<signUpForm.Field name='lastName'>
												{(field) => (
													<>
														<FieldLabel htmlFor="last-name">Last name</FieldLabel>
														<Input
															id="last-name"
															placeholder="Robinson"
															required
															onChange={(e) => {
																field.handleChange(e.target.value);
															}}
															value={field.state.value}
														/>

													</>
												)}
											</signUpForm.Field>

										</div>

									</div>
									<signUpForm.Field name='email'>
										{(field) => (
											<div className='flex flex-col gap-2'>
												<FieldLabel htmlFor="email">Email</FieldLabel>
												<Input
													id="email"
													type="email"
													placeholder="m@example.com"
													required
													onChange={(e) => {
														field.handleChange(e.target.value);
													}}
													value={field.state.value}
												/>

											</div>
										)}
									</signUpForm.Field>
									<signUpForm.Field name='password'>
										{(field) => (
											<div className='flex flex-col gap-2'>
												<FieldLabel htmlFor="password">Password</FieldLabel>
												<Input
													id="password"
													type="password"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													autoComplete="new-password"
													placeholder="Password"
												/>
											</div>
										)}

									</signUpForm.Field>

									<signUpForm.Field name='image'>
										{() => (
											<div className='flex flex-col gap-2'>
												<FieldLabel htmlFor="image">Profile Image (optional)</FieldLabel>
												<div className="flex items-end gap-4">
													{imagePreview && (
														<div className="relative w-16 h-16 rounded-sm overflow-hidden">
															<img
																src={imagePreview}
																alt="Profile preview"
																style={{ objectFit: "cover" }}
															/>
														</div>
													)}
													<div className="flex items-center gap-2 w-full">
														<Input
															id="image"
															type="file"
															accept="image/*"
															onChange={handleImageChange}
															className="w-full"
														/>
														{imagePreview && (
															<X
																className="cursor-pointer"
																onClick={() => {
																	setImage(null);
																	setImagePreview(null);
																}}
															/>
														)}
													</div>
												</div>
											</div>
										)}
									</signUpForm.Field>

									<signUpForm.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
										{([canSubmit, isSubmitting]) => (
											<Button
												type="submit"
												className="w-full mt-2"
												disabled={isSubmitting}
											>
												{isSubmitting ? (
													<Loader2 size={16} className="animate-spin" />
												) : (
													"Create your account"
												)}
											</Button>

										)}
									</signUpForm.Subscribe>

									<FieldDescription className="text-center">
										Already have an account? <Link from={Route.fullPath} search={{ mode: "login" }} >Login</Link>
									</FieldDescription>
								</FieldGroup>
							</form>

						</CardContent>
					</Card>
				</TabsContent>
			</Tabs >
		</div >

	)
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}