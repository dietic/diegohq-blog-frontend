# Content Strategy

This document outlines how to create and structure journal entries to fit the gamified system.

## 1. Content Pillars

All journal entries should fall into one or more of these core categories:

1.  **Programming:** Technical tutorials, language deep-dives, algorithm explanations, project walkthroughs.
2.  **Growth & Career:** Productivity advice, learning methodologies, career path guidance, interview preparation.
3.  **The SaaS Journey:** Personal updates on the author's journey building a SaaS product. This includes progress reports, challenges, lessons learned, and reflections.

## 2. Integrating Content with Gameplay

For the system to feel cohesive, content creation must be planned with the game mechanics in mind from the start. When writing a new post, define its gameplay properties.

### The Post-Creation Checklist:

-   **[ ] Title:** A clear, descriptive title.
-   **[ ] Content Pillar:** Which category does it belong to?
-   **[ ] Target Level:** Is this beginner, intermediate, or advanced content?
    -   **Is it Level-Gated?** If yes, what is the `requiredLevel`? (e.g., LVL 5).
-   **[ ] Is it Item-Gated?**
    -   If yes, what is the `requiredItem`? (e.g., `item_id: 'css_flexbox_manual'`).
    -   What is the "challenge text" that the user sees? (e.g., "The ancient layout scrolls are written in a cryptic language.").
-   **[ ] Does it have a Quest?**
    -   If yes, what is the quest prompt and type (e.g., multiple choice)?
    -   What are the rewards (`xpReward` and optional `itemReward`)?

## 3. Example Content Flow

This demonstrates how a user might progress through a series of related posts.

---

#### **Post 1: "Intro to Git: Your First Commit"**

-   **Level Requirement:** 1 (Available from start)
-   **Gating:** None
-   **Quest:** "The First Chronicler"
    -   **Prompt:** What is the command to save your changes to your local repository? (`git commit -m "message"`)
    -   **Reward:** `+40 XP`, `item: 'Map_to_the_Cloud_Kingdom'`

---

#### **Post 2: "Understanding GitHub: Pushing to the Cloud"**

-   **Level Requirement:** 2
-   **Gating:** Requires `item: 'Map_to_the_Cloud_Kingdom'`
-   **Challenge Text:** "A dense fog covers the path to the Cloud Kingdom. You need a map to find your way."
-   **Quest:** "Cloud Ascendant"
    -   **Prompt:** Which command sends your local commits to your remote repository on GitHub? (`git push`)
    -   **Reward:** `+50 XP`, `item: 'Collaboration_Pendant'`

---

#### **Post 3: "Teamwork Makes the Dream Work: An Intro to Pull Requests"**

-   **Level Requirement:** 4
-   **Gating:** Requires `item: 'Collaboration_Pendant'`
-   **Challenge Text:** "The Guardian of the Code Citadel will only grant audience to those who bear the Collaboration Pendant."
-   **Quest:** None
-   **Reward:** `+10 XP` (for reading)

---

This structure creates a natural learning path where fundamental concepts unlock the ability to engage with more advanced topics, turning the learning process itself into a journey of discovery.
