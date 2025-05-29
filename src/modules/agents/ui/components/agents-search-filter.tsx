import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters"

export const AgentsSearchFilter = () => {
	const [filters, setFilters] = useAgentsFilters()

	return (
		<div className="relative">
			<SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				className="h-9 bg-white w-[200px] pl-7"
				placeholder="Filter agents by name..."
				value={filters.search}
				onChange={(e) => setFilters({ search: e.target.value })}
			/>
		</div>
	)
}
