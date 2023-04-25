import { useState } from 'react';
import styles from './signupForm.module.scss';
import { addUser, findUser, findUserByName } from '@/utils/apiUtils';
import Form from '../form/Form';
import { SignUpErrors } from '@/features/users/interfaces';
import { useRouter } from 'next/router';
import { FormErrorMessages } from '@/constants/constants';

const SignUpForm = () => {
  const { formContainer } = styles;
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
  const [loginForm, setLoginForm] = useState<boolean>(false);
  const { name, email, password, confirmPassword } = formData;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = password.localeCompare(confirmPassword, 'en', { sensitivity: 'base' }) === 0;
    if(confirmed) {
        const { userByName, userByEmail } = await findUser(name, email);
        if(userByName) {
          userByName && setSignUpErrors( { nameError:  FormErrorMessages.NAME_ERROR});
        } else if (userByEmail) {
          userByEmail && setSignUpErrors( { emailError: FormErrorMessages.EMAIL_ERROR });
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
      if(!loginForm) {
        setSignUpErrors({ passwordError: FormErrorMessages.PASSWORD_CONFIRM_ERROR });
      }
    }  
     if (loginForm) {
      setSignUpErrors(initSignUpErrors);
       const data = await findUserByName(name);
       if(data?._id) {
        if(data.password === password) {
          router.push(`/painters/${data._id}`);
        } else {
          setSignUpErrors({ passwordError: FormErrorMessages.PASSWORD_VALID_ERROR });
        }
       } else {
        setSignUpErrors({ nameError: FormErrorMessages.USER_ERROR});
       }
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

