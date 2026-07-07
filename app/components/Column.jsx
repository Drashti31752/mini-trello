"use client";

import { Droppable } from "@hello-pangea/dnd";
import Card from "./Card";
import AddCardForm from "./AddCardForm";

export default function Column({
  item,
  localCards,

  editId,
  columnName,
  setColumnName,
  handleEdit,
  handleUpdate,
  handleDelete,

  showDescription,
  setShowDescription,

  editCardId,
  cardTitle,
  setCardTitle,
  cardDescription,
  setCardDescription,

  handleCardEdit,
  handleCardUpdate,
  deleteCardMutation,

  selectedColumn,
  setSelectedColumn,
  showCardForm,
  setShowCardForm,
  addCardMutation,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-73 min-h-[400px] text-black">
    
      <div className="flex justify-between items-center mb-4">
        {editId === item._id ? (
          <input
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            className="border p-2 rounded flex-1 mr-2"
          />
        ) : (
          <h2 className="text-xl font-bold truncate">{item.title}</h2>
        )}

        <div className="flex gap-2">
          {editId !== item._id ? (
            <>
              <button
                onClick={() => handleEdit(item._id, item.title)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => handleUpdate(item._id)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Save
            </button>
          )}
        </div>
      </div>
     
      <Droppable droppableId={item._id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 mb-4"
          >
            {localCards
              .filter((card) => card.column === item._id)
              .sort((a, b) => a.seq - b.seq)
              .map((card, index) => (
                <Card
                  key={card._id}
                  card={card}
                  index={index}
                  editCardId={editCardId}
                  cardTitle={cardTitle}
                  setCardTitle={setCardTitle}
                  cardDescription={cardDescription}
                  setCardDescription={setCardDescription}
                  handleCardEdit={handleCardEdit}
                  handleCardUpdate={handleCardUpdate}
                  deleteCardMutation={deleteCardMutation}
                  showDescription={showDescription}
                  setShowDescription={setShowDescription}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        onClick={() => {
          setSelectedColumn(item._id);
          setShowCardForm(!showCardForm);
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow-xl" 
      >
        Add Card
      </button>
    
      {showCardForm && (
        <AddCardForm
          selectedColumn={selectedColumn}
          columnId={item._id}
          cardTitle={cardTitle}
          setCardTitle={setCardTitle}
          cardDescription={cardDescription}
          setCardDescription={setCardDescription}
          addCardMutation={addCardMutation}
        />
      )}
    </div>
  );
}