import { db } from "@/config/db";
import { genAI } from "@/config/google";
import { ProjectsTable, ScreenConfigTable } from "@/config/schema";
import { CODE_GENERATION_PROMPT, UI_GENERATION_PROMPT } from "@/data/prompt";
import { ProjectType, ScreenConfigType } from "@/types/types";
import { and, eq } from "drizzle-orm";

export interface GeneratedScreenOutline {
  id: string;
  name: string;
  purpose: string;
  layoutDescription: string;
}

export interface GeneratedConfig {
  projectName: string;
  deviceType: string;
  theme: string;
  projectVisualDescription: string;
  screens: GeneratedScreenOutline[];
}

export async function generateConfig(
  projectId: string,
  userInput: string,
  device: string
): Promise<GeneratedConfig> {
  const genModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: UI_GENERATION_PROMPT,
  });

  const aiResult = await genModel.generateContent(
    `Device Type: ${device}\nUser Request: ${userInput}`
  );
  let rawContent = aiResult.response.text();
  rawContent = rawContent.replace(/```json|```/g, "").trim();

  const jsonResult = JSON.parse(rawContent) as GeneratedConfig;
  console.log("AI Config JSON Result:", jsonResult);

  if (jsonResult) {
    const pName = jsonResult.projectName || jsonResult.theme; // Fallback
    const pVisual = jsonResult.projectVisualDescription;
    const pTheme = jsonResult.theme;

    await db.update(ProjectsTable).set({
      projectVisualDescription: pVisual,
      projectName: pName,
      theme: pTheme,
    }).where(eq(ProjectsTable.projectId, projectId));

    // Clear existing screen configs
    await db.delete(ScreenConfigTable).where(eq(ScreenConfigTable.projectId, projectId));

    const screenConfigs = (jsonResult.screens || []).map((screen) =>
      db.insert(ScreenConfigTable).values({
        projectId,
        screenName: screen.name,
        purpose: screen.purpose,
        screenDescription: screen.layoutDescription,
        screenId: screen.id,
      })
    );

    await Promise.all(screenConfigs);
    return jsonResult;
  } else {
    throw new Error("InvalidConfigResult");
  }
}

export async function generateFromImage(
  projectId: string,
  userInput: string,
  device: string,
  imageBase64: string,
  theme: string
): Promise<GeneratedConfig> {
  const genModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: UI_GENERATION_PROMPT,
  });

  const mimeType = imageBase64.split(';')[0].split(':')[1];
  const base64Data = imageBase64.split(',')[1];

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType
    }
  };

  const textPart = { text: `Device Type: ${device}\nUser Request: ${userInput}` };

  const aiResult = await genModel.generateContent([imagePart, textPart]);
  let rawContent = aiResult.response.text();
  rawContent = rawContent.replace(/```json|```/g, "").trim();

  const jsonResult = JSON.parse(rawContent) as GeneratedConfig;
  console.log("AI Config JSON Result from Image:", jsonResult);

  if (jsonResult) {
    const pName = jsonResult.projectName || jsonResult.theme || theme;
    const pVisual = jsonResult.projectVisualDescription;
    const pTheme = jsonResult.theme || theme;

    await db.update(ProjectsTable).set({
      projectVisualDescription: pVisual,
      projectName: pName,
      theme: pTheme,
    }).where(eq(ProjectsTable.projectId, projectId));

    await db.delete(ScreenConfigTable).where(eq(ScreenConfigTable.projectId, projectId));

    const screenConfigs = (jsonResult.screens || []).map((screen) =>
      db.insert(ScreenConfigTable).values({
        projectId,
        screenName: screen.name,
        purpose: screen.purpose,
        screenDescription: screen.layoutDescription,
        screenId: screen.id,
      })
    );

    await Promise.all(screenConfigs);
    return jsonResult;
  } else {
    throw new Error("InvalidConfigResult");
  }
}

export async function generateScreenUI(
  projectId: string,
  screenId: string,
  screenName: string,
  purpose: string,
  screenDescription: string
): Promise<ScreenConfigType> {
  // Fetch project details for design system blueprint
  const project = await db.select()
    .from(ProjectsTable)
    .where(eq(ProjectsTable.projectId, projectId))
    .limit(1);

  if (!project || project.length === 0) {
    throw new Error("ProjectNotFound");
  }

  const projectVisualDescription = project[0].projectVisualDescription || "";
  const projectName = project[0].projectName || "";

  // Fetch reference screen context
  const allScreens = await db.select()
    .from(ScreenConfigTable)
    .where(eq(ScreenConfigTable.projectId, projectId));

  allScreens.sort((a, b) => a.id - b.id);
  const referenceScreen = allScreens.find((s) => s.code && s.screenId !== screenId);

  const availableScreens = allScreens.map(s => `- Screen Name: "${s.screenName}", ID: "${s.screenId}"`).join('\n');

  let genUserInput = `
    Project Name: ${projectName}
    Project Blueprint: ${projectVisualDescription}
    Screen Name: ${screenName}
    Screen Purpose: ${purpose}
    Screen Description: ${screenDescription}

    AVAILABLE SCREENS FOR PROTOTYPE NAVIGATION:
    Below are the screens available in this project. When building links or buttons that should navigate, use the exact ID listed below in the data-navigate-to attribute (e.g., data-navigate-to="target-screen-id"):
    ${availableScreens}
  `;

  if (referenceScreen && referenceScreen.code) {
    genUserInput += `

    ### Existing Screen Code (Reference)
    Below is the HTML code of another screen in this project ("${referenceScreen.screenName}"). 
    Use this code as a guide. The Header, Navigation, Logo styling, Footer, container sizes/paddings, and design components MUST be copied EXACTLY for visual consistency:
    \`\`\`html
    ${referenceScreen.code}
    \`\`\`
    `;
  }

  const genModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: CODE_GENERATION_PROMPT,
  });

  const aiResult = await genModel.generateContent(genUserInput);
  let response = aiResult.response.text();
  response = response.replace(/```html|```/g, "").trim();

  const updateResult = await db.update(ScreenConfigTable).set({
    code: response,
  }).where(and(eq(ScreenConfigTable.projectId, projectId), eq(ScreenConfigTable.screenId, screenId)))
    .returning();

  return { ...updateResult[0] } as ScreenConfigType;
}

export async function generateNewScreen(
  projectId: string,
  userInput: string
): Promise<ScreenConfigType> {
  const project = await db.select()
    .from(ProjectsTable)
    .where(eq(ProjectsTable.projectId, projectId))
    .limit(1);

  if (!project || project.length === 0) {
    throw new Error("ProjectNotFound");
  }

  const projectName = project[0].projectName || "My App";
  const projectVisualDescription = project[0].projectVisualDescription || "";
  const device = project[0].device || "Website";

  const SYSTEM_INSTRUCTION = `
You are a Lead UI/UX designer. Your goal is to generate a new, additional screen configuration outline for an existing project based on the user's request.
This screen configuration will be used to generate the high-fidelity UI code later.

PROJECT CONTEXT:
- Project Name: ${projectName}
- Global Design Blueprint: ${projectVisualDescription}
- Device Type: ${device}

USER REQUEST:
Generate a new screen matching the description: "${userInput}"

You MUST return ONLY a valid JSON object. No markdown, no explanations, no trailing commas.

OUTPUT JSON STRUCTURE:
{
  "id": "kebab-case-screen-id",
  "name": "Human Readable Screen Name",
  "purpose": "A one-sentence description of the screen's role.",
  "layoutDescription": "Extremely specific, implementable layout instructions. Must include root container strategy, exact sections (header, hero, charts, etc.), realistic data examples, and specific icon names (lucide:icon-name). Ensure this matches the Global Design Blueprint style and navigation patterns."
}
`;

  const genModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const aiResult = await genModel.generateContent(
    `Generate a single screen configuration outline for the user request: ${userInput}`
  );
  let rawContent = aiResult.response.text();
  rawContent = rawContent.replace(/```json|```/g, "").trim();

  const jsonResult = JSON.parse(rawContent) as GeneratedScreenOutline;
  console.log("AI New Screen Config Result:", jsonResult);

  if (jsonResult) {
    const screenId = jsonResult.id || `screen-${Date.now()}`;
    const screenName = jsonResult.name || "New Screen";
    const purpose = jsonResult.purpose || "";
    const screenDescription = jsonResult.layoutDescription || "";

    const insertedRow = await db.insert(ScreenConfigTable).values({
      projectId,
      screenName,
      purpose,
      screenDescription,
      screenId,
    }).returning();

    return insertedRow[0] as unknown as ScreenConfigType;
  } else {
    throw new Error("InvalidScreenConfigResult");
  }
}

export async function editScreen(
  projectId: string,
  screenId: string,
  oldCode: string,
  userInput: string
): Promise<ScreenConfigType> {
  const project = await db.select()
    .from(ProjectsTable)
    .where(eq(ProjectsTable.projectId, projectId))
    .limit(1);

  if (!project || project.length === 0) {
    throw new Error("ProjectNotFound");
  }

  const projectVisualDescription = project[0].projectVisualDescription || "";
  const projectName = project[0].projectName || "";

  const allScreens = await db.select()
    .from(ScreenConfigTable)
    .where(eq(ScreenConfigTable.projectId, projectId));

  allScreens.sort((a, b) => a.id - b.id);
  const referenceScreen = allScreens.find((s) => s.code && s.screenId !== screenId);

  let genUserInput = `
    Project Name: ${projectName}
    Project Blueprint: ${projectVisualDescription}
    Current Code: ${oldCode}
    User Instructions: ${userInput}
    
    Apply the user's instructions to the current code. Maintain the exact same design system, theme, and styling defined in the Project Blueprint and Current Code.
  `;

  if (referenceScreen && referenceScreen.code) {
    genUserInput += `

    ### Existing Screen Code (Reference for Consistency)
    Below is the HTML code of another screen in this project ("${referenceScreen.screenName}").
    The Header, Navigation, Logo styling, Footer, container sizes/paddings, and design components MUST match this screen for visual consistency:
    \`\`\`html
    ${referenceScreen.code}
    \`\`\`
    `;
  }

  const genModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: CODE_GENERATION_PROMPT,
  });

  const aiResult = await genModel.generateContent(genUserInput);
  let response = aiResult.response.text();
  response = response.replace(/```html|```/g, "").trim();

  const updateResult = await db.update(ScreenConfigTable).set({
    code: response,
  }).where(and(eq(ScreenConfigTable.projectId, projectId), eq(ScreenConfigTable.screenId, screenId)))
    .returning();

  return { ...updateResult[0] } as ScreenConfigType;
}
