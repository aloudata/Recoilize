import React from 'react';
import Toolbar from './Toolbar';
import RecoilNetwork from './RecoilNetwork';

//Create the container passing in the JSX props for each individual component
const AtomNetwork: React.FC = () => {
  return (
    <div className="networkContainer">
      <Toolbar />
      <RecoilNetwork />
    </div>
  );
};

export default AtomNetwork;
