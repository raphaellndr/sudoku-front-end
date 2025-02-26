// @ts-nocheck

import NextAuth from "next-auth";
import { NextAuthOptions, User, Account, Profile } from 'next-auth';
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers/index";
import GoogleProvider from "next-auth/providers/google";

const BACKEND_ACCESS_TOKEN_LIFETIME: number = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME: number = 6 * 24 * 60 * 60; // 6 days

type SignInHandler = (
    user: User,
    account: Account | null,
    profile?: Profile,
    email?: { verificationRequest?: boolean },
    credentials?: Record<string, unknown>
) => Promise<boolean> | boolean;

type SignInHandlers = {
    [key: string]: SignInHandler;
};

// Used with social authentication
const SIGN_IN_HANDLERS: SignInHandlers = {
    credentials: async (user, account, profile, email, credentials) => {
        // Handled by authorize()
        return true;
    },
    google: async (user, account, profile, email, credentials) => {
        try {
            const response = await fetch(
                process.env.NEXTAUTH_BACKEND_URL + "auth/google/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ access_token: account["access_token"] }),
                }
            )
            const responseData = await response.json();
            if (response.ok) {
                account["meta"] = responseData;
                return true;
            } else {
                console.error("Failed to authenticate with Google:", response.statusText);
                console.error("Error details:", responseData);
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};
const SIGN_IN_PROVIDERS: string[] = Object.keys(SIGN_IN_HANDLERS);

// Function to get UNIX timestamp
const getCurrentEpochTime = () => {
    return Math.floor(new Date().getTime() / 1000);
};

const providers: Provider[] = [
    CredentialsProvider({
        name: "credentials",
        credentials: {
            username: { label: "Username", type: "text" },
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password", autocomplete: "on" },
        },
        async authorize(credentials, req) {
            try {
                const response = await fetch(
                    process.env.NEXTAUTH_BACKEND_URL + "auth/login/",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials),
                    }
                );
                const responseData = await response.json();
                if (response.ok) {
                    console.log('Connexion successful: ', responseData);
                    return responseData;
                } else {
                    console.error('Error while signing in: ', response.statusText);
                    console.error('Error details: ', responseData);
                }
            } catch (error) {
                console.error(error);
            }
            return null;
        },
    }),
    // See: https://next-auth.js.org/providers/google
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
            params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
            }
        }
    }),
];

const callbacks = {
    async signIn({ user, account, profile, email, credentials }: {
        user: User;
        account: Account | null;
        profile?: Profile;
        email?: { verificationRequest?: boolean };
        credentials?: Record<string, unknown>;
    }) {
        // Check that account is not null and the provider is in SIGN_IN_PROVIDERS
        if (!account || !SIGN_IN_PROVIDERS.includes(account.provider)) {
            return false;
        }
        return SIGN_IN_HANDLERS[account.provider](user, account, profile, email, credentials);
    },
    async jwt({ user, token, account }: {
        user: User;
        token: JWT;
        account: Account;
    }) {
        // If both user and account exist, generate JWT token (login event)
        if (user && account) {
            let backendResponse = account.provider === "credentials" ? user : account.meta;
            token["user"] = backendResponse.user;
            token["accessToken"] = backendResponse.access;
            token["refreshToken"] = backendResponse.refresh;
            token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
            return token;
        }
        // Refresh bakend tokens if necessary
        if (getCurrentEpochTime() > token["ref"]) {
            const response = await fetch(
                process.env.NEXTAUTH_BACKEND_URL + "auth/token/refresh/",
                {
                    method: "POST",
                    body: JSON.stringify({ refresh: token["refreshToken"] }),
                    headers: { "Content-Type": "application/json" },
                }
            );
            const responseData = await response.json();
            if (response.ok) {
                token["access_token"] = responseData.access;
                token["refresh_token"] = responseData.refresh;
                token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
            } else {
                console.error('An error occured while refreshing tokens: ', response.statusText);
                console.error('Error detail: ', responseData);
            }
        }
        return token;
    },
    async session({ token }: { token: JWT }) {
        return token;
    }
};

const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
    },
    providers: providers,
    callbacks: callbacks,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
