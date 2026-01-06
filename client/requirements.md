## Packages
framer-motion | Smooth transitions between quiz questions and page load animations
canvas-confetti | Celebration effect when quiz is completed with a high score
@types/canvas-confetti | TypeScript definitions for confetti

## Notes
Static images are located in @assets/ directory as per instructions.
Backend expects POST /api/quiz with { answers: object, score: number }.
Questions 6 and 7 are survey questions (multiple select) and do not contribute to the "correct/incorrect" score but are saved in the answers JSON.
