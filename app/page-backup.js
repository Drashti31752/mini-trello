"use client";

import { useState, useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Home() {
  const [addColumn, setAddColumn] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [editId, setEditId] = useState(null);
  const [showDescription, setShowDescription] = useState(null);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [editCardId, setEditCardId] = useState(null);
  const [localCards, setLocalCards] = useState([]);

  const {
    data: column = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["columns"],
    queryFn: async () => {
      const res = await fetch("/api/column");

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      return data.columns;
    },
  });

  const {
    data: cards = [],
    isLoading: isCardsLoading,
    isError: isCardsError,
    error: cardsError,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await fetch("/api/card");

      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }
      const data = await res.json();
      return data.cards;
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const reorderMutation = useMutation({
    mutationFn: async (cards) => {
      const res = await fetch("/api/card/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cards }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cards"],
      });
    },
  });

  const addCardMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          columnId: selectedColumn,
          title: cardTitle,
          description: cardDescription,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    },

    onSuccess: () => {
      setCardTitle("");
      setCardDescription("");
      setShowCardForm(false);

      queryClient.invalidateQueries({
        queryKey: ["cards"],
      });
    },
  });

  const handleAddColumn = async () => {
    setAddColumn(true);
  };
  const addmutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/column", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: columnName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return res;
    },
    onSuccess: () => {
      setColumnName("");
      setAddColumn(false);
      queryClient.invalidateQueries({
        queryKey: ["columns"],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/column/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete column");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["columns"],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/card/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete card");
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cards"],
      });
    },
  });

  const editCardMutation = useMutation({
    mutationFn: async ({ id, title, description }) => {
      const res = await fetch(`/api/card/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cards"],
      });
    },
  });
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    addmutation.mutate();
    setAddColumn(false);

    queryClient.invalidateQueries({
      queryKey: ["columns"],
    });
  };
  const handleDelete = async (id) => {
    deleteMutation.mutate(id);
  };
  const editMutation = useMutation({
    mutationFn: async ({ id, title }) => {
      const res = await fetch(`/api/column/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Failed to update column");
      }

      return res.json();
    },
    onSuccess: () => {
      setEditId(null);
      queryClient.invalidateQueries({
        queryKey: ["columns"],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
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

  function handleDragEnd(result) {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    let updatedCards = [...localCards];
    const draggedCard = updatedCards.find((card) => card._id === draggableId);

    if (!draggedCard) return;
    updatedCards = updatedCards.filter((card) => card._id !== draggableId);
    draggedCard.column = destination.droppableId;

    const destinationCards = updatedCards.filter(
      (card) => card.column === destination.droppableId,
    );
    destinationCards.splice(destination.index, 0, draggedCard);

    destinationCards.forEach((card, index) => {
      card.seq = index + 1;
    });

    const otherCards = updatedCards.filter(
      (card) => card.column !== destination.droppableId,
    );

    updatedCards = [...otherCards, ...destinationCards];

    setLocalCards(updatedCards);
    reorderMutation.mutate(updatedCards);
  }
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">
        Welcome to Mini Trello
      </h1>
      <button
        onClick={() => {
          handleAddColumn();
        }}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Add Column
      </button>

      {addColumn && (
        <form onSubmit={handleSubmit} className="border p-6 rounded w-96">
          <h1 className="text-2xl mb-4 text-blue-800">Add Column</h1>

          <input
            type="text"
            name="columnName"
            placeholder="Column Title"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            className="border p-2 w-full mb-3, rounded text-gray-800"
          />

          <button className="bg-green-500 text-white p-2 w-full">Add</button>
        </form>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap gap-4 mt-4">
          {isLoading && <p>Loading...</p>}
          {isError && <p>{error.message}</p>}

          {column.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg p-4 w-73 min-h-[400px] text-black"
            >
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
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleUpdate(item._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
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
                        <Draggable
                          key={card._id}
                          draggableId={card._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-100 rounded-lg p-3 shadow border"
                            >
                              {card._id === editCardId ? (
                                <>
                                  <input
                                    type="text"
                                    value={cardTitle}
                                    onChange={(e) =>
                                      setCardTitle(e.target.value)
                                    }
                                    className="border p-2 rounded w-full mb-2"
                                  />
                                  <textarea
                                    value={cardDescription}
                                    onChange={(e) =>
                                      setCardDescription(e.target.value)
                                    }
                                    className="border p-2 rounded w-full mb-2"
                                  />
                                </>
                              ) : (
                                <>
                                  <h3 className="font-semibold">
                                    {card.title}
                                  </h3>

                                  {showDescription === card._id && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      {card.description}
                                    </p>
                                  )}

                                  <button
                                    onClick={() =>
                                      setShowDescription(
                                        showDescription === card._id
                                          ? null
                                          : card._id,
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
                                        card.description,
                                      )
                                    }
                                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                  >
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
                                  onClick={() =>
                                    deleteCardMutation.mutate(card._id)
                                  }
                                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
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
                className="w-full  bg-blue-600 hover:bg-blue-700 text-white py-2 transition"
              >
                Add Card
              </button>

              {selectedColumn === item._id && (
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

                  <button className="bg-blue-500 text-white p-2 w-full">
                    Save Card
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
