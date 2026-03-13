import {addLoan, getLoanById, getAllLoansList, updateLoan, deleteLoanById} from "../repositories/projectsRepository"
import { Loan, CreateLoan } from "../models/loanModel"

export const createNewLoan = async (item: CreateLoan): Promise<Loan> => {
    let results = await addLoan(item);
    return results;
};

export const getByLoanId = async (id: string ): Promise<Loan> => {
    let results = await getLoanById(id);
    return results;
};

export const getAllLoans = async (): Promise<Loan[]> =>{
    let results = await getAllLoansList();
    return results;
};

export const updateLoanById = async (id: string, update: Partial<CreateLoan>): Promise<Loan> => {
    let results = await updateLoan(id, update);
    return results;
};

export const deleteLoanWithId = async (id: string): Promise<void> =>{
    await deleteLoanById(id);
    return;
}