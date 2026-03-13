export interface AuthorizationOptions {
    hasRole: Array<"admin" | "lead" | "developer">;
    allowSameUser?: boolean;
}