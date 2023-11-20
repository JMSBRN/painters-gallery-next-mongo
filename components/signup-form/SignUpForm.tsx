import { SignUpErrors, User } from '@/features/users/interfaces';
import { useEffect, useState } from 'react';
import Form from '../form/Form';
import { FormErrorMessages } from '@/constants/constants';
import bcrypt from 'bcryptjs';
import styles from './signupForm.module.scss';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

const SignUpForm = ({ users }: { users: string}) => {
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
  const [loading, setLoading] = useState<boolean>(false);
  const [usersDb, setUsersDb] = useState<User[]>([]);
  const { name, email, password, confirmPassword } = formData;
  const router = useRouter();
  const nakedPassword = password;
  const secret = process.env.CALL_SECRET;

  useEffect(() => {
   setUsersDb(JSON.parse(users));
  }, [users]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const confirmed = password.localeCompare(confirmPassword, 'en', { sensitivity: 'base' }) === 0;

    if(confirmed) {
       const userByName = usersDb.find(el => el.name === name);
       const userByEmail = usersDb.find(el => el.email === email);

        if(userByName) {
          setLoading(false);
          setSignUpErrors( { nameError:  FormErrorMessages.NAME_ERROR });
        } else if (userByEmail) {
          setLoading(false);
          setSignUpErrors( { emailError: FormErrorMessages.EMAIL_ERROR });
        } else {
          setSignUpErrors(initSignUpErrors);
          setFormData(initFormData);
          const id = uuidv4();
          const salt = await bcrypt.genSalt(10);
          const password = await  bcrypt.hash(nakedPassword, salt);

          if (password) {
            await fetch('/api/auth/', {
              method: 'POST',
              headers: { 
                'Authorization': JSON.stringify({ secret }),
                'Content-Type' : 'application/json'
               },
              body: JSON.stringify({ id, name, email, password })
            });
             router.push('/login');
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
      <Form 
       loading={loading}
       loginForm={false}
       signUpErrors={signUpErrors}
       formData={formData}
       handleChangeValues={handleChange}
       handleSubmit={handleSubmit}
       textSubmitBtn='Sign Up'
      />
    </div>
  );
};

export default SignUpForm;

