const express = require('express');
const db = require('../db/database');
const { authenticate } = require('../middleware/authMiddleware');
const util = require('util'); // <-- Added New Line

const router = express.Router();

// Promisify db.get and db.run (Added New Line)
const dbGet = util.promisify(db.get).bind(db);
const dbRun = util.promisify(db.run).bind(db);

// Protect all routes with authentication middleware
router.use(authenticate);

// GET: Fetch all medications for a user
router.get('/', (req, res) => {
  db.all(
    `SELECT * FROM medications WHERE user_id = ?`,
    [req.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// POST: Add new medication
router.post('/', (req, res) => {
  const { name, dosage, frequency } = req.body;

  const sql = `
    INSERT INTO medications (user_id, name, dosage, frequency, taken_dates)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [req.userId, name, dosage, frequency, JSON.stringify([])],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// PUT: Mark medication as taken for a specific date
router.put("/:id/taken", async (req, res) => {
  const { date } = req.body;
  const { id } = req.params;

  try {
    const medication = await dbGet("SELECT * FROM medications WHERE id = ?", [id]);
    if (!medication) return res.status(404).json({ error: "Medication not found" });

    let takenDates = JSON.parse(medication.taken_dates || "[]");

    if (!takenDates.includes(date)) {
      takenDates.push(date);
      await dbRun(
        "UPDATE medications SET taken_dates = ? WHERE id = ?",
        [JSON.stringify(takenDates), id]
      );
    }

    res.json({ success: true, takenDates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update taken date" });
  }
});

module.exports = router;
