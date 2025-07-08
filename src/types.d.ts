declare module "next-auth" {
    interface User {
        _id: string;
        name: string;
        email: string;
    }

    interface Session {
        user: User;
        tokens: {
            accessToken: string;
            refreshToken: string;
        }
    }
}