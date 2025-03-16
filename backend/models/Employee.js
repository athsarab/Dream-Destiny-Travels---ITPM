import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ["Travel Agent", "Driver", "Admin"]
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
