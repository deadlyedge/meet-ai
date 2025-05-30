import Link from "next/link"

import {
	ChevronRightIcon,
	TrashIcon,
	PencilIcon,
	MoreVerticalIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type AgentIdViewHeaderProps = {
	agentId: string
	agentName: string
	onEdit: () => void
	onRemove: () => void
}

export const AgentIdViewHeader = ({
	agentId,
	agentName,
	onEdit,
	onRemove,
}: AgentIdViewHeaderProps) => {
	return (
		<div className="flex items-center justify-between">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink className="font-medium text-xl" asChild>
							<Link href="/agents">My Agents</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="text-xl text-foreground font-medium [&>svg]:size-4">
						<ChevronRightIcon />
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbLink
							className="font-medium text-xl text-foreground"
							asChild>
							<Link href={`/agents/${agentId}`}>{agentName}</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Without modal=false, the dropdown menu will be modal, which means it will be rendered in a portal, and will not be able to be closed by clicking outside of it. */}
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon">
						<MoreVerticalIcon className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={onEdit}>
						<PencilIcon className="size-4 mr-2" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onRemove}>
						<TrashIcon className="size-4 mr-2" />
						Remove
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
