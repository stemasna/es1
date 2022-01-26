let dati = [];

function fetchDati(){
    fetch('http://localhost:3000/ordini/   ')
    .then(res=>res.json())
    .then(json=>{
        dati = json;
        CaricaDati();
    })
    .catch(err=>console.error(err));
}
fetchDati();

const container = document.querySelector("tbody");

let idModifica = null;

function appendColumn(container, data){
    const td = document.createElement("td");
    td.innerHTML = data;
    container.appendChild(td);
}

function CaricaDati(){
    
    while(container.firstChild) container.removeChild(container.firstChild);

    for(var k=0; k<dati.length; ++k){
        
        const tr = document.createElement("tr");
        for(var prop in dati[k]){
            let item = dati[k][prop];
            if(prop === 'idUtente'){
                appendColumn(tr, (item));
                //console.log(item.password)
                //appendColumn(tr, (item.password));
            }
        }


        const azioni = document.createElement("td");
        azioni.classList.add("btn-group")
        
        const modifica = document.createElement("button");
        modifica.innerHTML="MODIFICA";
        modifica.classList.add("btn","btn-info");
        modifica.addEventListener('click', OnModifica);

        const elimina = document.createElement("button");
        elimina.innerHTML="ELIMINA";
        elimina.classList.add("btn","btn-danger");
        elimina.addEventListener('click', OnElimina);
        
        azioni.appendChild(modifica);
        azioni.appendChild(elimina);

        tr.appendChild(azioni);

        container.appendChild(tr);
    }
}

function OnNuovo(){
    
    document.querySelector("#modal-nuovo").style.display = "flex";
    document.querySelector(".overlay").style.display = "block"; 
}
function OnModifica(event){
    const row = event.target.parentNode.parentNode;
    
    const id = row.querySelector("td").innerHTML;
    idModifica = id;
    const persona = dati.find(x => x.idUtente == id);
    if(persona==null) return;

    const modal = document.querySelector("#modal-modifica");
    modal.querySelector("[name='idUtente']").value = persona.idUtente;
     modal.querySelector("[name='tipo']").value = persona.tipo;
     modal.querySelector("[name='nome']").value = persona.nome;
     modal.querySelector("[name='cognome']").value = persona.cognome;
     modal.querySelector("[name='cell']").value = persona.cell;
     modal.querySelector("[name='via']").value = persona.via;
    modal.querySelector("[name='paese']").value = persona.paese;
    modal.querySelector("[name='orario']").value = persona.orario;

    modal.style.display = "flex"; // mostra modale
    document.querySelector(".overlay").style.display = "block"; // mostra overlay
}
function OnElimina(event){
    const row = event.target.parentNode.parentNode;
    const id = row.querySelector("td").innerHTML;
    
    container.removeChild(row);
    
    dati = dati.filter(x => x.idUtente != id);

    fetch('http://localhost:3000/ordini/deleteordini/   '+id, {
        method: 'DELETE'
    })
}

function Annulla(){
    document.querySelectorAll(".modal, .overlay")
    .forEach(modal => modal.style.display = "none");
}
function ChiediChiudiOverlay(){
    if(confirm("Vuoi annullare le modifiche?"))
        Annulla()
}

function OnSalva(){
    const modal = document.querySelector("#modal-modifica");
    const persona = {
        idUtente: idModifica,
        idUtente: modal.querySelector("[name='idUtente']").value,
        tipo: modal.querySelector("[name='tipo']").value = persona.tipo,
        nome: modal.querySelector("[name='nome']").value = persona.nome,
        cognome:   modal.querySelector("[name='cognome']").value = persona.cognome,
        cell:    modal.querySelector("[name='cell']").value = persona.cell,
        via:    modal.querySelector("[name='via']").value = persona.via,
        paese :   modal.querySelector("[name='paese']").value = persona.paese,
        orario   :  modal.querySelector("[name='orario']").value = persona.orario,
    };
    dati = dati.map(
        x => x.idUtente == idModifica ? persona : x
    );

    fetch('http://localhost:3000/ordini/updateordine'+idModifica, {
        method: 'PUT',
        body: ObjectToURL(persona),
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    CaricaDati();
    idModifica = null;

    Annulla();
}
function OnSalvaNuovo(){
    const modal = document.querySelector("#modal-nuovo");
    const persona = {
        idUtente: modal.querySelector("[name='idUtente']").value,
    };
    dati.push(persona);

    fetch('http://localhost:3000/ordini/addordine', {
        method: 'POST',
        body: ObjectToURL(persona),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    .then(async res=>{
        if(res.status == 200)
            return res.text()
        else{
            error = await res.text()
            throw Error(error);
        }
    })
    .catch(err=>console.error(err));

    CaricaDati();
    Annulla();
}

function ObjectToURL(object){
    let parts = [];
    for(var part in object){
        parts.push(part+'='+object[part]);
    }
    return parts.join('&');
}