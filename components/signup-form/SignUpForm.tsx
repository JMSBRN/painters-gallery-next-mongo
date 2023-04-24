import { TextField, Button, Grid } from '@mui/material';
import { useState } from 'react';
import styles from './signupForm.module.scss';
import { ErrorMessages, Regex } from '@/constants/constants';
import { addUser } from '@/utils/apiUtils';

const SignUpForm = () => {
  const { signupForm, formInput, formContainer, showPswBtn, cretedUserMsg } = styles;
  const initFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const [formData, setFormData] = useState(initFormData);
  const[showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmError, setConfirmError] = useState<string>('');
  const [createdUser, setCreatedUser] = useState<boolean>(false);

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
      setCreatedUser(true);
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
      { createdUser && <div onClick={() => setCreatedUser(false)} className={cretedUserMsg}>user was created successfully <div>click to close</div></div>
      }
      <form className={signupForm} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              className={formInput}
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={true}
              inputProps={{
                pattern: Regex.FIRST_NAME,
                title: ErrorMessages.FIRST_NAME
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={formInput}
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={formInput}
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text': 'password'}
              value={formData.password}
              onChange={handleChange}
              required={true}
              inputProps={{
                pattern: Regex.PASSWORD,
                title: ErrorMessages.PASSWORD
              }}
              error={!!confirmError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={formInput}
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text': 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required={true}
              inputProps={{
                pattern: Regex.PASSWORD,
                title: ErrorMessages.PASSWORD
              }}
              helperText={confirmError}
              error={!!confirmError}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
      <button className={showPswBtn} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'hide password': 'show password'}</button>

    </div>
  );
};
export default SignUpForm;
