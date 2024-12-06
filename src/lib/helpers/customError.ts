export class CustomError extends Error {
    status:number;
    message: string;

    constructor(error: {status:number, message: string}) {
        super(error.message);
        this.status = error.status;
        this.message = error.message;
        
    }
}