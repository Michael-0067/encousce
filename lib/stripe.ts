import Stripe from "stripe";

// apiVersion is tied to the installed stripe package version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
