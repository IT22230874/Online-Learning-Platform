import React from "react";

function GenericTable({ columns, data, actions }) {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="p-2 border">
              {col}
            </th>
          ))}
          {actions && <th className="p-2 border">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((col) => (
              <td key={col} className="p-2 border">
                {col === "Image" ? (
                  item.image ? (
                    <img
                      src={item.image}
                      alt="img"
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : null
                ) : (
                  item[col.toLowerCase()]
                )}
              </td>
            ))}
            {actions && (
              <td className="p-2 border">
                <div className="flex gap-2">{actions(item)}</div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GenericTable;
