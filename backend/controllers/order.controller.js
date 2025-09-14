import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const orderData = async (req,res) =>{
    const order =req.body;
    try {
        const orderInfo = await Order.create(order); // here data is coming from line no 4
        console.log(orderInfo)
        const userId = orderInfo.userId;
        const courseId = orderInfo.courseId;
        res.status(200).json({message:"Order Details",orderInfo});
        if(orderInfo){
            await Purchase.create({userId,courseId});
        }
    } catch (error) {
        console.log("Error in order ",error);
        res.status(401).json({errors:"Errors in order"})
    }
}