chrome.tabs.query({active: true, currentWindow: false}, function(tabs) {
    function changeSceneFactory(sceneName) {
        return (function() {
            chrome.tabs.sendMessage(tabs[0].id, {message: "changeScene", scene: sceneName});
        })
    }
    
    function createCard(sceneName) {
        let card = document.createElement("div");
        card.className = "uk-card uk-card-default";

        let cardBody = document.createElement("div");
        cardBody.className = "uk-card-body";
        let cardFooter = document.createElement("div");
        cardFooter.className = "uk-card-footer";

        card.appendChild(cardBody);
        card.appendChild(cardFooter);

        let cardTitle = document.createElement("h3");
        cardTitle.className = "uk-card-title";
        cardTitle.innerText = sceneName;
        let cardButton = document.createElement("button");
        cardButton.className = "uk-button uk-button-text";
        cardButton.innerText = "Switch to that scene"
        cardButton.onclick = changeSceneFactory(sceneName);

        cardBody.appendChild(cardTitle);
        cardFooter.appendChild(cardButton);

        return card;
    }

    chrome.runtime.onMessage.addListener(function(event) {
        if(typeof event["id"] !== "undefined") {
            if(event["id"] === "pong") {
                document.getElementById("connecting").innerHTML = "Connected!";
                document.title = "GDmod Scene Selector"
                chrome.tabs.sendMessage(tabs[0].id, {message: "listScenes"});
            } else if(event["id"] === "listScenes") {
                const scenes = document.getElementById("scenes");
                scenes.innerHTML = "";
                for(let sceneName of event.payload) {
                    scenes.appendChild(createCard(sceneName));
                }
            }
        }
    });

    chrome.tabs.sendMessage(tabs[0].id, {message: "ping"});
});
