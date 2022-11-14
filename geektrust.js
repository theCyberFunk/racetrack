const fs = require("fs"),
  updateRevenue = require("./helpers").updateRevenue;

const filename = process.argv[2],
  BIKE_REGUlAR_COST_PER_HOUR = 60,
  CAR_REGUlAR_COST_PER_HOUR = 120,
  SUV_REGUlAR_COST_PER_HOUR = 200,
  ADDITIONAL_COST_PER_HOUR = 50,
  CAR_VIP_COST_PER_HOUR = 250,
  SUV_VIP_COST_PER_HOUR = 300,
  MINIMUM_BOOKING_PERIOD = 3,
  MAX_BIKES_ALLOWED = 4,
  MAX_CARS_OR_SUVS_ALLOWED = 2,
  EARLIEST_ENTRY_HOUR = 13,
  LATEST_ENTRY_HOUR = 17,
  LATEST_EXIT_HOUR = 20;

fs.readFile(filename, "utf8", (err, data) => {
  if (err) throw err;
  let inputLines = data.toString().split("\n");
  // Add your code here to process input commands

  let bookedBikes = [],
    bookedCars = [],
    bookedSuvs = [],
    firstExit = { hour: 0, minute: 0 },
    regularRevenue = 0,
    vipRevenue = 0;

  for (const line of inputLines) {
    let lineSplit = line.split(" ");

    if (line.startsWith("BOOK")) {
      let time = lineSplit[3].split(":"),
        hour = parseInt(time[0]),
        minute = parseInt(time[1]),
        vehicleType = lineSplit[1],
        vehicle_number = lineSplit[2];
      if (
        // time check
        hour < EARLIEST_ENTRY_HOUR ||
        hour > LATEST_ENTRY_HOUR ||
        (hour === LATEST_ENTRY_HOUR && minute > 0) // for time between 17:00 and 18:00
      ) {
        console.log("INVALID_ENTRY_TIME");
      } else {
        // normal cases : between 13:00 and 17:00
        if (
          firstExit.hour === 0 ||
          firstExit.hour > hour + MINIMUM_BOOKING_PERIOD ||
          (firstExit.hour === hour + MINIMUM_BOOKING_PERIOD &&
            firstExit.minute > minute)
        ) {
          firstExit.hour = hour + MINIMUM_BOOKING_PERIOD;
          firstExit.minute = minute;
        }

        switch (vehicleType) {
          case "BIKE":
            if (bookedBikes.includes(vehicle_number)) {
              console.log("DUPLICATE_ENTRY");
            } else {
              if (bookedBikes.length < MAX_BIKES_ALLOWED) {
                regularRevenue += updateRevenue(
                  bookedBikes,
                  BIKE_REGUlAR_COST_PER_HOUR,
                  vehicle_number,
                  regularRevenue
                );
              } else {
                console.log("RACETRACK FULL");
              }
            }
            break;
          case "CAR":
            if (bookedCars.includes(vehicle_number)) {
              console.log("DUPLICATE_ENTRY");
            } else {
              if (bookedCars.length < MAX_CARS_OR_SUVS_ALLOWED) {
                regularRevenue += updateRevenue(
                  bookedCars,
                  CAR_REGUlAR_COST_PER_HOUR,
                  vehicle_number,
                  regularRevenue
                );
              } else if (bookedCars.length === MAX_CARS_OR_SUVS_ALLOWED) {
                vipRevenue += updateRevenue(
                  bookedCars,
                  CAR_VIP_COST_PER_HOUR,
                  vehicle_number,
                  vipRevenue
                );
              } else if (
                bookedCars.length === MAX_CARS_OR_SUVS_ALLOWED &&
                hour > firstExit.hour
              ) {
                bookedCars.shift();
                regularRevenue += updateRevenue(
                  bookedCars,
                  CAR_REGUlAR_COST_PER_HOUR,
                  vehicle_number,
                  regularRevenue
                );
              } else {
                console.log("RACETRACK_FULL");
              }
            }
            break;
          case "SUV":
            if (bookedSuvs.includes(vehicle_number)) {
              console.log("DUPLICATE_ENTRY");
            } else {
              if (bookedSuvs.length < MAX_CARS_OR_SUVS_ALLOWED) {
                regularRevenue += updateRevenue(
                  bookedSuvs,
                  SUV_REGUlAR_COST_PER_HOUR,
                  vehicle_number,
                  regularRevenue
                );
              } else if (bookedSuvs.length === MAX_CARS_OR_SUVS_ALLOWED) {
                vipRevenue += updateRevenue(
                  bookedSuvs,
                  SUV_VIP_COST_PER_HOUR,
                  vehicle_number,
                  vipRevenue
                );
              } else if (hour > firstExit.hour) {
                bookedSuvs.shift();
                regularRevenue += updateRevenue(
                  bookedSuvs,
                  SUV_REGUlAR_COST_PER_HOUR,
                  vehicle_number,
                  regularRevenue
                );
              } else {
                console.log("RACETRACK_FULL");
              }
            }
            break;
          default:
            break;
        }
      }
    }

    if (line.startsWith("ADDITIONAL")) {
      let time = lineSplit[2].split(":"),
        hour = parseInt(time[0]),
        minute = parseInt(time[1]);

      if (
        hour > LATEST_EXIT_HOUR ||
        (hour === LATEST_EXIT_HOUR && minute > 0)
      ) {
        console.log("INVALID_EXIT_TIME");
      } else {
        regularRevenue += ADDITIONAL_COST_PER_HOUR;
        console.log("SUCCESS");
      }
    }

    if (line.startsWith("REVENUE")) {
      console.log(`${regularRevenue} ${vipRevenue}`);
    }
  }
});
