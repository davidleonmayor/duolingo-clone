"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/db/queries";

const returnUrl = absoluteUrl("/shop");

/**
 * Creates a Stripe URL for billing portal or subscription checkout.
 *
 * @returns {Promise<{ data: string }>} - An object containing the Stripe URL.
 * @throws {Error} - Throws an error if the user is not authenticated.
 */
export const createStripeUrl = async () => {
  // Authenticate the user
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) {
    throw new Error("User not authenticated");
  }

  // If the user has a subscription with a Stripe customer ID, create a billing portal session
  const userSubscription = await getUserSubscription();
  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl,
    });

    return { data: stripeSession.url };
  }

  // Create a new checkout session for subscription if no subscription exists
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: "Lingo Pro",
            description: "Unlimited Hearts",
          },
          unit_amount: 2000, // $20.00 USD
          recurring: { interval: "month" },
        },
      },
    ],
    metadata: { userId },
    success_url: returnUrl,
    cancel_url: returnUrl,
  });

  return { data: stripeSession.url };
};
