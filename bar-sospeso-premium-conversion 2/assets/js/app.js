const whatsappNumber = "393245848866";

const products = [
  { id:"cornetto-vuoto", category:"colazioni", icon:"🥐", title:"Cornetto vuoto", description:"Cornetteria da colazione prenotabile per il ritiro mattutino.", meta:["Colazione", "Ritiro 07:00–10:00"], price:"Prezzo su conferma" },
  { id:"cornetto-crema", category:"colazioni", icon:"🥐", title:"Cornetto crema", description:"Una delle scelte più richieste per la colazione.", meta:["Colazione", "Farcito"], price:"Prezzo su conferma" },
  { id:"cornetto-nutella", category:"colazioni", icon:"🍫", title:"Cornetto Nutella", description:"Da inserire nella prenotazione mattutina o in ordini multipli.", meta:["Colazione", "Farcito"], price:"Prezzo su conferma" },
  { id:"cornetto-bianca", category:"colazioni", icon:"🤍", title:"Cornetto Nutella bianca", description:"Alternativa golosa da ordinare insieme alla colazione.", meta:["Colazione", "Farcito"], price:"Prezzo su conferma" },
  { id:"cornetto-pistacchio", category:"colazioni", icon:"💚", title:"Cornetto pistacchio", description:"Opzione premium per una colazione più ricca.", meta:["Colazione", "Farcito"], price:"Prezzo su conferma" },
  { id:"brioche", category:"colazioni", icon:"🍞", title:"Brioche", description:"Prodotto da banco per comporre il proprio ordine mattutino.", meta:["Colazione", "Paste"], price:"Prezzo su conferma" },
  { id:"polacca", category:"colazioni", icon:"✨", title:"Polacca", description:"Da selezionare nel carrello per prenotazioni personalizzate.", meta:["Colazione", "Paste"], price:"Prezzo su conferma" },
  { id:"treccia", category:"colazioni", icon:"🌾", title:"Treccia", description:"Paste da colazione con ordinazione rapida su WhatsApp.", meta:["Colazione", "Paste"], price:"Prezzo su conferma" },
  { id:"krapfen", category:"colazioni", icon:"🍩", title:"Krapfen", description:"Una proposta iconica da prenotare senza attesa.", meta:["Colazione", "Paste"], price:"Prezzo su conferma" },
  { id:"cappuccino", category:"colazioni", icon:"☕", title:"Cappuccino", description:"Aggiungilo alla richiesta colazione e indica la fascia di ritiro.", meta:["Caffetteria", "Colazione"], price:"Prezzo su conferma" },
  { id:"torta-ricorrenza", category:"pasticceria", icon:"🎂", title:"Torta da ricorrenza", description:"Richiesta personalizzata per compleanni e occasioni speciali.", meta:["Pasticceria", "Su ordinazione"], price:"Preventivo rapido" },
  { id:"monoporzioni", category:"pasticceria", icon:"🍰", title:"Monoporzioni", description:"Dolci da banco o da asporto da richiedere secondo disponibilità.", meta:["Pasticceria", "Vetrina"], price:"Disponibilità da confermare" },
  { id:"dolci-vassoio", category:"pasticceria", icon:"🧁", title:"Vassoio dolci", description:"Soluzione comoda per ospiti, ricorrenze e piccoli eventi.", meta:["Pasticceria", "Ordine dedicato"], price:"Preventivo rapido" },
  { id:"vaschetta-05", category:"gelateria", icon:"🍨", title:"Vaschetta gelato 0,5 kg", description:"Formato compatto da personalizzare con i gusti desiderati.", meta:["Gelateria", "0,5 kg"], price:"Prezzo su conferma" },
  { id:"vaschetta-1", category:"gelateria", icon:"🍦", title:"Vaschetta gelato 1 kg", description:"Formato famiglia ideale per condivisione e dopocena.", meta:["Gelateria", "1 kg"], price:"Prezzo su conferma" },
  { id:"vaschetta-15", category:"gelateria", icon:"🍧", title:"Vaschetta gelato 1,5 kg", description:"Formato festa per più persone, con gusti da indicare nelle note.", meta:["Gelateria", "1,5 kg"], price:"Prezzo su conferma" },
  { id:"focaccine", category:"stuzzicheria", icon:"🥯", title:"Focaccine", description:"Stuzzicheria per eventi, uffici e buffet misti.", meta:["Stuzzicheria", "€0,90 al pezzo"], price:"€0,90 / pz" },
  { id:"panzerottini", category:"stuzzicheria", icon:"🥟", title:"Panzerottini", description:"Formato piccolo da prenotare in quantità.", meta:["Stuzzicheria", "€0,90 al pezzo"], price:"€0,90 / pz" },
  { id:"crocche", category:"stuzzicheria", icon:"🥔", title:"Crocchè", description:"Perfetti per vassoi assortiti e richieste salate.", meta:["Stuzzicheria", "€0,90 al pezzo"], price:"€0,90 / pz" },
  { id:"pizzette", category:"stuzzicheria", icon:"🍕", title:"Pizzette mignon", description:"Un classico da inserire in buffet, feste e ordinazioni multiple.", meta:["Stuzzicheria", "€0,90 al pezzo"], price:"€0,90 / pz" }
];

const state = {
  filter:"all",
  search:"",
  cart:new Map()
};

const productGrid = document.getElementById("productGrid");
const filterGroup = document.getElementById("filterGroup");
const productSearch = document.getElementById("productSearch");
const cartButton = document.getElementById("cartButton");
const floatingCart = document.getElementById("floatingCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartCount = document.getElementById("cartCount");
const floatingCartCount = document.getElementById("floatingCartCount");
const cartNotices = document.getElementById("cartNotices");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutButton = document.getElementById("checkoutButton");
const breakfastMinimumWrap = document.getElementById("breakfastMinimumWrap");
const breakfastMinimum = document.getElementById("breakfastMinimum");
const toast = document.getElementById("toast");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function encodeWhatsApp(message){
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function productMatches(product){
  const byFilter = state.filter === "all" || product.category === state.filter;
  const query = state.search.trim().toLowerCase();
  const bySearch = !query || `${product.title} ${product.description} ${product.meta.join(" ")}`.toLowerCase().includes(query);
  return byFilter && bySearch;
}

function renderProducts(){
  const visible = products.filter(productMatches);
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-top">
        <span class="product-pill">${labelForCategory(product.category)}</span>
        <span class="product-mark" aria-hidden="true">${product.icon}</span>
      </div>
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <div class="price-tag">${product.price}</div>
      <div class="product-meta">${product.meta.map(item => `<span>${item}</span>`).join("")}</div>
      <div class="product-actions">
        <button class="add-btn" data-add="${product.id}" type="button">Aggiungi</button>
        <button class="quick-btn" data-quick="${product.id}" type="button">Prenota subito</button>
      </div>
    </article>
  `).join("");
  if(!visible.length){
    productGrid.innerHTML = `<div class="product-card"><h3>Nessun risultato</h3><p>Prova un’altra ricerca o torna alla vista completa.</p></div>`;
  }
}

function labelForCategory(category){
  return ({
    colazioni:"Colazioni",
    pasticceria:"Pasticceria",
    gelateria:"Gelateria",
    stuzzicheria:"Stuzzicheria"
  })[category] || "Prodotto";
}

function cartQuantity(){
  return [...state.cart.values()].reduce((sum,item)=>sum+item.qty,0);
}

function updateCartCounts(){
  const qty = cartQuantity();
  cartCount.textContent = qty;
  floatingCartCount.textContent = qty;
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(()=>toast.classList.remove("show"),2200);
}

function addToCart(id, openAfter=false){
  const product = products.find(item=>item.id===id);
  if(!product) return;
  const existing = state.cart.get(id);
  state.cart.set(id,{...product,qty:(existing?.qty || 0)+1});
  updateCartCounts();
  renderCart();
  showToast(`${product.title} aggiunto al carrello.`);
  if(openAfter) openCart();
}

function changeQty(id, delta){
  const item = state.cart.get(id);
  if(!item) return;
  const next = item.qty + delta;
  if(next <= 0) state.cart.delete(id);
  else state.cart.set(id,{...item,qty:next});
  updateCartCounts();
  renderCart();
}

function removeItem(id){
  state.cart.delete(id);
  updateCartCounts();
  renderCart();
}

function hasBreakfastItems(){
  return [...state.cart.values()].some(item=>item.category === "colazioni");
}

function renderCart(){
  const items = [...state.cart.values()];
  cartItems.innerHTML = items.map(item=>`
    <article class="cart-item">
      <div>
        <strong>${item.title}</strong>
        <span>${labelForCategory(item.category)} · ${item.price}</span>
        <button class="remove-item" type="button" data-remove="${item.id}">Rimuovi</button>
      </div>
      <div class="qty-actions">
        <button type="button" data-minus="${item.id}">−</button>
        <em>${item.qty}</em>
        <button type="button" data-plus="${item.id}">+</button>
      </div>
    </article>
  `).join("");
  cartEmpty.classList.toggle("hidden", items.length > 0);

  const breakfast = hasBreakfastItems();
  breakfastMinimumWrap.style.display = breakfast ? "flex" : "none";
  if(!breakfast) breakfastMinimum.checked = false;

  const notices = [];
  if(breakfast) notices.push("Le colazioni si prenotano nella fascia 07:00–10:00 e richiedono un ordine minimo di €5.");
  if(items.some(item=>item.category === "stuzzicheria")) notices.push("La stuzzicheria è indicata a €0,90 al pezzo; inserisci quantità precise nelle note.");
  if(items.some(item=>item.category === "gelateria")) notices.push("Per il gelato indica i gusti desiderati nelle note o usa il modulo dedicato.");
  cartNotices.innerHTML = notices.map(text=>`<div class="notice">${text}</div>`).join("");
  updateCheckoutState();
}

function updateCheckoutState(){
  const empty = state.cart.size === 0;
  const breakfast = hasBreakfastItems();
  checkoutButton.disabled = empty || (breakfast && !breakfastMinimum.checked);
  checkoutButton.style.opacity = checkoutButton.disabled ? ".58" : "1";
  checkoutButton.style.cursor = checkoutButton.disabled ? "not-allowed" : "pointer";
}

function openCart(){
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden","false");
  document.body.classList.add("cart-open");
}

function closeCart(){
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden","true");
  document.body.classList.remove("cart-open");
}

function buildCartMessage(){
  const items = [...state.cart.values()];
  const lines = items.map(item=>`- ${item.qty} x ${item.title} (${labelForCategory(item.category)})`);
  const name = document.getElementById("checkoutName").value.trim() || "Non indicato";
  const date = document.getElementById("checkoutDate").value || "Da concordare";
  const slot = document.getElementById("checkoutSlot").value;
  const notes = document.getElementById("checkoutNotes").value.trim() || "Nessuna nota";
  return [
    "Buongiorno, vorrei inviare questa richiesta dal sito di Caffè Sospeso.",
    "",
    `Nome: ${name}`,
    `Data ritiro: ${date}`,
    `Fascia oraria: ${slot}`,
    hasBreakfastItems() ? "Ordine colazione minimo €5: confermato" : "",
    "",
    "Prodotti richiesti:",
    ...lines,
    "",
    `Note: ${notes}`,
    "",
    "Potete confermarmi disponibilità, totale e ritiro?"
  ].filter(Boolean).join("\n");
}

function wireWhatsappLinks(){
  document.querySelectorAll(".whatsapp-link").forEach(link=>{
    const msg = link.dataset.message || "Buongiorno, vorrei maggiori informazioni.";
    link.href = encodeWhatsApp(msg);
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function sendDedicatedMessage(message){
  window.open(encodeWhatsApp(message),"_blank","noopener");
}

filterGroup.addEventListener("click",event=>{
  const button = event.target.closest(".filter-btn");
  if(!button) return;
  state.filter = button.dataset.filter;
  filterGroup.querySelectorAll(".filter-btn").forEach(btn=>btn.classList.toggle("active",btn===button));
  renderProducts();
});

productSearch.addEventListener("input",event=>{
  state.search = event.target.value;
  renderProducts();
});

productGrid.addEventListener("click",event=>{
  const add = event.target.closest("[data-add]");
  const quick = event.target.closest("[data-quick]");
  if(add) addToCart(add.dataset.add,false);
  if(quick) addToCart(quick.dataset.quick,true);
});

cartItems.addEventListener("click",event=>{
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");
  if(plus) changeQty(plus.dataset.plus,1);
  if(minus) changeQty(minus.dataset.minus,-1);
  if(remove) removeItem(remove.dataset.remove);
});

cartButton.addEventListener("click",openCart);
floatingCart.addEventListener("click",openCart);
cartOverlay.addEventListener("click",closeCart);
cartClose.addEventListener("click",closeCart);
breakfastMinimum.addEventListener("change",updateCheckoutState);

checkoutForm.addEventListener("submit",event=>{
  event.preventDefault();
  updateCheckoutState();
  if(checkoutButton.disabled) return;
  sendDedicatedMessage(buildCartMessage());
});

document.getElementById("cakeForm").addEventListener("submit",event=>{
  event.preventDefault();
  const occasion = document.getElementById("cakeOccasion").value.trim() || "Da definire";
  const date = document.getElementById("cakeDate").value || "Da concordare";
  const people = document.getElementById("cakePeople").value || "Da definire";
  const notes = document.getElementById("cakeNotes").value.trim() || "Nessuna nota";
  sendDedicatedMessage([
    "Buongiorno, vorrei richiedere una torta o un dolce su ordinazione.",
    "",
    `Occasione: ${occasion}`,
    `Data ritiro: ${date}`,
    `Numero persone: ${people}`,
    `Preferenze: ${notes}`,
    "",
    "Potete indicarmi disponibilità e proposta?"
  ].join("\n"));
});

document.getElementById("gelatoForm").addEventListener("submit",event=>{
  event.preventDefault();
  const size = document.getElementById("gelatoSize").value;
  const flavours = document.getElementById("gelatoFlavours").value.trim() || "Da confermare";
  const date = document.getElementById("gelatoDate").value || "Da concordare";
  const notes = document.getElementById("gelatoNotes").value.trim() || "Nessuna nota";
  sendDedicatedMessage([
    "Buongiorno, vorrei ordinare una vaschetta gelato.",
    "",
    `Formato: ${size}`,
    `Gusti richiesti: ${flavours}`,
    `Data ritiro: ${date}`,
    `Note: ${notes}`,
    "",
    "Potete confermarmi disponibilità e totale?"
  ].join("\n"));
});

document.getElementById("snackForm").addEventListener("submit",event=>{
  event.preventDefault();
  const qty = document.getElementById("snackQty").value || "Da definire";
  const types = document.getElementById("snackTypes").value.trim() || "Assortimento da consigliare";
  const date = document.getElementById("snackDate").value || "Da concordare";
  const notes = document.getElementById("snackNotes").value.trim() || "Nessuna nota";
  sendDedicatedMessage([
    "Buongiorno, vorrei richiedere stuzzicheria / buffet.",
    "",
    `Quantità indicativa: ${qty}`,
    `Tipologie desiderate: ${types}`,
    `Data ritiro: ${date}`,
    `Note: ${notes}`,
    "",
    "Potete confermarmi disponibilità e totale?"
  ].join("\n"));
});

menuToggle.addEventListener("click",()=>{
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",String(open));
});
mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded","false");
}));

document.addEventListener("keydown",event=>{
  if(event.key === "Escape") closeCart();
});

renderProducts();
renderCart();
updateCartCounts();
wireWhatsappLinks();
