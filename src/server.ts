import { http } from "./http";
import "./websocket/client";

http.listen(3333, () => console.log("servre started in port 3333"));