import { useState, useCallback } from 'react';
import { useBookStore } from '../stores/useBookStore';
import { bookAPI } from '../lib/api';
import { Book, BookFilters } from '../types/book';
import { PaginatedResponse } from '../types/api';

export const useBooks = () => {
    // Local state for this hook
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get actions from Zustand store
    const { 
        setBooks, 
        setFeaturedBooks, 
        setCurrentBook, 
        setPagination,
        setLoading: setStoreLoading,
        setError: setStoreError,
        clearError: clearStoreError 
    } = useBookStore();

    // Get all books with filters and pagination
    const getAllBooks = useCallback(async (filters: BookFilters) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);
            
            const result = await bookAPI.getAllBooks(filters);
            
            // Update store with books and pagination
            setBooks(result.books);
            setPagination(
                result.pagination.currentPage,
                result.pagination.totalPages,
                result.pagination.totalBooks
            );
            
            setIsLoading(false);
            setStoreLoading(false);
            return result;
            
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch books';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [setBooks, setPagination, setStoreLoading, setStoreError]);

    // Get book by ID
    const getBookById = useCallback(async (bookId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);
            const book = await bookAPI.getBookById(bookId);
            // Update store with current book
            setCurrentBook(book);
            setIsLoading(false);
            setStoreLoading(false);
            return book;
            
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch book';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [setCurrentBook, setStoreLoading, setStoreError]);

    // Get featured books
    const getFeaturedBooks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);
            
            const featuredBooks = await bookAPI.getFeaturedBooks();
            
            // Update store with featured books
            setFeaturedBooks(featuredBooks);
            
            setIsLoading(false);
            setStoreLoading(false);
            return featuredBooks;
            
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch featured books';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [setFeaturedBooks, setStoreLoading, setStoreError]);

    // Search books
    const searchBooks = useCallback(async (query: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);
            const searchResults = await bookAPI.searchBooks(query);
            // Update store with search results
            setBooks(searchResults);
            setIsLoading(false);
            setStoreLoading(false);
            return searchResults;
            
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Search failed';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [setBooks, setStoreLoading, setStoreError]);

    // Create book (admin only)
    const createBook = useCallback(async (bookData: Partial<Book>) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);
            
            const newBook = await bookAPI.createBook(bookData);
            
            // Optionally refresh the books list
            // You could call getAllBooks here to update the list
            
            setIsLoading(false);
            setStoreLoading(false);
            return newBook;
            
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create book';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [setStoreLoading, setStoreError]);

    // Update book (admin only)
    const updateBook = useCallback(async (bookId: string, bookData: Partial<Book>) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);
            const updatedBook = await bookAPI.updateBook(bookId, bookData);
            // Update current book if it's the one being edited
            setCurrentBook(updatedBook); 
            setIsLoading(false);
            setStoreLoading(false);
            return updatedBook;
            
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update book';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [setCurrentBook, setStoreLoading, setStoreError]);

    // Delete book (admin only)
    const deleteBook = useCallback(async (bookId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setStoreLoading(true);
            
            await bookAPI.deleteBook(bookId);
            
            // Clear current book if it's the one being deleted
            setCurrentBook(null);
            setIsLoading(false);
            setStoreLoading(false);
            
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to delete book';
            setError(errorMessage);
            setStoreError(errorMessage);
            setIsLoading(false);
            setStoreLoading(false);
            throw err;
        }
    }, [setCurrentBook, setStoreLoading, setStoreError]);

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
        getAllBooks,
        getBookById,
        getFeaturedBooks,
        searchBooks,
        createBook,
        updateBook,
        deleteBook,
        clearError: clearErrorState
    };
};