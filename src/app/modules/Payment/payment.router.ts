import { Router } from "express";
import { paymentConfirm } from "./payment.controller";


const router = Router();
router.post("/confirmation", paymentConfirm);

export const PaymentRouter = router;