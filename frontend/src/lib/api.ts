import axios from 'axios';
import {User,UserLogin,RegisterData} from '../types/user';
import {Book,BookFilters} from '../types/book';
import { UserBook, ReadingProgress,BookRating,BookNotes} from '../types/userBook';
import {ApiResponse,PaginatedResponse} from '../types/api';
const API_BASE_URL = 'http://localhost:5000/api/v1';
const api =axios.create({baseURL:API_BASE_URL,
    headers:{'Content-Type':'application/json',},
});
//Add auth tokens to every request automatically
 api.interceptors.request.use((config)=>{
    const token =localStorage.getItem('token');
    if(token){config.headers.Authorization=`Bearer ${token}`}
    return config;
 });
 api.interceptors.response.use(
    (response)=>response,
    (error)=>{if(error.response?.status===401){
        localStorage.removeItem('token');
    window.location.href='/auth/login';
    }
    return Promise.reject(error);
}
);

export const authAPI={
    login:async(credentials:UserLogin): Promise<ApiResponse<User>>=>{
        const response = await api.post('/auth/login',credentials);
        return response.data;
    },
    register:async(userData:RegisterData):Promise<ApiResponse<User>>=>{
        const response=await api.post('/auth/register',userData);
        return response.data;
    },
    getUserProfile: async():Promise<User>=>{
        const response =await api.get('/auth/profile');
        return response.data;
    },
    logout:async():Promise<void>=>{
        localStorage.removeItem('token');
    }
};

export const bookAPI={
    getAllBooks:async(filters:BookFilters):Promise<PaginatedResponse<Book>>=>{
        const response=await api.get('/books',{params:filters});
        return response.data;
    },
    getBookById:async(bookId:string):Promise<Book>=>{
        const response =await api.get(`/books/${bookId}`);
        return response.data;
    },
    getFeaturedBooks:async():Promise<Book[]>=>{
        const response=await api.get('/books/featured');
        return response.data;
    },
    searchBooks:async(query:string):Promise<Book[]>=>{
        const response=await api.get('/books/search',{ params: { q: query } });
        return response.data;
    },
    createBook: async (bookData: Partial<Book>): Promise<Book> => {
        const response = await api.post('/books', bookData);
        return response.data;
    },
    updateBook: async (bookId: string, bookData: Partial<Book>): Promise<Book> => {
        const response = await api.put(`/books/${bookId}`, bookData);
        return response.data;
    },
    deleteBook: async (bookId: string): Promise<Book> => {
        const response = await api.delete(`/books/${bookId}`);
        return response.data;
    }
};

export const userBookAPI={
    getUserBooks:async(status?:string): Promise<UserBook[]>=>{
        const response=await api.get('/user-books/my-books',{
            params:status?{status}:{}
        });
        return response.data;
    },
    addBookToList:async(bookData:{
        bookId: string;
        status?: string;
        pagesRead?: number;
        startDate?: Date;
        endDate?: Date;
        rating?: number;
        review?: string;
        notes?: string;
        isFavourite?: boolean;
    }): Promise<UserBook> => {
        const response = await api.post('/user-books/add', bookData);
        return response.data;
    },
    
    updateReadingProgress: async (bookId: string, pagesRead: number): Promise<UserBook> => {
        const response = await api.put(`/user-books/${bookId}/progress`, { pagesRead });
        return response.data;
    },

    updateBookStatus: async (bookId: string, status: string): Promise<UserBook> => {
        const response = await api.put(`/user-books/${bookId}/status`, { status });
        return response.data;
    },

    addRatingAndReview: async (bookId: string, rating: number, review?: string): Promise<UserBook> => {
        const response = await api.put(`/user-books/${bookId}/rating-review`, { rating, review });
        return response.data;
    },

    addNotes: async (bookId: string, notes: string): Promise<UserBook> => {
        const response = await api.put(`/user-books/${bookId}/notes`, { notes });
        return response.data;
    },

    removeBookFromList: async (bookId: string): Promise<{ message: string }> => {
        const response = await api.delete(`/user-books/${bookId}`);
        return response.data;
    },
    getReadingStats: async (): Promise<{
        totalBooks: number;
        tbr: number;
        currentlyReading: number;
        read: number;
        favourites: number;
        totalPagesRead: number;
        averageRating: string;
    }> => {
        const response = await api.get('/user-books/stats/reading');
        return response.data;
    }
};

export default api;







