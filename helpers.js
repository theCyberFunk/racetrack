const MINIMUM_BOOKING_PERIOD = 3;

module.exports = {
  updateRegularRevenue: (arr, cost, vehicle_number, revenue) => {
    arr.push(vehicle_number);
    revenue = (cost * MINIMUM_BOOKING_PERIOD);
    console.log("SUCCESS");
    return revenue
  },

  updateVipRevenue: (arr, cost, vehicle_number, revenue) => {
    arr.push(vehicle_number);
    revenue = (cost * MINIMUM_BOOKING_PERIOD);
    console.log("SUCCESS");
    return revenue
  },
};
