import { Request, Response } from "express";
import { HealthCheckResponse } from "../models/healthCheck";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { createNewLoan, getByLoanId, getAllLoans, deleteLoanWithId, updateLoanById } from "../services/projectServices"
import { CreateLoan } from "../models/loanModel"
import { apiKey } from "../../apiK";


export const getLoans = async (req: Request, res: Response) => {
    try {
        const items = await getAllLoans();
        res.status(HTTP_STATUS.OK).json({ Listing: "Loan Applications", Count: items.length, data: items });
    }
    catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not find loan with id ${req.params.id}`,
                code: "LOAN_NOT_FOUND"
            },
            timestamp: new Date().toISOString()
        });
    }
};

export const getSelectedLoan = async (req: Request, res: Response) => {
    try {
        let id = req.params.id as string;
        let result = await getByLoanId(id);

        res.status(HTTP_STATUS.OK).json({ LoanApplication: result });
    }
    catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not find loan with id ${req.params.id}`,
                code: "LOAN_NOT_FOUND"
            },
            timestamp: new Date().toISOString()
        });
    }
};

export const createLoan = async (req: Request, res: Response) => {

    try {
        const newLoan: CreateLoan = {
            applicant: req.body.applicant,
            amount: req.body.amount,
            status: req.body.status
        }
        let result = await createNewLoan(newLoan);

        res.status(HTTP_STATUS.CREATED).json({ Listing: "Loan Applications", data: result });
    }
    catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not create loan`,
                code: "LOAN_NOT_CREATED"
            },
            timestamp: new Date().toISOString()
        });
    }
};

export const updateLoanWithId = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    try {
        const change: Partial<CreateLoan> = req.body;

        let result = await updateLoanById(id, change)
        res.status(HTTP_STATUS.OK).json({ update: result })
    }
    catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: `Could not find ${id}` })
    }
};

export const deleteLoanById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    try {
        await deleteLoanWithId(id)
        res.status(HTTP_STATUS.OK).json({ message: `Successful deletion of ${id}` })
    }
    catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not find loan with id ${req.params.id}`,
                code: "LOAN_NOT_FOUND"
            },
            timestamp: new Date().toISOString()
        });
    }
};

export const getHealth = (req: Request, res: Response): void => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    };
    res.status(HTTP_STATUS.OK).json(healthData)
};

export const signIn = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const firebaseRes = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                })
            }
        );

        const data = await firebaseRes.json();

        // Return error if crud operation fails
        if (!firebaseRes.ok) {
            return res.status(400).json({ error: data.error?.message });
        }

        // Return required data points
        return res.json({
            idToken: data.idToken,
            email: data.email,
            userId: data.localId,
            expiresIn: data.expiresIn,
            refreshToken: data.refreshToken
        });

    } catch (err) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not retrieve sign in data`,
                code: "SIGN_IN_FAILED"
            },
            timestamp: new Date().toISOString()
        });
    }
};
