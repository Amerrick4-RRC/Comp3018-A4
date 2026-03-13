import { db } from "../../../config/firebaseConfig";
import { DocumentReference } from "firebase-admin/firestore";
import * as model from "../models/loanModel"

export const addProject = async (item: model.CreateProject): Promise<model.Project> => {

    const docRef: DocumentReference = db.collection("projects").doc();

    const addition: model.Project = {
        name: item.name,
        status: item.status,
        createdAt: item.createdAt ? item.createdAt : new Date().toISOString(),
        id: docRef.id
    }

    await docRef.set(addition);

    console.log("Project added");
    return addition;
};

export const getProjectById = async (id: string): Promise<model.Project> => {
    const docRef: DocumentReference = db.collection("projects").doc(id);

    const item = await docRef.get();

    if (item.exists) {
        console.log("document found")
        return item.data() as model.Project;
    }
    else {
        console.log("document not found")
        throw new Error("Item not found")
    };
};

export const getAllProjectsList = async (): Promise<model.Project[]> => {
    try {
        const snapshot = await db.collection("projects").get()
        const itemListing: model.Project[] = snapshot.docs.map(doc => ({ ... (doc.data() as model.Project) }))

        return itemListing;
    }
    catch (error) {
        throw new Error("Failed to fetch")
    };
};

export const updateProject = async (id: string, update: Partial<model.CreateProject>): Promise<model.Project> => {
    const docRef: DocumentReference = db.collection("projects").doc(id);

    try {
        const updates = {
            ...update
        };

        await docRef.update(updates);

        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            throw new Error("Project not found");
        }

        return {
            ...(snapshot.data() as model.Project),
            id: snapshot.id
        };

    } catch (error) {
        throw new Error("Project not found");
    }

};

export const deleteProjectById = async (id: string): Promise<void> => {
    const docRef: DocumentReference = db.collection("projects").doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
        console.log("document not found");
        throw new Error("Project not found");
    }

    await docRef.delete();
    console.log("Project deleted")
};