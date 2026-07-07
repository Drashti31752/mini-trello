"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCardMutation({
  cardTitle,
  cardDescription,
  selectedColumn,
  setCardTitle,
  setCardDescription,
  setShowCardForm,
  setEditCardId,
}) {
  const queryClient = useQueryClient();

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
        alert(data.message);
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
      setEditCardId(null);

      queryClient.invalidateQueries({
        queryKey: ["cards"],
      });
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

  return {
    addCardMutation,
    editCardMutation,
    deleteCardMutation,
    reorderMutation,
  };
}
