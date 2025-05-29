"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

export const AgentsView = () => {
	const trpc = useTRPC()
	const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions())

	return (
		<div className="flex flex-col p-4 gap-y-4">
				<h1 className="text-2xl font-bold">Agents</h1>
				{data?.map((agent) => (
					<div key={agent.id}>{agent.name}</div>
				))}
		</div>
	)
}

export const AgentsViewLoading = () => {
	return (
		<LoadingState
			title="Loading agents"
			description="Please wait while we load the agents"
		/>
	)
}

export const AgentsViewError = () => {
	return (
		<ErrorState
			title="Something went wrong"
			description="Please try again later"
		/>
	)
}
