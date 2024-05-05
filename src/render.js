const scores = document.querySelectorAll(".score");
const inspiration = document.querySelector("#inspired");
const radios = document.querySelectorAll('input[type="radio"]')
const level = document.querySelector('#level');
const prof = document.querySelector("#prof-bonus");
const save = document.querySelector("#save");
const load = document.querySelector("#load");
const clear = document.querySelector("#clear");
let elements = {
	inputs: {},
	radios: {}
};

window.addEventListener("load", (event) => {
    console.log(scores);
    console.log(inspiration);
	console.log(radios);
    console.log(level);
});

scores.forEach((el) => {
    el.addEventListener('change', (field) => {
        const modifier = field.target.parentNode.children[1];
        const score = field.target.value;
        modifier.value = Math.floor((score - 10) /2);
        const modList = Array.from(document.querySelectorAll(`.${modifier.classList[1]}`)).slice(1);
        for(let i of modList){
            if(typeof parseInt(i.value) !== 'number'){
                i.value = modifier.value;
            }
            else{
                i.value = +i.value + parseInt(modifier.value);
            }
        }
    })
})

for(let radio of radios){
	radio.setAttribute("data-precheck", "false");
	radio.addEventListener('click', (state) => {
        const stat = state.target.parentNode.children[1];
		if(state.target.dataset.precheck == "true"){
			state.target.checked = false;
			state.target.dataset.precheck = false;
            stat.value -= +prof.value;
			return;
		}
		state.target.dataset.precheck="true";
		state.target.checked = true;
        stat.value = +stat.value + +prof.value;
	});
}

level.addEventListener('change', (value) =>{
    prof.value = 1 + Math.ceil((value.target.value/4));
})

save.addEventListener('click', (data) => {
    const docInputs = document.querySelectorAll("input[type='text'], textarea");
    const radioInputs = document.querySelectorAll("input[type='radio']");
    docInputs.forEach((element) => {
        elements['inputs'][element.id] = element.value;
    })
    radioInputs.forEach((element) => {
        elements['radios'][element.id] = element.checked;
    })
    window.electronAPI.sendSheet(elements);
})

/*system.addEventListener('input', (event) => {
    window.electronAPI.getChange(`./systems/${event.target.value}/${event.target.value}.html`); 
})*/

load.addEventListener('click', async () => {
    const data = await window.electronAPI.openSheet();
	for(let i in data['inputs']){
		document.querySelector(`#${i}`).value = data['inputs'][i];
	}
	for(let i in data['radios']){
		console.log(document.querySelector(`#${i}`).checked = data['radios'][i]);
	}
})

clear.addEventListener('click', (data) => {
	const docInputs = document.querySelectorAll("input[type='text'], textarea");
	const radioInputs = document.querySelectorAll("input[type='radio']");
	docInputs.forEach((element) => {
		element.value = "";
	})
	radioInputs.forEach((element) => {
		element.checked = false;
		element.dataset.precheck = "false";
	})
})



