"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OctagonAlertIcon } from "lucide-react"

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
import { authClient } from "@/lib/auth-client"

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, "Password is required"),
})

export const SignInView = () => {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)
	const [isPending, setIsPending] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		setError(null)
		setIsPending(true)

		authClient.signIn.email(
			{
				email: values.email,
				password: values.password,
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
									<h1 className="text-2xl font-semibold">Welcome back</h1>
									<p className="text-muted-foreground text-balance text-sm">
										Enter your credentials to access your account
									</p>
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
								{!!error && (
									<Alert className="bg-destructive/10 border-none">
										<OctagonAlertIcon className="!text-destructive h-4 w-4" />
										<AlertTitle>{error}</AlertTitle>
									</Alert>
								)}
								<Button disabled={isPending} type="submit" className="w-full">
									Sign In
								</Button>
								<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
									<span className="bg-card text-muted-foreground relative z-10 px-2">
										Or continue with
									</span>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<Button
										disabled={isPending}
										variant="outline"
										type="button"
										className="w-full">
										Github
									</Button>
									<Button
										disabled={isPending}
										variant="outline"
										type="button"
										className="w-full">
										Google
									</Button>
								</div>
								<div className="text-center text-sm">
									Don&apos;t have an account?{" "}
									<Link
										href="/sign-up"
										className="underline-offset-4 underline">
										Sign Up
									</Link>
								</div>
							</div>
						</form>
					</Form>
					<div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
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
