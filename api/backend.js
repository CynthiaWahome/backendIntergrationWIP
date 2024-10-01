const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const app = express();
const databaseName = 'revisiondb';
const tableName = 'Expenses';

// configure middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));

//connect to db
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect((err) => {
    if(err)console.log(err);
    console.log("Database connected!");
    initialiseDatabase();
});

app.listen(4000,()=>{
    console.log("Server is running on port 4000")
});

// create database
const initialiseDatabase = ()=>{
    const database = `CREATE DATABASE IF NOT EXISTS ${ databaseName }`;
    db.query(database, (err, result)=>{
        if(err) return console.log(err);
        console.log(`Database ${ databaseName } created successfully`);
        useDatabase();
    });
};

const useDatabase = ()=>{
    const useDb = `USE ${ databaseName }`;
    db.query(useDb, (err,result) =>{
        if(err) return console.log(err);
        console.log('Database changed');
        createTable();
    });
};

// create table
const createTable = ()=>{
    const expenseTable = `CREATE TABLE IF NOT EXISTS ${ tableName }(
    id INT PRIMARY KEY AUTO_INCREMENT,
    expenseName VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL
    )`;
    db.query(expenseTable, (err) =>{
        if(err) return console.log(err);
        console.log(`Table ${tableName} created`);
    });
};

// create an endpoint
app.post('/api/addExpense', (req, res) => {
    try {
        const { expenseName, category, amount, date } = req.body;
        if (!expenseName || !category || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const addExpense = `INSERT INTO ${tableName} (expenseName, category, amount, date) VALUES(?, ?, ?, ?)`;
        const values = [expenseName, category, amount, date];
        db.query(addExpense, values, (err, result) => {
            if (err) return res.status(500).json({ message: 'Something went wrong', error: err.message });
            return res.status(200).json({ message: 'Expense added successfully', result: result });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});


