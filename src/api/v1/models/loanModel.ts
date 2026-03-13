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

export interface Loan {
    id: string,
    applicant: string,
    amount: number,
    status: string,
    createdAt: string
}

export interface CreateLoan {
    applicant: string,
    amount: number
}