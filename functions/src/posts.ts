import * as functions from "firebase-functions";
import express = require("express");
import {db} from "./admin";
import {firestore} from "firebase-admin";

const app = express();
const docRef = db.firestore().collection("posts");

const authorize = (req:any, res: any) => {
  if (req.body.passkey != "specnoholiwordpresspasskey123") {
    res.status(401).send("Unauthorized");
    return;
  }
};

export const getWPPosts = app.get("/", async (req: any, res: any) => {
  /* if (req.params.id != "specnoholiwordpresspasskey123") {
    res.status(401).send("Unauthorized");
    return;
  } */
  try {
    const snapshot = await docRef.get();
    const posts: any = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      posts.push({id, ...data});
    });

    res.status(200).send(JSON.stringify(posts));
  } catch (error) {
    console.log(error);
  }
});

export const publishWPPosts = app.post("/", async (req: any, res: any) => {
  authorize(req, res);
  try {
    await docRef.doc(req.body.postPermalink).set({
      postTitle: req.body.title,
      readDuration: req.body.duration,
      dimensionCategory: req.body.dimension,
      postBody: req.body.postBody,
      imageUrls: req.body.imageLinks,
      videoUrl: req.body.videoLinks,
      Timestamp: firestore.Timestamp.now(),
    });
    res.status(200).send("Post Added Successfully");
  } catch (error) {
    console.log(error);
  }
});

export const deleteWPPost = app.delete("/", async (req: any, res: any) => {
  authorize(req, res);
  try {
    await docRef.doc(req.body.postPermalink).delete();
    res.status(200).send("Post Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  posts: functions.https.onRequest(app),
};
