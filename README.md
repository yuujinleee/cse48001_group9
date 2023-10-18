### :page_with_curl:	Proposal
* [PDF view (Github)](docs/CSE480_Proposal_Group9_221017.pdf)
* [Google Docs link](https://docs.google.com/document/d/18dilh_sAA87E7V734PDR1JR0AAmdJRAlK0BP4gnwSkk/edit#heading=h.13f4glvfzc07)

### :page_with_curl: Wireframe
*  [PDF view (Github)](docs/Pixey3D_Wireframe.pdf)

### Tentative Schedule
+----------------------------------------+--------------+------------+
|                 Task                 | Start Date   | End Date   |
+----------------------------------------+--------------+------------+
| High-Fidelity UI design (Figma)       | Oct 17th     | Oct 26th   |
| Session Creation and Management       | Oct 26th     | Nov 1st    |
| 3D Annotations                        | Oct 26th     | Nov 1st    |
| Real-time Collaboration & Auto-save   | Nov 2nd      | Nov 8th    |
| User Interaction (Annotation)        | Nov 2nd      | Nov 8th    |
| User Management System & Authentication| Nov 9th    | Nov 15th   |
| Mobile Compatibility (Responsive Design)| Nov 9th    | Nov 15th   |
| (Optional) Feedback Thread            | Nov 16th     | Nov 22nd   |
| Testing and Quality Assurance         | Nov 23rd     | Nov 29th   |
| Final Review and Documentation        | Nov 30th     | Dec 5th    |
+----------------------------------------+--------------+------------+


# Set Up Guide
1. (Node.js) Check node.js version (20.6.1)

   ```$ node -v``` 
   
   if its not 20.6.1, install/update node.js with commands below
   
   (install) `$sudo npm install -g n`
   (update) `$sudo n latest`

    ![E1BEF166-8EA8-4729-AB88-270E38454243](https://github.com/yuujinleee/cse48001_group5/assets/38070937/82c5523a-4e40-4b3d-80db-591d9e816259)


2. (Vite) `$npm install` and `$npm run dev` to test

   * Getting Started | Vite : https://vitejs.dev/guide/
   ![52CB8AEA-14B2-458D-9463-DF838956AAD3](https://github.com/yuujinleee/cse48001_group5/assets/38070937/3affafb5-474b-48e2-b6ff-c7b0749e8a12)

   After `$npm run dev`, access the local host address (e.g. `http://localhost:xxxx/`).
   Whenever you save on VScode, the website auto-refreshes. 


3. Install VScode extensions
   1. React Native Tools by Microsoft 
   2. Simple React Snippets
   3. ESLint by Microsoft
   4. JavaScript and TypeScript Nightly by Microsoft
   5. Prettier


--- 

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
