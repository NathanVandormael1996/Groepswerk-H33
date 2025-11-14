import "../scss/styles.scss";

import * as bootstrap from "bootstrap";

import {productCard} from "./components/productCard.js";
import {skeletonCard} from "./components/skeletonCard.js";
import {getLocalProducts} from "./services/productService.js";
import {getRecommendations} from "./services/recommendService.js";
import {saveCart, loadCart} from "./utils/storage.js";

let cart = loadCart();
let totalPrice = Number(localStorage.getItem("totalPrice"));
const swtch = document.getElementById("switch");
const label = document.getElementById("label_switch");
const savedTheme = localStorage.getItem("mode");
function updateCartBadge() {
    document.getElementById("cart_badge").textContent = cart.length;
}

function updatePrice() {
    document.getElementById("price").textContent = `Total Price: €${totalPrice.toFixed(2)}`;
}

async function loadProducts() {
    const cont = document.getElementById("product_list");
    cont.innerHTML = skeletonCard().repeat(4);
    try {
        const data = await getLocalProducts();
        cont.innerHTML = data.map(productCard).
        join("");
    } catch {
        cont.innerHTML = `<div class="alert alert-danger">❌ Producten konden niet geladen worden</div>`;
    }
}

async function loadRecommendations() {
    const cont = document.getElementById("rec_list");
    cont.innerHTML = skeletonCard().repeat(3);
    try {
        const rec = await getRecommendations();
        cont.innerHTML = rec.slice(0, 3)
            .map(r => productCard({name: r.show.name, price: 0}, 0))
            .join("");
    } catch {
        cont.innerHTML = `<div class="alert alert-warning">⚠️ Aanraders niet beschikbaar</div>`;
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    updateCartBadge();
    updatePrice();
    await loadProducts();
    await loadRecommendations();

    document.body.addEventListener("click", e => {
        if (e.target.classList.contains("add_cart_btn")) {
            const idx = e.target.dataset.idx;
            cart.push(idx);
            saveCart(cart);
            updateCartBadge();
            totalPrice += Number(e.target.dataset.price);
            localStorage.setItem("totalPrice", totalPrice);
            updatePrice();
        }
    });

    const clearBtn = document.getElementById("clear_btn");
    clearBtn.addEventListener("click", () => {
        cart = [];
        saveCart(cart);
        updateCartBadge();
        totalPrice = 0;
        localStorage.setItem("totalPrice", totalPrice);
        updatePrice();
    });

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        label.innerText = "Dark Mode 🌙";
    }
    function swapper() {
        const isDark = document.body.classList.toggle("dark-mode");
        if (isDark) {
            label.innerText = "Dark Mode 🌙";
            localStorage.setItem("mode", "dark");
        } else {
            label.innerText = "Light Mode ☀️";
            localStorage.setItem("mode", "light");
        }
    }

    swtch.addEventListener("click", swapper);
});




