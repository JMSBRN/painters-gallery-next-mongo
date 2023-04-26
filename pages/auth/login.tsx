import Form from '@/components/form/Form';
import Loader from '@/components/loader/Loader';
import React, { useState } from 'react';
import styles from './login.module.scss';
import { SignUpErrors } from '@/features/users/interfaces';
import { FormErrorMessages } from '@/constants/constants';
import { findUserByName } from '@/utils/apiUtils';
import router from 'next/router';

const Login = () => {
  const {formContainer, loaderContainer} = styles;
  const initFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const initSignUpErrors = {
    nameError: '',
    emailError: '',
    passwordError: ''
  };
  const [formData, setFormData] = useState(initFormData);
  const [signUpErrors, setSignUpErrors] = useState<Partial<SignUpErrors>>(initSignUpErrors);
  const [loading, setLoading] = useState<boolean>(false);
  const {name, password} = formData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSignUpErrors(initSignUpErrors);
    const data = await findUserByName(name);
    if(data?._id) {
      if(data.password === password) {
        router.push(`/painters/${data._id}`);
      } else {
        setLoading(false);
        setSignUpErrors({ passwordError: FormErrorMessages.PASSWORD_VALID_ERROR });
      }
    } else {
       setLoading(false);
      setSignUpErrors({ nameError: FormErrorMessages.USER_ERROR});
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
