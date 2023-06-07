import React, { useCallback, useEffect, useState } from 'react';
import { User } from '@/features/users/interfaces';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectUsers, setUser } from '@/features/users/usersSlice';
import { ImageFromMongo } from '@/lib/interfacesforMongo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './painter.module.scss';
import { LoadingButton } from '@mui/lab';
import jwt from 'jsonwebtoken';
import { selectImages, setImages } from '@/features/images/imagesSlice';
import { Checkbox, SvgIcon } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import secureCookieUtils from '../../utils/secureCookiesUtils';
import UploadFormImgBB from '@/components/upload-from/UploadFormImgBB';

const Painter = () => {
  const { painterContainer, imagesStyle, uploadsStyle, ImageLayout, deleteImagesBtn } = styles;
  const { setEncryptedDataToCookie,  getDecryptedDataFromCookie } = secureCookieUtils;
  const dispatch = useAppDispatch();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const { id } = useRouter().query;
  const { user } = useAppSelector(selectUsers);
  const { images } = useAppSelector(selectImages);
  const secret = process.env.CALL_SECRET; 
  
  const getImagesFromMongo = useCallback(async () => {
    const res = await fetch(`/api/images/${id}`, {
      method: 'GET',
      headers: {'Authorization': JSON.stringify({ secret })}
    });   
    const data = await res.json();
    const parsedImages: ImageFromMongo[] = JSON.parse(data || '[]');
    return parsedImages;
  }, [id, secret]);
 
 useEffect(() => {
  if (id && !user.name) {
    const f = async () => {
      const res = await fetch(`/api/users/${id}`, {
        method: 'GET',
        headers: { 'Authorization': JSON.stringify({ secret })}
      });
      const data: User = await res.json();
      dispatch(setUser(data));
    };
    f();
  }
 }, [dispatch, id, secret, user.name]);
 
 useEffect(() => {
  const f = async () => {
    const parsedImages  =  await getImagesFromMongo();
    parsedImages && dispatch(setImages(parsedImages));
  };
  f();
 }, [dispatch, getImagesFromMongo]);

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
   const result = await Promise.all(
      selectedImages.map( async (el) => {
        const res = await fetch(`/api/images/${el}`, {
          method: 'DELETE',
          headers: {'Authorization': JSON.stringify({ secret })}
        });
        const result = await res.json();
        if (result.message === 'file deleted') {
          // ??? logic
        }
        // logic if error
      })
    );
    if(result) {
      const parsedImages = await getImagesFromMongo();
      dispatch(setImages(parsedImages));
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
            {images.map((el, idx) => <div className={ImageLayout} key={idx.toString()}>
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
              <Image
                width={20}
                height={20}
                alt={el.metadata?.fileName as string}
                src={el.data}
                priority={true}
                />
                
            </div>
            )}
          </div>
       </div>
       }
        </>
    );
  };
  
  export default Painter;
  