import axios, { AxiosResponse } from 'axios';
import showToast from '../helpers/toast';
import FormData from 'form-data';



const baseUrl: string = 'http://localhost:7001';

interface Headers {
    Accept: string;
    Authorization?: string;
}

class ApiServices {
    private static _apiServices: ApiServices = new ApiServices();

    private constructor() { }

    public static getInstance(): ApiServices {
        return this._apiServices;
    }

    private async headers(useToken: boolean): Promise<Headers> {
        if (useToken) {
            const token: string | null = localStorage.getItem("token");
            if (!token) {
                showToast('error', 'Session Kamu Habis, masuk lagi yuk !');
                localStorage.clear();
                window.location.reload();
                throw new Error('');
            }
            return {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            };
        } else {
            return {
                Accept: 'application/json'
            };
        }
    }

    public async get(uri: string, params?: Record<string, any>, useToken: boolean = false): Promise<AxiosResponse> {
        const paramsText: string = params ? `?${new URLSearchParams(params).toString()}` : '';
        const url: string = `${uri}${paramsText}`;
        const headers: Headers = await this.headers(useToken);
        return axios.get(url, { headers: { ...headers } });
    }
    public async post(uri: string, body?: Record<string, any>, useToken: boolean = false, params?: Record<string, any>): Promise<AxiosResponse> {
        const paramsText: string = params ? `?${new URLSearchParams(params).toString()}` : '';
        const url: string = `${uri}${paramsText}`;
        const headers: Headers = await this.headers(useToken);
        return axios.post(url, body, { headers: { ...headers } });
    }

    // public isTokenExpired(token: string): boolean {
    //     try {
    //         const decodedToken: { [key: string]: any } = jwt_decode(token);
    //         if (decodedToken.exp) {
    //             const expirationTime: number = decodedToken.exp;
    //             const currentTime: number = Math.floor(Date.now() / 1000);
    //             return currentTime > expirationTime;
    //         } else {
    //             return true;
    //         }
    //     } catch (error) {
    //         return true;
    //     }
    // }

    public async getData(uri: string, params?: Record<string, any>, useToken: boolean = false): Promise<AxiosResponse> {
        const paramsText: string = params ? `?${new URLSearchParams(params).toString()}` : '';
        const url: string = `${baseUrl}/${uri}${paramsText}`;
        const headers: Headers = await this.headers(useToken);
        return axios.get(url, { headers: { ...headers } });
    }

    public async postData(
        uri: string,
        body: Record<string, any>,
        params?: Record<string, any>,
        useToken: boolean = false
    ): Promise<AxiosResponse> {
        const paramsText: string = params ? `?${new URLSearchParams(params).toString()}` : '';
        const url: string = `${baseUrl}/${uri}${paramsText}`;
        const headers: Headers = await this.headers(useToken);
        return axios.post(url, body, { headers: { ...headers } });
    }



    public async uploadFile(
        uri: string,
        body: Record<string, any>,
        files: Record<string, File>,
        params?: Record<string, any>,
        useToken: boolean = false,
        method: 'POST' | 'PATCH' = 'POST' // New method parameter
    ): Promise<AxiosResponse> {
        const formData = new FormData();

        // Append files to FormData
        if (files && Object.keys(files).length > 0) {
            Object.keys(files).forEach(key => {
                formData.append(key, files[key]);
            });
        }

        // Append body fields to FormData
        Object.keys(body).forEach(key => {
            formData.append(key, body[key]);
        });

        // Construct query string from params
        const paramsText: string = params ? `?${new URLSearchParams(params).toString()}` : '';
        const url: string = `${baseUrl}/${uri}${paramsText}`;
        const headers: Headers = await this.headers(useToken);

        return axios({
            url,
            method,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...headers,
            }
        });
    }


    public async deleteData(uri: string, params?: Record<string, any>, useToken: boolean = false): Promise<AxiosResponse> {
        const paramsText: string = params ? `?${new URLSearchParams(params).toString()}` : '';
        const url: string = `${baseUrl}/${uri}${paramsText}`;
        const headers: Headers = await this.headers(useToken);
        return axios.delete(url, { headers: { ...headers } });
    }
    public async patchData(
        uri: string,
        body: Record<string, any>,
        params?: Record<string, any>,
        useToken: boolean = false
    ): Promise<AxiosResponse> {
        const paramsText: string = params ? `?${new URLSearchParams(params).toString()}` : '';
        const url: string = `${baseUrl}/${uri}${paramsText}`;
        const headers: Headers = await this.headers(useToken);
        return axios.patch(url, body, { headers: { ...headers } });
    }

}

export default ApiServices.getInstance();
