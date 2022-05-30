import admin = require("firebase-admin");

admin.initializeApp();
export const db = admin.firestore();

module.exports = {
  db,
};
