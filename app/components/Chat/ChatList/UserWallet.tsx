import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { Card, Avatar, Typography, Space, Statistic, Button, Spin } from 'antd';

const { Text } = Typography;

const UserWallet: React.FC = () => {
  const { user, loading } = useAuth();

  const odzBalance = 1000; // Replace with actual balance fetching logic
  const stakedAmount = 500; // Replace with actual staked amount fetching logic

  if (loading) {
    return (<Card className="ce-active-chat-card" style={{ margin: '5px', marginRight: '10px', background: 'inherit' }}>
        <Space align="center" style={{ width: '100%' }}>
          <Spin size="large" />
          <Text>Loading user profile details...</Text>
        </Space>
      </Card>)
  }

  return (<Card className="ce-active-chat-card" style={{ margin: '5px', marginRight: '10px', background: 'inherit' }}>
    <Space align="start" style={{ width: '100%' }}>
      <Space direction="vertical" align="center" style={{ maxWidth: '64px' }}>
        <Avatar
          size={64}
          src={user?.profileImage || '/images/empty.png'}
          alt={user?.name || 'User'}
        />
        <Text strong className='' style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{user?.name || 'Anonymous User'}</Text>
      </Space>
      <Space direction="vertical" size="small" style={{ flex: 1, gap: '10px' }}>
        <Space direction="horizontal" size="small" style={{ flex: 1, gap: '10px' }}>
          <Statistic
            className='chat-card-activity-time'
            title={<Text strong style={{ fontSize: '10px' }} className='chat-card-activity-time'>ODZ Balance</Text>}
            value={odzBalance}
            prefix="ᙇ"
            precision={2}
            valueStyle={{ fontSize: '14px' }}
          />
          <Statistic
            className='chat-card-activity-time'
            title={<Text strong style={{ fontSize: '10px' }} className='chat-card-activity-time'>Staked</Text>}
            value={stakedAmount}
            prefix="ᙇ"
            precision={2}
            valueStyle={{ fontSize: '14px' }}
          />
        </Space>
        <Button size='small'>Claim ᙇ1000.000</Button>
      </Space>
    </Space>
  </Card>
  );
};

export default UserWallet;
