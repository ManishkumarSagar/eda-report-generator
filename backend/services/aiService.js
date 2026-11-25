// const OpenAI = require('openai');

// // Initialize OpenAI API
// const openai = new OpenAI({
//   apiKey: process.env.LLM_API_KEY,
// });

// const generateInsights = async (edaResults) => {
//   try {
//     // Prompt Engineering (Documentation Chapter 14.4)
//     const prompt = `
//       You are an experienced data analyst. 
//       Analyze the following EDA results:
//       Total Rows: ${edaResults.totalRows}
//       Total Columns: ${edaResults.totalColumns}
//       Missing Values: ${edaResults.missingValues}
//       Duplicate Rows: ${edaResults.duplicateRows}
//       Outliers Found: ${edaResults.outliersCount}
//       Statistics: ${JSON.stringify(edaResults.statistics)}

//       Generate a JSON response strictly in this format:
//       {
//         "summary": "A 2-3 sentence overall summary of the dataset.",
//         "findings": ["Finding 1", "Finding 2", "Finding 3"],
//         "dataQuality": ["Quality issue 1", "Quality issue 2"],
//         "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2", "Actionable recommendation 3"]
//       }

//       Use simple English. Do not invent statistics. Only use the supplied results.
//     `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // Ya gpt-4 agar aapke paas access hai
//       messages: [{ role: "user", content: prompt }],
//       response_format: { type: "json_object" }, // Force JSON output
//     });

//     const aiData = JSON.parse(response.choices[0].message.content);
//     return aiData;
//   } catch (error) {
//     console.error('LLM API Error:', error.message);
//     throw new Error('Failed to generate AI insights');
//   }
// };

// module.exports = { generateInsights };


const OpenAI = require('openai');

// Initialize Gemini using OpenAI-compatible endpoint
const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY, // Aapki Gemini API Key
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const generateInsights = async (edaResults) => {
  try {
    // Prompt Engineering
    const prompt = `
      You are an experienced data analyst. 
      Analyze the following EDA results:
      Total Rows: ${edaResults.totalRows}
      Total Columns: ${edaResults.totalColumns}
      Missing Values: ${edaResults.missingValues}
      Duplicate Rows: ${edaResults.duplicateRows}
      Outliers Found: ${edaResults.outliersCount}
      Statistics: ${JSON.stringify(edaResults.statistics)}

      Generate a JSON response strictly in this exact format, with no extra text before or after:
      {
        "summary": "A 2-3 sentence overall summary of the dataset.",
        "findings": ["Finding 1", "Finding 2", "Finding 3"],
        "dataQuality": ["Quality issue 1", "Quality issue 2"],
        "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2", "Actionable recommendation 3"]
      }

      Use simple English. Do not invent statistics. Only use the supplied results.
    `;

    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash", // Gemini ka free model
      messages: [
        { 
          role: "system", 
          content: "You are a data analysis assistant that only outputs valid JSON." 
        },
        { role: "user", content: prompt }
      ],
    });

    // Clean the response string in case Gemini adds markdown block (```json ... ```)
    let jsonString = response.choices[0].message.content.trim();
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    const aiData = JSON.parse(jsonString);
    return aiData;
  } catch (error) {
    console.error('LLM API Error:', error.message);
    throw new Error('Failed to generate AI insights');
  }
};

module.exports = { generateInsights };