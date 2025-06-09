import React from "react";
import { useFieldArray } from "react-hook-form";

function NestedTopics({ control, sectionIndex, register }) {
  const {
    fields: topics,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.topics`,
  });

  return (
    <div className="ml-4">
      <h4 className="font-semibold">Topics</h4>
      <button type="button" onClick={() => append({ title: "", content: "" })}>
        + Add Topic
      </button>
      {topics.map((top, j) => (
        <div key={top.id} className="flex gap-2 items-start mb-2">
          <input
            className="input flex-1"
            placeholder="Topic title"
            {...register(`sections.${sectionIndex}.topics.${j}.title`, {
              required: true,
            })}
          />
          <input
            className="input flex-1"
            placeholder="Content"
            {...register(`sections.${sectionIndex}.topics.${j}.content`)}
          />
          <button
            type="button"
            onClick={() => remove(j)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default NestedTopics;
