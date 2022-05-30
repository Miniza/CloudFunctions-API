import * as functions from "firebase-functions";
import {db} from "./admin";

export const createProfile = async (userRecord:any) => {
  const {email, phoneNumber, uid} = userRecord;

  try {
    return await db.collection("users").doc(uid).set({email, phoneNumber});
  } catch (message) {
    return console.error(message);
  }
};

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile),
};
