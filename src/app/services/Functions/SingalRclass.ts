import {ICredencial} from "../../model/credencial.interface";
import * as SignalR from "@microsoft/signalr";

export class SignalrClass {
  public static buildConnection(url: string, usuario: ICredencial): SignalR.HubConnection {
    const token: string = usuario?.token;
    return new SignalR.HubConnectionBuilder().withUrl(url, {
      headers: {
        authorization: `Bearer ${ token }`
      },
      skipNegotiation: true,
      
      transport: SignalR.HttpTransportType.WebSockets
    }).withAutomaticReconnect().build();
  }
}