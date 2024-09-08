import React from 'react';
import { useLeaderboard } from '../../context/LeaderboardContext';
import { Avatar, Card, Divider, Space, Spin, Typography } from 'antd';

const LeaderPanel: React.FC = () => {
  const { leaderboard, setVisible, loading } = useLeaderboard();

  const top3Players = leaderboard.slice(0, 3);

  const handleClick = () => {
    setVisible(true);
  };

  const getPositionColor = (index: number) => {
    switch (index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return 'transparent';
    }
  };

  const getPositionEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        borderRadius: 2,
        position: 'absolute', cursor: 'pointer',
        top: '79px', zIndex: 2, width: '96%', paddingLeft: '18px', paddingTop: '8px', paddingBottom: '8px',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Space size="large" align="center" style={{ zIndex: 2 }}>
        {!loading && top3Players.sort((a, b) => b.odzScore - a.odzScore).map((player, index) => (
          <div key={player.id} className="text-center">
            <Space direction="horizontal" align="center">
              <div style={{
                backgroundColor: getPositionColor(index),
                padding: '2px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '24px', marginBottom: '4px' }}>{getPositionEmoji(index)}</span>
                {player.profileImage && (
                  <Avatar
                    src={player.profileImage}
                    alt={player.name}
                    size={30}
                  />
                )}
                {!player.profileImage && (
                  <Avatar
                    src="/images/empty.png"
                    alt={player.name}
                    size={30}
                  />
                )}

                {/* <div style={{ marginLeft: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography.Text strong>{player.name}</Typography.Text>
                  <Typography.Text type="secondary">{player.odzScore} ODZ</Typography.Text>
                </div> */}


              </div>
            </Space>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Spin size="large" />
            <Typography.Text style={{ marginTop: '16px', color: 'var(--active-title)' }}>Leaderboard is loading...</Typography.Text>
          </div>
        )}
      </Space>
    </div>
  );
};

export default LeaderPanel;