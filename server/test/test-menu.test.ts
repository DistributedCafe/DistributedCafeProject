import { Service } from '../src/utils/service'
import { MenuServiceMessages, ResponseMessage } from '../src/utils/messages';
import { add, cleanCollection, closeMongoClient, DbCollections, DbNames, getCollection } from './utils/db-connection';
import {
	closeWs, createConnectionAndCall, createRequestMessage,
	createResponseMessage, initializeServer, server, startWebsocket
} from './utils/test-utils';
import { boiledEgg, egg, friedEgg, omelette } from './utils/test-data';
import { ERROR_EMPTY_WAREHOUSE, OK } from './utils/api-response';

beforeAll(async () => {
	await (await getCollection(DbNames.MENU, DbCollections.MENU)).createIndex({ name: 1 }, { unique: true })
})

beforeEach(async () => {
	await cleanCollection(DbNames.MENU, DbCollections.MENU)
	await cleanCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)
	await add(DbNames.MENU, DbCollections.MENU, JSON.stringify(omelette))
	await add(DbNames.WAREHOUSE, DbCollections.WAREHOUSE, JSON.stringify(egg))
	initializeServer()
})

afterEach(() => {
	closeWs()
	server.close()
})

afterAll(() => { closeMongoClient() })

const testCheckService = (action: string, input: any, expectedResponse: ResponseMessage, callback: jest.DoneCallback) => {
	createConnectionAndCall(createRequestMessage(Service.MENU, action, input), expectedResponse, callback)
}

function testApi(action: string, input: any, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	startWebsocket(createRequestMessage(Service.MENU, action, input),
		expectedResponse, callback)
}

test('Get all available items Test - 200', done => {
	testApi(MenuServiceMessages.GET_AVAILABLE_ITEMS, "",
		createResponseMessage(OK, [omelette]), done)
})

test('Get all available items Test - 200 (check-service)', done => {
	testCheckService(MenuServiceMessages.GET_AVAILABLE_ITEMS, "",
		createResponseMessage(OK, [omelette]), done)
})

test('Get item by name Test - 200', done => {
	testApi(MenuServiceMessages.GET_ITEM_BY_NAME, omelette.name,
		createResponseMessage(OK, omelette), done)
});

test('Get item by name Test - 200 (check-service)', done => {
	testCheckService(MenuServiceMessages.GET_ITEM_BY_NAME, omelette.name,
		createResponseMessage(OK, omelette), done)
})

test('Get all items Test - 200', done => {
	testApi(MenuServiceMessages.GET_ITEMS, "",
		createResponseMessage(OK, [omelette]), done)
})

test('Get all items Test - 200 (check-service)', done => {
	testCheckService(MenuServiceMessages.GET_ITEMS, "",
		createResponseMessage(OK, [omelette]), done)
})

test('Add new item Test - 200', done => {
	testApi(MenuServiceMessages.CREATE_ITEM, friedEgg,
		createResponseMessage(OK, friedEgg), done)
});

test('Add new item Test - 200 (check-service)', done => {
	testCheckService(MenuServiceMessages.CREATE_ITEM, boiledEgg,
		createResponseMessage(OK, boiledEgg), done)
});

test('Update item Test - 200', done => {
	const update_omelette = {
		name: "omelette",
		recipe: [
			{
				ingredient_name: "egg",
				quantity: 2
			},
			{
				ingredient_name: "salt",
				quantity: 1
			}
		],
		price: 4
	}

	testApi(MenuServiceMessages.UPDATE_ITEM, update_omelette,
		createResponseMessage(OK, update_omelette), done)
});

test('Update item Test - 200 (check-service)', done => {
	const update_omelette = {
		name: "omelette",
		recipe: [
			{
				ingredient_name: "egg",
				quantity: 2
			},
			{
				ingredient_name: "salt",
				quantity: 1
			},
			{
				ingredient_name: "tomato",
				quantity: 1
			}
		],
		price: 5
	}
	testCheckService(MenuServiceMessages.UPDATE_ITEM, update_omelette,
		createResponseMessage(OK, update_omelette), done)
});

test('Get all available items Test - 404', done => {
	cleanCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE).then(() => {
		testApi(MenuServiceMessages.GET_AVAILABLE_ITEMS, "",
			createResponseMessage(ERROR_EMPTY_WAREHOUSE, ""), done)
	})
})

test('Get all available items Test (check-service) - 404', done => {
	cleanCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE).then(() => {
		testCheckService(MenuServiceMessages.GET_AVAILABLE_ITEMS, "",
			createResponseMessage(ERROR_EMPTY_WAREHOUSE, ""), done)
	})
})

/*function test_check_service(requestMessage: RequestMessage, code: number, message: string, output: any, callback: jest.DoneCallback) {
	wss.on('connection', (ws) => {
		ws.on('error', console.error);

		ws.on('message', (msg: string) => {
			const m = JSON.parse(msg)
			check(m, code, message, output)
			callback()
		});

	});
	server.listen(8081, () => console.log('listening on port :8081'));

	ws_check_service = new WebSocket('ws://localhost:8081');
	const managerWs = Array()
	ws_check_service.on('open', () => check_service(requestMessage, ws_check_service, managerWs))
}

function check(res: ResponseMessage, code: number, message: string, output: any) {
	expect(res.code).toBe(code);
	expect(res.message).toBe(message);
	if (res.code == 200) {
		expect(JSON.parse(res.data)).toStrictEqual(output)
	} else {
		expect(res.data).toBe(output);
	}
}

function test_route(requestMessage: RequestMessage, code: number, message: string, data: any, callback: jest.DoneCallback) {
	ws_route = new WebSocket('ws://localhost:3000');
	ws_route.on('message', (msg: string) => {
		const m = JSON.parse(msg)
		check(m, code, message, data)
		callback()

	});

	ws_route.on('open', () => ws_route.send(JSON.stringify(requestMessage)));
}*/
