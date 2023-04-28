import React, { useState } from 'react';

 const  UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload image');
        } else {
          setUploading(false);
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while uploading the image');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload Image:
        <input type="file" onChange={handleFileChange} />
      </label>
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default UploadForm;