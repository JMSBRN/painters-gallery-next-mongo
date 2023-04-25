import { useState } from 'react';
import styles from './signupForm.module.scss';
import { addUser, findUserByName, getUsers } from '@/utils/apiUtils';
import Form from '../form/Form';
import { SignUpErrors, User } from '@/features/users/interfaces';

const SignUpForm = () => {
  const { formContainer } = styles;
  const initFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const initSignUpErrors = {
    confirm: '',
    exist: ''
  };
  const [formData, setFormData] = useState(initFormData);
  const [signUpErrors, setSignUpErrors] = useState<Partial<SignUpErrors>>(initSignUpErrors);
  const [loginForm, setLoginForm] = useState<boolean>(false);
  const { name, email, password, confirmPassword } = formData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = password.localeCompare(confirmPassword, 'en', { sensitivity: 'base' }) === 0;
    if(confirmed) {
       const findedUser = await findUserByName(name);
        if(findedUser) {
          setSignUpErrors( { exist: 'User with this name already exist' });
        } else {
          setLoginForm(true);
          setSignUpErrors(initSignUpErrors);
          setFormData(initFormData);
          await addUser({
            name,
            email,
            password
          });
        }
    } else {
      setSignUpErrors({ confirm:'Passwords not match' });
    }  
     if (loginForm) {
      setSignUpErrors(initSignUpErrors);
       const data = await getUsers();
       console.log(data); 
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
       loginForm={loginForm}
       signUpErrors={signUpErrors}
       formData={formData}
       handleChange={handleChange}
       handleSubmit={handleSubmit}
      />
    </div>
  );
};
export default SignUpForm;
