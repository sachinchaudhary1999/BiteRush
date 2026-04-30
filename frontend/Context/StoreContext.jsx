// ============================================================
// STORE CONTEXT — Global state for the entire frontend app
// Manages: food list, cart, auth token, coupon discount
// All components that need cart/auth use useContext(StoreContext)
// ============================================================
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  // ---- Backend URL — change this to your deployed URL in production ----
  const url = "http://localhost:4000";

  // ---- State ----
  const [food_list, setFoodList] = useState([]);    // All food items from DB
  const [cartItems, setCartItems] = useState({});   // { itemId: quantity }
  const [token, setToken] = useState("");            // JWT auth token
  const [discount, setDiscount] = useState(0);      // Applied coupon discount (₹)
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Coupon code string

  // ---- Menu categories for WhatsOnYourMind component ----
  // Built dynamically from the food list so it always stays in sync
  const menu_list = [
    { menu_name: "Salad",       menu_image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop" },
    { menu_name: "Rolls",       menu_image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=100&h=100&fit=crop" },
    { menu_name: "Deserts",     menu_image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=100&h=100&fit=crop" },
    { menu_name: "Sandwich",    menu_image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=100&h=100&fit=crop" },
    { menu_name: "Cake",        menu_image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop" },
    { menu_name: "Pure Veg",    menu_image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop" },
    { menu_name: "Pasta",       menu_image: "https://images.unsplash.com/photo-1551183053-bf91798d9f1e?w=100&h=100&fit=crop" },
    { menu_name: "Noodles",     menu_image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop" },
    { menu_name: "Biryani",     menu_image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=100&h=100&fit=crop" },
    { menu_name: "Pizza",       menu_image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=100&h=100&fit=crop" },
    { menu_name: "Burger",      menu_image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" },
  ];

  // ---- Add item to cart ----
  // Updates local state immediately, then syncs to backend if logged in
  const addToCart = async (itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  // ---- Remove one unit of item from cart ----
  const removeFromCart = async (itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 0)
    }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  // ---- Calculate total cart value in USD (backend stores prices in USD) ----
  // Multiply by 80 in UI components to show INR prices
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      if (qty <= 0) return total;
      const item = food_list.find(f => f._id === id);
      return item ? total + item.price * qty : total;
    }, 0);
  };

  // ---- Validate and apply coupon code ----
  // Calls backend to validate — gets discount amount back
  const applyCoupon = async (code) => {
    try {
      const orderAmount = getTotalCartAmount() * 80; // Convert to INR
      const res = await axios.post(url + "/api/coupon/validate", { code, orderAmount });
      if (res.data.success) {
        setDiscount(res.data.discount);
        setAppliedCoupon(code);
        return { success: true, discount: res.data.discount, message: `Coupon applied! ₹${res.data.discount} off` };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch {
      return { success: false, message: "Error validating coupon" };
    }
  };

  // ---- Remove applied coupon ----
  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
  };

  // ---- Fetch all food items from backend ----
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(url + "/api/food/list");
      if (res.data.success) setFoodList(res.data.data);
    } catch (e) {
      console.error("Failed to fetch food list:", e.message);
    }
  };

  // ---- Load saved cart from backend (after login) ----
  const loadCartData = async (tokenObj) => {
    try {
      const res = await axios.post(url + "/api/cart/get", {}, { headers: tokenObj });
      setCartItems(res.data.cartData || {});
    } catch (e) {
      console.error("Failed to load cart:", e.message);
    }
  };

  // ---- On app mount: fetch food list + restore session if token exists ----
  useEffect(() => {
    const init = async () => {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData({ token: savedToken });
      }
    };
    init();
  }, []);

  // ---- All values/functions exposed to child components ----
  const contextValue = {
    url,
    food_list,
    menu_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    discount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
