import { ChatbotService } from './../services/chatbot.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  message: string = '';
  chatMessages: { role: string, content: string }[] = [];
  chatHistory: { role: string, content: string }[] = [];
  constructor(private chatgptService: ChatbotService) {}

  async sendMessage() {
    const response = await this.chatgptService.getDataFromOpenAI(this.message);
    if (typeof response === 'string') {
      const assistantMessage = response;
      this.chatMessages.push({ role: 'user', content: this.message });
      this.chatHistory.push({ role: 'user', content: this.message });
      if (assistantMessage) {
        this.chatMessages.push({ role: 'assistant', content: assistantMessage });
        this.chatHistory.push({ role: 'assistant', content: assistantMessage });
      }
    }
    this.message = '';
  }

  borrar() {
    this.chatMessages = [];
    localStorage.removeItem('chatMessages'); // Eliminar los chatMessages del almacenamiento local
    location.reload();
  }
  saveChatMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(this.chatMessages));
  }

  ngOnInit() {
    const savedChatMessages = localStorage.getItem('chatMessages');
    if (savedChatMessages) {
      this.chatMessages = JSON.parse(savedChatMessages);
    }
  }
}
