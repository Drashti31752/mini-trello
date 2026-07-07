"use client";

import { Draggable } from "@hello-pangea/dnd";

export default function Card({
  card,
  index,
  editCardId,
  cardTitle,
  setCardTitle,
  cardDescription,
  setCardDescription,
  handleCardEdit,
  handleCardUpdate,
  deleteCardMutation,
  showDescription,
  setShowDescription,
}) {
  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-gray-100 rounded-lg p-3 shadow border"
        >
          {editCardId === card._id ? (
            <>
              <input
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <textarea
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
            </>
          ) : (
            <>
              <h3 className="font-semibold">{card.title}</h3>

              {showDescription === card._id && (
                <p className="text-sm text-gray-600 mt-2">
                  {card.description}
                </p>
              )}

              <button
                onClick={() =>
                  setShowDescription(
                    showDescription === card._id ? null : card._id
                  )
                }
                className="text-blue-600 text-sm mt-2"
              >
                {showDescription === card._id
                  ? "Show Less"
                  : "Show More"}
              </button>
            </>
          )}

          <div className="flex gap-2 mt-3">
            {editCardId !== card._id ? (
              <button
                onClick={() =>
                  handleCardEdit(
                    card._id,
                    card.title,
                    card.description
                  ) }
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm" >
                Edit
              </button>
            ) : (
              <button
                onClick={() => handleCardUpdate(card._id)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>
            )}

            <button
              onClick={() => deleteCardMutation.mutate(card._id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}