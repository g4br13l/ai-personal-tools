// import { createOpenRouter } from '@openrouter/ai-sdk-provider'
// import { streamText, type ModelMessage } from 'ai'
// import { envConfig } from '../../../../envConfig'



// function makeAgent(msgs: ModelMessage[]) {

//   const openRouter = createOpenRouter({
//     apiKey: envConfig.OPEN_ROUTER_KEY,
//   })

//   const aiRes = streamText({
//     model: openRouter.chat('openai/gpt-5.2-chat'),
//     messages: msgs,
//     tools: {},
//     maxOutputTokens: 200,
//   })

// }


// export const agent = makeAgent
