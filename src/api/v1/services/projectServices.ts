import {addLoan, getLoanById, getAllLoansList, updateLoan, deleteLoanById} from "../repositories/projectsRepository"
import { Loan, CreateLoan } from "../models/loanModel"

export const createNewProject = async (item: CreateLoan): Promise<Loan> => {
    let results = await addLoan(item);
    return results;
};

export const getByItemId = async (id: string ): Promise<Loan> => {
    let results = await getLoanById(id);
    return results;
};

export const getAllItems = async (): Promise<Loan[]> =>{
    let results = await getAllLoansList();
    return results;
};

export const updateItemById = async (id: string, update: Partial<CreateLoan>): Promise<Loan> => {
    let results = await updateLoan(id, update);
    return results;
};

export const deleteItemWithId = async (id: string): Promise<void> =>{
    await deleteLoanById(id);
    return;
}