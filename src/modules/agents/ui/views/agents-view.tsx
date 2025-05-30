"use client"

import { useRouter } from "next/navigation"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

import { DataTable } from "@/components/data-table"
import { columns } from "../components/columns"
import { EmptyState } from "@/components/empty-state"
import { useAgentsFilters } from "../../hooks/use-agents-filters"
import { DataPagination } from "../components/data-pagination"

export const AgentsView = () => {
	const router = useRouter()
	const [filters, setFilters] = useAgentsFilters()

	const trpc = useTRPC()
	const { data } = useSuspenseQuery(
		trpc.agents.getMany.queryOptions({
			...filters,
		}),
	)

	return (
		<div className="flex-1 flex-col pb-4 px-4 md:px-8 flex gap-y-4">
			<DataTable
				data={data.items}
				columns={columns}
				onRowClick={(row) => router.push(`/agents/${row.id}`)}
			/>
			<DataPagination
				page={filters.page}
				totalPages={data.totalPages}
				onPageChange={(page) => setFilters({ page })}
			/>
			{data.items.length === 0 && (
				<EmptyState
					title="Create your first agent"
					description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during th call."
				/>
			)}
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
