import * as functions from "firebase-functions";
import express = require("express");
import {db} from "./admin";

const app = express();
const docRef = db.firestore().collection("posts");

export const publishWPPosts = app.post("/", async (req: any, res: any) => {
  if (req.body.passkey != "specnoholiwordpresspasskey123") {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    await docRef.doc(req.body.postPermalink).set({
      postTitle: req.body.title,
      readDuration: req.body.duration,
      dimensionCategory: req.body.dimension,
      postBody: req.body.postBody,
      imageUrls: req.body.imageLinks,
      videoUrl: req.body.videoLinks,
    });
    res.status(200).send("Post Added Successfully");
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  posts: functions.https.onRequest(app),
};
