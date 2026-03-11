const main_loader_page = document.getElementById('loader-page-change');
if (main_loader_page){
    document.querySelectorAll('form').forEach(link => {
        link.addEventListener('submit', function(event) {
            main_loader_page.style.display = 'flex';
        });
    });
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(event) {
            const href = link.getAttribute('href');

            if (!href || 
                href.startsWith('tel:') ||
                href.startsWith('mailto:') ||
                href.startsWith('#') ||
                href.startsWith('javascript:') ||
                href.startsWith('https://wa.me') ||
                link.classList.contains("__no-loader")
                ) {
                return  
            }else{
                main_loader_page.style.display = 'flex';
            }
        });
    });
    window.addEventListener('popstate', function(event) {
        main_loader_page.style.display = 'none';
    });
    window.addEventListener('load', function() {
        main_loader_page.style.display = 'none';
    });
    window.addEventListener('pageshow', function(event) {
        main_loader_page.style.display = 'none';
    });
        

}
window.addEventListener("DOMContentLoaded", ()=>{
    main_loader_page.style.display = "none";
})

const details_userfree = localStorage.getItem("userfree");
if (details_userfree){
    document.querySelector(".a-loggin-redirect").style.display = "none";
    const data = JSON.parse(details_userfree);
    const ctn_profile = document.querySelector(".container-profile-userfree-app");

    ctn_profile.classList.add("container-profile-userfree-app-active");
    const img_tag = document.createElement("img");
    img_tag.src = data.user.picture;
    img_tag.alt = "profile user";
    ctn_profile.insertAdjacentElement("beforeend", img_tag);   
}