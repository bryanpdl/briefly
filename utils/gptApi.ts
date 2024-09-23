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
}

export async function generateBrief(formData: ProjectFormData) {
  const prompt = `Generate a professional project brief based on the following information:
    Project Type: ${formData.projectType}
    Project Name: ${formData.projectName}
    Goals: ${formData.goals}
    Deadline: ${formData.deadline}
    Budget: $${formData.budget}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return response.choices[0].message.content?.trim() || '';
}