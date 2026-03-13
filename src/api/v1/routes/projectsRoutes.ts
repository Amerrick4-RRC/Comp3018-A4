import express, { Router } from "express";
import {
    getLoans,
    createLoan,
    updateLoanWithId,
    deleteLoanById,
    getHealth,
    getSelectedLoan,
} from "../controllers/projectController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";



const router: Router = express.Router();

router.get("/projects",authenticate,isAuthorized({ hasRole: ["admin", "officer", "manager"] }), getLoans);
router.post("/projects",authenticate,isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }), createLoan);
router.get("/projects/:id",authenticate,isAuthorized({ hasRole: ["admin", "officer", "manager"] }), getSelectedLoan);
router.put("/projects/:id",authenticate,isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }), updateLoanWithId);
router.delete("/projects/:id",authenticate,isAuthorized({ hasRole: ["admin"], allowSameUser: true }), deleteLoanById);
router.get("/health", getHealth);
export default router;