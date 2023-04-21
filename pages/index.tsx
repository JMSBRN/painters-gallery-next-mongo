import { User } from '@/features/users/interfaces';
import clientPromise from '@/lib/mongodb';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps  = async (context) => {
  const client = await clientPromise;

  const db = client.db('painters');

  let users = await db.collection('users').find({}).toArray();
  users = JSON.parse(JSON.stringify(users));

  return {
    props: { users },
  };
};

const Home = ({users}: { users: User[]}) => {
  return (
    <>
      <div>
        {JSON.stringify(users)}
      </div>
    </>
  );
};

export default Home;
