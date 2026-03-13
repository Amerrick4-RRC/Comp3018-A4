import express, { Router } from "express";
import {
    getProjects,
    createProject,
    updateProjectWithId,
    deleteProjectById,
    getHealth,
    getSelectedProject,
} from "../controllers/projectController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { setCustomClaims } from "../controllers/adminController";


const router: Router = express.Router();

router.get("/projects",authenticate,isAuthorized({ hasRole: ["admin", "officer", "manager"] }), getProjects);
router.post("/projects",authenticate,isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }), createProject);
router.get("/projects/:id",authenticate,isAuthorized({ hasRole: ["admin", "officer", "manager"] }), getSelectedProject);
router.put("/projects/:id",authenticate,isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }), updateProjectWithId);
router.delete("/projects/:id",authenticate,isAuthorized({ hasRole: ["admin"], allowSameUser: true }), deleteProjectById);
router.get("/health", getHealth);
router.post("/setCustomClaims",authenticate,isAuthorized({ hasRole: ["admin"] }), setCustomClaims);
export default router;