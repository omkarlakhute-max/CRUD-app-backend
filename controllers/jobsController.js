import { getDB } from '../config/db.js'; 
import { ObjectId } from 'mongodb';

// @desc    Get all jobs
// @route   GET /api/jobs
export async function getJobs(req, res) {
  try {
    const db = getDB();
    const limit = parseInt(req.query._limit) || 0; // 0 means no limit
    const jobs = await db.collection('jobs')
      .find({})
      .limit(limit)
      .toArray();
    res.status(200).json(jobs);
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
}

// @desc    Get a single job
// @route   GET /api/jobs/:id
export async function getJob(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const job = await db.collection('jobs').findOne({ _id: new ObjectId(id) });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('❌ Error fetching single job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
}

// @desc    Add Job
// @route   POST /api/jobs
export async function addJob(req, res) {
  try {
    const {
      title,
      type,
      description,
      location,
      salary,
      company
    } = req.body;

    // Basic required field validation
    if (!title || !type || !description || !location || !salary || !company?.name || !company?.description || !company?.contactEmail || !company?.contactPhone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDB();

    const newJob = {
      title,
      type,
      description,
      location,
      salary,
      company
    };

    const result = await db.collection('jobs').insertOne(newJob);

    res.status(201).json({
      message: '✅ Job added successfully',
      jobId: result.insertedId
    });

  } catch (error) {
    console.error('❌ Error adding job:', error);
    res.status(500).json({ error: 'Failed to add job' });
  }
}

// @desc    Update Job (full document update except _id)
// @route   PUT /api/jobs/:id
export async function updateJob(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const {
      title,
      type,
      description,
      location,
      salary,
      company
    } = req.body;

    // Validate all required fields
    if (
      !title || !type || !description || !location || !salary ||
      !company?.name || !company?.description || !company?.contactEmail || !company?.contactPhone
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDB();
    const result = await db.collection('jobs').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          type,
          description,
          location,
          salary,
          company
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: '✅ Job updated successfully' });

  } catch (error) {
    console.error('❌ Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
}


// @desc    Delete a job
// @route   DELETE /api/jobs/:id
export async function deleteJob(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const result = await db.collection('jobs').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({ message: '✅ Job deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
}

