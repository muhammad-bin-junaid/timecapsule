var clock=document.getElementById("clock"),dateEl=document.getElementById("date"),searchForm=document.getElementById("searchForm"),searchInput=document.getElementById("searchInput"),taskInput=document.getElementById("taskInput"),addTaskBtn=document.getElementById("addTaskBtn"),taskList=document.getElementById("taskList"),taskCount=document.getElementById("taskCount"),capsuleList=document.getElementById("capsuleList"),newCapsuleBtn=document.getElementById("newCapsuleBtn"),capsuleModal=document.getElementById("capsuleModal"),closeCapsuleModal=document.getElementById("closeCapsuleModal"),messageInput=document.getElementById("messageInput"),unlockDate=document.getElementById("unlockDate"),sealBtn=document.getElementById("sealBtn"),messageModal=document.getElementById("messageModal"),closeMessageModal=document.getElementById("closeMessageModal"),unlockedMessage=document.getElementById("unlockedMessage"),deleteCapsuleBtn=document.getElementById("deleteCapsuleBtn"),settingsBtn=document.getElementById("settingsBtn"),settingsPanel=document.getElementById("settingsPanel"),closeSettingsBtn=document.getElementById("closeSettingsBtn"),themeSelect=document.getElementById("themeSelect"),addLinkBtn=document.getElementById("addLinkBtn"),linkModal=document.getElementById("linkModal"),closeLinkModal=document.getElementById("closeLinkModal"),linkName=document.getElementById("linkName"),linkUrl=document.getElementById("linkUrl"),saveLinkBtn=document.getElementById("saveLinkBtn"),quickLinks=document.getElementById("quickLinks"),browserTabs=document.getElementById("browserTabs"),newTabBtn=document.getElementById("newTabBtn"),homeBtn=document.getElementById("homeBtn"),homePage=document.getElementById("homePage"),internalPage=document.getElementById("internalPage"),backHomeBtn=document.getElementById("backHomeBtn"),internalTitle=document.getElementById("internalTitle"),internalContent=document.getElementById("internalContent")

var currentCapsuleId=null
function escapeHTML(str){var div=document.createElement("div");div.textContent=str;return div.innerHTML}

function updateClock(){var now=new Date();clock.textContent=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:false});dateEl.textContent=now.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}
updateClock()
setInterval(updateClock,1000)

searchForm.addEventListener("submit",function(event){event.preventDefault();var q=searchInput.value.trim();if(!q)return;createBrowserTab("search",q);searchInput.value=""})

var tasks=JSON.parse(localStorage.getItem("capsuleTasks"))||[]
function saveTasks(){localStorage.setItem("capsuleTasks",JSON.stringify(tasks))}
function renderTasks(){
taskList.innerHTML=""
var completed=tasks.filter(function(t){return t.completed}).length
taskCount.textContent=completed+" / "+tasks.length
if(tasks.length===0){var empty=document.createElement("p");empty.textContent="No tasks yet.";empty.style.color="#888";empty.style.fontSize="11px";empty.style.padding="10px 0";taskList.appendChild(empty);return}
tasks.forEach(function(task){
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
if(capsules.length===0){var empty=document.createElement("p");empty.textContent="No capsules yet.";empty.style.color="#888";empty.style.fontSize="11px";capsuleList.appendChild(empty);return}
capsules.forEach(function(capsule){
var card=document.createElement("div");card.className="capsule-card"
var unlocked=Date.now()>=capsule.unlockTime
var unlockDateText=new Date(capsule.unlockTime).toLocaleString([],{dateStyle:"medium",timeStyle:"short"})
card.innerHTML="<strong>"+(unlocked?"Unlocked capsule":"Sealed capsule")+"</strong>"+"<p>"+(unlocked?escapeHTML(capsule.message):"Your message is still waiting.")+"</p>"+'<span class="capsule-status">'+(unlocked?"READY TO OPEN":"UNLOCKS "+unlockDateText.toUpperCase())+"</span>"
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
function applyTheme(theme){if(theme==="light"){document.body.classList.add("light")}else{document.body.classList.remove("light")}localStorage.setItem("capsuleTheme",theme)}
themeSelect.addEventListener("change",function(){applyTheme(themeSelect.value)})
var savedTheme=localStorage.getItem("capsuleTheme")||"dark";themeSelect.value=savedTheme;applyTheme(savedTheme)

var customLinks=JSON.parse(localStorage.getItem("customLinks"))||[]
function saveCustomLinks(){localStorage.setItem("customLinks",JSON.stringify(customLinks))}
function renderCustomLinks(){
document.querySelectorAll(".custom-link").forEach(function(l){l.remove()})
customLinks.forEach(function(link){
var el=document.createElement("a");el.className="link-card custom-link";el.href=link.url;el.target="_self"
el.innerHTML='<div class="link-icon">'+escapeHTML(link.name.substring(0,2).toUpperCase())+"</div>"+"<strong>"+escapeHTML(link.name)+"</strong>"
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

function createBrowserTab(type,query){
if(!type)type="new"
var tabId="tab-"+Date.now()
var title=type==="search"?"Search: "+query:"New Tab"
browserPages[tabId]={type:type,title:title,query:query||""}
var tab=document.createElement("button");tab.className="browser-tab";tab.dataset.tab=tabId
tab.innerHTML="<span>"+title+"</span>"+'<span class="close-tab">&times;</span>'
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
if(page.type==="search"&&page.query){renderGoogleSearch(page.query)}
else{renderNewBrowserPage(tabId)}
}

function renderNewBrowserPage(tabId){
internalContent.innerHTML='<div class="fake-browser-home">'+'<div class="fake-browser-logo">TIME CAPSULE</div>'+"<h1>Search the web</h1>"+'<div class="fake-browser-search">'+'<input type="text" id="browserSearchInput" placeholder="Search...">'+'<button id="browserSearchBtn">Search</button>'+"</div></div>"
document.getElementById("browserSearchBtn").addEventListener("click",function(){var q=document.getElementById("browserSearchInput").value.trim();if(q)performSearch(tabId,q)})
document.getElementById("browserSearchInput").addEventListener("keydown",function(e){if(e.key==="Enter"){var q=e.target.value.trim();if(q)performSearch(tabId,q)}})
}

function performSearch(tabId,query){
var page=browserPages[tabId];page.type="search";page.title="Search: "+query;page.query=query
var tab=document.querySelector('[data-tab="'+tabId+'"]')
if(tab)tab.querySelector("span:first-child").textContent=page.title
renderGoogleSearch(query)
}

function renderGoogleSearch(query){
internalContent.innerHTML='<iframe src="https://www.google.com/search?igu=1&q='+encodeURIComponent(query)+'" style="width:100%;height:500px;border:0"></iframe>'
}

document.querySelectorAll(".link-card:not(.custom-link)").forEach(function(link){
link.addEventListener("click",function(event){
event.preventDefault()
var name=link.querySelector("strong")
if(!name)return
createBrowserTab("search",name.textContent.trim())
})})