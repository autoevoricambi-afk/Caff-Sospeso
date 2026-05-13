const whatsappNumber = "393245848866";

const breakfastItems = [
  { id:"cornetto-vuoto", name:"Cornetto vuoto", group:"Paste" },
  { id:"cornetto-crema", name:"Cornetto crema", group:"Paste" },
  { id:"cornetto-nutella", name:"Cornetto Nutella", group:"Paste" },
  { id:"cornetto-bianca", name:"Cornetto Nutella bianca", group:"Paste" },
  { id:"cornetto-pistacchio", name:"Cornetto pistacchio", group:"Paste" },
  { id:"brioche", name:"Brioche", group:"Paste" },
  { id:"polacca", name:"Polacca", group:"Paste" },
  { id:"treccia", name:"Treccia", group:"Paste" },
  { id:"krapfen", name:"Krapfen", group:"Paste" },
  { id:"espresso", name:"Caffè espresso", group:"Caffetteria" },
  { id:"cappuccino", name:"Cappuccino", group:"Caffetteria" },
  { id:"macchiato", name:"Macchiato", group:"Caffetteria" }
];

const productsRoot = document.getElementById("breakfastProducts");
const form = document.getElementById("breakfastForm");
const statusEl = document.getElementById("orderStatus");
const countEl = document.getElementById("selectedCount");
const sendButton = document.getElementById("sendBreakfast");
const minimumAck = document.getElementById("minimumAck");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function renderBreakfastItems(){
  productsRoot.innerHTML = breakfastItems.map(item => `
    <label class="product-option">
      <input type="checkbox" value="${item.name}" data-group="${item.group}">
      <span class="option-mark" aria-hidden="true"></span>
      <span class="option-copy"><strong>${item.name}</strong><span>${item.group}</span></span>
      <span class="option-tag">Aggiungi</span>
    </label>
  `).join("");
}

function selectedItems(){
  return [...productsRoot.querySelectorAll('input[type="checkbox"]:checked')].map(input => ({
    name: input.value,
    group: input.dataset.group
  }));
}

function refreshOrderState(){
  const items = selectedItems();
  countEl.textContent = items.length;
  const ready = items.length > 0 && minimumAck.checked;
  sendButton.disabled = !ready;
  statusEl.textContent = ready
    ? "Richiesta pronta: apriamo WhatsApp con il riepilogo compilato."
    : "Seleziona almeno un prodotto e conferma il minimo d’ordine.";
}

function encodeWhatsApp(message){
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function buildBreakfastMessage(){
  const items = selectedItems();
  const grouped = items.reduce((acc,item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item.name);
    return acc;
  }, {});
  const lines = [];
  Object.entries(grouped).forEach(([group,names]) => {
    lines.push(`${group}:`);
    names.forEach(name => lines.push(`- ${name}`));
  });
  const name = document.getElementById("customerName").value.trim() || "Non indicato";
  const slot = document.getElementById("pickupSlot").value;
  const notes = document.getElementById("customerNotes").value.trim() || "Nessuna nota";
  return [
    "Buongiorno, vorrei prenotare una colazione.",
    "",
    `Nome: ${name}`,
    `Fascia ritiro: ${slot}`,
    "Ordine minimo confermato: €5",
    "",
    ...lines,
    "",
    `Note: ${notes}`,
    "",
    "Potete confermarmi disponibilità e totale?"
  ].join("\n");
}

form.addEventListener("change", refreshOrderState);
form.addEventListener("submit", event => {
  event.preventDefault();
  if(sendButton.disabled) return;
  window.open(encodeWhatsApp(buildBreakfastMessage()), "_blank", "noopener");
});

function wireWhatsappLinks(){
  document.querySelectorAll(".whatsapp-link").forEach(link => {
    const msg = link.dataset.message || "Buongiorno, vorrei maggiori informazioni.";
    link.href = encodeWhatsApp(msg);
    link.target = "_blank";
    link.rel = "noopener";
  });
}

menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

mainNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

renderBreakfastItems();
refreshOrderState();
wireWhatsappLinks();
