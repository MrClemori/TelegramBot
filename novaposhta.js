export async function getStatusDocuments(ttn) {
    let documents = []
    ttn.forEach(element => {
        documents.push({DocumentNumber:  element.TTN,  Phone: element.phone}) 
    });
    let body = {
        apiKey: "", 
        modelName: "TrackingDocument",
        calledMethod: "getStatusDocuments",
        methodProperties: {
        Documents: documents,
        },
    };
    let response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(body),
    });
    let result = await response.json();
    return result
}

function getDateNow() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() +1
    if(month < 10){
        month = `0${month}`
    }
    let year = date.getFullYear()
    let textDate = `${day}.${month}.${year}`
    return textDate
}

export async function getArrayDocuments() {
    let date = getDateNow()

    let body = {
        "apiKey": "",
        "modelName": "InternetDocument",
        "calledMethod": "getDocumentList",
        "methodProperties": {
            "DateTime": "24.04.2023",
            "GetFullList": "1"
        }
    };
    let response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(body),
    });
    let result = await response.json();
    return result
}
