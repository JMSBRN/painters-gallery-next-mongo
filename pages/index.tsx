import { getUsers } from '@/utils/apiUtils';
import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const f = async () => {
      const data = await getUsers();
      console.log(data);
    };
   f();

  }, []);
  
  return (
    <>
      <div>
        home
      </div>
    </>
  );
};

export default Home;
