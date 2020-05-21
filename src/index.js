const QUOTES_URL = "http://localhost:3000/quotes"
const QUOTES_URL_LIKES = "http://localhost:3000/quotes?_embed=likes"
const LIKES_URL = "http://localhost:3000/likes"

document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById('quote-list')
    const newQuoteForm = document.getElementById('new-quote-form')

    function renderQuote(quote) {
        quoteList.innerHTML +=
        `<li class='quote-card'>
            <blockquote class="blockquote" id=${quote.id}>
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer><br>
                <button class='btn-success'>Likes: ${quote.likes.length}<span></span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
        </li>`
    }

    fetch(QUOTES_URL_LIKES)
    .then(resp => resp.json())
    .then(quotes => quotes.forEach(
        quote => {
            console.log(quote)
            renderQuote(quote)
        }
    ))

    newQuoteForm.addEventListener("submit", () => {
        const obj = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quote: newQuoteForm.querySelector("input[name='quote']").value,
                author: newQuoteForm.querySelector("input[name='author']").value,
                createdAt: (new Date).getTime()
            })      
        }

        fetch(QUOTES_URL, obj)
        .then(resp => resp.json())
        .then(resp => renderQuote(resp))
    })

    quoteList.addEventListener("click", (e) => {
        if (e.target.className === 'btn-success') {
            const quoteId = parseInt(e.target.parentNode.id)
            const likes = parseInt(e.target.innerHTML.match(/[0-9]+/)[0])

            const obj = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    quoteId: quoteId,
                    createdAt: (new Date).getTime()
                })
            }

            fetch(LIKES_URL, obj)
            .then(resp => resp.json())
            .then(resp => {
                e.target.innerHTML = `Likes: ${likes + 1}`
            })
        }
        else if (e.target.className === 'btn-danger') {
            const quote = e.target.parentNode

            const obj = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }

            fetch(`${QUOTES_URL}/${quote.id}`, obj)
            .then(resp => resp.json())
            .then(resp => {
               quote.parentNode.remove()
            })
        }
    })

})
