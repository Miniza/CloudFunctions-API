
import * as functions from "firebase-functions";
import {db} from "./admin";

const docRef = db.firestore().collection("users");
export const createProfile = async (userRecord:any) => {
  const {email, displayName, uid} = userRecord;
  try {
    return await docRef.doc(uid).set({email, displayName, uid});
  } catch (message) {
    return console.error(message);
  }
};

export const deleteFirestoreUser = async (userRecord:any) => {
  const {uid} = userRecord;
  try {
    return await docRef.doc(uid).delete();
  } catch (message) {
    return console.error(message);
  }
};

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile),
  deleteFirestoreuser: functions.auth.user().onDelete(deleteFirestoreUser),
};
