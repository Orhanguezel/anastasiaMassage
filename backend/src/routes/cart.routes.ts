import { Router } from "express";
import {
  addToCart,
  getUserCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate); 

router.get("/", getUserCart);
router.post("/add", addToCart);
router.patch("/increase/:productId", increaseQuantity);
router.patch("/decrease/:productId", decreaseQuantity);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
