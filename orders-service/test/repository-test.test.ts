import * as repository from '../src/repository/repository'
import {InsertOrder, Order, OrderState, OrderType} from '../src/domain/order'
import { OrdersMessage } from '../src/orders-message'
import * as client from '../src/repository/connection'
import * as db from '../src/repository/db_utils'

afterAll(() => {client.closeMongoClient()})

// read
test('Get All Orders',  async () => {

    // empty repository test
    await db.emptyOrders()
    let value = await repository.getAllOrders()
    expect(value.message).toBe(OrdersMessage.EMPTY_ORDERS_DB)
    expect(value.data?.length).toBe(0)
    
    // repository with orders test
    await db.fillOrders()
    value = await repository.getAllOrders()
    expect(value.message).toBe(OrdersMessage.OK)
    expect(value.data?.length).toBe(4)

    let expectedValues = value.data?.map(o => removeIndexOrder(o))

    expect(expectedValues).toStrictEqual(db.getTestOrders())
       
})

// write
test('Create Order', async () => {
    await db.emptyOrders()
    let expectedOrder = db.toInsertOrder("user@gmail.com", 10, OrderType.AT_THE_TABLE, OrderState.PENDING, db.getTestItems())
    let res = await repository.createOrder(expectedOrder.customerContact, expectedOrder.price, expectedOrder.type, expectedOrder.items)
    expect(res.message).toBe(OrdersMessage.OK)
    if (res.data != undefined){
        expect(removeIndexOrder(res.data)).toStrictEqual(expectedOrder) 
    }
    
})

function removeIndexOrder(order: Order): InsertOrder{
    return db.toInsertOrder(order.customerContact, order.price, order.type, order.state, order.items)
}
