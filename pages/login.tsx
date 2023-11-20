import { InitFormData, SignUpErrors } from '@/features/users/interfaces';
import React, { useState } from 'react';
import { setLogged, setUser } from '@/features/users/usersSlice';
import Form from '@/components/form/Form';
import { FormErrorMessages } from '@/constants/constants';
import Link from 'next/link';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import router from 'next/router';
import secureCokkiesUtils from '../utils/secureCookiesUtils';
import secureLocalUtils from '../utils/secureLocalStorageUtils';
import styles from '../styles/login.module.scss';
import { useAppDispatch } from '@/hooks/reduxHooks';

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
  const dispatch = useAppDispatch();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setConnectedFailed(false);
    setSignUpErrors(initSignUpErrors);
    const secret = process.env.CALL_SECRET;
    const res = await fetch('/api/users/',{
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': JSON.stringify({ formData, secret }),
        },
      body: JSON.stringify(formData)
    });
    const user = await res.json();

    if (!user.message) {     
      if(user?.id) {
        const matchedPsw = await bcrypt.compare(formData.password, user.password);

        if(matchedPsw) {
          const { id, name } = user; 
          const token = jwt.sign({ id, name }, process.env.JWT_ACCES_SECRET!, { expiresIn: '15m' });
          
          setEncryptedDataToLocalStorage('user', user);
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
    setConnectedFailed(true);
    setLoading(false);
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
              <Link style={
                { textDecoration: 'none' }
               } href={'/login'} onClick={() => { window.location.reload(); } }
              >Reload</Link>
            </div>
          </div>
        }
        </>
    </div>
  );
};

export default Login;
