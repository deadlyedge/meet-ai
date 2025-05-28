"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OctagonAlertIcon } from "lucide-react"
import { authClient } from "@/lib/auth-client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Alert, AlertTitle } from "@/components/ui/alert"

import { SocialView } from "./social-view"
import { useRouter } from "next/navigation"

const formSchema = z
	.object({
		name: z.string().min(3, "Name must be at least 3 characters long"),
		email: z.string().email(),
		password: z.string().min(1, "Password is required"),
		confirmPassword: z.string().min(1, "Password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})

export const SignUpView = () => {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)
	const [isPending, setIsPending] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		setError(null)
		setIsPending(true)

		authClient.signUp.email(
			{
				name: values.name,
				email: values.email,
				password: values.password,
				callbackURL: "/",
			},
			{
				onSuccess: () => {
					setIsPending(false)
					setError(null)
					form.reset()
					router.push("/")
				},
				onError: ({ error }) => {
					setIsPending(false)
					setError(error.message)
				},
			},
		)
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
							<div className="flex flex-col gap-6">
								<div className="flex flex-col items-center text-center">
									<h1 className="text-2xl font-semibold">
										Let&apos;s get started
									</h1>
									<p className="text-muted-foreground text-balance text-sm">
										Create an account to get started with our services.
									</p>
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="ali buda"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="my@email.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Enter your password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Confirm your password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								{!!error && (
									<Alert className="bg-destructive/10 border-none">
										<OctagonAlertIcon className="!text-destructive h-4 w-4" />
										<AlertTitle>{error}</AlertTitle>
									</Alert>
								)}
								<Button disabled={isPending} type="submit" className="w-full">
									Sign Up
								</Button>
								<div className="text-center text-sm">
									Already have an account?{" "}
									<Link
										href="/sign-in"
										className="underline-offset-4 underline">
										Sign In
									</Link>
								</div>
								<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
									<span className="bg-card text-muted-foreground relative z-10 px-2">
										Or continue with
									</span>
								</div>

								<SocialView
									setError={setError}
									setIsPending={setIsPending}
									isPending={isPending}
								/>
							</div>
						</form>
					</Form>
					<div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
						<Image
							src="/logo.svg"
							alt="logo"
							width={92}
							height={92}
							className="w-20 h-20"
						/>
						<p className="text-2xl font-semibold text-white">Meet.AI</p>
					</div>
				</CardContent>
			</Card>

			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline-offset-4 *:[a]:underline">
				By clicking continue, you agree to our{" "}
				<Link href="/terms">Terms of Service</Link> and{" "}
				<Link href="/privacy">Privacy Policy</Link>.
			</div>
		</div>
	)
}
