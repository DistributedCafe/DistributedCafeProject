/** Enum for the different messages the Employee Application sends to the server. */
public enum Message {
  /** To ask the server for all the orders */
  GET_ALL_ORDERS(1),
  /** To ask the server to update the order with the provided information */
  PUT_ORDER(2);

  public final int value;

  Message(int i) {
    this.value = i;
  }
}
