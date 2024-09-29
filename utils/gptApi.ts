import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ProjectFormData {
  projectType: string;
  projectName: string;
  goals: string;
  deadline: string | null;
  budget: string;
  budgetBreakdown: { item: string; amount: string }[];
  references: { type: 'link' | 'image'; value: string }[];
}

export async function generateBrief(formData: ProjectFormData) {
  const budgetBreakdown = formData.budgetBreakdown
    .map(item => `${item.item}: $${item.amount}`)
    .join('\n');

  const references = formData.references
    .map(ref => {
      if (ref.type === 'link') {
        return `Link: [${ref.value}](${ref.value})`;
      } else {
        return `Image: ${ref.value}`;
      }
    })
    .join('\n');

  console.log('References being sent to GPT:', references);

  const prompt = `Generate a professional and casual project brief based on the following input. Avoid referencing the project name directly in the brief. Instead, 
  provide a high-level summary of the project's purpose and goals in a natural style. Keep the tone approachable and avoid overly formal or robotic phrases. Also incorporate information from the web if needed. Here is the provided information:
    Project Type: ${formData.projectType}
    Project Name: ${formData.projectName}
    Goals: ${formData.goals}
    Deadline: ${formData.deadline || 'Not specified'}
    Budget: $${formData.budget}
    Budget Breakdown:
    ${budgetBreakdown}
    References:
    ${references}
    
    Please follow these guidelines:
    1. Write the brief as if the client is describing their project requirements and expectations, and in a way that is both professional and casual. Use clear language and avoid complex grammar and jargon. Avoid the terms "revamp", "breathe new life", or "refresh" in the brief. The response should be easy to understand for users who may not speak fluent English, and explain any technical terms in simple words.
    2. Start with an "Introduction:" section that outlines the project's purpose and main goals.
    3. Include separate sections for "Goals:", "Timeline:", "Budget:", "References:", and "Conclusion:".
    4. Format each main section with a capitalized title followed by a colon, on its own line (e.g., "Introduction:", "Goals:", etc.).
    5. Make sure to exclude 'Project Type:' from the project overview, it's a bit redundant.
    6. Format the brief with proper organization, especially when listing specific goals, budget breakdowns, or requirements.
    7. For image references, explicitly mention each image URL and accurately describe what it shows and how it relates to the project.
    8. IMPORTANT: All links in the brief MUST be formatted as [link text](URL). Do not use any other format for links.
    9. Discuss the project details, including type, name, and specific goals.
    10. Discuss the budget and its breakdown in a way that feels natural to the narrative.
    11. Incorporate the provided references into the brief (only in "References:" section), mentioning how they relate to the project or inspire certain aspects.
    12. Conclude with a closing statement that summarizes the project's importance and the client's expectations for success.
    
    The tone should be professional yet comfortable and conversational.`;

  console.log('Prompt being sent to GPT:', prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    console.log("Full API Response:", JSON.stringify(response, null, 2));

    if (response.choices && response.choices.length > 0 && response.choices[0].message) {
      const generatedBrief = response.choices[0].message.content?.trim() || '';
      console.log("Generated Brief:", generatedBrief);
      return generatedBrief;
    } else {
      console.error("Unexpected API response structure:", response);
      throw new Error("Failed to generate brief: Unexpected API response structure");
    }
  } catch (error) {
    console.error("Error generating brief:", error);
    throw error;
  }
}

export async function regenerateSection(brief: string, sectionName: string) {
  const prompt = `Given the following project brief, please regenerate only the content for the "${sectionName}" section. Maintain the overall tone and context of the brief, but provide an alternate perspective for this section while keeping it professional and comfortable. Do not include the section title in your response. Do not make the response significantly longer than the original section. Here's the current brief:

${brief}

Please provide only the regenerated content for the "${sectionName}" section, without the section title.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",  // Updated to use GPT-4 Turbo
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return response.choices[0].message.content?.trim() || '';
}