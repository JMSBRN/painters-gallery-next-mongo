import { Checkbox, SvgIcon } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { selectImages, setImagesImgBb } from '@/features/images/imagesSlice';
import { selectUsers, setUser } from '@/features/users/usersSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DeleteResult } from 'mongodb';
import Image from 'next/image';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import UploadFormImgBB from '@/components/upload-from/UploadFormImgBB';
import { User } from '@/features/users/interfaces';
import jwt from 'jsonwebtoken';
import secureCookieUtils from '../../utils/secureCookiesUtils';
import styles from './painter.module.scss';
import { useRouter } from 'next/router';

const Painter = () => {
  const { 
    painterContainer,
    imagesStyle,
    uploadsStyle,
    ImageLayout,
    deleteImagesBtn,
    painterImg
   } = styles;
  const { setEncryptedDataToCookie,  getDecryptedDataFromCookie } = secureCookieUtils;
  const dispatch = useAppDispatch();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const { id } = useRouter().query;
  const { user } = useAppSelector(selectUsers);
  const { imagesImgBB } = useAppSelector(selectImages);
  const secret = process.env.CALL_SECRET; 

  const getImagesFromImgBB = useCallback(async () => {
    const res = await fetch('/api/images-imgbb/', {
      method: 'POST',
      headers: {
        'Authorization': JSON.stringify({ secret }),
        'Content-Type': 'application/json'
        },
      body: JSON.stringify({ id })
    });   
    const images = await res.json();

    if(images) {
      return images;
    } else {
      return null;
    }
  }, [id, secret]);
   
 useEffect(() => {
  if (id && !user.name) {
    const f = async () => {
      const res = await fetch(`/api/users/${id}`, {
        method: 'GET',
        headers: { 'Authorization': JSON.stringify({ secret }) }
      });
      const data: User = await res.json();

      dispatch(setUser(data));
    };

    f();
  }
 }, [dispatch, id, secret, user.name]);
 
 useEffect(() => {
  const f = async () => {
    const images = await getImagesFromImgBB();

    if(images) {
      dispatch(setImagesImgBb(images));
    }
  };

  f();
 }, [dispatch, getImagesFromImgBB, id]);

  useEffect(() => {   
    const token = getDecryptedDataFromCookie('token');  

    if(token) {
    jwt.verify(token.slice(1, -1), process.env.JWT_ACCES_SECRET!, async (err: any) => {
       if(err) {
        console.error('error from verify token in painer', err);
           if (err.message === 'jwt expired') {
             const res = await fetch('/api/refresh-token/',{
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(id)
           });
           const data = await res.json();

           if(data.accessToken) {
            setEncryptedDataToCookie('token', data.accessToken);
             setAuthorized(true);
            }
          }
        } else {
          setAuthorized(true);
        }
      });
    } else {
      return;
    }
      
  }, [getDecryptedDataFromCookie, id, setEncryptedDataToCookie]);
  
  const handleDeleteSelectedImages = async () => {
    setLoading(true);
   const promiseResult: DeleteResult[] = await Promise.all(
      selectedImages.map( async (el) => {        
        const res = await fetch('/api/images-imgbb/', {
          method: 'DELETE',
          headers: { 'Authorization': JSON.stringify({ secret, id: el }) },
        });
        const result = await res.json();

        return result;
      })
    );
      const deletedImages: boolean = promiseResult.every(el => el.deletedCount > 0 ); 

      if(deletedImages) {
        const images = await getImagesFromImgBB();

        dispatch(setImagesImgBb(images));
         setLoading(false);
         setSelectedImages([]);
      }
    
  };

  const handleChangeCheckBox = (e: React.ChangeEvent<HTMLInputElement>)=> {
     const { value, checked } = e.target;

     if(checked) {
       setSelectedImages([...selectedImages, value]);
     } else { 
      setSelectedImages(selectedImages.filter(el => el !== value));
     }
  };

  return (
    <>
    { authorized &&
    <div className={painterContainer}>
        <div className={uploadsStyle}>
            {selectedImages.length ?
             <LoadingButton
               className={deleteImagesBtn}
               loading={loading}
               startIcon={ 
                <SvgIcon>
                    < DeleteForeverIcon />;
                </SvgIcon>
              }
               loadingPosition='start'
               variant='outlined'
               onClick={handleDeleteSelectedImages}
               >
              Delete selected file
             </LoadingButton>
             :
             <UploadFormImgBB />
            }
          </div>
          <div className={imagesStyle}>
            {imagesImgBB.map((el, idx) => <div className={ImageLayout} key={idx.toString()}>
                  <Checkbox
                   value={el._id.toString()}
                   checked={selectedImages.includes(el._id.toString())}
                   onChange={(e) => handleChangeCheckBox(e)}
                   size='small'
                   sx={{
                    color: 'lightgrey',
                    '&.Mui-checked': {
                      color: 'blue',
                    }
                  }}
                  />
                  <Link style={{ cursor: 'zoom-in' }} target='_blank' href={el.url}>
                    <Image
                      width={220}
                      height={136}
                      className={painterImg}
                      alt={el.title as string}
                      src={el.display_url}
                      priority={true}
                      />
                  </Link>
                 </div>
            )}
          </div>
       </div>
       }
        </>
    );
  };
  
  export default Painter;
  