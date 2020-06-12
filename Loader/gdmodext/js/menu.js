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
            if(event["origin"] === "loader") {
                if(event["id"] === "pong") {
                    console.log("pong")
                } else if(event["id"] === "listScenes") {
                    const scenes = document.getElementById("scenelist");
                    scenes.innerHTML = "";
                    for(let sceneName of event.payload) {
                        scenes.appendChild(createCard(sceneName));
                    }
                } else if(event["id"] === "installedAPI") {
                    // TODO
                } else if(event["id"] === "connected") {
                    // This means the game is connected and ready
                    document.title = "GDmod Scene Selector";
                    document.getElementById("connecting").innerHTML = "Dashboard for GD game " + event.payload.name;
                    chrome.tabs.sendMessage(tabs[0].id, {message: "listScenes"}); // Get list of scenes (will be moved)
                } else if(event["id"] === "modReceived") {
                    document.getElementById("modload-currentAction").innerText = "Loading Mod...";
                    document.getElementById("modload-progress").setAttribute("value","2");
                }
            } else if(event["origin"] === "GDAPI") {
                if(event["id"] === "modLoaded") {
                    document.getElementById("modload-progress").setAttribute("value","3");
                    UIkit.modal(document.getElementById("modload-modal")).hide();
                    UIkit.notification({message: 'Mod Loaded successfully!', status: 'success'});
                } else if(event["id"] === "modLoadError") {
                    UIkit.modal(document.getElementById("modload-modal")).hide();
                    document.getElementById("modload-error").innerText = event.payload;
                    UIkit.modal(document.getElementById("modload-error-modal")).show();
                }
            }
        }
    });

    const fileElement = document.getElementById("fileInput");
    fileElement.addEventListener('change', function () {
        UIkit.modal(document.getElementById("modload-modal")).show();

        var reader = new FileReader();
        reader.onloadend = function() {
            document.getElementById("modload-currentAction").innerText = "Uploading Mod to the game...";
            document.getElementById("modload-progress").setAttribute("value","1");
            chrome.tabs.sendMessage(tabs[0].id, {message: "loadMod", mod: reader.result});
        }
        reader.readAsDataURL(fileElement.files[0]); 
    });

    document.getElementById('mods').addEventListener('show', function () {
        chrome.tabs.sendMessage(tabs[0].id, {message: "installAPI"});
    });

    document.getElementById('selectMod').addEventListener('click', function() {
        fileElement.click();
    });

    // Now that we opened the mod loader install the API into the game (the API is not crucial and is therefore only loaded when needed)
    chrome.tabs.sendMessage(tabs[0].id, {message: "connect"});
});
