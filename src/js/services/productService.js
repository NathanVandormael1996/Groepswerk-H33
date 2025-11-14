export async function getLocalProducts() {
    const res = await fetch("../js/data/products.json");
    if (!res.ok) throw new Error("Kan producten niet laden");
    return await res.json();
}
