const ADMIN_EMAIL = "hello@theexpressionmusic.com";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
const MAX_FILE_BYTES = 4 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ORDER_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    return res.status(503).json({ error: "Order email service is not configured yet. Please contact the shop team." });
  }

  try {
    const { orderRef, customer, items, total, proof } = req.body || {};
    if (!orderRef || !customer?.name || !customer?.email || !customer?.address || !customer?.postcode ||
        !Array.isArray(items) || items.length < 1 || !Number.isFinite(total) ||
        !proof?.name || !ALLOWED_TYPES.has(proof.type) || !proof.base64) {
      return res.status(400).json({ error: "Please complete all required details and attach a JPG, PNG or PDF proof of payment." });
    }

    const cleanName = String(customer.name).slice(0, 120);
    const cleanEmail = String(customer.email).slice(0, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    const buffer = Buffer.from(proof.base64, "base64");
    if (!buffer.length || buffer.length > MAX_FILE_BYTES) {
      return res.status(400).json({ error: "Proof of payment must be no larger than 4 MB." });
    }
    const safeFilename = String(proof.name).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    const orderLines = items.map(item => {
      const qty = Math.max(1, Math.min(99, Number(item.qty) || 1));
      const unitPrice = 25;
      return `${String(item.name).slice(0, 100)} — ${String(item.color).slice(0, 40)}, size ${String(item.size).slice(0, 8)} × ${qty}: £${(qty * unitPrice).toFixed(2)}`;
    });
    const verifiedTotal = items.reduce((sum, item) => sum + Math.max(1, Math.min(99, Number(item.qty) || 1)) * 25, 0);
    const lines = orderLines.join("\n");
    const notes = String(customer.notes || "").slice(0, 1000);
    const address = `${String(customer.address).slice(0, 500)}, ${String(customer.postcode).slice(0, 30)}`;
    const paymentDetails = "THE EXPRESSION MUSIC INTERNATIONAL\nSort code: 08-71-99\nAccount number: 15206046";

    const send = async (payload) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Email provider rejected the request.");
      return result;
    };

    await send({
      from: fromEmail,
      to: [ADMIN_EMAIL],
      subject: `New merchandise order ${orderRef} — £${verifiedTotal.toFixed(2)}`,
      text: `A merchandise order has been submitted. Payment is NOT verified yet.\n\nOrder: ${orderRef}\nCustomer: ${cleanName}\nEmail: ${cleanEmail}\nDelivery address: ${address}\nPhone/contact notes: ${notes || "None"}\n\nItems:\n${lines}\n\nTotal: £${verifiedTotal.toFixed(2)}\n\nBank transfer details:\n${paymentDetails}\n\nProof of payment is attached. Please verify funds in the bank before confirming fulfilment.`,
      attachments: [{ filename: safeFilename, content: buffer.toString("base64") }]
    });

    await send({
      from: fromEmail,
      to: [cleanEmail],
      subject: `We received your Expression Music order ${orderRef}`,
      text: `Hello ${cleanName},\n\nThank you for your order with The Expression Music International. We have received your order details and proof of payment.\n\nOrder reference: ${orderRef}\n\nItems:\n${lines}\n\nTotal: £${verifiedTotal.toFixed(2)}\n\nYour order is awaiting payment verification. Sending proof does not mean that the bank transfer has cleared. Our team will check the payment and contact you when it has been verified.\n\nThank you,\nThe Expression Music International\nhello@theexpressionmusic.com`
    });

    return res.status(200).json({ ok: true, orderRef });
  } catch (error) {
    console.error("Order submission failed:", error);
    return res.status(502).json({ error: "We could not send the order emails. Please try again shortly or contact hello@theexpressionmusic.com." });
  }
}
