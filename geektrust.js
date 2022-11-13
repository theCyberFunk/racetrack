var fs = require("fs");
var filename = process.argv[2];
fs.readFile(filename, "utf8", function (err, data) {
    if (err)
        throw err;
    var inputLines = data.toString().split("\n");
    // Add your code here to process input commands
    var bookedBikes = [], bookedCars = [], bookedSuvs = [], firstExit = { hour: 0, minute: 0 }, 
    // latestExit: time = { hour: 0, minute: 0 },
    regularRevenue = 0, vipRevenue = 0;
    for (var _i = 0, inputLines_1 = inputLines; _i < inputLines_1.length; _i++) {
        var line = inputLines_1[_i];
        var lineSplit = line.split(" ");
        if (line.startsWith("BOOK")) {
            var time = lineSplit[3].split(":"), hour = parseInt(time[0]), minute = parseInt(time[1]);
            if (
            // time check
            hour < 13 ||
                hour > 17 ||
                (hour === 17 && minute > 0) // for time between 17:00 and 18:00
            ) {
                console.log("INVALID_ENTRY_TIME");
            }
            else {
                // normal cases : between 13:00 and 17:00
                if (firstExit.hour === 0 ||
                    firstExit.hour > hour + 3 ||
                    (firstExit.hour === hour + 3 && firstExit.minute > minute)) {
                    firstExit.hour = hour + 3;
                    firstExit.minute = minute;
                }
                switch (lineSplit[1]) {
                    case "BIKE":
                        if (bookedBikes.includes(lineSplit[2])) {
                            console.log("DUPLICATE_ENTRY");
                        }
                        else {
                            if (bookedBikes.length < 4) {
                                bookedBikes.push(lineSplit[2]);
                                regularRevenue += 60 * 3;
                                console.log("SUCCESS");
                            }
                            else {
                                console.log("RACETRACK FULL");
                            }
                        }
                        break;
                    case "CAR":
                        if (bookedCars.includes(lineSplit[2])) {
                            console.log("DUPLICATE_ENTRY");
                        }
                        else {
                            if (bookedCars.length < 2) {
                                bookedCars.push(lineSplit[2]);
                                regularRevenue += 120 * 3;
                                console.log("SUCCESS");
                            }
                            else if (bookedCars.length === 2) {
                                bookedCars.push(lineSplit[2]);
                                vipRevenue += 250 * 3;
                                console.log("SUCCESS");
                            }
                            else if (bookedCars.length === 2 && hour > firstExit.hour) {
                                bookedCars.shift();
                                bookedCars.push(lineSplit[2]);
                                regularRevenue += 120 * 3;
                            }
                            else {
                                console.log("RACETRACK FULL");
                            }
                        }
                        break;
                    case "SUV":
                        if (bookedSuvs.includes(lineSplit[2])) {
                            console.log("DUPLICATE_ENTRY");
                        }
                        else {
                            if (bookedSuvs.length < 2) {
                                bookedSuvs.push(lineSplit[2]);
                                regularRevenue += 200 * 3;
                                console.log("SUCCESS");
                            }
                            else if (bookedSuvs.length === 2) {
                                bookedSuvs.push(lineSplit[2]);
                                vipRevenue += 300 * 3;
                                console.log("SUCCESS");
                            }
                            else if (hour > firstExit.hour) {
                                bookedSuvs.shift();
                                bookedSuvs.push(lineSplit[2]);
                                regularRevenue += 200 * 3;
                                console.log("SUCCESS");
                            }
                            else {
                                console.log("RACETRACK FULL");
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        if (line.startsWith("ADDITIONAL")) {
            var time = lineSplit[2].split(":"), hour = parseInt(time[0]), minute = parseInt(time[1]);
            if (hour > 20 || (hour === 20 && minute > 0)) {
                console.log("INVALID_EXIT_TIME");
            }
            else {
                regularRevenue += 50;
                console.log("SUCCESS");
            }
        }
        if (line.startsWith("REVENUE")) {
            console.log("".concat(regularRevenue, " ").concat(vipRevenue));
        }
    }
});
