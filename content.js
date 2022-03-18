function injectScript() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = chrome.runtime.getURL('inject.js');

    document.head.appendChild(s);
}

// add the message listener. its used to communicate with the injected script
function addListener() {
    window.addEventListener('message', (event) => {
        if (event.source != window) return;
        fetch(
            `https://instaling.pl/ling2/server/actions/getAudioUrl.php?id=${event.data.id}`
        )
            .then((response) => response.json())
            .then((data) => {
                // creepy regex magic
                const data_regex = data.url
                    .replace(/\w+:\/\/\w+.\w+\/\/\w+\/\w+\//gm, '')
                    .replace(/\.\w+/gm, '');

                // so it looks good
                if (
                    event.data.show != undefined ||
                    data_regex.includes('instaling')
                )
                    return;

                console.log(
                    `%c Word ID is ${event.data.id}.`,
                    'color: yellow; font-size: 14px;'
                );
                console.log(
                    `%c Word is "${data_regex}".`,
                    'color: yellow; font-size: 14px;'
                );

                const previousAnswer =
                    document.getElementsByClassName('temgot-ling');

                while (previousAnswer[0]) {
                    previousAnswer[0].parentNode.removeChild(previousAnswer[0]);
                }

                // required or element will be deleted lol
                setTimeout(() => {
                    const answer = document.createElement('p');
                    answer.innerText = data_regex;

                    answer.className = 'temgot-ling';

                    answer.style.margin = '16px';
                    answer.style.position = 'absolute';
                    answer.style.left = '0';
                    answer.style.bottom = '0';

                    document.body.appendChild(answer);
                }, 30);

                navigator.clipboard.writeText(data_regex);
            });
    });
}

function main() {
    injectScript();
    addListener();
}

main();
