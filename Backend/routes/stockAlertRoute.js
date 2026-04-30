import express from "express";
import { addStockAlert } from "../controller/stockAlertController.js";

const stockAlertRouter = express.Router();

stockAlertRouter.post("/add", addStockAlert);

export default stockAlertRouter;
