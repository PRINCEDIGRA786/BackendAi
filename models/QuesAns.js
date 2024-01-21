const mongoose = require('mongoose')
const { Schema } = mongoose;

const QuesAnsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        // required: true,
        default: "Sorry Not known"
    },

});
const Ques = mongoose.model('ques', QuesAnsSchema);
// User.createIndexes(); ...this will create indexes but we will write another logic for it

module.exports = Ques;