import { createContext, useContext, useState, useEffect } from 'react';
import { Choice, Event, UserParticipation } from '../components/Events/EventDialog';
import { useAuth } from './AuthContext';
import { Odz1155Client } from './blockchain/odz1155Client';
import SignClient from './blockchain/signClient';

interface EventContextType {
  loading: boolean;
  createEvent: (eventData: Partial<Event>) => void;
  showCreateEventDlg: boolean;
  setShowCreateEventDlg: React.Dispatch<React.SetStateAction<boolean>>;
  event: Event | null;
  events: Event[] | null;
  userParticipation: UserParticipation | null;
  loadEvent: (eventId: string) => Promise<void>;
  loadEvents: (groupId: string) => Promise<void>;
  joinEvent: (eventId: string, userId: string) => Promise<void>;
  proposeQuestion: (eventId: string, userId: string, questionText: string, choices: Choice[]) => Promise<void>;
  answerQuestion: (eventId: string, questionId: string, userId: string, choiceId: string) => Promise<void>;
  attestResult: (eventId: string, questionId: string, userId: string, choiceId: string) => Promise<void>;
  showDetailsEventDlg: boolean;
  setShowDetailsEventDlg: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const seededEvents = generateRandomEvents();

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showDetailsEventDlg, setShowDetailsEventDlg] = useState(false);
  const [showCreateEventDlg, setShowCreateEventDlg] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [userParticipation, setUserParticipation] = useState<UserParticipation | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [odz1155, setOdz1155] = useState<Odz1155Client | null>();

  const [signClient, setSignClient] = useState<SignClient | null>(null);

  const { updateBalance, userBalance, provider, ethRPC, user } = useAuth();

  useEffect(() => {
    const init = async () => {
      setOdz1155(new Odz1155Client("0x9DeD70f2cbc2E04B0E3e6f6a15f54AB8523EC845", provider));
      const walletClient = await ethRPC?.getWalletClient();
      setSignClient(new SignClient(walletClient!));
    }

    init();
  }, [provider])

  const createEvent = async (eventData: Partial<Event>) => {
    setLoading(true);
    // Implement event creation logic here
    eventData.id = (events.length + 1).toString();
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    updateBalance(userBalance.balance - 100, userBalance.staked);
    setEvents([...events, eventData as Event]);

    setShowCreateEventDlg(false);
    seededEvents.push(eventData as Event);

    console.log('create event', eventData);
    try {
      const start = eventData.startDate!.getTime();
      const end = eventData.endDate!.getTime();
      await odz1155?.createEvent(start, end,);
    }
    catch (e) {
      console.log('failed to mint', e);
    }

    setLoading(false);
  };

  const loadEvent = async (eventId: string) => {
    setLoading(true);
    const eventData = seededEvents.find(e => e.id === eventId) // await fetchEvent(eventId);
    setEvent(eventData || null);
    setLoading(false);
  };

  const loadEvents = async (groupId: string) => {
    setLoading(true);
    try {
      if (!events) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

      setEvents(seededEvents.filter(e => e.groupId === groupId));

      console.log(await odz1155?.getEventDetails(+groupId));
    }
    finally {
      setLoading(false);
    }
  };

  const joinEvent = async (eventId: string, userId: string) => {
    setLoading(true);
    try {
      const eventData = seededEvents.find(e => e.id === eventId);
      eventData?.participants.push({ userId });
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      updateBalance(userBalance.balance - 20, userBalance.staked + 10);
      setUserParticipation({ userId });
      setEvents([...events]);

      try {
        await odz1155?.joinEvent(+eventId);
      }
      catch (e) {
        console.log('failed join events', e);
      }
    }
    finally {
      setLoading(false);
    }
  };

  const proposeQuestion = async (eventId: string, userId: string, questionText: string, choices: Choice[]) => {
    setLoading(true);
    try {
      const eventIndex = seededEvents.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        const updatedEvent = seededEvents[eventIndex];
        const newQuestion = {
          id: ((updatedEvent.questions?.length || 0) + 1) + "",
          text: questionText,
          choices: choices.map((choice, index) => ({
            id: (index + 1).toString(),
            text: choice.text,
            userIds: [],
          }))
        };
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

        updatedEvent.questions.push(newQuestion);
        seededEvents[eventIndex] = updatedEvent;
        updateBalance(userBalance.balance - 10, userBalance.staked);
        setEvent(updatedEvent);
        setEvents([...events]);

        try {
          await odz1155?.proposeQuestion(+eventId, choices.length,);
        }
        catch (e) {
          console.log('failed txn', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (eventId: string, questionId: string, userId: string, choiceId: string) => {
    setLoading(true);
    try {
      // const updatedEvent = await answerQuestionAPI(eventId, questionId, userId, choiceId);
      // setEvent(updatedEvent);
      const eventData = seededEvents.find(e => e.id === eventId);
      if (!eventData) {
        return;
      }
      const question = eventData?.questions.find(q => q.id === questionId);
      if (!question) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

      question.userAnswer = choiceId;
      question.choices.find(c => c.id === choiceId)!.userIds.push(userId);
      updateBalance(userBalance.balance - 5, userBalance.staked);
      setEvents([...events]);

      try {
        await odz1155?.placeBet(+eventId, +questionId, +choiceId);
      }
      catch (e) {
        console.log('failed txn', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const attestResult = async (eventId: string, questionId: string, userId: string, choiceId: string) => {
    setLoading(true);
    try {
      // const updatedEvent = await attestResultAPI(eventId, questionId, userId, choiceId);
      // setEvent(updatedEvent);

      const eventData = seededEvents.find(e => e.id === eventId);
      if (!eventData) {
        return;
      }
      const question = eventData.questions.find(q => q.id === questionId);
      if (!question) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

      // Add user attestation
      if (!question.attestations) {
        question.attestations = [];
      }
      // Check if user has already attested
      if (question.attestations.some(attestation => attestation.userId === userId)) {
        return;
      }

      question.attestations.push({ userId, choiceId, questionId });

      // Check for quorum
      const quorumThreshold = Math.ceil(eventData.participants.length / 2);
      const attestationCount = question.attestations.length;

      if (attestationCount >= quorumThreshold) {
        // Count attestations for each choice
        const attestationCounts = question.choices.reduce((acc, choice) => {
          acc[choice.id] = question.attestations!.filter(a => a.choiceId === choice.id).length;
          return acc;
        }, {} as Record<string, number>);

        // Find the choice with the most attestations
        const winningChoiceId = Object.keys(attestationCounts).reduce((a, b) =>
          attestationCounts[a] > attestationCounts[b] ? a : b
        );

        // Mark the question result
        question.result = winningChoiceId;
      }

      setEvents([...events]);
      setEvent(eventData);
      try {
        await signClient?.attest(user?.evmAddress!, +eventId, +questionId, +choiceId);
      } catch (e) {
        console.log('sign client failed', e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventContext.Provider value={{
      loading,
      setShowDetailsEventDlg,
      showDetailsEventDlg,
      events,
      createEvent,
      showCreateEventDlg,
      setShowCreateEventDlg,
      event,
      userParticipation,
      loadEvent,
      loadEvents,
      joinEvent,
      proposeQuestion,
      answerQuestion,
      attestResult
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

// These functions should be implemented to interact with your API
async function fetchEvent(eventId: string): Promise<Event> {
  // Mock API call to fetch event
  return {
    id: eventId,
    groupId: "1",
    emoji: "🎉",
    title: "Sample Event",
    description: "This is a sample event",
    participants: [{ userId: "user1" }, { userId: "user2" }],
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now() + 86400000), // 24 hours from now
    questions: [
      {
        id: "q1",
        text: "What is your favorite color?",
        choices: [
          { id: "c1", text: "Red", userIds: [] },
          { id: "c2", text: "Blue", userIds: [] },
          { id: "c3", text: "Green", userIds: [] }
        ]
      }
    ]
  }
}

function generateRandomEvents(): Event[] {
  const eventCount = 5; // Random number between 5 and 10
  const events: Event[] = [];

  for (let i = 0; i < eventCount; i++) {
    const startDate = Math.random() > 0.3 ? new Date(Date.now()) : new Date(Date.now() - 86400000);
    const event: Event = {
      id: `event${i + 1}`,
      groupId: (i % 10 + 1) + "",
      title: `Random Event ${i + 1}`,
      description: `This is a randomly generated event ${i + 1}`,
      emoji: "🎉",
      startDate: new Date(Date.now()),
      endDate: new Date(startDate.getTime() + 86400000), // 24 hours from now
      participants: [
        { userId: `user${Math.floor(Math.random() * 100) + 1}` },
        { userId: `user${Math.floor(Math.random() * 100) + 1}` }
      ],
      questions: [
        {
          id: `q${i + 1}`,
          text: `What is the capital of France?`,
          choices: [
            { id: `c${i}1`, text: `London`, userIds: [] },
            { id: `c${i}2`, text: `Berlin`, userIds: [] },
            { id: `c${i}3`, text: `Paris`, userIds: [] },
            { id: `c${i}4`, text: `Madrid`, userIds: [] }
          ]
        },
        {
          id: `q${i + 2}`,
          text: `Which planet is known as the Red Planet?`,
          choices: [
            { id: `c${i}5`, text: `Venus`, userIds: ['user1'] },
            { id: `c${i}6`, text: `Mars`, userIds: ['user2', 'user3'] },
            { id: `c${i}7`, text: `Jupiter`, userIds: [] },
            { id: `c${i}8`, text: `Saturn`, userIds: [] }
          ]
        },
        {
          id: `q${i + 3}`,
          text: `Who painted the Mona Lisa?`,
          choices: [
            { id: `c${i}9`, text: `Vincent van Gogh`, userIds: [] },
            { id: `c${i}10`, text: `Pablo Picasso`, userIds: [] },
            { id: `c${i}11`, text: `Leonardo da Vinci`, userIds: [] },
            { id: `c${i}12`, text: `Michelangelo`, userIds: [] }
          ]
        }]
    };
    events.push(event);
  }

  return events;
}

