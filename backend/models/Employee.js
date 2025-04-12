const mongoose = require('mongoose');

// Define role-based salary limits
const SALARY_LIMITS = {
  'Driver': 500,
  'Travel Agent': 1200,
  'Supplier': 450,
  'Worker': 350
};

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nic: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {  // Change position to role to match frontend
        type: String, 
        required: true,
        trim: true,
        enum: ['Travel Agent', 'Driver', 'Worker', 'Supplier']
    },
    phoneNumber: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true,
        min: [0, 'Salary cannot be negative'],
        validate: {
            validator: function(v) {
                // Check against role-specific salary limits
                if (this.role && SALARY_LIMITS[this.role]) {
                    return v <= SALARY_LIMITS[this.role];
                }
                // Default max salary for roles without specific limits
                return v <= 2500;
            },
            message: function(props) {
                if (this.role && SALARY_LIMITS[this.role]) {
                    return `Salary for ${this.role} cannot exceed $${SALARY_LIMITS[this.role]}`;
                }
                return 'Maximum salary allowed is $2,500';
            }
        }
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
