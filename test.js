//Add your tests here
let assert = require("assert"),
  updateRevenue = require("./helpers").updateRevenue;

describe("Helpers", function () {
  describe("updateRevenue helper function", function () {
    it("should return a number", function () {
      assert.equal(typeof updateRevenue([], 1, ""), "number");
    });
  });
});
