export interface ApiResponse<T>{
    success:boolean;
    data?:T;
    message?:string;
    error?:string;
}
export interface PaginatedResponse<T>{
    books:T[];
    pagination:{
        currentPage:number;
        totalPages:number;
        totalBooks:number;
        hasNext:boolean;
        hasPrev:boolean;
    }
}