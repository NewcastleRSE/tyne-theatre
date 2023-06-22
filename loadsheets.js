$(window).on('load', function() {

const sheets = 'AIzaSyCVD9iMwj55GMFScjorofPqY4bYD2s-3pg'
const spreadhseet = '1xylPWSG2CSaEi_-TBdBTaiNUYhVEKTNLj3MyYKc65hs'
const sheet = 'newspaper1867'





//    Get data from sheets
$.getJSON(
    "https://sheets.googleapis.com/v4/spreadsheets/1xylPWSG2CSaEi_-TBdBTaiNUYhVEKTNLj3MyYKc65hs/values/newspaper1867?key=" + sheets,
   
(data) => {

  // parse data from Sheets API into JSON
  var parsedData = Papa.parse(Papa.unparse(data['values']), {header: true} ).data
createTable(parsedData)





}

)

})


function createTable(jsonData) {
    // Get the container element where the table will be inserted
    let container = document.getElementById("showData");
         
    // Create the table element
    let table = document.createElement("table");
    table.setAttribute('id', 'myTable')
    table.classList.add('table')
    

    // Get the keys (column names) of the first object in the JSON data
    let cols = Object.keys(jsonData[0]);
    
    // Create the header element
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    
    // Loop through the column names and create header cells
    cols.forEach((item) => {
       let th = document.createElement("th");
       th.setAttribute('scope', 'col')
       th.innerText = item; // Set the column name as the text of the header cell
       tr.appendChild(th); // Append the header cell to the header row
    });
    thead.appendChild(tr); // Append the header row to the header
    table.append(thead) // Append the header to the table
    
    let tbody = document.createElement('tbody')
    // Loop through the JSON data and create table rows
    jsonData.forEach((item) => {
       let tr = document.createElement("tr");
       
       // Get the values of the current object in the JSON data
       let vals = Object.values(item);
       
       // Loop through the values and create table cells
       vals.forEach((elem) => {
          let td = document.createElement("td");
          td.innerText = elem; // Set the value as the text of the table cell
          tr.appendChild(td); // Append the table cell to the table row
       });
       tbody.appendChild(tr); // Append the table row to the table
    });
    table.appendChild(tbody)
    container.appendChild(table) // Append the table to the container element

//     // tell DatabTables to add styling etc.
// $('#myTable').DataTable();

}