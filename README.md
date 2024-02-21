# Sample Zoom OAuth and Web SDK App

This app is intended to serve as an example of how you can build integrations with Zoom. This app uses Zoom's APIs and the Web SDK. The front end is built with React 18.2.0 and the back end with Flask 3.0 and Python 3.10.9. 

This app represents an example flow, where a customer can register an account with your application, or log in with a previously registered account.
Once registered and logged into the app, you will initiate the Zoom authorization process by clicking the button on a simple user dashboard.

<img width="1022" alt="Dashboard" src="https://github.com/PandaBacon21/zoom-oauth-meetingSDK-app/assets/98666603/3f4c29ea-23dc-4ee6-8366-d006fdcadf6d">

When clicked, you will be redirected to the page below to authorize your app with your Zoom account. If you're not already logged into your Zoom account, you will sign in first, and then authorize the application. 

![zoom-redirect](https://github.com/PandaBacon21/zoom-oauth-meetingSDK-app/assets/98666603/d5b45d33-aabc-4bd3-8ef2-fbe6017a1e7e)

After authorization, the page will redirect back to the dashboard where you will have a new section to get your account info. Clicking this will display basic account details (you can change these details that you want to send back to the frontend in ```zoom_api.py``` and then you will need to also update the ```ZoomInfo.js``` file to handle the updated data). This will also then populate a new section to allow you to create a meeting. 

<img width="1491" alt="CreateMeeting" src="https://github.com/PandaBacon21/zoom-oauth-meetingSDK-app/assets/98666603/a9deaf39-3d88-41d1-bcce-9690ca6c71fe">

Upon clicking the Create Meeting button, it will display the meeting title (currently just a hard-coded title) as well as the meeting number. The button will then change to say Start Meeting. 

Upon clicking Start Meeting, it will then initiate a Zoom meeting in the browser via the Zoom Meeting SDK. 

![zoom-meeting](https://github.com/PandaBacon21/zoom-oauth-meetingSDK-app/assets/98666603/690d4764-c83f-456a-8e91-00409de0393e)


# Zoom Info

- Zoom API Documentation - https://developers.zoom.us/docs/api/
- Zoom Meeting SDK - https://marketplacefront.zoom.us/sdk/meeting/web/index.html
- Create a new OAuth app in your Zoom account - https://developers.zoom.us/docs/integrations/
  - Scopes required:
    - account:read:admin
    - user:read:admin
    - meeting:write:admin

Other scopes can be added if you intend to customize this further. 

Add the redirect URL to your app's basic information section, and take note of the Client ID and Client Secret, as you will use those in configuring the app.

![zoom-app-basic-info](https://github.com/PandaBacon21/zoom-oauth-meetingSDK-app/assets/98666603/a59163df-49f7-4e12-8ac9-01f163ae34eb)


# Installation 
Clone this project 
```
git clone https://github.com/PandaBacon21/zoom-oauth-meetingSDK-app.git
```

```cd``` into the frontend directory and install the frontend dependencies
```
npm install
```

In your top-level directory, create a new Python virtual environment and activate that environment. 

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

# License

This app is intended as an example, and is not intended to be cloned for any production purposes. Use of Zoom's API and SDK is subject to [Zoom Terms of Use](https://explore.zoom.us/en/legal/zoom-api-license-and-tou/)
