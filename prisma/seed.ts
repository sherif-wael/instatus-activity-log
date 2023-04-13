import { PrismaClient, Action } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const actionNames = [
    "user.logged_in",
    "user.logged_out",
    "user.created_incidence",
    "user.deleted_status_page",
];

async function main() {
    console.log(`Start seeding ...`);

    let actions: Action[]  = [];

    for (let i = 0; i < actionNames.length; i++) {
        actions.push(
            await prisma.action.create({
                data: { name: actionNames[i] }
            })
        );
    }

    const actionsIds = actions.map((action) => action.id);

    await prisma.event.createMany({
        data: Array.from({ length: 100 }).map((_, i) => {
            return {
                action_id: actionsIds[Math.floor(Math.random() * actionsIds.length)],
                actor_name: faker.name.fullName(),
                actor_email: faker.internet.email(),
                actor_id: faker.datatype.uuid().split("-")[0].toUpperCase(),
                target_id: faker.datatype.uuid().split("-")[0].toUpperCase(),
                target_name: faker.name.fullName(),
                group: faker.name.jobArea(),
            };
        }),
    });

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
