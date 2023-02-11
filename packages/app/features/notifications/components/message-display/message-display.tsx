import React from "react";

export function MessageDisplay(text: string) {
    return <code
        style={{ display: "block", alignContent: "center" }}
        dangerouslySetInnerHTML={{
            __html: text.replaceAll("\n", "<br />"),
        }}
    />
}
