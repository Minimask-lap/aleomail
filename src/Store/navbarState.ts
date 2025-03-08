// store/useNavBarStore.ts
import { create } from 'zustand';

interface NavBarState {
  showNavBar: boolean;
  toggleNavBar: () => void;
}

export const useNavBarStore = create<NavBarState>((set: (arg0: (state: any) => {
    showNavBar: boolean; // Toggle the showNavBar state
  }) => any) => ({
  showNavBar: false, // Initial state
  toggleNavBar: () =>
    set((state: { showNavBar: any; }) => ({
      showNavBar: !state.showNavBar // Toggle the showNavBar state
    }))
}));
