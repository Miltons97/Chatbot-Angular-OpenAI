import { ChatbotService } from './../services/chatbot.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  message: string = '';

  constructor(private  chatgptService: ChatbotService){

}
sendMessage(){
  this.chatgptService.getDataFromOpenAI(this.message)
  this.message = '';
}

borrar(){
  location.reload();
}

}
