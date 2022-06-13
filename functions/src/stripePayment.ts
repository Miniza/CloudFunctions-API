import * as functions from "firebase-functions";
import express = require("express");
import {authenticate} from "./authenticate";
import {db} from "./admin";
/* eslint-disable */
const stripe = require("stripe")(functions.config().stripe.secret_key);
const app = express();

app.use(authenticate);   //Remove if not using authentication

export const stripePaymentSession = app.post("/checkout", async (req: any, res: any) => {
  try {
      const session = await stripe.checkout.sessions.create({
          success_url:"https://www.myspecnosuccessurl.com/",
          cancel_url:"https://myspecnocancelurl.com",
          payment_method_types: ["card"],
          mode: "payment",
          shipping_address_collection: {
            allowed_countries: ["US"]
          },
          line_items: [{
            quantity: req.body.quantity,
            price_data: {
            currency: "eur",
            unit_amount: (req.body.price)*100, //100 usd equivalent to 100*100 stripe. 
            product_data: {
              name: "My Product Data"
              }
            }
          }] 
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

module.exports = {
    stripePayments: functions.https.onRequest(app),
    stripeWebhook: functions.https.onRequest(async (req : any, res: any) => {
     // const stripe = require("stripe")(functions.config().stripe.token);
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
        shippingInfo: dataObject.shipping,
        amountTotal: dataObject.amount_total,
      });
    }),
};

