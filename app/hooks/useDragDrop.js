"use client";

export default function useDragDrop({
  localCards,
  setLocalCards,
  reorderMutation,
}) {
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
  return {
    handleDragEnd,
  };
}
