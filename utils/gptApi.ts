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
    
    The brief should be written as if the client is describing their project requirements and expectations. Avoid using phrases that imply the brief is written by the design team.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return response.choices[0].message.content?.trim() || '';
}