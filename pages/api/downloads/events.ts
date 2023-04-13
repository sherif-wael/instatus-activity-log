import withErrorHandler from "@/lib/error-handler";
import { downloadCSV } from "@/lib/services/download-csv";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case "GET":
            const csv = await downloadCSV();
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=events.csv");
            csv.pipe(res);
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default withErrorHandler(handler);