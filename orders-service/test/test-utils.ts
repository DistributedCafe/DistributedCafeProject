import { InsertOrder, Order } from '../src/domain/order'
import * as db from '../src/repository/db_utils'

export function removeIndexOrder(order: Order): InsertOrder{
    return db.toInsertOrder(order.customerContact, order.price, order.type, order.state, order.items)
}
