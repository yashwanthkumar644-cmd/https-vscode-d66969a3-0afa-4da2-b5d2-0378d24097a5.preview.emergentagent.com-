export function formatAmount(amount, currencySymbol) {
  const n = Number(amount) || 0;
  return `${currencySymbol}${n.toLocaleString('en-IN')}`;
}

export function buildPaymentMessage({ client, settings }) {
  const { name, dealAmount, collectedPayment, remainingPayment } = client;
  const { businessName, currencySymbol } = settings;

  const statusLine =
    remainingPayment > 0
      ? `Kindly clear the remaining balance at your earliest convenience.`
      : `Your payment is fully settled. Thank you!`;

  return [
    `Hi ${name || 'there'},`,
    ``,
    `Thank you for your business with ${businessName}!`,
    ``,
    `Payment Summary:`,
    `- Deal Amount: ${formatAmount(dealAmount, currencySymbol)}`,
    `- Amount Received: ${formatAmount(collectedPayment, currencySymbol)}`,
    `- Balance Due: ${formatAmount(remainingPayment, currencySymbol)}`,
    ``,
    statusLine,
    ``,
    `Best regards,`,
    businessName,
  ].join('\n');
}

export function buildEmailSubject({ client, settings }) {
  const remaining = Number(client.remainingPayment) || 0;
  return remaining > 0
    ? `Payment Reminder - ${settings.businessName}`
    : `Payment Confirmation - ${settings.businessName}`;
}
