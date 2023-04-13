import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Event, eventActionData } from "../types";

const ListEventsParamsParser = z.object({
    actor_id: z.string().optional(),
    target_id: z.string().optional(),
    action_id: z.number({ coerce: true }).optional(),
    search: z.string().optional(),
    page: z.number({ coerce: true }).optional().default(1),
    limit: z.number({ coerce: true }).optional().default(10),
});

export type ListEventsParams = z.infer<typeof ListEventsParamsParser>;

export type ListEventsReturn = Awaited<ReturnType<typeof listEvents>>;

export const listEvents = async (data: ListEventsParams) => {
    const params = ListEventsParamsParser.parse(data);

    const query: Prisma.EventWhereInput = {
        AND: [
            {
                actor_id: params.actor_id,
            },
            {
                target_id: params.target_id,
            },
            {
                action_id: params.action_id,
            },
            {
                OR: [
                    { actor_id: { contains: params.search } },
                    { actor_name: { contains: params.search } },
                    { actor_email: { contains: params.search } },
                    { action: { name: { contains: params.search } } },
                    { target_id: { contains: params.search } },
                    { target_name: { contains: params.search } },
                ],
            },
        ],
    };

    const [count, events] = await prisma.$transaction([
        prisma.event.count({ where: query }),
        prisma.event.findMany({
            where: query,
            select: eventActionData.select,
            orderBy: {
                created_at: "desc",
            },
            skip: (params.page - 1) * params.limit,
            take: params.limit,
        }),
    ]);

    return {
        events: events as Event[],
        total_count: count,
        has_more: count > params.page * params.limit,
    };
};
