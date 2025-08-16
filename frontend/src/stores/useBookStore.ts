import {create} from 'zustand';
import {Book,BookFilters} from '../types/book';
import {PaginatedResponse} from '../types/api';

interface BookState{
    books:Book[];
    featuredBooks:Book[];
    currentBook:Book |null;
    searchQuery:string;
    selectedGenre:string;
    currentPage:number;
    totalPages:number;
    totalBooks:number;
    isLoading:boolean;
    error:string|null;

    setBooks:(books: Book[])=>void;
    setFeaturedBooks:(books:Book[])=>void;
    setCurrentBook: (book: Book | null) => void;
    setSearchQuery:(query:string)=>void;
    setSelectedGenre:(genre:string)=>void;
    setPagination:(page:number,totalPages:number,totalBooks:number)=>void;
    setLoading:(isLoading:boolean)=>void;
    setError:(error:string|null)=>void;
    clearError:()=>void;
    resetFilters:()=>void;

}

export const useBookStore = create<BookState>((set)=>({
    books:[],
    featuredBooks:[],
    currentBook:null,
    searchQuery:'',
    selectedGenre:'',
    currentPage:1,
    totalPages:1,
    totalBooks:0,
    isLoading:false,
    error:null,

    setBooks:(books)=>set({books}),
    setFeaturedBooks:(books)=>set({featuredBooks:books}),
    setCurrentBook: (book) => set({currentBook:book}),
    setSearchQuery:(query)=>set({searchQuery:query, currentPage:1}),
    setSelectedGenre:(genre)=>set({selectedGenre:genre, currentPage:1}),
    setPagination:(page,totalPages,totalBooks)=>set({currentPage:page,totalPages,totalBooks}),
    setLoading:(isLoading)=>set({isLoading}),
    setError:(error)=>set({error}),
    clearError:()=>set({error:null}),
    resetFilters:()=>set({searchQuery:'',selectedGenre:'',currentPage:1})

})
);
