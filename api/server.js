import express from 'express';
import dotenv from 'dotenv';
import {connectDB } from './config/db.js';
import { seedData } from './config/seed.js';
import jobs from './routes/jobs.js'
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 8000;


const app = express();

app.use(cors());

//Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Connect to DB
await connectDB();

// Seed data only if empty
await seedData();

//Route proxy middleware
app.use('/api/jobs' , jobs);

export default app;