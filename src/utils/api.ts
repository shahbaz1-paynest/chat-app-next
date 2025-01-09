import axios, { AxiosRequestConfig } from 'axios';
import { initPrompt, baseUrl, tokenKey } from '@/constants';

export async function apiRequest<T>({
    url,
    method = 'GET',
    data = {},
    params = {},
    headers = {},
  }: {
    url: string;
    method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
  }): Promise<T | null> {
    try {
      const accessToken = localStorage.getItem(tokenKey);
  
      const config: AxiosRequestConfig = {
        method,
        url: `${baseUrl}${url}`,
        headers: {
          ...headers,
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
          'Content-Type': 'application/json',
        },
        params: params,
        data: data,
      };
  
      const response = await axios(config);
  
      return response.data;
    } catch (error: any) {
    //   if (error.response?.status === 401) {
    //     const refreshedToken = await refreshToken();
    //     if (refreshedToken) {
    //       return apiRequest({ url, method, data, params, headers });
    //     }
    //   }
    console.log(error);
    
      return null;
    }
  }