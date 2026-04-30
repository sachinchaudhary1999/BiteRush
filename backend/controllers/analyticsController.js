import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import restaurantModel from "../models/restaurantModel.js";
import deliveryPartnerModel from "../models/deliveryPartnerModel.js";

const getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalFoods, totalRestaurants, totalPartners, orders] = await Promise.all([
      orderModel.countDocuments({}),
      userModel.countDocuments({}),
      foodModel.countDocuments({}),
      restaurantModel.countDocuments({}),
      deliveryPartnerModel.countDocuments({}),
      orderModel.find({}).sort({ date: -1 }).limit(100),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount * 80), 0);
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
    const pendingOrders = orders.filter(o => o.status === "Food Processing").length;
    const paidOrders = orders.filter(o => o.payment === true).length;

    // Revenue last 7 days
    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = orders.filter(o => {
        const d = new Date(o.date);
        return d.toDateString() === date.toDateString();
      });
      revenueByDay.push({
        date: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, o) => sum + (o.amount * 80), 0),
        orders: dayOrders.length
      });
    }

    res.json({
      success: true,
      data: {
        totalOrders, totalUsers, totalFoods, totalRestaurants, totalPartners,
        totalRevenue, deliveredOrders, pendingOrders, paidOrders,
        revenueByDay,
        recentOrders: orders.slice(0, 10)
      }
    });
  } catch (e) {
    res.json({ success: false, message: "Error: " + e.message });
  }
};

export { getDashboardStats };
