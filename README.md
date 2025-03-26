# FluxBoard - Workflow Automation Builder

FluxBoard is a **visual workflow automation tool** that allows users to **create, visualize, and manage workflows** using an interactive **drag-and-drop interface**. Built with **Next.js**, **React Flow**, and **Zustand**, it enables seamless task execution, decision-making, and automation. You can try it out live at [https://flux-board.vercel.app/](https://flux-board.vercel.app/).

## 🚀 Features

- **Drag-and-Drop Workflow Builder** – Create workflows effortlessly.
- **Dynamic Node Configuration** – Customize node properties with an intuitive side panel.
- **Undo/Redo Support** – Easily revert or reapply changes.
- **Export & Import Workflows** – Save and load workflows using JSON.
- **Real-Time Visualization** – View workflow updates dynamically.

---

## 🛠 Running the Project Locally

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v14+ recommended)
- **npm** or **Yarn**

### **Installation & Setup**

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/KoundinyaSi/flux-board.git
   cd flux-board

   ```

2. **Install Dependencies:**

   ```sh
   npm i -g pnpm
   pnpm i

   ```

3. **Run the development server**

   ```sh
   npm run dev
   # or
   pnpm dev

   ```

4. Open your browser and go to: [localhost:3000](http://localhost:3000)

## 🎨 Design Decisions & Trade-offs

### **1️⃣ Using Next.js Instead of React**

- **Reason:** Next.js provides **better performance optimizations** (automatic code-splitting, static asset handling).
- **Trade-off:** Since the app is **entirely client-side**, we had to ensure all Next.js pages were marked with `"use client"`.

### **2️⃣ State Management with Zustand**

- **Reason:** Zustand provides a **lightweight, scalable, and easy-to-use store** without the boilerplate of Redux.
- **Trade-off:** We don't get deep middleware support like Redux, but for this project, **simplicity and performance were prioritized**.

### **3️⃣ Using React Flow for the Workflow Canvas**

- **Reason:** React Flow is designed for **graph-based UIs**, making it **ideal for workflows**.
- **Trade-off:** **Custom styling and logic require additional effort** compared to building from scratch.

---

## 🤔 Assumptions Made

- **Workflows are JSON-based**, meaning every node and edge configuration is stored in a structured JSON format.
- **Users can edit workflows inline**, modifying nodes without opening additional popups.
- **Performance is prioritized** over excessive UI animations.
- **Nodes can be freely connected**, assuming that users will define logic constraints externally.
