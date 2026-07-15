"use server";

import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

export async function getCleanUserList() {
    // 1. Fetch the session
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // 2. Guard Clause: Check if session exists
    if (!session) {
        throw new Error("Unauthorized: No session found");
    }


    const user = session.user as { role: string };

    // 4. Authorization check
    if (user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }

    // 5. Connect and fetch
    const client = new MongoClient(process.env.MONGODB_URI!);
    const db = client.db(process.env.AUTH_DB_NAME);

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

    return JSON.parse(JSON.stringify(users));
}