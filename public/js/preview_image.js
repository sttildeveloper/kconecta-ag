const preview_image = (input_image, element_image) => {
    const tag_input_image = document.getElementById(input_image);
    const image_preview = document.getElementById(element_image);
    const file = new FileReader();
    tag_input_image.addEventListener("change", () =>{
        if (tag_input_image.files[0]){
            file.onload = function(e){
                image_preview.src = e.target.result;
            };
            file.readAsDataURL(tag_input_image.files[0]);
        }
    })
}


const preview_image_auto = (input_image, ctn_images) => {
    const tag_input_image = document.getElementById(input_image);
    const image_container = document.getElementById(ctn_images);
    tag_input_image.addEventListener("change", () => {
        image_container.innerHTML = "";
        Array.from(tag_input_image.files).forEach(file => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                const img_element = document.createElement("img");
                img_element.src = e.target.result;
                image_container.appendChild(img_element);
            };
            fileReader.readAsDataURL(file);
        });
    });
};
const preview_video = (id_input_file, id_container) =>{
    const input_video = document.getElementById(id_input_file);
    const videoPreview = document.getElementById(id_container);
    input_video.addEventListener("change", (event)=>{
        const file = event.target.files[0]; // Obtener el archivo seleccionado
        if (file) {
            const videoURL = URL.createObjectURL(file); // Crear URL del video
            
            videoPreview.src = videoURL;
            videoPreview.style.display = "block"; // Mostrar el video
        }
    })
}