import z, { record } from "zod";
import { prisma } from "@/lib/prisma";
import { Event, eventActionData } from "../types";

const EventParser = z.object({
    actor_id: z.string(),
    actor_name: z.string(),
    actor_email: z.string(),
    action_name: z.string(),
    group: z.string(),
    target_id: z.string(),
    target_name: z.string(),
    location: z.string().optional(),
    metadata: record(z.string()).optional(),
});

export type EventCreateInput = z.infer<typeof EventParser>;

export const createEvent = async (data: EventCreateInput): Promise<Event> => {
    const { action_name, ...event } = EventParser.parse(data);

    const action = await prisma.action.upsert({
        where: {
            name: action_name,
        },
        update: {},
        create: {
          name: action_name,
        },
      });

    const newEvent = await prisma.event.create({
        data: {
            ...event,
            action_id: action.id,
        },
        select: eventActionData.select
    }) as Event;

    return newEvent;
};