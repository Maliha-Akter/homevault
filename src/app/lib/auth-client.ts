import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ,
    plugins: [
        jwtClient()
    ]
});


declare module "better-auth/react" {
    interface User {
        role: string;
    }
}

export const { signIn, signUp, useSession } = authClient;