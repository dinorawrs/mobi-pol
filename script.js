const display = document.getElementById("display");
const username = document.getElementById("username");
const date = document.getElementById("date");
const address = document.getElementById("address");
const preview = document.getElementById("preview");

const validStreets = [
  "ACADEMY PL", "VALLEY DRIVE", "FAIRFAX ROAD", "RIVERSIDE DRIVE", "FRANKLIN COURT",
  "PINEVIEW CIRCLE", "EMERSON RD", "COLONIAL DRIVE", "VINE STREET", "MEDICAL WAY",
  "ORCHARD BOULEVARD", "GEORGIA AVENUE", "FREEDOM AVENUE", "HIGHWAY 55",
  "SPRING CREEK RD", "LAKEVIEW COURT", "MAPLE STREET", "CEDAR STREET",
  "OAK VALLEY DRIVE", "TERRACE DRIVE", "GRANT ST", "ELM STREET", "INDUSTRIAL ROAD", "GIBSON LANE"
];

const validAddresses = [
  "7001", "7002", "7041", "7042", "7043", "7044", "7051", "7052", "7053", "7054", "7055", "7056", "7061", "7062", "7064",
  "7011", "7012", "7013", "7021", "7022", "7023", "421", "4051", "4052", "4053", "4054", "4055", "4056",
  "4061", "4071", "4031", "4041", "5021", "5022", "5023", "5024", "5031", "5032", "5041", "5042", "5043", "5044",
  "5051", "5052", "5053", "5054", "5055", "5061", "5062", "5063", "6001", "6021", "1081", "1082", "1101", "1102",
  "1103", "1104", "1105", "1106", "1107", "1108", "1109", "1111", "1112", "1201", "1202", "1203", "1204", "1205", "1206"
];

// Image paste and OCR
async function handlePaste() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      if (item.types.includes("image/png")) {
        const blob = await item.getType("image/png");
        const url = URL.createObjectURL(blob);
        preview.src = url;
        preview.style.display = "block";

        const { data: { text } } = await Tesseract.recognize(blob, 'eng');
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

        for (const line of lines) {
          const clean = line.toUpperCase().replace(/[^A-Z0-9@\/ ]/g, '');

          if (!display.value && clean.startsWith('@')) {
            display.value = clean.split(' ')[0];
          }

          if (!username.value && /^[a-zA-Z0-9]+$/.test(line) && !line.startsWith('@')) {
            username.value = line;
          }

          if (!date.value) {
            const dateMatch = line.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/);
            if (dateMatch) {
              const digitsOnly = dateMatch[0].replace(/\//g, '');
              date.value = `${digitsOnly}`;
            }
          }

          if (!address.value) {
            const numberMatch = validAddresses.find(n => clean.includes(n));
            const streetMatch = validStreets.find(s => clean.includes(s));
            if (numberMatch && streetMatch) {
              address.value = `${numberMatch} ${streetMatch}`;
            }
          }
        }
      }
    }
  } catch (err) {
    alert("⚠️ Unable to read from clipboard. Make sure you've copied an imag
