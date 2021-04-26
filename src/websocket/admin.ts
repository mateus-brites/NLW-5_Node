import { io } from "../http";
import { ConnectionService } from "../services/ConnectionsService";
import { MessageService } from "../services/MessagesService";

io.on("connect", async (socket) => {
    const connectionsService = new ConnectionService ();
    const messageService = new MessageService(); 

    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

    socket.on("admin_list_messages_by_user", async (params, callback) => {
        const { user_id } = params;

        console.log("admin_list_messages_by_user", user_id);

        const allMessages = await messageService.listByUser(user_id);

        callback(allMessages);
    });

    socket.on("admin_send_message", async (params) => {
        const { user_id, text } = params;

        await messageService.create({
            text,
            user_id,
            admin_id: socket.id,
        });
        const { socket_id } = await connectionsService.findByUserId(user_id);

        io.to(socket_id).emit('admin_send_to_client', {
            text,// texto do atendente
            socket_id: socket.id,//
        });
    });
    socket.on('admin_user_in_support', async params => {
        const { user_id } = params;
        await connectionsService.updateAdminID(user_id, socket.id);
    
        const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
    
        io.emit('admin_list_all_users', allConnectionsWithoutAdmin);
      });
    });