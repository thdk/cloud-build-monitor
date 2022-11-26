export async function sendGoogleChat(
    message: string,
    webhookURL: string,
) {

    const data = JSON.stringify({
        'text': message,
    });
    let resp;
    await fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: data,
    }).then((response) => {
        resp = response;
        console.log(response);
    });
    return resp;
}