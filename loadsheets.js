var allData;
let today = new Date();
let cols;

// set starting month and year for calendar, note month is zero indexed
let earliestYr = 1867
let earliestMonth = 0
let latestYr = 1919
let latestMonth = 11

let currentMonth = earliestMonth;
let currentYear = earliestYr;

let rowsToDisplay = 10
let currentPage = 0
let allRowsIntoPages = []

// hide calendar and browsing
$('#calendar').hide()
$('#browse').hide()
$(window).on('load', function () {

    const sheets = 'AIzaSyCVD9iMwj55GMFScjorofPqY4bYD2s-3pg'
    const spreadhseet = '1xylPWSG2CSaEi_-TBdBTaiNUYhVEKTNLj3MyYKc65hs'
    const sheet = 'newspaper1867'

// set results card to invisible
 $('#resultsCard').hide()


    //    Get data from sheets
    $.getJSON(
        "https://sheets.googleapis.com/v4/spreadsheets/1xylPWSG2CSaEi_-TBdBTaiNUYhVEKTNLj3MyYKc65hs/values/sheet1?key=" + sheets,

        (data) => {



            // parse data from Sheets API into JSON
            var parsedData = Papa.parse(Papa.unparse(data['values']), { header: true }).data


            // data processing
            parsedData = assignIDs(parsedData)
            allData = standardiseTypeCol(parsedData)
            allData = standardiseDataCol(allData)
          

            // create radio buttons for genre
            createGenreRadios()

            // create table
            createTable(allData)
            createCalendar(currentMonth, currentYear);
        }

    )

})

// give each table row a unique ID
function assignIDs(data) {
    for (let index = 0; index < data.length; index++) {
        data[index]['ID'] = index
    }

    return data
}

function createTable(dataToDisplay) {

    // Get the container element where the table will be inserted
    let container = document.getElementById("showData");

    // reset pages
    allRowsIntoPages = []

    // Create the table element
    let table = document.createElement("table");
    table.setAttribute('id', 'myTable')
    table.classList.add('table')
    table.classList.add('table-hover')


    // Get the keys (column names) of the first object in the JSON data
    cols = Object.keys(dataToDisplay[0]);


    // Create the header element
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    // Loop through the column names and create header cells
    cols.forEach((item) => {
        // ignore ID and checked by columns
        if (item != 'ID' && !item.startsWith('Checked by?') && item != 'datesformatted') {
            let th = document.createElement("th");
            th.setAttribute('scope', 'col')
            th.innerText = item; // Set the column name as the text of the header cell
             // hide all cols except date and title
             
        if (item !== 'Date' && item !== 'Title') {
            th.style.display = 'none'
        }
            tr.appendChild(th); // Append the header cell to the header row
        }

       

    });




    thead.appendChild(tr); // Append the header row to the header
    table.append(thead) // Append the header to the table

    let tbody = document.createElement('tbody')
    tbody.setAttribute('id', 'tBodyBrowse')

    // Loop through the JSON data and create table rows
    let allHtmlRows = []
    dataToDisplay.forEach((item) => {
        let tr = document.createElement("tr");

        // Get the values of the current object in the JSON data
        let vals = Object.values(item);

        // Loop through the values and create table cells other than the final ID column
        for (let i = 0; i < vals.length - 4; i++) {
            let td = document.createElement("td");
            // first column is date and needs styling 
            if (i === 0) {
                var formattedDates = shorternDates(vals[i])
                td.innerText = formattedDates.substring(0,11) + '...' // Set the value as the text of the table cell
            } else {
                td.innerText = vals[i]; // Set the value as the text of the table cell
            }

            // hide everything but date and title
            if (i !== 0 && i !== 1) {
                td.style.display = 'none'
            }

            tr.appendChild(td); // Append the table cell to the table row
            tr.style.cursor = 'pointer'
            tr.onclick = function() {
                displayEvent(item['ID'])
            }
        }

        allHtmlRows.push(tr)
        //tbody.appendChild(tr); // Append the table row to the table
    });


    // divide rows into pages

    while (allHtmlRows.length > 0) {
        // remove first n elements and add to page
        const nextPage = allHtmlRows.splice(0, rowsToDisplay)
        allRowsIntoPages.push(nextPage)
    }

    // display first page
    allRowsIntoPages[0].forEach((tr) => {
        tbody.appendChild(tr)
    })


    table.appendChild(tbody)
    container.appendChild(table) // Append the table to the container element

    //     // tell DatabTables to add styling etc.
    // $('#myTable').DataTable();

}

// display single event above table view
function displayEvent(id) {
     // Get the container element where the table will be inserted
     let container = document.getElementById("clickedEntry");
 
     // Create the table element
     let table = document.createElement("table");
     table.setAttribute('id', 'resultTable')
     table.classList.add('table')
     
     
 
 
     // Get the keys (column names) of the first object in the JSON data
     
 
     // Create the header element
     let thead = document.createElement("thead");
     let tr = document.createElement("tr");
 
     // Loop through the column names and create header cells
     cols.forEach((item) => {
         // ignore ID and checked by columns
         if (item != 'ID' && !item.startsWith('Checked by?') && item != 'datesformatted') {
             let th = document.createElement("th");
             th.setAttribute('scope', 'col')
             th.innerText = item; // Set the column name as the text of the header cell
              
             tr.appendChild(th); // Append the header cell to the header row
         }
 
     });
 
 
 
 
     thead.appendChild(tr); // Append the header row to the header
     table.append(thead) // Append the header to the table
 
     let tbody = document.createElement('tbody')
     tbody.setAttribute('id', 'tBodyResult')
 
     // create table row
    let item = _.find(allData, function(o) {return o.ID === id})
    


         let tr1 = document.createElement("tr");
 
         // Get the values of the current object in the JSON data
         let vals = Object.values(item);
 console.log(vals)
         // Loop through the values and create table cells other than the final ID column
         for (let i = 0; i < vals.length - 4; i++) {
             let td = document.createElement("td");
             // first column is date and needs styling 
             if (i === 0) {
                 var formattedDates = shorternDates(vals[i])
                 td.innerText = formattedDates// Set the value as the text of the table cell
             } else {
                 td.innerText = vals[i]; // Set the value as the text of the table cell
             }
 
            
             tr1.appendChild(td); // Append the table cell to the table row
            
         }
 
        
         tbody.appendChild(tr1); // Append the table row to the table
   
     table.appendChild(tbody)
     container.appendChild(table) // Append the table to the container element

     // set results card to visible
     $('#resultsCard').show()
    
}


function createGenreRadios() {

    // get all possible genres from 'Type' column
    var types = Object.keys(_.countBy(allData, function (data) { 
        // strip anything in brackets
        let type = data.Type.replace(/ *\([^)]*\) */g, "")
        type = type.trim()
        return type; 
    }))

    types.forEach((type) => {
        // exclude blank
        if (type != '') {
            var input = document.createElement('input')
            input.classList.add('form-check-input')
            input.setAttribute('type', 'radio')
            input.setAttribute('name', 'genre')
            input.setAttribute('id', 'radio' + type)
            input.onclick = function () {
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

function createCalendar(month, year) {

    let selectYear = document.getElementById("year");
    let selectMonth = document.getElementById("month");

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // create date picker
    var yearPicker = document.getElementById('year')
    for (let yr = earliestYr; yr < latestYr + 1; yr++) {
        var option = document.createElement('option')

        option.setAttribute('value', yr)
        option.innerText = yr
        yearPicker.appendChild(option)
    }



    let monthAndYear = document.getElementById("monthAndYear");

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // get all events for requested year and month
    var events = getEventsForMonth(month, year)

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }

            else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);


                cell.appendChild(cellText);

                // build full date for cell to compare to events list
                let cellDate = new Date(year, month, date)

                // highlight days with performances
                events.forEach((e) => {

                    if (new Date(Object.keys(e)[0]).toDateString() === cellDate.toDateString()) {

                        var eventID = e[Object.keys(e)[0]]['ID']
                        cell.setAttribute('id', eventID)
                        // add clickable icon to cell
                        var icon = document.createElement('icon')
                        icon.classList.add('fa-solid')
                        icon.classList.add('fa-circle')
                        icon.setAttribute('style', 'color: ' + e[Object.keys(e)[0]]['colour'] + '; cursor: pointer;')

                        icon.onclick = function () {

                            var chosenEvent = _.find(allData, function (o) { return o['ID'] === eventID })
                            // build event
                            var tbody = document.getElementById('calTableBody')
                            // clear current table contents
                            tbody.replaceChildren()

                            var tr = document.createElement('tr')

                            for (let i = 0; i < Object.keys(chosenEvent).length - 4; i++) {


                                let td = document.createElement("td");
                                // first column is date and needs styling 
                                var innerText = chosenEvent[Object.keys(chosenEvent)[i]];
                                if (i === 0) {
                                    var formattedDates = shorternDates(innerText)
                                    td.innerText = formattedDates; // Set the value as the text of the table cell
                                } else {
                                    td.innerText = innerText; // Set the value as the text of the table cell
                                }




                                tr.appendChild(td); // Append the table cell to the table row



                            }

                            tbody.appendChild(tr); // Append the table row to the table


                        }
                        cell.appendChild(icon)

                    }
                })


                row.appendChild(cell);
                date++;
            }
        }

        tbl.appendChild(row); // appending each row into calendar body.
    }

}



// note expects month to be zero indexed e.g. January = 0
function getEventsForMonth(month, year) {
    var events = []

    // colour code events
    var colours = ['#0b3954', '#bfd7ea', '#ff6663', '#cbdf90', '#FFC100', '#353531', '#EC4E20', '#FF9505', '#016FB9', '#000000']
    var currentColour = 0

    allData.forEach((entry) => {
        // get colour for event or go back to beginning of list
        if (!colours[currentColour]) {
            currentColour = 0
        }

        var dates = entry.datesformatted.split(',')

        for (let index = 0; index < dates.length; index++) {
            var date = new Date(dates[index])
            if (date.getFullYear() === year && date.getMonth() === month) {
                var obj = {}
                entry['colour'] = colours[currentColour]
                obj[date] = entry
                events.push(obj)
            }
        }
        // take next colour for next event
        currentColour += 1
    })

    return events

}

function nextTablePage() {

    //add next rows if there are them
    if (allRowsIntoPages[currentPage + 1]) {
        // remove current rows
        var tbody = document.getElementById('tBodyBrowse')
        tbody.replaceChildren()
        currentPage++
        allRowsIntoPages[currentPage].forEach((tr) => {
            tbody.appendChild(tr)
        })
    }

}

function previousTablePage() {
 //add previous rows if there are them
 if (allRowsIntoPages[currentPage - 1]) {
    // remove current rows
    var tbody = document.getElementById('tBodyBrowse')
    tbody.replaceChildren()
    currentPage--
    allRowsIntoPages[currentPage].forEach((tr) => {
        tbody.appendChild(tr)
    })
}
}


function next() {
    // see if changing year would take it after the earliest
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    if (currentYear > latestYr) {
        //reset
        currentYear = latestYr
    } else {
        // also move month
        currentMonth = (currentMonth + 1) % 12;
    }

    createCalendar(currentMonth, currentYear);
}

function previous() {
    // see if changing year would take it before the earliest
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;

    if (currentYear < earliestYr) {
        //reset
        currentYear = earliestYr
    } else {
        // also move month
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    }

    createCalendar(currentMonth, currentYear);
}

function jump() {
    let selectYear = document.getElementById("year");
    let selectMonth = document.getElementById("month");
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    createCalendar(currentMonth, currentYear);
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

    // reformat date col to be human readable and create new machine readable column to use for calendar etc.
    data.forEach((el) => {
        // split into list based on ;
        var dates = el.Date.split(";")
        // isolate date and convert to readable format
        var formattedDates = []
        // convert date to readable format but preserve day and matinee information
        var formattedDatesWithStrings = []

        dates.forEach((d) => {
            // remove space
            d = d.trim()
            var dateIsolated = d.substring(0, 9)
            var restOfDate = d.substring(9)

            var yr = dateIsolated.substring(0, 4)
            var month = dateIsolated.substring(4, 6) - 1
            var day = dateIsolated.substring(6, 8)

            if (day[0] === 0) {
                day = day[1]
            }

            var date = new Date(yr, month, day)

            formattedDates.push(date.toDateString())
            formattedDatesWithStrings.push(date.toDateString() + ' ' + restOfDate)
        })

        el.Date = formattedDatesWithStrings.join(', ')
        el['datesformatted'] = formattedDates.join(', ')
    })

    return data
}

function shorternDates(dates) {
    var formatted = []

    dates.split(',').forEach((d) => {
        var partsOfDate = d.split(' - ')
        d = new Date(partsOfDate[0])
        if (partsOfDate[1]) {
            formatted.push(d.toLocaleDateString() + ' - ' + partsOfDate[1])
        } else {
            formatted.push(d.toLocaleDateString())
        }
        

    })
    return formatted.join(', ')
}

//  ----- filtering data

function filterGenre(type) {

    var container = document.getElementById('showData')
    container.replaceChildren()

    if (type === 'all') {
        createTable(allData)
    } else {

        // select only entries where type is correct
        var filteredData = _.filter(allData, function (o) { return o.Type.startsWith(type); });

        createTable(filteredData)
    }
}

// -----

function browseAll() {
    // hide calendar
    $('#calendar').hide()
    $('#browse').show()
    $('#welcomeText').hide()

    // reset checkbox to displaying all entries
    document.getElementById('all').click()


}

function showCalendar() {
    // hide browsing
    $('#calendar').show()
    $('#browse').hide()
    $('#welcomeText').hide()
}

