import { useState, useCallback } from 'react';
import { useUserBookStore } from '../stores/useUserBookStore';
import { userBookAPI } from '../lib/api';
import { UserBook, ReadingProgress, BookRating, BookNotes } from '../types/userBook';

export const useUserBooks = () => {
    // Local state for this hook
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get actions from Zustand store
    const {
        setTbrBooks,
        setCurrentlyReading,
        setReadBooks,
        setFavouriteBooks,
        addToTbr,
        addToCurrentlyReading,
        addToRead,
        addToFavourites,
        removeFromList,
        updateReadingProgress: updateStoreProgress,
        updateBookStatus: updateStoreStatus,
        updateBookRating: updateStoreRating,
        updateBookNotes: updateStoreNotes,
        setLoading: setStoreLoading,
        setError: setStoreError,
        clearError: clearStoreError
    } = useUserBookStore();

    // Get user's books (optionally filtered by status)
    const getUserBooks = useCallback(async (status?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);

            const userBooks = await userBookAPI.getUserBooks(status);

            // Update store based on status
            if (status === 'tbr') {
                setTbrBooks(userBooks);
            } else if (status === 'currently-reading') {
                setCurrentlyReading(userBooks);
            } else if (status === 'read') {
                setReadBooks(userBooks);
            } else if (status === 'favourites') {
                setFavouriteBooks(userBooks);
            } else {
                // If no status, categorize all books
                const tbr = userBooks.filter(book => book.status === 'tbr');
                const reading = userBooks.filter(book => book.status === 'currently-reading');
                const read = userBooks.filter(book => book.status === 'read');
                const favourites = userBooks.filter(book => book.isFavourite);

                setTbrBooks(tbr);
                setCurrentlyReading(reading);
                setReadBooks(read);
                setFavouriteBooks(favourites);
            }

            setIsLoading(false);
            setStoreLoading(false);
            return userBooks;

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user books';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [setTbrBooks, setCurrentlyReading, setReadBooks, setFavouriteBooks, setStoreLoading, setStoreError]);

    // Add book to user's list
    const addBookToList = useCallback(async (bookData: {
        bookId: string;
        status?:  'tbr' | 'currently-reading' | 'read' | 'favourite'; 
        pagesRead?: number;
        startDate?: Date;
        endDate?: Date;
        rating?: number;
        review?: string;
        notes?: string;
        isFavourite?: boolean;
    }) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);

            const userBook = await userBookAPI.addBookToList(bookData);

            // Add to appropriate store list
            if (userBook.status === 'tbr') {
                addToTbr(userBook);
            } else if (userBook.status === 'currently-reading') {
                addToCurrentlyReading(userBook);
            } else if (userBook.status === 'read') {
                addToRead(userBook);
            }
            if (userBook.isFavourite) {
                addToFavourites(userBook);
            }

            setIsLoading(false);
            setStoreLoading(false);
            return userBook;

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to add book to list';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [addToTbr, addToCurrentlyReading, addToRead, addToFavourites, setStoreLoading, setStoreError]);

    // Update reading progress
    const updateReadingProgress = useCallback(async (bookId: string, pagesRead: number) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);

            const updatedUserBook = await userBookAPI.updateReadingProgress(bookId, pagesRead);

            // Update store with new progress
            updateStoreProgress(bookId, pagesRead);

            setIsLoading(false);
            setStoreLoading(false);
            return updatedUserBook;

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update reading progress';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [updateStoreProgress, setStoreLoading, setStoreError]);

    // Update book status
    const updateBookStatus = useCallback(async (bookId: string, status:'tbr'|'currently-reading'|'read'|'favourite') => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);

            const updatedUserBook = await userBookAPI.updateBookStatus(bookId, status);

            // Update store with new status
            updateStoreStatus(bookId, status);

            setIsLoading(false);
            setStoreLoading(false);
            return updatedUserBook;

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update book status';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [updateStoreStatus, setStoreLoading, setStoreError]);

    // Add rating and review
    const addRatingAndReview = useCallback(async (bookId: string, rating: number, review?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);

            const updatedUserBook = await userBookAPI.addRatingAndReview(bookId, rating, review);

            // Update store with new rating
            updateStoreRating(bookId, rating);

            setIsLoading(false);
            setStoreLoading(false);
            return updatedUserBook;

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to add rating and review';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [updateStoreRating, setStoreLoading, setStoreError]);

    // Add notes
    const addNotes = useCallback(async (bookId: string, notes: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);

            const updatedUserBook = await userBookAPI.addNotes(bookId, notes);

            // Update store with new notes
            updateStoreNotes(bookId, notes);

            setIsLoading(false);
            setStoreLoading(false);
            return updatedUserBook;

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to add notes';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [updateStoreNotes, setStoreLoading, setStoreError]);

    // Remove book from list
    const removeBookFromList = useCallback(async (bookId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);

            await userBookAPI.removeBookFromList(bookId);

            // Remove from all store lists
            removeFromList(bookId);

            setIsLoading(false);
            setStoreLoading(false);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to remove book from list';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [removeFromList, setStoreLoading, setStoreError]);

    // Get reading statistics
    const getReadingStats = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);

            const stats = await userBookAPI.getReadingStats();

            setIsLoading(false);
            setStoreLoading(false);
            return stats;

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch reading stats';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [setStoreLoading, setStoreError]);

    // Clear error
    const clearErrorState = useCallback(() => {
        setError(null);
        clearStoreError();
    }, [clearStoreError]);

    return {
        // State
        isLoading,
        error,

        // Actions
        getUserBooks,
        addBookToList,
        updateReadingProgress,
        updateBookStatus,
        addRatingAndReview,
        addNotes,
        removeBookFromList,
        getReadingStats,
        clearError: clearErrorState
    };
};