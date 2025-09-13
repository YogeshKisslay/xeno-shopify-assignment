
const prisma = require('../config/db');

// @desc    Get Key Performance Indicators (KPIs)
// @route   GET /api/insights/kpis
const getKpis = async (req, res) => {
  try {
    // 1. Get total revenue by summing the totalPrice of all orders
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    });
    const totalRevenue = totalRevenueResult._sum.totalPrice || 0;

    // 2. Get total number of orders
    const totalOrders = await prisma.order.count();

    // 3. Get total number of customers
    const totalCustomers = await prisma.customer.count();

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
    });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get Top 5 Customers by spend
// @route   GET /api/insights/top-customers
const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await prisma.customer.findMany({
      orderBy: {
        totalSpent: 'desc', // Order by the totalSpent field in descending order
      },
      take: 5, // Limit the result to the top 5
      select: {
        firstName: true,
        lastName: true,
        totalSpent: true,
      },
    });
    res.json(topCustomers);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const getOrdersOverTime = async (req, res) => {
  try {
    // --- THE FIX IS HERE ---
    // We now read the startDate and endDate from the request's query parameters.
    // If they are not provided, we fall back to the last 30 days as a default.
    const { startDate: startDateQuery, endDate: endDateQuery } = req.query;

    const endDate = endDateQuery ? new Date(endDateQuery) : new Date();
    let startDate;

    if (startDateQuery) {
      startDate = new Date(startDateQuery);
    } else {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
    }

    // Use Prisma's raw query feature for powerful date grouping
    const ordersByDay = await prisma.$queryRaw`
      SELECT DATE(processedAt) as date, COUNT(*) as orderCount
      FROM \`orders\`
      WHERE processedAt >= ${startDate} AND processedAt <= ${endDate}
      GROUP BY DATE(processedAt)
      ORDER BY date ASC;
    `;
    
    // Prisma returns BigInt for COUNT(*), so we need to convert it
    const formattedData = ordersByDay.map(row => ({
      date: new Date(row.date).toLocaleDateString('en-CA'), // Format date as YYYY-MM-DD
      count: Number(row.orderCount)
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching orders over time:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
module.exports = {
  getKpis,
  getTopCustomers,
  getOrdersOverTime,
};