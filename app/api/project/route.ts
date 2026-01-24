import { db } from "@/config/db";
import { ProjectsTable, ScreenConfigTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { userInput, device, projectId } = await request.json()
    const user = await currentUser()
    
    const res = await db.insert(ProjectsTable).values({
        projectId,
        userInput,
        device,
        userId: user?.primaryEmailAddress?.emailAddress as string,
    }).returning()

    return NextResponse.json(res[0])
}

export async function GET(req: NextRequest) {
    const user = await currentUser()
    const projectId = await req.nextUrl.searchParams.get('projectId')

    try {
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const res = await db.select().
                from(ProjectsTable).
                where(and(eq(ProjectsTable.projectId, projectId as string), eq(ProjectsTable.userId, user?.primaryEmailAddress?.emailAddress as string)))
        
        const screenConfig = await db.select().
                from(ScreenConfigTable).
                where(eq(ScreenConfigTable.projectId, projectId as string))

        return NextResponse.json({
            projectDetails: res[0],
            screenConfig: screenConfig
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}