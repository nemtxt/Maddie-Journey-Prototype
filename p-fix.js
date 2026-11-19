
window.mcTheme=()=>toggleTheme();
(()=>{const h=document.getElementById("hint");if(h)h.addEventListener("click",()=>setTimeout(()=>{const u=document.getElementById("unl");if(u&&!u.disabled)u.click()},350));const g=document.getElementById("gth");if(g)g.onclick=()=>toggleTheme();
const tc=document.getElementById("tc"),isD=()=>{const t=document.documentElement.dataset.theme;return t?t==="dark":matchMedia("(prefers-color-scheme:dark)").matches};
const sync=()=>{if(tc)tc.content=isD()?"#000000":"#ffffff"};sync();
new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});})();
