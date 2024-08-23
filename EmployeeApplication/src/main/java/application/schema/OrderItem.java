package application.schema;

/**
 * OrderItem schema
 *
 * @param item
 * @param quantity
 */
public record OrderItem(Item item, int quantity) {}
