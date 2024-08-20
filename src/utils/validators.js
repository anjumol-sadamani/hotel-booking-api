const validator = require("validator");

exports.isValidEmail = (email) => {
  return validator.isEmail(email);
};

exports.isValidDate = (dateString) => {
  if (!validator.isDate(dateString, { format: "YYYY-MM-DD" })) {
    return false;
  }

  const inputDate = new Date(dateString);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return inputDate >= currentDate;
};

exports.isValidRoomId = (roomId) => {
  const numRoomId = Number(roomId);
  return Number.isInteger(numRoomId) && numRoomId > 0;
};
