import { betterAuth } from "better-auth";
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
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user', // Defaults automatically if not specified during registration
        input: true,
      },
    },
  },
});

// ✅ Explicit TypeScript declaration so Next.js apps recognize user.role fields
declare module "better-auth" {
  interface User {
    role: string;
  }
}