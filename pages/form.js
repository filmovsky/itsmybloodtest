import { useState, useEffect } from 'react';

export default function FormPage() {
  const [orderId, setOrderId] = useState(19730109);
  const [allFiles, setAllFiles] = useState([]);

  useEffect(() => {
    // Możesz wygenerować lub pobierać orderId dynamicznie, tutaj stała wartość
    setOrderId(19730109);
  }, []);

  async function getPaymentLink(testName) {
    const res = await fetch('/api/getPaymentLink?test=' + encodeURIComponent(testName));
    if (!res.ok) {
      alert("No payment link available for the selected test.");
      return null;
    }
    const data = await res.json();
    return data.link;
  }

  async function redirectToPayment(testName) {
    const form = document.getElementById('orderForm');
    if (!form.reportValidity()) {
      alert("Please complete the form before proceeding to payment.");
      return;
    }

    const url = await getPaymentLink(testName);
    if (url) {
      window.location.href = url;
    } else {
      alert("No payment link available for the selected test.");
    }
  }

  function handlePayNow() {
    const form = document.getElementById('orderForm');
    if (!form.reportValidity()) {
      alert("Please complete all required fields before proceeding to payment.");
      return;
    }

    const selectedTest = document.querySelector('input[name="tests"]:checked');
    if (selectedTest) {
      redirectToPayment(selectedTest.value);
    } else {
      alert("Please select a test before proceeding to payment.");
    }
  }

  function validateFiles(event) {
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const fileInput = event.target;
    const newFiles = Array.from(fileInput.files);

    for (let file of newFiles) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        alert(`Unsupported file format: ${file.name}`);
        fileInput.value = '';
        return;
      }
    }

    setAllFiles(prev => [...prev, ...newFiles]);
    fileInput.value = '';
  }

  function renderFileList() {
    return (
      <ul>
        {allFiles.map((file, index) => (
          <li key={index}>
            {file.name} ({(file.size / 1024).toFixed(2)} KB){" "}
            <button type="button" onClick={() => removeFile(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    );
  }

  function removeFile(index) {
    setAllFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://js.stripe.com/v3/"></script>
        <script src="https://cdn.jsdelivr.net/npm/tesseract.js@2.1.1/dist/tesseract.min.js"></script>
        <style>{`
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
          }

          .services-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            padding: 30px;
          }

          .service-item {
            cursor: pointer;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: black;
          }

          .service-item:nth-child(1) { background-color: #ff9999; }
          .service-item:nth-child(2) { background-color: #99ccff; }
          .service-item:nth-child(3) { background-color: #ffff99; }
          .service-item:nth-child(4) { background-color: #99ff99; }
          .service-item:nth-child(5) { background-color: #ffcc99; }
          .service-item:nth-child(6) { background-color: #cc99ff; }
          .service-item:nth-child(7) { background-color: #ff6666; }
          .service-item:nth-child(8) { background-color: #66b3ff; }
          .service-item:nth-child(9) { background-color: #ffeb99; }
          .service-item:nth-child(10) { background-color: #b3ff66; }
          .service-item:nth-child(11) { background-color: #ffb366; font-size: 14px; }
          .service-item:nth-child(12) { background-color: #c299ff; }

          .form-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 50px;
            background-color: #fff;
          }

          form {
            width: 100%;
            max-width: 600px;
            padding: 30px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }

          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }

          input[type="text"], input[type="email"], input[type="number"], select, textarea {
            width: calc(100% - 20px);
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          textarea {
            resize: vertical;
            height: 100px;
          }

          input:disabled, select:disabled {
            background-color: #e9e9e9;
            cursor: not-allowed;
          }

          .checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            padding-bottom: 20px;
          }

          .checkbox-group label {
            display: flex;
            align-items: center;
            width: calc(50% - 10px);
          }

          input[type="radio"] {
            margin-right: 10px;
          }

          .button-container {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 20px;
          }

          button {
            flex: 1;
            padding: 15px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }

          button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }

          button:hover:not(:disabled) {
            background-color: #0056b3;
          }

          .file-upload {
            margin-top: 30px;
            margin-bottom: 20px;
          }

          #order-id-display {
            font-weight: bold;
            color: #007bff;
            margin-bottom: 20px;
          }

          .disclaimer {
            background: #f0f0f0;
            padding: 15px;
            margin-top: 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
          }

          .disclaimer p {
            margin: 0;
          }

          .disclaimer input[type="checkbox"] {
            margin-right: 5px;
          }
        `}</style>
      </head>
      <body>
        <div className="services-container">
          <div className="service-item" onClick={() => redirectToPayment('Complete Blood Count')} title="A CBC measures red and white blood cells, platelets, hemoglobin, and hematocrit levels.">Complete Blood Count (CBC)</div>
          <div className="service-item" onClick={() => redirectToPayment('Thyroid Panel')} title="Thyroid panel tests measure levels of hormones that control metabolism and energy balance.">Thyroid Panel</div>
          <div className="service-item" onClick={() => redirectToPayment('Vitamins and Minerals')} title="Tests for vitamins and minerals to check for deficiencies affecting overall health.">Vitamins and Minerals</div>
          <div className="service-item" onClick={() => redirectToPayment('Hormonal Tests')} title="Hormonal tests evaluate hormone levels that regulate various bodily functions.">Hormonal Tests</div>
          <div className="service-item" onClick={() => redirectToPayment('Lipid Panel')} title="A lipid panel measures cholesterol and triglycerides to assess heart disease risk.">Lipid Panel</div>
          <div className="service-item" onClick={() => redirectToPayment('Liver Tests')} title="Liver function tests assess enzymes and proteins to check liver health.">Liver Tests</div>
          <div className="service-item" onClick={() => redirectToPayment('Kidney Panel')} title="Kidney tests evaluate how well your kidneys are functioning.">Kidney Panel</div>
          <div className="service-item" onClick={() => redirectToPayment('Diabetes Panel')} title="Diabetes panel includes glucose and HbA1c tests to monitor blood sugar control.">Diabetes Panel</div>
          <div className="service-item" onClick={() => redirectToPayment('Heart Panel')} title="Heart panel tests assess markers related to cardiovascular health.">Heart Panel</div>
          <div className="service-item" onClick={() => redirectToPayment('Urine Test')} title="Urine analysis checks for various substances in the urine to detect health issues.">Urine Test</div>
          <div className="service-item" onClick={() => redirectToPayment('Blood Coagulation Profile')} title="Coagulation tests determine how well your blood clots.">Blood Coagulation Profile</div>
          <div className="service-item" onClick={() => redirectToPayment('Immunoglobulins')} title="Tests measuring immunoglobulins to check immune system health.">Immunoglobulins</div>
        </div>

        <div className="form-container">
          <form id="orderForm">
            <div id="order-id-display">Order Number: <span id="orderId">{orderId}</span></div>

            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" required>
              <option value="" disabled selected>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" min="0" required />

            <label htmlFor="height">Height (cm):</label>
            <input type="number" id="height" name="height" min="0" required />

            <label htmlFor="weight">Weight (kg):</label>
            <input type="number" id="weight" name="weight" min="0" required />

            <label>Select one test to describe:</label>
            <div className="checkbox-group" id="checkboxGroup">
              <label><input type="radio" name="tests" value="Complete Blood Count" /> Complete Blood Count</label>
              <label><input type="radio" name="tests" value="Thyroid Panel" /> Thyroid Panel</label>
              <label><input type="radio" name="tests" value="Vitamins and Minerals" /> Vitamins and Minerals</label>
              <label><input type="radio" name="tests" value="Hormonal Tests" /> Hormonal Tests</label>
              <label><input type="radio" name="tests" value="Lipid Panel" /> Lipid Panel</label>
              <label><input type="radio" name="tests" value="Liver Tests" /> Liver Tests</label>
              <label><input type="radio" name="tests" value="Kidney Panel" /> Kidney Panel</label>
              <label><input type="radio" name="tests" value="Diabetes Panel" /> Diabetes Panel</label>
              <label><input type="radio" name="tests" value="Heart Panel" /> Heart Panel</label>
              <label><input type="radio" name="tests" value="Urine Test" /> Urine Test</label>
              <label><input type="radio" name="tests" value="Blood Coagulation Profile" /> Blood Coagulation Profile</label>
              <label><input type="radio" name="tests" value="Immunoglobulins" /> Immunoglobulins</label>
            </div>

            <label htmlFor="comments">Additional Information (maximum 1500 characters):</label>
            <textarea id="comments" name="comments" maxLength="1500" placeholder="Enter additional information that may be useful."></textarea>

            <label htmlFor="file">Attach Files</label>
            <input type="file" id="file" name="file[]" className="file-upload" multiple onChange={validateFiles} />
            <div id="fileList">{renderFileList()}</div>

            <div className="disclaimer">
              <p><strong>Note:</strong> The interpretation of your test results is fully automatic and based on AI algorithms. The information is educational and supportive, and does not substitute professional medical advice. Before making any health decisions, please consult a qualified healthcare professional.</p>
              <label>
                <input type="checkbox" id="acceptDisclaimer" required /> I understand that the interpretation is educational and that I should consult a healthcare professional.
              </label>
            </div>

            <div className="button-container">
              <button type="button" id="checkout-button" onClick={handlePayNow}>Pay Now</button>
            </div>
          </form>
        </div>
      </body>
    </html>
  );
}
