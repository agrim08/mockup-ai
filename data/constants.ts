import {
  Plane, 
  GraduationCap, 
  Wallet, 
  ShoppingCart, 
  ClipboardList, 
  UtensilsCrossed,
  Baby,
} from 'lucide-react'
import { themeToCssVars } from './Theme';

export const categories = [
  {
    name: 'Travel Planner App',
    description: 'Build a travel planner app that helps users plan trips, create itineraries, and manage bookings.',
    icon: Plane,
    color: 'indigo',
  },
  {
    name: 'AI Learning Platform',
    description: 'Build an AI-powered learning platform that personalizes courses and tracks user progress.',
    icon: GraduationCap,
    color: 'amber',
  },
  {
    name: 'Finance Tracker',
    description: 'Build a finance tracking app that monitors expenses, budgets, and savings goals.',
    icon: Wallet,
    color: 'slate',
  },
  {
    name: 'E-Commerce Store',
    description: 'Build an e-commerce store that allows users to browse products, add to cart, and checkout securely.',
    icon: ShoppingCart,
    color: 'blue',
  },
  {
    name: 'Smart To-Do Planner',
    description: 'Build a smart to-do planner that helps users organize tasks and improve productivity.',
    icon: ClipboardList,
    color: 'rose',
  },
  {
    name: 'Food Delivery App',
    description: 'Build a food delivery app that lets users order meals and track deliveries in real time.',
    icon: UtensilsCrossed,
    color: 'orange',
  },
  {
    name: 'Kids Learning...',
    description: 'Build a kids learning app with fun, interactive, and age-appropriate educational content.',
    icon: Baby,
    color: 'yellow',
  },
]


export const htmlWrapper = (themeObj: any, html: string | undefined) => {
  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- Google Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <!-- Tailwind + Iconify -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
  <style>
    ${themeToCssVars(themeObj)}
  </style>
</head>
<body class="bg-[var(--background)] text-[var(--foreground)] w-full">
  ${html ?? ""}
</body>
</html>
      `;
}