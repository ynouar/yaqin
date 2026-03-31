import { google } from "@ai-sdk/google";
import {
  customProvider,
  defaultSettingsMiddleware,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

const middleware = [
  extractReasoningMiddleware({ tagName: "think" }),
  defaultSettingsMiddleware({
    settings: {
      temperature: 0.0,
    },
  }),
];

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": wrapLanguageModel({
          model: google("gemini-2.5-flash"),
          middleware,
        }),
        "chat-model-reasoning": wrapLanguageModel({
          model: google("gemini-2.5-flash"),
          middleware,
        }),
        "title-model": google("gemini-2.5-flash"),
        "artifact-model": google("gemini-2.5-flash"),
      },
    });
