document
.getElementById("contactForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        company: document.getElementById("company").value,
        message: document.getElementById("message").value
    };

    const response = await fetch("/api/leads", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
    });

    const result = await response.json();

    alert(result.message);

    document.getElementById("contactForm").reset();
});