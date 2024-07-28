/**
 * Enum for the different messages the Employee Application sends to the server.
 */
public enum Message {
  GET_ALL_ORDERS(1),
  PUT_ORDER(2);

  public final int value;

  Message(int i) {
    this.value = i;
  }
}
