import axios from 'axios';
import { ApiResponse } from '../types/artwork';

const API_BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export const fetchArtworksFromApi = async (page: number): Promise<ApiResponse> => {
    const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=12`);
    return response.data;
};