
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Person } from '../components/Chat/ChatFeed/Bubble/MessageBubble';

export interface Group {
  id: string;
  name: string;
  description: string;
  emoji?: string;
  // Add other group properties as needed
  members?: Person[];
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
  { id: '1', name: 'School Mates', description: 'Our main project team', emoji: '🚀', members: [
    { username: "Alice", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
    { username: "Bob", avatar: "https://randomuser.me/api/portraits/men/23.jpg" }
  ]},
  { id: '2', name: 'Wedding', description: 'Marketing and PR group', emoji: '💍', members: [
    { username: "Emma", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
    { username: "Olivia", avatar: "https://randomuser.me/api/portraits/women/67.jpg" },
    { username: "Sophia", avatar: "https://randomuser.me/api/portraits/women/89.jpg" },
    { username: "Liam", avatar: "https://randomuser.me/api/portraits/men/34.jpg" },
    { username: "Noah", avatar: "https://randomuser.me/api/portraits/men/56.jpg" },
    { username: "Ava", avatar: "https://randomuser.me/api/portraits/women/78.jpg" }
  ]},
  { id: '3', name: 'Best Frens Foeva', description: 'UI/UX designers', emoji: '🎨', members: [
    { username: "Charlie", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
    { username: "Diana", avatar: "https://randomuser.me/api/portraits/women/67.jpg" },
    { username: "Ethan", avatar: "https://randomuser.me/api/portraits/men/89.jpg" }
  ]},
  { id: '4', name: 'Team Mates', description: 'Server-side development team', emoji: '⚙️', members: [
    { username: "Manager", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { username: "Developer", avatar: "https://randomuser.me/api/portraits/women/2.jpg" }
  ]},
  { id: '5', name: 'Family', description: 'Quality Assurance team', emoji: '🔍', members: [
    { username: "Mom", avatar: "https://randomuser.me/api/portraits/women/70.jpg" },
    { username: "Son", avatar: "https://randomuser.me/api/portraits/men/72.jpg" },
    { username: "Dad", avatar: "https://randomuser.me/api/portraits/men/71.jpg" }
  ]},
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
  const [activeGroup, setActiveGroup] = useState<string>("1");
  const [loading, setLoading] = useState(false);

  console.log(groups, activeGroup);

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
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (group: Group) => {
    try {
      setLoading(true);
      group.id = '' + (groups.length + 1);
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
