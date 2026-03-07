const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
function currentState(id) {
    allBtn.classList.remove("btn-primary");
    const states = [allBtn, openBtn, closedBtn];

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
