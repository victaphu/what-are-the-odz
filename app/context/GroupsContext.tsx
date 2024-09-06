
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Group {
  id: string;
  name: string;
  description: string;
  emoji?: string;
  // Add other group properties as needed
}

interface GroupsContextType {
  loading: boolean;
  groups: Group[];
  createGroup: (group: Group) => void;
  refreshGroups: () => void;
  showCreateGroupDlg: boolean;
  setShowCreateGroupDlg: (show: boolean) => void;
  showGroupDetailsDlg: boolean;
  setShowGroupDetailsDlg: (show: boolean) => void;
  selectedGroup: Group | null;
  setSelectedGroup: (group: Group | null) => void;
  activeGroup: string;
  setActiveGroup: (group: string) => void;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);
const data: Group[] = [
  { id: '1', name: 'Team Alpha', description: 'Our main project team', emoji: '🚀' },
  { id: '2', name: 'Marketing', description: 'Marketing and PR group', emoji: '📣' },
  { id: '3', name: 'Design Squad', description: 'UI/UX designers', emoji: '🎨' },
  { id: '4', name: 'Backend Devs', description: 'Server-side development team', emoji: '⚙️' },
  { id: '5', name: 'QA Testers', description: 'Quality Assurance team', emoji: '🔍' },
];

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};

export const GroupsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateGroupDlg, setShowCreateGroupDlg] = useState(false);
  const [showGroupDetailsDlg, setShowGroupDetailsDlg] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch initial groups data
    refreshGroups();
  }, []);

  const refreshGroups = async () => {
    try {
      setLoading(true);
      // Implement API call to fetch groups
      // const response = await fetch('/api/groups');
      // const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      // Dummy data for groups
      setGroups(data);

      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (group: Group) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      setGroups([...groups, group]);
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    activeGroup,
    setActiveGroup,
    groups,
    createGroup,
    refreshGroups,
    showCreateGroupDlg,
    setShowCreateGroupDlg,
    showGroupDetailsDlg,
    setShowGroupDetailsDlg,
    selectedGroup,
    setSelectedGroup,
  };

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>;
};
