import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTRPC } from "@/trpc/client"
// import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { GeneratedAvatar } from "@/components/generated-avatar"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

import type { AgentGetOne } from "../../types"
import { agentsInsertSchema } from "../../schemas"

type AgentFormProps = {
	onSuccess?: () => void
	onCancel?: () => void
	initialValues?: AgentGetOne
}

export const AgentForm = ({
	onSuccess,
	onCancel,
	initialValues,
}: AgentFormProps) => {
	const trpc = useTRPC()
	// const router = useRouter()
	const queryClient = useQueryClient()

	const createAgent = useMutation(
		trpc.agents.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))

				if (initialValues?.id) {
					await queryClient.invalidateQueries(
						trpc.agents.getOne.queryOptions({ id: initialValues.id }),
					)
				}
				onSuccess?.()
			},
			onError: (error) => {
				toast.error(error.message)

        // TODO: check if error code is "FORBIDDEN", redirect to /upgrade
			},
		}),
	)

	const form = useForm<z.infer<typeof agentsInsertSchema>>({
		resolver: zodResolver(agentsInsertSchema),
		defaultValues: {
			name: initialValues?.name ?? "",
			instructions: initialValues?.instructions ?? "",
		},
	})

	const isEdit = !!initialValues?.id
	const isPending = createAgent.isPending

	const onSubmit = async (values: z.infer<typeof agentsInsertSchema>) => {
		if (isEdit) {
			console.log("TODO: update agent")
		} else {
			createAgent.mutate(values)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-2">
					<GeneratedAvatar
						seed={form.watch("name")}
						variant="botttsNeutral"
						className="border size-16 mx-auto"
					/>
					<FormField
						name="name"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} placeholder="e.g. ali buda" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="instructions"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Instructions</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder="e.g. you are a helpful assistant"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="ml-auto space-x-2">
						{onCancel && (
							<Button
								variant="ghost"
								disabled={isPending}
								type="button"
								onClick={() => onCancel()}>
								Cancel
							</Button>
						)}
						<Button disabled={isPending} type="submit">
							{isEdit ? "Update" : "Create"}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
