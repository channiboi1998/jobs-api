const express = require('express');
const router = express.Router();

const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs');

const authMiddleware = require('../middleware/authentication');

router.route('/').get(getJobs).post(authMiddleware, createJob);
router.route('/:id').get(getJob).patch(authMiddleware, updateJob).delete(authMiddleware, deleteJob);

module.exports = router;