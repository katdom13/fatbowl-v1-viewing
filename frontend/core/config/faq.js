import React, { Fragment } from "react"

const faqs = [
  {
    id: "1",
    q: "What is Fatbowl?",
    a: "Fatbowl is a food delivery website. We provide your favorite comfort food and deliver it to you.",
  },
  {
    id: "2",
    q: "What can I order?",
    a: "Fatbowl offers a variety of products from home-cooked meals, to cured meat and other delicatessens.",
  },
  {
    id: "3",
    q: "Where do you deliver?",
    a: "Fatbowl currently delivers within Metro Manila.",
  },
  {
    id: "4",
    q: "What are your official business hours?",
    a: "Fatbowl office is up everyday, 9AM-5PM, PST",
  },
  {
    id: "5",
    q: "How much is the cost of an order?",
    a: "An order costs the price of the product plus a delivery fee.",
  },
  {
    id: "6",
    q: "How do I contact support?",
    a: (
      <Fragment>
        {"You may contact Fatbowl via the following:"}
        <br />
        {"Email: "}
        <b>hello.fatbowl@gmail.com</b>
        <br />
        {"Mobile: "}
        <b>+63 9174167279</b>
        <br />
        <br />
        {
          "We will attend to your concerns immediately during official business hours."
        }
      </Fragment>
    ),
  },
  {
    id: "7",
    q: "What payment methods are accepted?",
    a: "As of now, Fatbowl accepts payment through PayPal.",
  },
]

export default faqs
