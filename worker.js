export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      const payload = await request.json();
      const page = payload.page || '/';
      const referrer = payload.referrer || 'Direct / unknown';
      const userAgent = payload.userAgent || 'Not provided';
      const city = payload.city || 'Not provided';
      const country = payload.country || 'Not provided';
      const sessionKey = payload.sessionKey || 'not-provided';

      const apiKey = env.RESEND_API_KEY;
      const fromEmail = env.RESEND_FROM || 'no-reply@antoniaslearningandbeautycentre.com';

      if (!apiKey) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Resend API key missing. Add RESEND_API_KEY in Cloudflare Worker settings.'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const emailBody = {
        from: fromEmail,
        to: [
          'antoniaslearningbeautycentre@gmail.com',
          'tashpreston2002@gmail.com'
        ],
        subject: 'Antonias Learning & Beauty Centre – New website visitor',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937; line-height: 1.6;">
            <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
              <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 24px;">New website visitor</h2>
              <p style="margin: 0 0 16px; color: #374151;">
                A new visitor has just arrived at Antonias Learning & Beauty Centre.
              </p>

              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px;">
                <p style="margin: 0 0 8px;"><strong>Page:</strong> ${page}</p>
                <p style="margin: 0 0 8px;"><strong>Referrer:</strong> ${referrer}</p>
                <p style="margin: 0 0 8px;"><strong>Location:</strong> ${city}, ${country}</p>
                <p style="margin: 0;"><strong>Visitor:</strong> ${userAgent}</p>
              </div>

              <p style="margin: 16px 0 0; color: #4b5563; font-size: 12px;">
                Visit ID: ${sessionKey}
              </p>
            </div>
          </div>
        `,
        text: `Antonias Learning & Beauty Centre – New website visitor\n\nA new visitor has just arrived at your website.\n\nPage: ${page}\nReferrer: ${referrer}\nLocation: ${city}, ${country}\nVisitor: ${userAgent}\nVisit ID: ${sessionKey}`
      };

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailBody)
      });

      const resendResult = await resendResponse.text();

      if (!resendResponse.ok) {
        return new Response(JSON.stringify({
          success: false,
          error: resendResult
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Website visit notification sent.'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: String(error)
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
