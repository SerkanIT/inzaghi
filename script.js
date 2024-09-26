const currencyEls = [
    document.getElementById("currency-one"),
    document.getElementById("currency-two"),
];
const amountEls = [
    document.getElementById("amount-one"),
    document.getElementById("amount-two"),
];
const rateEl = document.getElementById("rate");
const swap = document.getElementById("swap");

// Sayfa yüklendiğinde yerel depolamadan verileri al
document.addEventListener("DOMContentLoaded", () => {
    const storedCurrencyOne = localStorage.getItem("currencyOne");
    const storedCurrencyTwo = localStorage.getItem("currencyTwo");
    const storedAmountOne = localStorage.getItem("amountOne");

    if (storedCurrencyOne) {
        currencyEls[0].value = storedCurrencyOne;
    }
    if (storedCurrencyTwo) {
        currencyEls[1].value = storedCurrencyTwo;
    }
    if (storedAmountOne) {
        amountEls[0].value = storedAmountOne;
    }

    calculate(); // İlk hesaplamayı yap
});

function calculate() {
    const currency_one = currencyEls[0].value;
    const currency_two = currencyEls[1].value;

    // Kullanıcı seçimlerini yerel depolamada sakla
    localStorage.setItem("currencyOne", currency_one);
    localStorage.setItem("currencyTwo", currency_two);
    localStorage.setItem("amountOne", amountEls[0].value);

    fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`API isteği başarısız oldu: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); 

        const rate = data.rates[currency_two];

        if (rate) {
            rateEl.innerHTML = `
                <div>
                    <h3>Exchange Currency</h3>
                    <p>1 <strong>${currency_one}</strong> = <strong>${rate}</strong> <strong>${currency_two}</strong></p>
                </div>
            `; 
            amountEls[1].value = (amountEls[0].value * rate).toFixed(2); 
        } else {
            rateEl.innerHTML = `<span style="color: red;">Veri bulunamadı</span>`; 
            amountEls[1].value = "";
        }
    })
    .catch(error => {
        console.error("Hata:", error);
        rateEl.innerHTML = `<span style="color: red;">Döviz verileri alınırken bir sorun oluştu.</span>`; // Hata durumunda HTML içeriğini güncelle
    });
}

currencyEls.forEach(el => el.addEventListener("change", calculate));
amountEls.forEach(el => el.addEventListener("input", calculate));

swap.addEventListener("click", function () {
    const temp = currencyEls[0].value;
    currencyEls[0].value = currencyEls[1].value;
    currencyEls[1].value = temp;
    calculate();
});

// Hesaplama işlemi için ilk çağrıyı yap
calculate();
