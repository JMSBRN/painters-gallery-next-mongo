import React, { useEffect, useState } from 'react';
import Form from '@/components/form/Form';
import styles from './login.module.scss';
import { SignUpErrors, User } from '@/features/users/interfaces';
import { FormErrorMessages } from '@/constants/constants';
import router from 'next/router';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setLogged, setUser } from '@/features/users/usersSlice';
import Link from 'next/link';

const Login = () => {
  const { formContainer, failedConnecionMsg } = styles;

  const initFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const initSignUpErrors: SignUpErrors = {
    nameError: '',
    emailError: '',
    passwordError: ''
  };
  const [formData, setFormData] = useState(initFormData);
  const [signUpErrors, setSignUpErrors] = useState<Partial<SignUpErrors>>(initSignUpErrors);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectedFailed, setConnectedFailed] = useState<boolean>(false);
  const [usersDb, setUsersDb] = useState<User[]>([]);
  const {name, password} = formData;
  const dispatch = useAppDispatch();
  useEffect(() => {
    const f = async () => {
      const res = await fetch('/api/users/');
      const data: User[] = await res.json();
      setUsersDb(data);
    };
    f();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSignUpErrors(initSignUpErrors);
    if(usersDb) {
      const user: User | undefined = usersDb.find(el => el.name === name);
      const authorized = true;
    if (authorized) {      
      if(user?.id) {
        const matchedPsw = await bcrypt.compare(password, user.password);
        if(matchedPsw) {
          dispatch(setUser(user));
          dispatch(setLogged(true));
          const accessToken = jwt.sign({ id: user?.id, name: user?.name }, process.env.JWT_ACCES_SECRET!, { expiresIn: '30min'});
          localStorage.setItem('token', JSON.stringify(accessToken));
          router.push(`/painters/${user.id}`);
        } else {
          setLoading(false);
          setSignUpErrors({ passwordError: FormErrorMessages.PASSWORD_VALID_ERROR });
        }
     } else {
        setLoading(false);
        setSignUpErrors({ nameError: FormErrorMessages.USER_ERROR});
      }
    } else {
      setLoading(false);
      setSignUpErrors({ nameError: FormErrorMessages.USER_AUTH_ERROR});
    }
  } else {
    router.push('/');
  }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSignUpErrors(initSignUpErrors);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  setTimeout(() => {
    setConnectedFailed(true);
  }, 7000);
  return (
    <div className={formContainer}>
      { !!usersDb.length ? 
      <Form 
       loading={loading}
       loginForm={true}
       signUpErrors={signUpErrors}
       formData={formData}
       handleChange={handleChange}
       handleSubmit={handleSubmit}
      />
      : 
      <>
        {
          connectedFailed && 
          <div className={failedConnecionMsg}>
            <div>
              Oops! Something went wrong:(... Please check enternet connection or reload application
            </div>
            <div>
              <Link style={{ textDecoration: 'none' }} href={'/auth/login'} onClick={() => { window.location.reload(); } }
              >Reload</Link>
            </div>
          </div>
        }
        </>
    }
    </div>
  );
};

export default Login;
