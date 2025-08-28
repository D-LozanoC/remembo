import { InferenceClient } from "@huggingface/inference";

process.loadEnvFile()

const client = new InferenceClient(process.env.HUGGING_FACE_TOKEN);

const chatCompletion = await client.chatCompletion({
    model: "deepseek-ai/DeepSeek-V3-0324",
    messages: [
        {
            role: "user",
            content: "How many 'G's in 'huggingface'?",
        },
    ],
});

console.log(chatCompletion.choices[0].message);