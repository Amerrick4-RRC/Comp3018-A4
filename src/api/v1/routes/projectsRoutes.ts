import express, { Router } from "express";
import {
    getLoans,
    createLoan,
    updateLoanWithId,
    deleteLoanById,
    getHealth,
    getSelectedLoan,
    signIn
} from "../controllers/projectController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";



const router: Router = express.Router();

router.get("/loans",authenticate,isAuthorized({ hasRole: ["admin", "officer", "manager"] }), getLoans);
router.post("/loans",authenticate,isAuthorized({ hasRole: ["admin", "manager"] }), createLoan);
router.get("/loans/:id",authenticate,isAuthorized({ hasRole: ["admin", "officer", "manager"] }), getSelectedLoan);
router.put("/loans/:id",authenticate,isAuthorized({ hasRole: ["admin", "manager"] }), updateLoanWithId);
router.delete("/loans/:id",authenticate,isAuthorized({ hasRole: ["admin"], allowSameUser: true }), deleteLoanById);
router.get("/health", getHealth);
router.post("/auth/signin", signIn)
export default router;