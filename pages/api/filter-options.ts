import withErrorHandler from "@/lib/error-handler";
import { listFilterOptions } from "@/lib/services/list-filter-options";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case "GET":
            const result = await listFilterOptions();
            return res.status(200).json({
                ...result,
                success: true,
                message: "Options fetched successfully"
            });
            break;
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default withErrorHandler(handler);