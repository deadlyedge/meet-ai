import { ResponsiveDialog } from "@/components/responsive-dialog"
import { AgentForm } from "./agent-form"
import type { AgentGetOne } from "../../types"

type UpdateAgentDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	initialValues: AgentGetOne
}

export const UpdateAgentDialog = ({
	open,
	onOpenChange,
	initialValues
}: UpdateAgentDialogProps) => {
	return (
		<ResponsiveDialog
			title="Edit Agent"
			description="Edit the details of the agent"
			open={open}
			onOpenChange={onOpenChange}>
			<AgentForm
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
				initialValues={initialValues}
			/>
		</ResponsiveDialog>
	)
}
