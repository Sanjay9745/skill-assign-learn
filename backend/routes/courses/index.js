const express = require('express');
const router = express.Router();
const controller = require('./courses');

// POST /courses - create a new course
router.post('/', controller.createCourse);

// GET /courses - get all courses
router.get('/', controller.getAllCourses);

// GET /courses/:id - get a course by ID
router.get('/:id', controller.getCourseById);

// DELETE /courses/:id - delete a course by ID
router.delete('/:id', controller.deleteCourse);

module.exports = router;
