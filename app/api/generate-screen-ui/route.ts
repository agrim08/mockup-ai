import { db } from "@/config/db";
// import { openrouter } from "@/config/openrouter";
import { googleModel } from "@/config/google";
import { ScreenConfigTable } from "@/config/schema";
import { CODE_GENERATION_PROMPT, UI_GENERATION_PROMPT } from "@/data/prompt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {projectId, screenId, screenName, purpose, screenDescription, projectVisualDescription} = await request.json();

    const userInput = `
        screen Name is: ${screenName}
        screen Purpose: ${purpose}
        screen Description: ${screenDescription}
    `
    try {   
        // const aiResult = await openrouter.chat.send({
        //     model: "qwen/qwen3-coder:free",
        //     messages: [
        //         {
        //             role: "system",
        //             content: [
        //                 {
        //                     type:"text",
        //                     text: CODE_GENERATION_PROMPT
        //                 }
        //             ]
        //         },
        //         {
        //             "role": "user",
        //             "content": [
        //                 {
        //                     type: "text",
        //                     text: userInput
        //                 },
        //             ]
        //         }
        //     ],
        //     stream: false,
        // });

        // const response = aiResult?.choices[0]?.message.content

        const aiResult = await googleModel.generateContent(
            `System: ${CODE_GENERATION_PROMPT}\n\nUser: ${userInput}`
        );
        let response = aiResult.response.text();

        // Clean potential markdown wrapper if AI returns it
        response = response.replace(/```html|```/g, '').trim();


        const updateResult = await db.update(ScreenConfigTable).set({
            code: response as string,
        }).where(and(eq(ScreenConfigTable.projectId, projectId as string), eq(ScreenConfigTable.screenId, screenId as string)))
          .returning()

        return NextResponse.json(updateResult[0])
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Failed to generate screen UI"}, {status: 500})    
    }  
}