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
        /* Define all "menus" */
        var menu = new tingle.modal({
            footer: true,
            stickyFooter: false,
            closeMethods: [],
        });
        
        menu.setContent(`
          <h1>GDevelop Modding Tool</h1>
          <h6>By Arthur Pacaud (arthuro555)</h6>

          <p> This loader is a big WIP. It is not functional ATM. </p>
          `);
        
        menu.addFooterBtn('Next', 'tingle-btn tingle-btn--primary', function() {
            menu.close();
            menu2.open();
        });
        
        menu.addFooterBtn('Cancel Mod Loading', 'tingle-btn tingle-btn--danger', function() {
            menu.close();
        });

        var menu2 = new tingle.modal({
            footer: true,
            stickyFooter: false,
        });

        menu2.setContent("Not Implemented")
        
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