const express = require("express");

const router = express.Router();

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./database/database.sqlite"
  }
});

router.get("/customers", function(req, res) {
  knex("customers").then(data => res.status(200).json(data));
});

router.get("/customers/:id", function(req, res) {
  const params = req.params;
  knex("customers")
    .where("id", params.id)
    .then(data => res.status(200).json(data));
});

router.get("/customers/surnames/:surname", function(req, res) {
  const params = req.params;
  knex("customers")
    .where("surname", params.surname)
    .then(data => res.status(200).json(data));
});

router.post("/customers/", function(req, res) {
  const body = req.body;
  knex("customers").insert({
    title: body.title,
    firstname: body.firstname,
    surname: body.surname,
    email: body.email
  });
});

router.put("/customers/:id", function(req, res) {
  const body = req.body,
    params = req.params;
  knex("reservations")
    .where("id", params.id)
    .update({
      title: body.title,
      firstname: body.firstname,
      surname: body.surname,
      email: body.email
    })
    .then(data => res.status(200).json(data));
});

router.get("/reservations", function(req, res) {
  knex("reservations").then(data => res.status(200).json(data));
});

router.get("/reservations/:id", function(req, res) {
  const params = req.params;
  knex("reservations")
    .where("id", params.id)
    .then(data => res.status(200).json(data));
});

router.post("/reservations/", function(req, res) {
  const body = req.body;
  knex("reservations")
    .insert({
      customer_id: body.customer_id,
      room_id: body.room_id,
      check_in_date: body.check_in_date,
      check_out_date: body.check_out_date,
      room_price: body.room_price
    })
    .then(data => res.status(200).json(data));
});

router.put("/reservations/:id", function(req, res) {
  const body = req.body,
    params = req.params;
  knex("reservations")
    .where("id", params.id)
    .update({
      customer_id: body.customer_id,
      room_id: body.room_id,
      check_in_date: body.check_in_date,
      check_out_date: body.check_out_date,
      room_price: body.room_price
    })
    .then(data => res.status(200).json(data));
});

router.get("/reservations/starting-on/:startDate", (req, res) => {
  const params = req.params;
  knex("reservations")
    .where("check_in_date", params.startDate.split("-").join("/"))
    .then(data => res.status(200).send(data));
});

router.get("/reservations/active-on/:date", (req, res) => {
  const params = req.params;
  const date = req.params.date.split("-").join("/");
  knex("reservations")
    .where("check_in_date", "<=", date)
    .andWhere("check_out_date", ">=", date)
    .then(data => res.status(200).send(data));
});

// get '/reservations'
// TODO: add code here

// get '/reservations/:id'
// TODO: add code here

// delete '/reservations/:id'
// TODO: add code here

// get '/reservations/starting-on/:startDate'
// TODO: add code here

// get '/reservations/active-on/:date'
// TODO: add code here

// post '/reservations'
// EXPECTED JSON Object:
// {
//   customer_id: 1,
//   room_id: 1,
//   check_in_date: '2018-01-20',
//   check_out_date: '2018-01-22',
//   room_price: 129.90
// }
// TODO: add code here

// get `/detailed-invoices'
// TODO: add code here

// get `/reservations/details-between/:from_day/:to_day`
// TODO: add code here

module.exports = router;
