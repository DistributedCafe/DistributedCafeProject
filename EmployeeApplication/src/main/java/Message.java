public enum Message {
    GET_ALL_ORDERS(1),
    PUT_ORDER(2);

    public final int value;

    Message(int i) {
        this.value = i;
    }
}
