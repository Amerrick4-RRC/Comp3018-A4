import {addProject, getProjectById, getAllProjectsList, updateProject, deleteProjectById} from "../repositories/projectsRepository"
import { CreateProject, Project } from "../models/loanModel"

export const createNewProject = async (item: CreateProject): Promise<Project> => {
    let results = await addProject(item);
    return results;
};

export const getByItemId = async (id: string ): Promise<Project> => {
    let results = await getProjectById(id);
    return results;
};

export const getAllItems = async (): Promise<Project[]> =>{
    let results = await getAllProjectsList();
    return results;
};

export const updateItemById = async (id: string, update: Partial<CreateProject>): Promise<Project> => {
    let results = await updateProject(id, update);
    return results;
};

export const deleteItemWithId = async (id: string): Promise<void> =>{
    await deleteProjectById(id);
    return;
}