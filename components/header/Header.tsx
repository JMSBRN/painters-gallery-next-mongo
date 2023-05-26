import React from 'react';
import styles from './header.module.scss';
import ThemeSwitcher from '../theme-btn/ThemeSwitcher';
import Link from 'next/link';
import { User } from '@/features/users/interfaces';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectUsers, setLogged, setUser } from '@/features/users/usersSlice';
import { useRouter } from 'next/router';

interface HeaderProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header = (props: HeaderProps) => {
  const { isDark, setIsDark } = props;
  const { header,
     headerContainer,
      authLink,
      userNameStyle,
      logedUserContainer,
      authLinkContainer
     } = styles;
  const dispatch = useAppDispatch();
  const { user, logged } = useAppSelector(selectUsers);
  const router = useRouter();
  const handlClickLogOut = () => {
    dispatch(setUser({} as User));
    dispatch(setLogged(false));
    router.push('/');
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
          {logged &&  <Link href={`/painters/${user.id}`}>gallery</Link> }
        </nav>
        <div className={authLinkContainer}>
          <Link className={authLink} href={'/auth/login'}>Log In</Link>
          <Link className={authLink} href={'/auth'}>Sign Up</Link>
          <ThemeSwitcher isDark={isDark} setIsDark={setIsDark} />
        </div>
        <div className={logedUserContainer}>
          {logged && 
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
