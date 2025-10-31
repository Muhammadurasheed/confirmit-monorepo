# 🏆 Hedera Africa Hackathon 2025 - Submission Checklist

## ⚠️ MANDATORY REQUIREMENTS

### ✅ 1. GitHub Repository Requirements

- [ ] **Public Non-Organization Repository**
  - Repository is PUBLIC (not private)
  - Repository is NOT under an organization account
  - Repository is under a personal GitHub account
  - ⚠️ **Private repos will be automatically disqualified**

- [ ] **Fresh Repository**
  - Repository created during the hackathon period
  - First commit date is within hackathon dates (check `git log --reverse`)
  - Not a pre-existing project moved to new repo

- [ ] **Well-Structured README.md**
  - Clear project description
  - Problem statement explained
  - Solution overview
  - Tech stack detailed
  - Setup instructions (step-by-step)
  - Hedera integration documented
  - Architecture diagrams/explanations
  - Demo links included
  - Team information
  - **Pitch deck link added**
  - **Certification link added**

- [ ] **Good Coding Practices**
  - Clean, readable code
  - Modular structure (not spaghetti code)
  - Comments where necessary
  - Consistent naming conventions
  - Proper error handling
  - No sensitive data (API keys) in commits

---

### ✅ 2. Collaborator Access (MANDATORY!)

- [ ] **Invite Hackathon Email as Collaborator**
  - Email invited: `Hackathon@hashgraph-association.com`
  - Collaborator access confirmed (check Settings → Collaborators)
  - Email invitation accepted (wait for confirmation)
  
  **Steps:**
  1. Go to your GitHub repo
  2. Click **Settings** → **Collaborators**
  3. Click **Add people**
  4. Enter: `Hackathon@hashgraph-association.com`
  5. Click **Add**
  6. Verify the email appears in your collaborators list

  ⚠️ **This is mandatory for AI-assisted judging to work!**

---

### ✅ 3. Pitch Deck & Certification Links in README

- [ ] **Pitch Deck Link**
  - Pitch deck uploaded (Google Slides, PDF, Canva, etc.)
  - Link added to README.md under "Pitch Deck & Certification" section
  - Link is publicly accessible (not restricted)
  
  Example:
  ```markdown
  ### 📽️ Pitch Deck
  **Presentation Slides**: [View Pitch Deck](https://docs.google.com/presentation/d/your-deck-id)
  ```

- [ ] **Hedera Developer Certification**
  - Certification completed on Hedera Learning Platform
  - Certification ID obtained
  - Certification link/profile added to README.md
  
  Example:
  ```markdown
  ### 🎓 Hedera Developer Certification
  **Certification ID**: HDC-2025-123456
  **Profile Link**: [View Certificate](https://learn.hedera.com/certificate/your-id)
  ```

---

### ✅ 4. DoraHacks Submission

- [ ] **Watch the Official Tutorial Video**
  - Video watched completely: [Tutorial Link](#)
  - Understood submission process
  - Noted custom question requirements

- [ ] **Register on DoraHacks**
  - Account created
  - Profile completed
  - Team members registered (if applicable)

- [ ] **Submit Project on DoraHacks**
  - Project title submitted
  - Project description completed
  - GitHub repo link added
  - Demo video link added (if available)
  - Team members added (if applicable)
  - **Only one team member submits** (designated representative)
  - Custom questions answered (certification, account ID, etc.)

- [ ] **Submission Deadline**
  - Submitted before **31/10/2025 at 23:59**
  - Confirmation email received

---

### ✅ 5. Hedera Integration Requirements

- [ ] **Hedera Testnet Integration**
  - Hedera account created (portal.hedera.com)
  - Account ID documented in README
  - Private key secured (NOT in GitHub)
  - Testnet HBAR obtained (if needed)

- [ ] **Hedera Consensus Service (HCS) Usage**
  - HCS implemented for data anchoring
  - Topic ID documented
  - Transaction IDs recorded
  - Explorer links provided (hashscan.io)

- [ ] **Hedera Token Service (HTS) Usage** (if applicable)
  - Token created on Hedera
  - Token ID documented
  - NFT minting implemented (if applicable)
  - Token explorer links provided

- [ ] **Hedera SDK Integration**
  - @hashgraph/sdk installed
  - Client configuration correct (testnet)
  - Transaction functions working
  - Error handling implemented

---

### ✅ 6. Documentation Quality

- [ ] **README.md is Comprehensive**
  - Professional formatting (badges, images, emojis)
  - Table of contents
  - Clear sections (Problem, Solution, Tech Stack, Setup, etc.)
  - Code examples included
  - Architecture diagrams (optional but recommended)
  - Screenshots/GIFs of the app (optional but recommended)

- [ ] **Setup Instructions Work**
  - Step-by-step instructions tested
  - Prerequisites listed
  - Environment variables documented (without exposing secrets)
  - Commands are copy-pasteable
  - Expected outputs shown

- [ ] **API Documentation** (if applicable)
  - API endpoints listed
  - Request/response examples
  - Authentication explained
  - Swagger/OpenAPI docs linked (if available)

---

### ✅ 7. Code Quality Checks

- [ ] **No Sensitive Data in Repo**
  - `.env` file NOT committed
  - `.gitignore` properly configured
  - API keys NOT in code
  - Private keys NOT in code
  - Database credentials NOT exposed

- [ ] **Dependencies are Clear**
  - `package.json` / `requirements.txt` complete
  - All dependencies listed
  - Lock files committed (`package-lock.json`, `poetry.lock`, etc.)

- [ ] **Code Runs Locally**
  - Fresh clone tested
  - Setup instructions followed
  - Application runs without errors
  - All features functional

---

### ✅ 8. Demo & Presentation

- [ ] **Live Demo Available**
  - App deployed and accessible
  - URL added to README
  - Demo is stable (no crashes)

- [ ] **Demo Video Created** (optional but recommended)
  - Video shows key features
  - Video shows Hedera integration
  - Video is 2-5 minutes long
  - Video uploaded to YouTube/Loom
  - Link added to README

- [ ] **Pitch Deck Complete**
  - Problem clearly stated
  - Solution demonstrated
  - Tech stack explained
  - Hedera integration highlighted
  - Team introduced
  - Market opportunity shown
  - Roadmap outlined

---

## 📝 Pre-Submission Checklist

**The Night Before Submission:**

- [ ] Test your GitHub repo link (incognito mode)
- [ ] Test your live demo link (incognito mode)
- [ ] Test your pitch deck link (incognito mode)
- [ ] Test your demo video link (incognito mode)
- [ ] Verify `Hackathon@hashgraph-association.com` is in collaborators
- [ ] Ensure README has pitch deck + certification links
- [ ] Double-check all links are public (not restricted)
- [ ] Take a deep breath 😌

**1 Hour Before Deadline:**

- [ ] Final README proofread
- [ ] All links tested one more time
- [ ] DoraHacks submission reviewed
- [ ] Screenshot of successful submission taken
- [ ] Confirmation email saved

---

## 🚨 Common Mistakes to Avoid

1. ❌ **Private Repository** → Make it PUBLIC!
2. ❌ **Forgot to add collaborator** → Add `Hackathon@hashgraph-association.com`!
3. ❌ **No certification link in README** → Add it under "Pitch Deck & Certification"!
4. ❌ **No pitch deck link in README** → Add it!
5. ❌ **Broken demo link** → Test in incognito mode!
6. ❌ **API keys in code** → Use environment variables!
7. ❌ **Incomplete setup instructions** → Test with a fresh clone!
8. ❌ **Missing Hedera integration details** → Document topic IDs, token IDs, explorer links!
9. ❌ **Submitting after deadline** → Submit early!
10. ❌ **Multiple team members submitting** → Only one person submits!

---

## 📞 Need Help?

### Official Resources:
- **Discord**: [https://discord.gg/Cc9GgEnjDe](https://discord.gg/Cc9GgEnjDe)
  - Go to `#resources` channel for submission guide
  - Ask questions in `#general-chat`
- **Tutorial Video**: [Link to tutorial](#)
- **DoraHacks Platform**: [https://dorahacks.io](https://dorahacks.io)

### Before Asking:
1. Check the Discord `#resources` channel
2. Re-watch the tutorial video
3. Read this checklist again

---

## 🎯 Final Reminders

✅ **Deadline**: 31/10/2025 at 23:59 (Don't wait until the last minute!)

✅ **Quality over Quantity**: Better to have a polished core feature than a buggy feature-bloated app

✅ **Document Your Hedera Usage**: Judges want to see *how* and *why* you used Hedera

✅ **Tell a Story**: Your README should explain the *problem*, not just the tech

✅ **Test Everything**: Broken demos = lost points

---

## 🏆 You Got This!

Remember:
- You've built something meaningful
- Your code solves a real problem
- Hedera is the perfect fit for your solution
- The judges want you to succeed

**Now go submit and make Africa proud! 🚀🌍**

---

**Good luck from the ConfirmIT team! 🍀**

*Built with ❤️ for the Hedera Africa Hackathon 2025*
