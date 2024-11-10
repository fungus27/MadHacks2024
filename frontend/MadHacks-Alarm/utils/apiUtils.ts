import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    });

export const getTTS = async (text: string, queryToLookup: string) => {
    return await api.get('/tts', {
        params: {
            text,
            queryToLookup
        }
    });
}