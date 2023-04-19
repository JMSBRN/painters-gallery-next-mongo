import React from 'react';
import styles from './header.module.scss';

const Header = () => {
    const { header } = styles;
  return (
    <header className={header}>Header</header>
  );
};

export default Header;