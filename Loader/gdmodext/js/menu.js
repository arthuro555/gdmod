chrome.tabs.query({active: true, currentWindow: false}, function(tabs) {
    function changeSceneFactory(sceneName) {
        return (function() {
            chrome.tabs.sendMessage(tabs[0].id, {message: "changeScene", scene: sceneName});
        })
    }
    
    function createSceneCard(sceneName) {
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
    
    function createModCard(mod) {
        const card = document.createElement("div");
        card.className = "uk-card uk-card-default";

        const cardBody = document.createElement("div");
        cardBody.className = "uk-card-body";
        const cardFooter = document.createElement("div");
        cardFooter.className = "uk-card-footer";

        card.appendChild(cardBody);
        card.appendChild(cardFooter);

        const cardTitle = document.createElement("h3");
        cardTitle.className = "uk-card-title";
        cardTitle.innerText = mod.name;
        const cardDescription = document.createElement("p");
        cardDescription.innerText = mod.description;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardDescription);

        let cardAccordion = document.createElement("ul");
        cardAccordion.setAttribute("uk-accordion", "");
        cardFooter.appendChild(cardAccordion);

        cardAccordion = cardAccordion.appendChild(document.createElement("li"));
        const accordionText = document.createElement("a");
        accordionText.className = "uk-accordion-title";
        accordionText.setAttribute("href", "#");
        accordionText.innerText = "Show Details";
        cardAccordion.appendChild(accordionText);
        const accordionContent = document.createElement("div");
        accordionContent.className = "uk-accordion-content";
        cardAccordion = cardAccordion.appendChild(accordionContent);
        
        const modData = document.createElement("p");
        modData.innerText = `Mod Informations:
    Version: ${mod.version}
    Author: ${mod.author}
    Mod UID: ${mod.uid}`;

        cardAccordion.appendChild(modData);

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
                        scenes.appendChild(createSceneCard(sceneName));
                    }
                } else if(event["id"] === "installedAPI") {
                    chrome.tabs.sendMessage(tabs[0].id, {message: "listMods"}); // Update modlist
                    chrome.tabs.sendMessage(tabs[0].id, {message: "listScenes"}); // Update scenelist
                    document.getElementById("mod-manager-loading").setAttribute("hidden", "");
                    document.getElementById("mod-manager").removeAttribute("hidden");
                } else if(event["id"] === "connected") {
                    // This means the game is connected and ready
                    document.title = "GDmod Patching Dashboard";
                    document.getElementById("connecting").innerHTML = "Dashboard for GD game " + event.payload.name;
                    chrome.tabs.sendMessage(tabs[0].id, {message: "installAPI"});
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
            // Common to GDAPI and the loader
            if(event["id"] === "listMods") {
                const mods = document.getElementById("modList");
                mods.innerHTML = "";
                for(let mod of event.payload) {
                    mods.appendChild(createModCard(mod));
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

    document.getElementById('selectMod').addEventListener('click', function() {
        fileElement.click();
    });

    // Now that we opened the mod loader install the API into the game (the API is not crucial and is therefore only loaded when needed)
    chrome.tabs.sendMessage(tabs[0].id, {message: "connect"});
});
