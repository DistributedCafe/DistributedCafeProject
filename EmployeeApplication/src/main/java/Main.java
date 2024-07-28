import io.vertx.core.Vertx;

/**
 * Main to start the Employee Application GUI and the websocket communication with the server
 */
public class Main {
  public static void main(String[] args) {
    Vertx vertx = Vertx.vertx();
    var view = new View();
    vertx.deployVerticle(new WebSocketConnection(view));
  }
}
