import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { authAPI } from '../lib/api';
import { UserLogin, RegisterData } from '../types/user';

export const useAuth=()=>{
    const [isLoading,setIsLoading]=useState(false);
    const[error,setError]=useState<string|null>(null);
    const{setUser,logout:storeLogout,clearError}=useAuthStore();
    const login=useCallback(async(credentials:UserLogin)=>{
        try{
            setIsLoading(true);
            setError(null);
            const result=await authAPI.login(credentials);
            if(result.data?.token){localStorage.setItem('token',result.data.token);}
            if (result.data) {setUser(result.data);}
            setIsLoading(false);
            return result.data;
        }catch(err:any){
            const errorMessage=err.response?.data?.message|| err.message || 'Login failed';
            setError(errorMessage);
            setIsLoading(false);
            throw err;
        }
    },[setUser]);

    const register = useCallback(async (userData: RegisterData) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await authAPI.register(userData);
            
            if (result.data?.token) {
                localStorage.setItem('token', result.data.token);
            }
            
            if (result.data) {
                setUser(result.data);
            }
            
            setIsLoading(false);
            return result.data;
        } catch (err:any) {
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
            setError(errorMessage);
            setIsLoading(false);
            throw err;
        }
    }, [setUser]);
    const logout=useCallback(async()=>{
        try{
            await authAPI.logout();
            storeLogout();
            setError(null);
            setIsLoading(false);
        } catch (err) {
            // Even if API fails, clear local state
            storeLogout();
            setError(null);
            setIsLoading(false);
            // No throw - logout should always succeed locally
        }
    }, [storeLogout]);
    const getUserProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const user = await authAPI.getUserProfile();
            setUser(user);
            setIsLoading(false);
            return user;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to get profile';
            setError(errorMessage);
            setIsLoading(false);
            throw err;  // Re-throw for component handling
        }
    }, [setUser]);
    const clearErrorState = useCallback(() => {
        setError(null);
        clearError();
    }, [clearError]);

    return {
        isLoading,
        error,
        login,
        register,
        logout,
        getUserProfile,
        clearError: clearErrorState
    };
};