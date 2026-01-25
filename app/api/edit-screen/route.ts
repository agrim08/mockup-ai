import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { genAI } from "@/config/google";
import { ScreenConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { CODE_GENERATION_PROMPT } from "@/data/prompt";

export async function POST(req: NextRequest) {
    const {projectId, screenId, oldCode, userInput, projectVisualDescription} = await req.json()

    console.log("Editing Screen:", { projectId, screenId });

    const USER_INPUT = `
        Project Blueprint: ${projectVisualDescription}
        Current Code: ${oldCode}
        User Instructions: ${userInput}
        
        Apply the user's instructions to the current code. Maintain the exact same design system, theme, and styling defined in the Project Blueprint and Current Code.
    `
    try {   
            const genModel = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: CODE_GENERATION_PROMPT
            });
    
            const aiResult = await genModel.generateContent(
                USER_INPUT
            );

            let response = aiResult.response.text();
            response = response.replace(/```html|```/g, '').trim();
            
            console.log("AI Generated Revised Code (first 100 chars):", response.substring(0, 100));

            const updateResult = await db.update(ScreenConfigTable).set({
                code: response as string,
            }).where(and(eq(ScreenConfigTable.projectId, projectId as string), eq(ScreenConfigTable.screenId, screenId as string)))
                .returning()
            
            console.log("Update Result:", updateResult[0] ? "Success" : "Failed (No row matched)");

        return NextResponse.json(updateResult[0])
    
        } catch (error) {
            console.error("Edit Screen Error:", error)
            return NextResponse.json({error: "Failed to generate screen UI"}, {status: 500})    
        }
}