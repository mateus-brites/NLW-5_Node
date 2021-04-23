import { Request, Response } from "express";
import { MessageService } from "../services/MessagesService";

class MessagesController {
    async create(request: Request, response: Response){

        const { user_id, text, admin_id } = request.body;
        
        const messageService = new MessageService();

        const message = await messageService.create({
            user_id,
            text,
            admin_id
        });

        return response.json(message);
    }

    async ShowByUser(request: Request, response: Response){
        const { id } = request.params;

        const messageService = new MessageService();

        const list = await messageService.listByUser(id);

        return response.json(list);
    }
}

export { MessagesController }