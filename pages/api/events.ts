import withErrorHandler from "@/lib/error-handler";
import { createEvent } from "@/lib/services/create-event";
import { listEvents } from "@/lib/services/list-events";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case "GET":
            const result = await listEvents(req.query as any);
            return res.status(200).json({
                ...result,
                success: true,
                message: "Events fetched successfully"
            });
            break;
        case "POST": 
            const event = await createEvent(req.body);
            return res.status(201).json({
                event,
                success: true,
                message: "Event created successfully"
            });
            break;
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default withErrorHandler(handler);