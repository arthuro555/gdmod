/**
 * A modloader for web games made with GDevelop.
 */

window.loadModder = function() {
    /* Load tingle.js (modal library) */
    let js = document.createElement("script");
    js.src = "https://cdn.jsdelivr.net/gh/robinparisi/tingle/dist/tingle.min.js";
    let css = document.createElement("link");
    css.setAttribute("href", "https://cdn.jsdelivr.net/gh/robinparisi/tingle/dist/tingle.min.css");
    css.setAttribute("rel", "stylesheet");
    
    document.body.appendChild(css);
    
    /* Actual Code here */
    js.onload = function () {
        // Initialize Variables
        let GDJSContexts = [];
        window.GDJSContext = null;
        window.GDModDocument = document.implementation.createHTMLDocument("GDMod Menu");
        window.menuIFrames = [];

        /* Load UI-Kit in sandbox */
        let uikitcss = document.createElement("link");
        uikitcss.setAttribute("href", "https://cdn.jsdelivr.net/npm/uikit@3.4.0/dist/css/uikit.min.css");
        uikitcss.setAttribute("rel", "stylesheet");
        let uikitjs = document.createElement("script");
        uikitjs.src = "https://cdn.jsdelivr.net/npm/uikit@3.4.0/dist/js/uikit.min.js";
        let uikiticons = document.createElement("script");
        uikiticons.src = "https://cdn.jsdelivr.net/npm/uikit@3.4.0/dist/js/uikit-icons.min.js";

        GDModDocument.head.appendChild(uikitcss);
        GDModDocument.head.appendChild(uikitjs);
        GDModDocument.head.appendChild(uikiticons);

        /* Add modifications to every IFrame on modification of the Document */
        new MutationObserver(() => {
            for (let iframe of menuIFrames) {
                let node = iframe.contentDocument.importNode(GDModDocument.documentElement, true);
                iframe.contentDocument.replaceChild(node, iframe.contentDocument.documentElement);
            }
        }).observe(GDModDocument, { attributes: true, childList: true, subtree: true })

        function createMenu(baseContent, closeMethods) {
            baseContent = baseContent || "";
            closeMethods = closeMethods || [];

            var menu = new tingle.modal({
                footer: true,
                stickyFooter: false,
                closeMethods: closeMethods,
                onOpen() {
                    /* Put the menus content in the sandbox. Using this callback approach to really overwrite the document only when opened. */
                    GDModDocument.body.innerHTML = this.baseContent;
                },
            });

            menu.baseContent = baseContent;

            /* Make the sandboxed document the modals content document. */
            menu.modalBoxContent = GDModDocument.body;

            /* Put the document in an iframe as content of the tingle modal. */
            let iframe = document.createElement("iframe");
            iframe.src = 'about:blank';
            iframe.className = "tingle-modal-box__content";
            iframe.onload = () => {
                let node = iframe.contentDocument.importNode(GDModDocument.documentElement, true);
                iframe.contentDocument.replaceChild(node, iframe.contentDocument.documentElement);
            }
            
            iframe.style = "position: absolute; top: 0; left: 0; border: 0; width: 100%; height: 100%;" // Make responsive
            menu.modalBox.firstChild.style = "overflow: hidden; padding-top: 56.25%; position: relative;"
            
            menu.modalBox.firstChild.appendChild(iframe);

            /* make sure the iframe gets updated when the document changes */
            menuIFrames.push(iframe);

            return menu;
        }

        let menu = createMenu(`
        <h1 class="uk-heading-medium">GDevelop Modding Tool</h1>
        <h6 class="uk-text-emphasis uk-text-bolder">By Arthur Pacaud (arthuro555)</h6>
        <p class="uk-text-center"> This loader is a big WIP. It is not functional ATM. </p>
        `);
        
        menu.addFooterBtn('Search for GDevelop game', 'tingle-btn tingle-btn--primary', function() {
            menu.close();
            /* Search for GDevelop games in all contexts. */
            if(window.gdjs !== undefined) {
                GDJSContexts.push(window);
            }
            for (let iframeContext of window.frames) {
                if (iframeContext.gdjs !== undefined) {
                    GDJSContexts.push(iframeContext);
                }
            }
            menu2.open();
        });
        
        menu.addFooterBtn('Cancel Mod Loading', 'tingle-btn tingle-btn--danger', function() {
            menu.close();
        });

        var menu2 = createMenu("Not Implemented", ['overlay', 'button', 'escape']);
        
        /* Open main modal */
        menu.open();
    }
    
    /* Load the code */
    document.body.appendChild(js);
}

// For local testing
// document.addEventListener('DOMContentLoaded', loadModder);

/**
 * Compiles the code above using the Closure Compiler API and sets it to the button.
 */
document.addEventListener('DOMContentLoaded', () => {
    let element = document.getElementById("installerButton");
    if (element){        
        let closureParams = new URLSearchParams();
        closureParams.append("js_code", 
            `
            // ==ClosureCompiler==
            // @output_file_name default.js
            // @compilation_level SIMPLE_OPTIMIZATIONS
            // ==/ClosureCompiler==
            
            ` +
            "(" + loadModder.toString() + "());");
        closureParams.append("compilation_level", "SIMPLE_OPTIMIZATIONS");
        closureParams.append("output_format", "text");
        closureParams.append("output_info", "compiled_code")

        // Use closure compiler on code to minimize it
        fetch('https://closure-compiler.appspot.com/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: closureParams
        }).then((resp) => {
            resp.text().then((optimizedCode) => {
                console.log("javascript:" + optimizedCode);
                element.href = "javascript:" + optimizedCode;
                element.getElementsByClassName("label")[0].textContent = "GDevelop Mod Loader"
            })
        })
    }
});