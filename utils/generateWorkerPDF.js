  const puppeteer = require('puppeteer');
  const Workforce = require('../models/workersForm.model');
  const path =  require('path')

  const generatePDF = async (req, res) => {
    try {
      const {
        fullName,
        gender,
        phoneNumber,
        DOB,
        capAddress,
        homeAddress,
        programme,
        level,
        saved,
        salvationStory,
        baptized,
        holySpiritbaptized,
        unit,
        reason,
        relationship,
        details
      } = req.body;

      if (!fullName) {
        return res.status(400).json({ message: 'Full name is missing' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Passport is required' });
      }

      const passportUrl = req.file.path;

      const payload = {
        ...req.body,
        passport: passportUrl
      };

      await Workforce.create(payload);

      const logoPath = path.join(__dirname, '..', '20251028_154814-removebg-preview.png')

      const html = `
        <html>
          <head>
            <style>
      body{
        width: 794px;
        min-height: 1123px;
        margin: 0 auto;
        padding: 0;
        background: white;
        font-family: Arial, sans-serif;
      }

      header{
        width: 100%;
        height: 260px;
        max-height: 250px;
        display: flex;
      }

      .div1{
        width: 30%;
        height: 120px;
        background: black;
        color: white;
        padding: 20px;
        border-bottom-right-radius: 90% 50%;
      }

      .div1 h3{
          font-size: 20px;
          font-weight: 900;
          -webkit-text-stroke: 1px rgb(233, 235, 231);
          font-family: Arial, Helvetica, sans-serif;
          margin-left: 30px;
          margin-bottom: -10px;
          margin-top: 20px;
      }

      .div1 p{
          font-size: 8px;
          width: 120px;
          margin-left: 30px;
      }

      .div2{
        width: 80%;
        height: 160px;
        background: rgb(6,171,248);
        border-bottom-left-radius: 90% 50%;
        position: relative;
        z-index: 3;
      }

      .div3{
        position: absolute;
        width: 70.5%;
        height: 120px;
        background: black;
        border-bottom-left-radius: 90% 50%;
        top: 0px;
        left: 40px;
        z-index: 5;
        display: flex;
        align-items: center;
        gap: 10px;
        color: white;
        padding-left: 120px;
      }

      .div3 img{
        width: 50px;
        height: 50px;
      }

      .div3 div{
        margin: 0;
        width: 150px;
      }

      .div3 div h2{
        margin: 0;
        font-size: 10px;
        font-weight: 700;
        text-shadow: 0px 2px 4px #ff3;
      }

      .div3 div p{
        margin: 3px 0;
        font-size: 8px;
      }

      main{
        padding: 25px;
        font-size: 14px;
        line-height: 1.3;
      }
      main img{
        width: 100px;
        height: 100px;
      }
      main p{
        margin: 8px 0;
      }

      footer{
        width: 100%;
        padding: 10px;
        margin-top: 20px;
        background: blue;
        text-align: center;
        color: white;
        font-size: 14px;
      }

      .dire{
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        font-size: 12px;
      }
    </style>
          </head>

  <body>
    <header>
      <div class="div1">
        <h3>Address:</h3>
        <p>Opp Micho Dollar, Oke Aro Oni, Ilesa, Osun State.</p>
      </div>

      <div class="div2">
        <div class="div3">
          <img src="file://${logoPath}">
          <div>
            <h2>THE REDEEMED CHRISTIAN FELLOWSHIP</h2>
            <p>UNIVERSITY OF ILESA</p>
          </div>
        </div>
      </div>
    </header>

    <main>
      <h3 style="text-align:center; margin-bottom:15px;">WORKERS APPLICATION FORM</h3>

      <img src="${passportUrl}" class="passport" />
      <p>1. <strong>NAME: </strong> ${fullName}</p>
      <p>2. <strong>SEX: </strong> ${gender}</p>
      <p>3. <strong>PHONE NUMBER: </strong> ${phoneNumber}</p>
      <p>4. <strong>DATE OF BIRTH: </strong> ${DOB}</p>
      <p>5. <strong>ADDRESS (CAMPUS): </strong> ${capAddress}</p>
      <p>6. <strong>ADDRESS (HOME): </strong> ${homeAddress}</p>
      <p>7. <strong>PROGRAMME (DEGREE): </strong> ${programme}</p>
      <p>8. <strong>LEVEL: </strong> ${level}</p>
      <p>9. <strong>ARE YOU SAVED, IF YES WHEN: </strong> ${saved}</p>
      <p>10. <strong>TESTIMONY OF SALVATION: </strong> ${salvationStory}</p>
      <p>11. <strong>WATER BAPTISM: </strong> ${baptized}</p>
      <p>12. <strong>HOLY SPIRIT BAPTISM: </strong> ${holySpiritbaptized}</p>
      <p>13. <strong>PREFERRED UNIT: </strong> ${unit}</p>
      <p>14. <strong>REASON: </strong> ${reason}</p>
      <p>15. <strong>RELATIONSHIP STATUS: </strong> ${relationship}</p>
      <p><strong>DETAILS: </strong> ${details}</p>

      <p style="text-align:center; margin-top:20px;">
        <strong>DECLARATION:</strong>
        I <span>${fullName}</span>
        state that the information above is true and I agree to comply with the rules of the Redeemed Christian Fellowship, Unilesa, Ilesa.
      </p>

      <div class="dire">
        <div>PASTOR E. A. ADEBOYE PRESIDENT</div>
        <div>PASTOR E. A. ODEYEMI VP ADMIN, EVANGELISM</div>
      </div>
    </main>

    <footer>
      THE ARM OF CHRIST REDEEMER MINISTRIES  
      Aggressive Evangelism
    </footer>

  </body>
        </html>
      `;

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true
      });

      await browser.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${fullName}-workform-application.pdf`
      });

      res.send(pdfBuffer);

    } catch (err) {
      console.log('PDF ERROR:', err);
      res.status(500).json({ message: err.message });
    }
  };

  module.exports = generatePDF;