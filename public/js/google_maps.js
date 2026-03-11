let map, marker, geocoder;
const my_location = document.getElementById("my-location");

geocoder = new google.maps.Geocoder();
// Autocompletado de inputs
function initAutocompleteAddress() {
    let localidadInput = document.getElementById("address");

    // Autocomplete solo para localidades en Barcelona
    let localidadAutocomplete = new google.maps.places.Autocomplete(localidadInput, {
        // types: ["(cities)"], // Solo localidades
        componentRestrictions: { country: "ES" } // Solo España
    });

    localidadAutocomplete.addListener("place_changed", function () {
        let place = localidadAutocomplete.getPlace();
        if (!place.geometry) {
            alert("No se encontró la localidad.");
            return;
        }

        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
        initMap({ lat: lat, lng: lng });
        getAddress(lat, lng); 

    });
}


function initMap(initial_position) {
    
    // Coordenadas iniciales (puedes cambiarlo)
    let initialPosition = initial_position; 

    // Crear el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: initialPosition,
        zoom: 12,
        streetViewControl: false,
        styles: [
            {
                featureType: "poi", // Oculta todos los puntos de interés
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit", // Oculta las estaciones de transporte público
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Crear el marcador movible
    marker = new google.maps.Marker({
        position: initialPosition,
        map: map,
        draggable: true
    });

    // Detectar cuando se mueve el marcador
    google.maps.event.addListener(marker, 'dragend', function () {
        let position = marker.getPosition();
        getAddress(position.lat(), position.lng(), "ui");
    });

    // Obtener dirección inicial
    // getAddress(initialPosition.lat, initialPosition.lng);
}

// mi ubicacion
function getMyLocation() {
    if ("geolocation" in navigator) {
        const content_button = my_location.innerHTML;
        my_location.textContent = "Espere ...";
        my_location.disabled = true;
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                initMap({ lat: lat, lng: lng });
                getAddress(lat, lng, "ui");
                my_location.innerHTML = content_button;
                my_location.disabled = false;
            },
            function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Permiso denegado por el usuario.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Información de ubicación no disponible.");
                        break;
                    case error.TIMEOUT:
                        alert("La solicitud tardó demasiado.");
                        break;
                    default:
                        alert("Error desconocido.");
                }

                my_location.innerHTML = content_button;
                my_location.disabled = false;
            },
            {
                enableHighAccuracy: true, // Usa GPS si está disponible
                timeout: 10000, // Espera hasta 10 segundos antes de fallar
                maximumAge: 0 // No usa ubicaciones almacenadas en caché
            }
        );
    } else {
        alert("Geolocalización no es compatible con tu navegador.");
    }
}
// Función para obtener la dirección a partir de lat y lng
function getAddress(lat, lng, mode = "nui") {
    let latlng = { lat: lat, lng: lng };

    geocoder.geocode({ location: latlng }, function (results, status) {
        if (status === "OK") {
            if (results[0]) {
                let components = results[0].address_components;

                let via = "";
                let numero = "";
                let ciudad = "";
                let comunidad_autonoma = "";
                let provincia = "";
                let distrito = "";
                let codigoPostal = "";
                let pais = "";
                let lat = "";
                let lng = "";

                // Recorrer componentes para encontrar ciudad, provincia y país
                components.forEach(component => {
                    if (component.types.includes("route")) {
                        via = component.long_name; // Nombre de la vía
                    }
                    if (component.types.includes("street_number")) {
                        numero = component.long_name; // Número de la vía
                    }
                    if (component.types.includes("locality")) {
                        ciudad = component.long_name; // Ciudad - municipio en españa
                    }
                    if (component.types.includes("administrative_area_level_1")) {
                        comunidad_autonoma = component.long_name; // Comunidad autonónoma - region o departamento
                    }
                    if (component.types.includes("administrative_area_level_2")) {
                        provincia = component.long_name; // Provincia
                    }
                    if (component.types.includes("administrative_area_level_3") || component.types.includes("sublocality_level_1")) {
                        distrito = component.long_name; // distrito
                    }
                    if (component.types.includes("postal_code")) {
                        codigoPostal = component.long_name; // Código Postal
                    }
                    if (component.types.includes("country")) {
                        pais = component.long_name; // País
                    }
                });
                const lat_val_ = results[0].geometry.location.lat();
                const lng_val_ = results[0].geometry.location.lng();
                // Mostrar en la interfaz

                document.getElementById("route-map").textContent = via;
                document.getElementById("city-map").textContent = ciudad;
                document.getElementById("state-map").textContent = provincia;
                document.getElementById("country-map").textContent = pais;
                if (mode === "ui"){
                    document.getElementById("address").value = via+ ", " + ciudad +", "+ provincia;
                }
                document.getElementById("city").value = ciudad;
                document.getElementById("province").value = provincia;
                document.getElementById("postal_code").value = codigoPostal;
                document.getElementById("country").value = pais;
                document.getElementById("latitude").value = lat_val_;
                document.getElementById("longitude").value = lng_val_;
            }
        } else {
            alert("No se pudo obtener la dirección: " + status);
        }
    });
}



if (my_location){
    my_location.addEventListener("click", ()=>{
        getMyLocation();
    })
}
const coord_init = { lat: 41.3728156, lng: 2.1335788 };
const lat_init = document.getElementById("latitude");
const lng_init = document.getElementById("longitude");
if (lat_init && lng_init && lat_init.value && lng_init.value){
    coord_init.lat = parseFloat(lat_init.value);
    coord_init.lng = parseFloat(lng_init.value);
}
// Inicializar el mapa cuando la página se cargue
window.onload = initMap(coord_init);
window.onload = initAutocompleteAddress();