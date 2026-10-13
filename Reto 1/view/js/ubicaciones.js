const btn_planta1 = document.getElementById('btn_planta1');
const btn_planta2 = document.getElementById('btn_planta2');
const img_planta1 = document.getElementById('img_planta1');
const img_planta2 = document.getElementById('img_planta2');

/* ---------------------------------------------- [Mostrar Planta 1]*/
btn_planta1.addEventListener('click', function() {
    img_planta1.classList.remove('oculto');
    img_planta2.classList.add('oculto');
});

/* ---------------------------------------------- [Mostrar Planta 2]*/
btn_planta2.addEventListener('click', function() {
    img_planta1.classList.add('oculto');
    img_planta2.classList.remove('oculto');
});