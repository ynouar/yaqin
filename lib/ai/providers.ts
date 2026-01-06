import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  defaultSettingsMiddleware,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

const middleware = [extractReasoningMiddleware({ tagName: "think" }), defaultSettingsMiddleware({
            settings: {
              temperature: 0.0,
            },
          })];

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
          model: gateway.languageModel("xai/grok-4.1-fast-reasoning"),
          middleware,
        }),
        "chat-model-reasoning": wrapLanguageModel({
          model: gateway.languageModel("xai/grok-4.1-fast-reasoning"),
          middleware,
        }),
        "title-model": gateway.languageModel("xai/grok-4.1-fast-non-reasoning"),
        "artifact-model": gateway.languageModel("xai/grok-4.1-fast-non-reasoning"),
      },
    });
