package application;

import application.schema.Request;
import application.schema.Response;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.AsyncResult;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.WebSocket;
import io.vertx.core.http.WebSocketClient;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

/**
 * This class is in charge of connecting to the server and handling the GUI update when it receives
 * messages from the server. When start is called it connects the websocket to the server and
 * initializes the message handler. The handler updates the GUI when order data arrives, if the
 * server is not able to provide the data the websocket resends the request. If the connection is
 * successful it asks all the orders from the server. If the connection is not successful it keeps
 * trying to reconnect.
 */
public class WebSocketConnection extends AbstractVerticle {

  private final View view;

  /**
   * Class Constructor
   *
   * @param view the application.Main GUI
   */
  public WebSocketConnection(View view) {
    this.view = view;
  }

  @Override
  public void start() {
    startClient(vertx);
  }

  private void startClient(Vertx vertx) {
    var request = Request.createJsonRequest(Message.GET_ALL_ORDERS, "");
    WebSocketClient client = vertx.createWebSocketClient();
    connect(client, request);
  }

  private void checkResponseAndUpdateView(Response res, AsyncResult<WebSocket> ctx) {
    if (res.isCodeOk()) {
      var data = new JsonArray(res.data());
      view.addPanels(data, ctx);
    }
  }

  private void checkResponseAndReconnect(Response res, WebSocket ws, JsonObject request) {
    if (!res.isCodeOk() && res.isServerNotAvailable()) {
      try {
        Thread.sleep(1000);
        ws.write(Buffer.buffer(String.valueOf(request)));
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
      }
    }
  }

  private void connect(WebSocketClient client, JsonObject request) {
    client.connect(
        3000,
        "localhost",
        "/",
        ctx -> {
          var ws = ctx.result();
          if (ws != null) {

            ws.handler(
                message -> {
                  Response res = message.toJsonObject().mapTo(Response.class);
                  checkResponseAndUpdateView(res, ctx);
                  checkResponseAndReconnect(res, ws, request);
                  view.setMessageLabel(res.message());
                });

            ws.write(Buffer.buffer(String.valueOf(request)));
          } else {
            connect(client, request);
          }
        });
  }
}
