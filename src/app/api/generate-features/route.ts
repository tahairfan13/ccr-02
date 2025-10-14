import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ApplicationType, ProjectScale, Feature } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { applicationTypes, projectScale, description } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = generatePrompt(applicationTypes, projectScale, description);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const features = parseFeatures(content.text);

    return NextResponse.json({ features });
  } catch (error) {
    console.error("Error generating features:", error);
    return NextResponse.json(
      { error: "Failed to generate features" },
      { status: 500 }
    );
  }
}

function generatePrompt(
  applicationTypes: ApplicationType[],
  projectScale: ProjectScale,
  description: string
): string {
  const scaleDescriptions = {
    mvp: "MVP (Minimum Viable Product) - Focus on core features, basic UI/UX, essential functionality. Time estimates should reflect a lean, efficient approach.",
    mid: "Mid-Level - Include extended feature set, custom UI/UX, third-party integrations, enhanced user experience. Time estimates should reflect moderate complexity.",
    enterprise: "Enterprise - Complete feature suite, premium UI/UX, advanced integrations, high security standards, enterprise-grade infrastructure. Time estimates should reflect high complexity and quality standards.",
  };

  return `You are a technical project analyst helping to estimate software development costs. Based on the following information, generate a detailed list of features with time estimates.

Application Types: ${applicationTypes.join(", ")}
Project Scale: ${projectScale} - ${scaleDescriptions[projectScale]}
Project Description: ${description}

Generate a comprehensive list of features for this project. For each feature:
1. Provide a clear, concise name
2. Write a detailed description (1-2 sentences)
3. Estimate development time in hours (be realistic based on the project scale)
4. Assign a category (e.g., "Authentication", "Core Features", "UI/UX", "Integrations", "Admin Panel", "Analytics", etc.)

Consider:
- The application types selected (AI features for AI projects, blockchain features for blockchain projects, etc.)
- The project scale (MVP = fewer, simpler features; Enterprise = more, complex features)
- Common best practices and industry standards
- Security, scalability, and performance requirements based on scale
- Testing and quality assurance needs

Format your response as a JSON array with the following structure:
[
  {
    "name": "Feature Name",
    "description": "Detailed description of the feature",
    "hours": 40,
    "category": "Category Name"
  }
]

Be thorough but realistic. For MVP, focus on 8-15 essential features. For Mid-level, include 15-25 features. For Enterprise, provide 25-40 comprehensive features.

IMPORTANT: Return ONLY the JSON array, no additional text or explanation.`;
}

function parseFeatures(text: string): Feature[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed.map((feature: any, index: number) => ({
      id: `feature-${index}`,
      name: feature.name,
      description: feature.description,
      hours: feature.hours,
      category: feature.category,
      selected: true, // Default to selected
    }));
  } catch (error) {
    console.error("Error parsing features:", error);
    throw new Error("Failed to parse feature list");
  }
}
