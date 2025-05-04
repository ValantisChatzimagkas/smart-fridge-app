# Smart Fridge App

### Description
This app was developed by having 2 things in mind
1. Solve food waste
2. Trying to find a project where I could get my hands on React

## 🚧 Roadmap

### 🎨 UI

| Feature/Task                                                                                                                                         | Description                       | Status | Priority |
|------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|--------|----------|
| Register a product with barcode photo upload                                                                                                         |                                   | X      | HIGH     |
| Testing                                                                                                                                              | Write tests for the crucial parts | X      | HIGH     |
| Register new product                                                                                                                                 |                                   | X      | HIGH     |
| Create/Register account                                                                                                                              |                                   | X      | HIGH     |
| Login                                                                                                                                                |                                   | X      | HIGH     |
| Refactor UI from take photo component                                                                                                                |                                   | X      | MEDIUM   |
| Add logic to take photo and specify that in this photo we have for example expiry date, this will be send to API on the OCR endpoint to be processed |                                   | X      | MEDIUM   |
| Refactor and display filter and take photo components in a better UX way                                                                             |                                   | X      | LOW      |

### 🛠 BACKEND

| Feature/Task                           | Description                                                                                                                                                                                                       | Status | Priority |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
| Authentication Endpoint                |                                                                                                                                                                                                                   | X      | HIGH     |
| OCR Endpoint                           | Endpoint that will use OCR to scan an image and fetch specified data from image. E.g. when sending request specify that we scan for field expiry date so that we bind the expiry date field with the scanned info | X      | MEDIUM   |
| Testing                                | Write tests for the crucial parts                                                                                                                                                                                 | X      | HIGH     |
| Protect endpoints via authentication   |                                                                                                                                                                                                                   | X      | HIGH     |
| Ingredient status transition           | Implement service that processes ingredients and sets their status to expired or close to expire                                                                                                                  | X      | MEDIUM   |
| Expire/Close to expire alerts          | Implement service that sends alerts about expired or close to expire alerts                                                                                                                                       | X      | MEDIUM   |
| Close to expire recipes recommendation | Use a database that can recommend recipes using the close to expire products                                                                                                                                      | X      | LOW      |

