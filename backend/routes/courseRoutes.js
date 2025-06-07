const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const courseController = require('../controllers/courseController');

// Add new course
router.post('/', auth, requireRole('instructor'), courseController.addCourse);
// Get all courses for instructor
router.get('/', auth, requireRole('instructor'), courseController.getInstructorCourses);
// Get course details
router.get('/:id', auth, requireRole('instructor'), courseController.getCourseDetails);
// Edit course
router.put('/:id', auth, requireRole('instructor'), courseController.editCourse);
// Get enrolled students for a course
router.get('/:id/students', auth, requireRole('instructor'), courseController.getEnrolledStudents);

module.exports = router;
