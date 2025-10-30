# Contact Importer

A simple app to bulk import, map, and review contact data for a CRM.

**Live app:** [https://kendal-ai-contact-importer.vercel.app/login](https://kendal-ai-contact-importer.vercel.app/login)

---

## What Does It Do?

- Lets you import spreadsheets (.csv, .xlsx) of contacts.
- Automatically matches your file’s columns to CRM fields.
- Lets you adjust the mappings (fix mistakes, add custom fields).
- Checks for duplicates or missing info.
- Imports all valid contacts and gives you a summary of what was added, merged, or skipped.

---

## How to Use

1. **Start the app:**

   ```bash
   npm install
   npm run dev
   ```

   Go to [http://localhost:3000](http://localhost:3000).

2. **Go to the dashboard’s Import section.**
3. **Upload your contact file** (CSV or Excel).
4. **Step 1: Detected Fields**

   - See which columns were found and matched.
   - Review a sample of the detected data.

5. **Step 2: Map Fields**

   - Double-check the suggested CRM field for each column from your file.
   - Change the mapping or add custom fields if needed.
   - Must map all required fields: First Name, Last Name, Email, Phone.

6. **Step 3: Final Checks**

   - See warnings for any problems (duplicates, missing info).
   - Confirm to import.
   - Get a summary: how many contacts were created, merged (updated), or skipped.

7. **Done!**
   - Your contacts are now available in the Contacts tab.
   - You can search, view, and manage them there.

---

## Features

- **Smart Field Mapping:** Suggests the best match between your file’s columns and CRM fields, accounts for common variations, and highlights anything that needs attention.
- **Custom Fields:** You can map columns to existing fields or create new custom ones.
- **Duplicate Handling:** Existing contacts (by email/phone) are updated instead of duplicated.
- **User Assignment:** If your data has an agent/owner column, those contacts are linked automatically.

---

## Tech Stack

- [Next.js](https://nextjs.org/) & [React](https://react.dev/) (frontend)
- [Firebase](https://firebase.google.com/) (backend/storage)
- [PapaParse](https://www.papaparse.com/), [xlsx](https://www.npmjs.com/package/xlsx) (file parsing)
- [Lucide](https://lucide.dev/), [TailwindCSS](https://tailwindcss.com/) (UI)

---

## Tips

- Use clean column headers in your spreadsheet for best results.
- Required columns: First Name, Last Name, Email, Phone.
- Can handle both CSV and Excel files.

---

## For Developers

- **Scripts:**

  - `npm run dev` – Start dev server.
  - `npm run build` – Build for production.
  - `npm run start` – Start production server.
  - `npm run lint` – Check for code issues.
