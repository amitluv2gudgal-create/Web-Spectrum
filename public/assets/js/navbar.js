function loadNavbar(){

    const token =
    localStorage.getItem("token");

    let navbar = `
        <a href="index.html">Home</a>

        <a href="about.html">About</a>

        <a href="products.html">Products</a>

        <a href="pricing.html">Pricing</a>

        <a href="contact.html">Contact</a>
    `;

    /* IF LOGGED IN */
    if(token){

        navbar += `

            <a href="admin-leads.html">
                Admin Leads
            </a>

            <a href="#"
               onclick="logout()">
               Logout
            </a>
        `;

    } else {

        navbar += `

            <a href="login.html">
                Login
            </a>
        `;
    }

    document
    .getElementById("navbar")
    .innerHTML = navbar;
}

/* LOGOUT */
function logout(){

    localStorage.removeItem("token");

    alert("Logged out successfully");

    window.location.href = "/login.html";
}

loadNavbar();