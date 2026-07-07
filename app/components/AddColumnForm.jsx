"use client";

export default function AddColumnForm({
  addColumn,
  columnName,
  setColumnName,
  handleSubmit,
}) {
  if (!addColumn) return null;
  return (
    <form onSubmit={handleSubmit} className="border p-6 rounded w-96 mt-4">
      <h1 className="text-2xl mb-4 text-blue-800">Add Column</h1>

      <input
        type="text"
        placeholder="Column Title"
        value={columnName}
        onChange={(e) => setColumnName(e.target.value)}
        className="border p-2 w-full rounded text-gray-800 mb-3"
      />
      <button
        type="submit"
        className="bg-green-500 text-white p-2 w-full rounded"
      >
        Add
      </button>
    </form>
  );
}