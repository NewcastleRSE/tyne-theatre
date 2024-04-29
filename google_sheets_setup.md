# Google Sheets Setup for Tyne Theatre Performances

## Enable API access to the Google Sheets application
1. Go to Google's Cloud Console (https://console.cloud.google.com/).
2. Sign into Google with the account that you want to use to create the Google Sheet.

   
3. Create a new project and enable the Google Sheets API. This enables the code to programmatically access the Google Sheet you are going to create. Do this by clicking 'Select a project'.    
![image](https://github.com/NewcastleRSE/tyne-theatre/assets/49239607/f6fffb3f-46f1-4130-8354-0d6523b6a5fa)

Then click 'new project'.       

![image](https://github.com/NewcastleRSE/tyne-theatre/assets/49239607/a5859900-a106-4e88-bfe8-56a5b175d8f4)

Give your project a name and click 'create'.
Select your new new project by clicking it in the 'Select a project' dropdown. 
Enable the Google Sheets API, following the instructions here: https://support.google.com/googleapi/answer/6158841?hl=en

4. Create an API key by following the instructions here: https://support.google.com/googleapi/answer/6158862?hl=en/
   Make sure to copy the API key before closing the popup as this won't be accessible again. Save the string of characters
   and symbols somewhere so you can retrieve it later.

5. Create a Google Sheet and populate it with the Tyne Theatre data. Change the sharing settings so that anyone with
   the link can view it. You will also need to copy the sharing link for the next step.  Google's instructions are here: https://support.google.com/docs/answer/2494822?hl=en-GB&co=GENIE.Platform%3DDesktop#zippy=%2Cshare-a-file-publicly
6. The web developer will need the sheet ID. The sheet ID is the string of letters, numbers and symbols that comes after 'd/' in the sharing link you created in the previous step.
7. The web developer needs to paste this ID into the API call to Google instead of the text in bold here: 'https://sheets.googleapis.com/v4/spreadsheets/ **1xylPWSG2CSaEi_-TBdBTaiNUYhVEKTNLj3MyYKc65hs** /values/sheet1?key=' which s
is line 37 in my original code. 



