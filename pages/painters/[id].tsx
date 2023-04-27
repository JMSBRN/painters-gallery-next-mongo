import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { User } from '@/features/users/interfaces';
import { getUsers } from '@/utils/apiUtils';

interface PainterPeops {
  user: User;
}
const Painter = (props: PainterPeops) => {
  const { user } = props;
  return (
    <div>{user.name}</div>
    );
  };
  
  export default Painter;

  export const getStaticPaths: GetStaticPaths = async () => {
    const users: User[] = await getUsers();
    const paths = users.map((el) => ({ params: { id: el._id} }));      
    return {
      paths,
      fallback: false,
    };
  };
  
  export const getStaticProps: GetStaticProps<{user: User}> = async (context) => {
  const { id }= context.params!; 
  const res = await fetch(`http://localhost:3000/api/users/${id}`);
   const user = await res.json();
  return {
    props: {
      user
    }
  };
};