import { Configuration, OpenAIApi } from "openai";

export const handler = async (event) => {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const body =
      typeof event.body === "object"
        ? event.body
        : JSON.parse(event.body || "{}");

    console.log(body);

    const { resume, description } = body;

    const jobdescription = `${description}

    this is job description
    `;

    const client = `
    client name is John
    `;

    const prompt = `generate best proposal for the above job description`;

    const responseAi = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "user", content: resume },
        { role: "user", content: jobdescription },
        { role: "user", content: client },
        { role: "user", content: prompt },
      ],
    });

    console.log("SUCCESS: ", responseAi.data.choices[0]);

    const result = responseAi.data?.choices?.[0]?.message.content;

    const response = {
      statusCode: 200,
      body: {
        data: {
          message: result.trim(),
        },
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
