import React, { useEffect, useState } from 'react';
import styles from './header.module.scss';
import ThemeSwitcher from '../theme-btn/ThemeSwitcher';
import Link from 'next/link';
import { User } from '@/features/users/interfaces';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectUsers, setUser } from '@/features/users/usersSlice';

interface HeaderProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header = (props: HeaderProps) => {
  const { isDark, setIsDark } = props;
  const { header, headerContainer, authLink, userNameStyle, logedUserContainer } = styles;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectUsers);

  useEffect(() => {
    dispatch(setUser(JSON.parse(localStorage.getItem('user') || '{}')));
  }, [dispatch]);
  
  const  handlClickLogOut = () => {
    dispatch(setUser({} as User));
    localStorage.clear();
  };
  return (
    <header className={header}>
      <div className={headerContainer}>
        <nav>
          <Link href="/">home</Link>
          <Link href="/about">about</Link>
          <Link href="/galleries">galleries</Link>
          <Link href="/help">help</Link>
        </nav>
        <>
          <Link className={authLink} href={'/auth/login'}>Log In</Link>
          <Link className={authLink} href={'/auth'}>Sign Up</Link>
          <ThemeSwitcher isDark={isDark} setIsDark={setIsDark} />
        </>
        <div className={logedUserContainer}>
          {user.name && 
          <>
           <div className={userNameStyle}>{user.name}</div>
           <button onClick={handlClickLogOut}>log out</button>
          </>
          }
        </div>
      </div>
    </header>
  );
};

export default Header;
