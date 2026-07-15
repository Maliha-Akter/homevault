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
    expiresIn: 60 * 60 * 24, // 1 day in seconds
  },
  
  plugins: [jwt()],
});

// ✅ Explicitly extract the individual inner types from the inferred object
export type Session = typeof auth.$Infer.Session["session"];
export type User = typeof auth.$Infer.Session["user"];