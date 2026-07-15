import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"; 
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI;
const authDbName = process.env.AUTH_DB_NAME;

// 1. Strict Environment Variable Validation
if (!mongoUri) {
  console.error("Critical Error: MONGODB_URI environment variable is missing.");
  process.exit(1);
}

// At this point, TypeScript knows mongoUri is strictly a 'string' due to the type guard above
const client: MongoClient = new MongoClient(mongoUri);
const db: Db = client.db(authDbName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL as string, 

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: (process.env.GOOGLE_CLIENT_ID as string) || "",
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string) || "",
    },
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user', 
        input: true,
      },
    },
  },
  
  session: {
    // cookieCache: {
    //   enabled: true,
    // },
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day in seconds
  },
  
  plugins: [jwt()],
});

// 2. Extracted inferred types for global application use (Better Auth feature)
export type Session = typeof auth.$Infer.Session;

// ✅ Module augmentation to ensure the compiler recognizes 'role' on standard Better Auth imports
declare module "better-auth" {
  interface User {
    role: string;
  }
  interface Session {
    user: User;
  }
}