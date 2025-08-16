import {create} from 'zustand';
import {UserBook,ReadingProgress,BookRating,BookNotes} from '../types/userBook';

interface UserBookState{
    tbrBooks:UserBook[];
    currentlyReadingBooks:UserBook[];
    readBooks:UserBook[];
    favouriteBooks:UserBook[];
    readingProgress:Map<string,number>; //bookId,pagesRead
    isLoading:boolean;
    error:string|null;

    setTbrBooks:(books:UserBook[])=>void;
    setCurrentlyReading:(books:UserBook[])=>void;
    setReadBooks:(books:UserBook[])=>void;
    setFavouriteBooks:(books:UserBook[])=>void;
    //setReadingProgress:(bookId:string,pagesRead:number)=>void;
    setLoading:(isLoading:boolean)=>void;
    setError:(error:string|null)=>void;
    clearError:()=>void;

    addToTbr:(book:UserBook)=>void;
    addToCurrentlyReading:(book:UserBook)=>void;
    addToRead:(userBook:UserBook)=>void;
    addToFavourites: (userBook: UserBook) => void; 
    updateReadingProgress: (bookId: string, pagesRead: number) => void;
    removeFromList:(bookId:string)=>void;
    updateBookStatus:(bookId:string,status:'tbr'|'currently-reading'|'read'|'favourite')=>void;
    updateBookRating:(bookId:string,rating:number)=>void;
    updateBookNotes:(bookId:string,notes:string)=>void;
}

export const useUserBookStore=create<UserBookState>((set)=>({
    tbrBooks: [],
    currentlyReadingBooks: [],
    readBooks: [],
    favouriteBooks: [],
    readingProgress: new Map(),
    isLoading: false,
    error: null,

    setTbrBooks:(books:UserBook[])=>set({tbrBooks:books}),
    setCurrentlyReading:(books:UserBook[])=>set({currentlyReadingBooks:books}),
    setReadBooks:(books:UserBook[])=>set({readBooks:books}),
    setFavouriteBooks:(books:UserBook[])=>set({favouriteBooks:books}),
    // setReadingProgress:(bookId,pagesRead)=>set((state)=>{
    //     const newProgress =new Map(state.readingProgress);
    //     newProgress.set(bookId,pagesRead);
    //     return {readingProgress:newProgress};
    // }),
    setLoading:(isLoading)=>set({isLoading}),
    setError:(error)=>set({error}),
    clearError:()=>set({error:null}),

    addToTbr:(userBook)=>set((state)=>({
        tbrBooks:[...state.tbrBooks,userBook]
    })),
    addToCurrentlyReading:(userBook)=>set((state)=>({
        currentlyReadingBooks:[...state.currentlyReadingBooks,userBook]
    })),
    addToRead:(userBook)=>set((state)=>({
        readBooks:[...state.readBooks,userBook]
    })),
    addToFavourites:(userBook)=>set((state)=>({
        favouriteBooks:[...state.favouriteBooks,userBook]
    })),
    updateReadingProgress: (bookId, pagesRead) => set((state) => {
        const updateBookInList = (books: UserBook[]) =>
            books.map(book => 
                book.book === bookId ? { ...book, pagesRead } : book
            );
        
        const newProgress = new Map(state.readingProgress);
        newProgress.set(bookId, pagesRead);
        
        return {
            tbrBooks: updateBookInList(state.tbrBooks),
            currentlyReadingBooks: updateBookInList(state.currentlyReadingBooks),
            readBooks: updateBookInList(state.readBooks),
            favouriteBooks: updateBookInList(state.favouriteBooks),
            readingProgress: newProgress
        };
    }),
    removeFromList:(bookId)=>set((state)=>({
        tbrBooks: state.tbrBooks.filter(book=>book.book !=bookId),
        currentlyReadingBooks:state.currentlyReadingBooks.filter(book=>book.book !=bookId),
        readBooks:state.readBooks.filter(book=>book.book !=bookId),
        favouriteBooks:state.favouriteBooks.filter(book=>book.book !=bookId)
    })),
    updateBookStatus: (bookId, status) => set((state) => {
        const updateBookInList = (books: UserBook[]) =>
            books.map(book => book.book === bookId ? { ...book, status } : book);
        return {
            tbrBooks: updateBookInList(state.tbrBooks),
            currentlyReadingBooks: updateBookInList(state.currentlyReadingBooks),
            readBooks: updateBookInList(state.readBooks),
            favouriteBooks: updateBookInList(state.favouriteBooks)
        };
    }),
    updateBookRating: (bookId, rating) => set((state) => {
        const updateBookInList = (books: UserBook[]) =>
            books.map(book => book.book === bookId ? { ...book, rating } : book);
        return {
            tbrBooks: updateBookInList(state.tbrBooks),
            currentlyReadingBooks: updateBookInList(state.currentlyReadingBooks),
            readBooks: updateBookInList(state.readBooks),
            favouriteBooks: updateBookInList(state.favouriteBooks)
        };
    }),
    
    updateBookNotes: (bookId, notes) => set((state) => {
        const updateBookInList = (books: UserBook[]) =>
            books.map(book => book.book === bookId ? { ...book, notes } : book);
        return {
            tbrBooks: updateBookInList(state.tbrBooks),
            currentlyReadingBooks: updateBookInList(state.currentlyReadingBooks),
            readBooks: updateBookInList(state.readBooks),
            favouriteBooks: updateBookInList(state.favouriteBooks)
        };
    }),
    }));