import express from 'express';
import {
    getEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

router.route('/').get(getEmployees).post(addEmployee);
router.route('/:id')
    .get(getEmployeeById)
    .put(updateEmployee)
    .delete(deleteEmployee);

export default router;
