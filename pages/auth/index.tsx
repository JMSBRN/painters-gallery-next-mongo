import React from 'react';
import SignUpForm from '@/components/signup-form/SignUpForm';
import { getCollectionData } from '@/lib/mongoUtils';
import { GetServerSideProps } from 'next';

const auth = ({ users }: {users: string}) => {
  return (
    <div>
        <SignUpForm users={users} />
    </div>
  );
};

export default auth;

export const getServerSideProps:GetServerSideProps<{ users: string}> = async() => {
  const users = await getCollectionData('users') as string;
  return {
   props: {users}
 };
};