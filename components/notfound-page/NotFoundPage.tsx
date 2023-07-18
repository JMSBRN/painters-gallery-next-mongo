import Link from 'next/link';
import React from 'react';
import styles from './notFoundPage.module.scss';

const NotFoundPage = () => {
    const {
        container,
        titleMain,
        titleSecond
    } = styles;

  return (
    <div className={container}>
        <div className={titleMain}>404</div>
        <div className={titleSecond}>
          {'Oops! We cant seem to find the page youre looking for....'}
        </div>
        <Link href={'/login'}>Go to home page</Link>
    </div>
  );
};

export default NotFoundPage;