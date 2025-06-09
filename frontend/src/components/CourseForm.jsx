import React from "react";

function CourseForm({
  onSubmit,
  form,
  setForm,
  editingCourse,
  courseImage,
  courseImageUploading,
  handleCourseImageChange,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingCourse ? "Edit Course" : "Add New Course"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <div>
          <label className="block font-semibold mb-1">Course Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCourseImageChange}
          />
          {courseImageUploading && (
            <p className="text-blue-600 text-sm mt-1">Uploading...</p>
          )}
          {courseImage && (
            <img
              src={courseImage}
              alt="Course"
              className="h-16 w-16 mt-2 rounded object-cover"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingCourse ? "Update Course" : "Add Course"}
        </button>
      </form>
    </div>
  );
}

export default CourseForm;
