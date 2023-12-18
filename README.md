# Pixey 3d : Web-based Real-time 3D Collaboration App

![image](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmlhMnZ1OHpybHoyeDh6azhxd2JrejRvZTQ3cnJibWQ1NGlhNHY0eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DcmYSTZWG7Il1TxvVb/giphy.gif)

### :page_with_curl:	Proposal
* [PDF view (Github)](docs/CSE480_Proposal_Group9_221017.pdf)
* [Google Docs link](https://docs.google.com/document/d/18dilh_sAA87E7V734PDR1JR0AAmdJRAlK0BP4gnwSkk/edit#heading=h.13f4glvfzc07)

### :page_with_curl:	Final Presentation
* [PDF view (Github)](docs/Pixey_Final_Presentation.pdf)

### 🎨 Wireframe UI design
*  [PDF view (Github)](docs/Pixey3D_Wireframe.pdf)

### 🎨 Figma UI design
* `*.fig` file at `/docs`
* [View on web](https://www.figma.com/file/jN2AarxuyrYHMZNVVM2nI8/Pixey3d_UIdesign_221012?type=design&node-id=0-1&mode=design&t=gfBADVId0WhA5ONB-0) 	


# Set Up Guide
1. Run `$npm install` to install the modules
2. Run `$npm run dev` and access the local host address (e.g. `http://localhost:xxxx/`).

# Implementation Details with Key Features
![image](https://github.com/yuujinleee/cse48001_group9/assets/38070937/758638ce-9632-4640-8c9f-ce31b1d7982d)
* Note that Tailwind CSS is not used!

### 1. Session Creation and Management
Users can initiate sessions by uploading a 3D model via drag and drop or by browsing the finder, and it will generate a unique session link for inviting participants to join the session.
> Tech-used : Supabase, React

### 2. 3D Annotations
In the session, the 3D model is rendered and shown in the center. Users can rotate and zoom the 3D scene with mouse interactions to see the 3D model in different angles.
Users can create 3D annotations directly on the model by clicking on it. An annotation is generated within the 3D scene, meaning it adjusts its position as the user rotates the 3D scene.
Each annotation includes username, a unique ID, text content, a timestamp, and a color-coded status. Color-coded status comprises red (indicating ‘unsolved’), yellow (indicating ‘in progress’), or green (indicating ‘solved’). On the right of the webpage, there is an ‘Annotations’ panel where all the annotations are shown in a form of text box.
> Tech-used : Three.js, React-three-fiber, Model-viewer, TypeScript, React, Supabase

### 3. Real-time Collaboration & Auto-save
The changes that users make in a session are automatically saved and shown to other users in the session real-time, promoting effective communication and feedback and preventing data loss.
> Tech-used : Supabase, WebSocket, React

### 4. User Management System & Authentication
The service requires users to sign up before using the service to ensure the security.
User registration, log-in, CRUD and account management for saving the data of created sessions. 
> Tech-used : Supabase, Passport.js, React, OAuth2

### 5. Responsive Design
The design layout is implemented responsively so that it supports most of the tablet and desktop aspect ratio.
> Tech-used : CSS, React



