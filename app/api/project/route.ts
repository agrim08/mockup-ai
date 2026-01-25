import { db } from "@/config/db";
import { ProjectsTable, ScreenConfigTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { userInput, device, projectId, theme } = await request.json()
    const user = await currentUser()
    
    const res = await db.insert(ProjectsTable).values({
        projectId,
        userInput,
        device,
        theme,
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

        const email = user?.primaryEmailAddress?.emailAddress as string;

        if (projectId) {
            const res = await db.select().
                    from(ProjectsTable).
                    where(and(eq(ProjectsTable.projectId, projectId as string), eq(ProjectsTable.userId, email)))
            
            const screenConfig = await db.select().
                    from(ScreenConfigTable).
                    where(eq(ScreenConfigTable.projectId, projectId as string))

            return NextResponse.json({
                projectDetails: res[0],
                screenConfig: screenConfig
            })
        } else {
            // Fetch all projects for the user
            const projects = await db.select().
                from(ProjectsTable).
                where(eq(ProjectsTable.userId, email)).
                orderBy(desc(ProjectsTable.id))
            
            return NextResponse.json(projects)
        }
    } catch (error) {
        console.error("Fetch projects error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const {  projectName, theme, projectId } = await req.json()    
    const res = await db.update(ProjectsTable).set({
        projectName,
        theme
    }).where(eq(ProjectsTable.projectId, projectId as string)).returning()

    return NextResponse.json(res[0])
}