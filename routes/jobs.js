import express from 'express';
import { addJob, deleteJob, getJob, getJobs, updateJob } from '../controllers/jobsController.js';

const router = express.Router();

//Get all jobs
router.get('/' , getJobs);

//Get single jobs
router.get('/:id' , getJob);
//Add Job
router.post('/' , addJob);

//Edit Job
router.put('/:id' , updateJob);

//Delete Job
router.delete('/:id' , deleteJob);

export default router;