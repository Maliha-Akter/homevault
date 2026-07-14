import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export type UserRole = "user" | "admin";
export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers() 
    });

    return session?.user || null;
};

export const requireRole = async (role: UserRole) => {
    const user = await getUserSession();
    
    if (!user) {
        redirect('/auth/login'); 
    }
    
    if (user.role !== role) {
        redirect('/unauthorized');
    }
    
    return user;
};