import * as functions from "firebase-functions";
import express = require("express");
import {authenticate} from "./authenticate";
/* eslint-disable */
const stripe = require("stripe")(functions.config().stripe.secret_key);
const app = express();

app.use(authenticate);   //If your application is not using auth remove this line

export const stripePaymentSession = app.post("/checkout", async (req: any, res: any) => {
    const session = await stripe.checkout.sessions.create({
     success_url:"https://www.myspecnosuccessurl.com/",
     cancel_url:"https://myspecnocancelurl.com",
     payment_method_types: ["card"],
     mode: "payment",
     line_items: [{
         quantity: req.body.quantity,
         price_data: {
         currency: "usd",
         unit_amount: (100) * 100,  //Reference this using price id from the database
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
});

module.exports = {
    stripePayments: functions.https.onRequest(app),
};

