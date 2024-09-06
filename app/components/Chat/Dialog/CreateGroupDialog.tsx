import React, { useState } from 'react';
import { Modal, Form, Input, message, Select, AutoComplete } from 'antd';
import { useGroups } from '@/app/context/GroupsContext';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const emojiData = ((data as any));
const CreateGroupDialog: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const {createGroup, showCreateGroupDlg, setShowCreateGroupDlg} = useGroups();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const groupData = {
        ...values,
        emoji: selectedEmoji,
        isPrivate: true,
        uniqueCode: generateUniqueCode(),
      };
      createGroup(groupData);
      message.success('Group created successfully!');
      form.resetFields();
      setSelectedEmoji('');
      setShowCreateGroupDlg(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleEmojiSelect = (emoji: any) => {
    setSelectedEmoji(emoji.native);
    form.setFieldsValue({ emoji: emoji.native });
  };

  return (
    <Modal
      title="Create a New Group"
      open={showCreateGroupDlg}
      onCancel={() => setShowCreateGroupDlg(false)}
      onOk={handleCreate}
      okText="Create Group"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Group Name"
          rules={[{ required: true, message: 'Please enter a group name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a group description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="emoji"
          label="Group Emoji"
          rules={[{ required: true, message: 'Please select an emoji' }]}
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
        <Form.Item
          name="inviteEmail"
          label="Invite User (Email)"
        >
          <Select mode="tags" placeholder="Enter frens email"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGroupDialog;
