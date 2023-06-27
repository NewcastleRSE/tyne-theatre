# Tyne Theatre
Github Pages site to browse historical Tyne Theatre performances

## About

This site is designed to demonstrate code that takes the contents of Google Sheet and displays it for the user to browse and filter. The code is intended to be used within the Tyne Theatre website. This will involve Tyne Theatre's web developers to transfer the code. Styling and content is therefore kept to a minimum so that the Tyen Theatre staff and web developers can adapt as required. 

The site currently makes minimal use of [Font Awesome](https://fontawesome.com/) for icons and [Bootstrap](https://getbootstrap.com/) for styling. These can be replaced with other libraries or frameworks as required. 

The data is pulled from a Google Sheet stored on the Newcastle University RSE team's Google Drive. To enable access to a sheet:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and enable the Google Sheets API for the relevant project (or create a new one)
2. Create an API key. Store this key securely as you will need to append it to the API call
3. Share the Google Sheet so that anyone with the link can view it
4. Construct the API call as in the script in this repo. The Sheet ID can be found after `d/` in the sharing link Google provides. 

### Project Team
Dr Andrew Shail, Newcastle University  ([Andrew.Shail@newcastle.ac.uk](mailto:Andrew.Shail@newcastle.ac.uk))  
  

### RSE Contact
Kate Court
RSE Team  
Newcastle University  
([kate.court@newcastle.ac.uk](mailto:kate.court@newcastle.ac.uk))  

## Built With

The site uses Jekyll to run locally and GitHub Pages to deploy. The HTML and JavaScript files can be lifted for transferring to the final website ([script](./loadsheets.js)) and ([template](./index.html)).

## Getting Started

### Installation

Follow the installation instructions for Jekyll [here](https://jekyllrb.com/docs/).

### Running Locally

Run:

```
bundle exec jekyll serve --livereload
```

## Deployment

### Production

Push changes to the main branch to trigger a new build.

## Usage

[https://newcastlerse.github.io/tyne-theatre/](https://newcastlerse.github.io/tyne-theatre/)

## Roadmap

- [ ] Initial Research  
- [ ] Minimum viable product  
- [ ] Alpha Release  
- [x] Feature-Complete Release  



