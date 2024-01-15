const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/log-signup");

connect.then(() => {
    console.log("Database connected successfully");
})
.catch(() => {
    console.log("Database cannot be connected");
});

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: 'defaultPassword'
    }
});

const collection =  mongoose.model("users", loginSchema);

module.exports = collection;
