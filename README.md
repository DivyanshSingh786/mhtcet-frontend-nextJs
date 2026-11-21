# MHT-CET Computer-Based Mock Test Platform — Frontend

Frontend web application for the **MHT-CET Mock Test Platform**, built with **Next.js (App Router)** and **Tailwind CSS**, connecting to a Spring Boot + Spring Cloud microservices backend routed through an API Gateway.

## Features & Exam Rules

- **Streams Supported:**
  - **PCM (Physics, Chemistry, Mathematics)** — 150 Questions, 200 Marks
  - **PCB (Physics, Chemistry, Biology)** — 200 Questions, 200 Marks
- **Sectional Structure & Locking:**
  - **Section 1:** Physics & Chemistry (90-minute countdown; locks upon transition/expiry)
  - **Section 2:** Mathematics / Biology (90-minute countdown; submits for evaluation)
- **MHT-CET Marking Scheme:**
  - **Mathematics:** `+2` marks per correct answer
  - **Physics, Chemistry, Biology:** `+1` mark per correct answer
  - **Negative Marking:** `0` (Zero negative marking)
- **CBT Workspace & Navigation:**
  - Live countdown timer with automatic section transition / submission on expiry
  - Question palette showing **Answered**, **Mark for Review**, and **Unvisited** states
  - Auto-saving answers to the backend attempt engine

## Application Routes

| Route | Purpose |
| :--- | :--- |
| `/` | Landing page & exam overview |
| `/login` | User registration and authentication |
| `/dashboard` | Stream selection (**PCM** / **PCB**) and test attempt launch |
| `/exam/[attemptId]` | Split-screen CBT test interface with timer, section lock, and question palette |
| `/result/[attemptId]` | Evaluated score summary and breakdown |
| `/admin/questions` | Admin form to add new MCQs (Std XI / Std XII, subject, options, answer, explanation) |

## Tech Stack

- **Framework:** Next.js 16 (App Router, Cache Components)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios (`src/lib/api.js`)
- **Icons:** Lucide React (`lucide-react`)
- **Backend Mesh:** Spring Boot, Spring Cloud Gateway, Eureka Service Discovery, Identity Service, Question Bank Service, Test Engine Service, Evaluation Service

## Environment Variables

Configure the API Gateway base URL for API requests/rewrites:

```env
API_GATEWAY_URL=[https://mhtcet-gateway.onrender.com](https://mhtcet-gateway.onrender.com)