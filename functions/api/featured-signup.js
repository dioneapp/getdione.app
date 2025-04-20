export async function onRequestPost(request, env) {
  const WEBHOOK_URL = env.FEATURED_DISCORD_WEBHOOK_URL;
  if (!WEBHOOK_URL) {
    return new Response(
      JSON.stringify({ error: `Webhook URL not configured. ENV: ${env}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  try {
    const formData = await request.formData();
    const trapField = formData.get('trap_field')?.toString() || '';
    if (trapField !== '') {
      return new Response(
        JSON.stringify({ error: 'Form submission rejected.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const toolName = formData.get('tool_name')?.toString() || '';
    const github = formData.get('github')?.toString() || '';
    const website = formData.get('website')?.toString() || '';
    const social = formData.get('social')?.toString() || '';
    const contactEmail = formData.get('contact_email')?.toString() || '';
    const objective = formData.get('objective')?.toString() || '';
    const category = formData.get('category')?.toString() || '';
    const audience = formData.get('audience')?.toString() || '';
    const metrics = formData.get('metrics')?.toString() || '';
    const tags = formData.get('tags')?.toString() || '';
    const testimonials = formData.get('testimonials')?.toString() || '';
    const reason = formData.get('reason')?.toString() || '';
    const financialInterest = formData.get('financial_interest')?.toString() || 'no';
    const updates = formData.get('updates')?.toString() || 'no';

    if (!name || !email || !toolName) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and tool name are required.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const webhookBody = {
      embeds: [
        {
          title: 'New Featured Tool Submission',
          color: 0xbcb1e7,
          fields: [
            { name: 'Submitter Name', value: name, inline: true },
            { name: 'Submitter Email', value: email, inline: true },
            { name: 'Tool Name', value: toolName, inline: true },
            { name: 'GitHub', value: github, inline: false },
            { name: 'Website', value: website, inline: false },
            { name: 'Social', value: social, inline: false },
            { name: 'Contact Email', value: contactEmail, inline: false },
            { name: 'Objective', value: objective, inline: false },
            { name: 'Category', value: category, inline: false },
            { name: 'Audience', value: audience, inline: false },
            { name: 'Metrics', value: metrics, inline: false },
            { name: 'Tags', value: tags, inline: false },
            { name: 'Testimonials', value: testimonials, inline: false },
            { name: 'Reason', value: reason, inline: false },
            { name: 'Financial Interest', value: financialInterest, inline: true },
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

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (e) {
    console.error('Form submission error:', e);
    return new Response(
      JSON.stringify({ error: 'There was an error submitting your application. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
