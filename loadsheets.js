var allData;

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


// data processing
allData = standardiseTypeCol(parsedData)
allData = standardiseDataCol(allData)

 // create radio buttons for genre
 createGenreRadios()

 // create table
 createTable(allData)
}

)

})


function createTable(dataToDisplay) {
    // Get the container element where the table will be inserted
    let container = document.getElementById("showData");
         
    // Create the table element
    let table = document.createElement("table");
    table.setAttribute('id', 'myTable')
    table.classList.add('table')
    

    // Get the keys (column names) of the first object in the JSON data
    let cols = Object.keys(dataToDisplay[0]);
    
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
    dataToDisplay.forEach((item) => {
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

function createGenreRadios() {
    
    // get all possible genres from 'Type' column
    var types = Object.keys(_.countBy(allData, function(data) { return data.Type; }))
    console.log(_.countBy(allData, function(data) { return allData.Type; }))
    types.forEach((type) => {
        // exclude blank
        if (type != '') {
            var input = document.createElement('input')
            input.classList.add('form-check-input')
            input.setAttribute('type', 'radio')
            input.setAttribute('name', 'genre')
            input.setAttribute('id', 'radio' + type)
            input.onclick = function() {
                filterGenre(type)
            }
            var label = document.createElement('label')
            label.classList.add('form-check-label')
            label.setAttribute('for', 'radio' + type)
            label.innerHTML = type
            var div = document.createElement('div')
            div.classList.add('form-check')
            div.classList.add('ml-4')
            div.appendChild(input)
            div.appendChild(label)
            let container = document.getElementById("genreBtns");
            container.appendChild(div)
        }
    })
    
   

}

// ----- standardising content

function standardiseTypeCol(parsedData) {

    parsedData.forEach((el) => {
        // only first letter should be upper case and remove spaces at start or end
        el.Type = el.Type.trim()
        el.Type = el.Type.toLowerCase()
        el.Type = el.Type.charAt(0).toUpperCase() + el.Type.slice(1)
    })
    return parsedData
}

function standardiseDataCol(data) {
    data.forEach((el) => {
        // split into list based on ;
       var dates = el.Date.split(";")
       // isolate date and convert to readable format
       var formattedDates = []
       dates.forEach((d) => {
          // remove space
          d = d.trim()
        var dateIsolated = d.substring(0,9)

        var yr = dateIsolated.substring(0,4)
        var month = dateIsolated.substring(4, 6)-1
        var day = dateIsolated.substring(6, 8)

        if (day[0] === 0) {
            day = day[1]
        }

        console.log(yr, month, day )
       var date = new Date(yr, month, day)
        console.log(d + ' = ' +date)
        formattedDates.push(date.toDateString())
       })
      
       el.Date = formattedDates.join(', ')
    })

    return data
}

//  ----- filtering data

function filterGenre(type) {
    var container = document.getElementById('showData')
    container.replaceChildren()

    // select only entries where type is correct
    var filteredData = _.filter(allData, function(o) { return o.Type === type; });

    createTable(filteredData)
}

