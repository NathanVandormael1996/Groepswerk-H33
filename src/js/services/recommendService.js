// Voor demo: gebruik TVMaze zoek
export async function getRecommendations() {
    const res = await fetch("https://api.tvmaze.com/search/shows?q=tech");
    if (!res.ok) throw new Error("Aanraders laden mislukt");
    return await res.json();
}