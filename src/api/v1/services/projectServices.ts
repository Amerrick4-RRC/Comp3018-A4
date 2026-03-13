import {addLoan, getProjectById, getAllProjectsList, updateProject, deleteProjectById} from "../repositories/projectsRepository"
import { CreateProject, Project, Loan, CreateLoan } from "../models/loanModel"

export const createNewProject = async (item: CreateLoan): Promise<Loan> => {
    let results = await addLoan(item);
    return results;
};

export const getByItemId = async (id: string ): Promise<Loan> => {
    let results = await getProjectById(id);
    return results;
};

export const getAllItems = async (): Promise<Loan[]> =>{
    let results = await getAllProjectsList();
    return results;
};

export const updateItemById = async (id: string, update: Partial<CreateLoan>): Promise<Loan> => {
    let results = await updateProject(id, update);
    return results;
};

export const deleteItemWithId = async (id: string): Promise<void> =>{
    await deleteProjectById(id);
    return;
}