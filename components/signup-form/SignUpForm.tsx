import { useState } from 'react';
import styles from './signupForm.module.scss';
import { addUser, findUser, findUserByName } from '@/utils/apiUtils';
import Form from '../form/Form';
import { SignUpErrors } from '@/features/users/interfaces';
import { useRouter } from 'next/router';
import { FormErrorMessages } from '@/constants/constants';
import Loader from '../loader/Loader';

const SignUpForm = () => {
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
  const { name, email, password, confirmPassword } = formData;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const confirmed = password.localeCompare(confirmPassword, 'en', { sensitivity: 'base' }) === 0;
    if(confirmed) {
        const { userByName, userByEmail } = await findUser(name, email);
        if(userByName) {
          setLoading(false);
          setSignUpErrors( { nameError:  FormErrorMessages.NAME_ERROR});
        } else if (userByEmail) {
          setLoading(false);
          setSignUpErrors( { emailError: FormErrorMessages.EMAIL_ERROR });
        } else {
          setLoading(false);
          setSignUpErrors(initSignUpErrors);
          setFormData(initFormData);
          await addUser({
            name,
            email,
            password
          });
          router.push('/auth/login');
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
      <Form 
       loginForm={false}
       signUpErrors={signUpErrors}
       formData={formData}
       handleChange={handleChange}
       handleSubmit={handleSubmit}
      />
    </div>
  );
};
export default SignUpForm;

