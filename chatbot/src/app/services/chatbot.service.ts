import { Injectable } from '@angular/core';
import { filter, from, map } from 'rxjs';
import { response } from 'express';
import { Configuration, OpenAIApi, CreateChatCompletionRequest } from 'openai';
import { environment } from 'src/environments/environments';
// Realizamos la configuracion para acceder y poder trabajar con Chatgpt, a teves de la apkey
// const APIKEY= environment.apiKey




@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiKey: string = environment.apiKey;
  private readonly apiLimitPerMinute: number = 60;
  private lastRequestTimestamp: number = 0;

  public async getDataFromOpenAI(text: string): Promise<CreateChatCompletionRequest> {
    const now = Date.now();
    const timeElapsed = now - this.lastRequestTimestamp;
    const timeToWait = Math.ceil((60 * 1000) / this.apiLimitPerMinute) - timeElapsed;

    if (timeToWait > 0) {
      // Esperar el tiempo necesario antes de realizar la siguiente solicitud
      await this.delay(timeToWait);
    }

    return this.makeApiRequest(text);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeApiRequest(text: string): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    const request = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ prompt: text, max_tokens: 250, temperature: 0.7 }),
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", request);
    return response.json();
  }

}
