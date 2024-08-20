const bookingService = require("./booking-service");
const knex = require("../db/knex");
const logger = require("../utils/logger");

jest.mock("../utils/logger");
jest.mock("../db/knex");

describe("bookingService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should create a booking successfully", async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
        insert: jest.fn().mockResolvedValue([1]),
      };

      const trxMock = jest.fn(() => mockQueryBuilder);
      trxMock.commit = jest.fn();
      trxMock.rollback = jest.fn();
      knex.transaction.mockImplementation((callback) => callback(trxMock));

      const result = await bookingService.createBooking(
        1,
        "test@example.com",
        "2024-08-20"
      );

      expect(result).toBe(1);
      expect(logger.info).toHaveBeenCalledWith("Booking created", {
        bookingId: 1,
        room_id: 1,
        email: "test@example.com",
        booking_date: "2024-08-20",
      });
    });

    it("should throw an error if the room is not available", async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: 1 }),
      };
      const trxMock = jest.fn(() => mockQueryBuilder);
      trxMock.commit = jest.fn();
      trxMock.rollback = jest.fn();
      knex.transaction.mockImplementation((callback) => callback(trxMock));

      await expect(
        bookingService.createBooking(1, "test@example.com", "2023-08-20")
      ).rejects.toThrow("Room is not available for the selected date");

      expect(logger.error).toHaveBeenCalledWith(
        "Error in createBooking",
        expect.any(Object)
      );
    });

    it("should handle database errors", async () => {
      const mockError = new Error("Database error");
      knex.transaction.mockRejectedValue(mockError);

      await expect(
        bookingService.createBooking(1, "test@example.com", "2023-08-20")
      ).rejects.toThrow("Database error");

      expect(logger.error).toHaveBeenCalledWith(
        "Error in createBooking",
        expect.any(Object)
      );
    });
  });
});
