import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const WEBHOOK_URL = import.meta.env.BETA_DISCORD_WEBHOOK_URL;
  try {
    const formData = await request.formData();
    const trapField = formData.get('trap_field')?.toString() || '';
    if (trapField !== '') {
      return new Response(JSON.stringify({ error: 'Form submission rejected.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const reason = formData.get('reason')?.toString() || '';
    const os = formData.get('os')?.toString() || '';
    const role = formData.get('role')?.toString() || '';
    const experience = formData.get('experience')?.toString() || '';
    const usage = formData.get('usage')?.toString() || '';
    const updates = formData.get('updates')?.toString() || 'no';

    if (!name || !email || !os || !role || !experience || !usage) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const webhookBody = {
      embeds: [
        {
          title: 'New Beta Program Signup',
          color: 0xbcb1e7,
          fields: [
            { name: 'Name', value: name, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'Operating System', value: os, inline: true },
            { name: 'Role', value: role, inline: true },
            { name: 'AI Experience', value: experience, inline: true },
            { name: 'Intended Usage', value: usage, inline: true },
            { name: 'Newsletter Signup', value: updates === 'yes' ? 'Subscribed' : 'Not subscribed', inline: true },
            { name: 'Reason for Interest', value: reason },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookBody),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.statusText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Form submission error:', e);
    return new Response(JSON.stringify({ error: 'There was an error submitting your application. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
