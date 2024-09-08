import { useAuth } from '@/app/context/AuthContext';
import { useEvents } from '@/app/context/EventsContext';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, List, Card, Collapse, Space, Alert } from 'antd';
import { DragOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export interface Event {
  id: string;
  groupId: string;
  title: string;
  description: string;
  questions: Question[];
  participants: UserParticipation[];
  startDate: Date;
  endDate: Date;
  emoji?: string; // native emoji
}

export interface Question {
  id: string;
  text: string;
  choices: Choice[];
  userAnswer?: string; // what i chose as answer
  result?: string;
  attestations?: Attestation[]; // signatures
}

export interface Choice {
  id: string;
  text: string;
  userIds: string[]; // users who chose this specific answer
}

export interface UserParticipation {
  userId: string;
  // Add other properties if needed
}

export interface Attestation {
  userId: string;
  questionId: string;
  choiceId: string;
}

const EventsDialog: React.FC = () => {
  const { user } = useAuth();
  const {
    joinEvent,
    proposeQuestion,
    answerQuestion,
    attestResult,
    loadEvent: fetchEvent,
    event,
    events,
    showDetailsEventDlg,
    setShowDetailsEventDlg,
  } = useEvents();
  const [showProposeQuestion, setShowProposeQuestion] = useState(false);
  const [choices, setChoices] = useState<{ id: string; text: string }[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [editingChoice, setEditingChoice] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !event) {
      return;
    }
    const loadEvent = async () => {
      await fetchEvent(event.id);
    };
    loadEvent();
  }, [event, user, fetchEvent]);

  const handleJoinEvent = async () => {
    if (user && event) {
      await joinEvent(event.id, user.evmAddress);
    }
  };

  const handleProposeQuestion = async (values: { questionText: string }) => {
    if (user && event) {
      const validChoices = choices.filter(choice => choice.text.trim() !== '');
      if (validChoices.length < 2) {
        alert('Please provide at least 2 valid choices for the answer.');
        return;
      }

      const confirmMessage = `Are you sure you want to propose the following question and choices?\n\nQuestion: ${values.questionText}\n\nChoices:\n${validChoices.map((choice, index) => `${index + 1}. ${choice.text}`).join('\n')}`;
      
      if (window.confirm(confirmMessage)) {
        await proposeQuestion(event.id, user.evmAddress, values.questionText, validChoices.map(choice => ({id: choice.id, text: choice.text, userIds: []})));
        setShowProposeQuestion(false);
        setChoices([{ id: '1', text: '' }, { id: '2', text: '' }]);
      }
    }
  };

  const handleAnswerQuestion = async (questionId: string, choiceId: string) => {
    if (user && event) {
      const confirmChoice = window.confirm(`Are you sure you want to select this answer?\n\nQuestion: ${event.questions.find(q => q.id === questionId)?.text}\nAnswer: ${event.questions.find(q => q.id === questionId)?.choices.find(c => c.id === choiceId)?.text}`);
      if (confirmChoice) {
        await answerQuestion(event.id, questionId, user.evmAddress, choiceId);
      }
    }
  };

  const handleAttestResult = async (questionId: string, choiceId: string) => {
    if (user && event) {
      const question = event.questions.find(q => q.id === questionId);
      const choice = question?.choices.find(c => c.id === choiceId);
      const confirmMessage = `Are you sure you want to attest to the following?\n\nQuestion: ${question?.text}\nChoice: ${choice?.text}\n\nWARNING: You can only attest to a single result. This action cannot be undone.`;
      
      if (window.confirm(confirmMessage)) {
        await attestResult(event.id, questionId, user.evmAddress, choiceId);
      }
    }
  };

  const calculateOdds = (question: Question, choiceId: string) => {
    const totalAnswers = question.choices.reduce((sum, choice) => sum + choice.userIds.length, 0);
    const choiceAnswers = question.choices.find(c => c.id === choiceId)?.userIds.length || 0;
    return totalAnswers > 0 ? (1 / (choiceAnswers / totalAnswers)).toFixed(2) : 'N/A';
  };

  const handleAddChoice = () => {
    setChoices([...choices, { id: Date.now().toString(), text: '' }]);
  };

  const handleRemoveChoice = (id: string) => {
    if (choices.length > 2) {
      setChoices(choices.filter(choice => choice.id !== id));
    } else {
      alert('You must have at least 2 choices.');
    }
  };

  const handleEditChoice = (id: string, newText: string) => {
    setChoices(choices.map(choice => choice.id === id ? { ...choice, text: newText } : choice));
    setEditingChoice(null);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(choices);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChoices(items);
  };

  // console.log('events is', event, events);

  if (!event) return null;

  const userParticipation = event.participants.find(p => p.userId === user?.evmAddress) || null;

  return (
    <Modal
      open={showDetailsEventDlg}
      onCancel={() => setShowDetailsEventDlg(false)}
      footer={null}
      title={`${event.title} (${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()})`}
      className="events-dialog"
    >
      <div className="dialog-content">
        <p>{event.description}</p>

        {!userParticipation && (
          <Button onClick={handleJoinEvent}>Join Event</Button>
        )}

        {userParticipation && (
          <>
            {!showProposeQuestion && (
              <>
                <h3>
                  Questions (Odz)
                  <Button onClick={() => setShowProposeQuestion(true)} style={{ marginLeft: '10px' }}>
                    Propose Question
                  </Button>
                </h3>
                {event.questions.map(question => (
                  <Collapse key={question.id}>
                    <Collapse.Panel
                      header={
                        <span className="ellipsis-text">{question.userAnswer && <span role="img" aria-label="tick">✅</span>} {question.text}</span>}
                      key={question.id}
                      className="question-card"
                      style={{
                        backgroundColor: question.userAnswer ? '#e6ffe6' : 'inherit',
                      }}
                      extra={
                        question.result && (question.attestations?.length || 0) >= event.participants.length * 0.5 ? (
                          <span role="img" aria-label="celebration">🎉</span>
                        ) : null
                      }
                    >
                      <List
                        dataSource={question.choices}
                        renderItem={choice => (
                          <List.Item
                            key={choice.id}
                            actions={[
                              !question.userAnswer && (
                                <Button onClick={() => handleAnswerQuestion(question.id, choice.id)}>
                                  Choose
                                </Button>
                              ),
                              question.userAnswer && !question.attestations?.some(attestation => attestation.userId === user?.evmAddress) && (
                                <Button onClick={() => handleAttestResult(question.id, choice.id)}>
                                  Attest
                                </Button>
                              ),
                              question.userAnswer && question.attestations?.some(attestation => attestation.userId === user?.evmAddress && attestation.choiceId === choice.id) && (
                                <span>Attested ✅</span>
                              )
                            ]}
                          >
                            <List.Item.Meta
                              title={
                                <>
                                  {choice.text}
                                  {question.userAnswer && question.userAnswer === choice.id && (
                                    <span style={{ color: 'green', marginLeft: '8px' }}>(Your choice)</span>
                                  )}
                                </>
                              }
                              description={`Odds: ${calculateOdds(question, choice.id)}`}
                            />
                          </List.Item>
                        )}
                      />
                    </Collapse.Panel>
                  </Collapse>
                ))}
              </>
            )}
            {showProposeQuestion && (
              <div className="propose-question">
                <h3>
                  Propose a Question
                  <Button onClick={() => setShowProposeQuestion(false)} style={{ marginLeft: '10px' }}>
                    Show Questions
                  </Button>
                </h3>
                <Form
                  onFinish={handleProposeQuestion}
                >
                  <Form.Item
                    name="questionText"
                    rules={[{ required: true, message: 'Please enter your question' }]}
                  >
                    <Input placeholder="Enter your question" />
                  </Form.Item>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="choices">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {choices.map((choice, index) => (
                            <Draggable key={choice.id} draggableId={choice.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{ ...provided.draggableProps.style, marginBottom: '10px' }}
                                >
                                  <Space>
                                    <DragOutlined />
                                    {editingChoice === choice.id ? (
                                      <Input
                                        value={choice.text}
                                        onChange={(e) => handleEditChoice(choice.id, e.target.value)}
                                        onBlur={() => setEditingChoice(null)}
                                        onPressEnter={() => setEditingChoice(null)}
                                        autoFocus
                                      />
                                    ) : (
                                      <Input
                                        value={choice.text}
                                        onChange={(e) => handleEditChoice(choice.id, e.target.value)}
                                        placeholder={`Choice ${index + 1}`}
                                      />
                                    )}
                                    <Button icon={<EditOutlined />} onClick={() => setEditingChoice(choice.id)} />
                                    <Button icon={<DeleteOutlined />} onClick={() => handleRemoveChoice(choice.id)} />
                                  </Space>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <Button onClick={handleAddChoice} style={{ marginTop: '10px' }}>Add Choice</Button>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginTop: '20px' }}>
                      Propose
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default EventsDialog;