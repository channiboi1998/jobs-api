const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company field is required.'],
        maxLength: 50,
    },
    position: {
        type: String,
        required: [true, 'Position field is required.']
    },
    status: {
        type: String,
        enum: {
            values: ['interview', 'decline', 'pending'],
            default: 'pending',
        }
    },
    created_by: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Provide an author']
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);