let samra = document.getElementById("samraimg");
        console.log(samra)

        fetch("http://localhost:3000/users")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                samra.src = data[0].firstname;
            })
            .catch(error => {
                console.error("Error:", error);
            });