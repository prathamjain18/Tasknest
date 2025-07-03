import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, Button, Modal, TextField } from '@mui/material';

// Mock data for lists and cards
const initialData = {
  lists: [
    {
      id: 'list-1',
      title: 'To Do',
      cards: [
        { id: 'card-1', title: 'Task 1', description: 'Description for Task 1' },
        { id: 'card-2', title: 'Task 2', description: 'Description for Task 2' },
      ],
    },
    {
      id: 'list-2',
      title: 'In Progress',
      cards: [
        { id: 'card-3', title: 'Task 3', description: 'Description for Task 3' },
      ],
    },
    {
      id: 'list-3',
      title: 'Done',
      cards: [
        { id: 'card-4', title: 'Task 4', description: 'Description for Task 4' },
      ],
    },
  ],
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #1976d2',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function BoardView() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceListIndex = data.lists.findIndex(list => list.id === source.droppableId);
    const destListIndex = data.lists.findIndex(list => list.id === destination.droppableId);
    const sourceList = data.lists[sourceListIndex];
    const destList = data.lists[destListIndex];
    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destList.cards.splice(destination.index, 0, movedCard);

    const newLists = [...data.lists];
    newLists[sourceListIndex] = { ...sourceList };
    newLists[destListIndex] = { ...destList };
    setData({ lists: newLists });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f7fafc 0%, #e3f0ff 100%)', p: 3 }}>
      <Typography variant="h4" fontWeight={700} color="primary" align="center" sx={{ mb: 4 }}>
        Trello-Style Board View (Demo)
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto' }}>
          {data.lists.map((list) => (
            <Droppable droppableId={list.id} key={list.id}>
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  elevation={4}
                  sx={{ minWidth: 300, p: 3, borderRadius: 4, bgcolor: snapshot.isDraggingOver ? '#e3f0ff' : '#fff', boxShadow: 3 }}
                >
                  <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 2 }}>
                    {list.title}
                  </Typography>
                  {list.cards.map((card, idx) => (
                    <Draggable draggableId={card.id} index={idx} key={card.id}>
                      {(provided, snapshot) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          elevation={snapshot.isDragging ? 8 : 2}
                          sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: snapshot.isDragging ? '#bbdefb' : '#f7fafc', cursor: 'pointer' }}
                          onClick={() => handleCardClick(card)}
                        >
                          <Typography fontWeight={500}>{card.title}</Typography>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={style}>
          {selectedCard && (
            <>
              <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
                {selectedCard.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedCard.description}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleModalClose} sx={{ borderRadius: 3, fontWeight: 700, py: 1, px: 3 }}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
} 