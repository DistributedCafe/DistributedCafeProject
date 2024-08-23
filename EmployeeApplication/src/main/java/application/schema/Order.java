package application.schema;

import java.util.List;

/**
 * Order Schema
 *
 * @param _id
 * @param customerEmail
 * @param price
 * @param type
 * @param state
 * @param items
 */
public record Order(
    String _id,
    String customerEmail,
    int price,
    String type,
    String state,
    List<OrderItem> items) {}
