import React, { useEffect, useState } from 'react';
import styles from './header.module.scss';
import ThemeSwitcher from '../theme-switcher/ThemeSwitcher';
import Link from 'next/link';
import { User } from '@/features/users/interfaces';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectUsers, setLogged, setUser } from '@/features/users/usersSlice';
import { useRouter } from 'next/router';
import Menu from '../menu/Menu';
import secureLocalUtils from '../../utils/secureLocalStorageUtils';
import { deleteCookie } from 'cookies-next';

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
  const router = useRouter();
  const [userFromLocal, setUserFromLocal] = useState({} as User);
  
  const handlClickLogOut = () => {
    dispatch(setUser({} as User));
    dispatch(setLogged(false));
    setUserFromLocal({} as User);
    router.push('/');
    localStorage.clear();
    deleteCookie('token');
  };
  const handlClickEditProfile = () => {
    router.push('/edit');
  };
  
  useEffect(() => {
    const data = getDecryptedDataFromLocalStorage('user');
     data && setUserFromLocal(data);
  }, [getDecryptedDataFromLocalStorage, logged]);
  
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
          {userFromLocal.name &&  <Link href={`/painters/${user.id}`}>gallery</Link> }
          </nav>
        <div className={authLinkContainer}>
            <Link className={authLink} href={'/login'}>Log In</Link>
          <Link className={authLink} href={'/signup/'}>Sign Up</Link>
        </div>
        <div className={themeContainer}>
          <ThemeSwitcher isDark={isDark} setIsDark={setIsDark} />
        </div>
        <div className={logedUserContainer}>
          {userFromLocal.name && 
          <>
           <div className={userNameStyle}>{userFromLocal.name}</div>
           <button onClick={handlClickLogOut}>Log Out</button>
           <button onClick={handlClickEditProfile}>Edit Profile</button>
          </>
          }
        </div>
      </div>
    </header>
  );
};

export default Header;
