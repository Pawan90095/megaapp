// JWT Types
export interface JWTPayload {
    id: number;
    slug: string;
}

export interface JWTVerifyError {
    name: string;
    message: string;
}
