const { ipcRenderer } = require('electron');

ipcRenderer.on("jar-path", (event, jar) => {
    document.getElementById("jar-file").value = jar;
});

ipcRenderer.on("stat", (event, stat) => {          
    var node = document.createElement("SPAN");
    node.className = "lime-text";   
    var textnode = document.createTextNode(stat); 
    node.appendChild(textnode);        
    pre = document.getElementById("serverStats")
    pre.appendChild(node);
    pre.scrollTop = pre.scrollHeight;
});

ipcRenderer.on("status", (event, status) => {
    var node = document.createElement("SPAN");
    node.className = "lime-text";               
    var textnode = document.createTextNode(status);  
    node.appendChild(textnode);        
    pre = document.getElementById("ngrok")
    pre.appendChild(node);
    pre.scrollTop = pre.scrollHeight;
});

ipcRenderer.on("data", (event, data) => {
    var node = document.createElement("SPAN");
    node.className = "lime-text";              
    var textnode = document.createTextNode(data);  
    node.appendChild(textnode);       
    pre = document.getElementById("ngrok")
    pre.appendChild(node);
    pre.scrollTop = pre.scrollHeight;
});

ipcRenderer.on("url", (event, url) => {            
    document.getElementById("url").innerText = url;
});

ipcRenderer.on("urlRcon", (event, url) => {            
    document.getElementById("urlRcon").innerText = url;
});

ipcRenderer.on("server-stopped", (event) => {
    document.getElementById("stop").disabled = true;
    document.getElementById("config").disabled = false;
});

ipcRenderer.on("server-started", (event) => {
    document.getElementById("stop").disabled = false;
    document.getElementById("config").disabled = true;
}); 

ipcRenderer.on("config", (event, config) => {
    var jar;
    console.log(config);
    if (config.cwd.includes('\\')) jar = config.cwd + '\\' + config.jar;
    else jar = config.cwd + '/' + config.jar;
    document.getElementById("jar-file").value = jar;
    document.getElementById("jar-flags").value = config.flags;
    document.getElementById("auth-token").value = config.ngrokToken;
    document.getElementById("port").value = config.port;
    document.getElementById("channel-id").value = config.discordChannel;
}); 