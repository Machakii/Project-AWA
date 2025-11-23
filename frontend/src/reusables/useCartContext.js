import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function useCartContext() {
  return useContext(CartContext);
}
