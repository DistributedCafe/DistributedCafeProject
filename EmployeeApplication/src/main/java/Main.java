import io.vertx.core.Vertx;



public class Main {
    public static void main(String[] args) {
        Vertx vertx = Vertx.vertx();
        var view = new View();
        vertx.deployVerticle(new WebSocketConnection(view));
    }
}
