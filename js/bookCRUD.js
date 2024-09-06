function getAllBooks() {
  var jsonString = localStorage.getItem("myBooks");
  var jsonObj = JSON.parse(jsonString) || { books: [] }; // Ensure jsonObj is an object

  console.log(jsonObj);

  var tbody = document.getElementsByTagName("tbody")[0];
  tbody.innerHTML = ''; // Clear existing rows

  for (var i = 0; i < jsonObj.books.length; i++) {
    var trow = document.createElement("tr");

    trow.innerHTML = `
      <th scope="row">${jsonObj.books[i].bookId}</th>
      <td>${jsonObj.books[i].bookTitle}</td>
      <td>${jsonObj.books[i].authorName}</td>
      <td>${jsonObj.books[i].publisherName}</td>
      <td class="table_buttons">
        <a 
          class="edit" 
          href="adminBooksEdit.html"
          onclick="rememberBook('${jsonObj.books[i].bookId}', '${jsonObj.books[i].bookTitle}', '${jsonObj.books[i].authorName}', '${jsonObj.books[i].publisherName}')"
          title="Edit Book" 
        >
          <i class="material-icons">edit</i>
        </a>
        <a 
          class="delete" 
          href="adminBooks.html" 
          onclick="deleteBookHandler('${jsonObj.books[i].bookTitle}')" 
          title="Delete Book" 
        >
          <i class="material-icons">delete</i>
        </a>
      </td>
    `;

    tbody.appendChild(trow);
  }
}

function addBookHandler() {
  var bookTitle = document.getElementById("addBookTitle").value.trim();
  var bookAuthor = document.getElementById("addBookAuthor").value.trim();
  var bookPublisher = document.getElementById("addBookPublisher").value.trim();
  
  if (!bookTitle || !bookAuthor || !bookPublisher) {
    alert("All fields must be filled out.");
    return;
  }
  if (bookTitle.length > 25 || bookAuthor.length > 25 || bookPublisher.length > 25) {
    alert("Fields cannot exceed 25 characters.");
    return;
  }

  var jsonString = localStorage.getItem("myBooks");
  var jsonObj = JSON.parse(jsonString) || { books: [] };

  // Find the highest existing bookId and increment it
  var highestId = jsonObj.books.reduce((maxId, book) => Math.max(maxId, book.bookId), 0);
  var newBookId = highestId + 1;

  var saveObj = {
    "bookId": newBookId,
    "bookTitle": bookTitle,
    "authorName": bookAuthor,
    "publisherName": bookPublisher
  };

  jsonObj.books.push(saveObj);
  localStorage.setItem("myBooks", JSON.stringify(jsonObj));
  
  window.location.href = "adminBooks.html"; // Only redirect when successful
}

function rememberBook(id, title, author, publisher) {
  var saveObj = {
    "bookId": id,
    "bookTitle": title,
    "authorName": author,
    "publisherName": publisher
  };

  localStorage.setItem("bookToEdit", JSON.stringify(saveObj));
}

function fillSelectedBook() {
  var objString = localStorage.getItem("bookToEdit");
  var obj = JSON.parse(objString);

  if (!obj) {
    console.error("No book data found in localStorage.");
    return;
  }

  document.querySelector(".col-sm-10.e1").innerHTML = `
    <input type="text" class="form-control" id="editBookTitle" value="${obj.bookTitle}" placeholder="Title...">
  `;
  document.querySelector(".col-sm-10.e2").innerHTML = `
    <input type="text" class="form-control" id="editBookAuthor" value="${obj.authorName}" placeholder="Author...">
  `;
  document.querySelector(".col-sm-10.e3").innerHTML = `
    <input type="text" class="form-control" id="editBookPublisher" value="${obj.publisherName}" placeholder="Publisher...">
  `;
}

function updateBookHandler() {
  var newBookTitle = document.getElementById("editBookTitle").value.trim();
  var newBookAuthor = document.getElementById("editBookAuthor").value.trim();
  var newBookPublisher = document.getElementById("editBookPublisher").value.trim();

  if (!newBookTitle || !newBookAuthor || !newBookPublisher) {
    alert("All fields must be filled out.");
    return;
  }
  if (newBookTitle.length > 25 || newBookAuthor.length > 25 || newBookPublisher.length > 25) {
    alert("Fields cannot exceed 25 characters.");
    return;
  }

  var objString = localStorage.getItem("bookToEdit");
  var obj = JSON.parse(objString);
  var targetId = obj.bookId;

  var jsonString = localStorage.getItem("myBooks");
  var jsonObj = JSON.parse(jsonString) || { books: [] };

  var bookToUpdate = jsonObj.books.find(book => book.bookId === targetId);
  if (bookToUpdate) {
    bookToUpdate.bookTitle = newBookTitle;
    bookToUpdate.authorName = newBookAuthor;
    bookToUpdate.publisherName = newBookPublisher;

    localStorage.setItem("myBooks", JSON.stringify(jsonObj));
    window.location.href = "adminBooks.html"; // Redirect after successful update
  } else {
    console.error("Book not found for update.");
  }
}

function deleteBookHandler(title) {
  var jsonString = localStorage.getItem("myBooks");
  var jsonObj = JSON.parse(jsonString) || { books: [] };

  var initialLength = jsonObj.books.length;
  jsonObj.books = jsonObj.books.filter(book => book.bookTitle !== title);

  if (jsonObj.books.length < initialLength) {
    localStorage.setItem("myBooks", JSON.stringify(jsonObj));
  } else {
    console.error("Book not found for deletion.");
  }
}
