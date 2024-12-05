import { create } from 'zustand';
import { persist, PersistStorage} from 'zustand/middleware';

// Define the User type
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Define the Zustand store's state and actions
interface UserStore {
  user: User | null;
  setUser: (newUser: User) => void;
  clearUser: () => void;
}

// Custom localStorage wrapper to match PersistStorage type
const localStorageWrapper: PersistStorage<UserStore> = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null, // Initial user state
      setUser: (newUser: User) => {
        console.log('Setting user:', newUser);
        set({ user: newUser });
      },
      clearUser: () => {
        console.log('Clearing user');
        set({ user: null });
      },
    }),
    {
      name: 'user-storage', // Key in localStorage
      storage: localStorageWrapper, // Use custom localStorage wrapper
    }
  )
);

export default useUserStore;
