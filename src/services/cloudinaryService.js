import axios from 'axios';

const API_URL = 'http://localhost:5000/api/upload';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post(API_URL, formData);
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
