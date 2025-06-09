import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import NestedTopics from "./NestedTopics";
import { useAuth } from "../AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function CourseEditor({ course, onClose, onCourseUpdated }) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [originalSections, setOriginalSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { register, control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
      image: "",
      sections: [],
    },
  });

  const {
    fields: sections,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const watchImage = watch("image");

  useEffect(() => {
    if (course) {
      setOriginalSections(
        course.sections.map((s) => ({
          _id: s._id,
          topicIds: s.topics.map((t) => t._id),
        }))
      );

      reset({
        title: course.title,
        description: course.description,
        image: course.image || "",
        sections: course.sections.map((s) => ({
          _id: s._id,
          title: s.title,
          topics: s.topics.map((t) => ({
            _id: t._id,
            title: t.title,
            content: t.content,
          })),
        })),
      });

      setImagePreview(course.image || "");
      setVisible(true);
    }
  }, [course, reset]);

  const closeDialog = () => {
    setVisible(false);
    onClose();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const imageUrl = res.data.url;
      setValue("image", imageUrl);
      setImagePreview(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSaving(true);

    try {
      const updatedSectionIds = data.sections.map((s) => s._id).filter(Boolean);
      for (const original of originalSections) {
        if (!updatedSectionIds.includes(original._id)) {
          await axios.delete(
            `${API_URL}/api/courses/${course._id}/sections/${original._id}`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
        }
      }

      await axios.put(`${API_URL}/api/courses/${course._id}`, data, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      for (const sec of data.sections) {
        let sectionId = sec._id;

        if (!sectionId) {
          const res = await axios.post(
            `${API_URL}/api/courses/${course._id}/sections`,
            { title: sec.title },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          sectionId = res.data.course.sections.slice(-1)[0]._id;
        } else {
          await axios.put(
            `${API_URL}/api/courses/${course._id}/sections/${sectionId}`,
            { title: sec.title },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
        }

        const originalSection = originalSections.find(
          (s) => s._id === sectionId
        );
        const updatedTopicIds = sec.topics.map((t) => t._id).filter(Boolean);

        if (originalSection) {
          for (const topicId of originalSection.topicIds) {
            if (!updatedTopicIds.includes(topicId)) {
              await axios.delete(
                `${API_URL}/api/courses/${course._id}/sections/${sectionId}/topics/${topicId}`,
                {
                  headers: { Authorization: `Bearer ${user.token}` },
                }
              );
            }
          }
        }

        for (const top of sec.topics) {
          if (!top._id) {
            await axios.post(
              `${API_URL}/api/courses/${course._id}/sections/${sectionId}/topics`,
              top,
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
          } else {
            await axios.put(
              `${API_URL}/api/courses/${course._id}/sections/${sectionId}/topics/${top._id}`,
              top,
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
          }
        }
      }

      toast.success("Course updated successfully");
      closeDialog();
      onCourseUpdated();
    } catch (err) {
      toast.error("Failed to save course");
    } finally {
      setIsSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <Toaster />
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl p-6 relative flex flex-col">
          <h2 className="text-2xl font-semibold text-[#253a59] mb-4">
            Edit Course
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 overflow-y-auto pr-2"
            style={{ maxHeight: "calc(90vh - 4rem)" }}
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Course Title
              </label>
              <input
                type="text"
                {...register("title", { required: true })}
                placeholder="e.g. Introduction to React"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#23b8d0] shadow-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                {...register("description")}
                placeholder="Write a brief summary..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#23b8d0] shadow-sm"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Course Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-gray-600"
              />
              {isUploading && (
                <div className="text-sm text-blue-600 mt-2">
                  Uploading image...
                </div>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Course Preview"
                  className="mt-3 h-40 w-full object-cover rounded-md border shadow"
                />
              )}
            </div>

            {/* Sections & Topics */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-[#253a59]">
                  Sections & Topics
                </h3>
                <button
                  type="button"
                  onClick={() => append({ title: "", topics: [] })}
                  className="text-sm text-white bg-[#23b8d0] px-3 py-1 rounded hover:bg-[#1ba6be] transition-shadow shadow"
                >
                  + Add Section
                </button>
              </div>

              <div className="space-y-4">
                {sections.map((sec, i) => (
                  <div
                    key={sec.id}
                    className="border rounded-md bg-gray-50 p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        placeholder="Section Title"
                        {...register(`sections.${i}.title`, { required: true })}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#23b8d0] mr-2 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <NestedTopics
                      control={control}
                      sectionIndex={i}
                      register={register}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-6 sticky bottom-0 bg-white z-10">
              <button
                type="button"
                onClick={closeDialog}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-5 py-2 rounded-lg bg-[#23b8d0] text-white font-medium shadow-md transition ${
                  isSaving
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#1ba6be]"
                }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CourseEditor;
