import React, {useReducer, useMemo} from 'react';
import PropTypes from 'prop-types';

const initialState = {};

const initialContext = [{...initialState}, () => {}];

export const ProfileContext = React.createContext(initialContext);

const updater = (state, update) => {
  return {...update};
};

export function ProfileProvider(props) {
  const [profileState, updateProfileState] = useReducer(updater, initialState);
  const value = useMemo(() => [profileState, updateProfileState], [profileState]);

  return (
    <ProfileContext.Provider value={value}>{props.children}</ProfileContext.Provider>
  );
}

ProfileProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
