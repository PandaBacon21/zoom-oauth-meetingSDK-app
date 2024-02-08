# Sample Zoom OAuth and Web SDK App

This app is intended to serve as an example of how you can build integrations with Zoom. This app uses Zoom's APIs and the Web SDK. The front end is built with React 18.2.0 and the back end with Flask 3.0. 

 
# Zoom Info

- Create a new OAuth app in your Zoom account - https://developers.zoom.us/docs/integrations/
- Zoom API Documentation - https://developers.zoom.us/docs/api/
- Zoom Meeting SDK - https://marketplacefront.zoom.us/sdk/meeting/web/index.html

# Installation 
Clone this project 
```
git clone https://github.com/PandaBacon21/zoom-oauth-meetingSDK-app.git
```

```cd``` into the top-level project directory and install the frontend dependencies
```
npm install
```

In your top project directory, create a new Python virtual environment and activate that environment. 

### Install Backend Dependencies
```
pip install -r requirements.txt 
```

You can either add your configuration-specific variables directly to the ```config.py``` file, or create a ```.env``` file as I have done (I know it's slightly redundant), and add those variables there. I have done this so that I can show in ```config.py``` exactly what variables are needed. 

Variables needed in ```.env```: 

```
# Zoom Specific Config:
CLIENT_ID = 'CLIENT_ID from Zoom account'
CLIENT_SECRET = 'CLIENT_SECRET from Zoom account'

SDK_KEY = 'Same as CLIENT_ID'
# If your Zoom app includes a specific SDK_KEY, use that. However, most new Zoom Apps use CLIENT_ID instead and will not have a specific SDK_KEY

AUTH_URL = 'https://zoom.us/oauth/authorize'    
ACCESS_TOKEN_URL = 'https://zoom.us/oauth/token'
ZOOM_API_URL = 'https://api.zoom.us/v2/'

# Database URI 
SQLALCHEMY_DATABASE_URI = 'path to db'

# Secret for db
SECRET_KEY = 'SomeSuperSecret'

# Secret for session JWT
JWT_SECRET_KEY = 'SuperSecretJWTSecretKey'

```

As you can see, I have included the base URLs for Zoom endpoints in the ```.env``` file so that I have only one place to update if those URLs change. However, you can easily not use these and just add them specifically into ```zoom_oauth.py``` and ```zoom_apis.py```. 

# Start Servers: 

### Start backend
Open a terminal, with the virtual environment activated, and run:
```
flask run
```
Alternatively, you can use npm with:
```
npm run start-api
```
This works because a ```"start-api"``` script has been added to ```project.json```

The flask server will run on localhost:5000 by default.

### Start frontend
Open a second terminal and use: 
```
npm start
```

The React frontend will run on localhost:3000 by default. After ```npm start```, if the browser does not open automatically, open your browser and navigate to http://localhost:3000. 

