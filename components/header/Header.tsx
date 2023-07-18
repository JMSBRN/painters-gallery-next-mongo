import React, { useEffect, useState } from 'react';
import { selectUsers, setLogged, setUser } from '@/features/users/usersSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import Link from 'next/link';
import Menu from '../menu/Menu';
import ThemeSwitcher from '../theme-switcher/ThemeSwitcher';
import { User } from '@/features/users/interfaces';
import { deleteCookie } from 'cookies-next';
import secureLocalUtils from '../../utils/secureLocalStorageUtils';
import styles from './header.module.scss';

interface HeaderProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header = (props: HeaderProps) => {
  const { isDark, setIsDark } = props;
  const { getDecryptedDataFromLocalStorage } = secureLocalUtils;
  const { 
      header,
      headerContainer,
      authLink,
      userNameStyle,
      logedUserContainer,
      authLinkContainer,
      menu,
      themeContainer
     } = styles;
  const dispatch = useAppDispatch();
  const { user, logged } = useAppSelector(selectUsers);
  const [userFromLocal, setUserFromLocal] = useState({} as User);
  const [name, setName] = useState<String>(' lkjlkjl');
  
  const handlClickLogOut = () => {
    dispatch(setUser({} as User));
    dispatch(setLogged(false));
    setUserFromLocal({} as User);
    localStorage.clear();
    deleteCookie('token');
  };
  
  useEffect(() => {
    const data = getDecryptedDataFromLocalStorage('user');

     data && setUserFromLocal(data);
  }, [getDecryptedDataFromLocalStorage, logged]);

  useEffect(() => {
      setName(user.name);
  }, [user]);
  
  return (
    <header className={header}>
      <div className={menu}>
       <Menu isDark={isDark} setIsDark={setIsDark} />
      </div>
      <div className={headerContainer}>
        <nav>
          <Link href="/">home</Link>
          <Link href="/about">about</Link>
          <Link href="/galleries">galleries</Link>
          <Link href="/help">help</Link>
          {(userFromLocal.name && logged) && 
           <Link href={`/painters/${userFromLocal.id}`}>gallery</Link> }
          </nav>
        <div className={logedUserContainer}>
          {(userFromLocal.name && logged) && 
           <div className={userNameStyle}>{ name ? name : userFromLocal.name }</div>
          }
        </div>
        <div className={authLinkContainer}>
          {logged ? (
            <>
            <Link 
            className={authLink} href="/" onClick={handlClickLogOut}>Log Out</Link>
            <Link className={authLink} href="/edit" >Edit Profile</Link>
              </>
          ) : (
            <>
            <Link className={authLink} href={'/login'}>Log In</Link>
            <Link className={authLink} href={'/signup/'}>Sign Up</Link>
            </>
          )}
        </div>
        <div className={themeContainer}>
          <ThemeSwitcher isDark={isDark} setIsDark={setIsDark} />
        </div>
      </div>
    </header>
  );
};

export default Header;
