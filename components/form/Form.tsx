import React, { useState } from 'react';
import styles from './form.module.scss';
import { Regex, ErrorMessages } from '@/constants/constants';
import { Grid, TextField, Button } from '@mui/material';
import { User } from '@/features/users/interfaces';

interface FormProps {
    formData: User;
    confirmError: string;
    loginForm: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}
const Form = (props: FormProps) => {
    const { signupForm, formInput, formContainer, showPswBtn } = styles;
    const { loginForm, formData, confirmError, handleChange, handleSubmit } = props;
    const[showPassword, setShowPassword] = useState<boolean>(false);
    
  return (   
  <>
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
        {!loginForm && 
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
        }
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
        {!loginForm && 
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
        }
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
          {!loginForm ? 'Sign Up' : 'Sign In'}  
          </Button>
        </Grid>
      </Grid>
    </form>
    <button className={showPswBtn} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'hide password': 'show password'}</button>
  </>
  );
};

export default Form;