# Time Capsule

i made a new tab page. i got tired of the default chrome new tab so i thought why not make my own. it has a clock, tasks, quick links, and my favorite part - time capsules where you can leave messages for your future self.

![Time Capsule Preview](PREIVEIW.png)

## what it does

- big clock and date at the top
- search bar that opens fake results in a tab
- quick links to github, youtube, hack club, vercel (and you can add your own)
- a task list for keeping track of stuff you need to do
- time capsules - write a message, set a future date, and it locks until then
- dark/light theme toggle
- everything saves to localStorage so its still there when you come back

## time capsules

this is the main thing i wanted to build. you write a message, pick a date in the future, and seal it. it shows up as "sealed" on the dashboard and you cant open it until the date arrives. once it unlocks you can click it to read what you wrote. its kinda cool seeing old messages from past you.

i store everything in localStorage so nothing gets lost. the page checks every second if any capsules have unlocked.

## the fake browser thing

when you click on the quick links they dont take you to the real website. instead they open in a little browser i built inside the page. it has tabs and everything.

you can open github, youtube, hack club, and vercel as fake pages. they look similar to the real thing but theyre just simplified versions made with html and css. you can also open new tabs and search from inside them.

i did this because i wanted the links to feel integrated into the app instead of just being shortcuts that take you away.

## how i built it

just html, css, and javascript. no frameworks no build tools nothing. i wanted to keep it simple and learn vanilla js properly.

- the clock uses setInterval to update every second
- tasks and capsules are stored in localStorage as JSON
- the browser tab system manages its own state with an object that tracks each tab
- the fake pages are just big html strings that get injected into the page
- themes work by swapping CSS custom properties with javascript

## what was tricky

the hardest part was the browser tab system. getting tabs to open, close, switch between them, and go back to home took a lot of trial and error. the fake search was also fun - it just generates some fake results based on whatever you type.

making it responsive was a pain too. the browser pages look really different on mobile so i had to hide sidebars and rearrange things for smaller screens.

## built for

Hack Club Stardance

[Live Demo](https://timecapsule-rho.vercel.app/)
