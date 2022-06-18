import * as functions from "firebase-functions";
import express = require("express");
import {db} from "./admin";
import {firestore} from "firebase-admin";
import {authenticate} from "./authenticate";

const app = express();
const database = db.firestore();

app.use(authenticate);

export const getUserInitScores = app.get("/", async (req:any, res:any) => {
  const docRef = database.collection("users").doc(req.user.user_id);
  try {
    const snapshot = await docRef.collection("InitialTest")
        .doc("initialTest")
        .collection("Dimensions")
        .doc("ActiveDimensions")
        .collection("AllDimensions")
        .get();
    const dimensions : any = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      dimensions.push({id, ...data});
    });
    res.status(200).send(JSON.stringify(dimensions));
  } catch (error) {
    functions.logger.log(error);
  }
});


export const postUserInitScores = app.post("/", async (req:any, res:any) => {
  const docRef = database.collection("users").doc(req.user.user_id);
  const dimensions = req.body.Dimensions;
  try {
    dimensions.forEach((doc:any)=>{
      docRef.collection("InitialTest")
          .doc("initialTest")
          .collection("Dimensions")
          .doc("ActiveDimensions")
          .collection("AllDimensions")
          .doc()
          .set({
            Name: doc.Name,
            Score: doc.Score,
            Timestamp: firestore.Timestamp.now(),
          });
    });
    res.status(200).send();
  } catch (error) {
    functions.logger.log(error);
  }
});

module.exports = {
  dimensions: functions.runWith({timeoutSeconds: 120}).https.onRequest(app),
};

