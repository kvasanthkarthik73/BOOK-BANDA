import {create} from 'zustand';
import {User} from '../types/user';

interface AuthState{
    user:User|null;
    isLoggedIn:boolean;
    isLoading:boolean;
    error:string|null;
    //actions
    setUser:(user:User)=>void;
    logout:()=>void;
    setLoading:(Loading:boolean)=>void;
    setError:(error:string|null)=>void;
    clearError:()=>void;
}

export const useAuthStore=create<AuthState>((set)=>({
    user:null,
    isLoggedIn:false,
    isLoading:false,
    error:null,

    setUser:(user)=>set({
        user,
        isLoggedIn:true,
        error:null
    }),
    logout:()=>set({
        user:null,
        isLoggedIn:false,
        error:null
    }),
    setLoading:(isLoading)=>set({isLoading}),
    setError:(error)=>set({error}),
    clearError:()=>set({error:null})

}));

