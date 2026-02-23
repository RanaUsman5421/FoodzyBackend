let footer = document.querySelector("footer");
footer.innerHTML = `<div class="footer-main">
            <div class="footer-1">
                <div class="footer-logo">
                    <img src="./Assets/footer_logo.png" alt="">
                    <div>
                        <h3>Foodzy</h3>
                        <p>A Treasure of Taste</p>
                    </div>
                </div>
                <p class="footer-1-text">FoodTrove is the biggest market of grocery products. Get your daily needs from
                    our store.</p>
                <div class="footer-1-lines">

                    <div class="footer-1-line">
                        <i class="fa-solid fa-location-dot"></i>
                        <p>51 Green St.Huntington ohaio beach ontario, NY11746 KY 4783, USA.</p>
                    </div>

                    <div class="footer-1-line">
                        <i class="fa-solid fa-envelope"></i>
                        <p>info@foodzy.com</p>
                    </div>


                    <div class="footer-1-line">
                        <i class="fa-solid fa-phone"></i>
                        <p>+1 234 567 890</p>
                    </div>

                </div>
            </div>
            <div class="footer-2">
                <h3>Company</h3>

                <div class="footer-2-links">
                    <a href="">About Us</a>
                    <a href="">Delivery Information</a>
                    <a href="">Privacy Policy</a>
                    <a href="">Terms & Conditions</a>
                    <a href="">Contact Us</a>
                    <a href="">Support Center</a>
                </div>



            </div>

            <div class="footer-2">
                <h3>Category</h3>

                <div class="footer-2-links">
                    <a href="">Dairy & Bakery</a>
                    <a href="">Fruits & Vegetables</a>
                    <a href="">Meat & Seafood</a>
                    <a href="">Pantry Staples</a>
                    <a href="">Snacks & Beverages</a>
                    <a href="">Bakery & Desserts</a>
                </div>




            </div>

            <div class="footer-4">
                <h3>Subscribe our NewsLetter</h3>
                <div class="footer-4-input">
                    <input type="text" placeholder="Search here"> <i class="fa-solid fa-paper-plane"></i>
                </div>

                <div class="footer-4-icons">
                    <i class="fa-brands fa-facebook-f"></i>
                    <i class="fa-brands fa-youtube"></i>
                    <i class="fa-brands fa-x-twitter"></i>
                    <i class="fa-brands fa-instagram"></i>
                </div>

                <div class="footer-4-images">
                    <img src="./Assets/footer_image_1.png" alt="">
                    <img src="./Assets/footer_image_2.png" alt="">
                    <img src="./Assets/footer_image_3.png" alt="">
                    <img src="./Assets/footer_image_4.png" alt="">
                    <img src="./Assets/footer_image_5.png" alt="">
                </div>
            </div>`



        let faq_data = [
            {
                question: "What Facilities Does Your Hotel Have?",
                answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptate doloribuseos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto.Libero, vero natus."
            },
            {
                question: "What Facilities Does Your Hotel Have?",
                answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptate doloribuseos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto.Libero, vero natus."
            },
            {
                question: "What Facilities Does Your Hotel Have?",
                answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptate doloribuseos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto.Libero, vero natus."
            },
            {
                question: "What Facilities Does Your Hotel Have?",
                answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptate doloribuseos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto.Libero, vero natus."
            },
            {
                question: "What Facilities Does Your Hotel Have?",
                answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptate doloribuseos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto.Libero, vero natus."
            },
            {
                question: "What Facilities Does Your Hotel Have?",
                answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptate doloribuseos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto.Libero, vero natus."
            },
            {
                question: "What Facilities Does Your Hotel Have?",
                answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptate doloribuseos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto.Libero, vero natus."
            }
        ]

        for (let index = 0; index <= faq_data.length - 1; index++) {
            let faq_div = document.querySelector(".faq-div");

let question_main = document.createElement("div");
question_main.classList.add("question-main");
faq_div.appendChild(question_main);

let question = document.createElement("div");
question.classList.add("question");
question_main.appendChild(question);

let q1 = document.createElement("p");
q1.innerText = "What Facilities Does Your Hotel Have?";
question.appendChild(q1);

let carret = document.createElement("i");
carret.classList.add("fa-solid", "fa-caret-right");
question.appendChild(carret);


let answer = document.createElement("div");
answer.classList.add("answer");
question_main.appendChild(answer);

let ans = document.createElement("p");
ans.innerText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptate doloribuseos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto.Libero, vero natus.";
answer.appendChild(ans);           

q1.addEventListener('click', () => {
    answer.classList.toggle("active");
})
}