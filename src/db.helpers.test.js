const helpers = require("./db.helpers");
const { entriesToObject } = helpers;

const fakeEntry = (key = "fakeKey", value = "fakeValue") => ({
  key,
  value
});

describe("entriesToObject", () => {
  describe("when entries is empty", () => {
    it("should return an empty object", () => {
      const entries = [];

      expect(entriesToObject(entries)).toEqual({});
    });
  });

  describe("when entries has 1 element", () => {
    it("should return an object with that key and value", () => {
      const entries = [fakeEntry()];

      expect(entriesToObject(entries)).toEqual({ fakeKey: ["fakeValue"] });
    });
  });

  describe("when entries has more than 1 element", () => {
    describe("when no part of the key matches", () => {
      it("should merge objects after the key match", () => {
        const entries = [fakeEntry("fake1.deep1"), fakeEntry("fake2.deep2")];

        expect(entriesToObject(entries)).toEqual({
          fake1: { deep1: ["fakeValue"] },
          fake2: { deep2: ["fakeValue"] }
        });
      });
    });

    describe("when some part of the key matches", () => {
      it("should merge objects after the key match", () => {
        const entries = [fakeEntry("fake.deep1"), fakeEntry("fake.deep2")];

        expect(entriesToObject(entries)).toEqual({
          fake: { deep1: ["fakeValue"], deep2: ["fakeValue"] }
        });
      });
    });

    describe("when whole key matches", () => {
      it("should merge object values", () => {
        const entries = [
          fakeEntry("fake.sameDeep", "fakeValue1"),
          fakeEntry("fake.sameDeep", "fakeValue2")
        ];

        expect(entriesToObject(entries)).toEqual({
          fake: { sameDeep: ["fakeValue1", "fakeValue2"] }
        });
      });
    });
  });
});
