"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"

export default function Home() {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const { data: session } = authClient.useSession()

	const handleSignUp = async () => {
		await authClient.signUp.email(
			{ name, email, password },
			{
				onRequest: () => {
					//show loading
				},
				onSuccess: () => {
					//redirect to the dashboard or sign in page
					window.alert(
						"Sign up successful! Please check your email to verify your account.",
					)
				},
				onError: (ctx) => {
					// display the error message
					alert(ctx.error.message)
				},
			},
		)
	}

	const handleSignIn = async () => {
		await authClient.signIn.email(
			{ email, password },
			{
				onRequest: () => {
					//show loading
				},
				onSuccess: () => {
					//redirect to the dashboard or sign in page
					window.alert("Sign in successful!")
				},
				onError: (ctx) => {
					// display the error message
					alert(ctx.error.message)
				},
			},
		)
	}

	if (session) {
		return (
			<div>
				<p>You are signed in! welcome {session.user.name}</p>
				<Button onClick={() => authClient.signOut()}>Sign Out</Button>
			</div>
		)
	}

	return (
		<div>
			<div className="text-3xl font-bold text-green-500">
				<Input
					placeholder="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Input
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button onClick={handleSignUp}>Sign Up</Button>
			</div>
			<div className="text-3xl font-bold text-green-500">
				<Input
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button onClick={handleSignIn}>Sign In</Button>
			</div>
		</div>
	)
}
