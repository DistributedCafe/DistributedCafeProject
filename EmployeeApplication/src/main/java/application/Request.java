package application;

import io.vertx.core.json.JsonObject;

public final class Request {

    public static JsonObject createJsonRequest(String message, String input) {
        var request = new JsonObject();
        request
                .put("client_name", "Orders")
                .put("client_request", message)
                .put("input", input);
        return request;
    }


}
