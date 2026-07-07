"use client";
import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";

import Column from "./components/Column";
import AddColumnForm from "./components/AddColumnForm";
import useColumns from "./hooks/useColumns";
import useCards from "./hooks/useCards";
import useColumnMutation from "./hooks/useColumnMutation";
import useCardMutation from "./hooks/useCardMutation";
import useDragDrop from "./hooks/useDragDrop";

export default function Home() {
  const [addColumnForm, setAddColumnForm] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [editId, setEditId] = useState(null);
  const [showDescription, setShowDescription] = useState(null);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [editCardId, setEditCardId] = useState(null);
  const [localCards, setLocalCards] = useState([]);

  const { columns } = useColumns();
  const { cards } = useCards();

  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const { addMutation, editMutation, deleteMutation } = useColumnMutation({
    columnName,
    setColumnName,
    setEditId,
  });

  const {
    addCardMutation,
    editCardMutation,
    deleteCardMutation,
    reorderMutation,
  } = useCardMutation({
    cardTitle,
    cardDescription,
    selectedColumn,
    setCardTitle,
    setCardDescription,
    setShowCardForm,
    setEditCardId,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate();
  };
  const { handleDragEnd } = useDragDrop({
    localCards,
    setLocalCards,
    reorderMutation,
  });

  const handleEdit = (id, title) => {
    setEditId(id);
    setColumnName(title);
  };

  const handleUpdate = (id) => {
    editMutation.mutate({ id, title: columnName });

    setEditId(null);
    setColumnName("");
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };
  const handleCardEdit = (id, title, description) => {
    setEditCardId(id);
    setCardTitle(title);
    setCardDescription(description);
  };

  const handleCardUpdate = (id) => {
    editCardMutation.mutate({
      id,
      title: cardTitle,
      description: cardDescription,
    });

    setEditCardId(null);
    setCardTitle("");
    setCardDescription("");
  };
  return (
    <div className="min-h-screen bg-slate-100 p-4 ">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">
        Welcome to Mini Trello
      </h1>

      <button
        onClick={() => setAddColumnForm(!addColumnForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow-xl"
      >
        Add Column
      </button>
      {addColumnForm && (
        <AddColumnForm
          columnName={columnName}
          setColumnName={setColumnName}
          handleSubmit={handleSubmit}
        />
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap gap-4 mt-4">
          {columns.map((item) => (
            <Column
              key={item._id}
              item={item}
              localCards={localCards}
              editId={editId}
              columnName={columnName}
              setColumnName={setColumnName}
              handleEdit={handleEdit}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              showDescription={showDescription}
              setShowDescription={setShowDescription}
              editCardId={editCardId}
              cardTitle={cardTitle}
              setCardTitle={setCardTitle}
              cardDescription={cardDescription}
              setCardDescription={setCardDescription}
              handleCardEdit={handleCardEdit}
              handleCardUpdate={handleCardUpdate}
              deleteCardMutation={deleteCardMutation}
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
              showCardForm={showCardForm}
              setShowCardForm={setShowCardForm}
              addCardMutation={addCardMutation}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
