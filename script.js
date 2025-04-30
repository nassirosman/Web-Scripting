/**
 * Book Recommendation Application
 * Provides personalised book recommendations and wishlist management.
 * @date March 10, 2025
 */

// Book database
var BOOK_CATALOG = [
    {
        id: 1,
        title: "My Next Breath: Signed Edition",
        author: "Jeremy Renner",
        genre: "non-fiction",
        price: 22.00,
        language: "english",
        format: "hardcover",
        rating: 4.3,
        description: "A personal story of resilience and recovery."
    },
    {
        id: 2,
        title: "The Impossible Fortune: Exclusive Edition - The Thursday Murder Club",
        author: "Richard Osman",
        genre: "mystery",
        price: 16.99,
        language: "english",
        format: "hardcover",
        rating: 4.6,
        description: "Another clever case from the beloved amateur sleuths."
    },
    {
        id: 3,
        title: "A Minecraft Movie: The Junior Novelisation",
        author: "Mojang AB",
        genre: "fiction",
        price: 5.99,
        language: "english",
        format: "paperback",
        rating: 4.0,
        description: "An adventure based on the Minecraft movie for younger readers."
    },
    {
        id: 4,
        title: "La Passe-miroir : Les fiancés de l'hiver",
        author: "Christelle Dabos",
        genre: "fantasy",
        price: 14.50,
        language: "french",
        format: "paperback",
        rating: 4.7,
        description: "Une jeune fille capable de lire le passé des objets est promise à un homme dun autre monde."
    }
    
];


// Wishlist manager
var WishlistManager = {
    key: "bookWishlist",
    getWishlist: function() {
        return JSON.parse(localStorage.getItem(WishlistManager.key)) || [];
    },
    saveWishlist: function(wishlist) {
        localStorage.setItem(WishlistManager.key, JSON.stringify(wishlist));
    },
    addBook: function(book) {
        var wishlist = WishlistManager.getWishlist();
        var exists = false;
        for (var i = 0; i < wishlist.length; i++) {
            if (wishlist[i].id === book.id) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            wishlist.push(book);
            WishlistManager.saveWishlist(wishlist);
        }
        return wishlist;
    }
};

// DOM utils
var DOMUtils = {
    getElement: function(selector) {
        return document.querySelector(selector);
    },
    createElement: function(tag, attributes, content) {
        var element = document.createElement(tag);
        for (var key in attributes) {
            element[key] = attributes[key];
        }
        element.innerHTML = content || "";
        return element;
    }
};

// Main app logic
function BookRecommender() {
    var form = DOMUtils.getElement("#book-form");
    var bookList = DOMUtils.getElement("#book-list");
    var wishlistList = DOMUtils.getElement("#wishlist-list");

    function initEventListeners() {
        form.addEventListener("submit", handleFormSubmit);
    }

    function getUserPreferences() {
        return {
            genre: form.querySelector("#genre").value.toLowerCase() || "",
            author: form.querySelector("#author").value.toLowerCase().trim() || "",
            price: parseFloat(form.querySelector("#price").value) || Infinity,
            language: form.querySelector("#language").value.toLowerCase() || "",
            format: form.querySelector("#format").value.toLowerCase() || ""
        };
    }

    function filterBooks(preferences) {
        var result = [];
        for (var i = 0; i < BOOK_CATALOG.length; i++) {
            var book = BOOK_CATALOG[i];
            if (
                (!preferences.genre || book.genre === preferences.genre) &&
                (!preferences.author || book.author.toLowerCase().indexOf(preferences.author) !== -1) &&
                (book.price <= preferences.price) &&
                (!preferences.language || book.language === preferences.language) &&
                (!preferences.format || book.format === preferences.format)
            ) {
                result.push(book);
            }
        }
        result.sort(function(a, b) {
            return b.rating - a.rating;
        });
        return result;
    }

    function renderBookRecommendations(books) {
        bookList.innerHTML = "";
        if (books.length === 0) {
            bookList.appendChild(DOMUtils.createElement("p", {}, "No books match your criteria."));
            return;
        }

        for (var i = 0; i < books.length; i++) {
            var book = books[i];
            var bestMatch = (i === 0) ? " best-match" : "";
            var bookElement = DOMUtils.createElement("div", { className: "book-item" + bestMatch });

            var innerHTML = "<h3>" + book.title;
            if (i === 0) {
                innerHTML += " <span>(Best Match)</span>";
            }
            innerHTML += "</h3>" +
                "<p>Author: " + book.author + "</p>" +
                "<p>Price: £" + book.price.toFixed(2) + "</p>" +
                "<p>" + book.description + "</p>" +
                '<button type="button" onclick="addToWishlist(' + book.id + ')">Add to Wishlist</button>';

            bookElement.innerHTML = innerHTML;
            bookList.appendChild(bookElement);
        }
    }

    function renderWishlist() {
        var wishlist = WishlistManager.getWishlist();
        wishlistList.innerHTML = "";
        for (var i = 0; i < wishlist.length; i++) {
            var book = wishlist[i];
            var item = DOMUtils.createElement("div", { className: "wishlist-item" }, "<p>" + book.title + " by " + book.author + "</p>");
            wishlistList.appendChild(item);
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        var preferences = getUserPreferences();
        var filteredBooks = filterBooks(preferences);
        renderBookRecommendations(filteredBooks);
    }

    function addToWishlist(bookId) {
        for (var i = 0; i < BOOK_CATALOG.length; i++) {
            if (BOOK_CATALOG[i].id === bookId) {
                WishlistManager.addBook(BOOK_CATALOG[i]);
                renderWishlist();
                break;
            }
        }
    }

    initEventListeners();

    // Make public so it can be used in onclick handler
    window.addToWishlist = addToWishlist;

    // Initialise wishlist display
    renderWishlist();
}

// Start app
BookRecommender();
