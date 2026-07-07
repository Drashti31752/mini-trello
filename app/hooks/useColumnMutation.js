"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useColumnMutation({
  columnName,
  setColumnName,
  setEditId,
}) {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/column", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: columnName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: () => {
      setColumnName("");

      queryClient.invalidateQueries({
        queryKey: ["columns"],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, title }) => {
      const res = await fetch(`/api/column/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
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
  return {
    addMutation,
    editMutation,
    deleteMutation,
  };
}
