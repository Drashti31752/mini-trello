"use client";

export default function AddCardForm({
  selectedColumn,
  columnId,
  cardTitle,
  setCardTitle,
  cardDescription,
  setCardDescription,
  addCardMutation,
}) {
  if (selectedColumn !== columnId) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addCardMutation.mutate();
      }}
      className="bg-slate-50 border rounded-lg p-3 mt-3"
    >
      <h2 className="text-xl font-bold mb-4">Add Card</h2>

      <input
        type="text"
        placeholder="Card Title"
        value={cardTitle}
        onChange={(e) => setCardTitle(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <textarea
      
        placeholder="Description"
        value={cardDescription}
        onChange={(e) => setCardDescription(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        Save Card
      </button>
    </form>
  );
}