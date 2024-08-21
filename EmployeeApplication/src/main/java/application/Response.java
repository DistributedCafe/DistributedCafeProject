package application;

import io.vertx.core.buffer.Buffer;
import io.vertx.core.json.JsonObject;

public class Response {

    int OK_CODE = 200;
    String ERROR_MESSAGE_SERVER = "ERROR_SERVER_NOT_AVAILABLE";

    public boolean isCodeOk(){
        return code == OK_CODE;
    }

    public boolean isServerNotAvailable(){
        return msg.equals(ERROR_MESSAGE_SERVER);
    }

    public String getMsg() {
        return msg;
    }

    public String getData() {
        return data;
    }

    private final String msg;
    private final int code;
    private final String data;

    public Response(Buffer buffer) {
        JsonObject res = buffer.toJsonObject();
        msg = (String) res.getValue("message");
        code = (Integer) res.getValue("code");
        data = res.getValue("data").toString();
    }
}
