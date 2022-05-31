const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/", async (req, res) => {
  // extract query string. Make different kinds of SQL statements
  const type = req.query.type;
  const topic = req.query.topic;
  let sqlString = 'SELECT * FROM "books"';

  if (type && topic) {
    sqlString += ` WHERE type = '${type}' AND topic = '${topic}';`;
  } else if (type) {
    sqlString += ` WHERE type = '${type}';`;
  } else if (topic) {
    sqlString += ` WHERE topic = '${topic}';`;
  }
  console.log("get books", sqlString);
  // 1. get data from database table called books
  const result = await db.query(sqlString);
  // 2. send back a response
  res.json({ books: result.rows });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query(`SELECT * FROM "books" WHERE id = ${id};`);
  const book = result.rows[0];
  res.json({ books: book });
});

router.post("/", async (req, res) => {
  const { title, type, author, topic, publicationDate, pages } = req.body;

  const result = await db.query(
    `INSERT INTO "books" (title, type, author, topic, publicationDate, pages) VALUES 
        ('${title}', '${type}', '${author}', '${topic}', '${publicationDate}', '${pages}') returning *`
  );

  res.json({ book: result });
});

module.exports = router;
