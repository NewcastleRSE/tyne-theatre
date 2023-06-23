var allData;
let today = new Date();
let cols;

// set starting month and year for calendar, not month is zero indexed
let currentMonth = 8;
let currentYear = 1867;

$(window).on('load', function () {

    const sheets = 'AIzaSyCVD9iMwj55GMFScjorofPqY4bYD2s-3pg'
    const spreadhseet = '1xylPWSG2CSaEi_-TBdBTaiNUYhVEKTNLj3MyYKc65hs'
    const sheet = 'newspaper1867'





    //    Get data from sheets
    $.getJSON(
        "https://sheets.googleapis.com/v4/spreadsheets/1xylPWSG2CSaEi_-TBdBTaiNUYhVEKTNLj3MyYKc65hs/values/newspaper1867?key=" + sheets,

        (data) => {

            // hide calendar
            browseAll()

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

    // Create the table element
    let table = document.createElement("table");
    table.setAttribute('id', 'myTable')
    table.classList.add('table')


    // Get the keys (column names) of the first object in the JSON data
    cols = Object.keys(dataToDisplay[0]);

    // Create the header element
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    // Loop through the column names and create header cells
    cols.forEach((item) => {
        // ignore ID column
        if (item != 'ID') {
            let th = document.createElement("th");
            th.setAttribute('scope', 'col')
            th.innerText = item; // Set the column name as the text of the header cell
            tr.appendChild(th); // Append the header cell to the header row
        }

    });




    thead.appendChild(tr); // Append the header row to the header
    table.append(thead) // Append the header to the table

    let tbody = document.createElement('tbody')
    // Loop through the JSON data and create table rows
    dataToDisplay.forEach((item) => {
        let tr = document.createElement("tr");

        // Get the values of the current object in the JSON data
        let vals = Object.values(item);

        // Loop through the values and create table cells other than the final ID column
        for (let i = 0; i < vals.length - 1; i++) {
            let td = document.createElement("td");
            td.innerText = vals[i]; // Set the value as the text of the table cell
            tr.appendChild(td); // Append the table cell to the table row
        }

        tbody.appendChild(tr); // Append the table row to the table
    });
    table.appendChild(tbody)
    container.appendChild(table) // Append the table to the container element

    //     // tell DatabTables to add styling etc.
    // $('#myTable').DataTable();

}

function createGenreRadios() {

    // get all possible genres from 'Type' column
    var types = Object.keys(_.countBy(allData, function (data) { return data.Type; }))

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

                            for (let i = 0; i < Object.keys(chosenEvent).length - 1; i++) {
                                let td = document.createElement("td");

                                td.innerText = chosenEvent[Object.keys(chosenEvent)[i]]; // Set the value as the text of the table cell
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

        var dates = entry.Date.split(',')

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
    console.log(events)
    return events

}

function displayEvent() {

}


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    createCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    createCalendar(currentMonth, currentYear);
}

function jump() {
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
    data.forEach((el) => {
        // split into list based on ;
        var dates = el.Date.split(";")
        // isolate date and convert to readable format
        var formattedDates = []
        dates.forEach((d) => {
            // remove space
            d = d.trim()
            var dateIsolated = d.substring(0, 9)

            var yr = dateIsolated.substring(0, 4)
            var month = dateIsolated.substring(4, 6) - 1
            var day = dateIsolated.substring(6, 8)

            if (day[0] === 0) {
                day = day[1]
            }

            var date = new Date(yr, month, day)

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
    var filteredData = _.filter(allData, function (o) { return o.Type === type; });

    createTable(filteredData)
}

// -----

function browseAll() {
    // hide calendar
    $('#calendar').hide()
    $('#browse').show()


}

function showCalendar() {
    // hide browsing
    $('#calendar').show()
    $('#browse').hide()
}

