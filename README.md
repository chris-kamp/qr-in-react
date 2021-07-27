# About

QR-IN was created using React and Ruby on Rails by Anthony Beck and Chris Kamp as coursework for the Coder Academy bootcamp course.

The purpose of the application is to provide a platform for users to share locations they have visited (along with reviews and ratings), and for other users to find popular or highly-rated locations. The app attempts to minimise the "friction" involved in sharing businesses or locations you enjoy with others by enabling users to "check in" by simply scanning a QR code (a process which should already be familiar to anyone who has used COVID contact-tracing apps). The app also enables business owners to promote their business by encouraging users to check in with timed promotional events offering discounts or other incentives.

# Application

The live application can be accessed [here](https://qr-in.netlify.app/).

# Development

This repository contains the source code for the front-end React application. The back-end Ruby on Rails repository can be found [here](https://github.com/chris-kamp/qr-in-rails).

To run the React application in development, clone this depository, run ```npm i``` to install dependencies and run ```npm start``` to start the development server. To run automated tests using Cypress, run ```npm run cypress open```.