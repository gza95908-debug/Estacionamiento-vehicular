// Configura estos dos valores con los datos de TU proyecto Supabase.
const SUPABASE_URL = "https://ysecwinprmwygyllmhuk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_IFN8PjcQ9nATaJ1tiYMddA_secwucQR";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const form = document.getElementById("parking-form");
const message = document.getElementById("message");
const tbody = document.getElementById("records");
const filter = document.getElementById("filter");
let currentRecords = [];

function say(text, error = false) {
  message.textContent = text;
  message.style.color = error ? "#b83232" : "#187344";
}
function validCoordinates(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
function clearForm() {
  form.reset();
  document.getElementById("record-id").value = "";
  document.getElementById("form-title").textContent = "Registrar estacionamiento";
  document.getElementById("cancel-edit").hidden = true;
}
async function loadRecords() {
  tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
  let query = client.from("estacionamientos_autos").select("*").order("id", {ascending:true});
  if (filter.value) query = query.eq("cobertura", filter.value);
  const {data, error} = await query;
  if (error) {
    tbody.innerHTML = `<tr><td colspan="5">Error: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }
  currentRecords = data || [];
  renderRecords();
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function renderRecords() {
  if (!currentRecords.length) {
    tbody.innerHTML = '<tr><td colspan="5">No hay estacionamientos registrados.</td></tr>';
    return;
  }
  tbody.innerHTML = currentRecords.map(p => `
    <tr>
      <td>${escapeHtml(p.nombre)}</td><td>${p.cantidad_lugares}</td>
      <td>${escapeHtml(p.predio)}</td><td>${escapeHtml(p.cobertura)}</td>
      <td>
        <button type="button" data-action="map" data-id="${p.id}">Ver mapa</button>
        <button type="button" data-action="edit" data-id="${p.id}">Editar</button>
        <button type="button" class="delete" data-action="delete" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>`).join("");
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const latitud = Number(document.getElementById("latitud").value);
  const longitud = Number(document.getElementById("longitud").value);
  const cantidad_lugares = Number(document.getElementById("cantidad_lugares").value);
  const predio = document.getElementById("predio").value.trim();
  const cobertura = document.getElementById("cobertura").value;
  if (!nombre || !predio || !validCoordinates(latitud, longitud) ||
      !Number.isInteger(cantidad_lugares) || cantidad_lugares < 1 || !cobertura) {
    say("Revisa los campos. Latitud: -90 a 90; longitud: -180 a 180; espacios: entero mayor que 0.", true);
    return;
  }
  const payload = {nombre, latitud, longitud, cantidad_lugares, predio, cobertura};
  const id = document.getElementById("record-id").value;
  const result = id
    ? await client.from("estacionamientos_autos").update(payload).eq("id", id)
    : await client.from("estacionamientos_autos").insert(payload);
  if (result.error) { say("No se pudo guardar: " + result.error.message, true); return; }
  say(id ? "Estacionamiento actualizado." : "Estacionamiento guardado.");
  clearForm();
  await loadRecords();
});
tbody.addEventListener("click", async event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const p = currentRecords.find(item => String(item.id) === button.dataset.id);
  if (!p) return;
  if (button.dataset.action === "map") {
    document.getElementById("map-label").textContent = `${p.nombre} — ${p.latitud}, ${p.longitud}`;
    document.getElementById("map").src = `https://www.google.com/maps?q=${encodeURIComponent(p.latitud + "," + p.longitud)}&output=embed`;
  } else if (button.dataset.action === "edit") {
    document.getElementById("record-id").value = p.id;
    for (const key of ["nombre","latitud","longitud","cantidad_lugares","predio","cobertura"])
      document.getElementById(key).value = p[key];
    document.getElementById("form-title").textContent = "Editar estacionamiento";
    document.getElementById("cancel-edit").hidden = false;
    window.scrollTo({top:0, behavior:"smooth"});
  } else if (button.dataset.action === "delete") {
    if (!confirm(`¿Eliminar ${p.nombre}?`)) return;
    const {error} = await client.from("estacionamientos_autos").delete().eq("id", p.id);
    if (error) say("No se pudo eliminar: " + error.message, true);
    else { say("Estacionamiento eliminado."); await loadRecords(); }
  }
});
document.getElementById("cancel-edit").addEventListener("click", clearForm);
filter.addEventListener("change", loadRecords);

if (SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.startsWith("sb_publishable_")) {
  loadRecords();
} else {
  tbody.innerHTML = '<tr><td colspan="5">Configura la URL y la clave publicable de Supabase en app.js.</td></tr>';
  say("Falta configurar Supabase en app.js.", true);
}
