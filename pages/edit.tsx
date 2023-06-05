import React, { useEffect, useState } from 'react';
import styles from '../styles/edit.module.scss';
import Form from '@/components/form/Form';
import { SignUpErrors, User } from '@/features/users/interfaces';
import secureLocalUtils from '../utils/secureLocalStorageUtils';
import { FormErrorMessages } from '@/constants/constants';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setLogged, setUser } from '@/features/users/usersSlice';
import BcryptUtils from '@/utils/bcryptUtils';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import { SvgIcon } from '@mui/material';
import { DeleteResult } from 'mongodb';
import { deleteCookie } from 'cookies-next';
import { DeleteResultsFromMongo } from '@/lib/interfacesforMongo';

const Edit = () => {
    const { ediFormContainer, deleteUserBtn } = styles;
    const { checkBcryptedPassword, encryptPassowrd } = BcryptUtils;
    const { setEncryptedDataToLocalStorage, getDecryptedDataFromLocalStorage } = secureLocalUtils;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const initSignUpErrors: SignUpErrors = {
        nameError: '',
        emailError: '',
        passwordError: ''
      };
      const initFormData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      };
    const [formData, setFormData] = useState<User>(initFormData);
    const [userFromLocal, setUserFromLocal] = useState({} as User);
    const [signUpErrors, setSignUpErrors] = useState<Partial<SignUpErrors>>(initSignUpErrors);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
      useEffect(() => {
        const dataFromLocal: User = getDecryptedDataFromLocalStorage('user');
        dataFromLocal && setUserFromLocal(dataFromLocal);
      }, [getDecryptedDataFromLocalStorage]);

    const handlleChangeValues = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
         setFormData({...formData, [e.target.name]: e.target.value });
    };
    const handlleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setFormData({...formData, id: userFromLocal.id });
       const matchedPassword = await checkBcryptedPassword(formData.password, userFromLocal.password);
       if (!matchedPassword) {
        setSignUpErrors({ passwordError: FormErrorMessages.PASSWORD_VALID_ERROR});
        setLoading(false);
       } else {
        const { name, email, password } = formData;
        const { _id } = userFromLocal;
         const res = await fetch('/api/users/', {
            method: 'PUT',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({ newUser: { name, email, password }, id: _id })
         });
         const data = await res.json();
         if(data.acknowledged) {
          
            try {
                const { name, email, password } = formData;
                const { id } = userFromLocal;
                setLoading(false);
                dispatch(setUser({ name, email, password, id }));
                const securePassword = await encryptPassowrd(password) as string;
                setEncryptedDataToLocalStorage('user', { name, email, password: securePassword, id });
            } catch (error) {
                console.error(error);
            } finally {
                router.push(`/painters/${userFromLocal.id}`);
            }
         }
       }
    };
   const handleDeleteUser = async () => {
    setDeleting(true);
    const { id } = userFromLocal;
    const res = await fetch('/api/users/', {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': JSON.stringify({ id }),
    } 
   });
   const data: DeleteResultsFromMongo = await res.json();
   if(data) {
    const { resultFromDeleteUser, resultFromDeleteToken, resultFromDeleteImages } = data;
    const imagesDeleted: boolean = resultFromDeleteImages.message === 'file deleted';
    const userDeleted: boolean = resultFromDeleteUser.deletedCount > 0 ;
    const tokenDeleted: boolean = resultFromDeleteToken.deletedCount > 0;

    if(userDeleted && tokenDeleted && imagesDeleted) {
      dispatch(setUser({} as User));
      dispatch(setLogged(false));
      localStorage.clear();
      setUserFromLocal({} as User);
      deleteCookie('token');
      router.push('/');
      setDeleting(false);
    }
    } else {
      
   }
   
   };

  return (
    <div className={ediFormContainer}>
     <Form
      formData={formData}
      handleChangeValues={handlleChangeValues}
      handleSubmit={handlleSubmit}
      loading={loading}
      loginForm={false}
      signUpErrors={signUpErrors}
      textSubmitBtn="Update Profile"
     />
     <div className="">
      <LoadingButton
       loading={deleting}
       type="button"
       variant="outlined"
       startIcon= {
        <SvgIcon/>
       }
       loadingPosition='start'
       onClick={handleDeleteUser}
       className={deleteUserBtn}

        >Delete Profile</LoadingButton>
     </div>
    </div>
  );
};

export default Edit;
