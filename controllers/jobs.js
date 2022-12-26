const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError } = require('../errors');

/**
 * Method for fetching all Jobs
 */
const getJobs = async (request, response) => {
    
    const jobs = await Job.find();
    response.status(StatusCodes.OK).json(jobs);

}

/**
 * Method for fetching a single Job
 */
const getJob = async (request, response) => {
    
    const { id } = request.params;
    const data = await Job.findOne({_id: id});
    response.status(StatusCodes.OK).json(data);

}

/**
 * Method for posting a new Job
 */
const createJob = async (request, response) => {

    let jobDetails = {... request.body};
    jobDetails.created_by = request.user.userId;
    
    const job = await Job.create(jobDetails);
    response.status(StatusCodes.CREATED).json(job);

}

/**
 * Method for updating a single Job
 */
const updateJob = async (request, response) => {

    const { id } = request.params;
    
    if (request.user.userId !== request.body.created_by) {
        throw new UnauthenticatedError('You dont have access to this data');
    }

    const job = await Job.findOneAndUpdate({ id }, request.body, {
        new: true,
        runValidators: true,
    });

    response.status(StatusCodes.OK).json(job);
}

/**
 * Method for deleting a specific Job
 */
const deleteJob = async (request, response) => {
    
    const { id } = request.params;

    if (request.user.userId !== request.body.created_by) {
        throw new UnauthenticatedError('You dont have access to this data');
    }

    const job = await Job.findOneAndDelete({ _id: id });

    response.status(StatusCodes.OK).json(job);

}

module.exports = {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}