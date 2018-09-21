# QResume

## Credits
Developed by Ivan Olin, Grant Savage.

Originally prototyped and conceptualized by Chris Mason, Janessa Henry, Suzy Cox, Rigoberto Avila, and Amanda Chesin.

## Introduction
QResume is a campus recruitment tool designed to eleminate paper resumes and make the recruitment process easier for both students and recruiters at career fairs. It accomplishes this by introducing digitized resumes, a QR code based booth check-in system, and an online dashboard for filtering and displaying resume information.

## Getting Started
1. Run `yarn` in both the server and client directories to install dependencies. 

2. Find the `auth.js` and `index.js` files in the server directory and replace the strings where you see '1' with a string of random numbers and letters. This will ensure the JWT is secure.

3. `cd` into the server directory and run `yarn start`. Next, open up a new terminal tab and cd into the `client` directory and run `yarn start`.

4. Open up a web browser and navigate to `http://localhost:3000`. You should see the app working at this point. 
