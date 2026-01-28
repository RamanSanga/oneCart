import express from "express";
import { placeOrder , useOrder , getUserOrder , updateOrderStatus , allOrders} from "../controller/orderController.js";
import { isAuth } from "../middleware/isAuth.js";
import  adminAuth  from "../middleware/adminAuth.js";

const orderRoutes = express.Router();

orderRoutes.post("/placeorder", isAuth, placeOrder);
orderRoutes.post("/useorder" , isAuth , useOrder);
orderRoutes.get("/user", isAuth, getUserOrder);

//for admin
orderRoutes.post("/list" ,adminAuth, allOrders);
orderRoutes.post("/status" , adminAuth , updateOrderStatus);    


export default orderRoutes;