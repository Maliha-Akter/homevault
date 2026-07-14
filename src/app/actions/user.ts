"use server";

import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

export async function getCleanUserList() {
    // 1. Authenticate the admin session
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized access");
    }

    // 2. Connect and fetch
    const client = new MongoClient(process.env.MONGODB_URI!);
    const db = client.db(process.env.AUTH_DB_NAME);
    
    // Fetch only the data you want to display
    const users = await db.collection("user")
        .find({})
        .project({
            name: 1,
            email: 1,
            role: 1,
            emailVerified: 1,
            createdAt: 1
        })
        .toArray();

    // Convert MongoDB _id to string for the frontend
    return JSON.parse(JSON.stringify(users));
}