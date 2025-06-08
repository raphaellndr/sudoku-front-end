import NextAuth from "next-auth";

// Prevents IDEs from removing the unused `NextAuth` import
NextAuth.name;

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context.
     * Session `user` should only contain immutable variables.
     */
    interface Session {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            username: string | null;
            email: string;
            is_active: boolean;
            is_staff: boolean;
            created_at: string;
            updated_at: string;
        };
    }
}