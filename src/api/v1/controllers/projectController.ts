import { Request, Response } from "express";
import { HealthCheckResponse } from "../models/healthCheck";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { createNewProject, getByItemId, getAllItems, deleteItemWithId, updateItemById } from "../services/projectServices"
import { CreateProject, CreateLoan } from "../models/loanModel"


export const getProjects = async (req: Request, res: Response) => {
    try {
        const items = await getAllItems();
        res.status(HTTP_STATUS.OK).json({ Listing: "Projects", Count: items.length, data: items });
    }
    catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server Error" });
    }
};

export const getSelectedProject = async (req: Request, res: Response) => {
    try {
        let id = req.params.id as string;
        let result = await getByItemId(id);

        res.status(HTTP_STATUS.OK).json({ Project : result });
    }
    catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server Error" });
    }
};

export const createProject = async (req: Request, res: Response) => {

    try {
        const newProject: CreateLoan = {
            applicant: req.body.applicant,
            amount: req.body.amount
        }
        let result = await createNewProject(newProject);

        res.status(HTTP_STATUS.CREATED).json({ Listing: "Projects", data: result  });
    }
    catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server Error" });
    }
};

export const updateProjectWithId = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    try {
        const change: Partial<CreateProject> = req.body;

        let result = await updateItemById(id, change)
        res.status(HTTP_STATUS.OK).json({ update: result })
    }
    catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: `Could not find ${id}` })
    }
};

export const deleteProjectById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    try {
        await deleteItemWithId(id)
        res.status(HTTP_STATUS.OK).json({message: `Successful deletion of ${id}`})
    }
    catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: `Could not find ${id}` })
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
} 