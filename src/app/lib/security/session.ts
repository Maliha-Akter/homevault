import { headers } from "next/headers";
import { auth, type User } from "../auth"; // 1. Import your custom User type
import { redirect } from "next/navigation";

export type UserRole = "user" | "admin";

export const getUserSession = async (): Promise<User | null> => { // 2. Explicitly type the return
    const session = await auth.api.getSession({
        headers: await headers() 
    });

    // 3. Cast the return value to your custom User type
    return (session?.user as User) || null;
};

export const requireRole = async (role: UserRole) => {
    const user = await getUserSession();
    
    if (!user) {
        redirect('/auth/login'); 
    }
    
    // ✅ TypeScript now safely knows 'role' exists!
    if (user.role !== role) {
        redirect('/unauthorized');
    }
    
    return user;
};