let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
    this.addEventListener('load', function () {
        const responseBody = this.responseText;

        // anty-2021-11-27 RWK Testy wydajnosci instakod
        if (responseBody.includes('<script>') || responseBody == '') return;

        const responseJson =
            typeof responseBody == 'string' ? JSON.parse(responseBody) : {};

        window.addEventListener(
            'paste',
            function (event) {
                event.stopImmediatePropagation();
            },
            true
        );

        window.postMessage({
            id: responseJson.id,
            show: responseJson.answershow,
        });
    });
    return oldXHROpen.apply(this, arguments);
};
