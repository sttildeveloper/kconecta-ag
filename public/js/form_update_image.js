const form = document.getElementById('container-images');
const inputImagen = document.getElementById('more_images');

const btnAgregar = document.getElementById('btnAgregarImagen');
const preview = document.getElementById('preview');

let cont_img = 1;
inputImagen.addEventListener('change', () => {
    const file = inputImagen.files[0];
    
    if (file) {
        mostrarPreview(file, "ref-img-" + cont_img);
        
        // Crear un nuevo input file "clonado" solo con esa imagen
        const nuevoInput = document.createElement('input');
        nuevoInput.type = 'file';
        nuevoInput.name = 'more_images[]';
        nuevoInput.style.display = 'none';
        nuevoInput.classList.add("ref-img-" + cont_img);

        // Crear un DataTransfer para meter el archivo dentro del nuevo input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        nuevoInput.files = dataTransfer.files;

        // Agregar el input al formulario
        form.appendChild(nuevoInput);

        // Resetear input original
        inputImagen.value = '';
        cont_img += 1;
    }
});

function mostrarPreview(file, class_block) {
    const div_main = document.createElement("div");
    div_main.classList.add("container-main-view-block-image");
    const div_ctn_img = document.createElement("div");
    div_ctn_img.classList.add("container-image-view-more-image");
    const div_btn_del = document.createElement("div");
    div_btn_del.classList.add("container-button-actions");
    const btn_delete = document.createElement("div");
    btn_delete.classList.add("button");
    btn_delete.classList.add("btn-delete-more-image-front")
    btn_delete.type = "button";
    btn_delete.textContent = "Eliminar";
    btn_delete.dataset.classinput = class_block;

    div_main.appendChild(div_ctn_img);
    div_btn_del.appendChild(btn_delete);
    div_main.appendChild(div_btn_del);

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;

        div_ctn_img.appendChild(img);
        div_main.appendChild(div_ctn_img);
        div_btn_del.appendChild(btn_delete);
        div_main.appendChild(div_btn_del);
        
        form.insertAdjacentElement("beforeend", div_main);
    };
    reader.readAsDataURL(file);
}

const btns_delete_img = document.querySelectorAll(".btn-delete-more-image");
btns_delete_img.forEach((btn) => {
    btn.addEventListener("click", async () => {
        const confirmDelete = confirm("Eliminar esta imagen?");
        if (!confirmDelete) {
            return;
        }

        const originalLabel = btn.textContent;
        btn.textContent = "Eliminando...";
        btn.disabled = true;
        await fetch("/api/delete_more_image?id=" + btn.dataset.id)
            .then((res) => res.json())
            .then((data) => {
                if (data.status != 200) {
                    alert("Permiso denegado");
                    btn.textContent = originalLabel;
                    btn.disabled = false;
                } else {
                    btn.parentElement.parentElement.remove();
                }
            })
            .catch(() => {
                alert("Error al eliminar la imagen.");
                btn.textContent = originalLabel;
                btn.disabled = false;
            });
    });
});
document.addEventListener("click", (event)=>{
    console.log(event.target.classList.contains("btn-delete-more-image-front"));
    if (event.target.classList.contains("btn-delete-more-image-front")){
        const confirmDelete = confirm("Eliminar esta imagen?");
        if (!confirmDelete) {
            return;
        }
        document.querySelectorAll("."+event.target.dataset.classinput).forEach(d=>{
            d.remove();
        })
        event.target.parentElement.parentElement.remove();
    }
})
