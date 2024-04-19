import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from "axios";

export const { auth, handlers, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET ?? "secret",
    pages: {
        signIn: "/login",
        signOut: "/logout",
    },
    providers: [Credentials({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: {  label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null
            const { email, password } = credentials

            const res = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + "/auth/login", { email, password })

            if (res.status == 401) {
                console.log(res.statusText)

                return null
            }

            const user = await res.data

            return user
        }
    })],
    callbacks: {
        async jwt({token, user}) {
            if (user) return { ...token, ...user }

            return token
        },

        async session({session, token}) {
            return {
                ...session,
                user: token.user,
                tokens: token.tokens
            }
        }
    }
})