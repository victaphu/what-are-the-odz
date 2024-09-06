import React, { useState } from 'react';
import { Modal, Form, Input, message, DatePicker, AutoComplete } from 'antd';
import { useEvents } from '@/app/context/EventsContext';
import data from '@emoji-mart/data';
import { Event } from '../../Events/EventDialog';
import { useGroups } from '@/app/context/GroupsContext';
import { useAuth } from '@/app/context/AuthContext';

const { RangePicker } = DatePicker;
const emojiData = ((data as any));
// export interface EventData {
//   title: string;
//   description: string;
//   startDate: Date;
//   endDate: Date;
//   emoji?: string;
// }

const CreateEventDialog: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const { createEvent, showCreateEventDlg, setShowCreateEventDlg } = useEvents();
  const { activeGroup } = useGroups();
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!user || !user.evmAddress) {
      return;
    }
    try {
      const values = await form.validateFields();
      const eventData: Partial<Event> = {
        title: values.title,
        description: values.description,
        startDate: values.dateRange[0].toDate(),
        endDate: values.dateRange[1].toDate(),
        emoji: selectedEmoji,
        groupId: activeGroup,
        questions: [],
        participants: [{userId: user.evmAddress}]
      };
      createEvent(eventData);
      message.success('Event created successfully!');
      form.resetFields();
      setSelectedEmoji('');
      setShowCreateEventDlg(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setSelectedEmoji(emoji.native);
    form.setFieldsValue({ emoji: emoji.native });
  };

  return (
    <Modal
      title="Create a New Event"
      open={showCreateEventDlg}
      onCancel={() => setShowCreateEventDlg(false)}
      onOk={handleCreate}
      okText="Create Event"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Event Title"
          rules={[{ required: true, message: 'Please enter an event title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter an event description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="dateRange"
          label="Event Date Range"
          rules={[{ required: true, message: 'Please select the event date range' }]}
        >
          <RangePicker
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item
          name="emoji"
          label="Event Emoji"
        >
          <AutoComplete
            placeholder="Type to search for an emoji"
            onChange={(value) => handleEmojiSelect({ native: value })}
            style={{ width: '100%' }}
            options={emojiData.categories.flatMap((category: any) =>
              category.emojis.map((emoji: any) => ({
                value: emojiData.emojis[emoji].skins[0].native,
                label: (
                  <span>
                    {emojiData.emojis[emoji].skins[0].native} {emojiData.emojis[emoji].name}
                  </span>
                ),
              }))
            )}
            value={selectedEmoji}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEventDialog;
