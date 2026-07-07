"use client";

import { useQuery } from "@tanstack/react-query";

export default function useCards() {
  const {
    data: cards = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await fetch("/api/card");
      const data = await res.json();
      return data.cards;
    },
  });

  return {
    cards,
    isLoading,
    isError,
    error,
  };
}
