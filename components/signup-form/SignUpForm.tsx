import { TextField, Button, Grid } from '@mui/material';
import { useState } from 'react';
import styles from './signupForm.module.scss';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setUser } from '@/features/users/usersSlice';

const SignUpForm = () => {
  const { signupForm, formInput } = styles;
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setUser(formData));
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
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={formInput}
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={formInput}
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default SignUpForm;
