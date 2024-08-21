export interface NotAvailableError {
    error: boolean,
    errorMsg: string
}

export function createError() : NotAvailableError{
    return {error : false, errorMsg: ""}
}

export function getServerError() : NotAvailableError{
    return getError("Server not available!")
}

export function getMicroserviceError(): NotAvailableError {
    return getError("Microservice not available!")
}

export function getWarehouseError(): NotAvailableError {
    return getError("Warehouse empty!")
}

function getError(message: string): NotAvailableError{
    return {error : true, errorMsg : message}
}



