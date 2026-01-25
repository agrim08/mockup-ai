import { db } from "@/config/db";
// import { openrouter } from "@/config/openrouter";
import { genAI, googleModel } from "@/config/google";
import { ProjectsTable, ScreenConfigTable } from "@/config/schema";
import { UI_GENERATION_PROMPT } from "@/data/prompt";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {userInput, projectId, device} = await request.json()

    // const aiResult = await openrouter.chat.send({
    //     model: "qwen/qwen3-coder:free",
    //     messages: [
    //         {
    //             role: "system",
    //             content: [
    //                 {
    //                     type:"text",
    //                     text: UI_GENERATION_PROMPT
    //                 }
    //             ]
    //         },
    //         {
    //         "role": "user",
    //         "content": `Device Type: ${device}\nUser Request: ${userInput}`
    //         }
    //     ],
    // });

    // let rawContent = aiResult?.choices[0]?.message.content as string;

    const genModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: UI_GENERATION_PROMPT,
    });

    const aiResult = await genModel.generateContent(
        `Device Type: ${device}\nUser Request: ${userInput}`
    );
    let rawContent = aiResult.response.text();

    // Clean potential markdown wrapper if AI returns it
    rawContent = rawContent.replace(/```json|```/g, '').trim();
    
    const jsonResult = JSON.parse(rawContent)
    console.log("AI JSON Result:", jsonResult);

    if(jsonResult){
        // Provide fallbacks for common AI hallucinations in keys
        const pName = jsonResult?.projectName || jsonResult?.name || jsonResult?.appName;
        const pVisual = jsonResult?.projectVisualDescription || jsonResult?.visualDescription || jsonResult?.designSystem;
        const pTheme = jsonResult?.theme;

        const updatedProject = await db.update(ProjectsTable).set({
            projectVisualDescription: pVisual,
            projectName: pName,
            theme: pTheme,
            //@ts-ignore
        }).where(eq(ProjectsTable.projectId, projectId as string)).returning()

        console.log("Updated Project Row:", updatedProject[0]);

        // Clear existing screen configs for this project before inserting new ones to prevent duplicates
        await db.delete(ScreenConfigTable).where(eq(ScreenConfigTable.projectId, projectId as string));

        const screenConfigs = (jsonResult.screens || []).map((screen: any) => 
            db.insert(ScreenConfigTable).values({
                projectId,
                screenName: screen?.name || screen?.screenName,
                purpose: screen?.purpose,
                screenDescription: screen?.layoutDescription || screen?.description || screen?.screenDescription,
                screenId: screen?.id || screen?.screenId,
            })
        );
        
        await Promise.all(screenConfigs);

        return NextResponse.json(jsonResult)
    }
    else{
        return NextResponse.json({error: 'Internal Server Error'})
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const projectId = request.nextUrl.searchParams.get("projectId") 
        const screenId = request.nextUrl.searchParams.get("screenId")
        const user = await currentUser() 

        if(!user){
            return NextResponse.json({error: "Unauthorized"})
        }

        await db.delete(ScreenConfigTable).where(and(eq(ScreenConfigTable.projectId, projectId as string), eq(ScreenConfigTable.screenId, screenId as string)))

        return NextResponse.json({message: "Screen deleted successfully"})
    } catch (error) {
        console.log("Error deleting screen:", error)
        return NextResponse.json({error: "Internal Server Error"})
    }
}