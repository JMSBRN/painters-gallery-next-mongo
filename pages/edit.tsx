import React from 'react';
import styles from '../styles/edit.module.scss';
import Form from '@/components/form/Form';
import { SignUpErrors, User } from '@/features/users/interfaces';

const Edit = () => {
    const { ediFormContainer } = styles;
    const initSignUpErrors: SignUpErrors = {
        nameError: '',
        emailError: '',
        passwordError: ''
      };
    const user: User = {
        name: 'as',
        email: 'as@as',
        password: '123456As'
    };

    const handlleChangeValues = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {};
    const handlleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
    };

  return (
    <div className={ediFormContainer}>
     <Form
      formData={user}
      handleChangeValues={handlleChangeValues}
      handleSubmit={handlleSubmit}
      loading={false}
      loginForm={false}
      signUpErrors={initSignUpErrors}
      textSubmitBtn="Update Profile"
     />
    </div>
  );
};

export default Edit;
