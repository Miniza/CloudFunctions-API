import * as functions from "firebase-functions";
import express = require("express");
import {authenticate} from "./authenticate";
import {db} from "./admin";
/* eslint-disable */
const stripe = require("stripe")(functions.config().stripe.secret_key);
const app = express();
app.use(authenticate);

export const stripePaymentSession = app.post("/", async (req: any, res: any) => {
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: "https://www.myspecnosuccessurl.com/",
      cancel_url: "https://myspecnocancelurl.com",
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {userId: req.user.user_id},
      line_items: [{
        quantity: req.body.quantity,
        price_data: {
          currency: "eur",
          unit_amount: (req.body.price)*100,
          product_data: {name: req.body.productDescription},
        },
      }],
    });
    res.status(200).send({
      id: session.id,
      url: session.url,
    });
    res.redirect(303, session.url);   
  } catch (error) {
    functions.logger.log(error);
  }
});

export const stripeWebhook = async (req : any, res: any) => {
  let event;
  try {
    const whSec = functions.config().stripe.payments_webhook_secret;
    event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        whSec,
    ); 
  } catch (error) {
    console.error("Webhook signature verification failed.");
    return res.sendStatus(400);
  }
  const dataObject = event.data.object;
  await db.firestore().collection("orders").doc().set({
    checkoutSessionId: dataObject.id,
    paymentStatus: dataObject.payment_status,
    amountTotal: dataObject.amount_total,
    userId: dataObject.metadata.userId,
  });
};

module.exports = {
  stripePayments: functions.https.onRequest(app),
  stripeWebhook: functions.https.onRequest(stripeWebhook),
};

