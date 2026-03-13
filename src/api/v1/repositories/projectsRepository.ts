import { db } from "../../../config/firebaseConfig";
import { DocumentReference } from "firebase-admin/firestore";
import * as model from "../models/loanModel"

export const addLoan = async (item: model.CreateLoan): Promise<model.Loan> => {

    const docRef: DocumentReference = db.collection("loans").doc();

    const addition: model.Loan = {
        applicant: item.applicant,
        amount: item.amount,
        status: item.status ?? "pending",
        createdAt: new Date().toISOString(),
        id: docRef.id
    }

    await docRef.set(addition);

    console.log("Loan added");
    return addition;
};

export const getLoanById = async (id: string): Promise<model.Loan> => {
    const docRef: DocumentReference = db.collection("loans").doc(id);

    const item = await docRef.get();

    if (item.exists) {
        console.log("document found")
        return item.data() as model.Loan;
    }
    else {
        console.log("document not found")
        throw new Error("Loan not found")
    };
};

export const getAllLoansList = async (): Promise<model.Loan[]> => {
    try {
        const snapshot = await db.collection("loans").get()
        const itemListing: model.Loan[] = snapshot.docs.map(doc => ({ ... (doc.data() as model.Loan) }))

        return itemListing;
    }
    catch (error) {
        throw new Error("Failed to fetch")
    };
};

export const updateLoan = async (id: string, update: Partial<model.CreateLoan>): Promise<model.Loan> => {
    const docRef: DocumentReference = db.collection("loans").doc(id);

    try {
        const updates = {
            ...update
        };

        await docRef.update(updates);

        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            throw new Error("Loan not found");
        }

        return {
            ...(snapshot.data() as model.Loan),
            id: snapshot.id
        };

    } catch (error) {
        throw new Error("Loan not found");
    }

};

export const deleteLoanById = async (id: string): Promise<void> => {
    const docRef: DocumentReference = db.collection("loans").doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
        console.log("document not found");
        throw new Error("Loan not found");
    }

    await docRef.delete();
    console.log("Loan deleted")
};