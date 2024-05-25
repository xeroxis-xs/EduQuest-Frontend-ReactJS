import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "src/msalConfig";
import PropTypes from 'prop-types';


const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;


    dispatch({
      type: HANDLERS.INITIALIZE
    });

    try {
      console.log('Initializing MSAL')
      await msalInstance.initialize();
    } catch (error) {
      console.error('MSAL initialization error:', error);
    }

  };

  useEffect(() => {
      console.log('useEffect')
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
      email: 'anika.visser@devias.io'
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };


  const signIn = async () => {
    try {
      // Use MSAL to sign in
      const response = await msalInstance.loginPopup();
      console.log('Sign in response:', response);
      if (response) {
        const account = response.account;
        const user = {
          id: account.homeAccountId,
          avatar: '/assets/avatars/avatar-anika-visser.png',
          name: account.name,
          email: account.username,
        };
        window.sessionStorage.setItem('authenticated', 'true');
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: user,
        });
      }

    } catch (error) {
      console.error(error);
      throw new Error('Failed to sign in');
    }
  };

  const signUp = async () => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <MsalProvider instance={msalInstance}>
      <AuthContext.Provider
        value={{
          ...state,
          skip,
          signIn,
          signUp,
          signOut
        }}
      >
        {children}
      </AuthContext.Provider>
    </MsalProvider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
