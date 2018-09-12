function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  return !match ? null : "(" + match[1] + ") " + match[2] + "-" + match[3];
}

export { formatPhoneNumber };
