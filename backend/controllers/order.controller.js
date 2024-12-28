//import { errorHandler } from "../utils/error.js";
import Order from "../models/order.model.js";
import { incrementCount } from './count.controller.js';

// ... existing code ...


export const createOrder = async (req, res, next) => {
    try {
      const { content, leadId, userId } = req.body;
  
      if (userId !== req.user.id) {
        return next(
          errorHandler(403, 'You are not allowed to create this comment')
        );
      }
  
      const newOrder = new Order({
        content,
        leadId,
        userId,
      });
      await newOrder.save();
      await incrementCount('orders');

    const sendSSEUpdate = req.app.get('sendSSEUpdate');
    if (sendSSEUpdate) {
      sendSSEUpdate({ type: 'orders' });
    }
  
      res.status(200).json(newOrder);
    } catch (error) {
      next(error);
    }
  };
  export const getLeadOrders = async(req,res,next)=>{
    try {
      const orders = await Order.find({leadId:req.params.leadId}).sort({
        createdAt: -1,
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
//   export const callOrder = async (req,res,next)=>{
//     try {
//       const order =await Order.findById(
//         req.params.orderId);
//         if (!order) {
//           return next(errorHandler(404, 'Order not found'));
//           }
//           const userIndex = order.calls.indexOf(req.user.id);
//           if(userIndex === -1){
//             order.numberOfCalls+=1;
//             order.calls.push(req.user.id);
        
//             }else{
//               order.numberOfCalls-=1;
//               order.calls.splice(userIndex,1);
//               }
//               await comment.save();
//               res.status(200).json(order);
//     } catch (error) {
//       next(error);
//     }
//   }
export const callOrder = async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.orderId);
  
      if (!order) {
        return next(errorHandler(404, "Order not found"));
      }

      const userId = req.user.id;
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const userHistory = order.callHistory.get(userId) || [];

      const recentCalls = userHistory.filter((timestamp) => timestamp >= startOfDay);
  
      if (recentCalls.length >= 10) {
        return next(errorHandler(403, "You have reached the daily call limit for this order."));
      }
  
      // Add the current call to the user's history
      recentCalls.push(now);
      order.callHistory.set(userId, recentCalls);
  
      // Update the order's call count and save
      order.numberOfCalls = Math.min(10,recentCalls.length);
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };
  
  
  export const editOrder= async (req,res,next)=>{
    try {
      const order= await Order.findById(req.params.orderId);
      if (!order) {
        return next(errorHandler(404, 'Comment not found'));
        }
        if(order.userId!==req.user.id && !req.user.isAdmin){
          return next(errorHandler(403,'You are not allowed to edit comment'));
          }
        const editOrder=await Order.findByIdAndUpdate(
          req.params.orderId,
          {
            content:req.body.content,
          },
          {new:true}
        );
        res.status(200).json(editOrder);

    } catch (error) {
      next(error);
    }
  }
  export const deleteOrder =async (req,res,next)=>{
    try {
      const order =await Order.findById(
        req.params.orderId
      )
      if (!order) {
        return next(errorHandler(404, 'Comment not found'));
        }
      if(order.userId!== req.user.id && !req.user.isAdmin){
        return next(errorHandler(403,'You are not allowed to delete comment'));
      }
      await Order.findByIdAndDelete(
        req.params.orderId
      );
      res.status(200).json('Comment deleted successfully');
    } catch (error) {
      next(error);
    }
  }
  export const getorders = async (req, res, next) => {
    if (!req.user.isAdmin)
      return next(errorHandler(403, 'You are not allowed to get all comments'));
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'desc' ? -1 : 1;
      const orders = await Order.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const totalOrders = await Order.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthOrders = await Order.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({ orders, totalOrders, lastMonthOrders });
    } catch (error) {
      next(error);
    }
  };


