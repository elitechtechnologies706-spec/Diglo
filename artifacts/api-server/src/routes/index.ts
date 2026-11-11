import { Router, type IRouter } from "express";
import digloAdminRouter from "./diglo-admin";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(digloAdminRouter);

export default router;
