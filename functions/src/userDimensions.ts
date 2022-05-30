import * as functions from "firebase-functions";
import express = require("express");
import {db} from "./admin";

const app = express();
const docRef = db.collection("users").doc("Dnb2JrDpUgN5BEBihbTv9vya97A2");

export const dimension = app.get("/", async (req:any, res:any) => {
  const snapshot = await docRef.collection("dimensions").get();

  const dimensions : any = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    dimensions.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(dimensions));
});

module.exports = {
  dimensions: functions.https.onRequest(app),
};


