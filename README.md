**Purpose**
This project aims to streamline the leave request approval process for organizations using Google Forms and Google Apps Script. It provides a simple and efficient way for employees to request time off for various reasons, such as vacations, personal days, or sick leave. The project automates the approval workflow, ensuring that requests are routed to the appropriate manager for review and approval.

**Features**
Employees can submit leave requests using a Google Form.
Managers receive email notifications for pending leave requests.
Managers can approve or deny leave requests directly from their email.
Employees receive email notifications regarding the status of their leave requests.
Easy setup and deployment as a web application.

**Installation**

Create a Google Form with the following fields:

- Employee Name (Short Answer)
- Manager's Email
- Leave Type (Multiple Choice or Dropdown)
- Start Date (Date)
- End Date (Date)
- Reason for Leave (Paragraph Text)

Open the Google Form, click on the three dots in the upper right corner, and select "Script Editor."
In the Script Editor, replace the default code with the code provided in this repository's code.gs file.
Save the script with a meaningful name.

Deploy the script as a web app:

- Click on the disk icon to save your project.
- Click on the "Deploy" menu, then select "New Deployment."
- Choose "Web app" as the deployment type.
- Set access permissions as needed (e.g., "Anyone, even anonymous" for ease of testing).
- Click "Deploy."
