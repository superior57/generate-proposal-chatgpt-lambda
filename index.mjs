import { Configuration, OpenAIApi } from "openai";

export const handler = async (event) => {
  try {
    const body =
      typeof event.body === "object"
        ? event.body
        : JSON.parse(event.body || "{}");

    console.log(body);

    const { resume, description, clientInfo, name, clientName, openai_api_key } = body;
    
    if (!openai_api_key) {
      throw new Error('Open-AI api key does not exists.');
    }
    
    const configuration = new Configuration({
      apiKey: openai_api_key,
    });
    const openai = new OpenAIApi(configuration);

    const resumeStr = `
    ${resume}

    this is my profile
    `;

    const descriptionStr = `${description}

    this is job description
    `;

    const prompt = `
    show me real example for best proposal for the above job description and my profile, 
    keep simple,
    keep 2 or 3 phrase for main body,
    start with Hello ${clientName.replace(".", "")},
    and end with Sincerely \n ${name}
    `;

    const responseAi = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "user", content: resumeStr },
        { role: "user", content: descriptionStr },
        { role: "user", content: prompt },
      ],
    });

    console.log("SUCCESS: ", responseAi.data.choices[0]);

    const result = responseAi.data?.choices?.[0]?.message.content;

    const response = {
      statusCode: 200,
      body: {
        message: result.trim(),
      },
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      body: {
        error: error.message,
      },
    };
    return response;
  }
};
