import React from 'react';
import { List, Avatar, Typography, Card, Modal, Spin } from 'antd';
import { Line } from '@ant-design/charts';
import { LeaderboardItem, useLeaderboard } from '../../context/LeaderboardContext';
import { TrophyOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const LeaderboardComponent: React.FC = () => {
  const { leaderboard, loading, refreshLeaderboard, visible, setVisible } = useLeaderboard();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return 'transparent';
    }
  };

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  };

  const renderItem = (item: LeaderboardItem, index: number) => {
    const isTopThree = index < 3;

    const config = {
      data: item.monthlyScores.map((score, i) => ({ month: i + 1, score })),
      xField: 'month',
      yField: 'score',
      smooth: true,
      width: 200,
      height: 100,
    };

    return (
      <List.Item>
        <Card
          size="small"
          style={{ width: '100%', backgroundColor: getMedalColor(index) }}
          className={isTopThree ? 'top-three' : ''}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <List.Item.Meta
              avatar={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isTopThree && <span style={{ fontSize: '48px', marginRight: '8px' }}>{getMedalEmoji(index)}</span>}
                  <Avatar
                    src={item.profileImage}
                    size={50}
                    style={{ marginRight: 12 }}
                  />
                </div>
              }
              title={
                <Typography.Text strong style={isTopThree ? { fontSize: 18 } : {}}>
                  {index + 1}. {item.name} {isTopThree && <TrophyOutlined style={{ color: getMedalColor(index) }} />}
                </Typography.Text>
              }
              description={`ODZ Score: ${item.odzScore}`}
            />
            {isTopThree && !isSmallScreen && <Line {...config} />}
          </div>
        </Card>
      </List.Item>
    );
  };

  return (
    <Modal
      title="Leaderboard"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={800}
    >
      {!loading && <List
        dataSource={leaderboard.sort((a,b) => b.odzScore - a.odzScore)}
        renderItem={(item, index) => renderItem(item, index)}
      />}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <Typography.Text style={{ display: 'block', marginTop: '10px' }}>
            Loading leaderboard...
          </Typography.Text>
        </div>
      )}
    </Modal>
  );
};

export default LeaderboardComponent;