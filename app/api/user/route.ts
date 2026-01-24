import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const user = await currentUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await db.select().from(usersTable).where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress as string))

    if(!users.length) {
        const data = {
            name:user?.fullName ?? "",
            email:user?.primaryEmailAddress?.emailAddress as string
        }

        const res = await db.insert(usersTable).values({
            ...data
        }).returning()

        return NextResponse.json( res[0] ?? {})
    }

    return NextResponse.json( users[0] ?? {})
}
