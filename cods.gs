function doGet(e) {
  if (e.parameter.page === 'page2') {
    // Pass the query parameters to the page2() function
    return page2(
      e.parameter.employee || "Emri Mbiemri",
      e.parameter.position || "Pozita e punes",
      e.parameter.department || "Departamenti",
      e.parameter.leave_type || "default_leave_type",
      e.parameter.datefrom || "default_datefrom",
      e.parameter.dateto || "default_dateto"
    );
  } else {
    // Serve index.html with data from query parameters
    var template = HtmlService.createTemplateFromFile('index');
    template.responseId = e.parameter.responseId;
    template.employeeemail = e.parameter.employeeemail;
    template.position = e.parameter.position;
    template.department = e.parameter.department;
    template.leave_type = e.parameter.leave_type;
    template.datefrom = e.parameter.datefrom;
    template.dateto = e.parameter.dateto;

    // Create the HTML output
    var htmlOutput = template.evaluate();

    // Add the viewport meta tag to the HTML output
    htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    return htmlOutput;
  }
}


function page2(employee, position, department, leave_type, dateFrom, dateTo) {
  var template2 = HtmlService.createTemplateFromFile('page2');
  template2.Pozita = position;
  template2.Emri = employee;
  template2.Departamenti = department;
  template2.Dataprej = dateFrom;
  template2.Dataderi = dateTo;
  template2.Leavetype = leave_type;
  return template2.evaluate();
}


var spreadsheet = SpreadsheetApp.openById("{SHEETID}");
var sheet = spreadsheet.getSheetByName("Sheet1");

function processForm(formId) {
  var data = sheet.getDataRange().getValues();

  // Define the search criteria (Column 4 value to match)
  var searchCriteria = formId;

  // Loop through each row to find matching criteria and update the value in Column 5
  for (var i = 0; i < data.length; i++) {
    if (data[i][3] == searchCriteria) {
      sheet.getRange(i + 1, 10).setValue("Approved");
    }
  }
}

function sendEmailToEmployee(email,subject,message) {
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: message
  });
}

function approveForm(formId) {
  var data = sheet.getDataRange().getValues();

  // Define the search criteria (Column 4 value to match)
  var searchCriteria = formId;
  // Loop through each row to find matching criteria and update the value in Column 5
  for (var i = 0; i < data.length; i++) {
    if (data[i][8] == searchCriteria) {
      sheet.getRange(i + 1, 10).setValue("Approved");
      var email = sheet.getRange(i + 1, 8).getValue();
      var position = sheet.getRange(i + 1, 3).getValue();
      var departamenti = sheet.getRange(i + 1, 4).getValue();
      var pushimi = sheet.getRange(i + 1, 5).getValue();
      var leavetype = "";
      if (pushimi == "Annual leave") {
        leavetype = "Annual"
      } else if (pushimi == "Sick leave") {
        leavetype = "Sick"
      } else if (pushimi == "Sick leave without medical certificate") {
        leavetype = "Sickwithout"
      } else if (pushimi == "Marriage leave") {
        leavetype = "Marriage"
      } else if (pushimi == "Parental leave") {
        leavetype = "Childbirth"
      } else if (pushimi == "Death of family member") {
        leavetype = "Death"
      } else if (pushimi == "Blood donate") {
        leavetype = "Blood"
      } else if (pushimi == "Unpaid leave") {
        leavetype = "Nopay"
      }
      
      var dataprej = sheet.getRange(i + 1, 6).getValue();
      var formattedDateFrom = Utilities.formatDate(dataprej, "GMT+0200", "MM-dd-yyyy");
      var dataderi = sheet.getRange(i + 1, 7).getValue();
      var formattedDateTo = Utilities.formatDate(dataderi, "GMT+0200", "MM-dd-yyyy");
      var emri = email;
      var pdflink = `{DeploymentLink}/exec?page=page2&employee=${emri}&position=${position}&department=${departamenti}&datefrom=${formattedDateFrom}&dateto=${formattedDateTo}&leave_type=${leavetype}`;
      var subject = `Your request for leave has been Approved`;
      var message = `We just want to inform you that your manager has approved your leave request.
      See the link <a href="${pdflink}">Click here to download the pdf</a>`;
      sendEmailToEmployee(email, subject, message);
    }
  }
}


function denyFormins(formId,reason) {
    var data = sheet.getDataRange().getValues();

  // Define the search criteria (Column 4 value to match)
  var searchCriteria = formId;
    var lastColumn = sheet.getLastColumn();

  // Loop through each row to find matching criteria and update the value in Column 5
  for (var i = 0; i < data.length; i++) {
    if (data[i][8] == searchCriteria) {
      sheet.getRange(i + 1, 10).setValue("Denied");
      sheet.getRange(i + 1, 11).setValue(reason);
      var email = sheet.getRange(i + 1, 8).getValue();
      var subject = `Your request for leave has not been approved`
      var message = `We just want to inform you that your manager has not approved your leave request with the reason ${reason}`
      sendEmailToEmployee(email,subject,message)
    }
  }
}

function onFormSubmit(e) {
  var responseId = e.response.getId();
  Logger.log('Response ID: ' + responseId);

  // Get the active spreadsheet and sheet by ID

  // Get the last row and last column with content
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  // Set the value "Approved" in the last row, last column
  sheet.getRange(lastRow, 10).setValue("Pending");
  sheet.getRange(lastRow, 9).setValue(responseId);

  // Get the manager's email from column number 3 in the last row
  var managerEmail = sheet.getRange(lastRow, 2).getValue();
  var employeeEmail = sheet.getRange(lastRow, 8).getValue();
  var position = sheet.getRange(lastRow, 3).getValue();
  var department = sheet.getRange(lastRow, 4).getValue();
  var leave_type = sheet.getRange(lastRow, 5).getValue();
  var date_from = sheet.getRange(lastRow, 6).getValue();
  var formattedDateFrom = Utilities.formatDate(date_from, "GMT+0200", "MM-dd-yyyy");
  var date_to = sheet.getRange(lastRow, 7).getValue();
  var formattedDateTo = Utilities.formatDate(date_to, "GMT+0200", "MM-dd-yyyy");
  
  
  
  // Compose the email message
  var subject = "Leave Approval Request";
  var approvalLink = "{DeploymentLink}" +
                     "?responseId=" + responseId +
                     "&employeeemail=" + encodeURIComponent(employeeEmail) +
                     "&position=" + encodeURIComponent(position) +
                     "&department=" + encodeURIComponent(department) +
                     "&leave_type=" + encodeURIComponent(leave_type) +
                     "&datefrom=" + encodeURIComponent(formattedDateFrom) +
                     "&dateto=" + encodeURIComponent(formattedDateTo);
   
     var body = `<!DOCTYPE html>
              <html>
              <head>
                <base target="_top">
                <style>
                  /* Add your CSS styles for mobile responsiveness here */
                  body {
                    font-family: Arial, sans-serif;
                  }
                  .container {
                    max-width: 100%;
                    padding: 20px;
                    box-sizing: border-box;
                  }
                  .button {
                    border: 1px solid black;
                    color: black !important;
                    text-align: center;
                    padding: 14px 16px;
                    text-decoration: none;
                    border-radius: 4px;
                    font-size: 14px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Leave Approval Request</h1>
                  <p>Dear manager,</p>
                  <p>I hope this email finds you well. I am writing to bring your attention to a leave approval request submitted by one of our valued employees.</p>
                  <p>The employee ${employeeEmail} in position ${position} of ${department} department is asking for ${leave_type} starting from ${formattedDateFrom} to ${formattedDateTo}.</p>
                  <p>Please review and approve or deny it by clicking the link below:</p>
                  <br>
                  <a class="button" href="${approvalLink}">Approve or Deny</a>
                </div>
              </body>
              </html>`;

  
  // Send the email
  MailApp.sendEmail({
    to: managerEmail,
    subject: subject,
    htmlBody: body
  });
}
