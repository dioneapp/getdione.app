export async function onRequestPost(context: { request: Request; env: Record<string, string> }) {
  const { request, env } = context;
  const WEBHOOK_URL = env.BETA_DISCORD_WEBHOOK_URL;
  if (!WEBHOOK_URL) {
    return new Response(JSON.stringify({ error: 'Webhook URL not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
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
            { name: 'Reason', value: reason, inline: false },
            { name: 'OS', value: os, inline: true },
            { name: 'Role', value: role, inline: true },
            { name: 'Experience', value: experience, inline: false },
            { name: 'Usage', value: usage, inline: false },
            { name: 'Wants Updates', value: updates, inline: true }
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
}
