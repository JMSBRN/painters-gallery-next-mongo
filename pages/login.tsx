import React, { useState } from 'react';
import Form from '@/components/form/Form';
import styles from '../styles/login.module.scss';
import { InitFormData, SignUpErrors } from '@/features/users/interfaces';
import { FormErrorMessages } from '@/constants/constants';
import router from 'next/router';
import bcrypt from 'bcryptjs';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setLogged, setUser } from '@/features/users/usersSlice';
import Link from 'next/link';
import secureLocalUtils from '../utils/secureLocalStorageUtils';
import secureCokkiesUtils from '../utils/secureCookiesUtils';
import jwt from 'jsonwebtoken';

const Login = () => {
  const { formContainer, failedConnecionMsg } = styles;
  const { setEncryptedDataToLocalStorage } = secureLocalUtils;
  const { setEncryptedDataToCookie } = secureCokkiesUtils;

  const initFormData: InitFormData = {
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
  const { password } = formData;
  const dispatch = useAppDispatch();
  
  const setConnectionErrorMessage = () => {
    setTimeout(() => {
      setConnectedFailed(true);
      setLoading(false);
    }, 10000);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setConnectedFailed(false);
    setSignUpErrors(initSignUpErrors);
    const res = await fetch('/api/users/',{
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': JSON.stringify(formData),
        },
      body: JSON.stringify(formData)
    });
    const user = await res.json();
    if (!user.message) {     
      if(user?.id) {
        const matchedPsw = await bcrypt.compare(password, user.password);
        if(matchedPsw) {
          setEncryptedDataToLocalStorage('user', user);
          const { id, name } = user; 
          const token = jwt.sign({ id, name }, process.env.JWT_ACCES_SECRET!, { expiresIn: '15m' });
          setEncryptedDataToCookie('token', token);
          dispatch(setUser(user));
          dispatch(setLogged(true));
          router.push(`/painters/${user.id}`);
        } else {
          setLoading(false);
          setSignUpErrors({ passwordError: FormErrorMessages.PASSWORD_VALID_ERROR });
        }
     } else {
        setLoading(false);
        setSignUpErrors({ nameError: FormErrorMessages.USER_ERROR });
      }
  } else {
    setConnectionErrorMessage();
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
      <Form 
       loading={loading}
       loginForm={true}
       signUpErrors={signUpErrors}
       formData={formData}
       handleChangeValues={handleChange}
       handleSubmit={handleSubmit}
       textSubmitBtn='Sign In'
      />
      <>
        {
          connectedFailed && 
          <div className={failedConnecionMsg}>
            <div>
              Oops! Something went wrong:(... Please check enternet connection or reload application
            </div>
            <div>
              <Link style={{ textDecoration: 'none' }} href={'/login'} onClick={() => { window.location.reload(); } }
              >Reload</Link>
            </div>
          </div>
        }
        </>
    </div>
  );
};

export default Login;
