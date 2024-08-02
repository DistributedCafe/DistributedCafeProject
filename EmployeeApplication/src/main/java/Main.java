import io.vertx.core.Vertx;

/** Main Class */
public class Main {
  /**
   * main starts the Employee Application GUI and the websocket communication with the server
   *
   * @param args provided when run
   */
  public static void main(String[] args) {
    Vertx vertx = Vertx.vertx();
    var view = new View();
    vertx.deployVerticle(new WebSocketConnection(view));
  }
}