import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SafetyEngine, MessageContext } from '../../domain/safety/SafetyEngine';
import { verificationStateMachine, VerificationEvent, VerificationState } from '../../domain/verification/VerificationStateMachine';
import { INITIAL_SENIORS, INITIAL_VOLUNTEERS, INITIAL_REQUESTS } from '../../infrastructure/testing/mockData';
import { CareRequest, UserRole, CommunityReport } from '../../shared/types';

// State definition
interface AppState {
  currentRole: UserRole;
  currentUserVerificationState: VerificationState;
  requests: CareRequest[];
  reports: CommunityReport[];
  messages: MessageContext[];
}

const initialState: AppState = {
  currentRole: 'elderly',
  currentUserVerificationState: 'REGISTERED',
  requests: INITIAL_REQUESTS,
  reports: [],
  messages: [],
};

// Actions definition
type AppAction =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'VERIFICATION_EVENT'; payload: VerificationEvent }
  | { type: 'CREATE_REQUEST'; payload: CareRequest }
  | { type: 'ACCEPT_REQUEST'; payload: { requestId: string; volunteerId: string } }
  | { type: 'SEND_MESSAGE'; payload: MessageContext }
  | { type: 'SUBMIT_REPORT'; payload: CommunityReport };

// Reducer logic
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };
    
    case 'VERIFICATION_EVENT':
      return {
        ...state,
        currentUserVerificationState: verificationStateMachine(state.currentUserVerificationState, action.payload),
      };

    case 'CREATE_REQUEST':
      return { ...state, requests: [action.payload, ...state.requests] };

    case 'ACCEPT_REQUEST':
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === action.payload.requestId
            ? { ...r, status: 'matched', assignedVolunteerId: action.payload.volunteerId }
            : r
        ),
      };

    case 'SEND_MESSAGE': {
      // Evaluate safety strictly before allowing message into state
      const safetyCheck = SafetyEngine.evaluateMessage(action.payload);
      if (safetyCheck.riskLevel === 'BLOCK') {
        alert(safetyCheck.userFacingMessage); // Side effect in reducer just for prototype visibility, ideally handled in saga/thunk
        return state; 
      }
      return { ...state, messages: [...state.messages, action.payload] };
    }

    case 'SUBMIT_REPORT':
      return { ...state, reports: [action.payload, ...state.reports] };

    default:
      return state;
  }
}

// Context setup
const AppStateContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStore must be used within a StoreProvider');
  }
  return context;
}
