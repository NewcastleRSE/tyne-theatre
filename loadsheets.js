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


  
console.log(data)
}

)

})