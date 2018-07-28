const express = require("express");

const router = express.Router();

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./database/database.sqlite"
  }
});

// GET routes

// General

router.get("/:table", (req, res) =>
  knex(req.params.table).then(data => res.status(200).json(data))
);

router.get("/:table/:column/:value", (req, res) => {
  const table = req.params.table,
    column = req.params.column,
    value = req.params.value;
  knex(table)
    .where(column, value)
    .then(data => {
      if (data.length == 0) {
        res.status(404).send("Not found!");
      } else {
        res.status(200).json(data);
      }
    });
});

// Hard-coded

router.get("/reservations/starting-on/:startDate", (req, res) => {
  const startDate = parseDate(req.params.startDate);
  knex("reservations")
    .where("check_in_date", startDate)
    .then(data => res.status(200).send(data));
});

router.get("/reservations/ending-on/:endDate", (req, res) => {
  const endDate = req.params.endDate;
  knex("reservations")
    .where("check_out_date", startDate)
    .then(data => res.status(200).send(data));
});

router.get("/reservations/active-on/:date", (req, res) => {
  const date = req.params.date;
  knex("reservations")
    .where("check_in_date", "<=", date)
    .andWhere("check_out_date", ">=", date)
    .then(data => res.status(200).send(data));
});

router.get("/reservations/details-between/:fromDate/:toDate", (req, res) => {
  const fromDate = req.params.fromDate,
    toDate = req.params.toDate;
  knex("reservations")
    .where("check_out_date", "<=", fromDate)
    .andWhere("check_out_date", ">=", toDate)
    .then(data => res.status(200).send(data));
});

// POST routes

router.post("/:table/", (req, res) => {
  const table = req.params.table,
    body = req.body;
  knex(table)
    .insert(body)
    .then(data => res.status(200).json(data));
});

// PUT methods

// General

router.put("/:table/:column/:value", (req, res) => {
  const table = req.params.table,
    column = req.params.column,
    value = req.params.value,
    body = parseDates(req.body);
  knex(table)
    .where(column, value)
    .update(body)
    .then(data => res.status(200).json(data));
});

// Shared methods

// convert date into appropriate format for DB query
// const parseDate = date => {
//   const dateObj = new Date(Date.parse(date));
//   const year = dateObj.getFullYear(),
//     month = ("0" + (dateObj.getMonth() + 1)).slice(-2),
//     day = ("0" + dateObj.getDate()).slice(-2);
//   return year + "-" + month + "-" + day;
// };

// const parseDates = body => {
//   Object.keys(body).forEach(key => {
//     console.log(body[key]);
//     if (key.toLowerCase().includes("date")) body[key] = parseDate(body[key]);
//   });
//   return body;
// };

// {
//   customer_id: 1,
//   room_id: 1,
//   check_in_date: '2018-01-20',
//   check_out_date: '2018-01-22',
//   room_price: 129.90
// }

module.exports = router;
