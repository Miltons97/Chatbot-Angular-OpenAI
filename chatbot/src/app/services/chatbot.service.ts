import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { environment } from 'src/environments/environments';

interface Message {
  role: string;
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  choices: [{ message: { role: string; content: string }; finish_reason: string; index: number }];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiKey: string = environment.apiKey;
  private readonly apiLimitPerMinute: number = 60;
  private lastRequestTimestamp: number = 0;

  public async getDataFromOpenAI(text: string): Promise<string> {
    const now = Date.now();
    const timeElapsed = now - this.lastRequestTimestamp;
    const timeToWait = Math.ceil((60 * 1000) / this.apiLimitPerMinute) - timeElapsed;

    if (timeToWait > 0) {
      // Esperar el tiempo necesario antes de realizar la siguiente solicitud
      await this.delay(timeToWait);
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: text
        }
      ]
    };

    const response: AxiosResponse<ChatCompletionResponse> = await axios.post(url, requestData, { headers });
    const assistantMessage = response.data.choices[0]?.message?.content;
    return assistantMessage || '';
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
