import { useState } from 'react';
import styles from './signupForm.module.scss';
import Form from '../form/Form';
import { SignUpErrors, User } from '@/features/users/interfaces';
import { useRouter } from 'next/router';
import { FormErrorMessages } from '@/constants/constants';
import Loader from '../loader/Loader';

const SignUpForm = ({ users }: { users: string}) => {
  const { formContainer, loaderContainer } = styles;
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
  const [usersDb, setUsersDb] = useState<User[]>(JSON.parse(users));
  const { name, email, password, confirmPassword } = formData;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const confirmed = password.localeCompare(confirmPassword, 'en', { sensitivity: 'base' }) === 0;
    if(confirmed) {
       const userByName = usersDb.find(el => el.name === name);
       const userByEmail = usersDb.find(el => el.email === email);
        if(userByName) {
          setLoading(false);
          setSignUpErrors( { nameError:  FormErrorMessages.NAME_ERROR});
        } else if (userByEmail) {
          setLoading(false);
          setSignUpErrors( { emailError: FormErrorMessages.EMAIL_ERROR });
        } else {
          setSignUpErrors(initSignUpErrors);
          setFormData(initFormData);
          const result = await fetch('/api/adduser', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ name, email, password }),
          });
          if (result) {
             router.push('/auth/login');
           }
        }
    } else {
        setLoading(false);
        setSignUpErrors({ passwordError: FormErrorMessages.PASSWORD_CONFIRM_ERROR });
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
      { !loading && 
      <Form 
       loginForm={false}
       signUpErrors={signUpErrors}
       formData={formData}
       handleChange={handleChange}
       handleSubmit={handleSubmit}
      />
      }
    </div>
  );
};
export default SignUpForm;

