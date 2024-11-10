import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8888',
});

export const getTTS = async (text: string) => {
    return await api.post('/tts', {
        text: text
    });
}

export const getTTSfromQuery = async (query: string) => {
    return await api.get('/llm/' + query);
}
