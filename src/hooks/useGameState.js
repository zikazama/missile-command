import { useReducer, useCallback } from 'react';
import { calculateFlightDetails, getAnimationDuration } from '../utils/flightTime';

export const GAME_STATES = {
  IDLE: 'IDLE',
  WEAPON_SELECT: 'WEAPON_SELECT',
  ORIGIN_PICK: 'ORIGIN_PICK',
  TARGET_PICK: 'TARGET_PICK',
  ATTACK_ANIM: 'ATTACK_ANIM',
  RESULTS: 'RESULTS'
};

const ACTIONS = {
  SELECT_WEAPON: 'SELECT_WEAPON',
  PICK_ORIGIN: 'PICK_ORIGIN',
  PICK_TARGET: 'PICK_TARGET',
  LAUNCH: 'LAUNCH',
  ANIM_COMPLETE: 'ANIM_COMPLETE',
  RESET: 'RESET',
  SET_WEAPON_MENU_OPEN: 'SET_WEAPON_MENU_OPEN',
  SET_GAME_STATE: 'SET_GAME_STATE'
};

const initialState = {
  gameState: GAME_STATES.IDLE,
  selectedWeapon: null,
  origin: null,
  target: null,
  flightDetails: null,
  animationDuration: 0,
  weaponMenuOpen: false
};

function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SELECT_WEAPON:
      return {
        ...state,
        gameState: GAME_STATES.ORIGIN_PICK,
        selectedWeapon: action.payload,
        weaponMenuOpen: false
      };

    case ACTIONS.PICK_ORIGIN:
      return {
        ...state,
        gameState: GAME_STATES.TARGET_PICK,
        origin: action.payload
      };

    case ACTIONS.PICK_TARGET:
      if (!state.origin || !state.selectedWeapon) return state;

      const flightDetails = calculateFlightDetails(
        state.origin,
        action.payload,
        state.selectedWeapon
      );

      // Always set target and allow attack for demo purposes, even if out of range
      return {
        ...state,
        gameState: GAME_STATES.TARGET_PICK,
        target: action.payload,
        flightDetails: {
          ...flightDetails,
          animationDuration: getAnimationDuration(state.selectedWeapon, flightDetails.distanceKm)
        }
      };

    case ACTIONS.LAUNCH:
      return {
        ...state,
        gameState: GAME_STATES.ATTACK_ANIM
      };

    case ACTIONS.ANIM_COMPLETE:
      return {
        ...state,
        gameState: GAME_STATES.RESULTS
      };

    case ACTIONS.RESET:
      return {
        ...initialState
      };

    case ACTIONS.SET_WEAPON_MENU_OPEN:
      return {
        ...state,
        weaponMenuOpen: action.payload,
        gameState: action.payload ? GAME_STATES.WEAPON_SELECT : state.gameState
      };

    case ACTIONS.SET_GAME_STATE:
      return {
        ...state,
        gameState: action.payload
      };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const selectWeapon = useCallback((weapon) => {
    dispatch({ type: ACTIONS.SELECT_WEAPON, payload: weapon });
  }, []);

  const pickOrigin = useCallback((city) => {
    dispatch({ type: ACTIONS.PICK_ORIGIN, payload: city });
  }, []);

  const pickTarget = useCallback((city) => {
    dispatch({ type: ACTIONS.PICK_TARGET, payload: city });
  }, []);

  const launch = useCallback(() => {
    dispatch({ type: ACTIONS.LAUNCH });
  }, []);

  const animComplete = useCallback(() => {
    dispatch({ type: ACTIONS.ANIM_COMPLETE });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
  }, []);

  const setWeaponMenuOpen = useCallback((open) => {
    dispatch({ type: ACTIONS.SET_WEAPON_MENU_OPEN, payload: open });
  }, []);

  const setGameState = useCallback((newState) => {
    dispatch({ type: ACTIONS.SET_GAME_STATE, payload: newState });
  }, []);

  return {
    ...state,
    selectWeapon,
    pickOrigin,
    pickTarget,
    launch,
    animComplete,
    reset,
    setWeaponMenuOpen,
    setGameState
  };
}
