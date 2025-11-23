import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

export default function useWishlistContext() {
  return useContext(WishlistContext);
}
