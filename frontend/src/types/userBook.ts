export interface UserBook{
    __id:string;
    user:string;
    book:string;
    status?:'tbr'|'currently-reading'|'read'|'favourite';
    pagesRead:number;
    startDate?:Date;
    endDate?:Date;
    review?:string;
    rating?:number;
    notes?:string;
    isFavourite:boolean;
    createdAt:Date;
    updatedAt:Date;
}
//these interfaces are adding for specific API operations , instead of sending entire userBook object
export interface ReadingProgress{
    bookId:string;
    pagesRead:number;
}
export interface BookRating{
    bookId:string;
    rating:number;
    review?:string;
}

export interface BookNotes{
    bookId:string;
    notes:string;
}
