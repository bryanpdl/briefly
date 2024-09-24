import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // This allows the OpenAI client to be used in the browser
});

interface ProjectFormData {
  projectType: string;
  projectName: string;
  goals: string;
  deadline: string;
  budget: string;
  budgetBreakdown: { item: string; amount: string }[];
}

export async function generateBrief(formData: ProjectFormData) {
  const budgetBreakdown = formData.budgetBreakdown
    .map(item => `${item.item}: $${item.amount}`)
    .join('\n');

  const prompt = `Generate a professional project brief from the perspective of the client based on the following information:
    Project Type: ${formData.projectType}
    Project Name: ${formData.projectName}
    Goals: ${formData.goals}
    Deadline: ${formData.deadline}
    Budget: $${formData.budget}
    Budget Breakdown:
    ${budgetBreakdown}
    
    Please follow these guidelines:
    1. Write the brief as if the client is describing their project requirements and expectations.
    2. Start with an "Introduction:" section that outlines the project's purpose and main goals.
    3. Include separate sections for "Goals:", "Timeline:", "Budget:", and "Conclusion:".
    4. Format each main section with a capitalized title followed by a colon, on its own line (e.g., "Introduction:", "Goals:", etc.).
    5. Make sure to exclude 'Project Type:' from the project overview, it's a bit redundant.
    6. Format the brief with proper organization, especially when listing specific goals, budget breakdowns, or requirements. 
    7. Discuss the project details, including type, name, and specific goals.
    8. Discuss the budget and its breakdown in a way that feels natural to the narrative.
    9. Conclude with a closing statement that summarizes the project's importance and the client's expectations for success.
    
    The tone should be professional yet comfortable andconversational.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4", // This might be a typo
    messages: [{ role: "user", content: prompt }],
    max_tokens: 700,
  });

  console.log("API Response:", response); // Add this line for debugging

  return response.choices[0].message.content?.trim() || '';
}

export async function regenerateSection(brief: string, sectionName: string) {
  const prompt = `Given the following project brief, please regenerate only the content for the "${sectionName}" section. Maintain the overall tone and context of the brief, but provide an alternate perspective for this section while keeping it professional and comfortable. Do not include the section title in your response. Here's the current brief:

${brief}

Please provide only the regenerated content for the "${sectionName}" section, without the section title.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return response.choices[0].message.content?.trim() || '';
}