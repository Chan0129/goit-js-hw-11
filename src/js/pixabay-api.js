export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '42884844-fe65db1ad432ae960c42445b0';

export const options = {
    params: {
        key: API_KEY,
        q: '',
        image_type: photo,
        orientation: horizontal,
        safesearch: true,
        page: 1,
        per_page: 40,
    },
};