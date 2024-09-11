// server.js
const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Define the /data route to fetch data from the database
app.get('/data', (req, res) => {
    let sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results); // Send the data as JSON
    });
});

// Define the /add-data route to add data to the database
app.post('/add-data', (req, res) => {
    const { name, cnic, course, grade, gpa} = req.body;
    let sql = 'INSERT INTO students (Name, CNIC, Course, Grade, GPA) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, cnic, course, grade, gpa], (err, results) => {
        if (err) throw err;
        res.send('Data added successfully'); // Send a success message
    });
});

// Delete data from the database
app.delete('/delete-user/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM students WHERE ID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'User deleted successfully' });
    });
});

// Update Data
app.put('/update-user/:id', (req, res) => {
    const id = req.params.id;
    const { name, cnic, course, grade, gpa } = req.body;

    // Create an array to hold the values and another array to hold the SET statements
    let updates = [];
    let values = [];

    // Add fields to be updated
    if (name) {
        updates.push('Name = ?');
        values.push(name);
    }
    if (cnic) {
        updates.push('CNIC = ?');
        values.push(cnic);
    }
    if (course) {
        updates.push('Course = ?');
        values.push(course);
    }
    if (grade) {
        updates.push('Grade = ?');
        values.push(grade);
    }
    if (gpa) {
        updates.push('GPA = ?');
        values.push(gpa);
    }

    // Add the ID to the values array
    values.push(id);

    // Check if there are updates to perform
    if (updates.length > 0) {
        const sql = `UPDATE students SET ${updates.join(', ')} WHERE id = ?`;
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error updating user' });
                return;
            }
            res.json({ message: 'User updated successfully' });
        });
    } else {
        res.status(400).json({ message: 'No fields to update' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});