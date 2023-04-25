import { User } from '@/features/users/interfaces';

export const apiCall = async (method: string, id?: string, bodyData?: User) => {
  const options: RequestInit | undefined = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
  };
  if (id) {
    if (bodyData) {
      const res = await fetch(`/api/users/${id}`, options);
      const data = await res.json();
      return data;
    } else {
      const res = await fetch(`/api/users/${id}`, options);
      const data = await res.json();
      return data;
    }
  } else {
    const res = await fetch('/api/users/', options);
    const data = await res.json();
    return data;
  }
};
export const getUsers = async (id?: string) => {
  const data = await apiCall('GET', id);
  return data;
};
export const addUser = async (bodyData: User) => {
  const data = await apiCall('POST', undefined, bodyData);
  return data;
};
export const updateUser = async (id: string, bodyData: User) => {
  const data = await apiCall('PUT', id, bodyData);
  return data;
};
export const deleteUser = async (id: string) => {
  const data = await apiCall('DELETE', id);
  return data;
};

export const findUserByName = async (name: string) => {
  const users: User[] = await getUsers();
  const findedUser = users.find( el => el.name === name);
  return findedUser;
};
export const findUserByEmail = async (email: string) => {
  const users: User[] = await getUsers();
  const findedUser = users.find( el => el.email === email);
  return findedUser;
};

export const findUser = async (name: string, email: string) => {
  const userByName = await findUserByName(name);
  const userByEmail = await findUserByEmail(email);
   return {userByName, userByEmail};
};