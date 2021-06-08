# MedFlyt coding task - 2021 caregivers report

1. You will get the client & server projects. Please upload them to a new repository on your GitHub account.
2. After cloning, please set up the environments and run the projects. 
    - The server project uses postgres, please verify you have an installed postgres on your computer. 
    - To verify everything is working, you should open the client project, and see this: 
			![Example](/docs/1.png)
3. Now when everything is running, let’s talk about the system we working on:
    - Our schema contains 3 entities:
        -   **Patient** - a person who needs assistance with activities of daily living. 
        -   **Caregiver** - The person that assists the patient. 
        -   **Visit** - An occurrence of a caregiver & patient session. 
    - Our system is a reporting system - showing the user (The agency) a report of all of the caregivers and their patients of the current year. 
    - In the web app, we have a table that shows the report, and a refresh button, that syncs the data from our DB.

4. Unfortunately, we have some bugs in the system, and we need your help: 
    - We’re getting “Error!” on the client side when trying to fetch the report from the server.
    - Our beautiful MedFlyt logo is cropped out at the bottom, it should be positioned in the bottom left corner.
    - All of the patients' names are concatenated. They should be split by commas.
    - There are multiple caregiver rows for each caregiver. We want to have 1 row for each caregiver, containing a list of his patients, like this:
    ![Example](/docs/2.png)
    - Data is not refreshed when clicking the refresh button. 
    - The report is showing the data from past years, instead of only 2021.
5. After finishing to fix those bugs, please send us: 
    - A link to a video (can use loom), showing all of the bug fixes. 
    - Links to the GitHub pull requests (server & client). 
6. Send everything to:
        - nir@medflyt.com
        - omerfinger@medflyt.com


*Thank you and good luck,* 
*MedFlyt Team*
