import * as admin from "firebase-admin";

admin.initializeApp();
export const db = admin;

module.exports = {
  db,
};
