const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
const issueCardSection = document.getElementById("issueCardSection");
let issueNumber = document.getElementById("issueNumber");
const states = [allBtn, openBtn, closedBtn];
let cState = allBtn;
function currentState(id) {
    cState = id;
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
    displayIssues(data.data);
}
function displayIssues(issues) {

    issueCardSection.innerHTML = "";
    issues.forEach(issue => {
        let statusIcon = "";
            
        issue.status === "open" ?statusIcon = "./assets/Open-Status.png" : statusIcon ="./assets/Closed-Status.png";
        
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
            if (label === "bug") {
                labelHtml += `
              <div
                        class="label-1 flex  items-center bg-[#FEECEC] border border-[#FECACA] rounded-[100px] w-14 justify-center gap-0.5">
                        <img src="./assets/BugDroid.png" alt="" class="">
                        <p class="text-[#EF4444] text-[12px] font-medium">Bug</p>
                    </div>
             `
            }
            else if (label === "help wanted") {
                labelHtml += `   <div
                        class="label-2 flex  items-center bg-[#FFF8DB] border border-[#FDE68A] rounded-[100px] w-28 justify-center gap-0.5">
                        <img src="./assets/Lifebuoy.png" alt="" class="">
                        <p class="text-[#D97706] text-[12px] font-medium">HELP WANTED</p>
                    </div>`
            }
            else if (label === "enhancement") {
                labelHtml += `<div
                        class="label-3 flex  items-center bg-[#DEFCE8] border border-[#BBF7D0] rounded-[100px] w-28 justify-center gap-0.5">
                        <img src="./assets/Sparkle.png" alt="" class="">
                        <p class="text-[#00A96E] text-[12px] font-medium">Enhancement</p>
                    </div>`
            }
            else if(label==="good first issue"){
                labelHtml += `<div
                        class="label-3 flex  items-center bg-[#DEFCE8] border border-[#BBF7D0] rounded-[100px] w-32 justify-center gap-0.5">
                        <img src="./assets/Sparkle.png" alt="" class="">
                        <p class="text-[#00A96E] text-[12px] font-medium">good first issue</p>
                    </div>`
            }
             else if(label==="documentation"){
                labelHtml += `<div
                        class="label-3 flex  items-center bg-[#DEFCE8] border border-[#BBF7D0] rounded-[100px] w-28 justify-center gap-0.5">
                        <img src="./assets/Sparkle.png" alt="" class="">
                        <p class="text-[#00A96E] text-[12px] font-medium">documentation</p>
                    </div>`
            }

        });

        let issueCard = document.createElement("div");
        issueCard.classList.add("card", "w-[256px]", "shadow-md", "bg-[#ffffff]", "rounded-lg", "border-t-4", `${issue.status === "open" ? "border-[#00A96E]" : "border-[#A855F7]"}`);
        issueCard.innerHTML = `
             <div class="uppersection p-6 space-y-3">
                          
                <div class="card-top flex justify-between">
                    <!-- left icon -->
                    <div class="left-icon">
                        <img src=${statusIcon} alt="">
                    </div>
                    <!-- priority badge -->
                    <div class="priority-badge bg-[#FEECEC] rounded-[100px] w-20 flex justify-center items-center">
                        <p class="text-[#EF4444] text-[12px]">${issue.priority}</p>
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
        issueNumber.innerText = issueCardSection.children.length;
    })
}
loadIssues();