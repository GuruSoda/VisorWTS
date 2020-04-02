function load(selector, url, cb) {
    var request = new XMLHttpRequest()

    // se ejecuta cuando finalizo el GET
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            document.getElementById(selector).innerHTML = request.responseText

            if (cb) cb()
        }
    }

    request.open('GET', url)

    request.send()
}

async function getJSON(url) {
    const response = await fetch(url)
    return response.json()
}
