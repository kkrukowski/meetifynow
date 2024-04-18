declare module "next-auth" {
    interface User {
        _id: string;
        name: string;
        email: string;
    }
}