export function copyTextToClipboard(text: string) {
  const input: HTMLInputElement = document.createElement('input');

  // Input text and append to body
  input.value = text;
  document.body.appendChild(input);

  // Select the text field
  input.select();
  input.setSelectionRange(0, 99999); // For mobile devices

  // Copy
  let copied;

  try {
    document.execCommand('copy');
    copied = true;
  } catch (err) {
    console.error('Error on copy text to clipboard:', err);
    copied = false;
  }

  // Remove from body
  document.body.removeChild(input);

  return copied;
}
