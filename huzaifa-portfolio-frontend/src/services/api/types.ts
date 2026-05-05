export interface ApiResponse<T>{success:boolean;data:T;message?:string;meta?:Record<string,unknown>;error?:{code:string;message:string;details?:unknown}}
