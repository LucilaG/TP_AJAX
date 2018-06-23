document.addEventListener("DOMContentLoaded", function () {
  "use stric";
  let url = "http://web-unicen.herokuapp.com/api/groups/gaudio/conjuntoPrecio";
  let inicio = document.querySelector(".inicio");
  let productos = document.querySelector(".productos");
  let listaDePrecios = document.querySelector(".listaDePrecios");
  let contacto = document.querySelector(".contacto");
  let container = document.querySelector(".contenido")
  

  function load(urlInterna) {
   
    fetch(urlInterna).then(function (response) {
      if (response.ok) {
        response.text().then(t => container.innerHTML = t);
      } else {
        container.innerHTML = "Esta mal la URL!";
      }
    })
      .catch(function (e) {
        console.log(e)
        container.innerHTML = "No nos pudimos descargar!";
      })
  }

  function escucharBotones() {
    
    let urlInterna = "precios.html";
    fetch(urlInterna).then(
      function(response) {
        response.text().then(t => container.innerHTML);
        loadTabla(container);
      }).catch(error => console.log(error))
      setTimeout(botonesEstables,1)
  }

  function botonesEstables(){

    let cargar = container.querySelector("button.cargar");
    cargar.addEventListener('click', c => create(1));
    
    let search = container.querySelector("button.search");
    search.addEventListener('click', c => buscar());
    
    let cargarTresVeces = container.querySelector("button.cargarTresVeces");
    cargarTresVeces.addEventListener('click', c => create(3));

  }

  function loadTabla() {
    fetch(url).then(r => r.json())
      .then(function (json) {
        eliminarNodos();
        console.log(json);
        setTimeout(function(){
          mostrar(json)},1); 
      })
      .catch(error => console.log(error));
     
  }

  function mostrar(json, inputSearch) {
    if (inputSearch === undefined) {
      for (var i = 0; i < json.conjuntoPrecio.length; i++) {
        let producto = json.conjuntoPrecio[i].thing.producto;
        let descripcion = json.conjuntoPrecio[i].thing.descripcion;
        let precio = json.conjuntoPrecio[i].thing.precio;
        crearTabla(producto, descripcion, precio);
      }
    } else {
      for (var i = 0; i < json.conjuntoPrecio.length; i++) {
        let producto = json.conjuntoPrecio[i].thing.producto;
        let descripcion = json.conjuntoPrecio[i].thing.descripcion;
        let precio = json.conjuntoPrecio[i].thing.precio;
        if (producto === inputSearch) {
          crearTabla(producto, descripcion, precio);
        }
      }
    }
    setTimeout(function(){
      lisenButtons();
    },1)
  }

  function lisenButtons() {
    let eliminar = container.querySelectorAll("button.btnEliminar");
    let editar = container.querySelectorAll("button.btnEditar");
    for (let i = 0; i < eliminar.length; i++) {
      eliminar[i] = eliminar[i].addEventListener('click', c => buscarJsonEliminar(i));
      editar[i] = editar[i].addEventListener('click', c => buscarJsonEditar(i));
    }
  }

  function buscar(r) {
    let resultSearch = container.querySelector("input.inputSearch").value;
    fetch(url).then(r => r.json())
      .then(function (json) {
        eliminarNodos();
        mostrar(json, resultSearch);
      })
      .catch(error => console.log(error))
  }

  function crearTabla(producto, descripcion, precio) {
    let contenedorTabla = container.querySelector("tbody.contenedorTabla");
    let tr = document.createElement('tr');
    if (precio < 200) {
      tr.classList.add("oferta");
    }
    llenarTabla(producto, tr);
    llenarTabla(descripcion, tr);
    llenarTabla(precio, tr);
    createButtons(tr, "btnEliminar");
    createButtons(tr, "btnEditar");
    contenedorTabla.appendChild(tr);
  }

  function createButtons(tr, bnt) {
    btn = document.createElement('button');
    btn.classList.add("btn");
    btn.classList.add(bnt);
    btn.classList.add("btn-outline-secondary");
    tr.appendChild(btn);
  }



  function llenarTabla(txtT, tr) {
    let td = document.createElement('td');
    let txt = document.createTextNode(txtT);
    td.appendChild(txt);
    tr.appendChild(td);
  }

 

  function create(quantity) {
    let producto = container.querySelector("input.producto").value;
    let descripcion = container.querySelector("input.descripcion").value;
    let precio = container.querySelector("input.precio").value;
    if (!everythingIsAlrigth(producto, descripcion, precio)) {
      createFetch(producto, descripcion, precio,quantity);
    }
    setTimeout(c => loadTabla(), 1000);
  }



  function everythingIsAlrigth(producto, descripcion, precio) {
    
    let cambio = false;
    if (producto === "") {
      let txt = "* Debe ingresar nombre del producto.";
      createElementObservacion(txt);
      cambio = true;
    }
    if (descripcion === "") {
      let txt = "* Debe ingresar la descripcion del producto.";
      createElementObservacion(txt);
      cambio = true;
    }
    if (precio === "") {
      let txt = "* Debe ingresar el precio del producto.";
      createElementObservacion(txt);
      cambio = true;
    }
    return (cambio);
  }

  function createElementObservacion(txt) {
    let containerObservaciones = container.querySelector("div.observaciones");
    let observacion = document.createTextNode(txt);
    let espacio = document.createElement("br");
    containerObservaciones.appendChild(observacion);
    containerObservaciones.appendChild(espacio);
  }


  function createFetch(producto, descripcion, precio,quantity) {
    let conjuntoPrecio = {
      "producto": producto,
      "descripcion": descripcion,
      "precio": precio
    }
    let objeto = {
      "thing": conjuntoPrecio
    }
    for (let i = 0; i < quantity; i++) {
      fetch(url, {
        "method": 'POST',
        "headers": {
          'Content-Type': 'application/json'
        },
        "body": JSON.stringify(objeto)
      })
        .catch(function (e) {
          console.log(e)
        }) 
    } 
  }

  function buscarJsonEliminar(iID) {
    fetch(url).then(r => r.json())
      .then(function (json) {
        eliminar(json, iID);
      })
      .catch(error => console.log(error))
      setTimeout(c => loadTabla(), 1000);
  }

  function buscarJsonEditar(iID) {
    fetch(url).then(r => r.json())
      .then(function (json) {
        habilitarEdicion(json, iID);
      })
      .catch(error => console.log(error))
      
  }

  function eliminar(json, iID) {  
    let id = json.conjuntoPrecio[iID]._id;
    fetch(url + "/" + id, {
      "method": 'Delete',
      "headers": {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .catch(function (e) {
        console.log(e)
      }) 
  }

  function habilitarEdicion(json, iID) {
    
    let txt = "* Edite los campos deseados";
    let producto = json.conjuntoPrecio[iID].thing.producto;
    let descripcion = json.conjuntoPrecio[iID].thing.descripcion;
    let precio = json.conjuntoPrecio[iID].thing.precio;
    createElementObservacion(txt);
    container.querySelector("input.producto").value = producto;
    container.querySelector("input.descripcion").value = descripcion;
    container.querySelector("input.precio").value = precio;
    container.querySelector("button.edit").classList.remove("d-none");
    container.querySelector("button.cargar").classList.add("d-none");
    container.querySelector("button.cargarTresVeces").classList.add("d-none");
    container.querySelector("button.edit").addEventListener('click', c => edit(json, iID, producto, descripcion, precio, container));
  }

  function edit(json, iID, producto, descripcion, precio) {
    if (!everythingIsAlrigth(producto, descripcion, precio)) {
      let producto = container.querySelector("input.producto").value;
      let descripcion = container.querySelector("input.descripcion").value;
      let precio = container.querySelector("input.precio").value;
      let id = json.conjuntoPrecio[iID]._id;
      let conjuntoPrecio = {
        "producto": producto,
        "descripcion": descripcion,
        "precio": precio
      }

      let objeto = {
        "thing": conjuntoPrecio
      }

      fetch(url + "/" + id, {
        "method": 'PUT',
        "headers": {
          'Content-Type': 'application/json'
        },
        "body": JSON.stringify(objeto)
      }).then(response => response.json())
        .catch(function (e) {
          console.log(e)
        })
      container.querySelector("button.cargar").classList.remove("d-none");
      container.querySelector("button.edit").classList.add("d-none");
      container.querySelector("button.cargarTresVeces").classList.remove("d-none");
      
      setTimeout(c => loadTabla(), 1000);
    }
  }

  function eliminarNodos() {
    container.querySelector("div.observaciones").innerHTML = "";
    let div = container.querySelector(".contenedorTabla");
    if (div !== null) {
      while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
      }
    };
    console.log();
    container.querySelector("input.producto").value = "";
    container.querySelector("input.descripcion").value = "";
    container.querySelector("input.precio").value = "";
  }

  inicio.addEventListener('click', c => load("home.html"));
  productos.addEventListener('click', c => load("productos.html"));
  contacto.addEventListener('click', c => load("contacto.html"));
  listaDePrecios.addEventListener('click', c => load("precios.html"));
  listaDePrecios.addEventListener('click', c => escucharBotones());
  load("home.html");
})
