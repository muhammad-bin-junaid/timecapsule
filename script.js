var clock=document.getElementById("clock"),dateEl=document.getElementById("date"),searchForm=document.getElementById("searchForm"),searchInput=document.getElementById("searchInput"),taskInput=document.getElementById("taskInput"),addTaskBtn=document.getElementById("addTaskBtn"),taskList=document.getElementById("taskList"),taskCount=document.getElementById("taskCount"),capsuleList=document.getElementById("capsuleList"),newCapsuleBtn=document.getElementById("newCapsuleBtn"),capsuleModal=document.getElementById("capsuleModal"),closeCapsuleModal=document.getElementById("closeCapsuleModal"),messageInput=document.getElementById("messageInput"),unlockDate=document.getElementById("unlockDate"),sealBtn=document.getElementById("sealBtn"),messageModal=document.getElementById("messageModal"),closeMessageModal=document.getElementById("closeMessageModal"),unlockedMessage=document.getElementById("unlockedMessage"),deleteCapsuleBtn=document.getElementById("deleteCapsuleBtn"),settingsBtn=document.getElementById("settingsBtn"),settingsPanel=document.getElementById("settingsPanel"),closeSettingsBtn=document.getElementById("closeSettingsBtn"),themeSelect=document.getElementById("themeSelect"),addLinkBtn=document.getElementById("addLinkBtn"),linkModal=document.getElementById("linkModal"),closeLinkModal=document.getElementById("closeLinkModal"),linkName=document.getElementById("linkName"),linkUrl=document.getElementById("linkUrl"),saveLinkBtn=document.getElementById("saveLinkBtn"),quickLinks=document.getElementById("quickLinks"),browserTabs=document.getElementById("browserTabs"),newTabBtn=document.getElementById("newTabBtn"),homeBtn=document.getElementById("homeBtn"),homePage=document.getElementById("homePage"),internalPage=document.getElementById("internalPage"),backHomeBtn=document.getElementById("backHomeBtn"),internalTitle=document.getElementById("internalTitle"),internalContent=document.getElementById("internalContent")

var currentCapsuleId=null

function escapeHTML(str){var div=document.createElement("div");div.textContent=str;return div.innerHTML}

function updateClock(){var now=new Date();clock.textContent=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:false});dateEl.textContent=now.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}
updateClock()
setInterval(updateClock,1000)

searchForm.addEventListener("submit",function(event){event.preventDefault();var query=searchInput.value.trim();if(!query)return;createBrowserTab("search");performFakeSearch(activeTab,query);searchInput.value=""})


var tasks=JSON.parse(localStorage.getItem("capsuleTasks"))||[]
function saveTasks(){localStorage.setItem("capsuleTasks",JSON.stringify(tasks))}

function renderTasks(){
taskList.innerHTML=""
var completed=tasks.filter(task=>task.completed).length
taskCount.textContent=completed+" / "+tasks.length
if(tasks.length===0){var empty=document.createElement("p");empty.textContent="No tasks yet. Add something you want to accomplish.";empty.style.color="var(--muted)";empty.style.fontSize="11px";empty.style.padding="10px 0";taskList.appendChild(empty);return}
tasks.forEach(task=>{
var el=document.createElement("div");el.className="task"
if(task.completed)el.classList.add("completed")
el.innerHTML='<input type="checkbox" class="task-checkbox" '+(task.completed?"checked":"")+">"+"<span>"+escapeHTML(task.text)+"</span>"+'<button class="delete-task">&times;</button>'
el.querySelector(".task-checkbox").addEventListener("change",function(){task.completed=this.checked;saveTasks();renderTasks()})
el.querySelector(".delete-task").addEventListener("click",function(){tasks=tasks.filter(function(item){return item.id!==task.id});saveTasks();renderTasks()})
taskList.appendChild(el)
})}

function addTask(){var text=taskInput.value.trim();if(!text)return;tasks.push({id:Date.now(),text:text,completed:false});taskInput.value="";saveTasks();renderTasks()}

addTaskBtn.addEventListener("click",addTask)
taskInput.addEventListener("keydown",function(e){if(e.key==="Enter")addTask()})
renderTasks()


var capsules=JSON.parse(localStorage.getItem("timeCapsules"))||[]
function saveCapsules(){localStorage.setItem("timeCapsules",JSON.stringify(capsules))}

function renderCapsules(){
capsuleList.innerHTML=""
if(capsules.length===0){var empty=document.createElement("p");empty.textContent="No capsules yet.";empty.style.color="var(--muted)";empty.style.fontSize="11px";capsuleList.appendChild(empty);return}
capsules.forEach(function(capsule){
var card=document.createElement("div");card.className="capsule-card"
var unlocked=Date.now()>=capsule.unlockTime
var unlockDateText=new Date(capsule.unlockTime).toLocaleString([],{dateStyle:"medium",timeStyle:"short"})
card.innerHTML="<strong>"+(unlocked?"Unlocked capsule":"Sealed capsule")+"</strong>"+"<p>"+(unlocked?escapeHTML(capsule.message):"Your message is still waiting for its moment.")+"</p>"+'<span class="capsule-status">'+(unlocked?"READY TO OPEN":"UNLOCKS "+unlockDateText.toUpperCase())+"</span>"
if(unlocked){card.style.cursor="pointer";card.addEventListener("click",function(){openCapsule(capsule.id)})}
capsuleList.appendChild(card)
})}

function openNewCapsule(){messageInput.value="";unlockDate.value="";capsuleModal.classList.remove("hidden")}

function sealCapsule(){
var message=messageInput.value.trim(),selectedDate=unlockDate.value
if(!message){alert("Write a message first.");return}
if(!selectedDate){alert("Choose an unlock date.");return}
var unlockTime=new Date(selectedDate).getTime()
if(unlockTime<=Date.now()){alert("Choose a future date and time.");return}
capsules.push({id:Date.now(),message:message,unlockTime:unlockTime})
saveCapsules();capsuleModal.classList.add("hidden");renderCapsules()
}

function openCapsule(id){var capsule=capsules.find(function(c){return c.id===id});if(!capsule||Date.now()<capsule.unlockTime)return;currentCapsuleId=id;unlockedMessage.textContent=capsule.message;messageModal.classList.remove("hidden")}

function deleteCapsule(){if(currentCapsuleId===null)return;capsules=capsules.filter(function(c){return c.id!==currentCapsuleId});currentCapsuleId=null;saveCapsules();messageModal.classList.add("hidden");renderCapsules()}

newCapsuleBtn.addEventListener("click",openNewCapsule)
sealBtn.addEventListener("click",sealCapsule)
deleteCapsuleBtn.addEventListener("click",deleteCapsule)
closeCapsuleModal.addEventListener("click",function(){capsuleModal.classList.add("hidden")})
closeMessageModal.addEventListener("click",function(){messageModal.classList.add("hidden")})
setInterval(renderCapsules,1000)

settingsBtn.addEventListener("click",function(){settingsPanel.classList.remove("hidden")})
closeSettingsBtn.addEventListener("click",function(){settingsPanel.classList.add("hidden")})

function applyTheme(theme){
var root=document.documentElement
if(theme==="light"){
root.style.setProperty("--bg","#f1f1ec");root.style.setProperty("--surface","rgba(0,0,0,0.045)");root.style.setProperty("--surface-hover","rgba(0,0,0,0.075)");root.style.setProperty("--border","rgba(0,0,0,0.12)");root.style.setProperty("--text","#111216");root.style.setProperty("--muted","#666970");root.style.setProperty("--accent","#667d00")
}else{
root.style.setProperty("--bg","#0b0c0f");root.style.setProperty("--surface","rgba(255,255,255,0.055)");root.style.setProperty("--surface-hover","rgba(255,255,255,0.085)");root.style.setProperty("--border","rgba(255,255,255,0.11)");root.style.setProperty("--text","#f3f3f0");root.style.setProperty("--muted","#8d9098");root.style.setProperty("--accent","#d8ff65")
}
localStorage.setItem("capsuleTheme",theme)
}

themeSelect.addEventListener("change",function(){applyTheme(themeSelect.value)})


var customLinks=JSON.parse(localStorage.getItem("customLinks"))||[]
function saveCustomLinks(){localStorage.setItem("customLinks",JSON.stringify(customLinks))}

function renderCustomLinks(){
document.querySelectorAll(".custom-link").forEach(function(l){l.remove()})
customLinks.forEach(function(link){
var el=document.createElement("a");el.className="link-card custom-link";el.href=link.url;el.target="_self"
el.innerHTML='<div class="link-icon">'+escapeHTML(link.name.substring(0,2).toUpperCase())+"</div>"+"<strong>"+escapeHTML(link.name)+"</strong>"+"<span>Custom website</span>"
quickLinks.appendChild(el)
})}

function addCustomLink(){
var name=linkName.value.trim(),url=linkUrl.value.trim()
if(!name||!url){alert("Enter both a name and URL.");return}
if(!url.startsWith("http://")&&!url.startsWith("https://")){alert("URL must start with http:// or https://");return}
customLinks.push({name:name,url:url})
saveCustomLinks();linkName.value="";linkUrl.value="";linkModal.classList.add("hidden");renderCustomLinks()
}

addLinkBtn.addEventListener("click",function(){linkModal.classList.remove("hidden")})
closeLinkModal.addEventListener("click",function(){linkModal.classList.add("hidden")})
saveLinkBtn.addEventListener("click",addCustomLink)
renderCustomLinks()


var activeTab="home",browserPages={}

function createBrowserTab(type){
if(!type)type="new"
var tabId="tab-"+Date.now()
browserPages[tabId]={type:type,title:type==="new"?"New Tab":type,history:[]}
var tab=document.createElement("button");tab.className="browser-tab";tab.dataset.tab=tabId
tab.innerHTML="<span>"+(type==="new"?"New Tab":type)+"</span>"+'<span class="close-tab">&times;</span>'
tab.addEventListener("click",function(event){if(event.target.classList.contains("close-tab")){closeBrowserTab(tabId);return}activateBrowserTab(tabId)})
browserTabs.insertBefore(tab,newTabBtn)
activateBrowserTab(tabId)
}

function activateBrowserTab(tabId){
activeTab=tabId
document.querySelectorAll(".browser-tab").forEach(function(tab){tab.classList.toggle("active",tab.dataset.tab===tabId)})
homePage.classList.remove("active-page");homePage.classList.add("hidden")
internalPage.classList.remove("hidden");internalPage.classList.add("active-page")
renderBrowserTabContent(tabId)
}

function closeBrowserTab(tabId){
var tab=document.querySelector('[data-tab="'+tabId+'"]'),wasActive=activeTab===tabId
if(tab)tab.remove()
delete browserPages[tabId]
if(wasActive){var remaining=Object.keys(browserPages);if(remaining.length>0)activateBrowserTab(remaining[remaining.length-1]);else activateHomeTab()}
}

function activateHomeTab(){
activeTab="home"
document.querySelectorAll(".browser-tab").forEach(function(tab){tab.classList.toggle("active",tab.dataset.tab==="home")})
internalPage.classList.remove("active-page");internalPage.classList.add("hidden")
homePage.classList.remove("hidden");homePage.classList.add("active-page")
}

newTabBtn.addEventListener("click",function(){createBrowserTab()})
homeBtn.addEventListener("click",function(){activateHomeTab()})
var homeTab=browserTabs.querySelector('[data-tab="home"]')
if(homeTab)homeTab.addEventListener("click",function(){activateHomeTab()})
backHomeBtn.addEventListener("click",function(){activateHomeTab()})

function renderBrowserTabContent(tabId){
var page=browserPages[tabId];if(!page)return
internalTitle.textContent=page.title
if(page.type==="github"){renderGitHubPage();return}
if(page.type==="youtube"){renderYouTubePage();return}
if(page.type==="hackclub"){renderHackClubPage();return}
if(page.type==="vercel"){renderVercelPage();return}
renderNewBrowserPage(tabId)
}

function renderGitHubPage(){
internalContent.innerHTML='<div class="fake-site" style="padding:20px">'+'<h2 style="color:#f0f6fc;margin-bottom:10px">GitHub</h2>'+'<p style="color:#8b949e;font-size:12px;margin-bottom:15px">muhammad-bin-junaid</p>'+'<div style="display:flex;gap:8px;margin-bottom:15px">'+'<div class="gh-repo-item" style="flex:1"><span class="gh-repo-name">mo-os</span><p style="color:#8b949e;font-size:11px">A browser-based OS</p></div>'+'<div class="gh-repo-item" style="flex:1"><span class="gh-repo-name">time-capsule</span><p style="color:#8b949e;font-size:11px">This project lol</p></div>'+'</div>'+'</div>'
}

function renderYouTubePage(){
internalContent.innerHTML='<div class="fake-site" style="padding:20px">'+'<h2 style="color:#fff;margin-bottom:10px">YouTube</h2>'+'<p style="color:#888;font-size:12px;margin-bottom:15px">home</p>'+'<div style="display:flex;gap:10px;flex-wrap:wrap">'+'<div style="width:200px"><div style="background:#1a1a2e;height:100px;border-radius:8px;margin-bottom:5px"></div><p style="color:#fff;font-size:11px">Code tutorial</p><p style="color:#888;font-size:10px">Fireship</p></div>'+'<div style="width:200px"><div style="background:#0f3443;height:100px;border-radius:8px;margin-bottom:5px"></div><p style="color:#fff;font-size:11px">JS projects</p><p style="color:#888;font-size:10px">Traversy Media</p></div>'+'<div style="width:200px"><div style="background:#2d1b69;height:100px;border-radius:8px;margin-bottom:5px"></div><p style="color:#fff;font-size:11px">Web dev roadmap</p><p style="color:#888;font-size:10px">Web Dev Simplified</p></div>'+'</div>'+'</div>'
}

function renderHackClubPage(){
internalContent.innerHTML='<div class="fake-site" style="padding:20px">'+'<h2 style="color:#ff6b35;margin-bottom:10px">Hack Club</h2>'+'<p style="color:#888;font-size:12px;margin-bottom:15px">Build things. Learn by doing.</p>'+'<div style="display:flex;gap:8px;flex-wrap:wrap">'+'<div style="background:#111;padding:15px;border-radius:8px;border:1px solid #2a2a2a;flex:1;min-width:150px"><h3 style="color:#fff;font-size:13px;margin-bottom:5px">Stardance</h3><p style="color:#888;font-size:11px">hackathon event</p></div>'+'<div style="background:#111;padding:15px;border-radius:8px;border:1px solid #2a2a2a;flex:1;min-width:150px"><h3 style="color:#fff;font-size:13px;margin-bottom:5px">OnBoard</h3><p style="color:#888;font-size:11px">learn PCB design</p></div>'+'<div style="background:#111;padding:15px;border-radius:8px;border:1px solid #2a2a2a;flex:1;min-width:150px"><h3 style="color:#fff;font-size:13px;margin-bottom:5px">Scrapyard</h3><p style="color:#888;font-size:11px">creative projects</p></div>'+'</div>'+'</div>'
}

function renderVercelPage(){
internalContent.innerHTML='<div class="fake-site" style="padding:20px">'+'<h2 style="color:#fff;margin-bottom:10px">Vercel</h2>'+'<p style="color:#888;font-size:12px;margin-bottom:15px">projects</p>'+'<div style="display:flex;flex-direction:column;gap:6px">'+'<div style="display:flex;justify-content:space-between;padding:10px;background:#0a0a0a;border:1px solid #222;border-radius:6px"><span style="color:#fff;font-size:12px">time-capsule</span><span style="color:#00c853;font-size:11px">Ready</span></div>'+'<div style="display:flex;justify-content:space-between;padding:10px;background:#0a0a0a;border:1px solid #222;border-radius:6px"><span style="color:#fff;font-size:12px">mo-os</span><span style="color:#00c853;font-size:11px">Ready</span></div>'+'<div style="display:flex;justify-content:space-between;padding:10px;background:#0a0a0a;border:1px solid #222;border-radius:6px"><span style="color:#fff;font-size:12px">portfolio-v2</span><span style="color:#00c853;font-size:11px">Ready</span></div>'+'</div>'+'</div>'
}

function renderNewBrowserPage(tabId){
internalTitle.textContent="New Tab"
internalContent.innerHTML='<div class="fake-browser-home">'+'<div class="fake-browser-logo">TIME CAPSULE</div>'+"<h1>What do you want to explore?</h1>"+'<div class="fake-browser-search">'+'<input type="text" id="browserSearchInput" placeholder="Search the Time Capsule web...">'+'<button id="browserSearchBtn">Search</button>'+"</div>"+'<div class="browser-suggestions">'+'<button data-page="github">GitHub</button>'+'<button data-page="youtube">YouTube</button>'+'<button data-page="hackclub">Hack Club</button>'+'<button data-page="vercel">Vercel</button>'+"</div></div>"
document.querySelectorAll(".browser-suggestions button").forEach(function(btn){btn.addEventListener("click",function(){navigateBrowser(tabId,btn.dataset.page)})})
document.getElementById("browserSearchBtn").addEventListener("click",function(){performFakeSearch(tabId,document.getElementById("browserSearchInput").value)})
document.getElementById("browserSearchInput").addEventListener("keydown",function(e){if(e.key==="Enter")performFakeSearch(tabId,e.target.value)})
}

function navigateBrowser(tabId,pageType){
var page=browserPages[tabId];if(!page)return
page.type=pageType;page.title=pageType.charAt(0).toUpperCase()+pageType.slice(1)
var tab=document.querySelector('[data-tab="'+tabId+'"]')
if(tab)tab.querySelector("span:first-child").textContent=page.title
renderBrowserTabContent(tabId)
}

function performFakeSearch(tabId,query){
query=query.trim();if(!query)return
var page=browserPages[tabId];page.type="search";page.title="Search: "+query
var tab=document.querySelector('[data-tab="'+tabId+'"]')
if(tab)tab.querySelector("span:first-child").textContent=page.title
renderSearchResults(tabId,query)
}

function renderSearchResults(tabId,query){
var safeQuery=escapeHTML(query)
internalContent.innerHTML='<div class="fake-search-page">'+'<div class="fake-search-bar"><input id="browserSearchInput" value="'+safeQuery+'"><button id="browserSearchBtn">Search</button></div>'+'<p class="search-label">Results for <strong>'+safeQuery+"</strong></p>"+'<div class="search-results">'+'<article class="search-result"><small>example.dev</small><h2>'+safeQuery+" &mdash; Developer Guide</h2><p>Learn more about "+safeQuery+" with guides, examples and documentation.</p></article>"+'<article class="search-result"><small>learn.example.com</small><h2>Learn '+safeQuery+"</h2><p>Tutorials and resources for learning about "+safeQuery+".</p></article>"+'<article class="search-result"><small>projects.example.com</small><h2>'+safeQuery+" Projects</h2><p>Explore projects and ideas related to "+safeQuery+".</p></article>"+'<article class="search-result"><small>docs.example.com</small><h2>'+safeQuery+" Documentation</h2><p>Reference material and useful documentation.</p></article>"+"</div></div>"
document.getElementById("browserSearchBtn").addEventListener("click",function(){performFakeSearch(tabId,document.getElementById("browserSearchInput").value)})
document.getElementById("browserSearchInput").addEventListener("keydown",function(e){if(e.key==="Enter")performFakeSearch(tabId,e.target.value)})
}

document.querySelectorAll(".link-card:not(.custom-link)").forEach(function(link){
link.addEventListener("click",function(event){
event.preventDefault()
var name=link.querySelector("strong")
if(!name)return
name=name.textContent.trim().toLowerCase()
if(name==="github")createBrowserTab("github")
else if(name==="youtube")createBrowserTab("youtube")
else if(name==="hack club")createBrowserTab("hackclub")
else if(name==="vercel")createBrowserTab("vercel")
})})
