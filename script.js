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
el.innerHTML='<input type="checkbox" class="task-checkbox" '+(task.completed?"checked":")+">"+"<span>"+escapeHTML(task.text)+"</span>"+'<button class="delete-task">&times;</button>'
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
internalContent.innerHTML='<div class="fake-site">'+'<div class="gh-header">'+'<div class="gh-logo"><svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></div>'+'<div class="gh-search"><span style="color:#8b949e">&#8981;</span><input type="text" placeholder="Type / to search"></div>'+'<div class="gh-nav"><span>Pull requests</span><span>Issues</span><span>Marketplace</span><span>Explore</span></div>'+'<div class="gh-avatar-nav">MB</div>'+"</div>"+'<div class="gh-body">'+'<div class="gh-sidebar">'+'<div class="gh-avatar-large">MB</div>'+'<div class="gh-name">muhammad-bin-junaid</div>'+'<div class="gh-username">muhammad-bin-junaid</div>'+'<div class="gh-bio">Developer &bull; Student &bull; Maker<br>Building things that matter.</div>'+'<div class="gh-stats"><span>12 followers</span><span>5 following</span></div>'+"</div>"+'<div class="gh-main">'+'<div class="gh-tabs"><div class="gh-tab">Overview</div><div class="gh-tab active">Repositories</div><div class="gh-tab">Projects</div><div class="gh-tab">Packages</div><div class="gh-tab">Stars</div></div>'+'<div class="gh-repo-list">'+'<div class="gh-repo-item"><div class="gh-repo-item-top"><span class="gh-repo-name">mo-os</span><span class="gh-repo-badge">Public</span></div><div class="gh-repo-desc">A browser-based operating system built with HTML, CSS and JavaScript.</div><div class="gh-repo-meta"><span><span class="gh-lang-dot" style="background:#f1e05a"></span>JavaScript</span><span>&#9733; 24</span><span>forks 3</span><span>Updated 2 days ago</span></div></div>'+'<div class="gh-repo-item"><div class="gh-repo-item-top"><span class="gh-repo-name">time-capsule</span><span class="gh-repo-badge">Public</span></div><div class="gh-repo-desc">A personal new-tab workspace with clock, tasks, and time capsules.</div><div class="gh-repo-meta"><span><span class="gh-lang-dot" style="background:#e34c26"></span>HTML</span><span>&#9733; 18</span><span>forks 2</span><span>Updated 5 hours ago</span></div></div>'+'<div class="gh-repo-item"><div class="gh-repo-item-top"><span class="gh-repo-name">portfolio-v2</span><span class="gh-repo-badge">Public</span></div><div class="gh-repo-desc">Personal portfolio website with blog and project showcase.</div><div class="gh-repo-meta"><span><span class="gh-lang-dot" style="background:#563d7c"></span>CSS</span><span>&#9733; 8</span><span>forks 1</span><span>Updated 1 week ago</span></div></div>'+"</div></div></div></div></div>"
}

function renderYouTubePage(){
internalContent.innerHTML='<div class="fake-site">'+'<div class="yt-header">'+'<div class="yt-logo"><div class="yt-logo-icon">&#9654;</div>YouTube</div>'+'<div class="yt-search-bar"><input type="text" placeholder="Search"><button>&#128269;</button></div>'+'<div class="yt-icons"><div class="yt-icon-circle">+</div><div class="yt-icon-circle">&#128276;</div><div style="width:28px;height:28px;border-radius:50%;background:#7c3aed;display:grid;place-items:center;font-size:10px;color:#fff;">MB</div></div>'+"</div>"+'<div class="yt-body">'+'<div class="yt-sidebar">'+'<div class="yt-sidebar-item active"><span class="yt-sidebar-icon">&#127968;</span>Home</div>'+'<div class="yt-sidebar-item"><span class="yt-sidebar-icon">&#128293;</span>Trending</div>'+'<div class="yt-sidebar-item"><span class="yt-sidebar-icon">&#128250;</span>Subscriptions</div>'+'<div class="yt-sidebar-item"><span class="yt-sidebar-icon">&#128218;</span>Library</div>'+'<div class="yt-sidebar-item"><span class="yt-sidebar-icon">&#128336;</span>History</div>'+"</div>"+'<div class="yt-main">'+'<div class="yt-chips"><button class="yt-chip active">All</button><button class="yt-chip">Music</button><button class="yt-chip">Gaming</button><button class="yt-chip">Live</button><button class="yt-chip">Coding</button><button class="yt-chip">News</button><button class="yt-chip">Podcasts</button></div>'+'<div class="yt-grid">'+'<div class="yt-card"><div class="yt-thumb"><div class="yt-thumb-inner" style="background:linear-gradient(135deg,#1a1a2e,#16213e);">&#128187;</div><span class="yt-duration">12:34</span></div><div class="yt-card-info"><div class="yt-channel-avatar" style="background:#e74c3c;">TC</div><div class="yt-card-text"><div class="yt-card-title">Build a Website From Scratch &mdash; Full Tutorial</div><div class="yt-card-meta">TechWithTim &bull; 142K views &bull; 3 days ago</div></div></div></div>'+'<div class="yt-card"><div class="yt-thumb"><div class="yt-thumb-inner" style="background:linear-gradient(135deg,#0f3443,#34e89e);">&#9889;</div><span class="yt-duration">8:21</span></div><div class="yt-card-info"><div class="yt-channel-avatar" style="background:#3498db;">FZ</div><div class="yt-card-text"><div class="yt-card-title">JavaScript Projects for Beginners</div><div class="yt-card-meta">Fireship &bull; 89K views &bull; 1 week ago</div></div></div></div>'+'<div class="yt-card"><div class="yt-thumb"><div class="yt-thumb-inner" style="background:linear-gradient(135deg,#2d1b69,#e94560);">&#127891;</div><span class="yt-duration">24:10</span></div><div class="yt-card-info"><div class="yt-channel-avatar" style="background:#2ecc71;">WD</div><div class="yt-card-text"><div class="yt-card-title">Learn Web Development in 2024 &mdash; Roadmap</div><div class="yt-card-meta">Web Dev Simplified &bull; 210K views &bull; 2 weeks ago</div></div></div></div>'+'<div class="yt-card"><div class="yt-thumb"><div class="yt-thumb-inner" style="background:linear-gradient(135deg,#1b0a3a,#5b2c6f);">&#128640;</div><span class="yt-duration">15:47</span></div><div class="yt-card-info"><div class="yt-channel-avatar" style="background:#e67e22;">BC</div><div class="yt-card-text"><div class="yt-card-title">Building Something Real &mdash; Dev Vlog</div><div class="yt-card-meta">Beyond Code &bull; 56K views &bull; 4 days ago</div></div></div></div>'+"</div></div></div></div>"
}

function renderHackClubPage(){
internalContent.innerHTML='<div class="fake-site">'+'<div class="hc-header"><div class="hc-logo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Hack Club</div><div class="hc-nav"><span>Projects</span><span>Community</span><span>Events</span><span>Blog</span><span>Stardance</span></div></div>'+'<div class="hc-hero"><div class="hc-hero-badge">&#9889; HACK CLUB</div><h1>Build things.<br>Learn by doing.</h1><p>A global community of high school students making, learning, and coding together. Ship your project and join thousands of builders worldwide.</p><div class="hc-cta">Start Building &rarr;</div></div>'+'<div class="hc-projects"><h2>Featured Projects</h2><div class="hc-project-grid">'+'<div class="hc-project-card"><h3>Stardance</h3><p>A hackathon platform and event series bringing together student developers from around the world.</p><div class="hc-project-tags"><span class="hc-tag">Event</span><span class="hc-tag">Community</span></div></div>'+'<div class="hc-project-card"><h3>OnBoard</h3><p>Learn PCB design and hardware hacking. Build your first circuit board with guided tutorials.</p><div class="hc-project-tags"><span class="hc-tag">Hardware</span><span class="hc-tag">Tutorial</span></div></div>'+'<div class="hc-project-card"><h3>Scrapyard</h3><p>A hackathon celebrating creative software projects. Build something weird, wonderful, or both.</p><div class="hc-project-tags"><span class="hc-tag">Hackathon</span><span class="hc-tag">Open</span></div></div>'+"</div></div>"+'<div class="hc-community"><h2>Community Stats</h2><div class="hc-stat-row"><div class="hc-stat"><div class="hc-stat-num">50K+</div><div class="hc-stat-label">Active members</div></div><div class="hc-stat"><div class="hc-stat-num">120+</div><div class="hc-stat-label">Countries</div></div><div class="hc-stat"><div class="hc-stat-num">8K+</div><div class="hc-stat-label">Projects shipped</div></div></div></div>'+"</div>"
}

function renderVercelPage(){
internalContent.innerHTML='<div class="fake-site">'+'<div class="vc-header"><div class="vc-logo"><svg width="18" height="18" viewBox="0 0 76 65" fill="currentColor" style="vertical-align:middle;margin-right:6px;"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>Vercel</div><div class="vc-nav"><span>Home</span><span>Previews</span><span>Analytics</span><span>Speed Insights</span><span>Storage</span></div><div class="vc-avatar">MB</div></div>'+'<div class="vc-body">'+'<div class="vc-sidebar">'+'<div class="vc-sidebar-section"><div class="vc-sidebar-label">Workspace</div><div class="vc-sidebar-item active"><span class="vc-sidebar-icon">&#128193;</span>Projects</div><div class="vc-sidebar-item"><span class="vc-sidebar-icon">&#127760;</span>Domains</div><div class="vc-sidebar-item"><span class="vc-sidebar-icon">&#128273;</span>Environment Variables</div><div class="vc-sidebar-item"><span class="vc-sidebar-icon">&#128202;</span>Usage</div></div>'+'<div class="vc-sidebar-section"><div class="vc-sidebar-label">Recent</div><div class="vc-sidebar-item"><span class="vc-sidebar-icon">&#9650;</span>time-capsule</div><div class="vc-sidebar-item"><span class="vc-sidebar-icon">&#9650;</span>mo-os</div></div>'+"</div>"+'<div class="vc-main"><div class="vc-top-bar"><h1>Projects</h1><button class="vc-btn-new"><span>+</span> New Project</button></div>'+'<div class="vc-project-list">'+'<div class="vc-project-row"><div class="vc-project-name"><div class="vc-project-icon">&#9650;</div>time-capsule</div><div class="vc-status"><span class="vc-status-dot green"></span>Ready</div><div class="vc-project-domain">time-capsule.vercel.app</div><div class="vc-project-time">2h ago</div></div>'+'<div class="vc-project-row"><div class="vc-project-name"><div class="vc-project-icon">&#9650;</div>mo-os</div><div class="vc-status"><span class="vc-status-dot green"></span>Ready</div><div class="vc-project-domain">mo-os.vercel.app</div><div class="vc-project-time">1d ago</div></div>'+'<div class="vc-project-row"><div class="vc-project-name"><div class="vc-project-icon">&#9650;</div>portfolio-v2</div><div class="vc-status"><span class="vc-status-dot green"></span>Ready</div><div class="vc-project-domain">portfolio-v2.vercel.app</div><div class="vc-project-time">3d ago</div></div>'+'<div class="vc-project-row"><div class="vc-project-name"><div class="vc-project-icon">&#9650;</div>blog</div><div class="vc-status"><span class="vc-status-dot green"></span>Ready</div><div class="vc-project-domain">blog.vercel.app</div><div class="vc-project-time">5d ago</div></div>'+"</div>"+'<div class="vc-deployments"><h2>Recent Deployments</h2>'+'<div class="vc-deploy-row"><div class="vc-deploy-project">time-capsule</div><div class="vc-deploy-status"><span class="vc-status-dot green"></span>Success</div><div class="vc-deploy-time">2 hours ago</div></div>'+'<div class="vc-deploy-row"><div class="vc-deploy-project">mo-os</div><div class="vc-deploy-status"><span class="vc-status-dot green"></span>Success</div><div class="vc-deploy-time">1 day ago</div></div>'+'<div class="vc-deploy-row"><div class="vc-deploy-project">portfolio-v2</div><div class="vc-deploy-status"><span class="vc-status-dot green"></span>Success</div><div class="vc-deploy-time">3 days ago</div></div>'+"</div></div></div></div></div>"
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
