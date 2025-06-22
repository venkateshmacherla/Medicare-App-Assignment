// backend/routes/caretaker.js
router.get('/patients/medications', (req, res) => {
    db.all(
      `SELECT m.*, u.email as patient_email FROM medications m JOIN users u ON m.user_id = u.id`,
      [],
      (err, rows) => {
        res.json(rows);
      }
    );
  });