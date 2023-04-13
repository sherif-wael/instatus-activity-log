import { prisma } from "../prisma";
import { Parser, Transform } from "json2csv";
import { Readable } from "stream";

export const downloadCSV = async () => {
    const allEvents = await prisma.event.findMany({});

    const stream = new Readable();
    stream.push(JSON.stringify(allEvents));
    stream.push(null);

    const parser = new Transform(
        {
            fields: [
                "id",
                "actor_id",
                "actor_name",
                "actor_email",
                "action.name",
                "action.id",
                "target_id",
                "target_name",
                "created_at",
            ],
        },
        {
            highWaterMark: 16384,
            encoding: "utf-8",
        }
    );

    return stream.pipe(parser);
};
