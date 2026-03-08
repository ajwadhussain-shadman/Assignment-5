const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
const issueCardSection = document.getElementById("issueCardSection");
const modalTitle = document.getElementById("modalTitle");
const modalLabels = document.getElementById("modalLabels");
const modalDescription = document.getElementById("modalDescription");
const modalAssignee = document.getElementById("modalAssignee");
const modalPriority = document.getElementById("modalPriority");
let issueNumber = document.getElementById("issueNumber");
const issueModal=document.getElementById("issueModal");
const modalOpenBy=document.getElementById("modalOpenBy");
const modalOpenDate=document.getElementById("modalOpenDate");
const loadingSpinner=document.getElementById("loadingSpinner");
const searchBox=document.getElementById("searchBox");
const states = [allBtn, openBtn, closedBtn];
let cState = allBtn;

function currentState(id) {
    cState = id;
    showLoadingSpinner();
    loadIssues();
    allBtn.classList.remove("btn-primary");

    for (const state of states) {
        state.classList.remove("btn-primary");

        if (state === id) {
            state.classList.remove("hover:bg-black", "hover:text-white");
            state.classList.add("btn-primary");
        }
        else {
            state.classList.add("hover:bg-black", "hover:text-white");
        }
    }
}
currentState(allBtn);

async function loadIssues() {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();
     hideLoadingSpinner();
    displayIssues(data.data);
}
function displayIssues(issues) {

    issueCardSection.innerHTML = "";
    issues.forEach(issue => {
        let statusIcon = "";
        let priorityBgColor = "";
        let priorityTextColor = "";
        if (issue.priority === "high") {
            priorityBgColor = "bg-[#FEECEC]";
            priorityTextColor = "text-[#EF4444]";
        }
        else if (issue.priority === "medium") {
            priorityBgColor = "bg-[#FFF6D1]";
            priorityTextColor = "text-[#F59E0B]";
        }
        else {
            priorityBgColor = "bg-[#EEEFF2]";
            priorityTextColor = "text-[#9CA3AF]";
        }

        issue.status === "open" ? statusIcon = "./assets/Open-Status.png" : statusIcon = "./assets/Closed-Status.png";

        if (cState === openBtn) {
            if (issue.status !== "open") {
                return;
            }
        }
        if (cState === closedBtn) {
            if (issue.status !== "closed") {
                return;
            }
        }

        let labelHtml = "";
        issue.labels.forEach(label => {
         labelHtml+=buildLabel(label);
        });
        let issueCard = document.createElement("div");
        issueCard.classList.add("card","hover:cursor-pointer", "w-full", "shadow-md", "bg-[#ffffff]", "rounded-lg", "border-t-4", `${issue.status === "open" ? "border-[#00A96E]" : "border-[#A855F7]"}`);
        issueCard.innerHTML = `
             <div class="uppersection p-6 space-y-3">
                          
                <div class= "card-top flex justify-between">
                    <!-- left icon -->
                    <div class="left-icon">
                        <img src="${statusIcon}"alt="">
                    </div>
                    <!-- priority badge -->
                    <div class="priority-badge ${priorityBgColor} rounded-[100px] w-20 flex justify-center items-center">
                        <p class="${priorityTextColor} text-[12px]">${issue.priority}</p>
                    </div>
                </div>
                
                <div class="card-content">
                    <h2 class="card-title text-[#1F2937] font-semibold text-[14px]">${issue.title}</h2>
                    
                    <p class="card-description text-[#64748B] text-[12px] line-clamp-2 text-justify">${issue.description}</p>
                </div>
              
                <div class="labels flex gap-1">
                    ${labelHtml}
                </div>
                 </div>
                
                <div class="border-t p-4 text-[#64748B] border-[#E4E4E7]">
                    <p>#${issue.id} by ${issue.author}</p>
                    <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
        
        `
        issueCardSection.appendChild(issueCard);
        
        issueCard.addEventListener("click",()=>{
            showIssueModal(issue.id);
        })
    })
    issueNumber.innerText = issueCardSection.children.length;
}

async function showIssueModal(id) {
    showLoadingSpinner();
    const res=await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data=await res.json();
    // console.log(data);
    const issue=data.data;
    hideLoadingSpinner();
    modalTitle.innerText=issue.title;
    modalDescription.innerText=issue.description;
    modalAssignee.innerText=(issue.assignee!=="") ?issue.assignee:"not found";
    modalPriority.innerText=issue.priority;
    modalOpenBy.innerText=issue.author;
    modalOpenDate.innerText=new Date(issue.createdAt).toLocaleDateString();
    
    modalLabels.innerHTML="";
    
    if (issue.priority === "medium") {
            modalPriority.classList.remove("bg-[#EF4444]","bg-[#9CA3AF]")
            modalPriority.classList.add("bg-[#D97706]");
        }
        else if(issue.priority==="high"){
              modalPriority.classList.remove("bg-[#9CA3AF]","bg-[#D97706]")
            modalPriority.classList.add("bg-[#EF4444]");
        }
        else if(issue.priority==="low"){
             modalPriority.classList.remove("bg-[#EF4444]","bg-[#D97706]")
            modalPriority.classList.add("bg-[#9CA3AF]");
        }

        let labelHtml = "";
        issue.labels.forEach(label => {
         labelHtml+=buildLabel(label);
        });
        modalLabels.innerHTML+=labelHtml;

    issueModal.showModal();
}
function buildLabel(label){
    if (label === "bug") {
                return `
              <div
                        class="label-1 flex  items-center bg-[#FEECEC] border border-[#FECACA] rounded-[100px] w-14 justify-center gap-0.5">
                        <img src="./assets/BugDroid.png" alt="" class="">
                        <p class="text-[#EF4444] text-[12px] font-medium">Bug</p>
                    </div>
             `
            }
            else if (label === "help wanted") {
                return `   <div
                        class="label-2 flex  items-center bg-[#FFF8DB] border border-[#FDE68A] rounded-[100px] w-28 justify-center gap-0.5">
                        <img src="./assets/Lifebuoy.png" alt="" class="">
                        <p class="text-[#D97706] text-[12px] font-medium">HELP WANTED</p>
                    </div>`
            }
            else if (label === "enhancement") {
                return`<div
                        class="label-3 flex  items-center bg-[#DEFCE8] border border-[#BBF7D0] rounded-[100px] w-28 justify-center gap-0.5">
                        <img src="./assets/Sparkle.png" alt="" class="">
                        <p class="text-[#00A96E] text-[12px] font-medium">Enhancement</p>
                    </div>`
            }
            else if (label === "good first issue") {
                return `<div
                        class="label-3 bg-[#DEFCE8] border border-[#BBF7D0] rounded-[100px] w-32  gap-0.5">
                        
                        <p class="text-[#00A96E] text-[12px] font-medium flex gap-2 items-center justify-center"><i class="fa-solid fa-triangle-exclamation"></i>good first issue</p>
                    </div>`
            }
            else if (label === "documentation") {
                return  `<div
                        class="label-3 bg-[#DEFCE8] border border-[#BBF7D0] rounded-[100px] w-32  gap-0.5">
                        
                        <p class="text-[#00A96E] text-[12px] font-medium flex gap-2 items-center justify-center"><i class="fa-regular fa-file-lines"></i>documentation</p>
                    </div>`
            }
}


searchBox.addEventListener("keyup",(event)=>{
    const searchedText=event.target.value.trim();
    (searchedText!=="") ?searchIssue(searchedText): loadIssues();
    
   
})

async function searchIssue(text){
        showLoadingSpinner();
     const res=await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
     const data=await res.json();
    //  console.log(data.data);
    hideLoadingSpinner();
   
    displayIssues(data.data);
    
}


function showLoadingSpinner(){
    loadingSpinner.classList.remove("hidden");
    issueCardSection.classList.add("hidden");
}
function hideLoadingSpinner(){
    issueCardSection.classList.remove("hidden");
    loadingSpinner.classList.add("hidden");
}

loadIssues();