import { Prisma } from "@prisma/client";

export const eventActionData = Prisma.validator<Prisma.EventArgs>()({
    select: {
        id: true,
        actor_id: true,
        actor_name: true,
        actor_email: true,
        group: true,
        target_id: true,
        target_name: true,
        location: true,
        metadata: true,
        object: true,
        created_at: true,
        action: {
            select: {
                id: true,
                name: true,
                object: true,
            }
        }
    }
});

export type Event = Prisma.EventGetPayload<typeof eventActionData>;