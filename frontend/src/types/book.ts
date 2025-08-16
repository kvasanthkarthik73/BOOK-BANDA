export interface Book{
    _id:string;
    title:string;
    author:string;
    description:string;
    isbn:string;
    coverImage?:string;
    genre:string[];
    languages:string;
    publisher:string;
    publishDate:Date;
    totalPages:number;
    rating:number;
    numberOfRatings:number;
    featured:boolean;
    createdAt:Date;
    updatedAt:Date;
}
export interface BookFilters{
    search?:string;
    genre?:string;
    author?:string;
    page?:number;
    limit?:number;
}