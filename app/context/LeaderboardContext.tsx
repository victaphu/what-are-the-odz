
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Group, useGroups } from './GroupsContext';

export interface LeaderboardItem {
  id: string;
  name: string;
  profileImage?: string;
  odzScore: number;
  monthlyScores: number[];
}

interface LeaderboardContextType {
  leaderboard: LeaderboardItem[];
  visible: boolean;
  setVisible: (visible: boolean) => void;
  refreshLeaderboard: () => void;
  loading: boolean;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

const generateRandomLeaderboardData = (group: Group): LeaderboardItem[] => {
  return group?.members?.map(member => ({
      id: `${group.id}-${member.username}`,
      name: member.username,
      profileImage: member.avatar,
      odzScore: Math.floor(Math.random() * 1000),
      monthlyScores: Array(12).fill(0).map(() => Math.floor(Math.random() * 100)),
    })) || []
};

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};

export function LeaderBoardContext({ children }: { children: ReactNode }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { groups, activeGroup } = useGroups();

  useEffect(() => {
    refreshLeaderboard();
  }, [groups, activeGroup]);

  const refreshLeaderboard = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newLeaderboard = generateRandomLeaderboardData(groups[(+activeGroup) - 1]);
      setLeaderboard(newLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    leaderboard,
    visible,
    setVisible,
    refreshLeaderboard,
    loading,
  };

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>;
};
