import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	quote: async ({ request }) => {
		if (process.env.NODE_ENV !== 'production' && !process.env.WHATSAPP_NUMBER) {
			console.warn(
				'[GEM] WHATSAPP_NUMBER is not set — using placeholder number.\n' +
					'      Copy .env.example to .env.local and set your real number.'
			);
		}

		const data = await request.formData();

		const name = (data.get('name') as string | null)?.trim() ?? '';
		const phone = (data.get('phone') as string | null)?.trim() ?? '';
		const problemType = (data.get('problemType') as string | null)?.trim() ?? '';
		const message = (data.get('message') as string | null)?.trim() ?? '';

		// ── Validation ─────────────────────────────────────────────────
		if (!name || !phone || !problemType) {
			return fail(422, {
				error: 'Bitte füllen Sie alle Pflichtfelder aus (Name, Telefon, Problem-Typ).'
			});
		}

		const rawPhone = phone.replace(/[\s\-()+]/g, '');
		if (rawPhone.length < 6) {
			return fail(422, {
				error: 'Bitte geben Sie eine gültige Telefonnummer ein.'
			});
		}

		// ── Email pipeline stub (Resend) ───────────────────────────────
		// Uncomment and configure when an email provider is available.
		//
		// import { Resend } from 'resend';
		// const resend = new Resend(process.env.RESEND_API_KEY);
		// await resend.emails.send({
		//   from: 'anfrage@muster-handwerk.de',
		//   to: process.env.NOTIFICATION_EMAIL ?? 'info@muster-handwerk.de',
		//   subject: `Neue Anfrage: ${problemType} von ${name}`,
		//   html: `
		//     <h2>Neue Kundenanfrage</h2>
		//     <p><strong>Name:</strong> ${name}</p>
		//     <p><strong>Telefon:</strong> ${phone}</p>
		//     <p><strong>Problem:</strong> ${problemType}</p>
		//     ${message ? `<p><strong>Nachricht:</strong> ${message}</p>` : ''}
		//   `
		// });

		// ── WhatsApp redirect ──────────────────────────────────────────
		// Read whatsapp target from env — fallback to placeholder
		const targetNumber = process.env.WHATSAPP_NUMBER ?? '490000000000';
		const waMessage = [
			`Hallo, ich habe folgendes Problem: *${problemType}*.`,
			message ? `\n${message}` : '',
			`\n\nMein Name ist ${name}. Bitte rufen Sie mich schnellstmöglich unter ${phone} an.`
		].join('');

		throw redirect(303, `https://wa.me/${targetNumber}?text=${encodeURIComponent(waMessage)}`);
	}
};
