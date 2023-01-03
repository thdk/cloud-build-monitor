export async function sendGoogleChat(
    message: string,
    webhookURL: string,
    {
        threadId,
    }: {
        threadId?: string;
    } = {},
) {

    const data = JSON.stringify({
        'text': message,
    });
    let resp;
    await fetch(`${webhookURL}${threadId ? `&threadKey=${threadId}` : ""}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: data,
    }).then((response) => {
        resp = response;
    });
    return resp;
}