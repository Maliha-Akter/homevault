import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"; // Imported safely from its sub-module path
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI;
const authDbName = process.env.AUTH_DB_NAME;

if (!mongoUri) {
  console.error("Critical Error: MONGODB_URI environment variable is missing.");
  process.exit(1);
}

const client: MongoClient = new MongoClient(mongoUri);
const db: Db = client.db(authDbName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  emailAndPassword: {
    enabled: true,
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

// ✅ Correct module augmentation for both User and Session layout objects
declare module "better-auth" {
  interface User {
    role: string;
  }
  interface Session {
    user: User;
  }
}