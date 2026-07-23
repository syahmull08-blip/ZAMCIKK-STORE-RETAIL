const WA_NUMBER = "6289528598985"; // GANTI DENGAN NOMOR WA KAMU

let allProducts = [];
let currentType = "all";

async function loadProducts() {

    document.getElementById("loading").style.display = "block";

    try {

        const res = await fetch("/api/products");
        const json = await res.json();

        allProducts = json.data
            .filter(item =>
                ["xla","xda","xlf"].includes((item.type || "").toLowerCase())
            )
            .sort((a,b)=>(a.price+1000)-(b.price+1000));

        renderProducts();

        document.getElementById("lastUpdate").innerText =
            new Date().toLocaleTimeString("id-ID");

    } catch(err){

        console.log(err);

    }

    document.getElementById("loading").style.display = "none";

}

function renderProducts(){

    const container=document.getElementById("produk");

    const keyword=document
        .getElementById("search")
        .value
        .toLowerCase();

    container.innerHTML="";

    const products=allProducts.filter(item=>{

        const cocokKategori=
            currentType==="all" ||
            item.type.toLowerCase()===currentType;

        const cocokCari=
            item.name.toLowerCase().includes(keyword) ||
            item.code.toLowerCase().includes(keyword);

        return cocokKategori && cocokCari;

    });

    document.getElementById("totalProduk").innerText=products.length;

    document.getElementById("produkReady").innerText=
        products.filter(x=>x.stock>0).length;

    products.forEach(item=>{

        const harga = item.price + 5000;

        const area={};

        (item.description || "").split("\n").forEach(line=>{

            const m=line.match(/AREA\s*(\d)\s*[:=]\s*(.+)/i);

            if(m){

                area[m[1]]=m[2];

            }

        });

        container.innerHTML+=`

<div class="card">

<div class="card-header">

<h2>${item.name.replace(/\(.*?\)/g,"")}</h2>

<div class="kode">${item.code}</div>

<div class="badge ${item.stock>0?"ready":"habis"}">

${item.stock>0?"🟢 Tersedia : "+item.stock:"🔴 Habis"}

</div>

</div>

<div class="card-body">

<div class="area">
<span>Area 1</span>
<b>${area[1]||"-"}</b>
</div>

<div class="area">
<span>Area 2</span>
<b>${area[2]||"-"}</b>
</div>

<div class="area">
<span>Area 3</span>
<b>${area[3]||"-"}</b>
</div>

<div class="area">
<span>Area 4</span>
<b>${area[4]||"-"}</b>
</div>

<div class="harga">

Rp ${harga.toLocaleString("id-ID")}

</div>

${
item.stock > 0 ?

`<button class="order-btn"
onclick="order('${item.code}','${item.name}',${harga})">
📱 Pesan via WhatsApp
</button>`

:

`<button class="order-btn"
disabled
style="
background:#bdbdbd;
cursor:not-allowed;
opacity:.7;
">
❌ Stok Habis
</button>`
}

</button>

</div>

</div>

`;

    });

}

function order(code, nama, harga){

    const nomor = prompt(
`Order ${nama} (${code})

Harga : Rp${harga.toLocaleString("id-ID")}

Nomor Tujuan :`
    );

    if (!nomor) return;

    const pesan = `Halo kak 

Saya ingin membeli Paket Akrab.

Nomor Tujuan : ${nomor}

Produk : ${nama}
Kode : ${code}
Harga : Rp ${harga.toLocaleString("id-ID")}

Mohon diproses ya. Terima kasih.`;

    location.href =
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`;

}
document
.getElementById("search")
.addEventListener("input",renderProducts);

document
.querySelectorAll(".tab")
.forEach(btn=>{

btn.onclick=()=>{

document
.querySelectorAll(".tab")
.forEach(x=>x.classList.remove("active"));

btn.classList.add("active");

currentType=btn.dataset.type;

renderProducts();

};

});

document
.getElementById("refreshBtn")
.onclick=loadProducts;

window.addEventListener("scroll",()=>{

document.getElementById("scrollTop").style.display=

window.scrollY>250?"block":"none";

});

document
.getElementById("scrollTop")
.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

loadProducts();

setInterval(loadProducts,30000);
// Animasi muncul card
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.animate(
                [
                    { opacity: 0, transform: "translateY(20px)" },
                    { opacity: 1, transform: "translateY(0)" }
                ],
                {
                    duration: 300,
                    fill: "forwards"
                }
            );
        }
    });
});

setInterval(() => {
    document.querySelectorAll(".card").forEach(card => observer.observe(card));
}, 1000);
