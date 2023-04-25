import { useState } from 'react';
import styles from './signupForm.module.scss';
import { addUser } from '@/utils/apiUtils';
import Form from '../form/Form';

const SignUpForm = () => {
  const { formContainer } = styles;
  const initFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const [formData, setFormData] = useState(initFormData);
  const [confirmError, setConfirmError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    const confirmed: boolean = password.localeCompare(confirmPassword, 'en', { sensitivity: 'base' }) === 0;
    if(confirmed) {
      await addUser({
        name,
        email,
        password
      });
      setConfirmError('');
      setFormData(initFormData);
    } else {
      setConfirmError('Passwords not match');
    }
    
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={formContainer}>
      <Form 
      loginForm={false}
      confirmError={confirmError}
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}/>
    </div>
  );
};
export default SignUpForm;
