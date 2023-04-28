import React from 'react';

const Help = ({ data }: { data: string[] } ) => {
  return (
    <div>
      {
       JSON.stringify(data)
      }
    </div>
  );
};

export default Help;

export async function getServerSideProps() {
   const res = await fetch('http://localhost:3000/api/images/');
   const data = await res.json();
  
  return {
    props: { data },
  };
}