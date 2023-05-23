import React, { useEffect, useState } from 'react';
import styles from './form.module.scss';
import { Regex, RegexHelperMessages } from '@/constants/constants';
import { Grid, TextField, Button } from '@mui/material';
import { SignUpErrors, User } from '@/features/users/interfaces';

interface FormProps {
    formData: User;
    signUpErrors: Partial<SignUpErrors>;
    loginForm: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}
const Form = (props: FormProps) => {
    const { signupForm, formInput, showPswBtn } = styles;
    const { loginForm, formData, signUpErrors, handleChange, handleSubmit } = props;
    const[showPassword, setShowPassword] = useState<boolean>(false);
    useEffect(() => {
      setShowPassword(false);
    }, [loginForm, formData]);
    const { nameError, emailError, passwordError } = signUpErrors;

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
              title: RegexHelperMessages.FIRST_NAME
            }}
            helperText={nameError}
            error={!!nameError}
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
            helperText={emailError}
            error={!!emailError}
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
              title: RegexHelperMessages.PASSWORD
            }}
            helperText={loginForm && passwordError}
            error={!!passwordError}
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
              title: RegexHelperMessages.PASSWORD
            }}
            helperText={passwordError}
            error={!!passwordError}
          />
        </Grid>
        }
        <Grid item xs={12}>
          <Button type="submit" variant="outlined" >
          {!loginForm ? 'Sign Up' : 'Sign In'}  
          </Button>
        </Grid>
      </Grid>
    </form>
    <button
     className={showPswBtn}
     onClick={() => setShowPassword(!showPassword)}
     >
      {showPassword ? 'hide password': 'show password'}
    </button>
  </>
  );
};

export default Form;