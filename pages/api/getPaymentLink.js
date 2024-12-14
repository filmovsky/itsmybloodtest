export default function handler(req, res) {
  const { test } = req.query;

  if (!test) {
    return res.status(400).json({ message: 'Missing test parameter.' });
  }

  // Generujemy nazwę zmiennej na podstawie testu, np. "Complete Blood Count" -> "COMPLETE_BLOOD_COUNT"
  const envVarName = 'STRIPE_LINK_' + test.replace(/\s+/g, '_').toUpperCase();
  const link = process.env[envVarName];

  if (!link) {
    return res.status(404).json({ message: 'No payment link found for the selected test.' });
  }

  return res.status(200).json({ link });
}
