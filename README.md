# MovieApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.






### Updated full documentation – including your Netlify `_redirects` journey

Below is a **single, self‑contained doc** that now includes:

- The earlier **Netlify `_redirects` / Angular routing** story (from ChatGPT and Netlify logs), and  
- Everything we did together (mixed content, API Gateway, CORS, rebuilds, etc.).

---

## 0. Netlify SPA routing & `_redirects` (before API issues)

### 0.1 Problem: Angular routes working locally, but 404 on Netlify

- You had an Angular app (e.g. `/movies`, `/details/1`, etc.) that worked locally.
- On Netlify:
  - The **root** (`/`) loaded fine.
  - Directly opening or refreshing a **deep link** like `/movies` or `/details/1` showed Netlify’s:

    > “Page not found – Looks like you’ve followed a broken link or entered a URL that doesn’t exist on this site.”

- Netlify build logs for multiple deploys showed:

  - **“No redirect rules processed”**
  - **“No header rules processed”**
  - No functions, no edge functions.
  - Deploy file browser showed:
    - `public/`
    - `src/`
    - `angular.json`, `package.json`, `tsconfig.*`, etc.
  - But **no `_redirects` file** in the final publish directory.

**Why this happens:**

- Angular is a **Single Page Application**.
- Routing is handled on the client by Angular.
- When you open `/some/route` directly on Netlify, Netlify tries to serve a **real file** at that path:
  - If none exists, it returns **404**.
- For SPA routing on Netlify, you must:
  - Always serve `index.html` for any path, and
  - Let Angular handle the route internally.

This is exactly what Netlify `_redirects` is for.

---

### 0.2 First attempt: Create `_redirects` but not included in build

You created an `_redirects` file with content like:

```text
/* /index.html 200
```

But Netlify’s deploy logs said:

- “**No redirect rules processed**”

This meant:

- Either `_redirects` was **not in the published directory**, or
- It wasn’t in a location Netlify copies to that directory (for Angular).

You tried instructions like:

- “Move `_redirects` into `src/assets/` – Path: `src/assets/_redirects`”
- But Angular’s build system only copies what’s configured in `angular.json` `assets`.

So the core issue: `_redirects` existed in your repo, but Angular was not copying it into `dist/movie-app/browser`, and so Netlify never saw it.

---

### 0.3 Angular + Netlify: Making `_redirects` land in the publish directory

You are using:

- Angular 18+
- Netlify auto‑detection with Angular.
- Publish directory: `dist/movie-app/browser`

Angular’s `angular.json` contained an `assets` section under `build.options`, something like:

```json
"assets": [
  {
    "glob": "**/*",
    "input": "public"
  }
]
```

To get `_redirects` into `dist/movie-app/browser`, you (following guidance) added another asset entry, for example:

```json
"assets": [
  {
    "glob": "**/*",
    "input": "public"
  },
  {
    "glob": "_redirects",
    "input": "src/netlify",
    "output": "/"
  }
]
```

Or equivalently (depending on how you organized your project), you might have:

- `_redirects` at `src/_redirects`, and:

  ```json
  "assets": [
    {
      "glob": "**/*",
      "input": "public"
    },
    {
      "glob": "_redirects",
      "input": "src"
    }
  ]
  ```

Or:

- `_redirects` at `src/assets/_redirects`, and:

  ```json
  "assets": [
    {
      "glob": "**/*",
      "input": "public"
    },
    {
      "glob": "_redirects",
      "input": "src/assets"
    }
  ]
  ```

**Key idea:** any setup is fine *as long as*:

- `_redirects` is copied into the root of your **publish directory** (`dist/movie-app/browser/_redirects`).

---

### 0.4 Netlify logs before and after

**Before:**

- Several deploys showed:

  - “No redirect rules processed”
  - “No header rules processed”

- File browser for deploys did *not* list `_redirects`.

**After updating `angular.json` assets + placing `_redirects` correctly:**

- The `_redirects` file was included in the deploy artifact.
- Netlify started processing redirect rules (you’d see messages indicating redirects being applied in more advanced setups).
- SPA routes stopped 404‑ing:
  - `/* /index.html 200` ensured that any path returns `index.html`, and Angular router took over.

At that point, your **Angular routing on Netlify was fixed**.  
The remaining/next problems were purely about **calling your backend API**.

---

## 1. Initial API Setup & Mixed Content Problem

(From here on is the story we went through together.)

### 1.1 Starting architecture

- **Frontend**: Angular app on Netlify  
  `https://comfy-cucurucho-3287de.netlify.app`
- **Backend**: Spring Boot app on AWS EC2  
  `http://13.51.176.215:8080/movie`

Your Angular app called:

```ts
GET http://13.51.176.215:8080/movie
```

from the Netlify-hosted page.

### 1.2 Mixed content error

Browser console:

> Mixed Content: The page at 'https://comfy-cucurucho-3287de.netlify.app/' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://13.51.176.215:8080/movie'. This request has been blocked; the content must be served over HTTPS.

Explanation:

- HTTPS page **cannot** call HTTP API directly.
- This is blocked before CORS even matters.

We decided to fix this by:

- Putting **AWS API Gateway** (HTTP API) in front of your EC2 backend,
- Getting an **HTTPS** URL from AWS, and
- Updating Angular to call that URL.

No Netlify Functions, no custom domain needed.

---

## 2. Building API Gateway in Front of EC2

### 2.1 Create HTTP API in API Gateway

In AWS Console:

- **API Gateway → Create API → HTTP API**
- Name: `movie-watchlist-api`
- Integrations:
  - Type: **HTTP**
  - Endpoint URL: `http://13.51.176.215:8080`
- Route:
  - Method: `ANY`
  - Path: `/{proxy+}`
  - Integration target: the HTTP integration above.
- Stage:
  - `$default`
  - Auto‑deploy: **enabled**.

After creation, you got:

```text
Invoke URL: https://17cygbwcij.execute-api.eu-north-1.amazonaws.com
```

So:

```text
https://17cygbwcij.execute-api.eu-north-1.amazonaws.com/movie
```

should reach your backend.

### 2.2 404 Whitelabel error via API Gateway

When you opened:

```text
https://17cygbwcij.execute-api.eu-north-1.amazonaws.com/movie
```

you got Spring’s **Whitelabel Error Page, 404**.

Root cause:

- Route was `/{proxy+}`.
- Integration URI was `http://13.51.176.215:8080`.
- API Gateway was not appending the `{proxy}` to the backend URL.

**Fix:**

- Edit Integration URI to:  

  `http://13.51.176.215:8080/{proxy}`

Now:

- `/movie` on API Gateway → `proxy = "movie"` → backend `http://13.51.176.215:8080/movie`.
- `/movie/1` → `proxy = "movie/1"` → `http://13.51.176.215:8080/movie/1`.

---

## 3. CORS Between Netlify and API Gateway

### 3.1 Browser CORS error

Once routing was correct, you saw:

```text
Access to XMLHttpRequest at 'https://17cygbwcij.execute-api.eu-north-1.amazonaws.com/movie'
from origin 'https://comfy-cucurucho-3287de.netlify.app' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This was **browser CORS** (Netlify → API Gateway).

### 3.2 Enabling CORS in API Gateway

You configured CORS in API Gateway:

- **Access-Control-Allow-Origin**: `https://comfy-cucurucho-3287de.netlify.app`
- **Access-Control-Allow-Headers**: `*` (or at least `Content-Type`)
- **Access-Control-Allow-Methods**: `GET, POST, PUT, DELETE`
- **Access-Control-Max-Age**: `3600`
- **Access-Control-Allow-Credentials**: `NO`

After saving this config, API Gateway:

- Responded to preflight requests.
- Added the correct CORS headers for the browser.

---

## 4. CORS Between API Gateway and Spring Boot

### 4.1 New error: 403 Invalid CORS request

Now the browser could talk to API Gateway, but the **backend** replied:

```text
status: 403
error: "Invalid CORS request"
```

This message is from **Spring Boot**, not from AWS.

#### 4.1.1 Your original backend CORS config

`CorsConfig.java` initially:

- Only allowed `http://localhost:4200`.
- Used both:
  - `WebMvcConfigurer.addCorsMappings`, and
  - A manual `CorsFilter` bean.

We adjusted it multiple times:

1. Added Netlify origin.
2. Tried `allowedOriginPatterns("*")` with `allowCredentials(true)` (which Spring dislikes).
3. Realized both WebMvcConfigurer + `CorsFilter` was too much.

#### 4.1.2 Final stable backend CORS config

The working version became:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:4200",
                        "https://comfy-cucurucho-3287de.netlify.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

- No extra `CorsFilter`.
- Only MVC‑level CORS.

But there was still one more hidden issue…

---

## 5. The Hidden Issue: Not Rebuilding the Backend

### 5.1 Backend JAR not updated

Even after we had the correct `CorsConfig.java`, calls to:

```text
https://17cygbwcij.execute-api.eu-north-1.amazonaws.com/movie
```

still caused `403 Invalid CORS request`.

Reason:

- The JAR running on EC2 was **old**.
- You hadn’t rebuilt after editing `CorsConfig.java`.

Once you realized this, you ran:

```bash
./mvnw clean package -DskipTests
```

Then:

- Deployed the new JAR to EC2.
- Restarted Spring Boot.

Now, with the new JAR running:

- Spring Boot respected the new `CorsConfig`.
- API Gateway → EC2 CORS was fine.
- Browser → API Gateway CORS was fine.

You said:

> "now that this time i executed that command without deleing corsconfig it worked perfect"

That was the final missing piece.

---

## 6. Angular Frontend: Using the API Gateway URL

### 6.1 Old vs new URL

Originally:

```ts
private baseUrl = 'http://13.51.176.215:8080/movie';
```

This caused mixed content.

You changed it to:

```ts
private baseUrl = 'https://17cygbwcij.execute-api.eu-north-1.amazonaws.com/movie';
```

(or via `environment.prod.ts` → `apiUrl`)

Then:

```ts
this.http.get(environment.apiUrl);
```

### 6.2 Rebuild & redeploy Angular

You rebuilt and redeployed:

- `npm run build` or `ng build --configuration production`
- Published `dist/movie-app/browser` to Netlify.

With:

- Netlify `_redirects` (SPA routing) working.
- Frontend calling the API Gateway HTTPS endpoint.
- API Gateway proxying to EC2.
- Backend CORS config deployed and correct.

The app finally worked end‑to‑end.

---

## 7. Final Architecture & Checklist

### 7.1 Final request flow

1. User opens:  
   `https://comfy-cucurucho-3287de.netlify.app`
2. Angular app requests:

   ```text
   GET https://17cygbwcij.execute-api.eu-north-1.amazonaws.com/movie
   ```

3. API Gateway:
   - Validates CORS for `https://comfy-cucurucho-3287de.netlify.app`.
   - Forwards to:

     ```text
     http://13.51.176.215:8080/movie
     ```

4. Spring Boot:
   - `CorsConfig` allows the origin.
   - `MovieController` returns movie list.

5. Response returns through API Gateway to the browser.

### 7.2 Netlify routing summary

- `_redirects` with:

  ```text
  /* /index.html 200
  ```

- Included in final build output via `angular.json` `assets` config.
- Fixes `Page not found` on deep routes.

### 7.3 Backend CORS summary

- Single config via `WebMvcConfigurer` (`CorsConfig.java`).
- Allows:
  - `http://localhost:4200`
  - `https://comfy-cucurucho-3287de.netlify.app`
- Methods: `GET, POST, PUT, DELETE, OPTIONS`
- Headers: `*`
- `allowCredentials(true)`.

### 7.4 API Gateway CORS summary

- HTTP API with:
  - `ANY /{proxy+}` route.
  - Integration: `http://13.51.176.215:8080/{proxy}`.
- CORS:
  - Origin: `https://comfy-cucurucho-3287de.netlify.app`
  - Methods: `GET, POST, PUT, DELETE`
  - Headers: `*`.

### 7.5 Muscle memory / mental cheatsheet

- **SPA routing**:
  - `_redirects` in publish dir with `/* /index.html 200`.
  - Angular `assets` config ensures `_redirects` is copied.

- **Mixed content**:
  - HTTPS frontend cannot call HTTP backend → use HTTPS URL (API Gateway, etc.).

- **CORS**:
  - Browser CORS: frontend ↔ API Gateway.
  - Backend CORS: API Gateway ↔ Spring Boot.
  - Don’t forget to **rebuild and redeploy** when you change backend code.

---

If you want, next I can help you turn this doc into a proper `README.md` in your Angular repo and/or backend repo, or even into a `.cursor/rules` file so future you gets context automatically inside Cursor.


