import withErrorHandler from "@/lib/error-handler";
import { createEvent } from "@/lib/services/create-event";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case "POST": 
            const event = await createEvent(req.body);
            return res.status(201).json({
                event,
                success: true,
                message: "Event created successfully"
            })
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default withErrorHandler(handler);