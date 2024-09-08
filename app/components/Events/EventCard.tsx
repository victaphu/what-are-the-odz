import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { useAuth } from '@/app/context/AuthContext';
import { useEvents } from '@/app/context/EventsContext';
import { Event } from '@/app/components/Events/EventDialog';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { user } = useAuth();
  const { joinEvent, setShowDetailsEventDlg, loadEvent } = useEvents();

  const handleJoinEvent = async () => {
    console.log('joining event', event.id);
    loadEvent(event.id);
    setShowDetailsEventDlg(true);
  };

  const hasJoined = event.participants.some(p => p.userId === user?.evmAddress);

  return (
    <div
      className="event-card ce-chat-card"
      style={{
        margin: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        padding: '0px!important',
        width: '200px',
      }}
    >
      <Space direction='horizontal' size="small">

        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: '12px',
          }}
        >
          {!event.emoji ? (
            <img
              src={'/images/empty.png'}
              alt="Event emoji"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <span style={{ fontSize: '32px', lineHeight: '44px', textAlign: 'center', display: 'block' }}>
              {event.emoji}
            </span>
          )}
        </div>


        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space direction="horizontal" size="small" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', WebkitLineClamp: 1, lineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', }}>
            <Text strong style={{ flex: 1, color: 'var(--title-color)', fontSize: '12px' }}>{event.title}</Text>
          </Space>
          <Space direction="horizontal" size="small">
            <Text type="secondary" style={{ fontSize: '11px', color: 'var(--gray-text)' }}><QuestionCircleOutlined /> {event.questions.length}</Text>
            <Text type="secondary" style={{ fontSize: '11px', color: 'var(--gray-text)' }}><UserOutlined /> {event.participants.length}</Text>
            {!hasJoined ? <Button type="primary" size="small" onClick={handleJoinEvent}>Join</Button> : <Button type="primary" size="small" onClick={handleJoinEvent}>Info</Button>}
          </Space>
        </Space>
      </Space >
    </div>
  );
};

export default EventCard;