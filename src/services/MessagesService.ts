import { getCustomRepository, Repository } from "typeorm"
import { MessageRepository } from "../repositories/MessageRepository";
import { Message } from "../entities/Message";


interface IMessageCreate {
    user_id: string;
    text: string;
    admin_id?: string;
}

class MessageService {
    private messageRepository: Repository<Message>

    constructor(){
        this.messageRepository = getCustomRepository(MessageRepository);
    }

    async create({ user_id, text, admin_id }: IMessageCreate){

        const message = this.messageRepository.create({
            user_id,
            text,
            admin_id,
        });

        await this.messageRepository.save(message);
        
        return message;
    }

    async listByUser(user_id: string){

        const list = this.messageRepository.find({
            where: { user_id },
            relations: ["user"]
        });

        return list;
    }
}

export { MessageService }