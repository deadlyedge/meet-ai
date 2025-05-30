import z from "zod"
import { eq, and, getTableColumns, ilike, desc, count, sql } from "drizzle-orm"
import { db } from "@/db"
import { agents, meetings } from "@/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { TRPCError } from "@trpc/server"

import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	MIN_PAGE_SIZE,
} from "@/constants"

import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas"
import { MeetingStatus } from "../types"

export const meetingsRouter = createTRPCRouter({
	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const [removedMeeting] = await db
				.delete(meetings)
				.where(
					and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)),
				)
				.returning()

			if (!removedMeeting) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
			}

			return removedMeeting
		}),
	update: protectedProcedure
		.input(meetingsUpdateSchema)
		.mutation(async ({ input, ctx }) => {
			const [updatedMeeting] = await db
				.update(meetings)
				.set(input)
				.where(
					and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)),
				)
				.returning()

			if (!updatedMeeting) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
			}

			return updatedMeeting
		}),
	create: protectedProcedure
		.input(meetingsInsertSchema)
		.mutation(async ({ input, ctx }) => {
			const [createdMeeting] = await db
				.insert(meetings)
				.values({ ...input, userId: ctx.auth.user.id })
				.returning()

			// TODO: Create Stream Call, upsert stream users

			return createdMeeting
		}),
	getOne: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input, ctx }) => {
			const [existingMeeting] = await db
				.select({
					...getTableColumns(meetings),
					agent: agents,
					duration:
						sql<number>`extract(epoch from (${meetings.endedAt} - ${meetings.startedAt}))`.as(
							"duration",
						),
				})
				.from(meetings)
				.innerJoin(agents, eq(meetings.agentId, agents.id))
				.where(
					and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)),
				)

			if (!existingMeeting) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
			}

			return existingMeeting
		}),
	getMany: protectedProcedure
		.input(
			z.object({
				page: z.number().default(DEFAULT_PAGE),
				pageSize: z
					.number()
					.min(MIN_PAGE_SIZE)
					.max(MAX_PAGE_SIZE)
					.default(DEFAULT_PAGE_SIZE),
				search: z.string().nullish(),
				agentId: z.string().nullish(),
				status: z
					.enum([
						MeetingStatus.Upcoming,
						MeetingStatus.Active,
						MeetingStatus.Completed,
						MeetingStatus.Processing,
						MeetingStatus.Cancelled,
					])
					.nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { search, page, pageSize, status, agentId } = input

			const data = await db
				.select({
					...getTableColumns(meetings),
					agent: agents,
					duration:
						sql<number>`extract(epoch from (${meetings.endedAt} - ${meetings.startedAt}))`.as(
							"duration",
						),
				})
				.from(meetings)
				.innerJoin(agents, eq(meetings.agentId, agents.id))
				.where(
					and(
						eq(meetings.userId, ctx.auth.user.id),
						search ? ilike(meetings.name, `%${search}%`) : undefined,
						status ? eq(meetings.status, status) : undefined,
						agentId ? eq(meetings.agentId, agentId) : undefined,
					),
				)
				.orderBy(desc(meetings.createdAt), desc(meetings.id))
				.limit(pageSize)
				.offset((page - 1) * pageSize)

			const [total] = await db
				.select({ count: count() })
				.from(meetings)
				.innerJoin(agents, eq(meetings.agentId, agents.id))
				.where(
					and(
						eq(meetings.userId, ctx.auth.user.id),
						search ? ilike(meetings.name, `%${search}%`) : undefined,
						status ? eq(meetings.status, status) : undefined,
						agentId ? eq(meetings.agentId, agentId) : undefined,
					),
				)

			const totalPages = Math.ceil(total.count / pageSize)

			// await new Promise((resolve) => setTimeout(resolve, 2000))
			// throw new TRPCError({ code: "BAD_REQUEST" })
			return {
				items: data,
				total: total.count,
				totalPages,
			}
		}),
})
