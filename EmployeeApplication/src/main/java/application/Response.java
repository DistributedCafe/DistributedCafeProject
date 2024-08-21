package application;

import io.vertx.core.buffer.Buffer;
import io.vertx.core.json.JsonObject;

/**
 * This class represents the response, a message received from the server.
 */
public class Response {

    /**
     * It says if the server response is code based on the code.
     * @return true if the code is ok, false otherwise
     */
    public boolean isCodeOk(){
        return code == 200;
    }

    /**
     * It says if the server is not available based on the message of the response.
     * @return true if the server is not available, false otherwise
     */
    public boolean isServerNotAvailable(){
        return msg.equals("ERROR_SERVER_NOT_AVAILABLE");
    }

    /**
     *
     * @return the response message
     */
    public String getMsg() {
        return msg;
    }

    /**
     *
     * @return the response data
     */
    public String getData() {
        return data;
    }

    private final String msg;
    private final int code;
    private final String data;

    /**
     * Class constructor that create a Response reading the buffer
     * @param buffer of the websocket connected to the server
     */
    public Response(Buffer buffer) {
        JsonObject res = buffer.toJsonObject();
        msg = (String) res.getValue("message");
        code = (Integer) res.getValue("code");
        data = res.getValue("data").toString();
    }
}
