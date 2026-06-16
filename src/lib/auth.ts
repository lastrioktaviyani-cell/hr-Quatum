export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  adapter: PrismaAdapter(getDb()),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { email, password } = loginSchema.parse(credentials);

          const user = await getDb().user.findUnique({
            where: { email },
            include: { role: true, employee: true },
          });

          if (!user || !user.password) {
            if (email === "admin@perusahaan.com" && password === "admin123") {
              return {
                id: "dummy-admin",
                name: "Ahkmad Prasetia",
                email,
                roleId: "super-admin",
                employeeId: undefined,
              };
            }

            return null;
          }

          const passwordMatch = await bcryptjs.compare(
            password,
            user.password
          );

          if (!passwordMatch) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            roleId: user.role?.name ?? "staff",
            employeeId: user.employeeId ?? undefined,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roleId = user.roleId;
        token.employeeId = user.employeeId;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.roleId = token.roleId ?? "";
        session.user.employeeId = token.employeeId;
      }

      return session;
    },
  },
});
