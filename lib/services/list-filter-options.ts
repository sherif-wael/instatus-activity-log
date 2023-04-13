import { prisma } from "../prisma";

export type ListFilterOptionsReturn = Awaited<ReturnType<typeof listFilterOptions>>

export const listFilterOptions = async () => {
    const [allActions, allActors, allTargets] = await prisma.$transaction([
        prisma.action.findMany({}),
        prisma.event.findMany({
            distinct: ["actor_id"],
            select: {
                actor_id: true,
                actor_name: true,
            },
        }),
        prisma.event.findMany({
            distinct: ["target_id"],
            select: {
                target_id: true,
                target_name: true,
            },
        }),
    ]);

    const actionOptions = allActions.map((action) => ({
        label: action.name,
        value: action.id,
    }));

    const actorOptions = allActors.map((event) => ({
        label: event.actor_name,
        value: event.actor_id,
    }));

    const targetOptions = allTargets.map((event) => ({
        label: event.target_name,
        value: event.target_id,
    }));

    return {
        actions: actionOptions,
        actors: actorOptions,
        targets: targetOptions,
    };
};
