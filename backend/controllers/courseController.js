const Course = require('../models/Course');
const User = require('../models/User');

exports.addCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = new Course({
      title,
      description,
      instructor: req.user,
    });
    await course.save();
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, instructor: req.user });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user },
      { title, description },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: 'Course not found or not authorized' });
    res.json({ message: 'Course updated', course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, instructor: req.user }).populate('students', 'username email role');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ students: course.students });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};
