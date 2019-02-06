const lokijs = require("lokijs");
const db = require("./db");
jest.mock("lokijs");

const entries = [{ key: "entryKey", value: "entryValue" }];

describe("db", () => {
  it("should expose the correct api", () => {
    expect(db.entries).toBeDefined();
    expect(db.drop).toBeDefined();
  });

  describe("entries", () => {
    it("should return the existing collection", () => {
      const connection = lokijs.mock.instances[0];
      connection.getCollection.mockReturnValueOnce(entries);

      const result = db.entries();

      expect(connection.getCollection).toHaveBeenCalled();
      expect(result).toEqual(entries);
    });

    it("should add a new collection if the existing collection does not exist", () => {
      const connection = lokijs.mock.instances[0];
      connection.getCollection.mockReturnValueOnce(null);
      connection.addCollection.mockReturnValueOnce(entries);

      const result = db.entries();

      expect(connection.addCollection).toHaveBeenCalled();
      expect(connection.getCollection).toHaveBeenCalled();
      expect(result).toEqual(entries);
    });
  });

  describe("drop", () => {
    it("should remove the collection and return the value", () => {
      const connection = lokijs.mock.instances[0];
      connection.removeCollection.mockReturnValueOnce(null);

      const result = db.drop();

      expect(connection.removeCollection).toHaveBeenCalled();
      expect(result).toEqual(null);
    });
  });
});
