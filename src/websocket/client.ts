import { Connection } from "../entities/Connection";
import { io } from "../http";

import { ConnectionService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessageService } from "../services/MessagesService";

io.on("connect", (socket) => {
    const connectionService = new ConnectionService();
    const usersService = new UsersService();
    const messageService = new MessageService();

    socket.on("client_first_acess", async (params) => {
        const socket_id = socket.id;
        const { text, email } = params;
        let user_id = null

        const userExist = usersService.findByEmail(email);
        
        if(!userExist){

            const user = await usersService.create(email);
            
            await connectionService.create({
                socket_id,
                user_id: user.id
            });

            user_id = user.id;
        } else {
            user_id = (await userExist).id;

            const connection = await connectionService.findByUserId((await userExist).id);

            if(!Connection){
                await connectionService.create({
                    socket_id,
                    user_id: (await userExist).id
                });
            } else {
                connection.socket_id = socket_id;

                await connectionService.create(connection);
            }
        }

        await messageService.create({
            text,
            user_id
        })

    });
});

