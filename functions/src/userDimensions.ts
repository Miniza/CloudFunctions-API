import * as functions from "firebase-functions";
import express = require("express");
import {db} from "./admin";
import {firestore} from "firebase-admin";
import {authenticate} from "./authenticate";

const app = express();
const database = db.firestore();

app.use(authenticate);

export const getUserInitScores = app.get("/:id", async (req:any, res:any) => {
  const docRef = database.collection("users").doc(req.params.id);
  try {
    const snapshot = await docRef.collection("InitialTest")
        .doc("initialTest")
        .collection("Dimensions")
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
  const userId = req.body.userId;
  const docRef = database.collection("users").doc(userId);
  const dimensions = req.body.Dimensions;
  try {
    dimensions.forEach((doc:any)=>{
      console.log(doc);
      docRef.collection("InitialTest")
          .doc("initialTest")
          .collection("Dimensions")
          .doc(doc.id)
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

