import React from 'react';
import styles from './searchForm.module.scss';

interface SearchFormProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
const SearchForm = ({
    handleChange,
    handleSubmit
}: SearchFormProps) => {
    const {
        searchForm,
        searchInputContainer
    } = styles;

  return (
    <form className={searchForm} onSubmit={handleSubmit}>
        <div className={searchInputContainer}>
            <input 
            type="text"
            placeholder='Search'
            onChange={handleChange}
            />
            <input  type="submit" />
        </div>
    </form>
  );
};

export default SearchForm;      
