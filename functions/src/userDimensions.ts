import * as functions from "firebase-functions";
import express = require("express");
import {db} from "./admin";

const app = express();

export const getUserDimension = app.get("/:id", async (req:any, res:any) => {
  const docRef = db.collection("users").doc(req.params.id);
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

export const postUserDimension = app.post("/", async (req:any, res:any) => {
  const userId = req.body.userId;
  const docRef = db.collection("users").doc(userId);
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
          });
      res.status(200).send(JSON.stringify(dimensions));
    });
  } catch (error) {
    functions.logger.log(error);
  }
});

module.exports = {
  dimensions: functions.https.onRequest(app),
};

