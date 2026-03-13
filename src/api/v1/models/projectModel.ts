export interface Project {
    id: string,
    name: string,
    status: string,
    createdAt: string
}

export interface CreateProject {
    name: string,
    status: string,
    createdAt?: string
}