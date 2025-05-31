"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"

export const MeetingsView = () => {
	const trpc = useTRPC()
	const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))

	return (
		<div>{JSON.stringify(data, null, 2)}</div>
	)
}

export const MeetingsViewLoading = () => {
	return (
		<LoadingState
			title="Loading Meetings"
			description="Please wait while we load the Meetings"
		/>
	)
}

export const MeetingsViewError = () => {
	return (
		<ErrorState
			title="Something went wrong"
			description="Please try again later"
		/>
	)
}
