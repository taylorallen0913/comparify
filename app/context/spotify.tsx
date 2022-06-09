import { ReactNode, useState } from 'react';
import { createContext, useContext, useReducer } from 'react';

interface SpotifyUserData {
  refreshToken: string | null;
}
interface Action {
  type: 'setUser1Data' | 'setUser2Data';
  payload?: SpotifyUserData;
}
interface Dispatch {
  (action: Action): void;
}
interface State {
  user1Data: SpotifyUserData | any;
  user2Data: SpotifyUserData | any;
}
interface SpotifyProviderProps {
  children: ReactNode;
}

const SpotifyContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function spotifyReducer(state: State, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case 'setUser1Data': {
      return { ...state, user1Data: payload };
    }
    case 'setUser2Data': {
      return { ...state, user2Data: payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

function SpotifyProvider({ children }: SpotifyProviderProps) {
  const [state, dispatch] = useReducer(spotifyReducer, {
    user1Data: { refreshToken: null },
    user2Data: { refreshToken: null },
  });

  const value = { state, dispatch };

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
}

function useSpotify() {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
}

export { SpotifyProvider, useSpotify };
