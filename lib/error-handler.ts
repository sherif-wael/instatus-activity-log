import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

function withErrorHandler(handler: Handler): Handler {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (error) {
            handleError(error, res);
        }
    }
}

function handleError(error: any, res: NextApiResponse) {
    if(error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: error.message,
            errors: error.format()
        })  
    }

    if(error instanceof Error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}

export default withErrorHandler;