import React, { useEffect, useState } from 'react';
import Form from '@/components/form/Form';
import Loader from '@/components/loader/Loader';
import styles from './login.module.scss';
import { SignUpErrors, User } from '@/features/users/interfaces';
import { FormErrorMessages } from '@/constants/constants';
import router from 'next/router';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setUser } from '@/features/users/usersSlice';

const Login = () => {
  const {formContainer, loaderContainer} = styles;

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
    const user: User | undefined = usersDb.find(el => el.name === name);
    const authorized = true;
    if (authorized) {      
      if(user?.id) {
        const matchedPsw = await bcrypt.compare(password, user.password);
        if(matchedPsw) {
          dispatch(setUser(user));
          const accessToken = jwt.sign({ id: user?.id, name: user?.name }, process.env.JWT_ACCES_SECRET!, { expiresIn: '1min'});
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

  return (
    <div className={formContainer}>
      <div className={loaderContainer}>
      {loading && <Loader /> }
      </div>
      <Form 
       loginForm={true}
       signUpErrors={signUpErrors}
       formData={formData}
       handleChange={handleChange}
       handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Login;
