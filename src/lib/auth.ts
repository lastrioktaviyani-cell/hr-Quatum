import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getDb } from "./prisma";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
interface Session {
user: {
id: string;
roleId: string;
employeeId?: string;
} & DefaultSession["user"];
}

interface User {
roleId?: string;
employeeId?: string;
}
}

declare module "next-auth/jwt" {
interface JWT {
id?: string;
roleId?: string;
employeeId?: string;
}
}

const loginSchema = z.object({
email: z.string().email("Invalid email address"),
password: z.string().min(1, "Password is required"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
trustHost: true,

adapter: PrismaAdapter(getDb()),

session: {
strategy: "jwt",
},

pages: {
signIn: "/login",
},

// ... lanjutkan isi providers dan callbacks yang sudah kamu punya
});
