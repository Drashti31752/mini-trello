"use client";

import { useQuery } from "@tanstack/react-query";

export default function useColumns() {
  const {
    data: columns = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["columns"],
    queryFn: async () => {
      const res = await fetch("/api/column");

      if (!res.ok) {
        throw new Error("Failed to fetch columns");
      }

      const data = await res.json();

      return data.columns;
    },
  });

  return {
    columns,
    isLoading,
    isError,
    error,
  };
}
